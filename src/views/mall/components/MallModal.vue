<template>
    <div>
        <MyMask :isClose="visible">
            <div class="mall-modal-bg">
                <div class="mall-modal-body" :style="{ width: `${width}px` }">
                    <div class="mall-modal-header">{{ title }}</div>
                    <div class="mall-modal-content">
                        <slot></slot>
                    </div>
                    <div class="mall-modal-footer">
                        <template v-if="showCancel">
                            <MyButton :type="btnType" padding="6px 16px" @click="close">{{ cancelText }}</MyButton>
                        </template>
                        <MyButton :type="btnType" padding="6px 16px" @click="confirm">{{ okText }}</MyButton>
                    </div>
                </div>
            </div>
        </MyMask>
    </div>
</template>

<script setup>
import MyMask from '@/components/horwin/based-on-dom/MyMask.vue';
import { ref } from 'vue';
import MyButton from '../../../components/common/MyButton.vue';

const emits = defineEmits(['handleClose', 'handleConfirm']);
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    // 弹窗宽度
    width: {
        type: [String, Number],
        default: 320,
    },
    // 按钮类型
    btnType: {
        type: String,
        default: 'primary',
    },
    // 取消按钮显隐
    showCancel: {
        type: Boolean,
        default: false,
    },
    // 确认文案
    okText: {
        type: String,
        default: 'ok',
    },
    // 取消文案
    cancelText: {
        type: String,
        default: 'cancel',
    },
    // 标题
    title: {
        type: String,
        default: 'cancel',
    },
});
// methods
const close = () => {
    emits('handleClose');
};
const confirm = () => {
    emits('handleConfirm');
};
</script>

<style lang="less" scoped>
.mall-modal-bg {
    height: 100%;
    .fcc();
    .mall-modal-body {
        width: 320px;
        border-radius: 4px;
        background: #fff;
        .mall-modal-header {
            padding-top: 24px;
            text-align: center;
            font-size: 18px;
            font-weight: 600;
            line-height: 25px;
        }
    }
    .mall-modal-content {
        padding: 24px;
        text-align: center;
        font-size: 14px;
        line-height: 20px;
    }
    .mall-modal-footer {
        padding: 18px 0;
        .fcc();
        #my-button {
            border-radius: 4px;
            &:nth-child(n + 2) {
                margin-left: 16px;
            }
        }
    }
}
</style>
