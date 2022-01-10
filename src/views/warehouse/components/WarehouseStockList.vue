<template>
    <div class="WarehouseStockList gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-button type="primary" ghost @click="routerChange('edit')" style="margin-bottom: 10px;"
                          class="panel-btn"><i class="icon i_add"/>库存增减
                </a-button>
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record}">
                        <template v-if="column.key === 'item-name'">
                            <a-tooltip placement="top" :title='text'>
                                {{  text ? text.name : '-' }}
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item-code'">
                                {{ text? text.code : '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'stock'">
                            {{ text || '-' }}
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size='pageSize'
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => `共${total}条`"
                    :hide-on-single-page='false'
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
    name: 'WarehouseStockList',
    components: {},
    props: {
        warehouse_id: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {}
            }
        },
        type: {
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
            warehouse_id: '',
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                {title: '商品名称', dataIndex: 'item', key: 'item-name'},
                {title: '商品编码', dataIndex: 'item', key: 'item-code'},
                {title: '库存数量', dataIndex: 'stock', key: 'item'},
            ]
            return tableColumns
        },
    },
    mounted() {
        this.warehouse_id = Number(this.$route.query.id) || 0
        this.getTableData();
    },
    methods: {
        routerChange(type) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/stock-edit",
                        query: {id: this.warehouse_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.Stock.list({
                warehouse_id: this.warehouse_id,
                page: this.currPage,
                page_size: this.pageSize,
            }).then(res => {
                console.log("getTableData res", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },


    }
};
</script>

<style lang="less" scoped>
//#WarehouseStockList{}
</style>