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
                <a-tabs v-model:activeKey="searchForm.status" @change="handleSearch">
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
                    <template #bodyCell="{ column, text, record }">
                        <!-- <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                    text || "-"
                                }}</a-button>
                            </a-tooltip>
                        </template> -->
                        <!-- <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="$Util.feedbackStatusFilter(text, 'color')">
                                <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                                    {{ $Util.feedbackStatusFilter(text, $i18n.locale) }}
                                </a-tooltip>
                            </div>
                        </template> -->
                        <!-- 公共 -->
                        <!-- 时间类型 -->
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text, 3) }}
                        </template>
                        <!-- 订单-状态 -->
                        <template v-if="column.key === 'status'">
                            {{ Core.Const.CUSTOMER_CARE.ORDER_STATUS[text] ? $t(Core.Const.CUSTOMER_CARE.ORDER_STATUS[text].t) : '-' }}
                        </template>

                        <!-- 平台方 -->
                        <!-- 归类 -->
                        <template v-if="column.key === 'sorting_type'">
                            {{ Core.Const.CUSTOMER_CARE.SORTING_TYPE[text] ? $t(Core.Const.CUSTOMER_CARE.SORTING_TYPE[text].t) : '-' }}
                        </template>
                        <!-- 故障类型 -->
                        <template v-if="column.key === 'fault_type'">
                            {{ Core.Const.CUSTOMER_CARE.FAULT_TYPE[text] ? $t(Core.Const.CUSTOMER_CARE.FAULT_TYPE[text].t) : '-' }}
                        </template>

                        <!-- 分销商 -->
                        <!-- 反馈类型 -->
                        <template v-if="column.key === 'type'">
                            {{ Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE[text] ? $t(Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE[text].t) : '-' }}
                        </template>

                        <template v-if="column.key === 'operations'">
                            <a-button type="link" @click="routerChange('detail', record)">
                                <MySvgIcon icon-class="supply-view" />
                                <span class="m-l-4">{{ $t("common.view") }}</span>
                            </a-button>
                            <a-button type="link" @click="routerChange('edit', record)">
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
import { ref, computed, getCurrentInstance, watch } from "vue";
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
        }
    },
    {
        deep: true,
        immediate: true,
    }
);
    
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
        { t: "common.all", count: 0, color: "primary", key: 1 },
        { t: "customer-care.waiting_for_processing", count: 0, color: "yellow", key: 2 },
        { t: "customer-care.processing", count: 0, color: "yellow", key: 3 },
        { t: "customer-care.problem_solving", count: 0, color: "yellow", key: 4 },
    ];

    return result;
});

const tableColumns = computed(() => {
    let columns = [];
    if (!isDistributerAdmin.value) {
        columns = [
            { title: proxy.$t("customer-care.inquiry_number"), dataIndex: "uid", key: "uid" }, // 问询单号
            { title: proxy.$t("common.vehicle_no"), dataIndex: "vehicle_uid", key: "vehicle_uid" }, // 车架号
            { title: proxy.$t("customer-care.feedback_type"), dataIndex: "type", key: "type" }, // 反馈类型
            { title: proxy.$t("common.vehicle_model"), dataIndex: "uid", key: "uid" }, // 车型(未找到)
            { title: proxy.$t("common.status"), dataIndex: "status", key: "status" }, // 状态
            { title: proxy.$t("common.create_time"), dataIndex: "create_time", key: "time" }, // 创建时间
            { title: proxy.$t("common.operations"), dataIndex: "operations", key: "operations", fixed: "right", width: 200, }, // 操作
        ]
    } else if (isDistributerAdmin.value) {
        columns = [
            { title: proxy.$t("customer-care.Construction_site_number"), dataIndex: "uid", key: "uid" }, // 工单编号
            { title: proxy.$t("customer-care.classify"), dataIndex: "sorting_type", key: "sorting_type" }, // 归类
            { title: proxy.$t("common.type"), dataIndex: "type", key: "type" }, // 类型
            { title: proxy.$t("customer-care.submitter"), dataIndex: "uid", key: "uid" }, // 提交人
            { title: proxy.$t("customer-care.part"), dataIndex: "uid", key: "uid" }, // 零件
            { title: proxy.$t("customer-care.processing_progress"), dataIndex: "status", key: "status" }, // 处理进度
            { title: proxy.$t("customer-care.model_number_mileage"), dataIndex: "mileage", key: "mileage" }, // 车型号、公里数
            { title: proxy.$t("customer-care.fault_classification"), dataIndex: "fault_type", key: "fault_type" }, // 故障分类
            { title: proxy.$t("customer-care.belonging_customer_service"), dataIndex: "uid", key: "uid" }, // 归属客服
            { title: proxy.$t("common.create_time"), dataIndex: "create_time", key: "time" }, // 创建时间
            { title: proxy.$t("customer-care.last_modification_time"), dataIndex: "process_end_time", key: "time" }, // 最近一次修改时间
            { title: proxy.$t("common.operations"), dataIndex: "operations", key: "operations", fixed: "right" }, // 操作
        ]
    }
    return columns;
});
/* computed end */

/* fetch start*/
// 获取表格数据
const request = Core.Api.Feedback.list;

/* fetch end*/

const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
});

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
    searchParam.value = data;
    search();
};
const onReset = () => {
    refreshTable();
};
/* methods end*/
</script>

<style lang="less" scoped>
#customer-care {
}
</style>
