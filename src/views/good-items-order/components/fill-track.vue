<template>
    <a-button type="link" class="fill-track" @click="isShow">{{
        detail?.waybill_uid !== 0 && detail?.waybill_uid !== ''
            ? $t('item_order.modify_courier_number')
            : $t('item_order.fill_courier_number')
    }}</a-button>
    <!-- 填写快递编号 -->
    <a-modal
        v-model:visible="refundVisible"
        :title="
            detail?.waybill_uid !== 0 && detail?.waybill_uid !== ''
                ? $t('item_order.modify_courier_number')
                : $t('item_order.fill_courier_number')
        "
        @cancel="refundHandleCancel"
        @ok="refundHandleOk"
    >
        <div class="title">{{ $t('item_order.receiving_information') }}</div>
        <div class="content">
            <div class="form-item" v-for="(item, index) in list" :key="index + '#'">
                <div class="key">{{ $t(item.title) }}:</div>
                <div class="value">{{ detail[item.value] }}</div>
            </div>
            <div class="form-item required">
                <div class="key track">{{ $t('af.courier_number') }}:</div>
                <div class="value">
                    <a-input v-model:value="updateObj.uid" :placeholder="$t('item_order.fill_tracking_number')" />
                </div>
            </div>
            <div class="form-item required">
                <div class="key track">{{ $t('af.courier') }}:</div>
                <div class="value">
                    <a-input
                        v-model:value="updateObj.company"
                        :placeholder="$t('item_order.fill_name_courier_company')"
                    />
                </div>
            </div>
        </div>
        <template #footer>
            <a-button @click="refundHandleCancel"> {{ $t('def.cancel') }} </a-button>
            <a-button type="primary" @click="refundHandleOk">
                {{ $t('def.submit') }}
            </a-button>
        </template>
    </a-modal>
</template>

<script setup>
import Core from '@/core';
import TimeSearch from '@/components/common/TimeSearch.vue';
import { computed, getCurrentInstance, reactive, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const refundVisible = ref(false);
const list = ref([
    { title: 'wb.receiver', value: 'to_name', key: 'to_name' },
    { title: 'crm_c.province', value: 'to_province', key: 'to_province' },
    { title: 'crm_c.city', value: 'to_city', key: 'to_city' },
    { title: 'ad.specific_address', value: 'to_address', key: 'to_address' },
]);
const { proxy } = getCurrentInstance();
const props = defineProps({
    detail: {
        type: Object,
    },
});
const updateObj = ref({
    id: '', // 物流id
    uid: '', // 快递单号
    target_id: 0, // 好物订单id
    company: '', // 快递公司
});
watchEffect(() => {
    updateObj.value.id = props.detail?.waybill_id;
    updateObj.value.uid = props.detail?.waybill_uid;
    updateObj.value.target_id = props.detail?.id;
    updateObj.value.company = props.detail?.waybill_company;
});
// 定义要发送的emit事件
const emit = defineEmits(['changeType']);

const refundHandleOk = () => {
    if (!updateObj.value.uid) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    } else if (!updateObj.value.company) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    }
    refundVisible.value = false;
    Core.Api.GoodItemsOrder.updateTrackingNumber({ ...updateObj.value })
        .then(res => {
            proxy.$message.success(proxy.$t('p.shipped'));
        })
        .catch(err => {
            console.log('refundHandleOk err:', err);
        })
        .finally(() => {
            emit('changeType');
        });
};
const refundHandleCancel = () => {
    refundVisible.value = false;
};

const isShow = () => {
    refundVisible.value = true;
};
</script>

<style lang="less" scoped>
.fill-track {
    margin-left: 10px;
}
.title {
    color: var(--color-text-1, #1d2129);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px; /* 150% */
}

.content {
    margin-top: 16px;
    .form-item {
        display: flex;
        align-items: center;

        .key {
            width: 70px;
            height: 20px;
            color: var(--color-text-3, #86909c);
            font-size: 14px;
            font-weight: 400;
            text-align: right;
        }
        .track {
            color: var(--color-text-1, #1d2129);
            text-align: right;
            font-weight: 400;
        }
        .value {
            color: var(--color-text-1, #1d2129);
            font-size: 14px;
            font-weight: 500;
            margin-left: 10px;
        }
    }
}
</style>
