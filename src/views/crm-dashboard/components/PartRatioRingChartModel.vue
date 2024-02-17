<template>
    <div class="list-container">
        <!-- 标题 -->
        <div class="title">
            <div>已支付用户参与比例</div>
            <div class="detail-title" @click="goToDetail('detail')">详情</div>
        </div>
        <!-- echarts -->
        <div class="table-container">
            <div v-if="!isEmpty" id="PartRatioRingChartId" class="chart" ref="PartRatioRingChartId"></div>
            <div v-if="!isEmpty" class="legend-container">
                <div class="legend-wrap" v-for="item in legendList">
                    <div class="legend-block">
                        <div class="legend-circle" :style="{ backgroundColor: item.color }"></div>
                        <div class="legend-key">{{ item.item }}</div>
                    </div>
                    <div class="legend-value">{{ item.percent * 100 + '%' }}</div>
                </div>
            </div>
            <div v-if="isEmpty" class="empty-wrap">
                <img src="../../../assets/images/dashboard/emptyData.png" alt="" />
                <div class="empty-desc">暂无数据</div>
            </div>
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
            currentTab: '',
            myChart: null,
            boStatisticsChart: {},
            groupStatusTableData: [],
            legendList: [],
            title: '已支付用户参与比例',
            isEmpty: false,
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                if (this.searchForm.activity_id) {
                    this.getPartRatioRingChartData();
                }
            },
        },
    },
    computed: {},
    created() {},
    mounted() {
        if (this.searchForm.activity_id) {
            this.getPartRatioRingChartData();
        }
    },
    beforeUnmount() {
        this.$refs.PartRatioRingChartId.innerHTML = '';
    },
    methods: {
        async drawBoStatisticsChart(data) {
            console.log('环图', data);
            if (this.boStatisticsChart.destroy) {
                this.boStatisticsChart.destroy();
            }
            await this.$nextTick();
            const chart = new Chart({
                container: 'PartRatioRingChartId',
                autoFit: true,
                height: 304,
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
            chart.on('element:statechange', ev => {
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
                            content: data.count + '人',
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
                        });
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
                .color('item', ['#056DFF', '#FFBC48'])
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
            this.boStatisticsChart = chart;
        },
        async getPartRatioRingChartData() {
            try {
                let res = await Core.Api.VoteData.numberStatistics({ ...this.searchForm });
                // 计算已支付人数总和
                const totalPaidCount = res.reduce((sum, item) => sum + item.pay_num, 0);
                // 计算未支付人数总和
                const totalUnpaidCount = res.reduce((sum, item) => sum + (item.uv - item.pay_num), 0);
                // 已支付人数百分比
                const totalPaidPercent = (totalPaidCount / (totalPaidCount + totalUnpaidCount)).toFixed(2);
                // 未支付人数百分比
                const totalUnpaidPercent = (totalUnpaidCount / (totalPaidCount + totalUnpaidCount)).toFixed(2);
                const formattedData = [
                    { item: '已支付', count: totalPaidCount, percent: Number(totalPaidPercent) },
                    { item: '未支付', count: totalUnpaidCount, percent: Number(totalUnpaidPercent) },
                ];
                this.legendList = Core.Util.deepCopy(formattedData);
                const color = ['#056DFF', '#FFBC48']; // 配置项的颜色
                this.legendList.forEach((item, index) => {
                    item.color = color[index];
                });
                if (!formattedData[0].count) {
                    this.isEmpty = true;
                } else {
                    this.isEmpty = false;
                    this.drawBoStatisticsChart(formattedData);
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
                            column_type: Core.Const.VOTE.TYPE.PAID,
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
        color: #0061ff;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
    }
}

.chart {
    width: 200px;
    height: auto;
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

        > img {
            width: 280px;
        }

        .empty-desc {
            margin-top: 10px;
            font-size: 14px;
            color: #86909c;
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
                    color: #4e5969;
                    font-size: 14px;
                    font-weight: 400;
                }
            }

            .legend-value {
                color: #1d2129;
                font-size: 14px;
                font-weight: 600;
            }
        }
    }
}
</style>
