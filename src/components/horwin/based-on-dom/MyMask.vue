<template>
    <!-- 遮罩层 介绍
        isClose 显示遮罩框(默认true 显示)
        isClickMaskClose 是否点击遮罩层不关闭 (默认false 点击会关闭)
        emit("close")  传入父组件进行关闭操作

        例子
        <MyMask 
            :isClose="isClose" 
            :isClickMaskClose="false" 
            @close="onClose"
        >
            // 下面两者只能得其一
            <div>默认slot</div>
            <template #center>
                <div>居中slot</div>
            </template>
        </MyMask>
    -->
    <view v-if="isClose" class="page-container mask" @click="onMask">
        <slot>
            <div class="mask-center">
                <slot name="center">
                    <div>测试内容</div>
                </slot>
            </div>
        </slot>
    </view>
</template>

<script>
// vue 需要 2.7.0 以上的版本
export default {
    props: {
        // 显示遮罩框
        isClose: {
            type: Boolean,
            default: true,
        },
        // 是否点击遮罩层不关闭
        isClickMaskClose: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        // 关闭这个
        const onMask = () => {
            if (props.isClickMaskClose) return;
            emit('close', false);
        };

        return {
            onMask,
        };
    },
};
</script>

<style lang="less" scoped>
.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999999;

    .mask-center {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>
