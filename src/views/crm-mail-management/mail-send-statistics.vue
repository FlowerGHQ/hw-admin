<template>
    <div class="mail-send-statistics">
        <a-button @click="btn">新增邮件</a-button>
    </div>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()


const router = useRouter()
const btn = () => {
    console.log("新增邮件");
    router.push('/mail-management/add-mail')
}
</script>

<style lang="less" scoped>

</style>