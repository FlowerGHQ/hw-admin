<template>
  <div class="tree-circle">
    <div
      v-for="item in realData"
      class="item pointer"
      :class="{ 'active-item': item.key == activeKey }"
      @click="selectKey(item)">
      <div class="tree-item-main">
        <div class="content">
          <MySvgIcon
            :icon-class="
              hasChildren(item)
                ? !item.select
                  ? 'up-arrow'
                  : 'down-arrow'
                : ''
            "
            @click="expand(item)"
            class="arrow" />
          <MySvgIcon icon-class="group-select" class="group" />
          <div class="title">{{ item.title }}</div>
        </div>
        <div class="edit">
          <MySvgIcon icon-class="edit" />
        </div>
      </div>
	  <div class="expand-area" v-if="item.select">
		
	  </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import MySvgIcon from "@/components/MySvgIcon/index.vue";

const proxy = defineProps({
  treeData: {
    type: Array,
    default: () => [],
  },
});
const realData = ref([]);
const activeKey = ref("");
// 递归子节点
const circleChildren = (arr) => {
  return arr.map((item) => {
    return {
      title: item.title,
      key: item.key,
      select: false,
      children: item.children ? circleChildren(item.children) : [],
    };
  });
};
// 判断是否有子节点
const hasChildren = (item) => {
  return item.children && item.children.length > 0;
};
// 初始化
const init = () => {
  realData.value = circleChildren(proxy.treeData);
};
// 调用
init();

// 点击展开
const expand = (item) => {
  console.log("item", item);
  if (hasChildren(item)) {
    item.select = !item.select;
  }
};
// 选择选项
const selectKey = (item) => {
  activeKey.value = item.key;
};
</script>

<style lang="less" scoped>
.tree-circle {
  width: 100%;
  height: 100%;
  .item {
    width: 100%;
    min-height: 64px;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 4px;
    padding: 16px;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid #0061ff;
      .tree-item-main {
        .content {
          .title {
            color: #0061ff;
          }
        }
        .group {
          color: #0061ff;
        }
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    .tree-item-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      .content {
        display: flex;
        align-items: center;
        .arrow {
          width: 16px;
          height: 16px;
        }
        svg {
          font-size: 16px;
        }
        .group {
          font-size: 32px;
          margin-left: 10px;
        }
        .title {
          margin-left: 10px;
        }
      }
      .edit {
        width: 16px;
        height: 16px;
        line-height: 1;
        font-size: 16px;
      }
    }
	.expand-area {
		width: 100%;
		height: 400px;
		background-color: #fff;
	}
  }
  .active-item {
    border: 1px solid #0061ff;
    .tree-item-main {
      .content {
        .title {
          color: #0061ff;
        }
      }
      .group {
        color: #0061ff;
      }
    }
  }
}
.pointer {
  cursor: pointer;
}
</style>
