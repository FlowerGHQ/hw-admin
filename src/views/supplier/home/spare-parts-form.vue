<template>
    <div class="edit-container-new-edit">
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
            <div class="form-block-box padding-0">
                <div class="title-form-top">{{ $t("supply-chain.type_supply") }}</div>
                <div class="title-top">
                    <div class="title"></div>
                </div>
                <div class="form-content-top">
                      <a-radio-group
                          v-model:value="specific"
                          @change="handleSpecificModeChange"
                      >
                          <a-radio :value="1">{{ $t("supply-chain.part") }}</a-radio>
                          <a-radio :value="2">{{ $t("supply-chain.broker") }}</a-radio>
                          <a-radio :value="3">{{ $t("supply-chain.outsourcing") }}</a-radio>
                          <a-radio :value="4">{{ $t("supply-chain.mold") }}</a-radio>
                          <a-radio :value="5">{{ $t("supply-chain.customer_refers") }}</a-radio>
                      </a-radio-group>
                </div>
            </div>
            <div class="component-box">
                <component
                    ref="allComRef"
                    :is="componentName"
                    :msg="msgPart"
                >
                </component>
            </div>
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
      const msgPart = computed(()=>[
        
          /* 
                listOne
                    type 
                    三种类型 
                    1输入框input 
                    1.1 textarea
                    2 单选
                    2.1 多选
                    2.2 下拉选择 
                    3 数字+单位-输入
                    5 列表-可添加 
                */
        {
          titleOne: '联系方式',
          listOne: [
            {
              title: '',
              list: [
                { key: "名称", value: "name", type: 1 },
                { key: "电话", value: "phone", type: 1 },
                { key: "邮箱", value: "email", type: 1 },
              ]
            }
          ]
        },
        {
          titleOne: '基本信息',
          listOne: [
          {
            title: "公司概况",
            list: [
              { key: "名称", value: "name", type: 1, onFocus: undefined },
              { key: "电话", value: "phone", type: 0, onFocus: undefined },
              { key: "意向度", value: "intention", type: 4, onFocus: undefined },
              { key: "性别", value: "gender", type: 2.3, onFocus: false },
              { key: "行业", value: "industry", type: 3, onFocus: false },
              { key: "来源", value: "source_type", type: 0, onFocus: false },
              {
                key: "创建时间",
                value: "create_time",
                type: 0.1,
                onFocus: undefined,
              },
              {
                key: "意向车型",
                value: "pre_order_car_type",
                type: 2,
                onFocus: false,
              },
              { key: "状态", value: "tab_type", type: 0.2, onFocus: undefined },
            ],
          },
          {
            title: "用车信息",
            list: [
              { key: "用车城市", value: "group_id", type: 2.2, onFocus: false },
              {
                key: "是否有摩托车",
                value: "moto_owner",
                type: 2.1,
                onFocus: false,
              },
              {
                key: "摩托车型号",
                value: "moto_model",
                type: 1,
                onFocus: undefined,
              },
              {
                key: "是否有驾照",
                value: "driver_license",
                type: 2.1,
                onFocus: false,
              },
              { key: "骑行经验", value: "ride_exp", type: 2.4, onFocus: false },
              {
                key: "其他驾驶工具",
                value: "other_brand_model",
                value1: "",
                value2: "",
                type: 5,
                onFocus: false,
              },
            ],
          },

          {
            title: "其他信息",
            list: [
              { key: "是否是KOL", value: "flag_kol", type: 2.1, onFocus: false },
              {
                key: "是否寻求合作",
                value: "flag_seek_cooperation",
                type: 2.1,
                onFocus: false,
              },
            ],
          },
          ]
        }
    ])
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
        msgPart,
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
    /* .component-box {
      :deep(.form-block) {
        padding-top: 58px;
      }
    } */
    
    :deep(.form-block-box) {
      position: relative;
      
      /* .list-one {
        border: red solid 1px;
      }
      .two-list {
        display: flex;
        flex-direction: column;
        background-color: rebeccapurple;
      } */
      .title-form {
        position: absolute;
        left: 20px;
        top: 20px;
        color:#1D2129;
        font-size: 18px;
        font-weight: 500;
      }
    } 
    .padding-0 {
      display: flex;
      padding-top: 0px;
      align-items: center;
      .title-form-top {
        width: 18%;
        color:#1D2129;
        font-size: 18px;
        font-weight: 500;
        padding-left: 20px;
      }
      
      .form-content-top {
        min-height: 112px;
        display: flex;
        width: 78%;
        align-items: center;
        padding-left: 100px;
      }
    }
  </style>