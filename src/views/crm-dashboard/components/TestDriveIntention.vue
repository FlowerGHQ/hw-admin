<template>
    <div class="list-container">
        <div class="title">
            <span>{{ $t('crm_dash.test_drive_intention') }}</span>
        </div>

        <!-- echarts -->
        <div class="table-container">
            <div id="TestDriveIntentionChartId" class="chart" ref="TestDriveIntentionChartId"></div>
        </div>

        <!-- </div> -->
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
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                this.purchaseIntentStatistics();
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
        // const ths = this;
        // window.onresize =  () => {
        //     ths.resetChart();
        // }
        // this.drawBoStatisticsChart(this.tableData)
        this.purchaseIntentStatistics();
    },
    beforeUnmount() {
        this.$refs.TestDriveIntentionChartId.innerHTML = '';
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
                container: 'TestDriveIntentionChartId',
                autoFit: true,
                height: 380,
            });

            chart.data(data);
            chart.scale('type', {
                nice: true,
            });
            chart.coordinate('theta', {
                radius: 0.75,
                innerRadius: 0.6,
            });
            chart.tooltip({
                showTitle: false,
                showMarkers: false,
                itemTpl:
                    '<li style="margin-bottom:0px;list-style-type:none;padding: 0; height:40px">' +
                    '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
                    '<span style="line-height: 20px;">名称：{name}<br/></span>' +
                    '<span style="padding-left: 16px; line-height: 20px;">数量：{value}<br/></span>' +
                    '</li>',
            });
            chart.interval().adjust('stack').position('value').color('type').shape('slice-shape');

            chart.interaction('element-active');
            chart.annotation().text({
                position: ['50%', '56%'],
                // content: 'Test Drive intention',
                content: this.$t('crm_dash.test_drive_intention_echarts'),
                style: {
                    fontSize: 14,
                    fill: '#000000',
                    textAlign: 'center',
                    fontWeight: 900,
                },
                offsetY: -20,
            });

            chart.render();
            this.boStatisticsChart = chart;
        },
        purchaseIntentStatistics() {
            this.loading = true;
            Core.Api.CRMDashboard.testDriveIntentStatistics({
                ...this.searchForm,
            })
                .then(res => {
                    console.log('getTableData err', res);
                    // this.testDriveIntentList = res.list;
                    const dv = [];
                    res.list.forEach(res => {
                        if (res.type !== 0) {
                            dv.push({
                                type: this.$Util.CRMCustomerTestDriveIntentChartFilter(res.type, this.lang),
                                value: res.value,
                            });
                        }
                    });
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
