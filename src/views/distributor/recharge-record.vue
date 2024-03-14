<template>
    <div class="recharge-record list-container">
        <div class="title-container">
            <div class="title-area">{{ /*充值记录*/ $t('distributor-detail.recharge_record') }}</div>
        </div>
        <div class="search-container">
            <SearchAll :options="searchList" @search="onSearch" @reset="onReset" :isShowMore="false" />
        </div>
        <div class="table-container">
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :loading="loading"
                :row-key="record => record.id"
                :pagination="false"
            >
                <template #bodyCell="{ record, column }">
                    <!-- recharge_uid -->
                    <template v-if="column.key === 'recharge_uid'">{{
                        record.content_json.recharge_uid || '-'
                    }}</template>
                    <!-- 充值金额 -->
                    <template v-if="column.key === 'recharge_amount'">
                        <div class="total_amount">
                            <span class="label">整车余额账户</span>
                            <span class="value">
                                {{ route.query.currency }}
                                {{ Core.Util.countFilter(record.content_json.vehicle_balance) || 0 }}</span
                            >
                        </div>
                        <div class="part_balance">
                            <span class="label">配件余额账户</span>
                            <span class="value">
                                {{ route.query.currency }}
                                {{ Core.Util.countFilter(record.content_json.part_balance) || 0 }}</span
                            >
                        </div>
                    </template>
                    <!-- arrival_progress -->
                    <template v-if="column.key === 'arrival_progress'">{{ statusMap[record.status] || '-' }}</template>
                    <!-- 备注 -->
                    <template v-if="column.key === 'remark'">{{ record.remark || '-' }}</template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="routerChange('detail', record)">
                            <i class="icon i_detail" /> {{ $t('def.detail') }}
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
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import Core from '@/core';
import { useTable } from '@/hooks/useTable';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const $t = useI18n().t;
const tableColumns = computed(() => {
    let columns = [
        // 充值单号
        {
            title: $t('distributor-detail.recharge_order_number'),
            dataIndex: 'recharge_uid',
            key: 'recharge_uid',
        },
        // 充值金额
        {
            title: `${$t('distributor-detail.recharge_account')}、${$t('distributor-detail.recharge_amount')}`,
            dataIndex: 'recharge_amount',
            key: 'recharge_amount',
        },
        // 到账进度
        { title: $t('distributor-detail.arrival_progress'), dataIndex: 'arrival_progress', key: 'arrival_progress' },
        // 备注
        { title: $t('distributor-detail.remark'), dataIndex: 'remark', key: 'remark' },
        // 操作
        {
            title: $t('distributor-detail.operation'),
            dataIndex: 'operation',
            key: 'operation',
            width: 100,
            fixed: 'right',
        },
    ];
    return columns;
});
const statusMap = ref({
    //  //1.待审核(一审)；2.审核通过；3.审核不通过(一审) 4 等待二审 5 二审不通过
    1: $t('distributor-detail.pending_audit'),
    2: $t('distributor-detail.audit_pass'),
    3: $t('distributor-detail.audit_not_pass'),
    4: $t('distributor-detail.waiting_for_review'),
    5: $t('distributor-detail.second_review_not_passed'),
});

// 模拟request
const request = Core.Api.Distributor.rechargeList;
const initParam = ref({
    target_id: route.query.org_id,
});
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
    initParam: initParam.value,
});
const searchList = ref([
    {
        id: 0,
        type: 'time-range',
        value: [],
        searchParmas: ['begin_time', 'end_time'],
        key: 'distributor-detail.time',
        defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_E,
    },
]);

// methods
const onSearch = params => {
    console.log(params);
    searchParam.value = params;
    search();
};
const onReset = () => {
    console.log('reset');
    refreshTable();
};
// 查看详情
const routerChange = (type, record) => {
    console.log(type, record);
    let routeUrl = '';
    routeUrl = router.resolve({
        path: '/distributor/distributor-recharge-detail',
        query: {
            id: record.id,
            currency: route.query.currency,
        },
    });
    window.open(routeUrl.href, '_self');
};
</script>

<style lang="less" scoped>
:deep(.ant-table-cell) {
    .total_amount {
        margin-bottom: 8px;
    }
    .total_amount,
    .part_balance {
        .label {
            color: #666;
            margin-right: 8px;
        }
        .value {
            color: #181818;
        }
    }
}
</style>
