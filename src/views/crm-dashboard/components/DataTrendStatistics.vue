<template>
    <div class="list-container">
        <div class="title">
            <span>{{ $t('db.data_trend') }}</span>
        </div>
        <div class="unit">
            {{ isPeople ? $t('db.unit_people') : $t('db.unit_car') }}
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
                    // formatter: (val) => {
                    //     return val + ' 人';
                    // },
                },
                value2: {
                    alias: this.$t('db.order_amount'),
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
                const _data = [
                    { date: '2022-12-01', value1: 80, value2: 52 },
                    { date: '2022-12-02', value1: 52, value2: 12 },
                    { date: '2022-12-03', value1: 201, value2: 39 },
                    { date: '2022-12-04', value1: 145, value2: 152 },
                    { date: '2022-12-05', value1: 48, value2: 32 },
                    { date: '2022-12-06', value1: 68, value2: 93 },
                    { date: '2022-12-07', value1: 18, value2: 84 },
                ];
                const people_data = [
                    { date: '2022-12-10', value: 52 },
                    { date: '2022-12-11', value: 12 },
                    { date: '2022-12-12', value: 39 },
                    { date: '2022-12-13', value: 152 },
                    { date: '2022-12-14', value: 32 },
                    { date: '2022-12-15', value: 93 },
                    { date: '2022-12-16', value: 84 },
                ];
                if(this.isPeople === true){
                    this.drawPeopleBoStatisticsChart(people_data)
                }else{
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
