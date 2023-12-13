<template>
  <div class="tree-circle">
    <div
      v-for="item in realData"
      class="item pointer"
      :class="{ 'active-item': item.key == activeKey }"
      @click.stop="selectKey(item)">
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
            @click.stop="expand(item)"
            class="arrow" />
          <MySvgIcon icon-class="group-select" class="group" />
          <div class="title">{{ item.title }}</div>
        </div>
        <div class="edit">
          <MySvgIcon icon-class="edit" />
        </div>
      </div>
      <div class="expand-area" v-if="item.select">
        <div
          class="tree-item-main-child-one"
          v-for="(item1, index) in item.children"
          :key="item1.key"
          :class="{ 'active-item-one': item1.key == activeKey }"
          @click.stop="selectKey(item1)">
          <div class="item-child-one">
            <div class="left-area">
              <div class="top-area">
                <MySvgIcon
                  :icon-class="
                    hasChildren(item1)
                      ? !item1.select
                        ? 'up-arrow'
                        : 'down-arrow'
                      : ''
                  "
                  @click.stop="expand(item1)"
                  class="arrow" />
                <MySvgIcon
                  :icon-class="
                    hasChildren(item1)
                      ? index === 0
                        ? 'new-dom '
                        : 'old-dom'
                      : ''
                  " />
                <span
                  :class="{
                    'common-title': index !== 0,
                    'green-title': index === 0,
                  }"
                  >{{ item1.title }}</span
                >
                <span class="new-version" v-if="index === 0"> 设变 </span>
              </div>
              <div class="bottom-area">
                <span class="time">2023.12.21</span>
              </div>
            </div>
            <div class="add">
              <MySvgIcon icon-class="add" />
              <span>{{ $t("item-bom.add_category") }}</span>
            </div>
          </div>
          <div class="expend-area-two" v-if="item1.select">
            <div
              class="tree-item-main-child-two"
              v-for="(item2, index) in item1.children"
              :key="item2.key"
              :class="{ 'active-item-two': item2.key == activeKey }"
              @click.stop="selectKey(item2)">
              <span class="title"> {{ item2.title }}&nbsp;&nbsp;&nbsp;({{ 0 }}) </span>
              <div class="right-icon">
                <MySvgIcon icon-class="edit" />
                <MySvgIcon icon-class="delete" />
              </div>
            </div>
          </div>
        </div>
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
  console.log("item", item.key);
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
    border: 1px solid transparent;
    &:last-child {
      margin-bottom: 0;
    }
    .tree-item-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      padding: 16px;
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
      background-color: #fff;
      .tree-item-main-child-one {
        border: 1px solid transparent;
        &:first-child {
          margin-top: 16px;
          border-top: 1px solid #e2e2e2;
        }
        .item-child-one {
          padding: 16px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .left-area {
            .top-area {
              display: flex;
              align-items: center;
              .svg-icon {
                font-size: 24px;
              }
              .arrow {
                font-size: 16px;
                margin-right: 4px;
              }
              .green-title,
              .common-title {
                margin-left: 10px;
              }
              .green-title {
                color: #26ab54;
              }
              .new-version {
                margin-left: 4px;
                width: 32px;
                height: 20px;
                background-color: rgba(rgba(38, 171, 84, 0.1));
                color: #26ab54;
                font-size: 12px;
                font-weight: 400;
                line-height: 20px; /* 100% */
                text-align: center;
              }
            }
            .bottom-area {
              margin-top: 4px;
              color: #666;
              font-size: 12px;
              text-align: right;
            }
          }
          .add {
            font-size: 14px;
            color: #0061ff;
            display: flex;
            align-items: center;
            .svg-icon {
              font-size: 16px;
              margin-right: 4px;
            }
          }
        }
        .expend-area-two {
          .tree-item-main-child-two{
            margin-top: 10px;
            padding: 10px 16px;
            line-height: 22px; /* 157.143% */
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid transparent;
            &:first-child{
              margin-top: 0;
            }
            .right-icon{
              font-size: 16px;
              .svg-icon{
                margin-left: 16px;
              }

            }
            .title{
              padding-left: 58px;
            }
          }
          .active-item-two{
            background-color: #F2F3F5;
          }
        }
      }
      .active-item-one {
        .item-child-one{
          background-color: #F2F3F5;
        }
      }
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
