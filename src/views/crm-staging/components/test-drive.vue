<template>
    <div class="test-drive">
        <a-table :columns="columns" :data-source="data">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'price'">
                    <span>￥{{ record.price }}</span>
                </template>
                <template v-if="column.key === 'pay'">
                    <span>￥{{ record.pay }}</span>
                </template>
                <template v-if="column.key === 'create-time'">
                    <span>
                        <a style="color: #0061FF;" @click="detail(record.id)">查看</a>
                    </span>
                </template>
                <template v-if="column.key === 'update-time'">
                    <span>
                        <a style="color: #0061FF;" @click="detail(record.id)">查看</a>
                    </span>
                </template>
                <template v-if="column.key === 'operate'">
                    <span>
                        <a style="color: #0061FF;" @click="detail(record.id)">体验官A</a>
                    </span>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup>
import Core from '@/core';
import { reactive, ref, toRefs } from 'vue';
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';

const columns = [
  {
    title: '试驾车辆',
    key: 'series',
    dataIndex: 'series'
  },
  {
    title: '试驾状态',
    key: 'order-status',
    dataIndex: 'order-status'
  },
  {
    title: '试驾时长',
    key: 'car-order',
    dataIndex: 'car-order'
  },
  {
    title: '试驾开始时间',
    key: 'price',
    dataIndex: 'price'
  },
  {
    title: '试驾结束试时间',
    key: 'pay',
    dataIndex: 'pay'
  },
  {
    title: '驾驶证照',
    key: 'create-time',
    dataIndex: 'create-time'
  },
  {
    title: '签署协议',
    key: 'update-time',
    dataIndex: 'update-time'
  },
  {
    title: '体验官',
    key: 'operate',
    dataIndex: 'operate'
  },
];

const data = [
  {
    key: '1',
    id: 1,
    series: 'SENMENTI 0',
    'order-status': '待试驾',
    'car-order': '排产中',
    price: 1,
    pay: 1,
    'create-time': 32,
    'update-time': 'New York No. 1 Lake Park',
    operate: 'New York No. 1 Lake Park',
  },
];

const detail = (id) => {
    console.log(id)
}

</script>

<style lang="less" scoped>
.test-drive {
}
</style>
