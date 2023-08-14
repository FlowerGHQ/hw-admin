<template>
    <div class="list-container">
        <div class="title">
            <div>{{ title }}</div>
            <div class="detail-title" @click="goToDetail('detail')">
                详情
            </div>
        </div>
        <!-- echarts -->
        <div class="table-container">
            <div id="DailyVotingNumbersChartId" class="chart" ref='DailyVotingNumbersChartId'></div>
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
            title: '每日访问参与投票人数'
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
        this.$refs.votingChannelChartId.innerHTML = ''
    },
    methods: {
        drawBoStatisticsChart() {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:')
                this.boStatisticsChart.destroy()
            }
            const data = [
                { name: '访客人数', month: '12.1', value: 80 },
                { name: '访客人数', month: '12.2', value: 28 },
                { name: '访客人数', month: '12.3', value: 39 },
                { name: '访客人数', month: '12.4', value: 81 },
                { name: '访客人数', month: '12.5', value: 80 },
                { name: '访客人数', month: '12.6', value: 28 },
                { name: '访客人数', month: '12.7', value: 39 },
                { name: '访客人数', month: '12.8', value: 81 },
                { name: '访客人数', month: '12.9', value: 80 },
                { name: '访客人数', month: '12.10', value: 28 },
                { name: '访客人数', month: '12.11', value: 39 },
                { name: '访客人数', month: '12.12', value: 81 },
                { name: '投票人数', month: '12.1', value: 60 },
                { name: '投票人数', month: '12.2', value: 23 },
                { name: '投票人数', month: '12.3', value: 34 },
                { name: '投票人数', month: '12.4', value: 99 },
                { name: '投票人数', month: '12.5', value: 60 },
                { name: '投票人数', month: '12.6', value: 23 },
                { name: '投票人数', month: '12.7', value: 34 },
                { name: '投票人数', month: '12.8', value: 99 },
                { name: '投票人数', month: '12.9', value: 60 },
                { name: '投票人数', month: '12.10', value: 23 },
                { name: '投票人数', month: '12.11', value: 34 },
                { name: '投票人数', month: '12.12', value: 99 },
            ];
            const chart = new Chart({
                container: 'DailyVotingNumbersChartId',
                autoFit: true,
                height: 254,
            });
            chart.data(data);
            chart.scale('value', {
                nice: true,
            });
            chart.tooltip({
                showMarkers: false,
                shared: true,
            });
            chart.legend({
                position: 'top-left',
                layout: 'horizontal',
                marker: {
                    symbol: 'circle', // 设置图例形状为圆形
                },
            });
            chart.interval()
                .position('month*value')
                .color('name', ['#056DFF', '#FFBC48'])
                .adjust([
                    {
                        type: 'dodge',
                        marginRatio: 0,
                    },
                ])
            // .size(20);
            chart.interaction('active-region');
            chart.render();
            this.boStatisticsChart = chart
        },
        testDriveIntentStatistics() {
            this.loading = true;
            Core.Api.CRMDashboard.performanceList({
                ...this.searchForm
            }).then(res => {
                console.log('performanceList err', res)
                // this.testDriveIntentList = res.list;
                const dv = []
                res.list.forEach(it => {
                    dv.push({ name: it.user_name + "", sales: it.money / 10000 })
                })
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
                this.drawBoStatisticsChart(dv)

            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        goToDetail(type) {
            let routeUrl = ''
            switch (type) {
                case 'detail':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/crm-dashboard/vote-detail",
                        query: {
                            title: this.title
                        }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.list-container {
    padding: 13px 18px 20px 18px;
    box-sizing: border-box;

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        font-size: 15px;
        font-weight: 600;
        color: #333333;
        margin-bottom: 16px;

        .detail-title {
            cursor: pointer;
            color: #0061FF;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
        }
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
