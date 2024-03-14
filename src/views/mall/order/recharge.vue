<template>
    <div id="recharge">
        <div class="content">
            <!-- 未提交 -->
            <template v-if="!isSubmit">
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
                            <a-form
                                ref="formRef"
                                :model="formState"
                                name="dynamic_rule"
                                v-bind="formItemLayout"
                                labelAlign="left"
                            >
                                <a-form-item
                                    label="Price"
                                    name="price"
                                    :rules="[{ required: true, message: 'Please input your price!' }]"
                                >
                                    <a-input v-model:value="formState.price" :suffix="currency" />
                                </a-form-item>
                                <a-form-item
                                    label="Price2"
                                    name="price2"
                                    :rules="[{ required: true, message: 'Please input your price2!' }]"
                                >
                                    <a-input v-model:value="formState.price2" :suffix="currency" />
                                </a-form-item>
                            </a-form>
                            <p class="title">{{ $t('p.Payment_information') }}</p>
                            <PaymentInformation />
                        </template>
                        <!-- 第二步 -->
                        <template v-if="current === 1">
                            <div class="documents-row">
                                <div class="documents-row-key" :class="uploadClass">Certificate Upload</div>
                                <div class="documents-row-label">
                                    <MyUpload
                                        ref="myUpload"
                                        :isWrite="isWrite"
                                        :defaultList="detail.file"
                                        :type="isMobile ? 'image' : 'file'"
                                        @handleUpload="handleUpload"
                                    />
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
            <!-- 已提交 -->
            <template v-else>
                <div>
                    <p>{{ $t('mall.submit_success') }}</p>
                    <p>
                        {{ $t('mall.recharge_progress_pre') }}<a href="">{{ $t('mall.recharge_progress') }}</a
                        >{{ $t('mall.recharge_progress_next') }}
                    </p>
                </div>
            </template>
        </div>
        <!-- 底部支付栏 -->
        <template v-if="!isSubmit">
            <div class="settlement-fixed">
                <div class="settlement-fixed-body">
                    <MyButton v-if="current < steps.length - 1" type="primary" @clickFn="next">
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
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import MyUpload from './components/upload.vue';
import MyButton from '../../../components/common/MyButton.vue';
import PaymentInformation from '../../../components/common/payment-information.vue';

const { proxy } = getCurrentInstance();
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
    price: '',
    price2: '',
});
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const isMobile = ref(false);
const isWrite = ref(true);
const myUpload = ref(null);
const detail = reactive({
    // 车辆类型（1.SENMENTI 0；2.SENMENTI X；3.SENMENTI 11）
    car_type: '',
    price: 128000,
    amount: 10,
    // 订单编号
    sn: '',
    create_time: Date.now(),
    // 状态：待付款：100；待审核：110；审核不通过：120
    status: 100,
    // 订单类型：0.个人预定，1.企业预定
    type: 0,
    file: [],
});
const accout = reactive({
    accountHolder: 'HORWIN EUROPE B.V.',
    accountNickname: 'EUR Receive Account',
    IBAN: 'IE40CHAS93090301193061',
    SWIFTBIC: 'CHASIE4L',
    bankName: 'J.P. MORGAN BANK LUXEMBOURG S.A., DUBLIN BRANCH',
    bankAddress: '200 Capital Dock 79 Sir John Rogersons Quay Dublin 2 D02 RK57',
});
const currency = ref('€');
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
    isSubmit.value = true;
};
const handleUpload = fileList => {
    detail.file = fileList;
    console.log(detail.file);
    myUpload.value.updateFile(detail.file);
    if (fileList.length === 0) {
        uploadClass.value = 'error';
    } else {
        uploadClass.value = 'normal';
    }
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
onMounted(() => {
    if (Core.Data.getCurrency() === 'EUR') {
        currency.value = '€';
    } else {
        currency.value = '$';
    }
});
</script>

<style lang="less" scoped src="../css/layout.css"></style>
<style lang="less" scoped>
#recharge {
    min-height: calc(100vh - var(--header-h-pc-mall));
    .content {
        padding-top: 48px;
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
                &.active {
                    .step-text {
                        color: #ffffff;
                    }
                    background-image: url('../../../assets/images/mall/order/step-bg-active.png');
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
