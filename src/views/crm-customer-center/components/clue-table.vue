<template>
    <div class="have-paid">
        <div class="search">
            <a-row class="row-detail">
                <!-- 搜索用户 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">搜索用户：</span>
                    <span class="value">
                        <a-input
                            :placeholder="$t('def.input')"
                            v-model:value="searchForm.uid"
                            @keydown.enter="handleSearch"
                        />
                    </span>
                </a-col>
                <!-- 意向度 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">意向度：</span>
                    <span class="value">
                        <a-select v-model:value="searchForm.Series" class="select-w">
                            <a-select-option v-for="item in Core.Const.RETAIL.Vehicle_Series" :value="item.key">
                                {{ item.value}}
                            </a-select-option>
                        </a-select>
                    </span>
                </a-col>
                <!-- 线索来源 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">线索来源：</span>
                    <span class="value">
                        <a-select v-model:value="searchForm.order_status" class="select-w">
                            <a-select-option v-for="item in Core.Const.RETAIL.Order_Status" :value="item.key">
                                {{ $t(item.value )}}
                            </a-select-option>
                        </a-select>
                    </span>
                </a-col>
                <template v-if="show">
                    <!-- 用户体验官 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <span class="key">用户体验官：</span>
                        <span class="value">
                            <a-select v-model:value="searchForm.order_status" class="select-w">
                                <a-select-option v-for="item in Core.Const.RETAIL.Order_Status" :value="item.key">
                                    {{ $t(item.value )}}
                                </a-select-option>
                            </a-select>
                        </span>
                    </a-col>
                    <!-- 订单状态 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <span class="key">订单状态：</span>
                        <span class="value">
                            <a-select v-model:value="searchForm.order_status" class="select-w">
                                <a-select-option v-for="item in Core.Const.RETAIL.Order_Status" :value="item.key">
                                    {{ $t(item.value )}}
                                </a-select-option>
                            </a-select>
                        </span>
                    </a-col>
                    <!-- 所属大区 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <span class="key">所属大区：</span>
                        <span class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </span>
                    </a-col>
                    <!-- 所属城市 -->
                    <a-col
                        :xs="24"
                        :sm="24"
                        :xl="8"
                        :xxl="6"
                        class="row-item"
                    >
                        <span class="key">所属城市：</span>
                        <span class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </span>
                    </a-col>
                    <!-- 所属门店 -->
                    <a-col
                        :xs="24"
                        :sm="24"
                        :xl="8"
                        :xxl="6"
                        class="row-item"
                    >
                        <span class="key">所属门店：</span>
                        <span class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </span>
                    </a-col>
                </template>
                <a-col
                    :xs="24"
                    :sm="24"
                    :xl="8"
                    :xxl="6"
                    class="row-item"
                    @click="moreSearch"
                >       
                    <span class="key option-text">
                        <span class="allow-icon">{{ show ? $t("search.stow"): $t("retail.more_screening")}}</span>
                        <i v-if="!show" class="icon i_xialajiantouxiao"></i>
                        <i v-else class="icon i_shouqijiantouxiao"></i>
                    </span>
                </a-col>
            </a-row>
        </div>
        <div> 
            <div class="btns m-b-20">
                <div class="btn-left"></div>
                <div class="btn-right">                  
                    <a-button @click="handleSearchReset">
                        {{ $t("def.reset") }}
                    </a-button>
                    <a-button @click="handleSearch" type="primary">
                        {{ $t("def.search") }}
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
                    <template v-if="column.key === 'name'">
                        <span class="blue-text">{{ text || '-' }}</span>
                    </template>
                    <template v-if="column.key === 'phone'">
                        <span class="blue-text">{{ text ? Core.Util.phoneEncryption(String(text)) : '-' }}</span>
                    </template>
                    <template v-if="column.key === 'intention'">
                        <my-tag border :color="CRM_CUSTOMER_CENTER.INTENTION_MAP[text]?.color" bgColor="#FFF" :borderColor="CRM_CUSTOMER_CENTER.INTENTION_MAP[text]?.borderColor">{{ text ? Core.Const.CRM_ORDER.INTENTION_STATUS[text][lang] : '-' }}</my-tag>
                    </template>
                    <template v-if="column.key === 'label'">
                        <my-tag color="#3381FF" bgColor="#E6EFFF" class="message-label" v-for="(item, index) in text.slice(0, 2)" :key="index">{{ item || '-' }}</my-tag>
                        <a-popover placement="top">
                            <template #content>
                                <my-tag color="#3381FF" bgColor="#E6EFFF" class="message-label" v-for="(item, index) in text.slice(2, text.length)" :key="index">{{ item || '-' }}</my-tag>
                            </template>
                            <my-tag color="#3381FF" bgColor="#E6EFFF" class="message-label pointer" v-if="text.length > 2">+{{ text.length - 2 }}</my-tag>
                        </a-popover>
                    </template>
                    <template v-if="column.key === 'officer'">
                        <img v-if="text" class="avatar-style" :src="record.avatar || CRM_CUSTOMER_CENTER.defaultAvatar">
                        <span class="user-name">{{ text }}</span>
                        <!-- <span>{{ record.employee_no }}</span> -->
                    </template>
                    <template v-if="column.key === 'order_status'">
                        <my-tag border :color="CRM_CUSTOMER_CENTER.Order_Status[text]?.color" :bgColor="CRM_CUSTOMER_CENTER.Order_Status[text]?.bgColor" :borderColor="CRM_CUSTOMER_CENTER.Order_Status[text]?.borderColor">{{ text ? $t(CRM_CUSTOMER_CENTER.Order_Status[text].value) : '-' }}</my-tag>
                    </template>
                    <template v-if="column.key === 'source_type_mapping'">
                        <span>{{ text ? CRM_CUSTOMER_CENTER.SOURCE_TYPE_MAP[text].key : '-' }}</span>
                    </template>

                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="routerChange('detail',record)">{{ $t('def.see') }}</a-button>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import Core from "@/core";
import myTag from "../../crm-staging/components/my-tag.vue";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const CRM_CUSTOMER_CENTER = Core.Const.CRM_CUSTOMER_CENTER

const show = ref(false); // 更多收起
const loading = ref(false); // 加载
const searchForm = ref({
    Series: undefined, // 车辆系列
    Order_Status: undefined, // 订单状态
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

onMounted(() => {
    getTableDataFetch({
        page: 1,
    });
});
const { proxy } = getCurrentInstance();
const router = useRouter();
const props = defineProps({
    activeKey:{
        type:[String, Number]
    }
})

/* 计算属性 */
const tableColumns = computed(() => {
    let columns = [
        { title: '名称', dataIndex: 'name', key:'name' },
        { title: '手机号', dataIndex: 'phone', key:'phone' },
        { title: '意向度', dataIndex: 'intention', key:'intention' },
        { title: '标签', dataIndex: 'label', key:'label' },
        { title: '所属大区', dataIndex: 'group_name', key: 'group_name' },
        { title: '所属城市', dataIndex: 'city', key: 'city' },
        { title: '所属门店', dataIndex: 'store', key: 'store' },
        { title: '用户体验官', dataIndex: 'officer', key:'officer' },
        { title: '订单状态', dataIndex: 'order_status', key: 'order_status' },
        { title: '付款方式', dataIndex: 'pay_type', key: 'pay_type' },
        { title: '线索来源', dataIndex: 'source_type_mapping', key: 'source_type_mapping' },
        { title: 'def.operate', key: 'operation', fixed: 'right' },
    ];
    return columns;
});
const lang = computed(() => {
    return proxy.$store.state.lang
});

/* 接口 start*/
// table接口
const getTableDataFetch = (params = {}) => {
    tableData.value = [
        {
            id: '1',
            name: '赵先生',
            phone: '',
            intention: '10',
            label: ['有摩托','新能源汽车','新能源汽车'],
            group_name: '华北大区',
            city: '北京门店',
            store: '上海浦东新区一号门店',
            avatar: '',
            officer: '李鹏程',
            order_status: '1',
            pay_type: '全款支付',
            source_type_mapping: '1',
        },
        {
            id: '2',
            name: '胡彦斌',
            phone: 13423425542,
            intention: '20',
            label: ['有摩托','新能源汽车','新能源汽车','新能源汽车','新能源汽车'],
            group_name: '华北大区',
            city: '北京门店',
            store: '上海浦东新区一号门店',
            avatar: '',
            officer: '李鹏程',
            order_status: '2',
            pay_type: '全款支付',
            source_type_mapping: '2',
        },
    ];
    // loading.value = true;
    // Core.Api.CRMOrderIncome.list({
    //     search_type: 10,
    //     ...params,
    // })
    //     .then((res) => {
    //         channelPagination.value.total = res.count;
    //         console.log("getTableData res:", res);
    //         tableData.value = res.list;
    //     })
    //     .catch((err) => {
    //         console.log("getTableData err:", err);
    //     })
    //     .finally(() => {
    //         loading.value = false;
    //     });
};
/* 接口 end*/
/* methods */
const routerChange = (type, item = {}) => {
    let routeUrl = "";
    switch (type) {
        case "detail": // 详情
            routeUrl = router.resolve({
                path: "/retail-order/order-detail",
                // query: { id: item.id },
            });
            window.open(routeUrl.href, "_blank");
            break;
    }
};
// 收起更多按钮
const moreSearch = () => {
    show.value = !show.value;
};
// 查询按钮
const handleSearch = () => {};
// 重置按钮
const handleSearchReset = () => {};
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

.blue-text {
    // font-size: 14px;
    color: #0061FF;
}
.title-style{
    color: #1D2129;
    font-family: PingFang SC;
    font-size: 14px;    
    font-weight: 500;
}
.avatar-style{
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
}
.user-name{
    margin-right: 8px;
}
.message-label {
    margin-right: 6px;
    &:last-child {
        margin-right: 0px;
    }
}
.pointer {
    cursor: pointer;
}
</style>
