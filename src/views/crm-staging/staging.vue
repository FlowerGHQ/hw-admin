<template>
    <div id="Staging">
        <!-- 左边切换栏 -->
        <div class="menu-left">
            <div
                class="menu-left-item"
                :class="[menuLeftIndex === index ? 'selected' : '']"
                v-for="(item, index) in menuLeft"
                :key="index"
                @click="change(index)"
            >
                <div class="menu-left-item-name" v-html="item.name"></div>
                <div class="menu-left-item-num">{{ `${item.complete}/${item.total}` }}</div>
            </div>
        </div>
        <div class="container">
            <!-- 顶部筛选 -->
            <Search @enter="searchEnter" @clearId="clearId" ref="search" />
            <!-- 内容区域 -->
            <div class="content">
                <div class="task-list" :style="{ width: '360px' }">
                    <div class="task-list-top">
                        <div class="task-list-top-left">
                            <!-- <img src="./images/menu.png" class="image"> -->
                            <span class="title">任务列表</span>
                        </div>
                        <div class="task-list-top-right">
                            <span
                                class="task-list-top-right-item"
                                :class="staskStatusIndex === index ? 'selected' : ''"
                                v-for="(item, index) in staskStatusList"
                                :key="index"
                                @click="staskStatusChange(index)"
                                >{{ item.name }}</span
                            >
                        </div>
                    </div>
                    <div class="task-list-body" id="taskBody" @scroll="e => handleScroll(e, 'task')">
                        <div
                            v-for="(item, index) in taskList"
                            :key="item.id"
                            class="task-list-body-item"
                            :class="[taskIndex === index ? 'selected' : '', item.flag_top === 1 ? 'is-top' : '']"
                            @click="changeTask(index)"
                        >
                            <div class="avatar">
                                <img :src="item.avatar || Static.defaultAvatar" class="avatar-img" />
                                <img
                                    v-if="item.gender === 1 || item.gender === 2"
                                    :src="
                                        item.gender === 1
                                            ? getAssetURL('images/gender-male.png')
                                            : getAssetURL('images/gender-female.png')
                                    "
                                    class="avatar-gender"
                                />
                            </div>
                            <div class="message">
                                <div class="message-item">
                                    <div class="nameAndAge">
                                        <span class="name">{{ item.name }}</span>
                                        <span class="age">{{ item.age }}岁</span>
                                    </div>
                                    <IntentionStairs :status="item.intention" />
                                </div>
                                <div class="message-item">
                                    <span class="phone">{{ item.phone }}</span>
                                    <span class="time">{{ $Util.timeFilter(item.next_track_time, 2) || '-' }}</span>
                                </div>
                                <div class="labels">
                                    <my-tag class="message-label" v-if="item.pre_order_status === 1"
                                        >已支付意向金</my-tag
                                    >
                                    <my-tag class="message-label" v-if="item.pre_order_status === 1">已试驾</my-tag>
                                    <div
                                        v-for="(item_label, index) in item.label_group_list"
                                        v-if="item.label_group_list.length > 0"
                                        class="label-item"
                                    >
                                        <my-tag
                                            :color="Static.TAG_TYPE_MAP[item_label.type]?.color"
                                            :bgColor="Static.TAG_TYPE_MAP[item_label.type]?.bgColor"
                                            class="message-label"
                                            >{{ item_label.name }}</my-tag
                                        >
                                    </div>
                                    <div v-if="item.isSpill">...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-right">
                    <div class="user-card">
                        <UserDetail ref="userDetailRef" :id="userId" @updateLabel="updateTask" />
                    </div>
                    <div class="about">
                        <div class="user-about">
                            <a-tabs v-model:activeKey="activeKey">
                                <a-tab-pane key="1" tab="总览">
                                    <div class="tab-body">
                                        <GeneralView ref="tabPane1" />
                                    </div>
                                </a-tab-pane>
                                <a-tab-pane key="2" :tab="`跟进记录(${totals['2']})`" forceRender>
                                    <div class="tab-body" style="overflow: hidden">
                                        <FollowRecord ref="tabPane2" @getCount="getCount" />
                                    </div>
                                </a-tab-pane>
                                <a-tab-pane key="3" :tab="`归属记录(${totals['3']})`" forceRender>
                                    <div class="tab-body">
                                        <attributionRecord ref="tabPane3" @getCount="getCount" />
                                    </div>
                                </a-tab-pane>
                                <a-tab-pane key="4" :tab="`订单(${totals['4']})`" forceRender>
                                    <div class="tab-body">
                                        <Order ref="tabPane4" @getCount="getCount" />
                                    </div>
                                </a-tab-pane>
                                <a-tab-pane key="5" :tab="`试驾(${totals['5']})`" forceRender>
                                    <div class="tab-body">
                                        <TestDrive ref="tabPane5" @getCount="getCount" />
                                    </div>
                                </a-tab-pane>
                                <a-tab-pane key="6" :tab="`日志(${totals['6']})`" forceRender>
                                    <div class="tab-body" @scroll="e => handleScroll(e, 'log')">
                                        <LogSteps ref="tabPane6" :list="logList" />
                                    </div>
                                </a-tab-pane>
                            </a-tabs>
                        </div>
                    </div>
                </div>
                <FixedSelect
                    :isTop="isTop"
                    :current="taskCurrent"
                    :amount="taskAmount"
                    :isProvince="isProvince"
                    @next="nextTask"
                    @toTop="toTop"
                    @order="order"
                />
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
            destroyOnClose
            placement="right"
        >
            <QuickOrder ref="QuickOrderRef" />
        </a-drawer>
    </div>
</template>

<script setup>
import Core from '@/core';
import Static from './static';
import Order from './components/order.vue';
import TestDrive from './components/test-drive.vue';
import GeneralView from './components/general-view.vue';
import attributionRecord from './components/attribution-record.vue';
import FollowRecord from './components/FollowRecord.vue';
import LogSteps from './components/log-step.vue';
import IntentionStairs from './components/intention-stairs.vue';
import UserDetail from './components/UserDetail.vue';
import Search from './components/search.vue';
// import UserAbout from "./components/user-about.vue";
import FixedSelect from './components/fixed-select.vue';
import QuickOrder from './components/quick-order.vue';
import myTag from './components/my-tag.vue';
import { computed, nextTick, onMounted, reactive, ref, provide, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';

const router = useRouter();
const route = useRoute();
const id = ref(route.query?.id);
const { proxy } = getCurrentInstance();
onMounted(() => {
    getAmountList();
    getAllChildData();
    if (id.value) {
        search.value.openClear();
        Core.Api.CustomService.detail({ id: id.value })
            .then(res => {
                // id筛选用户状态回显
                if (res.province || res.city) {
                    staskStatusChange(1);
                } else {
                    staskStatusChange(0);
                }
            })
            .catch(err => {
                Core.Logger.error('参数', '数据', err);
            });
    } else {
        getTaskNum();
    }
});

// a-drawer bodyStyle样式
const bodyStyle = ref({ padding: 0 });

// 左边切换栏
const menuLeftIndex = ref(0);
const menuLeft = [
    { name: '信息<br>缺失', complete: 1, total: 2, status_mapping: 1 },
    { name: '跟进', complete: 1, total: 2, status_mapping: 3 },
];
const menuLeftRender = computed(() => {
    return menuLeft.map(item => {
        let obj_num = numList.find(num_item => {
            return num_item.status_mapping == item;
        });
        let obj = {
            id: item,
            title: Core.Const.TASK_TYPE[item].title,
            value: obj_num?.deal_amount,
            all_value: obj_num?.total,
        };
        return obj;
    });
});
const change = index => {
    menuLeftIndex.value = index;
    // 同步切换状态
    updateStatus(staskStatusIndex.value);
    getTaskNum({ page: 1 }, true);
};

// 搜索栏
const searchMes = reactive({});
const search = ref(null);
const searchEnter = value => {
    Object.assign(searchMes, value);
    if (searchMes.time && searchMes.time.length > 0) {
        searchMes.begin_time = parseInt(dayjs(searchMes.time[0]).valueOf() / 1000);
        searchMes.end_time = parseInt(dayjs(searchMes.time[1]).valueOf() / 1000);
    } else {
        searchMes.begin_time = undefined;
        searchMes.end_time = undefined;
    }
    getTaskNum({ page: 1 }, true);
};

//任务列表
const userId = ref(null);
const isTop = ref(false);
const taskIndex = ref(0);
const taskCurrent = ref(1);
const taskAmount = ref(1);
const staskStatus = ref(0);
const staskStatusIndex = ref(0);
const staskStatusList = [{ name: '待办' }, { name: '已办' }];
const taskList = ref([]);
const userPagination = reactive({
    page_size: 20,
    page: 1,
    total: 0,
    total_page: 0,
});

taskAmount.value = taskList.value.length;
const staskStatusChange = index => {
    staskStatusIndex.value = index;
    updateStatus(index);
    getTaskNum({ page: 1 }, true);
};
const updateStatus = index => {
    switch (index) {
        case 0:
            if (menuLeft[menuLeftIndex.value].status_mapping === 1) {
                staskStatus.value = 0;
            } else {
                staskStatus.value = 25;
            }
            break;
        case 1:
            if (menuLeft[menuLeftIndex.value].status_mapping === 1) {
                staskStatus.value = 10;
            } else {
                staskStatus.value = 30;
            }
            break;

        default:
            break;
    }
};
const changeTask = index => {
    taskIndex.value = index;
    taskCurrent.value = index + 1;
    userId.value = taskList.value[index].id;
    isTop.value = taskList.value[index].flag_top === 1 ? true : false;
    getAllChildData();
};
const getAmountList = () => {
    Core.Api.CustomService.amountList()
        .then(res => {
            Core.Logger.success('getAmountList', res);
            res.forEach(item => {
                menuLeft.forEach(menuItem => {
                    if (menuItem.status_mapping === item.status_mapping) {
                        menuItem.complete = item.deal_amount;
                        menuItem.total = item.total;
                    }
                });
            });
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};
const getTaskNum = (params = {}, isSearch = false) => {
    scrollLoading.value = true;
    let obj = {
        status_mapping: menuLeft[menuLeftIndex.value].status_mapping,
        status: staskStatus.value,
        page_size: userPagination.page_size,
        page: userPagination.page,
        ...searchMes,
        ...params,
    };
    Core.Logger.success('params', obj);
    Core.Api.CustomService.list(obj)
        .then(res => {
            userPagination.total = res.count;
            userPagination.total_page = Math.ceil(userPagination.total / userPagination.page_size);

            Core.Logger.success('getTaskNum', res);
            // 是否是搜索的
            if (isSearch) {
                taskList.value = [];
                userPagination.page = 1;
            }
            taskList.value = taskList.value.concat(res.list);
            filterData(taskList.value);

            taskAmount.value = taskList.value.length;
            userId.value = taskList.value[taskIndex.value]?.id;
            isTop.value = taskList.value[taskIndex.value]?.flag_top === 1 ? true : false;
            getAllChildData();
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        })
        .finally(() => {
            scrollLoading.value = false;
        });
};
const filterData = data => {
    data.forEach(item => {
        // 目的是取前三个
        let count = 3;
        if (item.pre_order_status === 1) {
            // 支付意向金
            count--;
        }
        if (item.test_drive_status === 1) {
            // 已试驾状态
            count--;
        }
        let list = [];
        // 这里这么写的原因是页面只是展示三个标签(但前面的两个判断是本来就有的标签)
        for (let label of item.label_group_list) {
            if (!label.label_list) return;
            for (let labelItem of label.label_list) {
                if (count !== 0) {
                    count--;
                    list.push(labelItem);
                }
            }
        }
        item.label_group_list = list;
        // Core.Logger.log("每一项的次数", count)
        // 是否显示后面的 ... 三个点
        item.isSpill = count === 0;
    });
};
const updateTask = () => {
    getTaskNum({ page: 1 }, true);
};
//置顶
const QuickOrderRef = ref(null);
const openOrder = ref(false);
const isProvince = ref(false);
const toTop = index => {
    const params = {
        id: taskList.value[index].id,
    };
    Core.Api.CustomService.editIsTop({ ...params })
        .then(res => {
            getTaskNum({ page: 1 }, true);
            proxy.$message.success(isTop.value ? '已取消置顶' : '已成功置顶');
        })
        .catch(err => {
            proxy.$message.error(isTop.value ? '取消置顶失败' : '置顶失败');
        });
};
const order = () => {
    openOrder.value = true;
    nextTick(() => {
        QuickOrderRef.value.getUserDetail();
    });
};
const nextTask = current => {
    taskCurrent.value = current;
    taskIndex.value = current - 1;
    userId.value = taskList.value[taskIndex.value].id;
    isTop.value = taskList.value[taskIndex.value]?.flag_top === 1 ? true : false;
    getAllChildData();
    // 下一步 同步滚动条
    const taskEl = document.querySelector('#taskBody');
    taskEl.children[taskIndex.value].scrollIntoView({ behavior: 'smooth' });
};

// 日志
const logPagination = reactive({
    page_size: 20,
    page: 1,
    total: 0,
    total_page: 0,
});
const logList = ref([]);
/* Fetch start*/
// 获取日志list
const getLogListFetch = (params = {}, isSearch = false) => {
    if (!userId.value) return;
    scrollLoading.value = true;
    const obj = {
        page: logPagination.page,
        page_size: logPagination.page_size,
        target_id: userId.value, // 用户id
        target_type: Core.Const.LABEl.CATEGORY.CLIENT, // 目标类型 (1客户、2商机、3合同订单、4回款单)
        ...params,
    };
    Core.Logger.success('参数', obj);
    Core.Api.CustomService.logList(obj)
        .then(res => {
            logPagination.total = res.count;
            logPagination.total_page = Math.ceil(logPagination.total / logPagination.page_size);

            Core.Logger.success('参数', obj, '获取日志list', res);
            // 是否是搜索的
            if (isSearch) {
                logList.value = [];
                logPagination.page = 1;
            }

            logList.value = logList.value.concat(res.list);
            getCount('6', res.count);
        })
        .catch(err => {
            Core.Logger.error('参数', obj, '获取日志list', err);
        })
        .finally(() => {
            scrollLoading.value = false;
        });
};

//tab栏
const tabPane1 = ref(null);
const tabPane2 = ref(null);
const tabPane3 = ref(null);
const tabPane4 = ref(null);
const tabPane5 = ref(null);
const tabPane6 = ref(null);
const userDetailRef = ref(null);
const activeKey = ref('1');
const totals = reactive({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
});

const getCount = (key, count) => {
    totals[key] = count;
};
const getAllChildData = () => {
    if (!userId.value) return;
    const arr = ['1', '2', '3', '4', '5', '6', 'userDetailRef'];
    arr.forEach(item => getChildData(item));

    // 获取当前人员省市情况
    Core.Api.CustomService.detail({ id: userId.value })
        .then(res => {
            if (res.province || res.city) {
                isProvince.value = true;
            } else {
                isProvince.value = false;
            }
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};
const getChildData = key => {
    nextTick(() => {
        switch (key) {
            case '1':
                tabPane1.value.getData();
                break;
            case '2':
                tabPane2.value.getData();
                break;
            case '3':
                tabPane3.value.getData();
                break;
            case '4':
                tabPane4.value.getData();
                break;
            case '5':
                tabPane5.value.getData();
                break;
            case '6':
                getLogListFetch({ page: 1 }, true);
                break;
            case 'userDetailRef':
                userDetailRef.value.getData();
                break;

            default:
                break;
        }
    });
};

// 公共方法
//动态获取本地图片
const getAssetURL = image => {
    // 参数一: 相对路径
    return new URL(`../crm-staging/${image}`, import.meta.url).href;
};

// 监听滚轮事件
const scrollLoading = ref(false);
const handleScroll = (e, type) => {
    const element = e.target;
    if (Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight - Static.hitBottomHeight) {
        Core.Logger.log('滑到底部');
        switch (type) {
            case 'task':
                if (userPagination.page < userPagination.total_page && !scrollLoading.value) {
                    userPagination.page++;
                    getTaskNum({ page: userPagination.page });
                }
                break;
            case 'log':
                if (logPagination.page < logPagination.total_page && !scrollLoading.value) {
                    logPagination.page++;
                    getLogListFetch({ page: logPagination.page });
                }
                break;

            default:
                break;
        }
    }
};
const clearId = () => {
    router.replace({ query: {} });
    id.value = undefined;
};

const getTaskList = () => {
    getAmountList();
    getTaskNum({ page: 1 }, true);
};

provide('userId', userId); // 提供id
provide('getTaskList', getTaskList); // 提供更新任务数据方法
provide('getChildData', getChildData); // 提供获取子组件数据方法
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
        background: #fff;
        &-item {
            text-align: center;
            width: 100%;
            border-radius: 5px;
            background: #f2f3f5;
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
                color: #4e5969;
            }
            &-num {
                color: #86909c;
            }
            &:hover {
                background: #f2f8ff;
            }
            &.selected {
                .menu-left-item-name,
                .menu-left-item-num {
                    color: #fff;
                }
                font-weight: 600;
                background: #0061ff;
            }
        }
    }
    .container {
        flex: 1;
        height: 100%;
        padding: 0 36px 0 16px;
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
                margin-right: 16px;
                overflow: hidden;
                &-top {
                    padding: 20px 20px 15px 20px;
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
                            color: #1d2129;
                            font-size: 16px;
                            font-weight: 600;
                        }
                    }
                    &-right {
                        display: inline-flex;
                        padding: 2px;
                        align-items: flex-start;
                        border-radius: 5px;
                        background: #f2f3f5;
                        padding: 2px;
                        &-item {
                            height: 24px;
                            padding: 0px 18px;
                            border-radius: 4px;
                            color: #1d2129;
                            font-size: 14px;
                            font-weight: 400;
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
                            background: #0061ff;
                            color: #fff;
                            font-weight: 600;
                        }
                    }
                }
                &-body {
                    overflow: hidden;
                    padding: 0 14px 20px 20px;
                    margin-right: 6px;
                    &:hover {
                        padding: 0 6px 20px 20px;
                        overflow-y: scroll;
                    }
                    &-item {
                        display: flex;
                        border-radius: 6px;
                        padding: 12px;
                        overflow: hidden;
                        margin-bottom: 4px;
                        cursor: pointer;
                        &:hover {
                            background-color: #f7f8fa;
                        }
                        &.is-top {
                            background: rgba(230, 239, 255, 0.5);
                        }
                        &.selected {
                            background: #f7f8fa;
                        }
                        &:last-child {
                            margin-bottom: 0;
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
                                        color: #1d2129;
                                        font-size: 16px;
                                        font-weight: 600;
                                        margin-right: 8px;
                                    }
                                    .age {
                                        color: #4e5969;
                                        font-size: 14px;
                                    }
                                }
                                .phone {
                                    color: var(--Color-text-1, #1d2129);
                                    font-size: 14px;
                                }
                                .time {
                                    color: #86909c;
                                    font-size: 12px;
                                }
                            }
                            &-label {
                                margin-right: 6px;
                            }
                            .labels {
                                display: flex;
                                align-items: center;
                                .label-item {
                                    display: flex;
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
                    background: #fff;
                    overflow: hidden;
                    margin-bottom: 16px;
                }
                .about {
                    flex: 1;
                    padding: 8px 20px 20px 20px;
                    border-radius: 6px;
                    background: #fff;
                    overflow: hidden;
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
        background-color: #fff;
    }

    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        background-color: #e5e6eb;
        border-radius: 20px; /* 滑块圆角 */
    }
}
</style>
