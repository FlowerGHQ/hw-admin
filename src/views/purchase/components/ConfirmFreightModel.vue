<template>
    <div class="confirm-freight">
        <a-modal v-model:visible="visible" :title="title" @cancel="handleCancel">
            <div class="audit">
                <div class="content level-search-row">
                    <div class="estimated-shipping-data search-col">
                        <div class="key w-120 t-a-r">{{ $t('p.estimated_shipping_data') }}：</div>
                        <div class="value flex-1">1312414124124</div>
                    </div>
                    <div class="freight search-col">
                        <div class="key w-120 t-a-r">{{ $t('p.freight') }}：</div>
                        <div class="value flex-1">
                            <span>1000</span>
                            <span>unit</span>
                        </div>
                    </div>
                </div>
                <div class="input-operation horizontal-search-row">
                    <div class="audit-result search-col required">
                        <div class="key w-120 t-a-r">{{ $t('distributor.audit_result') }}：</div>
                        <div class="value flex-1">
                            <a-radio-group v-model:value="search_params.result">
                                <a-radio v-for="item in AUDIT_RESULT_MAP_ARR" :key="item.key" :value="item.key">
                                    {{ $t(`${item.t}`) }}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                    <div class="reason search-col required d-a-s">
                        <div class="key w-120 t-a-r">{{ $t('distributor.no_reason') }}：</div>
                        <div class="value flex-1">
                            <a-textarea v-model:value="search_params.remark" show-count :maxlength="1000" />
                        </div>
                    </div>
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
const AUDIT_RESULT_MAP_ARR = Core.Const.DISTRIBUTOR.AUDIT_RESULT_MAP_ARR;

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
    result: undefined,
    remark: undefined,
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

onMounted(() => {});
</script>

<style lang="less" scoped>
.confirm-freight {
}
.audit {
    .content {
    }
    .input-operation {
    }

    .w-120 {
        width: 120px;
    }
    .d-f-a {
        display: flex;
        align-items: center;
    }
    .d-a-s {
        align-items: flex-start;
    }
}

.footer {
    width: 100%;
    text-align: center;
}
</style>
