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
                v-model:value="followObj.group_id"
                placeholder="选择转移目标区域"
                @change = "groupChangeClick"
              >
                <a-select-option
                  v-for="item of optionsRegion"
                  :key="item.key"
                  :value="item.id"   
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </div>
          </div>
          <!-- 转移目标城市 -->
          <div class="form-item required">
            <div class="key">转移目标城市：</div>
            <div class="value">
              <a-select
                v-model:value="followObj.city"
                placeholder="选择转移目标城市"
                :disabled="!followObj.group_id"
                @change="cityChangeClick"
              >
                <a-select-option
                  v-for="item of optionsCity"
                  :key="item.id"
                  :value="item.city"   
                  >{{ item.city }}</a-select-option
                >
              </a-select>
            </div>
          </div>
          
          <!-- 转移目标门店 -->
          <div class="form-item required">
            <div class="key">转移目标门店：</div>
            <div class="value">
              <a-select
                v-model:value="followObj.store_id"
                placeholder="选择转移目标门店"
                :disabled="!followObj.city"
              >
                <a-select-option
                  v-for="item of optionsStore"
                  :key="item.id"
                  :value="item.id"   
                  >{{ item.name }}</a-select-option
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
                <a-textarea v-model:value="followObj.remark" placeholder="请输入转移原因" :rows="4" />
            </div>
          </div>
          <template #footer>
              <a-button key="submit" type="primary" @click="handleOk">确认转移</a-button>
          </template>
        </a-modal>
  </div>
</template>

<script setup>
import Core from "@/core";
import { reactive, ref ,onMounted ,inject } from 'vue';

const userId = inject('userId');
// 意向度-选项列表
const intentedList = Core.Const.INTENTION.TYPE_MAP;
// 弹窗显示变量
const isShowFollow = ref(false);
const followObj = reactive({ 
    group_id: '',
    city: '', 
    store_id: '',
    store_user_id: '',
    remark: '',
    // id: userId.value,
}) 
// 所属大区
const optionsRegion = ref([]);
// 所属城市
const optionsCity = ref([]);
// 门店列表
const optionsStore = ref([]);

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
onMounted(() => {    
  getRegionsList()                                                                                                                                                                                                             
})
// 点击写跟进按钮
const clickModelOk = () => {
    isShowFollow.value = true;
}
// 获取区域列表
const getRegionsList = () => {
  Core.Api.CustomService.groupList().then(res=>{
		Core.Logger.success('getRegionsList',res);
		optionsRegion.value = res.list;
	}).catch(err=>{
        Core.Logger.error("参数", "数据", err)
	})
}
// 获取城市列表
const getCityList = (value) => {
  Core.Api.CustomService.getCityList({
    id:value
  }).then(res=>{
		Core.Logger.success('getCityList',res);
		optionsCity.value = res;
	}).catch(err=>{
    Core.Logger.error("参数", "数据", err)
	})
}

// 获取门店列表
const getStoreList = () => {
  Core.Api.CustomService.storeList({
    group_id: followObj.group_id,
    city: followObj.city,
    page_size: 500,
  }).then(res=>{
		Core.Logger.success('storeList',res);
		optionsStore.value = res;
	}).catch(err=>{
    Core.Logger.error("参数", "数据", err)
	})
}

// 区域更改事件
const groupChangeClick = (value) => {
  Core.Logger.success('groupChangeClick',value);
  followObj.city = '';
  followObj.store_id = '';
  getCityList(value);
}
// 城市更改事件
const cityChangeClick = (value) => {
  Core.Logger.success('cityChangeClick',value);
  followObj.store_id = '';
  getStoreList();
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