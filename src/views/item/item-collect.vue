<template>
<div id="ItemCollect" class="list-container">
    <div class="list-container shop-cart-container">
        <div class="title-area">购物车</div>
        <div class="list-content">
            <div class="list-item" v-for="item of shopCartList" :key="item.id">
                <img class="cover" :src="$Util.imageFilter(item.item ? item.item.logo : '', 2)" />
                <div class="info">
                    <div class="name">{{item.item ? item.item.name : '-'}}</div>
                    <div class="sub">{{item.item ? item.item.code : '-'}}</div>
                    <div class="subject"></div>
                    <span class="count" v-if="!item.editMode" @click="handleCountEditShow(item)">x{{item.amount}}</span>
                    <div class="count-edit" v-else>
                        <a-input-number v-model:value="editCount" :min="1" :precision="0" autofocus @blur="handleCountEditBlur(item)"/>
                    </div>
                    <div class="btns">
                        <a-button type="link" @click="handleMoveToFavorite(item)">移至收藏</a-button>
                        <a-button type="link" @click="handleShopCartRemove(item)">删除</a-button>
                    </div>
                </div>
                <div class="price">
                    ￥{{$Util.countFilter(item.price)}}
                </div>
            </div>
            <SimpleImageEmpty v-if="!shopCartList.length" desc='您的购物车中暂无商品'/>
        </div>
        <div class="settle-content" v-if="shopCartList.length">
            <div class="title-area">摘要</div>
            <div class="settle-item" v-for="item of shopCartList" :key="item.id">
                <p class="name">{{item.item ? item.item.name : '-'}}</p>
                <span class="price">￥{{$Util.countFilter(item.price*item.amount)}}</span>
            </div>
            <div class="settle-item sum">
                <p class="name">总计</p>
                <span class="price">￥{{sum_price}}</span>
            </div>
            <a-button type="primary" ghost @click="routerChange('settle')">结算</a-button>
        </div>
    </div>
    <div class="list-container favorite-container">
        <div class="title-area">收藏夹</div>
        <div class="list-content">
            <div class="list-item" v-for="item of favoriteList" :key="item.id">
                <img class="cover" :src="$Util.imageFilter(item.item ? item.item.logo : '', 2)" />
                <div class="info">
                    <div class="name">{{item.item ? item.item.name : '-'}}</div>
                    <div class="sub">{{item.item ? item.item.code : '-'}}</div>
                    <div class="subject"></div>
                    <div class="btns">
                        <a-button type="link" @click="handleFavoriteRemove(item)">删除收藏</a-button>
                        <a-button type="primary" ghost @click="handleMoveToShopCart(item)" v-if="item.item.in_favorite">添加到购物车</a-button>
                        <a-button type="primary" ghost v-if="!item.item.in_favorite">已添加到购物车</a-button>
                    </div>
                </div>
                <div class="price">
                    ￥{{$Util.countFilter(item.price)}}
                </div>
            </div>
            <SimpleImageEmpty v-if="!favoriteList.length" desc='您的收藏夹中暂无商品'/>
        </div>
    </div>
</div>
</template>

<script>
import SimpleImageEmpty from '../../components/SimpleImageEmpty.vue'
import Core from '../../core';
export default {
    name: 'ItemCollect',
    components: {SimpleImageEmpty},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            editCount: '',
            // 商品详情
            detail: {},
            shopCartList: [],
            favoriteList: [],
        };
    },
    watch: {},
    computed: {
        sum_price() {
            let sum = 0
            for (const item of this.shopCartList) {
                sum += item.price * item.amount
            }
            return Core.Util.countFilter(sum)
        }
    },
    mounted() {
        this.getShopCartList();
        this.getFavoriteList();
    },
    methods: {
        routerChange(type, item) {
            let routeUrl
            switch (type) {
                case 'settle':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/purchase/item-settle",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getShopCartList() {
            Core.Api.ShopCart.list().then(res => {
                console.log('getShopCartList res:', res)
                this.shopCartList = res.list
            })
        },
        getFavoriteList() {
            Core.Api.Favorite.list().then(res => {
                console.log('getFavoriteList res:', res)
                this.favoriteList = res.list
            })
        },
        handleCountEditShow(item) {
            item.editMode = !item.editMode
            this.editCount = item.amount
        },
        handleCountEditBlur(item) {
            if (this.editCount === item.amount) {
                return
            }
            let _item = Core.Util.deepCopy(item)
            _item.amount = this.editCount
            console.log('handleCountEditBlur _item:', _item)
            Core.Api.ShopCart.save(_item).then(res => {
                this.getShopCartList();
            }).finally(() => {
                this.editCount = ''
            })
        },

        // 结算
        handleSettle() {
        },

        // 从购物车移至收藏
        handleMoveToFavorite(item) {
            console.log("handleMoveToFavorite item", item)
            let _this = this
            this.$confirm({
                title: `确定要将商品${item.item ? '['+item.item.name+']' : ''}移动至收藏夹吗？`,
                okText: '确定',
                cancelText: '取消',
                async onOk() {
                    try {
                        await Core.Api.Favorite.add({item_id: item.item_id,price: item.price})
                        await Core.Api.ShopCart.remove({id: item.id})
                        _this.$message.success('操作成功')
                    } catch(err) {
                        console.log('handleMoveToFavorite err:', err)
                    } finally {
                        // setTimeout(() => {
                            _this.getShopCartList();
                            _this.getFavoriteList();
                        // }, 1000)
                    }
                },
            });
        },
        // 从收藏夹添加到购物车
        handleMoveToShopCart(item) {
            Core.Api.ShopCart.save({
                item_id: item.item_id,
                amount: 1,
                price: item.price
            }).then(res => {
                console.log('res:', res)
                this.$message.success('添加成功')
                this.getShopCartList();
            })
        },

        // 从收藏夹移出
        handleFavoriteRemove(item) {
            let _this = this
            this.$confirm({
                title: `确定要将商品${item.item ? '['+item.item.name+']' : ''}移出收藏夹吗？`,
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Favorite.remove({id:item.id}).then(() => {
                        _this.$message.success('移出成功')
                        _this.getFavoriteList()
                    })
                },
            });
        },
        // 从购物车移出
        handleShopCartRemove(item) {
            let _this = this
            this.$confirm({
                title: `确定要将商品${item.item ? '['+item.item.name+']' : ''}移出购物车吗？`,
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.ShopCart.remove({id:item.id}).then(() => {
                        _this.$message.success('移出成功')
                        _this.getShopCartList()
                    })
                },
            });
        },
    }
};
</script>

<style lang="less">
#ItemCollect {
    padding: 60px 56px 150px 48px;
    .list-container {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        + .list-container { margin-top: 76px; }
        .title-area {
            width: 100%;
            font-size: 24px;

            font-weight: 500;
            color: #111111;
            line-height: 28px;

            margin-bottom: 8px;
        }
        .list-content {
            width: 72%;
            box-sizing: border-box;
            padding-right: 10%;
            .list-item {
                width: 100%;
                padding: 22px 0 44px;
                border-bottom: 1px solid #E6EAEE;
                display: flex;
                position: relative;
                .cover {
                    width: 150px;
                    height: 150px;
                    object-fit: cover;
                    margin-right: 30px;
                }
                .info {
                    width: calc(~'100% - 180px');
                    height: 150px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-start;
                    .name {
                        .ell();
                        max-width: calc(~'100% - 100px');
                        font-size: 14px;
                        font-weight: 500;
                        color: #111111;
                        line-height: 16px;
                    }
                    .sub {
                        .ell();
                        width: 100%;
                        font-size: 14px;
                        font-weight: 400;
                        color: #757575;
                        line-height: 16px;
                        margin: 4px 0 8px;
                    }
                    .count {
                        .fcc();
                        cursor: pointer;
                        height: 28px;
                        padding: 0 8px;
                        border-radius: 6px;
                        border: 1px solid #E6EAEE;
                        font-size: 14px;
                        font-weight: 400;
                        color: #111111;
                    }
                }
                .price {
                    position: absolute;
                    top: 22px;
                    right: 0;
                    font-size: 16px;
                    font-weight: 400;
                    color: #111111;
                    line-height: 19px;
                }
                .btns {
                    .ant-btn-link {
                        color: #757575;
                        border-bottom: 1px solid #757575;
                        border-radius: 0;
                        height: 24px;
                        &:hover {
                            opacity: 0.8;
                        }
                    }
                    .ant-btn-primary {
                        border-radius: 12px;
                        height: 42px;
                        padding: 4px 23px;
                    }
                }
            }
        }
        .settle-content {
            width: 28%;
            .title-area {
                font-size: 22px;
                color: #000000;
                line-height: 26px;
                margin-bottom: 24px;
                margin-top: 22px;
            }
            .settle-item {
                width: 100%;
                .fsb();
                font-size: 16px;
                color: #000000;
                line-height: 19px;
                margin: 8px 0;
                &.sum {
                    font-weight: 500;
                    padding: 16px 0;
                    border-top: 1px solid #E6EAEE;
                    border-bottom: 1px solid #E6EAEE;
                    margin: 14px 0 34px;
                }
            }
            .ant-btn-primary {
                width: 100%;
                height: 55px;
                border-radius: 12px;
                font-weight: 500;
            }
        }
        &.favorite-container {
            .btns {
                width: 100%;
                .fsb(flex-end);
            }
        }
    }
    .count-edit {
        .ant-input-number {
            height: 28px;
            box-shadow: 0 0 0 0;
            border: 0;
            position: relative;
            text-align: center;
            .ant-input-number-input-wrap {
                padding: 0 28px;
                .ant-input-number-input {
                    padding: 0;
                    text-align: center;
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
                    visibility:visible;
                    width: 28px;
                    height: 28px;
                    position: absolute;
                    border: 0;
                    box-sizing: border-box;
                    border-radius: 6px;
                    border: 1px solid #006EF9;
                    &:hover {
                        height: 28px !important;
                        opacity: 0.7;
                    }
                    .anticon { display: none; }
                    &.ant-input-number-handler-down {
                        left: 0;
                        &::before {
                            border-radius: 20px;
                            display: inline-block;
                            content: '';
                            width: 15px;
                            height: 2px;
                            background: #C4C4C4;
                            border-radius: 20px 20px 20px 20px;
                            opacity: 1;
                        }
                    }
                    &.ant-input-number-handler-up {
                        right: 0;
                        background-color: #006EF9;
                        &::before, &::after {
                            position: absolute;
                            display: inline-block;
                            content: '';
                            background: #fff;
                            border-radius: 20px;
                        }
                        &::before {
                            width: 16px;
                            height: 2px;
                        }
                        &::after {
                            height: 16px;
                            width: 2px;
                        }
                    }
                }
            }
        }
    }
}
</style>