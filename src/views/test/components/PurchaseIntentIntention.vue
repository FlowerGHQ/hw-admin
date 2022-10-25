<template>
    <div class="list-container">
        <div class="title">
            <span>客户购买意向</span>
        </div>

            <!-- echarts -->
            <div class="table-container" >
                <div id="PurchaseIntentchartId" class="chart" ref='PurchaseIntentchartId'></div>
            </div>


        <!-- </div> -->
    </div>
</template>

<script>
import { Chart } from '@antv/g2'
import Core from "../../../core";

export default {
    name: 'Cards',
    components: {
    },
    props: {
        tableData: {
            type: Object,
            default: ()=> []
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
        tableData: {
            deep: true,
            immediate: true,
            handler() {
                console.log("this.tableData", this.tableData)
                // this.drawBoStatisticsChart(this.tableData)
                // this.drawBoStatisticsChart()

            }
        }

    },
    computed: {
    },
    created() {
    },
    mounted() {
        // const ths = this;
        // window.onresize =  () => {
        //     ths.resetChart();
        // }
        // this.drawBoStatisticsChart(this.tableData)
        this.testDriveIntentStatistics()


    },
    beforeUnmount() {
        this.$refs.PurchaseIntentchartId.innerHTML = ''
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
                container: 'PurchaseIntentchartId',
                autoFit: true,
                height: 300,
            });

            chart.data(data);
            chart.scale('type', {
                nice: true,
            });

            chart.tooltip({
                showTitle: false,
                showMarkers: false,
                itemTpl:
                    '<li style="margin-bottom:4px;list-style-type:none;padding: 0;">' +
                    '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
                    '数量：{value}<br/>' +
                    '</li>',
            });
            chart.interaction('active-region');

            chart.interval().position('type*value');

            chart.render();
            this.boStatisticsChart = chart
        },
        testDriveIntentStatistics() {
            this.loading = true;
            Core.Api.CRMDashboard.testDriveIntentStatistics({
                ...this.searchForm
            }).then(res => {
                console.log('getTableData err', res)
                // this.testDriveIntentList = res.list;
                const dv = []
                res.list.forEach(res => {
                    dv.push({type: this.$Util.CRMCustomerTestDriveIntentFilter(res.type),value: res.value})
                })
                this.drawBoStatisticsChart(dv)

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
