<template>
    <div id="MaterialPurchaseList" class="list-container">
        <div class="title-container">
            <div class="title-area">采购订单列表</div>
            <div class="btns-area">
                <a-button type="primary" @click="handleMaterialPurchase" v-if="$auth('material-purchase-order.save')"
                    ><i class="icon i_add" />新建采购单</a-button
                >
            </div>
        </div>
        <div class="tabs-container colorful">
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
                    <div class="key">订单号:</div>
                    <div class="value">
                        <a-input
                            placeholder="请输入采购订单号"
                            v-model:value="searchForm.sn"
                            @keydown.enter="handleSearch"
                        />
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                    <div class="key">创建时间:</div>
                    <div class="value">
                        <TimeSearch @search="handleOtherSearch" ref="TimeSearch" />
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
                :loading="loading"
            >
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'detail' && $auth('material-purchase-order.detail')">
                        <a-tooltip placement="top" :title="text">
                            <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'contact'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'stock_in_amount'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'total'">
                        {{ text + '件' || '-' }}
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div
                            class="status status-bg status-tag"
                            :class="$Util.materialPurchaseStatusFilter(text, 'color')"
                        >
                            <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                                {{ $Util.materialPurchaseStatusFilter(text) }}
                                <template v-if="[STATUS.REFUSE].includes(record.status)">
                                    <i class="icon i_hint" style="font-size: 12px; padding-left: 6px" />
                                </template>
                            </a-tooltip>
                        </div>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'total_price'"> ￥{{ $Util.countFilter(text) }} </template>
                    <template v-if="column.key === 'operation'">
                        <a-button
                            type="link"
                            v-if="record.status !== STATUS.INIT && $auth('material-purchase-order.detail')"
                            @click="routerChange('detail', record)"
                            ><i class="icon i_detail" />详情
                        </a-button>
                        <a-button
                            type="link"
                            v-if="record.status === STATUS.INIT && $auth('material-purchase-order.save')"
                            @click="routerChange('detail', record)"
                            ><i class="icon i_edit" />编辑
                        </a-button>
                        <a-button
                            type="link"
                            v-if="record.status === STATUS.INIT && $auth('material-purchase-order.delete')"
                            @click="handleCancel(record.id)"
                            class="danger"
                            ><i class="icon i_close_c" />取消
                        </a-button>
                        <AuditHandle
                            v-if="record.status === STATUS.SUBMIT && $auth('material-purchase-order.audit')"
                            btnType="link"
                            :api-list="['MaterialPurchase', 'audit']"
                            :id="record.id"
                            @submit="getTableData"
                            :s-pass="STATUS.PASS"
                            :s-refuse="STATUS.REFUSE"
                            no-refuse
                            ><i class="icon i_audit" />审核
                        </AuditHandle>
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
import TimeSearch from '@/components/common/TimeSearch.vue';
import EditBomModel from './components/EditBomModel.vue';
import AuditHandle from '@/components/popup-btn/AuditHandle.vue';

const MATERIAL_PURCHASE = Core.Const.MATERIAL_PURCHASE;
const STATUS = MATERIAL_PURCHASE.STATUS;

export default {
    name: 'MaterialPurchaseList',
    components: {
        TimeSearch,
        EditBomModel,
        AuditHandle,
    },
    props: {},
    data() {
        return {
            MATERIAL_PURCHASE,
            STATUS,
            currPage: 1,
            pageSize: 20,
            total: 0,
            loading: false,
            searchForm: {
                sn: '',
                begin_time: '',
                end_time: '',
                status: 1,
            },
            form: {
                id: '',
                supplier_id: undefined,
            },
            supplierList: [],
            tableData: [],
            tableColumns: [
                { title: '订单号', dataIndex: 'sn', key: 'detail' },
                { title: '状态', dataIndex: 'status' },
                { title: '物料总数量', dataIndex: 'total', key: 'total' },
                { title: '总金额', dataIndex: 'total_price', key: 'total_price' },
                // {title: '已入库数量', key: 'stock_in_amount'},
                { title: '制单人', dataIndex: ['apply_user', 'account', 'name'], key: 'contact' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '审核人', dataIndex: ['audit_user', 'account', 'name'], key: 'contact' },
                { title: '审核时间', dataIndex: 'audit_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right' },
            ],
            statusList: [
                { text: '全  部', value: '0', color: 'primary', key: '1' },
                { text: '待提交', value: '0', color: 'orange', key: '0' },
                { text: '待审核', value: '0', color: 'yellow', key: '100' },
                { text: '审核通过', value: '0', color: 'blue', key: '200' },
                { text: '审核未通过', value: '0', color: 'red', key: '-200' },
                { text: '已入库', value: '0', color: 'green', key: '500' },
                { text: '已取消', value: '0', color: 'grey', key: '-100' },
            ],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
        this.getSupplierList();
        this.getStatusStat();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail':
                    routeUrl = this.$router.resolve({
                        path: '/production/material-purchase-detail',
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
            this.getStatusStat();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.pageSize = size;
            this.getTableData();
            this.getStatusStat();
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
        getSupplierList() {
            Core.Api.Supplier.listAll().then(res => {
                this.supplierList = res.list;
            });
        },
        getStatusStat() {
            // 获取 状态统计 数据
            this.loading = true;
            Core.Api.MaterialPurchase.statusList({
                ...this.searchForm,
            })
                .then(res => {
                    console.log('getStatusStat res:', res);
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
        getTableData() {
            Core.Api.MaterialPurchase.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.tableData = res.list;
                    this.total = res.count;
                    this.getStatusStat();
                })
                .catch(err => {
                    console.log('getTableData err', err);
                });
        },

        handleCancel(id) {
            let _this = this;
            this.$confirm({
                title: '确定要取消该采购单吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.MaterialPurchase.cancel({ id })
                        .then(() => {
                            _this.$message.success(_this.$('pop_up.canceled'));
                            _this.getTableData();
                            this.getStatusStat();
                        })
                        .catch(err => {
                            console.log('handleCancel err', err);
                        });
                },
            });
        },
        handleMaterialPurchase() {
            Core.Api.MaterialPurchase.save()
                .then(() => {
                    this.$message.success('创建成功');
                    this.getTableData();
                    this.getStatusStat();
                    // this.routerChange('detail', res.detail);
                })
                .catch(err => {
                    console.log('handleMaterialPurchase err', err);
                });
        },
    },
};
</script>

<style lang="less"></style>
