<template>
    <div class="list-container">
        <div class="title">
            <span>{{ $t('crm_dash.business_analysis') }}</span>
        </div>

        <!-- echarts -->
        <div class="table-container">
            <div id="chartId" class="chart" ref="chartId"></div>
        </div>

        <!-- </div> -->
    </div>
</template>

<script>
import Core from '../../../core';
// import DataSet from '@antv/data-set';
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
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                this.boStatistics();
            },
        },
    },
    computed: {},
    created() {},
    mounted() {
        // const ths = this;
        // window.onresize =  () => {
        //     ths.resetChart();
        // }
        this.getStatusDetail();
    },
    beforeUnmount() {
        this.$refs.chartId.innerHTML = '';
    },
    methods: {
        // 点击tab
        clickTab(key) {
            this.currentTab = key;
            console.log('切换tab >>', key);
        },
        // 窗口缩放重制chart
        // resetChart() {
        //     if(this.timer !== null) {
        //         clearTimeout(this.timer);
        //     }
        //     this.timer = setTimeout(() => {
        //         this.timer = null;
        //         this.initChart();
        //     }, 500);
        // },
        // // 初始化chart
        // initChart(data) {
        //     let el = document.getElementById(this.chartId);
        //     if (this.myChart && this.myChart.destroy) {
        //         this.myChart.destroy();
        //         el.innerHTML = '';
        //         this.myChart = null;
        //     }
        //     this.$nextTick(()=>{
        //         let width = el.offsetWidth;
        //         let rate = 300 / 200; //  宽/高
        //         console.log('init chart width >>', width, width / rate)
        //         let chart = new Chart({
        //             container: this.chartId,
        //             autoFit: true,
        //             height: width / rate,
        //             width,
        //         })
        //         chart.data(data)
        //         this.myChart = chart;
        //         console.log(this.myChart)
        //     })
        // },

        getStatusDetail() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMBoStatusGroup.detail({
                id: 1,
            })
                .then(res => {
                    this.detail = res.detail;
                    console.log('tableData err:', this.detail);
                    console.log('tableData err:', this.detail.status_list);
                    this.tableData = JSON.parse(this.detail.status_list);
                    this.boStatistics();
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        boStatistics() {
            Core.Api.CRMDashboard.boStatistics({
                ...this.searchForm,
            }).then(res => {
                // const { DataView } = DataSet;
                // const dv = new DataView().source([
                //     { action: '浏览网站', pv: 50000 },
                //     { action: '放入购物车', pv: 35000 },
                //     { action: '生成订单', pv: 25000 },
                //     { action: '支付订单', pv: 15000 },
                //     { action: '完成交易', pv: 8000 },
                // ]);
                const dv = [];
                console.log('res', res);
                console.log('res.list', this.tableData);
                this.tableData.forEach((item, index) => {
                    res.list.forEach(it => {
                        console.log('status', item.status);
                        console.log('status', it.status);
                        if (index === it.status) {
                            dv.push({ action: item.zh, pv: it.count, money: it.money, percent: it.rate / 100 });
                        }
                    });
                });
                for (let i = res.list.length - 1; i >= 0; i--) {
                    let it = res.list[i];
                    if (100 === it.status) {
                        dv.push({ action: '赢单', pv: it.count, money: it.money, percent: it.rate / 100 });
                    }
                    if (-100 === it.status) {
                        dv.push({ action: '输单', pv: it.count, money: it.money, percent: it.rate / 100 });
                    }
                }
                // res.list.forEach(it => {
                //
                // })

                console.log('dv', dv);
                // const dv  = [
                //     { action: '浏览网站', pv: 50000, percent: 1 },
                //     { action: '放入购物车', pv: 35000 , percent: 0.75},
                //     { action: '生成订单', pv: 25000, percent: 0.5 },
                //     { action: '支付订单', pv: 15000, percent: 0.25 },
                //     { action: '完成交易', pv: 8000, percent: 0.1 },
                // ]

                this.drawBoStatisticsChart(dv);
            });
        },
        drawBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:');
                this.boStatisticsChart.destroy();
            }
            const chart = new Chart({
                container: 'chartId',
                autoFit: true,
                height: 500,
                padding: [20, 120, 95],
            });
            chart.data(data);
            chart.axis(false);
            chart.tooltip({
                showTitle: false,
                showMarkers: false,
                itemTpl:
                    '<li style="margin-bottom:4px;list-style-type:none;padding: 0;">' +
                    '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
                    '{name}<br/>' +
                    '<span style="padding-left: 16px;line-height: 16px;">数量：{pv}</span><br/>' +
                    '<span style="padding-left: 16px;line-height: 16px;">金额：{money}</span><br/>' +
                    '<span style="padding-left: 16px;line-height: 16px;">转换率：{percent}</span><br/>' +
                    '</li>',
            });
            chart.coordinate('rect').transpose().scale(1, -1);
            chart
                .interval()
                .adjust('symmetric')
                .position('action*percent')
                .shape('funnel')
                .color('action', ['#5F86FC', '#6F92FC', '#8FAAFD', '#AFC2FD', '#41D0E9', '#DDE1F0'])
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
                .tooltip('action*pv*percent*money', (action, pv, percent, money) => {
                    return {
                        name: action,
                        percent: +percent * 100 + '%',
                        pv,
                        money,
                    };
                })
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
                        content: +obj.percent * 100 + '%', // 显示的文本内容
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
        border: 1px solid #006ef9;
        color: #006ef9;
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
        color: #006ef9;
        font-size: 20px;
    }
}
.chart {
    width: 100%;
    height: auto;
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
