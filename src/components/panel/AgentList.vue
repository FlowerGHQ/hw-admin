<template>
    <div class="AgentList gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('a.list_of_retailers') }}</div>
        </div>
        <div class="panel-content">
            <div class="table-container">
                <a-button
                    type="primary"
                    ghost
                    @click="routerChange('edit')"
                    v-if="$auth('agent.save')"
                    class="panel-btn"
                    ><i class="icon i_add" />{{ $t('a.new_retailer') }}</a-button
                >
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail' && $auth('agent.detail')">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                    text || '-'
                                }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="text ? 'green' : 'red'">
                                {{ text ? $t('def.enable_ing') : $t('def.disable_ing') }}
                            </div>
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)" v-if="$auth('agent.detail')"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                            >
                            <a-button type="link" @click="routerChange('edit', record)" v-if="$auth('agent.save')"
                                ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleStatusChange(record)"
                                :class="record.status ? 'danger' : ''"
                            >
                                <template v-if="record.status && $auth('agent.delete')"
                                    ><i class="icon i_forbidden" />{{ $t('def.disable') }}</template
                                >
                                <template v-if="!record.status && $auth('agent.enable')"
                                    ><i class="icon i_enable" />{{ $t('def.enable') }}</template
                                >
                            </a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
export default {
    name: 'AgentList',
    components: {},
    props: {
        distributorId: {
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
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: this.$t('d.name'), dataIndex: 'name', key: 'detail' },
                { title: this.$t('n.country'), dataIndex: 'country', key: 'country' },
                { title: this.$t('n.phone'), dataIndex: 'phone' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('n.state'), dataIndex: 'status', key: 'status' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            if (this.$i18n.locale === 'en') {
                tableColumns.splice(1, 1, { title: this.$t('n.country'), dataIndex: 'country_en', key: 'country' });
            }
            /*if (this.$auth('ADMIN')) {
                tableColumns.splice(1, 0, {title: '所属分销商', dataIndex: 'distributor_name', key: 'name'})
            }*/
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
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/distributor/agent-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/distributor/agent-detail',
                        query: { id: item.id },
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
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Agent.list({
                distributor_id: this.distributorId,
                type: this.type,
                page: this.currPage,
                page_size: this.pageSize,
                status: 1,
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
        handleStatusChange(record) {
            let _this = this;
            this.$confirm({
                title:
                    _this.$t('pop_up.sure') +
                    `${record.status ? _this.$t('pop_up.disable') : _this.$t('pop_up.enable')}` +
                    _this.$t('pop_up.agent'),
                okText: this.$t('pop_up.yes'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Agent.updateStatus({ id: record.id })
                        .then(() => {
                            _this.$message.success(
                                `${record.status ? _this.$t('pop_up.success_disable') : _this.$t('pop_up.success_enable')}` +
                                    _this.$t('pop_up.success'),
                            );
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleStatusChange err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang="less" scoped>
.AgentList {
    .table-container {
        margin-top: -10px;
    }
}
</style>
