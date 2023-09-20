<template>
    <div class="follow-up follow-contenter">
         <!--  <a-button type="primary" @click="clickModelOk">
              <template #icon><EditOutlined /></template>
              写跟进
          </a-button> -->
          
          <a-modal 
              width="560px" height="485px"  v-model:visible="isShowFollow"
              title="线索转移"
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
              
            <!-- 转移目标区域 -->
            <div class="form-item required">
              <div class="key">转移目标区域：</div>
              <div class="value">
                <a-select
                  v-model:value="followObj.follow_type"
                  placeholder="选择转移目标区域"
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
            <!-- 转移目标城市 -->
            <div class="form-item required">
              <div class="key">转移目标城市：</div>
              <div class="value">
                <a-select
                  v-model:value="value1"
  
                  placeholder="选择转移目标城市"
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

            
            <!-- 转移目标门店 -->
            <div class="form-item required">
              <div class="key">转移目标门店：</div>
              <div class="value">
                <a-select
                  v-model:value="followObj.follow_type"
                  placeholder="选择转移目标门店"
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
            <!-- 转移目标体验官 -->
            <div class="form-item">
              <div class="key">转移目标体验官：</div>
              <div class="value">
                <a-select
                  v-model:value="followObj.offecter"
                  placeholder="选择转移目标体验官"
                  allowClear
                  show-search
                  option-label-prop="label"
                >
                 <!--  <a-select-option
                    v-for="item of intentedList"
                    :key="item.key"
                    :value="item.value"   
                    >{{ item.key }}</a-select-option
                  > -->
                    <a-select-option :value="item.label" :label="item.label"  v-for="(item,index) in options" :key="item.value">
                            <img :src="item.img" class="options-img" alt="">
                            <div class="option-right">
                                <div class="options-top"> <span class="name-option">{{ item.label }}</span>&nbsp;&nbsp; <span class="phone-option">{{ item.icon }}</span>&nbsp;&nbsp;  <span class="work-option">{{ item.work }}</span></div>
                                <div class="area-option">{{ item.area }}</div>
                            </div>
                    </a-select-option>
                </a-select>
              </div>
            </div> 
            <div class="form-item flex-aline required">
              <div class="key">转移原因：</div>
              <div class="value">
                  <a-textarea v-model:value="followObj.followText" placeholder="请输入转移原因" :rows="4" />
              </div>
            </div>
            <template #footer>
                <a-button key="submit" type="primary" @click="handleOk">确认转移</a-button>
            </template>
          </a-modal>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue';
  import Core from "@/core";

  // 意向度-选项列表
  const intentedList = Core.Const.INTENTION.TYPE_MAP;
  // 弹窗显示变量
  const isShowFollow = ref(false);
  const followObj = reactive({ 
      intentValue: 10,
      communicate_type: 1, 
      followText: '',
      offecter:''
  }) 
  const options = ref([
      {
        value: '1',
        label: '李鹏',
        icon: '155****4561',
        img:'https://tse4-mm.cn.bing.net/th/id/OIP-C.Cdq25dINGG8gky7W0x8XaQHaE7?pid=ImgDet&rs=1',
        area:'上海大区-上海 上海浦东新区大美都广场体验中心',
        work:'用户体验官'
      },
      {
        value: '2',
        label: '姬发',
        icon: '155****4561',
        img:'https://tse4-mm.cn.bing.net/th/id/OIP-C.Cdq25dINGG8gky7W0x8XaQHaE7?pid=ImgDet&rs=1',
        area:'上海大区-上海 上海浦东新区大美都广场体验中心',
        work:'用户体验官'
      },
      {
        value: '3',
        label: '李大钊',
        icon: '155****4561',
        img:'https://tse4-mm.cn.bing.net/th/id/OIP-C.Cdq25dINGG8gky7W0x8XaQHaE7?pid=ImgDet&rs=1',
        area:'上海大区-上海 上海浦东新区大美都广场体验中心',
        work:'用户体验官'
      },
      {
        value: '4',
        label: '王倩',
        icon: '155****4561',
        img:'https://tse4-mm.cn.bing.net/th/id/OIP-C.Cdq25dINGG8gky7W0x8XaQHaE7?pid=ImgDet&rs=1',
        area:'上海大区-上海 上海浦东新区大美都广场体验中心',
        work:'用户体验官'
      },
    ]);
  // 点击写跟进按钮
  const clickModelOk = () => {
      isShowFollow.value = true;
  }
  
  defineExpose({clickModelOk});
  const handleOk = () => {
      console.log('followObj---',followObj);
  }
   
  </script>
  
  <style lang="less" scoped>
  
  .flex-aline {
      display: flex;
      align-items: flex-start; 
  }
  
  .name-option {
        color:  #1D2129;
        font-size: 16px;
        font-weight: 600;
    }

  :deep(.ant-select-selection-item){
        display: flex;
        align-items: center;
        .options-img {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: none;
    }
    .work-option {
        display: none;
    }
    .area-option {
        display: none;
    }
    .name-option {
        font-weight: 400;
        font-size: 12px;
    }
  }

  .options-img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin: 10px 0px;

    }

    .option-right {
        display: inline-flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
        vertical-align: top;
        margin-left: 12px;
        padding: 10px 0px;
    }
    .area-option {
        color:  #86909C;
        font-size: 12px;
        font-weight: 400;
    }
  </style>