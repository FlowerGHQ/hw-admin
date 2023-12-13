<template>
    <div class="fittings-three">
        <div class="upload">
        </div>
        <div class="table-container">
            <div class="title">
                {{ $t('item-bom.accessories_list') }}
            </div>
            <a-table
                :row-key="(record) => record.id"
                :data-source="tableData"
                :columns="tableColumns"
                :scroll="{ x: true, }"
                :pagination="channelPagination"
                :loading="loading"
                @change="handleTableChange"
            >
                <template #headerCell="{title, column}">
                    <div class="table-title">{{ title }}</div>
                </template>
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
                <template #emptyText>
                    <div class="empty-add-item-container">
                        <img :src="emptyImage" alt="">
                        <div class="empty-add-item-text-wrap">
                            <div class="empty-add-item-tip">
                                {{ $t('item-bom.explosion_diagram') }}
                            </div>                            
                            <div class="disable-add-btn" @click="onAddFittings" type="primary">
                                {{ $t('item-bom.add_fittings') }}
                            </div>
                        </div>
                    </div>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed } from 'vue';
import Core from "@/core";
const emptyImage = "http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/12516f00dce1e02da63e405e578c65ea6c82e4c4f5e8c750dc64afa1c1ca7450.png"

const { proxy } = getCurrentInstance();
const loading = ref(false)

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
    // getTableDataFetch()
})
/* Fetch start*/
// 获取表格list
const getTableDataFetch = (parmas = {}) => {
    loading.value = true
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
        loading.value = false
    }).catch(err => {
        console.log("getTableDataFetch", err);
        loading.value = false
    })
}
/* Fetch end*/

/* methods start*/
// 添加配件
const onAddFittings = () => {
    console.log("添加配件");
}
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
.fittings-three {
    .upload {
        width: 100%;
        min-height: 158px;
        border: 1px solid  #E2E2E2;
        padding: 23px 20px;
    }
    .table-container {
        .title {
            color: #1D2129;
            font-family: PingFang SC;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .table-title {
            color: #1D2129;
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 500;
        }

        .empty-add-item-container {
            margin-top: 20px;
            margin-bottom: 10px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            > img {
                width: 143px;
                height: 78px;
            }
            .empty-add-item-text-wrap {
                margin-left: 16px;
                .empty-add-item-tip {
                    color: #333;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    margin-bottom: 10px;
                }
                .disable-add-btn {
                    height: 32px;
                    border-radius: 4px;
                    opacity: 0.39;
                    background: #0061FF;
                    padding: 4px 15px;
                    box-sizing: border-box;
                    .fcc();
                    color: #FFF;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    cursor: not-allowed;
                }
            }
        }

    }
}
</style>