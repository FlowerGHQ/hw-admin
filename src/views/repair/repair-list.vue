<template>
<div id="RepairList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{$t('n.repair_list')}}</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')" v-if="!$auth('ADMIN')"><i class="icon i_add" />{{$t('n.repair_create')}}</a-button>
            </div>
        </div>
        <div class="tabs-container colorful" v-if="!operMode">
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
                    <div class="key">车架编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入车架编号" v-model:value="searchForm.vehicle_no" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN')">
                    <div class="key">所属分销商:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.distributor_id" placeholder="请选择所属分销商" @change="handleSearch" show-search option-filter-prop="children">
                            <a-select-option v-for="distributor of distributorList" :key="distributor.id" :value="distributor.id">{{ distributor.name }}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN', 'DISTRIBUTOR')">
                    <div class="key">所属零售商:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.agent_id" @change='handleSearch' show-search option-filter-prop="children"
                            :placeholder="searchForm.distributor_id ? '请选择所属零售商' : '请先选择所属分销商'" :disabled="!searchForm.distributor_id">
                            <a-select-option v-for="agent of agentList" :key="agent.id" :value="agent.id">{{ agent.name }}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN', 'DISTRIBUTOR', 'AGENT')">
                    <div class="key">所属门店:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.store_id" @change='handleSearch' show-search option-filter-prop="children"
                            :placeholder="searchForm.agent_id ? '请选择所属门店' : '请先选择所属零售商'" :disabled="!searchForm.agent_id">
                            <a-select-option v-for="item of storeList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                    <div class="key">{{$t('def.create_time')}}</div>
                    <div class="value">
                        <a-range-picker v-model:value="create_time" valueFormat='X' @change='handleSearch' :show-time="defaultTime" :allow-clear='false'>
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
                            <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                                {{ $Util.repairStatusFilter(text) }}
                                <template v-if="[STATUS.AUDIT_FAIL].includes(record.status)">
                                    <i class="icon i_hint" style="font-size: 12px;padding-left: 6px;"/>
                                </template>
                            </a-tooltip>
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
                    <template v-if="column.key === 'operation'">
                        <a-button type='link' @click="handleModalShow(record.id, 'audit')" v-if="record.status == STATUS.SETTLEMENT"><i class="icon i_confirm"/>审核</a-button>
                    </template>
                    <template v-if="column.key === 'operate'">
                        <a-button type='link' @click="routerChange('edit',record)" v-if="record.status == STATUS.AUDIT_FAIL"><i class="icon i_edit"/>修改</a-button>
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
    <!-- 审核 -->
    <template class="modal-container">
        <a-modal v-model:visible="modalShow" title="审核" :after-close='handleModalClose'>
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">审核结果:</div>
                    <div class="value">
                    <a-radio-group v-model:value="editForm.audit_result">
                        <a-radio :value="1">通过</a-radio>
                        <a-radio :value="0">不通过</a-radio>
                    </a-radio-group>
                    </div>
                </div>
                <div class="form-item" v-if="editForm.audit_result === 0">
                    <div class="key">原因:</div>
                    <div class="value">
                        <a-input v-model:value="editForm.audit_message" placeholder="请输入不通过原因"/>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="modalShow = false">取消</a-button>
                <a-button @click="handleModalSubmit" type="primary" >确定</a-button>
            </template>
        </a-modal>
    </template>
</div>
</template>

<script>
import Core from '../../core';
const REPAIR = Core.Const.REPAIR
const STATUS = Core.Const.REPAIR.STATUS
const LOGIN_TYPE = Core.Const.LOGIN.TYPE
const USER_TYPE = Core.Const.USER.TYPE

export default {
    name: 'RepairList',
    components: {},
    props: {},
    data() {
        return {
            STATUS,
            LOGIN_TYPE,
            USER_TYPE,
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
            operMode: '',
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            statusList: [
                {text: '全  部', value: '0', color: 'primary', key: '-1'},
                {text: '待检测', value: '0', color: 'yellow',  key: STATUS.WAIT_DETECTION },
                {text: '维修中', value: '0', color: 'blue',    key: STATUS.WAIT_REPAIR },
                {text: '已维修', value: '0', color: 'light',  key: STATUS.REPAIR_END },
                {text: '已结算待审核', value: '0', color: 'orange',  key: STATUS.SETTLEMENT },
                {text: '审核未通过', value: '0', color: 'red',  key: STATUS.AUDIT_FAIL },
                {text: '审核通过', value: '0', color: 'purple',  key: STATUS.AUDIT_SUCCESS },
                {text: '已取消', value: '0', color: 'gray',  key: STATUS.CLOSE },
            ],
            create_time: [],
            distributorList: [], // 分销商下拉框数据
            storeList: [],
            agentList: [],
            filteredInfo: null,
            searchForm: {
                uid: '',
                store_id: undefined,
                agent_id: undefined,
                distributor_id: undefined,
                status: '-1',
                channel: '',
                repair_method: '',
                repair_user_org_type:'',
                service_type: '',
                vehicle_no: '',
            },

            tableFields: [],
            tableData: [],

            modalShow: false,
            modalType: '',
            editForm: {
                id: '',
                audit_result: 1,
                audit_message: '',
            },
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let type = newRoute.meta ? newRoute.meta.type : ''
                this.operMode = type
                this.handleSearchReset();
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
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let columns = [
                { title: '工单编号', dataIndex: 'uid', key: 'detail' },
                { title: '工单名称', dataIndex: 'name', key: 'tip_item' },
                { title: '紧急程度', dataIndex: 'priority' },
                { title: '工单帐类', dataIndex: 'service_type',
                    filters: REPAIR.SERVICE_TYPE_LIST, filterMultiple: false, filteredValue: filteredInfo.service_type || null },
                { title: '维修方式', dataIndex: 'channel',
                    filters: REPAIR.CHANNEL_LIST, filterMultiple: false, filteredValue: filteredInfo.channel || null },
                { title: '维修类别', dataIndex: 'repair_method',
                    filters: REPAIR.METHOD_LIST, filterMultiple: false, filteredValue: filteredInfo.repair_method || null },
                { title: '维修单位', dataIndex: 'repair_name', key: 'item' },
                { title: '维修电话', dataIndex: 'repair_phone', key: 'item' },
                { title: '创建人',   dataIndex: 'user_name', key: 'item' },
                { title: '关联客户', dataIndex: 'customer_name', key: 'item' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                // { title: '完成时间', dataIndex: 'finish_time', key: 'time' },
                { title: '订单状态', dataIndex: 'status', fixed: 'right'},
            ]
            if (this.operMode) {
                columns.push({ title: '操作', key: 'operation', fixed: 'right'},)
            }
            if (!this.operMode) {
                columns.push({ title: '操作', key: 'operate', fixed: 'right'},)
            }
            return columns
        },
    },
    mounted() {},
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
        handleTableChange(page, filters, sorter) { // 表格搜索
            console.log('handleTableChange filters:', filters)
            this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : ''
            }
            this.pageChange(1);
        },
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            if (this.operMode == 'audit') {
                this.searchForm.status = STATUS.WAIT_AUDIT
            } else if (this.operMode == 'check') {
                this.searchForm.status = STATUS.SETTLEMENT
            }
            if (this.$auth('ADMIN')) {
                this.getDistributorListAll();
            }
            else if (this.$auth('DISTRIBUTOR')) {
                this.searchForm.distributor_id = Core.Data.getOrgId()
                this.getAgentListAll();
            }
            else if (this.$auth('AGENT')) {
                this.searchForm.agent_id = Core.Data.getOrgId()
                this.getStoreListAll();
            }
            else if (this.$auth('STORE')) {
                this.searchForm.store_id = Core.Data.getOrgId()
            }
            this.filteredInfo = null
            this.create_time = []
            this.pageChange(1);
        },

        getDistributorListAll() { // 获取所有分销商
            Core.Api.Distributor.listAll().then(res => {
                console.log('getDistributorListAll res.list: ', res.list);
                this.distributorList = res.list
            });
        },
        getAgentListAll() { // 通过分销商Id 获取所有零售商
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

        getTableData() {  // 获取 表格 数据
            this.loading = true;
            console.log('this.searchForm:', this.searchForm)
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
                this.statusList[0].value = total
            }).catch(err => {
                console.log('getStatusStat err:', err)
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

            let form = this.searchForm;
            let uid = form.uid || ''
            let type = form.type || 0
            let status = form.status || 0
            let distributorId = form.distributorId || 0
            let agentId = form.agent_id || 0
            let storeId = form.store_id || 0
            let orgId = form.org_id ? form.org_id : 0
            let orgType = form.orgType || 0
            let itemId = form.itemId || 0
            let channel = form.channel || 0
            let vehicleId = form.vehicleId || 0
            let repairMethod = form.repairMethod || 0
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
            let fileUrl = Core.Const.NET.URL_POINT + '/' + power + '/1/repair/export-repair-order-record?'

            let exportUrl =
                `${fileUrl}token=${token}&uid=${uid}&type=${type}&status=${status}&distributor_id=${distributorId}
                &agent_id=${agentId}&store_id=${storeId}&org_id=${orgId}&org_type=${orgType}&item_id=${itemId}
                &item_id=${itemId}&channel=${channel}&vehicle_id=${vehicleId}&repair_method=${repairMethod}
                &begin_time=${beginTime}&end_time=${endTime}`
            console.log("handleRepairExport -> exportUrl", exportUrl)
            window.open(exportUrl, '_blank')
            this.exportDisabled = false;
        },


        handleModalShow(id, type) { // 显示弹框
            this.modalShow = true
            this.modalType = type
            this.editForm.id = id
        },
        handleModalClose() { // 关闭弹框
            this.modalShow = false;
            Object.assign(this.editForm, this.$options.data().editForm)
        },
        handleModalSubmit() { // 审核提交
            this.loading = true;
            Core.Api.Repair[this.modalType](this.editForm).then(() => {
                this.$message.success('操作成功')
                this.handleModalClose()
                this.getTableData()
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less" scoped>
// #RepairList {}
</style>
