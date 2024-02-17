<template>
    <a-button class="ReportDetailBtn" :type="btnType" :ghost="ghost" @click="handleModalShow">
        <slot name="btnText">{{ btnText }}</slot>
    </a-button>
    <a-modal v-model:visible="modalShow" class="ReportDetailModal" title="测试详情" width="70%">
        <div class="modal-content">
            <a-table
                :columns="tableColumns"
                :data-source="data"
                :scroll="{ x: true }"
                :row-key="record => record.id"
                :pagination="false"
            >
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status" :class="$Util.valueFilter(text, 'TEST.STATUS_MAP', 'color')">
                            <i class="icon i_point" />{{ $Util.valueFilter(text, 'TEST.STATUS_MAP') }}
                        </div>
                    </template>

                    <template v-if="column.key === 'time_consumed'">
                        {{ $Util.timeConsumedFilter(record.begin_time, record.end_time) }}
                    </template>

                    <template v-if="column.key === 'case_name'">
                        {{ $Util.testCaseNameFilter(text, type) }}
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'tip_item'">
                        <a-tooltip placement="top" :title="text">
                            <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>

                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="handleResultModalShow(record)">查看结果详情</a-button>
                    </template>
                </template>
            </a-table>
        </div>
        <template #footer>
            <a-button @click="modalShow = false" type="primary">确认</a-button>
        </template>
    </a-modal>
    <a-modal v-model:visible="resultModalShow" class="ReportDetailResultModal" title="单项数据" width="60%">
        <div class="modal-content">
            <div class="section-title">基本信息</div>
            <div class="section-content">
                <div class="form-item">
                    <div class="key">测试项:</div>
                    <div class="value">{{ $Util.testCaseNameFilter(result.id, type) }}</div>
                </div>
                <div class="form-item">
                    <div class="key">状态:</div>
                    <div class="value">
                        <div class="status" :class="$Util.valueFilter(result.status, 'TEST.STATUS_MAP', 'color')">
                            <i class="icon i_point" />{{ $Util.valueFilter(result.status, 'TEST.STATUS_MAP') }}
                        </div>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">耗时:</div>
                    <div class="value">{{ $Util.timeConsumedFilter(result.begin_time, result.end_time) }}</div>
                </div>
                <div class="form-item">
                    <div class="key">开始时间:</div>
                    <div class="value">{{ $Util.timeFilter(result.begin_time) }}</div>
                </div>
                <div class="form-item">
                    <div class="key">结束时间:</div>
                    <div class="value">{{ $Util.timeFilter(result.end_time) }}</div>
                </div>
            </div>

            <template v-if="!$Util.isEmptyObj(result.data)">
                <div class="section-title">Data</div>
                <div class="section-content">
                    <pre class="json-pre">{{ result.data }}</pre>
                </div>
            </template>

            <template v-if="!$Util.isEmptyObj(result.success)">
                <div class="section-title green">Success</div>
                <div class="section-content">
                    <pre class="json-pre">{{ result.success }}</pre>
                </div>
            </template>

            <template v-if="!$Util.isEmptyObj(result.fail)">
                <div class="section-title red">Fail</div>
                <div class="section-content">
                    <pre class="json-pre">{{ result.fail }}</pre>
                </div>
            </template>
        </div>
        <template #footer>
            <a-button @click="resultModalShow = false" type="primary">确认</a-button>
        </template>
    </a-modal>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
const props = defineProps({
    btnType: { type: String, default: 'link' },
    btnText: { type: String, default: '查看详情' },
    ghost: {},

    data: {
        type: Array,
        default: () => {
            return [];
        },
    },
    type: { type: [String, Number] },
});

const tableColumns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '测试项', dataIndex: 'id', key: 'case_name' },
    { title: '报告结果', dataIndex: 'status' },
    { title: '开始时间', dataIndex: 'begin_time', key: 'time' },
    { title: '结束时间', dataIndex: 'end_time', key: 'time' },
    { title: '耗时', key: 'time_consumed' },
    { title: '操作', key: 'operation', fixed: 'right', width: '200px' },
];

const modalShow = ref(false);
function handleModalShow() {
    modalShow.value = true;
}

const resultModalShow = ref(false);
const result = ref({});
function handleResultModalShow(item) {
    result.value = item;
    resultModalShow.value = true;
}
</script>

<style lang="less" scoped>
.ReportDetailBtn.ant-btn-link {
    line-height: 0;
    text-align: center;
}
.ReportDetailResultModal {
    .section-title {
        font-size: 14px;
        font-weight: bold;
        background: @primary_l;
        color: @primary;
        padding: 5px 10px;
        &.green {
            background-color: @green_l;
            color: @green;
        }
        &.red {
            background-color: @red_l;
            color: @red;
        }
    }
    .section-content {
        padding: 10px;

        .form-item {
            margin-bottom: 6px;
        }
    }
    .json-pre {
        font-family: consolas, 'Courier New';
        word-break: break-all;
        display: block;
        white-space: pre-wrap;
        word-wrap: break-word;
        margin-bottom: 0;
    }
}
</style>
