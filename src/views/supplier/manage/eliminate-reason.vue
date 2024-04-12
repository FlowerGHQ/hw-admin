<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.elimination_reason') }}</div>
            <div class="btn-area">
                <!-- 新增原因 -->
                <a-button type="primary" @click="handleAddReason">
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
    <div class="modal-area">
        <a-modal v-model:visible="modalVisible" :title="modalTitle" @ok="handleModalSubmit" @cancel="handleModalCancel">
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">{{ $t('supply-chain.reason') }}</div>
                    <div class="value">
                        <a-input
                            v-model:value="editForm.name"
                            :placeholder="$t('def.input')"
                            maxlength="50"
                            showCount
                        />
                    </div>
                </div>
            </div>
            <!-- footer -->
            <template #footer>
                <a-button key="back" @click="handleModalCancel">{{ $t('def.cancel') }}</a-button>
                <a-button key="submit" type="primary" @click="handleModalSubmit">{{ $t('def.sure') }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Core from '@/core';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import Const from '../../../core/const';
import { message, Modal } from 'ant-design-vue';

let request = Core.Api.ItemCategory.tree;
const { loading, tableData, pagination, search, onPagenationChange, refreshTable, searchParam } = useTable({
    request,
    initParam: {
        type: 40,
        parent_id: 0,
        depth: 1,
    },
    isPageAble: false,
    dataCallBack: res => {
        return filterChildren(res.list);
    },
});
const $t = useI18n().t;
const tableColumns = computed(() => {
    let columns = [
        // 原因
        {
            title: $t('supply-chain.reason'),
            dataIndex: 'name',
            key: 'name',
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
const modalVisible = ref(false);
const modalTitle = ref('');
const editForm = ref({
    name: '',
});
const type = ref('');

const handleEdit = record => {
    modalTitle.value = $t('def.edit');
    type.value = 'edit';
    editForm.value = {
        name: record.name,
        id: record.id,
    };
    modalVisible.value = true;
};
const handleDelete = record => {
    Modal.confirm({
        title: $t('def.delete'),
        content: $t('supply-chain.delete_confirm'),
        onOk() {
            Core.Api.ItemCategory.delete({ id: record.id }).then(res => {
                message.success($t('pop_up.delete_success'));
                search();
            });
        },
    });
};
const handleAddReason = () => {
    modalVisible.value = true;
    type.value = 'add';
    modalTitle.value = $t('supply-chain.add_reason');
    editForm.value = {
        name: '',
    };
};
const handleModalSubmit = () => {
    let params;
    if (type.value === 'edit') {
        params = {
            id: editForm.value.id,
            name: editForm.value.name,
            type: 40,
        };
    } else {
        params = {
            name: editForm.value.name,
            parent_id: 0,
            type: 40,
        };
    }
    Core.Api.ItemCategory.save(params).then(res => {
        message.success(
            type.value === 'edit'
                ? $t('supply-chain.edit_reason_successfully')
                : $t('supply-chain.add_reason_successfully'),
        );
        handleModalCancel();
        search();
    });
};
const handleModalCancel = () => {
    modalVisible.value = false;
    editForm.value = {
        name: '',
    };
    modalTitle.value = '';
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
/* methods end*/
</script>

<style lang="less" scoped>
.form-item .key {
    width: 60px;
}
</style>
