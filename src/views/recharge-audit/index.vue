<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t(/*充值审核*/ 'payment-management.recharge_audit') }}
            </div>
        </div>
        <div class="tabs-container colorful" v-if="!purchaseMode">
            <a-tabs v-model:activeKey="searchParam.status" @change="handleSearch">
                <a-tab-pane :key="item.key" v-for="item of statusList">
                    <template #tab>
                        <div class="tabs-title">
                            {{ item[$i18n.locale] }}
                            <!-- <span :class="item.color">{{ item.value }}</span> -->
                        </div>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll :options="searchList" :isShowMore="false" @search="onSearch" @reset="onReset" ref="searchAllRef">
            </SearchAll>
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
                <template #bodyCell="{ column, text, record, index }">
                    <!-- 序号 -->
                    <template v-if="column.key === 'number'">
                        {{ index + 1 }}
                    </template>
                    <template v-if="column.key === 'item'">
                        <a-tooltip placement="topLeft">
                            <template #title>{{ text || '-' }}</template>
                            <div
                                class="one-spils cursor"
                                :style="{
                                    width: text?.length > 15 ? 7 * 12 + 'px' : '',
                                }"
                            >
                                {{ text || '-' }}
                            </div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'info'">
                        <a-tooltip placement="topLeft">
                            <template #title>
                                <div v-for="item in tableFields" :key="item.key">
                                    <div>
                                        {{ item.label }}:
                                        <div>
                                            {{ record.content_json.payment_information[item.key] || '-' }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <div class="ell mw160">
                                BENEFICIARY BANK: {{ record.content_json.payment_information.beneficiary_bank || '-' }}
                                SWIFT CODE: {{ record.content_json.payment_information.swift_code || '-' }}
                                BANK ADDRESS: {{ record.content_json.payment_information.bank_address || '-' }}
                                ACCOUNT NUMBER: {{ record.content_json.payment_information.account_number || '-' }}
                                COMPANY NAME: {{ record.content_json.payment_information.company_name || '-' }}
                                COMAPANY ADDRESS: {{ record.content_json.payment_information.company_address || '-' }}
                                {{ $t(/*其他汇款信息*/'payment-management.other_remittance_info') }}: {{ record.content_json.payment_information.remark || '-' }}
                            </div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'status'">
                        <div
                            class="status-box"
                            :class="$Util.auditStatusFilter(text, 'color')"
                        >
                            {{ $Util.auditStatusFilter(text, 'text', [$i18n.locale]) }}
                        </div>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ text ? $Util.timeFormat(text) : '-' }}
                    </template>
                    <template v-if="column.key === 'money'">
                        {{ record.currency === 'EUR' ? '€' : '$' }}{{ text ? $Util.countFilter(text) : '-' }}
                    </template>
                    <template v-if="column.key === 'log'">
                        <div v-if="record.action_log.user_name || record.action_log.create_time || record.action_log.content || record.action_log.remark">
                            {{ record.action_log.user_name || '-' }}, 
                            {{ $Util.timeFormat(record.action_log.create_time) || '-' }}, 
                            {{ record.action_log.content || '-' }}
                            <span 
                                v-if="record.status === Core.Const.AUDIT_MANAGEMENT.AUDIT_STATUS_MAP.REJECT_FIRST || 
                                    record.status === Core.Const.AUDIT_MANAGEMENT.AUDIT_STATUS_MAP.REJECT_SECOND"
                            >
                                {{ $t(/*原因*/'n.reason') }}:{{ record.action_log.remark || '-' }}
                            </span>
                        </div>
                        <div v-else>
                            -
                        </div>
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'operations'">
                        <a-button type="link" @click="routerChange('detail', record)">
                            <MySvgIcon icon-class="eyes-icon" class-name="eyes" />
                            <span class="m-l-10">{{ $t(/*查看详情*/'item_order.see_detail') }}</span>
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
    </div>
</template>

<script setup>
import { onMounted, ref, computed, getCurrentInstance } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
const router = useRouter();
const $t = useI18n().t;
const searchAllRef = ref(null);
const { proxy } = getCurrentInstance();
import MySvgIcon from '@/components/MySvgIcon/index.vue';
const tableColumns = computed(() => {
    let columns = [
        { title: $t(/*序号*/ 'n.index'), dataIndex: 'id', key: 'number' },
        { title: $t(/*充值单号*/ 'payment-management.recharge_order_number'), dataIndex: ['content_json', 'recharge_uid'], key: 'item' },
        { title: $t(/*分销商名称*/ 'payment-management.distributor_name'), dataIndex: 'name', key: 'item' },
        { title: $t(/*提交申请时间*/ 'payment-management.app_submit_time'), dataIndex: 'create_time', key: 'time' },
        { title: $t(/*收款账号信息*/ 'payment-management.receiving_acc_info'), dataIndex: ['content_json', 'payment_information'], key: 'info' },
        { title: $t(/*整车余额充值金额*/ 'payment-management.vehicle_balance_amount'), dataIndex: ['content_json', 'vehicle_balance'], key: 'money' },
        { title: $t(/*配件余额充值金额*/ 'payment-management.spare_parts_balance_amount'), dataIndex: ['content_json', 'part_balance'], key: 'money' },
        { title: $t(/*总充值金额*/ 'payment-management.total_top_up_amount'), dataIndex: ['content_json', 'total_amount'], key: 'money' },
        { title: $t(/*状态*/ 'payment-management.state'), dataIndex: 'status', key: 'status' },
        { title: $t(/*操作记录*/ 'payment-management.operation_record'), dataIndex: 'action_log', key: 'log' },
        { title: $t(/*操作*/ 'common.operations'), key: 'operations', fixed: 'right' },
    ];
    return columns;
});
const statusList = computed(() => {
    let list = [
        { zh: '全  部', en: 'All', value: 0, color: 'primary', key: 0 },
        { zh: '等待二审', en: 'Pending Second Audit', value: 0, color: 'yellow', key: 4 },        
        { zh: '二审通过', en: 'Approval Second Audit', value: 0, color: 'yellow', key: 2 },
        { zh: '二审不通过', en: 'The Second Audit Was Rejected', value: 0, color: 'yellow', key: 5 },
    ];
    if(Core.Data.getAuthority()['recharge-review.first_instance']) {
        list.push({ zh: '等待一审', en: 'Pending First Audit', value: 0, color: 'yellow', key: 1 })
        list.push({ zh: '一审不通过', en: 'The First Audit Was Rejected', value: 0, color: 'yellow', key: 3 })
    }
    return list;
})
const tableFields = ref([
    { key: 'beneficiary_bank', label: 'BENEFICIARY BANK' },
    { key: 'swift_code', label: 'SWIFT CODE' },
    { key: 'bank_address', label: 'BANK ADDRESS' },
    { key: 'account_number', label: 'ACCOUNT NUMBER' },
    { key: 'company_name', label: 'COMPANY NAME' },
    { key: 'company_address', label: 'COMPANY ADDRESS' },
    { key: 'remark', label: $t(/*其他汇款信息*/'payment-management.other_remittance_info') }
])
const searchList = ref([
    // 名称
    {
        type: 'input',
        value: '',
        searchParmas: 'name',
        key: 'payment-management.name',
    },
    // 提交时间
    {
        type: 'time-range',
        value: [],
        searchParmas: ['begin_time', 'end_time'],
        key: 'payment-management.submission_time',
    },
]);

onMounted(() => {
    console.log('auth', Core.Data.getAuthority()['recharge-review.first_instance']);
});
/* Fetch start*/
const request = Core.Api.RechargeAudit.list;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
    initParam: { is_finance: Number(!Core.Data.getAuthority()['recharge-review.first_instance']) },
});
/* Fetch end*/

/* methods start*/
const onSearch = data => {
    searchParam.value = data;
    search();
};
const onReset = () => {
    refreshTable();
};
const routerChange = (type, record) => {
    switch (type) {
        case 'detail':
            router.push({
                path: '/recharge/detail',
                query: {
                    id: record.id,
                },
            });
            break;
    }
};
const handleSearch = (e) => {
    searchParam.value.status = e
    if(searchParam.value.status === 0) {
        searchParam.value.is_finance = !Number(Core.Data.getAuthority()['recharge-review.first_instance']);        
    }
    search();
}
/* methods end*/
</script>

<style lang="less" scoped>
.list-container {
    .title-container {
        .title-area {
            color: #1d2129;
            font-size: 18px;
            font-weight: 600;
        }
    }

    .icon-info {
        cursor: pointer;
    }

    .effective-state {
        display: flex;
        align-items: center;

        .switch-state {
            color: #8e8e8e;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            margin-left: 4px;

            &.blue {
                color: #0061ff;
            }

            &.grey {
                color: #8e8e8e;
            }
        }
    }
    .eyes {
        margin-bottom: 1.5px;
    }
    .status-box {
        padding: 5px 12px;
        box-sizing: border-box;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        border-radius: 4px;
        &.yellow {
            background: #FEF7E7;
            color: #FAAD14;
        }
        &.green {
            background: #E9F6EE;
            color: #26AB54;
        }
        &.red {
            color: #FF3D40;
            background: #FFEBEC;
        }
        &.grey {
            color: #8090a6;
            background: rgba(140, 140, 140, 0.05);
        }
    }
}
.ell {
    &.mw160 {
        max-width: 160px;
    } 
}
</style>
