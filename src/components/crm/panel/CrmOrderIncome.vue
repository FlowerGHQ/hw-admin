<template>
    <div class="InformationInfo gray-panel no-margin">
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
                        <template v-if="column.key === 'type'">
                            <span>定金</span>
                        </template>
                        <template v-if="column.key === 'money'"> {{ currency }} {{ text / 100 }} </template>
                        <template v-if="column.key === 'date'">
                            <span>{{ $Util.timeFilter(text) }}</span>
                        </template>
                    </template>
                </a-table>
                <!-- <div class="paging-container"
            :style="{
              marginTop: '20px',
            }"
        >
          <a-pagination
            v-model:current="currPage"
            :page-size="pageSize"
            :total="total"
            show-quick-jumper
            show-size-changer
            show-less-items
            :show-total="
              (total) => $t('n.all_total') + ` ${total} ` + $t('in.total')
            "
            :hide-on-single-page="false"
            :pageSizeOptions="['10', '20', '30', '40']"
            @change="pageChange"
            @showSizeChange="pageSizeChange" />
        </div> -->
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
        orderId: {
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
            // currPage: 1,
            // pageSize: 20,
            // total: 0,
            // 表格数据
            tableData: [],
            trackMemberShow: false,

            userId: '',
            userDetail: '',
            groupStatusTableData: [],
        };
    },
    watch: {
        orderId: {
            handler(val) {
                if (val) {
                    this.getTableData();
                }
            },
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                {
                    title: 'oder_details.order_number',
                    dataIndex: 'uid',
                    key: 'detail',
                },
                { title: 'oder_details.payment_type', dataIndex: 'type', key: 'type' },
                {
                    title: 'oder_details.payment_amount',
                    dataIndex: 'money',
                    key: 'money',
                    sorter: true,
                },
                {
                    title: 'oder_details.payment_time',
                    dataIndex: 'date',
                    key: 'date',
                    sorter: true,
                },
            ];
            return columns;
        },
        currency() {
            return this.detail.currency === 'eur' ? '€' : '￥';
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        // this.getTableData();
        this.getGroupStatusDetail();
    },
    methods: {
        // routerChange(type, item = {}) {
        //     let routeUrl = ''
        //     switch (type) {
        //         case 'detail':    // 编辑
        //             routeUrl = this.$router.resolve({
        //                 path: "/crm-order-income/order-income-detail",
        //                 query: { id: item.id }
        //             })
        //             window.open(routeUrl.href, '_self')
        //             break;
        //         case 'edit':    // 编辑
        //             routeUrl = this.$router.resolve({
        //                 path: "/crm-bo/bo-edit",
        //                 query: {id: item.id}
        //             })
        //             window.open(routeUrl.href, '_self')
        //             break;
        //     }
        // },
        // pageChange(curr) {
        //   // 页码改变
        //   this.currPage = curr;
        //   this.getTableData();
        // },
        // pageSizeChange(current, size) {
        //   // 页码尺寸改变
        //   console.log("pageSizeChange size:", size);
        //   this.pageSize = size;
        //   this.getTableData();
        // },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMOrderIncome.list({
                order_id: this.orderId,
                // page: this.currPage,
                // page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    // this.total = res.count;
                    this.tableData = res.list;
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
    padding: 0 !important;
    padding-bottom: 116px !important;
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
