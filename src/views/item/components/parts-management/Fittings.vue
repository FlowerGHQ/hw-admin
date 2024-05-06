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
                <span v-if="column.key === 'name' /*商品名称*/">
                    <a-tooltip>
                        <template #title>{{ lang === 'zh' ? text : record?.name_en || '-' }}</template>
                        <div
                            class="one-spils cursor"
                            :style="{
                                width: text?.length > 11 ? 10 + 'rem' : '',
                            }"
                        >
                            {{ lang === 'zh' ? text : record?.name_en || '-' }}
                        </div>
                    </a-tooltip>
                </span>
                <span v-else-if="column.key === 'sale_area' /*销售区域*/">
                    <a-tooltip placement="topLeft">
                        <template #title>
                            <template v-if="text.join(',')?.length !== 0">
                                <span>
                                    {{ text.join(',') }}
                                </span>
                            </template>
                            <template v-else> - </template>
                        </template>
                        <div
                            class="one-spils cursor"
                            :style="{
                                width: text.join(',')?.length > 11 ? 10 + 'rem' : '',
                            }"
                        >
                            <template v-if="record.sale_area?.length !== 0">
                                <span>
                                    {{ text.join(',') }}
                                </span>
                            </template>
                            <template v-else> - </template>
                        </div>
                    </a-tooltip>
                </span>
                <span v-else-if="column.key === 'item_category_name' /*分类*/">
                    <div class="classify-box">
                        {{ lang === 'zh' ? text : record?.item_category_name_en || '-' }}
                    </div>
                </span>
                <template v-else-if="column.dataIndex === 'fob_eur'">
                    {{ `€ ${$Util.countFilter(record.fob_eur)}` }}
                </template>
                <template v-else-if="column.dataIndex === 'fob_usd'">
                    {{ `$ ${$Util.countFilter(record.fob_usd)}` }}
                </template>
                <template v-else-if="column.key === 'operation' /*操作*/">
                    <button class="edit" @click="handleEdit(record)">
                        {{ $t('common.edit') }}
                    </button>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, watch } from 'vue';
import Core from '@/core';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
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
            dataIndex: 'name',
            key: 'name',
            width: '160px',
        },
        {
            // 商品编码
            title: proxy.$t('item-bom.commodity_code'),
            dataIndex: 'code',
            key: 'code',
        },
        {
            // 销售区域
            title: proxy.$t('item-bom.sales_area'),
            dataIndex: 'sale_area',
            key: 'sale_area',
        },
        {
            // 最小起购量
            title: proxy.$t('d.minimum_purchase'),
            dataIndex: 'min_purchase_amount',
            key: 'min_purchase_amount',
        },
        {
            title: 'FOB(EUR)',
            key: 'money',
            dataIndex: 'fob_eur',
            unit: '€',
            width: 160,
        },
        {
            title: 'FOB(USD)',
            key: 'money',
            dataIndex: 'fob_usd',
            unit: '$',
            width: 160,
        },
        {
            // 分组
            title: proxy.$t('item-bom.category'),
            dataIndex: 'item_category_name',
            key: 'item_category_name',
        },
        {
            title: proxy.$t('common.operations'),
            dataIndex: 'operation',
            key: 'operation',
        },
    ];
    return result;
});
const tableData = ref([
    // {
    //     name: "你好啊你好啊你好啊",
    //     manufacturer_name: "你好啊你好啊你好啊",
    //     sale_area: "你好啊你好啊你好啊",
    //     create_time: "1702363337",
    //     remark: "测试的东西是什么啊送达的傻大姐撒肯定撒看的艰苦撒旦就卡死进度加快撒可见度刷卡机的空间的健康撒可见度",
    // },
    // {
    //     name: "你好啊世界经济发",
    //     manufacturer_name: "你好啊世界经济发",
    //     sale_area: "你好啊世界经济发",
    //     create_time: "1702363337",
    //     remark: "ss",
    // },
    // {
    //     name: "你好啊sss",
    //     manufacturer_name: "你好啊sss",
    //     sale_area: "你好啊sss",
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
const lang = computed(() => {
    // ==='zh'?'country':'country_en'
    return proxy.$store.state.lang;
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
// 编辑跳转
const handleEdit = item => {
    router.push({
        path: '/item/item-edit',
        query: {
            id: item.id,
            set_id: 0, // 配件默认单规格
            edit: true,
        },
    });
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

    Core.Api.ITEM_BOM.ManagerListParts(obj)
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
.edit {
    font-weight: 400;
    line-height: 19.6px;
    color: #0061ff;
}
</style>
