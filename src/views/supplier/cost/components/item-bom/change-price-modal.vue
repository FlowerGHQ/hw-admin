<template>
    <div ref="wrap">
        <a-modal
            v-model:visible="editVisible"
            :title="$t('supply-chain.modify_price')"
            :okText="$t('item-bom.confirm')"
            :cancelText="$t('item-bom.cancel')"
            @ok="handleOk"
            width="540px"
            centered
            :closable="false"
            class="export-modal"
            @cancel="handCancle"
            :getContainer="() => wrap"
        >
            <div class="main">
                <a-form
                    ref="formRef"
                    :model="formData"
                    :label-col="{ span: lang === 'zh' ? 4 : 9 }"
                    :wrapper-col="{ span: lang === 'zh' ? 20 : 15 }"
                >
                    <a-form-item
                        :label="$t('supply-chain.unit_price_including_tax')"
                        name="price"
                        :rules="[
                            {
                                required: true,
                                message: `${$t('n.enter')} ${$t('supply-chain.unit_price_including_tax')}`,
                            },
                        ]"
                        style="margin-bottom: 0"
                    >
                        <a-input-number
                            v-model:value="formData.price"
                            style="width: 100%"
                            :min="0.0001"
                            :step="0.0001"
                            string-mode
                            :placeholder="$t('supply-chain.please_enter')"
                        />
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Core from '@/core';
import { Form } from 'ant-design-vue';

const useForm = Form.useForm;
const $t = useI18n().t;
const wrap = ref(null);
const { proxy } = getCurrentInstance();

const emits = defineEmits(['update:visibility']);
const props = defineProps({
    bom_item_id: {
        type: [String, Number],
    },
    visibility: {
        type: Boolean,
        default: false,
    },
    formState: {
        type: Object,
        default: () => {
            return {
                price: '',
            };
        },
    },
});
const formData = ref({
    price: '',
});
const formRef = ref(null);
const handCancle = () => {
    emits('update:visibility', false);
};
const editVisible = computed({
    // 重新定义
    get: () => props.visibility,
    set: value => emits('update:visibility', value),
});
const lang = computed(() => {
    return proxy.$store.state.lang;
});
const handleOk = () => {
    changePriceFetch();
};
// 修改价格
const changePriceFetch = async (parmas = {}) => {
    try {
        const values = await formRef.value.validateFields();
        let obj = {
            bom_item_id: props.bom_item_id,
            price: parseFloat(Number(formData.value.price).toFixed(4)), //含税单价
            ...parmas,
        };
        Core.Api.Supplier.bomLogSave(obj)
            .then(res => {
                emits('update:visibility', false);
                emits('confirm', false);
            })
            .catch(err => {
                console.log('getTableDataFetch', err);
            });
    } catch (errorInfo) {
        console.log('Failed:', errorInfo);
    }
};
watch(
    () => props.visibility,
    (newVal, oldVal) => {
        if (newVal) {
            formData.value = props.formState;
        }
    },
    { deep: true, immediate: true },
);
</script>

<style lang="less" scoped>
:deep(.export-modal) {
    .ant-modal-content {
        border-radius: 4px;
        .ant-modal-header {
            padding: 16px 24px;
            height: auto !important;
            border-color: #e2e2e2;
            .ant-modal-title {
                color: #1d2129;
                font-weight: 600;
                font-size: 16px;
                line-height: 1;
            }
        }
        .ant-modal-footer {
            text-align: center;
            .ant-btn {
                min-width: 60px;
                border-radius: 4px;
            }
        }
        .ant-modal-body {
            padding: 25px;
            max-height: 100% !important;
            .main {
                .title {
                    height: 32px;
                    padding: 6px 18px 6px 10px;
                    color: #1d2129;
                    font-weight: 500;
                    background-color: #f2f3f5;
                    border-radius: 4px;
                    margin-bottom: 18px !important;
                    display: inline-block;
                }
                .success-tips {
                    display: flex;
                    align-items: center;
                    margin-bottom: 4px;
                    .success-icon {
                        width: 16px;
                        height: 16px;
                        line-height: 1;
                        margin-right: 4px;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .success-text {
                        color: #26ab54;
                        margin-right: 4px;
                    }
                    .success-or-fail {
                        .success-txt {
                            color: #26ab54;
                        }
                        .fail-txt {
                            color: #f53f3f;
                        }
                    }
                }
                .tips {
                    margin-bottom: 11px;
                    background-color: #f8f8f8;
                    padding-top: 4px;
                    padding-bottom: 3px;
                    padding-left: 7px;
                    color: #666;
                }
                .table {
                    border-radius: 4px;
                    .ant-table-thead,
                    .ant-table-container,
                    tr,
                    th {
                        border-color: #e2e2e2 !important;
                    }
                    .ant-table-cell {
                        color: #1d2129 !important;
                        height: 32px !important;
                        padding: 0;
                        .overflow-ell {
                            padding: 0 8px;
                        }
                    }
                    .ant-table-body {
                        width: 100% !important;
                        table {
                            width: 100% !important;
                        }
                    }
                    .zero {
                        color: #bfbfbf;
                    }
                    .fail-number {
                        color: #f53f3f;
                    }
                }
            }
        }
    }
}
</style>
