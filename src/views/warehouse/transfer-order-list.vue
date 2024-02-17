<template>
    <div id="TransferOrderList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">调货单列表</div>
                <div class="btns-area">
                    <a-button type="primary" v-if="!$auth('ADMIN') && type !== 'out'" @click="handleTransferOrderShow"
                        ><i class="icon i_add" />新建调货单
                    </a-button>
                </div>
            </div>
            <div class="tabs-container colorful" v-if="$auth('ADMIN')">
                <a-tabs v-model:activeKey="searchForm.status" @change="handleSearch">
                    <a-tab-pane :key="item.key" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">
                                {{ item.text }}<span :class="item.color">{{ item.value }}</span>
                            </div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">仓库名称:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.warehouse_id" placeholder="请选择仓库">
                                <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">{{
                                    item.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">调货单编号:</div>
                        <div class="value">
                            <a-input
                                placeholder="请输入调货单编号"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="14" class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value">
                            <div class="value"><TimeSearch @search="handleOtherSearch" ref="TimeSearch" /></div>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)"
                                    >{{ text || '-' }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'org-type'">
                            {{ $Util.userTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.warehouseTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'address'">
                            {{ $Util.addressFilter(record.receive_info, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'tip_time'">
                            <a-tooltip :title="text" destroyTooltipOnHide>
                                <div class="ell" style="max-width: 200px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="$Util.transferStatusFilter(text, 'color')">
                                <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                                    {{ $Util.transferStatusFilter(text) }}
                                    <template v-if="record.status === STATUS.AUDIT_REFUSE">
                                        <i class="icon i_hint" style="font-size: 12px; padding-left: 6px" />
                                    </template>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button
                                type="link"
                                v-if="record.status === STATUS.WAIT_AUDIT && type == 'out'"
                                @click="handleTransferAuditShow(record.id)"
                            >
                                <i class="icon i_audit" />审核
                            </a-button>
                            <a-button
                                type="link"
                                v-else-if="record.status === STATUS.AUDIT_PASS && type == 'out'"
                                @click="handleDeliverShow(record.id)"
                            >
                                <i class="icon i_edit" />确认发货
                            </a-button>
                            <a-button
                                type="link"
                                v-else-if="record.status === STATUS.IN_TRANSIT && type == 'in'"
                                @click="handleReceive(record.id)"
                            >
                                <i class="icon i_edit" />确认收货
                            </a-button>
                            <template v-if="record.status === STATUS.WAIT_AUDIT && type == 'in'">
                                <a-button type="link" @click="routerChange('edit', record)"
                                    ><i class="icon i_edit" />编辑</a-button
                                >
                                <a-button type="link" @click="handleCancel(record.id)" class="danger">
                                    <i class="icon i_m_error" />取消
                                </a-button>
                            </template>
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
        <template class="modal-container">
            <a-modal
                v-model:visible="editShow"
                title="新建调货单"
                class="transfer-modal"
                :after-close="handleTransferOrderClose"
            >
                <div class="form-item required">
                    <div class="key">单位类型:</div>
                    <div class="value">
                        <a-select
                            placeholder="请选择单位类型"
                            v-model:value="form.supply_org_type"
                            @change="handleOrgTypeChange"
                        >
                            <a-select-option v-for="item of orgTypeList" :key="item.value" :value="item.value">
                                {{ item.text }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">调货单位:</div>
                    <div class="value">
                        <a-select
                            placeholder="请选择调货单位"
                            v-model:value="form.supply_org_id"
                            show-search
                            option-filter-prop="children"
                        >
                            <a-select-option
                                v-for="item of orgList"
                                :key="item.id"
                                :value="item.id"
                                :disabled="form.supply_org_type === orgType && orgId === item.id"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">仓库:</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.to_warehouse_id"
                            placeholder="请选择仓库"
                            show-search
                            option-filter-prop="children"
                        >
                            <a-select-option
                                v-for="warehouse of warehouseList"
                                :key="warehouse.id"
                                :value="warehouse.id"
                            >
                                {{ warehouse.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">收货地址:</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.receive_info_id"
                            placeholder="请选择收货地址"
                            show-search
                            option-filter-prop="children"
                        >
                            <a-select-option v-for="item of receiveList" :key="item.id" :value="item.id">{{
                                $Util.addressFilter(item, $i18n.locale)
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item textarea required">
                    <div class="key">原因:</div>
                    <div class="value">
                        <a-textarea
                            v-model:value="form.apply_message"
                            placeholder="请输入申请原因"
                            :auto-size="{ minRows: 2, maxRows: 6 }"
                            :maxlength="99"
                        />
                    </div>
                </div>
                <template #footer>
                    <a-button @click="handleTransferOrderSubmit" type="primary">确定</a-button>
                    <a-button @click="editShow = false">取消</a-button>
                </template>
            </a-modal>
            <a-modal
                v-model:visible="auditShow"
                title="审核"
                class="transfer-audit-modal"
                :after-close="handleTransferAuditClose"
            >
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">审核结果:</div>
                        <a-radio-group v-model:value="auditForm.status">
                            <a-radio :value="STATUS.AUDIT_PASS">通过</a-radio>
                            <a-radio :value="STATUS.AUDIT_REFUSE">不通过</a-radio>
                        </a-radio-group>
                    </div>
                    <div class="form-item required" v-if="auditForm.status === STATUS.AUDIT_PASS">
                        <div class="key">仓库:</div>
                        <div class="value">
                            <a-select v-model:value="auditForm.from_warehouse_id" placeholder="请选择仓库">
                                <a-select-option
                                    v-for="warehouse of warehouseList"
                                    :key="warehouse.id"
                                    :value="warehouse.id"
                                >
                                    {{ warehouse.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item textarea required" v-if="auditForm.status === STATUS.AUDIT_REFUSE">
                        <div class="key">原因:</div>
                        <div class="value">
                            <a-textarea
                                v-model:value="auditForm.audit_message"
                                placeholder="请输入不通过原因"
                                :auto-size="{ minRows: 2, maxRows: 6 }"
                                :maxlength="99"
                            />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="auditShow = false">取消</a-button>
                    <a-button @click="handleTransferAuditSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
            <a-modal v-model:visible="deliverShow" title="确认发货" @ok="handleInvoice">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">快递公司</div>
                        <div class="value">
                            <a-select v-model:value="deliverForm.company_uid" placeholder="请选择快递公司">
                                <a-select-option
                                    v-for="company of companyUidList"
                                    :key="company.value"
                                    :value="company.value"
                                    >{{ company.name }}</a-select-option
                                >
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">快递单号</div>
                        <div class="value">
                            <a-input v-model:value="deliverForm.waybill_uid" placeholder="请输入快递单号" />
                        </div>
                    </div>
                </div>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import TimeSearch from '@/components/common/TimeSearch.vue';
const TRANSFER_ORDER = Core.Const.TRANSFER_ORDER;
const STATUS = Core.Const.TRANSFER_ORDER.STATUS;
const ORG_TYPE = Core.Const.LOGIN.TYPE;
export default {
    name: 'TransferOrderList',
    components: { TimeSearch },
    props: {},
    data() {
        return {
            ORG_TYPE,
            type: '',
            loginType: Core.Data.getLoginType(),
            STATUS: TRANSFER_ORDER.STATUS,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            statusList: [
                { text: '全  部', value: '0', color: 'primary', key: '0' },
                { text: '待审核', value: '0', color: 'yellow', key: STATUS.WAIT_AUDIT },
                { text: '审核通过', value: '0', color: 'blue', key: STATUS.AUDIT_PASS },
                { text: '审核失败', value: '0', color: 'red', key: STATUS.AUDIT_REFUSE },
                { text: '处理完成', value: '0', color: 'green', key: STATUS.CLOSE },
                { text: '已取消', value: '0', color: 'grey', key: STATUS.CANCEL },
            ],
            searchForm: {
                warehouse_id: undefined,
                uid: '',
                status: undefined,
                type: undefined,
                begin_time: '',
                end_time: '',
            },
            // 表格
            tableData: [],

            // 创建
            orgType: Core.Data.getOrgType(), // 操作者的组织类型
            orgId: Core.Data.getOrgId(), // 操作者的组织id

            orgTypeList: Core.Const.LOGIN.TYPE_LIST,
            receiveList: [],
            storeList: [],
            agentList: [],
            distributorList: [],
            warehouseList: [],
            addressList: [],
            orgList: [],
            defAddr: [],
            // 创建、编辑 弹框
            editShow: false,
            form: {
                supply_org_type: undefined,
                supply_org_id: undefined,
                to_warehouse_id: undefined,
                apply_message: '',
                receive_info_id: undefined,
                type: '',
            },
            // 审核 弹框
            auditShow: false,
            deliverShow: false,
            auditForm: {
                id: '',
                status: 20,
                audit_message: '',
                from_warehouse_id: undefined,
            },
            deliverForm: {
                id: '',
                company_uid: '',
                waybill_uid: '',
            },
            companyUidList: Core.Const.WAYBILL.COMPANY_LIST,
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let type = newRoute.meta ? newRoute.meta.type : 'in';
                this.type = type;
                this.handleSearchReset(false);
                this.getStatusList();
            },
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: '调货单编号', dataIndex: 'uid', key: 'detail' },
                { title: '申请原因', dataIndex: 'apply_message', key: 'tip_time' },
                { title: '收货单位', dataIndex: 'org_name', key: 'org-ame' },
                { title: '单位类型', dataIndex: 'org_type', key: 'org-type' },
                /*  {title: '所属仓库', dataIndex: ['to_warehouse', 'name'], key: 'item',},
                {title: '仓库类型', dataIndex: ['to_warehouse', 'type'], key: 'type',},*/
                { title: '收货地址', dataIndex: 'address', key: 'address' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '审核人', dataIndex: ['audit_user', 'account', 'name'], key: 'audit-user' },
                { title: '审核时间', dataIndex: 'audit_time', key: 'time' },
                { title: '状态', dataIndex: 'status', key: 'status', align: 'center' },
                { title: '操作', key: 'operation', fixed: 'right' },
            ];
            if (this.type === 'in') {
                columns[2] = { title: '发货单位', dataIndex: 'supply_org_name', key: 'org-ame' };
                columns[3] = { title: '单位类型', dataIndex: 'supply_org_type', key: 'org-type' };
            }

            if (!this.$auth('ADMIN')) {
                columns.splice(6, 1);
            }
            return columns;
        },
    },
    mounted() {
        this.getWarehouseList();
        this.getReceiveInfoList();
        this.getReceiveList();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item);
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/transfer-order-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/transfer-order-detail',
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
            Object.assign(this.searchForm, this.$options.data().searchForm);
            if (flag) {
                this.$refs.TimeSearch.handleReset();
            }
            this.pageChange(1);
        },
        handleAddressSelect(address = []) {
            this.form.province = address[0];
            this.form.city = address[1];
            this.form.county = address[2];
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            let org = {};
            if (this.type === 'out') {
                org = {
                    supply_org_id: this.orgId,
                    supply_org_type: this.orgType,
                };
            } else {
                org = {
                    org_id: this.orgId,
                    org_type: this.orgType,
                };
            }
            Core.Api.Transfer.list({
                ...this.searchForm,
                ...org,
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
                });
        },
        getStatusList() {
            // 获取 状态 列表
            let org = {};
            if (this.type === 'out') {
                org = {
                    supply_org_id: this.orgId,
                    supply_org_type: this.orgType,
                };
            } else {
                org = {
                    org_id: this.orgId,
                    org_type: this.orgType,
                };
            }
            Core.Api.Transfer.status({
                ...org,
                ...this.searchForm,
            })
                .then(res => {
                    console.log('getStatusList res:', res);
                    let total = 0;
                    this.statusList.forEach(statusItem => {
                        statusItem.value = 0;
                    });
                    this.statusList.forEach(statusItem => {
                        res.status_list.forEach(item => {
                            if (statusItem.key == item.status) {
                                statusItem.value = item.amount;
                                total += item.amount;
                            }
                        });
                    });
                    this.statusList[0].value = total;
                })
                .catch(err => {
                    console.log('getStatusList err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list;
            });
        },
        getReceiveInfoList() {
            Core.Api.Receive.list().then(res => {
                this.addressList = res.list;
            });
        },
        handleDeliverShow(id) {
            this.deliverForm.id = id;
            this.deliverShow = true;
        },
        handleInvoice() {
            // 处理是否发货
            let _this = this;
            this.$confirm({
                title: '确定发货吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Transfer.deliver(_this.deliverForm)
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delivery_finish'));
                            _this.getTableData();
                            _this.getStatusList();
                            _this.deliverShow = false;
                        })
                        .catch(err => {
                            console.log('handleInvoice err', err);
                        });
                },
            });
        },
        handleReceive(id) {
            // 处理是否发货
            let _this = this;
            this.$confirm({
                title: '确定收货吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Transfer.receive({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delivery_finish'));
                            _this.getTableData();
                            _this.getStatusList();
                        })
                        .catch(err => {
                            console.log('handleInvoice err', err);
                        });
                },
            });
        },

        // 调货单审核
        handleTransferAuditShow(id) {
            // 显示弹框
            this.auditShow = true;
            this.auditForm.id = id;
        },
        handleTransferAuditClose() {
            // 关闭弹框
            this.auditShow = false;
        },
        handleTransferAuditSubmit() {
            // 审核提交
            this.loading = true;
            Core.Api.Transfer.audit({
                ...this.auditForm,
            })
                .then(res => {
                    console.log('handleTransferAuditSubmit res', res);
                    this.handleTransferAuditClose();
                    this.getTableData();
                    this.getStatusList();
                })
                .catch(err => {
                    console.log('handleTransferAuditSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 取消调货单
        handleCancel(id) {
            let _this = this;
            this.$confirm({
                title: '确定要取消该调货单吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Transfer.cancel({ id })
                        .then(() => {
                            _this.$message.success(_this.$('pop_up.canceled'));
                            _this.getStatusList();
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },

        // 调货单创建
        handleTransferOrderShow() {
            this.getStoreList();
            this.getAgentList();
            this.getDistributorList();
            this.editShow = true;
        },
        getReceiveList() {
            Core.Api.Receive.list().then(res => {
                console.log('res:', res);
                this.receiveList = res.list;
            });
        },
        getStoreList() {
            if (this.orgType === ORG_TYPE.STORE) {
                // todo 获取同级的门店列表
                Core.Api.Store.listAll().then(res => {
                    console.log('getStoreList res', res);
                    this.storeList = res.list;
                });
            } else if (this.orgType < ORG_TYPE.STORE) {
                Core.Api.Store.listAll().then(res => {
                    console.log('getStoreList res', res);
                    this.storeList = res.list;
                });
            }
        },
        getAgentList() {
            if (this.orgType === ORG_TYPE.AGENT) {
                // todo 获取同级的零售商列表
                Core.Api.Agent.listAll().then(res => {
                    console.log('getAgentList res', res);
                    this.agentList = res.list;
                });
            } else if (this.orgType > ORG_TYPE.AGENT) {
                // todo 门店 获取所属零售商的信息
                Core.Api.Store.detail().then(res => {
                    this.agentList = [{ name: res.detail.agent_name, id: res.detail.agent_id }];
                    console.log('getAgentList agentList', this.agentList);
                });
            } else if (this.orgType < ORG_TYPE.AGENT) {
                Core.Api.Agent.listAll().then(res => {
                    console.log('getAgentList res', res);
                    this.agentList = res.list;
                });
            }
        },
        getDistributorList() {
            if (this.orgType === ORG_TYPE.DISTRIBUTOR) {
                // todo 获取同级的分销商列表
                Core.Api.Distributor.listAll().then(res => {
                    console.log('getDistributorList res', res);
                    this.distributorList = res.list;
                });
            } else if (this.orgType > ORG_TYPE.DISTRIBUTOR) {
                // todo 门店、零售 获取上属分销商的信息
                let apiName = this.orgType === ORG_TYPE.AGENT ? 'Agent' : 'Store';
                Core.Api[apiName].detail({ id: this.orgId }).then(res => {
                    this.distributorList = [{ name: res.detail.distributor_name, id: res.detail.distributor_id }];
                    console.log('getDistributorList distributorList', this.distributorList);
                });
            }
        },
        // 单位类型改变
        handleOrgTypeChange(val) {
            console.log('handleOrgTypeChange this.form.supply_org_type', this.form.supply_org_type);
            switch (this.form.supply_org_type) {
                case ORG_TYPE.ADMIN:
                    this.orgList = [{ name: '平台', id: 1 }];
                    break;
                case ORG_TYPE.DISTRIBUTOR:
                    this.orgList = this.distributorList;
                    break;
                case ORG_TYPE.AGENT:
                    this.orgList = this.agentList;
                    break;
                case ORG_TYPE.STORE:
                    this.orgList = this.storeList;
                    break;
            }
            console.log('handleOrgTypeChange this.orgList', this.orgList);

            if (this.orgList.length == 1) {
                this.form.supply_org_id = this.orgList[0].id;
            }
            console.log('handleOrgTypeChange this.form.supply_org_id', this.form.supply_org_id);
        },
        handleTransferOrderClose() {
            this.editShow = false;
            Object.assign(this.form, this.$options.data().form);
        },
        handleTransferOrderSubmit() {
            let form = Core.Util.deepCopy(this.form);
            if (!form.supply_org_type) {
                return this.$message.warning('请选择单位类型');
            }
            if (!form.supply_org_id) {
                console.log(form.supply_org_id);
                return this.$message.warning('请选择调货单位');
            }
            if (!form.receive_info_id) {
                return this.$message.warning('请选择收货地址');
            }
            if (!form.to_warehouse_id) {
                return this.$message.warning('请选择仓库');
            }
            if (!form.apply_message) {
                return this.$message.warning('请输入申请原因');
            }
            Core.Api.Transfer.save(form)
                .then(res => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleTransferOrderClose();
                    this.routerChange('edit', res.detail);
                })
                .catch(err => {
                    console.log('handleTransferSubmit err:', err);
                });
        },
    },
};
</script>

<style lang="less">
//#TransferOrderList {}
</style>
