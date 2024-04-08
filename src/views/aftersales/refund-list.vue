<template>
    <div id="RefundList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('af.refund_list') }}</div>
            </div>
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.status" @change="handleSearch">
                    <a-tab-pane :key="item.key" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">
                                {{ item[$i18n.locale] }}<span :class="item.color">{{ item.value }}</span>
                            </div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('af.refund_order_number') }}:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.sn"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <!-- <a-col :xs='24' :sm='24' :xl="8" :xxl='8' class="search-item">
                        <div class="key">退款类型:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" @change="handleSearch" placeholder="请选择退款类型">
                                <a-select-option v-for="(item, index) of typeList" :key="index" :value="item.value">{{item.text}}</a-select-option>
                            </a-select>
                        </div>
                    </a-col> -->
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                        <div class="key">{{ $t('d.create_time') }}:</div>
                        <div class="value"><TimeSearch @search="handleOtherSearch" ref="TimeSearch" /></div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
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
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('purchase', record)"
                                    >{{ text || '-' }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'money'">
                            {{ $Util.priceUnitFilter(record.currency) }} {{ $Util.countFilter(text) }}
                        </template>
                        <template v-if="column.key === 'tip_time'">
                            <a-tooltip :title="text" destroyTooltipOnHide>
                                <div class="ell" style="max-width: 200px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.refundTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'org_name'">
                            {{ $Util.userTypeFilter(record.org_type, $i18n.locale) }} {{ text }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="$Util.refundStatusFilter(text, 'color')">
                                <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                                    {{ $Util.refundStatusFilter(text, $i18n.locale) }}
                                    <template v-if="record.status === STATUS.AUDIT_REFUSE">
                                        <i class="icon i_hint" style="font-size: 12px; padding-left: 6px" />
                                    </template>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)">
                                <i class="icon i_detail" />{{ $t('def.detail') }}
                            </a-button>
                            <a-button
                                type="link"
                                @click="handleCancel(record.id)"
                                v-if="record.status === STATUS.WAIT_AUDIT && sameOrg(record.org_id, record.org_type)"
                            >
                                <i class="icon i_close_c" />{{ $t('def.cancel') }}
                            </a-button>
                            <template v-if="sameOrg(record.supply_org_id, record.supply_org_type)">
                                <a-button
                                    type="link"
                                    @click="handleAuditShow(record.id)"
                                    v-if="record.status === STATUS.WAIT_AUDIT"
                                >
                                    <i class="icon i_audit" />{{ $t('n.audit') }}
                                </a-button>
                                <a-button
                                    type="link"
                                    @click="handleRefundConfirm(record.id)"
                                    v-if="record.status === STATUS.AUDIT_PASS"
                                >
                                    <i class="icon i_confirm" />{{ $t('af.refund') }}
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
                v-model:visible="auditShow"
                :title="$t('n.audit')"
                class="refund-edit-modal"
                :after-close="handleAuditClose"
            >
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('n.result_a') }}:</div>
                        <a-radio-group v-model:value="auditForm.status">
                            <a-radio :value="STATUS.AUDIT_PASS">{{ $t('n.pass') }}</a-radio>
                            <!-- <a-radio :value="STATUS.AUDIT_REFUSE">不通过</a-radio> -->
                        </a-radio-group>
                    </div>
                    <div class="form-item textarea required" v-if="auditForm.status === STATUS.AUDIT_REFUSE">
                        <div class="key">{{ $t('n.reason') }}:</div>
                        <div class="value">
                            <a-textarea
                                v-model:value="auditForm.audit_message"
                                :placeholder="$t('def.input')"
                                :auto-size="{ minRows: 2, maxRows: 6 }"
                                :maxlength="99"
                            />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="auditShow = false">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleAuditSubmit" type="primary">{{ $t('def.sure') }}</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import TimeSearch from '../../components/common/TimeSearch.vue';
const STATUS = Core.Const.REFUND.STATUS;
const SEARCH_TYPE = Core.Const.REFUND.SEARCH_TYPE;

export default {
    name: 'RefundList',
    components: {
        TimeSearch,
    },
    props: {},
    data() {
        return {
            STATUS,
            loginOrgId: Core.Data.getOrgId(),
            loginOrgType: Core.Data.getOrgType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            search_type: 0,
            typeList: Core.Const.REFUND.TYPE_LIST,
            searchForm: {
                id: '',
                uid: '',
                type: undefined,
                status: undefined,
                sn: '',
                begin_time: '',
                end_time: '',
            },
            statusList: [
                { zh: '全  部', en: 'All', value: '0', color: 'primary', key: '0' },
                { zh: '待审核', en: 'Awaiting review', value: '0', color: 'yellow', key: STATUS.WAIT_AUDIT },
                { zh: '审核通过', en: 'Approved', value: '0', color: 'blue', key: STATUS.AUDIT_PASS },
                { zh: '审核失败', en: 'Review failed', value: '0', color: 'red', key: STATUS.AUDIT_REFUSE },
                { zh: '退款完成', en: 'Refund completed', value: '0', color: 'green', key: STATUS.SUCCESS },
                { zh: '取消退款', en: 'Canceled', value: '0', color: 'grey', key: STATUS.CANCEL },
            ],
            // 表格
            tableData: [],
            tableColumns: [
                { title: 'af.sn', dataIndex: 'order_sn', key: 'detail' },
                { title: 'af.price', dataIndex: 'money', key: 'money' },
                { title: 'n.state', dataIndex: 'status' },
                // {title: '退款原因', dataIndex: 'apply_message', key: 'tip_time'},
                { title: 'af.receiving', dataIndex: 'org_name' },
                { title: 'af.applicant', dataIndex: ['apply_user', 'account', 'name'], key: 'item' },
                { title: 'af.auditor', dataIndex: ['audit_user', 'account', 'name'], key: 'item' },
                { title: 'd.create_time', dataIndex: 'create_time', key: 'time' },
                { title: 'def.operate', key: 'operation', fixed: 'right', width: 100 },
            ],
            // 审核
            auditShow: false,
            auditForm: {
                id: '',
                status: '',
                audit_message: '',
            },
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let search_type = newRoute.meta ? newRoute.meta.search_type : 0;
                this.search_type = search_type;
                this.handleSearchReset(false);
                this.getStatusList();
            },
        },
    },
    computed: {},
    mounted() {},
    methods: {
        sameOrg(orgId, orgType) {
            if (this.loginOrgId === orgId && this.loginOrgType === orgType) {
                return true;
            }
            return false;
        },
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'detail': // 新建
                    routeUrl = this.$router.resolve({
                        path: '/aftersales/refund-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'purchase': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/distributor/purchase-order-detail',
                        query: { id: item.order_id },
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
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            let org_info = {};
            if (this.search_type === SEARCH_TYPE.SELF) {
                org_info.org_id = this.loginOrgId;
                org_info.org_type = this.loginOrgType;
            } else {
                org_info.supply_org_id = this.loginOrgId;
                org_info.supply_org_type = this.loginOrgType;
            }
            // return
            Core.Api.Refund.list({
                ...this.searchForm,
                ...org_info,
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
            this.loading = true;
            this.loading = false;
            let orgId = 0;
            let orgType = 0;
            let supplyOrgId = 0;
            let supplyOrgType = 0;
            if (this.search_type === SEARCH_TYPE.SELF) {
                orgId = this.loginOrgId;
                orgType = this.loginOrgType;
            } else {
                supplyOrgId = this.loginOrgId;
                supplyOrgType = this.loginOrgType;
            }
            Core.Api.Refund.status({
                org_id: orgId,
                org_type: orgType,
                supply_org_id: supplyOrgId,
                supply_org_type: supplyOrgType,
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
        // 取消退款申请
        handleCancel(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_cancel'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Refund.cancel({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.canceled'));
                            _this.getStatusList();
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        // 退款审核
        handleAuditShow(id) {
            // 显示弹框
            this.auditShow = true;
            this.auditForm.id = id;
        },
        handleAuditClose() {
            // 关闭弹框
            this.auditShow = false;
        },
        handleAuditSubmit() {
            // 审核提交
            this.loading = true;
            Core.Api.Refund.audit({
                ...this.auditForm,
            })
                .then(res => {
                    console.log('handleAuditSubmit res', res);
                    this.handleAuditClose();
                    this.getTableData();
                    this.getStatusList();
                })
                .catch(err => {
                    console.log('handleAuditSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 确认退款
        handleRefundConfirm(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_audit'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Refund.handle({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.operate'));
                            _this.getStatusList();
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang="less">
/* #RefundList {} */
</style>
