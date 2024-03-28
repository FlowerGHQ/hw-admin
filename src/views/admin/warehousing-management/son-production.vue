<template>
    <div class="son-production list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('warehousing-management.product_item_detail') }}</div>
        </div>
        <div class="desc-container">
            <a-row class="desc-detail m-t-0">
                <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                    <span class="key">{{ $t('warehousing-management.product_sync_id') }}：</span>
                    <span class="value">{{ detailMsg.sync_id || '-' }}</span>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                    <span class="key">{{ $t('warehousing-management.product_code') }}：</span>
                    <span class="value">{{ detailMsg.code || '-' }}</span>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                    <span class="key">{{ $t('warehousing-management.product_name') }}：</span>
                    <span class="value">{{ detailMsg.name || '-' }}</span>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                    <span class="key">{{ $t('warehousing-management.product_amount') }}：</span>
                    <span class="value">{{ detailMsg.amount || '-' }}</span>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                    <span class="key">{{ $t('warehousing-management.product_status') }}：</span>
                    <span class="value">
                        {{ $t($Util.Common.returnTranslation(detailMsg.status, STATUS)) }}
                    </span>
                </a-col>
            </a-row>
        </div>

        <sonTable></sonTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Core from '@/core';
import sonTable from './components/SonTable.vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

const STATUS = Core.Const.WAREHOUSING_MANAGEMENT.STATUS;

// 响应常量
const detailMsg = ref({});

onMounted(() => {
    getDetailFetch()
})

/* fetch start */
// 获取订单详情
const getDetailFetch = (params = {}) => {
    const obj = {
        id: route.query?.id,
        ...params,
    };

    Core.Api.WarehousingManagement.ProductionOrderDetail(obj)
        .then(res => {
            console.log('获取订单详情 res', res);
            detailMsg.value = res.detail
        })
        .catch(err => {
            console.log('获取订单详情 err', err);
        });
};
/* fetch end */
</script>

<style lang="less" scoped>
.son-production {
}
</style>
