<template>
    <a-modal
        centered
        :closable="false"
        v-model:visible="visible"
        class="continue-modal"
        :width="320"
        :footer="null"
        :bodyStyle="bodyStyle"
    >
        <div class="modal-header">            
            <slot name="title">
                {{ $t(title) }}
            </slot>
        </div>
        <div class="modal-content">
            <slot name="content">
                {{ bodyText }}
            </slot>
        </div>
        <div class="divide-line"></div>
        <div class="modal-footer">
            <slot></slot>
            <slot name="footer"></slot>
        </div>
    </a-modal>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
const props = defineProps({
    // 弹框显隐
    visible: {
        type: Boolean,
        default: false,
    },
    bodyText: {
        type: String,
    },
    title: {
        type: String,
        default: 'operation.sure_tip' 
    }
});

const emits = defineEmits(['exit', 'continue']);
const bodyStyle = ref({ paddingBottom: '18px' });
/* Methods start */

/* Methods end */
onMounted(() => {});
</script>

<style lang="less" scoped>
.modal-header {
    color: #1d2129;
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
    border-top: 1px solid #f2f3f5;
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
