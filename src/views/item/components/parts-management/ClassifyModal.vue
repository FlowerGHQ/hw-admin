<template>
    <a-modal
        destroyOnClose
        v-model:visible="visibility"
        :width="860"
        title="配件分组"
        @ok="handleOk"
        @cancel="handleCancle"
    >
        <!-- 搜索固定数据 :closable="false" -->
        <div class="search-container-new top-box">
            <div class="item-box">
                <div class="key-box">
                    {{ $t('item-bom.obj_currently_grouped') }}
                </div>

                <div class="value-box">
                    <a-select v-model:value="categoryId" placeholder="请选择" @change="changeSelect">
                        <a-select-option v-for="(val, key) in classList" :key="key" :value="val.id">{{
                            val.name
                        }}</a-select-option>
                    </a-select>
                </div>
            </div>
        </div>
        <div class="search">
            <SearchAll :isShowMore="false" :disabled="level === 2" @search="handleSearch" @reset="handleSearchReset">
                <template v-slot:extend>
                    <a-col v-if="options.type === 'input'" :xs="24" :sm="15" :xl="15" :xxl="15" class="search-box">
                        <div class="item-box">
                            <div class="key-box">
                                {{ $t(options.key) }}
                            </div>
                            <div class="value-box">
                                <a-input
                                    :disabled="level === 2"
                                    :placeholder="$t(`${options.placeholder || 'def.input'}`)"
                                    v-model:value="codeStr"
                                    @keydown.enter="handleSearch"
                                />
                            </div>
                        </div>
                    </a-col>
                </template>
            </SearchAll>
        </div>
        <!-- 占位盒子 -->
        <div class="fixed"></div>
        <div style="height: 140px"></div>
        <!-- 表格组件 -->
        <TableSelectV3
            ref="childRef"
            :columns="tableColumns"
            :data-source="tableData"
            :loading="loading"
            :check-mode="true"
            :default-checked="defaultChecked"
            @submit="getSelectIdList"
        ></TableSelectV3>
        <template #footer>
            <div class="modal-footer">
                <div class="paging-area">
                    <a-pagination
                        v-model:current="current"
                        v-model:pageSize="pageSize"
                        show-size-changer
                        :total="total"
                        @change="pageChange"
                        @showSizeChange="onShowSizeChange"
                    />
                    <div class="tip">
                        {{ $t('in.selected') + ` ${selectIdList.length} ` + $t('in.total') }}
                    </div>
                </div>
                <div class="btn-area">
                    <a-button @click="handleCancle">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleOk" type="primary">{{ $t('def.sure') }}</a-button>
                </div>
            </div>
        </template>
    </a-modal>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, watch, onUnmounted, nextTick } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import TableSelectV3 from '@/components/table/TableSelectV3.vue';
const initialObject = {
    // 商品编码
    codeList: [],
};
const props = defineProps({
    activeObj: {
        type: Object,
        default: () => {},
    },
    visibility: {
        type: Boolean,
        default: false,
    },
    code: {
        //二级页面点击单条进行分类
        type: String,
        default: '',
    },
});
// 当前分组对象
// const classValue =  ref();
const searchForm = ref({
    // 商品编码
    codeList: [],
});
const bomId = ref(''); // 版本id、bomId
const categoryId = ref(undefined); // 分类id
const level = ref(0);
// 默认勾选
const defaultChecked = ref([]);

// 分类列表
const classList = ref([]);
const childRef = ref(null); //子组件ref
const emits = defineEmits(['update:visibility', 'refresh']);
// 搜索列表组件
const options = ref({
    type: 'input',
    value: '',
    searchParmas: 'code',
    key: 'item-bom.commodity_code',
    placeholder: 'item-bom.filter_multiple_codes',
});
// 商品编码-字符串
const codeStr = ref();
const time = ref(null);
// 所选id列表
const selectIdList = ref([]);

// 监听弹窗关闭-更改父组件prop弹窗显隐值
watch(
    () => props.visibility,
    (newValue, oldValue) => {
        emits('update:visibility', newValue);
        if (newValue && level.value === 3) handleSearch();
        if (!newValue) {
            codeStr.value = '';
            time.value = null;
            if (level.value === 2) categoryId.value = undefined;
            if (level.value === 3) categoryId.value = props?.activeObj?.category_id;
            return;
        }
        selectIdList.value = [];
    },
);
watch(
    () => categoryId.value,
    (newValue, oldValue) => {
        if (level.value === 2) return;
        if (level.value === 3) handleSearch();
    },
);

watch(
    () => props.activeObj,
    (newValue, oldValue) => {
        categoryId.value = !newValue?.category_id ? undefined : newValue?.category_id;
        bomId.value = newValue?.version_id;
        level.value = newValue?.level;
        // 分类列表
        getListCategory();
    },
    { deep: true },
);
// 监听弹窗level2时code监听变化接收变换
watch(
    () => props.code,
    (newValue, oldValue) => {
        codeStr.value = newValue;
        /* time.value = setTimeout(()=>{
            nextTick(()=>{ */
        handleSearch();
        /*    })
        },200) */
    },
);
const tableData = ref([]);

const pageSize = ref(10);
const current = ref(1);
const total = ref(0);
// 页size改变
const onShowSizeChange = (current, pageSize) => {
    pageChange();
};
// 页码改变
const pageChange = () => {
    getTableDataFetch();
};
const { proxy } = getCurrentInstance();
const loading = ref(false);
const tableColumns = computed(() => {
    const result = [
        {
            // 商品名称
            title: proxy.$t('item-bom.product_name'),
            dataIndex: 'sync_name',
            key: 'sync_name',
        },
        {
            // 商品编码
            title: proxy.$t('item-bom.commodity_code'),
            dataIndex: 'sync_id',
            key: 'sync_id',
        },
        {
            // 分类
            title: proxy.$t('item-bom.category'),
            dataIndex: 'item_category_name',
            key: 'item_category_name',
        },
        {
            // 用量
            title: proxy.$t('item-bom.dosage'),
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            // 销售区域
            title: proxy.$t('item-bom.sales_area'),
            dataIndex: 'sales_area_list',
            key: 'sales_area_list',
        },
        {
            // 创建时间
            title: proxy.$t('item-bom.create_time'),
            dataIndex: 'effective_time',
            key: 'sync_time',
        },
        /* {
            // 备注
            title: proxy.$t('item-bom.remark'), 
            dataIndex: "remark",
            key: "remark",
        }, */
    ];
    return result;
});

onMounted(() => {
    // getTableDataFetch()
});
const changeSelect = async () => {
    if (level.value === 2) return;
    if (level.value === 3) {
        selectIdList.value = [];
        await childRef.value.showDialog();
        handleSearch();
    }
};
// 重置按钮
const handleSearchReset = () => {
    // 重置搜索
    codeStr.value = '';
    Object.assign(searchForm.value, initialObject);
    handleSearch();
};
const handleSearch = () => {
    current.value = 1;
    //更换数组形式传参,字符串逗号分隔输入--编码
    let arr = codeStr?.value?.trim().split(',');
    arr = arr?.map(item => item?.trim());
    searchForm.value.codeList = arr?.filter(item => item !== '');
    getTableDataFetch();
};
const handleCancle = () => {
    emits('update:visibility', false);
};
const handleOk = () => {
    if (!categoryId.value) {
        proxy.$message.warning('请选择分组对象');
        return;
    } else if (selectIdList.value.length === 0) {
        proxy.$message.warning('请勾选列表数据');
        return;
    }
    toBindCategory();
};

// 给Bom商品绑定分类
const toBindCategory = () => {
    let obj = {
        bom_id: bomId.value,
        bom_item_id_list: selectIdList.value,
        bom_category_id: categoryId.value,
    };
    if (level.value === 2) {
        Core.Api.ITEM_BOM.addBindCategory(obj)
            .then(res => {
                proxy.$message.success('选择成功');
                emits('refresh');
            })
            .catch(err => {
                console.log('toBindCategory', err);
            })
            .finally(() => {
                emits('update:visibility', false);
            });
        return;
    }
    Core.Api.ITEM_BOM.bindCategory(obj)
        .then(res => {
            proxy.$message.success('选择成功');
            emits('refresh');
        })
        .catch(err => {
            console.log('toBindCategory', err);
        })
        .finally(() => {
            emits('update:visibility', false);
        });
};

/* Fetch start*/
// 获取表格list
const getTableDataFetch = (parmas = {}) => {
    if (level.value === 2 && searchForm.value.codeList.length === 0) {
        return;
    }
    loading.value = true;
    let obj = {
        bom_id: bomId.value,
        code_list: searchForm.value.codeList, //同步编号
        page: current.value,
        page_size: pageSize.value,
        ...parmas,
    };
    Core.Api.ITEM_BOM.ManagerListParts(obj)
        .then(res => {
            total.value = res.count;
            tableData.value = res.list;

            getDefaultChecked();
        })
        .catch(err => {
            console.log('getTableDataFetch', err);
        })
        .finally(() => {
            loading.value = false;
        });
};

// 获取默认勾选
const getDefaultChecked = async () => {
    if (level.value === 2) {
        defaultChecked.value = tableData.value
            .filter(item => {
                return item.sync_id === codeStr.value;
            })
            .map(item => item.id);
    } else if (level.value === 3) {
        // 获取回显项
        /* tableData.value.filter(item => {

            if(!item.bom_category_id) return false;
            return item.bom_category_id === categoryId.value;

        }).map(item => item.id); */
        loading.value = true;
        let obj = {
            bom_id: bomId.value,
            code_list: searchForm.value.codeList, //同步编号
            page: 1,
            page_size: 1000,
            bom_category_id: categoryId.value,
        };
        await Core.Api.ITEM_BOM.ManagerListParts(obj)
            .then(res => {
                defaultChecked.value = res.list.map(item => item.id);
                console.log('00000000000000000000defaultChecked.value', defaultChecked.value);
            })
            .catch(err => {
                console.log('defaultChecked', err);
            })
            .finally(() => {
                loading.value = false;
            });
    }
    console.log('defaultChecked.value', defaultChecked.value);
    console.log('selectIdList.value', selectIdList.value);
    selectIdList.value = [...new Set([...selectIdList.value, ...defaultChecked.value])];
    console.log('defaultChecked.value1111', defaultChecked.value);
    console.log('selectIdList.value1111', selectIdList.value);
};

/* 获取版本下分类列表 */
const getListCategory = () => {
    Core.Api.ITEM_BOM.listCategory({
        bom_id: bomId.value,
    })
        .then(res => {
            console.log('getListCategory', res);
            /* total.value = res.count;
        tableData.value = res.list; */
            classList.value = res.list;
        })
        .catch(err => {
            console.log('getTableDataFetch', err);
        })
        .finally(() => {
            // loading.value = false
        });
};
// 接收选择id的数组
const getSelectIdList = data => {
    selectIdList.value = Core.Util.deepCopy(data);
};
</script>

<style lang="less" scoped>
.search {
    position: absolute;
    top: 120px;
    padding: 0;
    width: -moz-calc(100% - 48px);
    width: -webkit-calc(100% - 48px);
    width: calc(100% - 48px);
    z-index: 20;
}
.top-box {
    width: 415px;
    position: absolute;
    z-index: 20;
}

.tip {
    height: 30px;
    line-height: 30px;
    margin-left: 10px;
    font-size: 12px;
}

.fixed {
    background-color: #ffffff;
    height: 140px;
    position: absolute;
    top: 44px;
    width: -moz-calc(100% - 24px);
    width: -webkit-calc(100% - 24px);
    width: calc(100% - 24px);
    left: 0;
    z-index: 0;
    z-index: 15;
}
</style>
