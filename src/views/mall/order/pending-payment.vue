<template>
    <div id="pending-payment">
        <div class="content">
            <!-- 订单信息 -->
            <div class="order-mes box">
                <p class="box-title">
                    {{ $t('mall.pending_payment_order') }}
                </p>
                <div class="box-content" style="padding: 0">
                    <OrderInformation :list="detail.item_list" :unit="unit" :isConfirmPrice="true" />
                </div>
            </div>
            <div class="payment-balance">
                <!-- 支付信息 -->
                <div class="pay">
                    <p class="pay-title">{{ $t('p.Payment_information') }}</p>
                    <div class="payment">
                        <div class="payment-content">
                            <div class="deposit-payment" id="deposit-payment">
                                <div class="deposit-payment-row border-bottom">
                                    <div class="deposit-payment-row-left">{{ $t('mall.payment_method') }}:</div>
                                    <div class="deposit-payment-row-right">
                                        {{
                                            mes.pay_type ? Core.Const.DISTRIBUTOR.PAY_TIME_LIST[mes.pay_type][lang] : ''
                                        }}
                                        <span v-if="pay_type === Core.Const.DISTRIBUTOR.PAY_TIME.OA">
                                            {{
                                                `(${$t('mall.balance_payment')}${mes.pay_final_pay_ratio}%，${$t('mall.account_period')}${detail.pay_oa_day}${$t('mall.days')})`
                                            }}
                                        </span>
                                    </div>
                                </div>
                                <div class="deposit-payment-row">
                                    <div class="deposit-payment-row-left">{{ $t('p.total') }}:</div>
                                    <div class="deposit-payment-row-right">
                                        {{ unit }} {{ proxy.$Util.Number.numFormat(sum_price) }}
                                    </div>
                                </div>
                                <div class="deposit-payment-row">
                                    <div class="deposit-payment-row-left">
                                        {{ mes.pay_pre_pay_ratio }}% {{ $t('mall.advance_payment') }}:
                                    </div>
                                    <div class="deposit-payment-row-right">{{ unit }} {{ pre_price }}</div>
                                </div>
                                <div class="deposit-payment-row">
                                    <!-- 支付尾款 && OA时存在 && 售前 -->
                                    <div
                                        class="select"
                                        @click="changeEnd"
                                        v-if="!isAfter && pay_type === Core.Const.DISTRIBUTOR.PAY_TIME.OA && !isPre"
                                    >
                                        <img
                                            :src="isSelectEnd ? getOrderSrc('selected') : getOrderSrc('select')"
                                            class="select-img"
                                        />
                                    </div>
                                    <div class="deposit-payment-row-left">
                                        {{ mes.pay_final_pay_ratio }}% {{ $t('mall.final_payment') }}:
                                    </div>
                                    <div class="deposit-payment-row-right">{{ unit }} {{ end_price }}</div>
                                </div>
                                <div class="deposit-payment-row">
                                    <div class="deposit-payment-row-left">{{ $t('mall.freight_amount') }}:</div>
                                    <div class="deposit-payment-row-right">
                                        {{
                                            detail.freight_status === Core.Const.DISTRIBUTOR.FREIGHT_STATUS.CONFIRMED
                                                ? `${unit} ${detail.freight}`
                                                : $t('mall.undetermined')
                                        }}
                                    </div>
                                </div>
                                <div class="deposit-payment-row">
                                    <div class="deposit-payment-row-left">{{ $t('mall.this_need') }}:</div>
                                    <div class="deposit-payment-row-right price">{{ unit }} {{ need_pay }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 余额信息 -->
                <div class="balance">
                    <p class="balance-title">{{ $t('mall.balance_information') }}</p>
                    <div class="balance-content">
                        <!-- 售后 -->
                        <template v-if="isAfter">
                            <div class="balance-item">
                                <div class="recharge">
                                    <span class="recharge-balance"
                                        >{{ $t('mall.balance_parts') }}：<span class="price"
                                            >{{ unit }} {{ balanceAfter }}</span
                                        ></span
                                    >
                                    <div class="btn">
                                        <MyButton
                                            v-if="disabled"
                                            padding="12px 32px"
                                            @clickFn="routerChange('/mall/recharge')"
                                        >
                                            <img class="account-balance" src="@images/mall/order/account-balance.png" />
                                            {{ $t('mall.top_up') }}
                                        </MyButton>
                                    </div>
                                </div>
                                <p class="dis warn" v-if="disabled">
                                    {{ $t('mall.insufficient_balance') }} {{ unit }}
                                    {{ need_balance }}
                                    {{ $t('mall.required') }}
                                </p>
                                <div class="input" v-if="isPre">
                                    <span class="key">{{ $t('mall.this_time_use') }}：</span>
                                    <a-input-number
                                        :disabled="true"
                                        v-model:value="need_balance"
                                        :suffix="unit"
                                        style="width: 268px"
                                        :max="need_balance"
                                    />
                                </div>
                            </div>
                            <div class="balance-item" v-if="isPre">
                                <div class="recharge">
                                    <span class="recharge-balance"
                                        >{{ $t('mall.parts_vehicle') }}：<span class="price"
                                            >{{ unit }} {{ balanceParts }}</span
                                        ></span
                                    >
                                </div>
                                <p class="dis">
                                    {{ $t('mall.can_use') }} {{ unit }}
                                    {{ after_price_credit }}
                                </p>
                                <div class="input">
                                    <span class="key">{{ $t('mall.this_time_use') }}：</span>
                                    <a-input-number
                                        v-model:value="this_time_credit"
                                        :suffix="unit"
                                        style="width: 268px"
                                        :min="0"
                                        :max="after_price_credit"
                                    />
                                </div>
                            </div>
                        </template>
                        <!-- 售前 -->
                        <template v-else>
                            <!-- TT & OA -->
                            <div class="balance-item">
                                <div class="recharge">
                                    <span class="recharge-balance"
                                        >{{ $t('mall.balance_vehicle') }}：<span class="price"
                                            >{{ unit }} {{ balance }}</span
                                        ></span
                                    >
                                    <div class="btn">
                                        <MyButton
                                            v-if="disabled"
                                            padding="12px 32px"
                                            @clickFn="routerChange('/mall/recharge')"
                                        >
                                            <img class="account-balance" src="@images/mall/order/account-balance.png" />
                                            {{ $t('mall.top_up') }}
                                        </MyButton>
                                    </div>
                                </div>
                                <p class="dis warn" v-if="disabled">
                                    {{ $t('mall.insufficient_balance') }} {{ unit }}
                                    {{ need_pay }}
                                    {{ $t('mall.required') }}
                                </p>
                                <p class="dis" v-else>{{ $t('mall.required_balance') }} {{ unit }} {{ need_pay }}</p>
                            </div>
                            <!-- OA -->
                            <div class="balance-item" v-if="pay_type === Core.Const.DISTRIBUTOR.PAY_TIME.OA && isPre">
                                <div class="recharge">
                                    <span class="recharge-balance"
                                        >{{ $t('mall.credit_balance') }}：<span class="price"
                                            >{{ unit }}
                                            {{ balanceCredit + end_price /* 授信额度展示原额度 + 已占有额度 */ }}</span
                                        ></span
                                    >
                                </div>
                                <p class="dis">{{ $t('mall.occupies') }} {{ unit }} {{ end_price }}</p>
                            </div>
                        </template>
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
                            <span class="warn" v-if="!isFreightConfirmed">
                                （{{ $t('mall.determined_to_pay') }}）
                            </span>
                            <span class="dis"> {{ $t('mall.payable_amount') }}: </span>
                            <span class="dis" v-if="!isPre && detail.freight_pay_status === 100 && detail.freight">
                                {{ $t('mall.include_freight') }}:
                            </span>
                            <span class="price"> {{ unit }} {{ need_pay }} </span>
                        </div>
                        <p class="settlement-balance warn" v-if="disabled">
                            {{ $t('mall.top_up_first') }}
                        </p>
                    </div>
                    <my-button
                        showRightIcon
                        type="primary"
                        padding="12px 32px"
                        font="14px"
                        :disabled="disabled || !isFreightConfirmed"
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
import { ref, onMounted, reactive, computed, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MyButton from '@/components/common/MyButton.vue';
import OrderInformation from './components/order-information.vue';
import { useStore } from 'vuex';

const store = useStore();
const { proxy } = getCurrentInstance();
const orderModules = import.meta.globEager('@/assets/images/mall/order/*');

const route = useRoute();
const router = useRouter();

const id = ref(route.query?.id || '');
const orgId = Core.Data.getOrgId();
const orgType = Core.Data.getOrgType();
const org = Core.Data.getOrgObj();
const unit = ref('€');
const pay_type = ref(''); // 60:TT 70:OA
const isSelectEnd = ref(true); // 是否选中支付尾款
const isAfter = ref(''); // 售前
const detail = reactive({});
const balance = ref(0); // 售前余额
const balanceAfter = ref(0); // 售后余额
const balanceParts = ref(0); // 备件余额
const balanceCredit = ref(0); // 授信账户
const this_time_credit = ref(null);
const lang = computed(() => {
    return store.state.lang;
});
const disabled = computed(() => {
    if (JSON.stringify(detail) == '{}') return true;
    if (isAfter.value) {
        // 售后
        return balance.value < pre_price.value;
    } else {
        if (
            pay_type.value === Core.Const.DISTRIBUTOR.PAY_TIME.TT ||
            pay_type.value === Core.Const.DISTRIBUTOR.PAY_TIME.OA
        ) {
            return balance.value < need_pay.value;
        } else {
            return true;
        }
    }
});
const isFreightConfirmed = computed(() => {
    if (isPre.value) return true; // 预付款不做判断
    return detail.freight_status === Core.Const.DISTRIBUTOR.FREIGHT_STATUS.CONFIRMED;
});
const isPre = computed(() => {
    if (
        detail.status === Core.Const.PURCHASE.STATUS.WAIT_PAY &&
        detail.payment_status === Core.Const.PURCHASE.PAYMENT_STATUS.WAIT_PAY
    ) {
        return true;
    } else if (
        detail.status === Core.Const.PURCHASE.STATUS.WAIT_PAY &&
        detail.payment_status === Core.Const.PURCHASE.PAYMENT_STATUS.PAYING
    ) {
        return false;
    }
});
const mes = computed(() => {
    return {
        pay_type: pay_type.value,
        pay_pre_pay_ratio: detail.pay_pre_pay_ratio,
        pay_final_pay_ratio: 100 - detail.pay_pre_pay_ratio,
        freight_pay_status: '-',
    };
});
const sum_price = computed(() => {
    let sum = 0;
    if (!detail.item_list || detail.item_list.length === 0) return sum;
    detail.item_list.forEach(item => {
        if (!item.item?.isGift) {
            sum += item?.price;
        }
    });
    return Core.Util.countFilter(sum);
});
// 预付款(售前)
const pre_price = computed(() => {
    return Math.ceil(sum_price.value * detail.pay_pre_pay_ratio) / 100;
});
// 尾款(售前)
const end_price = computed(() => {
    return parseFloat((sum_price.value - pre_price.value).toFixed(4));
});
// 全款(售后)
const after_price = computed(() => {
    return sum_price.value;
});
// 售后备件
const after_price_credit = computed(() => {
    if (Math.ceil(need_pay.value * detail.spare_part_deduction_ratio) / 100 < balanceParts.value) {
        return Math.ceil(need_pay.value * detail.spare_part_deduction_ratio) / 100;
    } else {
        return balanceParts.value;
    }
});
// 需付余额
const need_balance = computed(() => {
    if (!isPre.value) return freight_price.value; // 部分付款后支付运费
    return parseFloat((sum_price.value - this_time_credit.value).toFixed(4));
});
const need_pay = computed(() => {
    if (isAfter.value) {
        return isPre.value ? after_price.value : freight_price.value;
    } else {
        return isPre.value
            ? pre_price.value
            : isSelectEnd.value || pay_type.value === Core.Const.DISTRIBUTOR.PAY_TIME.TT
              ? freight_price.value + end_price.value
              : freight_price.value;
    }
});
// 是否已支付运费-运费
const freight_price = computed(() => {
    return detail.freight_pay_status === 100 ? Number(detail.freight) : 0;
});
const getOrderSrc = (name, type = 'png') => {
    const path = `../../../assets/images/mall/order/${name}.${type}`;
    return orderModules[path]?.default || '';
};
const getDetail = () => {
    const params = {
        id: id.value,
    };
    Core.Api.Purchase.detail(params)
        .then(res => {
            Object.assign(detail, res.detail);
            detail.item_list = detail.item_list.map(item => {
                Object.assign(item.item, {
                    logo: item.item?.set_id > 0 ? item.item?.imgs : item.item?.logo,
                });
                return item;
            });
            detail.freight = Core.Util.countFilter(detail.freight);
            isAfter.value = detail.type !== Core.Const.PURCHASE.FLAG_ORDER_TYPE.PRE_SALES;
            unit.value = Core.Const.ITEM.MONETARY_TYPE_MAP[detail.currency];
            pay_type.value = detail.pay_type;
            isSelectEnd.value = detail.freight_pay_status === 200;
            getWallet();
            // 假数据

            //售前
            // 预付-TT
            // isAfter.value = false;
            // pay_type.value = 70;
            //尾款-TT
            // isAfter.value = false;
            // pay_type.value = 70;
            // 预付-OA
            // isAfter.value = false;
            // pay_type.value = 60;
            //尾款-OA
            // isAfter.value = false;
            // pay_type.value = 60;

            //售后
            // 预付-TT
            // isAfter.value = true;
            // pay_type.value = 70;
            //尾款-TT
            // isAfter.value = true;
            // pay_type.value = 70;
            // 预付-OA
            // isAfter.value = true;
            // pay_type.value = 60;
            //尾款-OA
            // isAfter.value = true;
            // pay_type.value = 60;
        })
        .catch(err => {
            console.log('handleCreateOrder err', err);
        });
};
const getWallet = async () => {
    const params = {
        org_id: orgId, //组织id
        org_type: orgType, //组织类型
        type: 30, //钱包类型：10.售前余额；20.售后余额；30.售后备件账户；40.授信账户
        currency_type: Core.Const.WALLET.TYPE[detail.currency], //货币类型：1.人民币；2.欧元；3.美元；4.英镑
    };
    balance.value = Core.Util.countFilter(
        (await Core.Api.Purchase.getWallet({ ...params, type: 10 }))?.detail?.balance || 0,
    );
    balanceAfter.value = Core.Util.countFilter(
        (await Core.Api.Purchase.getWallet({ ...params, type: 20 }))?.detail?.balance || 0,
    );
    balanceParts.value = Core.Util.countFilter(
        (await Core.Api.Purchase.getWallet({ ...params, type: 30 }))?.detail?.balance || 0,
    );
    balanceCredit.value = Core.Util.countFilter(
        ((await Core.Api.Purchase.getWallet({ ...params, type: 40 }))?.detail?.balance || 0) + Number(org.credit),
    );
};
const handlePayOrder = () => {
    let subject;
    if (isPre.value) {
        // 预付
        if (isAfter.value) {
            // 售后
            if (this_time_credit.value > 0) {
                subject = 40;
            } else {
                subject = 30;
            }
        } else {
            // 售前
            subject = 10;
        }
    } else {
        // 尾款
        if (isAfter.value) {
            // 售后
            subject = 50;
        } else {
            // 售前
            if (isSelectEnd.value) {
                // 选择支付尾款
                subject = detail.freight_pay_status === 100 ? 60 : 20;
            } else {
                subject = pay_type.value === Core.Const.DISTRIBUTOR.PAY_TIME.TT ? 60 : 50; // TT 必需付尾款
            }
        }
    }
    const params = {
        id: detail.id, //订单id
        subject: subject, //10.预付款；20.尾款；30.全款（不包含运费）；40.全款并使用备件钱包（不包含运费）；50.运费；60.尾款加运费
        payment: need_pay.value * 100, //支付金额
        spare_part_credit_payment: this_time_credit.value * 100, //备件信用支付金额
    };
    Core.Api.Purchase.pay(params)
        .then(res => {
            proxy.$message.success(proxy.$t('p.payment_success'));
            routerChange('/purchase/purchase-order-self');
        })
        .catch(err => {
            console.log('handleCreateOrder err', err);
        });
};
const changeEnd = () => {
    if (detail.freight_pay_status === 200) return; // 运费已付不能修改
    isSelectEnd.value = !isSelectEnd.value;
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

onMounted(async () => {
    getDetail();
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
    .total-price {
        .fcc();
        .dis {
            color: #000;
            font-size: 12px;
            font-weight: 400;
            line-height: 24px;
            margin-right: 6px;
        }
        .price {
            font-size: 24px;
            font-weight: 700;
            line-height: 29px;
            color: #8f00ff;
        }
    }
    .flex-between {
        .flex(space-between, center, row);
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
            .payment {
                flex: 1;
                .flex(initial,initial);
                .payment-content {
                    flex: 1;
                    background-color: #fff;
                    padding: 40px 40px 40px 56px;
                    .deposit-payment {
                        &-row {
                            position: relative;
                            .flex(initial, center, row);
                            &:nth-child(n + 2) {
                                margin-top: 24px;
                            }
                            &:nth-child(2) {
                                margin-top: 15px;
                            }
                            .select {
                                position: absolute;
                                top: -2px;
                                left: -30px;
                                cursor: pointer;
                                .select-img {
                                    width: 15px;
                                    height: 15px;
                                }
                            }
                            &-left {
                                flex-basis: 220px;
                                font-size: 14px;
                                line-height: 21px;
                                color: #666;
                            }
                            &-right {
                                color: #000;
                                font-size: 14px;
                                font-weight: 500;
                                line-height: 21px;
                                &.price {
                                    font-size: 18px;
                                    color: #8f00ff;
                                }
                            }
                            &.border-bottom {
                                padding-bottom: 8px;
                                border-bottom: 1px solid #efefef;
                                .deposit-payment-row-left {
                                    color: #000;
                                }
                            }
                        }
                    }
                }
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
                        margin-bottom: 16px;
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
                    .warn {
                        color: #ff3636;
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
