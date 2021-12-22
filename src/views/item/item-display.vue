<template>
<div id="ItemDisplay" class="list-container">
    <div class="info-content">
        <p class="name">{{detail.name}}</p>
        <p class="code">商品编号：{{detail.code}}</p>
        <p class="price">￥{{$Util.countFilter(detail.price)}}</p>
        <p class="category">{{category.name}}</p>
        <div class="desc" v-if="config && config.length">
            <template v-for="(item, index) of config" :key="index">
                <p v-if="item.value">
                    {{item.name}}：
                    <template v-if="item.type !== 'rich_text'">{{item.value}}</template>
                    <span v-else  v-html='item.value'></span>
                </p>
            </template>
        </div>
    </div>
    <div class="imgs-content">
        <a-carousel autoplay class="carousel-list">
            <div class="carousel-item" v-for="(item,index) of imgs" :key="index">
                <img :src="$Util.imageFilter(item, 2)"/>
            </div>
            <template #customPaging="props">
                <a><img :src="getImgUrl(props.i)" /></a>
            </template>
        </a-carousel>
    </div>
    <div class="btn-content">
        <a-button type="primary" class="disabled" v-if="detail.in_shopping_cart">已在购物车中</a-button>
        <a-button type="primary" @click="hanldeAddToShopCart" v-else>添加到购物车</a-button>

        <a-button type="primary" class="disabled" ghost v-if="detail.in_favorite">已收藏</a-button>
        <a-button type="primary" ghost @click="hanldeAddToFavorite" v-else>收藏商品</a-button>
    </div>
</div>
</template>

<script>
import Core from '../../core';
export default {
    name: 'ItemDisplay',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            id: '',
            detail: {},
            category: {},
            config: [],
            imgs: [],
            activeKey: 0,
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getItemDetail();
    },
    methods: {
        // 获取商品详情
        getItemDetail() {
            this.loading = true;
            Core.Api.Item.detail({
                id: this.id,
            }).then(res => {
                console.log('getItemDetail res', res)

                this.detail = res
                this.category = res.category
                try { this.config = JSON.parse(res.config) } catch (err) { this.config = [] }
                this.imgs = res.imgs ? res.imgs.split(',') : []

            }).catch(err => {
                console.log('getItemDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 添加到购物车
        hanldeAddToShopCart() {
            Core.Api.ShopCart.save({
                item_id: this.detail.id,
                amount: 1,
                price: this.detail.price
            }).then(res => {
                console.log('hanldeAddToShopCart res:', res)
                this.$message.success('添加成功')
                this.getItemDetail();
            })
        },
        // 收藏商品
        hanldeAddToFavorite() {
            if (this.detail.in_favorite) {
                return this.$message.warning('该商品已在收藏夹中')
            }
            Core.Api.Favorite.add({
                item_id: this.detail.id,
                price: this.detail.price
            }).then(res => {
                console.log('hanldeAddToFavorite res:', res)
                this.$message.success('添加成功')
                this.getItemDetail();
            })
        },

        getImgUrl(i) {
            return Core.Util.imageFilter(this.imgs[i])
        }
    }
};
</script>

<style lang="less">
#ItemDisplay {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 63px 70px 200px;
    .info-content {
        width: calc(~'100% - 450px');
        display: flex;
        flex-direction: column;
        color: #111111;
        line-height: 22px;
        font-size: 16px;
        font-weight: 500;
        .name {
            font-size: 28px;
            line-height: 39px;
        }
        // .code {}
        .price {
            margin: 20px 0 44px;
        }
        .category {
            color: #000000;
            margin-bottom: 20px;
        }
        .desc {
            font-size: 16px;
            line-height: 22px;
            font-weight: 400;
            color: #515154;
            white-space: pre-wrap;
            p + p {
                margin-top: 10px;
            }
        }
    }
    .imgs-content {
        width: 450px;
        .carousel-list {
            .carousel-item {
                img {
                    width: 450px;
                    height: 450px;
                    object-fit: cover;
                }
            }
        }
        .ant-carousel .slick-dots {
            width: 100%;
            height: 46px;
            position: relative;
            bottom: 0;
            margin-top: 20px;

            > li {
                width: 46px;
                height: 46px;
                a, img {
                    width: 46px;
                    height: 46px;
                    background: #F5F5F5;
                }
                img {
                    object-fit: cover;
                }
            }
        }
    }
    .btn-content {
        display: flex;
        flex-direction: column;
        margin-top: 70px;
        .ant-btn {
            margin: 0;
            width: 220px;
            height: 40px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            &.ant-btn-primary.disabled {
                background-color: #006EF9;
                border-color: #006CFF;
            }
            &.ant-btn-background-ghost {
                border: 1px solid #000000;
                border-color: #000000;
                color: #000000;
                margin-top: 20px;
                &:hover {
                    opacity: 0.7;
                }
                &.disabled {
                    border-color: #000000;
                }
            }
            &.disabled {
                opacity: 0.7;
            }

        }
    }
}
</style>