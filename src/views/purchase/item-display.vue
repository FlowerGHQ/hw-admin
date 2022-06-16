<template>
    <div id="ItemDisplay" class="list-container">
        <div class="info-content">
            <div class="name">{{ detail.name }}</div>
            <p class="code">{{ $t('i.code') }}：{{ detail.code }}</p>
            <p class="spec" v-if="detail.attr_str"><span>{{ $t('i.spec') }}：</span>{{ detail.attr_str }}</p>
            <p class="price">€{{ $Util.countFilter(detail[priceKey + 'eur']) }} |
                ${{ $Util.countFilter(detail[priceKey + 'usd']) }}</p>
            <p class="category"><span v-for="(category, index) in detail.category_list">
                            <span v-if="index !== 0">,</span>
                            {{ category.category_name }}
                        </span></p>
            <div class="desc" v-if="config && config.length">
                <template v-for="(item, index) of config" :key="index">
                    <p v-if="item.value">
                        {{ item.name }}：
                        <template v-if="item.type !== 'rich_text'">{{ item.value }}</template>
                        <span v-else v-html='item.value'></span>
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
                    <a><img :src="getImgUrl(props.i)"/></a>
                </template>
            </a-carousel>
        </div>
        <div class="spec-content" v-if='specList.length'>
            <div class="title">{{ $t('i.spec') }}({{ specList.length }})</div>
            <div class="spec-list">
                <div class="spec-item" v-for="item of specList" :key="item.id"
                     :class="this.id === item.id ? 'active' : ''" @click="handleSpecChange(item)">
                    <img :src="$Util.imageFilter(item.logo, 2)"/>
                    <p>{{ item.name }}</p>
                </div>
            </div>
        </div>
        <ExploredContent ref="ExploredContent" :id="id"/>
        <div class="btn-content">
            <a-button type="primary" class="disabled" v-if="detail.in_shopping_cart">{{ $t('i.added') }}</a-button>
            <a-button type="primary" @click="hanldeAddToShopCart" v-else>{{ $t('i.favorited') }}</a-button>

            <a-button type="primary" class="disabled" ghost v-if="detail.in_favorite">{{ $t('i.cart') }}</a-button>
            <a-button type="primary" ghost @click="hanldeAddToFavorite" v-else>{{ $t('i.add_to_favorites') }}</a-button>
        </div>
    </div>
</template>

<script>
import {get} from 'lodash';
import Core from '../../core';
import ExploredContent from './components/ExploredContent.vue';

export default {
    name: 'ItemDisplay',
    components: {
        ExploredContent
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            id: null,
            detail: {},
            category: {},
            config: [],
            imgs: [],
            activeKey: 0,

            specList: [],
        };
    },
    watch: {},
    computed: {
        priceKey() {
            let priceKey = this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_'
            console.log('priceKey:', priceKey)
            return priceKey
        }
    },
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
                let detail = res.detail
                detail.attr_str = detail.attr_list ? detail.attr_list.map(item => item.value).join(' ') : ''
                detail.attr_def_name = detail.attr_list ? detail.attr_list.map(item => item.attr_def_name).join(',') : ''
                console.log('detail.attr_list.attr_def_name', detail.attr_def_name)
                this.detail = detail
                console.log('detail', detail)
                this.category = detail.category
                try {
                    this.config = JSON.parse(detail.config)
                } catch (err) {
                    this.config = []
                }
                this.imgs = detail.imgs ? detail.imgs.split(',') : []
                if (detail.set_id) {
                    this.getSpecList();
                }
            }).catch(err => {
                console.log('getItemDetail err', err)
            }).finally(() => {
                this.loading = false;
                this.getExploreDetail(this.id);
            });
        },
        // 获取 同规格商品 列表
        getSpecList() {
            this.loading = true;
            Core.Api.Item.listBySet({
                set_id: this.detail.set_id
            }).then(res => {
                let data = res.list.map(item => ({
                    ...item,
                    attr_desc: item.attr_list.map(i => i.value).join(',')
                }))
                this.specList = data;
                console.log('getSpecList this.specific.data:', data)
            }).catch(err => {
                console.log('getSpecList err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 查看不同 规格
        handleSpecChange(item) {
            this.id = item.id;
            this.getItemDetail()
        },
        // 根据id获取爆炸图
        getExploreDetail(id) {
            this.$refs.ExploredContent.getItemExploreList(id);
        },
        // 添加到购物车
        hanldeAddToShopCart() {
            Core.Api.ShopCart.save({
                item_id: this.detail.id,
                amount: 1,
                price: this.detail.purchase_price
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
                price: this.detail.purchase_price
            }).then(res => {
                console.log('hanldeAddToFavorite res:', res)
                this.$message.success('收藏成功')
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
        justify-content: flex-start;
        align-items: flex-start;
        color: #111111;
        line-height: 22px;
        font-size: 16px;
        font-weight: 500;
        box-sizing: border-box;
        padding-right: 32px;

        .name {
            font-size: 28px;
            line-height: 39px;
            margin-right: 40px;
        }

        .code {
            margin-top: 6px;
        }

        .spec {
            display: inline-block;
            color: #757575;
            margin-top: 6px;
            line-height: 28px;
            height: 28px;
            background: #F9F9F9;
            border-radius: 2px;
            padding: 0 10px;

            span {
                color: #111111;
            }
        }

        .price {
            margin: 20px 0 44px;
        }

        .sale-price {
            color: #000000;
            font-weight: 400;
            margin-bottom: 20px;
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
                text-indent: 0;

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

    .spec-content {
        margin-top: 30px;
        width: 100%;

        > .title {
            font-weight: 500;
            font-size: 16px;
            line-height: 22px;
            color: #000000;
            margin-bottom: 22px;
        }

        .spec-list {
            display: flex;
            flex-wrap: wrap;

            .spec-item {
                .flex();
                width: 200px;
                height: 188px;
                border-radius: 12px;
                border: 1px solid #D2D2D7;
                overflow: hidden;
                margin-right: 30px;
                margin-bottom: 30px;
                transition: border-color 0.3s ease;

                &.active {
                    border-color: #006EF9;
                }

                img {
                    height: 152px;
                }

                p {
                    padding: 0 8px;
                    box-sizing: border-box;
                    .ell();
                    width: 100%;
                    height: 34px;
                    line-height: 34px;
                    font-size: 17px;
                    font-weight: 500;
                    color: #1D1D1F;
                    text-align: center;
                }
            }
        }
    }

    .btn-content {
        display: flex;
        flex-direction: column;
        margin-top: 40px;

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
                cursor: no-drop;
            }

        }
    }
}
</style>
