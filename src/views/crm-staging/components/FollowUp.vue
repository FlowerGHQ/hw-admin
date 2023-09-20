<template>
  <div class="follow-up follow-contenter">
        <a-button type="primary" @click="clickModelOk">
            <template #icon><EditOutlined /></template>
            写跟进
        </a-button>
        <a-modal 
            width="560px" height="433px"  v-model:visible="isShowFollow"
            title="写跟进"
            centered
            @ok="clickModelOk" 
        >
           <!--  <a-select
                ref="select"
                v-model:value="value1"
                style="width: 100%"
                @focus="focus"
                @change="handleChange"
            >
                <a-select-option value="jack">Jack</a-select-option>
                <a-select-option value="lucy">Lucy</a-select-option>
                <a-select-option value="disabled" disabled>Disabled</a-select-option>
                <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select> -->
            
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
  </div>
</template>

<script setup>
import { EditOutlined } from '@ant-design/icons-vue';
import { reactive, ref } from 'vue';
import Core from "@/core";
// 意向度-选项列表
const intentedList = Core.Const.INTENTION.TYPE_MAP;
// 弹窗显示变量
const isShowFollow = ref(false);
const followObj = reactive({ 
    intentValue: 10,
    communicate_type: 1, 
    followText: ''
})
// 点击写跟进按钮
const clickModelOk = () => {
    isShowFollow.value = true;
}

const handleOk = () => {
    console.log('followObj---',followObj.value);
}
 
</script>

<style lang="less" scoped>


.flex-aline {
    display: flex;
    align-items: flex-start;
}
</style>