<template>
    <div id="pending-payment">
        <div class="content">
            <!-- 订单信息 -->
            <div class="order-mes box">
                <p class="box-title">Pending Payment Order</p>
                <div class="box-content">
                    <table style="width: 100%">
                        <tbody v-if="vehicleList.length !== 0" class="list-body">
                            <tr v-for="item in vehicleList" class="row">
                                <td
                                    v-for="columnsItem in columns"
                                    class="row-item"
                                    :class="
                                        (!item.flag_item_valid ? 'invalid' : '',
                                        columnsItem.dataIndex === 'check' ? 'row-item-check' : '')
                                    "
                                >
                                    <template v-if="columnsItem.dataIndex === 'product'">
                                        <div class="product">
                                            <div class="product-img">
                                                <a-image :src="$Util.imageFilter(item?.item?.logo, 5)" />
                                            </div>
                                            <div class="product-mes">
                                                <p
                                                    class="name"
                                                    :title="item?.item[$Util.regionalUnitMoney().name_index]"
                                                >
                                                    {{ item?.item[$Util.regionalUnitMoney().name_index] }}
                                                </p>
                                                <p class="code">{{ item?.item?.code ? item?.item?.code : '-' }}</p>
                                                <p class="version" @click="showDrawer(item)" v-if="item?.item.set_id">
                                                    <span>
                                                        {{ $Util.itemSpecFilter(item.item.attr_list, lang) }}
                                                    </span>
                                                    <svg-icon
                                                        icon-class="cart-arrow-right"
                                                        class-name="cart-arrow-right"
                                                    />
                                                    <svg-icon
                                                        icon-class="cart-arrow-right-active"
                                                        class-name="cart-arrow-right-active"
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="columnsItem.dataIndex === 'price'">
                                        <span class="row-text unit-price"
                                            >{{ currency
                                            }}{{
                                                $Util.Number.numFormat(
                                                    $Util.countFilter(
                                                        item?.item[$Util.Number.getStepPriceIndexByNums(item.amount)],
                                                    ),
                                                )
                                            }}</span
                                        >
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- 支付信息 -->
            <div class="order-mes box">
                <p class="box-title">Pending Payment Order</p>
                <div class="box-content"></div>
            </div>
            <!-- 余额信息 -->
            <div class="order-mes box">
                <p class="box-title">Pending Payment Order</p>
                <div class="box-content">
                    <div class="recharge">
                        <span> 整车可用余额：€ 6000 （余额不足，请先充值，至少还需充值 € 1000） </span>
                        <MyButton type="primary" @clickFn="routerChange('/mall/recharge')">
                            {{ '充值' }}
                        </MyButton>
                    </div>
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

const router = useRouter();

const currency = ref('€');
const columns = [
    {
        title: 'purchase.product_information',
        dataIndex: 'product',
        key: 'product',
    },
    {
        title: 'purchase.unit_price',
        dataIndex: 'price',
        key: 'price',
        width: 200,
    },
];
const vehicleList = ref([
    { name: '', product: '', price: 0, item: { name: '' } },
    { name: '', product: '', price: 0, item: { name: '' } },
]);
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
    .box {
        margin-bottom: 20px;
        .box-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 16px;
        }
        .box-content {
            background-color: #fff;
            padding: 20px;
            .list-body {
                background: #fff;

                > tr td {
                    text-align: left;
                    padding: 0 0 40px 0;
                    color: #000;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 150%;
                    padding-left: 12px;

                    &:first-child {
                        padding-left: 24px;
                    }

                    &:last-child {
                        padding-right: 56px;
                        text-align: right;
                    }
                }
            }

            .row {
                user-select: none;

                &.row-title {
                    > td {
                        text-align: left;
                        padding: 24px 0;
                        color: #000;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: 150%;
                        padding-left: 12px;

                        &:first-child {
                            padding-left: 24px;
                        }

                        &:last-child {
                            padding-right: 56px;
                            text-align: right;
                        }
                    }
                }

                .row-item {
                    margin-right: 10px;
                    vertical-align: top;

                    &:last-child {
                        margin-right: 0;
                    }

                    &.operation-row {
                        .flex(initial, flex-end, column);
                    }

                    .row-text {
                        color: #000;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: 150%;

                        /* 21px */
                        &.select-all-text {
                            margin-right: 20px;
                            width: 144px;
                            min-width: 86px;
                        }

                        &.price {
                            color: #8f00ff;
                            font-size: 20px;
                            font-style: normal;
                            font-weight: 700;
                            line-height: normal;
                            margin-top: 4px;
                            display: inline-block;
                        }

                        &.delete {
                            color: #ff3636;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: 150%;
                            margin-top: 8px;
                            cursor: pointer;
                        }

                        &.unit-price {
                            display: inline-block;
                            margin-top: 5px;
                        }
                    }

                    .count {
                        padding: 7px 20px;
                        background: #f5f5f5;
                        color: #1d2129;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: 18px;
                        cursor: pointer;
                    }

                    .count-edit {
                        /deep/.ant-input-number {
                            width: 137px;
                            box-shadow: 0 0 0 0;
                            border: 0;
                            position: relative;
                            text-align: center;
                            background-color: #fff;

                            .ant-input-number-input-wrap {
                                margin: 0 40px;
                                background: #f5f5f5;

                                .ant-input-number-input {
                                    color: #1d2129;
                                    text-align: center;
                                    font-size: 12px;
                                    font-style: normal;
                                    font-weight: 500;
                                    line-height: 27px;
                                    /* 135% */
                                    height: 32px;
                                }
                            }

                            .ant-input-number-handler-wrap {
                                width: 0;
                                height: 0;
                                position: static;
                                opacity: 1;
                                visibility: hidden;

                                .ant-input-number-handler {
                                    .fcc();
                                    visibility: visible;
                                    height: 32px;
                                    width: 32px;
                                    background: #f5f5f5;
                                    border: none;
                                    position: absolute;
                                    border: 0;
                                    box-sizing: border-box;

                                    &:hover {
                                        height: 32px !important;
                                        opacity: 0.7;
                                    }

                                    .anticon {
                                        display: none;
                                    }

                                    &.ant-input-number-handler-down {
                                        left: 0;

                                        &::before {
                                            border-radius: 20px;
                                            display: inline-block;
                                            content: '';
                                            width: 12px;
                                            height: 1px;
                                            background: #1c1b1f;
                                            border-radius: 20px 20px 20px 20px;
                                            opacity: 1;
                                        }
                                    }

                                    &.ant-input-number-handler-up {
                                        right: 0;

                                        &::before,
                                        &::after {
                                            position: absolute;
                                            display: inline-block;
                                            content: '';
                                            background: #1c1b1f;
                                            border-radius: 20px;
                                        }

                                        &::before {
                                            width: 12px;
                                            height: 1px;
                                        }

                                        &::after {
                                            height: 12px;
                                            width: 1px;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    .product {
                        .flex(initial, initial, row);

                        .product-img {
                            border: 1px solid #eee;
                            width: 120px;
                            height: 120px;
                            min-width: 120px;

                            :deep(.ant-image) {
                                height: 100%;
                                width: 100%;

                                .ant-image-img {
                                    object-fit: cover;
                                    height: 100%;
                                }
                            }
                        }

                        .product-mes {
                            margin-left: 24px;

                            .name {
                                .ellipsis(1);
                                color: #000;
                                font-size: 20px;
                                font-style: normal;
                                font-weight: 500;
                                line-height: 150%;
                            }

                            .code {
                                color: #666;
                                font-size: 14px;
                                font-style: normal;
                                font-weight: 400;
                                line-height: 150%;
                                margin-top: 8px;
                            }

                            .version {
                                .flex(initial, center, row);
                                display: inline-flex;
                                color: #333;
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 400;
                                line-height: 150%;
                                padding: 8px;
                                background: #f5f5f5;
                                margin-top: 12px;
                                cursor: pointer;

                                .cart-arrow-right {
                                    display: inline-block;
                                }

                                .cart-arrow-right-active {
                                    display: none;
                                }

                                .cart-arrow-right,
                                .cart-arrow-right-active {
                                    width: 16px;
                                    height: 16px;
                                    min-width: 16px;
                                    margin-left: 24px;
                                }

                                &:hover {
                                    color: #8f00ff;

                                    .cart-arrow-right {
                                        display: none;
                                    }

                                    .cart-arrow-right-active {
                                        display: inline-block;
                                    }
                                }
                            }
                        }
                    }

                    &.invalid {
                        &:not(:last-child) {
                            opacity: 0.4;
                            user-select: none;
                            pointer-events: none;
                        }

                        &:last-child {
                            .operation {
                                .price {
                                    opacity: 0.4;
                                    user-select: none;
                                    pointer-events: none;
                                }
                            }
                        }

                        .check-box {
                            display: none;
                        }

                        .invalid-box {
                            display: block;
                        }
                    }
                }

                .row-item-check {
                    vertical-align: inherit;
                }
            }
            .recharge {
                .fcc(space-between, center);
            }
        }
    }
}
</style>
