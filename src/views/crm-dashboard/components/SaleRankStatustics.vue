<template>
    <div class="list-container">
        <div class="title">
            <span>{{ $t('db.sales_ranking') }}</span>
        </div>
        <div class="unit">
            {{ $t('db.unit') }}
        </div>

        <!-- echarts -->
        <div class="table-container">
            <div id="RankchartId" class="chart" ref="RankchartId"></div>
        </div>
    </div>
</template>

<script>
import { Chart, registerTheme } from '@antv/g2';
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
            chartHeight: 254,
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                this.testDriveIntentStatistics();
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
        this.testDriveIntentStatistics(), (this.chartHeight = Core.Util.auth('ADMIN') ? 266 : 418);
    },
    beforeUnmount() {
        this.$refs.RankchartId.innerHTML = '';
    },
    methods: {
        drawBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:');
                this.boStatisticsChart.destroy();
            }
            const chart = new Chart({
                container: 'RankchartId',
                autoFit: true,
                height: this.chartHeight,
            });
            registerTheme('newTheme', { minColumnWidth: 10, maxColumnWidth: 15 });
            chart.theme('newTheme');
            chart.data(data);
            chart.scale('name', {
                nice: true,
            });
            chart.tooltip({
                showMarkers: false,
            });
            chart.interaction('active-region');
            chart
                .interval()
                .position('name*sales')
                .color('#346EF2')
                .style({ radius: [40, 40, 40, 40] });
            chart.render();
            this.boStatisticsChart = chart;
        },
        testDriveIntentStatistics() {
            this.loading = true;
            Core.Api.CRMDashboard.performanceList({
                ...this.searchForm,
            })
                .then(res => {
                    console.log('performanceList err', res);
                    // this.testDriveIntentList = res.list;
                    const dv = [];
                    res.list.forEach(it => {
                        dv.push({ name: it.user_name + '', sales: it.money / 10000 });
                    });
                    // const _data = [
                    //     { name: '李小明', sales: 80 },
                    //     { name: '黄丹', sales: 52 },
                    //     { name: '徐鹏', sales: 201 },
                    //     { name: '王一鸣', sales: 145 },
                    //     { name: '乔治', sales: 48 },
                    //     { name: '佩奇', sales: 68 },
                    //     { name: '张三', sales: 18 },
                    //     { name: '李四', sales: 138 },
                    // ];
                    this.drawBoStatisticsChart(dv);
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
.list-container {
    padding: 13px 18px 20px 18px;
    box-sizing: border-box;

    .title {
        width: 100%;
        font-size: 15px;
        font-weight: 600;
        color: #333333;
        margin-bottom: 16px;
    }
}
.unit {
    width: 100%;
    font-size: 12px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 16px;
}

.chart {
    width: 100%;
    height: auto;
}
</style>
