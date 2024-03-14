<template>
    <div id="final-payment">
        <div class="list-container">
            <!-- 头部 -->
            <div class="title-container">
                <!-- 尾款待支付订单表 -->
                <div class="title-area">
                    {{ $t('distributor.confirmation_freight') }}
                </div>
            </div>
            <!-- tabs 切换 -->
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.freight_status" @change="onTabChange">
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
                    :isShowMore="false"
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
                                <span v-else type="link">-</span>
                            </a-tooltip>
                        </template>
                        <!-- 上级订单编号 -->
                        <template v-if="column.key === 'parent_sn'">
                            <a-tooltip placement="top" :title="text">
                                <a-button v-if="text" type="link" @click="routerChange('detail', record)">
                                    {{ text }}
                                </a-button>
                                <span v-else type="link">-</span>
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

                        <!-- 运费 待确定、已拒绝状态支持修改 -->
                        <template v-if="column.key === 'freight'">
                            <template
                                v-if="
                                    isDistributerAdmin &&
                                    $Util.Common.returnTypeBool(record.freight_status, [
                                        FREIGHT_STATUS.TO_BE_FILLED_IN,
                                        FREIGHT_STATUS.TO_BE_CONFIRMED,
                                        FREIGHT_STATUS.REJECTED,
                                    ])
                                "
                            >
                                <a-button @click="onModify(record)" type="link">
                                    <span v-if="text >= 0">
                                        {{ $Util.priceUnitFilter(record.currency) }}
                                    </span>
                                    <span>
                                        {{ $Util.countFilter(text) }}
                                    </span>
                                </a-button>
                            </template>
                            <template v-else>
                                <span v-if="text >= 0">
                                    {{ $Util.priceUnitFilter(record.currency) }}
                                </span>
                                <span>
                                    {{ $Util.countFilter(text) }}
                                </span>
                            </template>
                        </template>

                        <!-- 运费状态 待确定、已拒绝状态支持修改-->
                        <template v-else-if="column.key === 'freight_status'">
                            <template
                                v-if="
                                    isDistributerAdmin &&
                                    $Util.Common.returnTypeBool(record.freight_status, [
                                        FREIGHT_STATUS.TO_BE_FILLED_IN,
                                        FREIGHT_STATUS.TO_BE_CONFIRMED,
                                        FREIGHT_STATUS.REJECTED,
                                    ])
                                "
                            >
                                <a-button @click="onModify(record)" type="link">
                                    {{ FREIGHT_STATUS_MAP[text]?.t ? $t(`${FREIGHT_STATUS_MAP[text]?.t}`) : '-' }}
                                </a-button>
                            </template>
                            <template v-else>
                                {{ FREIGHT_STATUS_MAP[text]?.t ? $t(`${FREIGHT_STATUS_MAP[text]?.t}`) : '-' }}
                            </template>
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
                        </template>

                        <!-- 支付状态 -->
                        <template v-if="column.key === 'payment_status'">
                            <div class="status status-bg status-tag" :class="$Util.paymentStatusFilter(text, 'color')">
                                {{ $Util.paymentStatusFilter(text, $i18n.locale) || '-' }}
                            </div>
                        </template>

                        <!-- 操作记录 -->
                        <template v-if="column.key === 'action_log_content'">
                            <a-tooltip>
                                <template #title>{{ text }}</template>
                                <div
                                    class="one-spils cursor"
                                    :style="{ width: text?.length > 15 ? 15 * 12 + 'px' : '' }"
                                >
                                    {{ text }}
                                </div>
                            </a-tooltip>
                        </template>

                        <template v-if="column.key === 'operations'">
                            <!-- 分销商 | 待确认显示 -->
                            <a-button
                                v-if="
                                    $Util.Common.returnTypeBool(Core.Data.getLoginType(), [
                                        Core.Const.LOGIN.TYPE.DISTRIBUTOR,
                                    ]) &&
                                    $Util.Common.returnTypeBool(record.freight_status, [FREIGHT_STATUS.TO_BE_CONFIRMED])
                                "
                                type="link"
                                @click="onConfirmFreight(record)"
                            >
                                <!-- <MySvgIcon icon-class="common-view" /> -->
                                <span class="m-l-4">{{ $t('distributor.confirm_freight') }}</span>
                            </a-button>
                            <a-button type="link" @click="routerChange('detail', record)">
                                <!-- <MySvgIcon icon-class="common-view" /> -->
                                <span class="m-l-4">{{ $t('common.detail') }}</span>
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

    <!-- 预计船期及运费 -->
    <ShippingFreight
        v-if="freightVisible"
        v-model:visible="freightVisible"
        :detailRecord="detailRecord"
        :title="$t('distributor.expected_shipping_freight')"
        @ok="onUpdateTable"
    >
    </ShippingFreight>

    <!-- 确认运费弹窗 -->
    <ConfirmFreight
        v-if="confirmFreightVisible"
        v-model:visible="confirmFreightVisible"
        :title="$t('distributor.shipping_freight')"
        :detailRecord="detailRecord"
        @ok="onUpdateTable"
    ></ConfirmFreight>
</template>

<script setup>
import { ref, computed, getCurrentInstance, watch, onMounted } from 'vue';
import Core from '@/core';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import { useTable } from '@/hooks/useTable';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import localeEn from 'ant-design-vue/es/date-picker/locale/en_US';
import localeZh from 'ant-design-vue/es/date-picker/locale/zh_CN';
import ShippingFreight from '../../purchase/components/ShippingFreightModel.vue';
import ConfirmFreight from '../../purchase/components/ConfirmFreightModel.vue';

const FREIGHT_STATUS_MAP = Core.Const.DISTRIBUTOR.FREIGHT_STATUS_MAP;
const FREIGHT_STATUS = Core.Const.DISTRIBUTOR.FREIGHT_STATUS;

import { useRouter, useRoute } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const searchForm = ref({    
    freight_status: 0, // tab 运费状态
});
const search_all_ref = ref(null);
const isDistributerAdmin = ref(false); // 根据路由判断其是用在分销商(false) 还是平台方(true)
const freightVisible = ref(false); // 船期及运费model
const confirmFreightVisible = ref(false); // 船期及运费确认model

const statusData = ref({
    all_total: 0, // 全部
    pending_fill_count: 0, // 待填写
    pending_confirm_count: 0, // 待确认
    confirmed_count: 0, // 已确认
    refused_count: 0, // 已拒绝
}); // 平台方tab数据
const detailRecord = ref({}); // 表格单条数据

const searchAdminList = ref([
    {
        // 订单编号
        type: 'input',
        value: '',
        searchParmas: 'sn',
        key: 'p.order_number',
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
]);

/* computed start */
// tabs 的数据
const statusList = computed(() => {
    let result = [
        {
            t: 'common.all',
            count: statusData.value.all_total,
            color: 'primary',
            key: Core.Const.DISTRIBUTOR.FREIGHT_STATUS.ALL,
        },
        {
            t: 'distributor.to_be_determined',
            count: statusData.value.pending_confirm_count,
            color: 'yellow',
            key: Core.Const.DISTRIBUTOR.FREIGHT_STATUS.TO_BE_CONFIRMED,
        },
        {
            t: 'distributor.determined',
            count: statusData.value.confirmed_count,
            color: 'yellow',
            key: Core.Const.DISTRIBUTOR.FREIGHT_STATUS.CONFIRMED,
        },
        {
            t: 'distributor.rejected',
            count: statusData.value.refused_count,
            color: 'yellow',
            key: Core.Const.DISTRIBUTOR.FREIGHT_STATUS.REJECTED,
        },
    ];

    if (isDistributerAdmin.value) {
        result.splice(1, 0, {
            t: 'distributor.to_be_filled_in',
            count: statusData.value.pending_fill_count,
            color: 'yellow',
            key: Core.Const.DISTRIBUTOR.FREIGHT_STATUS.TO_BE_FILLED_IN,
        });
    }

    return result;
});

const tableColumns = computed(() => {
    let columns = [];
    columns = [
        { title: proxy.$t('p.order_number'), dataIndex: 'sn', key: 'sn' }, // 订单编号
        { title: proxy.$t('distributor.superior_order_number'), dataIndex: 'parent_sn', key: 'parent_sn' }, // 上级订单号
        { title: proxy.$t('p.order_type'), dataIndex: 'type', key: 'type' }, // 订单类型
        { title: proxy.$t('distributor.institution'), dataIndex: ['create_org', 'name'], key: 'item' }, // 创建单位
        { title: proxy.$t('p.payment_method'), dataIndex: 'pay_type', key: 'pay_type' }, // 支付方式
        {
            title: proxy.$t('p.estimated_shipping_data'),
            dataIndex: ['audit_record_content', 'shipping_time_estimated'],
            key: 'time',
        }, // 预计船期
        { title: proxy.$t('p.freight'), dataIndex: ['audit_record_content', 'freight'], key: 'freight' }, // 运费
        { title: proxy.$t('p.freight_status'), dataIndex: 'freight_status', key: 'freight_status' }, // 运费状态
        { title: proxy.$t('p.order_time'), dataIndex: 'create_time', key: 'time' }, // 下单时间
        { title: proxy.$t('p.total_price'), dataIndex: 'total_price', key: 'total_price' }, // 总价
        { title: proxy.$t('p.amount_paid'), dataIndex: 'payment', key: 'amount_paid' }, // 已支付金额
        { title: proxy.$t('p.time_payment'), dataIndex: 'pay_time', key: 'time' }, // 支付时间
        { title: proxy.$t('p.order_status'), dataIndex: 'status', key: 'order_status' }, // 订单状态
        { title: proxy.$t('p.payment_status'), dataIndex: 'payment_status', key: 'payment_status' }, // 支付状态
        { title: proxy.$t('p.record'), dataIndex: 'action_log_content', key: 'action_log_content' }, // 操作记录
        { title: proxy.$t('common.operations'), key: 'operations', fixed: 'right' },
    ];
    return columns;
});
/* computed end */

/* fetch start*/
// 获取状态数据
const getStatusFetch = (params = {}) => {
    const obj = {
        ...params,
    };

    Core.Api.ShippingDateFreight.status(obj)
        .then(res => {
            console.log('获取状态数据 res', res);
            statusData.value = {
                all_total: Number(res.pending_confirm_count) + Number(res.confirmed_count) + Number(res.refused_count),
                ...res,
            };

            if (isDistributerAdmin.value) {
                statusData.value.all_total = statusData.value.all_total + Number(res.pending_fill_count);
            }
        })
        .catch(err => {
            console.log('获取状态数据 err', err);
        });
};

// 获取询问单列表
const getInquirySheet = Core.Api.ShippingDateFreight.list;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request: getInquirySheet,

});

/* fetch end*/

/* methods start*/
const initData = () => {
    searchForm.value = {
        freight_status: 0
    }
}
const routerChange = (type, record) => {
    let routeUrl = '';
    switch (type) {
        case 'detail':
            routeUrl = router.resolve({
                path: '/purchase/purchase-order-detail',
                query: { id: record.id },
            });

            window.open(routeUrl.href, '_self');
            break;
    }
};
const onSearch = data => {    
    searchParam.value = Core.Util.searchFilter({ ...searchForm.value, ...data });
    search();
};
const onReset = () => {    
    refreshTable();    
    initData()
};
// tab事件
const onTabChange = () => {        
    search_all_ref.value.onResetData()  // 清除输入框数据
    searchParam.value = Core.Util.searchFilter(searchForm.value);
    search();
};

// 船期及运费(修改)
const onModify = record => {
    freightVisible.value = true;
    detailRecord.value = {
        id: record.id,
        freight_status: record.freight_status,
        freight_audit_record_id: record.freight_audit_record_id,
        shipping_time_estimated: record?.audit_record_content?.shipping_time_estimated,
        freight: record?.audit_record_content?.freight,
    };
    console.log("船期及运费", detailRecord.value);
};
// 确认运费
const onConfirmFreight = record => {
    confirmFreightVisible.value = true;
    detailRecord.value = {
        freight_audit_record_id: record.freight_audit_record_id,
        shipping_time_estimated: record?.audit_record_content?.shipping_time_estimated,
        freight: record?.audit_record_content?.freight,
        currency: record.currency,
    };
    console.log("确认运费", detailRecord.value);
};

// 预计船期及运费 确认运费 返回
const onUpdateTable = () => {
    search();
    getStatusFetch();
};

/* methods end*/

onMounted(() => {
    getStatusFetch();
    isDistributerAdmin.value = Core.Util.Common.returnTypeBool(Core.Data.getLoginType(), [Core.Const.LOGIN.TYPE.ADMIN]);    
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
