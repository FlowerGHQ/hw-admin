<template>
    <div ref="modalContentArea">
        <a-modal
            v-model:visible="visibility"
            :getContainer="handleGetContainer"
            :width="860"
            title="添加明细"
            @ok="handleOk"
            @cancel="handleCancle"
        >
            <!-- 搜索固定数据 :closable="false" -->
            <div class="search-container-new">
                <div class="item-box">
                    <div class="key-box">选择地区</div>
                    <div class="value-box">
                        <MyCountryCascader v-model:value="searchForm.area" />
                    </div>
                </div>
            </div>
            <div class="search">
                <SearchAll
                    :isShowMore="false"
                    :disabled="level === 2"
                    @search="handleSearch"
                    @reset="handleSearchReset"
                >
                    <template v-slot:extend>
                        <a-col
                            v-if="options[0].type === 'input'"
                            :xs="24"
                            :sm="12"
                            :xl="12"
                            :xxl="12"
                            class="search-box"
                        >
                            <div class="item-box">
                                <div class="key-box">
                                    {{ $t(options[0].key) }}
                                </div>
                                <div class="value-box">
                                    <a-input
                                        :disabled="level === 2"
                                        :placeholder="$t(`${options[0].placeholder || 'def.input'}`)"
                                        v-model:value="options[0].value"
                                        @keydown.enter="handleSearch"
                                    />
                                </div>
                            </div>
                        </a-col>
                        <a-col
                            v-if="options[1].type === 'input'"
                            :xs="24"
                            :sm="12"
                            :xl="12"
                            :xxl="12"
                            class="search-box"
                        >
                            <div class="item-box">
                                <div class="key-box">
                                    {{ $t(options[1].key) }}
                                </div>
                                <div class="value-box">
                                    <a-input
                                        :placeholder="$t(`${options[1].placeholder || 'def.input'}`)"
                                        v-model:value="options[1].value"
                                        @keydown.enter="handleSearch"
                                    />
                                </div>
                            </div>
                        </a-col>
                    </template>
                </SearchAll>
            </div>
            <TableSelect
                ref="childRef"
                :columns="tableColumns"
                :data-source="tableData"
                :loading="loading"
                :check-mode="true"
                :defaultChecked="defaultChecked"
                @submit="getSelectIdList"
            >
            </TableSelect>
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
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, watch, reactive } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import TableSelect from './ItemTale.vue';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import MyCountryCascader from '@/components/MyCountryCascader/index.vue';
// import COUNTYR from '@/assets/js/address/countries.json';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import _ from 'lodash';
const { proxy } = getCurrentInstance();
const $i18n = useI18n();
const $t = $i18n.t;
const $route = useRoute();
const emits = defineEmits(['update:visibility', 'hanldAdd', 'hanldItemList', 'handleEdit']);
const props = defineProps({
    visibility: {
        type: Boolean,
        default: false,
    },
    reviewData: {
        type: Object,
        default: () => {},
    },
});
// const CountryData = computed(() => {
//     let arr = [];
//     COUNTYR.forEach(item => {
//         arr.push({
//             label: item.name,
//             value: item.name,
//         });
//     });
//     return arr;
// });

const childRef = ref(null);
const modalContentArea = ref(null);
// 当前分组对象
// const classValue =  ref();
const searchForm = ref({
    // 商品编码
    codeList: [],
    area: [],
    name_list: [], // 产品名称
});
// 分类列表
// 搜索列表组件
const options = reactive([
    {
        type: 'input',
        value: '',
        searchParmas: 'code',
        key: 'item-bom.commodity_code',
        placeholder: 'item-bom.filter_multiple_codes',
    },
    {
        type: 'input',
        value: '',
        searchParmas: 'name_list',
        key: 'item-bom.product_name',
        placeholder: 'item-bom.filter_multiple_name',
    },
]);
// 商品编码-字符串
const isEdit = ref(false);
// 所选id列表
const selectIdList = ref([]);
// 所选item列表
const selectItemList = ref([]);
const tableData = ref([]);
const pageSize = ref(10);
const current = ref(1);
const total = ref(0);
const defaultChecked = ref([]);
// 页size改变
const onShowSizeChange = (current, pageSize) => {
    pageChange();
};
// 页码改变
const pageChange = () => {
    getTableDataFetch();
};
const handleGetContainer = () => {
    return modalContentArea.value;
};
const loading = ref(false);
const tableColumns = computed(() => {
    const result = [
        {
            // 商品名称
            title: proxy.$t('sales-strategy-management.commodity_name'),
            dataIndex: 'name',
            key: 'detail',
        },
        {
            // 分类
            title: proxy.$t('sales-strategy-management.commodity_classification'),
            dataIndex: 'category_list',
            key: 'category_list',
        },
        {
            // 商品编码
            title: proxy.$t('sales-strategy-management.commodity_code'),
            dataIndex: 'code',
            key: 'code',
        },
    ];
    return result;
});

/* Fetch start*/
// 获取表格list
const getTableDataFetch = (parmas = {}) => {
    loading.value = true;
    let obj = {
        name_list: searchForm.value.name_list,
        code_list: searchForm.value.codeList, //同步编号
        flag_set: 1,
        page: current.value,
        page_size: pageSize.value,
        ...parmas,
    };
    Core.Api.Item.list(obj)
        .then(res => {
            total.value = res.count;
            tableData.value = removeChildrenFromData(res.list);
        })
        .catch(err => {
            console.log('getTableDataFetch', err);
        })
        .finally(() => {
            loading.value = false;
        });
};
/* Fetch end*/

/* methods start */
// 初始化数据
const initDat = () => {
    searchForm.value = {
        // 商品编码
        codeList: [],
        area: [],
        name_list: [], // 产品名称
    };

    options.forEach(el => {
        el.value = undefined;
    });
};
// 接收选择id的数组
const getSelectIdList = (kesArr, itemsArr) => {
    console.log('kesArr', kesArr);
    console.log('itemsArr', itemsArr);
    selectIdList.value = kesArr;
    selectItemList.value = itemsArr;
};
// handlAreaChange
const handlAreaChange = value => {
    console.log(value);
    searchForm.value.area = value;
};
/* 删除加号 */
const removeChildrenFromData = data => {
    return data.map(item => {
        const newItem = { ...item };
        delete newItem.children;
        return newItem;
    });
};
// 重置按钮
const handleSearchReset = () => {
    initDat();
    getTableDataFetch();
};
const handleSearch = () => {
    current.value = 1;
    //更换数组形式传参,字符串逗号分隔输入--编码
    let commodityCode = options[0].value
        ?.trim()
        .split(',')
        ?.map(item => item?.trim()); // 商品编码
    let productName = options[1].value
        ?.trim()
        .split(',')
        ?.map(item => item?.trim()); // 产品名称

    searchForm.value.name_list = productName?.filter(item => item !== '');
    searchForm.value.codeList = commodityCode?.filter(item => item !== '');
    getTableDataFetch();
};

const handleCancle = () => {
    emits('update:visibility', false);
};

const handleOk = () => {
    // 判断是否选择了地区和商品
    if (searchForm.value.area.length === 0) {
        message.warning($t('sales-strategy-management.please_select_the_gift_area'));
        return;
    }
    if (selectIdList.value.length === 0) {
        message.warning($t('sales-strategy-management.please_select_the_gift_item'));
        return;
    }
    // 从本地取出数据
    let arr = JSON.parse(Core.Data.getSalesData());
    let maxNo = 0;
    if (arr.length === 0) {
        maxNo = 0;
    } else if (arr.length === 1) {
        maxNo = arr[0].no;
    } else {
        maxNo = arr.reduce((prev, cur) => {
            // 迭代器，找出最大的no
            return prev.no > cur.no ? prev.no : cur.no;
        });
    }
    console.log('selectIdList', selectIdList.value);
    console.log('selectItemList', selectItemList.value);
    let strategy_detail = [];
    selectIdList.value.forEach(item => {
        searchForm.value.area.forEach(item1 => {
            let obj = {};
            obj.no = maxNo + 1;
            obj.country = item1;
            obj.bonus_item_id = item;
            obj.item = selectItemList.value.filter(item2 => item2.id === item)[0];
            if ($route.query.type === 'add') {
                //    赋值唯一id
                obj.id = _.uniqueId();
            }
            if (isEdit.value) {
                obj.isEdit = true;
            }
            strategy_detail.push(obj);
        });
    });
    if (isEdit.value) {
        emits('handleEdit', strategy_detail);
        isEdit.value = false;
    } else {
        emits('hanldItemList', selectIdList.value);
        emits('hanldAdd', strategy_detail);
    }
    handleCancle();
};
// 搜索
const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
/* methods end */

watch(
    () => props.visibility,
    (newValue, oldValue) => {
        console.log('newValue', newValue);
        console.log('oldValue', oldValue);
        if (newValue) {
            getTableDataFetch();
        } else {
            // 清空数据
            selectIdList.value = [];
            searchForm.value.area = [];
            searchForm.value.codeList = [];
            options[0].value = '';
            isEdit.value = false;
            defaultChecked.value = [];
        }
    },
);
watch(
    () => props.reviewData,
    (newValue, oldValue) => {
        if (newValue) {
            console.log('newValue', newValue);
            searchForm.value.area = [newValue.country];
            searchForm.value.codeList = newValue.item.map(item => item.code);
            options[0].value = newValue.item.map(item => item.code).join(',');
            selectIdList.value = newValue.item.map(item => item.id);
            isEdit.value = true;
            handleSearch();
            setTimeout(() => {
                defaultChecked.value = newValue.item.map(item => item.id);
            }, 1000);
        }
    },
);

onMounted(() => {});
</script>

<style lang="less" scoped>
.modal-content-area {
    .tip {
        height: 30px;
        line-height: 30px;
        margin-left: 10px;
        font-size: 12px;
    }
}
:deep(.ant-modal-body) {
    display: flex;
    flex-direction: column;
    .search {
        padding: 0 !important;
    }
    .ant-table-wrapper {
        flex: 1;
        margin-top: 20px;
        overflow: auto;
    }
}
</style>
