<template>
    <div id="mall-purchase">
        <!-- 轮播图 -->
        <div class="carousel">
            <a-carousel :after-change="onChange" autoplay dotsClass="purchase-dots">
                <div v-for="item in carouselList">
                    <div class="carousel-item">
                        <img class="img" :src="getPurchaseSrc(item.img, 'png')">
                    </div>
                </div>
            </a-carousel>
        </div>
        <div class="container">
            <!-- Our products -->
            <div class="box products">
                <div class="content">
                    <div class="title">{{ $t('purchase.products') }}</div>
                    <div class="products-list">
                        <div class="products-item" v-for="(item, index) in productsList" :key="index">
                            <p class="name">{{ $t(`purchase.${item.nameLang}`) }}</p>
                            <p class="mes">{{ $t(`purchase.${item.mesLang}`) }}</p>
                            <div class="btn">
                                <my-button @click="handleLogin">
                                    {{ $t('purchase.order') }}
                                </my-button>
                            </div>
                            <div class="img">
                                <img :src="getPurchaseSrc(item.img, 'png')">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Horwin Services -->
            <div class="box services">
                <div class="content">
                    <div class="title">{{ $t('purchase.services') }}</div>
                    <div class="services-list">
                        <div class="services-item" v-for="(item, index) in servicesList" :key="index">
                            <p class="name">{{ $t(`purchase.${item.nameLang}`) }}</p>
                            <p class="mes">{{ $t(`purchase.${item.mesLang}`) }}</p>
                            <div class="btn">
                                <my-button @click="handleLogin">
                                    {{ $t('purchase.order') }}
                                </my-button>
                            </div>
                            <svg-icon :icon-class="item.icon" class-name="services-icon" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- Local deals -->
            <div class="box deals">
                <div class="content">
                    <div class="title">{{ $t('purchase.deals') }}</div>
                </div>
            </div>
            <!-- HORWIN Official News -->
            <div class="box news">
                <div class="content">
                    <div class="title">{{ $t('purchase.news') }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script>
import Core from '@/core';
import MyButton from '@/components/common/MyButton.vue';
import SvgIcon from "@/components/SvgIcon/index.vue";

const purchaseModules = import.meta.globEager("@/assets/images/mall/purchase/*");

export default {
    components: {
        MyButton,
        SvgIcon
    },
    data() {
        return {
            Core,
            carouselList: [
                { img: 'banner' },
                { img: 'banner' },
            ],
            productsList: [
                {
                    nameLang: 'products_name1',
                    mesLang: 'products_mes1',
                    img: 'products-img1',
                },
                {
                    nameLang: 'products_name2',
                    mesLang: 'products_mes2',
                    img: 'products-img2',
                },
                {
                    nameLang: 'products_name3',
                    mesLang: 'products_mes3',
                    img: 'products-img3',
                },
            ],
            servicesList: [
                {
                    nameLang: 'services_name1',
                    mesLang: 'services_mes1',
                    icon: 'purchase-person',
                },
                {
                    nameLang: 'services_name2',
                    mesLang: 'services_mes2',
                    icon: 'purchase-admin',
                },
                {
                    nameLang: 'services_name3',
                    mesLang: 'services_mes3',
                    icon: 'purchase-sales',
                },
            ],
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {
        getPurchaseSrc(name, type = 'png') {
            const path = `../../../assets/images/mall/purchase/${name}.${type}`;
            return purchaseModules[path].default;
        },
    }
};
</script>
    
<style lang="less" scoped>
#mall-purchase{
    .container {
        .box {
            .content {
                padding: 80px 0;
                margin: 0 auto;
                width: 75%;
                .title {
                    color: #333;
                    font-family: Montserrat;
                    font-size: 32px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    margin-bottom: 40px;
                }
            }
        }
        .products {
            background: #F8F8F8;
            .products-list {
                .flex(center, center, row);
                .products-item {
                    .flex(center, center, column);
                    height: 640px;
                    width: calc((100% - 80px) / 3);
                    margin-right: 40px;
                    padding: 40px;
                    background: #FFF;
                    overflow: hidden;
                    transition: 0.05s;
                    cursor: pointer;
                    &:hover {
                        transform: scale(1.05);
                        box-shadow: 1px 1px 10px 10px #f3f3f3;
                        .name {
                            background: linear-gradient(100deg, #C6F 0%, #66F 100%);
                            background-clip: text;
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                        }
                    }
                    &:nth-child(3n) {
                        margin-right: 0;
                    }
                    .name {
                        color: #333;
                        text-align: center;
                        font-family: Montserrat;
                        font-size: 32px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: normal;
                        margin-bottom: 20px;
                    }
                    .mes {
                        color: #999;
                        font-family: Montserrat;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 28px; /* 200% */
                        margin-bottom: 24px;
                    }
                    .btn {
                        width: 142px;
                    }
                    .img {
                        .flex(center, center, column);
                        flex: 1;
                        > img {
                            width: 100%;
                            object-fit: cover;
                        }
                    }
                }
            }
        }
        .services {
            background: rgba(119, 103, 255, .1);
            .services-list {
                .flex(center, center, row);
                .services-item {
                    .flex(center, center, column);
                    width: calc((100% - 80px) / 3);
                    margin-right: 40px;
                    &:nth-child(3n) {
                        margin-right: 0;
                    }
                    .services-icon {
                        width: 48px;
                        height: 48px;
                    }
                }
            }
        }
        .deals {
            background: #FFF;
        }
        .news {
            background: #F8F8F8;
        }
    }
    @media (min-width: 820px) {}
    @media (max-width: 820px) {}
}
/* For demo */
.ant-carousel :deep(.slick-slide) {
    text-align: center;
    overflow: hidden;
    .carousel-item {
        .img {
            width: 100%;
            aspect-ratio: 2.66;
            object-fit: cover;
        }
    }
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}
</style>
<style lang="less">
.ant-carousel .purchase-dots li button {
    height: 2px;
    background: #E5E5E5;
    opacity: 1;
}
.ant-carousel .purchase-dots li.slick-active button {
    background: linear-gradient(100deg, #C6F 0%, #66F 100%);
}
</style>