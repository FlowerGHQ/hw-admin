<template>
<div id="WarehouseList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">仓库列表</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新建仓库</a-button>
            </div>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='8' class="search-item">
                    <div class="key">仓库名称:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.warehouse_id" placeholder="请选择仓库">
                            <a-select-option v-for="warehouse of warehouseList" :key="warehouse.id" :value="warehouse.id">{{ warehouse.name }}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                    <div class="key">创建时间:</div>
                    <div class="value">
                        <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch" :show-time="defaultTime" :allow-clear='false'>
                            <template #suffixIcon><i class="icon i_calendar"/></template>
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
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false'>
                <template #bodyCell="{ column, text , record}">
                    <template v-if="column.key === 'detail'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'type'">
                        {{ $Util.stockTypeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'address'">
                        {{ $Util.addressFilter(record) }}
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/> 修改</a-button>
                        <a-button type="link" @click="handleDelete(record.id)" class="danger"><i class="icon i_delete"/> 删除</a-button>
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
import Core from '../../core';

export default {
    name: 'WarehouseList',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            warehouseList: [],
            create_time: [],
            searchForm: {
               warehouse_id: undefined,
                // country: undefined,
            },

            tableColumns: [
                {title: '仓库名称', dataIndex: 'name',key: 'detail',},
                {title: '仓库类型', dataIndex: 'type',key: 'type',},
                {title: '仓库地址', key:'address', dataIndex: 'province'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right' },
            ],
            tableData: [],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
        this.getWarehouseList();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/warehouse-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':    // 详情
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/warehouse-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        pageChange(curr) {    // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {    // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {    // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            console.log('this.searchForm:', this.searchForm)
            this.create_time = []
            this.pageChange(1);
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list
            })
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            this.loading = false;
            // return
            Core.Api.Warehouse.list({
                ...this.searchForm,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该仓库吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Warehouse.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
    }
};
</script>

<style lang="less" scoped>
// #WarehouseList {}
</style>