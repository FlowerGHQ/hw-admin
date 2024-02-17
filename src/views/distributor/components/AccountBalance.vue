<template>
    <div class="account-balance">
        <!-- 上方个人信息
        <div class="top-content">
            <div class="user-name">
                {{ name || '-' }}
            </div>
            <div class="account-balance-content">
                <div class="account-balance-title">{{ $t('d.account_balance') }}</div>
                <div class="balance-detail">                     
                    {{$Util.priceUnitFilter(walletDetail.currency)}}
                    {{ accountBalance }}
                </div>
            </div>
        </div> -->
        <!-- echarts -->
        <div class="table-container">
            <div id="TestDriveIntentionChartId" class="chart" ref="TestDriveIntentionChartId"></div>
            <div class="balance-num">{{ $Util.priceUnitFilter(walletDetail.currency) }}{{ accountBalance }}</div>
            <div class="balance-use-num">{{ $Util.priceUnitFilter(walletDetail.currency) }}{{ availableBalance }}</div>
            <a-button type="link" class="detail-btn" @click="handleGetDetail">{{ $t(/*明细*/ 'd.detailed') }}</a-button>
        </div>
    </div>
</template>
<script>
import Core from '../../../core';
import { Chart } from '@antv/g2';

export default {
    name: 'Cards',
    props: {
        name: String,
        id: Number,
    },
    components: {},
    watch: {
        '$i18n.locale': {
            handler(n) {
                this.handleChartData(); // 监听者中英文切换
            },
        },
    },
    data() {
        return {
            walletDetail: {}, // 钱包的详情
            currentTab: '',
            myChart: null,
            boStatisticsChart: {},
            accountBalance: 0, // 账户余额
            availableBalance: 0, // 质保金
            user_name: '用户姓名',
            currency: '',
            chartData: [],
            accountBalancePercent: 0,
            availableBalancePercent: 0,
        };
    },
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    created() {},
    mounted() {
        this.currency = Core.Data.getCurrency();
        this.getWalletDetail();
    },
    beforeUnmount() {
        this.$refs.TestDriveIntentionChartId.innerHTML = '';
    },
    methods: {
        // 经销商钱包详情
        getWalletDetail() {
            this.loading = true;
            Core.Api.Distributor.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getWalletDetail res', res);
                    this.walletDetail = res.detail;
                    this.accountBalance = this.$Util.countFilter(res.detail.wallet_list.balance.balance); // 账户余额
                    this.availableBalance = this.$Util.countFilter(res.detail.wallet_list.deposit.balance); // 质保金
                    this.accountBalancePercent = this.accountBalance / (this.accountBalance + this.availableBalance);
                    this.availableBalancePercent =
                        this.availableBalance / (this.accountBalance + this.availableBalance);
                    this.handleChartData();
                    console.log('测试', this.accountBalancePercent);
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleChartData() {
            if (this.accountBalance || this.availableBalance) {
                this.chartData = [
                    { type: this.$t('d.balance'), value: this.accountBalance, percent: this.accountBalancePercent },
                    {
                        type: this.$t('d.available_balance'),
                        value: this.availableBalance,
                        percent: this.availableBalancePercent,
                    },
                ];
            } else {
                this.chartData = [
                    { type: this.$t('d.balance'), value: this.accountBalance, percent: 0.5 },
                    { type: this.$t('d.available_balance'), value: this.availableBalance, percent: 0.5 },
                ];
            }
            this.drawBoStatisticsChart(this.chartData);
        },
        handleGetDetail() {
            this.$emit('changeTabToDetail', '2');
        },
        drawBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:');
                this.boStatisticsChart.destroy();
            }
            const chart = new Chart({
                container: 'TestDriveIntentionChartId',
                autoFit: true,
                height: 380,
            });

            chart.data(data);
            chart.scale('type', {
                nice: true,
            });
            chart.coordinate('theta', {
                radius: 0.75,
                innerRadius: 0.6,
            });
            chart.scale('percent', {
                formatter: val => {
                    val = val * 100 + '%';
                    return val;
                },
            });
            chart.tooltip({
                showTitle: false,
                showMarkers: false,
                itemTpl:
                    '<li style="margin-bottom:0px;list-style-type:none;padding: 0; height:40px">' +
                    '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
                    '<span style="line-height: 20px;">名称：{name}<br/></span>' +
                    '<span style="padding-left: 16px; line-height: 20px;">占比：{value}<br/></span>' +
                    '</li>',
                // itemTpl: '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
            });
            chart
                .interval()
                .adjust('stack')
                .position('percent')
                .color('type')
                .shape('slice-shape')
                .tooltip('type*percent', (item, percent) => {
                    percent = percent * 100 + '%';
                    return {
                        name: item,
                        value: percent,
                    };
                });
            chart.legend({
                position: 'right',
            });

            chart.interaction('element-active');
            chart
                .annotation()
                .text({
                    position: ['50%', '50%'],
                    // content: 'Test Drive intention',
                    content: this.$t('d.total_account'),
                    style: {
                        fontSize: 12,
                        fill: '#929292',
                        textAlign: 'center',
                        fontWeight: 400,
                    },
                    offsetY: -20,
                })
                .text({
                    position: ['50%', '50%'],
                    content: this.accountBalance,
                    style: {
                        fontSize: 20,
                        fill: '#272727',
                        textAlign: 'center',
                        fontWeight: 600,
                    },
                    offsetX: -2,
                    offsetY: 20,
                });

            chart.render();
            this.boStatisticsChart = chart;
        },
    },
};
</script>
<style lang="less" scoped>
.account-balance {
    .top-content {
        display: flex;
        padding: 30px 30px;
        box-sizing: border-box;
        height: 100px;
        width: 100%;
    }

    .user-name {
        font-size: 16px;
    }

    .account-balance-content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-left: 200px;

        .account-balance-title {
            color: #999999;
            font-size: 14px;
        }

        .balance-detail {
            font-size: 20px;
        }
    }

    .chart {
        width: 400px;
        height: auto;
    }

    .table-container {
        position: relative;
    }

    .balance-num {
        position: absolute;
        left: 440px;
        bottom: 192px;
        color: #000000;
        font-size: 16px;
    }

    .balance-use-num {
        position: absolute;
        left: 440px;
        bottom: 165px;
        color: #000000;
        font-size: 16px;
    }

    .detail-btn {
        position: absolute;
        left: 520px;
        bottom: 162px;
    }
}
</style>
