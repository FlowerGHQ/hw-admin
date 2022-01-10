<template>
    <div class="WarehouseStockRecord gray-panel no-margin">
        <div class="panel-content">
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='8' class="search-item">
                        <div class="key">商品名称:</div>
                        <div class="value">
                            <div class="value">
                                <a-input placeholder="请输入商品名称" v-model:value="searchForm.name"
                                         @keydown.enter='handleSearch'/>
                            </div>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value">
                            <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch"
                                            :show-time="defaultTime" :allow-clear='false'>
                                <template #suffixIcon><i class="icon i_calendar"></i></template>
                            </a-range-picker>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record}">
                        <template v-if="column.key === 'item-name'">
                            <a-tooltip placement="top" :title='text'>
                                {{ text ? text.name : '-' }}
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item-code'">
                            {{ text ? text.code : '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.stockRecordFilter(text) }}
                        </template>
                        <template v-if="column.key === 'amount'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'balance'">
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
    name: 'WarehouseStockRecord',
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
    },
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 10,
            total: 0,
            list: '',
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            searchForm: {
                name: '',
            },
            type: Core.Const.STOCK_RECORD.TYPE,
            tableData: [],
            warehouse_id: '',
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                {title: '商品名称', dataIndex: 'item', key: 'item-name'},
                {title: '商品编码', dataIndex: 'item', key: 'item-code'},
                {title: '操作类型', dataIndex: 'type', key: 'type'},
                {title: '数量', dataIndex: 'amount', key: 'amount'},
                {title: '当前库存数量', dataIndex: 'balance', key: 'balance'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
            ]
            return tableColumns
        },
    },
    mounted() {
        this.warehouse_id = Number(this.$route.query.id) || 0
        this.getTableData();
    },
    methods: {
        handleSearch() {    // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.create_time = []
            this.pageChange(1);
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
            Core.Api.Stock.stockRecordList({
                ...this.searchForm,
                warehouse_id: this.warehouse_id,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
                page: this.currPage,
                page_size: this.pageSize,
            }).then(res => {
                console.log("getTableData res", res)
                this.total = res.count;
                this.tableData = res.list;
                console.log("getTableData res", this.tableData)
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
//#WarehouseStockRecord {}
</style>