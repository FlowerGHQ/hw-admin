<template>
    <div class="list-container">
        <div class="title">标签</div>
        <!-- <div class="contain"> -->
            <!-- table -->
            <div class="table-container" v-if="type === 1">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :pagination='false'
                    :row-key="record => record.id"
                    :indentSize='0'
                    :expandIconColumnIndex="expandIconColumnIndex"
                >
                    <template #bodyCell="{ column, text , index, record }">
                        <template v-if="column.key === 'index'">
                            <span>{{index + 1}}</span>
                        </template>
                        <template v-if="column.key === 'name'">
                            <span>{{ text }}</span>
                        </template>
                        <template v-if="column.key === 'winNum'">
                            <span>{{ text }}</span>
                        </template>
                        <template v-if="column.key === 'myGap'">
                            <span>{{ text }}</span>
                        </template>
                    </template>
                </a-table>
            </div>
            <!-- form -->
            <div class="table-container" v-if="type === 2">
                <a-row :gutter="[20,0]">
                    <a-col v-for="(item, index) in formList" :key="index" :xs='24' :sm='12' :xl="12" :xxl='12'>
                        <div class="form-item">
                            <span class="form-label"><i class="icon i_add" style="margin-right:16px"/>{{ item.label }}</span>
                            <span class="form-value">{{ info[item.key] || '-' }}</span>
                        </div>
                    </a-col>
                </a-row>
            </div>
            <!-- echarts -->

            <div class="table-container" v-if="type === 3">
                <div :id="chartId" class="chart" :ref='chartId'></div>
            </div>
        <!-- </div> -->
    </div>
</template>

<script>
import Core from '../../core';
import { Chart } from '@antv/g2'

export default {
    name: 'Card',
    components: {
    },
    props: {
        info: {
            type: Object,
            default: ()=> {}
        },
        tableData: {
            type: Object,
            default: ()=> [{ name: '1', winNum: '2', myGap: '3' }]
        },
        type: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            formList: [
                { label: '标签名称', icon: '', key: 'name' },
                { label: '标签名称', icon: '', key: 'name' },
                { label: '标签名称', icon: '', key: 'name' },
                { label: '标签名称', icon: '', key: 'name' },
                { label: '标签名称', icon: '', key: 'name' },
            ],
            myChart: null,
            chartId: 'echart',
            timer: null,
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: '排名', dataIndex: 'index', key: 'index' },
                { title: '人员名字', dataIndex: 'name', key: 'name' },
                { title: '赢单数量', dataIndex: 'winNum', key: 'winNum' },
                { title: '我的差距', dataIndex: 'myGap', key: 'myGap' },
            ]
            return tableColumns
        },
    },
    created() {
    },
    mounted() {
        const ths = this;
        this.initChart({});
        window.onresize =  () => {
            ths.resetChart();
        }
    },
    methods: {
        resetChart() {
            if(this.timer !== null) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(function() {
                this.timer = null;
                this.initChart();
            }, 500);
        },
        initChart(data) {
            if (this.myChart && this.myChart.destroy) {
                console.log('drawPurchaseChart destroy:')
                this.myChart.destroy()
            }
            let width = document.getElementById(this.chartId).offsetWidth;
            let rate = 300 / 200; //  宽/高
            let chart = new Chart({
                container: this.chartId,
                autoFit: true,
                height: width / rate,
                width,
            })
            chart.data(data)
            this.myChart = chart
        },
    }
};
</script>

<style lang="less" scoped>
.title {
    padding: 12px 16px;
    border-bottom: 2px solid #f0f2f5;
    font-size: 16px;
    font-weight: bold;
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
</style>
