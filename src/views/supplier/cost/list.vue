<template>
    <div class="item-bom">
        <div class="list-container item-container">
            <div class="title-container" ref="titleRefs">
                <div class="title-area">{{ $t('supply-chain.vehicle_cost') }}</div>
            </div>
            <div class="item-tree" :style="{ height: 'calc(100% - ' + titleHeight + ')' }">
                <!-- 左边 -->
                <div
                    class="item-tree-left"
                    :class="{
                        'collapse-true': isCollapse,
                        'collapse-false': !isCollapse,
                    }"
                >
                    <div class="title-area">
                        {{ $t('item-bom.bom_list') }}
                        <div class="icon-collapse" @click="isCollapse = !isCollapse">
                            <MySvgIcon icon-class="collapse" v-if="!isCollapse" />
                            <MySvgIcon icon-class="undold" v-else />
                        </div>
                    </div>
                    <div class="tree-content">
                        <FittingsTree
                            v-model:activeObj="activeObj"
                            :cancelIds="cancelId"
                            :isCollapse="isCollapse"
                            ref="treeRef"
                        />
                    </div>
                </div>
                <!-- 右边 -->
                <div class="item-tree-right">
                    <div class="search-content" :style="{ 'min-width': minWidthCount + 'px' }">
                        <SearchAll
                            ref="searAllRef"
                            :isShowMore="false"
                            :options="searchOptions"
                            @search="handleSearch"
                            @reset="handleReset"
                        >
                        </SearchAll>
                    </div>
                    <component
                        :style="{ 'min-width': minWidthCount + 'px' }"
                        ref="allComRef"
                        :is="componentName"
                        :activeObj="activeObj"
                        :searchParams="searchParams"
                        @handleRefresh="TreeRefresh"
                    >
                    </component>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// import { useRouter,onBeforeRouteUpdate } from 'vue-router';
import Core from '@/core';
import { ref, shallowRef, onMounted, computed, watch, provide, onBeforeUnmount, getCurrentInstance } from 'vue';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import FittingsTwo from './components/item-bom/FittingsTwo.vue';
import FittingsTree from './components/item-bom/FittingsTree.vue';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
// const router = useRouter()
const minWidthCount = 890;
const treeRef = ref(null);
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
// 刷新组件key
// const dataKeyPop = ref(new Date())
// 注释-侧边栏
const isCollapse = ref(false); //菜单Dom-是否收起
const activeObj = ref({});
const searchOptions = ref([
    {
        id: 1,
        type: 'time-range',
        value: [],
        searchParmas: ['price_effective_begin_time', 'price_effective_end_time'],
        key: 'supply-chain.effective_date',
        defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_E,
    },
    {
        id: 2,
        type: 'input',
        key: 'supply-chain.component_code',
        value: undefined,
        searchParmas: 'code_list',
        placeholder: 'item-bom.commodity_code_tips',
    },
]); // 搜索options
const searchParams = ref({}); // 搜索参数

watch(
    activeObj,
    newVal => {
        searAllRef.value.handleSearchReset();
    },
    {
        deep: true,
    },
);
const componentProps = ref();
const componentName = computed(() => {
    componentProps.value = activeObj.value;
    if (activeObj.value.level === 2) {
        return FittingsTwo;
    } else {
        return FittingsTwo;
    }
});

const handleSearch = data => {
    searchParams.value = data;
    searchParams.value.code_list = data?.code_list && data?.code_list.length > 0 ? data.code_list.split(',') : [];
};
const handleReset = () => {
    searchParams.value = {};
};
const allComRef = ref(null); // component refs
const searAllRef = ref(null); // searAll refs
// 注释-侧边栏
const screenWidth = ref(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);

const TreeRefresh = val => {
    if (val) {
        treeRef.value.getCurrentVersion(val.shop_id, val.version_id);
    }
};

onMounted(() => {
    titleHeight.value = titleRefs.value.offsetHeight + 'px';
    /* 计算适配宽度 */
    handleResize();
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});

/* fetch start */
/* fetch end */

/* methods start*/
/* methods end*/
const handleResize = () => {
    screenWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (window.innerWidth < 1550) {
        isCollapse.value = true;
    } else {
        isCollapse.value = false;
    }
};
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
                // min-width: 454px;
                // width: 204px;
                width: 454px;
                height: 100%;
                background-color: #f8fafc;
                font-size: 48px;
                padding: 24px 20px 16px 20px;
                display: flex;
                flex-direction: column;
                transition: width 0.5s;
                .title-area {
                    color: #1d2129;
                    font-size: 16px;
                    line-height: 22px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .icon-collapse {
                        cursor: pointer;
                    }
                }
                .tree-content {
                    margin-top: 16px;
                    flex: 1;
                    height: calc(100% - 38px);
                }
            }

            .collapse-true {
                width: 204px;
            }

            .collapse-false {
                width: 454px;
            }
            @media (max-width: 1440px) {
                .item-tree-left {
                    // min-width: 354px;
                    width: 354px;
                    // width: 204px;
                }
                // 注释-侧边栏
                .collapse-true {
                    width: 204px;
                }

                .collapse-false {
                    width: 354px;
                }
            }
            @media (max-width: 1550px) {
                .item-tree-left {
                    width: 354px;
                    // width: 204px;
                }

                // 注释-侧边栏
                .collapse-true {
                    width: 204px;
                }

                .collapse-false {
                    width: 354px;
                }
            }
            .item-tree-right {
                flex: 1;
                overflow-y: auto;
                padding: 0 17px;
                .search-content {
                    margin-bottom: 20px;
                    .search-all {
                        .btn-area-box {
                            .more-btn {
                                display: flex;
                                .download-template,
                                .bulk-import {
                                    margin-right: 8px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
