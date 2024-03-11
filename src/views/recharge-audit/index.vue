<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t(/*充值审核*/ 'payment-management.recharge_audit') }}
            </div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('add')">
                    {{ $t(/*新增收款账号*/ 'payment-management.new_account') }}
                </a-button>
            </div>
        </div>
        <div class="tabs-container colorful" v-if="!purchaseMode">
            <a-tabs v-model:activeKey="searchParam.status" @change="handleSearch">
                <a-tab-pane :key="item.key" v-for="item of statusList">
                    <template #tab>
                        <div class="tabs-title">
                            {{ item[$i18n.locale] }}<span :class="item.color">{{ item.value }}</span>
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
        <div class="current-region-wrap">
            {{$t(/*当前生效的地区*/ 'payment-management.current_effect')}}:{{ regionList.length }}{{$t(/*个*/ 'payment-management.unit')}}
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
                <template #headerCell="{ column }">
                    <!-- 排序 -->
                    <template v-if="column.key === 'input'">
                        {{ column.title }}
                        <a-tooltip>
                            <template #title>{{ $t('operation.input_pla') }}</template>
                            <MySvgIcon icon-class="info" class-name="icon-info" />
                        </a-tooltip>
                    </template>
                </template>
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
                    <template v-if="column.key === 'content'">
                        <a-tooltip placement="topLeft">
                            <template #title>{{ record.firstSentence }}</template>
                            <div
                                class="one-spils cursor"
                                :style="{
                                    width: record.firstSentence?.length > 20 ? 18 + 'rem' : '',
                                }"
                            >
                                {{ record.firstSentence }}
                            </div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'create_time'">
                        {{ text ? $Util.timeFormat(text) : '-' }}
                    </template>
                    <!-- 生效状态 -->
                    <template v-if="column.key === 'effective_state'">
                        <div class="effective-state">
                            <a-switch
                                v-model:checked="record.status"
                                size="small"
                                :checked-value="1"
                                :un-checked-value="2"
                                @change="event => onSwitch(event, record)"
                            />
                            <div :class="record.status === 1 ? 'switch-state blue' : 'switch-state grey'">
                                {{
                                    record.status === 1
                                        ? $t(/*已生效*/ 'operation.took_effect')
                                        : $t(/*未生效*/ 'operation.invalid')
                                }}
                            </div>
                        </div>
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'operations'">
                        <a-button type="link" @click="routerChange('detail', record)">
                            <!-- <MySvgIcon icon-class="supply-edit" /> -->
                            <span class="m-l-10">{{ $t(/*审核*/'payment-management.audit') }}</span>
                        </a-button>
                        <a-button type="link" @click="handleAudit(record)">
                            <!-- <MySvgIcon icon-class="sales-delete" /> -->
                            <span class="m-l-10">{{ $t('def.detail') }}</span>
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
import MySvgIcon from '@/components/MySvgIcon/index.vue';
const router = useRouter();
const $t = useI18n().t;
const searchAllRef = ref(null);
const { proxy } = getCurrentInstance();
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
        { title: $t(/*状态*/ 'payment-management.state'), dataIndex: 'eur_info', key: 'item' },
        { title: $t(/*操作*/ 'common.operations'), key: 'operations', fixed: 'right' },
        { title: $t(/*操作记录*/ 'payment-management.operation_record'), dataIndex: 'create_time', key: 'item', fixed: 'right' },
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
const regionList = ref([
    '美国','意大利','西班牙','菲律宾'
])
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
const auditFetch = id => {
    Core.Api.Operation.delete({
        id: id,
    })
        .then(res => {
            console.log('deleteFetch res', res);
            searchAllRef.value.handleSearch();
            proxy.$message.success($t('pop_up.delete_success'));
        })
        .catch(err => {
            console.log('deleteFetch err', err);
        });
};

const updateStatusFetch = (record, type) => {
    Core.Api.Operation.updateStatus({
        id: record.id,
        status: record.status,
        sort: record.sort,
        type: 1,
    })
        .then(res => {
            console.log('updateStatusFetch res', res);
            searchAllRef.value.handleSearch();
            if (record.status === 1 && type === 'switch') {
                proxy.$message.success($t('operation.ad_success_tip'));
            }
        })
        .catch(err => {
            console.log('updateStatusFetch err', err);
        });
};
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
const handleAudit = record => {
    Core.Util.confirm({
        title: $t('pop_up.sure_delete'),
        okText: $t('def.sure'),
        okType: 'danger',
        cancelText: $t('def.cancel'),
        onOk: () => {
            deleteFetch(record.id);
        },
    });
};
const onSwitch = (e, record) => {
    updateStatusFetch(record, 'switch');
};
const onBlur = record => {
    if (!record.sort) {
        // 如果输入为空则赋值之前的排序
        record.sort = record.old_sort;
    }
    updateStatusFetch(record, 'input');
};
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
    .current-region-wrap {
        padding: 0 20px;
        box-sizing: border-box;
        margin-top: 20px;
        width: 100%;
    }
}
</style>
