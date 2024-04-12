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
                :pagination="{
                    current: pagination.current,
                    pageSize: pagination.size,
                    total: pagination.total,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    showLessItems: true,
                    showTotal: total => $t('n.all_total') + ` ${pagination.total} ` + $t('in.total'),
                    hideOnSinglePage: false,
                    pageSizeOptions: ['10', '20', '30', '40'],
                }"
                @change="({ current, pageSize }) => onPagenationChange(current, pageSize)"
            >
                <template #bodyCell="{ column, text, record, index }">
                    <!-- exempt_application_form -->
                    <template v-if="column.key === 'exempt_application_form'">
                        <a-button type="link" @click="handleViewForm(record)">{{ $t('common.view') }}</a-button>
                    </template>
                    <!-- operation -->
                    <template v-if="column.key === 'operation'">
                        <!-- 审核 -->
                        <a-button type="link" @click="handleAudit(record)">{{ $t('n.audit') }}</a-button>
                        <!-- 查看 -->
                        <a-button type="link" @click="handleView(record)">{{ $t('retail.view') }}</a-button>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import _ from 'lodash';

const router = useRouter();
const route = useRoute();
const request = Core.Api.SUPPLY.adminList;
const { loading, tableData, pagination, search, onPagenationChange, refreshTable, searchParam } = useTable({
    request,
    initParam: {
        stage: 20,
        status: 50,
    },
    dataCallBack: res => {
        let list = _.cloneDeep(res.list);
        // item 和 item.form字段合并
        list.forEach(item => {
            item = Object.assign(item, item.form);
        });
        return list;
    },
});

const $t = useI18n().t;
const tableColumns = computed(() => {
    let columns = [
        {
            title: $t('supply-chain.serial_number'),
            dataIndex: 'number',
            key: 'number',
            customRender: ({ text, record, index, column }) => {
                // 当前页码-1 * 每页条数 + 索引 + 1
                return (pagination.value.current - 1) * pagination.value.size + index + 1;
            },
        },
        {
            title: $t('supply-chain.supplier_full_name'),
            dataIndex: 'company_name',
            key: 'company_name',
            customRender: ({ text, record, index, column }) => {
                return text || '-';
            },
        },
        {
            title: $t('supply-chain.supplier_type'),
            dataIndex: 'purchase_category',
            key: 'purchase_category',
            customRender: ({ text, record, index, column }) => {
                return text || '-';
            },
        },
        // 免审核申请表
        {
            title: $t('supply-chain.exempt_application_form'),
            dataIndex: 'exempt_application_form',
            key: 'exempt_application_form',
        },
        // 操作
        {
            title: $t('def.operate'),
            dataIndex: 'operation',
            key: 'operation',
            width: 100,
            fixed: 'right',
        },
    ];
    return columns;
});
const searchList = ref([
    {
        type: 'input',
        value: '',
        searchParmas: 'company_name',
        key: 'supply-chain.supplier_full_name',
    },
]);

/* Fetch start*/

/* Fetch end*/

/* methods start*/
// 供应商详情
const onSearch = data => {
    searchParam.value = data;
    search();
};
const onReset = () => {
    refreshTable();
};

const handleViewForm = record => {
    console.log(record);
    console.log(route.fullPath);
    router.push({
        path: '/supply-manage/exemptApply',
        query: {
            id: record.id,
            redirect: route.fullPath,
        },
    });
};
const handleAudit = record => {
    console.log(record);
};
const handleView = record => {
    console.log(record);
};

/* methods end*/
</script>

<style lang="less" scoped></style>
