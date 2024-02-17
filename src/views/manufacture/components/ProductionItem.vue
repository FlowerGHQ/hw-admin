<template>
    <div class="ProductionItem gray-panel no-margin">
        <div class="panel-title">
            <div class="title">已生产产品列表</div>
            <div class="btn-area" v-if="$auth('invoice.save')">
                <a-button type="primary" @click="routerChange('put_in')" class="panel-btn"
                    ><i class="icon i_add" />产品入库</a-button
                >
            </div>
        </div>
        <div class="panel-content">
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <!-- <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/>详情</a-button>
                        <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/>编辑</a-button>
                        <a-button type='link' @click="handleStatusChange(record)" :class="record.status ? 'danger' : ''">
                            <template v-if="record.status"><i class="icon i_forbidden"/>禁用</template>
                            <template v-else><i class="icon i_enable"/>启用</template>
                        </a-button> -->
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
export default {
    name: 'ProductionItem',
    components: {},
    props: {
        orderId: {
            type: Number,
        },
        type: {
            type: Number,
        },
        id: {
            type: Number,
        },
    },
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: '产品名称', dataIndex: ['item', 'name'], key: 'detail' },
                { title: '产品编号', dataIndex: 'item_code', key: 'item' },
                { title: '产品实例号', dataIndex: 'uid', key: 'item' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right' },
            ];
            return tableColumns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'put_in': // 实例入库
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-edit',
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
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Entity.list({
                production_order_id: this.id,
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
        // 删除
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该产品吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Entity.delete({ id })
                        .then(() => {
                            _this.$message.success('删除成功');
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang="less" scoped>
.ProductionItem {
    .table-container {
        margin-top: -10px;
    }
}
</style>
