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
                <!-- 线索来源 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">来源：</span>
                    <span class="value">
                        <a-select v-model:value="searchForm.source_type" class="select-w">
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
                <div class="btn-right row-detail">                                 
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
                        <span class="blue-text">
                            {{ text ? Core.Util.phoneEncryption(String(text)) : '-' }}
                        </span>
                    </template>
                    <!-- 意向度 -->
                    <template v-if="column.key === 'intention'">
                        <my-tag border :color="CRM_CUSTOMER_CENTER.INTENTION_MAP[text]?.color" bgColor="#FFF" :borderColor="CRM_CUSTOMER_CENTER.INTENTION_MAP[text]?.borderColor">{{ text ? Core.Const.CRM_ORDER.INTENTION_STATUS[text][lang] : '-' }}</my-tag>
                    </template>
                    <!-- 所属大区 -->
                    <template v-if="column.key === 'group_name'">
                        {{ text || '-' }}
                    </template>
                    <!-- 所属城市 -->
                    <template v-if="column.key === 'city'">
                        {{ text || '-' }}
                    </template>
                    <!-- 所属门店 -->
                    <template v-if="column.key === 'store_name'">
                        {{ text || '-' }}
                    </template>                  
                    <!-- 用户体验官 -->
                    <template v-if="column.key === 'store_user_name'">
                        <img class="avatar-style" :src="record.store_user_avatar || CRM_CUSTOMER_CENTER.defaultAvatar">
                        <span class="user-name">{{ text || '-' }}</span>
                        <span>{{ record.store_user_employee_no }}</span>
                    </template>
                    <!-- 订单状态 -->
                    <template v-if="column.key === 'order_status'">
                        <span v-if="!CRM_CUSTOMER_CENTER.ORDER_STATUS_MAP[text]?.text">-</span>
                        <my-tag 
                            v-else
                            border 
                            :color="CRM_CUSTOMER_CENTER.ORDER_STATUS_MAP[text]?.color" 
                            :bgColor="CRM_CUSTOMER_CENTER.ORDER_STATUS_MAP[text]?.bgColor" 
                            :borderColor="CRM_CUSTOMER_CENTER.ORDER_STATUS_MAP[text]?.borderColor">
                            {{ CRM_CUSTOMER_CENTER.ORDER_STATUS_MAP[text].text }}
                        </my-tag>
                    </template>             
                    <!-- 付款方式 -->
                    <template v-if="column.key === 'pay_type'">
                        <span>分期付款</span>
                    </template>
                    <!-- 线索来源 -->
                    <template v-if="column.key === 'source_type'">                    
                        <span>{{ text ? CRM_CUSTOMER_CENTER.SOURCE_TYPE_MAP[text]?.key : '-' }}</span>
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
import { computed, getCurrentInstance, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const CRM_CUSTOMER_CENTER = Core.Const.CRM_CUSTOMER_CENTER

const show = ref(false); // 更多收起
const loading = ref(false); // 加载
const optionsIntention = ref(Object.values(Core.Const.CRM_ORDER.INTENTION_STATUS));
const optionsSource = ref(CRM_CUSTOMER_CENTER.SOURCE_TYPE);
const optionsStatus = ref(Object.values(CRM_CUSTOMER_CENTER.ORDER_STATUS_SEARCH_MAP));
const optionsRegion = ref([]);
const optionsCity = ref([]);
const optionsStore = ref([]);
const officerList = ref([]);
const searchForm = reactive({
    key: undefined, // key
    intention: undefined,
    source_type: undefined,
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


const { proxy } = getCurrentInstance();
const router = useRouter();
const props = defineProps({
    activeKey:{
        type:[String, Number]
    }
})
watch(
    () => props.activeKey,
    (newValue, oldValue) => {
        getTableDataFetch({
            page: 1,
            search_type: newValue
        });
    }    
)
onMounted(() => {
    getTableDataFetch({
        page: 1,
        search_type: props.activeKey
    });
    getGroupList();
});

/* 计算属性 */
const tableColumns = computed(() => {
    let columns = [
        { title: '名称', dataIndex: 'name', key:'name' },
        { title: '手机号', dataIndex: 'phone', key:'phone' },
        { title: '意向度', dataIndex: 'intention', key:'intention' },        
        { title: '所属大区', dataIndex: 'group_name', key: 'group_name' },
        { title: '所属城市', dataIndex: 'city', key: 'city' },
        { title: '所属门店', dataIndex: 'store_name', key: 'store_name' },
        { title: '用户体验官', dataIndex: 'store_user_name', key:'store_user_name' },
        { title: '订单状态', dataIndex: 'order_status', key: 'order_status' },
        { title: '付款方式', dataIndex: 'pay_type', key: 'pay_type' },
        { title: '线索来源', dataIndex: 'source_type', key: 'source_type' },
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
    let obj = {
        choose_type: CRM_CUSTOMER_CENTER.CHOOSE_TYPE.USER, // 1-线索列表 2-用户列表
        ...params
    }
    Core.Api.USER_CENTER.getClueList(obj).then(res => {
        channelPagination.value.total = res.count
        Core.Logger.success("参数", obj, "获取线索list", res)      
        tableData.value = res.list || []
    }).catch(err => {
        Core.Logger.error("参数", obj, "获取线索list", err)
    })
};
/* 接口 end*/
/* methods */
const routerChange = (type, item = {}) => {
    let routeUrl = "";
    switch (type) {
        case "detail": // 详情
            routeUrl = router.resolve({
                path: "/crm-staging/staging",
                query: { id: item.id },
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
    getTableDataFetch({ page: 1, ...searchForm })
};
// 重置按钮
const handleSearchReset = () => {
    Object.assign(searchForm, {
        key: undefined, // key
        intention: undefined,
        source_type: undefined,
        store_user_id: undefined,
        order_status: undefined,
        group_id: undefined,
        city: undefined,
        store_id: undefined,
    })
    getTableDataFetch({ page: 1, })
};
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
