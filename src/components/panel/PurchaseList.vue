<template>
    <div class="PurchaseList gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('p.purchase_order') }}</div>
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
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'sn'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                    text || '-'
                                }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'price'">
                            {{ record.status !== 60 ? `€${$Util.countFilter(text)}` : '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="$Util.purchaseStatusFilter(text, 'color')">
                                {{ $Util.purchaseStatusFilter(text, $i18n.locale) }}
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'payment_status'">
                            <div class="status status-bg status-tag" :class="$Util.paymentStatusFilter(text, 'color')">
                                {{ $Util.paymentStatusFilter(text, $i18n.locale) }}
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'flag_review'">
                            {{ $Util.purchaseFlagReviewFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'purchase_method'">
                            {{ $Util.purchasePayMethodFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'item_type'">
                            {{ $Util.itemTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title="text">
                                <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="handleRecreate(record)">
                                <i class="icon i_cart" />{{ $t('p.buy_again') }}</a-button
                            >
                            <a-button type="link" @click="routerChange('detail', record)">
                                <i class="icon i_detail" /> {{ $t('def.detail') }}</a-button
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
    </div>
</template>

<script>
import Core from '../../core';
export default {
    name: 'PurchaseList',
    components: {},
    props: {
        orgId: {
            type: Number,
        },
        orgType: {
            type: Number,
        },
        agentId: {
            type: Number,
        },
        storeId: {
            type: Number,
        },
        searchType: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            SEARCH_TYPE: Core.Const.PURCHASE.SEARCH_TYPE,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            searchForm: {
                sn: '',
                status: undefined,
                item_type: 0,
                type: 0,
                subject: 0,
            },

            tableColumns: [
                { title: 'p.order_number', dataIndex: 'sn' },
                { title: 'p.price', dataIndex: 'price' },
                { title: 'n.state', dataIndex: 'status' },
                { title: 'p.order_time', dataIndex: 'create_time', key: 'time' },
                { title: 'p.payment_status', dataIndex: 'payment_status' },
                { title: 'p.payment_time', dataIndex: 'pay_time', key: 'time' },
                { title: 'p.complete_time', dataIndex: 'close_time', key: 'time' },
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ],
            tableData: [],
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.getTableData();
        this.timer = window.setInterval(() => {
            setTimeout(() => {
                this.getTableData();
            }, 0);
        }, 5 * 1000);
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item);
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/purchase/purchase-order-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'edit': // 购物车
                    routeUrl = this.$router.resolve({
                        path: '/mall/shopping-bag',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        handleRecreate(item) {
            // 再来一单
            this.loading = true;
            console.log('item.id:' + item.id);
            Core.Api.Purchase.recreate({
                id: item.id,
            })
                .then(res => {
                    console.log('handleRecreate res:', res);
                    this.routerChange('edit', item);
                })
                .catch(err => {
                    console.log('handleRecreate err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
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
            Core.Api.Purchase.list({
                org_id: this.orgId,
                org_type: this.orgType,
                store_id: this.storeId,
                agent_id: this.agentId,
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
    },
};
</script>

<style lang="less" scoped>
// .PurchaseList {}
</style>
