<template>
    <div class="payment-setting gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ /*支付设置*/ $t('distributor-detail.payment_settings') }}</div>
        </div>
        <div class="panel-content">
            <div class="content-area-list">
                {{ $t('distributor-detail.payment_tips') }}
                <a-input-number
                    :placeholder="$t('distributor-detail.please_enter_0_100')"
                    :min="0"
                    :max="100"
                    :step="1"
                    :precision="0"
                    v-model:value="spare_part_deduction_ratio"
                    addon-after="%"
                />
                <a-button type="primary" @click="handleSave">{{ $t('retail.confirm') }}</a-button>
            </div>
            <!-- 操作记录 按钮-->
            <div class="opreation" @click="handleOpen">
                <!-- 确定按钮 -->
                <div class="line-item">
                    {{ $t('distributor-detail.operation_record') }}
                </div>
            </div>
        </div>
        <div class="modal-area" ref="modalRefs">
            <!-- 弹框 调整额度-->
            <a-modal
                v-model:visible="visible"
                centered
                :getContainer="() => modalRefs"
                :title="$t('distributor-detail.operation_record')"
                @ok="handleOk"
                @cancel="handleCancel"
                :footer="null"
            >
                <div class="modal-content">
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
                                <!-- 序号 ： 当前页面 - 1 * 每页条数 + 索引 + 1 -->
                                <template v-if="column.key === 'id'">
                                    {{ (pagination.current - 1) * pagination.size + index + 1 }}
                                </template>
                                <!-- 操作记录 -->
                                <template v-else-if="column.key === 'operation_record'">
                                    <div class="operation_record">
                                        <!-- 操作人 -->
                                        <div class="operation_person">
                                            {{ record?.user?.name || '-' }}
                                        </div>
                                        <!-- 操作时间 -->
                                        <div class="operation_time">
                                            {{ Core.Util.timeFormat(record.create_time) }}
                                        </div>
                                        <!-- 事件 -->
                                        <div class="event">
                                            {{ $t('distributor-detail.deduction_amount') }}{{ record.content }}%
                                        </div>
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
                            :pageSizeOptions="['5', '10', '20', '30']"
                            @change="onPageChange"
                            @showSizeChange="onSizeChange"
                        />
                    </div>
                </div>
            </a-modal>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed, onMounted, ref } from 'vue';
import Core from '../../../core';
import { message } from 'ant-design-vue';
import { useTable } from '@/hooks/useTable';

const $t = useI18n().t;
const spare_part_deduction_ratio = ref(undefined);

const props = defineProps({
    detail: {
        type: Object,
        default: () => ({}),
    },
});
const modalRefs = ref(null);
const visible = ref(false);

const tableColumns = computed(() => {
    return [
        // 序号
        {
            title: $t('distributor-detail.serial_number'),
            dataIndex: 'id',
            key: 'id',
            width: 100,
            align: 'center',
        },
        // 操作记录
        {
            title: $t('distributor-detail.operation_record'),
            dataIndex: 'operation_record',
            key: 'operation_record',
            width: 200,
            align: 'center',
        },
    ];
});

const request = Core.Api.ActionLog.list;
const initParam = ref({
    org_id: props.detail.id,
    org_type: 15,
    type: 1002,
});
const INITIAL_PAGE_PARAMS = ref({
    // 当前页数
    current: 1,
    // 每页显示条数
    size: 5,
    // 总条数
    total: 0,
});
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
    initParam: initParam.value,
    INITIAL_PAGE_PARAMS: INITIAL_PAGE_PARAMS.value,
    dataCallBack: res => {
        spare_part_deduction_ratio.value = (res.list[0]?.content || 0) * 1;
        return res.list;
    },
});

const handleCancel = () => {
    visible.value = false;
};
const handleOk = () => {
    visible.value = false;
};
const handleOpen = () => {
    visible.value = true;
    // 刷新表格
    refreshTable();
};
const handleSave = () => {
    console.log('handleSave');
    let params = {
        id: props.detail.id,
        spare_part_deduction_ratio: spare_part_deduction_ratio.value,
        credit: props.detail.credit,
    };
    Core.Api.Distributor.updateCredit(params).then(res => {
        message.success($t('distributor-detail.operation_success'));
    });
};
</script>

<style lang="less" scoped>
.panel-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .content-area-list {
        display: flex;
        align-items: center;
        .ant-input-number-group-wrapper {
            margin-left: 16px;
            margin-right: 16px;
        }
    }
    .opreation {
        .line-item {
            color: #1890ff;
            cursor: pointer;
            text-decoration: underline;
        }
    }
}
.modal-area {
    :deep(.ant-modal-content) {
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
                text-align: center;
            }
        }
        .ant-modal-body {
            padding: 0;
            .paging-container {
                justify-content: center;
            }
        }
    }
}
</style>
