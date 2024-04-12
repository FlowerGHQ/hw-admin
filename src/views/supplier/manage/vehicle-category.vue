<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.vehicle_classification_management') }}</div>
            <div class="btn-area">
                <!-- 新增分类 -->
                <a-button type="primary">
                    <template #icon><PlusOutlined /></template>
                    {{ $t('supply-chain.add_classification') }}
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
            </a-table>
        </div>
    </div>
</template>

<script setup lang="jsx">
import { ref, computed, reactive, withDirectives } from 'vue';
import Core from '@/core';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import { PlusOutlined } from '@ant-design/icons-vue';
import _ from 'lodash';

function request(params) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                list: [
                    {
                        id: 1,
                        name: '分类1',
                        level: 1,
                        children: [
                            {
                                id: 11,
                                name: '子分类1',
                                level: 2,
                                children: null,
                            },
                        ],
                    },
                ],
                count: 1,
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
        // 分类名称
        {
            title: $t('supply-chain.classification_name'),
            dataIndex: 'name',
            key: 'name',
        },
        // 操作
        {
            title: $t('sales-strategy-management.operation'),
            key: 'operation',
            fixed: 'right',
            width: 200,
            customRender: ({ text, record, index }) => {
                return (
                    <div>
                        <a-button type="link" onClick={record => handleAdd(record)}>
                            {$t('i.edit_name')}
                        </a-button>
                        {record.level == 1 ?? (
                            <a-button type="link" onClick={record => handleEdit(record)}>
                                {$t('i.subcategory')}
                            </a-button>
                        )}
                        <a-button type="link" danger onClick={record => handleDelete(record)}>
                            {$t('n.delete')}
                        </a-button>
                    </div>
                );
            },
        },
    ];
    return columns;
});

const handleAdd = () => {
    console.log('新增分类');
};
const handleEdit = () => {
    console.log('编辑');
};
const handleDelete = () => {
    console.log('删除');
};

/* methods end*/
</script>

<style lang="less" scoped></style>
