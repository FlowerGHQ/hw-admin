<template>
    <div class="InformationInfo gray-panel no-margin">
        <div class="panel-content">
            <div class="sub_title">商品信息</div>
            <div>
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    :style="{
                        marginBottom: '12px',
                    }"
                    @change="getTableDataSorter"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'status'">
                            {{
                                groupStatusTableData[text] !== undefined
                                    ? lang === 'zh'
                                        ? groupStatusTableData[text].zh
                                        : groupStatusTableData[text].en
                                    : ''
                            }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'estimated_deal_time'">
                            {{ $Util.timeFilter(text, 3) }}
                        </template>
                        <template v-if="column.key === 'price'">
                            {{ moneyT + $Util.countFilter(text) }}
                        </template>
                        <template v-if="column.key === 'discount'"> {{ text }}% </template>
                    </template>
                </a-table>
                <!-- <div class="paging-container">
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
        <div class="panel-content">
            <div class="sub_title">支付信息</div>
            <CrmOrderIncome :detail="detail" :orderId="detail.id" ref="CrmOrderIncome" />
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
import CrmOrderIncome from '@/components/crm/panel/CrmOrderIncome.vue';

export default {
    name: 'InformationInfo',
    components: {
        CrmOrderIncome,
    },
    props: {
        detail: {
            type: Object,
        },
        sourceId: {
            type: Number,
            default: 0,
        },
        sourceType: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // // 分页
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
        sourceId: {
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
                { title: 'n.name', dataIndex: 'name', key: 'item' },
                { title: 'i.code', dataIndex: 'code', key: 'item' },
                { title: 'i.unit_price', dataIndex: 'price', key: 'price' },
                { title: 'i.amount', dataIndex: 'amount', key: 'amount' },
                { title: 'crm_b.discount', dataIndex: 'discount', key: 'discount' },
                { title: 'i.total_price', dataIndex: 'total_price', key: 'price' },
                {
                    title: 'crm_b.discount_price',
                    dataIndex: 'discount_price',
                    key: 'price',
                },
            ];
            return columns;
        },
        tableColumns2() {
            let columns = [
                { title: 'oder_details.order_number', dataIndex: 'name', key: 'item' },
                { title: 'oder_details.payment_type', dataIndex: 'code', key: 'item' },
                {
                    title: 'oder_details.payment_amount',
                    dataIndex: 'price',
                    key: 'price',
                },
                {
                    title: 'oder_details.payment_time',
                    dataIndex: 'amount',
                    key: 'amount',
                },
            ];
            return columns;
        },
        lang() {
            return this.$store.state.lang;
        },
        moneyT() {
            switch (this.currency) {
                case 'usd':
                    return '$';
                    break;
                case 'eur':
                    return '€';
                    break;
            }
        },
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
        // pageChange(curr) {
        //   // 页码改变
        //   this.currPage = curr;
        //   this.getTableData();
        // },
        // pageSizeChange(current, size) {
        //   // 页码尺寸改变
        //   this.pageSize = size;
        //   this.getTableData();
        // },
        getTableData() {
            this.loading = true;
            Core.Api.CRMItemBind.list({
                source_id: this.sourceId,
                source_type: this.sourceType,
            })
                .then(res => {
                    res.list.forEach(it => {
                        it.discount_price = (it.price * it.discount) / 100;
                        it.total_price = it.discount_price * it.amount;
                    });
                    this.tableData = res.list;
                    // this.total = res.count;
                })
                .catch(err => {
                    console.log('getCustomerDetail err', err);
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
.sub_title {
    color: #1d2129;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
}
.ant-descriptions-view {
    th.ant-descriptions-item-label {
        width: 25%;
    }
    td.ant-descriptions-item-content {
        width: 25%;
    }
}
:deep(.panel-content) {
    padding: 0 !important;
}
</style>
