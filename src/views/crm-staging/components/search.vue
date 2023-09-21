<template>
    <div class="search">
        <div class="search-item">
            <a-input placeholder="搜索用户名称/手机号" v-model:value="searchForm.key" @keydown.enter="handleSearch">
                <template #prefix>
                    <SearchOutlined style="font-size: 20px; color: #C9CDD4;"/>
                </template>
            </a-input>
        </div>
        <div class="search-item">
            <a-select
              ref="select"
              :options="optionsIntention"
              v-model:value="searchForm.intention"
              :field-names="{ label: 'zh', value: 'key' }"
              style="width: 90px;"
              placeholder="意向"
              @change="handleChange"
            ></a-select>
        </div>
        <div class="search-item">
            <a-select
              ref="select"
              :options="optionsSource"
              v-model:value="searchForm.source_type"
              :field-names="{ label: 'title', value: 'value' }"
              style="width: 110px;"
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
              style="width: 104px;"
              placeholder="订单状态"
              @change="handleChange"
            ></a-select>
        </div>
        <div class="search-item">
            <a-select
              ref="select"
              :options="optionsRegion"
              v-model:value="searchForm.group_id"
              :field-names="{ label: 'name', value: 'id' }"
              style="width: 104px;"
              placeholder="所属大区"
              @change="handleChange"
            ></a-select>
        </div>
        <div class="search-item">
            <!-- <a-select
              ref="select"
              :options="optionsCity"
              v-model:value="searchForm.city"
              :field-names="{ label: 'zh', value: 'key' }"
              style="width: 104px;"
              placeholder="所属城市"
              @change="handleChange"
            ></a-select> -->
            <China2Address @search="handleCitySearch" placeholder="所属城市" :defArea="[searchForm.province, searchForm.city]" ref='CountryCascader' />
        </div>
        <div class="search-item">
            <a-select
              ref="select"
              :options="optionsStore"
              v-model:value="searchForm.store_id"
              :field-names="{ label: 'name', value: 'id' }"
              style="width: 104px;"
              placeholder="所属门店"
              @change="handleChange"
            ></a-select>
        </div>
        <div class="search-item">
            <a-range-picker
              v-model:value="searchForm.time"
              @change="handleChange()"
              :allowClear="false"
              :placeholder="['开始日期', '结束日期']"
              style="width: 220px;"
              ref="TimeSearch"
            >
                <template #suffixIcon>
                    <CalendarOutlined style="font-size: 20px; color: #86909C;"/>
                </template>
            </a-range-picker>
        </div>
        <span class="clear" :style="{ color:clear ? '#0061FF' : '#86909C' }" @click="clearFn">清空筛选条件</span>
    </div>
</template>

<script setup>
import Core from '@/core';
import China2Address from '../../../components/common/China2Address.vue'
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons-vue';
import { reactive, ref, toRefs, onMounted } from 'vue';
import Static from '../static'

// const $prop = defineProps(['xxx'])
const $emit = defineEmits(['enter'])
const CountryCascader = ref(null)

onMounted(() => {    
    getStoreList()
    getGroupList()
})

// 搜索栏
const clear = ref(false)
const optionsIntention = ref(Object.values(Core.Const.CRM_ORDER.INTENTION_STATUS));
const optionsSource = ref(Static.SOURCE_TYPE);
const optionsStatus = ref(Object.values(Static.ORDER_STATUS_MAP));
const optionsRegion = ref(Object.values(Core.Const.CRM_ORDER.INTENTION_STATUS));
// const optionsCity = ref(Object.values(Core.Const.CRM_ORDER.INTENTION_STATUS));
const optionsStore = ref(Object.values(Core.Const.CRM_ORDER.INTENTION_STATUS));
const searchForm = reactive({
    key: undefined,
    intention: undefined,
    source_type: undefined,
    order_status: undefined,
    group_id: undefined,
    province: undefined,
    city: undefined,
    store_id: undefined,
    time: undefined,
})
const getStoreList = () => {
    Core.Api.CustomService.storeList().then(res=>{
		Core.Logger.success('getTaskNum',res);
		optionsStore.value = res.list;
	}).catch(err=>{
        Core.Logger.error("参数", "数据", err)
	})
}
const getGroupList = () => {
    Core.Api.CustomService.groupList().then(res=>{
		Core.Logger.success('getTaskNum',res);
		optionsRegion.value = res.list;
	}).catch(err=>{
        Core.Logger.error("参数", "数据", err)
	})
}
// 选择用车城市
const handleCitySearch = (e) => {
    if (e.province && !clear.value) {
        clear.value = true
    }
    searchForm.province = e.province
    searchForm.city = e.city
    handleChange()
}
const handleChange = () => {
    clear.value = true
    $emit('enter', searchForm)
}
const handleSearch = () => {
    clear.value = true
    $emit('enter', searchForm)
}
const clearFn = () => {
    if (!clear.value) return
    for(let key in searchForm) {
        searchForm[key] = undefined
    }
    CountryCascader.value.handleReset()
    clear.value = false
    $emit('enter', searchForm)
}

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
        :deep(.ant-picker-input > input), :deep(.ant-select-selector), :deep(.ant-input-affix-wrapper > input.ant-input) {
            font-size: 14px;
        }
    }
    .clear {
        position: absolute;
        right: 0;
        cursor: pointer;
    }
}
</style>
