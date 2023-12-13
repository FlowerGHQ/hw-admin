<template>
    <!-- code编码-二级页面 -->
    <div class="fittings-two">
        <!-- 设变 -->
        <div class="change" @click="expandOrSollapse">
            <div class="change-top">
                <div class="left">
                    <img  class="left-img" src="@/assets/images/bom/frame.png" alt="">  
                    <span class="change-title">
                        {{ proxy.$t('item-bom.change_the_content') }}
                    </span>
                </div>
                <img class="right" src="@/assets/images/bom/up.png" v-if="isShow" />
                <img class="right" src="@/assets/images/bom/down.png" v-else />
            </div>
            <div class="change-table" v-if="isShow">
                <table class="my-table">
                    <thead class="my-th">
                        <tr>
                            <th v-for="th in changeTableColumn">{{ th.title }}</th>
                        </tr>
                    </thead>
                    <tr v-for="tr in tableDataChange">
                        <td v-for="td in changeTableColumn">
                            {{ tr?.[td.dataIndex] }}
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <!-- 配件列表 -->
        <div class="fittings-list">
            <div class="title">
                {{ $t('item-bom.accessories_list') }}
            </div>
            <a-table
                :row-key="(record) => record.id"
                :data-source="tableData"
                :columns="tableColumns"
                :scroll="{ x: true, }"
                :pagination="channelPagination"
                @change="handleTableChange"
            >
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
                    <span v-else-if="column.key === 'sales_area'/*销售区域*/">
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
                    <span v-else-if="column.key === 'classify'/*分类*/">
                        <!-- <a-tooltip>
                            <template #title>{{ text }}</template>
                            <div 
                                class="one-spils cursor" 
                                :style="{ width: text?.length > 6 ? 7 * 12 + 'px' : '' }"
                            >
                                {{ text }}
                            </div>
                        </a-tooltip> -->
                        <span class="to-classify" @click="toClassify">
                            {{ $t('item-bom.classify') }}
                        </span>
                    </span>
                    <span v-else-if="column.key === 'create_time'/*创建时间*/">
                        {{ $Util.timeFilter(text) }}
                    </span>
                    <span v-else-if="column.key === 'remark'/*备注*/">
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
    </div>
</template>

<script setup>

import { onMounted, ref, getCurrentInstance, computed } from 'vue';
import Core from "@/core";

const isShow = ref(true)
const expandOrSollapse = () => {
    isShow.value = !isShow.value;
}
const changeTableColumn = computed(()=>{
    let arr =  [
                    { 
                        title: proxy.$t('item-bom.ordinal'),
                        dataIndex: "order",
                        key: "order_number",
                    },
                    { 
                        title:  proxy.$t('item-bom.product_name'),
                        dataIndex: "name",
                        key: "name",
                    },
                    { 
                        title: proxy.$t('item-bom.commodity_code'),
                        dataIndex: "code",
                        key: "code",
                    },
                    { 
                        title: proxy.$t('item-bom.change_content'),
                        dataIndex: "content",
                        key: "content",
                    },
                ]
    return arr;
})

const tableDataChange = ref([
    { order:'1', name: 'hahah',code: '1212121212' ,content: 'jhdf' },
    { order:'2', name: 'hahah',code: '1212121212' ,content: 'jhdf' },
    { order:'3', name: 'hahah',code: '1212121212' ,content: 'jhdf' },
    { order:'4', name: 'hahah',code: '1212121212' ,content: 'jhdf' },
])

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
            dataIndex: "code", 
            key: "code"
        },
        { 
            // 厂家名称
            title: proxy.$t('item-bom.manufacturer_name'), 
            dataIndex: "manufacturer_name", 
            key: "manufacturer_name"
        },
        { 
            // 分类
            title: proxy.$t('item-bom.classify'), 
            dataIndex: "classify", 
            key: "classify"
        },
        { 
            // 用量
            title: proxy.$t('item-bom.dosage'), 
            dataIndex: "dosage", 
            key: "dosage"
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
const toClassify = () => {
    console.log('弹出分类弹窗');
}
</script>

<style lang="less" scoped>
.fittings-two {

    height: 100%;
    .change {
        width: 100%;
        .change-top {

            cursor: pointer;
            background-color: rgba(38, 171, 84, 0.1);
            width: 100%;
            height: 32px;
            display: flex;
            justify-content: space-between;
            padding: 0px 8px 0px 10px;
            box-sizing: border-box;
            align-items: center;
            .left {
                display: flex;
                .left-img {
                    height: 16px;
                    width: 16px;
                    display: inline-block;
                } 
                .change-title {
                    color: #26AB54;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 14px;
                    margin-left: 4px;
                }
            }

            .right {
                width: 16px;
                height: 16px;
            }
        }

    }


    .fittings-list {

        .title {
            margin:24px auto 10px;
            color:  #1D2129;
            font-size: 16px;
            font-weight: 600;
        }
    }
    .my-table {
        border: 1px solid #E2E2E2;
        background: #FFF;
        width: 100%;
        tr > td , th {
            padding: 10px 16px;
            border: 1px solid #E2E2E2;
            text-align: left;

        }

        tr > td {
            color: #1D2129;
        }
    }
}
.set-width {
    width: 100px;
}

.to-classify {
    color: #0061FF;
    cursor: pointer;
}
</style>