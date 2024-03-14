<template>
    <div id="pending-payment">
        <div class="content">
            <!-- 订单信息 -->
            <div class="order-mes box">
                <p class="box-title">{{ $t('mall.pending_payment_order') }}</p>
                <div class="box-content" style="padding: 0">
                    <OrderInformation :list="vehicleList" :unit="currency" />
                </div>
            </div>
            <div class="payment-balance">
                <!-- 支付信息 -->
                <div class="pay">
                    <p class="pay-title">{{ $t('p.Payment_information') }}</p>
                    <PaymentInformation :mes="mes" />
                </div>
                <!-- 余额信息 -->
                <div class="balance">
                    <p class="balance-title">{{ $t('mall.balance_information') }}</p>
                    <div class="balance-content">
                        <div class="balance-item">
                            <div class="recharge">
                                <span class="recharge-balance"
                                    >{{ $t('mall.balance_vehicle') }}：<span class="price"
                                        >{{ currency }} 6000</span
                                    ></span
                                >
                                <div class="btn">
                                    <MyButton padding="12px 32px" @clickFn="routerChange('/mall/recharge')">
                                        <img class="account-balance" src="@images/mall/order/account-balance.png" />
                                        {{ $t('mall.top_up') }}
                                    </MyButton>
                                </div>
                            </div>
                            <p class="dis warn">
                                {{ $t('mall.insufficient_balance') }} {{ currency }}1000 {{ $t('mall.required') }}
                            </p>
                            <div class="input">
                                <span class="key">{{ $t('mall.this_time_use') }}：</span>
                                <a-input v-model:value="price" :suffix="currency" style="width: 268px" />
                            </div>
                        </div>
                        <div class="balance-item">
                            <div class="recharge">
                                <span class="recharge-balance"
                                    >{{ $t('mall.parts_vehicle') }}：<span class="price"
                                        >{{ currency }} 6000</span
                                    ></span
                                >
                                <div class="btn">
                                    <MyButton padding="12px 32px" @clickFn="routerChange('/mall/recharge')">
                                        <img class="account-balance" src="@images/mall/order/account-balance.png" />
                                        {{ $t('mall.top_up') }}
                                    </MyButton>
                                </div>
                            </div>
                            <p class="dis">{{ $t('mall.occupies') }} {{ currency }}3500</p>
                            <div class="input">
                                <span class="key">{{ $t('mall.this_time_use') }}：</span>
                                <a-input v-model:value="price" :suffix="currency" style="width: 268px" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部支付栏 -->
        <div class="settlement-fixed">
            <div class="settlement-fixed-body">
                <div class="settlement">
                    <div class="settlement-mes">
                        <div class="settlement-price">
                            <span class="dis"> {{ $t('mall.payable_amount') }}: </span>
                            <span class="price"> {{ currency }} {{ 6000 }} </span>
                        </div>
                        <p class="settlement-balance warn">
                            {{ $t('mall.top_up_first') }}
                        </p>
                    </div>
                    <my-button
                        showRightIcon
                        type="primary"
                        padding="12px 32px"
                        font="14px"
                        @click.native="handlePayOrder"
                    >
                        {{ $t('mall.pay_now') }}
                    </my-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Core from '@/core';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MyButton from '@/components/common/MyButton.vue';
import OrderInformation from './components/order-information.vue';
import PaymentInformation from '../../../components/common/payment-information.vue';

const router = useRouter();

const currency = ref('€');
const price = ref('');
const vehicleList = ref([
    { name: '', product: '', price: 0, item: { name: '' } },
    { name: '', product: '', price: 0, item: { name: '' } },
]);
const mes = {
    accountHolder: '123',
    accountNickname: '-',
    IBAN: '-',
    SWIFTBIC: '-',
    bankName: '-',
};
const handlePayOrder = () => {};
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
#pending-payment {
    min-height: calc(100vh - var(--header-h-pc-mall));
    .content {
        padding-top: 48px;
    }
    .box {
        margin-bottom: 48px;
        .box-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 16px;
        }
        .box-content {
            background-color: #fff;
            padding: 20px;
        }
    }
    .payment-balance {
        .flex(initial,initial,row);
        .pay {
            flex: 1;
            .flex(initial,initial);
            .pay-title {
                font-size: 24px;
                line-height: 24px;
                margin-bottom: 25px;
            }
        }
        .balance {
            .flex(initial, initial);
            flex: 1;
            margin-left: 40px;
            .balance-title {
                font-size: 24px;
                line-height: 24px;
                margin-bottom: 25px;
            }
            .balance-content {
                flex: 1;
                background-color: #fff;
                padding: 40px 30px 40px 56px;
                position: relative;
                .balance-item {
                    &:nth-child(n + 2) {
                        margin-top: 32px;
                    }
                    .recharge {
                        .flex(space-between, center, row);
                        .recharge-balance {
                            color: #666;
                            font-size: 14px;
                            line-height: 21px;
                            .price {
                                color: #000;
                                font-size: 20px;
                                font-weight: 500;
                                line-height: 30px;
                            }
                        }
                        .account-balance {
                            margin-right: 1.5px;
                            width: 18px;
                            height: 18px;
                        }
                    }
                    .dis {
                        color: #333333;
                        font-size: 14px;
                        line-height: 21px;
                        &.warn {
                            color: #ff3636;
                        }
                    }
                    .input {
                        .flex(initial, center, row);
                        margin-top: 8px;
                        .key {
                            white-space: nowrap;
                        }
                    }
                }
            }
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
            .flex(flex-end, center, row);

            .sub-price {
                .flex(initial, center, row);
                flex-wrap: wrap;
                .sub-price-item {
                    margin-right: 32px;
                    > span {
                        &:nth-of-type(1) {
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 20px;
                            color: #86909c;
                        }
                        &:nth-of-type(2) {
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 20px;
                            color: #1d2129;
                        }
                    }
                }
            }

            .settlement {
                .flex(initial, center, row);
                .settlement-mes {
                    margin-right: 24px;
                    .settlement-price {
                        .flex(initial, center, row);
                    }
                }
                .settlement-balance {
                    line-height: 21px;
                    color: #666666;
                    text-align: right;
                    &.warn {
                        color: #ff3636;
                    }
                }
                .select-nums {
                    color: #000;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 24px;
                    margin-right: 24px;

                    .nums {
                        background: linear-gradient(100deg, #c6f 0%, #66f 100%);
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }

                .dis {
                    color: #000;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 24px;
                    white-space: nowrap;
                    margin-right: 8px;
                }

                .price {
                    color: #ff3636;
                    font-size: 24px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 29px;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>
