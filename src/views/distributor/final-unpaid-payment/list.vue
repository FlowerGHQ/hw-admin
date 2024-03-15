<template>
    <div id="final-payment">
        <div class="list-container">
            <!-- 头部 -->
            <div class="title-container">
                <!-- 尾款待支付订单表 -->
                <div class="title-area">
                    {{
                        isDistributerAdmin
                            ? $t('distributor.final_payment_order_form')
                            : $t('distributor.unpaid_payment')
                    }}
                </div>
            </div>
            <!-- tabs 切换 -->
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="tabStatus" @change="onTabChange">
                    <a-tab-pane :key="item.key" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">
                                {{ $t(item.t) }}
                                <span :class="item.color">
                                    {{ item.count }}
                                </span>
                            </div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search">
                <SearchAll
                    ref="search_all_ref"
                    :options="isDistributerAdmin ? searchAdminList : searchDistributorList"
                    @search="onSearch"
                    @reset="onReset"
                >
                </SearchAll>
            </div>
            <!-- table -->
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :loading="loading"
                    :locale="$i18n.locale === 'en' ? localeEn : localeZh"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #headerCell="{ title }">
                        <span class="table-title">{{ title }}</span>
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <!-- 订单编号 -->
                        <template v-if="column.key === 'sn'">
                            <a-tooltip placement="top" :title="text">
                                <a-button v-if="text" type="link" @click="routerChange('detail', record)">
                                    {{ text }}
                                </a-button>
                                <a-button v-else type="link">-</a-button>
                            </a-tooltip>
                        </template>
                        <!-- 上级订单编号 -->
                        <template v-if="column.key === 'parent_sn'">
                            <a-tooltip placement="top" :title="text">
                                <a-button v-if="text" type="link" @click="routerChange('detail', record)">
                                    {{ text }}
                                </a-button>
                                <a-button v-else type="link">-</a-button>
                            </a-tooltip>
                        </template>

                        <!-- 订单类型 -->
                        <template v-if="column.key === 'type'">
                            {{ $Util.purchaseTypeFilter(text, $i18n.locale) }}
                        </template>

                        <!-- 创建单位 -->
                        <template v-else-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>

                        <!-- 支付方式 -->
                        <template v-if="column.key === 'pay_type'">
                            {{ $Util.purchasePayTypeFilter(text, $i18n.locale) }}
                        </template>

                        <!-- 总价 -->
                        <template v-if="column.key === 'total_price'">
                            <span v-if="text >= 0">{{ $Util.priceUnitFilter(record.currency) }}</span>
                            <span>
                                {{ $Util.countFilter(text) }}
                            </span>
                        </template>

                        <!-- 运费 -->
                        <template v-if="column.key === 'freight'">
                            <span v-if="text >= 0">{{ $Util.priceUnitFilter(record.currency) }}</span>
                            <span>
                                {{ $Util.countFilter(text) }}
                            </span>
                        </template>

                        <!-- 运费确认状态 -->
                        <template v-if="column.key === 'freight_status'">
                            {{ FREIGHT_STATUS_MAP[text]?.t ? $t(`${FREIGHT_STATUS_MAP[text]?.t}`) : '-' }}
                        </template>

                        <!-- 运费支付状态 -->
                        <template v-if="column.key === 'freight_pay_status'">
                            {{ FREIGHT_PAY_STATUS_MAP[text]?.t ? $t(`${FREIGHT_PAY_STATUS_MAP[text]?.t}`) : '-' }}
                        </template>

                        <!-- 已支付金额 -->
                        <template v-if="column.key === 'amount_paid'">
                            <span v-if="text >= 0">{{ $Util.priceUnitFilter(record.currency) }}</span>
                            <span>
                                {{ $Util.countFilter(text) }}
                            </span>
                        </template>

                        <!-- 时间 -->
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>

                        <!-- 订单状态 -->
                        <template v-if="column.key === 'order_status'">
                            <div class="status status-bg status-tag" :class="$Util.purchaseStatusFilter(text, 'color')">
                                {{ $Util.purchaseStatusFilter(text, $i18n.locale) || '-' }}
                            </div>
                            <div
                                v-if="AUDIT_CANCEL_STATUS_MAP[record.cancel_status]"
                                class="m-l-8 status status-bg status-tag"
                                :class="$Util.purchaseStatusFilter(text, 'color')"
                            >
                                {{ $t('distributor-detail.cancel_order') }}
                                ({{ $t(`${AUDIT_CANCEL_STATUS_MAP[record.cancel_status]?.t}`) }})
                            </div>
                        </template>

                        <!-- 支付状态 -->
                        <template v-if="column.key === 'payment_status'">
                            <div class="status status-bg status-tag" :class="$Util.paymentStatusFilter(text, 'color')">
                                {{ $Util.paymentStatusFilter(text, $i18n.locale) || '-' }}
                            </div>
                        </template>

                        <template v-if="column.key === 'operations'">
                            <a-button type="link" @click="routerChange('pay', record)">
                                <!-- <MySvgIcon icon-class="common-view" /> -->
                                <span class="m-l-4">{{ $t('p.payment') }}</span>
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
    </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, watch, onMounted } from 'vue';
import Core from '@/core';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import { useTable } from '@/hooks/useTable';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import localeEn from 'ant-design-vue/es/date-picker/locale/en_US';
import localeZh from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { useRouter, useRoute } from 'vue-router';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const FREIGHT_STATUS_MAP = Core.Const.DISTRIBUTOR.FREIGHT_STATUS_MAP;
const FINAL_UNPAID_ORDER_TAB = Core.Const.DISTRIBUTOR.FINAL_UNPAID_ORDER_TAB;
const FREIGHT_PAY_STATUS_MAP = Core.Const.DISTRIBUTOR.FREIGHT_PAY_STATUS_MAP;
const AUDIT_CANCEL_STATUS_MAP = Core.Const.DISTRIBUTOR.AUDIT_CANCEL_STATUS_MAP;
const SEARCH_TYPE = Core.Const.PURCHASE.SEARCH_TYPE;

const isDistributerAdmin = ref(Core.Util.Common.returnTypeBool(Core.Data.getLoginType(), [Core.Const.LOGIN.TYPE.ADMIN])); // 根据路由判断其是用在分销商(false) 还是平台方(true)
const searchForm = ref({
    final_pay_due_begin_time: undefined, // 应付尾款开始时间
    final_pay_due_end_time: undefined, // 应付尾款结束时间
    freight_pay_status: undefined, // 运费支付状态
    sn: undefined, // 订单编号
    distributor_id: undefined, // 分销商id    
});
const tabStatus = ref(0); // tabs-status
const search_all_ref = ref(null);


const statusData = ref({
    delay_count: 0, //延期数量
    count: 0, // 总数
    in_one_week_count: 0, //一周内数量
}); // 平台方tab数据
const distributorList = ref([]);

const searchAdminList = ref([
    {
        // 订单编号
        type: 'input',
        value: '',
        searchParmas: 'sn',
        key: 'p.order_number',
    },
    {
        // 分销商
        id: 'distributor',
        type: 'select',
        value: '',
        searchParmas: 'distributor_id',
        key: 'n.distributor',
        selectMap: [],
    },
    {
        // 运费支付状态
        type: 'select',
        value: '',
        searchParmas: 'freight_pay_status',
        key: 'distributor.freight_payment_status',
        selectMap: Object.values(FREIGHT_PAY_STATUS_MAP).map(el => {
            return { ...el, value: el.key };
        }),
    },
    {
        // 应付尾款时间
        type: 'time-range',
        value: [],
        searchParmas: ['final_pay_due_begin_time', 'final_pay_due_end_time'],
        key: 'p.payable_time',
    },
]);
const searchDistributorList = ref([
    {
        // 订单编号
        type: 'input',
        value: '',
        searchParmas: 'sn',
        key: 'p.order_number',
    },
    {
        // 运费支付状态
        type: 'select',
        value: '',
        searchParmas: 'freight_pay_status',
        key: 'distributor.freight_payment_status',
        selectMap: Object.values(FREIGHT_PAY_STATUS_MAP).map(el => {
            return { ...el, value: el.key };
        }),
    },
    {
        // 应付尾款时间
        type: 'time-range',
        value: [],
        searchParmas: ['final_pay_due_begin_time', 'final_pay_due_end_time'],
        key: 'p.payable_time',
    },
]);

/* computed start */
// tabs 的数据
const statusList = computed(() => {
    let result = [
        {
            t: 'common.all',
            count: statusData.value.count,
            color: 'primary',
            key: FINAL_UNPAID_ORDER_TAB.ALL,
        },
        {
            t: 'distributor.within_week',
            count: statusData.value.in_one_week_count,
            color: 'yellow',
            key: FINAL_UNPAID_ORDER_TAB.WITHIN_WEEK,
        },
        {
            t: 'distributor.delay',
            count: statusData.value.delay_count,
            color: 'yellow',
            key: FINAL_UNPAID_ORDER_TAB.DELAY,
        },
    ];

    return result;
});

const tableColumns = computed(() => {
    let columns = [];
    console.log('isDistributerAdmin.value', isDistributerAdmin.value);
    columns = [
        { title: proxy.$t('p.order_number'), dataIndex: 'sn', key: 'sn' }, // 订单编号
        { title: proxy.$t('p.order_type'), dataIndex: 'type', key: 'type' }, // 订单类型
        { title: proxy.$t('distributor.institution'), dataIndex: ['create_org', 'name'], key: 'item' }, // 创建单位
        { title: proxy.$t('p.payment_method'), dataIndex: 'pay_type', key: 'pay_type' }, // 支付方式
        { title: proxy.$t('p.total_price'), dataIndex: 'total_price', key: 'total_price' }, // 总价
        { title: proxy.$t('p.freight'), dataIndex: 'freight', key: 'freight' }, // 运费
        {
            title: proxy.$t('p.freight_status'),
            dataIndex: 'freight_status',
            key: 'freight_status',
        }, // 运费确认状态
        {
            title: proxy.$t('distributor.freight_payment_status'),
            dataIndex: 'freight_pay_status',
            key: 'freight_pay_status',
        }, // 运费支付状态
        { title: proxy.$t('p.payable_time'), dataIndex: 'final_pay_due_time', key: 'time' }, // 应付尾款时间
        { title: proxy.$t('p.order_time'), dataIndex: 'create_time', key: 'time' }, // 下单时间
        { title: proxy.$t('p.time_payment'), dataIndex: 'pay_time', key: 'time' }, // 支付时间
        { title: proxy.$t('p.order_status'), dataIndex: 'status', key: 'order_status' }, // 订单状态
        { title: proxy.$t('p.payment_status'), dataIndex: 'payment_status', key: 'payment_status' }, // 支付状态
    ];
    if (!isDistributerAdmin.value) {
        columns.push({
            title: proxy.$t('common.operations'),
            dataIndex: 'operations',
            key: 'operations',
            fixed: 'right',
        }); // 操作
    }
    return columns;
});
/* computed end */

/* fetch start*/
// 获得所有分销商
const getDistributorListAll = () => {
    Core.Api.Distributor.listAll().then(res => {
        distributorList.value = res.list;
        const findItem = searchAdminList.value.find(el => el.id === 'distributor');

        if (findItem) {
            findItem.selectMap = distributorList.value.map(el => {
                return {
                    zh: el.name,
                    en: el.name,
                    value: el.id,
                };
            });
        }
    });
};
// 获取状态数据
const getStatusFetch = (params = {}) => {
    const obj = {
        ...params,
    };

    Core.Api.FinalPayment.count(obj)
        .then(res => {
            console.log('获取状态数据 res', res);
            statusData.value = res;
        })
        .catch(err => {
            console.log('获取状态数据 err', err);
        });
};


// 获取尾款列表
const getInquirySheet = Core.Api.FinalPayment.list;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request: getInquirySheet,
    initParam: {
        search_type: isDistributerAdmin.value ? SEARCH_TYPE.ALL : SEARCH_TYPE.SELF,
    },
});

/* fetch end*/

/* methods start*/
const initData = () => {
    tabStatus.value = 0
    searchForm.value = {
        final_pay_due_begin_time: undefined, // 应付尾款开始时间
        final_pay_due_end_time: undefined, // 应付尾款结束时间
        freight_pay_status: undefined, // 运费支付状态
        sn: undefined, // 订单编号
        distributor_id: undefined, // 分销商id        
    };
};
const routerChange = (type, record) => {
    let routeUrl = '';
    if (!isDistributerAdmin.value) {
        // 分销商
        switch (type) {
            case 'pay': // 付款
                routeUrl = router.resolve({
                    path: '/mall/confirm-order',
                    query: { id: record.id },
                });
                window.open(routeUrl.href, '_blank');
                break;
            case 'detail':
                routeUrl = router.resolve({
                    path: '/purchase/purchase-order-detail',
                    query: { id: record.id },
                });

                window.open(routeUrl.href, '_self');
                break;
        }
    } else {
        // 平台方
        switch (type) {
            case 'detail':
                routeUrl = router.resolve({
                    path: '/purchase/purchase-order-detail',
                    query: { id: record.id },
                });

                window.open(routeUrl.href, '_self');
                break;
        }
    }
};

const onSearch = data => {
    searchParam.value = Core.Util.searchFilter({ ...searchForm.value, ...data });
    search();
};
const onReset = () => {
    refreshTable();
    initData();
};
// tab事件
const onTabChange = type => {
    search_all_ref.value.onResetData(); // 清除输入框数据

    searchForm.value.final_pay_due_begin_time = undefined;
    searchForm.value.final_pay_due_end_time = undefined;
    switch (type) {
        case FINAL_UNPAID_ORDER_TAB.ALL:
            break;
        case FINAL_UNPAID_ORDER_TAB.WITHIN_WEEK:
            // 一周
            searchForm.value.final_pay_due_begin_time = dayjs().unix();
            searchForm.value.final_pay_due_end_time = dayjs().subtract(7, 'day').unix();
            break;
        case FINAL_UNPAID_ORDER_TAB.DELAY:
            searchForm.value.final_pay_due_begin_time = dayjs().unix();
            break;
    }
    searchParam.value = Core.Util.searchFilter(searchForm.value);
    search();
};

/* methods end*/

onMounted(() => {
    getStatusFetch();
    getDistributorListAll();
});
</script>

<style lang="less" scoped>
#final-payment {
    .table-title {
        color: #1d2129;
        font-size: 14px;
        font-weight: 500;
    }
}

.status-style {
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    padding: 4px 0px;
    box-sizing: border-box;
    .flex();
    min-width: 70px;
    &.color-FF7D00 {
        background: rgba(255, 125, 0, 0.1);
        color: #ff7d00 !important;
    }
    &.color-0061FF {
        background: rgba(0, 97, 255, 0.1);
        color: #0061ff !important;
    }
    &.color-00B42A {
        background: rgba(38, 171, 84, 0.1);
        color: #00b42a !important;
    }
}
</style>
