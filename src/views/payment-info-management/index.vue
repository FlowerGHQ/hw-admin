<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t(/*付款信息管理*/ 'payment-management.list_title') }}
            </div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('add')">
                    {{ $t(/*新增收款账号*/ 'payment-management.new_account') }}
                </a-button>
            </div>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll :options="searchList" :isShowMore="false" @search="onSearch" @reset="onReset" ref="searchAllRef">
            </SearchAll>
        </div>
        <div class="current-region-wrap">
            <div class="region-key">
                {{$t(/*当前生效的地区*/ 'payment-management.current_effect')}}:
            </div>
            <div class="region-count">
                {{ regionList.length }}{{$t(/*个*/ 'payment-management.unit')}}
            </div>
        </div>
        <div class="current-region-list-container">
            <div v-for="(item, index) in regionList" :key="index" class="current-region">
                {{ item }}
            </div>
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
                        <a-button type="link" @click="routerChange('edit', record)">
                            <MySvgIcon icon-class="supply-edit" />
                            <span class="m-l-10">{{ $t('common.edit') }}</span>
                        </a-button>
                        <a-button type="link" @click="handleDelete(record)">
                            <MySvgIcon icon-class="sales-delete" />
                            <span class="m-l-10">{{ $t('def.delete') }}</span>
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
        { title: $t(/*地区*/ 'payment-management.region'), dataIndex: 'region', key: 'item' },
        { title: $t(/*账户信息*/ 'payment-management.acc_info'), dataIndex: 'acc_info', key: 'item' },
        { title: $t(/*美元付款信息*/ 'payment-management.dollar_info'), dataIndex: 'dollar_info', key: 'item' },
        { title: $t(/*欧元付款信息*/ 'payment-management.eur_info'), dataIndex: 'eur_info', key: 'item' },
        { title: $t(/*创建时间*/ 'n.time'), dataIndex: 'create_time', key: 'create_time' },
        { title: $t(/*生效状态*/ 'operation.effective_state'), key: 'effective_state', fixed: 'right' },
        { title: $t(/*操作*/ 'common.operations'), key: 'operations', fixed: 'right' },
    ];
    return columns;
});

const searchList = ref([
    // 地区
    {
        type: 'input',
        value: '',
        searchParmas: 'region',
        key: 'payment-management.region',
    },
    // 账户信息
    {
        type: 'input',
        value: '',
        searchParmas: 'area',
        key: 'payment-management.acc_info',
    },
    // 生效状态
    {
        type: 'select',
        value: undefined,
        searchParmas: 'status',
        key: 'payment-management.effective_state',
        selectMap: Core.Const.PAYMENT_MANAGEMENT.EFFECTIVE_TYPE,
    },
]);
const regionList = ref([
    '美国','意大利','西班牙','菲律宾','美国','意大利','西班牙','菲律宾','美国','意大利'
])

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
const deleteFetch = id => {
    Core.Api.PayAccount.delete({
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
    Core.Api.PayAccount.updateStatus({
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
        case 'edit':
            router.push({
                path: '/payment-info-management/payment-info-edit',
                query: {
                    id: record.id,
                },
            });
            break;
        case 'add':
            router.push({
                path: '/payment-info-management/payment-info-edit',
            });
            break;
    }
};
const handleDelete = record => {
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
        display: flex;
        align-items: center;
        .region-key {
            font-size: 14px;
            color: #1D2129;
            font-weight: 500;
        }
        .region-count {
            font-size: 14px;
            color: #0061FF;
            font-weight: 500;
            margin-left: 15px;
        }
    }
    .current-region-list-container {
        padding: 0 20px;
        box-sizing: border-box;
        margin-top: 8px;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 8px;
        .current-region {
            padding: 2px 8px;
            box-sizing: border-box;
            background: #EAECF1;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 400;
            color: #1D2129;
            text-align: center;
            margin-right: 6px;
            margin-bottom: 8px;
        }
    }
}
.table-container {
    margin-top: 0;
}
</style>
