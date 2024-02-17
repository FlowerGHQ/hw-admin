<template>
    <div ref="wrap">
        <a-modal
            v-model:visible="visibility"
            :title="$t('item-bom.import_category_data')"
            :okText="$t('item-bom.confirm')"
            :cancelText="$t('item-bom.cancel')"
            @ok="handleOk"
            width="570px"
            centered
            :closable="false"
            class="export-modal"
            @cancel="handCancle"
            :getContainer="() => wrap"
        >
            <div class="main">
                <span class="title">{{ $t('item-bom.change_version_number') }}{{ `：${versionName}` }}</span>
                <div class="success-tips">
                    <div class="success-icon">
                        <img src="../../../../assets/images/bom/ok.png" alt="" />
                    </div>
                    <div class="success-text">
                        {{ $t('item-bom.parsing_completion') }}
                    </div>
                    <div class="success-or-fail">
                        {{ $t('item-bom.parsing_success') }}
                        <span class="success-txt">{{ successCount }}</span>
                        {{ $t('item-bom.strip') }} {{ $t('item-bom.data') }}，
                        {{ $t('item-bom.failure') }}
                        <span class="fail-txt">{{ failCount }}</span>
                        {{ $t('item-bom.strip') }}
                    </div>
                </div>
                <div class="tips">
                    {{ $t('item-bom.import_failure_data') }}
                </div>
                <div class="table">
                    <a-table
                        :columns="tableColumns"
                        :data-source="tableData"
                        bordered
                        size="small"
                        :pagination="false"
                        :scroll="{ x: true, y: 282 }"
                    >
                        <template #bodyCell="{ record, column, text }">
                            <!-- category_name -->
                            <div v-if="column.key === 'category'">
                                <a-tooltip :title="text">
                                    <div class="ell overflow-ell">{{ text }}</div>
                                </a-tooltip>
                            </div>
                            <div v-if="column.key === 'parsing_failure_number'">
                                <span class="zero" v-if="record.fail_count == 0">0</span>
                                <span class="fail-number" v-else>{{ text }}</span>
                            </div>
                        </template>
                    </a-table>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Core from '@/core';

const $t = useI18n().t;
const wrap = ref(null);
// 成功列表
const correctList = ref([]);
// 成功总条数
const successCount = ref(0);
// 失败总条数
const failCount = ref(0);

const emits = defineEmits(['update:visibility', 'refresh']);
const props = defineProps({
    objData: {
        type: Object,
        default: () => {},
    },
    visibility: {
        type: Boolean,
        default: false,
    },
    versionName: {
        type: String,
        default: '',
    },
    bom_version_id: {
        type: String,
        default: '',
    },
});

watch(
    () => props.objData,
    (newVal, oldVal) => {
        let success_count = 0;
        let fail_count = 0;
        correctList.value = newVal?.correctList;
        tableData.value = newVal?.statistics;
        tableData.value.forEach(item => {
            success_count += Number(item.success_count);
            fail_count += Number(item.fail_count);
        });
        successCount.value = success_count;
        failCount.value = fail_count;
    },
    {
        deep: true,
    },
);
const tableColumns = computed(() => {
    const result = [
        {
            title: $t('item-bom.category'),
            dataIndex: 'category_name',
            key: 'category',
            align: 'center',
        },
        {
            title: $t('item-bom.parsing_success_number'),
            dataIndex: 'success_count',
            key: 'parsing_success_number',
            align: 'center',
        },
        {
            title: $t('item-bom.parsing_failure_number'),
            dataIndex: 'fail_count',
            key: 'parsing_failure_number',
            align: 'center',
        },
    ];
    return result;
});

// 成功失败数据显示列表
const tableData = ref([]);

const handCancle = () => {
    emits('update:visibility', false);
};

const handleOk = () => {
    Core.Api.ITEM_BOM.importBindBomItem({
        bom_version_id: props.bom_version_id,
        item_list: correctList.value,
    })
        .then(res => {
            console.log('importBindBomItem', res);
            emits('refresh');
        })
        .catch(err => {
            console.log('err', err);
        })
        .finally(() => {
            emits('update:visibility', false);
        });
};
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
}
</style>
