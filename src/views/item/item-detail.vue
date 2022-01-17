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
        <div class="gray-panel">
            <div class="panel-content">
                <div class="content-top">
                    <div class="info-block-top">
                        <img :src="$Util.imageFilter(detail.logo ? detail.logo : '', 2)" />
                    </div>
                    <div class="info-block-top">
                        <p class="name">商品名:{{detail.name}}</p>
                        <p class="price">￥{{$Util.countFilter(detail.price)}}</p>
                    </div>
                </div>
            </div>
        </div>
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
            <a-collapse-panel key="itemSpec" header="规格列表" class="gray-collapse-panel" v-if="detail.set_id">
                <a-row class="panel-content table-container">
                    <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                        :row-key="record => record.id" :pagination='false'>
                        <template #bodyCell="{ column, text, record, index }">
                            <template v-if="column.key === 'item'">
                                {{text || ''}}
                            </template>
                            <template v-if="column.key === 'money'">
                                ${{$Util.countFilter(text)}}
                            </template>
                            <template v-if="column.dataIndex === 'original_price'">
                                <a-input-number v-model:value="record.original_price" :min="0.01"
                                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/￥\s?|(,*)/g, '')" />
                            </template>
                            <template v-if="column.dataIndex === 'flag_independent_info'">
                                <template v-if="index === 0">
                                    <a-tooltip title="在商品展示时为默认商品">
                                        默认 <i class="icon i_hint"/>
                                    </a-tooltip>
                                </template>
                                <template v-else>
                                    <a-switch v-model:checked="record.flag_independent_info" @change='handleIndepChange(record)'/>
                                </template>
                            </template>

                            <template v-if="column.key === 'operation'">
                                <template v-if="record.flag_independent_info">
                                    <a-button type="link" @click="routerChange('edit-indep')"><i class="icon i_edit"/>编辑</a-button>
                                    <a-button type="link" @click="routerChange('detail-indep')"><i class="icon i_detail"/>详情</a-button>
                                </template>
                                <template v-if="index > 0">
                                    <a-button type="link" @click="handleDelete(record.id)"><i class="icon i_delete"/>删除</a-button>
                                </template>
                            </template>
                        </template>
                    </a-table>
                </a-row>
            </a-collapse-panel>
        </a-collapse>
    </div>
</div>
</template>

<script>
import Core from '../../core';

export default {
    name: 'RepairDetail',
    components: {},
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
        this.getItemDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/item/item-edit",
                        query: { id: this.id, set_id: this.detail.set_id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getItemDetail() {  // 获取 详情 数据
            this.loading = true;
            Core.Api.Item.detail({
                id: this.id
            }).then(res => {
                console.log("getDetailData res", res)
                this.detail = res;
                try { this.config = JSON.parse(res.config) } catch (err) { this.config = [] }
                if (res.set_id) {
                    this.getSepcList()
                }
            }).catch(err => {
                console.log('getDetailData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取规格列表
        getSepcList() {
            this.loading = true;
            Core.Api.AttrDef.listBySet({set_id: this.detail.set_id}).then(res => {
                let list = res.list.map(item => ({
                    id: item.id,
                    key: item.key,
                    name: item.name,
                }))
                console.log('setSpecificData list:', list)
                let data = itemList.map(item => {
                    let params = {}
                    for (const attr of list) {
                        let element = item.attr_list.find(i => i.attr_def_id === attr.id)
                        params[attr.key] = element.value
                    }
                    return {
                        ...params,
                        code: item.code,
                        price: Core.Util.countFilter(item.price),
                        original_price: Core.Util.countFilter(item.original_price),

                        target_id: item.id,
                        attr_list: item.attr_list,
                    }
                })
                console.log('setSpecificData data:', data)
                this.specific.list = list
                this.specific.data = data
            })
            Core.Api.Item.listBySet({
                set_id: this.detail.set_id
            }).then(res => {
                console.log("getSepcList res", res)
            }).catch(err => {
                console.log('getSepcList err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该商品吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Item.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.routerChange('back');
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        // 开启、关闭 商品个性化
        handleIndepChange(record) {

        }
    }
};
</script>

<style lang="less" scoped>
#ItemDetail {
    .content-top {
        padding-bottom: 0 20px;
        display: flex;
        .info-block-top{
            padding-right: 20px;
            img {
                width: 120px;
                height: 120px;
                object-fit: cover;
                background: #F3F3F3;
                border-radius: 4px 4px 4px 4px;
            }
            .name {
                height: 28px;
                font-size: 16px;
                color: rgba(0, 0, 0, 0.85);
                line-height: 28px;
            }
            .price {
                height: 20px;
                font-size: 14px;
                font-weight: 500;
                color: #F4752E;
                line-height: 20px;
                padding-top: 20px;
            }
        }
    }
}

</style>
