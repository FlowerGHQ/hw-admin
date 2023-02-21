<template>
    <div class="account-balance">
        <!-- 上方个人信息 -->
        <div class="top-content">
            <div class="user-name">
                {{ user_name }}
            </div>
            <div class="account-balance-content">
                <div class="account-balance-title">{{ $t('d.account_balance') }}</div>
                <div v-if="currency === 'eur' || currency === 'EUR'" class="balance-detail">
                    €{{ $Util.countFilter(accountBalance[priceKey + 'eur']) }}
                </div>
                <div v-else class="balance-detail">
                    ${{ $Util.countFilter(accountBalance[priceKey + 'usd']) }}
                </div>
            </div>
        </div>
        <!-- echarts -->
        <div class="table-container">
            <div id="TestDriveIntentionChartId" class="chart" ref='TestDriveIntentionChartId'></div>
            <div class="balance-num">¥ 4,544</div>
            <div class="balance-use-num">¥ 4,544</div>
            <a-button type="link" class="detail-btn" @click="handleGetDetail">明细</a-button>
        </div>

    </div>
</template>
<script>
import Core from '../../../core';
import { Chart } from '@antv/g2'

export default {
    name: 'Cards',
    components: {
    },
    data() {
        return {
            currentTab: '',
            myChart: null,
            boStatisticsChart: {},
            accountBalance: '123,456',
            user_name: '用户姓名',
            currency: '',
        };
    },
    computed: {
        lang() {
            return this.$store.state.lang
        },
        priceKey() {
            return this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_'
        },
    },
    created() {
    },
    mounted() {
        this.currency = Core.Data.getCurrency();
        this.purchaseIntentStatistics()
    },
    beforeUnmount() {
        this.$refs.TestDriveIntentionChartId.innerHTML = ''
    },
    methods: {
        handleGetDetail() {
            this.$emit("changeTabToDetail", '2')
        },
        drawBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:')
                this.boStatisticsChart.destroy()
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
            chart.tooltip({
                showTitle: false,
                showMarkers: false,
                itemTpl:
                    '<li style="margin-bottom:0px;list-style-type:none;padding: 0; height:40px">' +
                    '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
                    '<span style="line-height: 20px;">名称：{name}<br/></span>' +
                    '<span style="padding-left: 16px; line-height: 20px;">占比：{value}<br/></span>' +
                    '</li>',
            });
            chart
                .interval()
                .adjust('stack')
                .position('value')
                .color('type')
                .shape('slice-shape');
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
                        fontWeight: 400
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
                        fontWeight: 600
                    },
                    offsetX: -2,
                    offsetY: 20,
                })

            chart.render();
            this.boStatisticsChart = chart
        },
        purchaseIntentStatistics() {
            // this.loading = true;
            // Core.Api.CRMDashboard.testDriveIntentStatistics({
            //     ...this.searchForm
            // }).then(res => {
            //     console.log('getTableData err', res)
            //     // this.testDriveIntentList = res.list;
            //     const dv = []
            //     res.list.forEach(res => {
            //         if (res.type !== 0) {
            //             dv.push({ type: this.$Util.CRMCustomerTestDriveIntentChartFilter(res.type, this.lang), value: res.value })
            //         }
            //     })
            //     this.drawBoStatisticsChart(dv)

            // }).catch(err => {
            //     console.log('getTableData err', err)
            // }).finally(() => {
            //     this.loading = false;
            // });
            const dv = [
                { type: '余额', value: 20 },
                { type: '可用金额', value: 18 },
            ]
            this.drawBoStatisticsChart(dv)
        }
    }
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
}</style>