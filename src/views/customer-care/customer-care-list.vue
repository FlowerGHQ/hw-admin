<template>
    <div id="customer-care">
        <div class="list-container">
            <!-- 头部 -->
            <div class="title-container">
                <div class="title-area">{{ $t("customer-care.inquiry_list") }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('add')"
                        ><i class="icon i_add" />
                        {{ $t("customer-care.create_inquiry_form") }}
                    </a-button>
                </div>
            </div>
            <!-- tabs 切换 -->
            <div v-if="isDistributerAdmin" class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.status" @change="onSearch">
                    <a-tab-pane :key="item.key" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">
                                <span>{{ $t(item.t) }}</span>
                                <span :class="item.color">
                                    {{ item.count }}
                                </span>
                            </div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search">
                <SearchAll :options="searchList" @search="onSearch" @reset="onReset"> </SearchAll>
            </div>
            <!-- table -->
            <div class="table-container">                
                <a-button v-if="isDistributerAdmin" class="m-b-10" type="primary" @click="handleExportIn/*导出功能*/">
                    <i class="icon i_download"/>{{$t('common.export')}}
                </a-button>
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :loading="loading"
                    :row-key="(record) => record.id"
                    :pagination="false"
                >
                    <template #headerCell="{ title }">
                        <span class="table-title">{{ title }}</span>
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <!-- 公共 -->
                        <template v-if="column.key === 'uid'">
                            <div class="new">
                                <span class="new-msg" v-if="record.new_msg_id">新消息</span>
                                <div>{{ text || '-' }}</div>
                            </div>
                        </template>
                        <!-- 时间类型 -->
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text, 3) }}
                        </template>
                        <!-- 订单-状态 -->
                        <template v-if="column.key === 'status'">
                            <div                                 
                                :class="{
                                    'color-FF7D00': $Util.Common.returnTypeBool(text, [Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.EQUALTREATMENT]),
                                    'color-0061FF': $Util.Common.returnTypeBool(text, [Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.INPROCESS]),
                                    'color-00B42A': $Util.Common.returnTypeBool(text, [Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED]),
                                }"
                            >
                                {{ Core.Const.CUSTOMER_CARE.ORDER_STATUS[text] ? $t(Core.Const.CUSTOMER_CARE.ORDER_STATUS[text].t) : '-' }}
                            </div>
                        </template>

                        <!-- 平台方 -->
                        <!-- 归类 -->
                        <template v-if="column.key === 'sorting_type'">
                            {{ Core.Const.CUSTOMER_CARE.SORTING_TYPE_THREE[text] ? $t(Core.Const.CUSTOMER_CARE.SORTING_TYPE_THREE[text].t) : '-' }}
                        </template>
                        <!-- 故障类型 -->
                        <template v-if="column.key === 'fault_type'">
                            {{ Core.Const.CUSTOMER_CARE.FAULT_TYPE[text] ? $t(Core.Const.CUSTOMER_CARE.FAULT_TYPE[text].t) : '-' }}
                        </template>
                        <!-- 零件 -->
                        <template v-if="column.key === 'part_list'">
                            <a-tooltip placement="top">
                                <template #title>
                                    <span v-for="(item, index) in record.part_list">
                                        <span>{{ item?.item?.name }}</span>
                                        <span v-if="record.part_list.length > 1">,</span>
                                    </span>
                                </template>                                
                                <template v-if="record.part_list.length > 1">
                                    {{ 
                                        $i18n.locale === 'en' ? 
                                        record.part_list[0]?.item?.name_en || '-' : record.part_list[0]?.item?.name + '等' || '-' 
                                    }}
                                </template>
                                <template v-else>
                                    {{ 
                                        $i18n.locale === 'en' ? record.part_list[0]?.item?.name_en 
                                        || '-' : record.part_list[0]?.item?.name || '-' 
                                    }}
                                </template>                        
                            </a-tooltip>
                        </template>
                        <!-- 车型号,公里数 -->
                        <template v-if="column.key === 'mileage'">
                            <a-tooltip placement="top">
                                <template #title>
                                    <span v-for="(item, index) in record.vehicle_list">
                                        <span>
                                            {{ item.vehicle_uid + '(' + item.mileage + ')' }}
                                        </span>
                                        <span v-if="record.vehicle_list.length > 1">,</span>
                                    </span>
                                </template>
                                {{ 
                                    record.vehicle_list.length > 1 ? 
                                    record.vehicle_list[0].vehicle_uid + '(' +record.vehicle_list[0].mileage + ')' + '等' 
                                    : record.vehicle_list[0].vehicle_uid 
                                }}
                            </a-tooltip>
                        </template>

                        <!-- 分销商 -->
                        <!-- 车架号 -->
                        <template v-if="column.key === 'vehicle_list'">
                            <a-tooltip placement="top">
                                <template #title>
                                    <span v-for="(item, index) in record.vehicle_list">
                                        <span>{{ item.vehicle_uid }}</span>
                                        <span v-if="record.vehicle_list.length > 1">,</span>
                                    </span>
                                </template>
                                {{ 
                                    record.vehicle_list.length > 1 ? record.vehicle_list[0].vehicle_uid + '等' : record.vehicle_list[0].vehicle_uid
                                }}
                            </a-tooltip>
                        </template>
                        <!-- 车型 -->
                        <template v-if="column.key === 'category'">
                            {{ $i18n.locale === 'en'? record.category.name_en : record.category.name }}
                        </template>
                        <!-- 反馈类型 -->
                        <template v-if="column.key === 'type'">
                            {{ Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE[text] ? $t(Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE[text].t) : '-' }}
                        </template>

                        <template v-if="column.key === 'operations'">
                            <a-button type="link" @click="routerChange('detail', record)">
                                <MySvgIcon icon-class="supply-view" />
                                <span class="m-l-4">{{ $t("common.view") }}</span>
                            </a-button>
                            <a-button 
                                v-if="!$Util.Common.returnTypeBool(text, [Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED])" 
                                type="link" 
                                @click="routerChange('edit', record)"
                            >
                                <MySvgIcon icon-class="supply-edit" />
                                <span class="m-l-4">{{ $t("common.edit") }}</span>
                            </a-button>
                            <a-button type="link" @click="routerChange('msg', record)">
                                <MySvgIcon icon-class="supply-edit" />
                                <span class="m-l-4">{{ $t("customer-care.leave_message") }}</span>
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
                    :show-total="(total) => $t('n.all_total') + ` ${pagination.total} ` + $t('in.total')"
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
import { ref, computed, getCurrentInstance, watch, onMounted } from "vue";
import Core from "@/core";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import { useTable } from "@/hooks/useTable";
import SearchAll from "@/components/horwin/based-on-ant/SearchAll.vue";

const STATUS = Core.Const.FEEDBACK.STATUS;
const LOGIN_TYPE = Core.Const.LOGIN.TYPE;
const USER_TYPE = Core.Const.USER.TYPE;
import TimeSearch from "@/components/common/TimeSearch.vue";
import { useRouter, useRoute } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const searchForm = ref({
    status: undefined,
});

const isDistributerAdmin = ref(false)  // 根据路由判断其是用在分销商(false) 还是平台方(true)
const statusData = ref({
    "process_total": 0, //处理中总数
    "resolved_total": 0, //问题解决总数
    "waiting_total": 0, //等待处理总数
    "all_total": 0 //所有数量
})  // 平台方tab数据
    
/* computed start */
// 筛选条件
const searchList = computed(() => {
    let result = []

    if (!isDistributerAdmin.value) {
        result = [
            {
                // 问询单号
                type: "input",
                value: "",
                searchParmas: "uid",
                key: "customer-care.inquiry_number",
            },
            {
                // 车架号
                type: "input",
                value: "",
                searchParmas: "vehicle_uid",
                key: "common.vehicle_no",
            },
            {
                // 状态
                type: "select",
                value: undefined,
                searchParmas: "status",
                key: "common.status",                
                selectMap: (() => {
                    let result = []
                    for (const key in Core.Const.CUSTOMER_CARE.ORDER_STATUS) {
                        if (key === '-1') {
                            result.unshift(Core.Const.CUSTOMER_CARE.ORDER_STATUS[key])
                        } else {
                            result.push(Core.Const.CUSTOMER_CARE.ORDER_STATUS[key])
                        }                    
                    }                   
                    return result
                })(),
            },
        ]
    } else if (isDistributerAdmin.value) {
        result = [
            {
                // 国家
                type: "input",
                value: undefined,
                searchParmas: "country",
                key: "common.country",
            },
            {
                // 车架号
                type: "input",
                value: undefined,
                searchParmas: "vehicle_uid",
                key: "common.vehicle_no",
            },
            {
                // 零件
                type: "input",
                value: undefined,
                searchParmas: "part",
                key: "customer-care.part",
            },
            {
                // 车型
                type: "input",
                value: undefined,
                searchParmas: "",
                key: "common.vehicle_model",
            },
            {
                // 问询标签
                type: "select",
                value: undefined,
                searchParmas: "sorting_type",
                key: "customer-care.inquiry_label",
                selectMap: (() => {
                    let result = []                   
                    for (const key in Core.Const.CUSTOMER_CARE.SORTING_TYPE) {                        
                        if (key === '-1') {
                            result.unshift(Core.Const.CUSTOMER_CARE.SORTING_TYPE[key])
                        } else {
                            result.push(Core.Const.CUSTOMER_CARE.SORTING_TYPE[key])                        
                        }                    
                    }
                    return result
                })(),
            },
            {
                // 处理进度
                type: "select",
                value: undefined,
                searchParmas: "status",
                key: "customer-care.processing_progress",
                selectMap: (() => {
                    let result = []                   
                    for (const key in Core.Const.CUSTOMER_CARE.ORDER_STATUS) {
                        if (key === '-1') {
                            result.unshift(Core.Const.CUSTOMER_CARE.ORDER_STATUS[key])
                        } else {
                            result.push(Core.Const.CUSTOMER_CARE.ORDER_STATUS[key])                        
                        }
                    }
                    return result
                })(),
            },            
            {
                // 故障分类
                type: "select",
                value: undefined,
                searchParmas: "fault_type",
                key: "customer-care.fault_classification",                
                selectMap: (() => {
                    let result = []                   
                    for (const key in Core.Const.CUSTOMER_CARE.FAULT_TYPE) {
                        if (key === '-1') {
                            result.unshift(Core.Const.CUSTOMER_CARE.FAULT_TYPE[key])
                        } else {
                            result.push(Core.Const.CUSTOMER_CARE.FAULT_TYPE[key])                        
                        }
                    }
                    return result
                })(),
            },
            {
                // 类型
                type: "select",
                value: undefined,
                searchParmas: "type",
                key: "common.type",                
                selectMap: (() => {
                    let result = []                    
                    for (const key in Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE) {                        
                        result.push(Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE[key])                        
                    }
                    return result
                })(),
            },
            {
                // 归属客服
                type: "input",
                value: undefined,
                searchParmas: "",
                key: "customer-care.belonging_customer_service",
            },
        ]
    }

    return result
})

// tabs 的数据
const statusList = computed(() => {
    let result = [
        { t: "common.all", count: statusData.value.all_total, color: "primary", key: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.ALL },
        { t: "customer-care.waiting_for_processing", count: statusData.value.waiting_total, color: "yellow", key: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.EQUALTREATMENT },
        { t: "customer-care.processing", count: statusData.value.process_total, color: "yellow", key: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.INPROCESS },
        { t: "customer-care.problem_solving", count: statusData.value.resolved_total, color: "yellow", key: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED },
    ];

    return result;
});

const tableColumns = computed(() => {
    let columns = [];
    if (!isDistributerAdmin.value) {
        columns = [
            { title: proxy.$t("customer-care.inquiry_number"), dataIndex: "uid", key: "uid" }, // 问询单号
            { title: proxy.$t("common.vehicle_no"), dataIndex: "vehicle_list", key: "vehicle_list" }, // 车架号
            { title: proxy.$t("customer-care.feedback_type"), dataIndex: "type", key: "type" }, // 反馈类型
            { title: proxy.$t("common.vehicle_model"), dataIndex: "category", key: "category" }, // 车型
            { title: proxy.$t("common.status"), dataIndex: "status", key: "status" }, // 状态
            { title: proxy.$t("common.create_time"), dataIndex: "create_time", key: "time" }, // 创建时间
            { title: proxy.$t("common.operations"), dataIndex: "operations", key: "operations", fixed: "right", width: 200, }, // 操作
        ]
    } else if (isDistributerAdmin.value) {
        columns = [
            { title: proxy.$t("customer-care.Construction_site_number"), dataIndex: "uid", key: "uid" }, // 工单编号
            { title: proxy.$t("customer-care.classify"), dataIndex: "sorting_type", key: "sorting_type" }, // 归类
            { title: proxy.$t("common.type"), dataIndex: "type", key: "type" }, // 类型
            { title: proxy.$t("customer-care.submitter"), dataIndex: "submit_user_name", key: "submit_user_name" }, // 提交人
            { title: proxy.$t("customer-care.part"), dataIndex: "part_list", key: "part_list" }, // 零件
            { title: proxy.$t("customer-care.processing_progress"), dataIndex: "status", key: "status" }, // 处理进度
            { title: proxy.$t("customer-care.model_number_mileage"), dataIndex: "mileage", key: "mileage" }, // 车型号、公里数
            { title: proxy.$t("customer-care.fault_classification"), dataIndex: "fault_type", key: "fault_type" }, // 故障分类
            { title: proxy.$t("customer-care.belonging_customer_service"), dataIndex: "claimant_user_name", key: "claimant_user_name" }, // 归属客服
            { title: proxy.$t("common.create_time"), dataIndex: "create_time", key: "time" }, // 创建时间
            { title: proxy.$t("customer-care.last_modification_time"), dataIndex: "update_time", key: "time" }, // 最近一次修改时间
            { title: proxy.$t("common.operations"), dataIndex: "operations", key: "operations", fixed: "right" }, // 操作
        ]
    }
    return columns;
});
/* computed end */

/* fetch start*/
// 获取状态数据
const getStatusFetch = (params = {}) => {
  const obj = {
    ...params
  }

  Core.Api.inquiry_sheet.statusList(obj).then((res) => {
    console.log("获取状态数据 res", res);
    statusData.value = res
  }).catch((err) => {
    console.log("获取状态数据 err", err);
  })
}

// 获取询问单列表
const getInquirySheet = Core.Api.inquiry_sheet.list;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request: getInquirySheet,    
    // dataCallBack(res) {
    //     console.log("数据 ", res);
    //     return [
    //         { 
    //             new_msg_id: 0, 
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
    //             sorting_type: 1, // 归类
    //             update_time: 1705993554, // 最后一次时间
    //             claimant_user_name: "admin1", // 归属人名称
    //         }
    //     ]
    // }
});

/* fetch end*/

/* methods start*/
const routerChange = (type, record) => {
    let routeUrl = "";
    if (!isDistributerAdmin.value) {
        // 分销商
        switch (type) {
            case "add": // 添加
                routeUrl = router.resolve({
                    path: "/customer-care/edit",                
                });
                window.open(routeUrl.href, "_blank");
            break;
            case "edit": // 编辑
                routeUrl = router.resolve({
                    path: "/customer-care/edit",
                    query: { id: record.id },
                });
                window.open(routeUrl.href, "_blank");
            break;
            case "detail": // 详情
                routeUrl = router.resolve({
                    path: "/customer-care/detail",
                    query: { id: record.id },
                });
                window.open(routeUrl.href, "_blank");
            break;
            case "msg": // 留言
                routeUrl = router.resolve({
                    path: "/customer-care/detail",
                    query: { id: record.id },
                });
                window.open(routeUrl.href, "_blank");
            break;
        }
    } else {
        // 平台方
        switch (type) {
            case "add": // 添加
                routeUrl = router.resolve({
                    path: "/inquiry-management/edit",                
                });
                window.open(routeUrl.href, "_blank");
            break;
            case "edit": // 编辑
                routeUrl = router.resolve({
                    path: "/inquiry-management/edit",
                    query: { id: record.id },
                });
                window.open(routeUrl.href, "_blank");
            break;
            case "detail": // 详情
                routeUrl = router.resolve({
                    path: "/inquiry-management/detail",
                    query: { id: record.id },
                });
                window.open(routeUrl.href, "_blank");
            break;
            case "msg": // 留言
                routeUrl = router.resolve({
                    path: "/inquiry-management/detail",
                    query: { id: record.id },
                });
                window.open(routeUrl.href, "_blank");
            break;
        }
    }    
};
const onSearch = (data) => {    
    searchParam.value = { ...data, ...searchForm.value };
    search();
};
const onReset = () => {
    refreshTable();
};

/* methods end*/

watch(
    () => router.currentRoute.value,
    (newValue, oldValue) => {
        console.log("newValue", newValue);
        if (newValue.matched[0].path === '/customer-care') {
            // 分销商的客户关怀
            isDistributerAdmin.value = false
        } else if (newValue.matched[0].path === '/inquiry-management') {
            // 平台方
            isDistributerAdmin.value = true
            getStatusFetch()
        }
    },
    {
        deep: true,
        immediate: true,
    }
);

onMounted(() => {
    searchParam.value.status = -1
    search();
})
</script>

<style lang="less" scoped>
#customer-care {
    .tabs-title {
        color:  #4E5969;
        font-size: 14px;
        font-weight: 400;
    }

    .table-title {
        color: #1D2129;
        font-size: 14px;
        font-weight: 500;
    }

    :depp(.ant-table-cell) {
        position: relative;
    }
    .new {        
        height: 52px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .new-msg {
            color: #FFF;
            font-size: 12px;
            font-weight: 400;
            background-color: #F53F3F;
            padding: 2px 10px;
            border-radius: 4px;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            left: 0;
        }
    }


    .new {

    }
}

.color-FF7D00 {
    border-radius: 4px;
    background: rgba(255, 125, 0, 0.10);
    color: #FF7D00;
    font-size: 14px;
    font-weight: 400;
    .flex();
    padding: 4px 14px;
    box-sizing: border-box;
}
.color-0061FF {
    border-radius: 4px;
    background: rgba(0, 97, 255, 0.10);
    color: #0061FF;
    font-size: 14px;
    font-weight: 400;
    padding: 4px 14px;
    box-sizing: border-box;
}
.color-00B42A {
    border-radius: 4px;
    background: rgba(38, 171, 84, 0.10);
    color: #00B42A;
    font-size: 14px;
    font-weight: 400;
    padding: 4px 14px;
    box-sizing: border-box;
}
</style>
