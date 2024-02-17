<template>
    <div class="follow-up follow-contenter">
        <a-button type="primary" @click="clickModelOk" v-if="isShowButton">
            <template #icon><EditOutlined /></template>
            写跟进
        </a-button>
        <a-modal width="560px" height="433px" v-model:visible="isShowFollow" title="写跟进" centered>
            <!-- 沟通方式 -->
            <div class="form-item required">
                <div class="key">沟通方式：</div>
                <div class="value">
                    <a-select v-model:value="followObj.method" placeholder="请选择沟通方式">
                        <a-select-option v-for="item of methodList" :key="item.key" :value="item.value">
                            {{ item.zh }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <!-- 意向度 -->
            <div class="form-item required">
                <div class="key">意向度：</div>
                <div class="value">
                    <a-select v-model:value="followObj.intention" placeholder="请选择意向度">
                        <a-select-option v-for="item of intentedList" :key="item.key" :value="item.value">
                            {{ item.key }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <!-- 跟进类型 -->
            <div class="form-item required">
                <div class="key">跟进类型：</div>
                <div class="value">
                    <a-select v-model:value="followObj.type" placeholder="选择跟进类型">
                        <a-select-option v-for="item of typeList" :key="item.key" :value="item.value">{{
                            item.zh
                        }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <!-- 跟进内容 -->
            <div class="form-item flex-aline required">
                <div class="key">跟进内容：</div>
                <div class="value">
                    <a-textarea v-model:value="followObj.content" placeholder="请输入跟进内容" :rows="4" />
                </div>
            </div>
            <template #footer>
                <a-button key="submit" type="primary" @click="createFollow">提交</a-button>
            </template>
        </a-modal>
        <createTaskPop :isShowCreate="isShowCreate" @finalyCreate="finalyC"></createTaskPop>
    </div>
</template>

<script setup>
import { EditOutlined } from '@ant-design/icons-vue';
import { reactive, ref, getCurrentInstance, inject } from 'vue';
import createTaskPop from './createTaskPop.vue';
import Core from '@/core';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance();
const userId = inject('userId');
const getChildData = inject('getChildData'); // 更新子组件数据方法 传对应 key
const props = defineProps({
    isShowButton: {
        type: Boolean,
        default: true,
    },
});
const $emit = defineEmits(['getRecordList']);
// 意向度-选项列表
const intentedList = Core.Const.INTENTION.TYPE_MAP;
// 沟通方式-选项列表
const methodList = Core.Const.WORK_OPERATION.COMMUNICATE_TYPE;
// 跟进类型-选项列表
const typeList = Core.Const.WORK_OPERATION.FOLLOW_TYPE;
// 弹窗显示变量
const isShowFollow = ref(false);
// 第二个创建弹窗
const isShowCreate = ref(false);

const initialObject = {
    // 沟通方式
    method: undefined,
    // 意向度
    intention: undefined,
    // 跟进类型
    type: undefined,
    // 跟进内容
    content: '',
};
// 跟进
const followObj = reactive(Object.assign({}, initialObject));
// 点击写跟进按钮
const clickModelOk = () => {
    isShowFollow.value = true;
    resetFollow();
};
// 禁用过去时间
const disabledDate = current => {
    return current && current < dayjs().endOf('time');
};
defineExpose({ clickModelOk });

// 跟进创建操作
const createFollow = () => {
    if (!followObj.method || followObj.method === undefined) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    } else if (!followObj.intention || followObj.intention === undefined) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    } else if (!followObj.type || followObj.type === undefined) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    } else if (!followObj.content || followObj.content === undefined) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    }

    Core.Logger.success('createFollow参数', followObj, '数据');
    // 创建更进
    const obj = {
        contact_customer_id: userId.value,
        target_id: userId.value,
        target_type: 1,
        ...followObj,
    };
    Core.Api.CustomService.createRecord(obj)
        .then(res => {
            Core.Logger.success('createFollow', obj, '数据', res);
            $emit('getRecordList');
            isShowFollow.value = false;
            isShowCreate.value = true;
            proxy.$message.success('提交成功');
            getChildData('userDetailRef');
            getChildData('6');
        })
        .catch(err => {
            Core.Logger.error('参数', obj, '数据', err);
        });
};
// 重置
const resetFollow = () => {
    Object.assign(followObj, initialObject);
    // taskTimeValue.value= '';
};
const finalyC = () => {
    isShowCreate.value = false;
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
