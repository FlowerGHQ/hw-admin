<template>
    <div class="tree-main">
        <!-- <a-input-search
            v-model:value="keyWord"
            :placeholder="$t('item-bom.search_ph')"
            @search="onSearch"
            class="tree-search"
        >
            <template #enterButton>
                <MySvgIcon icon-class="search" />
            </template>
        </a-input-search> -->
        <div class="tree-select-main" v-if="!isCollapse">
            <div class="tree-circle">
                <a-spin :spinning="loading1" :delay="500" v-if="realData.length > 0">
                    <div
                        v-for="item in realData"
                        :key="generateId(item)"
                        class="item pointer"
                        @click.stop="selectKey(null, item)"
                        :class="{
                            'active-item': generateId(item) == activeKey || item.code === shopId,
                        }"
                    >
                        <div class="tree-item-main">
                            <div class="content">
                                <MySvgIcon
                                    @click.stop="expand(item)"
                                    :icon-class="item.expand ? 'down-arrow' : 'up-arrow'"
                                    class="arrow"
                                />
                                <img
                                    class="group"
                                    src="@/assets/images/bom/group-active.png"
                                    alt=""
                                    v-if="generateId(item) === activeKey || item.code === shopId"
                                />
                                <img class="group" src="@/assets/images/bom/group-common.png" alt="" v-else />
                                <div class="title">
                                    <div class="title-left">
                                        <div class="title-left-top">
                                            <span v-if="!item.edit">{{ item.name }}</span>
                                            <a-input
                                                v-else
                                                v-model:value="item.name"
                                                id="input1"
                                                :placeholder="$t('item-bom.title_the_ph')"
                                                @blur.stop="handleEditName(item)"
                                                @pressEnter.stop="handleEditName(item)"
                                            />
                                        </div>
                                        <div class="title-left-bottom">
                                            {{ item.code }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="edit">
                                <div class="new_version" v-if="item.flag_new">
                                    {{ $t('item-bom.change_new_version') }}
                                </div>
                                <MySvgIcon icon-class="edit" @click.stop="handleEdit(item, $event)" />
                            </div>
                        </div>
                        <div class="expand-area" v-if="item.expand">
                            <a-spin :spinning="loading2" :delay="500">
                                <div
                                    class="tree-item-main-child-one"
                                    v-for="(item1, index) in item.children"
                                    :key="generateId(item1)"
                                    :class="{
                                        'active-item-one': generateId(item1) === activeKey,
                                    }"
                                    @click.stop="selectKey(item, item1)"
                                >
                                    <div class="item-child-one">
                                        <div class="left-area">
                                            <div class="top-area">
                                                <span
                                                    :class="{
                                                        'common-title': item1.count <= 0,
                                                        'common-title2': item1.count > 0,
                                                    }"
                                                    >{{ item1.version }}版本</span
                                                >
                                                <span class="new-version" v-if="item1.flag_new">
                                                    {{ $t('item-bom.change') }}
                                                </span>
                                            </div>
                                            <div
                                                :class="{
                                                    'bottom-area': item1.count > 0,
                                                    'bottom-area2': item1.count <= 0,
                                                }"
                                            >
                                                <span class="time">
                                                    {{ Util.timeFilter(item1.effective_time, 3) }}</span
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a-spin>
                        </div>
                    </div>
                </a-spin>
                <a-empty :description="$t('item-bom.description_empty')" v-else class="empty" />
            </div>
        </div>
        <div class="tree-select-main" v-else>
            <div class="tree-circle">
                <a-spin :spinning="loading1" :delay="500" v-if="realData.length > 0">
                    <div
                        v-for="item in realData"
                        :key="generateId(item)"
                        class="item pointer op-box"
                        @click.stop="selectKey(null, item)"
                        :class="{
                            'active-item': generateId(item) == activeKey || item.code === shopId,
                        }"
                    >
                        <div class="tree-item-main">
                            <div class="content align-item-start">
                                <!--  <img
                                    class="group"
                                    src="@/assets/images/bom/group-active.png"
                                    alt=""
                                    v-if="generateId(item) === activeKey" />
                                <img
                                    class="group"
                                    src="@/assets/images/bom/group-common.png"
                                    alt=""
                                    v-else /> -->
                                <div class="title margin-left-0">
                                    <div class="title-left">
                                        <div class="title-left-top">
                                            <MySvgIcon
                                                @click.stop="expand(item)"
                                                :icon-class="item.expand ? 'down-arrow' : 'up-arrow'"
                                                class="arrow"
                                            />
                                            <!-- v-if="!item.edit" -->
                                            <span class="span-iscollapse-title margin-left-3">{{ item.name }}</span>
                                            <!-- <a-input
                                                v-else
                                                v-model:value="item.name"
                                                id="input1"
                                                :placeholder="
                                                    $t('item-bom.title_the_ph')
                                                "
                                                @blur.stop="
                                                    handleEditName(item)
                                                "
                                                @pressEnter.stop="
                                                    handleEditName(item)
                                                " /> -->
                                            <div class="new-version-iscollapse" v-if="item.flag_new"></div>
                                        </div>
                                        <div class="title-left-bottom margin-left-19">
                                            {{ item.code }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="edit">
                                <div class="new_version" v-if="item.flag_new">
                                    {{ $t("item-bom.change_new_version") }}
                                </div>
                                <MySvgIcon
                                    icon-class="edit"
                                    @click.stop="handleEdit(item, $event)" />
                            </div> -->
                        </div>

                        <a-popover
                            trigger="click"
                            placement="rightTop"
                            overlayClassName="pop-fittings-tree"
                            :getPopupContainer="() => wrap"
                        >
                            <template #content>
                                <div class="expand-area" v-if="item.expand">
                                    <a-spin :spinning="loading2" :delay="500">
                                        <div
                                            class="tree-item-main-child-one pointer"
                                            v-for="(item1, index) in item.children"
                                            :key="generateId(item1)"
                                            :class="{
                                                'active-item-one': generateId(item1) === activeKey,
                                            }"
                                            @click.stop="selectKey(item, item1)"
                                        >
                                            <div class="item-child-one">
                                                <div class="left-area">
                                                    <div class="top-area">
                                                        <MySvgIcon
                                                            @click.stop="expand(item1)"
                                                            v-if="item1.count > 0"
                                                            :icon-class="item1.expand ? 'down-arrow' : 'up-arrow'"
                                                            class="arrow pointer"
                                                        />
                                                        <span
                                                            :class="{
                                                                'common-title': item1.count <= 0,
                                                                'common-title2': item1.count > 0,
                                                            }"
                                                            >{{ item1.version }}版本</span
                                                        >
                                                        <span class="new-version" v-if="item1.flag_new">
                                                            {{ $t('item-bom.change') }}
                                                        </span>
                                                    </div>
                                                    <div
                                                        :class="{
                                                            'bottom-area': item1.count > 0,
                                                            'bottom-area2': item1.count <= 0,
                                                        }"
                                                    >
                                                        <span class="time">
                                                            {{ Util.timeFilter(item1.effective_time, 3) }}</span
                                                        >
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="expend-area-two" v-if="item1.expand">
                                                <a-spin :spinning="loading3" :delay="500">
                                                    <div
                                                        class="tree-item-main-child-two"
                                                        v-for="(item2, index) in item1.children"
                                                        :key="generateId(item2)"
                                                        :class="{
                                                            'active-item-two': generateId(item2) == activeKey,
                                                        }"
                                                        @click.stop="selectKey(item1, item2)"
                                                    >
                                                        <div class="title">
                                                            <div class="title-area">
                                                                <span v-if="!item2.edit">{{ item2.name }}</span>
                                                                <a-input
                                                                    v-else
                                                                    v-model:value="item2.name"
                                                                    :placeholder="$t('item-bom.title_the_ph')"
                                                                    @blur.stop="handleEditName(item2)"
                                                                />
                                                            </div>
                                                        </div>

                                                        <!-- <div class="right-icon">
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
                                                </div> -->
                                                    </div>
                                                </a-spin>
                                            </div>
                                        </div>
                                    </a-spin>
                                </div>
                            </template>
                            <a-button @click.stop="selectKey(null, item)" class="opcity-btn">11 </a-button>
                        </a-popover>
                    </div>
                </a-spin>
                <a-empty :description="$t('item-bom.description_empty')" v-else class="empty" />
            </div>
        </div>
    </div>
    <div ref="wrap">
        <a-modal
            v-model:visible="visible"
            :title="$t('item-bom.confirm_delete')"
            :okText="$t('item-bom.confirm_delete_btn')"
            :cancelText="$t('item-bom.cancel')"
            @ok="handleOk"
            centered
            :closable="false"
            class="delete-modal"
            :getContainer="() => wrap"
            @cancel="visible = false"
        >
            <p class="content">{{ $t('item-bom.confirm_delete_content') }}</p>
        </a-modal>
    </div>
</template>

<script setup>
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import { ref, reactive, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import Core from '@/core';
const $t = useI18n().t;
const $emit = defineEmits(['update:activeObj']);
import Util from '@/core/utils';

// // -----------------定义数据-------------------------------

// 搜索关键字
let keyWord = ref('');
let realData = ref([]);
// 点击的key
let activeKey = ref('');
let loading1 = ref(false);
let loading2 = ref(false);
let loading3 = ref(false);
const addValue = ref('新增');
let visible = ref(false);
// // 删除的item及其父级item
let deleteItem = ref(null);
let deleteParentItem = ref(null);
let wrap = ref(null);
// 定时器
let timer1 = ref(null);

// 当前父级shop_id
const shopId = ref(null);

// 接受activeObj
const props = defineProps({
    activeObj: {
        type: Object,
        default: () => {},
    },
    cancelIds: {
        type: [Number, String],
    },
    isCollapse: {
        //是否收起
        type: Boolean,
        default: false,
    },
});

// -----------------定义方法--------------------------

// 搜索
const onSearch = value => {
    getGoodsList();
};
const setChildRen = (arr, level) => {
    arr.forEach(item => {
        item.children = [];
        item.select = false;
        item.expand = false;
        item.edit = false;
        item.add = false;
        item.level = level;
    });
    return arr;
};
// 生成id 组成为唯一标识+level
const generateId = item => {
    switch (item.level) {
        case 1:
            return String(item.code) + String(item.level);
        case 2:
            return String(item.version) + String(item.level);
        default:
            break;
    }
};
// 选择key
const selectKey = (parentItem = {}, item) => {
    switch (item.level) {
        case 1:
            activeKey.value = String(item.code) + String(item.level);
            // 所有的页面收起来
            realData.value.forEach(item1 => {
                item1.expand = false;
                item1.select = false;
            });
            // 选择一级
            item.select = true;
            // 二级展开
            item.expand = true;
            // 请求二级
            getVersion(item);
            // 收起状态 一级选中颜色控制
            shopId.value = item.code;
            // 展开二级
            $emit('update:activeObj', {
                level: item.level,
                shop_id: item.code,
                name: item.name,
            });
            break;
        case 2:
            activeKey.value = String(item.version) + String(item.level);
            // 所有的二级收起来
            parentItem.children.forEach(item1 => {
                item1.expand = false;
                item1.select = false;
            });
            $emit('update:activeObj', {
                level: item.level,
                version_id: item.id,
                shop_id: parentItem.code,
                version_name: item.version,
            });
            break;
        default:
            break;
    }
};
const expand = item => {
    item.expand = !item.expand;
    switch (item.level) {
        case 1:
            if (item.expand) {
                getVersion(item);
            } else {
                // 所有的子集都收起来
                item.children.forEach(item1 => {
                    item1.expand = false;
                });
            }
            break;
        case 2:
            if (item.expand) {
                item.add = false;
            }
            break;
        default:
            break;
    }
};
// 编辑
const handleEdit = (item, e) => {
    item.edit = true;
    // 当前元素的兄弟元素下》title》title-left》a-input
    timer1.value = setTimeout(() => {
        const inputDom = e.target.parentNode.parentNode.parentNode.querySelector(
            '.title-left>.title-left-top>.ant-input',
        );
        // 聚焦
        inputDom && inputDom.focus();
    }, 200);
};
// 编辑名称后的entry和blur事件
const handleEditName = item => {
    item.edit = false;
    switch (item.level) {
        case 1:
            editGoodsName(item);
            break;
        default:
            break;
    }
};

// 初始化请求商品列表数据
const getGoodsList = () => {
    loading1.value = true;
    Core.Api.Supplier.listName({
        search_key: keyWord.value,
    })
        .then(res => {
            realData.value = res.list;
            realData.value = setChildRen(realData.value, 1);
            loading1.value = false;
        })
        .catch(err => {
            loading1.value = false;
            console.log(err);
        });
};
// 请求版本数据
const getVersion = item => {
    loading2.value = true;
    Core.Api.Supplier.listVersion({
        code: item.code,
    })
        .then(res => {
            item.children = res.list;
            item.children = setChildRen(item.children, 2);
            selectKey(item, item.children[0]);
            loading2.value = false;
        })
        .catch(err => {
            console.log(err);
            loading2.value = false;
        });
};
// 修改bom名称
const editGoodsName = item => {
    Core.Api.Supplier.updateName({
        name: item.name,
        code: item.code,
    }).catch(err => {
        console.log(err);
    });
};
const handleOk = () => {
    Core.Api.Supplier.deleteCategory({
        id: deleteItem.value.id,
    })
        .then(async res => {
            await getCategory(deleteParentItem.value);
            timer3.value = setTimeout(() => {
                // 找出商品裂变中的item
                let rootIndex = realData.value.findIndex(item1 => item1.sync_id === deleteParentItem.value.sync_id);
                // 找出版本列中的item
                let index = realData.value[rootIndex].children.findIndex(
                    item1 => item1.id === deleteParentItem.value.id,
                );
                // 商品列展开
                realData.value[rootIndex].expand = true;
                // 版本列展开
                realData.value[rootIndex].children[index].expand = true;
                realData.value[rootIndex].children[index].count
                    ? realData.value[rootIndex].children[index].count--
                    : (realData.value[rootIndex].children[index].count = 0);
                // 传递参数
                $emit('update:activeObj', {
                    level: 2,
                    version_id: deleteParentItem.value.id,
                    shop_id: deleteParentItem.value.code,
                    version_name: item.version,
                });
            });
        })
        .catch(err => {
            console.log(err);
        });
    visible.value = false;
};
// 请求请求版本下的数据
const getCurrentVersion = (parentId, id) => {
    let rootChildren = realData.value.find(item => item.code === parentId).children;
    let currentVersion = rootChildren.find(item => item.id === id);
    // 请求该版本下的分类
    getCategory(currentVersion);
};
defineExpose({
    getCurrentVersion,
});

// 生命周期
onMounted(() => {
    // 请求商品列表
    loading1.value = true;
    Core.Api.Supplier.bomList({
        key: keyWord.value,
    })
        .then(res => {
            if (res.list.length === 0) return;
            realData.value = res.list;
            realData.value.forEach(item => {
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
            activeKey.value = String(realData.value[0].code) + String(realData.value[0].level);
            $emit('update:activeObj', {
                level: realData.value[0].level,
                shop_id: realData.value[0].code,
                name: realData.value[0].name,
            });
            // 请求版本列表
            getVersion(realData.value[0]);
        })
        .catch(err => {
            loading1.value = false;
            console.log(err);
        });
});
onBeforeUnmount(() => {
    clearTimeout(timer1.value);
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
                            flex-shrink: 0;
                        }
                        .group {
                            width: 32px;
                            margin-left: 10px;
                            img {
                                width: 32px;
                                height: 32px;
                            }
                        }
                        .title {
                            margin-left: 16px;
                            display: flex;
                            align-items: center;
                            .title-left {
                                display: flex;
                                align-items: flex-start;
                                flex-direction: column;
                                white-space: nowrap;
                                .title-left-top {
                                    display: flex;
                                    align-items: center;
                                    font-weight: 500;
                                    position: relative;
                                    .title-input {
                                        width: 100px;
                                        margin-left: 10px;
                                    }

                                    .span-iscollapse-title {
                                        width: 107px;
                                        font-weight: 500;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                    }
                                }
                            }
                        }
                    }
                    .edit {
                        line-height: 1;
                        font-size: 16px;
                        display: flex;
                        align-items: center;
                        .new_version {
                            min-width: 78px;
                            height: 24px;
                            line-height: 24px;
                            text-align: center;
                            border-radius: 4px;
                            background-color: rgba(38, 171, 84, 0.1);
                            color: #26ab54;
                            font-size: 14px;
                            padding: 0 4px;
                            margin-right: 10px;
                        }
                        .svg-icon {
                            font-size: 16px;
                            line-height: 16px;
                        }
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
                            padding-left: 90px;
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
                                        font-size: 14px;
                                    }
                                    .common-title2 {
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
                                        background-color: rgba(rgba(38, 171, 84, 0.1));
                                        color: #26ab54;
                                        font-size: 12px;
                                        line-height: 20px; /* 100% */
                                        text-align: center;
                                        border-radius: 4px;
                                    }
                                }
                                .bottom-area,
                                .bottom-area2 {
                                    margin-top: 4px;
                                    color: #666;
                                    font-size: 12px;
                                    text-align: left;
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
                                    margin-top: 2px;
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
                                padding-left: 68px;
                                margin-top: 5px;
                                margin-bottom: 5px;
                                width: 100%;
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
                        .top-area {
                            color: #0061ff;
                            font-weight: 500;
                        }
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

            .title-left-bottom {
                color: #666;
                font-size: 14px;
                font-weight: 400;
            }
        }
        .empty {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            :deep(.ant-empty-description) {
                color: #8090a6 !important;
                font-size: 14px;
            }
        }
    }
}
.pointer {
    cursor: pointer;
}
:deep(.ant-spin-spinning) {
    width: 100%;
    text-align: center;
}
// antdesign中Modal的样式
:deep(.delete-modal) {
    min-width: 320px !important;
    width: auto !important;
    .ant-modal-content {
        border-radius: 4px;
        .ant-modal-header {
            border: none !important;
            padding-top: 24px !important;
            padding-bottom: 0 !important;
            height: auto !important;
            padding: 24px 80px 0;
            .ant-modal-title {
                height: auto !important;
                text-align: center !important;
                color: #1d2129;
                font-size: 18px;
                font-weight: 600;
            }
        }
        .ant-modal-body {
            padding: 34px 24px 34px;
            .content {
                text-align: center;
            }
        }
        .ant-modal-footer {
            text-align: center;
            padding-top: 18px;
            padding-bottom: 18px;
            height: auto !important;
            border-color: #f2f3f5 !important ;
            .ant-btn {
                height: 32px;
                padding: 6px 16px;
                justify-content: center;
                align-items: center;
                color: #1d2129;
                border-radius: 4px;
                border: 1px solid #e5e6eb;
                &:hover {
                    border: 1px solid #e5e6eb;
                }
            }
            .ant-btn-primary {
                color: #fff;
            }
        }
    }
}
.op-box {
    position: relative;
}
.opcity-btn {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}

/* :deep(.ant-popover-arrow-content) {
    display: none;
} */

.new-version-iscollapse {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #26ab54;
    position: absolute;
    right: -8px;
}

.margin-left-3 {
    margin-left: 3px !important;
}
.margin-left-19 {
    margin-left: 19px;
}
.align-item-start {
    align-items: flex-start !important;
}

.margin-left-0 {
    margin-left: 0px !important;
}
</style>
<style lang="less" scoped>
:deep(.pop-fittings-tree) {
    .ant-popover-inner-content {
        padding: 20px 20px 10px;
        .expand-area {
            width: 100%;
            background-color: #fff;
            /* padding-bottom: 16px; */
            .tree-item-main-child-one {
                /* border: 1px solid transparent; */
                /* &:first-child { 
                             border-top: 1px solid #e2e2e2; 
                         } */
                .item-child-one {
                    /* padding: 16px; */
                    /* padding-left: 24px; */
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
                                font-size: 14px;
                            }
                            .common-title2 {
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
                                background-color: rgba(rgba(38, 171, 84, 0.1));
                                color: #26ab54;
                                font-size: 12px;
                                line-height: 20px; /* 100% */
                                text-align: center;
                                border-radius: 0px 4px 4px 4px;
                                background-color: #eaf7ee;
                            }
                        }
                        .bottom-area,
                        .bottom-area2 {
                            margin-top: 4px;
                            color: #666;
                            font-size: 12px;
                            text-align: left;
                        }
                    }
                }
                .expend-area-two {
                    .tree-item-main-child-two {
                        padding: 10px 0px;
                        line-height: 22px; /* 157.143% */
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        /* &:first-child {
                                    margin-top: 0;
                                } */
                        .right-icon {
                            font-size: 16px;
                            .svg-icon {
                                margin-left: 16px;
                            }
                        }
                        .title {
                            padding: 0px 26px;
                            display: flex;
                            align-items: center;
                            font-size: 14px;
                            font-weight: 500;
                            cursor: pointer;
                        }
                    }
                    .add-category-select {
                        padding-left: 68px;
                        margin-top: 5px;
                        margin-bottom: 5px;
                        width: 100%;
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
                    /* background-color: #f2f3f5; */
                    color: #0061ff;
                    .top-area {
                        font-weight: 500;
                    }
                    .common-title {
                        color: #0061ff;
                    }
                }
            }
        }
    }
}
</style>
