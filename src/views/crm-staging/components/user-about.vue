<template>
    <div class="user-about">
        <a-tabs v-model:activeKey="activeKey" @change="changeActivety">
            <a-tab-pane key="1" tab="总览">
                <div class="tab-body">
                    <GeneralView/>
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" :tab="`跟进记录(${totals['2']})`" forceRender>
                <div class="tab-body" @scroll="handleScroll">
                    <FollowRecord ref="followRe"/>
                </div>
            </a-tab-pane>
            <a-tab-pane key="3" :tab="`归属记录(${totals['3']})`" forceRender>
                <div class="tab-body">
                    <attributionRecord ref="attributionRecordRef" @getCount='getCount'/>
                </div>
            </a-tab-pane>
            <a-tab-pane key="4" :tab="`订单(${totals['4']})`" forceRender>
                <div class="tab-body">
                    <Order ref="OrderRef" @getCount='getCount'/>
                </div>
            </a-tab-pane>
            <a-tab-pane key="5" :tab="`试驾(${totals['5']})`" forceRender>
                <div class="tab-body">
                    <TestDrive/>
                </div>
            </a-tab-pane>
            <a-tab-pane key="6" :tab="`日志(${totals['6']})`" forceRender>
                <div class="tab-body" @scroll="handleScroll">
                    <LogSteps :list="logList"/>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import Order from './order.vue';
import TestDrive from './test-drive.vue';
import GeneralView from './general-view.vue';
import attributionRecord from "../components/attribution-record.vue";
import LogSteps from "./log-step.vue";
import Core from '@/core';
import { reactive, ref, toRefs, onMounted, nextTick, inject, watch } from 'vue';
import FollowRecord from "./FollowRecord.vue";
const userId = inject('userId');  // 从staging 从这个来的

const OrderRef = ref(null)
const followRe = ref(null);
const activeKey = ref('1')
const totals = reactive({
    '1': 20,
    '2': 20,
    '3': 20,
    '4': 20,
    '5': 20,
    '6': 20,
})

const getCount = (key, count) => {
    totals[key] = count
}


onMounted(() => {		
})

// 监听
watch(userId, (newValue, oldValue) => {
	Core.Logger.log("监听userId值", newValue, oldValue);
	getLogListFetch()
})

// 日志
const logPagination = reactive({
  	page_size: 20,
  	page: 1,
  	total: 0,
  	total_page: 0
})
const logList = ref([	
	// {
    //     id: 2691,
    //     operator_id: 150,  // 操作人id
    //     operator_type: 0, // 操作人类型
    //     operator_name: "小郑啊", // 操作人名称
    //     operator_avatar: "", // 操作人头像
    //     create_time: 1694572938, // 时间
	// 	// JSON格式
    //     content: {
    //         content: [
    //             {
    //                 key: "name",
    //                 old_value: "zhangyue001",
    //                 new_value: "yzy测试改动"
    //             },                
    //             {
    //                 key: "phone",
    //                 old_value: "zhangyue001",
    //                 new_value: "yzy测试改动"
    //             },                
    //         ]
    //     }
    // },	
])
/* Fetch start*/
// 获取日志list
const getLogListFetch = (params = {} , isSearch = false) => {
  const obj = {
		page: logPagination.page,
		page_size: logPagination.page_size,
		target_id: userId.value, // 用户id
	    target_type: Core.Const.LABEl.CATEGORY.CLIENT,  // 目标类型 (1客户、2商机、3合同订单、4回款单)
        ...params
	}
	Core.Logger.error("参数", obj)
    Core.Api.CustomService.logList(obj).then(res=>{
		logPagination.total = res.count
        logPagination.total_page = Math.ceil(logPagination.total / logPagination.page_size)

        Core.Logger.success("参数", obj, "获取日志list", res)
		// 是否是搜索的
		if (isSearch) {
            logList.value = []
        }

        logList.value = logList.value.concat(res.list)
	}).catch(err=>{
        Core.Logger.error("参数", obj, "获取日志list", err)
	})
}
/* Fetch end*/

/* methods start*/
// 监听滚轮事件
const handleScroll = (e) => {
	const element = e.target;
    if (Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight) {        
		Core.Logger.log('滚动触底')
        if (logPagination.page <= logPagination.total_page) {
			logPagination.page ++
            getLogListFetch({ page: logPagination.page })
        }
    }
}

const changeActivety = (value) => {
    console.log('changeActivety',value);
    if(value==2){
        followRe.value.getRecordList();
    }
}   


/* methods end*/

</script>

<style lang="less" scoped>
.user-about {
    height: 100%;
    .tab-body {
        height: 100%;
        overflow-y: auto;
    }
    .ant-tabs {
        height: 100%;
        :deep(.ant-tabs-content-holder) {
            display: flex;
        }
    }
}
</style>
