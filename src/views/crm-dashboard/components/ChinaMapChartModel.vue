<template>
    <div class="list-container">
        <!-- title -->
        <div class="title">
            <div>{{ title }}</div>
            <div class="detail-title" @click="goToDetail('detail')">详情</div>
        </div>
        <!-- echarts -->
        <div class="table-container" v-if="!isEmpty">
            <div id="ChinaMapChartId" class="chart" ref="ChinaMapChartId"></div>
            <div class="legend-container">
                <div class="legend-wrap" v-for="item in legendList">
                    <div class="legend-block">
                        <div class="legend-circle" :style="{ backgroundColor: item.color }"></div>
                        <div class="legend-key">{{ item.type }}</div>
                    </div>
                    <div class="legend-value">{{ item.value }}</div>
                </div>
            </div>
        </div>
        <div class="table-container jus" v-if="isEmpty">
            <div class="empty-wrap">
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
            myChart: null,
            boStatisticsChart: {},
            groupStatusTableData: [],
            legendList: [],
            title: '投票地区分布',
            isEmpty: false,
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                if (this.searchForm.activity_id) {
                    this.getChinaMapChartData();
                }
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
        if (this.searchForm.activity_id) {
            this.getChinaMapChartData();
        }
    },
    beforeUnmount() {
        this.$refs.ChinaMapChartId.innerHTML = '';
    },
    methods: {
        async drawMap(data) {
            console.log(document.getElementById('ChinaMapChartId'));
            if (this.boStatisticsChart.destroy) {
                this.boStatisticsChart.destroy();
            }
            /* mock */
            // const data = [
            //     { type: '上海市', value: 34 },
            //     { type: '北京市', value: 85 },
            //     { type: '深圳市', value: 103 },
            //     { type: '重庆市', value: 142 },
            //     { type: '广州市', value: 251 },
            //     { type: '成都市', value: 367 },
            //     { type: '天津市', value: 491 },
            //     { type: '武汉市', value: 672 },
            //     { type: '东莞市', value: 868 },
            //     { type: '西安市', value: 1234 },
            //     { type: '其他', value: 1334 },
            // ];
            await this.$nextTick();
            const chart = new Chart({
                container: 'ChinaMapChartId',
                autoFit: true,
                height: 430,
                padding: [10, 20, 0, 50],
            });
            chart.data(data);
            chart.scale({
                value: {
                    max: data[0].value,
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
                .color('type', [
                    '#001A66',
                    '#00288C',
                    '#0039B3',
                    '#004CD9',
                    '#0061FF',
                    '#3381FF',
                    '#66A0FF',
                    '#99C0FF',
                    '#CCDFFF',
                    '#E6EFFF',
                    '#F3F8FF',
                ])
                .label('value', {
                    style: {
                        fill: '#8d8d8d',
                    },
                    offset: 10,
                });
            chart.interaction('element-active');
            chart.render();

            this.boStatisticsChart = chart;
        },
        async getChinaMapChartData() {
            try {
                const res = await Core.Api.VoteData.cityStatistics({ ...this.searchForm });
                const formattedData = [];
                const cityMap = {};
                res.forEach(item => {
                    item.source_list.forEach(source => {
                        const city = source.code;
                        const voteCount = source.vote_count;
                        if (cityMap[city]) {
                            cityMap[city] += voteCount;
                        } else {
                            cityMap[city] = voteCount;
                        }
                    });
                });
                for (const city in cityMap) {
                    formattedData.push({ type: city === '0' ? '未知ip' : city, value: cityMap[city] });
                }
                const color = [
                    '#001A66',
                    '#00288C',
                    '#0039B3',
                    '#004CD9',
                    '#0061FF',
                    '#3381FF',
                    '#66A0FF',
                    '#99C0FF',
                    '#CCDFFF',
                    '#E6EFFF',
                    '#F3F8FF',
                ]; // 配置项的颜色
                this.legendList = formattedData;
                this.legendList.forEach((item, index) => {
                    item.color = color[index + 1];
                    if (item.type === '0') {
                        item.type = '未知ip';
                    }
                });
                this.legendList = this.legendList.sort((a, b) => b.value - a.value).slice(0, 10);
                if (!formattedData.length) {
                    this.isEmpty = true;
                } else {
                    this.isEmpty = false;
                    this.drawMap(formattedData.sort((a, b) => b.value - a.value).slice(0, 10));
                }
            } catch (error) {
                console.log('Error in getChinaMapChartData err', error);
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
                            api_name: 'cityStatistics',
                            begin_time: this.searchForm.begin_time,
                            end_time: this.searchForm.end_time,
                            column_type: Core.Const.VOTE.TYPE.AREA,
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
    width: 500px;
    height: auto;
}

.table-container {
    display: flex;
    align-items: center;

    &.jus {
        justify-content: center;
        height: 270px;
    }

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
