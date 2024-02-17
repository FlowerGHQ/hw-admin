<template>
    <div id="AftersalesList" class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('af.list') }}</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')" v-if="!$auth('ADMIN')"
                    ><i class="icon i_add" />{{ $t('af.sales') }}</a-button
                >
            </div>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                    <div class="key">{{ $t('af.number') }}:</div>
                    <div class="value">
                        <a-input
                            :placeholder="$t('def.input')"
                            v-model:value="searchForm.sn"
                            @keydown.enter="handleSearch"
                        />
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                    <div class="key">{{ $t('af.sn') }}:</div>
                    <div class="value">
                        <a-input
                            :placeholder="$t('def.input')"
                            v-model:value="searchForm.order_sn"
                            @keydown.enter="handleSearch"
                        />
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                    <div class="key">{{ $t('n.type') }}:</div>
                    <div class="value">
                        <a-select
                            :placeholder="$t('def.select')"
                            v-model:value="searchForm.type"
                            @change="handleSearch"
                        >
                            <a-select-option v-for="item of typeMap" :key="item.key" :value="item.key">{{
                                item[$i18n.locale]
                            }}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :xl="16" :xxl="14" class="search-item">
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
                    <template v-if="column.dataIndex === 'sn'">
                        <a-tooltip placement="top" :title="text">
                            <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.dataIndex === 'order_sn'">
                        <a-tooltip placement="top" :title="text">
                            <a-button type="link" @click="routerChange('purchase', record)">{{ text || '-' }}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.dataIndex === 'type'">
                        {{ $Util.aftersalesTypeFilter(text, $i18n.locale) }}
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status status-bg status-tag" :class="$Util.aftersalesStatusFilter(text, 'color')">
                            <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                                {{ $Util.aftersalesStatusFilter(text, $i18n.locale) }}
                            </a-tooltip>
                        </div>
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'money'">
                        {{ $Util.priceUnitFilter(record.refund_money_currency) }} {{ $Util.countFilter(text) }}
                    </template>
                    <template v-if="column.key === 'tip_time'">
                        <a-tooltip :title="text" destroyTooltipOnHide>
                            <div class="ell" style="max-width: 200px">{{ text || '-' }}</div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'org'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <AuditHandle
                            v-if="
                                record.status === STATUS.APPLY &&
                                $auth('after-sales-order.audit') &&
                                sameOrg(record.supply_org_id, record.supply_org_type)
                            "
                            btnType="link"
                            :api-list="['Aftersales', 'audit']"
                            :id="record.id"
                            @submit="getTableData"
                            :s-pass="STATUS.AUDIT_PASS"
                            :s-refuse="STATUS.AUDIT_FAIL"
                            ><i class="icon i_audit" />{{ $t('n.audit') }}
                        </AuditHandle>
                        <template v-if="canEdit(record) && sameOrg(record.org_id, record.org_type)">
                            <a-button
                                type="link"
                                @click="routerChange('edit', record)"
                                v-if="$auth('after-sales-order.edit')"
                                ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleCancel(record.id)"
                                class="danger"
                                v-if="$auth('after-sales-order.cancel')"
                                ><i class="icon i_m_error" />{{ $t('def.cancel') }}</a-button
                            >
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
</template>

<script>
import Core from '../../core';
import TimeSearch from '../../components/common/TimeSearch.vue';
import AuditHandle from '../../components/popup-btn/AuditHandle.vue';

const STATUS = Core.Const.AFTERSALES.STATUS;
const QUERY_TYPE = Core.Const.AFTERSALES.QUERY_TYPE;

export default {
    name: 'AftersalesList',
    components: {
        TimeSearch,
        AuditHandle,
    },
    props: {},
    data() {
        return {
            STATUS,
            orgId: Core.Data.getOrgId(),
            orgType: Core.Data.getOrgType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            typeMap: Core.Const.AFTERSALES.TYPE_MAP,
            query_type: '',
            searchForm: {
                type: undefined,
                sn: '',
                order_sn: '',
                begin_time: '',
                end_time: '',
                status: -1,
            },
            statusList: [],
            // 表格
            tableData: [],
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let query_type = newRoute.meta ? newRoute.meta.query_type : 0;
                this.query_type = query_type;
                this.handleSearchReset(false);
                this.getStatusList();
            },
        },
    },
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: 'af.number', dataIndex: 'sn', key: 'detail' },
                { title: 'n.state', dataIndex: 'status', key: 'status', align: 'center' },
                { title: 'n.type', dataIndex: 'type' },
                { title: 'af.price', dataIndex: 'refund_money', key: 'money' },
                { title: 'af.apply', dataIndex: 'org_name', key: 'org' },
                { title: 'af.sn', dataIndex: 'order_sn' },
                { title: 'd.create_time', dataIndex: 'create_time', key: 'time' },
                { title: 'def.operate', key: 'operation', fixed: 'right', width: 100 },
            ];
            if (this.query_type === Core.Const.AFTERSALES.QUERY_TYPE.APPLY) {
                tableColumns.splice(4, 1);
            }
            return tableColumns;
        },
    },
    mounted() {},
    methods: {
        sameOrg(orgId, orgType) {
            if (this.orgId === orgId && this.orgType === orgType) {
                return true;
            }
            return false;
        },
        canEdit(record) {
            switch (record.status) {
                case STATUS.INIT:
                case STATUS.AUDIT_FAIL:
                    return true;
                default:
                    return false;
            }
        },
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 售后单 编辑
                    routeUrl = this.$router.resolve({
                        path: '/aftersales/aftersales-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 售后单 详情
                    routeUrl = this.$router.resolve({
                        path: '/aftersales/aftersales-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'purchase': //采购单 详情
                    routeUrl = this.$router.resolve({
                        path: '/purchase/purchase-order-detail',
                        query: { id: item.order_id },
                    });
                    window.open(routeUrl.href, '_blank');
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
            // return
            Core.Api.Aftersales.list({
                ...this.searchForm,
                query_type: this.query_type,
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
                    Core.Api.Aftersales.cancel({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.canceled'));
                            _this.getStatusList();
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleCancel err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang="less" scoped></style>
