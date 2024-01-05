<template>
    <div class="material-list">
        <div class="base-info content-area">
            <div class="title">{{ $t("supply-chain.basic_info") }}</div>
            <div class="base-info-form">
                <a-form
                    ref="formRef1"
                    name="custom-validation"
                    :model="formState"
                    :rules="rules"
                    labelAlign="right">
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title">
                                {{ $t("supply-chain.business_license_photos") }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <a-form-item
                                        :label="
                                            $t(
                                                'supply-chain.business_license_photos'
                                            )
                                        "
                                        name="business_license_photo"
                                        class="img-area">
                                        <MyUpload
                                            name="business_license_photo"
                                            :tip="
                                                $t('supply-chain.upload_photos')
                                            "
                                            v-model:value="
                                                formState.business_license_photo
                                            "
                                            showTip
                                            :limit="1"
                                            :limitSize="2"
                                            tipPosition="right" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="8">
                                    <!-- 注册资本 -->
                                    <a-form-item
                                        :label="
                                            $t(
                                                'supply-chain.registered_capital'
                                            )
                                        "
                                        name="registered_capital">
                                        <a-input
                                            allowClear
                                            :maxlength="15"
                                            showCount
                                            :placeholder="
                                                $t('supply-chain.please_enter')
                                            "
                                            name="registered_capital"
                                            v-model:value="
                                                formState.registered_capital
                                            ">
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 法定代表人 -->
                                    <a-form-item
                                        :label="
                                            $t(
                                                'supply-chain.legal_representative'
                                            )
                                        "
                                        name="legal_person">
                                        <a-input
                                            allowClear
                                            :maxlength="5"
                                            showCount
                                            :placeholder="
                                                $t('supply-chain.please_enter')
                                            "
                                            name="legal_person"
                                            v-model:value="
                                                formState.legal_person
                                            ">
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 营业期限 -->
                                    <a-form-item
                                        :label="
                                            $t('supply-chain.business_term')
                                        "
                                        name="business_duration_type">
                                        <div class="business-term">
                                            <a-radio-group
                                                v-model:value="
                                                    formState.business_duration_type
                                                ">
                                                <a-radio :value="1">{{
                                                    $t(
                                                        "supply-chain.long_term_validity"
                                                    )
                                                }}</a-radio>
                                                <a-radio :value="2">{{
                                                    $t(
                                                        "supply-chain.short_term_validity"
                                                    )
                                                }}</a-radio>
                                            </a-radio-group>
                                            <TimeSearch
                                                v-if="
                                                    formState.business_duration_type ==
                                                    2
                                                "
                                                ref="TimeSearchRef"
                                                @search="handleTimeSearch" />
                                        </div>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title">
                                {{
                                    $t("supply-chain.bank_billing_information")
                                }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="8">
                                    <!-- 开户名 -->
                                    <a-form-item
                                        :label="$t('supply-chain.account_name')"
                                        name="account_name">
                                        <a-input
                                            :maxlength="50"
                                            showCount
                                            allowClear
                                            :placeholder="
                                                $t('supply-chain.please_enter')
                                            "
                                            name="account_name"
                                            v-model:value="
                                                formState.account_name
                                            ">
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 开户行 -->
                                    <a-form-item
                                        :label="
                                            $t('supply-chain.bank_of_deposit')
                                        "
                                        name="account_with_bank">
                                        <a-input
                                            allowClear
                                            :maxlength="50"
                                            showCount
                                            :placeholder="
                                                $t('supply-chain.please_enter')
                                            "
                                            name="account_with_bank"
                                            v-model:value="
                                                formState.account_with_bank
                                            ">
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="8">
                                    <!-- 开户行号 -->
                                    <a-form-item
                                        :label="$t('supply-chain.bank_number')"
                                        name="account_with_bank_number">
                                        <a-input
                                            allowClear
                                            name="account_with_bank_number"
                                            :maxlength="50"
                                            showCount
                                            :placeholder="
                                                $t('supply-chain.please_enter')
                                            "
                                            v-model:value="
                                                formState.account_with_bank_number
                                            ">
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 银行账号 -->
                                    <a-form-item
                                        :label="$t('supply-chain.bank_account')"
                                        name="bank_account">
                                        <a-input
                                            allowClear
                                            :maxlength="50"
                                            showCount
                                            :placeholder="
                                                $t('supply-chain.please_enter')
                                            "
                                            name="bank_account"
                                            v-model:value="
                                                formState.bank_account
                                            ">
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title">
                                {{
                                    $t(
                                        "supply-chain.quality_system_certificate"
                                    )
                                }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 质量体系证书 -->
                                    <a-form-item
                                        :label="
                                            $t(
                                                'supply-chain.quality_system_certificate'
                                            )
                                        "
                                        name="quality_system_certificate"
                                        class="img-area">
                                        <MyUpload
                                            name="quality_system_certificate"
                                            :tip="
                                                $t('supply-chain.please_upload')
                                            "
                                            v-model:value="
                                                formState.quality_system_certificate
                                            "
                                            showTip
                                            :limit="9"
                                            :limitSize="2"
                                            tipPosition="bottom" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </div>
        <div class="other-material content-area">
            <div class="title">
                {{ $t("supply-chain.other_proving_materials") }}
            </div>
            <div class="other-material-form">
                <a-form
                    ref="formRef2"
                    name="custom-validation"
                    :model="formState"
                    :rules="rules"
                    labelAlign="right">
                    <a-row :gutter="24">
                        <a-col :span="24">
                            <a-form-item
                                :label="$t('supply-chain.bank_account_license')"
                                name="account_opening_bank_license"
                                class="img-area">
                                <MyUpload
                                    name="account_opening_bank_license"
                                    :tip="$t('supply-chain.please_upload')"
                                    v-model:value="
                                        formState.account_opening_bank_license
                                    "
                                    showTip
                                    :limit="9"
                                    :limitSize="2"
                                    tipPosition="bottom" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="24">
                            <a-form-item
                                :label="
                                    $t(
                                        'supply-chain.environmental_assessment_certificate'
                                    )
                                "
                                name="eia_certificate"
                                class="img-area">
                                <MyUpload
                                    name="eia_certificate"
                                    :tip="$t('supply-chain.please_upload')"
                                    v-model:value="formState.eia_certificate"
                                    showTip
                                    :limit="9"
                                    :limitSize="2"
                                    tipPosition="bottom" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="24">
                            <a-form-item
                                :label="
                                    $t(
                                        'supply-chain.environmental_protection_report'
                                    )
                                "
                                name="environmental_report"
                                class="img-area">
                                <MyUpload
                                    name="environmental_report"
                                    :tip="$t('supply-chain.please_upload')"
                                    v-model:value="
                                        formState.environmental_report
                                    "
                                    showTip
                                    :limit="9"
                                    :limitSize="2"
                                    tipPosition="bottom" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, toRef } from "vue";
import MyUpload from "@/components/MyUpload/index.vue";
import TimeSearch from "@/components/common/TimeSearch.vue";
import { message } from "ant-design-vue";
import Core from "@/core";
const formRef1 = ref(null);
const formRef2 = ref(null);
const TimeSearchRef = ref(null);
const props = defineProps({
    isSubmit: {
        type: Boolean,
        default: false,
    },
    value: {
        type: Boolean,
        default: false,
    },
    isSaveDraft: {
        type: Boolean,
        default: false,
    },
});
import { useI18n } from "vue-i18n";
const $t = useI18n().t;
const $i18n = useI18n();
const $emit = defineEmits(["update:value"]);

// 监听isSubmit
watch(
    () => props.isSubmit,
    () => {
        // 如果isSubmit变化了，就校验
        if (formRef1.value) {
            formRef1.value.clearValidate();
            formRef1.value
                .validate()
                .then((res) => {
                    if (res) {
                        // 校验通过
                        $emit("update:value", true);
                    }
                })
                .catch((err) => {
                    // 校验失败
                    $emit("update:value", false);
                    const errorName = err.errorFields[0]?.name[0];
                    if (!errorName) return;
                    const errorDom = document.querySelector(
                        `[name=${errorName}]`
                    );
                    // errorDom 为null 找不到对应的a-form-item的原因是：a-form-item的name属性值必须和a-input的name属性值一致
                    errorDom.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "nearest",
                    });
                });
        }
    },
    {
        deep: true,
    }
);
watch(
    () => props.isSaveDraft,
    (val) => {
        // 获取数据
        let data =
            Core.Data.getSupplyChain() === ""
                ? {}
                : JSON.parse(Core.Data.getSupplyChain());
        // 判断是否为空对象
        if (Object.keys(data).length === 0) {
            // 为空对象
            data = {
                    confirmatory_material: formState,
            };
        } else {
            // 不为空对象
            data.confirmatory_material = formState;
        }
        // 保存数据
        Core.Data.setSupplyChain(JSON.stringify(data));
        // 提示
        message.success($t("supply-chain.save_successfully"));

    }
);
watch(
    ()=> $i18n.locale.value,
    (val)=>{
        // 重新校验
        if (formRef1.value) {
            formRef1.value.clearValidate();
        }
    }
)

let formState = reactive({
    business_duration_type: 1,
});

let BusinessTermValid = async (_rule, value) => {
    if (formState.business_duration_type == 2) {
        if (!formState.begin_business_time || !formState.end_business_time) {
            console.log($t("supply-chain.please_select_business_term"));
            return Promise.reject(
                $t("supply-chain.please_select_business_term")
            );
        }
    }
    if (formState.business_duration_type == 1) {
        formState.begin_business_time = "";
        formState.end_business_time = "";
    }
    return Promise.resolve();
};
let RegisteredCapitalVaild = async (_rule, value) => {
    if (!value) {
        return Promise.reject(
            $t("supply-chain.please_enter_registered_capital")
        );
    }
    // 必须为数字
    if (!/^[0-9]*$/.test(value)) {
        return Promise.reject(
            $t("supply-chain.registered_capital_must_be_number")
        );
    }
    return Promise.resolve();
};
let LegalRepresentativeVaild = async (_rule, value) => {
    if (!value) {
        return Promise.reject(
            $t("supply-chain.please_enter_legal_representative")
        );
    }
    // 纯文本
    if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        return Promise.reject(
            $t("supply-chain.legal_representative_must_be_pure_text")
        );
    }
    return Promise.resolve();
};
let account_nameVaild = async (_rule, value) => {
    if (!value) {
        return Promise.reject($t("supply-chain.please_enter_account_name"));
    }
    return Promise.resolve();
};
let account_with_bankVaild = async (_rule, value) => {
    if (!value) {
        return Promise.reject($t("supply-chain.please_enter_bank_of_deposit"));
    }
    return Promise.resolve();
};
let account_with_bank_numberVaild = async (_rule, value) => {
    if (!value) {
        return Promise.reject($t("supply-chain.please_enter_bank_number"));
    }
    return Promise.resolve();
};
let bank_accountVaild = async (_rule, value) => {
    if (!value) {
        return Promise.reject($t("supply-chain.please_enter_bank_account"));
    }
    // 必须为数字
    if (!/^[0-9]*$/.test(value)) {
        return Promise.reject($t("supply-chain.bank_number_must_be_number"));
    }
    return Promise.resolve();
};


const rules = {
    // 注册资本
    registered_capital: [
        {
            required: true,
            validator: RegisteredCapitalVaild,
            trigger: ["change", "blur"],
        },
    ],
    // 法定代表人
    legal_person: [
        {
            required: true,
            validator: LegalRepresentativeVaild,
            trigger: ["change", "blur"],
        },
    ],
    // 营业期限
    business_duration_type: [
        {
            required: true,
            validator: BusinessTermValid,
            trigger: ["change", "blur"],
        },
    ],
    account_name: [
    {
            required: true,
            validator: account_nameVaild,
            trigger: ["change", "blur"],
        },
    ],
    account_with_bank: [
        {
            required: true,
            validator: account_with_bankVaild,
            trigger: ["change", "blur"],
        },
    ],
    account_with_bank_number: [
        {
            required: true,
            validator: account_with_bank_numberVaild,
            trigger: ["change", "blur"],
        },
    ],
    bank_account: [
        {
            required: true,
            validator: bank_accountVaild,
            trigger: ["change", "blur"],
        },
    ],
};
const handleTimeSearch = (params) => {
    formState.begin_business_time = params.begin_time;
    formState.end_business_time = params.end_time;
};
// 草稿回显
const draftDataReview = () => {
    let draftDataJson = Core.Data.getSupplyChain();
    let draftData  = draftDataJson === "" ? {} : JSON.parse(draftDataJson);
    // 判断是否为空对象
    if (Object.keys(draftData).length === 0) {
        formState.business_duration_type = 1;
    } else {
        // 解析出来的数据
        let data = draftData;
        console.log(data);
        Object.keys(data?.confirmatory_material??{}).forEach((key) => {
            formState[key] = data.confirmatory_material[key];
        });
        formState.business_duration_type =
            data?.confirmatory_material?.business_duration_type || 1;

        console.log(formState);
    }
    setTimeout(() => {
        if (TimeSearchRef.value) {
            // 给timeSearch赋值
            TimeSearchRef.value.createTime = [
                formState.begin_business_time,
                formState.end_business_time,
            ];
        }
    });
};

onMounted(() => {
    draftDataReview();
});
</script>

<style lang="less" scoped>
.material-list {
    display: flex;
    width: 100%;
    padding: 20px;
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
            font-size: 18px;
            font-weight: 500;
        }
    }
    .base-info {
        width: 100%;
        .base-info-form {
            padding: 8px 199px 0 399px;
        }
    }
    .other-material {
        width: 100%;
        margin-top: 21px;
        .other-material-form {
            padding: 8px 696px 0 623px;
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
.business-term {
    display: flex;
    align-items: center;
    :deep(.ant-picker-range) {
        min-width: 236px;
        height: 32px;
    }
}
</style>
