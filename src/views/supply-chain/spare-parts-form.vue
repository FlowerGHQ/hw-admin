<template>
    <div class="edit-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t("i.edit") }}
            </div>
        </div>
        <a-form
            ref="formRef"
            name="custom-validation"
            :model="formState"
            :rules="rules"
            v-bind="layout"
            @finish="handleFinish"
            @validate="handleValidate"
            @finishFailed="handleFinishFailed"
        >
            <div class="form-block">
                <div class="form-title">
                    <div class="title">{{ $t("supply-chain.contact") }}</div>
                </div>
                <div class="form-content">
                    <div class="form-item">
                        <div class="key">{{ $t("supply-chain.type_supply") }}</div>
                        <div class="value">
                            <a-radio-group
                                v-model:value="specific"
                                @change="handleSpecificModeChange"
                            >
                                <a-radio :value="1">{{ $t("i.single") }}</a-radio>
                                <a-radio :value="2">{{ $t("i.multiple") }}</a-radio>
                                <a-radio :value="3">{{ $t("i.multiple") }}</a-radio>
                                <a-radio :value="4">{{ $t("i.multiple") }}</a-radio>
                                <a-radio :value="5">{{ $t("i.multiple") }}</a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </div>
            </div>

            <component
                ref="allComRef"
                :is="componentName"
            >
            </component>
            <!-- <Part/> -->
            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" html-type="submit">Submit</a-button>
                <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
            </a-form-item>
        </a-form>

    </div>
  </template>
  <script>
  import { defineComponent, reactive, ref, computed } from 'vue';
  import Part from "./components/Part.vue";
  import Broker from "./components/Broker.vue";
  import Outsourcing from "./components/Outsourcing.vue";
  import Mold from "./components/Mold.vue";
  import CustomerRefers from "./components/CustomerRefers.vue";
  export default defineComponent({
    components: {  
      Part, // 零件 在 components 对象中注册 MyComponent 组件  
      Broker, // 代理
      Outsourcing, // 外协
      Mold,  // 模具
      CustomerRefers, // 客指
    },
    setup() {
      const formRef = ref();
      const formState = reactive({
        pass: '',
        checkPass: '',
        age: undefined,
      });
      const specific = ref(1)
      let checkAge = async (_rule, value) => {
        if (!value) {
          return Promise.reject('Please input the age');
        }
        if (!Number.isInteger(value)) {
          return Promise.reject('Please input digits');
        } else {
          if (value < 18) {
            return Promise.reject('Age must be greater than 18');
          } else {
            return Promise.resolve();
          }
        }
      };

      const componentName = computed(()=>{
        
        if(specific.value === 1) {
          return Part;
        } else if(specific.value === 2) {
          return Broker;
        } else if(specific.value === 3) {
          return Outsourcing;
        } else if(specific.value === 4) {
          return Mold;
        } else if(specific.value === 5) {
          return CustomerRefers;
        }
        return null;
      })
      let validatePass = async (_rule, value) => {
        if (value === '') {
          return Promise.reject('Please input the password');
        } else {
          if (formState.checkPass !== '') {
            formRef.value.validateFields('checkPass');
          }
          return Promise.resolve();
        }
      };
      let validatePass2 = async (_rule, value) => {
        if (value === '') {
          return Promise.reject('Please input the password again');
        } else if (value !== formState.pass) {
          return Promise.reject("Two inputs don't match!");
        } else {
          return Promise.resolve();
        }
      };
      const rules = {
        pass: [{
          required: true,
          validator: validatePass,
          trigger: 'change',
        }],
        checkPass: [{
          validator: validatePass2,
          trigger: 'change',
        }],
        age: [{
          validator: checkAge,
          trigger: 'change',
        }],
      };
      const layout = {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 14,
        },
      };
  
      const handleFinish = values => {
        console.log(values, formState);
      };
      const handleFinishFailed = errors => {
        console.log(errors);
      };
      const resetForm = () => {
        formRef.value.resetFields();
      };
      const handleValidate = (...args) => {
        console.log(args);
      };
      const handleSpecificModeChange = (data) => {
        console.log('data',data);
      }
      return {
        formState,
        formRef,
        rules,
        layout,
        handleFinishFailed,
        handleFinish,
        resetForm,
        handleValidate,
        specific,
        componentName,
        handleSpecificModeChange,
      };
    },
  });
  </script>
  <style lang="less" scoped>
      
    // 样式-关于校验表单标签
    :deep(.ant-form-item) {
        margin-bottom: 0px;
    }
    :deep(.ant-form-item-control) {
        max-width: 100% !important;
    }

  </style>