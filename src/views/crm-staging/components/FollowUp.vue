<template>
  <div class="follow-up follow-contenter">
        <a-button type="primary" @click="clickModelOk">
            <template #icon><EditOutlined /></template>
            写跟进
        </a-button>
        <a-modal 
            width="560px" height="433px"  v-model:visible="modal2Visible"
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
                v-model:value="value1"
                :placeholder="$t('def.select')"
                allowClear
              >
                <!-- <a-select-option :value="0">
                                    {{ lang === "zh" ? "全部" : "all" }}
                                </a-select-option> -->
               <!--  <a-select-option
                  v-for="item of regionsList"
                  :key="item.id"
                  :value="item.value"
                  >{{ item.name }}</a-select-option
                > -->
                
                <a-select-option value="jack">Jack</a-select-option>
                <a-select-option value="lucy">Lucy</a-select-option>
                <a-select-option value="disabled" disabled>Disabled</a-select-option>
                <a-select-option value="Yiminghe">yiminghe</a-select-option>
              </a-select>
            </div>
          </div>
        </a-modal>
  </div>
</template>

<script setup>
import { EditOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
const modal2Visible = ref(false);
const value1 = ref('哈哈水水');
const clickModelOk = () => {
    console.log('hfi地方军阀肌肤恢复恢复');
    modal2Visible.value = true;
}
</script>

<style scoped>


</style>