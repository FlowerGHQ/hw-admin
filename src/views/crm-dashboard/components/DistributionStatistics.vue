<template>
    <div class="list-container">
        <!-- 标题 -->
        <div class="title">
            <span>{{ $t('db.customer_distribution') }}</span>
        </div>
        <!-- echarts -->
        <div class="table-container">
            <div id="DistributionChartId" class="chart" ref='DistributionChartId'></div>
        </div>
    </div>
</template>

<script>
import { Chart } from '@antv/g2'
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
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        },
    },
    created() {
    },
    mounted() {
        this.purchaseIntentStatistics()
    },
    beforeUnmount() {
        this.$refs.DistributionChartId.innerHTML = ''
    },
    methods: {
        drawBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:')
                this.boStatisticsChart.destroy()
            }
            const chart = new Chart({
                container: 'DistributionChartId',
                autoFit: true,
                height: 306,
            });
            chart.data(data);
            chart.scale('value', {
                min: 0,
                max: 80,
            });
            chart.coordinate('polar', {
                radius: 0.8,
            });
            chart.tooltip({
                shared: false,
                showCrosshairs: true,
                crosshairs: {
                    line: {
                        style: {
                            lineDash: [4, 4],
                            stroke: '#333'
                        }
                    }
                }
            });
            chart.axis('item', {
                line: null,
                tickLine: null,
                grid: {
                    line: {
                        style: {
                            lineDash: null,
                        },
                    },
                },
            });
            chart.axis('value', {
                line: null,
                tickLine: null,
                grid: {
                    line: {
                        type: 'circle',
                        style: {
                            lineDash: null,
                        },
                    },
                },
            });

            chart
                .line()
                .position('item*value')
                .color('#5C6FD3')
                .size(3);
            chart
                .area()
                .position('item*value')
                .color('#AFB9F5')
                .style({
                    fillOpacity: 0.8,
                });
            chart.render();
            this.boStatisticsChart = chart
        },
        purchaseIntentStatistics() {
            const dv = [
                { item: '系统录入', value: 70 },
                { item: '国内官网', value: 60 },
                { item: '海外官网', value: 50 },
                { item: '小程序', value: 40 },
                { item: 'APP', value: 60 },
            ]
            this.drawBoStatisticsChart(dv)
        }
    }
};
</script>

<style lang="less" scoped>
.title {
    padding: 12px 16px;
    border-bottom: 2px solid #f0f2f5;
    font-size: 16px;
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
    // width: 600px;
    width: 100%;
    // height: 400px;
    height: auto
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
