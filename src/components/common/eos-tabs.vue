<template>
    <!-- 
        activeKey v-model 选中哪个值 示例 v-model:activeKey="activeKey1"
        tabsList 渲染tabs数据  示例 [{key: 1, value:""}]
        eosTabsCustom  自定义外层样式
     -->
    <div class="custom-tabs">
        <div class="eos-tabs-style" :style="eosTabsCustom">
            <slot name="tab">
                <template v-for="(item, index) in tabsList" :key="item.key">
                    <div
                        class="tabs-item"
                        :class="{ tabsItemActive: item.key == activeKey }"
                        @click="onClick(item.key)"
                    >
                        {{ item.value }}
                    </div>
                </template>
            </slot>
        </div>
        <div class="custom-slot-default">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    // v-model 绑定值
    activeKey: {
        type: [Number, String],
    },
    // 渲染tabs数据
    tabsList: {
        type: [Array, Object],
        default: () => [],
    },
    // 自定义外层样式
    eosTabsCustom: {
        type: Object,
    },
});

const emits = defineEmits(['update:activeKey', 'handlechange']);
const onClick = $1 => {
    emits('update:activeKey', $1);
    emits('handlechange', $1);
};
onMounted(() => {
    // 初始化传递参数
    if (props.tabsList.length > 0) {
        emits('update:activeKey', props.tabsList[0].key);
        emits('handlechange', props.tabsList[0].key);
    }
});
</script>

<style lang="less" scoped>
.eos-tabs-style {
    display: inline-flex;
    background-color: #f5f5f5;
    padding: 3px 10px;
    cursor: pointer;
    .tabs-item {
        padding: 5px 10px;
        color: #6a6a6a;
    }
    .tabsItemActive {
        background-color: #ffffff;
        color: #2f88f9;
    }
}
.custom-slot-default {
    margin-top: 10px;
}
</style>
