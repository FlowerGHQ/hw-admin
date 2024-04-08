<template>
    <div class="BalanceList gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.operateTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'money'">
                            {{ walletMap[detail.type] + text / 100 }}
                        </template>
                        <template v-if="column.dataIndex === 'source_type'">
                            {{ $Util.subjectTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'remark'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'sn'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange(record)">{{ text || '-' }} </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
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
import Core from '../../../core';
const SUBJECT = Core.Const.WALLET.SUBJECT;
export default {
    name: 'BalanceList',
    components: {},
    props: {
        walletId: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        return {
            SUBJECT,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            tableData: [],
            walletMap: {
                1: '¥',
                2: '€',
                3: '$',
                4: '£',
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: this.$t('n.type'), dataIndex: 'type' },
                { title: this.$t('w.money'), dataIndex: 'money', key: 'money' },
                { title: this.$t('w.change'), dataIndex: 'balance', key: 'money' },
                { title: this.$t('n.source'), dataIndex: 'source_type' },
                { title: this.$t('n.source_number'), dataIndex: 'sn', key: 'sn' },
                { title: this.$t('p.remark'), dataIndex: 'remark', key: 'remark' },
                { title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time' },
            ];
            return tableColumns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(item = {}) {
            let routeUrl = '';
            let type = '';
            if (item.source_type === SUBJECT.PURCHASE_ORDER) {
                type = 'purchase';
            } else {
                type = 'repair';
            }
            switch (type) {
                case 'purchase': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/distributor/purchase-order-detail',
                        query: { id: item.source_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'repair': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/repair/repair-detail',
                        query: { id: item.source_id },
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
            Core.Api.Wallet.walletList({
                wallet_id: this.walletId,
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
    },
};
</script>

<style lang="less">
//.BalanceList{}
</style>
