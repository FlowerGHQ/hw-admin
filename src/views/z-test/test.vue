<template>
    <div>
        <div id="container" class="chart"></div>
    </div>
    <!-- meun -->
    <div style="width: 256px">
        <a-menu            
            v-model:openKeys="state.openKeys"
            v-model:selectedKeys="state.selectedKeys"
            mode="inline"
            theme="dark"
            :inline-collapsed="state.collapsed"
        >
            <a-menu-item key="1">
                <template #icon>
                    <PieChartOutlined />
                </template>
                <span>Option 1</span>
            </a-menu-item>
            <a-menu-item key="2">
                <template #icon>
                    <DesktopOutlined />
                </template>
                <span>Option 2</span>
            </a-menu-item>
            <a-menu-item key="3">
                <template #icon>
                    <InboxOutlined />
                </template>
                <span>Option 3</span>
            </a-menu-item>
            <a-sub-menu key="sub1">
                <template #icon>
                    <MailOutlined />
                </template>
                <template #title>Navigation One</template>

                <a-menu-item key="5">Option 5</a-menu-item>
                <a-menu-item key="6">Option 6</a-menu-item>
                <a-menu-item key="7">Option 7</a-menu-item>
                <a-menu-item key="8">Option 8</a-menu-item>
            </a-sub-menu>

            <a-sub-menu key="sub2">
                <template #icon>
                    <AppstoreOutlined />
                </template>
                <template #title>Navigation Two</template>
                <a-menu-item key="9">Option 9</a-menu-item>
                <a-menu-item key="10">Option 10</a-menu-item>              
            </a-sub-menu>
        </a-menu>
    </div>
</template>

<script setup>
import { onMounted, ref, defineComponent, reactive, toRefs, watch } from "vue";
import { Chart } from "@antv/g2";
import {
    PieChartOutlined,
    MailOutlined,
    DesktopOutlined,
    InboxOutlined,
    AppstoreOutlined,
} from "@ant-design/icons-vue";

const chart = ref(null);
const state = reactive({
    collapsed: false,
    selectedKeys: ["5"],
    openKeys: ["sub1"],    
});

onMounted(() => {
    // charts()
});

// 试验charts
const charts = () => {
    chart.value = new Chart({
        container: "container",
        autoFit: true,
        height: 500,
    });

    const data = [
        { country: "Asia", year: "1750", value: 502 },
        { country: "Asia", year: "1800", value: 635 },
        { country: "Asia", year: "1850", value: 809 },
        { country: "Asia", year: "1900", value: 5268 },
        { country: "Asia", year: "1950", value: 4400 },
        { country: "Asia", year: "1999", value: 3634 },
        { country: "Asia", year: "2050", value: 947 },

        { country: "Africa", year: "1750", value: 106 },
        { country: "Africa", year: "1800", value: 107 },
        { country: "Africa", year: "1850", value: 111 },
        { country: "Africa", year: "1900", value: 1766 },
        { country: "Africa", year: "1950", value: 221 },
        { country: "Africa", year: "1999", value: 767 },
        { country: "Africa", year: "2050", value: 133 },

        { country: "Europe", year: "1750", value: 163 },
        { country: "Europe", year: "1800", value: 203 },
        { country: "Europe", year: "1850", value: 276 },
        { country: "Europe", year: "1900", value: 628 },
        { country: "Europe", year: "1950", value: 547 },
        { country: "Europe", year: "1999", value: 729 },
        { country: "Europe", year: "2050", value: 408 },

        { country: "Oceania", year: "1750", value: 200 },
        { country: "Oceania", year: "1800", value: 200 },
        { country: "Oceania", year: "1850", value: 200 },
        { country: "Oceania", year: "1900", value: 460 },
        { country: "Oceania", year: "1950", value: 230 },
        { country: "Oceania", year: "1999", value: 300 },
        { country: "Oceania", year: "2050", value: 300 },
    ];

    chart.value.data(data);

    chart.value.scale({
        year: {
            type: "cat",
            range: [0.03, 0.92],
        },
        value: {
            nice: true,
        },
    });

    chart.value.area().shape("smooth").position("year*value").color("country");
    chart.value.line().shape("smooth").position("year*value").color("country");

    chart.value.interaction("element-highlight");

    chart.value.render();
};
</script>

<style lang="less" scoped>
.chart {
    width: 800px;
    margin-top: 100px;
    margin-left: 40px;
}
</style>
