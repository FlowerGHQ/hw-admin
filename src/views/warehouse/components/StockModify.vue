<template>
    <div class="StockRecord gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="(record) => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text }">
                        <template v-if="column.key === 'item-name'">
                            <a-tooltip placement="top" :title="text">
                                {{ text ? text.name : "-" }}
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item-code'">
                            {{ text ? text.code : "-" }}
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.stockRecordFilter(text) }}
                        </template>
                        <template v-if="column.key === 'amount'">
                            {{ text || 0 }}
                        </template>
                        <template v-if="column.dataIndex === 'balance'">
                            {{ text || 0 }}
                        </template>
                        <template v-if="column.dataIndex === 'source_type'">
                            {{ $Util.stockRecordSourceFilter(text) }}
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
                    :show-total="(total) => `共${total}条`"
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
import Core from "../../../core";

export default {
    name: "StockRecord",
    components: {},
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
    },
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 10,
            total: 0,
            list: "",
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                {title: "工单编号", dataIndex: "item", key: "item-name"},
                {title: "车架号", dataIndex: "item", key: "item-code"},
                {title: "操作人", dataIndex: "type", key: "type"},
                {title: "完成时间", dataIndex: "amount", key: "amount"},
            ];
            return tableColumns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.create_time = [];
            this.pageChange(1);
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log("pageSizeChange size:", size);
            this.pageSize = size;
            this.getTableData();
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Stock.stockRecordList({
                // ...this.searchForm,
                warehouse_id: this.warehouseId,
                begin_time: this.create_time[0] || "",
                end_time: this.create_time[1] || "",
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then((res) => {
                    console.log("getTableData res", res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch((err) => {
                    console.log("getTableData err", err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
//#StockRecord {}
</style>