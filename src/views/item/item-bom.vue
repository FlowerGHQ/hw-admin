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
            <FittingsTree v-model:activeObj="activeObj" />
          </div>
        </div>
        <!-- 右边 -->
        <div class="item-tree-right">
          <div class="search-content">
            <SearchAll :isShowMore="false" :options="searchOptions"></SearchAll>
          </div>
          <component :is="componentName" :id="activeObj.id"></component>
        </div>
      </div>
    </div>

    <ClassifyModal v-model:visibility="classifyModalShow" :id="activeObj.id" @update:visibility='val=>{ classifyModalShow = val }'></ClassifyModal>
    
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, computed ,watch, provide} from "vue";
import SearchAll from '../../components/common/SearchAll.vue'
import fittings from "./components/item-bom/Fittings.vue";
import FittingsTwo from "./components/item-bom/FittingsTwo.vue";
import FittingsThree from "./components/item-bom/FittingsThree.vue";
import FittingsTree from "./components/item-bom/FittingsTree.vue";
import ClassifyModal from "./components/item-bom/ClassifyModal.vue";   // 分类弹窗组件
// const componentName = shallowRef(fittings)
// 标题高度
const titleRefs = ref(null);
const titleHeight = ref(0);
// 选择层级对象
/**
 * {
 *    level：1 | 2 | 3，传递层级
 *    id: 1, //level为1时，id为商品item_id level为2时，id为版本列表的id (注释为bomid)  level为3时，id为分类列表id（注释为bomid）
 *    name: "一级分类", 名字
 * }
 * */ 
const activeObj = ref({});
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
        searchParmas: "code",                    
        placeholder: "item-bom.commodity_code_tips",
    },
]) // 搜索options

// 显示分类弹窗组件-变量
const classifyModalShow = ref(false)

watch(
    activeObj,
    (newVal)=>{
        console.log("newVal",newVal)
    },
    {
        deep:true
    }
)

const componentProps = ref()

const componentName = computed(() => {
  componentProps.value = activeObj.value;
  console.log('componentProps.value',componentProps.value);
  if (activeObj.value.level === 1) {
    return fittings;
  } else if (activeObj.value.level === 2) {
    return FittingsTwo;
  } else if (activeObj.value.level === 3) {
    return FittingsThree;
  } else {
    return FittingsThree;
  }
});

onMounted(() => {
  titleHeight.value = titleRefs.value.offsetHeight + "px";
  console.log("高度", titleHeight.val);
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
  classifyModalShow.value = true;
}

provide('classifyShowModal', showClassModal); // 提供分类弹窗打开方法
provide('bomId', activeObj.value.id); // 提供分类弹窗打开方法

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
          font-weight: 600;
          line-height: 22px;
        }
        .tree-content {
          margin-top: 16px;
          flex: 1;
          height: calc(100% - 38px);
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
