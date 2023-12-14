<template>
    <a-table
            :columns="columns" 
            :data-source="dataSource" 
            :scroll="{ x: true }"
            :row-key="record => record.id" 
            :loading='loading' 
            :pagination='false'
            :row-selection="checkMode ? rowSelection : null"
            >
            <template #bodyCell="{ record, column ,text}">
                <span v-if="column.key === 'name'/*商品名称*/">
                    <a-tooltip>
                        <template #title>{{ text }}</template>
                        <div 
                            class="one-spils cursor" 
                            :style="{ width: text?.length > 6 ? 7 * 12 + 'px' : '' }"
                        >
                            {{ text }}
                        </div>
                    </a-tooltip>
                </span>
                <span v-else-if="column.key === 'sales_area'/*销售区域*/">
                    <a-tooltip>
                        <template #title>{{ text }}</template>
                        <div 
                            class="one-spils cursor" 
                            :style="{ width: text?.length > 5 ? 6 * 12 + 'px' : '' }"
                        >
                            {{ text }}
                        </div>
                    </a-tooltip>
                </span>
                <span v-else-if="column.key === 'classify'/*分类*/">
                    <!-- <a-tooltip>
                        <template #title>{{ text }}</template>
                        <div 
                            class="one-spils cursor" 
                            :style="{ width: text?.length > 6 ? 7 * 12 + 'px' : '' }"
                        >
                            {{ text }}
                        </div>
                    </a-tooltip> -->
                    <span class="to-classify" @click="toClassify">
                        {{ $t('item-bom.classify') }}
                    </span>
                </span>
                <span v-else-if="column.key === 'create_time'/*创建时间*/">
                    {{ $Util.timeFilter(text) }}
                </span>
                <span v-else-if="column.key === 'remark'/*备注*/">
                    <a-tooltip>
                        <template #title>{{ text }}</template>
                        <div class="one-spils set-width cursor">
                            {{ text }}
                        </div>
                    </a-tooltip>
                </span>
            </template>
    </a-table>
</template>

<script setup>

import { Table } from 'ant-design-vue';
import Core from "@/core";
import { onMounted, ref, getCurrentInstance, computed, watch , unref } from 'vue';

const { proxy } = getCurrentInstance();

const props = defineProps({  
    //  v-model 绑定值  
    /* 
        visibility:{
            type: Boolean,
            default:false        
        }, 
        // 渲染tabs数据
        tabsList:{
            type: [Array,Object],
            default: () => []
        },
        // 自定义外层样式
        eosTabsCustom:{
            type: Object,
        }, 
    */
    columns: {
        type: Array,
        default: () => { return [] }
    },
    dataSource: {
        type: Array,
        default: () => { return [] }
    },
    loading: {
        type: Boolean,
        default: false
    },
    checkMode: { // 是否开启选择模式
        type: Boolean,
        default: false
    },
    radioMode: { // 是否只能选一个商品
        type: Boolean,
        default: false,
    },
    defaultChecked: { // 默认被选中的
        type: Array,
        default: () => { return [] }
    },
    disabledChecked: { // 不可被选中的
        type: Array,
        default: () => { return [] }
    },
})

// 监听弹窗关闭-更改父组件prop -- tableData
watch(
    () => props.dataSource,
    (newValue, oldValue) => {
        console.log('dataSource',newValue);
        // emits("update:dataSource", newValue)
    }    
)
const onSelectChange = changableRowKeys => {
      console.log('selectedRowKeys changed: ', changableRowKeys);
      selectedRowKeys.value = changableRowKeys;
    };
const selectedRowKeys = ref([]); // Check here to configure the default column


const rowSelection = computed(() => {
      return {
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onSelectChange,
        hideDefaultSelections: true,
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE, {
          key: 'odd',
          text: 'Select Odd Row',
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
              if (index % 2 !== 0) {
                return false;
              }
              return true;
            });
            selectedRowKeys.value = newSelectedRowKeys;
          },
        }, {
          key: 'even',
          text: 'Select Even Row',
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
              if (index % 2 !== 0) {
                return true;
              }
              return false;
            });
            selectedRowKeys.value = newSelectedRowKeys;
          },
        }],
      };
    });
</script>

<style lang="less" scoped>

</style>
