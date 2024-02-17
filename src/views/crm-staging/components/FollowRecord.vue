<template>
    <div class="follow-record" @scroll="handleScroll">
        <div class="follow-top">
            <FollowUp @getRecordList="getRecordList" />
            <div class="follow-but">
                <span>未打通，稍后联系</span>
                <a-button type="link" @click="clickCreate({ type: 30, content: '未打通，稍后联系', method: 30 })"
                    >创建跟进</a-button
                >
            </div>
            <!-- 
      <div class="follow-but">
        <span>已补充好省市</span>
        <a-button type="link" @click="clickCreate({type:30,content:'已补充好省市',method:20})">创建跟进</a-button>
      </div> -->
            <a-select
                class="follow-type"
                width="120px"
                v-model:value="followObj.type"
                placeholder="选择跟进类型"
                @change="typeChangeClick"
                allowClear
            >
                <a-select-option v-for="item of typeList" :key="item.key" :value="item.value">{{
                    item.zh
                }}</a-select-option>
            </a-select>
        </div>
        <Steps :list="list" />
        <createTaskPop :isShowCreate="isShowCreate" @finalyCreate="finalyC"></createTaskPop>
    </div>
</template>

<script setup>
import FollowUp from './FollowUp.vue';
import Steps from './steps.vue';
import { reactive, ref, getCurrentInstance, inject, watch } from 'vue';
import Core from '@/core';
import Static from '../static';
import createTaskPop from './createTaskPop.vue';
const { proxy } = getCurrentInstance();
const userId = inject('userId');
const $emit = defineEmits(['getCount', 'updateFollowTime']);
// const getChildData = inject('getChildData'); // 更新子组件数据方法 传对应 key （更多子组件可用更新）
const props = defineProps({
    isShowButton: {
        type: Boolean,
        default: true,
    },
});
// 第二个创建弹窗
const isShowCreate = ref(false);
const list = ref([]);
// 跟进类型列表
const typeList = Core.Const.WORK_OPERATION.FOLLOW_TYPE;
const followObj = reactive({
    type: undefined,
});
const finalyC = () => {
    isShowCreate.value = false;
};
const pagination = reactive({
    pageSize: 10,
    current: 1,
    total: 0,
    total_page: 0,
});
// 父组件控制更新（可用）
const getData = () => {
    getRecordList();
};
// 获取跟进记录列表
const getRecordList = (params = {}) => {
    if (!userId.value) return;
    scrollLoading.value = true;
    if (JSON.stringify(params) == '{}') {
        Object.assign(pagination, {
            pageSize: 10,
            current: 1,
            total: 0,
            total_page: 0,
        });
        list.value = [];
    }
    const obj = {
        target_id: userId.value,
        target_type: 1,
        type: followObj.type === undefined ? 0 : followObj.type,
        page: params.current,
        page_size: pagination.pageSize,
        ...params,
    };
    Core.Api.CustomService.trackRecordList(obj)
        .then(res => {
            Core.Logger.success('getRecordList参数', obj, '数据', res);
            list.value = [...list.value, ...res.list];
            pagination.total = res.count;
            pagination.total_page = Math.ceil(pagination.total / pagination.pageSize);
            $emit('getCount', '2', res.count);
        })
        .catch(err => {
            Core.Logger.error('参数getRecordList参数', obj, '数据', err);
        })
        .finally(() => {
            scrollLoading.value = false;
        });
};
defineExpose({ getData });
const clickCreate = (params = {}) => {
    proxy.$confirm({
        title: `确定要创建跟进记录：${params?.content}`,
        okText: proxy.$t('def.sure'),
        cancelText: proxy.$t('def.cancel'),
        onOk() {
            createFollow(params);
        },
    });
};
// 跟进创建操作
const createFollow = (params = {}) => {
    if (!userId.value) return;
    const obj = {
        contact_customer_id: userId.value,
        target_id: userId.value,
        target_type: 1,
        ...params,
    };
    Core.Api.CustomService.createRecord(obj)
        .then(res => {
            Core.Logger.success('createFollow', obj, '数据', res);
            getRecordList();
            isShowCreate.value = true;
        })
        .catch(err => {
            Core.Logger.error('参数', obj, '数据', err);
        });
};
// 切换typeChangeClick
const typeChangeClick = value => {
    followObj.type = value;
    getRecordList();
    Core.Logger.success('typeChangeClick', value);
};
// 监听滚轮事件
const scrollLoading = ref(false);
const handleScroll = e => {
    const element = e.target;
    if (Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight - Static.hitBottomHeight) {
        Core.Logger.log('滚动触底');
        if (pagination.current < pagination.total_page && !scrollLoading.value) {
            pagination.current++;
            getRecordList({ current: pagination.current });
        }
    }
};
</script>

<style lang="less" scoped>
.follow-record {
    height: 100%;
    overflow-y: auto;
    position: relative;
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
        justify-content: space-between;
        border-radius: 4px;
        align-items: center;
        padding: 0px 12px;
        border: 1px solid #f2f3f5;
        margin-right: 12px;
    }
    .follow-type {
        position: absolute;
        right: 0;
    }
}
</style>
