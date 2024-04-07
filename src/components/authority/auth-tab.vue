<template>
    <div class="auth-tab">
        <div
            v-for="(item, index) in AUTH_LIST_TEMP"
            :key="index"
            class="auth-tab-item"
            :class="{ 'auth-tab-item-change': item.tab === activeTab, 'm-r-10': index !== AUTH_LIST_TEMP.length - 1 }"
            @click="handelTab(item)"
        >
            {{ item.name }}
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Core from '@/core';

const route = useRoute();
const router = useRouter();
const props = defineProps({});
const emits = defineEmits(["tab"]);

// 常量
const AUTH_LIST_TEMP = Core.Const.SYSTEM_AUTH.AUTH_LIST_TEMP;

// 响应式常量
const activeTab = ref(1);

watch();
// () => props.visible,
// (newV, oldV) => {},
// {
//     deep: true,
//     immediate: true,
// },

/* 生命周期*/
onMounted(() => {});
defineExpose({
    activeTab
})
/* 生命周期*/

/* fetch start */
const XXXX = (params = {}) => {
    let obj = {
        ...params,
    };

    Core.Api.xxx(obj)
        .then(res => {})
        .catch(err => {});
};
/* fetch end */

/* methods start */
const handelTab = item => {
    activeTab.value = item.tab;
    emits('tab', item.tab)
};
/* methods end */
</script>

<style lang="less" scoped>
.auth-tab {
    &-item {
        display: inline-block;
        padding: 5px;
        box-sizing: border-box;
        border: 1px solid rgba(102, 102, 102, 0.5);
        font-size: 14px;
        color: #666;
        cursor: pointer;
    }

    &-item-change {
        background-color: #006cff;
        color: #fff;
        border: 1px solid #006cff;
    }
}
</style>
