<template>
    <div class="material-list">
        <div class="base-info content-area">
            <div class="title">{{ $t('supply-chain.basic_info') }}</div>
            <div class="base-info-form">
                <a-form ref="formRef1" name="custom-validation" :model="formState" :rules="rules" labelAlign="right">
                    <div class="col-area">
                        <div class="title-area">
                            <div class="title">
                                {{ $t('supply-chain.business_license_photos') }}
                            </div>
                        </div>
                        <div class="content-area">
                            <div class="col-area">
                                <div class="col-all-area">
                                    <a-form-item
                                        :label="$t('supply-chain.business_license_photos')"
                                        name="business_license_photo"
                                        class="img-area"
                                    >
                                        <MyUpload
                                            name="business_license_photo"
                                            :tip="$t('supply-chain.upload_photos')"
                                            v-model:value="formState.business_license_photo"
                                            showTip
                                            :limit="1"
                                            :limitSize="2"
                                            tipPosition="right"
                                        />
                                    </a-form-item>
                                </div>
                            </div>
                            <div class="col-area">
                                <div class="col-all-area">
                                    <!-- 注册资本 -->
                                    <a-form-item
                                        :label="$t('supply-chain.registered_capital')"
                                        name="registered_capital"
                                    >
                                        <div class="registered-capital—area">
                                            <a-input-number
                                                v-model:value="formState.registered_capital"
                                                :placeholder="$t('supply-chain.please_enter')"
                                                :maxlength="15"
                                                min="0"
                                                name="registered_capital"
                                            >
                                                <template #addonAfter>
                                                    <span> {{ $t('supply-chain.ten_thousand_yuan') }} </span>
                                                </template>
                                            </a-input-number>
                                        </div>
                                    </a-form-item>
                                </div>
                            </div>
                            <div class="col-area business-term-col-area">
                                <div class="col-all-area">
                                    <!-- 营业期限 -->
                                    <a-form-item
                                        :label="$t('supply-chain.business_term')"
                                        name="business_duration_type"
                                    >
                                        <div class="business-term">
                                            <a-radio-group v-model:value="formState.business_duration_type">
                                                <a-radio
                                                    v-for="(item, index) in Core.Const.SUPPLAY.BUSINESS_TERM"
                                                    :value="item.value"
                                                    :key="index"
                                                >
                                                    {{ $t(item.t) }}
                                                </a-radio>
                                            </a-radio-group>
                                            <TimeSearch
                                                v-if="formState.business_duration_type == 2"
                                                ref="TimeSearchRef"
                                                @search="handleTimeSearch"
                                                :defaultTime="false"
                                            />
                                        </div>
                                    </a-form-item>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-area">
                        <div class="title-area">
                            <div class="title">
                                {{ $t('supply-chain.bank_billing_information') }}
                            </div>
                        </div>
                        <div class="content-area">
                            <div class="col-area">
                                <div class="col-area-item">
                                    <!-- 开户名 -->
                                    <a-form-item :label="$t('supply-chain.account_name')" name="account_name">
                                        <a-input
                                            :maxlength="50"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            name="account_name"
                                            v-model:value="formState.account_name"
                                        >
                                        </a-input>
                                    </a-form-item>
                                </div>
                                <div class="col-area-item">
                                    <!-- 开户行 -->
                                    <a-form-item :label="$t('supply-chain.bank_of_deposit')" name="account_with_bank">
                                        <a-input
                                            :maxlength="50"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            name="account_with_bank"
                                            v-model:value="formState.account_with_bank"
                                        >
                                        </a-input>
                                    </a-form-item>
                                </div>
                            </div>
                            <div class="col-area">
                                <div class="col-area-item">
                                    <!-- 开户行号 -->
                                    <a-form-item
                                        :label="$t('supply-chain.bank_number')"
                                        name="account_with_bank_number"
                                    >
                                        <a-input
                                            name="account_with_bank_number"
                                            :maxlength="50"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            v-model:value="formState.account_with_bank_number"
                                        >
                                        </a-input>
                                    </a-form-item>
                                </div>
                                <div class="col-area-item">
                                    <!-- 银行账号 -->
                                    <a-form-item :label="$t('supply-chain.bank_account')" name="bank_account">
                                        <a-input
                                            :maxlength="50"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            name="bank_account"
                                            v-model:value="formState.bank_account"
                                        >
                                        </a-input>
                                    </a-form-item>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-area">
                        <div class="title-area">
                            <div class="title">
                                {{ $t('supply-chain.quality_system_certificate') }}
                            </div>
                        </div>
                        <div class="content-area">
                            <div class="col-area">
                                <div class="col-all-area">
                                    <!-- 质量体系证书 -->
                                    <a-form-item
                                        :label="$t('supply-chain.quality_system_certificate')"
                                        name="quality_system_certificate"
                                        class="img-area"
                                    >
                                        <MyUpload
                                            name="quality_system_certificate"
                                            :tip="$t('supply-chain.please_upload')"
                                            v-model:value="formState.quality_system_certificate"
                                            showTip
                                            :limit="9"
                                            :limitSize="2"
                                            tipPosition="bottom"
                                        />
                                    </a-form-item>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-area" v-if="supplyType == Core.Const.SUPPLAY.SUPPLAY_TYPE['2'].value">
                        <div class="title-area">
                            <div class="title">
                                {{ $t('supply-chain.proxy_certificate') }}
                            </div>
                        </div>
                        <div class="content-area">
                            <div class="col-area">
                                <div class="col-all-area">
                                    <!-- 代理证书 -->
                                    <a-form-item
                                        :label="$t('supply-chain.proxy_certificate')"
                                        name="proxy_certificate"
                                        class="img-area"
                                    >
                                        <MyUpload
                                            name="proxy_certificate"
                                            :tip="$t('supply-chain.please_upload')"
                                            v-model:value="formState.proxy_certificate"
                                            showTip
                                            :limit="9"
                                            :limitSize="2"
                                            tipPosition="bottom"
                                        />
                                    </a-form-item>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-form>
            </div>
        </div>
        <div class="other-material content-area">
            <div class="title">
                {{ $t('supply-chain.other_proving_materials') }}
            </div>
            <div class="other-material-form">
                <a-form :model="formState" labelAlign="right">
                    <div class="col-area">
                        <div class="title-area">
                            <div class="title"></div>
                        </div>
                        <div class="content-area">
                            <div class="col-area">
                                <div class="col-all-area">
                                    <a-form-item
                                        :label="$t('supply-chain.bank_account_license')"
                                        name="account_opening_bank_license"
                                        class="img-area"
                                    >
                                        <MyUpload
                                            name="account_opening_bank_license"
                                            :tip="$t('supply-chain.please_upload')"
                                            v-model:value="formState.account_opening_bank_license"
                                            showTip
                                            :limit="9"
                                            :limitSize="2"
                                            tipPosition="bottom"
                                        />
                                    </a-form-item>
                                </div>
                            </div>
                            <div class="col-area">
                                <div class="col-all-area">
                                    <a-form-item
                                        :label="$t('supply-chain.environmental_assessment_certificate')"
                                        name="eia_certificate"
                                        class="img-area"
                                    >
                                        <MyUpload
                                            name="eia_certificate"
                                            :tip="$t('supply-chain.please_upload')"
                                            v-model:value="formState.eia_certificate"
                                            showTip
                                            :limit="9"
                                            :limitSize="2"
                                            tipPosition="bottom"
                                        />
                                    </a-form-item>
                                </div>
                            </div>
                            <div class="col-area">
                                <div class="col-all-area">
                                    <a-form-item
                                        :label="$t('supply-chain.environmental_protection_report')"
                                        name="environmental_report"
                                        class="img-area"
                                    >
                                        <MyUpload
                                            name="environmental_report"
                                            :tip="$t('supply-chain.please_upload')"
                                            v-model:value="formState.environmental_report"
                                            showTip
                                            :limit="9"
                                            :limitSize="2"
                                            tipPosition="bottom"
                                        />
                                    </a-form-item>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, toRef, computed } from 'vue';
import MyUpload from '@/components/MyUpload/index.vue';
import TimeSearch from '@/components/common/TimeSearch.vue';
import { message } from 'ant-design-vue';
import Core from '@/core';
const formRef1 = ref(null);
const TimeSearchRef = ref(null);
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
const $t = useI18n().t;
const $i18n = useI18n();
const $store = useStore();
let formState = reactive({
    business_duration_type: 1,
});
// 供应类型
const supplyType = computed(() => {
    return $store.getters['SUPPLY_CHAIN/supplyType'];
});
let BusinessTermValid = async (_rule, value) => {
    if (formState.business_duration_type == 2) {
        if (!formState.begin_business_time || !formState.end_business_time) {
            console.log($t('supply-chain.please_select_business_term'));
            return Promise.reject($t('supply-chain.please_select_business_term'));
        }
    }
    if (formState.business_duration_type == 1) {
        formState.begin_business_time = '';
        formState.end_business_time = '';
    }
    return Promise.resolve();
};
let RegisteredCapitalVaild = async (_rule, value) => {
    if (!value) {
        return Promise.reject($t('supply-chain.please_enter_registered_capital'));
    }
    // 必须为数字
    if (!/^[0-9]*$/.test(value)) {
        return Promise.reject($t('supply-chain.registered_capital_must_be_number'));
    }
    return Promise.resolve();
};
let account_nameVaild = async (_rule, value) => {
    if (!value) {
        return Promise.reject($t('supply-chain.please_enter_account_name'));
    }
    return Promise.resolve();
};
let account_with_bankVaild = async (_rule, value) => {
    if (!value) {
        return Promise.reject($t('supply-chain.please_enter_bank_of_deposit'));
    }
    return Promise.resolve();
};
let account_with_bank_numberVaild = async (_rule, value) => {
    if (!value) {
        return Promise.reject($t('supply-chain.please_enter_bank_number'));
    }
    return Promise.resolve();
};
let bank_accountVaild = async (_rule, value) => {
    if (!value) {
        return Promise.reject($t('supply-chain.please_enter_bank_account'));
    }
    // 必须为数字
    if (!/^[0-9]*$/.test(value)) {
        return Promise.reject($t('supply-chain.bank_number_must_be_number'));
    }
    return Promise.resolve();
};
const business_license_photoVaild = async (_rule, value) => {
    console.log('value', value);
    if (!value) {
        return Promise.reject($t('supply-chain.please_upload_business_license_photos'));
    }
    return Promise.resolve();
};
const rules = {
    // 注册资本
    registered_capital: [
        {
            required: true,
            validator: RegisteredCapitalVaild,
            trigger: ['change', 'blur'],
        },
    ],
    // 营业期限
    business_duration_type: [
        {
            required: true,
            validator: BusinessTermValid,
            trigger: ['change', 'blur'],
        },
    ],
    account_name: [
        {
            required: true,
            validator: account_nameVaild,
            trigger: ['change', 'blur'],
        },
    ],
    account_with_bank: [
        {
            required: true,
            validator: account_with_bankVaild,
            trigger: ['change', 'blur'],
        },
    ],
    account_with_bank_number: [
        {
            required: true,
            validator: account_with_bank_numberVaild,
            trigger: ['change', 'blur'],
        },
    ],
    bank_account: [
        {
            required: true,
            validator: bank_accountVaild,
            trigger: ['change', 'blur'],
        },
    ],
    business_license_photo: [
        {
            required: true,
            validator: business_license_photoVaild,
            trigger: ['change', 'blur'],
        },
    ],
};

const handleTimeSearch = params => {
    formState.begin_business_time = params.begin_time;
    formState.end_business_time = params.end_time;
};
// 草稿回显
const draftDataReview = () => {
    let draftData = $store.state.SUPPLY_CHAIN.supplyDraftChain;
    console.log('草稿回显数据：', draftData);
    // 判断是否为空对象
    if (Object.keys(draftData).length === 0) {
        formState = {
            form: {
                confirmatory_material: {
                    business_duration_type: 1,
                },
            },
        };
    } else {
        // 解析出来的数据
        let data = draftData;
        Object.keys(data?.form?.confirmatory_material ?? {}).forEach(key => {
            formState[key] = data.form.confirmatory_material[key];
        });
        formState.business_duration_type = data?.form?.confirmatory_material?.business_duration_type || 1;

        console.log('回显数据：', formState);
    }
    setTimeout(() => {
        if (TimeSearchRef.value) {
            // 给timeSearch赋值
            TimeSearchRef.value.createTime = [formState.begin_business_time, formState.end_business_time];
        }
    });
};
// 校验
const step2Vaild = () => {
    return new Promise((resolve, reject) => {
        formRef1.value && formRef1.value.clearValidate();
        formRef1.value &&
            formRef1.value
                .validate()
                .then(res => {
                    if (res) {
                        let data = $store.state.SUPPLY_CHAIN.supplyChain;
                        if (Object.keys(data).length === 0) {
                            // 为空对象
                            data = {
                                form: {
                                    confirmatory_material: formState,
                                },
                            };
                        } else {
                            // 不为空对象
                            data.form.confirmatory_material = formState;
                        }

                        // 保存数据
                        $store.dispatch('SUPPLY_CHAIN/setSupplyChain', data);
                        $store.dispatch('SUPPLY_CHAIN/setSupplyDraftChain', data);
                        resolve(true);
                    }
                })
                .catch(err => {
                    console.log('err', err);
                    console.log('errName', err?.errorFields[0]?.name[0]);
                    const errorName = err?.errorFields[0]?.name[0] ?? undefined;
                    console.log('errorName', err);
                    if (!errorName) return;
                    const errorDom = document.querySelector(`[name=${errorName}]`);
                    // errorDom 为null 找不到对应的a-form-item的原因是：a-form-item的name属性值必须和a-input的name属性值一致
                    errorDom.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest',
                    });
                    // 校验失败
                    message.warning($t('supply-chain.please_complete_info'));
                    reject(false);
                });
    });
};
// 点击上一步的操作
const handlePrev = () => {
    // 保存数据
    let data = $store.state.SUPPLY_CHAIN.supplyChain;
    if (Object.keys(data).length === 0) {
        // 为空对象
        data = {
            form: {
                confirmatory_material: formState,
            },
        };
    } else {
        // console.log("判断类型", typeof data.form);
        if (typeof data.form === 'string') {
            data.form = JSON.parse(data.form);
            data.form.confirmatory_material = formState;
        } else {
            // 不为空对象
            data.form.confirmatory_material = formState;
        }
    }
    $store.dispatch('SUPPLY_CHAIN/setSupplyChain', data);
    $store.commit('SUPPLY_CHAIN/setSupplyDraftChain', data);
};
// 保存草稿
const saveDraft = () => {
    let data = {
        form: {
            confirmatory_material: {},
        },
    };
    data.form.confirmatory_material = formState;
    // 保存数据
    // Core.Data.setSupplyDraftChain(JSON.stringify(data));
    $store.dispatch('SUPPLY_CHAIN/setSupplyDraftChain', data);

    // 提示
    message.success($t('supply-chain.save_successfully'));
};
// 回显数据
const reviewData = () => {
    // 没有提交过
    draftDataReview();
};

watch(
    () => $i18n.locale.value,
    val => {
        // 重新校验
        if (formRef1.value) {
            formRef1.value.clearValidate();
        }
    },
);

defineExpose({
    step2Vaild,
    saveDraft,
    handlePrev,
});

onMounted(() => {
    // 回显数据
    reviewData();
});
</script>

<style lang="less" scoped>
.material-list {
    display: flex;
    width: 100%;
    padding: 20px;
    padding-bottom: 0;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    border-radius: 6px 6px 0px 0px;
    background: #fff;
    justify-content: flex-start;
    .content-area {
        background: #f8fafc;
        padding: 20px;
        padding-bottom: 4px;
        .title {
            color: #1d2129;
            font-size: 16px;
            font-weight: 500;
        }
    }
    .base-info {
        width: 100%;
        .title {
            color: #1d2129;
            font-size: 18px;
            font-weight: 500;
        }
        .base-info-form {
            padding: 0 3%;
            margin: 0 auto;
            .ant-form {
                .col-area {
                    .title-area {
                        min-width: 96px;
                    }
                    .content-area {
                        padding: 0;
                        margin-left: 10.5%;
                        .col-area {
                            margin-left: 0 !important;
                        }
                    }
                }
            }
        }
    }
    .other-material {
        width: 100%;
        margin-top: 21px;
        .title {
            color: #1d2129;
            font-size: 18px;
            font-weight: 500;
        }
        .other-material-form {
            padding: 0 3%;
            margin: 0 auto;
            .ant-form {
                .col-area {
                    .title-area {
                        min-width: 96px;
                    }
                    .content-area {
                        padding: 0;
                        margin-left: 10.5%;
                        .col-area {
                            margin-left: 0 !important;
                        }
                    }
                }
            }
        }
    }
}
:deep(.ant-form-item-label) {
    min-width: 90px;
    margin-right: 8px;
}
:deep(input.ant-input) {
    width: 386px;
}

:deep(.ant-form-item) {
    margin-bottom: 16px;
}
:deep(.ant-form-item-label > label) {
    color: #8090a6;
}
:deep(.ant-form-item-label > label::after) {
    display: none;
}
:deep(.img-area) {
    .ant-col-offset-1 {
        margin-left: 1.9%;
    }
}
:deep(.ant-form-item-control-input-content) {
    // 清除flex：auto
    flex: none;
}
:deep(.ant-input-number-group-addon) {
    background-color: #f2f2f2;
    color: #808fa6;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    box-sizing: border-box;
}
:deep(.ant-input-number-group) {
    border-radius: 4px;
    background: #fff;
    overflow: hidden;
}
.business-term {
    display: flex;
    align-items: center;
    :deep(.ant-picker-range) {
        min-width: 236px;
        height: 32px;
    }
}
.registered-capital—area {
    display: flex;
    align-items: center;
    .unit {
        color: #808fa6;
        min-width: 36px;
        height: 30px;
        background-color: #f2f2f2;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-left: none;
    }
}
.col-area {
    display: flex;
    align-items: flex-start;
    .title-area {
        width: 96px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: 16px;
        .title {
            color: #1d2129;
            font-size: 14px;
            font-weight: 500;
        }
    }
    .content-area {
        .col-area {
            flex-wrap: wrap;
        }
    }
}
:deep(.business-term-col-area) {
    align-items: flex-start;
    .col-all-area {
        .ant-form-item {
            .ant-form-item-label {
                label {
                    height: 30px !important;
                }
            }
        }
    }
}
</style>
