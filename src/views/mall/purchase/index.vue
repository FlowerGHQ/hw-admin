<template>
    <div id="mall-purchase">
        <!-- 轮播图 -->
        <div class="carousel">
            <a-carousel autoplay dotsClass="purchase-dots">
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
                        <div class="products-item hover" v-for="(item, index) in productsList" :key="index" @click="routerChange(item.path, { tabId: item.tabId })">
                            <div class="text">
                                <p class="name">{{ $t(`purchase.${item.nameLang}`) }}</p>
                                <p class="mes">{{ $t(`purchase.${item.mesLang}`) }}</p>
                                <div class="btn">
                                    <my-button showRightIcon>
                                        {{ $t('purchase.order') }}
                                    </my-button>
                                </div>
                            </div>
                            <div class="img-body">
                                <div class="img">
                                    <img class="products-img" :src="getPurchaseSrc(item.img, 'png')">
                                </div>
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
                        <div class="services-item hover" v-for="(item, index) in servicesList" :key="index" @click="routerChange(item.path)">
                            <svg-icon :icon-class="item.icon" class-name="services-icon" />
                            <div class="text">
                                <p class="name">{{ $t(`purchase.${item.nameLang}`) }}</p>
                                <p class="mes">{{ $t(`purchase.${item.mesLang}`) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Local deals -->
            <!-- <div class="box deals">
                <div class="content">
                    <div class="title">{{ $t('purchase.deals') }}</div>
                    <div class="btn">
                        <my-button showRightIcon>
                            {{ $t('purchase.check_more') }}
                        </my-button>
                    </div>
                </div>
            </div> -->
            <!-- HORWIN Official News -->
            <div class="box news">
                <div class="content">
                    <div class="title">{{ $t('purchase.news') }}</div>
                    <div class="news-list">
                        <div class="news-item hover" v-for="(item, index) in newsList" :key="index">
                            <div class="img-body">
                                <div class="img">
                                    <img class="news-img" :src="item.img">
                                </div>
                            </div>
                            <div class="text">
                                <p class="text-title" :title="item.title">{{ item.topic }}</p>
                                <p class="mes">{{ $Util.timeFilter(item.create_time) }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="btn">
                        <my-button showRightIcon>
                            {{ $t('purchase.check_more') }}
                        </my-button>
                    </div>
                </div>
            </div>
        </div>
        <a id="back-top" :style="{ position: upTopPosition }" @click="back2Top" v-show="showTop">
            <svg-icon icon-class="purchase-up" class-name="back-top-icon" />
            <svg-icon icon-class="purchase-up-color" class-name="back-top-icon-color" />
            <p class="back-top-text">{{ $t('purchase.back_top') }}</p>
        </a>
    </div>
</template>
    
<script>
import axios from 'axios';
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
                    path: '/purchase/item-list',
                    tabId: 1
                },
                {
                    nameLang: 'products_name2',
                    mesLang: 'products_mes2',
                    img: 'products-img2',
                    path: '/purchase/item-list',
                    tabId: 2
                },
                {
                    nameLang: 'products_name3',
                    mesLang: 'products_mes3',
                    img: 'products-img3',
                    path: '/purchase/item-list',
                    tabId: 53
                },
            ],
            servicesList: [
                {
                    nameLang: 'admin_backend',
                    mesLang: 'admin_backend_mes',
                    icon: 'purchase-admin',
                    path: '/system/user-list',
                },
                {
                    nameLang: 'coc_download',
                    mesLang: 'coc_download_mes',
                    icon: 'purchase-coc',
                    path: '/coc/coc-certificate',
                },
                // {
                //     nameLang: 'photo_video',
                //     mesLang: 'photo_video_mes',
                //     icon: 'purchase-phone-video',
                //     path: '',
                // },
            ],
            newsList: [
                {
                    title: 'HORWIN presents unique high performance e-motorcycle',
                    time: '05.30.2023',
                    img: 'products-img1',
                },
                {
                    title: 'HORWIN presents unique high performance e-motorcycle',
                    time: '05.30.2023',
                    img: 'products-img1',
                },
                {
                    title: 'HORWIN presents unique high performance e-motorcycle',
                    time: '05.30.2023',
                    img: 'products-img1',
                },
            ],
            upTopPosition: 'fixed',
            showTop: false
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.getNews()
        setTimeout(() => {
            this.scrollFn() // 首次执行初始化回到顶部按钮位置
        }, 1000);
        window.addEventListener('scroll', this.scrollFn)
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.scrollFn)
    },
    methods: {
        getNews() {
            let params = {
                "page": 1,// 页号
                "page_size": 6,// 页大小
                "type_list": [6, 7], // 类型：5.社区banner；6.社区文章；7.社区活动
                "region": Core.Const.LANG_MAP['en'].key, // 写死欧洲
            }
            let fullUrl = `https://app-api.horwincloud.com/client/1/community-post/list`;
            axios({
                method: 'post',
                url: fullUrl,
                data: { ...params },
            }).then(res => {
                this.newsList = res.data.data.list
            }).catch(err => {
                this.newsList = []
                console.log(err)
            })
        },
        getPurchaseSrc(name, type = 'png') {
            const path = `../../../assets/images/mall/purchase/${name}.${type}`;
            return purchaseModules[path]?.default || '';
        },
        // 回到顶部
        back2Top() {
            const dom = document.getElementById('mall-header')
            dom.scrollIntoView();
        },
        // 回到顶部按钮定位
        scrollFn() {
            const footerEl = document.querySelector('#mall-footer')
            //获取页面滚动距离
            const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
            const scrollBottom = scrollHeight - scrollTop - innerHeight
            if (scrollBottom > footerEl?.clientHeight) {// 离开footer
                this.upTopPosition = 'fixed'
            } else {// 进入footer
                this.upTopPosition = 'absolute'
            }
            // 控制显隐
            if (scrollTop > 300) {
                this.showTop = true
            } else {
                this.showTop = false
            }
        },
        // 路由跳转
        routerChange(routeUrl, item = {}, type = 1) {
            switch (type) {
                case 1:
                    this.$router.push({
                        path: routeUrl,
                        query: item
                    })
                    break;
                default:
                    break;
            }
        },
    }
};
</script>
    
<style lang="less" scoped>
#mall-purchase{
    position: relative;
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
                .flex(initial, initial, row);
                flex-wrap: wrap;
                .products-item {
                    .flex(center, center, column);
                    position: relative;
                    box-sizing: border-box;
                    width: calc((100% - 80px) / 3);
                    margin-right: 40px;
                    padding: 48px 40px;
                    background: #FFF;
                    transition: 0.05s;
                    cursor: pointer;
                    &:nth-child(3n) {
                        margin-right: 0;
                    }
                    .text {
                            .flex(space-between, center, column);
                            flex: 1;
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
                            text-align: center;
                        }
                        .btn {
                            .flex(center, center, row);
                            width: 100%;
                            text-align: center;
                            margin-bottom: 10px;
                            #my-button {
                                width: 142px;
                            }
                        }
                    }
                    .img-body {
                        width: 100%;
                        overflow: hidden;
                        .img {
                            width: 100%;
                            max-width: 453px;
                            aspect-ratio: 1.2;
                            .products-img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                        }
                    }
                }
            }
        }
        .services {
            background: rgba(119, 103, 255, .1);
            .services-list {
                .flex(initial, initial, row);
                flex-wrap: wrap;
                .services-item {
                    .flex(space-between, center, column);
                    width: calc((100% - 80px) / 3);
                    margin-right: 40px;
                    background: #FFF;
                    padding: 32px;
                    cursor: pointer;
                    
                    &:nth-child(3n) {
                        margin-right: 0;
                    }
                    &:nth-child(n + 4) {
                        margin-top: 40px;
                    }
                    .services-icon {
                        width: 48px;
                        height: 48px;
                        margin-bottom: 24px;
                    }
                    .text {
                        .flex(space-between, center, column);
                        flex: 1;
                        .name {
                            color: #333;
                            text-align: center;
                            font-family: Montserrat;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: normal;
                        }
                        .mes {
                            color: #999;
                            text-align: center;
                            font-family: Montserrat;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;
                        }
                    }
                }
            }
        }
        .deals {
            background: #FFF;
        }
        .news {
            background: #F8F8F8;
            .news-list {
                .flex(initial, initial, row);
                flex-wrap: wrap;
                .news-item {
                    .flex(space-between, center, column);
                    width: calc((100% - 80px) / 3);
                    margin-right: 40px;
                    background: #FFF;
                    cursor: pointer;
                    
                    &:nth-child(3n) {
                        margin-right: 0;
                    }
                    &:nth-child(n + 4) {
                        margin-top: 40px;
                    }
                    .img-body {
                        width: 100%;
                        overflow: hidden;
                        .img {
                            width: 100%;
                            aspect-ratio: 453 / 254;
                            overflow: hidden;
                            .news-img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                        }
                    }
                    .text {
                        .flex(space-between, initial, column);
                        flex: 1;
                        padding: 40px 32px;
                        width: 100%;
                        .text-title {
                            .ellipsis(2);
                            color: #333;
                            font-family: Montserrat;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: normal;
                            margin-bottom: 32px;
                        }
                        .mes {
                            color: #999;
                            font-family: Montserrat;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;
                        }
                    }
                }
            }
        }
        .btn {
            .fcc();
            margin-top: 40px;
            #my-button {
                width: 149px;
            }
        }
    }
    #back-top {
        .flex(center, center, column);
        padding: 14px 12px 19px 12px;
        width: 80px;
        height: 80px;
        right: 80px;
        bottom: 40px;
        border: 1px solid #EEE;
        background: #FFF;
        cursor: pointer;
        z-index: 999;
        .back-top-icon, .back-top-icon-color {
            width: 32px;
            height: 32px;
        }
        .back-top-icon-color {
            display: none;
        }
        .back-top-text {
            color: #666;
            font-family: Montserrat;
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            text-transform: capitalize;
        }
        &:hover {
            .back-top-icon {
                display: none;
            }
            .back-top-icon-color {
                display: block;
            }
            .back-top-text {
                background: linear-gradient(100deg, #C6F 0%, #66F 100%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }
    @media (min-width: 820px) {}
    @media (max-width: 820px) {}
}
.hover {
    &:hover {
        box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.08);
        .name {
            background: linear-gradient(100deg, #C6F 0%, #66F 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .img {
            transition: 0.2s;
            transform: scale(1.1);
        }
    }
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