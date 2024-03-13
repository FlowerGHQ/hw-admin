<template>
    <div id="payment-record">
        <div>          
            <!-- table -->
            <div>
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

                        <!-- 已支付金额 -->
                        <template v-if="column.key === 'amount_paid'">
                            <span v-if="text >= 0">{{ $Util.priceUnitFilter(record.currency) }}</span>
                            <span>
                                {{ $Util.countFilter(text) }}
                            </span>
                        </template>

                        <!-- 时间 -->
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
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
import { ref, computed, getCurrentInstance, watch, onMounted } from 'vue';
import Core from '@/core';
import { useTable } from '@/hooks/useTable';
import localeEn from 'ant-design-vue/es/date-picker/locale/en_US';
import localeZh from 'ant-design-vue/es/date-picker/locale/zh_CN';

import { useRouter, useRoute } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();


/* computed start */
const tableColumns = computed(() => {
    let columns = [];
    columns = [
        { title: proxy.$t('distributor-detail.payment_account_number'), dataIndex: 'sn', key: 'sn' }, // 支付账号
        { title: proxy.$t('p.time_payment'), dataIndex: 'pay_time', key: 'time' }, // 支付时间
        { title: proxy.$t('distributor-detail.actual_amount_paid'), dataIndex: 'amount_paid', key: 'amount_paid' }, // 实付金额
    ];
    return columns;
});
/* computed end */

/* fetch start*/

// 获取询问单列表
const getInquirySheet = Core.Api.inquiry_sheet.list;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request: getInquirySheet,
});

/* fetch end*/

/* methods start*/


onMounted(() => {});
</script>

<style lang="less" scoped>
#payment-record {
    .table-title {
        color: #1d2129;
        font-size: 14px;
        font-weight: 500;
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
</style>
