<template>
    <div class="material-list">
        <div class="base-info content-area">
            <div class="title">基本信息</div>
            <div class="base-info-form">
                <a-form
                    ref="formRef"
                    name="custom-validation"
                    :model="formState"
                    :rules="rules"
                    v-bind="layout"
                    labelAlign="right">
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title">营业执照照片</div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <a-form-item
                                        label="营业执照照片"
                                        name="BusinessLicensePhoto"
                                        class="img-area">
                                        <MyUpload
                                            tip="请上传1张2M内的彩色照片或者彩色扫描件或者加盖公章鲜章的复印件"
                                            v-model:value="
                                                formState.BusinessLicensePhoto
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
                                        label="注册资本"
                                        name="RegisteredCapital">
                                        <a-input
                                            allowClear
                                            :maxlength="15"
                                            showCount
                                            placeholder="请输入"
                                            v-model:value="
                                                formState.RegisteredCapital
                                            ">
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 法定代表人 -->
                                    <a-form-item
                                        label="法定代表人"
                                        name="LegalRepresentative">
                                        <a-input
                                            allowClear
                                            :maxlength="5"
                                            showCount
                                            placeholder="请输入"
                                            v-model:value="
                                                formState.LegalRepresentative
                                            ">
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 营业期限 -->
                                    <a-form-item
                                        label="营业期限"
                                        name="BusinessTerm">
                                        <div class="business-term">
                                            <a-radio-group
                                                v-model:value="formState.type"
                                                name="radioGroup">
                                                <a-radio value="1"
                                                    >长期有效</a-radio
                                                >
                                                <a-radio value="2"
                                                    >短期有效</a-radio
                                                >
                                            </a-radio-group>
                                            <TimeSearch
                                                v-if="formState.type == 2"
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
                            <div class="title">银行开票资料</div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="8">
                                    <!-- 开户名 -->
                                    <a-form-item
                                        label="开户名"
                                        name="AccountName">
                                        <a-input
                                            :maxlength="50"
                                            showCount
                                            allowClear
                                            placeholder="请输入"
                                            v-model:value="
                                                formState.AccountName
                                            ">
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 开户行 -->
                                    <a-form-item
                                        label="开户行"
                                        name="BankOfDeposit">
                                        <a-input
                                            allowClear
                                            :maxlength="50"
                                            showCount
                                            placeholder="请输入"
                                            v-model:value="
                                                formState.BankOfDeposit
                                            ">
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="8">
                                    <!-- 开户行号 -->
                                    <a-form-item
                                        label="开户行号"
                                        name="BankOfDepositNumber">
                                        <a-input
                                            allowClear
                                            :maxlength="50"
                                            showCount
                                            placeholder="请输入"
                                            v-model:value="
                                                formState.BankOfDepositNumber
                                            ">
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 银行账号 -->
                                    <a-form-item
                                        label="银行账号"
                                        name="BankAccount">
                                        <a-input
                                            allowClear
                                            :maxlength="50"
                                            showCount
                                            placeholder="请输入"
                                            v-model:value="
                                                formState.BankAccount
                                            ">
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title">质量体系证书</div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 质量体系证书 -->
                                    <a-form-item
                                        label="质量体系证书"
                                        name="QualitySystemCertificate"
                                        class="img-area">
                                        <MyUpload
                                            tip="请上传2M内的相关图片，支持JPG/JPNG/PNG，最多上传9张"
                                            v-model:value="
                                                formState.QualitySystemCertificate
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
            <div class="title">其他证实性材料</div>
            <div class="other-material-form">
                <a-form
                    ref="formRef"
                    name="custom-validation"
                    :model="formState"
                    :rules="rules"
                    v-bind="layout"
                    labelAlign="right">
                    <a-row :gutter="24">
                        <a-col :span="24">
                            <a-form-item
                                label="开户行许可证"
                                name="BusinessLicensePhoto"
                                class="img-area">
                                <MyUpload
                                    tip="请上传2M内的相关图片，支持JPG/JPNG/PNG，最多上传9张"
                                    v-model:value="
                                        formState.BusinessLicensePhoto
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
                                label="环评证书"
                                name="BusinessLicensePhoto"
                                class="img-area">
                                <MyUpload
                                    tip="请上传2M内的相关图片，支持JPG/JPNG/PNG，最多上传9张"
                                    v-model:value="
                                        formState.BusinessLicensePhoto
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
                                label="环保报告"
                                name="BusinessLicensePhoto"
                                class="img-area">
                                <MyUpload
                                    tip="请上传2M内的相关图片，支持JPG/JPNG/PNG，最多上传9张"
                                    v-model:value="
                                        formState.BusinessLicensePhoto
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
import { ref, reactive } from "vue";
import MyUpload from "@/components/MyUpload/index.vue";
import TimeSearch from "@/components/common/TimeSearch.vue";
const formRef = ref(null);
const TimeSearchRef = ref(null);
const formState = reactive({
    type: "1",
});

let BusinessTermValid = async (_rule, value) => {
    if (formState.type == 2) {
        if (!formState.start_time || !formState.end_time) {
            return Promise.reject("请选择营业期限");
        }
    }
    return Promise.resolve();
};

let RegisteredCapitalVaild = async (_rule, value) => {
    if (!value) {
        return Promise.reject("请输入注册资本");
    }
    // 必须为数字
    if (!/^[0-9]*$/.test(value)) {
        return Promise.reject("注册资本必须为数字");
    }
    return Promise.resolve();
};
let LegalRepresentativeVaild = async (_rule, value) => {
    if (!value) {
        return Promise.reject("请输入法定代表人");
    }
    // 纯文本
    if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        return Promise.reject("法定代表人必须为纯文本");
    }
    return Promise.resolve();
};

const rules = {
    // 注册资本
    RegisteredCapital: [
        {
            required: true,
            validator: RegisteredCapitalVaild,
            trigger: ["change", "blur"],
        },
    ],
    // 法定代表人
    LegalRepresentative: [
        {
            required: true,
            validator: LegalRepresentativeVaild,
            trigger: ["change", "blur"],
        },
    ],
    // 营业期限
    BusinessTerm: [
        {
            required: true,
            validator: BusinessTermValid,
            trigger: ["change", "blur"],
        },
    ],
    AccountName: [
        {
            required: true,
            message: "请输入开户名",
            trigger: ["change", "blur"],
        },
    ],
    BankOfDeposit: [
        {
            required: true,
            message: "请输入开户行",
            trigger: ["change", "blur"],
        },
    ],
    BankOfDepositNumber: [
        {
            required: true,
            message: "请输入开户行号",
            trigger: ["change", "blur"],
        },
    ],
    BankAccount: [
        {
            required: true,
            message: "请输入银行账号",
            trigger: ["change", "blur"],
        },
        // 必须为数字
        {
            pattern: /^[0-9]*$/,
            message: "开户行号必须为数字",
            trigger: ["change", "blur"],
        },
    ],
};
const handleTimeSearch = (params) => {
    formState.start_time = params.begin_time;
    formState.end_time = params.end_time;
};
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
            .ant-form {
            }
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
