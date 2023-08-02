<template>
    <div class="rolePermissMan">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t("retail.identity_management") }}</div>
            </div>            
            <div class="search">
                <a-row class="row-detail">
                    <!-- 搜索身份 -->
                    <a-col
                        :xs="24"
                        :sm="24"
                        :xl="8"
                        :xxl="6"
                        class="row-item"
                    >
                        <div class="key key-form-86909C">{{ $t("retail.search_identity") }}：</div>                        
                        <div class="value">
                            <a-input
                                :placeholder="$t('retail.search_identity')"
                                v-model:value="searchForm.identity"                                
                            />
                        </div>
                    </a-col>                                  
                </a-row>
            </div>
            <div class="table-container">
                <div class="btns">
                    <div class="btn-left">
                        <!-- 添加角色 -->
                        <a-button 
                            type="primary" 
                            @click="routerChange('add')" 
                        >
                            <i class="icon i_add" />
                            {{ $t("retail.add_a_role") }}
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
                            <!-- 超级管理员不能修改和删除 -->
                            <template v-if="true">
                                <a-button type="link" @click="routerChange('deit', record)">{{ $t("retail.edit") }}</a-button>
                                <a-popconfirm                                    
                                    :title="$t('retail.confirm_deletion')"
                                    :ok-text="$t('retail.confirm')"
                                    :cancel-text="$t('retail.cancel')"
                                    @confirm="routerChange('delete',record)"                                    
                                >                                    
                                    <a-button type="link" danger>{{ $t("retail.delete") }}</a-button>
                                </a-popconfirm>
                            </template>
                            <template v-else>
                                <span class="super-administrator">{{ $t('retail.cannot_edit_or_deleted') }}</span>
                            </template>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from "@/core";
import TimeSearch from "@/components/common/TimeSearch.vue";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const loading = ref(false); // 加载
const searchForm = ref({
    identity: undefined, // 身份
});
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
            title: "retail.identity",
            dataIndex: "name",
            key: "uid",            
        },
        {
            title: "retail.identity_note",
            dataIndex: ["order", "uid"],
            key: "order_uid",            
        },
        {
            title: "retail.creation_time",
            dataIndex: "status",
            key: "util",                       
        },
        {
            title: "retail.founder",
            dataIndex: "money",
            key: "money",            
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
const routerChange = (type, item = {}) => {
    let routeUrl = "";
    switch (type) {
        case "add": // 添加人员
            routeUrl = router.resolve({
                path: "/retail-personnel/role-permiss-detail",                
            });
            window.open(routeUrl.href, "_blank");
            break; 
        case "edit": // 编辑
            routeUrl = router.resolve({
                path: "/retail-personnel/role-permiss-detail",
                // query: { id: item.id },
            });
            window.open(routeUrl.href, "_blank");
            break;
        case "delete": // 删除            
            break;
    }
}
// 查询按钮
const handleSearch = () => {
    console.log("searchForm", searchForm.value);
}; 
// 重置按钮
const handleSearchReset = () => {
    searchForm.value = {}
};

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
.rolePermissMan{
    font-family: PingFang SC;
    .super-administrator{
        color:  #86909C;
        font-size: 14px;
        font-weight: 400;
    }
}
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

.search{
    padding: 0 20px;
    box-sizing: border-box;
}


</style>
