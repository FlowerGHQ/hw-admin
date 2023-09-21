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
    <Steps :list="list"/>
  </div>
</template>

<script setup>
import FollowUp from "./FollowUp.vue";
import Steps from "./steps.vue";
import { reactive, ref ,onBeforeUnmount  } from 'vue';
import Core from "@/core";    
const props = defineProps({
  isShowButton: {
    type: Boolean,
    default: true,
  },
})
const list = ref([
	{
		value: '1',
		store_user_name: '李鹏',
		title: '修改用户信息',
		img:'https://tse4-mm.cn.bing.net/th/id/OIP-C.Cdq25dINGG8gky7W0x8XaQHaE7?pid=ImgDet&rs=1',
		content:'上海大区-上海 上海浦东新区大美都广场体验中心',
		work:'用户体验官',
		time: '2023-07-12 12:13:14',
		status: 10
	},
	{
	  	value: '2',
	  	store_user_name: '姬发',
	  	title: '修改用户信息',
	  	img:'https://tse4-mm.cn.bing.net/th/id/OIP-C.Cdq25dINGG8gky7W0x8XaQHaE7?pid=ImgDet&rs=1',
	  	content:'上海大区-上海 上海浦东新区大美都广场体验中心',
	  	work:'用户体验官',
	  	time: '2023-07-12 12:13:14',
		  status: 20
	},
	{
	  	value: '3',
	  	store_user_name: '李大钊',
	  	title: '修改用户信息',
	  	img:'https://tse4-mm.cn.bing.net/th/id/OIP-C.Cdq25dINGG8gky7W0x8XaQHaE7?pid=ImgDet&rs=1',
	  	content:'上海大区-上海 上海浦东新区大美都广场体验中心',
	  	work:'用户体验官',
      time: '2023-07-12 12:13:14',
      status: 20
	},
	{
	  	value: '4',
	  	store_user_name: '王倩',
	  	title: '修改用户信息',
	  	img:'https://tse4-mm.cn.bing.net/th/id/OIP-C.Cdq25dINGG8gky7W0x8XaQHaE7?pid=ImgDet&rs=1',
	  	content:'上海大区-上海 上海浦东新区大美都广场体验中心',
	  	work:'用户体验官',
      time: '2023-07-12 12:13:14',
      status: 30
	},
])
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
  }
  .follow-up {
    margin-right: 12px;
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
    margin-right: 12px;
  }
}
</style>