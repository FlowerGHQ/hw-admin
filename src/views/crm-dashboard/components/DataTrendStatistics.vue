<template>
    <div class="list-container">
        <div class="title">
            <span>{{ $t('db.data_trend') }}</span>
        </div>
        <div class="unit">
            {{ $t('db.unit_people') }}
        </div>
        <!-- echarts -->
        <div class="table-container">
            <div id="PurchaseIntentchartId" class="chart" ref='PurchaseIntentchartId'></div>
        </div>
    </div>
</template>

<script>
import { Chart, registerTheme } from '@antv/g2'
import Core from "../../../core";

export default {
    name: 'Cards',
    components: {
    },
    props: {
        searchForm: {
            type: Object,
            default: () => { }
        },
    },
    data() {
        return {
            boStatisticsChart: {},
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                this.testDriveIntentStatistics()
            }
        },

    },
    computed: {
        lang() {
            return this.$store.state.lang
        },
    },
    created() {

    },
    mounted() {
        this.testDriveIntentStatistics()
    },
    beforeUnmount() {
        this.$refs.PurchaseIntentchartId.innerHTML = ''
    },
    methods: {
        drawBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:')
                this.boStatisticsChart.destroy()
            }
            const chart = new Chart({
                container: 'PurchaseIntentchartId',
                autoFit: true,
                height: 242,
                width: 600,
            });
            chart.data(data)
            chart.scale({
                date: {
                    tickCount: 10,
                    range: [0.01, 0.98],
                    type: 'cat',
                },
                value1: {
                    alias: this.$t('db.amount'),
                    range: [0, 0.97],
                    type: 'linear',
                    // formatter: (val) => {
                    //     return val + ' 人';
                    // },
                },
                value2: {
                    alias: this.$t('db.amount'),
                    range: [0, 0.97],
                    type: 'linear',
                    // formatter: (val) => {
                    //     return val + ' 人';
                    // },
                }
            });
            chart.legend({
                position: 'top-right',
                custom: true, // 自定义图例
                offsetY: -6,
                items: [
                    {
                        name: this.$t('db.model_A'),
                        value: 'value1',
                        marker: { symbol: 'circle', style: { fill: 'l(270) 0:#FFFFFF 1:#346EF2', r: 5 } },
                    },
                    {
                        name: this.$t('db.model_B'),
                        value: 'value2',
                        marker: { symbol: 'circle', style: { fill: 'l(270) 0:#FFFFFF 1:#DC6E38', r: 5 } },
                    },
                ],
            });
            chart.axis('value1', { // 隐藏y轴线
                grid: null
            })
            chart.axis('value2', { // 隐藏y轴线
                grid: null
            })
            chart.area()
                .position('date*value1')
                .shape('smooth')
                .color('l(270) 0:#FFFFFF 1:#346EF2')
            chart.area()
                .position('date*value2')
                .shape('smooth')
                .color('l(270) 0:#FFFFFF 1:#DC6E38')

            chart.line()
                .position('date*value1')
                .shape('smooth')
                .color('#346EF2')
                .size(2)
            chart.line()
                .position('date*value2')
                .shape('smooth')
                .color('#DC6E38')
                .size(2)
            chart.render();
            this.boStatisticsChart = chart
        },
        testDriveIntentStatistics() {
            this.loading = true;
            Core.Api.CRMDashboard.purchaseIntentStatistics({
                ...this.searchForm
            }).then(res => {
                console.log('getTableData err', res)
                // this.testDriveIntentList = res.list;
                const dv = []
                res.list.forEach(res => {
                    if (res.type !== 0) {
                        if (res.type !== 40) {
                            dv.push({ type: this.$Util.CRMCustomerPurchaseIntentChartFilter(res.type, this.lang), value: res.value })
                        }
                    }
                })
                const _data = [
                    { date: '2022-12-01', value1: 80, value2: 52 },
                    { date: '2022-12-02', value1: 52, value2: 12 },
                    { date: '2022-12-03', value1: 201, value2: 39 },
                    { date: '2022-12-04', value1: 145, value2: 152 },
                    { date: '2022-12-05', value1: 48, value2: 32 },
                    { date: '2022-12-06', value1: 68, value2: 93 },
                    { date: '2022-12-07', value1: 18, value2: 84 },
                ];
                this.drawBoStatisticsChart(_data)

            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        }


    }
};
</script>

<style lang="less" scoped>
.title {
    padding: 12px 16px;
    // border-bottom: 2px solid #f0f2f5;
    font-size: 20px;
    font-weight: bold;
    .flex(space-between, center, row);

    .tab-item {
        display: inline-block;
        padding: 4px 8px;
        border: 1px solid grey;
        margin-right: 2px;
        font-size: 12px;
        user-select: none;
        cursor: pointer;

        &:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }

        &:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            margin-right: 0;
        }
    }

    .tab-current {
        border: 1px solid #006EF9;
        color: #006EF9;
    }
}

.unit {
    padding: 12px 16px;
    width: 100%;
    font-size: 16px;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
}

.contain {
    padding: 16px;
}

.form-item {
    // border: 1px solid red;
    border-bottom: 1px solid #f0f2f5;
    padding: 16px 0;
    .flex(space-between, center, row);

    .form-label {
        font-size: 14px;
    }

    .form-value {
        color: #006EF9;
        font-size: 20px;
    }
}

.chart {
    width: 100%;
    height: auto;
}

.data-body {
    .flex(flex-start, center, row);

    .icon {
        text-align: center;
    }
}

.data-contain {
    flex-grow: 1;
    width: auto;
    .flex(space-between, center, row);

    .info-item {
        .flex(space-between, center);

        .label {
            font-size: 12px;
            color: grey;
        }

        .value {
            font-size: 24px;
            font-weight: bold;
            color: black;
        }
    }
}
</style>
