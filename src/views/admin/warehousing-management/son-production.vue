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
import { ref } from 'vue';
import Core from '@/core'
import sonTable from './components/SonTable.vue';
const STATUS = Core.Const.WAREHOUSING_MANAGEMENT.STATUS;

const detailMsg = ref({});
</script>

<style lang="less" scoped>
.son-production {
}
</style>
