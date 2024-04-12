<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.vehicle_classification_management') }}</div>
            <div class="btn-area">
                <!-- 新增分类 -->
                <a-button type="primary" @click="handleAdd()">
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
                <!-- bodyCell -->
                <template #bodyCell="{ column, text, record, index }">
                    <!-- 操作 -->
                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="handleEdit(record)">
                            {{ $t('i.edit_name') }}
                        </a-button>
                        <a-button type="link" @click="handleAdd(record)" v-if="record.level < 2">
                            {{ $t('i.subcategory') }}
                        </a-button>
                        <a-button type="link" danger @click="handleDelete(record)">{{ $t('n.delete') }} </a-button>
                    </template>
                </template>
            </a-table>
        </div>
        <div class="modal-area">
            <a-modal
                v-model:visible="modalVisible"
                :title="modalTitle"
                @ok="handleModalSubmit"
                @cancel="handleModalCancel"
            >
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('m.category_name') }}</div>
                        <div class="value">
                            <a-input v-model:value="editForm.name" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </div>
            </a-modal>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, withDirectives } from 'vue';
import Core from '@/core';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import _ from 'lodash';
const $t = useI18n().t;

let request = Core.Api.ItemCategory.tree;
const { loading, tableData, pagination, search, onPagenationChange, refreshTable, searchParam } = useTable({
    request,
    initParam: {
        type: 30,
        parent_id: 0,
        depth: 2,
    },
    isPageAble: false,
    dataCallBack: res => {
        console.log(filterChildren(res.list));
        return filterChildren(res.list);
    },
});

const tableColumns = computed(() => {
    let columns = [
        {
            title: $t('supply-chain.classification_name'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: $t('sales-strategy-management.operation'),
            key: 'operation',
            fixed: 'right',
            width: 200,
        },
    ];
    return columns;
});
const modalVisible = ref(false);
const editForm = reactive({
    id: '',
    name: '',
});
const modalTitle = ref('');
const type = ref('');

const handleAdd = (record = null) => {
    modalVisible.value = true;
    if (record) {
        editForm.id = record.id;
        editForm.parent_id = record.id;
        editForm.name = '';
        modalTitle.value = $t('i.subcategory');
        type.value = 'addSub';
    } else {
        editForm.id = '';
        editForm.parent_id = '';
        editForm.name = '';
        modalTitle.value = $t('i.add_category');
        type.value = 'add';
    }
};
const handleEdit = record => {
    modalTitle.value = $t('supply-chain.edit_classification');
    modalVisible.value = true;
    type.value = 'edit';
    editForm.id = record.id;
    editForm.name = record.name;
};
const handleDelete = record => {
    Modal.confirm({
        title: $t('supply-chain.delete_classification'),
        content: $t('supply-chain.delete_classification_warning'),
        onOk() {
            Core.Api.ItemCategory.delete({ id: record.id }).then(res => {
                message.success($t('supply-chain.delete_classification_successfully'));
                search();
            });
        },
    });
};
const handleModalSubmit = () => {
    let params = {
        name: '',
        parent_id: 0,
        type: 30,
    };

    if (type.value === 'edit') {
        params.id = editForm.id;
        params.name = editForm.name;
        delete params.parent_id;
    } else {
        if (editForm.id) {
            params.parent_id = editForm.parent_id;
            params.name = editForm.name;
        } else {
            params.name = editForm.name;
            params.parent_id = 0;
        }
    }

    Core.Api.ItemCategory.save(params).then(res => {
        message.success(
            type.value === 'edit'
                ? $t('supply-chain.edit_classification_successfully')
                : $t('supply-chain.add_classification_successfully'),
        );
        handleModalCancel();
        search();
    });
};
const handleModalCancel = () => {
    modalVisible.value = false;
    editForm.id = '';
    editForm.name = '';
    editForm.parent_id = 0;
    type.value = '';
};
const filterChildren = (arr, level = 0) => {
    level++;
    arr.forEach(item => {
        item.level = level;
        if (item.has_children && item.children.length > 0) {
            filterChildren(item.children, level);
        } else {
            item.children = null;
        }
    });
    return arr;
};
</script>

<style lang="less" scoped></style>
