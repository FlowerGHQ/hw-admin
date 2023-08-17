<template>
    <div class="list-container">
        <!-- 标题 -->
        <div class="title">
            <div>{{ title }}</div>
            <div class="detail-title" @click="goToDetail('detail')">
                详情
            </div>
        </div>
        <!-- echarts -->
        <div class="table-container">
            <template v-if="isEmpty">
                <div id="ColorDistChartId" class="chart" ref='ColorDistChartId'></div>
                <div class="legend-container">
                    <div class="legend-wrap" v-for="item in legendList">
                        <div class="legend-block">
                            <div class="legend-circle" :style="{ backgroundColor: item.color }"></div>
                            <div class="legend-key">{{ item.item }}</div>
                        </div>
                        <div class="legend-value">{{ item.percent + '%' }}</div>
                    </div>
                </div>
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
import { Chart } from '@antv/g2'
import Core from "../../../core";
import data from '../../../core/data';

export default {
    name: 'Cards',
    components: {
    },
    props: {
        searchForm: {
            type: Object,
            default: () => { }
        },
        title: {
            type: String,
            default: '来源'
        }
    },
    data() {
        return {
            currentTab: '',
            myChart: null,
            boStatisticsChart: {},
            groupStatusTableData: [],
            legendList: [],
            title: '投票颜色分布',
            isEmpty: false,
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                console.log("purchaseIntentStatistics")
                // this.purchaseIntentStatistics()
                this.getResultChartData();
            }
        },

    },
    computed: {},
    created() { },
    mounted() {
        this.getResultChartData();
        // this.purchaseIntentStatistics();
    },
    beforeUnmount() {
        this.$refs.ColorDistChartId.innerHTML = ''
    },
    methods: {
        // 点击tab
        clickTab(key) {
            this.currentTab = key;
            console.log('切换tab >>', key);
        },

        drawBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:')
                this.boStatisticsChart.destroy()
            }
            const chart = new Chart({
                container: 'ColorDistChartId',
                autoFit: true,
                height: 254,
            });
            // 新建一个 view 用来单独渲染Annotation
            const innerView = chart.createView();
            chart.data(data);
            chart.scale('percent', {
                formatter: val => {
                    val = val * 100 + '%';
                    return val;
                },
            });
            chart.tooltip(false);
            chart.coordinate('theta', {
                radius: 0.7,
                innerRadius: 0.8,
            });
            // 声明需要进行自定义图例字段： 'item'
            chart.legend(false);
            // 监听 element 上状态的变化来动态更新 Annotation 信息
            chart.on('element:statechange', (ev) => {
                const { state, stateStatus, element } = ev.gEvent.originalEvent;

                // 本示例只需要监听 active 的状态变化
                if (state === 'active') {
                    const data = element.getData();
                    if (stateStatus) {
                        // 更新 Annotation
                        updateAnnotation(data);
                    } else {
                        // 隐藏 Annotation
                        clearAnnotation();
                    }
                }
            });

            // 绘制 annotation
            let lastItem;
            function updateAnnotation(data) {
                if (data.item !== lastItem) {
                    innerView.annotation().clear(true);
                    innerView
                        .annotation()
                        .text({
                            position: ['50%', '46%'],
                            content: data.percent * 100 + '%',
                            style: {
                                fontSize: 14,
                                fontWeight: 600,
                                fill: '#1D2129',
                                textAlign: 'center',
                            },
                        })
                        .text({
                            position: ['50%', '56%'],
                            content: data.item,
                            style: {
                                fontSize: 14,
                                fill: '#333333',
                                textAlign: 'center',
                            },
                        })
                    innerView.render(true);
                    lastItem = data.item;
                }
            }

            // 清空 annotation
            function clearAnnotation() {
                innerView.annotation().clear(true);
                innerView.render(true);
                lastItem = null;
            }

            chart
                .interval()
                .adjust('stack')
                .position('percent')
                .color('item', ['#056DFF', '#FFBC48', '#15BFEF', '#FB6381', '#26D0A1'])
                .style({
                    fillOpacity: 1,
                })
                .state({
                    active: {
                        style: element => {
                            const shape = element.shape;
                            return {
                                lineWidth: 10,
                                stroke: shape.attr('fill'),
                                strokeOpacity: shape.attr('fillOpacity'),
                            };
                        },
                    },
                });
            // 移除图例点击过滤交互
            chart.removeInteraction('legend-filter');
            chart.interaction('element-active');
            chart.render();
            this.boStatisticsChart = chart
        },
        async getResultChartData() {
            try {
                let res = await Core.Api.VoteData.resultStatistics({ ...this.searchForm });
                console.log('getResultChartData res', res);
                const data = [
                    {
                        date: 1692242388,
                        source_list: [
                            {
                                code: "red", // 投票结果
                                vote_count: 102 //投票数量
                            }
                        ],
                    },
                    {
                        date: 1692242388,
                        source_list: [
                            {
                                code: "yellow", // 投票结果
                                vote_count: 203 //投票数量
                            }
                        ],
                    },
                    {
                        date: 1692242388,
                        source_list: [
                            {
                                code: "blue", // 投票结果
                                vote_count: 304 //投票数量
                            }
                        ],
                    },
                    {
                        date: 1692242388,
                        source_list: [
                            {
                                code: "black", // 投票结果
                                vote_count: 405 //投票数量
                            }
                        ],
                    },
                ]
                const resultDataMap = {};
                data.forEach((item) => {
                    const code = item.source_list[0].code;
                    const voteCount = item.source_list[0].vote_count;

                    if (resultDataMap[code]) {
                        resultDataMap[code].count += voteCount;
                    } else {
                        resultDataMap[code] = {
                            count: voteCount
                        };
                    }
                });
                const totalVoteCount = Object.values(resultDataMap).reduce((sum, item) => sum + item.count, 0);
                const transformedData = Object.entries(resultDataMap).map(([code, item]) => {
                    const percent = (item.count / totalVoteCount * 100).toFixed(2);
                    return {
                        item: code,
                        count: item.count,
                        percent: parseFloat(percent)
                    };
                });
                this.legendList = transformedData
                const color = ['#056DFF', '#FFBC48', '#FB6381', '#15BFEF', '#26D0A1', '#A880FF', '#FF9834', '#5282FF'] // 配置项的颜色
                this.legendList.forEach((item, index) => {
                    item.color = color[index + 1]
                })
                if (transformedData) {
                    this.isEmpty = true
                }
                this.drawBoStatisticsChart(transformedData);
            } catch (error) {
                console.log('Error in getResultChartData', error);
            }
        },
        purchaseIntentStatistics() {
            this.loading = true;
            Core.Api.CRMDashboard.boStatistics({
                ...this.searchForm
            }).then(res => {
                console.log('getTableData err', res)
                // this.testDriveIntentList = res.list;
                const dv = [];
                res.list.forEach(it => {
                    this.groupStatusTableData.forEach((item, index) => {

                        if (index == it.status) {
                            dv.push({ item: item.zh, item_en: item.en, count: it.count, percent: this.$Util.countFilter(it.count / res.total, 1, 2) });
                        }
                    })

                })
                // const dv = [
                //     { item: '咨询', count: 20, percent: 0.2 },
                //     { item: '支付定金', count: 20, percent: 0.2 },
                //     { item: '等待交付', count: 21, percent: 0.21 },
                //     { item: '预约试驾', count: 17, percent: 0.17 },
                //     { item: '订单支付', count: 13, percent: 0.13 },
                //     { item: '已交付', count: 9, percent: 0.09 },
                // ]
                // const dv = []
                res.list.forEach(res => {
                    if (res.type !== 0) {
                        dv.push({ type: this.$Util.CRMCustomerTestDriveIntentChartFilter(res.type, this.lang), value: res.value })
                    }
                })
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
    padding-top: 13px;
    padding-left: 18px;
    padding-right: 18px;
    box-sizing: border-box;
}

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

.chart {
    width: 200px;
    height: auto
}

.table-container {
    display: flex;
    justify-content: center;
    align-items: center;
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

    .legend-container {
        .legend-wrap {
            width: 140px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            margin-bottom: 16px;

            .legend-block {
                width: 82px;
                margin-right: 13px;
                display: flex;
                align-items: center;

                .legend-circle {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-right: 4px;
                }

                .legend-key {
                    color: #4E5969;
                    font-size: 14px;
                    font-weight: 400;
                }
            }

            .legend-value {
                color: #1D2129;
                font-size: 14px;
                font-weight: 600;
            }
        }
    }
}
</style>
