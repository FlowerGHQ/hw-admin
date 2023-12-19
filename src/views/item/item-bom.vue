<template>
  <div class="item-bom">
    <div class="list-container item-container">
      <div class="title-container" ref="titleRefs">
        <div class="title-area">{{ $t("item-bom.title") }}</div>
      </div>
      <div
        class="item-tree"
        :style="{ height: 'calc(100% - ' + titleHeight + ')' }">
        <!-- 左边 -->
        <div class="item-tree-left">
          <div class="title-area">{{ $t("item-bom.bom_list") }}</div>
          <div class="tree-content">
            <FittingsTree v-model:activeObj="activeObj" :cancelIds="cancelId"/>
          </div>
        </div>
        <!-- 右边 -->
        <div class="item-tree-right">
          <div class="search-content" :style="{ 'min-width': minWidthCount + 'px' }">
            <SearchAll ref="searAllRef" :isShowMore="false" :options="searchOptions" @search="handleSearch" @reset="handleReset"></SearchAll>
          </div>
          <component :style="{ 'min-width': minWidthCount + 'px' }" ref="allComRef" :is="componentName" :activeObj="activeObj" :searchParams="searchParams" ></component>
        </div>
      </div>
    </div>

    <ClassifyModal v-model:visibility="classifyModalShow" :activeObj="activeObj" :code="level2CodeStr" @refresh="refresh" @update:visibility="setValue"></ClassifyModal>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, computed ,watch, provide, getCurrentInstance,} from "vue";
import SearchAll from '../../components/common/SearchAll.vue';
import fittings from "./components/item-bom/Fittings.vue";
import FittingsTwo from "./components/item-bom/FittingsTwo.vue";
import FittingsThree from "./components/item-bom/FittingsThree.vue";
import FittingsTree from "./components/item-bom/FittingsTree.vue";
import ClassifyModal from "./components/item-bom/ClassifyModal.vue";   // 分类弹窗组件

const minWidthCount = 900

// 标题高度
const titleRefs = ref(null);
const titleHeight = ref(0);
// 取消的id
const cancelId = ref(0);
const { proxy } = getCurrentInstance();
// 选择层级对象
/**
 * {
 *    level：1 | 2 | 3，传递层级
 *    id: 1, //level为1时，id为商品item_id level为2时，id为版本列表的id (注释为bomid)  level为3时，id为分类列表id（注释为bomid）
 *    name: "一级分类", 名字
 * }
 * */ 
const activeObj = ref({});
const level2CodeStr = ref('')
const searchOptions = ref([
    {
        id: 1,
        type: "input",
        key: 'item-bom.product_name',
        value: undefined,
        searchParmas: "name",                    
        placeholder: "item-bom.please_enter",
    },
    {
        id: 2,
        type: "input",
        key: 'item-bom.commodity_code',
        value: undefined,
        searchParmas: "code_list",                    
        placeholder: "item-bom.commodity_code_tips",
    },
]) // 搜索options
const searchParams = ref({}) // 搜索参数

// 显示分类弹窗组件-变量
const classifyModalShow = ref(false)

watch(
    activeObj,
    (newVal)=>{
        searAllRef.value.handleSearchReset()
    },
    {
        deep:true
    }
)
const componentProps = ref()
const componentName = computed(() => {
  componentProps.value = activeObj.value;
  if (activeObj.value.level === 1) {
    return fittings;
  } else if (activeObj.value.level === 2) {
    return FittingsTwo;
  } else if (activeObj.value.level === 3) {
    return FittingsThree;
  } else {
    return fittings;
  }
});

const handleSearch = (data)=>{
  searchParams.value = data
  searchParams.value.code_list = data.code_list ? data.code_list.split(',') : []
}
const handleReset = ()=>{
  searchParams.value = {}
}
const allComRef = ref(null)   // component refs
const searAllRef = ref(null)   // searAll refs

onMounted(() => {
  titleHeight.value = titleRefs.value.offsetHeight + "px";
});

/* fetch start */
/* fetch end */

/* methods start*/
/* methods end*/
/* methods */
// 组件切换
const compChange = () => {};

// 分类弹窗打开
const showClassModal = (data) => {
  level2CodeStr.value = data;
  classifyModalShow.value = true;
}

provide('classifyShowModal', showClassModal); // 提供分类弹窗打开方法
provide('bomId', activeObj.value.id); // 提供分类弹窗打开方法
const refresh = () => {
  if(activeObj.value.level===2){
    allComRef.value.refresh();
    return;
  }
  allComRef.value.getTableDataFetch();
}

const setValue = (val) => {

    classifyModalShow.value = val;
    if(!val) { level2CodeStr.value = '' };
}
</script>

<style lang="less" scoped>
.item-bom {
  width: 100%;
  height: 100%;
  .item-container {
    height: 100%;
    padding: 20px;
    .title-container {
      padding: 0;
      margin-bottom: 16px;
    }
    .item-tree {
      width: 100%;
      display: flex;
      box-sizing: border-box;
      padding-bottom: 20px;
      .item-tree-left {
        min-width: 454px;
        height: 100%;
        background-color: #f8fafc;
        font-size: 48px;
        padding: 24px 20px 16px 20px;
        display: flex;
        flex-direction: column;
        .title-area {
          color: #1d2129;
          font-size: 16px;
          line-height: 22px;
        }
        .tree-content {
          margin-top: 16px;
          flex: 1;
          height: calc(100% - 38px);
        }
      }
      @media (max-width:1440px) {
        .item-tree-left {
            min-width: 354px;
        }
    }
      .item-tree-right {
        flex: 1;
        overflow-y: auto;
        padding: 0 17px;
        .search-content {
            margin-bottom: 24px;    
        }
      }
    }
  }
}
</style>
