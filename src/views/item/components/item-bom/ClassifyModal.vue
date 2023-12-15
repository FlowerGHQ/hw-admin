<template>
    <a-modal v-model:visible="visibility" :width="860" title="配件分类"  @ok="handleOk" >
        <!-- 搜索固定数据 -->
        <div class="search-container-new top-box">
            <div  class="item-box">
                <div class="key-box">
                    {{ $t('item-bom.obj_currently_grouped') }}
                </div>

                <div class="value-box">
                    <a-select
                        v-model:value="classValue"
                        placeholder="请选择">
                        <a-select-option
                            v-for="(val, key) in [1,2,3,4]"
                            :key="key"
                            :value="val"
                            >{{ val }}</a-select-option
                        >
                    </a-select>
                </div>
            </div>
        </div>
        <div class="search">
            <SearchAll :isShowMore="false" :disabled="level===2" @search = "handleSearch" @reset = "handleSearchReset" >
                <template v-slot:extend>
                    <a-col v-if="options.type === 'input'" :xs="24" :sm="15" :xl="15" :xxl="15" class="search-box">
                            <div  class="item-box">
                                <div class="key-box">
                                    {{ $t(options.key) }}
                                </div>
                                <div class="value-box">
                                    <a-input
                                        :disabled="level===2"
                                        :placeholder="$t(`${ options.placeholder || 'def.input' }`)"
                                        v-model:value="codeStr"
                                        @keydown.enter="handleSearch" />
                                </div>
                            </div>
                        </a-col>    
                </template>
            </SearchAll>
        </div>
        <!-- 占位盒子 -->
        <div class="fixed">
        </div>
        <div style="height: 140px;"></div>
        <!-- 表格组件 -->
        <TableSelectV3
            :columns="tableColumns" 
            :data-source="tableData" 
            :loading='loading'  
            :check-mode='true' 
            :default-checked="defaultChecked"
            @submit="handleSelectItem"
        ></TableSelectV3>
        <template #footer>
            <div class="modal-footer">
                <div class="paging-area">
                    <a-pagination
                            v-model:current="current"
                            v-model:pageSize="pageSize"
                            show-size-changer
                            :total="total"
                            @change="pageChange"
                            @showSizeChange="onShowSizeChange"
                        />
                    <div class="tip">
                        {{ $t('in.selected') + ` ${selectItemIds.length} ` + $t('in.total')}}
                    </div>{{  level.value  }}1111
                </div>
                <div class="btn-area">
                    <a-button @click="handleCancle">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleOk" type="primary">{{ $t('def.sure') }}</a-button>
                </div>
            </div>
        </template>
    </a-modal>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, watch, onUnmounted, nextTick } from 'vue';
import Core from "@/core";
import SearchAll from "@/components/common/SearchAll.vue"
import TableSelectV3 from '@/components/table/TableSelectV3.vue'

const initialObject = { 
    // 商品编码
    codeList: []
}
const props = defineProps({  
    // v-model 绑定值  
    visibility:{
        type: Boolean,
        default:false        
    },
    id:{
        type: Number,
        default: ''
    },
    // level
    level:{
        type: Number,
        default: 0
    },
    code:{ //二级页面点击单条进行分类
        type: String,
        default: ''
    }
})
// 当前分组对象
const classValue =  ref();
const searchForm = ref({
    // 商品编码
    codeList: []
})
const bomId = ref('');
const level = ref(0)
const defaultChecked = ref([])
const emits = defineEmits(['update:visibility']) 
// 搜索列表组件
const options = ref(
    {
         type: "input", 
         value: "", 
         searchParmas: "code", 
         key: 'item-bom.commodity_code', 
         placeholder: 'item-bom.filter_multiple_codes'
    }
)
// 商品编码-字符串
const codeStr = ref();
// 监听弹窗关闭-更改父组件prop弹窗显隐值
watch(
    () => props.visibility,
    (newValue, oldValue) => {
        emits("update:visibility", newValue)
        nextTick(()=>{
            handleSearch()
        })
    }    
)// 监听弹窗id接收变换
watch(
    () => props.id,
    (newValue, oldValue) => {
        bomId.value = newValue;
        // console.log('bomId.value',bomId.value);
    }    
)
// 监听弹窗level接收变换
watch(
    () => props.level,
    (newValue, oldValue) => {
        level.value = newValue;
        // console.log('level.value',level.value);
    }    
)

// 监听弹窗level2时code监听变化接收变换
watch(
    () => props.code,
    (newValue, oldValue) => {
        codeStr.value = newValue;
        // console.log('1111codeStr.value',codeStr.value);

    }    
)
const selectItemIds = ref([])
const tableData = ref([])

const pageSize = ref(10);
const current = ref(1);
const total = ref(0);
// 页size改变
const onShowSizeChange = (current, pageSize) => {
    pageChange()
};
 // 页码改变
const pageChange = () => {  
    getTableDataFetch()
}
const { proxy } = getCurrentInstance();
const loading = ref(false);
const tableColumns = computed(() => {
    const result = [
        { 
            // 商品名称
            title: proxy.$t('item-bom.product_name'), 
            dataIndex: "sync_name", 
            key: "sync_name"
        },
        { 
            // 商品编码
            title: proxy.$t('item-bom.commodity_code'), 
            dataIndex: "sync_id", 
            key: "sync_id"
        },
        { 
            // 分类
            title: proxy.$t('item-bom.classify'), 
            dataIndex: "bom_category", 
            key: "bom_category"
        },
        { 
            // 用量
            title: proxy.$t('item-bom.dosage'), 
            dataIndex: "amount", 
            key: "amount"
        },
        { 
            // 销售区域
            title: proxy.$t('item-bom.sales_area'), 
            dataIndex: "sales_area_list", 
            key: "sales_area_list"
        },
        { 
            // 创建时间
            title: proxy.$t('item-bom.create_time'), 
            dataIndex: "sync_time", 
            key: "sync_time"
        },
        /* {
            // 备注
            title: proxy.$t('item-bom.remark'), 
            dataIndex: "remark",
            key: "remark",
        }, */
    ]
    return result
})

// 获取search组件对象
/* const getSearchFrom = (data) =>  {
    console.log('data---getSearchFrom',data);
    for(let key in data){
        searchForm.value[key] = data[key];
    }
    // this.handleSearch();
} */

onMounted(() => {
    getTableDataFetch()
})
  
// 重置按钮
const handleSearchReset = ( ) => {
    
      // 重置搜索
      Object.assign(searchForm.value, initialObject);
      console.log('searchForm.value---handleSearchReset',searchForm.value);
      getTableDataFetch()
}
const handleSearch = () => {
    console.log('codeStr.value---handleSearch',codeStr.value);
    if(codeStr.value){

        //更换数组形式传参,字符串逗号分隔输入--编码
        let arr = codeStr.value.trim().split(',');
        arr = arr.map(item => item.trim());
        searchForm.value.codeList = arr.filter(item => item !== ""); 
    }

    getTableDataFetch()
    
}
const handleSelectItem = (qqq,bbbb) => {
    console.log('qqq,bbbb',qqq,bbbb);
}

const handleCancle = () => {

}
const handleOk = (e) => {
    console.log(e);
};

/* Fetch start*/
// 获取表格list
const getTableDataFetch = (parmas = {}) => {
    loading.value = true
    let obj = {
        bom_id: bomId.value,
        code_list: searchForm.value.codeList,//同步编号
        page: current.value,
        page_size: pageSize.value,
        ...parmas
    }

    Core.Api.ITEM_BOM.partsList(obj).then(res => {
        console.log('getTableDataFetch',res);
        total.value = res.count;
        tableData.value = res.list;
    }).catch(err => {
        console.log("getTableDataFetch", err);
    }).finally(()=>{
        loading.value = false
    })
}

</script>

<style lang="less" scoped>

 .search {
    position: absolute;
    top: 120px;
    padding: 0;
    width:-moz-calc(100% - 48px); 
    width:-webkit-calc(100% - 48px); 
    width: calc(100% - 48px);
    z-index: 20;
 }
.top-box {
    width: 415px;
    position: absolute;
    z-index: 20;
}

.tip {
        height: 30px;
        line-height: 30px;
        margin-left: 10px;
        font-size: 12px;
}

.fixed {
    background-color: #FFFFFF;
    height: 140px;
    position: absolute;
    top: 44px;
    width:-moz-calc(100% - 24px); 
    width:-webkit-calc(100% - 24px); 
    width: calc(100% - 24px);
    left: 0;
    z-index: 0;
    z-index: 15;
}
</style>