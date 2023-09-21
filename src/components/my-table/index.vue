<!--
 * @Author: douzhiyuan
 * @Date: 2023-09-21 19:43:01
 * @LastEditors: 
 * @LastEditTime: 2023-09-21 19:49:50
 * @Description: this is table component
-->


<template>
  <div class="hw-table">
      <a-table>
        <!-- 自定义coloms -->
        <!-- 前方的checkbox -->
        <a-table-column title="序号" width="80px" align="center">
          <template #customRender="{ text, record, index }">
            <span>{{ index + 1 }}</span>
          </template>
        </a-table-column>
        <!-- 序号 -->
        <a-table-column title="序号" width="80px" align="center">
          <template #customRender="{ text, record, index }">
            <span>{{ index + 1 }}</span>
          </template>
        </a-table-column>
        <!-- 便利渲染内容部分 -->
        <a-table-column
          v-for="(item, index) in tableColumns"
          :key="index"
          :title="item.title"
          :dataIndex="item.dataIndex"
          :width="item.width"
          :align="item.align"
          :customRender="item.customRender"
        >
          <!-- 自定义渲染 -->
          <template #customRender="config">
              <tableContent  :config="config"/>
          </template>
        </a-table-column>
			</a-table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineEmits ,defineProps,useSlots, useAttrs,} from "vue"
import tableContent from "./table-content.vue"
// 查看a-table上的属性和方法，进行扩展
const tableColumns = ref([])
const tableData = ref([])
const loading = ref(false)
const $slots = useSlots()
const $attr = useAttrs()
const $emit = defineEmits()


onMounted(() => {
  console.log("onMounted")
})



</script>

<style lang="less" scoped>

</style>