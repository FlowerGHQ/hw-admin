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
                        <!-- 需要展示横线 -->
                        <template v-if="column.type === 'horizontal_line'">
                            {{ text || '-' }}
                        </template>
                        <!-- 需要展示横线 -->
                        <template v-if="column.key === 'remark'">
                            <a-tooltip placement="top" :title="text">                                
                                <div class="one-spils cursor" :style="{ width: text?.length > 12 ? 12 * 12 + 'px' : '' }">
                                    {{ text || '-' }}
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
});
const emits = defineEmits(['update:visible', 'ok', 'cancel']);

const tableColumns = computed(() => {
    let columns = [];
    columns = [
        { title: proxy.$t('distributor-detail.application_time'), dataIndex: 'uid', key: 'time' }, // 申请时间
        { title: proxy.$t('distributor.audit_result'), dataIndex: 'uid', key: 'uid', type: 'horizontal_line' }, // 审核结果
        { title: proxy.$t('common.reason'), dataIndex: 'remark', key: 'remark' }, // 原因
    ];
    return columns;
});

/* fetch start*/
// 获取table数据
const getStatusFetch = (params = {}) => {
    const obj = {
        ...params,
    };

    Core.Api.inquiry_sheet
        .statusList(obj)
        .then(res => {
            console.log('获取状态数据 res', res);
            statusData.value = res;
        })
        .catch(err => {
            console.log('获取状态数据 err', err);
        });
};
// 获取询问单列表
const getInquirySheet = Core.Api.inquiry_sheet.list;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request: getInquirySheet,
    dataCallBack() {
        return [
            {
                remark: '你好安徽沙发的解放军撒回复就卡刷卡积分库萨克',
            },
        ];
    },
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
