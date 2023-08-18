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
            <template v-if="!isEmpty">
                <div id="votingChannelChartId" class="chart" ref='votingChannelChartId'></div>
            </template>
            <template v-else>
                <div class="empty-wrap">
                    <img src="../../../assets/images/dashboard/emptyData.png" alt="">
                    <div class="empty-desc">
                        暂无数据
                    </div>
                </div>
            </template>
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
            chartHeight: 254,
            title: '每日访问参与投票人数',
            SOURCE_TYPE_MAP: Core.Const.VOTE.SOURCE_TYPE_MAP
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                this.getDailyVoteChartData();
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
        this.getDailyVoteChartData();
    },
    beforeUnmount() {
        this.$refs.votingChannelChartId.innerHTML = ''
    },
    methods: {
        drawBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:')
                this.boStatisticsChart.destroy()
            }
            /* mock */
            // const data = [
            //     { name: '访客人数', type: '好友', value: 80 },
            //     { name: '访客人数', type: '公众号二维码', value: 28 },
            //     { name: '访客人数', type: '微博跳转', value: 39 },
            //     { name: '访客人数', type: '来源', value: 81 },
            //     { name: '投票人数', type: '好友', value: 60 },
            //     { name: '投票人数', type: '公众号二维码', value: 23 },
            //     { name: '投票人数', type: '微博跳转', value: 34 },
            //     { name: '投票人数', type: '来源', value: 99 },
            // ];
            const chart = new Chart({
                container: 'votingChannelChartId',
                autoFit: true,
                height: 410,
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
                .position('type*value')
                .color('name', ['#056DFF', '#FFBC48'])
                .adjust([
                    {
                        type: 'dodge',
                        marginRatio: 0,
                    },
                ])
            chart.interaction('active-region');
            chart.render();
            this.boStatisticsChart = chart
        },
        async getDailyVoteChartData() {
            try {
                let res = await Core.Api.VoteData.sourceStatistics({ ...this.searchForm });
                console.log('getDailyVoteChartData res', res);
                const data = [
                    {
                        date: 1692242388,
                        source_list: [
                            {
                                count: 20,
                                vote_count: 10,
                                type: 1
                            }
                        ]
                    },
                    {
                        date: 1692242388,
                        source_list: [
                            {
                                count: 30,
                                vote_count: 20,
                                type: 2
                            }
                        ]
                    },
                    {
                        date: 1692242388,
                        source_list: [
                            {
                                count: 40,
                                vote_count: 60,
                                type: 3
                            }
                        ]
                    },
                    {
                        date: 1692242388,
                        source_list: [
                            {
                                count: 10,
                                vote_count: 10,
                                type: 1
                            }
                        ]
                    }
                ];
                const transformedData = [];
                data.forEach((item) => {
                    item.source_list.forEach((source) => {
                        const sourceType = source.type;
                        const count = source.count;
                        const voteCount = source.vote_count;

                        const sourceTypeText = this.SOURCE_TYPE_MAP[sourceType].text;

                        const countData = {
                            name: '访客人数',
                            type: sourceTypeText,
                            value: count
                        };

                        const voteCountData = {
                            name: '投票人数',
                            type: sourceTypeText,
                            value: voteCount
                        };

                        transformedData.push(countData, voteCountData);
                    });
                });
                console.log('transformedData', transformedData);
                if (!transformedData.length) {
                    this.isEmpty = true
                } else {
                    this.drawBoStatisticsChart(transformedData);
                }
            } catch (error) {
                console.log('Error in getDailyVoteChartData', error);
                this.$message.warning('数据无法加载，请稍后重试！')
            }
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
.table-container {
    .empty-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        >img {
            width: 280px;
        }
        .empty-desc {
            margin-top: 10px;
            font-size: 14px;
            color: #86909C;
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
