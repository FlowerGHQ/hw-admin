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
			timer: null
        };
    },
    watch: {
        list: {
            deep: true,            
            handler(n) {				
                this.testDriveIntentStatistics()                
            }
        },

    },
    computed: {},
    created() {

    },
    mounted() {
        this.testDriveIntentStatistics()
    },
    beforeUnmount() {		
        this.$refs.PurchaseIntentchartId.innerHTML = ''
		clearTimeout(this.timer)
    },
    methods: {
        // 获取数据
        testDriveIntentStatistics() {			
            this.timer = setTimeout(() => {
                // 客户
                if (this.isPeople) {
                    this.drawPeopleBoStatisticsChart(this.list)
                } else {  
                // 车辆预定         
                    this.drawCarBoStatisticsChart(this.list)
                }
            }, 50)
        },
        drawCarBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {                
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
                    nice: true
                },
                value2: {
                    alias: this.$t('db.order_amount'),
                    range: [0, 0.97],
                    type: 'linear',
                    nice: true
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
