<template>
    <div id="customer-care">
        <div>
            <div class="search">
                <SearchAll
                    ref="search_all"
                    :options="searchList"
                    :isShowMore="false"
                    @search="onSearch"
                    @reset="onReset"
                >
                </SearchAll>
            </div>
            <!-- table -->
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :loading="loading"
                    :locale="$i18n.locale === 'en' ? localeEn : localeZh"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #headerCell="{ title }">
                        <span class="table-title">{{ title }}</span>
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <!-- 备注 -->
                        <template v-if="column.key === 'remark'">
                            <a-tooltip>
                                <template #title>{{ text }}</template>
                                <div class="one-spils cursor" :style="{ width: text?.length > 6 ? 7 * 12 + 'px' : '' }">
                                    {{ text }}
                                </div>
                            </a-tooltip>
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
    </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, watch, onMounted, reactive } from 'vue';
import Core from '@/core';
import { useTable } from '@/hooks/useTable';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import localeEn from 'ant-design-vue/es/date-picker/locale/en_US';
import localeZh from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { result } from 'lodash';
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();

// 常量
const STATUS = Core.Const.FEEDBACK.STATUS;
const LOGIN_TYPE = Core.Const.LOGIN.TYPE;
const USER_TYPE = Core.Const.USER.TYPE;

// 响应式常量
const searchList = ref([
    {
        // 入库单号
        type: 'input',
        value: undefined,
        searchParmas: 'code',
        key: 'warehousing-management.uid',
    },
    {
        // 存货编码
        type: 'input',
        value: undefined,
        searchParmas: 'sync_id',
        key: 'warehousing-management.sync_id',
    },
]);
const tableColumns = ref();

/* 生命周期*/
onMounted(() => {
    tableColumns.value = [
        { title: proxy.$t('warehousing-management.product_item_code'), dataIndex: 'code', key: 'code' }, // 子件编码
        { title: proxy.$t('warehousing-management.product_item_'), dataIndex: 'name', key: 'name' }, // 子件名称
        { title: proxy.$t('warehousing-management.product_item_'), dataIndex: 'supplier_name', key: 'supplier_name' }, // 子件规格
        { title: proxy.$t('warehousing-management.product_item_'), dataIndex: 'sn', key: 'sn' }, // 基本用量
        { title: proxy.$t('warehousing-management.product_item_amount'), dataIndex: 'amount', key: 'amount' }, // 应领数量
        { title: proxy.$t('warehousing-management.product_item_'), dataIndex: '', key: '' }, // 已领数量
        { title: proxy.$t('warehousing-management.product_item_'), dataIndex: '', key: '' }, // 未完成数量
        { title: proxy.$t('warehousing-management.product_item_'), dataIndex: 'amount', key: 'amount' }, // 物料管理员
    ];
});
/* 生命周期*/

/* fetch start*/
// 采购入库单列表
const getInquirySheet = Core.Api.inquiry_sheet.list;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request: getInquirySheet,
    // dataCallBack(res) {
    // }
});

/* fetch end*/

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
#customer-care {
    .table-title {
        color: #1d2129;
        font-size: 14px;
        font-weight: 500;
    }

    :depp(.ant-table-cell) {
        position: relative;
    }
    .new {
        height: 52px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        // align-items: center;
        .new-msg {
            color: #fff;
            font-size: 12px;
            font-weight: 400;
            background-color: #f53f3f;
            padding: 0px 8px;
            border-radius: 0px 0px 4px 0px;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            left: 0;
        }
    }

    .new {
    }
}

.status-style {
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    padding: 4px 0px;
    box-sizing: border-box;
    .flex();
    min-width: 70px;
    &.color-FF7D00 {
        background: rgba(255, 125, 0, 0.1);
        color: #ff7d00 !important;
    }
    &.color-0061FF {
        background: rgba(0, 97, 255, 0.1);
        color: #0061ff !important;
    }
    &.color-00B42A {
        background: rgba(38, 171, 84, 0.1);
        color: #00b42a !important;
    }
}
.cj_bg {
    display: inline-block;
    background-color: #f2f3f5;
    padding: 5px 8px;
    border-radius: 4px;
    margin-right: 10px;
    font-size: 14px;
}
.ant-tooltip {
    max-width: none;
}
</style>
