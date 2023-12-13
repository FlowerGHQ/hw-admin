<template>
  <div class="tree-main">
    <a-input-search
      v-model:value="keyWord"
      :placeholder="$t('item-bom.search_ph')"
      @search="onSearch"
      class="tree-search">
      <template #enterButton>
        <MySvgIcon icon-class="search" />
      </template>
    </a-input-search>
    <div class="tree-select-main">
      <TreeCircle
        :treeData="treeData"
        @activeLevel="handleActiveLevel"
        @activeKey="handleActiveKey" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import TreeCircle from "./TreeCircle.vue";
// 搜索关键词
const keyWord = ref("");
// emit
const $emit = defineEmits(["update:activeObj"]);

// 搜索事件
const onSearch = (value) => {
  console.log("搜索", value);
};

const activeObj = reactive({
  level: "",
  key: "",
});

const treeData = reactive([
  {
    title: "SK1创始版 黑色（3版本）",
    key: "0-0",
    children: [
      {
        title: "0-0-0",
        key: "0-0-0",
        children: [
          { title: "0-0-0-0", key: "0-0-0-0" },
          { title: "0-0-0-1", key: "0-0-0-1" },
          { title: "0-0-0-2", key: "0-0-0-2" },
        ],
      },
      {
        title: "0-0-1",
        key: "0-0-1",
        children: [
          { title: "0-0-1-0", key: "0-0-1-0" },
          { title: "0-0-1-1", key: "0-0-1-1" },
          { title: "0-0-1-2", key: "0-0-1-2" },
        ],
      },
      {
        title: "0-0-2",
        key: "0-0-2",
      },
    ],
  },
  {
    title: "SK1创始版 银月白色（3版本）",
    key: "0-1",
  },
  {
    title: "SK1创始版 红色（3版本）",
    key: "0-2",
  },
  {
    title: "SK1创始版 蓝色（3版本）",
    key: "0-3",
  },
]);

const handleActiveLevel = (level) => {
  activeObj.level = level;
  $emit("update:activeObj", activeObj);
};
const handleActiveKey = (key) => {
  activeObj.key = key;
  $emit("update:activeObj", activeObj);
};
</script>

<style lang="less" scoped>
.tree-main {
  .tree-search {
    display: block;
    :deep(.ant-input-wrapper) {
      border: 1px solid #e2e2e2 !important;
      height: 100% !important;
      border-radius: 4px;
      overflow: hidden;
      .ant-input {
        border: none !important;
        border-radius: 0 !important;
        height: 100% !important;
        &:focus {
          border: none !important;
          box-shadow: none !important;
        }
      }
      .ant-input-group-addon {
        .ant-input-search-button {
          //清除默认样式
          border: none !important;
          background: none !important;
          box-shadow: none !important;
          font-size: 16px;
          color: #333333;
          padding: 0;
          width: 36px;
          &::after {
            content: none !important;
          }
        }
      }
    }
  }
  .tree-select-main {
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    font-size: 16px;
    margin-top: 16px;
  }
}
</style>
