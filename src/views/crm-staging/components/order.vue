<template>
    <div class="order">
        <a-table :columns="columns" :data-source="data" :pagination="pagination" @change="handleTableChange">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'series'">
                    <span>{{ record.remark.name }}</span>
                </template>
                <template v-if="column.key === 'status'">
                    <span>{{ Static.ORDER_STATUS_MAP[record.status]?.text }}</span>
                </template>
                <template v-if="column.key === 'car-order'">
                    <span>{{ record['car-order'] || '--' }}</span>
                </template>
                <template v-if="column.key === 'total_price'">
                    <span>￥{{ Core.Util.countFilter(record.remark.total_price) }}</span>
                </template>
                <template v-if="column.key === 'amount_paid'">
                    <span>￥{{ Core.Util.countFilter(record.amount_paid) }}</span>
                </template>
                <template v-if="column.key === 'create_time'">
                    <span>{{ Core.Util.timeFilter(record.create_time, 3) }}</span>
                </template>
                <template v-if="column.key === 'update-time'">
                    <span>{{ record.length > 0 ? Core.Util.timeFilter(record[0].finish_time, 3) : '--' }}</span>
                </template>
                <template v-if="column.key === 'operate'">
                    <span>
                        <a style="color: #0061ff" @click="detail(record.id)">详情</a>
                    </span>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup>
import Core from '@/core';
import Static from '../static';
import { reactive, ref, watch, inject } from 'vue';

const userId = inject('userId');

const getData = () => {
    getList({ current: pagination.current });
};
const $emit = defineEmits(['getCount']);
const columns = [
    {
        title: '车辆系列',
        key: 'series',
        dataIndex: 'remark',
    },
    {
        title: '订单状态',
        key: 'status',
        dataIndex: 'status',
    },
    {
        title: '车辆状态',
        key: 'car-order',
        dataIndex: 'car-order',
    },
    {
        title: '订单金额',
        key: 'total_price',
        dataIndex: 'total_price',
    },
    {
        title: '已付金额',
        key: 'amount_paid',
        dataIndex: 'amount_paid',
    },
    {
        title: '创建日期',
        key: 'create_time',
        dataIndex: 'create_time',
    },
    {
        title: '更新日期',
        key: 'update-time',
        dataIndex: 'order_item_list',
    },
    {
        title: '操作',
        key: 'operate',
        dataIndex: 'operate',
    },
];

const data = ref([]);
const pagination = reactive({
    pageSize: 10,
    current: 1,
    total: 0,
    total_page: 0,
});
const handleTableChange = page => {
    Object.assign(pagination, {
        current: page?.current,
        pageSize: page?.pageSize,
    });
    getList({ current: pagination.current });
};
const getList = (params = {}) => {
    if (!userId.value) return;
    const obj = {
        page: params.current,
        page_size: pagination.pageSize,
        customer_id: userId.value,
    };
    Core.Api.CustomService.orderList({ ...obj })
        .then(res => {
            Core.Logger.success('参数', '数据', res);
            pagination.total = res.count;
            pagination.total_page = Math.ceil(pagination.total / pagination.pageSize);
            data.value = res.list;
            $emit('getCount', '4', res.count);
            filterData(data.value);
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};
const filterData = data => {
    data.forEach(item => {
        let amount_paid = 0;
        if (item.order_item_list.length > 0) {
            item.order_item_list.forEach(orderItem => {
                if (orderItem.status === 200) {
                    amount_paid += orderItem.price;
                }
            });
        }
        item.amount_paid = amount_paid;
        try {
            item.remark = JSON.parse(item.remark);
        } catch {}
    });
};

const detail = id => {
    console.log(id);
};
defineExpose({ getData });
</script>

<style lang="less" scoped>
.order {
}
</style>
