<template>
    <div class="order">
        <a-table :columns="columns" :data-source="data">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'price'">
                    <span>￥{{ record.price }}</span>
                </template>
                <template v-if="column.key === 'pay'">
                    <span>￥{{ record.pay }}</span>
                </template>
                <template v-if="column.key === 'operate'">
                    <span>
                        <a style="color: #0061FF;" @click="detail(record.id)">详情</a>
                    </span>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup>
import Core from '@/core';
import { reactive, ref, toRefs, nextTick, inject } from 'vue';

const userId = inject('userId');

nextTick(() => {
  getList({ page: pagination.page })
})

const columns = [
  {
    title: '车辆系列',
    key: 'series',
    dataIndex: 'series'
  },
  {
    title: '订单状态',
    key: 'order-status',
    dataIndex: 'order-status'
  },
  {
    title: '车辆状态',
    key: 'car-order',
    dataIndex: 'car-order'
  },
  {
    title: '订单金额',
    key: 'price',
    dataIndex: 'price'
  },
  {
    title: '已付金额',
    key: 'pay',
    dataIndex: 'pay'
  },
  {
    title: '创建日期',
    key: 'create-time',
    dataIndex: 'create-time'
  },
  {
    title: '更新日期',
    key: 'update-time',
    dataIndex: 'update-time'
  },
  {
    title: '操作',
    key: 'operate',
    dataIndex: 'operate'
  },
];

const data = ref([
  {
    key: '1',
    id: 1,
    series: 'John Brown',
    'order-status': 32,
    'car-order': 'New York No. 1 Lake Park',
    price: 1,
    pay: 1,
    'create-time': 32,
    'update-time': 'New York No. 1 Lake Park',
  },
]);
const pagination = reactive({
  page_size: 20,
  page: 1,
  total: 0,
  total_page: 0
})
const getList = (params = {}) => {
  const obj = {
		"page_size": pagination.page_size,
		"customer_id": userId.value,
    ...params
	}
  Core.Api.CustomService.orderList({ ...obj }).then(res=>{
    Core.Logger.success("参数", "数据", res)
    data.value = res.list
	}).catch(err=>{
    Core.Logger.error("参数", "数据", err)
	})
}

const detail = (id) => {
  console.log(id)
}
</script>

<style lang="less" scoped>
.order {
}
</style>
