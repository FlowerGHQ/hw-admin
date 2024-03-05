<template>
    <div ref="wrap">
        <a-modal
            v-model:visible="visibility"
            :title="$t('supply-chain.price_change_records')"
            :okText="$t('item-bom.confirm')"
            :cancelText="$t('item-bom.cancel')"
            @ok="handleOk"
            width="720px"
            centered
            :closable="false"
            class="export-modal"
            @cancel="handCancle"
            :getContainer="() => wrap"
        >
            <div class="main">
                <a-table
                    :row-key="record => record.id"
                    :data-source="tableData"
                    :columns="tableColumns"
                    :pagination="pagination"
                    :loading="loading"
                    @change="handleTableChange"
                >
                    <template #headerCell="{ title, column }">
                        <div class="table-title">{{ title }}</div>
                    </template>
                    <template #bodyCell="{ column, text, record, index }">
                        <!-- 序号 -->
                        <template v-if="column.key === 'number'">
                            {{ index + 1 }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text ? text : '-' }}
                        </template>
                        <!-- 含税单价（人民币） -->
                        <template v-if="column.key === 'price'">
                            {{ $Util.Number.numFormat(text) }}
                        </template>
                        <!-- 修改记录 -->
                        <template v-if="column.key === 'content'">
                            <a-tooltip>
                                <template #title v-if="text">{{ text }}</template>
                                <span class="content" :title="text">{{ text ? text : '-' }}</span>
                            </a-tooltip>
                        </template>
                    </template>
                </a-table>
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Core from '@/core';

const { proxy } = getCurrentInstance();
const $t = useI18n().t;
const wrap = ref(null);

const emits = defineEmits(['update:visibility']);
const props = defineProps({
    bom_item_id: {
        type: [String, Number],
    },
    visibility: {
        type: Boolean,
        default: false,
    },
});
const loading = ref(false);
// 分页
const pagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: total => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`,
});
const tableColumns = computed(() => {
    const result = [
        { title: proxy.$t('supply-chain.serial_number'), dataIndex: 'number', key: 'number' }, // 序号
        { title: proxy.$t('supply-chain.unit_price_including_tax_rmb'), dataIndex: 'price', key: 'price' }, // 含税单价（人民币）
        { title: proxy.$t('supply-chain.type'), dataIndex: 'sync_type', key: 'item' }, // 类型
        { title: proxy.$t('supply-chain.effective_date'), dataIndex: 'effective_time', key: 'item' }, // 生效日期
        { title: proxy.$t('supply-chain.modifying_records'), dataIndex: 'content', key: 'content' }, // 修改记录
    ];
    return result;
});
const tableData = ref([]);
// 分页事件
const handleTableChange = (p, filters, sorter) => {
    pagination.value.current = p.current;
    pagination.value.pageSize = p.pageSize;
    getTableDataFetch();
};
// 获取表格list
const getTableDataFetch = (parmas = {}) => {
    if (!props.bom_item_id) return;
    loading.value = true;
    let obj = {
        bom_item_id: props.bom_item_id,
        page: pagination.value.current,
        page_size: pagination.value.pageSize,
        ...parmas,
    };

    Core.Api.Supplier.bomLogList(obj)
        .then(res => {
            pagination.value.total = res.count;
            tableData.value = res.list;
            loading.value = false;
        })
        .catch(err => {
            console.log('getTableDataFetch', err);
            loading.value = false;
        });
};
const handCancle = () => {
    emits('update:visibility', false);
};

const handleOk = () => {
    emits('update:visibility', false);
};
defineExpose({
    getTableDataFetch,
});
</script>

<style lang="less" scoped>
:deep(.export-modal) {
    .ant-modal-content {
        border-radius: 4px;
        .ant-modal-header {
            padding: 16px 24px;
            height: auto !important;
            border-color: #e2e2e2;
            .ant-modal-title {
                color: #1d2129;
                font-weight: 600;
                font-size: 16px;
                line-height: 1;
            }
        }
        .ant-modal-footer {
            text-align: center;
            .ant-btn {
                min-width: 60px;
                border-radius: 4px;
            }
        }
        .ant-modal-body {
            padding: 25px;
            max-height: 100% !important;
            .main {
                .title {
                    height: 32px;
                    padding: 6px 18px 6px 10px;
                    color: #1d2129;
                    font-weight: 500;
                    background-color: #f2f3f5;
                    border-radius: 4px;
                    margin-bottom: 18px !important;
                    display: inline-block;
                }
                .success-tips {
                    display: flex;
                    align-items: center;
                    margin-bottom: 4px;
                    .success-icon {
                        width: 16px;
                        height: 16px;
                        line-height: 1;
                        margin-right: 4px;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .success-text {
                        color: #26ab54;
                        margin-right: 4px;
                    }
                    .success-or-fail {
                        .success-txt {
                            color: #26ab54;
                        }
                        .fail-txt {
                            color: #f53f3f;
                        }
                    }
                }
                .tips {
                    margin-bottom: 11px;
                    background-color: #f8f8f8;
                    padding-top: 4px;
                    padding-bottom: 3px;
                    padding-left: 7px;
                    color: #666;
                }
                .table {
                    border-radius: 4px;
                    .ant-table-thead,
                    .ant-table-container,
                    tr,
                    th {
                        border-color: #e2e2e2 !important;
                    }
                    .ant-table-cell {
                        color: #1d2129 !important;
                        height: 32px !important;
                        padding: 0;
                        .overflow-ell {
                            padding: 0 8px;
                        }
                    }
                    .ant-table-body {
                        width: 100% !important;
                        table {
                            width: 100% !important;
                        }
                    }
                    .zero {
                        color: #bfbfbf;
                    }
                    .fail-number {
                        color: #f53f3f;
                    }
                }
            }
        }
    }
    .content {
        .ell();
        display: inline-block;
        max-width: 270px;
    }
}
</style>
