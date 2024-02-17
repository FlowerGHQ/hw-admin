<template>
    <div class="InformationInfo gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('crm_refund.refund_record') }}</div>
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
                        <!--                        <template v-if="column.key === 'detail'">
                                                <a-tooltip placement="top" :title='text'>
                                                    <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                                                </a-tooltip>
                                            </template>-->
                        <template v-if="column.key === 'money'">
                            {{ record.mType }}{{ $Util.countFilter(text) }}
                        </template>
                        <template v-if="column.key === 'total_amount'">
                            {{ record.mType }}{{ $Util.countFilter(text) }}
                        </template>
                        <template v-if="column.key === 'refunded_amount'">
                            {{ record.mType }}{{ $Util.countFilter(text) }}
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.CRMRefundRecordTypeMapFilter(text) }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>

                        <template v-if="column.key === 'operation'">
                            <a-button
                                type="link"
                                @click="routerChange('detail', record)"
                                v-if="$auth('customer.detail')"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                            >
                            <!--                        <a-button type="link" @click="routerChange('edit',record)" v-if="$auth('customer.save')"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>-->
                            <!--                        <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="$auth('customer.delete')"><i class="icon i_delete"/> {{ $t('def.delete') }}</a-button>-->
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
        orderIncomeId: {
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
            groupStatusTableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: 'crm_refund.type', dataIndex: 'type', key: 'type' },
                // {title: 'crm_b.customer_name', dataIndex: 'customer_name', key:'customer_name', sorter: true},
                { title: 'crm_refund.money', dataIndex: 'money', key: 'money' },
                { title: 'crm_refund.total_amount', dataIndex: 'total_amount', key: 'total_amount' },
                { title: 'crm_refund.refunded_amount', dataIndex: 'refunded_amount', key: 'refunded_amount' },
                { title: 'crm_refund.remark', dataIndex: 'remark', key: 'remark' },
                // {title: 'crm_b.estimated_deal_time', dataIndex: 'estimated_deal_time', key: 'estimated_deal_time', sorter: true},
                // {title: 'r.creator_name', dataIndex: 'creator_name', key: 'time', sorter: true},
                { title: 'crm_refund.time', dataIndex: 'create_time', key: 'time' },
                // {title: 'crm_c.update_time', dataIndex: 'update_time', key: 'time', sorter: true},
                // {title: 'def.operate', key: 'operation', fixed: 'right'},
            ];
            return columns;
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.getTableData();
        this.getGroupStatusDetail();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-bo/bo-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-bo/bo-edit',
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
            Core.Api.CRMRefundRecord.list({
                order_income_id: this.orderIncomeId,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
                    this.tableData.map((item, index) => {
                        switch (item.currency) {
                            case 'usd':
                                item.mType = '$';
                                break;
                            case 'eur':
                                item.mType = '€';
                                break;
                        }
                    });
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
        getGroupStatusDetail() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMBoStatusGroup.detail({
                id: 1,
            })
                .then(res => {
                    this.groupStatusTableData = JSON.parse(res.detail.status_list);
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
