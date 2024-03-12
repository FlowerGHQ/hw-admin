<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t(/*充值审核*/ 'payment-management.recharge_audit') }}
            </div>
        </div>
        <div class="tabs-container colorful" v-if="!purchaseMode">
            <a-tabs v-model:activeKey="searchParam.status" @change="handleSearch">
                <a-tab-pane :key="item.key" v-for="item of statusList">
                    <template #tab>
                        <div class="tabs-title">
                            {{ item[$i18n.locale] }}
                            <!-- <span :class="item.color">{{ item.value }}</span> -->
                        </div>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll :options="searchList" :isShowMore="false" @search="onSearch" @reset="onReset" ref="searchAllRef">
            </SearchAll>
        </div>
        <!-- table -->
        <div class="table-container">
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :loading="loading"
                :row-key="record => record.id"
                :pagination="false"
            >
                <template #bodyCell="{ column, text, record, index }">
                    <!-- 序号 -->
                    <template v-if="column.key === 'number'">
                        {{ index + 1 }}
                    </template>
                    <template v-if="column.key === 'item'">
                        <a-tooltip placement="topLeft">
                            <template #title>{{ text || '-' }}</template>
                            <div
                                class="one-spils cursor"
                                :style="{
                                    width: text?.length > 15 ? 7 * 12 + 'px' : '',
                                }"
                            >
                                {{ text || '-' }}
                            </div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'status'">
                        <div
                            class="status-box"
                            :class="$Util.auditStatusFilter(text, 'color')"
                        >
                            {{ $Util.auditStatusFilter(text, 'text', [$i18n.locale]) }}
                        </div>
                    </template>
                    <template v-if="column.key === 'create_time'">
                        {{ text ? $Util.timeFormat(text) : '-' }}
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'operations'">
                        <a-button type="link" @click="routerChange('detail', record.id)">
                            <MySvgIcon icon-class="eyes-icon" class-name="eyes" />
                            <span class="m-l-10">{{ $t(/*查看详情*/'item_order.see_detail') }}</span>
                        </a-button>
                    </template>
                </template>
            </a-table>
        </div>
        <div class="paging-container">
            <a-pagination
                v-model:current="pagination.current"
                :page-size="pagination.size"
                :total="pagination.total"
                show-quick-jumper
                show-size-changer
                show-less-items
                :show-total="total => $t('n.all_total') + ` ${pagination.total} ` + $t('in.total')"
                :hide-on-single-page="false"
                :pageSizeOptions="['10', '20', '30', '40']"
                @change="onPageChange"
                @showSizeChange="onSizeChange"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, getCurrentInstance } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
const router = useRouter();
const $t = useI18n().t;
const searchAllRef = ref(null);
const { proxy } = getCurrentInstance();
import MySvgIcon from '@/components/MySvgIcon/index.vue';
const tableColumns = computed(() => {
    let columns = [
        { title: $t(/*序号*/ 'n.index'), dataIndex: 'id', key: 'number' },
        { title: $t(/*充值单号*/ 'payment-management.recharge_order_number'), dataIndex: 'region', key: 'item' },
        { title: $t(/*分销商名称*/ 'payment-management.distributor_name'), dataIndex: 'acc_info', key: 'item' },
        { title: $t(/*提交申请时间*/ 'payment-management.app_submit_time'), dataIndex: 'create_time', key: 'create_time' },
        { title: $t(/*收款账号信息*/ 'payment-management.receiving_acc_info'), dataIndex: 'dollar_info', key: 'item' },
        { title: $t(/*整车余额充值金额*/ 'payment-management.vehicle_balance_amount'), dataIndex: 'eur_info', key: 'item' },
        { title: $t(/*配件余额充值金额*/ 'payment-management.spare_parts_balance_amount'), dataIndex: 'eur_info', key: 'item' },
        { title: $t(/*总充值金额*/ 'payment-management.total_top_up_amount'), dataIndex: 'eur_info', key: 'item' },
        { title: $t(/*状态*/ 'payment-management.state'), dataIndex: 'status', key: 'status' },
        { title: $t(/*操作记录*/ 'payment-management.operation_record'), dataIndex: 'create_time', key: 'item' },
        { title: $t(/*操作*/ 'common.operations'), key: 'operations', fixed: 'right' },
    ];
    return columns;
});

const searchList = ref([
    // 名称
    {
        type: 'input',
        value: '',
        searchParmas: 'name',
        key: 'payment-management.name',
    },
    // 提交时间
    {
        type: 'time-range',
        value: [],
        searchParmas: ['begin_time', 'end_time'],
        key: 'payment-management.submission_time',
    },
]);
const statusList = ref([
    { zh: '全  部', en: 'All', value: '0', color: 'primary', key: '0' },
    { zh: '等待一审', en: 'Pending First Audit', value: '0', color: 'yellow', key: '50' },
    { zh: '等待二审', en: 'Pending Second Audit', value: '0', color: 'yellow', key: '60' },
    { zh: '二审通过', en: 'Approval Second Audit', value: '0', color: 'yellow', key: '100' },
    { zh: '一审不通过', en: 'The First Audit Was Rejected', value: '0', color: 'yellow', key: '630' },
    { zh: '二审不通过', en: 'The Second Audit Was Rejected', value: '0', color: 'yellow', key: '150' },
]);

onMounted(() => {});
/* Fetch start*/
const request = Core.Api.Operation.list;
const dataCallBack = res => {
    // 处理数据
    return res.list.map(item => {
        item.old_sort = Core.Util.deepCopy(item.sort);
        item.firstSentence = Core.Util.Common.getFirstSentence(item.content);
        return item;
    });
};
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
    initParam: { type: Core.Const.OPERATION.OPERATION_TYPE_MAP.REPORT },
    dataCallBack: dataCallBack,
});
/* Fetch end*/

/* methods start*/
const onSearch = data => {
    searchParam.value = data;
    search();
};
const onReset = () => {
    refreshTable();
};
const routerChange = (type, record) => {
    switch (type) {
        case 'detail':
            router.push({
                path: '/recharge/detail',
                query: {
                    id: record.id,
                },
            });
            break;
    }
};
const handleSearch = (e) => {
    searchParam.value.status = e
    search();
}
/* methods end*/
</script>

<style lang="less" scoped>
.list-container {
    .title-container {
        .title-area {
            color: #1d2129;
            font-size: 18px;
            font-weight: 600;
        }
    }

    .icon-info {
        cursor: pointer;
    }

    .effective-state {
        display: flex;
        align-items: center;

        .switch-state {
            color: #8e8e8e;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            margin-left: 4px;

            &.blue {
                color: #0061ff;
            }

            &.grey {
                color: #8e8e8e;
            }
        }
    }
    .eyes {
        margin-bottom: 1.5px;
    }
    .status-box {
        padding: 5px 12px;
        box-sizing: border-box;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        border-radius: 4px;
        &.yellow {
            background: #FEF7E7;
            color: #FAAD14;
        }
        &.green {
            background: #E9F6EE;
            color: #26AB54;
        }
        &.red {
            color: #FF3D40;
            background: #FFEBEC;
        }
        &.grey {
            color: #8090a6;
            background: rgba(140, 140, 140, 0.05);
        }
    }
}
</style>
