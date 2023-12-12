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
                <span v-if="column.key === 'name'/*商品名称*/">
                    <a-tooltip>
                        <template #title>{{ text }}</template>
                        <div 
                            class="one-spils cursor" 
                            :style="{ width: text?.length > 6 ? 7 * 12 + 'px' : '' }"
                        >
                            {{ text }}
                        </div>
                    </a-tooltip>
                </span>
                <span v-if="column.key === 'manufacturer_name'/*厂商名称*/">
                    <a-tooltip>
                        <template #title>{{ text }}</template>
                        <div 
                            class="one-spils cursor" 
                            :style="{ width: text?.length > 4 ? 5 * 12 + 'px' : '' }"
                        >
                            {{ text }}
                        </div>
                    </a-tooltip>
                </span>
                <span v-if="column.key === 'sales_area'/*销售区域*/">
                    <a-tooltip>
                        <template #title>{{ text }}</template>
                        <div 
                            class="one-spils cursor" 
                            :style="{ width: text?.length > 5 ? 6 * 12 + 'px' : '' }"
                        >
                            {{ text }}
                        </div>
                    </a-tooltip>
                </span>
                <span v-if="column.key === 'create_time'/*创建时间*/">
                    {{ $Util.timeFilter(text) }}
                </span>
                <span v-if="column.key === 'remark'/*备注*/">
                    <a-tooltip>
                        <template #title>{{ text }}</template>
                        <div class="one-spils set-width cursor">
                            {{ text }}
                        </div>
                    </a-tooltip>
                </span>
            </template>
        </a-table>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed } from 'vue';
import Core from "@/core";

const { proxy } = getCurrentInstance();


const tableColumns = computed(() => {
    const result = [
        { 
            // 商品名称
            title: proxy.$t('item-bom.product_name'), 
            dataIndex: "name", 
            key: "name"
        },
        { 
            // 商品编码
            title: proxy.$t('item-bom.commodity_code'), 
            dataIndex: "name", 
            key: "detail"
        },
        { 
            // 厂商名称
            title: proxy.$t('item-bom.manufacturer_name'), 
            dataIndex: "manufacturer_name", 
            key: "manufacturer_name"
        },
        { 
            // 版本号
            title: proxy.$t('item-bom.version_number'), 
            dataIndex: "name", 
            key: "detail"
        },
        { 
            // 用量
            title: proxy.$t('item-bom.dosage'), 
            dataIndex: "name", 
            key: "detail"
        },
        { 
            // 商品图片
            title: proxy.$t('item-bom.commodity_picture'), 
            dataIndex: "name", 
            key: "detail"
        },
        { 
            // 销售区域
            title: proxy.$t('item-bom.sales_area'), 
            dataIndex: "sales_area", 
            key: "sales_area"
        },
        { 
            // 创建时间
            title: proxy.$t('item-bom.create_time'), 
            dataIndex: "create_time", 
            key: "create_time"
        },
        {
            // 备注
            title: proxy.$t('item-bom.remark'), 
            dataIndex: "remark",
            key: "remark",
        },
    ]
    return result
})
const tableData = ref([
    // {
    //     name: "你好啊你好啊你好啊",
    //     manufacturer_name: "你好啊你好啊你好啊",
    //     sales_area: "你好啊你好啊你好啊",
    //     create_time: "1702363337",
    //     remark: "测试的东西是什么啊送达的傻大姐撒肯定撒看的艰苦撒旦就卡死进度加快撒可见度刷卡机的空间的健康撒可见度",
    // },
    // {
    //     name: "你好啊世界经济发",
    //     manufacturer_name: "你好啊世界经济发",
    //     sales_area: "你好啊世界经济发",
    //     create_time: "1702363337",
    //     remark: "ss",
    // },
    // {
    //     name: "你好啊sss",
    //     manufacturer_name: "你好啊sss",
    //     sales_area: "你好啊sss",
    //     create_time: "1702363337",
    //     remark: "ss",
    // },
])
// 分页
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: (total) => `${ proxy.$t('n.all_total') } ${total} ${ proxy.$t('in.total') }`
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

.set-width {
    width: 100px;
}
</style>