<template>
  <div>
    <a-range-picker
      v-model:value="form.dataRange"
      :show-time="{ format: 'HH:mm' }"
      format="YYYY-MM-DD HH:mm:ss"
      :placeholder="['Start Time', 'End Time']"
      valueFormat="X"
    />
    <a-button @click="review">点我回显</a-button>
    <a-button @click="submit">点我上传数据</a-button>
  </div>
</template>

<script setup>
import Core from "@/core"
const Util = Core.Util
import { ref, reactive, toRaw } from "vue"
const { dayjsReview, timeFilter, dayjsToTimestamp } = Util

// 模拟数据，时间戳
const dataRange = ref([1622505600, 1622592000])
const form = reactive({})

const review = () => {
  form.dataRange = [
    dayjsReview(dataRange.value[0]),
    dayjsReview(dataRange.value[1]),
  ]
}
const submit = () => {
  console.log(form.dataRange)
  console.log(dayjsToTimestamp(form.dataRange[0]))
  console.log(dayjsToTimestamp(form.dataRange[1]))
}
</script>

<style lang="less" scoped></style>
