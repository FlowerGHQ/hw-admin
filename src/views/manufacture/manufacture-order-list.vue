<template>
    <div id="ManufactureList" class="list-container">
        <div class="title-container">
            <div class="title-area">生产单列表</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')" v-if="$auth('production-order.save')"
                    ><i class="icon i_add" />新建生产单</a-button
                >
            </div>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                    <div class="key">生产单名称:</div>
                    <div class="value">
                        <a-input
                            placeholder="请输入生产单名称"
                            v-model:value="searchForm.name"
                            @keydown.enter="handleSearch"
                        />
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                    <div class="key">领料仓库:</div>
                    <div class="value">
                        <a-select
                            v-model:value="searchForm.warehouse_id"
                            placeholder="请选择领料仓库"
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
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                    <div class="key">BOM表:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.bom_id" placeholder="请选择BOM表" @change="handleSearch">
                            <a-select-option
                                v-for="item of bomList"
                                :key="item.id"
                                :value="item.id"
                                :title="item.name"
                                >{{ item.name }}</a-select-option
                            >
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                    <div class="key">创建时间:</div>
                    <div class="value"><TimeSearch @search="handleOtherSearch" ref="TimeSearch" /></div>
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
            >
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'detail' && $auth('production-order.detail')">
                        <a-tooltip placement="top" :title="text">
                            <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }} </a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'warehouse' && $auth('warehouse.detail')">
                        <a-tooltip placement="top" :title="text">
                            <a-button type="link" @click="routerChange('warehouse', record)"
                                >{{ text || '-' }}
                            </a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'count'">
                        {{ text ? text + '件' : '-' }}
                    </template>
                    <template v-if="column.key === 'spec'">
                        {{ $Util.itemSpecFilter(text) }}
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status status-bg status-tag" :class="$Util.productionStatusFilter(text, 'color')">
                            {{ $Util.productionStatusFilter(text) }}
                        </div>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button
                            type="link"
                            @click="routerChange('detail', record)"
                            v-if="$auth('production-order.detail')"
                            ><i class="icon i_detail" />详情</a-button
                        >
                        <a-button
                            type="link"
                            @click="handleCancel(record.id)"
                            class="danger"
                            v-if="$auth('production-order.delete')"
                            ><i class="icon i_close_c" />取消</a-button
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
</template>

<script>
import Core from '../../core';
export default {
    name: 'ManufactureList',
    components: {},
    props: {},
    data() {
        return {
            // 分页
            current: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            warehouseList: [],
            bomList: [],
            searchForm: {
                name: '',
                warehouse_id: undefined,
                bom_id: undefined,
                begin_time: '',
                end_time: '',
            },
            // 表格
            tableColumns: [
                { title: '生产单编号', dataIndex: 'uid', key: 'detail' },
                { title: '名称', dataIndex: 'name', key: 'item' },
                { title: '状态', dataIndex: 'status' },
                { title: '生产产品', dataIndex: ['item', 'name'], key: 'item' },
                { title: '产品规格', dataIndex: ['item', 'attr_list'], key: 'spec' },
                { title: 'BOM表', dataIndex: 'bom_name', key: 'item' },
                { title: '生产数量', dataIndex: 'amount', key: 'count' },
                { title: '领料仓库', dataIndex: 'warehouse_name', key: 'warehouse' },
                { title: '备注', dataIndex: 'remark', key: 'item' },
                { title: '创建人', dataIndex: 'apply_user_name', key: 'item' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right' },
            ],
            tableData: [],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getWarehouseList();
        this.getBomList();
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'edit':
                    routeUrl = this.$router.resolve({
                        path: '/manufacture/manufacture-order-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail':
                    routeUrl = this.$router.resolve({
                        path: '/manufacture/manufacture-order-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'warehouse':
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/warehouse-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
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
        handleSearchReset(flag = true) {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            if (flag) {
                this.$refs.TimeSearch.handleReset();
            }
            this.pageChange(1);
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list;
            });
        },
        getBomList() {
            Core.Api.Bom.listAll({
                type: 1, // 1.生产，2.售后
            }).then(res => {
                this.bomList = res.list;
            });
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.ProductionOrder.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 取消生产单
        handleCancel(id) {
            let _this = this;
            this.$confirm({
                title: '确定要取消该生产单吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.ProductionOrder.cancel({ id })
                        .then(() => {
                            _this.$message.success(_this.$('pop_up.canceled'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleCancel err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang="less" scoped></style>
