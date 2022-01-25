<template>
<div id="PurchaseList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">采购订单</div>
            <!-- <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新增工单</a-button>
            </div> -->
        </div>
        <div class="tabs-container colorful" v-if="!purchaseMode">
            <a-tabs v-model:activeKey="searchForm.status" @change='handleSearch'>
                <a-tab-pane :key="item.key" v-for="item of statusList">
                    <template #tab>
                        <div class="tabs-title">{{item.text}}<span :class="item.color">{{item.value}}</span></div>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">订单编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入订单编号" v-model:value="searchForm.sn" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN')">
                    <div class="key">所属分销商:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.distributor_id" placeholder="请选择分销商" @change="handleSearch" show-search option-filter-prop="children">
                            <a-select-option v-for="item of distributorList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN', 'DISTRIBUTOR')">
                    <div class="key">所属零售商：</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.agent_id" @change="handleSearch" show-search option-filter-prop="children"
                            :placeholder="searchForm.distributor_id ? '请选择所属零售商' : '请先选择所属分销商'" :disabled="!searchForm.distributor_id">
                            <a-select-option v-for="(item,index) of agentList" :key="index" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN', 'DISTRIBUTOR', 'AGENT')">
                    <div class="key">所属门店：</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.store_id" @change="handleSearch" show-search option-filter-prop="children"
                            :placeholder="searchForm.agent_id ? '请选择所属门店' : '请先选择所属零售商'" :disabled="!searchForm.agent_id">
                            <a-select-option v-for="(item,index) of storeList" :key="index" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                    <div class="key">下单时间:</div>
                    <div class="value">
                        <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch" :show-time="defaultTime" :allow-clear='false'>
                            <template #suffixIcon><i class="icon i_calendar"></i> </template>
                        </a-range-picker>
                    </div>
                </a-col>
            </a-row>
            <div class="btn-area">
                <a-button @click="handleExportConfirm">{{$t('def.export')}}</a-button>
                <a-button @click="handleSearch" type="primary">{{$t('def.search')}}</a-button>
                <a-button @click="handleSearchReset">{{$t('def.reset')}}</a-button>
            </div>
        </div>
        <div class="table-container">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                :row-key="record => record.id" :pagination='false' @change="handleTableChange">
                <template #bodyCell="{ column, text , record}">
                    <template v-if="column.dataIndex === 'sn'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.dataIndex === 'price'">
                        ￥{{$Util.countFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status status-bg status-tag" :class="$Util.puechaseStatusFilter(text,'color')">
                            {{$Util.puechaseStatusFilter(text)}}
                        </div>
                    </template>

                    <template v-if="column.dataIndex === 'flag_review'">
                        {{$Util.puechaseFlagReviewFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'purchase_method'">
                        {{$Util.puechasePayMethodFilter(text)}}
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
                        <a-button type='link' @click="handleRecreate(record)" v-if='search_type === SEARCH_TYPE.SELF'>  <i class="icon i_cart"/> 再次购买</a-button>
                        <a-button type='link' @click="routerChange('detail', record)"> <i class="icon i_detail"/> 详情</a-button>
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
                :show-total="total => `共${total}条`"
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
const PURCHASE = Core.Const.PURCHASE
export default {
    name: 'PurchaseList',
    components: {},
    props: {},
    data() {
        return {
            LOGIN_TYPE,
            SEARCH_TYPE: Core.Const.PURCHASE.SEARCH_TYPE,
            loginType: Core.Data.getLoginType(),
            USER_TYPE: Core.Const.USER.TYPE,
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
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            statusList: [
                {text: '全  部', value: '0', color: 'primary',  key: '0'},
                {text: '待支付', value: '0', color: 'yellow',  key: '100'},
                {text: '待发货', value: '0', color: 'orange',  key: '200'},
                {text: '已发货', value: '0', color: 'primary',  key: '300'},
                {text: '交易完成', value: '0', color: 'green',  key: '400'},
                {text: '交易取消', value: '0', color: 'grey',  key: '-100'},
            ],
            agentList: [],
            storeList: [],
            distributorList: [],
            create_time: [],
            searchForm: {
                sn: '',
                status: undefined,
                item_type: 0,
                distributor_id: undefined,
                agent_id: undefined,
                store_id: undefined,
                type: 0,
                subject: 0,
            },
            search_type: 0,
            filteredInfo: null,
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
                console.log("search_type", search_type, this.search_type)
                this.handleSearchReset();
                this.getStatusStat();
            }
        },

        'searchForm.distributor_id': function () {
            this.getAgentListAll();
            this.searchForm.agent_id = undefined
            this.searchForm.store_id = undefined
        },
        'searchForm.agent_id': function () {
            this.getStoreListAll()
            this.searchForm.store_id = undefined
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: '订单编号', dataIndex: 'sn', },
                { title: '订单总价', dataIndex: 'price' },
                { title: '订单状态', dataIndex: 'status' },
                { title: '下单时间', dataIndex: 'create_time', key: 'time' },
                { title: '支付时间', dataIndex: 'pay_time', key: 'time' },
                { title: '完成时间', dataIndex: 'close_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right'}
            ]
            if ((this.$auth('AGENT', 'DISTRIBUTOR') && this.search_type != this.SEARCH_TYPE.SELF) ||  (this.$auth('ADMIN') && this.search_type == this.SEARCH_TYPE.ALL)) {
                columns.splice(2, 0, {title: '所属门店', dataIndex: 'store_name', key: 'item'})
            }
            if ((this.$auth( 'DISTRIBUTOR') && this.search_type !== this.SEARCH_TYPE.SELF) || (this.$auth('ADMIN') && this.search_type == this.SEARCH_TYPE.ALL)) {
                columns.splice(2, 0, {title: '所属零售商', dataIndex: 'agent_name', key: 'item'})
            }
            if (this.$auth('ADMIN')) {
                columns.splice(2, 0, {title: '所属分销商', dataIndex: 'distributor_name', key: 'item'})
            }
            return columns
        }
    },
    mounted() {
        /*this.handleSearchReset();
        this.getStatusStat();*/
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
        handleTableChange(page, filters, sorter) {
            console.log('handleTableChange filters:', filters)
            // this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : ''
            }
        },
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            if (this.$auth('ADMIN')) {
                this.getDistributorListAll();
            } else if (this.$auth('DISTRIBUTOR')) {
                this.searchForm.distributor_id = Core.Data.getOrgId()
                this.getAgentListAll();
            } else if (this.$auth('AGENT')) {
                this.searchForm.agent_id = Core.Data.getOrgId()
                this.getStoreListAll();
            } else if (this.$auth('STORE')) {
                this.searchForm.store_id = Core.Data.getOrgId()
            }
            this.create_time = []
            this.pageChange(1);
        },
        // handleSearchReset() {  // 重置搜索
        //     Object.assign(this.searchForm, this.$options.data().searchForm)
        //     if (this.purchaseMode == 'audit') {
        //         this.searchForm.status = PURCHASE.STATUS.WAIT_AUDIT
        //     } else if (this.purchaseMode == 'check') {
        //         this.searchForm.status = PURCHASE.STATUS.WAIT_CHECK
        //     }
        //     if (this.$auth('ADMIN')) {
        //         this.getDistributorListAll();
        //     }
        //     else if (this.$auth('DISTRIBUTOR')) {
        //         this.searchForm.distributor_id = Core.Data.getOrgId()
        //         this.getAgentListAll();
        //     }
        //     else if (this.$auth('AGENT')) {
        //         this.searchForm.agent_id = Core.Data.getOrgId()
        //         this.getStoreListAll();
        //     }
        //     else if (this.$auth('STORE')) {
        //         this.searchForm.store_id = Core.Data.getOrgId()
        //     }
        //     this.filteredInfo = null
        //     this.create_time = []
        //     this.pageChange(1);
        // },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.Purchase.list({
                ...this.searchForm,
                search_type: this.search_type,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = res.list;
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
                    res.status_list.forEach(item => {
                        if ( statusItem.key == item.status) {
                            statusItem.value = item.amount
                            total += item.amount
                        }
                    })
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
                console.log('res.list: ', res.list);
                this.distributorList = res.list
            });
        },
        getAgentListAll() { // 获取 零售商 数据
            if (this.searchForm.distributor_id) {
                Core.Api.Agent.listAll({distributor_id: this.searchForm.distributor_id}).then(res => {
                    console.log('getAgentListAll res.list: ', res.list);
                    this.agentList = res.list
                });
            } else {
                this.agentList = []
            }
        },
        getStoreListAll() { // 通过零售商Id 获取所有门店
            if (this.searchForm.agent_id) {
                Core.Api.Store.listAll({agent_id: this.searchForm.agent_id}).then(res => {
                    console.log('getStoreListAll res.list: ', res.list);
                    this.storeList = res.list
                });
            } else {
                this.storeList = []
            }
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

        handleExportConfirm(){ // 确认订单是否导出
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

            let form = this.searchForm;
            let sn = form.sn || ''
            let status = form.status || 0
            let itemType = form.item_type || 0
            let distributorId = form.distributor_id || 0
            let agentId = form.agent_id || 0
            let storeId = form.store_id || 0
            let orgId = form.org_id ? form.org_id : 0
            let orgType = form.orgType || 0
            let type = form.type || 0
            let subject = form.subject || 0
            let payMethod = form.pay_method || 0
            let beginTime = this.create_time[0] || ''
            let endTime   = this.create_time[1] || ''

            const token = Core.Data.getToken() || ''

            let power = ''
            switch(this.loginType){
                case LOGIN_TYPE.ADMIN:
                    power = 'admin'
                    break
                case LOGIN_TYPE.DISTRIBUTOR:
                    power = 'distributor'
                    break
                case LOGIN_TYPE.AGENT:
                    power = 'agent'
                    break
                case LOGIN_TYPE.STORE:
                    power = 'store'
                    break
                default:
                    break
            }

            let fileUrl = Core.Const.NET.URL_POINT + '/' + power + '/1/purchase-order/export?'

            let exportUrl =
                `${fileUrl}token=${token}&sn=${sn}&status=${status}&item_type=${itemType}&distributor_id=${distributorId}
                &agent_id=${agentId}&store_id=${storeId}&org_id=${orgId}&org_type=${orgType}&type=${type}&subject=${subject}&pay_method=${payMethod}
                &begin_time=${beginTime}&end_time=${endTime}&search_typ=${this.search_type}`
            console.log("handleRepairExport -> exportUrl", exportUrl)
            window.open(exportUrl, '_blank')

            this.exportDisabled = false;
        },
    }
};
</script>

<style lang="less" scoped>
// #PurchaseList {}
</style>
