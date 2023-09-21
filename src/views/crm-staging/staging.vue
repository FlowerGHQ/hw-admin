<template>
    <div id="Staging">
        <!-- 左边切换栏 -->
        <div class="menu-left">
            <div class="menu-left-item" :class="[menuLeftIndex === index ? 'selected' : '']" v-for="(item, index) in menuLeft" :key="index" @click="change(index)">
                <div class="menu-left-item-name">{{ item.name }}</div>
                <div class="menu-left-item-num">{{ `${item.complete}/${item.total}` }}</div>
            </div>
        </div>
        <div class="container">
            <!-- 顶部筛选 -->
            <Search @enter="searchEnter"/>
            <!-- 内容区域 -->
            <div class="content">
                <div class="task-list" :style="{ width: '360px'}">
                    <div class="task-list-top">
                        <div class="task-list-top-left">
                            <img src="./images/menu.png" class="image">
                            <span class="title">任务列表</span>
                        </div>
                        <div class="task-list-top-right">
                            <span class="task-list-top-right-item" :class="staskStatusIndex === index ? 'selected' : ''" v-for="(item, index) in staskStatusList" :key="index" @click="staskStatusChange(index)">{{ item.name }}</span>
                        </div>
                    </div>
                    <div class="task-list-body" @scroll="handleScroll">
                        <div 
                            v-for="(item, index) in taskList" 
                            :key="item.id"
                            class="task-list-body-item" 
                            :class="taskIndex === index ? 'selected' : ''" 
                            @click="changeTask(index)"
                        >
                            <div class="avatar">
                                <img :src="item.avatar" class="avatar-img">
                                <img :src="item.gender === 1 ? getAssetURL('./images/gender-male.png') : getAssetURL('./images/gender-female.png')" class="avatar-gender">
                            </div>
                            <div class="message">
                                <div class="message-item">
                                    <div class="nameAndAge">
                                        <span class="name">{{ item.name }}</span>
                                        <span class="age">{{ item.age }}岁</span>
                                    </div>
                                    <IntentionStairs :status="item.intention"/>
                                </div>
                                <div class="message-item">
                                    <span class="phone">{{ item.phone }}</span>
                                    <span class="time">{{ dayjs.unix(item.last_track_time).format('MM-DD HH:mm') }}</span>
                                </div>
                                <div>
                                    <my-tag color="#00B42A" bgColor="#E8FFEA" class="message-label" v-for="labelItem in item.label">{{ labelItem }}</my-tag>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-right">
                    <div class="user-card">
                        <UserDetail :id="userId"/>
                    </div>
                    <div class="about">
                        <UserAbout/>
                    </div>
                </div>
                <FixedSelect :isTop="isTop" :current="taskCurrent" :amount="taskAmount" @next="nextTask" @toTop="toTop" @order="order"/>
            </div>
        </div>
        <a-drawer
          v-model:visible="openOrder"
          class="custom-class"
          title="快捷下单"
          width="440px"
          :body-style="bodyStyle"
          :footer="false"
          :closable="false"
          placement="right"
        >
            <QuickOrder/>
        </a-drawer>
    </div>
</template>

<script setup>
import Core from '@/core';
import IntentionStairs from "./components/intention-stairs.vue";
import UserDetail from "./components/UserDetail.vue";
import Search from "./components/search.vue";
import UserAbout from "./components/user-about.vue";
import FixedSelect from "./components/fixed-select.vue";
import QuickOrder from "./components/quick-order.vue";
import myTag from "./components/my-tag.vue";
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";

const route = useRoute()
onMounted(() => {    
    getTaskNum()
})

// a-drawer bodyStyle样式
const bodyStyle = ref({ padding: 0 })

// 左边切换栏
const menuLeftIndex = ref(0);
const menuLeft = [
    { name: '信息缺失', complete: 1, total: 2, status_mapping: 1 },
    { name: '跟进', complete: 1, total: 2, status_mapping: 3 },
];
const menuLeftRender = computed(() => {
    return menuLeft.map(item => {
        let obj_num = numList.find(num_item=>{
			return num_item.status_mapping == item;
		})
		let obj = {
			id: item,
			title: Core.Const.TASK_TYPE[item].title,
			value: obj_num?.deal_amount,
			all_value: obj_num?.total
		}
		return obj
    })
})
const change = (index) => {
    menuLeftIndex.value = index
    // 同步切换状态
    updateStatus(staskStatusIndex.value)
    getTaskNum({ page: 1 }, true)
}

// 搜索栏
const searchMes = reactive({})
const searchEnter = (value) => {
    Object.assign(searchMes, value)
    if (searchMes.time && searchMes.time.length > 0) {
        searchMes.begin_time = dayjs(searchMes.time[0]).valueOf()
        searchMes.end_time = dayjs(searchMes.time[1]).valueOf()
    }
    getTaskNum({ page: 1 }, true)
}

//任务列表
const userId = ref(null)
const isTop = ref(false)
const taskIndex = ref(0)
const taskCurrent = ref(1)
const taskAmount = ref(1)
const staskStatus = ref(0)
const staskStatusIndex = ref(0)
const staskStatusList = [{ name: '待办' }, { name: '已办' }]
const taskList = ref([])
const userPagination = reactive({
    page_size: 20,
    page: 1,
    total: 0,
    total_page: 0
})

taskAmount.value = taskList.value.length
const staskStatusChange = (index) => {
    staskStatusIndex.value = index
    updateStatus(index)
    getTaskNum({ page: 1 }, true)
}
const updateStatus = (index) => {
    switch (index) {
        case 0:
            if (menuLeft[menuLeftIndex.value].status_mapping === 1) {
                staskStatus.value = 0
            } else {
                staskStatus.value = 25
            }
            break;
        case 1:
            if (menuLeft[menuLeftIndex.value].status_mapping === 1) {
                staskStatus.value = 1
            } else {
                staskStatus.value = 30
            }
            break;
    
        default:
            break;
    }
}
const changeTask = (index) => {
    taskIndex.value = index
    taskCurrent.value = index + 1
    userId.value = taskList.value[index].id
}
const getTaskNum = (params = {}, isSearch = false) => {
    const obj = {
        status_mapping: menuLeft[menuLeftIndex.value].status_mapping,
        status: staskStatus.value,
        page_size: userPagination.page_size,
        page: userPagination.page,
        ...searchMes,
        ...params
	}
    Core.Logger.success('params', obj)
    Core.Api.CustomService.list(obj).then(res=>{        
        userPagination.total = res.count
        userPagination.total_page = Math.ceil(userPagination.total / userPagination.page_size)

		Core.Logger.success('getTaskNum',res);
        // 是否是搜索的
        if (isSearch) {
            taskList.value = []
        }
        taskList.value = taskList.value.concat(res.list)		

        userId.value = taskList.value[0].id
	}).catch(err=>{
        Core.Logger.error("参数", "数据", err)
	})
}
//置顶
const openOrder = ref(false)
const toTop = (index) => {
    console.log(taskList.value[index].id)
}
const order = () => {
    openOrder.value = true
}
const nextTask = (current) => {
    taskCurrent.value = current
    taskIndex.value = current - 1
}


// 公共方法
//动态获取本地图片
const getAssetURL = (image) => {
  // 参数一: 相对路径
  return new URL(`../crm-staging/${image}`, import.meta.url).href
}

// 监听滚轮事件
const handleScroll = (e) => {    
    const element = e.target;    
    if (Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight) {
        Core.Logger.log("滑到底部")  
        if (userPagination.page <= userPagination.total_page) {
            userPagination.page++
            getTaskNum({ page: userPagination.page })
        }      
    }
}

</script>

<style lang="less" scoped>
#Staging {
    height: 100%;
    display: flex;
    .menu-left {
        height: 100%;
        display: inline-flex;
        padding: 16px 12px;
        flex-direction: column;
        align-items: center;
        border-radius: 6px;
        background: #FFF;
        &-item {
            text-align: center;
            width: 56px;
            border-radius: 5px;
            background: #F2F3F5;
            padding: 11px 8px;
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            &:last-child {
                margin-bottom: 0;
            }
            &-name {
                color: #4E5969;
            }
            &-num {
                color: #86909C;
            }
            &:hover {
                background: #F2F8FF;
            }
            &.selected {
                .menu-left-item-name, .menu-left-item-num {
                    color: #fff;
                }
                background: #0061FF;
            }
        }
    }
    .container {
        flex: 1;
        height: 100%;
        padding: 0 56px 0 16px;
        .content {
            position: relative;
            display: flex;
            height: calc(100% - 48px);
            .task-list {
                display: flex;
                flex-direction: column;
                position: relative;
                background-color: #fff;
                border-radius: 6px;
                padding: 20px;
                margin-right: 16px;
                overflow: hidden;
                &-top {
                    margin-bottom: 15px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    &-left {
                        display: flex;
                        align-items: center;
                        .image {
                            width: 18px;
                            height: 18px;
                            margin-right: 6px;
                            margin-top: 2px;
                            cursor: pointer;
                        }
                        .title {
                            color: #1D2129;
                            font-size: 16px;
                            font-weight: 600;
                        }
                    }
                    &-right {
                        display: inline-flex;
                        padding: 2px;
                        align-items: flex-start;
                        border-radius: 5px;
                        background: #F2F3F5;
                        padding: 2px;
                        &-item {
                            height: 24px;
                            padding: 0px 18px;
                            border-radius: 4px;
                            color: #1D2129;
                            font-size: 14px;
                            font-weight: 600;
                            background-color: #fff;
                            margin-right: 4px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            user-select: none;
                            cursor: pointer;
                            &:last-child {
                                margin-right: 0;
                            }
                        }
                        .selected {
                            background: #0061FF;
                            color: #fff;
                        }
                    }
                }
                &-body {
                    overflow-y: auto;
                    padding-right: 6px;
                    /* 自定义滚动条样式 */
                    
                    &-item {
                        display: flex;
                        border-radius: 6px;
                        padding: 12px;
                        overflow: hidden;
                        cursor: pointer;
                        &:hover {
                            background-color: #F7F8FA;
                        }
                        &.selected {
                            background: #F7F8FA;
                        }
                        .avatar {
                            margin-right: 12px;
                            position: relative;
                            &-img {
                                width: 48px;
                                height: 48px;
                                border-radius: 50%;
                            }
                            &-gender {
                                position: absolute;
                                top: 48px;
                                right: 0;
                                transform: translateY(-100%);
                                width: 16px;
                                height: 16px;
                            }
                        }
                        .message {
                            flex: 1;
                            &-item {
                                display: flex;
                                justify-content: space-between;
                                align-items: flex-end;
                                margin-bottom: 6px;
                                .nameAndAge {
                                    display: flex;
                                    align-items: center;
                                    .name {
                                        color: #1D2129;
                                        font-size: 16px;
                                        font-weight: 600;
                                        margin-right: 8px;
                                    }
                                    .age {
                                        color: #4E5969;
                                        font-size: 14px;
                                    }
                                }
                                .phone {
                                    color: var(--Color-text-1, #1D2129);
                                    font-size: 14px;
                                }
                                .time {
                                    color: #86909C;
                                    font-size: 12px;
                                }
                            }
                            &-label {
                                margin-right: 6px;
                                &:last-child {
                                    margin-right: 0;
                                }
                            }
                        }
                    }
                }
            }
            .content-right {
                flex: 1;
                display: flex;
                flex-direction: column;
                .user-card {
                    border-radius: 6px 0px 6px 6px;
                    background: #FFF;
                    overflow: hidden;
                    margin-bottom: 16px;
                }
                .about {
                    flex: 1;
                    padding: 20px;
                    border-radius: 6px;
                    background: #FFF;
                    overflow: hidden;
                }
            }
        }
    }
    .custom-class .footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    ::-webkit-scrollbar {
      width: 8px; /* 滚动条宽度 */
    }
    
    /* 滚动条背景 */
    ::-webkit-scrollbar-track {
      background-color: #FFF;
    }
    
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
      background-color: #E5E6EB;
      border-radius: 20px; /* 滑块圆角 */
    }
}
</style>
