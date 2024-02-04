<template>
    <div id="mall-purchase">
        <!-- 公告 -->
        <div class="report-body">
            <div class="report-carousel">
                <a-carousel arrows autoplay :autoplaySpeed="6000" :dots="false" :key="`report-${lang}`">
                    <template #prevArrow>
                        <div class="custom-slick-arrow" style="left: 12.5%; z-index: 1">
                            <svg-icon icon-class="arrow-left-report" class-name="arrow-left-report" />
                            <svg-icon icon-class="arrow-left-hover" class-name="arrow-left-hover" />
                        </div>
                    </template>
                    <template #nextArrow>
                        <div class="custom-slick-arrow" style="right: 12.5%;">
                            <svg-icon icon-class="arrow-right-report" class-name="arrow-right-report" />
                            <svg-icon icon-class="arrow-right-hover" class-name="arrow-right-hover" />
                        </div>
                    </template>
                    <div v-for="item in topList">
                        <div class="report-item">
                            <span class="report-text">{{ item.title }}</span>
                            <span class="report-more" @click="routerChange('/mall/deals-detail', { id: item.id }, 2)">
                                <span class="text">
                                    {{ $t('purchase.check_details') }}
                                </span>
                                <svg-icon icon-class="goto-hover" class-name="goto-hover" />
                            </span>
                        </div>
                    </div>
                </a-carousel>
            </div>
        </div>
        <!-- 轮播图 -->
        <div class="carousel">
            <a-carousel arrows autoplay :autoplaySpeed="6000" dotsClass="purchase-dots" key="banner">
                <template #prevArrow>
                    <div class="custom-slick-arrow" style="left: 48px;z-index: 1">
                        <img src="@images/mall/purchase/arrow-ad.png" class="arrow-left-ad">
                        <svg-icon icon-class="arrow-ad-hover" class-name="arrow-left-ad-hover" />
                    </div>
                </template>
                <template #nextArrow>
                    <div class="custom-slick-arrow" style="right: 48px">
                        <img src="@images/mall/purchase/arrow-ad.png" class="arrow-right-ad">
                        <svg-icon icon-class="arrow-ad-hover" class-name="arrow-right-ad-hover" />
                    </div>
                </template>
                <div v-for="item in carouselList">
                    <div class="carousel-item" :class="item.url ? 'pointer' : ''" @click="bannerClick(item.url)">
                        <img class="img" :src="$Util.imageFilter(JSON.parse(item.img)[0].path, 5)">
                    </div>
                </div>
            </a-carousel>
        </div>
        <div class="container">
            <!-- 我们的产品 -->
            <div class="box products">
                <div class="content">
                    <div class="title">{{ $t('purchase.products') }}</div>
                    <div class="products-list">
                        <div class="products-item hover" v-for="(item, index) in productsList.slice(0, 3)" :key="index"
                            @click="routerChange(item.path)">
                            <div class="text">
                                <p class="name">{{ $t(`purchase.${item.nameLang}`) }}</p>
                                <p class="mes">{{ $t(`purchase.${item.mesLang}`) }}</p>
                                <div class="btn">
                                    <my-button showRightIcon padding="12px 32px" font="14px">
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
            <!-- Horwin服务 -->
            <div class="box services">
                <div class="content">
                    <div class="title">{{ $t('purchase.services') }}</div>
                    <div class="services-list">
                        <div class="services-item hover" v-for="(item, index) in servicesList" :key="index"
                            @click="routerChange(item.path)">
                            <svg-icon :icon-class="item.icon" class-name="services-icon" />
                            <div class="text">
                                <p class="name">{{ $t(`purchase.${item.nameLang}`) }}</p>
                                <!-- <p class="mes">{{ $t(`purchase.${item.mesLang}`) }}</p> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 本地交易 -->
            <div class="box deals">
                <div class="content">
                    <div class="title">{{ $t('purchase.deals') }}</div>
                    <div class="deals-list">
                        <div class="deals-item hover" v-for="(item, index) in reportList" :key="index"
                            @click="routerChange('/mall/deals-detail', { id: item.id }, 2)">
                            <div class="img-body">
                                <div class="img">
                                    <img class="deals-img" :src="$Util.imageFilter(JSON.parse(item.img)[0].path, 5)">
                                </div>
                            </div>
                            <div class="text">
                                <div>
                                    <p class="text-title" :title="item.title">{{ item.title }}</p>
                                    <p class="text-subtitle" :title="item.firstSentence">{{ item.firstSentence }}</p>
                                </div>
                                <p class="time" v-if="lang === 'zh'">{{ $Util.timeFilter(item.create_time, 3) }}</p>
                                <p class="time" v-else>{{ $Util.timeFilter(item.create_time, 6) }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="btn">
                        <my-button showRightIcon @click="routerChange('/mall/all-deals')">
                            {{ $t('purchase.check_more') }}
                        </my-button>
                    </div>
                </div>
            </div>
            <!-- Horwin官方新闻 -->
            <div class="box news">
                <div class="content">
                    <div class="title">{{ $t('purchase.news') }}</div>
                    <div class="news-list">
                        <div class="news-item hover" v-for="(item, index) in newsList" :key="index"
                            @click="routerChange('/mall/detail', { id: item.id })">
                            <div class="img-body">
                                <div class="img">
                                    <img class="news-img" :src="item.img">
                                </div>
                            </div>
                            <div class="text">
                                <p class="text-title" :title="item.topic">{{ item.topic }}</p>
                                <p class="mes" v-if="lang === 'zh'">{{ $Util.timeFilter(item.create_time, 3) }}</p>
                                <p class="mes" v-else>{{ $Util.timeFilter(item.create_time, 6) }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="btn" @click="routerChange('/mall/all-articles')">
                        <my-button showRightIcon padding="12px 32px" font="14px">
                            {{ $t('purchase.check_more') }}
                        </my-button>
                    </div>
                </div>
            </div>
        </div>
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
    },
    data() {
        return {
            Core,
            topList: [],
            carouselList: [],
            productsList: Object.values(Core.Const.ITEM.TYPE_MAP),
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
            reportList: [],
            newsList: [],
        };
    },
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    watch: {},
    created() { },
    mounted() {
        this.getNews()
        this.getTop()
        this.getDeals()
        this.getCarousel()
    },
    methods: {
        // 获取banner
        getCarousel() {
            this.loadingCarousel = true
            let params = {
                "page": 1,// 页号
                "page_size": 3,// 页大小
                type: 2
            }
            Core.Api.Operation.list({ ...params }).then(res => {
                this.carouselList = res.list
            }).catch(err => {
                this.carouselList = []
                console.log(err)
            }).finally(() => {
                this.loadingCarousel = false
            })
        },
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
        // 获取公告
        getTop() {
            let params = {
                "page": 1,// 页号
                "page_size": 3,// 页大小
                show_type: '1',
                type: 1
            }
            Core.Api.Operation.list({ ...params }).then(res => {
                this.topList = res.list
            }).catch(err => {
                console.log(err)
            })
        },
        // 获取地方政策
        getDeals() {
            let params = {
                "page": 1,// 页号
                "page_size": 2,// 页大小
                show_type: '2',
                type: 1
            }
            Core.Api.Operation.list({ ...params }).then(res => {
                this.reportList = res.list
                this.reportList = this.reportList.map(item => {
                    item.firstSentence = Core.Util.Common.getFirstSentence(item.content)
                    return item
                })
            }).catch(err => {
                console.log(err)
            })
        },
        getPurchaseSrc(name, type = 'png') {
            const path = `../../../assets/images/mall/purchase/${name}.${type}`;
            return purchaseModules[path]?.default || '';
        },
        bannerClick(url) {
            if (!url) return;
            if (!/^(http:|https:)/i.test(url)) url = "https://" + url;// 没有http自动加上
            window.open(url, '_blank')
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
                case 2:
                    const path = this.$router.resolve({
                        path: routeUrl,
                        query: item
                    })
                    window.open(path.href, '_blank')
                    break;
                default:
                    break;
            }
        },
    }
};
</script>

<style lang='scss' scoped src='../css/layout.css'></style>
<style lang="less" scoped>
#mall-purchase {
    position: relative;

    .container {
        .box {
            .content {
                >.btn {
                    .fcc();
                    margin-top: 40px;

                    #my-button {
                        padding: 12px 32px;
                    }
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
                            font-size: 32px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: normal;
                            margin-bottom: 20px;
                        }

                        .mes {
                            color: #999;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: 28px;
                            /* 200% */
                            margin-bottom: 24px;
                            text-align: center;
                        }

                        .btn {
                            .flex(center, center, row);
                            width: 100%;
                            text-align: center;
                            margin-bottom: 10px;

                            #my-button {
                                padding: 12px 32px;
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
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: normal;
                            margin-bottom: 10px;
                        }

                        .mes {
                            color: #999;
                            text-align: center;
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

            .deals-list {
                .flex(initial, initial, column);
                flex-wrap: wrap;

                .deals-item {
                    .flex(initial, initial, row);
                    margin-right: 40px;
                    background: #FFF;
                    cursor: pointer;

                    &:nth-child(3n) {
                        margin-right: 0;
                    }

                    &:nth-child(n + 2) {
                        margin-top: 40px;
                    }

                    .img-body {
                        height: 254px;
                        overflow: hidden;

                        .img {
                            height: 100%;
                            overflow: hidden;

                            .deals-img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                        }
                    }

                    .text {
                        .flex(space-between, initial, column);
                        flex: 1;
                        padding: 40px;
                        width: 100%;
                        background: #FAFAFA;
                        ;

                        .text-title {
                            .ellipsis(1);
                            color: #333;
                            font-size: 18px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: 28px;
                            /* 155.556% */
                        }

                        .text-subtitle {
                            .ellipsis(2);
                            color: #666;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;
                            margin-top: 16px;
                        }

                        .time {
                            color: #999;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;
                        }
                    }
                }
            }
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
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: normal;
                            margin-bottom: 32px;
                        }

                        .mes {
                            color: #999;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;
                        }
                    }
                }
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

        .back-top-icon,
        .back-top-icon-color {
            width: 32px;
            height: 32px;
        }

        .back-top-icon-color {
            display: none;
        }

        .back-top-text {
            color: #666;
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            text-transform: capitalize;
            white-space: nowrap;
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
.pointer {
    cursor: pointer;
}

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

.report-body {
    background: rgba(119, 103, 255, .1);

    .report-carousel {
        .report-item {
            .fcc();
            margin: 0 auto;
            padding: 0 30px;
            width: 75%;
            height: 56px;
            overflow: hidden;

            .report-text {
                .ell();
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 24px;
                background: linear-gradient(100deg, #C6F 0%, #66F 100%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .report-more {
                white-space: nowrap;
                margin-left: 16px;
                cursor: pointer;

                .text {
                    display: inline-block;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 14px;
                    background: linear-gradient(100deg, #C6F 0%, #66F 100%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    position: relative;

                    &::after {
                        content: '';
                        width: 100%;
                        height: 1px;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        background: linear-gradient(100deg, #C6F 0%, #66F 100%);
                    }
                }

                .goto-hover {
                    margin-left: 4px;
                }
            }
        }
    }

    .arrow-left-report,
    .arrow-right-report,
    .arrow-left-hover,
    .arrow-right-hover {
        width: 24px;
        height: 24px;
    }

    .arrow-left-report,
    .arrow-right-report {
        display: inline-block;

    }

    .arrow-left-hover,
    .arrow-right-hover {
        display: none;
    }

    .custom-slick-arrow {
        &:hover {

            .arrow-left-report,
            .arrow-right-report {
                display: none;
            }

            .arrow-left-hover,
            .arrow-right-hover {
                display: inline-block;
            }
        }
    }
}

/* For carousel */
.carousel {

    .arrow-left-ad,
    .arrow-right-ad {
        display: inline-block;
        height: 48px;
        width: 48px;
    }

    .arrow-left-ad-hover,
    .arrow-right-ad-hover {
        display: none;
        height: 48px;
        width: 48px;
    }

    .arrow-left-ad,
    .arrow-left-ad-hover {
        transform: rotate(180deg);
    }

    .ant-carousel /deep/.custom-slick-arrow {
        width: 48px;
        height: 48px;
        transform: translateY(-50%);

        &:hover {

            .arrow-left-ad,
            .arrow-right-ad {
                display: none;
            }

            .arrow-left-ad-hover,
            .arrow-right-ad-hover {
                display: inline-block;
            }
        }
    }

    .ant-carousel /deep/.custom-slick-arrow {
        display: none !important;
    }

    .ant-carousel:hover {
        /deep/.custom-slick-arrow {
            display: block !important;
        }
    }
}

.carousel-left,
.carousel-right {
    width: 48px;
    height: 48px;
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