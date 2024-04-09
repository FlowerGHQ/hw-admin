<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.consider_exempt_supplier_list') }}</div>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll :options="searchList" :isShowMore="false" @search="onSearch" @reset="onReset"> </SearchAll>
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
                    <!-- 序号 -->
                    <template v-if="column.key === 'number'">
                        {{ index + 1 }}
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text ? text : '-' }}
                    </template>
                    <!-- 引入日期 -->
                    <template v-if="column.key === 'time'">
                        {{ text ? $Util.timeFormat(text, 'YYYY.MM') : '-' }}
                    </template>
                    <!-- 变化类 -->
                    <template v-if="column.key === 'register_type'">
                        <template v-if="text === 1">
                            {{ text ? $t('supply-chain.new_addition') : '-' }}
                        </template>
                        <template v-if="text === 2">
                            {{ text ? $t('supply-chain.rename') : '-' }}
                        </template>
                        <template v-if="!text">-</template>
                    </template>
                    <!-- 备注 -->
                    <template v-if="column.key === 'remark'">
                        <div class="remark">
                            <a-tooltip>
                                <template #title>{{ text }}</template>
                                <span class="remark-text">{{ text ? text : '-' }}</span>
                            </a-tooltip>
                            <MySvgIcon
                                icon-class="supply-edit"
                                class-name="supply-edit"
                                @click.native="handleRemark(record)"
                            />
                        </div>
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
import { onMounted, ref, getCurrentInstance, computed, nextTick, reactive } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import ExportResult from '@/components/common/ExportResult.vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import MySvgIcon from '@/components/MySvgIcon/index.vue';

const $t = useI18n().t;
const tableColumns = computed(() => {
    let columns = [
        { title: $t('supply-chain.serial_number'), dataIndex: 'number', key: 'number' },
        { title: $t('supply-chain.supplier_full_name'), dataIndex: 'name', key: 'item' },
        { title: $t('supply-chain.supplier_type'), dataIndex: 'type', key: 'type' },
        // 免审核申请表
        {
            title: $t('supply-chain.exempt_application_form'),
            dataIndex: 'exempt_application_form',
            key: 'exempt_application_form',
        },
    ];

    return columns;
});

const searchList = ref([
    {
        type: 'input',
        value: '',
        searchParmas: 'name',
        key: 'supply-chain.supplier_full_name',
    },
]);

/* Fetch start*/
const request = Core.Api.Supplier.list;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
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

/* methods end*/
</script>

<style lang="less" scoped></style>
