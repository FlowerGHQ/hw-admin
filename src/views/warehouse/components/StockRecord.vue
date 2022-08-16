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
                            {{ text || 0 }} {{ $t('i.pcs2') }}
                        </template>
                        <template v-if="column.type && column.type === 'item'">
                            <template v-if="record.target_type === 1 && column.key === 'name'">
                                <a-tooltip placement="top" :title='record.item[column.key]'>
                                    <div class="ell" style="max-width: 120px">
                                        <a-button type="link" @click="routerChange('item', record)">
                                            {{ record.item.name || '-' }}
                                        </a-button>
                                    </div>
                                </a-tooltip>
                            </template>
                            <template v-if="record.target_type === 1 && column.key === 'code'">
                                {{ record.item.code || '-' }}
                            </template>
                            <template v-if="record.target_type === 2 && column.key === 'name'">
                                <a-tooltip placement="top" :title='record.material[column.key]'>
                                    <div class="ell" style="max-width: 120px">
                                        <a-button type="link" @click="routerChange('material', record)">
                                            {{ record.material.name || '-' }}
                                        </a-button>
                                    </div>
                                </a-tooltip>
                            </template>

                            <template v-if="record.target_type === 2 && column.key === 'code'">
                                {{ record.material.code || '-' }}
                            </template>
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.stockRecordFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'source_type'">
                            {{ $Util.sourceFormFilter(text, $i18n.locale) }}
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
                    :show-total="(total) => $t('n.all_total') + ` ${total} ` + $t('in.total')"
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
                {title: this.$t('wa.object'), type: "item", key: "name"},
                {title: this.$t('i.code'), type: "item", key: "code"},
                {title: this.$t('n.operation'), dataIndex: "type", key: "type"},
                {title: this.$t('i.quantity'), dataIndex: "amount", key: "count"},
                {title: this.$t('wa.amount'), dataIndex: "balance", key: "count"},
                {title: this.$t('n.source'), dataIndex: "source_type", key: "source_type"},
                {title: this.$t('n.source_number'), dataIndex: "sn", key: "detail" },
                {title: this.$t('d.create_time'), dataIndex: "create_time", key: "time"},
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
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'material':
                    routeUrl = this.$router.resolve({
                        path: "/production/material-detail",
                        query: {id: item.target_id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: {id: item.target_id}
                    })
                    window.open(routeUrl.href, '_blank')
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