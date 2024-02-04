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
                <SearchAll ref="search_all" :options="isDistributerAdmin ? searchAdminList : searchDistributerList" @search="onSearch" @reset="onReset"> </SearchAll>
            </div>
            <!-- table -->
            <div class="table-container">
                <a-button v-if="isDistributerAdmin" class="m-b-10" type="primary" @click="handleExportIn/*导出功能*/">
                    <i class="icon i_download" />{{ $t("common.export") }}
                </a-button>
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :loading="loading"
                    :locale="$i18n.locale === 'en' ? localeEn : localeZh"
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
                                <span class="new-msg" v-if="newMsgIdFn(record, 'admin')">{{ $t("customer-care.new_msg") /*新消息*/ }}</span>
                                <div>{{ text || "-" }}</div>
                            </div>
                        </template>
                        <!-- 时间类型 -->
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text, 2) }}
                        </template>
                        <!-- 订单-状态 -->
                        <template v-if="column.key === 'status'">
                            <div
                                class="status-style"
                                :class="[
                                    $Util.Common.returnClassName(text, [
                                        {
                                            status: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.INPROCESS,
                                            className: 'color-0061FF',
                                        },
                                        {
                                            status: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.EQUALTREATMENT,
                                            className: 'color-FF7D00',
                                        },
                                        {
                                            status: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED,
                                            className: 'color-00B42A',
                                        },
                                    ]),
                                ]"
                            >
                                {{ $t($Util.Common.returnTranslation(text, Core.Const.CUSTOMER_CARE.ORDER_STATUS)) }}
                            </div>
                        </template>

                        <!-- 平台方 -->
                        <!-- 归类 -->
                        <template v-if="column.key === 'purpose'">
                            {{ $t($Util.Common.returnTranslation(text, Core.Const.CUSTOMER_CARE.SORTING_TYPE_THREE)) }}
                        </template>
                        <!-- 故障类型 -->
                        <template v-if="column.key === 'fault_type'">
                            <template
                                v-if="$Util.Common.returnTypeBool(record.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.BATTERY /*电池*/])"
                            >
                                {{ $t($Util.Common.returnTranslation(text, Core.Const.CUSTOMER_CARE.FAULT_TYPE)) }}
                            </template>
                            <template v-else>
                                <a-tooltip placement="topLeft">
                                    <template #title>
                                        <span v-for="(item, index) in record.vehicle_list">
                                            <span>
                                                {{
                                                    item.vehicle_uid +
                                                    "(" +
                                                    $t($Util.Common.returnTranslation(item?.fault_type, Core.Const.CUSTOMER_CARE.FAULT_TYPE)) +
                                                    ")"
                                                }}
                                            </span>
                                            <span v-if="record.vehicle_list.length > 1">,</span>
                                        </span>
                                    </template>
                                    <div
                                        class="one-spils cursor"
                                        :style="{
                                            width: column.width + 'px',
                                        }"
                                    >
                                        <span v-for="(item, index) in record.vehicle_list">
                                            <span>
                                                {{
                                                    item.vehicle_uid +
                                                    "(" +
                                                    $t($Util.Common.returnTranslation(item?.fault_type, Core.Const.CUSTOMER_CARE.FAULT_TYPE)) +
                                                    ")"
                                                }}
                                            </span>
                                            <span v-if="record.vehicle_list.length > 1">,</span>
                                        </span>
                                        <template v-if="record.vehicle_list.length === 0">-</template>
                                    </div>
                                </a-tooltip>
                            </template>
                        </template>
                        <!-- 零件 -->
                        <template v-if="column.key === 'part_list'">
                            <a-tooltip placement="topLeft">
                                <template #title>
                                    <span v-for="(item, index) in record.part_list">
                                        <span>{{ $i18n.locale === "en" ? item?.item?.name_en || "-" : item?.item?.name || "-" }}</span>
                                        <span v-if="record.part_list.length > 1">,</span>
                                    </span>
                                </template>
                                <div
                                    class="one-spils cursor"
                                    :style="{
                                        width: column.width + 'px',
                                    }"
                                >
                                    <span v-for="(item, index) in record.part_list">
                                        <span>{{ $i18n.locale === "en" ? item?.item?.name_en || "-" : item?.item?.name || "-" }}</span>
                                        <span v-if="record.part_list.length > 1">,</span>
                                    </span>
                                    <template v-if="record.part_list.length === 0">-</template>
                                </div>
                            </a-tooltip>
                        </template>
                        <!-- 车型号,公里数 -->
                        <template v-if="column.key === 'mileage'">
                            <a-tooltip placement="topLeft">
                                <template #title>
                                    <span v-for="(item, index) in record.vehicle_list">
                                        <span>
                                            {{ item.vehicle_uid + "(" + item.mileage + "km" + ")" }}
                                        </span>
                                        <span v-if="record.vehicle_list.length > 1">,</span>
                                    </span>
                                </template>
                                <div
                                    class="one-spils cursor"
                                    :style="{
                                        width: column.width + 'px',
                                    }"
                                >
                                    <span v-for="(item, index) in record.vehicle_list">
                                        <span>
                                            {{ item.vehicle_uid + "(" + item.mileage + "km" + ")"  }}
                                        </span>
                                        <span v-if="record.vehicle_list.length > 1">,</span>
                                    </span>
                                    <template v-if="record.vehicle_list.length === 0">-</template>
                                </div>
                            </a-tooltip>
                        </template>

                        <!-- 分销商 -->
                        <!-- 车架号 -->
                        <template v-if="column.key === 'vehicle_list'">
                            <a-tooltip placement="topLeft">
                                <template #title>
                                    <span v-for="(item, index) in record.vehicle_list">
                                        <span>{{ item.vehicle_uid }}</span>
                                        <span v-if="record.vehicle_list.length > 1">,</span>
                                    </span>
                                </template>                                
                                <div
                                    class="one-spils cursor"
                                    :style="{
                                        width: column.width + 'px',
                                    }"
                                >
                                    <span v-for="(item, index) in record.vehicle_list">
                                        <span>{{ item.vehicle_uid || '-' }}</span>
                                        <span v-if="record.vehicle_list.length > 1">,</span>
                                    </span>
                                    
                                    <template v-if="record.vehicle_list.length === 0">-</template>
                                </div>
                            </a-tooltip>
                        </template>
                        <!-- 车型 -->
                        <template v-if="column.key === 'category'">
                            {{ $i18n.locale === "en" ? record.category?.name_en : record.category?.name }}
                        </template>
                        <!-- 反馈类型 -->
                        <template v-if="column.key === 'type'">
                            {{ $t($Util.Common.returnTranslation(text, Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE)) }}
                        </template>

                        <template v-if="column.key === 'operations'">
                            <a-button type="link" @click="routerChange('detail', record)">
                                <MySvgIcon icon-class="common-view" />
                                <span class="m-l-4">{{ $t("common.detail") }}</span>
                            </a-button>
                            <template v-if="!$Util.Common.returnTypeBool(record.status, [Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED])">
                                <a-button v-if="editCommentAuth($auth('enquiry-ticket.edit'))" type="link" @click="routerChange('edit', record)">
                                    <MySvgIcon icon-class="common-edit" />
                                    <span class="m-l-4">{{ $t("common.edit") }}</span>
                                </a-button>
                                <a-button v-if="editCommentAuth($auth('enquiry-ticket.comment'))" type="link" @click="routerChange('msg', record)">
                                    <MySvgIcon icon-class="common-leave" />
                                    <span class="m-l-4">{{ $t("customer-care.leave_message") }}</span>
                                </a-button>
                            </template>
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
import localeEn from 'ant-design-vue/es/date-picker/locale/en_US';
import localeZh from 'ant-design-vue/es/date-picker/locale/zh_CN';

const STATUS = Core.Const.FEEDBACK.STATUS;
const LOGIN_TYPE = Core.Const.LOGIN.TYPE;
const USER_TYPE = Core.Const.USER.TYPE;
import TimeSearch from "@/components/common/TimeSearch.vue";
import { useRouter, useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { result } from "lodash";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const searchForm = ref({
    status: undefined,
});

const isDistributerAdmin = ref(false); // 根据路由判断其是用在分销商(false) 还是平台方(true)
const statusData = ref({
    process_total: 0, //处理中总数
    resolved_total: 0, //问题解决总数
    waiting_total: 0, //等待处理总数
    all_total: 0, //所有数量
}); // 平台方tab数据

/* computed start */
// 筛选条件
// 分销商查询
const searchDistributerList = ref([
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
            let result = [];
            for (const key in Core.Const.CUSTOMER_CARE.ORDER_STATUS) {
                if (key === "-1") {
                    result.unshift(Core.Const.CUSTOMER_CARE.ORDER_STATUS[key]);
                } else {
                    result.push(Core.Const.CUSTOMER_CARE.ORDER_STATUS[key]);
                }
            }
            return result;
        })(),
    },
]);
// 平台方
const searchAdminList = ref([
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
        searchParmas: "part_name",
        key: "customer-care.part",
    },
    {
        // 车型
        type: "input",
        value: undefined,
        searchParmas: "category_name",
        key: "common.vehicle_model",
    },
    {
        // 问询标签
        type: "select",
        value: undefined,
        searchParmas: "purpose",
        key: "customer-care.inquiry_label",
        selectMap: (() => {
            let result = [];
            for (const key in Core.Const.CUSTOMER_CARE.SORTING_TYPE) {
                if (key === "-1") {
                    result.unshift(Core.Const.CUSTOMER_CARE.SORTING_TYPE[key]);
                } else {
                    result.push(Core.Const.CUSTOMER_CARE.SORTING_TYPE[key]);
                }
            }
            return result;
        })(),
    },
    // {
    //     // 处理进度
    //     type: "select",
    //     value: undefined,
    //     searchParmas: "status",
    //     key: "customer-care.processing_progress",
    //     selectMap: (() => {
    //         let result = [];
    //         for (const key in Core.Const.CUSTOMER_CARE.ORDER_STATUS) {
    //             if (key === "-1") {
    //                 result.unshift(Core.Const.CUSTOMER_CARE.ORDER_STATUS[key]);
    //             } else {
    //                 result.push(Core.Const.CUSTOMER_CARE.ORDER_STATUS[key]);
    //             }
    //         }
    //         return result;
    //     })(),
    // },
    {
        // 故障分类
        type: "select",
        value: undefined,
        searchParmas: "fault_type",
        key: "customer-care.fault_classification",
        selectMap: (() => {
            let result = [];
            for (const key in Core.Const.CUSTOMER_CARE.FAULT_TYPE) {
                if (key === "-1") {
                    result.unshift(Core.Const.CUSTOMER_CARE.FAULT_TYPE[key]);
                } else {
                    result.push(Core.Const.CUSTOMER_CARE.FAULT_TYPE[key]);
                }
            }
            return result;
        })(),
    },
    {
        // 类型
        type: "select",
        value: undefined,
        searchParmas: "type",
        key: "common.type",
        selectMap: (() => {
            let result = [];
            for (const key in Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE) {
                result.push(Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE[key]);
            }
            return result;
        })(),
    },
    {
        // 归属客服
        type: "input",
        value: undefined,
        searchParmas: "process_user_name",
        key: "customer-care.belonging_customer_service",
    },
]);

// tabs 的数据
const statusList = computed(() => {
    let result = [
        { t: "common.all", count: statusData.value.all_total, color: "primary", key: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.ALL },
        {
            t: "customer-care.waiting_for_processing",
            count: statusData.value.waiting_total,
            color: "yellow",
            key: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.EQUALTREATMENT,
        },
        {
            t: "customer-care.processing",
            count: statusData.value.process_total,
            color: "yellow",
            key: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.INPROCESS,
        },
        {
            t: "customer-care.problem_solving",
            count: statusData.value.resolved_total,
            color: "yellow",
            key: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED,
        },
    ];

    return result;
});

const tableColumns = computed(() => {
    let columns = [];
    if (!isDistributerAdmin.value) {
        columns = [
            { title: proxy.$t("customer-care.inquiry_number"), dataIndex: "uid", key: "uid" }, // 问询单号
            { title: proxy.$t("common.vehicle_no"), dataIndex: "vehicle_list", key: "vehicle_list", width: 150 }, // 车架号
            { title: proxy.$t("customer-care.feedback_type"), dataIndex: "type", key: "type" }, // 反馈类型
            { title: proxy.$t("common.vehicle_model"), dataIndex: "category", key: "category" }, // 车型
            { title: proxy.$t("common.status"), dataIndex: "status", key: "status", width: 70 }, // 状态
            { title: proxy.$t("common.create_time"), dataIndex: "create_time", key: "time" }, // 创建时间
            { title: proxy.$t("common.operations"), dataIndex: "operations", key: "operations", fixed: "right", width: 200 }, // 操作
        ];
    } else if (isDistributerAdmin.value) {
        columns = [
            { title: proxy.$t("customer-care.Construction_site_number"), dataIndex: "uid", key: "uid" }, // 工单编号
            { title: proxy.$t("customer-care.classify"), dataIndex: "purpose", key: "purpose" }, // 归类
            { title: proxy.$t("common.type"), dataIndex: "type", key: "type" }, // 类型
            { title: proxy.$t("customer-care.submitter"), dataIndex: "submit_user_name", key: "submit_user_name" }, // 提交人
            { title: proxy.$t("customer-care.part"), dataIndex: "part_list", key: "part_list", width: 150 }, // 零件
            { title: proxy.$t("customer-care.processing_progress"), dataIndex: "status", key: "status", width: 70 }, // 处理进度
            { title: proxy.$t("customer-care.model_number_mileage"), dataIndex: "mileage", key: "mileage", width: 150 }, // 车架号、公里数
            { title: proxy.$t("customer-care.fault_classification"), dataIndex: "fault_type", key: "fault_type", width: 150 }, // 故障分类
            { title: proxy.$t("customer-care.belonging_customer_service"), dataIndex: "process_user_name", key: "process_user_name" }, // 归属客服
            { title: proxy.$t("common.create_time"), dataIndex: "create_time", key: "time" }, // 创建时间
            { title: proxy.$t("customer-care.last_modification_time"), dataIndex: "update_time", key: "time" }, // 最近一次修改时间
            { title: proxy.$t("common.operations"), dataIndex: "operations", key: "operations", fixed: "right" }, // 操作
        ];
    }
    return columns;
});
/* computed end */

/* fetch start*/
// 获取状态数据
const getStatusFetch = (params = {}) => {
    const obj = {
        ...params,
    };

    Core.Api.inquiry_sheet
        .statusList(obj)
        .then((res) => {
            console.log("获取状态数据 res", res);
            statusData.value = res;
        })
        .catch((err) => {
            console.log("获取状态数据 err", err);
        });
};
// 导出接口
const exportFetch = (params = {}) => {
    const obj = {
        ...params,
    };

    Core.Api.Export.enquiryTickeTexport(obj)        
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

                storageFn(Core.Data.getDistributorNewMsg(), "setDistributorNewMsg", record);

                break;
            case "msg": // 留言
                routeUrl = router.resolve({
                    path: "/customer-care/detail",
                    query: {
                        id: record.id,
                        leave: true,
                    },
                });
                window.open(routeUrl.href, "_blank");

                storageFn(Core.Data.getDistributorNewMsg(), "setDistributorNewMsg", record);

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

                storageFn(Core.Data.getAdminNewMsg(), "setAdminNewMsg", record);
                break;
            case "msg": // 留言
                routeUrl = router.resolve({
                    path: "/inquiry-management/detail",
                    query: {
                        id: record.id,
                        leave: true,
                    },
                });
                window.open(routeUrl.href, "_blank");

                storageFn(Core.Data.getAdminNewMsg(), "setAdminNewMsg", record);
                break;
        }
    }
};
const onSearch = (data) => {
    console.log("data", data);    
    searchParam.value = { ...searchForm.value, ...data };
    search();
};
const onReset = () => {
    refreshTable();
};
// 点击留言的时候存储本地
const storageFn = (loaclData, setLoaclDataName, record) => {
    let newMsg = loaclData || [];

    // 判断本地是否存在id(存在替换)
    const findIndex = newMsg?.findIndex((el) => el.id === record.id);
    if (findIndex !== -1) {
        newMsg?.splice(findIndex, 1, {
            id: record.id,
            new_msg_id: record.new_msg_id,
        });
    } else {
        newMsg?.push({
            id: record.id,
            new_msg_id: record.new_msg_id,
        });
    }

    Core.Data[setLoaclDataName](newMsg);
};
// 判断是否显示新消息标签
const newMsgIdFn = (record) => {
    let loaclData = [];

    if (isDistributerAdmin.value) {
        // 平台方
        loaclData = Core.Data.getAdminNewMsg();
    } else {
        // 分销商
        loaclData = Core.Data.getDistributorNewMsg();
    }

    const find = loaclData?.find((el) => Number(el.id) === Number(record.id));
    // console.log("find data", find);

    // 判断找到的本地数据的数量是否少于渲染的数据(是 返回true 否则返回 false)
    return find?.new_msg_id ? Number(find?.new_msg_id) < Number(record?.new_msg_id) : record?.new_msg_id > 0;
};
// 导出功能
const search_all = ref(null)
const handleExportIn = () => {
    search_all.value.handleSearch()
    let exportUrl = Core.Api.Export.enquiryTickeTexport({ ...Core.Util.searchFilter(searchParam.value) })    
    console.log("exportUrl", exportUrl);
    window.open(exportUrl, '_blank')
}

// 分销商 不需要编辑和留言功能
const editCommentAuth = (type) => {

    let result = false    

    if (isDistributerAdmin.value) {
        result = true
    } else {
        result = type
    }
    return result
}

/* methods end*/

watch(
    () => router.currentRoute.value,
    (newValue, oldValue) => {
        console.log("newValue", newValue);
        if (newValue.matched[0].path === "/customer-care") {
            // 分销商的客户关怀
            isDistributerAdmin.value = false;
        } else if (newValue.matched[0].path === "/inquiry-management") {
            // 平台方
            isDistributerAdmin.value = true;
            getStatusFetch();
        }
    },
    {
        deep: true,
        immediate: true,
    }
);

onMounted(() => {
    searchParam.value.status = -1;
    search();
});
</script>

<style lang="less" scoped>
#customer-care {
    .table-title {
        color: #1d2129;
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
        // align-items: center;
        .new-msg {
            color: #fff;
            font-size: 12px;
            font-weight: 400;
            background-color: #f53f3f;
            padding: 0px 8px;
            border-radius: 0px 0px 4px 0px;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            left: 0;
        }
    }

    .new {
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
