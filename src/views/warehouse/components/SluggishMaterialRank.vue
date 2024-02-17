<template>
    <div id="SluggishMaterialRank" class="chart"></div>
</template>

<script setup>
import Core from '@/core';
import { Chart, getEngine } from '@antv/g2';
import { watch, ref, onMounted } from 'vue';

const props = defineProps({
    time: {
        type: Number,
        default: 1,
    },
});

const loading = ref({
    value: false,
});
const chart = ref({});
const chartData = [
    { date: '2023-03-28', value1: 10, value2: 10 },
    { date: '2023-03-29', value1: 14, value2: 12 },
    { date: '2023-03-30', value1: 35, value2: 15 },
    { date: '2023-03-31', value1: 25, value2: 3 },
    { date: '2023-04-01', value1: 19, value2: 20 },
    { date: '2023-04-02', value1: 26, value2: 30 },
    { date: '2023-04-03', value1: 37, value2: 40 },
    { date: '2023-04-04', value1: 9, value2: 37 },
];
// watch(props.time, (newVal, oldVal) => {
//     getTableData(newVal);
//     drawActiveChart(newVal);
// })
onMounted(() => {
    // getTableData()
    drawActiveChart(chartData);
});
// 获取 图表 数据
function getTableData(time) {
    console.log('time', time.value);
    loading.value = true;
    Core.Api.xxx
        .xxx({
            ...time.value,
        })
        .then(res => {
            console.log('SluggishMaterialTrend res', res);
            drawActiveChart(res.list);
        })
        .catch(err => {
            console.log('SluggishMaterialTrend err', err);
        })
        .finally(() => {
            loading.value = false;
        });
}

const drawActiveChart = data => {
    const chart = new Chart({
        container: 'SluggishMaterialRank',
        autoFit: true,
        height: 240,
    });
    chart.data(data);
    chart.scale('value1', {
        nice: true,
    });
    chart.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        shared: true,
        itemTpl:
            '<li style="margin-bottom:4px;list-style-type:none;padding: 0;">' +
            '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
            '<span style="padding-left: 16px;line-height: 30px;">物料：{value}</span><br/>' +
            '</li>',
    });
    chart.legend({
        position: 'bottom',
        custom: true, // 自定义图例
        offsetY: 6,
        items: [
            {
                name: '物料1',
                value: 'value1',
                marker: { symbol: 'square', style: { fill: '#0052D9' } },
            },
            {
                name: '物料2',
                value: 'value2',
                marker: { symbol: 'square', style: { fill: '#B5C7FF' } },
            },
        ],
    });
    chart.axis('value1', {
        // 隐藏y轴线
        grid: null,
    });
    // chart.axis('value2', { // 隐藏y轴线
    //     grid: null
    // })
    chart.line().position('date*value1').color('#0052D9');
    chart.point().position('date*value1').shape('circle').color('#0052D9');
    chart.line().position('date*value2').color('#B5C7FF');
    chart.point().position('date*value2').shape('circle').color('#B5C7FF');
    chart.render();
};
</script>
<style scoped lang="less">
.chart {
    width: 90%;
    margin-top: 10px;
}
</style>
