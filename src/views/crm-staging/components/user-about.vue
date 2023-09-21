<template>
    <div class="user-about">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" :tab="`总览(${totals['1']})`">
                <GeneralView/>
            </a-tab-pane>
            <a-tab-pane key="2" :tab="`跟进记录(${totals['2']})`">
                <FollowRecord />
            </a-tab-pane>
            <a-tab-pane key="3" :tab="`归属记录(${totals['3']})`" force-render>
                <attributionRecord @getCount='getCount' ref="attributionRecordRef"/>
            </a-tab-pane>
            <a-tab-pane key="4" :tab="`订单(${totals['4']})`">
                <Order/>
            </a-tab-pane>
            <a-tab-pane key="5" :tab="`试驾(${totals['5']})`">
                <TestDrive :userId="userId"/>
            </a-tab-pane>
            <a-tab-pane key="6" :tab="`日志(${totals['6']})`">
                <Steps :list="list" :type="2"/>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import Order from './order.vue';
import TestDrive from './test-drive.vue';
import GeneralView from './general-view.vue';
import attributionRecord from "../components/attribution-record.vue";
import Steps from "./steps.vue";
import Core from '@/core';
import { reactive, ref, toRefs, onMounted, nextTick } from 'vue';
import FollowRecord from "./FollowRecord.vue";

const props = defineProps({
	userId: {
		type: [String, Number],
		default: ""
	}
})

const activeKey = ref('1')
const totals = reactive({
    '1': 20,
    '2': 20,
    '3': 20,
    '4': 20,
    '5': 20,
    '6': 20,
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
		status: '123'
	},
	{
	  	value: '2',
	  	store_user_name: '姬发',
	  	title: '修改用户信息',
	  	img:'https://tse4-mm.cn.bing.net/th/id/OIP-C.Cdq25dINGG8gky7W0x8XaQHaE7?pid=ImgDet&rs=1',
	  	content:'上海大区-上海 上海浦东新区大美都广场体验中心',
	  	work:'用户体验官',
	  	time: '2023-07-12 12:13:14',
		status: '123'
	},
	{
	  	value: '3',
	  	store_user_name: '李大钊',
	  	title: '修改用户信息',
	  	img:'https://tse4-mm.cn.bing.net/th/id/OIP-C.Cdq25dINGG8gky7W0x8XaQHaE7?pid=ImgDet&rs=1',
	  	content:'上海大区-上海 上海浦东新区大美都广场体验中心',
	  	work:'用户体验官',
		time: '2023-07-12 12:13:14',
		status: '123'
	},
	{
	  	value: '4',
	  	store_user_name: '王倩',
	  	title: '修改用户信息',
	  	img:'https://tse4-mm.cn.bing.net/th/id/OIP-C.Cdq25dINGG8gky7W0x8XaQHaE7?pid=ImgDet&rs=1',
	  	content:'上海大区-上海 上海浦东新区大美都广场体验中心',
	  	work:'用户体验官',
		time: '2023-07-12 12:13:14',
		status: '123'
	},
])
const getCount = (key, count) => {
    totals[key] = count
}
</script>

<style lang="less" scoped>
.user-about {
    height: 100%;
    .ant-tabs {
        height: 100%;
        :deep(.ant-tabs-content-holder) {
            overflow-y: auto;
        }
    }
}
</style>
