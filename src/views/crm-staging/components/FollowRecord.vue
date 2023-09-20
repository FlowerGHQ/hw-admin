<template>
  <div class="follow-record">
    <div class="follow-top">
        <FollowUp />
         <div class="follow-but"></div>
         <div class="follow-but"></div>
         <a-select
                width="120px"
                v-model:value="followObj.follow_type"
                placeholder="请选择沟通方式"
              >
                <a-select-option
                  v-for="item of intentedList"
                  :key="item.key"
                  :value="item.value"   
                  >{{ item.key }}</a-select-option
                >
        </a-select>
    </div>
    <RecordItem />
  </div>
</template>

<script setup>
import FollowUp from "./FollowUp.vue";
import RecordItem from "./RecordItem.vue";
import { reactive, ref ,onBeforeUnmount  } from 'vue';
import Core from "@/core";    
const props = defineProps({
        isShowButton: {
            type: Boolean,
            default: true,
        },
})
// 意向度-选项列表
const intentedList = Core.Const.INTENTION.TYPE_MAP;
const followObj = reactive({ 
    intentValue: 10,
    communicate_type: 1, 
    followText: ''
})

</script>

<style lang="less" scoped>
.follow-record {

    .follow-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .follow-but {
        display: flex;
        height: 32px;
        width: 272px;
        padding: 12px;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        border-radius: 4px;
        border: 1px solid var(--Color-border-1, #F2F3F5);
    }
}
</style>