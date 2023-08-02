<template>
    <div id="personnel">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t("retail.personnel_list") }}</div>
            </div>            
            <div class="search">
                <a-row class="row-detail">
                    <!-- 搜索人员 -->
                    <a-col
                        :xs="24"
                        :sm="24"
                        :xl="8"
                        :xxl="6"
                        class="row-item"
                    >
                        <div class="key">{{ $t("retail.searcher") }}：</div>                        
                        <div class="value">
                            <a-input
                                :placeholder="$t('retail.person_or_name')"
                                v-model:value="searchForm.person"                                
                            />
                        </div>
                    </a-col>
                    <!-- 工作状态 -->
                    <a-col
                        :xs="24"
                        :sm="24"
                        :xl="8"
                        :xxl="6"
                        class="row-item"
                    > 
                        <div class="key">{{ $t("retail.working_condition") }}：</div>                        
                        <div class="value">
                            <a-select v-model:value="searchForm.working_condition" class="select-w">
                                <a-select-option v-for="(item,key) in Core.Const.RETAIL.Working_condition" :value="item.key">
                                    {{ item[$i18n.locale] }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 职务 -->
                    <a-col
                        :xs="24"
                        :sm="24"
                        :xl="8"
                        :xxl="6"
                        class="row-item"
                    >
                        <div class="key">{{ $t("retail.job") }}：</div>                        
                        <div class="value">
                            <a-select v-model:value="searchForm.job" class="select-w">
                                <a-select-option v-for="item in Core.Const.RETAIL.Job" :value="item.key">
                                    {{ item[$i18n.locale] }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>                    
                    <template v-if="show">
                        <!-- 所属大区 -->
                        <a-col
                            :xs="24"
                            :sm="24"
                            :xl="8"
                            :xxl="6"
                            class="row-item"
                        >
                            <div class="key">{{ $t("retail.subregion") }}：</div>                        
                            <div class="value">
                                <a-select
                                    class="select-w"
                                    v-model:value="searchForm.status"
                                    :placeholder="$t('def.select')"
                                    @change="handleSearch"
                                >                    
                                    <a-select-option
                                        v-for="item of CRM_STATUS_MAP"
                                        :key="item.key"
                                        :value="item.value"
                                        >{{
                                            lang === "zh" ? item.zh : item.en
                                        }}</a-select-option
                                    >
                                </a-select>
                            </div>
                        </a-col>
                        <!-- 所属城市 -->
                        <a-col
                            :xs="24"
                            :sm="24"
                            :xl="8"
                            :xxl="6"
                            class="row-item"
                        >
                            <div class="key">{{ $t("retail.home_city") }}：</div>                        
                            <div class="value">
                                <a-select
                                    class="select-w"
                                    v-model:value="searchForm.status"
                                    :placeholder="$t('def.select')"
                                    @change="handleSearch"
                                >                    
                                    <a-select-option
                                        v-for="item of CRM_STATUS_MAP"
                                        :key="item.key"
                                        :value="item.value"
                                        >{{
                                            lang === "zh" ? item.zh : item.en
                                        }}</a-select-option
                                    >
                                </a-select>
                            </div>
                        </a-col>
                        <!-- 所属门店 -->
                        <a-col
                            :xs="24"
                            :sm="24"
                            :xl="8"
                            :xxl="6"
                            class="row-item"
                        >
                            <div class="key">{{ $t("retail.affiliated_store") }}：</div>                        
                            <div class="value">
                                <a-select
                                    class="select-w"
                                    v-model:value="searchForm.status"
                                    :placeholder="$t('def.select')"
                                    @change="handleSearch"
                                >                    
                                    <a-select-option
                                        v-for="item of CRM_STATUS_MAP"
                                        :key="item.key"
                                        :value="item.value"
                                        >{{
                                            lang === "zh" ? item.zh : item.en
                                        }}</a-select-option
                                    >
                                </a-select>
                            </div>
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
            <div class="table-container">
                <div class="btns">
                    <div class="btn-left">
                        <!-- 添加人员 -->
                        <a-button 
                            type="primary" 
                            @click="addPerson" 
                        >
                            <i class="icon i_add" />
                            {{ $t("retail.add_personnel") }}
                        </a-button>
                    </div>
                    <div class="btn-right">
                        <a-button @click="handleSearchReset">
                            {{ $t("def.reset")}}
                        </a-button>
                        <a-button @click="handleSearch" type="primary">
                            {{ $t("def.search")}}
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
                            <a-button type="link" @click="routerChange('detail',record)">{{ $t("retail.view") }}</a-button>
                            <a-button type="link" @click="routerChange('deit', record)">{{ $t("retail.edit") }}</a-button>
                            <a-button type="link" danger @click="routerChange('delete',record)">{{ $t("retail.delete") }}</a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
        <addPersonComponent v-if="isShow" v-model:isShow="isShow"/>
    </div>
</template>

<script setup>
import Core from "@/core";
import TimeSearch from "@/components/common/TimeSearch.vue";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import addPersonComponent from './components/addPerson.vue'

const show = ref(false); // 更多收起
const loading = ref(false); // 加载
const searchForm = ref({
    person: undefined, // 搜索人员
    working_condition: undefined, // 工作状态
    job: undefined, // 职务
});
// 添加人员弹窗
const isShow = ref(false)



const tableData = ref([]);
const channelPagination = ref({
  current: 1,
  pageSizeOptions: ['20', '40', '60', '80', '100'],
  pageSize: 20,
  showQuickJumper: true, // 是否可以快速跳转至某页
  showSizeChanger: true, // 是否可以改变 pageSize
  total: 0,
  showTotal: (total) => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`
}) // 分页配置

onMounted(() => {
    getTableDataFetch({
        page: 1,
    });
});
const {proxy} = getCurrentInstance()
const router = useRouter()

/* 计算属性 */
const tableColumns = computed(() => {  
    let columns = [
        {
            title: "retail.name",
            dataIndex: "name",
            key: "uid",            
        },
        {
            title: "retail.working_condition",
            dataIndex: ["order", "uid"],
            key: "order_uid",            
        },
        {
            title: "retail.phone",
            dataIndex: "status",
            key: "util",
            util: "CRMOrderIncomeStatusFilter",            
        },
        {
            title: "retail.job",
            dataIndex: "money",
            key: "money",            
        },
        {
            title: "retail.area",
            dataIndex: "refunded",
            key: "refunded",
        },
        {
            title: "retail.affiliated_store",
            dataIndex: "date",
            key: "time",            
        },
        // 绑定线索数
        {
            title: "retail.number_of_bound_threads",
            dataIndex: "type",
            key: "util",                       
        },
        // 上岗时间
        {
            title: "retail.start_date",
            dataIndex: "type",
            key: "util",                       
        },
        // 添加人员
        {
            title: "retail.add_personnel",
            dataIndex: "type",
            key: "util",                        
        },
        // 添加时间        
        {
            title: "retail.add_time",
            dataIndex: "type",
            key: "util",                       
        },           
        { title: "retail.operate", key: "operation", fixed: "right" },
    ];
    return columns;
});

/* 接口 start*/
// table接口
const getTableDataFetch = (params = {}) => {    
    loading.value = true;
    Core.Api.CRMOrderIncome.list({          
        search_type: 10,
        ...params
    }).then((res) => {
            channelPagination.value.total = res.count
            console.log("getTableData res:", res);            
            tableData.value = res.list;           
        })
        .catch((err) => {
            console.log("getTableData err:", err);
        })
        .finally(() => {
            loading.value = false;
        });
};
/* 接口 end*/
/* methods */
// 条件初始化
const init = () => {
    searchForm.value = {}
}
const routerChange = (type, item = {}) => {
    let routeUrl = "";
    switch (type) {
        case "detail": // 详情
            routeUrl = router.resolve({
                path: "/retail-personnel/personnel-detail",
                // query: { id: item.id },
            });
            window.open(routeUrl.href, "_blank");
            break;
        case "edit": // 编辑
            routeUrl = router.resolve({
                path: "/retail-personnel/personnel-detail",
                // query: { id: item.id },
            });
            window.open(routeUrl.href, "_blank");
            break;
        case "delete": // 删除           
            break;
    }
}
// 收起更多按钮
const moreSearch = () => {
    show.value = !show.value
};
// 查询按钮
const handleSearch = () => {
    console.log("searchForm", searchForm.value);
}; 
// 重置按钮
const handleSearchReset = () => {
    init()
};

// 添加人员
const addPerson = () => {
    isShow.value = true
}
// 分页事件
const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...channelPagination.value }
    pager.current = pagination.current
    if (pagination.pageSize !== channelPagination.value.pageSize) {
        pager.current = 1
        pager.pageSize = pagination.pageSize
    }
    channelPagination.value = pager
    getTableDataFetch({
        page_size: channelPagination.value.pageSize,
        page: channelPagination.value.current
    })
}
</script>

<style lang="less" scoped>
.btns {
    .fcc(space-between);
    margin-bottom: 20px;
    .btn-left {
        .left-btn-style {
            background-color: #94bfff;
            color: #ffffff;
        }
    }
    .btn-right {
    }
}
</style>
