<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.create_data') }}</div>
        </div>
        <div class="tabs-container colorful">
            <a-tabs v-model:activeKey="searchParam.status" @change="handleTableChange">
                <a-tab-pane :key="item.key" v-for="item of STATUS_LIST">
                    <template #tab>
                        <div class="tabs-title">
                            {{ item[$i18n.locale] }}<span :class="item.color">{{ item.value }}</span>
                        </div>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll :options="searchList" :isShowMore="false" @search="onSearch" @reset="onReset" ref="MySearchAll">
            </SearchAll>
        </div>
        <!-- table -->
        <div class="table-container">
            <div class="button-area m-b-10">
                <a-button
                    type="primary"
                    @click="onBtn"
                    v-if="$auth('supply.supplier-manage.save-supplier.save-supplier')"
                >
                    {{ $t('supply-chain.create_data') }}
                </a-button>
                <!-- 特批为合格供应商 -->
                <a-button type="primary" @click="handleApproval" v-show="selectedIds && selectedIds.length > 0">
                    {{ $t('supply-chain.special_approval_qualified_supplier') }}
                </a-button>
            </div>
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :loading="loading"
                :row-key="record => record.id"
                :row-selection="{
                    onChange: (selectedRowKeys, selectedRows) => handleSelectChange(selectedRowKeys, selectedRows),
                    selectedRowKeys: selectedIds,
                    getCheckboxProps: record => ({
                        disabled: record.stage === 30 || record.stage === 40,
                    }),
                }"
                :pagination="false"
            >
                <template #bodyCell="{ column, text, record, index }">
                    <!-- 序号 -->
                    <template v-if="column.key === 'number'">
                        {{ (pagination.current - 1) * pagination.size + index + 1 }}
                    </template>
                    <!-- 公司名称 -->
                    <template v-if="column.key === 'company_name'">
                        {{ text || '-' }}
                    </template>
                    <!-- 供应商类型 -->
                    <template v-if="column.key === 'type'">
                        {{ Core.Const.SUPPLAY.SUPPLAY_TYPE[text] ? $t(Core.Const.SUPPLAY.SUPPLAY_TYPE[text]?.t) : '-' }}
                    </template>
                    <!-- 提交时间 -->
                    <template v-if="column.key === 'create_time'">
                        {{ text ? $Util.timeFormat(text) : '-' }}
                    </template>
                    <!-- qualified_record -->
                    <template v-if="column.key === 'qualified_record'">
                        <a-button type="link" @click="onViewReason(record)" v-if="record.stage === 40">
                            {{ $t('supply-chain.view') }}
                        </a-button>
                        <span v-else>无</span>
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'operations'">
                        <a-button type="link" @click="onView('add', record)">
                            <MySvgIcon icon-class="supply-view" />
                            <span class="m-l-10">{{ $t('supply-chain.view') }}</span>
                        </a-button>
                        <a-button type="link" @click="onView('edit', record)">
                            <MySvgIcon icon-class="supply-edit" />
                            <span class="m-l-10">{{ $t('common.edit') }}</span>
                        </a-button>
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
                :pageSizeOptions="['10', '20', '30', '40']"
                @change="onPageChange"
                @showSizeChange="onSizeChange"
            />
        </div>
        <div class="modal-area" ref="modalAreaRef">
            <!-- 特批弹窗 -->
            <Modal
                :title="$t('supply-chain.special_approval_qualified_supplier')"
                v-model:visible="approvalVisible"
                @ok="handleApprovalOk"
                @cancel="handleApprovalCancel"
                wrapClassName="area-you-sure"
                :getContainer="() => modalAreaRef"
            >
                <div class="area-you-sure">
                    {{ $t('supply-chain.whether_to') }}{{ selectNameStr
                    }}{{ $t('supply-chain.adjust_to_qualified_supplier') }}
                </div>
            </Modal>
            <!-- 合格记录 -->
            <Modal
                :title="$t('supply-chain.qualified_record')"
                v-model:visible="qualifiedRecordVisible"
                @ok="handleQualifiedRecordOk"
                @cancel="handleQualifiedRecordCancel"
                wrapClassName="qualified-record"
                :getContainer="() => modalAreaRef"
                width="800px"
            >
                <!-- table -->
                <a-table
                    :columns="qualifiedTableColumns"
                    :data-source="qualifiedTableData"
                    :scroll="{ x: true }"
                    :loading="loading"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record, index }">
                        <!-- 附件 -->
                        <template v-if="column.key === 'attachment'">
                            <div class="attachment" v-if="record.attachment && record.attachment.length > 0">
                                <a-image
                                    v-for="item in record.attachment"
                                    :width="60"
                                    :height="60"
                                    :src="$Util.imageFilter(item)"
                                    fallback="无"
                                />
                            </div>
                            <span v-else>无</span>
                        </template>
                    </template>
                </a-table>
            </Modal>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, watch, reactive } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import EditTableCell from './components/edit-table-cell.vue';
import _ from 'lodash';
import { Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';

const $store = useStore();
const router = useRouter();
const route = useRoute();
const $t = useI18n().t;
const selectedIds = ref([]);
const selectedRowObjs = ref([]);
const selectNameStr = ref('');
const approvalVisible = ref(false);
const modalAreaRef = ref(null);
const qualifiedRecordVisible = ref(false);
const qualifiedTableData = ref([]);
const auditStatusMap = reactive({
    90: { text: '特批合格', value: 1501 },
    110: { text: '免审合格', value: 1502 },
});
const $auth = Core.Util.auth;

const AUDIT_STATUS = reactive(Core.Const.SUPPLAY.AUDIT_STATUS);
const STAGE_LIST = reactive(Core.Const.SUPPLAY.STAGE);
const STATUS_LIST = reactive(Core.Const.SUPPLAY.STATUS_LIST);

const tableColumns = computed(() => {
    let columns = [
        { title: $t('supply-chain.serial_number'), dataIndex: 'number', key: 'number' },
        { title: $t('supply-chain.supplier_full_name'), dataIndex: 'company_name', key: 'company_name' },
        { title: $t('supply-chain.supplier_type'), dataIndex: 'type', key: 'type' },
        { title: $t('supply-chain.submission_time'), dataIndex: 'create_time', key: 'create_time' },
        // 供应商阶段
        {
            title: $t('supply-chain.supplier_stage'),
            dataIndex: 'stage',
            key: 'stage',
            customRender: ({ text, record, index }) => {
                return STAGE_LIST[text] ? $t(STAGE_LIST[text].t) : '-';
            },
        },
        // 状态
        {
            title: $t('supply-chain.status'),
            dataIndex: 'audit_status',
            key: 'audit_status',
            customRender: ({ text, record, index }) => {
                return AUDIT_STATUS[text] ? $t(AUDIT_STATUS[text].t) : '-';
            },
        },
        // 备注
        {
            title: $t('supply-chain.eliminate_reason'),
            dataIndex: 'remark',
            key: 'remark',
            customRender: ({ text, record, index }) => {
                return text && record.stage === 30 ? text : '无';
            },
        },
        // 合格记录
        {
            title: $t('supply-chain.qualified_record'),
            dataIndex: 'qualified_record',
            key: 'qualified_record',
        },
        { title: $t('common.operations'), key: 'operations', fixed: 'right', width: 150 },
    ];
    // $auth('supply.supplier-manage.save-supplier.view')
    if (!$auth('supply.supplier-manage.save-supplier.view')) {
        // 过滤operations
        columns = columns.filter(item => item.key !== 'operations');
    }
    return columns;
});
const qualifiedTableColumns = computed(() => {
    // 操作人 操作时间 合格途径 原因 附件
    let columns = [
        {
            title: $t('supply-chain.operator'),
            dataIndex: 'operator',
            key: 'operator',
            customRender: ({ text, record, index }) => {
                return record?.user?.account?.name || '-';
            },
        },
        {
            title: $t('supply-chain.operation_time'),
            dataIndex: 'create_time',
            key: 'create_time',
            customRender: ({ text, record, index }) => {
                return text ? Core.Util.timeFormat(record.create_time) : '-';
            },
        },
        {
            title: $t('supply-chain.qualified_approach'),
            dataIndex: 'type',
            key: 'type',
            customRender: ({ text, record, index }) => {
                return record?.type ? (record.type == 1501 ? '特批合格' : record.type == 1502 ? '免审合格' : '-') : '-';
            },
        },
        {
            title: $t('supply-chain.reason'),
            dataIndex: 'remark',
            key: 'remark',
            customRender: ({ text, record, index }) => {
                return text ? text : '无';
            },
        },
        { title: $t('supply-chain.attachment'), dataIndex: 'attachment', key: 'attachment' },
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
    {
        type: 'select',
        value: undefined,
        searchParmas: 'type',
        key: 'supply-chain.supplier_type',
        selectMap: Core.Const.SUPPLAY.SUPPLAY_TYPE,
    },
    {
        type: 'time-range',
        value: [],
        searchParmas: ['begin_time', 'end_time'],
        key: 'supply-chain.submission_time',
        defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_E,
    },
    {
        // 供应商阶段
        type: 'select',
        value: undefined,
        searchParmas: 'stage',
        key: 'supply-chain.supplier_stage',
        selectMap: Core.Const.SUPPLAY.STAGE_LIST,
    },
]);
const MySearchAll = ref(null);
const request = Core.Api.SUPPLY.adminList;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
});

const handleSelectChange = (selectedRowKeys, selectedRows) => {
    selectedIds.value = selectedRowKeys;
    selectedRowObjs.value = selectedRows;
    selectNameStr.value = selectedRows
        .map(item => item.company_name)
        .filter(item => item)
        .join('、');
};

const handleTableChange = key => {
    searchParam.value = Object.assign(searchParam.value, MySearchAll.value.getSearchFrom());
    search();
};

const onSearch = data => {
    searchParam.value = Object.assign(searchParam.value, data);
    search();
};
const onReset = () => {
    Object.keys(searchParam.value).forEach(key => {
        if (key !== 'status') {
            searchParam.value[key] = undefined;
        }
    });
    search();
};
// 点击查看
const onView = (type, record) => {
    let routeUrl = null;
    switch (type) {
        case 'add':
            router.push({
                path: '/supply-manage/detail',
                query: {
                    id: record.id,
                },
            });

            break;
        case 'edit':
            router.push({
                path: '/supply-manage/detail',
                query: {
                    id: record.id,
                    flag_edit: true,
                },
            });
            break;
    }
};
const onBtn = () => {
    router.push({
        path: '/supply-manage/add',
    });
    $store.commit('SUPPLY_CHAIN/setSupplyChain', {});
    $store.commit('SUPPLY_CHAIN/setSupplyDraftChain', {});
    $store.commit('SUPPLY_CHAIN/setStep', 0);
    $store.commit('SUPPLY_CHAIN/setSubmitEd', false);
};
// 获取各个状态的数量
const getStatusCount = () => {
    Core.Api.SUPPLY.countStatus().then(res => {
        STATUS_LIST.forEach(item => {
            let obj = res.list.find(v => v.status === item.key);
            item.value = obj ? obj.count : 0;
        });
        let all_total = res.list.reduce((total, item) => {
            return total + item.count;
        }, 0);
        STATUS_LIST[0].value = all_total;
        console.log('STATUS_LIST', STATUS_LIST);
    });
};
const tabCellSave = ({ record, index, column }) => {
    console.log('record', record);
    console.log('index', index);
    console.log('column', column);
};
// handleApproval
const handleApproval = () => {
    if (selectedIds.value.length === 0) {
        message.error($t('supply-chain.please_select_supplier'));
        return;
    }
    approvalVisible.value = true;
};
// handleApprovalOk
const handleApprovalOk = () => {
    Core.Api.SUPPLY.batchUpdateStage({ id_list: selectedIds.value }).then(res => {
        approvalVisible.value = false;
        //清空选中
        selectedIds.value = [];
        selectedRowObjs.value = [];
        selectNameStr.value = '';
        refreshTable();
    });
};
const handleApprovalCancel = () => {
    approvalVisible.value = false;
    // 清空选中
    selectedIds.value = [];
    selectedRowObjs.value = [];
    selectNameStr.value = '';
};
const handleQualifiedRecordOk = () => {
    console.log('handleQualifiedRecordOk');
    qualifiedRecordVisible.value = false;
};
const handleQualifiedRecordCancel = () => {
    qualifiedRecordVisible.value = false;
};
// 查看合格记录
const onViewReason = record => {
    console.log('record', record);
    let params = {
        type: auditStatusMap[record.audit_status] ? auditStatusMap[record.audit_status].value : '',
        source_id: record.id,
        source_type: 150, //申请供应商类型
    };
    // // 获取表格数据
    Core.Api.ActionLog.list(params).then(res => {
        qualifiedTableData.value = res.list;
        // 处理附件
        if (qualifiedTableData.value.length > 0) {
            qualifiedTableData.value.forEach(item => {
                if (item.content) {
                    item.attachment = item.content.split(',');
                }
            });
        }
        console.log('qualifiedTableData', qualifiedTableData.value);
        qualifiedRecordVisible.value = true;
    });
};

onMounted(() => {
    getStatusCount();
});
</script>

<style lang="less" scoped>
.supply-edit {
    margin-left: 6px;
    cursor: pointer;
}
:deep(.area-you-sure),
:deep(.qualified-record) {
    .ant-modal-header,
    .ant-modal-footer {
        text-align: center;
    }
}
:deep(.ant-table-cell) {
    .attachment {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        img {
            cursor: pointer;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
