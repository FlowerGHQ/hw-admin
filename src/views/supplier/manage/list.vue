<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t("supply-chain.application_Materials") }}</div>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll 
                :options="searchList"
                :isShowMore="false"
                @search="onSearch"
                @reset="onReset"
            >
            </SearchAll>
        </div>
        <!-- table -->
        <div class="table-container">
            <a-button 
                class="m-b-10" 
                type="primary"
                @click="onBtn"
            >
                {{ $t('supply-chain.create_data') }}
            </a-button>
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :loading="loading"
                :row-key="(record) => record.id"
                :pagination="false"
            >
                <template #bodyCell="{ column, text, record, index }">
                    <!-- 序号 -->
                    <template v-if="column.key === 'number'">
                        {{ index + 1 }}
                    </template>
                    <!-- 公司名称 -->
                    <template v-if="column.key === 'company_name'">
                        <a-tooltip placement="topLeft">
                            <template #title>{{ text }}</template>
                            <div
                                class="one-spils cursor"
                                :style="{
                                    width: text?.length > 15 ? 7 * 12 + 'px' : '',
                                }"
                            >
                                {{ text }}
                            </div>
                        </a-tooltip>
                    </template>
                    <!-- 供应商类型 -->
                    <template v-if="column.key === 'type'">
                        {{ Core.Const.SUPPLAY.SUPPLAY_TYPE[text] ? $t(Core.Const.SUPPLAY.SUPPLAY_TYPE[text]?.t) : '-' }}
                    </template>
                    <!-- 提交时间 -->
                    <template v-if="column.key === 'create_time'">
                        {{ text ? $Util.timeFormat(text) : '-' }}
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'operations'">
                        <a-button type="link" @click="onView('add', record)">
                            <MySvgIcon icon-class="supply-view"/>
                            <span class="m-l-10">{{ $t('supply-chain.view') }}</span>
                        </a-button>
                        <a-button type="link" @click="onView('edit', record)">       
                            <MySvgIcon icon-class="supply-edit"/>
                            <span class="m-l-10">{{ $t('common.edit') }}</span>
                        </a-button>
                    </template>
                </template>
            </a-table>
        </div>
        <div class="paging-container">
            <a-pagination
                v-model:current="pagination.current"
                :page-size="pagination.size"
                :total="pagination.total"
                show-quick-jumper
                show-size-changer
                show-less-items
                :show-total="(total) => $t('n.all_total') + ` ${pagination.total} ` + $t('in.total')"
                :hide-on-single-page="false"
                :pageSizeOptions="['10', '20', '30', '40']"
                @change="onPageChange"
                @showSizeChange="onSizeChange"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, watch } from "vue";
import Core from "@/core";
import SearchAll from "@/components/horwin/based-on-ant/SearchAll.vue";
import { useTable } from '@/hooks/useTable'
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
const $store = useStore();
const router = useRouter()
const $t = useI18n().t;

const tableColumns = computed(() => {
    let columns = [
        { title: $t("supply-chain.serial_number"), dataIndex: "number", key: "number" },
        { title: $t("supply-chain.company_name"), dataIndex: "company_name", key: "company_name" },
        { title: $t("supply-chain.supplier_type"), dataIndex: "type", key: "type" },
        { title: $t("supply-chain.submission_time"), dataIndex: "create_time", key: "create_time" },
        { title: $t("common.operations"), key: "operations", fixed: "right" },
    ];
    return columns;
});

const searchList = ref([
    { 
        type: "input", 
        value: "", 
        searchParmas: "company_name",  
        key: 'supply-chain.company_name' 
    },
    { 
        type: "select",
        value: undefined,
        searchParmas: "type",
        key: 'supply-chain.supplier_type',
        selectMap: Core.Const.SUPPLAY.SUPPLAY_TYPE,
    },
    {
        type:'time-range',
        value: [],
        searchParmas: ['begin_time', 'end_time'],
        key: 'supply-chain.submission_time',
        defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_E
    }
])

onMounted(() => {});
/* Fetch start*/
const request = Core.Api.SUPPLY.adminList;
const {
    loading,
    tableData,
    pagination,
    search,
    onSizeChange,
    refreshTable,
    onPageChange,
    searchParam,
} = useTable({ request });
/* Fetch end*/

/* methods start*/
const onSearch = (data) => {
    searchParam.value = data
    search()
}
const onReset = () => {
    refreshTable()
}
// 点击查看
const onView = (type, record) => {
    let routeUrl = null
    switch(type) {
        case 'add':        
            routeUrl = router.resolve({
                path: '/supply-manage/detail',
                query: {
                    id: record.id            
                }
            })
            window.open(routeUrl.href, '_blank')

        break;
        case 'edit':
            routeUrl = router.resolve({
                path: '/supply-manage/detail',
                query: {
                    id: record.id,
                    flag_edit: true
                }
            })
            window.open(routeUrl.href, '_blank')
        break;
    }   
}
const onBtn = () => {
    router.push({
        path: '/supply-manage/add',
    })
    $store.commit("SUPPLY_CHAIN/setSupplyChain", {})
    $store.commit("SUPPLY_CHAIN/setSupplyDraftChain", {})
    $store.commit("SUPPLY_CHAIN/setStep", 0)
    $store.commit("SUPPLY_CHAIN/setSubmitEd", false)
    
}
/* methods end*/
</script>

<style lang="less" scoped>
</style>
