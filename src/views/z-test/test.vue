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
    import useNumber from '@/hooks/useNumber'
    const props = defineProps({
        // ...
        type: {
            type: String,
            default: 'item'
        },
    })
    const {number,addNumber,resetNumber,type} = useNumber(props) //vue2中的minxins
    console.log(type)
</script>

<style lang="less">

</style>