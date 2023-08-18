<template>
  <a-button type="link" class="fill-track" @click="isShow"
    >填写快递编号</a-button
  >
  <!-- 填写快递编号 -->
  <a-modal
    v-model:visible="refundVisible"
    title="填写订单号"
    @cancel="refundHandleCancel"
    @ok="refundHandleOk"
  >
    <div class="title">收件信息</div>
    <div class="content">
      <div class="form-item" v-for="(item, index) in list" :key="index + '#'">
        <div class="key">{{ item.title }}:</div>
        <div class="value">{{item.value}}</div>
      </div>
      <div class="form-item">
        <div class="key track">快递单号:</div>
        <div class="value">
            <a-input />
        </div>
      </div>
    </div>
    <template #footer>
      <a-button @click="refundHandleCancel"> 取消 </a-button>
      <a-button
        type="primary"
        @click="refundHandleOk"
        :disabled="isFooterDisabled"
      >
        提交
      </a-button>
    </template>
  </a-modal>
</template>

<script setup>
import Core from "@/core";
import TimeSearch from "@/components/common/TimeSearch.vue";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const refundVisible = ref(false);
const list = ref([
    {title:'收件人',value:'name',key:'name'},
    {title:'省',value:'province',key:'province'},
    {title:'市',value:'city',key:'city'},
    {title:'详细地址',value:'address',key:'address'},

])
const refundHandleOk = () => {
  console.log("确定");
  refundVisible.value = false;
};
const refundHandleCancel = () => {
  refundVisible.value = false;
};

const isShow = () => {
  console.log("99999");
  refundVisible.value = true;
};

const isFooterDisabled = ref(false);
</script>

<style lang="less" scoped>
.fill-track {
  margin-left: 10px;
}
.title {
  color: var(--color-text-1, #1d2129);
  font-size: 16px;
  font-weight: 600;
  line-height: 24px; /* 150% */
}

.content {
  margin-top: 16px;
  .form-item {
    display: flex;
    align-items: center;

    .key {
      width: 70px;
      height: 20px;
      color: var(--color-text-3, #86909c);
      font-size: 14px;
      font-weight: 400;
      text-align: right;
    }
    .track {
      color: var(--color-text-1, #1d2129);
      text-align: right;
      font-weight: 400;
    }
    .value {
      color: var(--color-text-1, #1d2129);
      font-size: 14px;
      font-weight: 500;
      margin-left: 10px;
    }
  }
}
</style>