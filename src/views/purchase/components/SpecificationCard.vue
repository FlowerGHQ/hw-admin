<template>
    <div id="SpecificationCard" class="list-container">
        <div class="card-left">
            <img :src="$Util.imageFilter(data.logo)">
            <div class="card-info">
                <div class="title">{{ $i18n.locale =='zh' ? data.name : data.name_en }}</div>
                <div class="info">{{ data.code }}</div>
                <ul>
                    <li v-for="attr in data.attr_list">{{ $i18n.locale =='zh' ? attr.attr_def_name : attr.attr_def_key }}：{{ $i18n.locale =='zh' ? attr.value : attr.value_en }}</li>
                </ul>
                <!-- <div class="code">货号：{{ data.id }}</div> -->
            </div>
        </div>
        <div class="shop-card">
            <div class="shop-top">
                <div class="spot-box">
                    <!-- <div class="spot"></div>
                    <span>库存：89</span> -->
                </div>
                <div class="shop-price">€{{$Util.countFilter(data[priceKey + 'eur'])}} | ${{$Util.countFilter(data[priceKey + 'usd'])}}</div>
            </div>
            <div class="shop-bottom">
                <div class="cart-box">
                    <div class="num-box">
                        <div class="icon add" @click.stop="add">
                            <caret-up-outlined />
                        </div>
                        <a-input-number id="inputNumber" v-model:value="value" :bordered="false" :controls="false" :min="1" :max="999" class="num"/>
                        <div class="icon minus" @click.stop="minus">
                            <caret-down-outlined />
                        </div>
                    </div>
                    <div class="cart" @click="hanldeAddToShopCart">
                        <shopping-cart-outlined class="icon"/>
                    </div>
                </div>
                <div class="stars" @click="hanldeAddToFavorite">
                    <star-outlined />
                    <span class="star-text">{{ data.in_favorite ? $t('i.favorited') : $t('i.favorite_not') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { CaretUpOutlined, CaretDownOutlined, ShoppingCartOutlined, StarOutlined } from '@ant-design/icons-vue';
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
            default: {
                price: 0,
            },
        },
    },
    data() {
        return {
            value: 1,
        };
    },
    watch: {},
    computed: {
    },
    mounted() {
        console.log(this.data,'data')
    },
    methods: {
        // 增加商品数量
        add() {
            this.value++;
        },
        // 减少商品数量
        minus() {
            if(this.value == 1) return
            this.value--;
        },
        // 收藏商品
        hanldeAddToFavorite() {
            if (this.data.in_favorite) {
                return this.$message.warning('该商品已在收藏夹中')
            }
            Core.Api.Favorite.add({
                item_id: this.data.id,
                price: this.data.purchase_price
            }).then(res => {
                console.log('hanldeAddToFavorite res:', res)
                this.$message.success('收藏成功')
                // this.getItemDetail();
                this.$emit('AddToFavorite')
            })
        },
        // 添加到购物车
        hanldeAddToShopCart() {
            Core.Api.ShopCart.save({
                item_id: this.data.id,
                amount: 1,
                price: this.data.purchase_price
            }).then(res => {
                console.log('hanldeAddToShopCart res:', res)
                this.$message.success('添加购物车成功')
                this.$emit('AddToFavorite')
            })
        },
    }
};
</script>

<style lang="less" scoped>
#SpecificationCard {
    border: 1px solid @TC_car_bc;
    border-radius: 4px;
    padding: 10px;
    display: flex;
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
            padding: 10px;
            overflow: hidden;
            .title {
                font-size: @fz_bs;
                // margin-top: 12px;
                .ell()
            }
            .info {
                // margin-top: 12px;
                .ell()
            }
            .code {
                // margin-top: 6px;
                .ell()
            }
        }
    }
    .shop-card {
        width: 230px;
        background: rgba(128, 182, 252, .2);
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
                    background: #FF9918;
                    border-radius: 50%;
                    margin-right: 7px;
                }
            }
            .shop-price {
                color: @TC_car_price;
                font-size: @fz_md;
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
                        background-color: #D9D9D9;
                        width: 26px;
                        .fcc()
                    }
                    .num {
                        flex: 1;
                    }
                }
                .cart {
                    width: 36px;
                    height: 36px;
                    background-color: #006EF9;
                    margin-left: 10px;
                    .fcc()
                }
            }
            .stars {
                color: @TC_D;
                font-size: @fz_bs;
                margin-top: 14px;
                .star-text {
                    margin-left: 6px;
                }
            }
        }
    }
}

 ul {
    // list-style: disc;
    // margin-top: 20px;
    width: 100%;
    color: @TC_car_info;
    font-size: @fz_sm;
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
            content: "";
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
}
</style>
