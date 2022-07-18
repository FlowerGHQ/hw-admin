<template>
<div id="PurchaseList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('p.list')}}</div>
            <!-- <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新增工单</a-button>
            </div> -->
        </div>
        <div class="tabs-container colorful" v-if="!purchaseMode">
            <a-tabs v-model:activeKey="searchForm.status" @change='handleSearch'>
                <a-tab-pane :key="item.key" v-for="item of statusList">
                    <template #tab>
                        <div class="tabs-title">{{item[$i18n.locale]}}<span :class="item.color">{{item.value}}</span></div>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">{{ $t('p.number')}}:</div>
                    <div class="value">
                        <a-input :placeholder="$t('def.input')" v-model:value="searchForm.sn" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN')">
                    <div class="key">{{ $t('n.distributor') }}:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.distributor_id" :placeholder="$t('def.select')" @change="handleSearch">
                            <a-select-option v-for="item of distributorList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN', 'DISTRIBUTOR')">
                    <div class="key">{{ $t('n.agent') }}：</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.agent_id" @change="handleSearch"
                            :placeholder="$t('def.select')">
                            <a-select-option v-for="(item,index) of agentList" :key="index" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN', 'DISTRIBUTOR', 'AGENT')">
                    <div class="key">{{ $t('n.store') }}：</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.store_id" @change="handleSearch" :placeholder="$t('def.select')">
                            <a-select-option v-for="(item,index) of storeList" :key="index" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">{{ $t('p.payment_status')}}:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.payment_status" @change="handleSearch" :placeholder="$t('def.select')">
                            <a-select-option v-for="(item,index) of PAYMENT_STATUS_MAP" :key="index" :value="item.key">{{ item[$i18n.locale] }}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                    <div class="key">{{ $t('n.order_time') }}:</div>
                    <div class="value"><TimeSearch @search="handleOtherSearch" ref='TimeSearch'/></div>
                </a-col>
            </a-row>
            <div class="btn-area">
                <a-button @click="handleSearch" type="primary">{{$t('def.search')}}</a-button>
                <a-button @click="handleSearchReset">{{$t('def.reset')}}</a-button>
            </div>
        </div>
        <div class="operate-container">
            <a-button type="primary" @click="handleExportConfirm" v-if="$auth('purchase-order.export')"><i class="icon i_download"/>{{$t('def.export')}}</a-button>
        </div>
        <div class="table-container">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                :row-key="record => record.id" :pagination='false'>
                <template #bodyCell="{ column, text , record}">
                    <template v-if="column.dataIndex === 'sn' && $auth('purchase-order.detail')">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)" v-if="text !== ''">{{text }}</a-button>
                            <a-button type="link" disabled v-else>-</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.dataIndex === 'parent_sn' && $auth('purchase-order.detail')">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('parent_detail', record)" v-if="text !== ''">{{text }}</a-button>
                            <a-button type="link" disabled v-else>-</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'money'">
                        {{$Util.priceUnitFilter(record.currency)}} {{$Util.countFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status status-bg status-tag" :class="$Util.purchaseStatusFilter(text,'color')">
                            {{$Util.purchaseStatusFilter(text, $i18n.locale)}}
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'payment_status'">
                        <div class="status status-bg status-tag" :class="$Util.paymentStatusFilter(text,'color')">
                            {{$Util.paymentStatusFilter(text, $i18n.locale)}}
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'type'">
                        {{$Util.purchaseTypeFilter(text, $i18n.locale)}}
                    </template>
                    <template v-if="column.dataIndex === 'pay_type'">
                        {{$Util.purchasePayTypeFilter(text, $i18n.locale)}}
                    </template>
                    <template v-if="column.dataIndex === 'flag_review'">
                        {{$Util.purchaseFlagReviewFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'purchase_method'">
                        {{$Util.purchasePayMethodFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'item_type'">
                        {{$Util.itemTypeFilter(text)}}
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-'}}
                    </template>
                    <template v-if="column.key === 'tip_item'">
                        <a-tooltip placement="top" :title='text'>
                            <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type='link' @click="handleRecreate(record)" v-if='search_type === SEARCH_TYPE.SELF'>  <i class="icon i_cart"/> {{ $t('p.buy_again') }}</a-button>
                        <a-button type='link' @click="routerChange('detail', record)" v-if="$auth('purchase-order.detail')"> <i class="icon i_detail"/>{{ $t('def.detail') }}</a-button>
                    </template>
                </template>
            </a-table>
        </div>
        <div class="paging-container">
            <a-pagination
                v-model:current="currPage"
                :page-size='pageSize'
                :total="total"
                show-quick-jumper
                show-size-changer
                show-less-items
                :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                :hide-on-single-page='false'
                :pageSizeOptions="['10', '20', '30', '40']"
                @change="pageChange"
                @showSizeChange="pageSizeChange"
            />
        </div>
    </div>
</div>
</template>

<script>
import Core from '../../core';
const LOGIN_TYPE = Core.Const.LOGIN.TYPE
const SEARCH_TYPE = Core.Const.PURCHASE.SEARCH_TYPE
const PAYMENT_STATUS_MAP = Core.Const.PURCHASE.PAYMENT_STATUS_MAP


import TimeSearch from '@/components/common/TimeSearch.vue'

export default {
    name: 'PurchaseList',
    components: {
        TimeSearch
    },
    props: {},
    data() {
        return {
            LOGIN_TYPE,
            SEARCH_TYPE,
            PAYMENT_STATUS_MAP,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 导出
            exportDisabled: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            purchaseMode: '',
            search_type: 0,
           /* statusList: [
                {zh: '全  部', en: 'All', value: '0', color: 'primary',  key: '0'},
                {zh: '待支付', en: 'Wait to pay', value: '0', color: 'yellow',  key: '100'},
                {zh: '待发货', en: 'Wait for delivery', value: '0', color: 'orange',  key: '200'},
                {zh: '已发货', en: 'Shipped',value: '0', color: 'primary',  key: '300'},
                {zh: '交易完成', en: 'Transaction completed', value: '0', color: 'green',  key: '400'},
                {zh: '交易取消', en: 'Canceled', value: '0', color: 'grey',  key: '-100'},
            ],*/
            agentList: [],
            storeList: [],
            distributorList: [],
            searchForm: {
                sn: '',
                status: undefined,
                payment_status: undefined,
                item_type: 0,
                distributor_id: undefined,
                agent_id: undefined,
                store_id: undefined,
                type: 0,
                subject: 0,
                begin_time: '',
                end_time: '',
            },
            // 表格
            tableData: [],
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let search_type = newRoute.meta ? newRoute.meta.search_type : 0
                this.search_type = search_type
                this.handleSearchReset(false);
                this.getStatusStat();
            }
        },

       /* 'searchForm.distributor_id': function () {
            this.getAgentListAll();
            this.searchForm.agent_id = undefined
            this.searchForm.store_id = undefined
        },
        'searchForm.agent_id': function () {
            this.getStoreListAll()
            this.searchForm.store_id = undefined
        },*/
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('p.number'), dataIndex: 'sn', },
                { title: this.$t('p.parent_sn'), dataIndex: 'parent_sn', },
                { title: this.$t('p.order_type'), dataIndex: 'type', key: 'type' },
                { title: this.$t('p.payment_terms'), dataIndex: 'pay_type', key: 'pay_type' },
                { title: this.$t('n.institution'), dataIndex: ['create_org', 'name'], key: 'item' },
                // { title: this.$t('p.total_price'), dataIndex: 'price', key: 'money' },
                // { title: this.$t('p.freight'), dataIndex: 'freight', key: 'money' },
                { title: this.$t('p.order_status'), dataIndex: 'status' },
                { title: this.$t('n.order_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('p.payment_status'), dataIndex: 'payment_status' },
                // { title: this.$t('p.amount_paid'), dataIndex: 'payment', key: 'money' },
                { title: this.$t('p.payment_time'), dataIndex: 'pay_time', key: 'time' },
                { title: this.$t('p.complete_time'), dataIndex: 'close_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right'}
            ]
            if (!this.$auth('purchase-order.supply-detail')) {
                columns.splice(5, 0, { title: this.$t('p.total_price'), dataIndex: 'price', key: 'money' },)
                columns.splice(6, 0, { title: this.$t('p.freight'), dataIndex: 'freight', key: 'money' },)
                columns.splice(9, 0, { title: this.$t('p.amount_paid'), dataIndex: 'payment', key: 'money' },)

                columns.push(
                    { title: this.$t('i.unit_price'), dataIndex: 'unit_price', key: 'money'},
                    { title: this.$t('i.total_price'),dataIndex: 'price', key: 'money'},
                )
            }
     /*       if ((this.$auth('AGENT', 'DISTRIBUTOR') && this.search_type != SEARCH_TYPE.SELF) ||  (this.$auth('ADMIN') && this.search_type == SEARCH_TYPE.ALL)) {
                columns.splice(2, 0, {title: '所属门店', dataIndex: 'store_name', key: 'item'})
            }
            if ((this.$auth( 'DISTRIBUTOR') && this.search_type !== SEARCH_TYPE.SELF) || (this.$auth('ADMIN') && this.search_type == SEARCH_TYPE.ALL)) {
                columns.splice(2, 0, {title: '所属零售商', dataIndex: 'agent_name', key: 'item'})
            }
            if (this.$auth('ADMIN')) {
                columns.splice(2, 0, {title: '所属分销商', dataIndex: 'distributor_name', key: 'item'})
            }*/
            return columns
        },
        statusList() {
            let columns = [
                {zh: '全  部', en: 'All', value: '0', color: 'primary',  key: '0'},
                {zh: '待支付', en: 'Wait to pay', value: '0', color: 'yellow',  key: '100'},
                {zh: '待发货', en: 'Wait for delivery', value: '0', color: 'orange',  key: '200'},
                {zh: '已发货', en: 'Shipped',value: '0', color: 'primary',  key: '300'},
                {zh: '部分收货', en: 'Received',value: '0', color: 'primary',  key: '330'},
                {zh: '全部收货', en: 'All Received',value: '0', color: 'primary',  key: '360'},
                {zh: '交易完成', en: 'Transaction completed', value: '0', color: 'green',  key: '400'},
                {zh: '交易取消', en: 'Canceled', value: '0', color: 'grey',  key: '-100'},
            ]
            if (this.$auth('ADMIN')) {
                columns.splice(4, 0, {zh: '已转单', en: 'Order transferred', value: '0', color: 'blue',  key: '250'})
            }
            return columns
        }
    },
    mounted() {
        this.getDistributorListAll();
        this.getAgentListAll();
        this.getStoreListAll();
        this.timer = window.setInterval(() => {
            setTimeout(() => {
                this.getDistributorListAll();
                this.getAgentListAll();
                this.getStoreListAll();
            }, 0);
        }, 5*1000);

    },
    beforeUnmount(){
        clearInterval(this.timer)
    },
    methods: {
        async routerChange(type, item = {}) {
            console.log('routerChange item:', item)
            let routeUrl = ''
            switch (type) {
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/purchase/purchase-order-detail",
                        query: {
                            id: item.id
                        }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'parent_detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/purchase/purchase-order-detail",
                        query: {
                            id: item.parent_id
                        }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit':  // 购物车
                    routeUrl = this.$router.resolve({
                        path: "/purchase/item-collect",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) { // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key]
            }
            this.pageChange(1);
        },
        handleSearchReset(flag = true) {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            if (flag) {
                this.$refs.TimeSearch.handleReset()
            }
          /*  if (this.$auth('ADMIN')) {
                this.getDistributorListAll();
            } else if (this.$auth('DISTRIBUTOR')) {
                this.searchForm.distributor_id = Core.Data.getOrgId()
                this.getAgentListAll();
            } else if (this.$auth('AGENT')) {
                this.searchForm.agent_id = Core.Data.getOrgId()
                this.getStoreListAll();
            } else if (this.$auth('STORE')) {
                this.searchForm.store_id = Core.Data.getOrgId()
            }*/
            this.pageChange(1);
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.Purchase.list({
                ...this.searchForm,
                search_type: this.search_type,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = res.list;
                // this.tableData.forEach(item=>{
                //     item['total_price'] = (item['price'] || 0) + (item['freight'] || 0);
                // })
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getStatusStat() {  // 获取 状态统计 数据
            this.loading = true;

            Core.Api.Purchase.statusList({
                search_type: this.search_type
            }).then(res => {
                console.log("getStatusStat res:", res)
                let total = 0

                this.statusList.forEach(statusItem => {
                    statusItem.value = 0;
                    res.status_list.forEach(item => {
                        if ( statusItem.key == item.status) {
                            statusItem.value = item.amount
                        }
                    })
                })
                res.status_list.forEach(item => {
                    total += item.amount
                })
                this.statusList[0].value = total
            }).catch(err => {
                console.log('getStatusStat err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getDistributorListAll() {
            Core.Api.Distributor.listAll().then(res => {
                this.distributorList = res.list
            });
        },
        getAgentListAll() { // 获取 零售商 数据
            Core.Api.Agent.listAll({distributor_id: this.searchForm.distributor_id}).then(res => {
                this.agentList = res.list
            });
        },
        getStoreListAll() { // 通过零售商Id 获取所有门店
            Core.Api.Store.listAll({agent_id: this.searchForm.agent_id}).then(res => {
                this.storeList = res.list
            });
        },

        handleRecreate(item){ // 再来一单
            this.loading = true;
            Core.Api.Purchase.recreate({
                id: item.id,
            }).then(res => {
                console.log("handleRecreate res:", res)
                this.routerChange('edit', item)
            }).catch(err => {
                console.log('handleRecreate err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        handleExportConfirm() { // 确认订单是否导出
            let _this = this;
            this.$confirm({
                title: '确认要导出吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    _this.handleRepairExport();
                }
            })
        },
        handleRepairExport() { // 订单导出
            this.exportDisabled = true;
            let form = Core.Util.deepCopy(this.searchForm);
            for (const key in form) {
                form[key] = form[key] || ''
            }
            let exportUrl = Core.Api.Export.purchaseExport({
                ...form,
                search_type: this.search_type
            })
            console.log("handleRepairExport _exportUrl", exportUrl)
            window.open(exportUrl, '_blank')
            this.exportDisabled = false;
        },
    }
};
</script>

<style lang="less" scoped>
// #PurchaseList {}
</style>
