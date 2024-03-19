<template>
    <div class="shipping-freight">
        <a-modal v-model:visible="visible" :title="title" @cancel="handleCancel" :footer="false" width="700px">
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
                        <!-- 审核结果 -->
                        <template v-if="column.key === 'audit_status'">
                            {{ AUDIT_CANCEL_STATUS_MAP[text]?.t ? $t(`${AUDIT_CANCEL_STATUS_MAP[text]?.t}`) : '-' }}
                        </template>
                        <!-- 原因 -->
                        <template v-if="column.key === 'audit_remark'">
                            <a-tooltip>
                                <template #title>{{ text }}</template>
                                <div
                                    class="one-spils cursor"
                                    :style="{ width: text?.length > 15 ? 15 * 12 + 'px' : '' }"
                                >
                                    {{ text }}
                                </div>
                            </a-tooltip>
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
        </a-modal>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import Core from '@/core';
import { useTable } from '@/hooks/useTable';
import localeEn from 'ant-design-vue/es/date-picker/locale/en_US';
import localeZh from 'ant-design-vue/es/date-picker/locale/zh_CN';
const AUDIT_CANCEL_STATUS_MAP = Core.Const.DISTRIBUTOR.AUDIT_CANCEL_STATUS_MAP;

const { proxy } = getCurrentInstance();
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '',
    },
    id: {
        type: [Number, String],        
    },
});
const emits = defineEmits(['update:visible', 'ok', 'cancel']);

const tableColumns = computed(() => {
    let columns = [];
    columns = [
        { title: proxy.$t('distributor-detail.application_time'), dataIndex: 'audit_create_time', key: 'time' }, // 申请时间
        { title: proxy.$t('distributor.audit_result'), dataIndex: 'audit_status', key: 'audit_status' }, // 审核结果
        { title: proxy.$t('common.reason'), dataIndex: 'audit_remark', key: 'audit_remark' }, // 原因
    ];
    return columns;
});

/* fetch start*/
// 取消记录list
const getInquirySheet = Core.Api.CancelOrderList.list;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request: getInquirySheet,
    initParam: {
        order_id: props.id
    }
});
/* fetch end*/

/* methods start*/
const handleCancel = () => {
    emits('update:visible', false);
};
/* methods end*/

onMounted(() => {});
</script>

<style lang="less" scoped>
.shipping-freight {
}
</style>
