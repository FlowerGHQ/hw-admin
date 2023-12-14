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
            <div class="tree-circle">
                <div
                    v-for="item in realData"
                    :key="item.itemId"
                    class="item pointer"
                    @click.stop="selectKey(item)"
                    :class="{ 'active-item': generateId(item) == activeKey }">
                    <div class="tree-item-main">
                        <div class="content">
                            <MySvgIcon
                                @click.stop="expand(item)"
                                :icon-class="
                                    item.expand ? 'down-arrow' : 'up-arrow'
                                "
                                class="arrow" />
                            <img
                                class="group"
                                src="@/assets/images/bom/group-active.png"
                                alt=""
                                v-if="generateId(item) === activeKey" />
                            <img
                                class="group"
                                src="@/assets/images/bom/group-common.png"
                                alt=""
                                v-else />
                            <div class="title">
                                        <span v-if="!item.edit">{{
                                            item.name
                                        }}</span>
                                        <a-input
                                            v-else
                                            v-model:value="item.name"
                                            :placeholder="
                                                $t('item-bom.title_the_ph')
                                            "
                                            @pressEnter="item.edit = false" />
                                   
                            </div>
                        </div>
                        <div class="edit" @click.stop="handleEdit(item)">
                            <MySvgIcon icon-class="edit" />
                        </div>
                    </div>
                    <div class="expand-area" v-if="item.expand">
                        <div
                            class="tree-item-main-child-one"
                            v-for="(item1, index) in item.children"
                            :key="item1.id"
                            :class="{ 'active-item-one': generateId(item1) === activeKey }"
                            @click.stop="selectKey(item1, 2)">
                            <div class="item-child-one">
                                <div class="left-area">
                                    <div class="top-area">
                                        <MySvgIcon
                                            @click.stop="expand(item1)"
                                            :icon-class="
                                                item1.expand
                                                    ? 'down-arrow'
                                                    : 'up-arrow'
                                            "
                                            class="arrow" />
                                        <MySvgIcon icon-class="new-dom" />
                                        <span
                                            :class="{
                                                'common-title': index !== 0,
                                                'green-title': index === 0,
                                            }"
                                            >{{ item1.name }}</span
                                        >
                                        <span
                                            class="new-version"
                                            v-if="index === 0">
                                            设变
                                        </span>
                                    </div>
                                    <div class="bottom-area">
                                        <span class="time">2023.12.21</span>
                                    </div>
                                </div>
                                <div
                                    class="add"
                                    @click.stop="addCategory(item1)">
                                    <MySvgIcon icon-class="add" />
                                    <span>{{
                                        $t("item-bom.add_category")
                                    }}</span>
                                </div>
                            </div>
                            <div class="expend-area-two" v-if="item1.expand">
                                <div
                                    class="tree-item-main-child-two"
                                    v-for="(item2, index) in item1.children"
                                    :key="item2.key"
                                    :class="{
                                        'active-item-two':
                                        generateId(item2) == activeKey,
                                    }"
                                    @click.stop="selectKey(item2)">
                                    <span class="title">
                                        <div class="title-area">
                                            <span v-if="!item2.edit">{{
                                                item2.name
                                            }}</span>
                                            <a-input
                                                v-else
                                                v-model:value="item2.name"
                                                :placeholder="
                                                    $t('item-bom.title_the_ph')
                                                "
                                                @pressEnter="
                                                    item2.edit = false
                                                " />
                                        </div>
                                    </span>
                                    <div class="right-icon">
                                        <MySvgIcon
                                            icon-class="edit"
                                            @click.stop="handleEdit(item2)" />
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
                                    :placeholder="
                                        $t('item-bom.add_category_ph')
                                    "
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
        </div>
    </div>
</template>

<script setup>
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import Core from "@/core";
const $t = useI18n().t;
const $emit = defineEmits(['update:activeObj']);

// -----------------定义数据-------------------------------

// 搜索关键字
const keyWord = ref("");
const realData = ref([]);
// 点击的key
const activeKey = ref("");

// -----------------定义方法--------------------------
// 搜索
const onSearch = (value) => {
    console.log(value);
    getGoodsList();
};
// 生成id 组成为唯一标识+level
const generateId = (item) => {
    switch (item.level) {
        case 1:
            return String(item.itemId) + String(item.level);
        case 2:
            return String(item.id) + String(item.level);
        case 3:
            return String(item.id) + String(item.level);
        default:
            break;
    }
};
// 选择key
const selectKey = (item) => {
    switch (item.level) {
        case 1:
            activeKey.value = String(item.itemId) + String(item.level);
            $emit('update:activeObj',{
                level: item.level,
                id: item.itemId,
                name: item.name,
            })
            break;
        case 2:
            activeKey.value = String(item.id) + String(item.level);
            $emit('update:activeObj',{
                level: item.level,
                id: item.id,
                name: item.name,
            })
            break;
        case 3:
            activeKey.value = String(item.id) + String(item.level);
            $emit('update:activeObj',{
                level: item.level,
                id: item.id,
                name: item.name,
            })
            break;
        default:
            break;
    }
};
const expand = (item) => {
    item.expand = !item.expand;
    switch (item.level) {
        case 1:
            if (item.expand) {
                getVersion(item);
            }
            break;
        case 2:
            if (item.expand) {
                getCategory(item);
            }
            break;
        default:
            break;
    }
};
// 编辑
const handleEdit = (item) => {
    item.edit = true;
};

// 初始化请求商品列表数据
const getGoodsList = () => {
    Core.Api.ITEM_BOM.listName({
        search_key: keyWord.value,
    })
        .then((res) => {
            console.log(res);
            realData.value = res.list;
            realData.value.forEach((item) => {
                item.select = false;
                item.expand = false;
                item.children = [];
                item.edit = false;
                item.add = false;
                item.level = 1;
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
// 请求版本数据
const getVersion = (item) => {
    Core.Api.ITEM_BOM.versionList({
        sync_id: item.syncId,
    })
        .then((res) => {
            console.log(res);
            item.children = res.list;
            item.children.forEach((item1) => {
                item1.select = false;
                item1.expand = false;
                item1.children = [];
                item1.edit = false;
                item1.add = false;
                item1.level = 2;
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
// 请求版本下的分类
const getCategory = (item) => {
    Core.Api.ITEM_BOM.listCategory({
        bomId: item.id,
    })
        .then((res) => {
            item.children = res.list;
            item.children.forEach((item1) => {
                item1.select = false;
                item1.expand = false;
                item1.children = [];
                item1.edit = false;
                item1.add = false;
                item1.level = 3;
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

// 生命周期
onMounted(() => {
    // 请求商品列表
    getGoodsList();
});
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

        .tree-circle {
            width: 100%;
            height: 100%;
            .item {
                width: 100%;
                min-height: 64px;
                background-color: #fff;
                margin-bottom: 16px;
                border-radius: 4px;
                overflow: hidden;
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
                                        background-color: rgba(
                                            rgba(38, 171, 84, 0.1)
                                        );
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
    }
    .pointer {
        cursor: pointer;
    }
}
</style>
