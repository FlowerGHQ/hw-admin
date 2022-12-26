<template>
    <div class="list-container">
        <!-- 标题 -->
        <div class="title">
            <span>{{ $t('crm_dash.business_analysis') }}</span>
        </div>
        <!-- echarts -->
        <div class="table-container">
            <div id="NewBoStatisticsChartId" class="chart" ref='NewBoStatisticsChartId'></div>
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
    },
    data() {
        return {
            currentTab: '',
            myChart: null,
            boStatisticsChart: {},

        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                this.purchaseIntentStatistics()
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
        // const ths = this;
        // window.onresize =  () => {
        //     ths.resetChart();
        // }
        // this.drawBoStatisticsChart(this.tableData)
        this.purchaseIntentStatistics()


    },
    beforeUnmount() {
        this.$refs.NewBoStatisticsChartId.innerHTML = ''
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
                container: 'NewBoStatisticsChartId',
                autoFit: true,
                height: 306,
            });

            chart.data(data);
            chart.scale('type', {
                nice: true,
            });
            chart.coordinate('theta', {
                radius: 0.7,
                innerRadius: 0.8,
            });
            // chart.tooltip({
            //     showTitle: false,
            //     showMarkers: false,
            //     itemTpl:
            //         '<li style="margin-bottom:0px;list-style-type:none;padding: 0; height:40px">' +
            //         '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
            //         '<span style="line-height: 20px;">名称：{name}<br/></span>' +
            //         '<span style="padding-left: 16px; line-height: 20px;">比例：{value}%<br/></span>' +
            //         '</li>',
            // });
            chart.legend({
                position: 'bottom',
                itemName: {
                    style: {
                        fontSize: 16,
                        fontWeight: 500,
                        fill: '#333333',
                    }
                },
                animate: true,
            });

            chart
                .interval()
                .adjust('stack')
                .position('value')
                .color('type', ['#7E86F7', '#65D3C2', '#F7CC73', '#9BE5A0', '#7EA4F1', '#F18447'])
                .label('value', (value) => {
                    return {
                        content: (data) => {
                            return `${data.type}: ${value}%`;
                        },
                    };
                })
                .tooltip('type*value', (data, value) => {
                    value = value + '%';
                    return {
                        name: type,
                        value: value,
                    };
                });
            chart.interaction('element-active');
            chart
                .annotation()
                .text({
                    position: ['50%', '56%'],
                    content: this.$t('crm_dash.business_analysis'),
                    style: {
                        fontSize: 16,
                        fill: '#333333',
                        textAlign: 'center',
                    },
                    offsetY: -20,
                })
            chart.render();
            this.boStatisticsChart = chart
        },
        purchaseIntentStatistics() {
            this.loading = true;
            Core.Api.CRMDashboard.testDriveIntentStatistics({
                ...this.searchForm
            }).then(res => {
                console.log('getTableData err', res)
                // this.testDriveIntentList = res.list;
                const dv = [
                    { type: '咨询', value: 3669 },
                    { type: '支付定金', value: 2441 },
                    { type: '等待交付', value: 370 },
                    { type: '预约试驾', value: 1233 },
                    { type: '订单支付', value: 2071 },
                    { type: '已交付', value: 217 },
                ]
                // const dv = []
                // res.list.forEach(res => {
                //     if(res.type !== 0){
                //         dv.push({ type: this.$Util.CRMCustomerTestDriveIntentChartFilter(res.type, this.lang), value: res.value })
                //     }
                // })
                const data = []
                dv.forEach((item) => {
                    data.push({ type: item.type, value: item.value / 100 })
                })
                console.log('yxy:', data);
                this.drawBoStatisticsChart(data)

            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        }


    }
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
        border: 1px solid #006EF9;
        color: #006EF9;
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
        color: #006EF9;
        font-size: 20px;
    }
}

.chart {
    // width: 600px;
    width: 100%;
    // height: 400px;
    height: auto
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
