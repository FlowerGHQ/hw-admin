<template>
    <div class="list-container">
        <div class="title">
            <div>{{ title }}</div>
            <div class="detail-title" @click="goToDetail('detail')">详情</div>
        </div>
        <!-- echarts -->
        <div class="table-container">
            <div v-if="!isEmpty" id="DailyVotingNumbersChartId" class="chart" ref="DailyVotingNumbersChartId"></div>
            <div v-else class="empty-wrap">
                <img src="../../../assets/images/dashboard/emptyData.png" alt="" />
                <div class="empty-desc">暂无数据</div>
            </div>
        </div>
    </div>
</template>

<script>
import { Chart } from '@antv/g2';
import Core from '../../../core';
import dayjs from 'dayjs';
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
            title: '每日访问参与投票人数',
            isEmpty: false,
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler() {
                if (this.searchForm.activity_id) {
                    this.getDailyVotingChartData();
                }
            },
        },
    },
    computed: {},
    created() {},
    mounted() {
        if (this.searchForm.activity_id) {
            this.getDailyVotingChartData();
        }
    },
    beforeUnmount() {
        this.$refs.DailyVotingNumbersChartId.innerHTML = '';
    },
    methods: {
        async drawBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                this.boStatisticsChart.destroy();
            }
            await this.$nextTick();
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
            chart
                .interval()
                .position('month*value')
                .color('name', ['#056DFF', '#FFBC48'])
                .adjust([
                    {
                        type: 'dodge',
                        marginRatio: 0,
                    },
                ]);
            // .size(20);
            chart.interaction('active-region');
            chart.render();
            this.boStatisticsChart = chart;
        },
        async getDailyVotingChartData() {
            try {
                let res = await Core.Api.VoteData.numberStatistics({ ...this.searchForm });
                const data = [
                    {
                        date: 1692201600,
                        vote_count: 10,
                        uv: 10,
                    },
                    {
                        date: 1692288000,
                        vote_count: 20,
                        uv: 20,
                    },
                    {
                        date: 1692242388,
                        vote_count: 60,
                        uv: 30,
                    },
                    {
                        date: 1692242388,
                        vote_count: 10,
                        uv: 40,
                    },
                ];
                const transformedData = [];
                res.forEach(item => {
                    const date = item.date;
                    const count = item.uv;
                    const voteCount = item.vote_count;
                    const countData = {
                        name: '访客人数',
                        month: dayjs(date * 1000).format('MM.DD'),
                        value: count,
                    };
                    const voteCountData = {
                        name: '投票人数',
                        month: dayjs(date * 1000).format('MM.DD'),
                        value: voteCount,
                    };
                    transformedData.push(countData, voteCountData);
                });
                this.isEmpty = transformedData.every(item => {
                    return item.value === 0;
                });
                if (!transformedData.length) {
                    this.isEmpty = true;
                } else {
                    this.isEmpty = false;
                    this.drawBoStatisticsChart(transformedData);
                }
            } catch (error) {
                console.log('Error in getPartRatioRingChartData', error);
                this.$message.warning('数据无法加载，请稍后重试！');
            }
        },
        goToDetail(type) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-dashboard/vote-detail',
                        query: {
                            title: this.title,
                            api_name: 'numberStatistics',
                            begin_time: this.searchForm.begin_time,
                            end_time: this.searchForm.end_time,
                            column_type: Core.Const.VOTE.TYPE.DAILYVOTE,
                        },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
    },
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
            color: #0061ff;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
        }
    }
}

.table-container {
    .empty-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        > img {
            width: 280px;
        }

        .empty-desc {
            margin-top: 10px;
            font-size: 14px;
            color: #86909c;
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
