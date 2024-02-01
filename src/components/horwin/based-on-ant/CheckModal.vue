<template>
    <a-modal centered :closable="false" v-model:visible="visible" class="continue-modal" :width="320" :footer="null"
        :bodyStyle="bodyStyle">
        <div class="modal-header">
            {{ $t(/*确定退出吗*/'operation.sure_tip') }}
        </div>
        <div class="modal-content">
            {{ bodyText }}
        </div>
        <div class="divide-line"></div>
        <div class="modal-footer">
            <slot></slot>
        </div>
    </a-modal>
</template>

<script setup>
import { ref, onMounted } from "vue";
const props = defineProps({
    // 弹框显隐
    visible: {
        type: Boolean,
        default: false,
    },
    bodyText: {
        type: String,
    },
});

const emits = defineEmits(['exit', "continue"])
const bodyStyle = ref({ paddingBottom: '18px' })
/* Methods start */

/* Methods end */
onMounted(() => { })
</script>

<style lang="less" scoped>
.modal-header {
    color: #1D2129;
    font-size: 18px;
    font-weight: 600;
    width: 100%;
    margin-bottom: 34px;
    text-align: center;
}

.modal-content {
    text-align: center;
    margin-bottom: 34px;
}

.divide-line {
    width: 100%;
    position: relative;
    height: 1px;
    border-top: 1px solid #F2F3F5;
    margin-bottom: 18px;
}

.modal-footer {
    display: flex;
    justify-content: center;
}

.ant-modal-body {
    padding-bottom: 18px;
}
</style>
