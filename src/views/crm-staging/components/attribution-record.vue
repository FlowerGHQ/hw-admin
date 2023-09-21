<template>
  <div class="attribution-record">
      <div class="title">数据来源</div>
      <div class="descriptions">
        <div class="descriptions-item" v-for="(item, index) in sourceList" :key="index">
            <span class="descriptions-item-label" :style="{ width: `${item.labelWidth}px` }">{{ item.label }}：</span>
            <span class="descriptions-item-value">{{ item.value }}</span>
        </div>
      </div>
      <div class="title">归属记录</div>
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
import { computed, reactive, ref, toRefs, nextTick } from 'vue';

nextTick(() => {
  getBindList()
})

const $emit = defineEmits(['getCount'])
const columns = [
{
  title: '归属大区',
  key: 'series',
  dataIndex: 'series'
},
{
  title: '归属城市',
  key: 'order-status',
  dataIndex: 'order-status'
},
{
  title: '归属门店',
  key: 'car-order',
  dataIndex: 'car-order'
},
{
  title: '体验官',
  key: 'price',
  dataIndex: 'price'
},
{
  title: '分配人',
  key: 'pay',
  dataIndex: 'pay'
},
{
  title: '分配日期',
  key: 'create-time',
  dataIndex: 'create-time'
},
];

const data = [
{
  key: '1',
  id: 1,
  series: '东南大区',
  'order-status': '上海',
  'car-order': '上海浦东新区体验中心',
  price: 1,
  pay: 1,
  'create-time': '2023-12-12 12:13:14',
},
];

const id = ref(1)

const sourceList = [
  { label: '留资城市', value: '上海', labelWidth: 70, prop: 'city' },
  { label: '营业时间', value: '2023-12-14 12:13:14', labelWidth: 84, prop: 'city' },
  { label: '信息来源', value: '小程序', labelWidth: 70, prop: 'city' },
  { label: '创建人', value: '系统', labelWidth: 84, prop: 'city' },
  { label: '所属大区', value: '上海', labelWidth: 70, prop: 'city' },
  { label: '所属城市', value: '上海', labelWidth: 84, prop: 'city' },
  { label: '所属门店', value: '上海', labelWidth: 70, prop: 'city' },
  { label: '绑定体验官', value: '上海', labelWidth: 84, prop: 'city' },
]

const sourceListRender = computed(() => {
  return sourceList.map(item => {
    item.value = res[item.prop]
  })
})

const detail = (id) => {
  console.log(id)
}
const getBindList = () => {
  const params = {
    customer_id: id.value
	}
  Core.Logger.success('params', params)
  Core.Api.CustomService.bindList({ ...params }).then(res=>{
		Core.Logger.success('getTaskNum',res);
    $emit('getCount', '3' ,res.count)
	}).catch(err=>{
        Core.Logger.error("参数", "数据", err)
	})
}

</script>

<style lang="less" scoped>
.attribution-record {
  .title {
    color: #1D2129;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  .descriptions {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 8px;
    .descriptions-item {
      margin-bottom: 16px;
      width: calc((100% - 15px) / 2);
      &:nth-child(2n + 1) {
        margin-right: 15px;
      }
      &-label, &-value {
        display: inline-block;
      }
      &-label {
        color: #86909C;
        text-align: right;
        font-size: 14px;
      }
      &-value {
        color: #1D2129;
        font-size: 14px;
      }
    }
  }
}
</style>
