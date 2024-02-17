<template>
    <div class="payment_detail">
        <div class="panel-content">
            <a-table
                :columns="receiveColumns"
                :data-source="receiveList"
                :scroll="{ x: true }"
                :row-key="record => record.id"
                :loading="loading"
                :pagination="channelPagination"
                @change="handleTableChange"
            >
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.dataIndex === 'item'">
                        <div class="table-img">
                            <a-image :width="30" :height="30" :src="$Util.imageFilter(text ? text.logo : '', 2)" />
                            <a-tooltip
                                placement="top"
                                :title="text ? ($i18n.locale == 'zh' ? text.name : text.name_en) : '-'"
                            >
                                <a-button type="link" @click="routerChange('detail', text)" style="margin-left: 6px">
                                    {{ text ? ($i18n.locale == 'zh' ? text.name : text.name_en) : '-' }}
                                </a-button>
                            </a-tooltip>
                        </div>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance, defineExpose } from 'vue';
import Core from '@/core';

const loginOrgId = Core.Data.getOrgId();
const loginOrgType = Core.Data.getOrgType();
const PAY_STATUS = Core.Const.PURCHASE.PAY_STATUS;

const { proxy } = getCurrentInstance();
const emits = defineEmits(['submit']);
const props = defineProps({
    target_id: {
        type: [Number, String],
    },
    // 订单详情
    order_detail: {
        type: Object,
    },
    // 订单编号
    sn: {
        type: String,
    },
});
/*== 计算属性 ==*/
const receiveColumns = computed(() => {
    let columns = [
        { title: proxy.$t('i.item'), dataIndex: 'item' },
        { title: proxy.$t('i.code'), dataIndex: ['item', 'code'] },
        { title: proxy.$t('i.deliver_amount'), dataIndex: 'amount' },
        { title: proxy.$t('p.receiving_time'), dataIndex: 'create_time', key: 'time' },
    ];
    return columns;
});
const loading = ref(false);
const receiveList = ref([]); // 收货明细列表
// 分页数据
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: total => `${proxy.$t('p.total')} ${total} ${proxy.$t('p.strip')}`,
});

onMounted(() => {
    getReceiveDetailList();
});
/*== FETCH start==*/
// 获取 采购单 payList列表
const getReceiveDetailList = (params = {}) => {
    loading.value = true;
    Core.Api.Purchase.itemList({
        order_id: props.target_id,
        page: 0,
    })
        .then(res => {
            receiveList.value = res.list;
        })
        .catch(err => {
            console.log('getPurchaseInfo err', err);
        })
        .finally(() => {
            loading.value = false;
        });
};
/*== FETCH end==*/

/*== Methods start==*/
// 分页事件
const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...channelPagination.value };
    pager.current = pagination.current;
    if (pagination.pageSize !== channelPagination.value.pageSize) {
        pager.current = 1;
        pager.pageSize = pagination.pageSize;
    }
    channelPagination.value = pager;
    getReceiveDetailList({
        page_size: channelPagination.value.pageSize,
        page: channelPagination.value.current,
    });
};
// 路由跳转
const routerChange = (type, item = {}) => {
    let routeUrl = '';
    switch (type) {
        case 'detail': // 详情
            routeUrl = this.$router.resolve({
                path: this.$auth('ADMIN') ? '/item/item-detail' : '/purchase/item-display',
                query: { id: item.id },
            });
            window.open(routeUrl.href, '_blank');
            break;
    }
};
defineExpose({
    getReceiveDetailList,
});
</script>

<style lang="less" scoped>
.payment_detail {
}
</style>
