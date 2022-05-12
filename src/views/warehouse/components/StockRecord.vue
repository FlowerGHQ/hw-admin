<template>
    <div class="StockRecord gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="(record) => record.id" :pagination="false">
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail' && $auth('invoice.detail')">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'count'">
                            {{ text || 0 }} 件
                        </template>
                        <template v-if="column.type && column.type === 'item'">
                            <template v-if="record.target_type === 1">
                                {{ record.item ? (record.item[column.key] || '-') : '-' }}
                            </template>
                            <template v-if="record.target_type === 2">
                                {{ record.material ? (record.material[column.key] || '-') : '-' }}
                            </template>
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.stockRecordFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'source_type'">
                            {{ $Util.sourceFormFilter(text) }}
                        </template>
                        <template v-if="column.key === 'uid'">
                            {{ text || '-' }}
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

            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                /*          { title: "变更对象", dataIndex: ['material','name'], key: "detail" },
                          { title: "变更对象编码", dataIndex: ['material','code'], key: "text" },*/
                {title: "变更对象", type: "item", key: "name"},
                {title: "变更对象编码", type: "item", key: "code"},
                {title: "操作类型", dataIndex: "type", key: "type"},
                {title: "数量", dataIndex: "amount", key: "count"},
                {title: "变更后库存数量", dataIndex: "balance", key: "count"},
                {title: "变更来源", dataIndex: "source_type", key: "source_type"},
                { title: "来源单号", dataIndex: "sn", key: "detail" },
                {title: "创建时间", dataIndex: "create_time", key: "time"},
            ];
            return tableColumns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'detail':
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/invoice-detail",
                        query: {id: item.source_id}
                    })
                    window.open(routeUrl.href, '_self')
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
            this.pageSize = size;
            this.getTableData();
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Stock.stockRecordList({
                warehouse_id: this.warehouseId,
                page: this.currPage,
                page_size: this.pageSize,
            }).then(res => {
                console.log("getTableData res", res);
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log("getTableData err", err);
            }).finally(() => {
                this.loading = false;
            });
        },
    },
};
</script>

<style lang="less" scoped>
//#StockRecord {}
</style>