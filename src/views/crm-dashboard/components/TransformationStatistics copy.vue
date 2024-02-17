<template>
    <div class="list-container">
        <div class="title">
            {{ $t('db.transformation_analysis') }}
        </div>

        <div class="table-container">
            <div id="chartId" ref="chartId"></div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
import { Chart } from '@antv/g2';

export default {
    name: 'Card',
    components: {},
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            currentTab: '',
            myChart: null,
            boStatisticsChart: {},
            tableData: [],
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.boStatistics();
    },
    beforeUnmount() {},
    methods: {
        boStatistics() {
            const dv = [
                { action: '客户总人数', pv: 50000, percent: 1, type: '触达人数' },
                { action: '公海客户数', pv: 35000, percent: 0.8, type: '有效访问人数' },
                { action: '商机总数', pv: 25000, percent: 0.6, type: '兴趣人数' },
                { action: '试驾单总数', pv: 15000, percent: 0.4, type: '下单人数' },
                { action: '回款单总数', pv: 8000, percent: 0.2, type: '支付人数' },
            ];

            this.drawBoStatisticsChart(dv);
        },
        drawBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:');
                this.boStatisticsChart.destroy();
            }
            const chart = new Chart({
                container: 'chartId',
                autoFit: true,
                height: 270,
                padding: [20, 200, 20],
            });
            chart.data(data);
            chart.axis(false);
            chart.legend(false);
            chart.coordinate('rect').transpose().scale(1, -1);
            chart
                .interval()
                .adjust('symmetric')
                .position('action*percent')
                .shape('funnel')
                .color('action', ['#F8D44E', '#F4B540', '#F19C39', '#EE8031', '#DD6623'])
                .label(
                    'action*pv',
                    (action, pv) => {
                        return {
                            content: `${action} ${pv}个`,
                        };
                    },
                    {
                        offset: 35,
                        labelLine: {
                            style: {
                                lineWidth: 1,
                                stroke: 'rgba(0, 0, 0, 0.15)',
                            },
                        },
                    },
                )
                .animate({
                    appear: {
                        animation: 'fade-in',
                    },
                    update: {
                        annotation: 'fade-in',
                    },
                });

            chart.interaction('element-active');

            chart.on('beforepaint', () => {
                chart.annotation().clear(true);
                const chartData = chart.getData();
                // 中间标签文本
                chartData.forEach(obj => {
                    chart.annotation().text({
                        top: true,
                        position: {
                            action: obj.action,
                            percent: 'center',
                        },
                        content: obj.type, // 显示的文本内容
                        style: {
                            stroke: null,
                            fill: '#fff',
                            textAlign: 'center',
                        },
                    });
                });
            });

            chart.render();
            this.boStatisticsChart = chart;
        },
    },
};
</script>

<style lang="less" scoped>
.list-container {
    padding: 20px 24px;

    .title {
        width: 100%;
        font-size: 18px;
        font-family:
            PingFang SC-Medium,
            PingFang SC;
        font-weight: 600;
        color: #333333;
        margin-bottom: 39px;
    }
}
</style>
