<template>
    <div class="have-paid">
        <div class="search">
            <a-row class="row-detail">
                <!-- 搜索用户 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">搜索用户：</span>
                    <span class="value">
                        <a-input
                            placeholder="名称 / 手机号 / 用户ID"
                            v-model:value="searchForm.key"
                            @keydown.enter="handleSearch"
                        />
                    </span>
                </a-col>
                <!-- 意向度 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">意向度：</span>
                    <span class="value">
                        <a-select v-model:value="searchForm.intention" class="select-w">
                            <a-select-option v-for="item in optionsIntention" :value="item.key">
                                {{ item.zh }}
                            </a-select-option>
                        </a-select>
                    </span>
                </a-col>
                <!-- 来源 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">来源：</span>
                    <span class="value">
                        <a-select v-model:value="searchForm.source_type_mapping" class="select-w">
                            <a-select-option v-for="item in optionsSource" :value="item.key">
                                {{ item.title }}
                            </a-select-option>
                        </a-select>
                    </span>
                </a-col>
                <template v-if="show">
                    <!-- 订单状态 -->
                    <a-col
                        :xs="24"
                        :sm="24"
                        :xl="8"
                        :xxl="6"
                        class="row-item"
                    >
                        <span class="key">订单状态：</span>
                        <span class="value">
                            <a-select v-model:value="searchForm.order_status" class="select-w">
                                <a-select-option v-for="item in optionsStatus" :value="item.key">
                                    {{ item.text }}
                                </a-select-option>
                            </a-select>
                        </span>
                    </a-col>
                    <!-- 所属大区 -->
                    <a-col
                        :xs="24"
                        :sm="24"
                        :xl="8"
                        :xxl="6"
                        class="row-item"
                    >
                        <span class="key">所属大区：</span>
                        <span class="value">
                            <a-select v-model:value="searchForm.group_id" class="select-w" @change="handleChange('group')">
                                <a-select-option v-for="item in optionsRegion" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
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
                            <a-select v-model:value="searchForm.city" :disabled="!searchForm.group_id" class="select-w" @change="handleChange('city')">
                                <a-select-option v-for="item in optionsCity" :value="item.city">
                                    {{ item.city }}
                                </a-select-option>
                            </a-select>
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
                            <a-select v-model:value="searchForm.store_id" :disabled="!searchForm.city" class="select-w" @change="handleChange('store')">
                                <a-select-option v-for="item in optionsStore" :value="item.id">
                                    {{ item.name}}
                                </a-select-option>
                            </a-select>
                        </span>
                    </a-col>
                    <!-- 用户体验官 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <span class="key">用户体验官：</span>
                        <span class="value">
                            <a-select v-model:value="searchForm.store_user_id" :disabled="!searchForm.store_id" option-label-prop="label" class="select-w">
                                <a-select-option v-for="item in officerList" :value="item?.id" :label="item.user_name">
                                    <img :src="item.avatar" class ="options-img" alt="">
                                    <div class="option-right">
                                        <div class="options-top"> <span class="name-option">{{ item.user_name }}</span>&nbsp;&nbsp; <span class="phone-option">{{ item.user_phone }}</span>&nbsp;&nbsp;  <span class="work-option">{{ $Util.peoStoreStatus(item.type) }}</span></div>
                                        <div class="area-option">{{ item.group_name }}-{{ item.city }}&nbsp;&nbsp;{{ item.store_name }}</div>
                                    </div>
                                </a-select-option>
                            </a-select>
                        </span>
                    </a-col>
                </template>
            </a-row>
        </div>
        <div> 
            <div class="btns m-b-20">
                <div class="btn-left"></div>
                <div class="btn-right row-detail">   
                    <span class="key option-text" style="margin-right: 20px;" @click="moreSearch">
                        <span class="allow-icon">{{ show ? $t("search.stow"): $t("retail.more_screening")}}</span>
                        <i v-if="!show" class="icon i_xialajiantouxiao"></i>
                        <i v-else class="icon i_shouqijiantouxiao"></i>
                    </span>            
                    <a-button @click="handleSearch" type="primary">
                        {{ $t("def.search") }}
                    </a-button>
                    <a-button @click="handleSearchReset">
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
                    <template v-if="column.key === 'name'">
                        <span class="blue-text">{{ text || '-' }}</span>
                    </template>
                    <template v-if="column.key === 'phone'">
                        <span class="blue-text">{{ text ? Core.Util.phoneEncryption(String(text)) : '-' }}</span>
                    </template>
                    <template v-if="column.key === 'intention'">
                        <my-tag border :color="Static.INTENTION_MAP[text]?.color" bgColor="#FFF" :borderColor="Static.INTENTION_MAP[text]?.borderColor">{{ text ? Core.Const.CRM_ORDER.INTENTION_STATUS[text][lang] : '-' }}</my-tag>
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
                        <img v-if="text" class="avatar-style" :src="record.avatar || Static.defaultAvatar">
                        <span class="user-name">{{ text }}</span>
                        <!-- <span>{{ record.employee_no }}</span> -->
                    </template>
                    <template v-if="column.key === 'order_status'">
                        <my-tag border :color="Static.Order_Status[text]?.color" :bgColor="Static.Order_Status[text]?.bgColor" :borderColor="Static.Order_Status[text]?.borderColor">{{ text ? $t(Static.Order_Status[text].value) : '-' }}</my-tag>
                    </template>
                    <template v-if="column.key === 'source_type_mapping'">
                        <span>{{ text ? Static.SOURCE_TYPE_MAP[text].key : '-' }}</span>
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
import Static from "../static";
import TimeSearch from "@/components/common/TimeSearch.vue";
import myTag from "../../crm-staging/components/my-tag.vue";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const show = ref(false); // 更多收起
const loading = ref(false); // 加载
const optionsIntention = ref(Object.values(Core.Const.CRM_ORDER.INTENTION_STATUS));
const optionsSource = ref(Static.SOURCE_TYPE);
const optionsStatus = ref(Object.values(Static.ORDER_STATUS_MAP));
const optionsRegion = ref([]);
const optionsCity = ref([]);
const optionsStore = ref([]);
const officerList = ref([]);
const searchForm = reactive({
    key: undefined, // key
    intention: undefined,
    source_type_mapping: undefined,
    store_user_id: undefined,
    order_status: undefined,
    group_id: undefined,
    city: undefined,
    store_id: undefined,
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
    getGroupList();
});
const { proxy } = getCurrentInstance();
const router = useRouter();
const props = defineProps({
    activeKey:{
        type:[String,Number]
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
const handleChange = (type) => {
    switch (type) {
        case 'group':
            getCityList();
            break;
        case 'city':
            getStoreList();
            break;
        case 'store':
            getPeopleList();
            break;
    
        default:
            break;
    }
}
// 获取大区列表
const getGroupList = () => {
    Core.Api.CustomService.groupList().then(res=>{
		Core.Logger.success('getTaskNum',res);
		optionsRegion.value = res.list;
	}).catch(err=>{
        Core.Logger.error("参数", "数据", err)
	})
}
// 获取城市列表
const getCityList = (value) => {
    Core.Api.CustomService.getCityList({
        id: searchForm.group_id
    }).then(res=>{
		Core.Logger.success('getCityList',res);
		optionsCity.value = res;
	}).catch(err=>{
        Core.Logger.error("参数", "数据", err)
	})
}
// 获取门店列表
const getStoreList = () => {
    Core.Api.CustomService.storeList({
        group_id: searchForm.group_id,
        city: searchForm.city,
        page_size: 500,
    }).then(res=>{
		Core.Logger.success('storeList',res);
		optionsStore.value = res.list;
	}).catch(err=>{
        Core.Logger.error("参数", "数据", err)
	})
}
// 门店人员-获取
const getPeopleList = () => {
    Core.Api.CustomService.storeUserList({
        store_id: searchForm.store_id,
        page_size:500
    }).then(res=>{
		Core.Logger.success('getPeopleList',res);
		officerList.value = res.list;
	}).catch(err=>{
        Core.Logger.error("参数", "数据", err)
	})
}
// 收起更多按钮
const moreSearch = () => {
    show.value = !show.value;
};
// 查询按钮
const handleSearch = () => {
    console.log(searchForm)
};
// 重置按钮
const handleSearchReset = () => {
    Object.assign(searchForm, {
        key: undefined, // key
        intention: undefined,
        source_type_mapping: undefined,
        store_user_id: undefined,
        order_status: undefined,
        group_id: undefined,
        city: undefined,
        store_id: undefined,
    })
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
.search {
    margin-bottom: 20px;
}

.options-img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin: 10px 0px;
}
.option-right {
    display: inline-flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    vertical-align: top;
    margin-left: 12px;
    padding: 10px 0px;
}
.area-option {
    color:  #86909C;
    font-size: 12px;
    font-weight: 400;
}
</style>
