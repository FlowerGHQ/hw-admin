<!-- <template>
	<div>
		基础信息
	</div>
</template>

<script>
	export default {
		
	}
</script>

<style lang="less" scoped>

</style> -->


<template>
    <div class="edit-container-new-edit padding-20">
        <!-- <div class="title-container">
            <div class="title-area">
                {{ $t("i.edit") }}
            </div>
        </div> -->
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

            <div class="form-block-box" v-for="($1,ind1) in msgPost" :key="ind1+'$'">
                <div class="title-form"><!-- {{ $t("supply-chain.type_supply") }} --> {{ $1.titleOne }}</div>
                <div class="list-one">
                    <div class="form-block" style="margin: 0;" v-for="($2, ind2) in $1.listOne">
                        
                        <div class="form-title">
                            <div class="title">
                                {{ $2.title }}
                            </div>
                        </div>
                        <div class="form-content" style="display: flex;flex-wrap: wrap;">
                            <div class="form-item" :class="{ 'required': $3.required ,'on-line': $3?.online ,'on-warp-line': !$3?.online}" v-for="($3, ind3) in $2.list" >
                                <div class="key" v-if="$3.key">{{ $3.key }}</div>
                                <div class="value" :class="{'on-line': $3?.online }" >
                                    <!--  name="pass" -->
                                    <a-form-item has-feedback>
                                        <template v-if="$3.type === 1">
                                            <a-input v-model:value="$3.value"  placeholder="请输入" autocomplete="off" />
                                        </template>
                                        <template v-else-if="$3.type === 2">
                                            <a-radio-group
                                                v-model:value="$3.value"
                                            >
                                                <a-radio :value="radio.value" v-for="radio in $3.radioList" :key="radio.value" >{{ radio.name }}</a-radio>
                                            </a-radio-group>
                                        </template>
                                        <template v-else-if="$3.type === 2.3">
                                            <a-checkbox v-model:checked="$3.value">{{ $3.text }}</a-checkbox>
                                        </template>
                                        <template v-else>
                                            <a-input placeholder="请输入" autocomplete="off" />
                                        </template>
                                    </a-form-item>
                                </div>
                            </div>
                        </div>
                        
                    </div>
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
	  const msgPost = reactive([
		{
          titleOne: '联系方式',
          listOne: [
            {
              title: '',
              list: [
                { key: "职位", value: undefined, valueParam: "posts", type: 2, required: true,online:true, radioList: [{ value: 1,name: '销售' },{ value: 2,name: '质量' },{ value: 3,name: '技术' },{ value: 4,name: '总经理' }] },
                { key: "姓名", value: undefined, valueParam: "name", type: 1, required: true },
                { key: "邮箱", value: undefined, valueParam: "email", type: 1, required: true },
                { key: "联系方式", value: undefined, valueParam: "contact", type: 1, required: true },
                { key: "", value: undefined, valueParam: "wechat_same", text: '微信同号', type: 2.3, required: true },
              ]
            }
          ]
        }
	  ])
		
      const msgPart = computed(()=>[
        
          /* 
                listOne
                    type 
                    三种类型 
                    1输入框input 
                    1.1 textarea
					// 1.2 数字输入

                    2 单选
                    2.1 多选
                    2.2 下拉选择
					2.3 单个checkbox选择

                    3 数字+单位-输入
					4 时间
                    5 列表-可添加 

					6 表格类型
					7 table类型(可添加行)

                */
        
        {
          titleOne: '基本信息',
          listOne: [
          {
            title: "公司概况",
            list: [
              { key: "公司名称", value: undefined, valueParam: "name_c", type: 1, required: true },
              { key: "公司网址", value: undefined, valueParam: "net_c", type: 1, required: true },
              { key: "成立日期", value: undefined, valueParam: "date_c", type: 4, required: true },
              { key: "详细地址", value: undefined, valueParam: "address", type: 1, required: false, online: true },
              { key: "公司性质", value: undefined, valueParam: "nature", type: 1, required: false },
              { key: "采购半径", value: undefined, valueParam: "posts", type: 3, unit: 'KM',  required: false },
              { key: "占地面积", value: undefined, valueParam: "posts", type: 3, unit: 'm²', required: true, },
              { key: "建筑面积", value: undefined, valueParam: "posts", type: 3, unit: 'm²', required: false, },
              { key: "母公司名称", value: undefined, valueParam: "posts", type: 1, required: true },
              { key: "母公司地址", value: undefined, valueParam: "posts", type: 1, required: true },
            ],
          },
          {
            title: "人力资源",
            list: [
              { key: "员工总数", value: undefined, valueParam: "employees_num_total", type: 3, required: false },
              { key: "管理人数", value: undefined, valueParam: "manage_num", type: 3, required: false, },
              { key: "质量人数", value: undefined, valueParam: "quality_num", type: 3, required: false, },
              { key: "技术人数", value: undefined, valueParam: "technicians_num", type: 3, required: false, },
              { key: "技术工龄", value: undefined, valueParam: "skilled_seniority", type: 3, required: false },
            ],
          },

          {
            title: "财务信息",
            list: [
              { key: "法律纠纷", value: "legal_disputes", type: 2, required: true, online: true, radioList: [{ value: 1,name: '有' },{ value: -1,name: '无' }] },
              { key: "操作工人月平均工资",  value: undefined, valueParam: "mon_avg_work_money", type: 3, required: false },
              { key: "管理职员人均年产值",  value: undefined, valueParam: "employee_avg_work_money", type: 3, required: false },
              { key: "账期要求", value: "bill_require", type: 2, required: true,online: true, radioList: [{ value: 1,name: '90天' },{ value: 2,name: '75天' },{ value: 3,name: '60天' },{ value: 4,name: '30天' },{ value: 5,name: '其他' }] },
              { key: "发票类型", value: "invoice_type", type: 2, required: true,online: true, radioList: [{ value: 1,name: '增值税发票', inputValue: undefined, isInput: true },{ value: 2,name: '普通发票' },{ value: 3,name: '其他' }] },
            ],
          },
          {
            title: "营业信息",
            list: [
              { key: "业务比重", value: "proportion_business", type: 1, required: false, online: true, },
              { key: "", value: "proportion_business", type: 6, required: false, online: true, },
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
		console.log('_rule, value------1',_rule,'ooooooo', value);
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
		msgPost,
      };
    },
  });
  </script>
  <style lang="less" scoped>
     

.edit-container-new-edit { 
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
	
	:deep(.on-line){
            width: 100%;
     }
	:deep(.on-line-value){
            width: 100%;
            max-width:100% !important;
     }
	 
	:deep(.ant-input-number) {
		width: 100%;
	}
	 :deep(.on-warp-line) {
		width: 50%;
	}
	.padding-20 {
		padding-top: 20px;
	}
		     
    :deep(.ant-checkbox) {
        display: inline-block;
        margin-left: 16px;
    } 
    
    :deep(.l-w-h-style) {
        color: #1D2129;
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
    }
    :deep(.ant-input-number-group-wrapper) {
        width: 100%;
    }
}
  </style>