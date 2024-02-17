<template>
    <div class="rive-records">
        <a-table
            :columns="tableColumns"
            :data-source="tableData"
            :scroll="{ x: true }"
            :row-key="record => record.id"
            :pagination="channelPagination"
            @change="handleTableChange"
        >
            <template #headerCell="{ title }">
                {{ $t(title) }}
            </template>
            <template #bodyCell="{ column, text, record }"> </template>
        </a-table>
    </div>
</template>

<script setup>
import Core from '@/core';
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const loading = ref(false); // 加载
const tableData = ref([]);
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: total => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`,
}); // 分页配置

onMounted(() => {
    getTableDataFetch({
        page: 1,
    });
});
const { proxy } = getCurrentInstance();
const router = useRouter();
/* 计算属性 */
const tableColumns = computed(() => {
    let columns = [
        {
            title: 'retail.test_drive_start_time',
            dataIndex: 'uid',
            key: 'uid',
        },
        {
            title: 'retail.test_drive_end_time',
            dataIndex: ['order', 'uid'],
            key: 'order_uid',
        },
        {
            title: 'retail.test_drive_status',
            dataIndex: 'status',
            key: 'util',
            util: 'CRMOrderIncomeStatusFilter',
        },
        {
            title: 'retail.test_drive_duration',
            dataIndex: 'money',
            key: 'money',
        },
        {
            title: 'retail.test_drive_users',
            dataIndex: 'refunded',
            key: 'refunded',
        },
        {
            title: 'retail.driving_license',
            dataIndex: 'date',
            key: 'time',
        },
        {
            title: 'retail.sign_an_agreement',
            dataIndex: 'type',
            key: 'util',
            util: 'CRMOrderIncomeTypeFilter',
        },
        {
            title: 'retail.experience_hall',
            dataIndex: 'payment_type',
            key: 'util',
            util: 'CRMOrderIncomePaymentTypeFilter',
        },
    ];
    return columns;
});

// table接口
const getTableDataFetch = (params = {}) => {
    loading.value = true;
    Core.Api.CRMOrderIncome.list({
        search_type: 10,
        ...params,
    })
        .then(res => {
            channelPagination.value.total = res.count;
            console.log('getTableData res:', res);
            tableData.value = res.list;
        })
        .catch(err => {
            console.log('getTableData err:', err);
        })
        .finally(() => {
            loading.value = false;
        });
};
/* 接口 end*/

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
</script>

<style lang="less" scoped></style>
