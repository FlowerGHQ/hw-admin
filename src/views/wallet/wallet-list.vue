<template>
    <div id="WalletList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('w.list') }}</div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="8" class="search-item">
                        <div class="key">{{ $t('n.name') }}:</div>
                        <div class="value">
                            <a-input v-model:value="searchForm.wallet_id" :placeholder="$t('def.input')" />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="14" class="search-item">
                        <div class="key">{{ $t('d.create_time') }}:</div>
                        <div class="value">
                            <a-range-picker
                                v-model:value="create_time"
                                valueFormat="X"
                                @change="handleSearch"
                                :show-time="defaultTime"
                                :allow-clear="false"
                            >
                                <template #suffixIcon><i class="icon i_calendar" /></template>
                            </a-range-picker>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
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
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title="$t(walletTypeMap[record.type])">
                                <a-button type="link" @click="routerChange('detail', record)">
                                    {{ $t(walletTypeMap[record.type]) }}</a-button
                                >
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'balance'">
                            {{ walletMap[record.currency_type] + text / 100 }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}
                            </a-button>
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
    name: 'WalletList',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
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
                wallet_id: undefined,
            },
            tableData: [],
            walletMap: {
                1: '¥',
                2: '€',
                3: '$',
                4: '£',
            },
            walletTypeMap: {
                1: 'ac.balance',
                2: 'ac.security_deposit',
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: this.$t('w.type'), dataIndex: 'type', key: 'detail' },
                { title: this.$t('w.balance'), dataIndex: 'balance' },
                // {title: '状态', dataIndex: 'status', key: 'status'},
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            return tableColumns;
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
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/wallet/wallet-detail',
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
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            console.log('this.searchForm:', this.searchForm);
            this.create_time = [];
            this.pageChange(1);
        },

        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Wallet.list({
                org_id: this.orgId,
                org_type: this.orgType,
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
    },
};
</script>

<style lang="less" scoped>
// #WalletList {}
</style>
