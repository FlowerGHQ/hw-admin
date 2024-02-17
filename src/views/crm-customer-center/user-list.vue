<template>
    <div id="clue-list">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">用户列表</div>
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
import allTable from './components/user-table.vue';
const CRM_CUSTOMER_CENTER = Core.Const.CRM_CUSTOMER_CENTER;

const { proxy } = getCurrentInstance();
const router = useRouter();

const activeKey = ref(0);
const tabPhoneTotal = reactive({
    All: 0,
    unbooked: 0,
    on_Order: 0,
    traded: 0,
    delivered: 0,
}); // 标题的个数
const tabPhoneData = computed(() => {
    let result = [
        { key: 0, title: `全部(${tabPhoneTotal.All})` },
        { key: 6, title: `未下订(${tabPhoneTotal.unbooked})` },
        { key: 7, title: `已下订(${tabPhoneTotal.on_Order})` },
        { key: 8, title: `已成交(${tabPhoneTotal.traded})` },
        { key: 9, title: `已交付(${tabPhoneTotal.delivered})` },
    ];
    return result;
});

onMounted(() => {
    getClueListFetch({ search_type: CRM_CUSTOMER_CENTER.SEARCH_TYPE.All });
    getClueListFetch({ search_type: CRM_CUSTOMER_CENTER.SEARCH_TYPE.unbooked });
    getClueListFetch({ search_type: CRM_CUSTOMER_CENTER.SEARCH_TYPE.on_Order });
    getClueListFetch({ search_type: CRM_CUSTOMER_CENTER.SEARCH_TYPE.traded });
    getClueListFetch({ search_type: CRM_CUSTOMER_CENTER.SEARCH_TYPE.delivered });
});

/* Fetch start */
// 获取线索list(用来获取头部的tab切换统计数字)
const getClueListFetch = (params = {}) => {
    let obj = {
        choose_type: CRM_CUSTOMER_CENTER.CHOOSE_TYPE.USER, // 1-线索列表 2-用户列表
        ...params,
    };
    Core.Api.USER_CENTER.getClueList(obj)
        .then(res => {
            // Core.Logger.success("参数", obj, "获取线索list", res)

            switch (params.search_type) {
                case CRM_CUSTOMER_CENTER.SEARCH_TYPE.All:
                    tabPhoneTotal.All = res.count;
                    break;

                case CRM_CUSTOMER_CENTER.SEARCH_TYPE.unbooked:
                    tabPhoneTotal.unbooked = res.count;
                    break;

                case CRM_CUSTOMER_CENTER.SEARCH_TYPE.on_Order:
                    tabPhoneTotal.on_Order = res.count;
                    break;

                case CRM_CUSTOMER_CENTER.SEARCH_TYPE.traded:
                    tabPhoneTotal.traded = res.count;
                    break;

                case CRM_CUSTOMER_CENTER.SEARCH_TYPE.delivered:
                    tabPhoneTotal.delivered = res.count;
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
