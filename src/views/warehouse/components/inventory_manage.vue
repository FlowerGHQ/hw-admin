<template>
    <div class="inventory_manage_style">
        <div class="left">
            <div class="btn">
                <a-button>新增类目</a-button>
                <a-button>编辑</a-button>
                <a-button>删除</a-button>
            </div>
            <div class="meun">
                <eos-tree-meun :gData="gDatas" />
            </div>
        </div>
        <div class="right">
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :row-key="record => record.id"
                :pagination="channelPagination"
                @change="handleTableChange"
            >
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'target_name'">
                        <div style="display: flex">
                            <div>
                                <img
                                    style="width: 60px"
                                    src="https://img03.sogoucdn.com/app/a/201025/b57f8208c4a3274b63d6a9108bc33573"
                                    alt="1"
                                />
                            </div>
                            <div style="margin-left: 10px">
                                <div>{{ text }}</div>
                                <div>颜色：{{}}</div>
                                <div>库存: {{ record.amount }}</div>
                            </div>
                        </div>
                    </template>
                    <template v-if="column.key === 'uid'">
                        {{ record.uid || '-' }}
                    </template>
                    <!-- 创建时间 -->
                    <template v-if="column.key === 'create_time'">
                        {{ $Util.timeFilter(text) }}
                    </template>

                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="handleUpdateShow(record)"
                            ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                        >
                        <a-button type="link" @click="handleDetailShow(record)"
                            ><i class="icon i_detail" />{{ $t('n.detail') }}</a-button
                        >
                        <a-button type="link" @click="handleDelete(record.id)"
                            ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                        >
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import Core from '@/core';
import eosTreeMeun from '@/components/common/eos-tree-meun.vue';

const route = useRoute();
const { proxy } = getCurrentInstance();

const tableData = ref([]);
const tableColumns = computed(() => {
    let tableColumns = [
        {
            title: `${proxy.$t('wa.name')}`, // 所存商品
            dataIndex: 'target_name',
            key: 'target_name',
        },
        {
            title: `${proxy.$t('wa.uid')}`, // 库位置号
            dataIndex: 'uid',
            key: 'uid',
            align: 'center',
        },
        {
            title: `${proxy.$t('wa.code')}`, // 所存商品编码
            dataIndex: 'target_code',
            key: 'target_code',
            align: 'center',
        },
        {
            title: `${proxy.$t('n.time')}`,
            dataIndex: 'create_time', // 创建时间
            key: 'create_time',
            align: 'center',
        },
        {
            title: `${proxy.$t('def.operate')}`,
            key: 'operation',
            fixed: 'right',
            align: 'center',
        },
    ];
    return tableColumns;
});
// 分页参数
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['10', '20', '30', '40'],
    pageSize: 10,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: total => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`,
});

const gDatas = ref([
    {
        title: '一级目录',
        key: '1',
        children: [
            {
                title: 'parent 1-0',
                key: '0-0-0',
                children: [
                    {
                        title: 'leaf',
                        key: '0-0-0-0',
                    },
                    {
                        title: 'leaf',
                        key: '0-0-0-1',
                    },
                    {
                        title: 'leaf',
                        key: '0-0-0-2',
                    },
                ],
            },
            {
                title: 'parent 1-1',
                key: '0-0-1',
                children: [
                    {
                        title: 'leaf',
                        key: '0-0-1-0',
                        children: [
                            {
                                title: 'leaf1',
                                key: '0-0-1-01',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        title: '一级目录',
        key: '2',
        children: [
            {
                title: 'parent 1-0',
                key: '0-0-0',
                children: [
                    {
                        title: 'leaf',
                        key: '0-0-0-0',
                    },
                    {
                        title: 'leaf',
                        key: '0-0-0-1',
                    },
                    {
                        title: 'leaf',
                        key: '0-0-0-2',
                    },
                ],
            },
            {
                title: 'parent 1-1',
                key: '0-0-1',
                children: [
                    {
                        title: 'leaf',
                        key: '0-0-1-0',
                    },
                ],
            },
        ],
    },
]);

/* 初始化 */
onMounted(() => {
    getTableData();
});
/* Fetch */
const getTableData = (params = {}) => {
    Core.Api.WarehouseLocation.list({
        warehouse_id: Number(route.query.id),
        ...params,
    })
        .then(res => {
            channelPagination.value.total = res.count;
            tableData.value = res.list;
        })
        .catch(err => {
            console.log('getTableData err', err);
        });
};

/*methods*/
// 分页的操作
const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...channelPagination.value };
    pager.current = pagination.current;
    if (pagination.pageSize !== channelPagination.value.pageSize) {
        pager.current = 1;
        pager.pageSize = pagination.pageSize;
    }
    channelPagination.value = pager;
    getTableData({
        page: channelPagination.value.current,
        page_size: channelPagination.value.pageSize,
    });
};
</script>

<style lang="less" scoped>
.inventory_manage_style {
    margin-top: 14px;
    display: flex;
    .left {
        width: 280px;
        border-right: 1px solid #eff2f4;
        .meun {
            margin-top: 15px;
        }
    }
    .right {
        width: calc(100% - 280px);
        padding-left: 20px;
    }
}
</style>
