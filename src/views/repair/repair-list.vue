<template>
<div id="RepairList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{$t('n.repair_list')}}</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')" v-if="$auth('DISTRIBUTOR', 'AGENT', 'STORE')"><i class="icon i_add" />{{$t('n.repair_create')}}</a-button>
            </div>
        </div>
        <div class="tabs-container colorful">
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
                    <div class="key">工单编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入工单编号" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">车辆编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入车辆编号" v-model:value="searchForm.vehicle_no" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN')">
                    <div class="key">所属分销商:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.distributor_id" placeholder="请选择分销商" @change="handleSearch">
                            <a-select-option v-for="item of distributorList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN', 'DISTRIBUTOR')">
                    <div class="key">所属零售商:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.agent_id" placeholder="请选择零售商" @change="handleSearch">
                            <a-select-option v-for="item of agentList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">所属门店:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.org_id" placeholder="请选择门店" @change="handleSearch">
                            <a-select-option v-for="item of storeList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                    <div class="key">{{$t('def.create_time')}}</div>
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
        <div class="operate-container">
        </div>
        <div class="table-container">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                :row-key="record => record.id"  :pagination='false' @change="handleTableChange">
                <template #bodyCell="{ column, text , record }">
                    <template v-if="column.key === 'detail'">
                        <a-tooltip placement="top" :title='text' >
                            <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status status-bg status-tag" :class="$Util.repairStatusFilter(text,'color')">
                            {{$Util.repairStatusFilter(text)}}
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'type'">
                        {{$Util.repairTypeFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'priority'">
                        <div class="status status-bg status-tag smell" :class="$Util.repairPriorityFilter(text,'color')">
                            {{$Util.repairPriorityFilter(text)}}
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'channel'">
                        {{$Util.repairChannelFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'repair_name'">
                        {{text}}
                    </template>
                    <template v-if="column.dataIndex === 'repair_method'">
                        {{$Util.repairMethodFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'service_type'">
                        {{$Util.repairServiceFilter(text)}}
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
const REPAIR = Core.Const.REPAIR

export default {
    name: 'RepairList',
    components: {},
    props: {},
    data() {
        return {
            Core,
            REPAIR,
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
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            statusList: [
                {text: '全  部', value: '0', color: 'primary', key: '0'},
                {text: '待分配', value: '0', color: 'red',     key: REPAIR.STATUS.WAIT_DISTRIBUTION },
                {text: '待确认', value: '0', color: 'orange',  key: REPAIR.STATUS.WAIT_CHECK },
                {text: '等待审核(后台审核)', value: '0', color: 'yellow',  key: REPAIR.STATUS.WAIT_AUDIT },
                {text: '待检测', value: '0', color: 'yellow',  key: REPAIR.STATUS.WAIT_DETECTION },
                {text: '维修中', value: '0', color: 'blue',    key: REPAIR.STATUS.WAIT_REPAIR },
                {text: '已维修', value: '0', color: 'light',   key: REPAIR.STATUS.REPAIR_END },
                {text: '已结算', value: '0', color: 'green',   key: REPAIR.STATUS.SETTLEMENT },
                {text: '已转单', value: '0', color: 'purple',  key: REPAIR.STATUS.TRANSFER },
                {text: '确认未通过', value: '0', color: 'purple',  key: REPAIR.STATUS.CHECK_FAIL },
                {text: '审核未通过', value: '0', color: 'purple',  key: REPAIR.STATUS.AUDIT_FAIL },
                {text: '取消', value: '0', color: 'purple',  key: REPAIR.STATUS.CLOSE },
            ],
            create_time: [],
            distributorList: [], // 分销商下拉框数据
            storeList: [],
            agentList: [],
            filteredInfo: null,
            searchForm: {
                uid: '',
                org_id:undefined,
                agent_id: undefined,
                distributor_id:undefined,
                status: undefined,
                channel: '',
                repair_method: '',
                repair_user_org_type:'',
                service_type: '',
                vehicle_no: '',
            },

            tableFields: [],
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let columns = [
                { title: '工单编号', dataIndex: 'uid', key: 'detail' },
                { title: '工单名称', dataIndex: 'name', key: 'tip_item' },
                { title: '紧急程度', dataIndex: 'priority' },
                { title: '工单帐类', dataIndex: 'service_type',
                    filters: Core.Const.REPAIR.SERVICE_TYPE_LIST, filterMultiple: false, filteredValue: filteredInfo.service_type || null },
                { title: '维修方式', dataIndex: 'channel',
                    filters: Core.Const.REPAIR.CHANNEL_LIST, filterMultiple: false, filteredValue: filteredInfo.channel || null },
                { title: '维修类别', dataIndex: 'repair_method',
                    filters: Core.Const.REPAIR.METHOD_LIST, filterMultiple: false, filteredValue: filteredInfo.repair_method || null },
                // { title: '维修门店/零售商',   dataIndex: 'store_name', key: 'item' },
                { title: '维修门店/零售商',   dataIndex: 'repair_name',},
                { title: '维修门店电话',   dataIndex: 'repair_phone', key: 'item' },
                { title: '创建人',   dataIndex: 'user_name', key: 'item' },
                { title: '关联客户', dataIndex: 'customer_name', key: 'item' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '完成时间', dataIndex: 'finish_time', key: 'time' },
                { title: '订单状态', dataIndex: 'status' , fixed: 'right'},
            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
        if (this.$auth('ADMIN')) {
            this.getDistributorListAll();
        }
        if (this.$auth('ADMIN', 'DISTRIBUTOR')) {
            this.getAgentListAll();
        }
        if (this.$auth('ADMIN', 'DISTRIBUTOR', 'AGENT')) {
            this.getStoreList();
        }
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item)
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-edit",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-detail",
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
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            console.log('handleSearchReset:')
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.filteredInfo = null

            this.create_time = []
            this.pageChange(1);
        },

        getStoreList() {
            Core.Api.Store.list({
                page: 0,
                status: 1,
            }).then(res => {
                this.storeList = res.list
                this.storeList.push({id:-1,name:"零售商"})
            });
        },
        getAgentListAll() {
            Core.Api.Agent.listAll().then(res => {
                console.log('res.list: ', res.list);
                this.agentList = res.list
                this.agentList.push({id:-1,name:"零售商"})
            });
        },
        getDistributorListAll() {
            Core.Api.Distributor.listAll().then(res => {
                console.log('res.list: ', res.list);
                this.distributorList = res.list
                this.distributorList.push({id:-1,name:"分销商"})
            });
        },

        handleTableChange(page, filters, sorter) {
            console.log('handleTableChange filters:', filters)
            this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : 0
            }
            this.pageChange(1);
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            console.log('this.searchForm:', this.searchForm)
            if (this.searchForm.org_id == -1){
                // this.searchForm.org_id = 0
                this.searchForm.org_type = Core.Const.LOGIN.ORG_TYPE.AGENT
            }
            if (this.searchForm.org_id > 0){

                this.searchForm.org_type = Core.Const.LOGIN.ORG_TYPE.STORE
            }
            Core.Api.Repair.list({
                ...this.searchForm,
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
                this.getStatusStat()
            });
        },
        getStatusStat() {  // 获取 状态数量
            this.loading = true;
            Object.assign(this.statusList, this.$options.data().statusList)
            Core.Api.Repair.statusList({
                ...this.searchForm,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
                page: this.currPage,
                page_size: this.pageSize
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
                console.log(total)
                this.statusList[0].value = total
            }).catch(err => {
                console.log('getStatusStat err:', err)
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
            let uid = form.uid || ''
            let type = form.type || 0
            let status = form.status || 0
            let distributorId = form.distributorId || 0
            let agentId = form.agentId || 0
            let storeId = form.storeId || 0
            let orgId = form.org_id ? form.org_id : 0
            let orgType = form.orgType || 0
            let itemId = form.itemId || 0
            let channel = form.channel || 0
            let vehicleId = form.vehicleId || 0
            let repairMethod = form.repairMethod || 0
            let beginTime = this.create_time[0] || ''
            let endTime   = this.create_time[1] || ''

            const token = Core.Data.getToken() || ''
            let fileUrl = Core.Const.NET.URL_POINT + '/agent/1/repair/export-repair-order-record?'

            let exportUrl =
                `${fileUrl}token=${token}&uid=${uid}&type=${type}&status=${status}&distributor_id=${distributorId}
                &agent_id=${agentId}&store_id=${storeId}&org_id=${orgId}&org_type=${orgType}&item_id=${itemId}
                &item_id=${itemId}&channel=${channel}&vehicle_id=${vehicleId}&repair_method=${repairMethod}
                &begin_time=${beginTime}&end_time=${endTime}`
            console.log("handleRepairExport -> exportUrl", exportUrl)
            window.open(exportUrl, '_blank')
            this.exportDisabled = false;
        },
    }
};
</script>

<style lang="less" scoped>
// #RepairList {}
</style>
