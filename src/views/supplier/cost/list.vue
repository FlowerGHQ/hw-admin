<template>
    <div class="item-bom">
        <div class="list-container item-container">
            <div class="title-container" ref="titleRefs">
                <div class="title-area">
                    <span>{{ $t('supply-chain.vehicle_cost') }}</span>
                    <a-button @click="handleExport">{{ $t('common.export') }}</a-button>
                </div>
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

        <!-- 导出 弹窗 -->
        <a-modal
            v-model:visible="exportVisible"
            :title="$t('common.export')"
            :width="540"
            centered
            class="import-modal"
        >
            <div class="modal-content">
                <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-form-item :label="$t('supply-chain.model_selection')" name="region">
                        <a-select
                            v-model:value="formState.region"
                            show-search
                            :placeholder="$t('supply-chain.please_enter')"
                            :options="modelOptions"
                            :field-names="{ label: 'name', value: 'code' }"
                            :default-active-first-option="false"
                            :filter-option="false"
                            @search="handleSearchModel"
                            @select="handelSelectModel"
                        ></a-select>
                    </a-form-item>
                    <a-form-item :label="$t('supply-chain.version_selection')" name="version">
                        <a-select
                            v-model:value="formState.version"
                            mode="multiple"
                            :placeholder="`${$t('supply-chain.please_select')} ${$t('item-bom.version')}`"
                            :options="versionOptions"
                            :field-names="{ label: 'name', value: 'id' }"
                            :disabled="!formState.region"
                        ></a-select>
                    </a-form-item>
                </a-form>
            </div>
            <template #footer>
                <div class="btns">
                    <a-button @click="handleExportClose">{{ $t('def.cancel') }}</a-button>
                    <a-button type="primary" @click="exportFetch">{{ $t('def.sure') }}</a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
// import { useRouter,onBeforeRouteUpdate } from 'vue-router';
import Core from '@/core';
import {
    ref,
    reactive,
    shallowRef,
    onMounted,
    computed,
    watch,
    provide,
    onBeforeUnmount,
    getCurrentInstance,
} from 'vue';
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
const exportVisible = ref(false);
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

const allComRef = ref(null); // component refs
const searAllRef = ref(null); // searAll refs
// 注释-侧边栏
const screenWidth = ref(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
const componentProps = ref();
const bomIdList = ref([]);
const formRef = ref();
const formState = reactive({
    region: undefined,
    version: undefined,
});
const labelCol = { span: 6 };
const wrapperCol = { span: 14 };
const realData = ref([]);
const modelOptions = ref([]);
const versionOptions = ref([]);
const bomItemExport = Core.Api.Export.bomItemExport;

const componentName = computed(() => {
    componentProps.value = activeObj.value;
    if (activeObj.value.level === 2) {
        return FittingsTwo;
    } else {
        return FittingsTwo;
    }
});
const rules = computed(() => {
    return {
        region: [
            {
                required: true,
                message: `${proxy.$t('supply-chain.please_select')} ${proxy.$t('common.vehicle_model')}`,
                trigger: 'change',
            },
        ],
        version: [
            {
                required: true,
                message: `${proxy.$t('supply-chain.please_select')} ${proxy.$t('item-bom.version')}`,
                trigger: 'change',
            },
        ],
    };
});
watch(
    activeObj,
    newVal => {
        searAllRef.value.handleSearchReset();
    },
    {
        deep: true,
    },
);

onMounted(() => {
    titleHeight.value = titleRefs.value.offsetHeight + 'px';
    /* 计算适配宽度 */
    handleResize();
    window.addEventListener('resize', handleResize);
    getBomList();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});

/* fetch start */
// 获取车型列表
const getBomList = () => {
    Core.Api.Supplier.bomList({ key: '' }).then(res => {
        modelOptions.value = realData.value = res.list;
    });
};
// 获取版本列表
const getVersionList = code => {
    Core.Api.Supplier.listVersion({ code }).then(res => {
        versionOptions.value = res.list;
    });
};
const exportFetch = async () => {
    try {
        const values = await formRef.value.validateFields();
        const params = {
            bom_id_list: values.version.join(','),
        };
        const exportUrl = bomItemExport({ ...params });
        window.open(exportUrl, '_self');
        handleExportClose();
    } catch (errorInfo) {
        console.log('Failed:', errorInfo);
    }
};
/* fetch end */

/* methods start*/
const handleSearchModel = val => {
    modelOptions.value = realData.value.filter(i => {
        return !val || i.name.includes(val);
    });
};
const handelSelectModel = val => {
    getVersionList(val);
};
const handleSearch = data => {
    searchParams.value = data;
    searchParams.value.code_list = data?.code_list && data?.code_list.length > 0 ? data.code_list.split(',') : [];
};
const handleReset = () => {
    searchParams.value = {};
};
const TreeRefresh = val => {
    treeRef.value.getCurrentVersion();
};
const handleExport = () => {
    exportVisible.value = true;
};
const handleExportClose = () => {
    exportVisible.value = false;
};
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
            .title-area {
                width: 100%;
                .flex(space-between, center, row);
            }
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
                padding-left: 17px;
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
