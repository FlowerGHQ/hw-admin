<template>
    <div class="MaterialStockRecord gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <div class="search-container inline">
                    <a-row class="search-area">
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="4" class="search-item" v-if="!warehouseId">
                            <div class="key">仓库:</div>
                            <div class="value">
                                <a-select
                                    v-model:value="searchForm.warehouse_id"
                                    placeholder="请选择仓库"
                                    @change="handleSearch"
                                >
                                    <a-select-option
                                        v-for="warehouse of warehouseList"
                                        :key="warehouse.id"
                                        :value="warehouse.id"
                                        >{{ warehouse.name }}</a-select-option
                                    >
                                </a-select>
                            </div>
                        </a-col>
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="10" class="search-item">
                            <div class="key">创建时间:</div>
                            <div class="value"><TimeSearch @search="handleOtherSearch" ref="TimeSearch" /></div>
                        </a-col>
                    </a-row>
                    <div class="btn-area">
                        <a-button @click="handleSearch" type="primary">查询</a-button>
                        <a-button @click="handleSearchReset">重置</a-button>
                    </div>
                </div>
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
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                    text || '-'
                                }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'count'"> {{ text || 0 }} 件 </template>
                        <template v-if="column.type === 'item'">
                            <template v-if="record.target_type === 1">
                                {{ record.item[column.key] }}
                            </template>
                            <template v-if="record.target_type === 2">
                                {{ record.material[column.key] }}
                            </template>
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.stockRecordFilter(text) }}
                        </template>
                        <template v-if="column.key === 'warehouse_name'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'source_type'">
                            {{ $Util.sourceFormFilter(text) }}
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
import Core from '../../../core';
import TimeSearch from '@/components/common/TimeSearch.vue';
export default {
    name: 'StockRecord',
    components: {
        TimeSearch,
    },
    props: {
        warehouseId: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        targetId: {
            type: Number,
        },
    },
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 10,
            total: 0,
            tableData: [],
            warehouseList: [],
            searchForm: {
                warehouse_id: undefined,
                begin_time: '',
                end_time: '',
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: '操作类型', dataIndex: 'type', key: 'type' },
                { title: '数量', dataIndex: 'amount', key: 'count' },
                { title: '仓库', dataIndex: ['warehouse', 'name'], key: 'warehouse_name' },
                { title: '变更后库存数量', dataIndex: 'balance', key: 'count' },
                { title: '变更来源', dataIndex: 'source_type', key: 'source_type' },
                { title: '来源单号', dataIndex: 'sn', key: 'detail' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
            ];
            return tableColumns;
        },
    },
    mounted() {
        this.getTableData();
        this.getWarehouseList();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail':
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-detail',
                        query: { id: item.source_id },
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
            if (this.warehouseId) {
                this.searchForm.warehouse_id = this.warehouseId;
            }
            Core.Api.Stock.stockRecordList({
                ...this.searchForm,
                target_id: this.targetId,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err', err);
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
    },
};
</script>

<style lang="less" scoped>
//#MaterialStockRecord {}
</style>
