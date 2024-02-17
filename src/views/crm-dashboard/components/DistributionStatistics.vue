<template>
    <div class="list-container">
        <!-- 标题 -->
        <div class="title">
            <span>{{ $t('db.customer_distribution') }}</span>
        </div>
        <!-- echarts -->
        <div class="table-container">
            <div id="DistributionChartId" class="chart" ref="DistributionChartId"></div>
        </div>
    </div>
</template>

<script>
import { Chart } from '@antv/g2';
import Core from '../../../core';

export default {
    name: 'Cards',
    components: {},
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            boStatisticsChart: {},
            maxCount: 0,
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                this.customerStatistics();
            },
        },
    },
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    created() {},
    mounted() {
        this.customerStatistics();
    },
    beforeUnmount() {
        this.$refs.DistributionChartId.innerHTML = '';
    },
    methods: {
        drawBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:');
                this.boStatisticsChart.destroy();
            }
            const chart = new Chart({
                container: 'DistributionChartId',
                autoFit: true,
                height: 306,
            });
            chart.data(data);
            chart.scale('value', {
                min: 0,
                max: this.maxCount,
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
                            stroke: '#333',
                        },
                    },
                },
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

            chart.line().position('item*value').color('#5C6FD3').size(3);
            chart.area().position('item*value').color('#AFB9F5').style({
                fillOpacity: 0.8,
            });
            chart.render();
            this.boStatisticsChart = chart;
        },
        customerStatistics() {
            const dv = [];
            Core.Api.CRMDashboard.customerStatistics({
                ...this.searchForm,
            }).then(res => {
                res.list.forEach(it => {
                    if (this.maxCount < it.count) {
                        this.maxCount = it.count;
                    }

                    switch (it.source_type) {
                        case 1:
                            dv.push({ item: '预定小程序', value: it.count });
                            break;
                        case 2:
                            dv.push({ item: '系统录入', value: it.count });
                            break;
                        case 3:
                            dv.push({ item: 'Shopify', value: it.count });
                            break;
                    }
                });
                this.drawBoStatisticsChart(dv);
            });
            // const dv = [
            //     { item: '系统录入', value: 70 },
            //     { item: '国内官网', value: 60 },
            //     { item: '海外官网', value: 50 },
            //     { item: '小程序', value: 40 },
            //     { item: 'APP', value: 60 },
            // ]
        },
    },
};
</script>

<style lang="less" scoped>
.list-container {
    padding-top: 13px;
    padding-left: 18px;
    box-sizing: border-box;

    .title {
        width: 100%;
        font-size: 15px;
        font-weight: 600;
        color: #333333;
        margin-bottom: 36px;
    }
}

.chart {
    width: 100%;
    height: auto;
}
</style>
