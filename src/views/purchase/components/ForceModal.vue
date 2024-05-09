<template>
    <div class="force-modal-area" ref="modalRef">
        <a-modal
            v-model:visible="visible"
            :title="$t('distributor.force_push_production')"
            @ok="handleOk"
            @cancel="handleCancel"
            :getContainer="() => $refs.modalRef"
        >
            <div class="modal-body-area">
                <div class="form-area">
                    <a-form ref="formRef" name="custom-validation" :model="formState" :rules="rules">
                        <a-form-item
                            v-for="item in formOptions"
                            :key="item.key"
                            :label="item.label"
                            :name="item.key"
                            :rules="item.rules"
                        >
                            <template v-if="item.type === 'text'">
                                {{ formState[item.key] }}
                            </template>
                            <template v-else-if="item.type === 'input'">
                                <a-input v-model:value="formState[item.key]" />
                            </template>
                            <template v-else-if="item.type === 'input-textarea'">
                                <a-textarea
                                    v-model:value="formState[item.key]"
                                    :maxlength="item.maxLength"
                                    :show-count="item.showCount"
                                    :rows="6"
                                />
                            </template>
                        </a-form-item>
                    </a-form>
                </div>
                <div class="tips">{{ $t('distributor.force_push_production_tips') }}</div>
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Core from '@/core';

const props = defineProps({
    value: {
        type: Boolean,
        default: false,
    },
    record: {
        type: Object,
        default: () => ({}),
    },
});
const emit = defineEmits(['update:value']);

const $t = useI18n().t;
const formRef = ref(null);
const modalRef = ref(null);
const formState = reactive({});
const rules = reactive({});
const visible = computed(() => props.value);
const formOptions = computed(() => {
    let list = [
        // 订单编号
        {
            type: 'text',
            label: $t('distributor.order_number'),
            key: 'sn',
        },
        // 订单金额
        {
            type: 'text',
            label: $t('distributor.order_amount'),
            key: 'orderAmount',
        },
        // 飞书审批单号
        {
            type: 'input',
            label: $t('distributor.feishu_approval_number'),
            key: 'approvalNo',
            rules: [
                {
                    required: true,
                    message: $t('distributor.please_enter_feishu_approval_number'),
                    trigger: 'blur',
                },
            ],
        },
        // 原因
        {
            type: 'input-textarea',
            label: $t('distributor.reason'),
            key: 'reason',
            rules: [
                {
                    required: true,
                    message: $t('distributor.please_enter_reason'),
                    trigger: 'blur',
                },
            ],
            maxLength: 200,
            showCount: true,
        },
    ];
    return list;
});

watch(
    () => props.value,
    val => {
        if (val) {
            console.log('record:', props.record);
            formState.sn = props.record.sn;
            formState.orderAmount =
                Core.Util.priceUnitFilter(props.record.currency) + Core.Util.countFilter(props.record.price);
            formState.approvalNo = '';
            formState.reason = '';
        } else {
            // 置空表单
            formState.approvalNo = '';
            formState.reason = '';
            formState.sn = '';
            formState.orderAmount = '';
        }
        console.log('watch value:', val);
        console.log('formState:', formState);
    },
);

const handleOk = () => {};
const handleCancel = () => {
    // 重置表单
    formRef.value.resetFields();
    emit('update:value', false);
};
</script>

<style lang="less" scoped>
:deep(.ant-modal-body) {
    .modal-body-area {
        .tips {
            text-align: center;
        }
    }
}
</style>
