<template>
    <div class="have-paid">
        <div class="search">
            <a-row class="row-detail">
                <!-- 订单号 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">{{ $t("in.order_number") }}：</span>
                    <span class="value">
                        <a-input :placeholder="$t('def.input')" v-model:value="searchForm.sn" @keydown.enter="handleSearch" />
                    </span>
                </a-col>
                <!-- 手机号 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">{{ $t("n.phone") }}：</span>
                    <span class="value">
                        <a-input :placeholder="$t('def.input')" v-model:value="searchForm.user_phone" />
                    </span>
                </a-col>
                <!-- 收件人 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item" >
                    <span class="key">{{ $t("wb.receiver") }}：</span>
                    <span class="value">
                        <a-input :placeholder="$t('def.input')" v-model:value="searchForm.to_name" />
                    </span>
                </a-col>
                <!-- 快递单号 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">{{ $t("af.courier_number") }}：</span>
                    <span class="value">
                        <a-input :placeholder="$t('def.input')" v-model:value="searchForm.courier_number" />
                    </span>
                </a-col>
            </a-row>
        </div>
        <div> 
            <div class="btns m-b-20" >
                <div class="btn-left" ></div>
                <div class="btn-right">                  
                    <a-button @click="handleSearch" type="primary" >
                        {{ $t("def.search") }}
                    </a-button>
                    <a-button @click="handleSearchReset" >
                        {{ $t("def.reset") }}
                    </a-button>
                </div>
            </div>
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :row-key="(record) => record.id"
                :pagination="channelPagination"
                @change="handleTableChange"
            >
                <template #headerCell="{ title }">
                    {{ $t(title) }}
                </template>
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'operation'">
                        <!-- 发货按钮  根据状态判断是否显示 -->
                        <a-button type="link" v-if="Number(record.status) === Core.Const.RETAIL.Order_Status_Map['2'].value" @click="routerChange('ship', record)">
                            {{ $t("p.ship")}}
                        </a-button>       
                        <!-- 详情 --> 
                        <a-button type="link"  @click="routerChange('detail', record)">
                            {{ $t("retail.detail")}}
                        </a-button>                    
                        <!-- 退订审核 (只有在申请退订/退款)-->
                        <!-- <a-button v-if="Number(activeKey) === Core.Const.RETAIL.Order_Status_Map.apply_refund" type="link">
                            {{ $t("retail.unsubscribe_review")}}
                        </a-button>  -->
                        <!-- 查看原因 (只有已退订/退款) -->
                        <!-- <a-button v-if="Number(activeKey) === Core.Const.RETAIL.Order_Status_Map.unsubscribed_refunded" type="link">
                            {{ $t("retail.view_reason")}}
                        </a-button>     -->                  
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import Core from "@/core";
import TimeSearch from "@/components/common/TimeSearch.vue";
import { computed, getCurrentInstance, onMounted, reactive, ref,toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";

const loading = ref(false); // 加载
const { proxy } = getCurrentInstance();
// 定义要发送的emit事件
const emit = defineEmits(['getTabNumber'])

const searchForm = ref({
    sn: '',                  // 订单号
    user_phone: '',          // 手机号 without000
    to_name: '',             // 收件人 without000
    courier_number: '',      // 快递单号 without000
});
const tableData = ref([]);
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ["20", "40", "60", "80", "100"],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: (total) =>
        `${proxy.$t("n.all_total")} ${total} ${proxy.$t("in.total")}`,
}); // 分页配置

const router = useRouter();
const props = defineProps({
    activeKey:{
        type:[String,Number]
    }
})

onMounted(() => {
    getTableDataFetch({
        page: 1,
        status:props.activeKey
    });
});
/* 计算属性 */
const tableColumns = computed(() => {
    let columns = [
        {/* 订单号 */
            title: "in.order_number",
            dataIndex: "sn",
            key: "sn",
        },
        {/* 用户名称 */
            title: "dis.user_name",
            dataIndex: "user_name",
            key: "user_name",
        },
        {/* 手机号 */
            title: "n.phone",
            dataIndex: "user_phone",
            key: "user_phone",
            // util: "CRMOrderIncomeStatusFilter",
        }, 
        {/* 活动入口 */      // without000
            title: "item_order.active_entrance",
            dataIndex: "active_entrance",
            key: "active_entrance",
        },
        {/* 奖品名单来源 */
            title: "item_order.order_source",
            dataIndex: "channel",
            key: "channel",
        },
        {/* 奖项 */         // without000
            title: "item_order.awards",
            dataIndex: "date",
            key: "time",
        },
        {/* 收件人 */       
            title: "wb.receiver",
            dataIndex: "to_name",
            key: "to_name",             
        },
        {/* 收件人手机号 */
            title: "item_order.receiver_phone",
            dataIndex: "to_phone",
            key: "to_phone",            
        },
        {/* 收件地址 */
            title: "item_order.shipping_address",
            dataIndex: "to_address",
            key: "to_address",            
        },
        {/* 中奖时间 */     // without000
            title: "item_order.winning_time",
            dataIndex: "create_time",
            key: "create_time",            
        },
        {/* 奖品发货状态 */
            title: "item_order.prize_shipment_status",
            dataIndex: "status",
            key: "status",            
        },
        {/* 快递单号 */     // without000
            title: "af.courier_number",
            dataIndex: "courier_number",
            key: "courier_number",            
        },
        {/* 快递公司 */     // without000
            title: "af.courier",
            dataIndex: "courier",
            key: "courier",            
        },
        { title: "retail.operate", key: "operation", fixed: "right" },
    ];
    return columns;
});

/* 接口 start*/
// table接口
const getTableDataFetch = (params = {}) => {
    loading.value = true;
    Core.Api.GoodItemsOrder.orderList({
        ...params,
        ...searchForm
    }).then((res) => {
        channelPagination.value.total = res.count;
        console.log("getTableData res:", res);
        tableData.value = res.list;
        
    }).catch((err) => {
        console.log("getTableData err:", err);
    }).finally(() => {
        loading.value = false;
        emit('getTabNumber', {type:props.activeKey,data:80});

    });
};

/* 接口 end*/
/* methods */
const routerChange = (type, item = {}) => {
    let routeUrl = "";
    switch (type) {
        case "detail": // 详情
            routeUrl = router.resolve({
                path: "/good-items-order/order-edit",
                // query: { id: item.id },
            });
            window.open(routeUrl.href, "_blank");
            break;
    }
};

// 查询按钮
const handleSearch = () => {
    console.log(searchForm.value);
    getTableDataFetch({
        page_size: channelPagination.value.pageSize,
        page: 1,
        status:props.activeKey
    });
};
// 重置按钮
const handleSearchReset = () => {
    Object.assign(searchForm.value, {sn: '',user_phone: '',to_name: '',courier_number: ''})
    handleSearch();
};
const handleOtherSearch = (params) => {};
// 申请车辆
const addVehicle = () => {};
// 分页事件
const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...channelPagination.value };
    pager.current = pagination.current;
    if (pagination.pageSize !== channelPagination.value.pageSize) {
        pager.current = 1;
        pager.pageSize = pagination.pageSize;
    }
    channelPagination.value = pager;

    getTableDataFetch({

        page_size: channelPagination.value.pageSize,
        page: channelPagination.value.current,
        status:props.activeKey
    });
};
</script>

<style lang="less" scoped>
.btns {
    .fcc(space-between);
    .btn-left {
        .left-btn-style {
            background-color: #94bfff;
            color: #ffffff;
        }
    }
    .btn-right {
    }
}


.m-b-20 {
    margin-bottom: 20px;
}
</style>
