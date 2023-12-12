<template>
    <div class="fittings">
        <a-table
            :row-key="(record) => record.id"
            :data-source="tableData"
            :columns="tableColumns"
            :scroll="{ x: true, }"
            :pagination="channelPagination"
            @change="handleTableChange"
        >   
            <!-- :pagination="channelPagination"
            @change="handleTableChange" -->
            <template #bodyCell="{ column, text, record }">
                <!-- <span v-if="column.name === ''"></span> -->
            </template>
        </a-table>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue';
import Core from "@/core";

const { proxy } = getCurrentInstance();

const tableColumns = ref([
    { 
        title: "商品名称", 
        dataIndex: "name", 
        key: "detail"
    },
    { 
        title: "商品编码", 
        dataIndex: "name", 
        key: "detail"
    },
    { 
        title: "厂商名称", 
        dataIndex: "name", 
        key: "detail"
    },
    { 
        title: "版本号", 
        dataIndex: "name", 
        key: "detail"
    },
    { 
        title: "用量", 
        dataIndex: "name", 
        key: "detail"
    },
    { 
        title: "商品图片", 
        dataIndex: "name", 
        key: "detail"
    },
    { 
        title: "销售区域", 
        dataIndex: "name", 
        key: "detail"
    },
    { 
        title: "创建时间", 
        dataIndex: "create_time", 
        key: "detail"
    },
    { 
        title: "备注", 
        dataIndex: "remark",
        key: "remark"
    },
])
const tableData = ref([])
// 分页
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: (total) => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`
})


onMounted(() => {
    getTableDataFetch()
})
/* Fetch start*/
// 获取表格list
const getTableDataFetch = (parmas = {}) => {
    let obj = {
        flag_spread: 1,
        page: 1,
        page_size: 20,
        status: "0",
        ...parmas
    }

    Core.Api.Item.list(obj).then(res => {
        channelPagination.value.total = res.count
        tableData.value = res.list
    }).catch(err => {
        console.log("getTableDataFetch", err);
    })
}
/* Fetch end*/

/* methods start*/
// 分页事件
const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...channelPagination.value }
    pager.current = pagination.current
    if (pagination.pageSize !== channelPagination.value.pageSize) {
        pager.current = 1
        pager.pageSize = pagination.pageSize
    }
    channelPagination.value = pager
    getTableDataFetch({
        page_size: channelPagination.value.pageSize,
        page: channelPagination.value.current
    })
}
/* methods end*/

</script>

<style lang="less" scoped>
.fittings {
    width: 100%;
}
</style>