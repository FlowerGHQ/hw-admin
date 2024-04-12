<template>
    <div id="InvoiceList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('in.list') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"
                        ><i class="icon i_add" />{{ $t('in.save') }}
                    </a-button>
                </div>
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
                        <div class="key">{{ $t('wa.warehouse') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.warehouse_id"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                            >
                                <a-select-option
                                    v-for="warehouse of warehouseList"
                                    :key="warehouse.id"
                                    :value="warehouse.id"
                                    >{{ warehouse.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('in.sn') }}:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('n.type') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.type"
                                @change="handleSearch"
                                :placeholder="$t('def.select')"
                            >
                                <a-select-option v-for="item of typeMap" :key="item.key" :value="item.key"
                                    >{{ item[$i18n.locale] }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                        <div class="key">{{ $t('d.create_time') }}:</div>
                        <div class="value">
                            <TimeSearch @search="handleOtherSearch" ref="TimeSearch" />
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="operate-container">
                <a-button type="primary" @click="handleExportConfirm"
                    ><i class="icon i_download" />{{ $t('def.export') }}
                </a-button>
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
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="$Util.invoiceStatusFilter(text, 'color')">
                                <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                                    {{ $Util.invoiceStatusFilter(text, $i18n.locale) }}
                                    <template v-if="[STATUS.AUDIT_REFUSE].includes(record.status)">
                                        <i class="icon i_hint" style="font-size: 12px; padding-left: 6px" />
                                    </template>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.stockRecordFilter(text, $i18n.locale) || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'target_type'">
                            {{ $Util.targetTypeFilter(text, $i18n.locale) || '-' }}
                        </template>
                        <template v-if="column.key === 'warehouse_type'">
                            {{ $Util.warehouseTypeFilter(text, $i18n.locale) || '-' }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) || '-' }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}
                            </a-button>
                            <template v-if="record.status === STATUS.INIT">
                                <a-button type="link" @click="handleCancel(record.id)" class="danger"
                                    ><i class="icon i_close_c" />{{ $t('def.cancel') }}
                                </a-button>
                            </template>
                            <AuditMaterialPurchase
                                v-if="
                                    record.status === STATUS.FINANCE_PASS ||
                                    (record.status === STATUS.WAIT_AUDIT && record.type === TYPE.IN)
                                "
                                btnType="link"
                                :status="STATUS.WAIT_AUDIT"
                                :api-list="['Invoice', 'audit']"
                                :invoiceId="record.id"
                                @submit="getTableData"
                                ><i class="icon i_audit" />{{ $t('in.admin') }}</AuditMaterialPurchase
                            >
                            <AuditMaterialPurchase
                                v-if="record.status === STATUS.WAIT_AUDIT && record.type === TYPE.OUT && $auth('ADMIN')"
                                btnType="link"
                                :api-list="['Invoice', 'audit']"
                                :invoiceId="record.id"
                                :status="STATUS.FINANCE_PASS"
                                @submit="getTableData"
                                ><i class="icon i_audit" />{{ $t('in.finance_audit') }}</AuditMaterialPurchase
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
    </div>
</template>

<script>
import Core from '../../core';
import TimeSearch from '@/components/common/TimeSearch.vue';
import AuditMaterialPurchase from '../../components/popup-btn/AuditMaterialPurchase.vue';

const STATUS = Core.Const.STOCK_RECORD.STATUS;
const TYPE = Core.Const.STOCK_RECORD.TYPE;
export default {
    name: 'InvoiceList',
    components: {
        TimeSearch,
        AuditMaterialPurchase,
    },
    props: {},
    data() {
        return {
            STATUS,
            TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            typeMap: Core.Const.STOCK_RECORD.TYPE_MAP, //出入库
            warehouseList: [],
            searchForm: {
                warehouse_id: undefined,
                uid: '',
                status: -1,
                type: undefined,
                begin_time: '',
                end_time: '',
            },
            exportDisabled: false,

            // 表格
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('in.sn'), dataIndex: 'uid', key: 'detail' },
                { title: this.$t('in.sync_id'), dataIndex: 'sync_id', key: 'detail' },
                { title: this.$t('n.state'), dataIndex: 'status' },
                { title: this.$t('n.type'), dataIndex: 'type' },
                { title: this.$t('in.category'), dataIndex: 'target_type' },
                { title: this.$t('in.related'), dataIndex: ['warehouse', 'name'], key: 'item' },
                { title: this.$t('wa.type'), dataIndex: ['warehouse', 'type'], key: 'warehouse_type' },
                { title: this.$t('n.operator'), dataIndex: ['apply_user', 'account', 'name'], key: 'item' },
                { title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            return columns;
        },
        statusList() {
            let columns = [
                { zh: '全  部', en: 'All', value: '0', color: 'primary', key: -1 },
                { zh: '待提交', en: 'Awaiting commit', value: '0', color: 'yellow', key: STATUS.INIT },
                {
                    zh: '待财务审核',
                    en: 'Waiting for financial review',
                    value: '0',
                    color: 'blue',
                    key: STATUS.WAIT_AUDIT,
                },
                {
                    zh: '待仓库审核',
                    en: 'Waiting for warehouse review',
                    value: '0',
                    color: 'blue',
                    key: STATUS.FINANCE_PASS,
                },
                { zh: '审核失败', en: 'Review failed', value: '0', color: 'red', key: STATUS.AUDIT_REFUSE },
                { zh: '审核通过 待完成', en: 'Review passed', value: '0', color: 'blue', key: STATUS.AUDIT_PASS },
                { zh: '已完成', en: 'In the warehouse', value: '0', color: 'green', key: STATUS.CLOSE },
                { zh: '已发货', en: 'Delivery', value: '0', color: 'green', key: STATUS.DELIVERY },
                { zh: '已收货', en: 'Received', value: '0', color: 'green', key: STATUS.RECEIVED },
                { zh: '已取消', en: 'Cancelled', value: '0', color: 'grey', key: STATUS.CANCEL },
            ];
            return columns;
        },
    },
    mounted() {
        this.getTableData();
        this.getWarehouseList();
        this.getStatusList();
        this.timer = window.setInterval(() => {
            setTimeout(() => {
                this.getTableData();
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
                        path: '/warehouse/invoice-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-detail',
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
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.$refs.TimeSearch.handleReset();
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Invoice.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
                    this.getStatusList();
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
            Core.Api.Invoice.status({
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
                    console.log('total,', total);
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

        handleCancel(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure') + _this.$t('pop_up.cancel'),
                okText: _this.$t('pop_up.yes'),
                okType: 'danger',
                cancelText: _this.$t('pop_up.no'),
                onOk() {
                    Core.Api.Invoice.cancel({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.canceled'));
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

<style lang="less" scoped>
#InvoiceList {
    .list-container {
        .title-container {
            .btns-area {
                .file-upload-btn {
                    margin-left: 15px;
                }
            }
        }
    }
}
</style>
