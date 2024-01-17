<template>
    <a-modal
        v-model:visible="visibility"
        :width="860"
        title="添加明细"
        @ok="handleOk"
        @cancel="handleCancle">
        <!-- 搜索固定数据 :closable="false" -->
        <div class="search-container-new top-box">
            <div class="item-box">
                <div class="key-box">选择赠送地区</div>
                <div class="value-box">
                    <a-select
                        v-model:value="searchForm.area"
                        :options="CountryData"
                        mode="multiple"
                        show-search
                        :filter-option="filterOption"
                        :placeholder="$t('def.select')">
                    </a-select>
                </div>
            </div>
        </div>
        <div class="search">
            <SearchAll
                :isShowMore="false"
                :disabled="level === 2"
                @search="handleSearch"
                @reset="handleSearchReset">
                <template v-slot:extend>
                    <a-col
                        v-if="options.type === 'input'"
                        :xs="24"
                        :sm="15"
                        :xl="15"
                        :xxl="15"
                        class="search-box">
                        <div class="item-box">
                            <div class="key-box">
                                {{ $t(options.key) }}
                            </div>
                            <div class="value-box">
                                <a-input
                                    :disabled="level === 2"
                                    :placeholder="
                                        $t(
                                            `${
                                                options.placeholder ||
                                                'def.input'
                                            }`
                                        )
                                    "
                                    v-model:value="codeStr"
                                    @keydown.enter="handleSearch" />
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
        <TableSelect
            ref="childRef"
            :columns="tableColumns"
            :data-source="tableData"
            :loading="loading"
            :check-mode="true"
            @submit="getSelectIdList">
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
                        @showSizeChange="onShowSizeChange" />
                    <div class="tip">
                        {{
                            $t("in.selected") +
                            ` ${selectIdList.length} ` +
                            $t("in.total")
                        }}
                    </div>
                </div>
                <div class="btn-area">
                    <a-button @click="handleCancle">{{
                        $t("def.cancel")
                    }}</a-button>
                    <a-button @click="handleOk" type="primary">{{
                        $t("def.sure")
                    }}</a-button>
                </div>
            </div>
        </template>
    </a-modal>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, watch } from "vue";
import Core from "@/core";
import SearchAll from "@/components/common/SearchAll.vue";
import TableSelect from "@/components/table/ItemTable.vue";
import COUNTYR from "@/assets/js/address/countries.json";
import {message} from "ant-design-vue";
import { useI18n } from "vue-i18n";
import {useRoute} from "vue-router"; 
import _ from "lodash";
const { proxy } = getCurrentInstance();
const $i18n = useI18n();
const $t = $i18n.t;
const $route = useRoute();
const emits = defineEmits(["update:visibility",'hanldAdd','hanldItemList','handleEdit']);
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
const CountryData = computed(() => {
    let arr = [];
    COUNTYR.forEach((item) => {
        arr.push({
            label: item.name,
            value: item.name,
        });
    });
    return arr;
});
const initialObject = {
    // 商品编码
    codeList: [],
    area:[]
};
const childRef = ref(null);
// 当前分组对象
// const classValue =  ref();
const searchForm = ref({
    // 商品编码
    codeList: [],
    area:[]
});
// 分类列表
// 搜索列表组件
const options = ref({
    type: "input",
    value: "",
    searchParmas: "code",
    key: "item-bom.commodity_code",
    placeholder: "item-bom.filter_multiple_codes",
});
// 商品编码-字符串
const codeStr = ref();
const isEdit = ref(false);
// 所选id列表
const selectIdList = ref([]);
// 所选item列表
const selectItemList = ref([]);
const tableData = ref([]);
const pageSize = ref(10);
const current = ref(1);
const total = ref(0);
const disabledChecked = ref([]);
// 页size改变
const onShowSizeChange = (current, pageSize) => {
    pageChange();
};
// 页码改变
const pageChange = () => {
    getTableDataFetch();
};

const loading = ref(false);
const tableColumns = computed(() => {
    const result = [
        {
            // 商品名称
            title: proxy.$t("sales-strategy-management.commodity_name"),
            dataIndex: "name",
            key: "detail",
        },
        {
            // 分类
            title: proxy.$t(
                "sales-strategy-management.commodity_classification"
            ),
            dataIndex: "category_list",
            key: "category_list",
        },
        {
            // 商品编码
            title: proxy.$t("sales-strategy-management.commodity_code"),
            dataIndex: "code",
            key: "code",
        },
    ];
    return result;
});

/* 删除加号 */
const removeChildrenFromData = (data) => {
    return data.map((item) => {
        const newItem = { ...item };
        delete newItem.children;
        return newItem;
    });
};
// 重置按钮
const handleSearchReset = () => {
    Object.assign(searchForm.value, initialObject);
    handleSearch();
};
const handleSearch = () => {
    current.value = 1;
    //更换数组形式传参,字符串逗号分隔输入--编码
    let arr = codeStr?.value?.trim().split(",");
    arr = arr?.map((item) => item?.trim());
    searchForm.value.codeList = arr?.filter((item) => item !== "");
    getTableDataFetch();
};
const handleCancle = () => {
    emits("update:visibility", false);
};
// addTableData
const addTableData = () => {
    let arr = JSON.parse(Core.Data.getSalesData());
    arr.forEach((item) => {
        item.number = item.number + 1;
    });
    arr.push(...selectIdList.value);
    Core.Data.setSalesData(JSON.stringify(arr));
};
const handleOk = () => {
    // 判断是否选择了地区和商品
    if (searchForm.value.area.length === 0) {
        message.warning($t("sales-strategy-management.please_select_the_gift_area"))
        return;
    }
    if (selectIdList.value.length === 0) {
        message.warning($t("sales-strategy-management.please_select_the_gift_item"))
        return;
    }
    // 从本地取出数据
    let arr = JSON.parse(Core.Data.getSalesData());
    let maxNo = 0;
    if (arr.length === 0) {
        maxNo = 0;
    } 
    else if (arr.length === 1) {
        maxNo = arr[0].no;
    }
    else {
       maxNo = arr.reduce((prev, cur) => {
        // 迭代器，找出最大的no
            return prev.no > cur.no ? prev.no : cur.no;
        });
    }
    console.log('maxNo',maxNo)
    let strategy_detail = []

    selectIdList.value.forEach((item) => {
        searchForm.value.area.forEach((item1) => {
            let obj =  {}
            obj.no = maxNo + 1 ;
            obj.country = item1;
            obj.bonus_item_id = item;
            obj.item = selectItemList.value.filter((item2) => item2.id === item)[0];
            if($route.query.type === 'add' ){
            //    赋值唯一id
                obj.id = _.uniqueId();  
            }
            if(isEdit.value){
                obj.isEdit = true;
            }
            strategy_detail.push(obj);

        });
    });
    if(isEdit.value){
        emits('handleEdit',strategy_detail)
        isEdit.value = false;
    }else{
        emits('hanldItemList',selectIdList.value)
        emits('hanldAdd',strategy_detail)
    }
    handleCancle();
};
// 搜索
const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
/* Fetch start*/
// 获取表格list
const getTableDataFetch = (parmas = {}) => {
    loading.value = true;
    let obj = {
        code_list: searchForm.value.codeList, //同步编号
        flag_spread: 1,
        page: current.value,
        page_size: pageSize.value,
        status:0,
        ...parmas,
    };
    Core.Api.Item.list(obj)
        .then((res) => {
            total.value = res.count;
            tableData.value = removeChildrenFromData(res.list);
        })
        .catch((err) => {
            console.log("getTableDataFetch", err);
        })
        .finally(() => {
            loading.value = false;
        });
};
// 接收选择id的数组
const getSelectIdList = (kesArr,itemsArr) => {
    selectIdList.value = Core.Util.deepCopy(kesArr);
    selectItemList.value = Core.Util.deepCopy(itemsArr);
};

watch(
    () => props.visibility,
    (newValue, oldValue) => {
        if (newValue) {
            getTableDataFetch();
        }else{
            // 清空数据
            selectIdList.value = [];
        }
    }
);
watch(()=>props.reviewData,
    (newValue,oldValue)=>{
    if(newValue){
       console.log('newValue',newValue)
       searchForm.value.area = [newValue.country ]
       searchForm.value.codeList = newValue.item.map((item)=>item.code)
       codeStr.value = newValue.item.map((item)=>item.code).join(',')
       selectIdList.value = newValue.item.map((item)=>item.id)
       isEdit.value = true;
       handleSearch();
       setTimeout(() => {
        childRef.value.selectedRowKeys = newValue.item.map((item)=>item.id)
       }, 1000);
    }
})

onMounted(() => {
    // 初始化数据
    Object.assign(searchForm.value, initialObject);
});
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
