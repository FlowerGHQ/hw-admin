<template>
<div id="ItemDetail">
    <div class="list-container">
        <a-spin :spinning="loading" class='loading-incontent' v-if="loading"></a-spin>
        <div class="title-container">
            <div class="title-area">商品详情</div>
            <div class="btns-area">
                <a-button type="primary" ghost @click="routerChange('edit')"><i class="icon i_edit"/>编辑</a-button>
                <a-button danger @click="handleDelete()"><i class="icon i_delete"/>删除</a-button>
            </div>
        </div>
        <ItemHeader :detail='detail' :showSpec='indep_flag ? true : false'/>
        <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
            <template #expandIcon ><i class="icon i_expan_l"/> </template>
            <a-collapse-panel key="itemInfo" header="详情信息" class="gray-collapse-panel">
                <a-row class="panel-content info-container">
                    <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                        <div class="info-item">
                            <div class="key">商品编码</div>
                            <div class="value">{{detail.code || '-'}}</div>
                        </div>
                        <div class="info-item">
                            <div class="key">商品分类</div>
                            <div class="value">{{detail.category ? detail.category.name : '-'}}</div>
                        </div>
                        <div class="info-item">
                            <div class="key">标准售价</div>
                            <div class="value">￥{{$Util.countFilter(detail.price)}}</div>
                        </div>
                        <div class="info-item">
                            <div class="key">成本价格</div>
                            <div class="value">￥{{$Util.countFilter(detail.original_price)}}</div>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :lg='12' :xl='16' :xxl='18' class="info-block">
                        <template v-for="(item, index) of config" :key="index">
                            <a-col :xs='24' :sm='24' :lg='12' :xl='12' :xxl='8' class="info-item"
                                :class="item.type" v-if="item.value">
                                <div class="key">{{item.name}}</div>
                                <div class="value" v-if="item.type == 'rich_text'" v-html='item.value'></div>
                                <div class="value" v-else>{{item.value || '-'}}</div>
                            </a-col>
                        </template>
                    </a-col>
                </a-row>
            </a-collapse-panel>
            <a-collapse-panel key="itemSpec" header="规格列表" class="gray-collapse-panel" v-if="detail.set_id && !this.indep_flag">
                <div class="panel-content table-container no-mg">
                    <a-table :columns="specificColumns" :data-source="specific.data" :scroll="{ x: true }"
                        :row-key="record => record.id" :pagination='false'>
                        <template #bodyCell="{ column, text, record, index }">
                            <template v-if="column.key === 'item'">
                                {{text || ''}}
                            </template>
                            <template v-if="column.key === 'money'">
                                ￥{{$Util.countFilter(text)}}
                            </template>
                            <template v-if="column.dataIndex === 'flag_independent_info'">
                                <template v-if="index === 0">
                                    <a-tooltip title="在商品展示时为默认商品">
                                        默认 <i class="icon i_hint" style="font-size: 12px;"/>
                                    </a-tooltip>
                                </template>
                                <template v-else>
                                    <a-switch v-model:checked="record.flag_independent_info" @change='handleIndepChange(record)'/>
                                </template>
                            </template>

                            <template v-if="column.key === 'operation'">
                                <template v-if="record.flag_independent_info">
                                    <a-button type="link" @click="routerChange('edit-indep', record)"><i class="icon i_edit"/>编辑</a-button>
                                    <a-button type="link" @click="routerChange('detail-indep', record)"><i class="icon i_detail"/>详情</a-button>
                                </template>
                                <template v-if="index > 0">
                                    <a-button type="link" @click="handleDelete(record.id)" class="danger"><i class="icon i_delete"/>删除</a-button>
                                </template>
                            </template>
                        </template>
                    </a-table>
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</div>
</template>

<script>
import Core from '../../core';
import ItemHeader from './components/ItemHeader.vue'

export default {
    name: 'RepairDetail',
    components: { ItemHeader },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            id: '',
            detail: {}, // 采购单详情
            config: [],

            specific: { // 规格
                list: [], // 规格定义
                data: [], // 规格商品
            },

            activeKey: ['itemInfo'],

            indep_flag: 0,
        };
    },
    watch: {},
    computed: {
        specificColumns() {
            let column = []
            column = this.specific.list.map((item, index) => ({
                id: item.id,
                title: item.name,
                dataIndex: item.key,
                key: 'select',
                option: item.option,
                minWidth: '150px',
            }))
            column = column.filter(item => item.title && item.dataIndex)
            column.unshift(
                {title: '商品编码', key: 'input', dataIndex: 'code', fixed: 'left'},
            )
            column.push(
                {title: '成本价格', key: 'money', dataIndex: 'original_price'},
                {title: '标准售价', key: 'money', dataIndex: 'price'},
                {title: '是否自定义详情', dataIndex: 'flag_independent_info'},
                {title: '操作', key: 'operation'},
            )
            return column
        }
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.indep_flag = Number(this.$route.query.indep_flag) || 0
        this.getItemDetail();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/item/item-edit",
                        query: { id: this.id, set_id: this.detail.set_id, indep_flag: this.indep_flag }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit-indep':  // 商品个性化编辑
                    routeUrl = this.$router.resolve({
                        path: "/item/item-edit",
                        query: { id: item.id, indep_flag: 1 }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail-indep':  // 商品个性化详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: { id: item.id, indep_flag: 1 }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        // 获取 商品详情
        getItemDetail() {
            this.loading = true;
            Core.Api.Item.detail({
                id: this.id
            }).then(res => {
                console.log("getItemDetail res", res)
                let detail = res.detail || {}
                this.detail = detail;
                try { this.config = JSON.parse(detail.config) } catch (err) { this.config = [] }
                if (detail.set_id && !this.indep_flag) {
                    if (!this.activeKey.includes('itemSpec')) {
                        this.activeKey.push('itemSpec')
                    }
                    this.getAttrDef();
                }
            }).catch(err => {
                console.log('getItemDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取规格定义
        getAttrDef() {
            this.loading = true;
            Core.Api.AttrDef.listBySet({ // 获取规格定义
                set_id: this.detail.set_id
            }).then(res => {
                let list = res.list.map(item => ({
                    id: item.id,
                    key: item.key,
                    name: item.name,
                }))
                this.specific.list = list
                console.log('getAttrDef this.specific.list:', list)
                this.getSpecList();
            })
        },
        // 获取 多规格 商品列表
        getSpecList() {
            this.loading = true;
            Core.Api.Item.listBySet({
                set_id: this.detail.set_id
            }).then(res => {
                let data = res.list.map(item => {
                    let params = {}
                    for (const attr of this.specific.list) {
                        let element = item.attr_list.find(i => i.attr_def_id === attr.id)
                        params[attr.key] = element.value
                    }
                    return {
                        ...params,
                        id: item.id,
                        code: item.code,
                        price: item.price,
                        original_price: item.original_price,
                        flag_independent_info: item.flag_independent_info ? true : false,
                    }
                })
                this.specific.data = data
                console.log('getSpecList this.specific.data:', data)
            }).catch(err => {
                console.log('getSpecList err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 删除 商品
        handleDelete() {
            let _this = this;
            this.$confirm({
                title: '确定要删除该商品吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Item.delete({id: this.id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getItemDetail();
                        if (!_this.set_id) {
                            _this.routerChange('back');
                        }
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        // 开启、关闭 商品个性化
        handleIndepChange(record) {
            console.log('handleIndepChange record:', record)
            let _this = this;
            this.$confirm({
                title: `确定要${record.flag_independent_info ? '开启' : '关闭'}商品[${record.code}]的信息个性化吗？`,
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Item.setIndep({id: record.id}).then(() => {
                        _this.$message.success('操作成功');
                        _this.getSpecList();
                    }).catch(err => {
                        console.log("handleIndepChange err", err);
                    })
                },
                onCancel() {
                    record.flag_independent_info = !record.flag_independent_info
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
// #ItemDetail {}
</style>
