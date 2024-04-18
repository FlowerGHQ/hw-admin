<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.elimination_reason') }}</div>
            <div class="btn-area">
                <!-- 新增原因 -->
                <a-button type="primary" @click="handleAddReason" :disabled="tableData && tableData.length >= 50">
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
                <a-form :model="editForm" :rules="rules" ref="formRef">
                    <a-form-item
                        :label="$t('supply-chain.reason')"
                        name="name"
                        :label-col="{ span: 4 }"
                        :wrapper-col="{ span: 18 }"
                    >
                        <a-input
                            v-model:value="editForm.name"
                            :placeholder="$t('def.input')"
                            maxlength="50"
                            showCount
                        />
                    </a-form-item>
                </a-form>
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
import { ref, computed, getCurrentInstance, h } from 'vue';
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
        // 序号
        {
            title: $t('supply-chain.serial_number'),
            dataIndex: 'number',
            key: 'number',
            customRender: ({ text, record, index, column }) => {
                // 当前页码-1 * 每页条数 + 索引 + 1
                return (pagination.value.current - 1) * pagination.value.size + index + 1;
            },
        },
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
const formRef = ref(null);
const rules = {
    name: [
        {
            required: true,
            message: $t('def.input') + $t('supply-chain.reason'),
            trigger: 'blur',
        },
    ],
};

const type = ref('');
const appContext = getCurrentInstance().appContext;
const handleEdit = record => {
    modalTitle.value = $t('def.edit');
    type.value = 'edit';
    editForm.value = {
        name: record.name,
        id: record.id,
    };
    modalVisible.value = true;
};

const ModalRender = () => {
    return h('div', {}, [
        h('div', {}, $t('supply-chain.delete_confirm1')),
        h('div', {}, $t('supply-chain.delete_confirm2')),
        h(
            'div',
            {
                style: {
                    marginTop: '10px',
                },
            },
            $t('supply-chain.delete_confirm3'),
        ),
    ]);
};
const handleDelete = record => {
    console.log(appContext);
    Modal.confirm({
        title: $t('supply-chain.delete_confirm'),
        appContext,
        content: h => ModalRender(),
        centered: true,
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
    formRef.value.validate().then(() => {
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
    });
};
const handleModalCancel = () => {
    modalVisible.value = false;
    editForm.value = {
        name: '',
    };
    modalTitle.value = '';
    formRef.value.resetFields();
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
