<template>
    <div class="confirm-freight">
        <a-modal v-model:visible="visible" :title="title" @cancel="handleCancel">
            <div class="audit">
                <div class="tip-text">
                    {{ $t('distributor.confirm_freight_tips') }}
                </div>
                <div class="content level-search-row">
                    <div class="estimated-shipping-data search-col">
                        <div class="key">{{ $t('distributor.shipping_date') }}：</div>
                        <div class="value flex-1">{{ $Util.timeFilter(detailRecord.shipping_time_estimated, 3) }}</div>
                    </div>
                    <div class="freight search-col">
                        <div class="key">{{ $t('p.freight') }}：</div>
                        <div class="value flex-1">
                            <span>{{ $Util.priceUnitFilter(detailRecord.currency) }}</span>
                            <span>{{ $Util.countFilter(detailRecord.freight) }}</span>
                        </div>
                    </div>
                </div>
                <div class="input-operation horizontal-search-row">
                    <div class="audit-result search-col required">
                        <div class="key w-80 t-a-r">{{ $t('distributor.confirmation_result') }}：</div>
                        <div class="value flex-1">
                            <a-radio-group v-model:value="search_params.result">
                                <a-radio v-for="item in AUDIT_RESULT_MAP_ARR" :key="item.key" :value="item.key">
                                    {{ $t(`${item.t}`) }}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                    <div
                        class="reason search-col d-a-s"
                        :class="{ required: $Util.Common.isMember(search_params.result, [AUDIT_RESULT.REFUSE]) }"
                    >
                        <div class="key w-80 t-a-r">{{ $t('common.reason') }}：</div>
                        <div class="value flex-1">
                            <a-textarea
                                class="w-100"
                                v-model:value="search_params.remark"
                                :placeholder="$t('common.please_enter') + $t('common.reason')"
                                show-count
                                :maxlength="1000"
                            />
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
import { ref, onMounted, getCurrentInstance } from 'vue';
import Core from '@/core';
const AUDIT_RESULT_MAP_ARR = Core.Const.DISTRIBUTOR.AUDIT_RESULT_MAP_ARR;
const AUDIT_RESULT = Core.Const.DISTRIBUTOR.AUDIT_RESULT;

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
    result: 200,
    remark: undefined,
});

const emits = defineEmits(['update:visible', 'ok', 'cancel']);

/* fetch start*/
// 确认运费
const saveFreightFetch = (params = {}) => {
    const obj = {
        id: props.detailRecord.freight_audit_record_id, // 审核记录id（audit_record_id）
        status: search_params.value.result, // 审核内容
        remark: search_params.value.remark, // 审核内容
        ...params,
    };

    console.log('obj', obj);
    Core.Api.ShippingDateFreight.confirm(obj)
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
const handleOk = () => {
    console.log('search_params.value', search_params.value);
    let form = search_params.value
    
    const requireList = [
        { 
            key: 'remark', 
            msg: proxy.$t('def.enter') + '(' + proxy.$t('common.reason') + ')', 
            isVerification: proxy.$Util.Common.isMember(search_params.value.result, [AUDIT_RESULT.REFUSE]) 
        },
    ];

    for (let index in requireList) {
        if (requireList[index]?.isVerification) {
            // 判断这个对象在哪种情况需要验证
            if (!form[requireList[index].key]) {
                return proxy.$message.warning(requireList[index].msg);
            }
        }
    }

    saveFreightFetch()    
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

    .tip-text {
        padding: 9px 16px;
        border-radius: 2px;
        background: rgba(0, 97, 255, 0.1);
        font-size: 12px;
        font-family:
            Alibaba PuHuiTi 3,
            Alibaba PuHuiTi 3-400;
        font-weight: 400;
        color: #464e5e;
        margin-bottom: 14px;
    }

    .w-80 {
        width: 80px;
    }
    .d-f-a {
        display: flex;
        align-items: center;
    }
    .d-a-s {
        align-items: flex-start;
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
