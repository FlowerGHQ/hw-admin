<template>
    <div class="search">
        <div class="search-item">
            <a-input placeholder="搜索用户名称/手机号" v-model:value="searchForm.name" @keydown.enter="handleSearch">
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
              v-model:value="searchForm.source"
              :field-names="{ label: 'zh', value: 'key' }"
              style="width: 104px;"
              placeholder="来源"
              @change="handleChange"
            ></a-select>
        </div>
        <div class="search-item">
            <a-select
              ref="select"
              :options="optionsStatus"
              v-model:value="searchForm.status"
              :field-names="{ label: 'zh', value: 'key' }"
              style="width: 104px;"
              placeholder="订单状态"
              @change="handleChange"
            ></a-select>
        </div>
        <div class="search-item">
            <a-select
              ref="select"
              :options="optionsRegion"
              v-model:value="searchForm.region"
              :field-names="{ label: 'zh', value: 'key' }"
              style="width: 104px;"
              placeholder="所属大区"
              @change="handleChange"
            ></a-select>
        </div>
        <div class="search-item">
            <a-select
              ref="select"
              :options="optionsCity"
              v-model:value="searchForm.city"
              :field-names="{ label: 'zh', value: 'key' }"
              style="width: 104px;"
              placeholder="所属城市"
              @change="handleChange"
            ></a-select>
        </div>
        <div class="search-item">
            <a-select
              ref="select"
              :options="optionsStore"
              v-model:value="searchForm.store"
              :field-names="{ label: 'zh', value: 'key' }"
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
    </div>
</template>

<script setup>
import Core from '@/core';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons-vue';
import { reactive, ref, toRefs } from 'vue';

// const $prop = defineProps(['xxx'])
const $emit = defineEmits(['enter'])

// 搜索栏
const optionsIntention = ref(Object.values(Core.Const.CRM_ORDER.INTENTION_STATUS));
const optionsSource = ref(Object.values(Core.Const.CRM_ORDER.INTENTION_STATUS));
const optionsStatus = ref(Object.values(Core.Const.CRM_ORDER.INTENTION_STATUS));
const optionsRegion = ref(Object.values(Core.Const.CRM_ORDER.INTENTION_STATUS));
const optionsCity = ref(Object.values(Core.Const.CRM_ORDER.INTENTION_STATUS));
const optionsStore = ref(Object.values(Core.Const.CRM_ORDER.INTENTION_STATUS));
const searchForm = reactive({
    name: undefined,
    intention: undefined,
    source: undefined,
    status: undefined,
    region: undefined,
    city: undefined,
    city: undefined,
    store: undefined,
    time: undefined,
})

const handleChange = () => {
    $emit('enter', searchForm)
}
const handleSearch = () => {
    $emit('enter', searchForm)
}

</script>

<style lang="less" scoped>
.search {
    display: flex;
    margin-bottom: 16px;
    padding: 0;
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
}
</style>
