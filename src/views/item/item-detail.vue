<template>
    <div id="ItemDetail">
        <div class="list-container">
            <a-spin :spinning="loading" class='loading-incontent' v-if="loading"></a-spin>
            <div class="title-container">
                <div class="title-area">{{ $t('i.detail') }}</div>
                <div class="btns-area">
                    <a-button @click="routerChange('edit-explored')"><i class="icon i_relevance"/>{{ $t('i.view') }}
                    </a-button>
                    <a-button type="primary" ghost @click="routerChange('edit')"><i
                        class="icon i_edit"/>{{ $t('def.edit') }}
                    </a-button>                    
                    <a-button :type="detail.status === 0 ? 'danger' : 'primary'" ghost @click="handleStatusChange()">
                        <template v-if="detail.status === -1"><i class="icon i_putaway"/>{{ $t('i.active_a') }}
                        </template>
                        <template v-if="detail.status === 0"><i class="icon i_downaway"/>{{ $t('i.inactive_a') }}
                        </template>
                    </a-button>
                </div>
            </div>
            <ItemHeader :detail='detail' :showSpec='indep_flag ? true : false'/>
            <div class="gray-panel">
                <p class="title">{{ $t('i.information') }}</p>
                <div class="expand-body">
                    <div class="table" :style="{ height: expand ? `${tableHeight}px` : `${tableTheadHeight}px` }">
                        <a-table :columns="specificColumns" :data-source="specific.data" :scroll="{ x: true }"
                                 :row-key="record => record.id" :pagination='false'>
                            <template #headerCell="{ column}">
                                <template v-if="column.key === 'select'">
                                    {{ lang =='zh' ? column.title: column.dataIndex }}
                                </template>
                            </template>
                            <template #bodyCell="{ column, text, record, index }">
                                <template v-if="column.key === 'input'">
                                    {{ lang =='zh' ? detail.name : detail.name_en }}({{ $t('d.code') }}：{{ text }})
                                </template>
                                <template v-if="column.key === 'select'">
                                    {{ lang =='zh' ? text.value:text.value_en }}
                                </template>
                                <template v-if="column.key === 'item'">
                                    {{ text || '' }}
                                </template>
                                <template v-if="column.key === 'money'">
                                    {{ $Util.priceUnitFilter(record.original_price_currency) }}
                                    {{ $Util.countFilter(text) }}
                                </template>
                                <template v-if="column.key === 'fob'">
                                    {{ column.unit }} {{ $Util.countFilter(text) }}
                                </template>
                                <template v-if="column.dataIndex === 'flag_independent_info'">
                                    <template v-if="index === 0">
                                        <a-tooltip :title="$t('i.default_a')">
                                            {{ $t('i.default') }} <i class="icon i_hint" style="font-size: 12px;"/>
                                        </a-tooltip>
                                    </template>
                                    <template v-else>
                                        <a-switch v-model:checked="record.flag_independent_info"
                                                  @change='handleIndepChange(record)'/>
                                    </template>
                                </template>
                                <template v-if="column.dataIndex === 'flag_default'">
                                    <template v-if="index === 0">
                                        <a-tooltip :title="$t('i.default_a')">
                                            {{ $t('i.default') }} <i class="icon i_hint" style="font-size: 12px;"/>
                                        </a-tooltip>
                                    </template>
                                    <template v-else>
                                        <a-switch v-model:checked="record.flag_default"
                                                  @change='handleDefaults(record)'/>
                                    </template>
                                </template>

                                <template v-if="column.key === 'operation'">
                                    <template v-if="record.flag_independent_info">
                                        <a-button type="link" @click="routerChange('edit-explored-indep', record)"><i
                                            class="icon i_relevance"/> {{ $t('i.view') }}
                                        </a-button>
                                        <a-button type="link" @click="routerChange('edit-indep', record)"><i
                                            class="icon i_edit"/>{{ $t('def.edit') }}
                                        </a-button>
                                        <a-button type="link" @click="routerChange('detail-indep', record)"><i
                                            class="icon i_detail"/>{{ $t('def.detail') }}
                                        </a-button>
                                    </template>                    
                                </template>
                            </template>
                        </a-table>
                    </div>
                    <div :class="expand ? 'unexpand' : 'expand'" @click="expand = !expand">
                        <img src="@images/item/expend.svg">
                    </div>
                </div>
            </div>
            <!-- <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                <template #expandIcon><i class="icon i_expan_l"/></template>
                <a-collapse-panel key="itemInfo" :header="$t('i.product_information')" class="gray-collapse-panel">
                    <a-row class="panel-content info-container">
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                            <div class="info-item">
                                <div class="key">{{ $t('i.code') }}</div>
                                <div class="value">{{ detail.code || '-' }}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('n.type') }}</div>
                                <div class="value"> {{ $Util.itemTypeFilter(detail.type, $i18n.locale) }}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('n.flag_entity') }}</div>
                                <div class="value"> {{
                                        $Util.itemFlagEntityFilter(detail.flag_entity, $i18n.locale)
                                    }}
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('i.categories') }}</div>
                                <div class="value">
                                <span v-for="(category, index) in detail.category_list">
                                    <span v-if="index !== 0">,</span>{{$i18n.locale =='zh' ? category.category_name : category.category_name_en }}
                                </span>
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('d.sales_area') }}</div>
                                <div class="value">{{ detail.sales_area_name }}</div>
                            </div>
                        </a-col>                        
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block" v-if="indep_flag">
                            <div class="info-item">
                                <div class="key">{{ $t('i.cost_price') }}</div>
                                <div class="value">{{ $Util.priceUnitFilter(detail.original_price_currency) }}
                                    {{ $Util.countFilter(detail.original_price) }}
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="key">FOB(EUR)</div>
                                <div class="value">€{{ $Util.countFilter(detail.fob_eur) }}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">FOB(USD)</div>
                                <div class="value">${{ $Util.countFilter(detail.fob_usd) }}</div>
                            </div>
                        </a-col>
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='12' class="info-block">
                            <template v-for="(item, index) of config" :key="index">
                                <a-col :xs='24' :sm='24' :lg='12' :xl='12' :xxl='8' class="info-item"
                                       :class="item.type" v-if="item.value">
                                    <div class="key">{{ item.name }}</div>
                                    <div class="value" v-if="item.type == 'rich_text'" v-html='item.value'></div>
                                    <div class="value" v-else>{{ item.value || '-' }}</div>
                                </a-col>
                            </template>
                        </a-col>
                    </a-row>
                </a-collapse-panel>
                <a-collapse-panel key="itemSpec" :header="$t('i.information')" class="gray-collapse-panel"
                                  v-if="detail.set_id && !this.indep_flag">
                    <div class="panel-content table-container no-mg">
                        <a-table :columns="specificColumns" :data-source="specific.data" :scroll="{ x: true }"
                                 :row-key="record => record.id" :pagination='false'>
                            <template #headerCell="{ column}">
                                <template v-if="column.key === 'select'">
                                    {{ lang =='zh' ? column.title: column.dataIndex }}
                                </template>
                            </template>
                            <template #bodyCell="{ column, text, record, index }">
                                <template v-if="column.key === 'select'">
                                    {{ lang =='zh' ? text.value:text.value_en }}
                                </template>
                                <template v-if="column.key === 'item'">
                                    {{ text || '' }}
                                </template>
                                <template v-if="column.key === 'money'">
                                    {{ $Util.priceUnitFilter(record.original_price_currency) }}
                                    {{ $Util.countFilter(text) }}
                                </template>
                                <template v-if="column.key === 'fob'">
                                    {{ column.unit }} {{ $Util.countFilter(text) }}
                                </template>
                                <template v-if="column.dataIndex === 'flag_independent_info'">
                                    <template v-if="index === 0">
                                        <a-tooltip :title="$t('i.default_a')">
                                            {{ $t('i.default') }} <i class="icon i_hint" style="font-size: 12px;"/>
                                        </a-tooltip>
                                    </template>
                                    <template v-else>
                                        <a-switch v-model:checked="record.flag_independent_info"
                                                  @change='handleIndepChange(record)'/>
                                    </template>
                                </template>
                                <template v-if="column.dataIndex === 'flag_default'">
                                    <template v-if="index === 0">
                                        <a-tooltip :title="$t('i.default_a')">
                                            {{ $t('i.default') }} <i class="icon i_hint" style="font-size: 12px;"/>
                                        </a-tooltip>
                                    </template>
                                    <template v-else>
                                        <a-switch v-model:checked="record.flag_default"
                                                  @change='handleDefaults(record)'/>
                                    </template>
                                </template>

                                <template v-if="column.key === 'operation'">
                                    <template v-if="record.flag_independent_info">
                                        <a-button type="link" @click="routerChange('edit-explored-indep', record)"><i
                                            class="icon i_relevance"/> {{ $t('i.view') }}
                                        </a-button>
                                        <a-button type="link" @click="routerChange('edit-indep', record)"><i
                                            class="icon i_edit"/>{{ $t('def.edit') }}
                                        </a-button>
                                        <a-button type="link" @click="routerChange('detail-indep', record)"><i
                                            class="icon i_detail"/>{{ $t('def.detail') }}
                                        </a-button>
                                    </template>                    
                                </template>
                            </template>
                        </a-table>
                    </div>
                </a-collapse-panel> -->
                <!-- 上传配件 -->
                <!-- <ItemAccessory :item_id='id' :target_type='ATTACHMENT_TYPE.ITEM' :detail='detail'
                               @submit="getItemDetail" ref="AttachmentFile"/> -->
                <!-- 上传附件 -->
                <!-- <AttachmentFile :target_id='id' :target_type='ATTACHMENT_TYPE.ITEM' :detail='detail'
                                @submit="getItemDetail" ref="AttachmentFile"/> -->
            <!-- </a-collapse> -->
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import ItemHeader from './components/ItemHeader.vue'
import AttachmentFile from '@/components/panel/AttachmentFile.vue';
import ItemAccessory from './components/ItemAccessory.vue';

export default {
    name: 'RepairDetail',
    components: {ItemHeader, AttachmentFile, ItemAccessory},
    props: {},
    data() {
        return {
            ATTACHMENT_TYPE: Core.Const.ATTACHMENT.TARGET_TYPE,
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
            tableTheadHeight: '',
            tableHeight: '',
            expand: false
        };
    },
    watch: {

    },
    computed: {
        lang() {
            return this.$store.state.lang
        },
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
                {title: this.$t('r.item_name'), key: 'input', dataIndex: 'code', fixed: 'left'},
            )
            column.push(
                {title: this.$t('i.cost_price'), key: 'money', dataIndex: 'original_price'},
                // {title: 'FOB(EUR)', key: 'fob', dataIndex: 'fob_eur', unit: '€'},
                // {title: 'FOB(USD)', key: 'fob', dataIndex: 'fob_usd', unit: '$'},
                // {title: '建议零售价', key: 'money', dataIndex: 'price'},
                {title: this.$t('i.custom'), dataIndex: 'flag_independent_info'},
                {title: this.$t('i.default_display'), dataIndex: 'flag_default'},
                {title: this.$t('def.operate'), key: 'operation'},
            )
            return column
        }
    },
    created() {
        this.id = Number(this.$route.query.id) || 0
        console.log('this route id',this.id);
    },
    mounted() {
        // this.id = Number(this.$route.query.id) || 0
        this.indep_flag = Number(this.$route.query.indep_flag) || 0
        this.getItemDetail();
    },
    methods: {
        initHeight () {
            this.tableTheadHeight = document.querySelector('.ant-table-thead').offsetHeight
            this.tableHeight = document.querySelector('.table').offsetHeight
        },
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/item/item-edit",
                        query: {
                            id: this.id, 
                            set_id: this.detail.set_id, 
                            indep_flag: this.indep_flag,
                            edit: true,
                        }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit-indep':  // 商品个性化编辑
                    routeUrl = this.$router.resolve({
                        path: "/item/item-edit",
                        query: {id: item.id, indep_flag: 1}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail-indep':  // 商品个性化详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: {id: item.id, indep_flag: 1}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'edit-explored':
                    routeUrl = this.$router.resolve({
                        path: "/item/item-explored-edit",
                        query: {id: this.id, indep_flag: this.indep_flag}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit-explored-indep':
                    routeUrl = this.$router.resolve({
                        path: "/item/item-explored-edit",
                        query: {id: item.id, indep_flag: 1}
                    })
                    window.open(routeUrl.href, '_self')
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
                detail.sales_area_name = detail.sales_area_list ? detail.sales_area_list.map(i => i.name).join(' , ') : ''
                this.detail = detail;
                try {
                    this.config = JSON.parse(detail.config)
                } catch (err) {
                    this.config = []
                }
                if (detail.set_id && !this.indep_flag) {
                    if (!this.activeKey.includes('itemSpec')) {
                        this.activeKey.push('itemSpec')
                    }
                    this.getAttrDef();
                } else {
                    this.$nextTick(() => {
                        //获取table和table-header高度
                        this.initHeight()
                    })
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
                    name_en: item.key
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
                        if (element != undefined){
                            params[attr.key] = {
                                value: element.value,
                                value_en: element.value_en
                            }
                        } else {
                            params[attr.key] = {
                                value: "",
                                value_en: ""
                            }
                        }

                    }
                    return {
                        ...params,
                        id: item.id,
                        code: item.code,
                        price: item.price,
                        original_price: item.original_price,
                        original_price_currency: item.original_price_currency,
                        fob_eur: item.fob_eur,
                        fob_usd: item.fob_usd,
                        flag_independent_info: item.flag_independent_info ? true : false,
                        flag_default: item.flag_default ? true : false,
                    }
                })
                this.specific.data = data
                this.$nextTick(() => {
                    //获取table和table-header高度
                    this.initHeight()
                })
                console.log('getSpecList this.specific.data:', data)
            }).catch(err => {
                console.log('getSpecList err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 删除 商品
        /* handleDelete(id) {
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
        },*/
        // 开启、关闭 商品个性化
        handleIndepChange(record) {
            console.log('handleIndepChange record:', record)
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure') + `${record.flag_independent_info ? this.$t('pop_up.open') : this.$t('pop_up.close')} [${record.code}] ` + this.$t('pop_up.information'),
                okText: this.$t('def.sure'),
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Item.setIndep({id: record.id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.save_success'))
                        _this.getSpecList();
                    }).catch(err => {
                        console.log("handleIndepChange err", err);
                    })
                },
                onCancel() {
                    record.flag_independent_info = !record.flag_independent_info
                }
            });
        },
        // 开启、关闭 默认显示
        handleDefaults(record) {
            console.log('handleDefaults record:', record)
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure') + `${record.flag_default ? this.$t('pop_up.open') : this.$t('pop_up.close')} [${record.code}] ` + this.$t('pop_up.default'),
                okText: this.$t('def.sure'),
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Item.setDefaults({id: record.id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.save_success'))
                        _this.getSpecList();
                    }).catch(err => {
                        console.log("handleIndepChange err", err);
                    })
                },
                onCancel() {
                    record.flag_default = !record.flag_default
                }
            });
        },

        handleStatusChange() {
            let _this = this;
            let name = _this.detail.status === -1 ? _this.$t('i.active_a') : _this.$t('i.inactive_a')
            this.$confirm({
                title: _this.$t('pop_up.sure') + `${name}？`,
                okText: _this.$t('def.sure'),
                okType: _this.detail.status === -1 ? '' : 'danger',
                content: _this.detail.status === -1 ? '' : _this.$t('i.after'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Item.updateStatus({id: _this.detail.id}).then(() => {
                        _this.$message.success(name + _this.$t('pop_up.success'));
                        _this.getItemDetail();
                    }).catch(err => {
                        console.log("handleStatusChange err", err);
                    })
                },
            });
        },
    }
};
</script>

<style lang="less" scoped>
// #ItemDetail {}
.title {
    color: #000;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 13px;
}
.expand-body {
    position: relative;
    background-color: #FFF;
    padding: 20px;
    margin-bottom: 16px;
    .table {
        overflow: hidden;
        transition: 0.2s;
    }
    .expand, .unexpand {
        width: 121px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #E2E2E2;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        cursor: pointer;
    }
    .unexpand {
        transform: translateX(-50%) rotate(180deg);
    }
}
</style>
