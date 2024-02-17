<template>
    <div id="Staging">
        <div class="container">
            <!-- 内容区域 -->
            <div class="content">
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
const userId = ref(route.query?.id);
const { proxy } = getCurrentInstance();
onMounted(() => {
    getAllChildData();
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
//置顶
const QuickOrderRef = ref(null);
const openOrder = ref(false);
const isProvince = ref(false);
const order = () => {
    openOrder.value = true;
    nextTick(() => {
        QuickOrderRef.value.getUserDetail();
    });
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
        if (logPagination.page < logPagination.total_page && !scrollLoading.value) {
            logPagination.page++;
            getLogListFetch({ page: logPagination.page });
        }
    }
};

const getTaskList = () => {
    getAllChildData();
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
        padding-right: 36px;
        .content {
            position: relative;
            display: flex;
            height: 100%;
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
                    overflow-y: auto;
                    padding: 0 6px 20px 20px;
                    margin-right: 6px;
                    /* 自定义滚动条样式 */

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
