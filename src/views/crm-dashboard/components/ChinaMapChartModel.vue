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
            <div id="ChinaMapChartId" class="chart" ref='ChinaMapChartId'></div>
            <div class="legend-container">
                <div class="legend-wrap" v-for="item in legendList">
                    <div class="legend-block">
                        <div class="legend-circle" :style="{ backgroundColor: item.color }"></div>
                        <div class="legend-key">{{ item.name }}</div>
                    </div>
                    <div class="legend-value">{{ item.value }}</div>
                </div>
            </div>
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
            legendList: [
                {
                    name: '上海市',
                    color: '#001A66',
                    value: '300'
                },
                {
                    name: '北京市',
                    color: '#00288C',
                    value: '240'
                },
                {
                    name: '深圳市',
                    color: '#0039B3',
                    value: '200'
                },
                {
                    name: '重庆市',
                    color: '#004CD9',
                    value: '160'
                },
                {
                    name: '广州市',
                    color: '#0061FF',
                    value: '120'
                },
                {
                    name: '成都市',
                    color: '#3381FF',
                    value: '80'
                },
                {
                    name: '天津市',
                    color: '#66A0FF',
                    value: '60'
                },
                {
                    name: '武汉市',
                    color: '#99C0FF',
                    value: '50'
                },
                {
                    name: '东莞市',
                    color: '#CCDFFF',
                    value: '20'
                },
                {
                    name: '西安市',
                    color: '#E6EFFF',
                    value: '10'
                },
                {
                    name: '其他',
                    color: '#F3F8FF',
                    value: '6'
                },
            ],
            title: '投票地区分布',
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
                height: 430,
                padding: [10, 20, 0, 50]
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
                .color('value', ['#F3F8FF', '#E6EFFF', '#CCDFFF', '#99C0FF', '#66A0FF', '#3381FF', '#0061FF', '#004CD9', '#0039B3', '#00288C', '#001A66'])
                .label('value', {
                    style: {
                        fill: '#8d8d8d',
                    },
                    offset: 10,
                });
            chart.interaction('element-active');
            // chart.theme({ "styleSheet": { "brandColor": "#5B8FF9", "paletteQualitative10": ["#5B8FF9", "#61DDAA", "#65789B", "#F6BD16", "#7262fd", "#78D3F8", "#9661BC", "#F6903D", "#008685", "#F08BB4"], "paletteQualitative20": ["#5B8FF9", "#CDDDFD", "#61DDAA", "#CDF3E4", "#65789B", "#CED4DE", "#F6BD16", "#FCEBB9", "#7262fd", "#D3CEFD", "#78D3F8", "#D3EEF9", "#9661BC", "#DECFEA", "#F6903D", "#FFE0C7", "#008685", "#BBDEDE", "#F08BB4", "#FFE0ED"] } });
            chart.render();

            this.boStatisticsChart = chart
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
    width: 500px;
    height: auto
}

.table-container {
    display: flex;
    // justify-content: center;
    align-items: center;

    .legend-container {
        margin-left: 20px;

        .legend-wrap {
            width: 100px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            margin-bottom: 16px;

            .legend-block {
                width: 54px;
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
}</style>
