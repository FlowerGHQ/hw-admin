<template>
    <a-table
        :columns="columns"
        :data-source="dataSource"
        :scroll="{ x: true }"
        :row-key="record => record.id"
        :loading="loading"
        :pagination="false"
        :row-selection="{
            selectedRowKeys: selectedRowKeys,
            preserveSelectedRowKeys: true,
            onChange: onSelectChange,
        }"
    >
        <template #headerCell="{ title, column }">
            <div class="table-title">{{ title }}</div>
        </template>
        <template #bodyCell="{ record, column, text }">
            <span v-if="column.key === 'name' /*商品名称*/">
                <a-tooltip>
                    <template #title>{{ text }}</template>
                    <div class="one-spils cursor" :style="{ width: text?.length > 6 ? 7 * 12 + 'px' : '' }">
                        {{ lang === 'zh' ? record.item?.name : record.item?.name_en }}
                    </div>
                </a-tooltip>
            </span>
            <span v-else-if="column.key === 'sales_area_list' /*销售区域*/">
                <a-tooltip>
                    <template #title>{{ $Util.getSalesAreaStr(text, lang) || '-' }}</template>
                    <div class="one-spils cursor" :style="{ width: text?.length > 5 ? 6 * 12 + 'px' : '' }">
                        {{ $Util.getSalesAreaStr(text, lang) || '-' }}
                    </div>
                </a-tooltip>
            </span>
            <span v-else-if="column.key === 'bom_category' /*分类*/">
                <a-tooltip>
                    <template #title>{{ text?.name }}</template>
                    <div class="one-spils cursor" :style="{ width: text?.length > 6 ? 7 * 12 + 'px' : '' }">
                        {{ text?.name }}
                    </div>
                </a-tooltip>
                <span class="to-none-classify" v-if="!text"> 暂无 </span>
            </span>
            <span v-else-if="column.key === 'sync_time' /*创建时间*/">
                {{ $Util.timeFilter(text, 3) }}
            </span>
            <span v-else-if="column.key === 'remark' /*备注*/">
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
import Core from '@/core';
import { onMounted, ref, getCurrentInstance, computed, watch } from 'vue';
const $emit = defineEmits(['submit']);

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
        default: () => {
            return [];
        },
    },
    dataSource: {
        type: Array,
        default: () => {
            return [];
        },
    },
    loading: {
        type: Boolean,
        default: false,
    },
    radioMode: {
        // 是否只能选一个商品
        type: Boolean,
        default: false,
    },
    defaultChecked: {
        // 默认被选中的
        type: Array,
        default: () => {
            return [];
        },
    },
    disabledChecked: {
        // 不可被选中的
        type: Array,
        default: () => {
            return [];
        },
    },
});
const selectedRowKeys = ref([]); // Check here to configure the default column

// 监听弹窗关闭-更改父组件prop -- tableData
/* watch(
    () => props.dataSource,
    (newValue, oldValue) => {
        console.log('dataSource',newValue);
        // emits("update:dataSource", newValue)
    }    
) */

watch(
    () => props.defaultChecked,
    (newValue, oldValue) => {
        selectedRowKeys.value = [...new Set([...newValue, ...selectedRowKeys.value])];
    },
    {
        deep: true,
        immediate: true,
    },
);
const onSelectChange = (changableRowKeys, selectedRows) => {
    selectedRowKeys.value = changableRowKeys;
    $emit('submit', selectedRowKeys.value);
};
const lang = computed(() => {
    // ==='zh'?'country':'country_en'
    return proxy.$store.state.lang;
});
/* const rowSelection = computed(() => {
      /* return {
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onSelectChange,
        // hideDefaultSelections: true,
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
      return 
    }); */
const showDialog = () => {
    selectedRowKeys.value = [];
    console.log('selectedRowKeys.value', selectedRowKeys.value);
};
defineExpose({ showDialog });
</script>

<style lang="less" scoped>
:deep(.ant-table) {
    min-height: 200px;
}

.to-none-classify {
    color: #bfbfbf;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
}
.table-title {
    color: #1d2129;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 500;
}
</style>
