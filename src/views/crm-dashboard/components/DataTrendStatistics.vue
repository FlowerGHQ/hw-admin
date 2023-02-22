<template>
    <div class="list-container">
        <div class="title">
            <span>{{ $t('db.data_trend') }}</span>
        </div>
        <div class="unit">
            {{ isPeople ? $t('db.unit_people') : $t('db.unit_order') }}
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
        isPeople: {
            type: Boolean,
            default: () => false
        },
        list: {
            type: Array,
            default: () => []
        }
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
        isPeople: {
            deep: true,
            immediate: true,
            handler(n) {
                this.testDriveIntentStatistics()
            }
        },
        isCar: {
            deep: true,
            immediate: true,
            handler(n) {
                this.testDriveIntentStatistics()
            }
        },
        list: {
            deep: true,
            immediate: true,
            handler(n) {
                this.testDriveIntentStatistics()
                console.log(this.list, 'this.list');
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
        drawCarBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:')
                this.boStatisticsChart.destroy()
            }
            const chart = new Chart({
                container: 'PurchaseIntentchartId',
                autoFit: true,
                height: 217,
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
                    alias: this.$t('db.order_amount'),
                    range: [0, 0.97],
                    type: 'linear',
                },
                value2: {
                    alias: this.$t('db.order_amount'),
                    range: [0, 0.97],
                    type: 'linear',
                }
            });
            chart.legend({
                position: 'top-right',
                custom: true, // 自定义图例
                offsetY: -6,
                items: [
                    {
                        name: this.$t('db.domestic'),
                        value: 'value1',
                        marker: { symbol: 'circle', style: { fill: 'l(270) 0:#FFFFFF 1:#346EF2', r: 5 } },
                    },
                    {
                        name: this.$t('db.abroad'),
                        value: 'value2',
                        marker: { symbol: 'circle', style: { fill: 'l(270) 0:#FFFFFF 1:#DC6E38', r: 5 } },
                    },
                ],
            });
            chart.interaction('legend-highlight');
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
        drawPeopleBoStatisticsChart(people_data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:')
                this.boStatisticsChart.destroy()
            }
            const chart = new Chart({
                container: 'PurchaseIntentchartId',
                autoFit: true,
                height: 217,
                width: 600,
            });
            chart.data(people_data)
            chart.scale({
                date: {
                    tickCount: 10,
                    range: [0.01, 0.98],
                    type: 'cat',
                },
                value: {
                    alias: this.$t('db.amount'),
                    range: [0, 0.97],
                    type: 'linear',
                }
            });
            chart.axis('value', { // 隐藏y轴线
                grid: null
            })
            chart.area()
                .position('date*value')
                .shape('smooth')
                .color('l(270) 0:#FFFFFF 1:#346EF2')
            chart.line()
                .position('date*value')
                .shape('smooth')
                .color('#346EF2')
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
                const _data = this.list;
                const people_data = this.list;
                if (this.isPeople === true) {
                    this.drawPeopleBoStatisticsChart(people_data)
                } else {
                    console.log('_data', _data);
                    // const carData = [
                    //     { value: 46, value1: 0, value2: 0, date: '2023-02-20' },
                    //     { value: 46, value1: 22, value2: 20, date: '2023-02-20' },
                    //     { value: 46, value1: 10, value2: 22, date: '2023-02-21' },
                    // ]
                    this.drawCarBoStatisticsChart(_data)
                }
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
.list-container {
    padding: 14px 18px 18px 18px;
    box-sizing: border-box;

    .title {
        width: 100%;
        font-size: 15px;
        font-weight: 600;
        color: #333333;
        margin-bottom: 14px;
    }
}

.unit {
    margin-bottom: 4px;
    width: 100%;
    font-size: 12px;
    font-weight: 600;
    color: #333333;
}

.chart {
    width: 100%;
    height: auto;
}
</style>
