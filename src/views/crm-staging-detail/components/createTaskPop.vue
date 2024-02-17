<template>
    <a-modal
        v-model:visible="isShowCreate"
        title="写跟进是否继续创建跟进任务?"
        centered
        :maskClosable="false"
        :closable="false"
        cancelText="不创建"
        okText="创建"
        @ok="createNext"
        @cancel="cancleNext"
    >
        <div class="top-title">系统将根据省市自动选择跟进人</div>
        <div class="form-item required">
            <div class="key">下次跟进时间:</div>
            <div class="value">
                <a-date-picker show-time :disabled-date="disabledDate" v-model:value="taskTimeValue">
                    <template #suffixIcon>
                        <ClockCircleOutlined />
                    </template>
                </a-date-picker>
            </div>
        </div>
    </a-modal>
</template>

<script setup>
import { ref, getCurrentInstance, inject } from 'vue';
import { ClockCircleOutlined } from '@ant-design/icons-vue';
import Core from '@/core';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance();
const $emit = defineEmits(['finalyCreate']);
const userId = inject('userId');
const getTaskList = inject('getTaskList');
const props = defineProps({
    isShowCreate: {
        type: Boolean,
        default: false,
    },
});
// 下次跟进任务时间
const taskTimeValue = ref('');
// 禁用过去时间
const disabledDate = current => {
    return current && current < dayjs().endOf('time');
};

// 重置
const resetFollow = () => {
    taskTimeValue.value = '';
};
// 点击创建任务
const createNext = () => {
    const time = dayjs(taskTimeValue.value).valueOf() / 1000;
    if (!taskTimeValue.value) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    }
    createTask(time);
};

// 取消创建
const cancleNext = () => {
    Core.Api.CustomService.cancelTrack({
        customer_id: userId.value,
    })
        .then(res => {
            proxy.$message.success('取消成功');
            $emit('finalyCreate');
            getTaskList();
        })
        .catch(err => {})
        .finally(() => {
            resetFollow();
        });
};

// 创建请求
const createTask = time => {
    Core.Api.CustomService.createTrack({
        customer_id: userId.value,
        next_track_time: time,
    })
        .then(res => {
            Core.Logger.success(
                'createTrack',
                {
                    customer_id: userId.value,
                    next_track_time: time,
                },
                '数据',
                res,
            );
            proxy.$message.success('创建成功');
            $emit('finalyCreate');
            getTaskList();
        })
        .catch(err => {
            Core.Logger.error(
                '参数',
                {
                    customer_id: userId.value,
                    next_track_time: time,
                },
                '数据',
                err,
            );
        })
        .finally(() => {
            resetFollow();
        });
};
</script>

<style lang="less" scoped>
.flex-aline {
    display: flex;
    align-items: flex-start;
}

.top-title {
    color: #f77234;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 16px;
}
</style>
