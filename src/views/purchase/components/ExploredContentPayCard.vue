<template>
    <div class="expolred-list">
        <div class="card-left">
            <div class="serial—number">
                <div class="serial">{{ num }}</div>
            </div>
            <div class="card-info">
                <div class="title">{{ $i18n.locale == 'zh' ? data.name : data.name_en }}</div>
                <div class="title">{{ data.code }}</div>
                <!--            <div class="info">{{ $t('i.price_suggest') }}</div>-->
                <!-- <ul>
                <li v-for="attr in data.attr_list">{{ $i18n.locale =='zh' ? attr.attr_def_name : attr.attr_def_key }}：{{ $i18n.locale =='zh' ? attr.value : attr.value_en }}</li>
            </ul> -->
                <div class="price" v-if="currency === 'eur' || currency === 'EUR'">
                    €{{ $Util.countFilter(data[priceKey + 'eur']) }}
                </div>
                <div class="price" v-else>${{ $Util.countFilter(data[priceKey + 'usd']) }}</div>
                <!--            <div class="price">€{{$Util.countFilter(data[priceKey + 'eur'])}} | ${{$Util.countFilter(data[priceKey + 'usd'])}}</div>-->
            </div>
        </div>
        <div class="shop-card">
            <div class="shop-top">
                <div class="spot-box">
                    <!-- <div class="spot"></div>
                <span>库存：10</span> -->
                </div>
                <div class="shop-price" v-if="currency === 'eur' || currency === 'EUR'">
                    €{{ $Util.countFilter(data[priceKey + 'eur']) }}
                </div>
                <div class="shop-price" v-else>${{ $Util.countFilter(data[priceKey + 'usd']) }}</div>
                <!--            <div class="shop-price">€{{$Util.countFilter(data[priceKey + 'eur'])}} | ${{$Util.countFilter(data[priceKey + 'usd'])}}</div>-->
            </div>
            <div class="shop-bottom">
                <div class="cart-box">
                    <div class="num-box">
                        <div class="icon minus" @click.stop="minus()">
                            <caret-down-outlined />
                        </div>
                        <a-input-number
                            id="inputNumber"
                            v-model:value="value"
                            :bordered="false"
                            :controls="false"
                            :min="0"
                            :max="999"
                            class="num"
                        />
                        <div class="icon add" @click.stop="add()">
                            <caret-up-outlined />
                        </div>
                    </div>
                    <div class="cart" @click="hanldeAddToShopCart(data)">
                        <shopping-cart-outlined class="icon shop-card" />
                    </div>
                </div>
                <div class="stars" @click="hanldeAddToFavorite(data)" :class="{ active: data.in_favorite }">
                    <star-outlined />
                    <span class="star-text">{{ data.in_favorite ? $t('i.favorited') : $t('i.favorite_not') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Core from '../../../core';
import { CaretUpOutlined, CaretDownOutlined, ShoppingCartOutlined, StarOutlined } from '@ant-design/icons-vue';
export default {
    components: {
        CaretUpOutlined,
        CaretDownOutlined,
        ShoppingCartOutlined,
        StarOutlined,
    },
    computed: {
        priceKey() {
            let priceKey = this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_';
            console.log('priceKey:', priceKey);
            return priceKey;
        },
    },
    props: {
        data: Object,
        num: Number,
    },
    data() {
        return {
            value: 1,
            currency: '',
            paramPrice: false,
        };
    },
    mounted() {
        this.currency = Core.Data.getCurrency();
        if (Core.Data.getCurrency() === 'EUR') {
            this.paramPrice = false;
        } else {
            this.paramPrice = true;
        }
        console.log(this.data, 'this data');
    },
    methods: {
        // 添加到购物车
        hanldeAddToShopCart(list) {
            let _this = this;
            Core.Api.ShopCart.save({
                item_id: list.id,
                amount: this.value,
                price: list.purchase_price,
            }).then(res => {
                console.log('hanldeAddToShopCart res:', res);
                this.$message.success(_this.$t('pop_up.add'));
                this.$emit('change');
                // this.componentDetail.in_shopping_cart = true;
            });
        },

        // 收藏商品
        hanldeAddToFavorite(list) {
            let _this = this;
            if (list.in_favorite) {
                return this.$message.warning(_this.$t('i.item_favorite'));
            }
            if (!_this.paramPrice) {
                Core.Api.Favorite.add({
                    item_id: list.id,
                    price: list.fob_eur,
                }).then(res => {
                    console.log('hanldeAddToFavorite res:', res);
                    this.$message.success(_this.$t('i.favorite_success'));
                    this.$emit('change');
                });
            } else {
                Core.Api.Favorite.add({
                    item_id: list.id,
                    price: list.fob_usd,
                }).then(res => {
                    console.log('hanldeAddToFavorite res:', res);
                    this.$message.success(_this.$t('i.favorite_success'));
                    this.$emit('change');
                });
            }
        },

        // 增加商品数量
        add() {
            this.value++;
        },
        // 减少商品数量
        minus() {
            if (this.value == 1) return;
            this.value--;
        },
    },
};
</script>
<style scoped lang="less">
.expolred-list {
    border: 1px solid @TC_car_bc;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    margin-top: 20px;

    &:nth-of-type(1) {
        margin-top: 0;
    }

    &.active {
        border-color: #006ef9;
    }

    .card-left {
        flex: 1;
        display: flex;
        overflow: hidden;

        img {
            width: 130px;
            min-height: 99px;
        }

        .card-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: @TC_car_title;
            font-size: @fz_sm;
            padding: 20px 10px;
            overflow: hidden;

            .title {
                font-size: @fz_bs;
                font-weight: 600;
                // margin-top: 12px;
                .ell();
            }

            .info {
                // margin-top: 12px;
                font-weight: 500;
                .ell();
            }

            .price {
                // margin-top: 6px;
                color: @TC_car_price;
                font-size: @fz_sm;
                font-weight: 500;
                .ell();
            }
        }

        .serial—number {
            width: 170px;
            height: 100%;

            .serial {
                display: inline-block;
                width: 30px;
                height: 30px;
                line-height: 30px;
                box-sizing: border-box;
                border: 1px solid #006ef9;
                text-align: center;
                border-radius: 50%;
            }

            .fcc();
        }
    }

    .shop-card {
        width: 300px;
        background: rgba(128, 182, 252, 0.2);
        border-radius: 4px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .shop-top {
            display: flex;
            justify-content: space-between;

            .spot-box {
                font-size: @fz_sm;
                color: @TC_car_title;
                display: flex;
                align-items: center;

                .spot {
                    width: 8px;
                    height: 8px;
                    background: #ff9918;
                    border-radius: 50%;
                    margin-right: 7px;
                }
            }

            .shop-price {
                color: @TC_car_price;
                font-size: @fz_md;
                font-weight: 500;
            }
        }

        .shop-bottom {
            margin-top: 25px;
            height: 36px;
            align-items: center;
            display: flex;
            justify-content: space-between;

            .cart-box {
                display: flex;

                .num-box {
                    width: 88px;
                    background-color: @white;
                    display: flex;
                    padding: 1px;

                    .icon {
                        background-color: #d9d9d9;
                        width: 26px;
                        .fcc();
                        cursor: pointer;
                    }

                    .num {
                        flex: 1;
                    }
                }

                .cart {
                    width: 36px;
                    height: 36px;
                    background-color: #006ef9;
                    margin-left: 10px;
                    cursor: pointer;
                    .fcc();

                    .shop-card {
                        font-size: 22px;
                        color: #fff;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                        .fcc();
                    }
                }
            }

            .stars {
                color: @TC_D;
                font-size: @fz_bs;
                margin-top: 14px;
                font-weight: 400;
                cursor: pointer;

                .star-text {
                    margin-left: 6px;
                }

                &.active {
                    color: @TC_car_price;
                }
            }
        }
    }
}

//  ul {
//     // list-style: disc;
//     // margin-top: 20px;
//     width: 100%;
//     color: @TC_car_info;
//     font-size: @fz_sm;
//     li {
//         // margin-top: 10px;
//         position: relative;
//         padding-left: 14px;
//         &:nth-of-type(1) {
//             margin-top: 0;
//         }
//         .ell();
//         &:before {
//             position: absolute;
//             left: 0;
//             top: 50%;
//             transform: translateY(-50%);
//             content: "";
//             width: 6px;
//             height: 6px;
//             display: inline-block;
//             border-radius: 50%;
//             background: #515154;
//             vertical-align: middle;
//             margin-right: 14px;
//         }
//     }
// }
.ant-input-number :deep(.ant-input-number-input-wrap) {
    width: 100%;
    height: 100%;
}

.ant-input-number :deep(.ant-input-number-input) {
    width: 100%;
    height: 100%;
    padding: 0;
    text-align: center;
    font-size: @fz_sm;
    font-weight: 500;
}
</style>
