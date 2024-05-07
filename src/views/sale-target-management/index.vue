<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t(/*1.0数据看板目标设置*/ 'target.title') }}
            </div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('add')">
                    {{ $t(/*新增销售目标*/ 'target.add_btn') }}
                </a-button>
            </div>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll :options="searchList" :isShowMore="false" @search="onSearch" @reset="onReset" ref="searchAllRef">
            </SearchAll>
        </div>
        <!-- table -->
        <div class="table-container">
            <a-table 
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :loading="loading"
                :row-key="record => record.id"
                :pagination="false"
            >
                <template #bodyCell="{ column, text, record, index }">
                    <template v-if="column.key === 'item'">
                        <a-tooltip placement="topLeft">
                            <template #title>{{ text || '-' }}</template>
                            <div
                                class="one-spils cursor"
                                :style="{
                                    width: text?.length > 15 ? 7 * 12 + 'px' : '',
                                }"
                            >
                                {{ text || '-' }}
                            </div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'money'">
                        <a-tooltip placement="topLeft">
                            <template #title>￥{{ $Util.countFilter(text) || '-' }}</template>
                            <div
                                class="one-spils cursor"
                                :style="{
                                    width: text?.length > 15 ? 7 * 12 + 'px' : '',
                                }"
                            >
                                ￥{{ $Util.countFilter(text) || '-' }}
                            </div>
                        </a-tooltip>
                    </template>
                    <!-- 时间 -->
                    <template v-if="column.key === 'time'">
                        {{ String(record.year) }}-{{ String(record.month) }}
                    </template>
                    <!-- 部门 -->
                    <template v-if="column.key === 'section'">
                        {{ text ? $Util.saleTargetSectionFilter(text, $i18n.locale) : '-' }}
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'operations'">
                        <a-button type="link" @click="routerChange('edit', record)">
                            <MySvgIcon icon-class="supply-edit" />
                            <span class="m-l-10">{{ $t('common.edit') }}</span>
                        </a-button>
                        <a-button type="link" @click="routerChange('detail', record)">
                            <MySvgIcon icon-class="detail" />
                            <span class="m-l-10">{{ $t('def.detail') }}</span>
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
                :show-total="total => $t('n.all_total') + ` ${pagination.total} ` + $t('in.total')"
                :hide-on-single-page="false"
                :pageSizeOptions="['10', '20', '30', '40']"
                @change="onPageChange"
                @showSizeChange="onSizeChange"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, getCurrentInstance } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
const router = useRouter();
const $t = useI18n().t;
const searchAllRef = ref(null);
const { proxy } = getCurrentInstance();

const tableColumns = computed(() => {
    let columns = [
        { title: $t(/*时间*/ 'target.time_field'), dataIndex: 'year', key: 'time' },
        { title: $t(/*部门*/ 'target.section'), dataIndex: 'target_id', key: 'section' },
        { title: $t(/*车辆销售目标*/ 'target.sales_target'), dataIndex: 'target_sale_count', key: 'item' },
        { title: $t(/*销售金额目标*/ 'target.amount_target'), dataIndex: 'target_sale_money', key: 'money' },
        { title: $t(/*操作*/ 'common.operations'), key: 'operations', fixed: 'right' },
    ];
    return columns;
});

const searchList = ref([
    {
        type: 'time-range',
        value: [],
        searchParmas: ['begin_time', 'end_time'],
        key: 'target.time',
        defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_E,
    },
    {
        type: 'select',
        value: undefined,
        searchParmas: 'target_id',
        key: 'target.department_selection',
        selectMap: Core.Const.TARGET.SECTION_SEARCH_TYPE,
    },
]);

onMounted(() => {});
/* Fetch start*/
const request = Core.Api.SaleTarget.list;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
    initParam: { target_type: Core.Const.TARGET.TARGET_TYPE_MAP.OPERATION_CENTER },
});

/* Fetch end*/

/* methods start*/
const onSearch = data => {
    searchParam.value = data;
    search();
};
const onReset = () => {
    refreshTable();
};
const routerChange = (type, record) => {
    switch (type) {
        case 'edit':
            router.push({
                path: '/sale-target-management/detail',
                query: {
                    id: record.id,
                    type: 'edit',
                },
            });
            break;
        case 'add':
            router.push({
                path: '/sale-target-management/detail',
                query: {
                    type: 'add',
                },
            });
            break;
        case 'detail':
            router.push({
                path: '/sale-target-management/detail',
                query: {
                    id: record.id,
                    type: 'detail',
                },
            });
            break;
    }
};
/* methods end*/
</script>

<style lang="less" scoped>
.list-container {
    .title-container {
        .title-area {
            color: #1d2129;
            font-size: 18px;
            font-weight: 600;
        }
    }
}
</style>
