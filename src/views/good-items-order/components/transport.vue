<template>
  <a-button type="link" class="fill-track" @click="isShow">查看详情</a-button>
  <!-- 填写快递编号 -->
  <a-modal v-model:visible="refundVisible" title="运输中详情"  @cancel="refundHandleCancel" @ok="refundHandleOk" :width="600" >
    <div class="title">顺丰快递：JDV001093900768</div>
    <div class="content">
      <div class="record-box" v-for="(item, index) in 5" :key="index + '#'">
        <div class="head-record">
          <span class="time">12:13:14 2023.12.12</span>
          <span class="icon-record" :class="{ 'color-click': index === 3, 'color-top': index === 0 ||index===1 }" >
            {{ index==0?'收':'' }}
            <img v-if="index===1" class="color-img" :src="getTestActiveSrc('car')"/>
          </span>
          <span class="line" :class="{ 'del-top': index === 4, 'del-bot': index === 0 }" ></span>
          <span class="peo-record">编辑人：李开智</span>
        </div>
        <div class="body-record" :class="{ 'border-left': index + 1 < 5 }" ></div>
      </div>
    </div>
    <template #footer>
      <a-button @click="refundHandleCancel"> 取消 </a-button>
      <a-button type="primary" @click="refundHandleOk" :disabled="isFooterDisabled" > 提交 </a-button>
    </template>
  </a-modal>
</template>
  
  <script setup>
import Core from "@/core";
import TimeSearch from "@/components/common/TimeSearch.vue";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const testActiveModules = import.meta.globEager(
  "../../../assets/images/good-items/*.png"
);
// const womanImg =  import.meta.globEager("../../assets/images/test-drive/*.png");

/* 使用图片的方法 */
const getTestActiveSrc = (name) => {
  const path = `../../../assets/images/good-items/${name}.png`;
  return testActiveModules[path].default;
};
const refundVisible = ref(false);
const list = ref([
  { title: "收件人", value: "name", key: "name" },
  { title: "省", value: "province", key: "province" },
  { title: "市", value: "city", key: "city" },
  { title: "详细地址", value: "address", key: "address" },
]);
const refundHandleOk = () => {

  refundVisible.value = false;
};
const refundHandleCancel = () => {
  refundVisible.value = false;
};

const isShow = () => {
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
  .record-box {
    width: 100%;
    .head-record {
      position: relative;
      display: flex;
      align-items: center;
      color: #86909c;
      .line {
        position: absolute;
        height: 100%;
        top: 0;
        left: 108px;
        z-index: 10;
        border-left: #e5e6eb solid 1px;
      }
      .del-top {
        height: 50%;
      }
      .del-bot {
        top: 50%;
        height: 50%;
      }
      .icon-record {
        position: relative;
        display: inline-block;
        width: 8px;
        height: 8px;
        flex-shrink: 0;
        border-radius: 50%;
        margin: 6px 0px 6px 8px;
        background: #c9cdd4;
        z-index: 30;
      }
      .color-top {
        position: relative;
        display: inline-block;
        width: 28px;
        height: 28px;
        flex-shrink: 0;
        border-radius: 50%;
        margin: 6px 0px 6px 8px;
        background: #c9cdd4;
        z-index: 30;
        margin-left: 0px;
        text-align: center;
        line-height: 28px;
        color: #FFF;
      }
      .color-img {
        width: 28px;
        height: 28px;
        vertical-align: top;
      }
      .color-click {
        background: blue;
      }
      .time {
        width: 80px;
        white-space: wrap;
        margin-left: 16px;
      }
      .peo-record {
        margin-left: 16px;
      }
    }

    .body-record {
      min-height: 48px;
      margin-left: 108px;
      .con-record {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        min-height: 76px;
        background: #f7f8fa;
        box-sizing: border-box;
        font-size: 14px;
        padding: 14px 12px 12px;
      }
    }
    .border-left {
      border-left: #e5e6eb solid 1px;
    }
  }
}
</style>