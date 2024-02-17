<template>
    <div class="wh-charts" ref="chartRef" :style="{ height: height, width: width }"></div>
</template>

<script setup>
import { ref, reactive, watch, onBeforeUnmount, onMounted } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref(null);
const myChart = ref(null);
const props = defineProps({
    options: {
        type: Object,
        default: () => {},
    },
    width: {
        type: String,
        default: '100%',
    },
    height: {
        type: String,
        default: '100%',
    },
});

//尺寸自适应
const resizeHandler = () => {
    if (chartRef.value) {
        myChart.value.resize();
    }
};
// 清除chart
const clearChart = () => {
    if (chartRef.value) {
        myChart.value.clear();
    }
};
// 刷新
const refresh = () => {
    setOption(props.options);
};
// 初始化图表
const initChart = () => {
    if (chartRef.value) {
        myChart.value = echarts.init(
            chartRef.value,
            null,
            { renderer: 'svg' },
            { height: props.height, width: props.width },
        );
        myChart.value.setOption(props.options);
        window.addEventListener('resize', resizeHandler);
    }
};

// 设置option
const setOption = options => {
    clearChart();
    resizeHandler();
    if (chartRef.value) {
        initChart();
    }
};
watch(
    () => props.options,
    newVal => {
        if (newVal) {
            refresh();
        }
    },
    {
        deep: true,
        immediate: true,
    },
);

onMounted(() => {
    initChart();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler);
});
</script>

<style lang="less" scoped></style>
