<template>
    <div id="clue-list">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">线索</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('add')"><i class="icon i_add" />创建用户</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane v-for="(item, index) in tabPhoneData" :key="item.key" :tab="item.title"> </a-tab-pane>
                </a-tabs>
                <allTable :activeKey="activeKey" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import allTable from './components/clue-table.vue';
const CRM_CUSTOMER_CENTER = Core.Const.CRM_CUSTOMER_CENTER;

const { proxy } = getCurrentInstance();
const router = useRouter();

const activeKey = ref(0);
const tabPhoneTotal = reactive({
    All: 0,
    Information_loss: 0,
    Not_Yet_Bound: 0,
    Do_Not_Follow_Up: 0,
    Have_Followed: 0,
    dormancy: 0,
}); // 标题的个数
const tabPhoneData = computed(() => {
    let result = [
        { key: 0, title: `全部(${tabPhoneTotal.All})` },
        { key: 1, title: `信息缺失(${tabPhoneTotal.Information_loss})` },
        { key: 2, title: `未分配(${tabPhoneTotal.Not_Yet_Bound})` },
        { key: 3, title: `未跟进(${tabPhoneTotal.Do_Not_Follow_Up})` },
        { key: 4, title: `已跟进(${tabPhoneTotal.Have_Followed})` },
        { key: 5, title: `休眠(${tabPhoneTotal.dormancy})` },
    ];
    return result;
});

onMounted(() => {
    getClueListFetch({ search_type: CRM_CUSTOMER_CENTER.SEARCH_TYPE.All });
    getClueListFetch({ search_type: CRM_CUSTOMER_CENTER.SEARCH_TYPE.Information_loss });
    getClueListFetch({ search_type: CRM_CUSTOMER_CENTER.SEARCH_TYPE.Not_Yet_Bound });
    getClueListFetch({ search_type: CRM_CUSTOMER_CENTER.SEARCH_TYPE.Do_Not_Follow_Up });
    getClueListFetch({ search_type: CRM_CUSTOMER_CENTER.SEARCH_TYPE.Have_Followed });
    getClueListFetch({ search_type: CRM_CUSTOMER_CENTER.SEARCH_TYPE.dormancy });
});

/* Fetch start */
// 获取线索list(用来获取头部的tab切换统计数字)
const getClueListFetch = (params = {}) => {
    let obj = {
        choose_type: CRM_CUSTOMER_CENTER.CHOOSE_TYPE.CLUE, // 1-线索列表 2-用户列表
        ...params,
    };
    Core.Api.USER_CENTER.getClueList(obj)
        .then(res => {
            // Core.Logger.success("参数", obj, "获取线索list", res)

            switch (params.search_type) {
                case CRM_CUSTOMER_CENTER.SEARCH_TYPE.All:
                    tabPhoneTotal.All = res.count;
                    break;

                case CRM_CUSTOMER_CENTER.SEARCH_TYPE.Information_loss:
                    tabPhoneTotal.Information_loss = res.count;
                    break;

                case CRM_CUSTOMER_CENTER.SEARCH_TYPE.Not_Yet_Bound:
                    tabPhoneTotal.Not_Yet_Bound = res.count;
                    break;

                case CRM_CUSTOMER_CENTER.SEARCH_TYPE.Do_Not_Follow_Up:
                    tabPhoneTotal.Do_Not_Follow_Up = res.count;
                    break;

                case CRM_CUSTOMER_CENTER.SEARCH_TYPE.Have_Followed:
                    tabPhoneTotal.Have_Followed = res.count;
                    break;

                case CRM_CUSTOMER_CENTER.SEARCH_TYPE.dormancy:
                    tabPhoneTotal.dormancy = res.count;
                    break;
            }
        })
        .catch(err => {
            Core.Logger.error('参数', obj, '获取线索list', err);
        });
};
/* Fetch end */

/* methods start */
const routerChange = type => {
    switch (type) {
        // 创建用户
        case 'add':
            router.push({
                path: '/user-center/user-edit',
            });
            break;
    }
};
/* methods end */
</script>

<style lang="less" scoped></style>
