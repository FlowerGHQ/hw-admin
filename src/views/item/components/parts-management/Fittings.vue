<template>
    <div class="fittings">
        <div class="title">
            {{ $t('item-bom.accessories_list') }}
        </div>
        <a-table
            :row-key="record => record.id"
            :data-source="tableData"
            :columns="tableColumns"
            :scroll="{ x: true }"
            :pagination="channelPagination"
            :loading="loading"
            @change="handleTableChange"
        >
            <template #headerCell="{ title, column }">
                <div class="table-title">{{ title }}</div>
            </template>
            <template #bodyCell="{ column, text, record }">
                <span v-if="column.key === 'sync_name' /*商品名称*/">
                    <a-tooltip>
                        <template #title>{{ text }}</template>
                        <div
                            class="one-spils cursor"
                            :style="{
                                width: text?.length > 6 ? 7 * 12 + 'px' : '',
                            }"
                        >
                            {{ text }}
                        </div>
                    </a-tooltip>
                </span>
                <span v-if="column.key === 'sales_area' /*销售区域*/">
                    <a-tooltip>
                        <template #title>
                            {{ salesArea(record.sales_area_list) }}
                        </template>
                        <div class="one-spils cursor">
                            {{ salesArea(record.sales_area_list) }}
                        </div>
                    </a-tooltip>
                </span>
                <span v-if="column.key === 'version'">
                    {{ record?.bom?.version || '-' }}
                </span>
                <span v-if="column.key === 'effective_time' /*创建时间*/">
                    {{ $Util.timeFilter(text, 3) }}
                </span>
                <span v-if="column.key === 'comment' /*备注*/">
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
import { onMounted, ref, getCurrentInstance, computed, watch } from 'vue';
import Core from '@/core';
import { useI18n } from 'vue-i18n';
const $i18n = useI18n();
const locale = $i18n.locale;
const props = defineProps({
    searchParams: {
        type: Object,
        default: () => {},
    },
    activeObj: {
        type: Object,
        default: () => {},
    },
});
const parmas = ref({});
const { proxy } = getCurrentInstance();
const loading = ref(false);
const tableColumns = computed(() => {
    const result = [
        {
            // 商品名称
            title: proxy.$t('item-bom.product_name'),
            dataIndex: 'sync_name',
            key: 'sync_name',
        },
        {
            // 商品编码
            title: proxy.$t('item-bom.commodity_code'),
            dataIndex: 'sync_id',
            key: 'sync_id',
        },
        {
            // 版本号
            title: proxy.$t('item-bom.version_number'),
            dataIndex: 'version',
            key: 'version',
        },
        {
            // 用量
            title: proxy.$t('item-bom.dosage'),
            dataIndex: 'amount',
            key: 'amount',
        },
        // {
        //     // 销售区域
        //     title: proxy.$t('item-bom.sales_area'),
        //     dataIndex: 'sales_area',
        //     key: 'sales_area',
        // },
        {
            // 创建时间
            title: proxy.$t('item-bom.create_time'),
            dataIndex: 'effective_time',
            key: 'effective_time',
        },
        {
            // 备注
            title: proxy.$t('item-bom.remark'),
            dataIndex: 'comment',
            key: 'comment',
        },
    ];
    return result;
});
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
]);
// 分页
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: total => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`,
});
// 销售区域
const salesArea = arr => {
    let result = [];
    arr.forEach(item => {
        if (locale.value === 'zh') {
            result.push(item.country);
        } else if (locale.value === 'en') {
            result.push(item.country_en);
        }
    });
    return result.length > 0 ? result.join(',') : '-';
};

onMounted(() => {
    // getTableDataFetch();
});
/* Fetch start*/
// 获取表格list
const getTableDataFetch = (parmas = {}) => {
    loading.value = true;
    let obj = {
        page: channelPagination.value.current,
        page_size: channelPagination.value.pageSize,
        ...parmas,
    };

    Core.Api.ITEM_BOM.partsList(obj)
        .then(res => {
            channelPagination.value.total = res.count;
            tableData.value = res.list;
            loading.value = false;
        })
        .catch(err => {
            console.log('getTableDataFetch', err);
            loading.value = false;
        });
};
/* Fetch end*/

/* methods start*/
// 分页事件
const handleTableChange = (pagination, filters, sorter) => {
    channelPagination.value.current = pagination.current;
    channelPagination.value.pageSize = pagination.pageSize;
    console.log(parmas.value);
    getTableDataFetch(parmas.value);
};
/* methods end*/
watch(
    [() => props.searchParams, () => props.activeObj],
    val => {
        console.log('val-----------------------------------------', val);
        parmas.value = {
            sync_id: val[1].sync_id,
            name: val[0].name,
            code_list: val[0].code_list,
        };
        channelPagination.value.current = 1;
        channelPagination.value.pageSize = 20;

        getTableDataFetch(parmas.value);
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>

<style lang="less" scoped>
.fittings {
    width: 100%;
    .title {
        color: #1d2129;
        font-family: PingFang SC;
        font-size: 16px;
        margin-bottom: 10px;
    }
    .table-title {
        color: #1d2129;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 500;
    }
}

.set-width {
    width: 100px;
}
</style>
