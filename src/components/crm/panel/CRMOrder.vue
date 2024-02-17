<template>
    <div class="InformationInfo gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('crm_o.list') }}</div>
            <slot></slot>
        </div>
        <div class="panel-content">
            <div>
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    @change="getTableDataSorter"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                    text || '-'
                                }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'phone'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text, 3) }}
                        </template>
                        <template v-if="column.key === 'util'">
                            {{ $Util[column.util](text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                            >
                        </template>
                    </template>
                </a-table>
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
    </div>
</template>

<script>
import Core from '../../../core';

export default {
    name: 'InformationInfo',
    components: {},
    props: {
        detail: {
            type: Object,
        },
        customerId: {
            type: Number,
            default: 0,
        },
        targetId: {
            type: Number,
            default: 0,
        },
        targetType: {
            type: Number,
            default: 0,
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
            // 表格数据
            tableData: [],
            trackMemberShow: false,

            userId: '',
            userDetail: '',
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: 'crm_o.name', dataIndex: 'name', key: 'item', sorter: true },
                // {title: 'crm_o.customer_name', dataIndex: 'customer_name', key:'item', sorter: true},
                { title: 'crm_o.own_user_name', dataIndex: 'own_user_name', key: 'item', sorter: true },
                { title: 'crm_o.signing_date', dataIndex: 'date', key: 'time', sorter: true },
                // {title: 'crm_o.status', dataIndex: 'status', key: 'util', util: 'CRMOrderStatusFilter', sorter: true},
                // {title: 'crm_o.paid_money_progress', dataIndex: 'paid_money_progress', key:'item', sorter: true},
                // {title: 'd.update_time', dataIndex: 'update_time', key: 'time', sorter: true},
                // {title: 'crm_o.create_user', dataIndex: "create_user_name", key: 'item', sorter: true},
                // {title: 'd.create_time', dataIndex: 'create_time', key: 'time', sorter: true},
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ];
            return columns;
        },

        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/system/user-edit',
                        query: {
                            id: item.id,
                            org_id: this.orgId,
                            org_type: this.orgType,
                            type: this.type,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/crm-order/order-detail',
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
            Core.Api.CRMOrder.list({
                customer_id: this.customerId,
                source_id: this.targetId,
                source_type: this.targetType,
                search_type: 30,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
                    console.log('🚀 ~ file: order-list.vue ~ line 229 ~ getTableData ~ this.tableData', this.tableData);
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete -> err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang="less" scoped>
.InformationInfo {
    .table-container {
        margin-top: -10px;
    }
}
.ant-descriptions-view {
    th.ant-descriptions-item-label {
        width: 25%;
    }
    td.ant-descriptions-item-content {
        width: 25%;
    }
}
</style>
