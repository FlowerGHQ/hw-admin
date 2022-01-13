<template>
    <div class="StoreList gray-panel no-margin">
        <div class="panel-title">
            <div class="title">零售商列表</div>
        </div>
        <div class="panel-content">
            <div class="table-container">
                <a-button type="primary" ghost @click="routerChange('edit')" style="margin-bottom: 10px;" class="panel-btn"><i class="icon i_add"/>新增零售商</a-button>
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id"  :pagination='false'>
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'detail'">
                            <div class="table-img">
                                <a-tooltip placement="top" :title='text'>
                                    <a-button type="link" @click="routerChange('detail', record)" style="margin-left: 6px;">{{text || '-'}}</a-button>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="text ? 'green' : 'red'">
                                {{ text ? '启用中' : '已禁用' }}
                            </div>
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/> 详情</a-button>
                            <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/> 修改1</a-button>
                            <a-button type='link' @click="handleStatusChange(record)" :class="record.status ? 'danger' : ''">
                                <template v-if="record.status"><i class="icon i_forbidden"/>禁用</template>
                                <template v-else><i class="icon i_enable"/>启用</template>
                            </a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../core';
export default {
    name: 'AgentList',
    components: {},
    props: {
        agent_id: {
            type: Number,
        },
        distributor_id: {
            type: Number,
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
            tableData: []

        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: '零售商', dataIndex: 'name' },
                { title: '国家', dataIndex: 'country' },
                { title: '手机号', dataIndex: 'phone' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '状态', dataIndex: 'status', key: 'status' },
                { title: '操作', key: 'operation', fixed: 'right'},
            ]
            if (this.$auth('ADMIN')) {
                tableColumns.splice(1, 0, {title: '所属分销商', dataIndex: 'distributor_name', key: 'name'})
            }
            return tableColumns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/agent/agent-edit",
                        query: {id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':    // 详情
                    routeUrl = this.$router.resolve({
                        path: "/agent/agent-detail",
                        query: { id: item.id }
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
            Core.Api.Agent.list({
                distributor_id: this.distributor_id,
                type: this.type,
                page: this.currPage,
                page_size: this.pageSize,
                status: 1,
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
        // 删除 零售商
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该零售商吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Agent.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        handleStatusChange(record) {
            let _this = this;
            this.$confirm({
                title: `确定要${record.status ? '禁用' : '启用'}该零售商吗？`,
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Agent.updateStatus({id:record.id}).then(() => {
                        _this.$message.success(`${record.status ? '禁用' : '启用'}成功`);
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleStatusChange err", err);
                    })
                },
            });
        }
    }
};
</script>

<style lang="less" scoped>
// #AgentList {}
</style>