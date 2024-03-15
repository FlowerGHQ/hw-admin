<template>
    <div id="recharge">
        <!-- 未提交 -->
        <div class="content" v-if="!isSubmit">
            <div class="steps">
                <div class="step-body">
                    <div
                        class="step-item"
                        :class="[index === current ? 'active' : '']"
                        v-for="(item, index) in steps"
                        :key="item.title"
                    >
                        <span class="step-text">
                            {{ `${index + 1}、${$t(item.title)}` }}
                        </span>
                    </div>
                </div>
                <div class="steps-content">
                    <!-- 第一步 -->
                    <template v-if="current === 0">
                        <p class="title">{{ $t('mall.recharge_amount') }}</p>
                        <div class="form-body">
                            <a-form
                                ref="formRef"
                                layout="vertical"
                                :model="formState"
                                name="dynamic_rule"
                                v-bind="formItemLayout"
                                labelAlign="left"
                            >
                                <a-row :gutter="72">
                                    <a-col :span="12">
                                        <a-form-item
                                            :label="$t('mall.vehicle_available')"
                                            name="vehicle_balance"
                                            :rules="[
                                                {
                                                    required: false,
                                                    message: `${$t('mall.please_input_number')}!`,
                                                    validator: checkPrice,
                                                },
                                            ]"
                                        >
                                            <a-input
                                                v-model:value="formState.vehicle_balance"
                                                :suffix="currency"
                                                :placeholder="$t('w.enter_money')"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item
                                            :label="$t('mall.parts_available')"
                                            name="part_balance"
                                            :rules="[
                                                {
                                                    required: false,
                                                    message: `${$t('mall.please_input_number')}!`,
                                                    validator: checkPrice,
                                                },
                                            ]"
                                        >
                                            <a-input
                                                :placeholder="$t('w.enter_money')"
                                                v-model:value="formState.part_balance"
                                                :suffix="currency"
                                            />
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                            </a-form>
                            <div class="amount">
                                <span class="amount-text">{{ $t('mall.the_amount_transferred') }}:</span>
                                <span class="amount-price">€ {{ amount_price }}</span>
                            </div>
                        </div>
                        <p class="title">{{ $t('p.Payment_information') }}</p>
                        <PaymentInformation :mes="accoutMes" />
                    </template>
                    <!-- 第二步 -->
                    <template v-if="current === 1">
                        <p class="title">{{ $t('mall.recharge_amount') }}</p>
                        <div class="upload-body">
                            <div
                                class="record"
                                @click="
                                    routerChange('/distributor/distributor-recharge-record', {
                                        org_id: orgId,
                                        org_type: orgType,
                                        currency: org.currency,
                                    })
                                "
                            >
                                {{ $t('mall.recharge_record') }}
                            </div>
                            <MyUpload
                                ref="myUpload"
                                :isWrite="isWrite"
                                :defaultList="detail.content.payment_information.img"
                                :type="isMobile ? 'image' : 'file'"
                                @handleUpload="handleUpload"
                            />
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <!-- 已提交 -->
        <template v-if="isSubmit">
            <div class="submit-success">
                <img src="@images/mall/order/submit-success.png" />
                <p class="success-title">{{ $t('mall.submit_success') }}</p>
                <p class="success-text">
                    {{ $t('mall.recharge_progress_pre') }}
                    <a
                        @click="
                            routerChange('/distributor/distributor-recharge-detail', { id: id, currency: org.currency })
                        "
                        >{{ $t('mall.recharge_progress') }}</a
                    >
                    {{ $t('mall.recharge_progress_next') }}
                </p>
                <MyButton type="line" @clickFn="back" padding="6px 16px">
                    {{ $t('supply-chain.back') }}
                </MyButton>
            </div>
        </template>
        <!-- 底部支付栏 -->
        <template v-if="!isSubmit">
            <div class="settlement-fixed">
                <div class="settlement-fixed-body">
                    <MyButton v-if="current < steps.length - 1" type="primary" @clickFn="next" :disabled="!can_next">
                        {{ $t('mall.next_step') }}
                    </MyButton>
                    <MyButton v-if="current > 0" type="line" @clickFn="prev">{{ $t('mall.previous_step') }}</MyButton>
                    <MyButton
                        v-if="current == steps.length - 1"
                        style="margin-left: 24px"
                        type="primary"
                        @clickFn="submit"
                    >
                        {{ $t('common.submit') }}
                    </MyButton>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import Core from '@/core';
import { ref, reactive, getCurrentInstance, onMounted, computed } from 'vue';
import MyUpload from './components/upload.vue';
import MyButton from '../../../components/common/MyButton.vue';
import PaymentInformation from '../../../components/common/payment-information.vue';
import { useRoute, useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();

const route = useRoute();
const router = useRouter();
const id = ref('');
const orgId = ref(route.query?.id || Core.Data.getOrgId()); // 分销商id
const orgType = Core.Data.getOrgType();
const steps = [
    {
        title: 'mall.step_one_title',
        content: '请先填写充值金额 ，并将对应钱款转到收款账户',
    },
    {
        title: 'mall.step_two_title',
        content: '提交付款凭证',
    },
];
const formRef = ref();
const formState = reactive({
    vehicle_balance: '',
    part_balance: '',
});
const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
const isMobile = ref(false);
const isWrite = ref(true);
const myUpload = ref(null);
const detail = reactive({
    target_type: 100, //100 分销商充值审核
    distributor_id: '', //分销商id
    content: {
        vehicle_balance: '', //整车充值金额
        part_balance: '', // 零部件充值金额
        total_amount: '', //总充值金额
        recharge_uid: '',
        payment_information: {
            beneficiary_bank: '', //收款行
            swift_code: '', //银行代码
            bank_address: '', //银行地址
            account_number: '', //账号
            company_name: '', //公司名称
            company_address: '', //公司地址
            remark: '', //备注
            img: [], //图片
        },
    },
});
const accoutMes = reactive({
    beneficiary_bank: '-',
    swift_code: '-',
    bank_address: '-',
    account_number: '-',
    company_name: '-',
    company_address: '-',
    remark: '-',
});
const can_next = computed(() => {
    if (formState.vehicle_balance || formState.part_balance) {
        return true;
    } else {
        return false;
    }
});
const amount_price = computed(() => {
    return Number(formState.vehicle_balance || 0) + Number(formState.part_balance || 0);
});
const currency = ref('€');
const org = Core.Data.getOrgObj();
const current = ref(0);
const isSubmit = ref(false);
const uploadClass = ref('normal');
const next = async () => {
    try {
        const values = await formRef.value.validateFields();
        console.log('Success:', values);
        current.value++;
    } catch (errorInfo) {
        console.log('Failed:', errorInfo);
    }
};
const prev = () => {
    current.value--;
};
const submit = () => {
    Object.assign(detail, {
        target_type: 100, //100 分销商充值审核
        distributor_id: orgId.value, //分销商id
        content: {
            vehicle_balance: formState.vehicle_balance, //整车充值金额
            part_balance: formState.part_balance, // 零部件充值金额
            total_amount: amount_price.value, //总充值金额
            recharge_uid: '',
            payment_information: {
                beneficiary_bank: accoutMes.beneficiary_bank, //收款行
                swift_code: accoutMes.swift_code, //银行代码
                bank_address: accoutMes.bank_address, //银行地址
                account_number: accoutMes.account_number, //账号
                company_name: accoutMes.company_name, //公司名称
                company_address: accoutMes.company_address, //公司地址
                remark: accoutMes.remark, //备注
                img: detail.content.payment_information.img.map(item => item.file),
            },
        },
    });
    Core.Api.RechargeAudit.save({ ...detail })
        .then(res => {
            proxy.$message.success(proxy.$t('mall.recharged_successfully'));
            id.value = res.id;
            isSubmit.value = true;
        })
        .catch(err => {});
};
const handleUpload = fileList => {
    myUpload.value.updateFile(detail.content.payment_information.img);
    if (fileList.length === 0) {
        uploadClass.value = 'error';
    } else {
        uploadClass.value = 'normal';
    }
};
const checkPrice = (_, value) => {
    if (!value || Number(value) >= 0) {
        return Promise.resolve();
    }
    return Promise.reject(new Error('Price must be greater than zero!'));
};
const TestCopyBox = id => {
    const divElement = document.getElementById(id);
    if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(divElement);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
        proxy.$message.success('Copy Success');
    }
};
const back = () => {
    location.reload();
};
// 路由跳转
const routerChange = (routeUrl, item = {}, type = 1) => {
    switch (type) {
        case 1:
            router.push({
                path: routeUrl,
                query: item,
            });
            break;
        case 2:
            const path = router.resolve({
                path: routeUrl,
                query: item,
            });
            window.open(path.href, '_blank');
            break;
        default:
            break;
    }
};
const findAccount = () => {
    const params = { id: orgId.value };
    Core.Api.Distributor.findAccount({ ...params })
        .then(res => {
            Object.assign(accoutMes, res.pay_in_account_bank);
        })
        .catch(err => {});
};
onMounted(() => {
    if (Core.Data.getCurrency() === 'EUR') {
        currency.value = '€';
    } else {
        currency.value = '$';
    }
    findAccount();
});
</script>

<style lang="less" scoped src="../css/layout.css"></style>
<style lang="less" scoped>
#recharge {
    min-height: calc(100vh - var(--header-h-pc-mall));
    .content {
        padding-top: 48px;
    }
    .submit-success {
        min-height: calc(100vh - var(--header-h-pc-mall));
        .flex(center, center);
        .success-title {
            font-size: 18px;
            font-weight: 500;
            line-height: 22px;
            color: #26ab54;
            margin-bottom: 5px;
        }
        .success-text {
            font-size: 12px;
            font-weight: 400;
            line-height: 22px;
            color: #666666;
            margin-bottom: 16px;
            > a {
                color: #26ab54;
            }
        }
    }
    .steps {
        .step-body {
            .flex(initial, initial, row);
            .step-item {
                flex: 1;
                .fcc();
                padding: 0 84px;
                min-height: 64px;
                overflow: hidden;
                background: url('../../../assets/images/mall/order/step-bg.png') no-repeat center;
                background-size: 100% 100%;
                .step-text {
                    color: rgba(143, 0, 255, 0.5);
                    font-size: 16px;
                    font-weight: 500;
                    line-height: 22px;
                    text-align: center;
                }
                &:nth-child(1) {
                    background-image: url('../../../assets/images/mall/order/step-bg.png');
                    .step-text {
                        color: rgba(255, 255, 255, 0.5);
                    }
                    &.active {
                        .step-text {
                            color: #ffffff;
                        }
                        background-image: url('../../../assets/images/mall/order/step-bg.png');
                    }
                }
                &:nth-child(2) {
                    background-image: url('../../../assets/images/mall/order/step-bg2.png');
                    &.active {
                        .step-text {
                            color: #ffffff;
                        }
                        background-image: url('../../../assets/images/mall/order/step-bg-active2.png');
                    }
                }
            }
        }
    }
    .steps-content {
        min-height: 200px;
        .title {
            margin: 42px 0 20px 0;
            color: #000;
            font-size: 32px;
            font-weight: 500;
            line-height: 39px;
        }
        .form-body {
            padding: 56px 72px;
            background: #fff;
            :deep(.ant-row) {
                .ant-form-item-label {
                    padding-bottom: 21px;
                    > label {
                        color: #000;
                        font-size: 24px;
                        line-height: 24px;
                    }
                }
                .ant-form-item-control {
                    .ant-input-affix-wrapper {
                        padding: 32px;
                        border-radius: 0;
                        border-color: #bfbfbf;
                        .ant-input {
                            font-size: 35px;
                            line-height: 36px !important;
                            color: #8f00ff;
                            &::-webkit-input-placeholder {
                                color: #bfbfbf;
                                font-size: 24px;
                                line-height: 24px;
                            }
                        }
                        input:-internal-autofill-previewed,
                        input:-internal-autofill-selected {
                            -webkit-text-fill-color: #8f00ff;
                            transition: background-color 5000s ease-out 0.5s;
                        }
                        .ant-input-suffix {
                            font-size: 35px;
                            line-height: 36px !important;
                            color: #999999 !important;
                        }
                    }
                }
            }
            .amount {
                .flex(initial, center, row);
                width: 100%;
                padding: 39px 32px;
                margin-top: 24px;
                background: #f8f8f8;
                .amount-text {
                    font-size: 24px;
                    line-height: 24px;
                    color: #666;
                    margin-right: 24px;
                }
                .amount-price {
                    font-size: 36px;
                    font-weight: 500;
                    line-height: 36px;
                    color: #8f00ff;
                }
            }
        }
        .deposit-payment {
            .title {
                .deposit-payment-row-left {
                    color: #333;
                    font-family: Montserrat;
                    font-size: 18px;
                    font-weight: 600;
                    letter-spacing: 0.72px;
                }
                .deposit-payment-row-right {
                    color: #666;
                    font-family: Montserrat;
                    font-size: 14px;
                    letter-spacing: 0.56px;
                }
            }
            .payment-bank-body {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                height: 46px;
                width: 46px;
                border-radius: 50%;
                background-color: #eee;
            }
            &-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                &-left {
                    color: #333;
                    display: flex;
                    align-items: center;
                }
                &-right {
                    color: #333;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                }
            }
        }
        .upload-body {
            position: relative;
            background: #fff;
            padding: 40px 84px;
            .record {
                position: absolute;
                top: 40px;
                right: 84px;
                font-weight: 500;
                line-height: 21px;
                color: #8f00ff;
                cursor: pointer;
            }
        }
    }

    .steps-action {
        margin-top: 24px;
    }

    [data-theme='dark'] .steps-content {
        background-color: #2f2f2f;
        border: 1px dashed #404040;
    }
    // 输入框样式
    input {
        flex: 1;
        border: 1px solid #eee;
        background: #f5f5f5;
        color: #333;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%;
        /* 18px */
        caret-color: #c6f;

        &::-webkit-input-placeholder {
            color: #999;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 150%;
            /* 18px */
        }

        &:focus {
            outline: none;
            box-shadow: none;
        }
    }
    .ant-input-affix-wrapper {
        &:hover {
            border: 1px solid #e2e2e2;
        }
        &.ant-input-affix-wrapper-focused {
            box-shadow: none;
        }
    }
    .settlement-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #fff;
        border-top: 1px solid #e5e6eb;
        z-index: 999;

        .settlement-fixed-body {
            height: 72px;
            width: 75%;
            margin: 0 auto;
            padding: 12px 0;
            padding-left: 24px;
            .flex(center, center, row);

            #my-button {
                width: 338px;
            }
        }
    }

    @media (min-width: 820px) {
    }

    @media (max-width: 820px) {
    }
}
</style>
