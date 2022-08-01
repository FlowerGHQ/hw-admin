<template>
    <!--  class="bom-content" -->
    <div>
        <ExploredContent ref="ExploredContent" :id="id" :show="false" class="explored" @noData="noExplodeData"/>
        <SimpleImageEmpty v-if="explodeShow" :desc="$t('p.no_item_explode')"/>
    </div>
    <div class="explored-lists" v-if="exploredList.length">
        <div class="expolred-list" v-for="list,index in exploredList[0].item_component_list">
            <div class="card-left">
                <div class="serial—number">
                    <div class="serial">{{ index + 1 }}</div>
                </div>
                <div class="card-info">
                    <div class="title">{{ $i18n.locale =='zh' ? list.item.name : list.item.name_en  }}</div>
                    <div class="info">{{ $t('i.price_suggest') }}</div>
                    <!-- <ul>
                        <li v-for="attr in data.attr_list">{{ $i18n.locale =='zh' ? attr.attr_def_name : attr.attr_def_key }}：{{ $i18n.locale =='zh' ? attr.value : attr.value_en }}</li>
                    </ul> -->
                    <div class="price">€{{$Util.countFilter(list.item[priceKey + 'eur'])}} | ${{$Util.countFilter(list.item[priceKey + 'usd'])}}</div>
                </div>
            </div>
            <div class="shop-card">
                <div class="shop-top">
                    <div class="spot-box">
                        <!-- <div class="spot"></div>
                        <span>库存：10</span> -->
                    </div>
                    <div class="shop-price">€{{$Util.countFilter(list.item[price + 'eur'])}} | ${{$Util.countFilter(list.item[price + 'usd'])}}</div>
                </div>
                <div class="shop-bottom">
                    <div class="cart-box">
                        <div class="num-box">
                            <div class="icon add" @click.stop="add">
                                <caret-up-outlined />
                            </div>
                            <a-input-number id="inputNumber" v-model:value="value" :bordered="false" :controls="false" :min="0" :max="999" class="num"/>
                            <div class="icon minus" @click.stop="minus">
                                <caret-down-outlined />
                            </div>
                        </div>
                        <div class="cart" @click="hanldeAddToShopCart(list.item)">
                            <shopping-cart-outlined class="icon"/>
                        </div>
                    </div>
                    <div class="stars" @click="hanldeAddToFavorite(list.item)" :class="{'active': list.item.in_favorite}">
                        <star-outlined />
                        <span class="star-text">{{ list.item.in_favorite ? $t('i.favorited') : $t('i.favorite_not')}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <SimpleImageEmpty v-else desc="无爆炸图列表"/>
</template>
<script>
import { CaretUpOutlined, CaretDownOutlined, ShoppingCartOutlined, StarOutlined } from '@ant-design/icons-vue';
import ExploredContent from './ExploredContent.vue';
import SimpleImageEmpty from '../../../components/common/SimpleImageEmpty.vue';
import Core from '../../../core';
export default {
    props: {
    },
    computed: {
    },
    components: {
        CaretUpOutlined,
        CaretDownOutlined,
        ShoppingCartOutlined,
        StarOutlined,
        ExploredContent,
        SimpleImageEmpty
    },
    mounted () {
        this.getExploreDetail(this.id)
    },
    data() {
        return {
            value: 1,
            id: 248,


            // 无爆炸图
            explodeShow: true,
            // 爆炸图列表
            exploredList: [],
        }
    },
    methods: {
        // 根据id获取爆炸图
        getExploreDetail(id) {
            this.$refs.ExploredContent.getItemExploreList(id);
            this.getExploreList(id)
        },

        // 无爆炸图数据
        noExplodeData(data) {
            this.explodeShow = data
        },

        // 获取爆炸图列表数据
        getExploreList(id) {
            Core.Api.Item.getItemComponent({ target_id: id, target_type: Core.Const.ITEM_COMPONENT_SET.TARGET_TYPE.ITEM }).then((res)=>{
                // 无爆炸图数据
                console.log('getItemExploreList111 res', res);
                this.exploredList = res.list.list
            }).catch( err => {
                console.log('getItemExploreList111 err', err);
            });
        },

        // 添加到购物车
        hanldeAddToShopCart(list) {
            Core.Api.ShopCart.save({
                item_id: list.id,
                amount: this.value,
                price: list.purchase_price
            }).then(res => {
                console.log('hanldeAddToShopCart res:', res)
                this.$message.success('添加成功')
                this.getExploreList(this.id)
                // this.componentDetail.in_shopping_cart = true;
            })
        },

        // 收藏商品
        hanldeAddToFavorite(list) {
            if (list.in_favorite) {
                return this.$message.warning('该商品已在收藏夹中')
            }
            Core.Api.Favorite.add({
                item_id: list.id,
                price: list.purchase_price
            }).then(res => {
                console.log('hanldeAddToFavorite res:', res)
                this.$message.success('收藏成功')
                this.$emit('AddToFavorite')
                this.getExploreList(this.id)
            })
        },


        // 增加商品数量
        add() {
            this.value++;
        },
        // 减少商品数量
        minus() {
            if(this.value == 1) return
            this.value--;
        },
    },
}
</script>
<style lang="less" scoped>
.expolred-list {
    border: 1px solid @TC_car_bc;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    margin-top: 20px;
    &:nth-of-type(1) {
        margin-top: 0;
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
                .ell()
            }
            .info {
                // margin-top: 12px;
                .ell()
            }
            .price {
                // margin-top: 6px;
                color: @TC_car_price;
                font-size: @fz_sm;
                .ell()
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
                border: 1px solid #006EF9;
                text-align: center;
                border-radius: 50%;
            }
            .fcc()
        }
    }
    .shop-card {
        width: 300px;
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
}
</style>
