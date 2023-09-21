<template>
  <div class="follow-up follow-contenter">
        <a-button type="primary" @click="clickModelOk" v-if="isShowButton">
            <template #icon><EditOutlined /></template>
            写跟进
        </a-button>
        <a-modal 
            width="560px" height="433px"  v-model:visible="isShowFollow"
            title="写跟进"
            centered
        >
          <!-- 沟通方式 -->
          <div class="form-item">
            <div class="key">沟通方式：</div>
            <div class="value">
              <a-select
                v-model:value="followObj.follow_type"
                placeholder="请选择沟通方式"
              >
                <a-select-option
                  v-for="item of intentedList"
                  :key="item.key"
                  :value="item.value"   
                  >{{ item.key }}</a-select-option
                >
              </a-select>
            </div>
          </div>
          <!-- 意向度 -->
          <div class="form-item">
            <div class="key">意向度：</div>
            <div class="value">
              <a-select
                v-model:value="value1"

                placeholder="请选择意向度"
              >
                <a-select-option
                  v-for="item of intentedList"
                  :key="item.key"
                  :value="item.value"   
                  >{{ item.key }}</a-select-option
                >
              </a-select>
            </div>
          </div>
          <!-- 跟进类型 -->
          <div class="form-item">
            <div class="key">跟进类型：</div>
            <div class="value">
              <a-select
                v-model:value="followObj.follow_type"
                placeholder="选择跟进类型"
              >
                <a-select-option
                  v-for="item of intentedList"
                  :key="item.key"
                  :value="item.value"   
                  >{{ item.key }}</a-select-option
                >
              </a-select>
            </div>
          </div>
          <!-- 跟进内容 -->
          <div class="form-item flex-aline">
            <div class="key">跟进内容：</div>
            <div class="value">
                <a-textarea v-model:value="followObj.followText" placeholder="请输入跟进内容" :rows="4" />
            </div>
          </div>
        <template #footer>
            <a-button key="submit" type="primary" @click="handleOk">提交</a-button>
        </template>
        </a-modal>
        <a-modal v-model:visible="isShowCreate"
            title="写跟进是否继续创建跟进任务?"
            centered
            :maskClosable = "false"
            :closable = "false"
            cancelText = "不创建"
            okText = "创建"
            @ok="createNext"
            @cancel = "cancleNext"
            >
            <div class="top-title">系统将根据省市自动选择跟进人</div>
            <div class="form-item">
              <div class="key">下次跟进时间:</div>
              <div class="value">
                <a-date-picker show-time>
                  <template #suffixIcon>
                    <ClockCircleOutlined />
                  </template>
                </a-date-picker>
              </div>
          </div>
            
        </a-modal>
  </div>
</template>

<script setup>
import { EditOutlined } from '@ant-design/icons-vue';
import { reactive, ref ,onBeforeUnmount  } from 'vue';
import { ClockCircleOutlined } from '@ant-design/icons-vue';
import Core from "@/core";    
const props = defineProps({
        isShowButton: {
            type: Boolean,
            default: true,
        },
    })
// 意向度-选项列表
const intentedList = Core.Const.INTENTION.TYPE_MAP;
// 弹窗显示变量
const isShowFollow = ref(false);
// 第二个创建弹窗
const isShowCreate = ref(false);
// 跟进
const followObj = reactive({ 
    intentValue: 10,
    communicate_type: 1, 
    followText: ''
})
// 点击写跟进按钮
const clickModelOk = () => {
    isShowFollow.value = true;
}

defineExpose({clickModelOk});
const handleOk = () => {
    console.log('followObj---',followObj);
    isShowFollow.value = false;
    isShowCreate.value = true;
}
const createNext = () => {
  console.log('创建更进新的');
}
const cancleNext  = () => {
  console.log('不创建更进新的');
}
</script>

<style lang="less" scoped>

.flex-aline {
    display: flex;
    align-items: flex-start; 
}

.top-title {
  color: #F77234;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 16px;
}
</style>