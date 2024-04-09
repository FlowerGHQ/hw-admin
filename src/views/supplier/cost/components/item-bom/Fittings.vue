<template>
    <div class="fittings">
        <div class="title">
            {{ $t('supply-chain.total_amount') }}: {{ $Util.Number.numFormat($Util.countFilter(723500)) }}
        </div>
        <a-table
            :row-key="record => record.id"
            :data-source="tableData"
            :columns="tableColumns"
            :scroll="{ x: true }"
            :pagination="channelPagination"
            :loading="loading"
            @change="handleTableChange"
        >
            <template #headerCell="{ title, column }">
                <div class="table-title">{{ title }}</div>
            </template>
            <template #bodyCell="{ column, text, record, index }">
                <!-- 序号 -->
                <template v-if="column.key === 'number'">
                    {{ index + 1 }}
                </template>
                <!-- 含税单价（人民币） -->
                <template v-if="column.key === 'price'">
                    <div class="price">
                        <span class="price-text active" @click="priceRecords">
                            {{ $Util.Number.numFormat($Util.countFilter(text)) }}
                        </span>
                        <MySvgIcon icon-class="edit" class-name="price-edit" @click.stop="changePrice(record)" />
                    </div>
                </template>
            </template>
        </a-table>
        <!-- 修改价格弹窗 -->
        <ChangePriceModal v-model:visibility="visibility" @setCancleShow="visibility = false" />
        <!-- 价格记录弹窗 -->
        <PriceModal v-model:visibility="priceVisibility" @setCancleShow="priceVisibility = false" />
    </div>
</template>

<script setup>
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import { onMounted, ref, getCurrentInstance, computed, watch } from 'vue';
import Core from '@/core';
import ChangePriceModal from './change-price-modal.vue';
import PriceModal from './price-modal.vue';
const props = defineProps({
    searchParams: {
        type: Object,
        default: () => {},
    },
    activeObj: {
        type: Object,
        default: () => {},
    },
});
const parmas = ref({});
const { proxy } = getCurrentInstance();
const loading = ref(false);
const visibility = ref(false);
const priceVisibility = ref(false);
const tableColumns = computed(() => {
    const result = [
        { title: proxy.$t('supply-chain.serial_number'), dataIndex: 'number', key: 'number' }, // 序号
        { title: proxy.$t('supply-chain.component_code'), dataIndex: 'component_code', key: 'number' }, // 子件编码
        { title: proxy.$t('supply-chain.component_name'), dataIndex: 'component_name', key: 'number' }, // 子件名称
        { title: proxy.$t('supply-chain.supplier_name'), dataIndex: 'supplier_name', key: 'number' }, // 供应商名称
        { title: proxy.$t('supply-chain.accumulated_usage'), dataIndex: 'accumulated_usage', key: 'number' }, // 累计用量
        {
            title: proxy.$t('supply-chain.unit_price_including_tax_rmb'),
            dataIndex: 'unit_price_including_tax_rmb',
            key: 'price',
        }, // 含税单价（人民币）
        { title: proxy.$t('supply-chain.type'), dataIndex: 'type', key: 'number' }, // 类型
        { title: proxy.$t('supply-chain.effective_date'), dataIndex: 'effective_date', key: 'number' }, // 生效日期
        { title: proxy.$t('supply-chain.modifying_records'), dataIndex: 'modifying_records', key: 'number' }, // 修改记录
    ];
    return result;
});
const tableData = ref([]);
// 分页
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: total => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`,
});

onMounted(() => {
    // getTableDataFetch();
});
/* Fetch start*/
// 获取表格list
const getTableDataFetch = (parmas = {}) => {
    loading.value = true;
    let obj = {
        page: channelPagination.value.current,
        page_size: channelPagination.value.pageSize,
        ...parmas,
    };

    Core.Api.ITEM_BOM.partsList(obj)
        .then(res => {
            channelPagination.value.total = res.count;
            tableData.value = res.list;
            loading.value = false;
        })
        .catch(err => {
            console.log('getTableDataFetch', err);
            loading.value = false;
        });
};
/* Fetch end*/

/* methods start*/
// 分页事件
const handleTableChange = (pagination, filters, sorter) => {
    channelPagination.value.current = pagination.current;
    channelPagination.value.pageSize = pagination.pageSize;
    console.log(parmas.value);
    getTableDataFetch(parmas.value);
};
const changePrice = record => {
    visibility.value = true;
};
const priceRecords = record => {
    priceVisibility.value = true;
};
/* methods end*/
watch(
    [() => props.searchParams, () => props.activeObj],
    val => {
        console.log('val-----------------------------------------', val);
        parmas.value = {
            sync_id: val[1].sync_id,
            name: val[0].name,
            code_list: val[0].code_list,
        };
        channelPagination.value.current = 1;
        channelPagination.value.pageSize = 20;

        getTableDataFetch(parmas.value);
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>

<style lang="less" scoped>
.fittings {
    width: 100%;
    .title {
        margin-bottom: 10px;
        font-size: 20px;
        font-weight: 500;
        color: #0061ff;
        line-height: 28px;
    }
    .table-title {
        color: #1d2129;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 500;
    }
    :deep(.price) {
        .fcc(space-between);
        width: 112px;
        .price-text {
            display: inline-block;
            color: #1d2129;
            &.active {
                color: #0061ff;
                cursor: pointer;
            }
        }
        .price-edit {
            width: 13.5px;
            height: 13.5px;
            cursor: pointer;
        }
    }
}

.set-width {
    width: 100px;
}
</style>
