<template>
    <div class="credit-detail list-container">
        <div class="title-container">
            <div class="title-area">{{ /*授信变化*/ $t('distributor-detail.credit_change') }}</div>
        </div>
        <div class="search-container">
            <SearchAll :options="searchList" @search="onSearch" @reset="onReset" :isShowMore="false" />
        </div>
        <div class="table-container">
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :loading="loading"
                :row-key="record => record.id"
                :pagination="false"
            >
                <template #bodyCell="{ record, column }">
                    <!-- 操作人 -->
                    <template v-if="column.key === 'operator'">{{ record.user.name || '-' }}</template>
                    <!-- credit_amount -->
                    <template v-if="column.key === 'credit_amount'">
                        {{ route.query.currency }}
                        {{ Core.Util.countFilter(record.content) || 0 }}</template
                    >
                    <!-- 操作时间 -->
                    <template v-if="column.key === 'operation_time'">{{
                        Core.Util.timeFormat(record.create_time) || '-'
                    }}</template>
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
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import Core from '@/core';
import { useTable } from '@/hooks/useTable';
import { useRoute } from 'vue-router';
const route = useRoute();
const $t = useI18n().t;

const request = Core.Api.ActionLog.list;
const initParam = ref({
    org_id: route.query.org_id,
    org_type: 15,
    type: 1001,
});

const tableColumns = computed(() => {
    let columns = [
        { title: $t('distributor-detail.operator'), dataIndex: 'operator', key: 'operator' },
        { title: $t('distributor-detail.credit_amount'), dataIndex: 'credit_amount', key: 'credit_amount' },
        { title: $t('distributor-detail.operation_time'), dataIndex: 'operation_time', key: 'operation_time' },
    ];
    return columns;
});

const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
    initParam: initParam.value,
});
const searchList = ref([
    {
        id: 0,
        type: 'time-range',
        value: [],
        searchParmas: ['begin_time', 'end_time'],
        key: 'distributor-detail.time',
        defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_E,
    },
]);

// methods
const onSearch = params => {
    console.log(params);
    searchParam.value = params;
    search();
};
const onReset = () => {
    console.log('reset');
    refreshTable();
};
</script>

<style lang="less" scoped></style>
