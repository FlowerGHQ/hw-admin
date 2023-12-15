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
                <a-spin :spinning="loading1" :delay="500">
                    <div
                        v-for="item in realData"
                        :key="generateId(item)"
                        class="item pointer"
                        @click.stop="selectKey(null,item)"
                        :class="{
                            'active-item': generateId(item) == activeKey,
                        }">
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
                                    <div class="title-left">
                                        <span v-if="!item.edit">{{
                                            item.name
                                        }}</span>
                                        <a-input
                                            v-else
                                            v-model:value="item.name"
                                            :placeholder="
                                                $t('item-bom.title_the_ph')
                                            "
                                            @blur.stop="handleEditName(item)"
                                            @pressEnter.stop="
                                                handleEditName(item)
                                            " />
                                    </div>
                                    <div
                                        class="title-right"
                                        v-if="item.flag_new">
                                        {{ $t("item-bom.change_new_version") }}
                                    </div>
                                </div>
                            </div>
                            <div class="edit" @click.stop="handleEdit(item)">
                                <MySvgIcon icon-class="edit" />
                            </div>
                        </div>
                        <div class="expand-area" v-if="item.expand">
                            <a-spin :spinning="loading2" :delay="500">
                                <div
                                    class="tree-item-main-child-one"
                                    v-for="(item1, index) in item.children"
                                    :key="generateId(item1)"
                                    :class="{
                                        'active-item-one':
                                            generateId(item1) === activeKey,
                                    }"
                                    @click.stop="selectKey(item,item1)">
                                    <div class="item-child-one">
                                        <div class="left-area">
                                            <div class="top-area">
                                                <MySvgIcon
                                                    @click.stop="expand(item1)"
                                                    v-if="item1.count > 0"
                                                    :icon-class="
                                                        item1.expand
                                                            ? 'down-arrow'
                                                            : 'up-arrow'
                                                    "
                                                    class="arrow" />
                                                <MySvgIcon
                                                    :icon-class="
                                                        item1.flag_new
                                                            ? 'new-dom'
                                                            : 'old-dom'
                                                    " />
                                                <span class="common-title"
                                                    >{{ item1.name }} ({{
                                                        item1.version
                                                    }}版本)</span
                                                >
                                                <span
                                                    class="new-version"
                                                    v-if="item1.flag_new">
                                                    {{ $t("item-bom.change") }}
                                                </span>
                                            </div>
                                            <div class="bottom-area">
                                                <span class="time">
                                                    {{
                                                        Util.timeFilter(
                                                            item1.effective_time
                                                        )
                                                    }}</span
                                                >
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
                                    <div
                                        class="expend-area-two"
                                        v-if="item1.expand">
                                        <a-spin
                                            :spinning="loading3"
                                            :delay="500">
                                            <div
                                                class="tree-item-main-child-two"
                                                v-for="(
                                                    item2, index
                                                ) in item1.children"
                                                :key="generateId(item2)"
                                                :class="{
                                                    'active-item-two':
                                                        generateId(item2) ==
                                                        activeKey,
                                                }"
                                                @click.stop="selectKey(item1,item2)">
                                                <div class="title">
                                                    <div class="title-area">
                                                        <span
                                                            v-if="!item2.edit"
                                                            >{{
                                                                item2.name
                                                            }}</span
                                                        >
                                                        <a-input
                                                            v-else
                                                            v-model:value="
                                                                item2.name
                                                            "
                                                            :placeholder="
                                                                $t(
                                                                    'item-bom.title_the_ph'
                                                                )
                                                            "
                                                            @blur.stop="
                                                                handleEditName(
                                                                    item2
                                                                )
                                                            " />
                                                    </div>
                                                </div>

                                                <div class="right-icon">
                                                    <MySvgIcon
                                                        icon-class="edit"
                                                        @click.stop="
                                                            handleEdit(item2)
                                                        " />
                                                    <MySvgIcon
                                                        icon-class="delete"
                                                        @click.stop="
                                                            handleDelete(
                                                                item1,
                                                                item2
                                                            )
                                                        " />
                                                </div>
                                            </div>
                                            <a-input
                                                v-if="item1.add"
                                                v-model:value="addValue"
                                                style="width: 228px"
                                                class="add-category-select"
                                                @blur.stop="
                                                    handleAddCategory(item1)
                                                "
                                                :placeholder="
                                                    $t(
                                                        'item-bom.add_category_ph'
                                                    )
                                                " />
                                        </a-spin>
                                    </div>
                                </div>
                            </a-spin>
                        </div>
                    </div>
                </a-spin>
            </div>
        </div>
    </div>
</template>

<script setup>
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import { ref, reactive, computed, onMounted, watch, onBeforeUnmount} from "vue";
import { useI18n } from "vue-i18n";
import Core from "@/core";
const $t = useI18n().t;
const $emit = defineEmits(["update:activeObj"]);
import Util from "@/core/utils";

// -----------------定义数据-------------------------------

// 搜索关键字
let keyWord = ref("");
let realData = ref([]);
// 点击的key
let activeKey = ref("");
let loading1 = ref(false);
let loading2 = ref(false);
let loading3 = ref(false);
let addValue = ref(null);

// 接受activeObj
const props = defineProps({
    activeObj: {
        type: Object,
        default: () => {},
    },
    cancelIds: {
        type: [Number,String],
    },
});


// -----------------定义方法--------------------------
// 搜索
const onSearch = (value) => {
    getGoodsList();
};
// 生成id 组成为唯一标识+level
const generateId = (item) => {
    switch (item.level) {
        case 1:
            return String(item.item_id) + String(item.level);
        case 2:
            return String(item.id) + String(item.level);
        case 3:
            return String(item.id) + String(item.level);
        default:
            break;
    }
};
// 选择key
const selectKey = (parentItem = {},item) => {
    switch (item.level) {
        case 1:
            activeKey.value = String(item.item_id) + String(item.level);
            $emit("update:activeObj", {
                level: item.level,
                version_id:'',
                shop_id: item.item_id,
                category_id:'',
                name: item.name,
                sync_id: item.sync_id,
            });
            break;
        case 2:
            activeKey.value = String(item.id) + String(item.level);
            $emit("update:activeObj", {
                level: item.level,
                version_id: item.id,
                shop_id: parentItem.item_id,
                category_id:'',
                name: item.name,
                sync_id:''
            });
            break;
        case 3:
            activeKey.value = String(item.id) + String(item.level);
            $emit("update:activeObj", {
                level: item.level,
                version_id: parentItem.id,
                shop_id:'',
                category_id: item.id,
                name: item.name,
                sync_id:''
            });
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
            } else {
                // 所有的子集都收起来
                item.children.forEach((item1) => {
                    item1.expand = false;
                });
            }
            break;
        case 2:
            if (item.expand) {
                item.add = false;
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
// 编辑名称后的entry和blur事件
const handleEditName = (item) => {
    item.edit = false;
    switch (item.level) {
        case 1:
            editGoodsName(item);
            break;
        case 3:
            editCategoryName(item);
            break;
        default:
            break;
    }
};

// 初始化请求商品列表数据
const getGoodsList = () => {
    loading1.value = true;
    Core.Api.ITEM_BOM.listName({
        search_key: keyWord.value,
    })
        .then((res) => {
            realData.value = res.list;
            realData.value.forEach((item) => {
                item.select = false;
                item.expand = false;
                item.children = [];
                item.edit = false;
                item.add = false;
                item.level = 1;
            });
            loading1.value = false;
        })
        .catch((err) => {
            loading1.value = false;
            console.log(err);
        });
};
// 请求版本数据
const getVersion = (item) => {
    loading2.value = true;
    Core.Api.ITEM_BOM.versionList({
        sync_id: item.sync_id,
    })
        .then((res) => {
            item.children = res.list;
            item.children.forEach((item1) => {
                item1.select = false;
                item1.expand = false;
                item1.children = [];
                item1.edit = false;
                item1.add = false;
                item1.level = 2;
            });
            loading2.value = false;
        })
        .catch((err) => {
            console.log(err);
            loading2.value = false;
        });
};
// 请求版本下的分类
const getCategory = (item) => {
    loading3.value = true;
    Core.Api.ITEM_BOM.listCategory({
        bom_id: item.id,
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
            loading3.value = false;
        })
        .catch((err) => {
            loading3.value = false;
            console.log(err);
        });
};
// 修改bom名称
const editGoodsName = (item) => {
    Core.Api.ITEM_BOM.updateName({
        name: item.name,
        sync_id: item.sync_id,
    })
        .then((res) => {
            // console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
};
// 修改分类名称
const editCategoryName = (item) => {
    Core.Api.ITEM_BOM.saveCategoryName({
        ...item,
    })
        .then((res) => {
            // console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
};
// 添加分类
const addCategory = (item) => {
    item.add = true;
    item.expand = true;
    // 请求分类列表
    Core.Api.ITEM_BOM.listCategory({
        bom_id: item.id,
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
// 添加分类
const handleAddCategory = (item) => {
    if(!addValue.value) return
    Core.Api.ITEM_BOM.saveCategoryName({
        name: addValue.value,
        bom_id: item.id,
        type: 2,
    })
        .then((res) => {
            // 重新请求分类列表
            getCategory(item);
            item.add = false;
            item.expand = true;
            addValue.value = null;

            console.log(realData.value);

            setTimeout(() => {
                // 找到商品列表中的这个item
                let parentItemIndex = realData.value.findIndex(
                    (item1) => item1.sync_id === item.sync_id
                );
                let index = realData.value[parentItemIndex].children.findIndex(
                    (item1) => item1.id === item.id
                );
                // 商品列展开
                realData.value[parentItemIndex].expand = true;
                // 版本列展开
                realData.value[parentItemIndex].children[index].expand = true;  
                realData.value[parentItemIndex].children[index].count
                    ? realData.value[parentItemIndex].children[index].count++
                    : (realData.value[parentItemIndex].children[index].count = 1);
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
const handleDelete = (parentItem, item) => {
    Core.Api.ITEM_BOM.deleteCategory({
        id: item.id,
    })
        .then((res) => {
            getCategory(parentItem);
            setTimeout(() => {
                // 找出商品裂变中的item
                let rootIndex = realData.value.findIndex(
                    (item1) => item1.sync_id === parentItem.sync_id
                );
                // 找出版本列中的item
                let index = realData.value[rootIndex].children.findIndex(
                    (item1) => item1.id === parentItem.id
                );
                // 商品列展开
                realData.value[rootIndex].expand = true;
                // 版本列展开
                realData.value[rootIndex].children[index].expand = true;
                realData.value[rootIndex].children[index].count
                    ? realData.value[rootIndex].children[index].count--
                    : (realData.value[rootIndex].children[index].count = 0);
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

// 生命周期
onMounted(() => {
        // 请求商品列表
    loading1.value = true;
    Core.Api.ITEM_BOM.listName({
        search_key: keyWord.value,
    })
        .then((res) => {
            realData.value = res.list;
            realData.value.forEach((item) => {
                item.select = false;
                item.expand = false;
                item.children = [];
                item.edit = false;
                item.add = false;
                item.level = 1;
            });
            loading1.value = false;
            // 默认展开第一
            realData.value[0].expand = true;
            realData.value[0].select = true;
            activeKey.value = String(realData.value[0].item_id) + String(realData.value[0].level);
            $emit("update:activeObj", {
                level: realData.value[0].level,
                shop_id: realData.value[0].item_id,
                name: realData.value[0].name,
                sync_id: realData.value[0].sync_id,
            });
            // 请求版本列表
            getVersion(realData.value[0]);
        })
        .catch((err) => {
            loading1.value = false;
            console.log(err);
        });
});
</script>

<style lang="less" scoped>
.tree-main {
    height: 100%;
    .tree-search {
        display: block;
        height: 32px;
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
        height: calc(100% - 48px);
        overflow-y: scroll;
        display: flex;
        align-items: center;
        font-size: 16px;
        margin-top: 16px;
        &::-webkit-scrollbar {
            width: 0;
        }
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
                            display: flex;
                            align-items: center;
                            .title-left {
                                display: flex;
                                align-items: center;
                                .title-input {
                                    width: 100px;
                                    margin-left: 10px;
                                }
                            }
                            .title-right {
                                min-width: 78px;
                                height: 24px;
                                text-align: center;
                                margin-left: 10px;
                                border-radius: 4px;
                                background-color: rgba(38, 171, 84, 0.1);
                                color: #26ab54;
                                font-size: 14px;
                                padding: 0 4px;
                            }
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
                            padding-bottom: 10px;
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
                                        font-size: 14px;
                                    }
                                    .green-title {
                                        color: #26ab54;
                                    }
                                    .new-version {
                                        margin-left: 4px;
                                        min-width: 32px;
                                        padding: 0 4px;
                                        height: 20px;
                                        background-color: rgba(
                                            rgba(38, 171, 84, 0.1)
                                        );
                                        color: #26ab54;
                                        font-size: 12px;
                                        line-height: 20px; /* 100% */
                                        text-align: center;
                                        border-radius: 4px;
                                    }
                                }
                                .bottom-area {
                                    margin-top: 4px;
                                    color: #666;
                                    font-size: 12px;
                                    text-align: left;
                                    padding-left: 54px;
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
                                    font-size: 14px;
                                    font-weight: 500;
                                }
                            }
                            .add-category-select {
                                margin-left: 68px;
                                margin-top: 5px;
                                margin-bottom: 5px;
                            }
                            .active-item-two {
                                background-color: #f2f3f5;
                                .title-area {
                                    color: #0061ff;
                                }
                            }
                            :deep(.ant-select-selector) {
                                border: 1px solid #e2e2e2 !important;
                                box-shadow: none !important;
                                &:hover {
                                    border: 1px solid #e2e2e2 !important;
                                }
                            }
                        }
                    }
                    .active-item-one {
                        .item-child-one {
                            background-color: #f2f3f5;
                            .common-title {
                                color: #0061ff;
                            }
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
:deep(.ant-spin-spinning) {
    width: 100%;
    text-align: center;
}
</style>
