<template>
    <table style="width: 100%">
        <tbody v-if="list.length !== 0" class="list-body">
            <tr v-for="(item, index) in list" class="row" :class="[!item.item?.isGift ? '' : 'gift']">
                <td
                    v-for="columnsItem in columns"
                    class="row-item"
                    :class="
                        (!item.flag_item_valid ? 'invalid' : '',
                        columnsItem.dataIndex === 'check' ? 'row-item-check' : '')
                    "
                    :style="{ width: `${columnsItem.width}px` || 'auto' }"
                >
                    <template v-if="columnsItem.dataIndex === 'product'">
                        <div class="product">
                            <div class="product-img">
                                <a-image :src="$Util.imageFilter(item?.item?.logo, 5)" />
                            </div>
                            <div class="product-mes">
                                <p class="name">
                                    <span class="name-text" :title="item?.item[$Util.regionalUnitMoney().name_index]">
                                        {{ item?.item[$Util.regionalUnitMoney().name_index] }}
                                    </span>
                                    <span class="label" v-if="item.item?.isGift">
                                        {{ $t('purchase.free_gift') }}
                                    </span>
                                </p>
                                <p class="code">{{ item?.item?.code ? item?.item?.code : '-' }}</p>
                                <p
                                    class="version"
                                    @click="showDrawer(item)"
                                    v-if="item?.item.set_id && !item.item?.isGift"
                                >
                                    <span>
                                        {{ $Util.itemSpecFilter(item.item.attr_list, lang) }}
                                    </span>
                                    <svg-icon icon-class="cart-arrow-right" class-name="cart-arrow-right" />
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
                            >{{ unit
                            }}{{
                                $Util.Number.numFormat(
                                    $Util.countFilter(item?.item[$Util.Number.getStepPriceIndexByNums(item.amount)]),
                                )
                            }}</span
                        >
                    </template>
                    <template v-if="columnsItem.dataIndex === 'quantity'">
                        <div class="count-edit">
                            <span class="count-number"> ×{{ item.amount }} </span>
                        </div>
                    </template>
                    <template v-if="columnsItem.dataIndex === 'operation'">
                        <div class="operation">
                            <span class="row-text price">
                                <template v-if="!item.item?.isGift">
                                    {{ unit
                                    }}{{
                                        $Util.Number.numFormat(
                                            $Util.countFilter(
                                                item.amount *
                                                    item?.item[$Util.Number.getStepPriceIndexByNums(item.amount)],
                                            ),
                                        )
                                    }}
                                </template>
                                <template v-else> {{ unit }}0<span class="original-price">12123</span> </template>
                            </span>
                            <template v-if="item.item?.isGift">
                                <span class="row-text excluding">{{ $t('mall.excluding') }}</span>
                            </template>
                        </div>
                    </template>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
const columns = [
    {
        title: 'purchase.product_information',
        dataIndex: 'product',
        key: 'product',
        width: 800,
    },
    {
        title: 'purchase.unit_price',
        dataIndex: 'price',
        key: 'price',
        width: 200,
    },
    {
        title: 'purchase.quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 200,
    },
    {
        title: 'purchase.total_operation',
        dataIndex: 'operation',
        key: 'operation',
    },
];
export default {
    components: {},
    props: {
        list: {
            type: Array,
            default: [],
        },
        unit: {
            type: String,
            default: '€',
        },
    },
    computed: {},
    data() {
        return {
            columns,
        };
    },
    created() {},
    methods: {},
};
</script>

<style lang="less" scoped>
.invalid-box {
    background: #ddd;
    padding: 4px;
    color: #666;
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: 10px;
    position: absolute;
    left: 7px;
    display: none;
}
.list-body {
    width: 100%;
    background: #fff;

    > tr td {
        text-align: left;
        padding: 24px 0 16px 0;
        color: #000;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 150%;

        &:last-child {
            padding-right: 56px;
            text-align: right;
        }
    }
}

.row {
    user-select: none;
    &:nth-child(2) {
        .row-item {
            padding-top: 24px;
        }
    }
    &:last-child {
        .row-item {
            padding-bottom: 24px;
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
                .original-price {
                    color: #999;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 21px;
                    text-decoration: line-through;
                    margin-left: 8px;
                }
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
            &.excluding {
                font-size: 12px;
                line-height: 24px;
                white-space: nowrap;
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
            .count-number {
                padding: 7px 20px;
                background: #f5f5f5;
                font-size: 16px;
                font-weight: 500;
                line-height: 24px;
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
                    .name-text {
                        .ellipsis(1);
                        color: #000;
                        font-size: 20px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: 150%;
                    }
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
.gift {
    position: relative;
    &::after {
        content: '';
        display: inline-block;
        height: 16px;
        background: #fff;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0px;
    }
    &:last-child {
        .row-item {
            padding-bottom: 40px;
        }
    }
    .row-item {
        background: #fafafa;
        padding: 24px 0 40px 0;
        &:first-child {
            width: 44px;
        }
        .product {
            .product-img {
                width: 96px;
                height: 96px;
                min-width: 96px;
                margin-left: 24px;
            }
            .product-mes {
                .name {
                    .fcc();
                    .label {
                        margin-left: 12px;
                        border: 1px solid #c6f;
                        display: inline-flex;
                        padding: 4px 8px;
                        justify-content: center;
                        align-items: center;
                        font-size: 10px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: 10px;
                        background: linear-gradient(100deg, #c6f 0%, #66f 100%);
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }
            }
        }
    }
    .row-item-check {
        background: #fff;
    }
}

.operation {
    width: 100%;
    .flex(initial, flex-end, column);
}
</style>
