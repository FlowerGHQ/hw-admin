<template>
    <!-- 遮罩层 -->
    <div v-if="isClose" class="page-content mask" @click.self="onMask">        
        <slot></slot>
    </div>
</template>

<script>
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

<style lang="less" scoped>
.mask{
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 999999;
    width: 100%;
    height: 100%;
}
</style>