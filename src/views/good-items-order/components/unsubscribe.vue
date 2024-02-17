<template>
    <a-button type="link" class="fill-track" @click="isShow">填写快递编号</a-button>
    <!-- 填写快递编号 -->
    <a-modal v-model:visible="refundVisible" title="退订审核" @cancel="refundHandleCancel" @ok="refundHandleOk">
        <template #footer>
            <a-button @click="refundHandleCancel"> 取消 </a-button>
            <a-button type="primary" @click="refundHandleOk" :disabled="isFooterDisabled"> 同意退订 </a-button>
        </template>
        <a-textarea v-model:value="value2" placeholder="填写原因" :rows="4" allow-clear />
    </a-modal>
</template>

<script setup>
import Core from '@/core';
import TimeSearch from '@/components/common/TimeSearch.vue';
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const refundVisible = ref(false);
const refundHandleOk = () => {
    console.log('确定');
    refundVisible.value = false;
};
const refundHandleCancel = () => {
    refundVisible.value = false;
};

const isShow = () => {
    console.log('99999');
    refundVisible.value = true;
};

const isFooterDisabled = ref(false);
</script>

<style lang="less" scoped>
.fill-track {
    margin-left: 10px;
}
</style>
