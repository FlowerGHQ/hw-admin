<template>
    <div class="fund-change-details list-container">
        <div class="title-container">
            <div class="title-area">{{ /*资金变动明细*/ $t('distributor-detail.fund_change_detail') }}</div>
        </div>
        <div class="search-container">
            <SearchAll :options="searchList" @search="onSearch" @reset="onReset" :isShowMore="false" />
        </div>
        <div class="table-container">
            <a-tabs v-model:activeKey="activeTypeValue" @change="hanleTabChange">
                <a-tab-pane v-for="item in typeMap" :key="item.value" :tab="item.title"></a-tab-pane>
            </a-tabs>

            <div class="table-area">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :loading="loading"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, record }">
                        <!-- 创建时间 -->
                        <template v-if="column.key === 'create_time'">
                            {{ Core.Util.timeFormat(record.create_time) }}
                        </template>
                        <!-- 账户 -->
                        <template v-else-if="column.key === 'account'">
                            {{ $t(Core.Const.DISTRIBUTOR.WALLET_TYPE[record.type]?.title || '') }}
                        </template>
                        <!-- 类型 -->
                        <template v-else-if="column.key === 'type'">
                            {{
                                $i18n.locale === 'zh'
                                    ? Core.Const.DISTRIBUTOR.EXPENDITURE_TYPE[record.subject]?.zh
                                    : Core.Const.DISTRIBUTOR.EXPENDITURE_TYPE[record.subject]?.en
                            }}
                        </template>
                        <!-- 资金变动 -->
                        <template v-else-if="column.key === 'fund_change'">
                            <span class="money">
                                <span v-if="Core.Util.countFilter(record.money, 100, 2, false, true) > 0">
                                    {{ Core.Const.DISTRIBUTOR.EXPENDITURE_TYPE[record.subject]?.addOrSubtract || '' }}
                                </span>
                                {{ Core.Util.countFilter(record.money, 100, 2, false, true) || 0 }}
                                {{ route.query.currency }}
                            </span>
                            <span class="balance">
                                {{ $t('distributor-detail.available_balance_re') }}：{{
                                    Core.Util.countFilter(record.balance, 100, 2, false, true) || 0
                                }}
                                {{ route.query.currency }}</span
                            >
                        </template>
                    </template>
                </a-table>
            </div>
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import Core from '@/core';
import { useTable } from '@/hooks/useTable';
import { useRoute } from 'vue-router';
const route = useRoute();
const $t = useI18n().t;

const tableColumns = computed(() => {
    let columns = [
        { title: $t('distributor-detail.account'), dataIndex: 'account', key: 'account' },
        { title: $t('distributor-detail.type'), dataIndex: 'type', key: 'type' },
        {
            title: $t('distributor-detail.work_order_number'),
            dataIndex: 'uid',
            key: 'uid',
            customRender: record => {
                return record.text || '-';
            },
        },
        // 订单编号
        {
            title: $t('distributor-detail.order_number'),
            dataIndex: 'source_uid',
            key: 'source_uid',
            customRender: record => {
                console.log('record', record);
                return record.text || '-';
            },
        },
        {
            title: $t('distributor-detail.fund_change'),
            dataIndex: 'fund_change',
            key: 'fund_change',
        },
        { title: $t('distributor-detail.create_time'), dataIndex: 'create_time', key: 'create_time' },
    ];
    return columns;
});
const request = Core.Api.Distributor.walletMoneyList;
const initParam = ref({
    org_id: route.query.org_id,
    org_type: 15,
});
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
    initParam: initParam.value,
    immediate: false,
});

// 收入支出类型
const typeMap = computed(() => [
    {
        id: 0,
        title: $t('distributor-detail.all'),
        value: '',
    },
    {
        id: 1,
        title: $t('distributor-detail.account_recharge'),
        value: 1,
    },
    {
        id: 2,
        title: $t('distributor-detail.account_expenditure'),
        value: 2,
    },
]);

const subject = Core.Const.DISTRIBUTOR.EXPENDITURE_TYPE;

// 将:key :value 转化成 [value]
const subjectMap = ref([]);
for (let key in subject) {
    subjectMap.value.push(subject[key]);
}

const searchList = ref([
    {
        id: 0,
        type: 'time-range',
        value: [],
        searchParmas: ['begin_time', 'end_time'],
        key: 'distributor-detail.time',
        defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_E,
    },
    {
        type: 'select',
        value: '',
        searchParmas: 'subject',
        key: 'distributor-detail.type',
        // 是否需要展示全部
        isShowAll: true,
        selectMap: [
            {
                zh: '全部',
                en: 'All',
                value: '',
            },
            ...subjectMap.value,
        ],
    },
    // 充值账户
    {
        type: 'select',
        value: Number(route.query.walletType) || '',
        searchParmas: 'wallet_type',
        key: 'distributor-detail.account',
        // 是否需要展示全部
        isShowAll: true,
        selectMap: [
            {
                zh: '全部',
                en: 'All',
                value: '',
            },
            {
                zh: '整车可用余额',
                en: 'Vehicle account',
                value: 10,
            },
            {
                zh: '配件可用余额',
                en: 'Parts account',
                value: 20,
            },
            {
                zh: '售后备件信用余额',
                en: 'After-sales spare parts credit balance',
                value: 30,
            },
            {
                zh: '授信余额',
                en: 'Credit balance',
                value: 40,
            },
        ],
    },
]);
const activeTypeValue = ref('');
// tab change
const hanleTabChange = value => {
    activeTypeValue.value = value;
    searchParam.value.type = value;
    search();
};
// methods
const onSearch = params => {
    searchParam.value = params;
    searchParam.value.type = activeTypeValue.value;
    search();
};
const onReset = () => {
    console.log('reset');
    activeTypeValue.value = '';
    refreshTable();
};
onMounted(() => {
    searchParam.value.wallet_type = route.query.walletType;
    searchParam.value.type = route.query.type;
    search();
});
</script>

<style lang="less" scoped>
:deep(.ant-table-cell) {
    .money {
        display: inline-block;
        min-width: 40px;
        color: #0061ff;
        margin-right: 20px;
    }
}
</style>
