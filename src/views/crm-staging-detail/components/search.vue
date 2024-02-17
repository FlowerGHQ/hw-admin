<template>
    <div class="search">
        <div class="search-item">
            <a-input placeholder="搜索用户名称/手机号" v-model:value="searchForm.key" @keydown.enter="handleSearch">
                <template #prefix>
                    <SearchOutlined style="font-size: 20px; color: #c9cdd4" />
                </template>
            </a-input>
        </div>
        <div class="search-item">
            <a-select
                ref="select"
                :options="optionsIntention"
                v-model:value="searchForm.intention"
                :field-names="{ label: 'zh', value: 'key' }"
                style="width: 90px"
                placeholder="意向度"
                @change="handleChange"
            ></a-select>
        </div>
        <div class="search-item">
            <a-select
                ref="select"
                :options="optionsSource"
                v-model:value="searchForm.source_type_mapping"
                :field-names="{ label: 'title', value: 'value' }"
                style="width: 110px"
                placeholder="来源"
                @change="handleChange"
            ></a-select>
        </div>
        <div class="search-item">
            <a-select
                ref="select"
                :options="optionsStatus"
                v-model:value="searchForm.order_status"
                :field-names="{ label: 'text', value: 'key' }"
                style="width: 104px"
                placeholder="订单状态"
                @change="handleChange"
            ></a-select>
        </div>
        <!-- <div class="search-item">
            <a-select
              ref="select"
              :options="optionsRegion"
              v-model:value="searchForm.group_id"
              :field-names="{ label: 'name', value: 'id' }"
              style="width: 104px;"
              placeholder="所属大区"
              @change="handleChange('group')"
            ></a-select>
        </div>
        <div class="search-item">
            <a-select
              ref="select"
              :options="optionsCity"
              v-model:value="searchForm.city"
              :field-names="{ label: 'city', value: 'id' }"
              style="width: 104px;"
              placeholder="所属城市"
              :disabled="!searchForm.group_id"
              @change="handleChange('city')"
            ></a-select>
        </div>
        <div class="search-item">
            <a-select
              ref="select"
              :options="optionsStore"
              v-model:value="searchForm.store_id"
              :field-names="{ label: 'name', value: 'id' }"
              style="width: 104px;"
              placeholder="所属门店"
              :disabled="!searchForm.city"
              @change="handleChange"
            ></a-select>
        </div> -->
        <div class="search-item">
            <a-range-picker
                v-model:value="searchForm.time"
                @change="handleChange()"
                :allowClear="false"
                :placeholder="['开始日期', '结束日期']"
                style="width: 230px"
                ref="TimeSearch"
            >
                <template #suffixIcon>
                    <CalendarOutlined style="font-size: 20px; color: #86909c" />
                </template>
            </a-range-picker>
        </div>
        <span class="clear" v-if="clear" @click="clearFn">清空筛选条件</span>
    </div>
</template>

<script setup>
import Core from '@/core';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons-vue';
import { reactive, ref, toRefs, onMounted } from 'vue';
import Static from '../static';

// const $prop = defineProps(['xxx'])
const $emit = defineEmits(['enter']);

// onMounted(() => {
//     getGroupList()
// })

// 搜索栏
const clear = ref(false);
const optionsIntention = ref(Object.values(Core.Const.CRM_ORDER.INTENTION_STATUS));
const optionsSource = ref(Static.SOURCE_TYPE);
const optionsStatus = ref(Object.values(Static.ORDER_STATUS_MAP));
// const optionsRegion = ref([]);
// const optionsCity = ref([]);
// const optionsStore = ref([]);
const searchForm = reactive({
    key: undefined,
    intention: undefined,
    source_type_mapping: undefined,
    order_status: undefined,
    // group_id: undefined,
    // city: undefined,
    // store_id: undefined,
    time: undefined,
});
// const getGroupList = () => {
//     Core.Api.CustomService.groupList().then(res=>{
// 		Core.Logger.success('getTaskNum',res);
// 		optionsRegion.value = res.list;
// 	}).catch(err=>{
//         Core.Logger.error("参数", "数据", err)
// 	})
// }
const handleChange = type => {
    openClear();
    $emit('enter', searchForm);
    // switch (type) {
    //     case 'group':
    //         getCityList();
    //         break;
    //     case 'city':
    //         getStoreList();
    //         break;

    //     default:
    //         break;
    // }
};
// // 获取城市列表
// const getCityList = (value) => {
//     Core.Api.CustomService.getCityList({
//         id: searchForm.group_id
//     }).then(res=>{
// 		Core.Logger.success('getCityList',res);
// 		optionsCity.value = res;
// 	}).catch(err=>{
//         Core.Logger.error("参数", "数据", err)
// 	})
// }
// // 获取门店列表
// const getStoreList = () => {
//     Core.Api.CustomService.storeList({
//         group_id: searchForm.group_id,
//         city: searchForm.city,
//         page_size: 500,
//     }).then(res=>{
// 		Core.Logger.success('storeList',res);
// 		optionsStore.value = res.list;
// 	}).catch(err=>{
//         Core.Logger.error("参数", "数据", err)
// 	})
// }
const handleSearch = () => {
    openClear();
    $emit('enter', searchForm);
};
const clearFn = () => {
    if (!clear.value) return;
    for (let key in searchForm) {
        searchForm[key] = undefined;
    }
    clear.value = false;
    $emit('clearId');
    $emit('enter', searchForm);
};
const openClear = () => {
    clear.value = true;
};
defineExpose({ openClear });
</script>

<style lang="less" scoped>
.search {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 16px;
    padding: 0;
    padding-right: 100px;
    .search-item {
        margin-right: 8px;
        &:last-child {
            margin-right: 0;
        }
        .dropdown {
            font-size: 14px;
            .ant-select-selector {
                font-size: 14px;
            }
        }
        :deep(.ant-picker-input > input),
        :deep(.ant-select-selector),
        :deep(.ant-input-affix-wrapper > input.ant-input) {
            font-size: 14px;
        }
    }
    .clear {
        position: absolute;
        right: 0;
        color: #86909c;
        cursor: pointer;
        &:hover {
            color: #0061ff;
        }
    }
}
</style>
