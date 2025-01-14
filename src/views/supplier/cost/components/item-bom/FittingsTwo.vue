<template>
    <!-- code编码-二级页面 -->
    <div class="fittings-two">
        <div class="title">
            {{ $t('supply-chain.total_amount') }}: {{ $Util.Number.numFormat(activeObj.price_sum) }}
        </div>
        <div class="fittings-list">
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
                    <template v-if="column.key === 'item'">
                        {{ text ? text : '-' }}
                    </template>
                    <!-- 供应商名称 -->
                    <template v-if="column.key === 'supplier_name'">
                        <a-tooltip>
                            <template #title v-if="text">{{ text }}</template>
                            <span class="supplier_name" :title="text">{{ text ? text : '-' }}</span>
                        </a-tooltip>
                    </template>
                    <!-- 含税单价（人民币） -->
                    <template v-if="column.key === 'price'">
                        <div class="price">
                            <span
                                class="price-text"
                                :class="record.log_count > 1 ? 'active' : ''"
                                @click="priceRecords(record)"
                            >
                                {{ $Util.Number.numFormat(text) }}
                            </span>
                            <MySvgIcon icon-class="edit" class-name="price-edit" @click.stop="changePrice(record)" />
                        </div>
                    </template>
                    <!-- 同步类型（0.eos创建；1.u8同步） -->
                    <template v-if="column.key === 'log_sync_type'">
                        <template v-if="text === 0">{{ $t('supply-chain.EOS_creation') }}</template>
                        <template v-else-if="text === 1">{{ $t('supply-chain.U8_synchronization') }}</template>
                        <template v-else>-</template>
                    </template>
                    <!-- 生效日期 -->
                    <template v-if="column.key === 'time'">
                        {{ text ? $Util.timeFormat(text, 'YYYY-MM-DD') : '-' }}
                    </template>
                </template>
            </a-table>
        </div>
        <!-- 修改价格弹窗 -->
        <ChangePriceModal
            v-model:visibility="visibility"
            @setCancleShow="visibility = false"
            @confirm="refresh"
            :bom_item_id="bom_item_id"
            :formState="bom_item"
        />
        <!-- 价格记录弹窗 -->
        <PriceModal
            ref="PriceModalRef"
            v-model:visibility="priceVisibility"
            @setCancleShow="priceVisibility = false"
            :bom_item_id="bom_item_id"
        />
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, getCurrentInstance, computed, reactive, inject, watch, nextTick } from 'vue';
import Core from '@/core';
import ChangePriceModal from './change-price-modal.vue';
import PriceModal from './price-modal.vue';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import _ from 'lodash';
const $emit = defineEmits(['handleRefresh']);
const bomId = ref(0);
const { proxy } = getCurrentInstance();
const bom_item_id = ref(null);
const bom_item = ref(null);
const PriceModalRef = ref();
const loading = ref(false);
const visibility = ref(false);
const priceVisibility = ref(false);
const totalPrice = computed(() => {
    if (tableData.value.length === 0) return 0;
    const item = tableData.value[0];
    const amount = item.price * item.amount;
    return amount;
});
const props = defineProps({
    // v-model 绑定值
    activeObj: {
        type: Object,
        default: () => {},
    },

    searchParams: {
        type: Object,
        default: () => {},
    },
});
const tableColumns = computed(() => {
    const result = [
        { title: proxy.$t('supply-chain.serial_number'), dataIndex: 'number', key: 'number' }, // 序号
        { title: proxy.$t('supply-chain.component_code'), dataIndex: 'code', key: 'item' }, // 子件编码
        { title: proxy.$t('supply-chain.component_name'), dataIndex: 'name', key: 'item' }, // 子件名称
        { title: proxy.$t('supply-chain.supplier_name'), dataIndex: 'supplier_name', key: 'supplier_name' }, // 供应商名称
        { title: proxy.$t('supply-chain.accumulated_usage'), dataIndex: 'amount', key: 'item' }, // 累计用量
        { title: proxy.$t('supply-chain.unit_price_including_tax_rmb'), dataIndex: 'price', key: 'price' }, // 含税单价（人民币）
        { title: proxy.$t('supply-chain.type'), dataIndex: 'log_sync_type', key: 'log_sync_type' }, // 同步类型
        { title: proxy.$t('supply-chain.effective_date'), dataIndex: 'price_effective_time', key: 'time' }, // 生效日期
        { title: proxy.$t('supply-chain.modifying_records'), dataIndex: 'log_content', key: 'item' }, // 修改记录
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

onMounted(() => {});
const refresh = () => {
    $emit('handleRefresh');
    getTableDataFetch();
};

/* Fetch start*/
// 获取表格list
const getTableDataFetch = (parmas = {}) => {
    if (!bomId.value) return;
    loading.value = true;
    let obj = {
        // name:'主撑弹簧',
        bom_id: bomId.value,
        page: channelPagination.value.current,
        page_size: channelPagination.value.pageSize,
        ...parmas,
        ...props.searchParams,
    };

    Core.Api.Supplier.bomItemList(obj)
        .then(res => {
            channelPagination.value.total = res.count;
            tableData.value = res.list;
        })
        .catch(err => {
            console.log('getTableDataFetch', err);
        })
        .finally(() => {
            loading.value = false;
        });
};
/* Fetch end*/

/* methods start*/
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
    });
};
const changePrice = record => {
    bom_item_id.value = record.id;
    bom_item.value = { price: record.price };
    visibility.value = true;
};
const priceRecords = record => {
    if (record.log_count < 2) return;
    bom_item_id.value = record.id;
    priceVisibility.value = true;
    nextTick(() => {
        PriceModalRef.value.getTableDataFetch();
    });
};
/* methods end*/
// 监听弹窗关闭-更改父组件prop弹窗显隐值
watch(
    () => props.activeObj,
    (newVal, oldVal) => {
        bomId.value = newVal?.version_id;
        const obj1 = JSON.parse(JSON.stringify(newVal || ''));
        const obj2 = JSON.parse(JSON.stringify(oldVal || ''));
        if (!_.isEqual(obj1, obj2)) {
            channelPagination.value.current = 1;
            channelPagination.value.pageSize = 20;
            getTableDataFetch();
        }
    },
    { deep: true, immediate: true },
);

watch(
    () => props.searchParams,
    (newVal, oldVal) => {
        const obj1 = JSON.parse(JSON.stringify(newVal || ''));
        const obj2 = JSON.parse(JSON.stringify(oldVal || ''));
        if (!_.isEqual(obj1, obj2)) {
            channelPagination.value.current = 1;
            channelPagination.value.pageSize = 20;
            getTableDataFetch();
        }
    },
    {
        deep: true,
    },
);
defineExpose({
    refresh,
});
</script>

<style lang="less" scoped>
.fittings-two {
    // height: 100%;
    .title {
        margin-bottom: 10px;
        font-size: 20px;
        font-weight: 500;
        color: #0061ff;
        line-height: 28px;
    }

    .fittings-list {
        .title {
            margin: 24px auto 10px;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .btn {
                display: flex;
                .download-template {
                    margin-right: 10px;
                }
            }
        }
    }
    :deep(.supplier_name) {
        .ell();
        width: 120px;
        display: inline-block;
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

.table-title {
    color: #1d2129;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 500;
}
</style>
