<template>
    <div class="list-container">
        <!-- 标题 -->
        <div class="title">
            <span>投票地区分布</span>
        </div>
        <!-- echarts -->
        <div class="table-container">
            <div id="ChinaMapChartId" class="chart" ref='ChinaMapChartId'></div>
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
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                console.log("purchaseIntentStatistics")
                // this.purchaseIntentStatistics()
            }
        },

    },
    computed: {
        lang() {
            return this.$store.state.lang
        },
    },
    created() {
        // this.getGroupStatusDetail();
    },
    mounted() {
        this.drawMap();
        // this.purchaseIntentStatistics()
    },
    beforeUnmount() {
        this.$refs.ChannelRingChartId.innerHTML = ''
    },
    methods: {
        // 点击tab
        clickTab(key) {
            this.currentTab = key;
            console.log('切换tab >>', key);
        },
        drawMap() {
            if (this.boStatisticsChart.destroy) {
                console.log('drawPurchaseChart destroy:')
                this.boStatisticsChart.destroy()
            }
            const data = [
                { type: '上海市', value: 34 },
                { type: '北京市', value: 85 },
                { type: '深圳市', value: 103 },
                { type: '重庆市', value: 142 },
                { type: '广州市', value: 251 },
                { type: '成都市', value: 367 },
                { type: '天津市', value: 491 },
                { type: '武汉市', value: 672 },
                { type: '东莞市', value: 868 },
                { type: '西安市', value: 1234 },
                { type: '其他', value: 1334 },
            ];
            const chart = new Chart({
                container: 'ChinaMapChartId',
                autoFit: true,
                height: 400,
            });
            chart.data(data);
            chart.scale({
                value: {
                    max: 1400,
                    min: 0,
                    alias: '人数（个）',
                },
            });
            chart.axis('type', {
                title: null,
                tickLine: null,
                line: null,
            });
            chart.axis('value', {
                label: null,
                title: {
                    offset: 30,
                    style: {
                        fontSize: 12,
                        fontWeight: 300,
                    },
                },
            });
            chart.legend(false);
            chart.coordinate().transpose();
            chart
                .interval()
                .position('type*value')
                .size(26)
                .label('value', {
                    style: {
                        fill: '#8d8d8d',
                    },
                    offset: 10,
                });
            chart.interaction('element-active');
            chart.theme({ "styleSheet": { "brandColor": "#5B8FF9", "paletteQualitative10": ["#5B8FF9", "#61DDAA", "#65789B", "#F6BD16", "#7262fd", "#78D3F8", "#9661BC", "#F6903D", "#008685", "#F08BB4"], "paletteQualitative20": ["#5B8FF9", "#CDDDFD", "#61DDAA", "#CDF3E4", "#65789B", "#CED4DE", "#F6BD16", "#FCEBB9", "#7262fd", "#D3CEFD", "#78D3F8", "#D3EEF9", "#9661BC", "#DECFEA", "#F6903D", "#FFE0C7", "#008685", "#BBDEDE", "#F08BB4", "#FFE0ED"] } });
            chart.render();

            this.boStatisticsChart = chart
        },
        getGroupStatusDetail() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMBoStatusGroup.detail({
                id: 1,
            }).then(res => {
                this.groupStatusTableData = JSON.parse(res.detail.status_list)
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // purchaseIntentStatistics() {
        //     this.loading = true;
        //     Core.Api.CRMDashboard.boStatistics({
        //         ...this.searchForm
        //     }).then(res => {
        //         console.log('getTableData err', res)
        //         // this.testDriveIntentList = res.list;
        //         const dv = [];
        //         res.list.forEach(it => {
        //             this.groupStatusTableData.forEach((item, index) => {

        //                 if (index == it.status) {
        //                     dv.push({ item: item.zh, item_en: item.en, count: it.count, percent: this.$Util.countFilter(it.count / res.total, 1, 2) });
        //                 }
        //             })

        //         })
        //         // const dv = [
        //         //     { item: '咨询', count: 20, percent: 0.2 },
        //         //     { item: '支付定金', count: 20, percent: 0.2 },
        //         //     { item: '等待交付', count: 21, percent: 0.21 },
        //         //     { item: '预约试驾', count: 17, percent: 0.17 },
        //         //     { item: '订单支付', count: 13, percent: 0.13 },
        //         //     { item: '已交付', count: 9, percent: 0.09 },
        //         // ]
        //         // const dv = []
        //         res.list.forEach(res => {
        //             if (res.type !== 0) {
        //                 dv.push({ type: this.$Util.CRMCustomerTestDriveIntentChartFilter(res.type, this.lang), value: res.value })
        //             }
        //         })
        //         this.drawBoStatisticsChart(dv)

        //     }).catch(err => {
        //         console.log('getTableData err', err)
        //     }).finally(() => {
        //         this.loading = false;
        //     });
        // }


    }
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
    height: auto
}
</style>
