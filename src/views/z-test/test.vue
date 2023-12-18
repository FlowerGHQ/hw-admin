<template>
    <div class="test">
        <div class="number">
            {{number}}
        </div>
        <a-button class="add" @click="addNumber">添加</a-button>
        <a-button class="reset" @click="resetNumber">重置</a-button>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import useNumber from '@/hooks/useNumber'
    const {number,addNumber,resetNumber} = useNumber()
</script>

<style lang="less">
    
</style>