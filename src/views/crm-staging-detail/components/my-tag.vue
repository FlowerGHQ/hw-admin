<template>
    <span
        class="my-tag"
        :style="{ border: border ? '' : 'none', color: color, background: bgColor, borderColor: borderColor }"
    >
        <slot></slot>
    </span>
</template>

<script setup>
const $prop = defineProps({
    border: {
        required: false,
        type: Boolean,
        default: false,
    },
    color: {
        required: false,
        type: String,
        default: '#4E5969',
    },
    bgColor: {
        required: false,
        type: String,
        default: '#F2F3F5',
    },
    borderColor: {
        required: false,
        type: String,
        default: '#F2F3F5',
    },
});
const $emit = defineEmits(['enter']);
</script>

<style lang="less" scoped>
.my-tag {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: 12px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: 'tnum';
    display: inline-block;
    height: auto;
    padding: 0 8px;
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    opacity: 1;
    transition: all 0.3s;
}
</style>
