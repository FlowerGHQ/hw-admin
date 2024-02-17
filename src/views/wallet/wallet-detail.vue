<template>
    <div id="WalletDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('w.detail') }}</div>
            <div class="btns-area">
                <!--                <a-button type="primary" ghost @click="routerChange('edit', record)"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>-->
                <!--                <a-button type="primary" ghost @click="handleDelete(wallet_id)"><i class="icon i_delete"/>删除</a-button>-->
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ $t('w.account') }}: {{ $Util.walletTypeFilter(detail.type) }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('w.balance') }}：</span>
                        <span class="value">{{ walletMap[detail.type] + detail.balance / 100 }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.time') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                </a-row>
            </div>
        </div>
        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="BalanceList" :tab="$t('w.record')">
                    <BalanceList :walletId="wallet_id" :detail="detail" @submit="getWalletDetail" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import BalanceList from './components/BalanceList.vue';

export default {
    name: 'WalletDetail',
    components: {
        BalanceList,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            //标签页
            detail: {},
            wallet_id: '',
            activeKey: ['affirm'],
            walletMap: {
                1: '¥',
                2: '€',
                3: '$',
                4: '£',
            },
        };
    },
    watch: {},
    computed: {},
    created() {
        this.wallet_id = Number(this.$route.query.id) || '';
        this.getWalletDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/wallet/wallet-edit',
                        query: { id: this.wallet_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'list': // 列表
                    routeUrl = this.$router.resolve({
                        path: '/wallet/wallet-list',
                        query: { id: this.wallet_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getWalletDetail() {
            this.loading = true;
            Core.Api.Wallet.detail({
                id: this.wallet_id,
            })
                .then(res => {
                    console.log('getWalletDetail res', res);
                    this.detail = res.detail;
                })
                .catch(err => {
                    console.log('getWalletDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('w.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Wallet.delete({ id })
                        .then(() => {
                            _this.$message.success(this.$t('pop_up.delete_success'));
                            _this.routerChange('list');
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
// #WalletDetail {}
</style>
