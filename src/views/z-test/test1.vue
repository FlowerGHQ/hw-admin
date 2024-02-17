<template>
    <div class="MyCountryCascader">
        <MyCountryCascader v-model:value="contryData" />
    </div>
</template>

<script setup>
import MyCountryCascader from '@/components/MyCountryCascader/index.vue';
import { ref } from 'vue';
const contryData = ref([
    '中国',
    '阿富汗',
    '阿拉伯联合酋长国',
    '阿曼',
    '阿塞拜疆',
    '巴基斯坦',
    '巴勒斯坦',
    '巴林',
    '不丹',
    '朝鲜',
    '东帝汶',
    '菲律宾',
    '哈萨克斯坦',
    '韩国',
    '吉尔吉斯斯坦',
    '柬埔寨',
    '卡塔尔',
    '科威特',
    '老挝',
    '黎巴嫩',
    '马尔代夫',
    '马来西亚',
    '蒙古',
    '孟加拉',
    '缅甸',
    '尼泊尔',
    '日本',
    '塞浦路斯',
    '沙特阿拉伯',
    '斯里兰卡',
    '塔吉克斯坦',
    '泰国',
    '土耳其',
    '土库曼斯坦',
    '文莱',
    '乌兹别克斯坦',
    '新加坡',
    '叙利亚',
    '亚美尼亚',
    '也门',
    '伊拉克',
    '伊朗',
    '以色列',
    '印度',
    '印度尼西亚',
    '约旦',
    '越南',
]);
</script>

<style lang="less" scoped>
.MyCountryCascader {
    width: 200px;
    margin: 20px auto 0;
    border: 1px solid red;
}
</style>
