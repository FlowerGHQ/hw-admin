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
                        {{ item[lang] }}
                    </div>
                </template>
            </slot>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

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
    // 禁用点击
    canClick: {
        type: Boolean,
        default: true,
    },
});
const lang = computed(() => {
    return proxy.$store.state.lang;
});
const emits = defineEmits(['update:activeKey', 'handlechange']);
const onClick = $1 => {
    if (!props.canClick) {
        emits('handlechange', () => {
            emits('update:activeKey', $1);
            emits('handlechange', $1);
        });
    } else {
        emits('update:activeKey', $1);
        emits('handlechange', $1);
    }
};
onMounted(() => {
    // 初始化传递参数
    if (props.tabsList.length > 0) {
        // emits("update:activeKey", props.tabsList[0].key)
        emits('handlechange', props.tabsList[0].key);
    }
});
</script>

<style lang="less" scoped>
.eos-tabs-style {
    display: inline-flex;
    cursor: pointer;
    .tabs-item {
        padding: 6px 16px 4px 16px;
        color: #6a6a6a;
        margin-right: 16px;
        position: relative;
        user-select: none;
        font-weight: 600;
        &:last-child {
            margin-right: 0;
        }
        &::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0;
            display: inline-block;
            width: 0%;
            height: 1px;
            background-color: #0061ff;
            transition: 0.3s;
        }
    }
    .tabsItemActive {
        background-color: #ffffff;
        color: #2f88f9;
        &::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            display: inline-block;
            width: 100%;
            height: 1px;
            background-color: #0061ff;
        }
    }
}
.custom-slot-default {
    margin-top: 10px;
}
</style>
