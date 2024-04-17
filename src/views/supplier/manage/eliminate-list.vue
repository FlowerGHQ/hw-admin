<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.eliminate_supplier_list') }}</div>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll :options="searchList" :isShowMore="false" @search="onSearch" @reset="onReset"> </SearchAll>
        </div>
        <!-- table -->
        <div class="table-container">
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :loading="loading"
                :row-key="record => record.id"
                :pagination="{
                    current: pagination.current,
                    pageSize: pagination.size,
                    total: pagination.total,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    showLessItems: true,
                    showTotal: total => $t('n.all_total') + ` ${pagination.total} ` + $t('in.total'),
                    hideOnSinglePage: false,
                    pageSizeOptions: ['10', '20', '30', '40'],
                }"
                @change="({ current, pageSize }) => onPagenationChange(current, pageSize)"
            >
                <template #bodyCell="{ text, record, index, column }">
                    <template v-if="column.key && column.key !== 'create_time'">
                        <span class="cell-max-with">
                            <a-tooltip placement="topLeft" :title="text || '-'">
                                <span class="remark-text">{{ text || '-' }}</span>
                            </a-tooltip>
                        </span>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, nextTick, reactive } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import _ from 'lodash';

const $store = useStore();
const router = useRouter();
const $t = useI18n().t;
const { proxy } = getCurrentInstance();

const request = Core.Api.SUPPLY.adminList;
const { loading, tableData, pagination, search, onPagenationChange, refreshTable, searchParam } = useTable({
    request,
    initParam: {
        stage: 30, //淘汰
    },
    dataCallBack: res => {
        let list = _.cloneDeep(res.list);
        // item 和 item.form字段合并
        list.forEach(item => {
            item.code = item?.form?.code || '';
            item.no = item?.form?.no || '';
            item.short_name = item?.form?.short_name || '';
            item.purchase_category = item?.form?.purchase_category || undefined;
            item.supply_main = item?.form?.supply_main || '';
            item.supply_secondary = item?.form?.supply_secondary || '';
            item.supply_other = item?.form?.supply_other || '';
            item.vehicle_model = item?.form?.vehicle_model || '';
            item.manager = item?.form?.manager || undefined;
            item.register_type = item?.form?.register_type || '';
            item.province = item?.form?.company_info?.province || '';
            item.city = item?.form?.company_info?.city || '';
            item.address = item?.form?.company_info?.address || '';
            item.cooperative_manufacturers = item?.form?.customer_info.map(item => item.customer_name).join('、') || '';
        });
        return list;
    },
});

const tableColumns = computed(() => {
    let columns = [
        {
            title: $t('supply-chain.serial_number'),
            dataIndex: 'number',
            key: 'number',
            customRender: ({ text, record, index, column }) => {
                // 当前页码-1 * 每页条数 + 索引 + 1
                return (pagination.value.current - 1) * pagination.value.size + index + 1;
            },
        },
        {
            title: $t('supply-chain.supplier_full_name'),
            dataIndex: 'company_name',
            key: 'company_name',
        },
        // 采购品类
        {
            title: $t('supply-chain.procurement_category'),
            dataIndex: 'purchase_category',
            key: 'purchase_category',
        },
        {
            title: $t('supply-chain.main_supply'),
            dataIndex: 'supply_main',
            key: 'supply_main',
        },
        {
            title: $t('supply-chain.secondary_supply'),
            dataIndex: 'supply_secondary',
            key: 'supply_secondary',
        },
        {
            title: $t('supply-chain.other_items'),
            dataIndex: 'supply_other',
            key: 'supply_other',
        },
        // cooperative_manufacturers 合作厂商
        {
            title: $t('supply-chain.cooperative_manufacturers'),
            dataIndex: 'cooperative_manufacturers',
            key: 'cooperative_manufacturers',
        },
        {
            title: $t('common.vehicle_model'),
            dataIndex: 'vehicle_model',
            key: 'vehicle_model',
        },
        {
            title: $t('supply-chain.introduction_date'),
            dataIndex: 'create_time',
            key: 'create_time',
            customRender: ({ text, record, index, column }) => {
                return text ? Core.Util.timeFormat(text) : '-';
            },
        },
        {
            title: $t('supply-chain.province'),
            dataIndex: 'province',
            key: 'province',
        },
        {
            title: $t('supply-chain.city'),
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: $t('supply-chain.detailed_address'),
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: $t('supply-chain.eliminate_reason'),
            dataIndex: 'remark',
            key: 'remark',
        },
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
]);

/* methods start*/
const onSearch = data => {
    searchParam.value = data;
    search();
};
const onReset = () => {
    refreshTable();
};

/* methods end*/
</script>

<style lang="less" scoped>
.remark {
    .fcc();
    .remark-text {
        display: inline-block;
        max-width: 300px;
        .ell();
    }
    .supply-edit {
        margin-left: 6px;
        cursor: pointer;
    }
}
.title-container {
    .btns-area {
        .file-upload-btn {
            margin-right: 15px;
        }
        .btn-group {
            display: inline-flex;
            .radio-btn {
                padding: 6px 10px;
                border: 1px solid #eaecf1;
                border-right: none;
                cursor: pointer;
                font-size: 14px;
                font-weight: 400;
                text-align: center;
                color: #1d2129;
                line-height: 20px;
                &.first {
                    border-radius: 4px 0 0 4px;
                }
                &.last {
                    border-right: 1px solid #eaecf1;
                    border-radius: 0 4px 4px 0;
                }
                &:hover {
                    color: #1890ff;
                }
            }
        }
    }
}
:deep(.ant-table-cell) {
    .editable-cell-input-wrapper {
        display: flex;
        align-items: center;
        .editable-cell-icon-check {
            cursor: pointer;
            color: #006ef9;
            margin-left: 4px;
        }
    }
    .editable-cell-text-wrapper {
        display: flex;
        align-items: center;
        .editable-cell-icon {
            cursor: pointer;
            color: #006ef9;
            margin-left: 8px;
        }
    }
    .cell-max-with {
        max-width: 200px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }
}
</style>
