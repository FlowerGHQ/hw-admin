<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.create_data') }}</div>
        </div>
        <div class="tabs-container colorful">
            <a-tabs v-model:activeKey="searchParam.status" @change="handleTableChange">
                <a-tab-pane :key="item.key" v-for="item of STATUS_LIST">
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
            <SearchAll :options="searchList" :isShowMore="false" @search="onSearch" @reset="onReset" ref="MySearchAll">
            </SearchAll>
        </div>
        <!-- table -->
        <div class="table-container">
            <a-button class="m-b-10" type="primary" @click="onBtn">
                {{ $t('supply-chain.create_data') }}
            </a-button>
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :loading="loading"
                :row-key="record => record.id"
                :row-selection="{
                    onChange: (selectedRowKeys, selectedRows) => handleSelectChange(selectedRowKeys, selectedRows),
                    getCheckboxProps: record => ({
                        disabled: record.name === 'Disabled User',
                    }),
                }"
                :pagination="false"
            >
                <template #bodyCell="{ column, text, record, index }">
                    <!-- 序号 -->
                    <template v-if="column.key === 'number'">
                        {{ (pagination.current - 1) * pagination.size + index + 1 }}
                    </template>
                    <!-- 公司名称 -->
                    <template v-if="column.key === 'company_name'">
                        {{ text || '-' }}
                    </template>
                    <!-- 供应商类型 -->
                    <template v-if="column.key === 'type'">
                        {{ Core.Const.SUPPLAY.SUPPLAY_TYPE[text] ? $t(Core.Const.SUPPLAY.SUPPLAY_TYPE[text]?.t) : '-' }}
                    </template>
                    <!-- 提交时间 -->
                    <template v-if="column.key === 'create_time'">
                        {{ text ? $Util.timeFormat(text) : '-' }}
                    </template>
                    <!-- qualified_record -->
                    <template v-if="column.key === 'qualified_record'">
                        <a-button
                            type="link"
                            @click="onView('add', record)"
                            v-if="record.stage === 30 || record.stage === 40"
                        >
                            {{ $t('supply-chain.view') }}
                        </a-button>
                        <span v-else-if="record.stage === 10 || record.stage === 20">无</span>
                        <span v-else>无</span>
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'operations'">
                        <a-button type="link" @click="onView('add', record)">
                            <MySvgIcon icon-class="supply-view" />
                            <span class="m-l-10">{{ $t('supply-chain.view') }}</span>
                        </a-button>
                        <a-button type="link" @click="onView('edit', record)">
                            <MySvgIcon icon-class="supply-edit" />
                            <span class="m-l-10">{{ $t('common.edit') }}</span>
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
import { onMounted, ref, getCurrentInstance, computed, watch } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import EditTableCell from './components/edit-table-cell.vue';
import _ from 'lodash';

const $store = useStore();
const router = useRouter();
const $t = useI18n().t;
const selectedIds = ref([]);
const handleSelectChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, selectedRows);
    selectedIds.value = selectedRowKeys;
};
const AUDIT_STATUS = Core.Const.SUPPLAY.AUDIT_STATUS;
const STAGE_LIST = Core.Const.SUPPLAY.STAGE;
const STATUS_LIST = Core.Const.SUPPLAY.STATUS_LIST;

const tableColumns = computed(() => {
    let columns = [
        { title: $t('supply-chain.serial_number'), dataIndex: 'number', key: 'number' },
        { title: $t('supply-chain.supplier_full_name'), dataIndex: 'company_name', key: 'company_name' },
        { title: $t('supply-chain.supplier_type'), dataIndex: 'type', key: 'type' },
        { title: $t('supply-chain.submission_time'), dataIndex: 'create_time', key: 'create_time' },
        // 供应商阶段
        {
            title: $t('supply-chain.supplier_stage'),
            dataIndex: 'stage',
            key: 'stage',
            customRender: ({ text, record, index }) => {
                return STAGE_LIST[text] ? $t(STAGE_LIST[text].t) : '-';
            },
        },
        // 状态
        {
            title: $t('supply-chain.status'),
            dataIndex: 'audit_status',
            key: 'audit_status',
            customRender: ({ text, record, index }) => {
                return AUDIT_STATUS[text] ? $t(AUDIT_STATUS[text].t) : '-';
            },
        },
        // 备注
        {
            title: $t('supply-chain.eliminate_reason'),
            dataIndex: 'remark',
            key: 'remark',
            customRender: ({ text, record, index }) => {
                return text ? text : '无';
            },
        },
        // 合格记录
        {
            title: $t('supply-chain.qualified_record'),
            dataIndex: 'qualified_record',
            key: 'qualified_record',
        },
        { title: $t('common.operations'), key: 'operations', fixed: 'right' },
    ];
    return columns;
});
const searchList = ref([
    {
        type: 'input',
        value: '',
        searchParmas: 'company_name',
        key: 'supply-chain.supplier_full_name',
    },
    {
        type: 'select',
        value: undefined,
        searchParmas: 'type',
        key: 'supply-chain.supplier_type',
        selectMap: Core.Const.SUPPLAY.SUPPLAY_TYPE,
    },
    {
        type: 'time-range',
        value: [],
        searchParmas: ['begin_time', 'end_time'],
        key: 'supply-chain.submission_time',
        defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_E,
    },
    {
        // 供应商阶段
        type: 'select',
        value: undefined,
        searchParmas: 'supplier_stage',
        key: 'supply-chain.supplier_stage',
        selectMap: Core.Const.SUPPLAY.STAGE_LIST,
    },
]);
const MySearchAll = ref(null);
const request = Core.Api.SUPPLY.adminList;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
    dataCallBack: res => {
        let list = _.cloneDeep(res.list);
        // item 和 item.form字段合并
        list.forEach(item => {
            item = Object.assign(item, item.form);
        });
        return list;
    },
});

const handleTableChange = key => {
    searchParam.value = Object.assign(searchParam.value, MySearchAll.value.getSearchFrom());
    search();
};

const onSearch = data => {
    searchParam.value = Object.assign(searchParam.value, data);
    search();
};
const onReset = () => {
    refreshTable();
    searchParam.value.status = '';
};
// 点击查看
const onView = (type, record) => {
    let routeUrl = null;
    switch (type) {
        case 'add':
            routeUrl = router.resolve({
                path: '/supply-manage/detail',
                query: {
                    id: record.id,
                },
            });
            window.open(routeUrl.href, '_blank');

            break;
        case 'edit':
            routeUrl = router.resolve({
                path: '/supply-manage/detail',
                query: {
                    id: record.id,
                    flag_edit: true,
                },
            });
            window.open(routeUrl.href, '_blank');
            break;
    }
};
const onBtn = () => {
    router.push({
        path: '/supply-manage/add',
    });
    $store.commit('SUPPLY_CHAIN/setSupplyChain', {});
    $store.commit('SUPPLY_CHAIN/setSupplyDraftChain', {});
    $store.commit('SUPPLY_CHAIN/setStep', 0);
    $store.commit('SUPPLY_CHAIN/setSubmitEd', false);
};
// 获取各个状态的数量
const getStatusCount = () => {
    Core.Api.SUPPLY.countStatus().then(res => {
        STATUS_LIST.forEach(item => {
            let obj = res.list.find(v => v.status === item.key);
            item.value = obj ? obj.count : 0;
        });
        let all_total = STATUS_LIST.reduce((total, item) => {
            return total + item.value;
        }, 0);
        STATUS_LIST[0].value = all_total;
    });
};
const tabCellSave = ({ record, index, column }) => {
    console.log('record', record);
    console.log('index', index);
    console.log('column', column);
};

onMounted(() => {
    getStatusCount();
});
</script>

<style lang="less" scoped>
.supply-edit {
    margin-left: 6px;
    cursor: pointer;
}
</style>
