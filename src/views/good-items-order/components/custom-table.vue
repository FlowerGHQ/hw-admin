<template>
    <div class="have-paid">
        <div class="search">
            <a-row class="row-detail">
                <!-- 订单号 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">{{ $t('in.order_number') }}：</span>
                    <span class="value">
                        <a-input
                            :placeholder="$t('def.input')"
                            v-model:value="searchForm.sn"
                            @keydown.enter="handleSearch"
                        />
                    </span>
                </a-col>
                <!-- 手机号 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">{{ $t('n.phone') }}：</span>
                    <span class="value">
                        <a-input :placeholder="$t('def.input')" v-model:value="searchForm.user_phone" />
                    </span>
                </a-col>
                <!-- 收件人 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">{{ $t('wb.receiver') }}：</span>
                    <span class="value">
                        <a-input :placeholder="$t('def.input')" v-model:value="searchForm.to_name" />
                    </span>
                </a-col>
                <!-- 快递单号 -->
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                    <span class="key">{{ $t('af.courier_number') }}：</span>
                    <span class="value">
                        <a-input :placeholder="$t('def.input')" v-model:value="searchForm.waybill_uid" />
                    </span>
                </a-col>
            </a-row>
        </div>
        <div>
            <div class="btns m-b-20">
                <div class="btn-left"></div>
                <div class="btn-right">
                    <a-button @click="handleSearch(1)" type="primary">
                        {{ $t('def.search') }}
                    </a-button>
                    <a-button @click="handleSearchReset">
                        {{ $t('def.reset') }}
                    </a-button>
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
                    <template v-if="column.key === 'activity_source_type'">
                        {{ $Util.goodSourceTypeFilter(text, lang) || '-' }}
                    </template>
                    <template v-else-if="column.key === 'source_type'">
                        {{ $Util.goodSourceChannelFilter(text, lang) || '-' }}
                    </template>
                    <template v-else-if="column.key === 'item_list'">
                        {{ $Util.goodItemListFilter(text, 'product_name') || '-' }}
                    </template>
                    <template v-else-if="column.key === 'create_time'">
                        {{ $Util.timeFilter(text) || '-' }}
                    </template>
                    <template v-else-if="column.key === 'operation'">
                        <!-- 发货按钮  根据状态判断是否显示 -->
                        <Shipments
                            v-if="Number(record.status) === Core.Const.GOODITEMORDER.Order_Status_Map['2'].value"
                            :id="record.id"
                            @refesh="handleSearchReset"
                        ></Shipments>
                        <!-- 详情 -->
                        <a-button type="link" @click="routerChange('detail', record)">
                            {{ $t('retail.detail') }}
                        </a-button>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import Shipments from './shipments.vue';
import { computed, getCurrentInstance, defineExpose, onMounted, reactive, watchEffect, ref, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const loading = ref(false); // 加载
const { proxy } = getCurrentInstance();
// 定义要发送的emit事件
const emit = defineEmits(['getTabNumber']);

const searchForm = ref({
    sn: '', // 订单号
    user_phone: '', // 手机号
    to_name: '', // 收件人
    waybill_uid: '', // 快递单号
});
const tableData = ref([]);
// 分页配置
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: total => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`,
});

const router = useRouter();
const props = defineProps({
    activeKey: {
        type: [String, Number],
    },
});
onMounted(() => {
    getTableDataFetch({
        page_size: channelPagination.value.pageSize,
        page: channelPagination.value.current,
        status: props.activeKey,
    });
});
/* 计算属性 */
const lang = computed(() => {
    return proxy.$store.state.lang;
});
const tableColumns = computed(() => {
    let columns = [
        {
            /* 订单号 */ title: 'in.order_number',
            dataIndex: 'sn',
            key: 'sn',
        },
        {
            /* 用户名称 */ title: 'dis.user_name',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            /* 手机号 */ title: 'n.phone',
            dataIndex: 'user_phone',
            key: 'user_phone',
        },
        {
            /* 活动入口 */ title: 'item_order.active_entrance',
            dataIndex: 'activity_source_type',
            key: 'activity_source_type',
        },
        {
            /* 奖品名单来源 */ title: 'item_order.order_source',
            dataIndex: 'source_type',
            key: 'source_type',
        },
        {
            /* 奖项 */ // without000
            title: 'item_order.awards',
            dataIndex: 'item_list',
            key: 'item_list',
        },
        {
            /* 收件人 */ title: 'wb.receiver',
            dataIndex: 'to_name',
            key: 'to_name',
        },
        {
            /* 收件人手机号 */ title: 'item_order.receiver_phone',
            dataIndex: 'to_phone',
            key: 'to_phone',
        },
        {
            /* 收件地址 */ title: 'item_order.shipping_address',
            dataIndex: 'to_address',
            key: 'to_address',
        },
        {
            /* 中奖时间 */ title: 'item_order.winning_time',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        /*{ 奖品发货状态 
            title: "item_order.prize_shipment_status",
            dataIndex: "status",
            key: "status",            
        },*/
        {
            /* 快递单号 */ title: 'af.courier_number',
            dataIndex: 'waybill_uid',
            key: 'waybill_uid',
        },
        {
            /* 快递公司 */ // without000
            title: 'af.courier',
            dataIndex: 'waybill_company',
            key: 'waybill_company',
        },
        { title: 'retail.operate', key: 'operation', fixed: 'right' },
    ];
    return columns;
});

/* 接口 start*/
// table接口
const getTableDataFetch = (params = {}) => {
    loading.value = true;
    Core.Api.GoodItemsOrder.orderList({
        ...params,
        ...searchForm,
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
            emit('getTabNumber');
        });
};

/* 接口 end*/
/* methods */
const routerChange = (type, item = {}) => {
    let routeUrl = '';
    switch (type) {
        case 'detail': // 详情
            routeUrl = router.resolve({
                path: '/good-items-order/order-edit',
                query: { id: item.id },
            });
            window.open(routeUrl.href, '_blank');
            break;
    }
};

// 查询按钮
const handleSearch = num => {
    let { sn, user_phone, to_name, waybill_uid } = searchForm.value;
    if (num === 1) {
        channelPagination.value.current = 1;
    }
    getTableDataFetch({
        page_size: channelPagination.value.pageSize,
        page: channelPagination.value.current,
        status: props.activeKey,
        sn,
        user_phone,
        to_name,
        waybill_uid,
    });
};
// 重置按钮
const handleSearchReset = () => {
    let Pag = toRaw({ ...channelPagination.value });
    Object.assign(searchForm.value, { sn: '', user_phone: '', to_name: '', waybill_uid: '' });
    Object.assign(channelPagination.value, { ...Pag });
    handleSearch();
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
        status: props.activeKey,
    });
};

defineExpose({ handleSearchReset });
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
    margin-top: 20px;
}
</style>
