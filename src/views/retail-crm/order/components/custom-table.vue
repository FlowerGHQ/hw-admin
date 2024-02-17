<template>
    <div class="have-paid">
        <div class="search">
            <a-row class="row-detail">
                <!-- 订单搜索 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">{{ $t('retail.order_search') }}：</span>
                    <span class="value">
                        <a-input
                            :placeholder="$t('def.input')"
                            v-model:value="searchForm.uid"
                            @keydown.enter="handleSearch"
                        />
                    </span>
                </a-col>
                <!-- 车辆系列 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">{{ $t('retail.vehicle_series') }}：</span>
                    <span class="value">
                        <a-select v-model:value="searchForm.Series" class="select-w">
                            <a-select-option v-for="item in Core.Const.RETAIL.Vehicle_Series" :value="item.key">
                                {{ item.value }}
                            </a-select-option>
                        </a-select>
                    </span>
                </a-col>
                <!-- 订单状态： -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">{{ $t('retail.order_status') }}：</span>
                    <span class="value">
                        <a-select v-model:value="searchForm.order_status" class="select-w">
                            <a-select-option v-for="item in Core.Const.RETAIL.Order_Status" :value="item.key">
                                {{ $t(item.value) }}
                            </a-select-option>
                        </a-select>
                    </span>
                </a-col>
                <template v-if="show">
                    <!-- 所属大区 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <span class="key">{{ $t('retail.subregion') }}：</span>
                        <span class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </span>
                    </a-col>
                    <!-- 所属城市 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <span class="key">{{ $t('retail.home_city') }}：</span>
                        <span class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </span>
                    </a-col>
                    <!-- 所属门店 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <span class="key">{{ $t('retail.affiliated_store') }}：</span>
                        <span class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </span>
                    </a-col>
                    <!-- 创建时间 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <span class="key">{{ $t('retail.creat_time') }}：</span>
                        <span class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </span>
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
        <div>
            <div class="btns m-b-20">
                <div class="btn-left"></div>
                <div class="btn-right">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
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
                        <!-- 详情 -->
                        <a-button type="link" @click="routerChange('detail', record)">
                            {{ $t('retail.detail') }}
                        </a-button>
                        <!-- 退订审核 (只有在申请退订/退款)-->
                        <a-button
                            v-if="Number(activeKey) === Core.Const.RETAIL.Order_Status_Map.apply_refund"
                            type="link"
                        >
                            {{ $t('retail.unsubscribe_review') }}
                        </a-button>
                        <!-- 查看原因 (只有已退订/退款)-->
                        <a-button
                            v-if="Number(activeKey) === Core.Const.RETAIL.Order_Status_Map.unsubscribed_refunded"
                            type="link"
                        >
                            {{ $t('retail.view_reason') }}
                        </a-button>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import TimeSearch from '@/components/common/TimeSearch.vue';
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const show = ref(false); // 更多收起
const loading = ref(false); // 加载
const searchForm = ref({
    Series: undefined, // 车辆系列
    Order_Status: undefined, // 订单状态
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
const props = defineProps({
    activeKey: {
        type: [String, Number],
    },
});

/* 计算属性 */
const tableColumns = computed(() => {
    let columns = [
        {
            title: '车辆系列',
            dataIndex: 'uid',
            key: 'uid',
        },
        {
            title: '订单号',
            dataIndex: ['order', 'uid'],
            key: 'order_uid',
        },
        {
            title: '用户',
            dataIndex: 'status',
            key: 'util',
            util: 'CRMOrderIncomeStatusFilter',
        },
        {
            title: '订单状态',
            dataIndex: 'money',
            key: 'money',
        },
        {
            title: '订单金额',
            dataIndex: 'refunded',
            key: 'refunded',
        },
        {
            title: '已付金额',
            dataIndex: 'date',
            key: 'time',
        },
        {
            title: '购车方案',
            dataIndex: 'type',
            key: 'util',
        },
        {
            title: '区域 ',
            dataIndex: 'payment_type',
            key: 'util',
        },
        {
            title: '门店 ',
            dataIndex: 'payment_type',
            key: 'util',
        },
        {
            title: '体验官 ',
            dataIndex: 'payment_type',
            key: 'util',
        },
        {
            title: '申请时间 ',
            dataIndex: 'payment_type',
            key: 'util',
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
                path: '/retail-order/order-detail',
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
</style>
