<template>
    <div class="ReceiverAddress gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('d.balance_details') }}</div>
        </div>
        <div class="panel-content">
            <!-- 筛选条件 -->
            <div class="search-container">
                <a-row class="search-area">
                    <!-- 来源 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('d.source') }}:</div>
                        <div class="value">
                            <a-select v-model:value="balanceForm.source_type" allowClear>
                                <a-select-option v-for="(val, key) in source_type" :key="key" :value="val.id">{{
                                    val[$i18n.locale]
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 工单编号 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('d.repair_sn') }}:</div>
                        <div class="value">
                            <a-input v-model:value="balanceForm.source_uid" allowClear />
                        </div>
                    </a-col>
                    <!-- 创建时间 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('d.create_time') }}:</div>
                        <div class="value">
                            <TimeSearch @search="handleOtherSearch" ref="TimeSearchs" />
                        </div>
                    </a-col>
                    <!-- 收/支 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('d.Income_expenditure') }}:</div>
                        <div class="value">
                            <a-select v-model:value="balanceForm.type" allowClear>
                                <a-select-option v-for="(val, key) in Income_type" :key="key" :value="val.id">{{
                                    val[$i18n.locale]
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 资金类型 后期可能要加上 -->
                    <!-- <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('d.capital_type') }}:</div>
                        <div class="value">
                            <a-select v-model:value="balanceForm.capital_type" allowClear>
                                <a-select-option v-for="(val,key) in capital_type" :key="key" :value="val.id">{{ val[$i18n.locale]  }}</a-select-option>                               
                            </a-select>
                        </div>
                    </a-col> -->
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <!-- :pagination="false" -->
                    <template #bodyCell="{ column, text, record }">
                        <!-- 来源 1工单类型 2采购下单 -->
                        <template v-if="column.dataIndex === 'source_type'">
                            {{ source_type[text] ? source_type[text][$i18n.locale] : $t('ac.admin') }}
                        </template>

                        <!-- 工单编号 -->
                        <template v-if="column.dataIndex === 'source_uid'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                    text || '-'
                                }}</a-button>
                            </a-tooltip>
                        </template>

                        <!-- 金额 -->
                        <template v-if="column.dataIndex === 'money'">
                            {{ walletFilter[record.currency_type] }}{{ $Util.countFilter(text) }}
                        </template>

                        <!-- 1收入 2支出 -->
                        <template v-if="column.dataIndex === 'type'">
                            {{ Income_type[text] ? Income_type[text][$i18n.locale] : '-' }}
                        </template>

                        <!-- 资金类型 1是余额 目前这里全部显示余额 -->
                        <template v-if="column.dataIndex === 'subject'">
                            {{ $t('w.balance') }}
                            <!-- 余额 -->
                            <!-- {{ capital_type[text]?capital_type[text][$i18n.locale]:"余额" }} -->
                        </template>

                        <!-- 账户余额 -->
                        <template v-if="column.dataIndex === 'balance'">
                            {{ walletFilter[record.currency_type] }}{{ $Util.countFilter(text) }}
                        </template>

                        <!-- 创建时间 -->
                        <template v-if="column.dataIndex === 'create_time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="balancePagination.currPage"
                    :page-size="balancePagination.pageSize"
                    :total="balancePagination.total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import { computed, getCurrentInstance, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TimeSearch from '@/components/common/TimeSearch.vue';
const props = defineProps({
    org_id: {
        type: Number,
        default: 0,
    },
});

const router = useRouter();
// 来源
const source_type = {
    0: { id: '0', zh: '全部', en: 'ALL' },
    50: { id: '50', zh: '工单转入', en: 'Work order transfer' },
    20: { id: '20', zh: '采购下单', en: 'Purchase order' },
};
// 收入/支出
const Income_type = {
    0: { id: '0', zh: '全部', en: 'ALL' },
    1: { id: '1', zh: '收入', en: 'income' },
    2: { id: '2', zh: '支出', en: 'expenditure' },
};
// 资金类型(目前只有余额)
const capital_type = {
    0: { id: '0', zh: '全部', en: 'ALL' },
    1: { id: '1', zh: '余额', en: 'balance' },
    // '2': {id: '2', zh: '充值', en: 'Recharge'},
};
// 单位转换 后端传的是 1人民币 2欧元 EUR 3美元 USD 4英镑
const walletFilter = {
    1: '￥',
    2: '€',
    3: '$',
    4: '£',
};

const { proxy } = getCurrentInstance();

const TimeSearchs = ref(null); //组件的ref
const balanceForm = ref({
    source_type: '0', // 来源
    source_uid: '', // 工单编号
    type: '0', // 收入还是支出
});
const tableData = ref([]); // 明细列表详情
// 分页
const balancePagination = ref({
    currPage: 1,
    pageSize: 10,
    total: 0,
});

/* 初始化 */
onMounted(() => {
    walletListFetch();
});

// 计算属性
const tableColumns = computed(() => {
    let columns = [
        { title: proxy.$t('d.source'), dataIndex: 'source_type', key: 'source_type' }, // 来源
        { title: proxy.$t('d.repair_sn'), dataIndex: 'source_uid', key: 'source_uid' }, // 工单编号
        { title: proxy.$t('d.money'), dataIndex: 'money', key: 'money' }, // 金额
        { title: proxy.$t('d.Income_expenditure'), dataIndex: 'type', key: 'type' }, // 1收入 2支出
        { title: proxy.$t('d.capital_type'), dataIndex: 'subject', key: 'subject' }, // 资金类型  1目前只有余额  充值(这期不做)
        { title: proxy.$t('d.account_balance'), dataIndex: 'balance', key: 'balance' }, // 账户余额
        { title: proxy.$t('d.create_time'), dataIndex: 'create_time', key: 'create_time' },
    ];
    return columns;
});

// 路由跳转
const routerChange = (type, item = {}) => {
    let routeUrl = '';
    switch (type) {
        case 'detail': // 详情
            if (item.source_type == 50) {
                routeUrl = router.resolve({
                    path: '/repair/repair-detail',
                    query: { id: item.source_id },
                });
            } else if (item.source_type == 20) {
                routeUrl = router.resolve({
                    path: '/distributor/purchase-order-detail',
                    query: { id: item.source_id },
                });
            }

            window.open(routeUrl.href, '_self');
            break;
    }
};

/* Fetch */
// 明细列表
const walletListFetch = (params = {}) => {
    Core.Api.Distributor.walletMoneyList({
        ...params,
        page: balancePagination.value.currPage,
        page_size: balancePagination.value.pageSize,
        org_id: props.org_id,
        org_type: 15,
    })
        .then(res => {
            balancePagination.value.total = res.count;
            console.log('walletListFetch res', res);
            tableData.value = res?.list;
        })
        .catch(err => {
            console.log('walletListFetch err', err);
        });
};

// methods
// 分页事件
const pageChange = curr => {
    // 页码改变
    balancePagination.value.currPage = curr;
    walletListFetch();
};
const pageSizeChange = (current, size) => {
    // 页码尺寸改变
    console.log('pageSizeChange size:', size);
    balancePagination.value.pageSize = size;
    walletListFetch();
};
// 时间组件事件
const handleOtherSearch = item => {
    console.log(item);
    for (const key in item) {
        balanceForm.value[key] = item[key];
    }
    console.log(balanceForm.value);
};
// 查询
const handleSearch = () => {
    console.log('balanceForm', balanceForm);
    walletListFetch({
        ...balanceForm.value,
    });
};

// 重置
const handleSearchReset = () => {
    proxy.$refs.TimeSearchs?.handleReset();
    balanceForm.value = {
        source_type: '0',
        source_uid: '',
        type: '0',
    };
    walletListFetch({ ...balanceForm.value });
};
</script>

<style lang="less" scoped>
//.ReceiverAddress {}
</style>
