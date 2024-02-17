<template>
    <div class="vehicle-list">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('retail.vehicle_list') }}</div>
            </div>
            <div class="search">
                <a-row class="row-detail">
                    <!-- 搜索车辆 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <div class="key">{{ $t('retail.search_vehicle') }}：</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <!-- 车辆用途 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <div class="key">{{ $t('retail.vehicle_usage') }}：</div>
                        <div class="value">
                            <a-select
                                class="select-w"
                                v-model:value="searchForm.vehicle_usage"
                                :placeholder="$t('def.select')"
                            >
                                <a-select-option
                                    v-for="item of Core.Const.RETAIL.Vehicle_Usage"
                                    :key="item.key"
                                    :value="item.value"
                                >
                                    {{ item[$i18n.locale] }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 车辆系列 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <div class="key">{{ $t('retail.vehicle_series') }}：</div>
                        <div class="value">
                            <a-select
                                class="select-w"
                                v-model:value="searchForm.status"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                            >
                                <a-select-option v-for="item of CRM_STATUS_MAP" :key="item.key" :value="item.value">{{
                                    lang === 'zh' ? item.zh : item.en
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <template v-if="show">
                        <!-- 所属大区 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <div class="key">{{ $t('retail.subregion') }}：</div>
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
                                        >{{ lang === 'zh' ? item.zh : item.en }}</a-select-option
                                    >
                                </a-select>
                            </div>
                        </a-col>
                        <!-- 所属城市 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <div class="key">{{ $t('retail.home_city') }}：</div>
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
                                        >{{ lang === 'zh' ? item.zh : item.en }}</a-select-option
                                    >
                                </a-select>
                            </div>
                        </a-col>
                        <!-- 所属门店 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <div class="key">{{ $t('retail.affiliated_store') }}：</div>
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
                                        >{{ lang === 'zh' ? item.zh : item.en }}</a-select-option
                                    >
                                </a-select>
                            </div>
                        </a-col>
                    </template>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item" @click="moreSearch">
                        <span class="key option-text">
                            <span class="allow-icon">{{ show ? $t('search.stow') : $t('retail.more_screening') }}</span>
                            <i v-if="!show" class="icon i_xialajiantouxiao"></i>
                            <i v-else class="icon i_shouqijiantouxiao"></i>
                        </span>
                    </a-col>
                </a-row>
            </div>
            <div class="table-container">
                <div class="btns">
                    <div class="btn-left">
                        <a-button v-if="false" class="left-btn-style" @click="addVehicle">{{
                            $t('retail.apply_vehicle')
                        }}</a-button>
                    </div>
                    <div class="btn-right">
                        <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                        <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    </div>
                </div>
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="channelPagination"
                    @change="handleTableChange"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)">{{
                                $t('retail.view')
                            }}</a-button>
                            <a-button type="link" danger @click="handleDelete(record.id)">{{
                                $t('retail.delete')
                            }}</a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import TimeSearch from '@/components/common/TimeSearch.vue';
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const CRM_STATUS_MAP = Core.Const.CRM_ORDER_INCOME.STATUS_MAP; // 回款单状态

const show = ref(false); // 更多收起
const loading = ref(false); // 加载
const searchForm = ref({
    vehicle_usage: undefined, // 车辆用途
});
const tableData = ref([]);
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: total => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`,
}); // 分页配置

onMounted(() => {
    getTableDataFetch({
        page: 1,
    });
});
const { proxy } = getCurrentInstance();
const router = useRouter();

/* 计算属性 */
const tableColumns = computed(() => {
    let columns = [
        {
            title: 'retail.series',
            dataIndex: 'uid',
            key: 'uid',
        },
        {
            title: 'retail.model',
            dataIndex: ['order', 'uid'],
            key: 'order_uid',
        },
        {
            title: 'retail.color',
            dataIndex: 'status',
            key: 'util',
            util: 'CRMOrderIncomeStatusFilter',
        },
        {
            title: 'retail.vehicle_usage',
            dataIndex: 'money',
            key: 'money',
        },
        {
            title: 'retail.use_status',
            dataIndex: 'refunded',
            key: 'refunded',
        },
        {
            title: 'retail.belonging_area',
            dataIndex: 'date',
            key: 'time',
        },
        {
            title: 'retail.belonging_store',
            dataIndex: 'type',
            key: 'util',
            util: 'CRMOrderIncomeTypeFilter',
        },
        {
            title: 'retail.warehousing_time',
            dataIndex: 'payment_type',
            key: 'util',
            util: 'CRMOrderIncomePaymentTypeFilter',
        },
        { title: 'retail.operate', key: 'operation', fixed: 'right' },
    ];
    return columns;
});

/* 接口 start*/
// table接口
const getTableDataFetch = (params = {}) => {
    loading.value = true;
    Core.Api.CRMOrderIncome.list({
        search_type: 10,
        ...params,
    })
        .then(res => {
            channelPagination.value.total = res.count;
            console.log('getTableData res:', res);
            tableData.value = res.list;
        })
        .catch(err => {
            console.log('getTableData err:', err);
        })
        .finally(() => {
            loading.value = false;
        });
};
/* 接口 end*/
/* methods */
const routerChange = (type, item = {}) => {
    let routeUrl = '';
    switch (type) {
        case 'detail': // 详情
            routeUrl = router.resolve({
                path: '/retail-vehicle/vehicle-detail',
                // query: { id: item.id },
            });
            window.open(routeUrl.href, '_blank');
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
const handleOtherSearch = params => {};
// 删除操作
const handleDelete = id => {};
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

.search {
    padding: 0 20px;
    box-sizing: border-box;
}
</style>
