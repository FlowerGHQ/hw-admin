<template>
    <div id="RepairList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('r.repair_list') }}</div>
                <div class="btns-area">
                    <a-button
                        type="primary"
                        @click="routerChange('edit')"
                        v-if="!$auth('ADMIN') && $auth('repair-order.save')"
                        ><i class="icon i_add" />{{ $t('r.repair_create') }}</a-button
                    >
                </div>
            </div>
            <div class="tabs-container colorful" v-if="!operMode">
                <a-tabs v-model:activeKey="searchForm.status" @change="handleSearch">
                    <a-tab-pane :key="item.key" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">
                                {{ item[$i18n.locale] }}<span :class="item.color">{{ ' ' }}{{ item.value }}</span>
                            </div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('search.repair_sn') }}:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('search.enter_repair_sn')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('search.vehicle_no') }}:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('search.enter_vehicle_no')"
                                v-model:value="searchForm.vehicle_no"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">{{ $t('n.distributor') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.distributor_id"
                                :placeholder="$t('search.select_distributor')"
                                @change="handleSearch"
                                show-search
                                option-filter-prop="children"
                            >
                                <a-select-option
                                    v-for="distributor of distributorList"
                                    :key="distributor.id"
                                    :value="distributor.id"
                                    >{{ distributor.name }}</a-select-option
                                >
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="$auth('ADMIN', 'DISTRIBUTOR')">
                        <div class="key">{{ $t('n.agent') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.agent_id"
                                @change="handleSearch"
                                show-search
                                option-filter-prop="children"
                                :placeholder="
                                    searchForm.distributor_id ? $t('search.select_agent') : $t('search.select_d_first')
                                "
                                :disabled="!searchForm.distributor_id"
                            >
                                <a-select-option v-for="agent of agentList" :key="agent.id" :value="agent.id">{{
                                    agent.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col
                        :xs="24"
                        :sm="24"
                        :xl="8"
                        :xxl="6"
                        class="search-item"
                        v-if="$auth('ADMIN', 'DISTRIBUTOR', 'AGENT')"
                    >
                        <div class="key">{{ $t('n.store') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.store_id"
                                @change="handleSearch"
                                show-search
                                option-filter-prop="children"
                                :placeholder="
                                    searchForm.agent_id ? $t('search.select_store') : $t('search.select_a_first')
                                "
                                :disabled="!searchForm.agent_id"
                            >
                                <a-select-option v-for="item of storeList" :key="item.id" :value="item.id">{{
                                    item.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                        <div class="key">{{ $t('def.create_time') }}:</div>
                        <div class="value"><TimeSearch @search="handleOtherSearch" ref="TimeSearch" /></div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="operate-container">
                <a-button type="primary" @click="handleExportConfirm" v-if="$auth('repair-order.export')"
                    ><i class="icon i_download" />{{ $t('def.export') }}</a-button
                >
            </div>
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    @change="handleTableChange"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail' && $auth('repair-order.detail')">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                    text || '-'
                                }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="$Util.repairStatusFilter(text, 'color')">
                                <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                                    {{
                                        $Util.repairStatusFilter(text)
                                            ? $Util.repairStatusFilter(text)[$i18n.locale]
                                            : '-'
                                    }}
                                    <template v-if="[STATUS.AUDIT_FAIL].includes(record.status)">
                                        <i class="icon i_hint" style="font-size: 12px; padding-left: 6px" />
                                    </template>
                                </a-tooltip>
                            </div>
                        </template>
                        <!-- 工单类型 -->
                        <template v-if="column.dataIndex === 'device_type'">
                            {{ $Util.deviceTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'priority'">
                            <div
                                class="status status-bg status-tag smell"
                                :class="$Util.repairPriorityFilter(text, 'color')"
                            >
                                {{ $Util.repairPriorityFilter(text, $i18n.locale) }}
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'channel'">
                            {{ $Util.repairChannelFilter(text, $i18n.locale) }}
                        </template>
                        <!-- 维修类别 -->
                        <template v-if="column.dataIndex === 'repair_method'">
                            <span v-if="record.device_type == DEVICE_MAP.vehicle">
                                {{ $Util.repairMethodFilter(text, $i18n.locale) }}
                            </span>
                            <span v-else> - </span>
                        </template>
                        <template v-if="column.dataIndex === 'service_type'">
                            {{ $Util.repairServiceFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title="text">
                                <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'audit'">
                            <a-button
                                type="link"
                                @click="handleModalShow(record.id, 'audit')"
                                v-if="
                                    (record.status == STATUS.SETTLEMENT ||
                                        record.status == STATUS.DISTRIBUTOR_AUDIT_SUCCESS ||
                                        record.status == STATUS.SETTLEMENT_DISTRIBUTOR) &&
                                    record.service_type == 1 &&
                                    $auth('repair-order.audit')
                                "
                                ><i class="icon i_audit" />{{ $t('n.audit') }}</a-button
                            >
                        </template>
                        <template v-if="column.key === 'redit'">
                            <a-button
                                type="link"
                                @click="routerChange('edit', record)"
                                v-if="record.status == STATUS.AUDIT_FAIL && $auth('repair-order.save')"
                                ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                            >
                        </template>
                        <template v-if="column.key === 'invoice'">
                            <a-button
                                type="link"
                                @click="handleModalShow(record.id, 'audit')"
                                v-if="record.status == STATUS.DISTRIBUTOR_WAREHOUSE && $auth('repair-order.audit')"
                                ><i class="icon i_audit" />{{ $t('n.audit') }}</a-button
                            >
                        </template>
                        <template v-if="column.key === 'fault'">
                            <a-button
                                type="link"
                                @click="handleModalShow(record.id, 'fault')"
                                v-if="
                                    (record.status == STATUS.FAULT_ENTITY_AUDIT ||
                                        record.status == STATUS.AUDIT_SUCCESS) &&
                                    record.service_type == 1 &&
                                    $auth('repair-order.save-to-invoice')
                                "
                                ><i class="icon i_s_warehouse" />{{ $t('n.storage') }}</a-button
                            >
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size="pageSize"
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
        <!-- 审核 -->
        <template class="modal-container">
            <a-modal v-model:visible="modalShow" :title="$t('n.audit')" :after-close="handleModalClose">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('n.result_a') }}:</div>
                        <div class="value">
                            <a-radio-group v-model:value="editForm.audit_result">
                                <a-radio :value="1">{{ $t('n.pass') }}</a-radio>
                                <a-radio :value="0">{{ $t('n.fail') }}</a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                    <div class="form-item" v-if="editForm.audit_result === 0">
                        <div class="key">{{ $t('n.reason') }}:</div>
                        <div class="value">
                            <a-input v-model:value="editForm.audit_message" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="modalShow = false">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleModalSubmit" type="primary">{{ $t('def.sure') }}</a-button>
                </template>
            </a-modal>
        </template>
        <!-- 入库 -->
        <template class="modal-container" v-if="operMode == 'fault'">
            <a-modal v-model:visible="modalShow" :title="$t('n.storage')" :after-close="handleModalClose">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('n.warehouse') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="faultForm.warehouse_id"
                                :placeholder="$t('def.select')"
                                show-search
                                option-filter-prop="children"
                            >
                                <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">{{ $t('n.fault') }}:</div>
                        <div class="value">
                            <a-input v-model:value="faultForm.fault_entity_uid" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="modalShow = false">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleStock" type="primary">{{ $t('def.sure') }}</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
const REPAIR = Core.Const.REPAIR;
const STATUS = Core.Const.REPAIR.STATUS;
const LOGIN_TYPE = Core.Const.LOGIN.TYPE;
const USER_TYPE = Core.Const.USER.TYPE;
// const STATUS_MAP = STATUS.STATUS_MAP
import TimeSearch from '@/components/common/TimeSearch.vue';
export default {
    name: 'RepairList',
    components: {
        TimeSearch,
    },
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
                repair_user_org_type: '',
                service_type: '',
                vehicle_no: '',
                begin_time: '',
                end_time: '',
            },
            // 表格
            tableFields: [],
            tableData: [],
            // 弹框
            modalShow: false,
            modalType: '',
            editForm: {
                id: '',
                audit_result: '',
                audit_message: '',
            },
            warehouseList: [],
            faultForm: {
                id: '',
                warehouse_id: undefined,
                fault_entity_uid: undefined,
            },
            statusStatus: [
                { zh: '全  部', en: 'All', value: '0', color: 'primary', key: '-1' },
                { zh: '待检测', en: 'Waiting detect', value: '0', color: 'yellow', key: STATUS.WAIT_DETECTION },
                { zh: '维修中', en: 'Under repair', value: '0', color: 'blue', key: STATUS.WAIT_REPAIR },
                { zh: '待结算', en: 'Pending settlement', value: '0', color: 'blue', key: STATUS.REPAIR_END },
                { zh: '已结算待审核', en: 'Settled accounts and awaiting audit', value: '0', color: 'orange', key: 65 },
                {
                    zh: '分销商审核通过',
                    en: 'Distributor approved',
                    value: '0',
                    color: 'purple',
                    key: STATUS.DISTRIBUTOR_AUDIT_SUCCESS,
                },
                {
                    zh: '平台方审核通过',
                    en: 'Platform approved',
                    value: '0',
                    color: 'purple',
                    key: STATUS.AUDIT_SUCCESS,
                },
                {
                    zh: '分销商已入库',
                    en: 'Distributor has stocked in warehouse',
                    value: '0',
                    color: 'green',
                    key: STATUS.DISTRIBUTOR_WAREHOUSE,
                },
                // {zh: '平台方审核故障件', en: 'Platform audits the faulty parts', value: '0', color: 'blue',  key: STATUS.FAULT_ENTITY_AUDIT},
                {
                    zh: '平台方已入库',
                    en: 'Platform has stocked in warehouse',
                    value: '0',
                    color: 'green',
                    key: STATUS.SAVE_TO_INVOICE,
                },
                { zh: '已完成', en: 'Finished settle accounts', value: '0', color: 'blue', key: STATUS.FINISH },
                { zh: '工单审核未通过', en: 'Failed audit', value: '0', color: 'red', key: STATUS.AUDIT_FAIL },
                // {zh: '故障件审核未通过', en: 'Failed parts audit failed', value: '0', color: 'red',  key: STATUS.FAULT_ENTITY_AUDIT_FAIL },
                // {zh: '入库完成', value: '0', color: 'green',  key: STATUS.SAVE_TO_INVOICE },
                { zh: '已取消', en: 'Cancelled', value: '0', color: 'gray', key: STATUS.CLOSE },
            ], // 状态
            DEVICE_MAP: REPAIR.DEVICE_MAP, // 整车还是零配件
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let type = newRoute.meta ? newRoute.meta.type : '';
                this.operMode = type;
                this.handleSearchReset(false);
            },
        },
        'searchForm.distributor_id': function () {
            this.getAgentListAll();
            this.searchForm.agent_id = undefined;
            this.searchForm.store_id = undefined;
        },
        'searchForm.agent_id': function () {
            this.getStoreListAll();
            this.searchForm.store_id = undefined;
        },
    },
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let columns = [
                { title: this.$t('r.repair_sn'), dataIndex: 'uid', key: 'detail' },
                { title: this.$t('r.device_classify'), dataIndex: 'device_type', key: 'device_type' }, // 工单类型
                { title: this.$t('search.vehicle_no'), dataIndex: 'vehicle_no', key: 'item' },
                { title: this.$t('r.repair_name'), dataIndex: 'name', key: 'tip_item' },
                { title: this.$t('r.urgency'), dataIndex: 'priority' },
                { title: this.$t('r.repair_status'), dataIndex: 'status' },
                {
                    title: this.$t('r.warranty'),
                    dataIndex: 'service_type',
                    filters: this.$Util.tableFilterFormat(REPAIR.SERVICE_TYPE_LIST, this.$i18n.locale),
                    filterMultiple: false,
                    filteredValue: filteredInfo.service_type || null,
                },
                {
                    title: this.$t('r.repair_way'),
                    dataIndex: 'channel',
                    filters: this.$Util.tableFilterFormat(REPAIR.CHANNEL_LIST, this.$i18n.locale),
                    filterMultiple: false,
                    filteredValue: filteredInfo.channel || null,
                },
                {
                    title: this.$t('r.repair_category'),
                    dataIndex: 'repair_method',
                    filters: this.$Util.tableFilterFormat(REPAIR.METHOD_LIST, this.$i18n.locale),
                    filterMultiple: false,
                    filteredValue: filteredInfo.repair_method || null,
                }, // 维修类别
                { title: this.$t('r.repair_unit'), dataIndex: 'repair_name', key: 'item' },
                { title: this.$t('r.repair_phone'), dataIndex: 'repair_phone', key: 'item' },
                { title: this.$t('r.creator_name'), dataIndex: 'user_name', key: 'item' },
                { title: this.$t('r.associated_customers'), dataIndex: 'customer_name', key: 'item' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
                // { title: '完成时间', dataIndex: 'finish_time', key: 'time' },
            ];
            if (this.operMode === 'audit' && this.$auth('ADMIN', 'DISTRIBUTOR')) {
                columns.push({ title: this.$t('def.operate'), key: 'audit', fixed: 'right' });
            }
            if (this.operMode === 'redit' && !this.$auth('ADMIN')) {
                columns.push({ title: this.$t('def.operate'), key: 'redit', fixed: 'right' });
            }
            if (this.operMode === 'invoice' && this.$auth('ADMIN')) {
                columns.push({ title: this.$t('def.operate'), key: 'invoice', fixed: 'right' });
            }
            if (this.operMode === 'fault' && this.$auth('ADMIN', 'DISTRIBUTOR')) {
                columns.push({ title: this.$t('def.operate'), key: 'fault', fixed: 'right' });
            }
            return columns;
        },
        statusList() {
            return this.statusStatus;
        },
    },
    mounted() {
        this.getTableData();
        this.getWarehouseList();
        this.timer = window.setInterval(() => {
            setTimeout(() => {
                this.getTableData();
                this.getWarehouseList();
            }, 0);
        }, 5 * 1000);
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item);
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/repair/repair-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/repair/repair-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.pageSize = size;
            this.getTableData();
        },
        handleTableChange(page, filters, sorter) {
            // 表格搜索
            console.log('handleTableChange filters:', filters);
            this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : '';
            }
            this.pageChange(1);
        },
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) {
            // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key];
            }
            this.pageChange(1);
        },
        handleSearchReset(flag = true) {
            // 重置搜索
            let search = Object.assign(this.searchForm, this.$options.data().searchForm);
            if (flag) {
                this.$refs.TimeSearch.handleReset();
            }
            if (this.operMode == 'audit' && this.$auth('DISTRIBUTOR')) {
                search.status = STATUS.SETTLEMENT;
            } else if (this.operMode == 'audit' && this.$auth('ADMIN')) {
                search.status = 75;
            } else if (this.operMode == 'redit') {
                search.status = STATUS.AUDIT_FAIL;
            } else if (this.operMode == 'invoice') {
                search.status = STATUS.DISTRIBUTOR_WAREHOUSE;
            } else if (this.operMode == 'fault' && this.$auth('ADMIN')) {
                search.status = STATUS.FAULT_ENTITY_AUDIT;
            } else if (this.operMode == 'fault' && this.$auth('DISTRIBUTOR')) {
                search.status = STATUS.AUDIT_SUCCESS;
            }
            if (this.$auth('ADMIN')) {
                this.getDistributorListAll();
            } else if (this.$auth('DISTRIBUTOR')) {
                this.searchForm.distributor_id = Core.Data.getOrgId();
                this.getAgentListAll();
            } else if (this.$auth('AGENT')) {
                // this.searchForm.agent_id = Core.Data.getOrgId()
                this.getStoreListAll();
            } else if (this.$auth('STORE')) {
                this.searchForm.store_id = Core.Data.getOrgId();
            }
            this.filteredInfo = null;
            this.pageChange(1);
        },

        getDistributorListAll() {
            // 获取所有分销商
            Core.Api.Distributor.listAll().then(res => {
                this.distributorList = res.list;
            });
        },
        getAgentListAll() {
            // 通过分销商Id 获取所有零售商
            if (this.searchForm.distributor_id) {
                Core.Api.Agent.listAll({ distributor_id: this.searchForm.distributor_id }).then(res => {
                    this.agentList = res.list;
                });
            } else {
                this.agentList = [];
            }
        },
        getStoreListAll() {
            // 通过零售商Id 获取所有门店
            if (this.searchForm.agent_id) {
                Core.Api.Store.listAll({ agent_id: this.searchForm.agent_id }).then(res => {
                    this.storeList = res.list;
                });
            } else {
                this.storeList = [];
            }
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            console.log('this.searchForm:', this.searchForm);

            Core.Api.Repair.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                    this.getStatusStat();
                });
        },
        getStatusStat() {
            // 获取 状态数量
            this.loading = true;
            Core.Api.Repair.statusList({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getStatusStat res:', res);
                    let total = 0;

                    this.statusStatus.forEach(statusItem => {
                        res.status_list.forEach(item => {
                            if (statusItem.key == item.status) {
                                statusItem.value = item.amount;
                            }
                        });
                    });

                    res.status_list.forEach(item => {
                        total += item.amount;
                    });
                    this.statusStatus[0].value = total;
                })
                .catch(err => {
                    console.log('getStatusStat err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handleExportConfirm() {
            // 确认订单是否导出
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure') + _this.$t('n.export') + '?',
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.handleRepairExport();
                },
            });
        },
        handleRepairExport() {
            // 订单导出
            this.exportDisabled = true;

            let form = Core.Util.deepCopy(this.searchForm);
            for (const key in form) {
                form[key] = form[key] || '';
            }
            let exportUrl = Core.Api.Export.repairExport({
                ...form,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            console.log('handleRepairExport exportUrl', exportUrl);
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },

        handleModalShow(id, type) {
            // 显示弹框
            this.modalShow = true;
            this.modalType = type;
            this.editForm.id = id;
            this.faultForm.id = id;
        },
        handleModalClose() {
            // 关闭弹框
            this.modalShow = false;
            Object.assign(this.editForm, this.$options.data().editForm);
            Object.assign(this.faultForm, this.$options.data().faultForm);
        },
        handleModalSubmit() {
            // 审核提交
            this.loading = true;
            if (this.editForm.audit_result === '') {
                return this.$message.warning(this.$t('r.audit_result'));
            }
            Core.Api.Repair[this.modalType](this.editForm)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleModalClose();
                    this.getTableData();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleInvoice(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('r.sure_settlement'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Repair.pay({ id })
                        .then(() => {
                            _this.$message.success(this.$t('r.settlement'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleInvoice err', err);
                        });
                },
            });
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list;
                console.log('getWarehouseList', this.warehouseList);
            });
        },
        handleStock(id) {
            console.log('id', id);
            let faultForm = Core.Util.deepCopy(this.faultForm);
            if (!faultForm.warehouse_id) {
                return this.$message.warning(this.$t('wa.choose_warehouse'));
            }
            if (!faultForm.fault_entity_uid) {
                return this.$message.warning(this.$t('r.input_fault_number'));
            }
            Core.Api.Repair.stock({
                ...faultForm,
            })
                .then(() => {
                    this.$message.success(this.$t('n.stock_in_completed'));
                    this.handleModalClose();
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleStock err', err);
                });
        },
    },
};
</script>

<style lang="less" scoped>
// #RepairList {}
</style>
