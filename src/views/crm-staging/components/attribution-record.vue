<template>
    <div class="attribution-record">
        <div class="title">数据来源</div>
        <div class="descriptions">
            <div class="descriptions-item" v-for="(item, index) in sourceListRender" :key="index">
                <span class="descriptions-item-label" :style="{ width: `${item.labelWidth}px` }"
                    >{{ item.label }}：</span
                >
                <span class="descriptions-item-value">{{ item.value }}</span>
            </div>
        </div>
        <div class="title">归属记录</div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" @change="handleTableChange">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'store_user_name'">
                    <div class="person">
                        <img class="person-img" :src="record.store_user_avatar || Static.defaultAvatar" />
                        <span class="person-name">{{ record.store_user_name || '-' }}</span>
                        <span class="person-id">{{ record.store_user_employee_no || '-' }}</span>
                    </div>
                </template>
                <template v-if="column.key === 'operator_name'">
                    <div class="person">
                        <img class="person-img" :src="record.operator_avatar || Static.defaultAvatar" />
                        <span class="person-name">{{ record.operator_name || '-' }}</span>
                        <span class="person-id">{{ record.operator_employee_no || '-' }}</span>
                    </div>
                </template>
                <template v-if="column.key === 'create_time'">
                    <span>{{ Core.Util.timeFilter(record.create_time, 1) }}</span>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup>
import Core from '@/core';
import Util from '../common';
import Static from '../static';
import { computed, reactive, ref, watch, inject } from 'vue';

const userId = inject('userId');

const getData = () => {
    getBindList({ current: 1 });
    getUserDetail();
};
const $emit = defineEmits(['getCount']);
const columns = [
    {
        title: '归属大区',
        key: 'group_name',
        dataIndex: 'group_name',
    },
    {
        title: '归属城市',
        key: 'city',
        dataIndex: 'city',
    },
    {
        title: '归属门店',
        key: 'store_name',
        dataIndex: 'store_name',
    },
    {
        title: '体验官',
        key: 'store_user_name',
        dataIndex: 'store_user_name',
    },
    {
        title: '分配人',
        key: 'operator_name',
        dataIndex: 'operator_name',
    },
    {
        title: '分配日期',
        key: 'create_time',
        dataIndex: 'create_time',
    },
];

const data = ref([]);

const userMes = reactive({});
const sourceList = [
    { label: '留资城市', value: '--', labelWidth: 84, prop: 'source_city' },
    { label: '营业时间', value: '--', labelWidth: 70, prop: '' },
    // { label: '信息来源', value: '--', labelWidth: 70, prop: 'source_type' },
    { label: '创建人', value: '--', labelWidth: 84, prop: 'create_user_name' },
    { label: '所属大区', value: '--', labelWidth: 70, prop: 'store_group_name' },
    { label: '所属城市', value: '--', labelWidth: 84, prop: 'store_city' },
    { label: '所属门店', value: '--', labelWidth: 70, prop: 'store_name' },
    { label: '绑定体验官', value: '--', labelWidth: 84, prop: 'store_user_name' },
];
const pagination = reactive({
    pageSize: 10,
    current: 1,
    total: 0,
    total_page: 0,
});
const sourceListRender = computed(() => {
    if (!userMes) return;
    return sourceList.map(item => {
        if (item.label === '营业时间') {
            item.value = '未设置';
        } else if (item.label === '信息来源') {
            item.value = userMes[item.prop] ? Util.sourceTypeFilter(userMes[item.prop]) : '--';
        } else {
            item.value = userMes[item.prop] ? userMes[item.prop] : '--';
        }
        return item;
    });
});
const handleTableChange = page => {
    Object.assign(pagination, {
        current: page?.current,
        pageSize: page?.pageSize,
    });
    getBindList({ current: pagination.current });
};
const detail = id => {
    console.log(id);
};
const getUserDetail = () => {
    if (!userId.value) return;
    Core.Api.CustomService.detail({ id: userId.value })
        .then(res => {
            Object.assign(userMes, res);
            Core.Logger.success('getUserDetail', userMes);
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};
const getBindList = (params = {}) => {
    if (!userId.value) return;
    const obj = {
        customer_id: userId.value,
        page: params.current,
        page_size: pagination.pageSize,
    };
    Core.Logger.success('params', obj);
    Core.Api.CustomService.bindList({ ...obj })
        .then(res => {
            Core.Logger.success('getTaskNum', res);
            pagination.total = res.count;
            pagination.total_page = Math.ceil(pagination.total / pagination.pageSize);
            data.value = res.list;
            $emit('getCount', '3', res.count);
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};
defineExpose({ getData });
</script>

<style lang="less" scoped>
.attribution-record {
    .title {
        color: #1d2129;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 12px;
    }
    .descriptions {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 8px;
        .descriptions-item {
            margin-bottom: 16px;
            width: calc((100% - 15px) / 2);
            &:nth-child(2n + 1) {
                margin-right: 15px;
            }
            &-label,
            &-value {
                display: inline-block;
            }
            &-label {
                color: #86909c;
                text-align: right;
                font-size: 14px;
            }
            &-value {
                color: #1d2129;
                font-size: 14px;
            }
        }
    }
    .person {
        display: flex;
        align-items: center;
        &-img {
            margin-right: 8px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }
        &-name {
            margin-right: 8px;
            color: #1d2129;
            font-size: 14px;
        }
        &-id {
            color: #1d2129;
            font-size: 14px;
        }
    }
}
</style>
