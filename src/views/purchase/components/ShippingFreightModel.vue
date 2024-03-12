<template>
    <div class="shipping-freight">
        <a-modal v-model:visible="visible" :title="title" @cancel="handleCancel">
            <div class="shipping">
                <div class="key">{{ $t('p.estimated_shipping_data') }}:</div>
                <div class="value">
                    <a-date-picker class="w-100" v-model:value="search_params.estimated_shipping_data" />
                </div>
            </div>
            <div class="freight m-t-20">
                <div class="key">{{ $t('p.freight') }}:</div>
                <div class="value">
                    <a-input
                        v-model:value="search_params.freight"
                        :placeholder="$t('common.please_enter') + $t('distributor.actual_freight_cost')"
                    />
                </div>
            </div>

            <template #footer>
                <div class="footer">
                    <a-button @click="handleCancel">{{ $t('common.cancel') }}</a-button>
                    <a-button type="primary" @click="handleOk">{{ $t('common.confirm') }}</a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue';
import Core from '@/core';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '',
    },
});

const search_params = ref({
    estimated_shipping_data: '',
    freight: '',
});

const emits = defineEmits(['update:visible', 'ok', 'cancel']);

/* fetch start*/
/* fetch end*/

/* methods start*/
const handleOk = () => {
    console.log('search_params.value', search_params.value);
    emits('ok', search_params.value);
};

const handleCancel = () => {
    emits('update:visible', false);
};
/* methods end*/

onMounted(() => {
    search_params.value.estimated_shipping_data = dayjs.unix('1710153028');
});
</script>

<style lang="less" scoped>
.shipping-freight {
}

.shipping,
.freight {
    display: flex;
    align-items: center;
    .key {
        margin-right: 10px;
        width: 100px;
        text-align: right;
    }
    .value {
        flex: 1;
    }
}
.w-100 {
    width: 100%;
}
.footer {
    width: 100%;
    text-align: center;
}
</style>
