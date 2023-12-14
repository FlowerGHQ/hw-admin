<template>
  <div class="tree-circle">
    <div
      v-for="item in realData"
      class="item pointer"
      :class="{ 'active-item': item.key == activeKey }"
      @click.stop="selectKey(item, 1)">
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
          <img
            class="group"
            src="@/assets/images/bom/group-active.png"
            alt=""
            v-if="item.key == activeKey" />
          <img
            class="group"
            src="@/assets/images/bom/group-common.png"
            alt=""
            v-else />
          <div class="title">
            <span v-if="!item.edit">{{ item.title }}</span>
            <a-input
              v-else
              v-model:value="item.title"
              :placeholder="$t('item-bom.title_the_ph')"
              @pressEnter="item.edit = false" />
          </div>
        </div>
        <div class="edit" @click.stop="handleEdit(item)">
          <MySvgIcon icon-class="edit" />
        </div>
      </div>
      <div class="expand-area" v-if="item.select">
        <div
          class="tree-item-main-child-one"
          v-for="(item1, index) in item.children"
          :key="item1.key"
          :class="{ 'active-item-one': item1.key == activeKey }"
          @click.stop="selectKey(item1, 2)">
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
                  "
                  v-if="hasChildren(item1)" />
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
            <div class="add" @click.stop="addCategory(item1)">
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
              @click.stop="selectKey(item2, 3)">
              <span class="title">
                <div class="title-area">
                  <span v-if="!item2.edit">{{ item2.title }}</span>
                  <a-input
                    v-else
                    v-model:value="item2.title"
                    :placeholder="$t('item-bom.title_the_ph')"
                    @pressEnter="item2.edit = false" />
                </div>
                <div class="number">&nbsp;&nbsp;&nbsp;({{ 0 }})</div>
              </span>
              <div class="right-icon">
                <MySvgIcon icon-class="edit" @click.stop="handleEdit(item2)" />
                <MySvgIcon
                  icon-class="delete"
                  @click.stop="handleDelete(item2)" />
              </div>
            </div>
            <a-select
              v-if="item1.add"
              class="add-category-select"
              v-model:value="addValue"
              show-search
              :placeholder="$t('item-bom.add_category_ph')"
              style="width: 200px"
              :options="options"
              :filter-option="filterOption"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="handleChange"></a-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed,onMounted } from "vue";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import Util from "@/core/utils";
import { useI18n } from "vue-i18n";
import Core from "@/core";
const $t = useI18n().t
const $emit = defineEmits(["activeLevel", "activeKey"]);

// ---------------初始化数据--------------------------
const treeData = ref([]);
const realData = ref([]);
const activeKey = ref("");
// 点击的层级
const activeLevel = ref("");


// -----------------方法------------------------
// 递归子节点
const circleChildren = (arr) => {
  return arr.map((item) => {
    return {
      title: item.title,
      key: item.key,
      select: false,
      children: item.children ? circleChildren(item.children) : [],
      add: false,
      edit: false,
    };
  });
};
// 判断是否有子节点
const hasChildren = (item) => {
  return item.children && item.children.length > 0;
};
// 初始化
const init = () => {
  realData.value = circleChildren(treeData.value);
};
// 调用
init();

// 点击展开
const expand = (item) => {
  if (hasChildren(item)) {
    item.select = !item.select;
    if (!item.select) {
      // 隐藏
      item.add = false;
    }
  }
};
// 选择选项
const selectKey = (item, level) => {
  activeKey.value = item.key;
  activeLevel.value = level;

  $emit("activeLevel", level);
  $emit("activeKey", item.key);
};
//新增分类的option选项
const options = ref([
  { value: "jack", label: "Jack" },
  { value: "lucy", label: "Lucy" },
  { value: "tom", label: "Tom" },
]);
const addValue = ref(null);
// 前端筛选
const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
// 创建addShow
const addShow = ref(false);
// 添加分类
const addCategory = (item) => {
  activeKey.value = item.key;
  // 展开
  item.select = true;
  item.add = true;
  // 显示
  addShow.value = true;
};

// 编辑逻辑
const handleEdit = (item) => {
  item.edit = true;
};
// 删除逻辑
const handleDelete = (item) => {
  Util.confirm({
    title: $t("pop_up.sure_delete"),
    okText: $t("def.sure"),
    okType: "danger",
    cancelText: $t("def.cancel"),
    onOk() {
      console.log("OK");
    },
  });
};
const getVersionList = ()=>{
  Core.Api.ITEM_BOM.versionList({
    syncId:'TLA3-Y2-0003'
  }).then((res) => {
    treeData.value = res.list 
  }).catch(err=>{
    console.log(err)
  })
}
// -----------------生命周期------------------------
onMounted(()=>{
  getVersionList()
})

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
          width: 32px;
          height: 32px;
          margin-left: 10px;
          img {
            width: 32px;
            height: 32px;
          }
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
      padding-bottom: 16px;
      .tree-item-main-child-one {
        border: 1px solid transparent;
        &:first-child {
          border-top: 1px solid #e2e2e2;
        }
        .item-child-one {
          padding: 16px;
          padding-left: 24px;
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
          .tree-item-main-child-two {
            margin-top: 10px;
            padding: 10px 16px;
            line-height: 22px; /* 157.143% */
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid transparent;
            &:first-child {
              margin-top: 0;
            }
            .right-icon {
              font-size: 16px;
              .svg-icon {
                margin-left: 16px;
              }
            }
            .title {
              padding-left: 58px;
              display: flex;
              align-items: center;
            }
          }
          .active-item-two {
            background-color: #f2f3f5;
          }
        }
        .add-category-select {
          margin-left: 68px;
          margin-top: 5px;
          margin-bottom: 5px;
        }
      }
      .active-item-one {
        .item-child-one {
          background-color: #f2f3f5;
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
    }
  }
}
.pointer {
  cursor: pointer;
}
</style>
