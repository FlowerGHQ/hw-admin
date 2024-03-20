<template>
    <div id="cancellation-order">
        <div class="list-container">
            <!-- 头部 -->
            <div class="title-container">
                <!-- 取消订单申请表 -->
                <div class="title-area">{{ $t('distributor.cancel_order_application_form') }}</div>
            </div>
            <!-- tabs 切换 -->
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.audit_status" @change="onTabChange">
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
                    :options="searchList"
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

                        <!-- 运费状态 待确定、已拒绝状态支持修改-->
                        <template v-else-if="column.key === 'freight_status'">
                            {{ FREIGHT_STATUS_MAP[text]?.t ? $t(`${FREIGHT_STATUS_MAP[text]?.t}`) : '-' }}
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
                                v-if="AUDIT_CANCEL_STATUS_MAP[record.audit_status]"
                                class="m-l-8 status status-bg status-tag"
                                :class="$Util.purchaseStatusFilter(text, 'color')"
                            >
                                {{ $t('distributor-detail.cancel_order') }}({{
                                    $t(`${AUDIT_CANCEL_STATUS_MAP[record.audit_status]?.t}`)
                                }})
                            </div>
                        </template>

                        <!-- 支付状态 -->
                        <template v-if="column.key === 'payment_status'">
                            <div class="status status-bg status-tag" :class="$Util.paymentStatusFilter(text, 'color')">
                                {{ $Util.paymentStatusFilter(text, $i18n.locale) || '-' }}
                            </div>
                        </template>

                        <!-- 申请原因 -->
                        <template v-if="column.key === 'cancel_remark'">
                            <a-tooltip>
                                <template #title>{{ text }}</template>
                                <div
                                    class="one-spils cursor"
                                    :style="{ width: text?.length > 15 ? 15 * 12 + 'px' : '' }"
                                >
                                    {{ text || '-' }}
                                </div>
                            </a-tooltip>
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

                        <!-- 操作 -->
                        <template v-if="column.key === 'operations'">
                            <a-button
                                v-if="
                                    $Util.Common.returnTypeBool(record.audit_status, [
                                        AUDIT_CANCEL_STATUS.WAITING_FOR_APPROVAL,
                                    ])
                                "
                                type="link"
                                @click="routerChange('audit', record)"
                            >
                                <!-- <MySvgIcon icon-class="common-view" /> -->
                                <span class="m-l-4">{{ $t('p.audit') }}</span>
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

    <!-- 审核弹出 -->
    <CheckModal :visible="isAuditShow" :title="$t('distributor.audit')">
        <template #content>
            <div class="content">
                <a-radio-group v-model:value="auditParams.status">
                    <a-radio v-for="item in IS_PASS_OPTIONS_MAP" :key="item.key" :value="item.key">
                        {{ $t(`${item.t}`) }}
                    </a-radio>
                </a-radio-group>
                <!-- 不通过 出现 -->
                <a-textarea
                    v-if="$Util.Common.returnTypeBool(auditParams.status, [IS_PASS_OPTIONS.NOT_PASSED])"
                    class="w-100 m-t-20"
                    v-model:value="auditParams.remark"
                    :placeholder="$t('common.please_enter') + $t('common.reason')"
                    show-count
                    :maxlength="1000"
                />
            </div>
        </template>
        <template #footer>
            <div class="footer">
                <a-button @click="onCheckModalCancel">{{ $t('common.cancel') }}</a-button>
                <a-button type="primary" @click="onCheckModalOK">{{ $t('common.confirm') }}</a-button>
            </div>
        </template>
    </CheckModal>
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
import CheckModal from '@/components/horwin/based-on-ant/CheckModal.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const FREIGHT_STATUS_MAP = Core.Const.DISTRIBUTOR.FREIGHT_STATUS_MAP;
const AUDIT_CANCEL_STATUS_MAP = Core.Const.DISTRIBUTOR.AUDIT_CANCEL_STATUS_MAP;
const AUDIT_CANCEL_STATUS = Core.Const.DISTRIBUTOR.AUDIT_CANCEL_STATUS;
const SEARCH_TYPE = Core.Const.PURCHASE.SEARCH_TYPE;

const IS_PASS_OPTIONS_MAP = {
    2: { key: 2, t: 'common.adopt' }, // 通过
    3: { key: 3, t: 'common.not_passed' }, // 不通过
};
const IS_PASS_OPTIONS = {
    ADOPT: 2,
    NOT_PASSED: 3,
};

const search_all_ref = ref(null);
const searchForm = ref({
    sn: undefined, // 订单编号
    distributor_id: undefined, // 分销商分销商
    audit_status: 0, // 类型
});
const isAuditShow = ref(false); // 是否显示审核按钮
const auditParams = ref({
    id: undefined,
    status: IS_PASS_OPTIONS.ADOPT,
    remark: undefined,
}); // 审核弹出的参数
const isDistributerAdmin = ref(Core.Util.Common.returnTypeBool(Core.Data.getLoginType(), [Core.Const.LOGIN.TYPE.ADMIN])); // 根据路由判断其是用在分销商(false) 还是平台方(true)

const statusData = ref({
    total: 2, // 全部
    pass_total: 0, // 已同意
    refuse_total: 0, // 已拒绝
    wait_total: 2, // 待处理
}); // 平台方tab数据
const distributorList = ref([]); // 分销商数据

const searchList = ref([
    {
        // 订单编号
        type: 'input',
        value: '',
        searchParmas: 'sn',
        key: 'p.order_number',
    },
    {
        // 分销商
        id: 2,
        type: 'select',
        value: '',
        searchParmas: 'distributor_id',
        key: 'n.distributor',
        selectMap: [],
    },
]);
/* computed start */
// tabs 的数据
const statusList = computed(() => {
    let result = [
        {
            t: 'common.all',
            count: statusData.value.total,
            color: 'primary',
            key: Core.Const.DISTRIBUTOR.CANCELLATION_ORDER_TAB.ALL,
        },
        {
            t: 'distributor.dealt_with',
            count: statusData.value.wait_total,
            color: 'yellow',
            key: Core.Const.DISTRIBUTOR.CANCELLATION_ORDER_TAB.DEALT_WITH,
        },
        {
            t: 'distributor.rejected',
            count: statusData.value.refuse_total,
            color: 'yellow',
            key: Core.Const.DISTRIBUTOR.CANCELLATION_ORDER_TAB.REJECTED,
        },
        {
            t: 'distributor.has_agreed',
            count: statusData.value.pass_total,
            color: 'yellow',
            key: Core.Const.DISTRIBUTOR.CANCELLATION_ORDER_TAB.HAS_AGREED,
        },
    ];

    return result;
});

const tableColumns = computed(() => {
    let columns = [];
    columns = [
        { title: proxy.$t('p.order_number'), dataIndex: 'sn', key: 'sn' }, // 订单编号
        { title: proxy.$t('distributor.superior_order_number'), dataIndex: 'parent_sn', key: 'parent_sn' }, // 上级订单号
        { title: proxy.$t('p.order_type'), dataIndex: 'type', key: 'type' }, // 订单类型
        { title: proxy.$t('distributor.institution'), dataIndex: ['create_org', 'name'], key: 'item' }, // 创建单位
        { title: proxy.$t('p.total_price'), dataIndex: 'total_price', key: 'total_price' }, // 总价
        { title: proxy.$t('p.freight'), dataIndex: 'freight', key: 'freight' }, // 运费
        { title: proxy.$t('p.amount_paid'), dataIndex: 'payment', key: 'amount_paid' }, // 已支付金额
        { title: proxy.$t('p.order_time'), dataIndex: 'create_time', key: 'time' }, // 下单时间
        { title: proxy.$t('p.time_payment'), dataIndex: 'pay_time', key: 'time' }, // 支付时间
        { title: proxy.$t('p.order_status'), dataIndex: 'status', key: 'order_status' }, // 订单状态
        { title: proxy.$t('p.payment_status'), dataIndex: 'payment_status', key: 'payment_status' }, // 支付状态

        { title: proxy.$t('distributor.apply_reason'), dataIndex: 'cancel_remark', key: 'cancel_remark' }, // 申请原因
        { title: proxy.$t('p.record'), dataIndex: 'action_log_content', key: 'action_log_content' }, // 操作记录
        { title: proxy.$t('common.operations'), dataIndex: 'operations', key: 'operations', fixed: 'right' }, // 操作
    ];
    return columns;
});
/* computed end */

/* fetch start*/
// 获得所有分销商
const getDistributorListAll = () => {
    Core.Api.Distributor.listAll().then(res => {
        distributorList.value = res.list;
        searchList.value[1].selectMap = distributorList.value.map(el => {
            return {
                zh: el.name,
                en: el.name,
                value: el.id,
            };
        });
    });
};
// 获取状态数据
const getStatusFetch = (params = {}) => {
    const obj = {
        search_type: isDistributerAdmin.value ? SEARCH_TYPE.ALL : SEARCH_TYPE.SELF,
        ...params,
    };

    Core.Api.CancelOrderList.count(obj)
        .then(res => {
            console.log('获取状态数据 res', res);
            statusData.value = res;
        })
        .catch(err => {
            console.log('获取状态数据 err', err);
        });
};

const getInquirySheet = Core.Api.CancelOrderList.list;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request: getInquirySheet,
    initParam: {
        search_type: isDistributerAdmin.value ? SEARCH_TYPE.ALL : SEARCH_TYPE.SELF,
    },
});

// 审核接口
const saveAuditFetch = (params = {}) => {
    const obj = {
        ...params,
    };

    Core.Api.CancelOrderList.audit(obj)
        .then(res => {
            console.log('审核接口 res', res);
            onCheckModalCancel();
            proxy.$message.success(proxy.$t('distributor.audit_success'));
            search();
        })
        .catch(err => {
            proxy.$message.success(proxy.$t('distributor.audit_error'));
            console.log('审核接口 err', err);
        });
};

/* fetch end*/

/* methods start*/
const initData = () => {
    auditParams.value = {
        id: undefined,
        status: IS_PASS_OPTIONS.ADOPT,
        remark: undefined,
    };
    searchForm.value = {
        sn: undefined, // 订单编号
        distributor_id: undefined, // 分销商分销商
        audit_status: 0, // 类型
    };
};
const routerChange = (type, record) => {
    let routeUrl = '';
    // 分销商
    switch (type) {
        case 'detail': // 详情
            routeUrl = router.resolve({
                path: '/purchase/purchase-order-detail',
                query: { id: record.id },
            });

            window.open(routeUrl.href, '_self');
            break;
        case 'audit': // 审核
            isAuditShow.value = true;
            auditParams.value.id = record.audit_id;
            break;
    }
};

const onSearch = data => {
    searchParam.value = Core.Util.searchFilter({ ...searchForm.value, ...Core.Util.searchFilter(data) });
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

// 审核
const onCheckModalCancel = () => {
    isAuditShow.value = false;
    initData();
};

const onCheckModalOK = () => {
    saveAuditFetch(auditParams.value);
};

/* methods end*/

onMounted(() => {
    getStatusFetch();
    getDistributorListAll();
});
</script>

<style lang="less" scoped>
#cancellation-order {
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

.content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.w-100 {
    width: 100%;
}
</style>
