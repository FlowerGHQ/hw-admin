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
                <a-tabs v-model:activeKey="searchForm.status" @change="onSearch">
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
                <SearchAll ref="search_all_ref" :options="searchList" @search="onSearch" @reset="onReset"> </SearchAll>
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

                        <template v-if="column.key === 'operations'">
                            <a-button type="link" @click="routerChange('pay', record)">
                                <MySvgIcon icon-class="common-view" />
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

import TimeSearch from '@/components/common/TimeSearch.vue';
import { useRouter, useRoute } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const searchForm = ref({
    sn: undefined, // 订单编号
});
const search_all_ref = ref(null);
const isDistributerAdmin = ref(false); // 根据路由判断其是用在分销商(false) 还是平台方(true)

const statusData = ref({
    delay: 0, // 延期
    within_week: 0, // 一周内
    all_total: 0, // 全部
}); // 平台方tab数据
const distributorList = ref([]);

/* computed start */
const searchList = computed(() => {
    let result = [];

    if (isDistributerAdmin.value) {
        result = [
            {
                // 订单编号
                type: 'input',
                value: '',
                searchParmas: 'sn',
                key: 'p.order_number',
            },
            {
                // 分销商
                type: 'select',
                value: '',
                searchParmas: 'distributor_id',
                key: 'n.distributor',
                selectMap: distributorList.value.map(el => {
                    return {
                        zh: el.name,
                        en: el.name,
                        value: el.id,
                    };
                }),
            },
            {
                // 支付状态
                type: 'select',
                value: '',
                searchParmas: 'payment_status',
                key: 'p.payment_status',
                selectMap: distributorList.value.map(el => {
                    return {
                        zh: el.name,
                        en: el.name,
                        value: el.id,
                    };
                }),
            },
            {
                // 应付尾款时间
                type: 'time-range',
                value: '',
                searchParmas: '',
                key: 'p.payable_time',               
            },
           
        ];
    } else {
        result = [
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
                searchParmas: '',
                key: 'distributor.freight_payment_status',
                selectMap: distributorList.value.map(el => {
                    return {
                        zh: el.name,
                        en: el.name,
                        value: el.id,
                    };
                }),
            },
            {
                // 应付尾款时间
                type: 'time-range',
                value: '',
                searchParmas: '',
                key: 'p.payable_time',               
            },
        ];
    }

    return result;
});
// tabs 的数据
const statusList = computed(() => {
    let result = [
        {
            t: 'common.all',
            count: statusData.value.all_total,
            color: 'primary',
            key: Core.Const.DISTRIBUTOR.FINAL_UNPAID_ORDER_TAB.ALL,
        },
        {
            t: 'distributor.within_week',
            count: statusData.value.delay,
            color: 'yellow',
            key: Core.Const.DISTRIBUTOR.FINAL_UNPAID_ORDER_TAB.WITHIN_WEEK,
        },
        {
            t: 'distributor.delay',
            count: statusData.value.within_week,
            color: 'yellow',
            key: Core.Const.DISTRIBUTOR.FINAL_UNPAID_ORDER_TAB.DELAY,
        },
    ];

    return result;
});

const tableColumns = computed(() => {
    let columns = [];
    console.log('isDistributerAdmin.value', isDistributerAdmin.value);
    if (isDistributerAdmin.value) {
        columns = [
            { title: proxy.$t('p.order_number'), dataIndex: 'sn', key: 'sn' }, // 订单编号
            { title: proxy.$t('distributor.superior_order_number'), dataIndex: 'parent_sn', key: 'parent_sn' }, // 上级订单号
            { title: proxy.$t('p.order_type'), dataIndex: 'type', key: 'type' }, // 订单类型
            { title: proxy.$t('distributor.institution'), dataIndex: ['create_org', 'name'], key: 'item' }, // 创建单位
            { title: proxy.$t('p.payment_method'), dataIndex: 'pay_type', key: 'pay_type' }, // 支付方式
            { title: proxy.$t('p.total_price'), dataIndex: 'total_price', key: 'total_price' }, // 总价
            { title: proxy.$t('p.freight'), dataIndex: 'freight', key: 'freight' }, // 运费
            { title: proxy.$t('p.amount_paid'), dataIndex: 'payment', key: 'amount_paid' }, // 已支付金额
            { title: proxy.$t('p.payable_time'), dataIndex: 'uid', key: 'time' }, // 应付尾款时间
            { title: proxy.$t('p.order_time'), dataIndex: 'create_time', key: 'time' }, // 下单时间
            { title: proxy.$t('p.time_payment'), dataIndex: 'pay_time', key: 'time' }, // 支付时间
            { title: proxy.$t('p.order_status'), dataIndex: 'status', key: 'order_status' }, // 订单状态
            { title: proxy.$t('p.payment_status'), dataIndex: 'payment_status', key: 'payment_status' }, // 支付状态
            { title: proxy.$t('common.operations'), dataIndex: 'operations', key: 'operations', fixed: 'right' }, // 操作
        ];
    } else {
        columns = [
            { title: proxy.$t('p.order_number'), dataIndex: 'sn', key: 'sn' }, // 订单编号
            { title: proxy.$t('p.order_type'), dataIndex: 'type', key: 'type' }, // 订单类型
            { title: proxy.$t('distributor.institution'), dataIndex: ['create_org', 'name'], key: 'item' }, // 创建单位
            { title: proxy.$t('p.payment_method'), dataIndex: 'pay_type', key: 'pay_type' }, // 支付方式
            { title: proxy.$t('p.total_price'), dataIndex: 'total_price', key: 'total_price' }, // 总价
            { title: proxy.$t('p.freight'), dataIndex: 'freight', key: 'freight' }, // 运费
            { title: proxy.$t('distributor.freight_confirmation_status'), dataIndex: 'uid', key: 'uid' }, // 运费确认状态
            { title: proxy.$t('distributor.freight_payment_status'), dataIndex: 'uid', key: 'uid' }, // 运费支付状态
            { title: proxy.$t('p.payable_time'), dataIndex: 'uid', key: 'time' }, // 应付尾款时间
            { title: proxy.$t('p.order_time'), dataIndex: 'create_time', key: 'time' }, // 下单时间
            { title: proxy.$t('p.time_payment'), dataIndex: 'pay_time', key: 'time' }, // 支付时间
            { title: proxy.$t('p.order_status'), dataIndex: 'status', key: 'order_status' }, // 订单状态
            { title: proxy.$t('p.payment_status'), dataIndex: 'payment_status', key: 'payment_status' }, // 支付状态
            { title: proxy.$t('common.operations'), dataIndex: 'operations', key: 'operations', fixed: 'right' }, // 操作
        ];
    }
    return columns;
});
/* computed end */

/* fetch start*/
// 获得所有分销商
const getDistributorListAll = () => {
    Core.Api.Distributor.listAll().then(res => {
        distributorList.value = res.list;
        console.log('sss', res.list);
    });
};
// 获取状态数据
const getStatusFetch = (params = {}) => {
    const obj = {
        ...params,
    };

    Core.Api.inquiry_sheet
        .statusList(obj)
        .then(res => {
            console.log('获取状态数据 res', res);
        })
        .catch(err => {
            console.log('获取状态数据 err', err);
        });
};

// 获取询问单列表
const getInquirySheet = Core.Api.inquiry_sheet.list;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request: getInquirySheet,
    // dataCallBack(res) {
    //     console.log("数据 ", res);
    //     return [
    //         {
    //             id: 1,
    //             new_msg_id: 2,
    //             uid : 1231241414,  // 订单号
    //             vehicle_list: [
    //                 { vehicle_uid: "12312414214124", mileage: 20 },
    //                 { vehicle_uid: "12312414214124", mileage: 20 },
    //             ], // 车架号
    //             type: 1,  // 反馈类型
    //             status: 10, // 状态
    //             category: { name: "你好啊", name_en: "hello World", },
    //             create_time: 1705667814,
    //             submit_user_name: "admin1", // 提交人
    //             part_list: [
    //                 {
    //                     item: {
    //                         name: "零件名称",
    //                         name_en: "gagag",
    //                     }
    //                 }
    //             ], // 零件
    //             fault_type: 1, // 故障类型
    //             purpose: 1, // 归类
    //             update_time: 1705993554, // 最后一次时间
    //             process_user_name: "admin1", // 归属人名称
    //         }
    //     ]
    // }
});

/* fetch end*/

/* methods start*/
const routerChange = (type, record) => {
    let routeUrl = '';
    if (!isDistributerAdmin.value) {
        // 分销商
        switch (type) {
            case 'add': // 添加
                // routeUrl = router.resolve({
                //     path: '/customer-care/edit',
                // });
                // window.open(routeUrl.href, '_blank');
                break;
        }
    } else {
        // 平台方
        switch (type) {
        }
    }
};
const onSearch = data => {
    console.log('data', data);
    searchParam.value = { ...searchForm.value, ...data };
    search();
};
const onReset = () => {
    refreshTable();
};

/* methods end*/

onMounted(() => {
    isDistributerAdmin.value = Core.Util.Common.returnTypeBool(Core.Data.getLoginType(), [Core.Const.LOGIN.TYPE.ADMIN])
    console.log("isDistributerAdmin.value", isDistributerAdmin.value);
    
    searchParam.value.status = -1;
    search();
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
