<template>
    <!-- 遮罩层 -->
    <view v-if="isClose" class="page-container mask" @click="onMask">        
        <slot name="centers"></slot>
    </view>
</template>

<script>
    // vue 需要 2.7.0 以上的版本
    export default {
        props: {
            isClose: {
                type: Boolean,
                default: true
            }
        },
        setup(props, { emit }){
            // 关闭这个
            const onMask = () => {    
                emit("close", false)
            }

            return {
                onMask
            }
        }
    }
</script>

<style lang="scss" scoped>
.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 999999;
}
</style>