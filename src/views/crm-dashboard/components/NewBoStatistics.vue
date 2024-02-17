<template>
    <div class="list-container">
        <!-- 标题 -->
        <div class="title">
            <span>{{ $t('crm_dash.business_analysis') }}</span>
        </div>
        <!-- echarts -->
        <div class="table-container">
            <div id="NewBoStatisticsChartId" class="chart" ref="NewBoStatisticsChartId"></div>
        </div>
    </div>
</template>

<script>
import { Chart } from '@antv/g2';
import Core from '../../../core';
import data from '../../../core/data';

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
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                console.log('purchaseIntentStatistics');
                this.purchaseIntentStatistics();
            },
        },
    },
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    created() {
        this.getGroupStatusDetail();
    },
    mounted() {
        // const ths = this;
        // window.onresize =  () => {
        //     ths.resetChart();
        // }
        // this.drawBoStatisticsChart(this.tableData)

        this.purchaseIntentStatistics();
    },
    beforeUnmount() {
        this.$refs.NewBoStatisticsChartId.innerHTML = '';
    },
    methods: {
        // 点击tab
        clickTab(key) {
            this.currentTab = key;
            console.log('切换tab >>', key);
        },

        drawBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:');
                this.boStatisticsChart.destroy();
            }
            const chart = new Chart({
                container: 'NewBoStatisticsChartId',
                autoFit: true,
                height: 274,
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
            chart.legend('item', {
                position: 'bottom', // 配置图例显示位置
                custom: true, // 关键字段，告诉 G2，要使用自定义的图例
                items: data.map((obj, index) => {
                    return {
                        name: obj.item, // 对应 itemName
                        value: obj.percent, // 对应 itemValue
                        marker: {
                            symbol: 'circle', // marker 的形状
                            style: {
                                r: 5, // marker 图形半径
                                fill: chart.getTheme().colors10[index], // marker 颜色，使用默认颜色，同图形对应
                            },
                        }, // marker 配置
                    };
                }),
                itemValue: {
                    style: {
                        fill: '#999',
                    }, // 配置 itemValue 样式
                    formatter: val => `${val * 100}%`, // 格式化 itemValue 内容
                },
            });
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
                            content: data.percent * 100 + '%',
                            style: {
                                fontSize: 30,
                                fill: '#DC6E38',
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
                .color('item', ['#5b8ff9', '#5ad8a6', '#5d7092', '#f6bd16', '#6f5ef9', '#6dc8ec'])
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
        getGroupStatusDetail() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMBoStatusGroup.detail({
                id: 1,
            })
                .then(res => {
                    this.groupStatusTableData = JSON.parse(res.detail.status_list);
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        purchaseIntentStatistics() {
            this.loading = true;
            Core.Api.CRMDashboard.boStatistics({
                ...this.searchForm,
            })
                .then(res => {
                    console.log('getTableData err', res);
                    // this.testDriveIntentList = res.list;
                    const dv = [];
                    res.list.forEach(it => {
                        this.groupStatusTableData.forEach((item, index) => {
                            if (index == it.status) {
                                dv.push({
                                    item: item.zh,
                                    item_en: item.en,
                                    count: it.count,
                                    percent: this.$Util.countFilter(it.count / res.total, 1, 2),
                                });
                            }
                        });
                    });
                    // const dv = [
                    //     { item: '咨询', count: 20, percent: 0.2 },
                    //     { item: '支付定金', count: 20, percent: 0.2 },
                    //     { item: '等待交付', count: 21, percent: 0.21 },
                    //     { item: '预约试驾', count: 17, percent: 0.17 },
                    //     { item: '订单支付', count: 13, percent: 0.13 },
                    //     { item: '已交付', count: 9, percent: 0.09 },
                    // ]
                    // const dv = []
                    // res.list.forEach(res => {
                    //     if(res.type !== 0){
                    //         dv.push({ type: this.$Util.CRMCustomerTestDriveIntentChartFilter(res.type, this.lang), value: res.value })
                    //     }
                    // })
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
    padding-top: 13px;
    padding-left: 18px;
    box-sizing: border-box;
}

.title {
    width: 100%;
    font-size: 15px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 36px;
}

.chart {
    width: 100%;
    height: auto;
}
</style>
