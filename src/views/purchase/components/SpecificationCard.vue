<template>
    <div id="SpecificationCard" class="list-container" @click="changeData(data.id, i)">
        <div class="card-left">
            <div class="card-img">
                <img :src="$Util.imageFilter(data.logo, 2)" />
            </div>
            <div class="card-info">
                <div class="title">
                    {{ $i18n.locale == 'zh' ? data.name : data.name_en }}
                </div>
                <div class="info">
                    <span v-for="item in data.attr_list" :key="item.attr_def_id">
                        {{ item.attr_def_name }} : {{ lang == 'zh' ? item.value : item.value_en }}
                    </span>
                </div>
            </div>
        </div>
        <div class="shop-card">
            <div class="shop-top">
                <div class="spot-box"></div>
                <div class="shop-price" v-if="currency === 'eur' || currency === 'EUR'">
                    €{{ $Util.countFilter(data[priceKey + 'eur']) }}
                </div>
                <div class="shop-price" v-else>${{ $Util.countFilter(data[priceKey + 'usd']) }}</div>
            </div>
            <div class="shop-bottom">
                <div class="cart-box">
                    <div class="num-box">
                        <div class="icon minus" @click.stop="minus">
                            <caret-down-outlined />
                        </div>
                        <a-input-number
                            id="inputNumber"
                            v-model:value="value"
                            :bordered="false"
                            :controls="false"
                            :min="1"
                            :max="999"
                            class="num"
                        />
                        <div class="icon add" @click.stop="add">
                            <caret-up-outlined />
                        </div>
                    </div>
                    <div class="cart" @click="hanldeAddToShopCart">
                        <shopping-cart-outlined class="icon shop-card" />
                    </div>
                </div>
                <div class="stars" @click="hanldeAddToFavorite" :class="{ active: data.in_favorite }">
                    <star-outlined />
                    <span class="star-text">{{ data.in_favorite ? $t('i.favorited') : $t('i.favorite_not') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { CaretUpOutlined, CaretDownOutlined, ShoppingCartOutlined, StarOutlined } from '@ant-design/icons-vue';
import { number } from '@intlify/core-base';
import Core from '../../../core';
export default {
    name: 'SpecificationCard',
    components: {
        CaretUpOutlined,
        CaretDownOutlined,
        ShoppingCartOutlined,
        StarOutlined,
    },
    props: {
        data: {
            type: Object,
            default: {},
        },
        i: number,
    },
    data() {
        return {
            value: 1,
            currency: '',
            imgs: '',
        };
    },
    watch: {},
    computed: {
        priceKey() {
            let priceKey = this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_';
            return priceKey;
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        console.log(this.data);
        this.currency = Core.Data.getCurrency();
        this.imgs = this.data.imgs;
        if (this.imgs != undefined && this.imgs != null && this.imgs != '') {
            let img = this.imgs.split(',');
            if (img.length === 0) {
                this.imgs = '';
            }
            this.imgs = img[0];
        }
    },
    methods: {
        getImgUrl(img) {
            if (img != undefined && img != null && img != '') {
                let img = this.imgs.split(',');
                if (img.length === 0) {
                    return;
                }
                return this.$Util.imageFilter(img[0], 2);
            } else {
                return this.$Util.imageFilter('', 2);
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
        // 收藏商品
        hanldeAddToFavorite() {
            if (this.data.in_favorite) {
                return this.$message.warning(this.$t('i.item_favorite'));
            }
            Core.Api.Favorite.add({
                item_id: this.data.id,
                price: this.data.fob_eur,
            }).then(res => {
                console.log('hanldeAddToFavorite res:', res);
                this.$message.success(this.$t('i.favorite_success'));
                // this.getItemDetail();
                this.$emit('AddToFavorite');
            });
        },
        // 添加到购物车
        hanldeAddToShopCart() {
            Core.Api.ShopCart.save({
                item_id: this.data.id,
                amount: this.value,
                price: this.data.purchase_price,
            }).then(res => {
                console.log('hanldeAddToShopCart res:', res);
                this.$message.success(this.$t('i.add_cart_success'));
                this.$emit('AddToFavorite');
            });
        },

        // 点击查看详情
        changeData(id, i) {
            this.$emit('handleChangeData', { id, i });
        },
    },
};
</script>

<style lang="less" scoped>
#SpecificationCard {
    border: 2px solid @TC_car_bc;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    .card-left {
        flex: 1;
        display: flex;
        overflow: hidden;
        .card-img {
            width: 100px;
            height: 100px;
            margin: auto 0;
            display: flex;
            justify-content: center;
            align-items: center;
            //width: 100;
            //height: 100%;
            img {
                margin: auto 0;
                width: auto;
                height: auto;
                max-width: 100%;
                max-height: 100%;
            }
        }

        .card-info {
            flex: 1;
            width: 100%;
            color: @TC_car_title;
            font-size: @fz_sm;
            padding: 0 10px;
            overflow: hidden;
            .title {
                font-size: @fz_bs;
                font-weight: 600;
                width: 100%;
                margin-top: 20px;
                .ell();
            }
            .info {
                margin-top: 12px;
                width: 100%;
                font-weight: 500;
                .ell();
                span {
                    margin-right: 10px;
                }
            }
            .code {
                // margin-top: 6px;
                width: 100%;
                font-weight: 500;
                .ell();
            }
        }
    }
    .shop-card {
        width: 230px;
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
                    .fcc();
                    .shop-card {
                        font-size: 22px;
                        color: #fff;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                        cursor: pointer;

                        .fcc();
                    }
                }
            }
            .stars {
                color: @TC_D;
                font-size: @fz_bs;
                margin-top: 14px;
                font-weight: 400;
                .star-text {
                    margin-left: 6px;
                    cursor: pointer;
                }
            }
        }
    }
}

ul {
    // list-style: disc;
    // margin-top: 20px;
    margin-top: 6px;
    width: 100%;
    color: @TC_car_info;
    font-size: @fz_sm;
    font-weight: 400;
    li {
        // margin-top: 10px;
        position: relative;
        padding-left: 14px;
        &:nth-of-type(1) {
            margin-top: 0;
        }
        .ell();
        &:before {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            content: '';
            width: 6px;
            height: 6px;
            display: inline-block;
            border-radius: 50%;
            background: #515154;
            vertical-align: middle;
            margin-right: 14px;
        }
    }
}
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
