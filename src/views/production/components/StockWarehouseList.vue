<template>
    <div id="StockWarehouseList">
        <div class="list-container">
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail' && $auth('warehouse.detail')">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record.warehouse_id)">{{
                                    text || '-'
                                }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.warehouseTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'stock'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'address'">
                            {{ $Util.addressFilter(record.warehouse, $i18n.locale) }}
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

export default {
    name: 'StockWarehouseList',
    components: {},
    props: {
        targetId: {
            type: Number,
        },
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            tableColumns: [
                { title: this.$t('wa.warehouse_name'), dataIndex: ['warehouse', 'name'], key: 'detail' },
                { title: this.$t('wa.type'), dataIndex: ['warehouse', 'type'], key: 'type' },
                { title: this.$t('wa.quantity'), dataIndex: 'stock', key: 'stock' },
                { title: this.$t('wa.address'), dataIndex: 'warehouse', key: 'address' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
            ],
            tableData: [],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, warehouse_id) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/warehouse-detail',
                        query: { id: warehouse_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'list': // 列表
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/warehouse-list',
                        query: { id: this.warehouse_id },
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
            Core.Api.Stock.list({
                target_type: Core.Const.STOCK.TARGET_TYPE.MATERIAL,
                target_id: this.targetId,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list.map(item => ({
                        create_time: item.create_time,
                        stock: item.stock,
                        warehouse: item.warehouse,
                        warehouse_id: item.warehouse_id,
                    }));
                    /*if(this.routerChange('detail')) {
                    this.warehouse_id = this.tableData.map(item => item.warehouse_id)
                }*/
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
// #StockWarehouseList {}
</style>
