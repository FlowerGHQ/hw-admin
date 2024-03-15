<template>
    <div class="shipping-freight">
        <a-modal v-model:visible="visible" :title="title" @cancel="handleCancel">
            <div class="shipping">
                <div class="key">{{ $t('p.estimated_shipping_data') }}:</div>
                <div class="value">
                    <a-date-picker class="w-100" v-model:value="search_params.shipping_time_estimated" />
                </div>
            </div>
            <div class="freight m-t-20">
                <div class="key">{{ $t('p.freight') }}:</div>
                <div class="value">
                    <a-input-number
                        class="w-100"
                        v-model:value="search_params.freight"
                        :placeholder="$t('common.please_enter') + $t('distributor.actual_freight_cost')"
                        :min="0"
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
import { ref, onMounted, getCurrentInstance } from 'vue';
import Core from '@/core';
const FREIGHT_STATUS = Core.Const.DISTRIBUTOR.FREIGHT_STATUS;

const { proxy } = getCurrentInstance();
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '',
    },
    detailRecord: {
        type: Object,
        default: () => {},
    },
});

const search_params = ref({
    shipping_time_estimated: '',
    freight: '',
});

const emits = defineEmits(['update:visible', 'ok', 'cancel']);

/* fetch start*/
// 确认和修改运费和船期
const saveFetch = (params = {}) => {
    const obj = {        
        target_id: props.detailRecord.id, // 订单id
        content: {
            shipping_time_estimated: dayjs(search_params.value.shipping_time_estimated).startOf('day').unix(), // 预计船期
            freight: Core.Util.countFilter(search_params.value.freight, 100, 2, true), //运费（单位：分）
        }, //审核内容
        ...params,
    };

    // 判断 待填写和以拒绝不需要填写审核记录id
    if (
        !Core.Util.Common.returnTypeBool(props.detailRecord.freight_status, [
            FREIGHT_STATUS.TO_BE_FILLED_IN,
            FREIGHT_STATUS.REJECTED,
        ])
    ) {
        obj.id = props.detailRecord.freight_audit_record_id // 审核记录id（audit_record_id）
    }

    console.log('obj', obj);
    Core.Api.ShippingDateFreight.add(obj)
        .then(res => {
            console.log('确认和修改运费和船期 res', res);
            proxy.$message.success('提交成功');
            handleCancel();
            emits('ok', search_params.value);
        })
        .catch(err => {
            console.log('确认和修改运费和船期 err', err);
            proxy.$message.error('提交失败');
        });
};
/* fetch end*/

/* methods start*/
const init = () => {
    search_params.value = {};
};
const handleOk = () => {
    console.log('search_params.value', search_params.value);
    saveFetch();
};

const handleCancel = () => {
    emits('update:visible', false);
    init();
};
/* methods end*/

onMounted(() => {
    search_params.value.shipping_time_estimated = props.detailRecord.shipping_time_estimated
        ? dayjs.unix(props.detailRecord.shipping_time_estimated)
        : null;
    search_params.value.freight = Core.Util.countFilter(props.detailRecord?.freight);
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
