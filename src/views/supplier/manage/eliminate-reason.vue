<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.elimination_reason') }}</div>
            <div class="btn-area">
                <!-- 新增原因 -->
                <a-button type="primary">
                    <template #icon><PlusOutlined /></template>
                    {{ $t('supply-chain.add_reason') }}
                </a-button>
            </div>
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
                <template #bodyCell="{ column, text, record }">
                    <!-- 操作 -->
                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="handleEdit(record)">{{ $t('def.edit') }}</a-button>
                        <a-button type="link" danger @click="handleDelete(record)">{{ $t('def.delete') }}</a-button>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Core from '@/core';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
// const request = Core.Api.Supplier.list;

function request() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                list: [
                    {
                        id: 1,
                        reason: '原因1',
                    },
                    {
                        id: 2,
                        reason: '原因2',
                    },
                ],
                count: 2,
            });
        }, 1000);
    });
}

const { loading, tableData, pagination, search, onPagenationChange, refreshTable, searchParam } = useTable({
    request,
});
const $t = useI18n().t;
const tableColumns = computed(() => {
    let columns = [
        // 原因
        {
            title: $t('supply-chain.reason'),
            dataIndex: 'reason',
            key: 'reason',
        },
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

const handleEdit = record => {
    console.log('编辑', record);
};
const handleDelete = record => {
    console.log('删除', record);
};

/* methods end*/
</script>

<style lang="less" scoped></style>
