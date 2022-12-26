<template>
    <div class="list-container">
        <div class="title">
            <span>{{$t('db.sales_ranking')}}</span>
        </div>
        <div class="unit">
            {{$t('db.unit')}}
        </div>

        <!-- echarts -->
        <div class="table-container">
            <div id="RankchartId" class="chart" ref='RankchartId'></div>
        </div>
    </div>
</template>

<script>
import { Chart,registerTheme } from '@antv/g2'
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
            chartHeight:254,
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
        this.testDriveIntentStatistics(),
        this.chartHeight = Core.Util.auth('ADMIN') ? 254 : 420
    },
    beforeUnmount() {
        this.$refs.RankchartId.innerHTML = ''
    },
    methods: {
        drawBoStatisticsChart(data) {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:')
                this.boStatisticsChart.destroy()
            }
            const chart = new Chart({
                container: 'RankchartId',
                autoFit: true,
                height: this.chartHeight,
            });
            registerTheme('newTheme', {minColumnWidth:10,maxColumnWidth:15,});
            chart.theme('newTheme');
            chart.data(data);
            chart.scale('name', {
                nice: true,
            });
            chart.tooltip({
                showMarkers: false,
            });
            chart.interaction('active-region');
            chart
            .interval().position('name*sales').color('#346EF2')
            .style({ radius: [40, 40, 40, 40] });
            chart.render();
            this.boStatisticsChart = chart
        },
        testDriveIntentStatistics() {
            this.loading = true;
            Core.Api.CRMDashboard.purchaseIntentStatistics({
                ...this.searchForm
            }).then(res => {
                console.log('getTableData err', res)
                // this.testDriveIntentList = res.list;
                const dv = []
                res.list.forEach(res => {
                    if(res.type !== 0){
                        if(res.type !== 40){
                        dv.push({ type: this.$Util.CRMCustomerPurchaseIntentChartFilter(res.type, this.lang), value: res.value })
                        }
                    }
                })
                const _data = [
                    { name: '李小明', sales: 80 },
                    { name: '黄丹', sales: 52 },
                    { name: '徐鹏', sales: 201 },
                    { name: '王一鸣', sales: 145 },
                    { name: '乔治', sales: 48 },
                    { name: '佩奇', sales: 68 },
                    { name: '张三', sales: 18 },
                    { name: '李四', sales: 138 },
                ];
                this.drawBoStatisticsChart(_data)

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
    // border-bottom: 2px solid #f0f2f5;
    font-size: 20px;
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
.unit {
    padding: 12px 16px;
    width: 100%;
    font-size: 16px;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
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
