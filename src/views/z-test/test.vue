<template>
    <div class="test">
        <MyMask 
            :isClose="isClose" 
            :isClickMaskClose="false" 
            @close="onClose"
        >
            <!-- 下面两者只能得其一 -->
            <div>默认slot</div>
            <template #center>
                <div>居中slot</div>
            </template>
        </MyMask>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import MyMask from '../../components/horwin/based-on-dom/MyMask.vue';

    const isClose = ref(true)


    const onClose = (value) => {
        isClose.value = value
    }
</script>

<style lang="less" scoped>
.test{
    
}
</style>
