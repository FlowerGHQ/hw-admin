
<template>
  <div class="edit-container-new-edit padding-20">
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
                        v-model:value="type"
                    >
                         <a-radio :value="item.value" v-for="item in Core.Const.SUPPLAY.SUPPLAY_TYPE_LIST">{{ $t(item.t) }}</a-radio>
                    </a-radio-group>
              </div>
          </div>

          <div class="form-block-box" v-for="($1, ind1) in msgPost" :key="ind1+'$'">
              <div class="title-form">{{ $1.titleOne }}</div>
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
                                              @change="handleTypeModeChange"
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
                  ref="allComRefTable"
                  :is="componentName"
                  :msg="msgPart"
              >
              </component>
          </div>
          <!-- <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button type="primary" html-type="submit">Submit</a-button>
              <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
          </a-form-item> 
          -->
      </a-form>

  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, computed, getCurrentInstance, watch } from 'vue';
import Core from "@/core";
import Part from "./components/Part.vue";
import Broker from "./components/Broker.vue";
import Outsourcing from "./components/Outsourcing.vue";
import Mold from "./components/Mold.vue";
import CustomerRefers from "./components/CustomerRefers.vue";

export default defineComponent({
  props: {
      detail: {  
          type: Object,  
          required: false, 
          default: ()=>{

          } 
      },  
      /* isSaveDraft: {  
          type: Number,  
          default: 0,  
      },   */
  },  
  components: {  
    Part, // 零件 在 components 对象中注册 MyComponent 组件  
    Broker, // 代理
    Outsourcing, // 外协
    Mold,  // 模具
    CustomerRefers, // 客指
  },
  setup(props) {
    
    const { proxy } = getCurrentInstance()
    const detailObj = ref();
    const detailDraftObj = ref(null);  //接子组件草稿对象
    const allComRefTable = ref(null);
     watch(() => props.detail,(newVal, oldVal) => {  
      detailObj.value = Core.Util.deepCopy(newVal);

    });
   /*   watch(() => props.isSaveDraft,(newVal, oldVal) => {  
        detailDraftObj.value = Core.Util.deepCopy(allComRefTable.value.getMsgList())
        dataIntegration('draft');
        
    }); */
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
              key: 'contact_info',
              title: '',
              list: [
                { key: "职位", value: undefined, valueParam: "position", type: 2, required: true,online:true, radioList: [{ value: 1,name: '销售' },{ value: 2,name: '质量' },{ value: 3,name: '技术' },{ value: 4,name: '总经理' }] },
                { key: "姓名", value: undefined, valueParam: "name", type: 1, required: true, change: true },
                { key: "邮箱", value: undefined, valueParam: "email", type: 1, required: true, change: true },
                { key: "联系方式", value: undefined, valueParam: "phone", type: 1, required: true, change: true },
                { key: "", value: undefined, valueParam: "flag_wechat", text: '微信同号', type: 2.3 },
              ]
            }
          ]
        }
    ])

    const lang = computed(() => {
        return proxy.$store.state.lang;
    });
    const msgPart = computed(()=>{
     /*  if(detailDraftObj.value){
        return [...detailDraftObj.value]
      } */
      // console.log('detailDraftObj.value--------1111',detailDraftObj.value);
      return [
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
        key: 'company_info',
        title: "公司概况",
        list: [
          { key: "公司名称", value: undefined, valueParam: "name", type: 1, required: true },
          { key: "公司网址", value: undefined, valueParam: "website_address", type: 1, required: true },
          { key: "成立日期", value: undefined, valueParam: "established_time", type: 4, required: true },
          { key: "详细地址", value: undefined, valueParam: "address", type: 1, required: false, online: true },
          { key: "公司性质", value: undefined, valueParam: "nature", type: 1, required: false },
          { key: "法人代表", value: undefined, valueParam: "legal_person", type: 1, required: true },
          { key: "采购半径", value: undefined, valueParam: "purchasing_radius", type: 3, unit: 'KM',  required: false },
          { key: "占地面积", value: undefined, valueParam: "floor_area", type: 3, unit: 'm²', required: true, },
          { key: "建筑面积", value: undefined, valueParam: "building_area", type: 3, unit: 'm²', required: false, },
          { key: "母公司名称", value: undefined, valueParam: "parent_company_name", type: 1, required: true },
          { key: "母公司地址", value: undefined, valueParam: "parent_company_address", type: 1, required: true },
        ],
      },
      {
        key: 'human_resource',
        title: "人力资源",
        list: [
          { key: "员工总数", value: undefined, valueParam: "total_employees", type: 3, required: false },
          { key: "管理人数", value: undefined, valueParam: "manager_number", type: 3, required: false, },
          { key: "质量人数", value: undefined, valueParam: "mass_number", type: 3, required: false, },
          { key: "技术人数", value: undefined, valueParam: "technician_number", type: 3, required: false, },
          { key: "技术工龄", value: undefined, valueParam: "technical_seniority", type: 3, required: false },
        ],
      },

      {
        key: 'financial_info',
        title: "财务信息",
        list: [
          { key: "法律纠纷", value: undefined, valueParam: "flag_legal_dispute", type: 2, required: true, online: true, radioList: [{ value: 1,name: '有' },{ value: -1 ,name: '无' }] },
          { key: "操作工人月平均工资", value: undefined, valueParam: "average_monthly_wage_of_operating_workers", type: 3, required: false },
          { key: "管理职员人均年产值", value: undefined, valueParam: "per_capita_annual_output_value_of_management_staff", type: 3, required: false },
          { key: "账期要求", value: undefined, valueParam: "account_period_requirement", type: 2, required: true,online: true, radioList: [{ value: 1,name: '90天' },{ value: 2,name: '75天' },{ value: 3,name: '60天' },{ value: 4,name: '30天' },{ value: 5,name: '其他' }] },
          { key: "发票类型", value: undefined, valueParam: "invoice_type", type: 2, required: true,online: true, radioList: [{ value: 1,name: '增值税发票', inputValue: undefined, valueParam: "invoice_range_value", isInput: true },{ value: 2,name: '普通发票' },{ value: 3,name: '其他' }] },
        ],
      },
      {
        key: 'business_info',
        title: "营业信息",
        list: [
          { key: "业务比重", value: undefined, valueParam: "proportion_of_business", type: 1, required: false, online: true, },
          { key: "", value: undefined, valueParam: "business_info_list", type: 6, required: false, online: true, 
            objList: [
                {
                  title: '近1年',
                  key: 'recent_year',
                  list: [
                    { key: "销售额", value: undefined, valueParam: "sales", type: 3, unit: '万元', required: false, },
                    { key: "纳税额", value: undefined, valueParam: "taxes_paid", type: 3, unit: '万元', required: false, },
                    { key: "利润率", value: undefined, valueParam: "profit_margin", type: 3, unit: '%', required: false, },
                    { key: "资产负债率", value: undefined, valueParam: "asset_liability_ratio ", type: 3, unit: '%', required: false, },
                    { key: "现金流量比率", value: undefined, valueParam: "cash_flow_ratio", type: 3, unit: '%', required: false, },
                  ]
                },{
                  title: '近2年',
                  key: 'recent_year',
                  list: [
                    
                    { key: "销售额", value: undefined, valueParam: "sales", type: 3, unit: '万元', required: false, },
                    { key: "纳税额", value: undefined, valueParam: "taxes_paid", type: 3, unit: '万元', required: false, },
                    { key: "利润率", value: undefined, valueParam: "profit_margin", type: 3, unit: '%', required: false, },
                    { key: "资产负债率", value: undefined, valueParam: "asset_liability_ratio", type: 3, unit: '%', required: false, },
                    { key: "现金流量比率", value: undefined, valueParam: "cash_flow_ratio", type: 3, unit: '%', required: false, },
                  
                  ]
                },{
                  title: '近3年',
                  key: 'recent_year',
                  list: [
                    { key: "销售额", value: undefined, valueParam: "sales", type: 3, unit: '万元', required: false, },
                    { key: "纳税额", value: undefined, valueParam: "taxes_paid", type: 3, unit: '万元', required: false, },
                    { key: "利润率", value: undefined, valueParam: "profit_margin", type: 3, unit: '%', required: false, },
                    { key: "资产负债率", value: undefined, valueParam: "asset_liability_ratio", type: 3, unit: '%', required: false, },
                    { key: "现金流量比率", value: undefined, valueParam: "cash_flow_ratio", type: 3, unit: '%', required: false, },
                  
                  ]
                }
              ] 
    },
        ],
      },
      {
        key: 'competitor_analysis',
        title: "竞争对手",
        list: [
          { key: "公司名称", value: undefined, valueParam: "company_name", type: 1, required: false,  },
          { key: "市场份额", value: undefined, valueParam: "market_share", type: 1, required: false },
          { key: "了解评价", value: undefined, valueParam: "understand_evaluation", type: 1.1, row: 3, maxlength: 2000, required: false, online: true, },
        ],
      },
      {
        title: "客户信息",
        key: 'customer_info',
        list: [
          { key: "主要客户", value: undefined, valueParam: "obj_par_list", title_add_text: '客户名称', type: 7, required: false, online: true,
            objItem: {
              customer_order: undefined,
              customer_name: undefined,
              sales_share: undefined,
              main_supply_part: undefined,
              begin_cooperation_time: undefined,
            },
            buttonText: '添加客户',
              obj: {
              columnsList: [

                { title: '客户序号', key: "customer_order", dataIndex: "customer_order", type: 'text' }, // 客户序号
                { title: '客户名称', key: "customer_name", dataIndex: "customer_name", type: 'input' }, // 客户名称
                { title: '销售占比', key: "sales_share", dataIndex: "sales_share", unit: '%', type: 'input-num' }, // 销售占比
                { title: '主供零件', key: "main_supply_part", dataIndex: "main_supply_part", type: 'input' }, // 主供零件
                { title: '开始合作时间', key: "begin_cooperation_time", dataIndex: "begin_cooperation_time", type: 'time' }, // 开始合作时间
                { title: '操作', key: "delete", dataIndex: "operation" }, // 操作
              ],
              dataSourse: [
                {
                  id: 1,
                  customer_order: "主要客户1",
                  customer_name: "哈哈哈1",
                  sales_share: undefined,
                  main_supply_part: undefined,
                  begin_cooperation_time: undefined,
                },
                {
                  id: 2,
                  customer_order: "主要客户2",
                  customer_name: "哈哈哈2",
                  sales_share: undefined,
                  main_supply_part: undefined,
                  begin_cooperation_time: undefined,
                },
                {
                  id: 3,
                  customer_order: "主要客户3",
                  customer_name: "哈哈哈3",
                  sales_share: undefined,
                  main_supply_part: undefined,
                  begin_cooperation_time: undefined,
                },
              ]
            },
          },
        ],
      },
      {
        title: "技术信息",
        key: 'technical_info',
        list: [
          { key: "相关专利", value: undefined, valueParam: "patent", type: 1, required: false },
          { key: "研发中心", value: undefined, valueParam: "RD_center", type: 1, required: false },
          { key: "研发合作机构", value: undefined, valueParam: "RD_partners", type: 1, required: false, online: true,},
          { key: "产品设计", value: undefined, valueParam: "product_design", type: 2.1, required: false, online: true, 
            optionList: [
              { label: '独立设计', value: 1 },
              { label: '共同设计', value: 2 },
              { label: '转化设计', value: 3 },
              { label: '委外设计', value: 4 },
            ] 
    },
          { key: "过程设计", value: undefined, valueParam: "process_design", type: 2.1, required: false, online: true,  
            optionList: [
              { label: '模具设计', value: 5 },
              { label: '检具设计', value: 6 },
              { label: '工装设计', value: 7 },
              { label: '辅具设计', value: 8 },
            ] 
    },
          { key: "过程验证", value: undefined, valueParam: "process_validation", type: 2.1, required: false, online: true,  
            optionList: [
              { label: '模具验收', value: 1 },
              { label: '检具验收', value: 2 },
              { label: '工装验收', value: 3 },
              { label: '产品鉴定', value: 4 },
            ] 
    },
          { key: "设计软件", value: undefined, valueParam: "design_software", type: 1.1, row: 3, maxlength: 2000, required: false, online: true, },
          { key: "开发流程", value: undefined, valueParam: "dev_process", type: 1.1, row: 3, maxlength: 2000, required: false, online: true, },
        ],
      },
      {
        title: "质量信息",
        key: 'quality_info',
        list: [
          { key: "质量体系认证", value: undefined, valueParam: "certification", type: 1, maxLength: 500, required: false },
          { key: "环境体系认证", value: undefined, valueParam: "env_certification", type: 1, maxLength: 500, required: false, },
          { key: "质量合作机构", value: undefined, valueParam: "partners", type: 1, maxLength: 500, required: false, },
          { key: "认可实验室", value: undefined, valueParam: "accredited_laboratory", type: 1, maxLength: 500, required: false, },
          { key: "质控工具软件", value: undefined, valueParam: "tool_software", type: 1, maxLength: 500, required: false },
          { key: "计划认证体系", value: undefined, valueParam: "system_certification", type: 1, maxLength: 500, required: false },
          { key: "市场PPM", value: undefined, valueParam: "PPM", row: 3, type: 1.1, maxLength: 500, required: false, online: true },
        ],
      },
      {
        title: "产能产线",
        key: 'produce_capacity',
        list: [
          { key: "关键自有工序", value: undefined, valueParam: "processes", row: 3, type: 1.1, required: false, online: true  },
          { key: "智能自动化线", value: undefined, valueParam: "automation_line", row: 3, type: 1.1, required: false, online: true  },
          { key: "生产产能负荷", value: undefined, valueParam: "load", row: 3, type: 1.1, required: false, online: true  },
          
        ],
      },
      {
        title: "外购管理",
        key: 'outsourcing',
        list: [
          { key: "外购工艺", value: undefined, valueParam: "technology", row: 3, type: 1.1, required: false, online: true  },
          { key: "外购备件", value: undefined, valueParam: "parts", row: 3, type: 1.1, required: false, online: true  },
          { key: "外购原料", value: undefined, valueParam: "material", row: 3, type: 1.1, required: false, online: true  },
          { key: "外购制度", value: undefined, valueParam: "system", row: 3, type: 1.1, required: false, online: true  },
          
        ],
      },


      ]
    },
{
  
  titleOne: '设备信息',
        listOne: [
    {
      title: "关键生产设备",
      key: 'production_equipment',
      list: [
      { key: "", value: undefined, valueParam: "obj_par_list", type: 7, required: false, online: true,
        objItem: {
          customer_order: undefined,
          customer_name: undefined,
          sales_share: undefined,
          main_supply_part: undefined,
          begin_cooperation_time: undefined,
        },
        buttonText: '添加设备',
        obj: {
          columnsList: [

            { title: '生产设备名称', key: "name", dataIndex: "name", type: 'input' }, // 生产设备名称
            { title: '规格型号（含吨位）', key: "spec", dataIndex: "spec", type: 'input'  }, // 规格型号（含吨位）
            { title: '数量', key: "quantity", dataIndex: "quantity", type: 'input-num' }, // 数量
            { title: '设备制造商', key: "manufacturer", dataIndex: "manufacturer", type: 'input' }, // 设备制造商
            { title: '购置年限', key: "purchase_period", dataIndex: "purchase_period", type: 'input-num' }, // 购置年限
            { title: '操作', key: "delete", dataIndex: "operation" }, // 操作
          ],
          dataSourse: [
            {
              id: 1,
              name: undefined,
              spec: undefined,
              quantity: undefined,
              manufacturer: undefined,
              purchase_period: undefined,
            },
            {
              id: 2,
              name: undefined,
              spec: undefined,
              quantity: undefined,
              manufacturer: undefined,
              purchase_period: undefined,
            },
            {
              id: 3,
              name: undefined,
              spec: undefined,
              quantity: undefined,
              manufacturer: undefined,
              purchase_period: undefined,
            },
          ]
        },
        },

      ],
          },

    {
      title: "关键检测设备",
      key: 'detection_equipment',
      list: [
        { key: "", value: undefined, valueParam: "obj_par_list", type: 7, required: false, online: true,
        objItem: {
          customer_order: undefined,
          name: undefined,
          Spec: undefined,
          quantity: undefined,
          manufacturer: undefined,
          accuracy_level: undefined,
        },
        buttonText: '添加设备',
        obj: {
          columnsList: [

            { title: '检测设备名称', key: "name", dataIndex: "name", type: 'input' }, // 检测设备名称
            { title: '规格型号', key: "spec", dataIndex: "spec", type: 'input'  }, // 规格型号
            { title: '数量', key: "quantity", dataIndex: "quantity", type: 'input-num' }, // 数量
            { title: '设备制造商', key: "manufacturer", dataIndex: "manufacturer", type: 'input' }, // 设备制造商
            { title: '精度等级', key: "purchase_period", dataIndex: "accuracy_level", type: 'input-num' }, // 精度等级
            { title: '操作', key: "delete", dataIndex: "operation" }, // 操作
          ],
          dataSourse: [
            {
              id: 1,
              name: undefined,
              spec: undefined,
              quantity: undefined,
              manufacturer: undefined,
              accuracy_level: undefined,
            },
            {
              id: 2,
              name: undefined,
              spec: undefined,
              quantity: undefined,
              manufacturer: undefined,
              accuracy_level: undefined,
            },
            {
              id: 3,
              name: undefined,
              spec: undefined,
              quantity: undefined,
              manufacturer: undefined,
              accuracy_level: undefined,
            },
          ]
        },
        },

      ],
          },

  ]
},

{
  
  titleOne: '补充信息',
        listOne: [
              {
                title: "",
                key: 'additional_info',
                list: [ 
                    { key: "其他优势说明", value: undefined, valueParam: "in_it", row: 3, type: 1.1, required: false, online: true  },
                ],
              },

  ]
}
]
    })
    const type = ref(1);
    const saveDraft = () => {
        // 获取数据
        let data =
            Core.Data.getSupplyDraftChain() === ""
                ? {}
                : JSON.parse(Core.Data.getSupplyDraftChain());
        // 判断是否为空对象
        /* if (Object.keys(data).length === 0) {
            // 为空对象
            data = {
                confirmatory_material: formState,
            };
        } else {
            // 不为空对象
            data.confirmatory_material = formState;
        } */
        console.log("草稿数据：", data);

        // 保存数据
        Core.Data.setSupplyDraftChain(JSON.stringify(data));

        // 提示
        message.success($t("supply-chain.save_successfully"));
    }
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
      
      if(type.value === 1) {
        
        // 本地对象回显
        reviewCode();
        return Part;
      } else if(type.value === 2) {
        return Broker;
      } else if(type.value === 3) {
        return Outsourcing;
      } else if(type.value === 4) {
        return Mold;
      } else if(type.value === 5) {
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
    const handleTypeModeChange = (data) => {
  let boo = true;
  if(data.target.value === Core.Const.SUPPLAY.POSITION[4].value) boo = false;
  msgPost[0].listOne[0].list.forEach((item)=>{
    if(item.change) {
      item.required = boo;
    }
  })
    }

  // 根据子组件的msgList 的-> detailDraftObj.value 数据整为后端的类型-并存储本地
  // 循环数据对象  转  json
  const dataIntegration = (data) => {
    let obj = {};
    msgPost[0].listOne.forEach((item1,index1) => {
        obj[item1.key] = {};
        if(item1?.key) {
          item1.list.forEach((item2,index2) => {
            if(item2.valueParam === 'position') {
                obj[item2.valueParam] = item2.value;
            } else if(item2.valueParam) {
                obj[item1.key][item2.valueParam] = item2.value;
            }
          })
        }
    })

    obj['type'] = type.value;

    detailDraftObj.value.forEach(($1, ind1)=>{
        $1.listOne.forEach(($2_item_listOne, ind2)=>{

            if(!$2_item_listOne?.key) return;
            obj[$2_item_listOne.key] = {};

            $2_item_listOne.list.forEach(($3_item_list, ind3)=>{
                if(!$3_item_list?.valueParam) return;

                if($3_item_list?.valueParam === 'obj_par_list') {

                  obj[$2_item_listOne.key] = [];
                  obj[$2_item_listOne.key].push([...$3_item_list.obj.dataSourse]);

                  return ;
                } else if($3_item_list?.valueParam === 'business_info_list') {

                  obj[$2_item_listOne.key] = [];
                  obj[$2_item_listOne.key]['list'] = [];
                  $3_item_list.objList.forEach(item_list1 => {
                      let obj_list_obj = {}
                      obj_list_obj[item_list1.key] = item_list1.title;

                      item_list1.list.forEach(item_list1_item => {
                          obj_list_obj[item_list1_item.valueParam] = item_list1_item.value;
                      })
                      obj[$2_item_listOne.key]['list'].push(obj_list_obj);

                  })
                  return ;
                } else if($3_item_list?.valueParam === 'invoice_type') {
                  
                    obj[$2_item_listOne.key][$3_item_list.valueParam] = $3_item_list.value;
                    if($3_item_list.value === $3_item_list.radioList[0].value) {

                      obj[$2_item_listOne.key][$3_item_list.radioList[0].valueParam] = $3_item_list.radioList[0].inputValue;
                    }else {
                      obj[$2_item_listOne.key][$3_item_list.radioList[0].valueParam] = '';
                    }
                    return;
                } else if($3_item_list?.valueParam === 'in_it') {
                    
                    return ;
                }
                obj[$2_item_listOne.key][$3_item_list.valueParam] = $3_item_list.value;
                
            })
            
        })
    })
    // obj['company_name'] = obj?.company_info?.name;
    console.log('----------------------------',obj)
    if(data === 'next') {
        // 校验成功而后
        // v()  校验方法
        Core.Data.setSupplyChain(JSON.stringify(obj));
        return true;
    } else if('draft') {
        // Core.Data.setSupplyDraftChain(JSON.stringify(detailDraftObj.value));
    }
  }
  onMounted(() => {
      // Core.Data.setSupplyDraftChain(JSON.stringify(''));
      // 本地对象回显
      reviewCode();

  })

  const reviewCode = () => {
      let draftDataJson = Core.Data.getSupplyDraftChain();
      console.log('draftDataJson',draftDataJson);
      let draftData =draftDataJson ? JSON.parse(draftDataJson) : '';
      /*  
      if (Object.keys(draftData).length === 0) {
        detailDraftObj.value = null;
      }else {
      } */
      console.log('draftData222222',draftData);
      detailDraftObj.value = Core.Util.deepCopy(draftData)
      console.log('detailDraftObj.value1111',detailDraftObj.value);
  }

  const beforeSaveVisible = () => {

      detailDraftObj.value = Core.Util.deepCopy(allComRefTable.value.getMsgList())
      dataIntegration('next')
      // 校验成功而后
      return true;
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
      type,
      componentName,
      handleTypeModeChange,
      msgPart,
      msgPost,
      Core,
      lang,
      props,
      allComRefTable,
      beforeSaveVisible,
      saveDraft, //保存草稿
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
:deep(.ant-picker) {
  width: 100%;
}
}
</style>