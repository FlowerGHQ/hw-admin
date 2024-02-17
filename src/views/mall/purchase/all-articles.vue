<template>
    <div id="index">
        <section id="article">
            <div class="container">
                <!-- 轮播图 -->
                <div class="article-carousel">
                    <template v-if="carouselList.length > 0">
                        <a-carousel
                            :arrows="true"
                            :dots="false"
                            :after-change="onChange"
                            autoplay
                            :autoplaySpeed="5000"
                        >
                            <template #prevArrow>
                                <div class="custom-slick-arrow" style="left: 24px; z-index: 1">
                                    <img class="carousel-left" src="@images/mall/purchase/arrow-left-s-line.png" />
                                </div>
                            </template>
                            <template #nextArrow>
                                <div class="custom-slick-arrow" style="right: 24px">
                                    <img class="carousel-right" src="@images/mall/purchase/arrow-right-s-line.png" />
                                </div>
                            </template>

                            <div
                                style="display: block"
                                v-for="(item, index) in carouselList"
                                :key="index"
                                @click="selectArticle(item.id)"
                            >
                                <div class="article-carousel-content">
                                    <img
                                        class="article-carousel-content-img"
                                        :src="
                                            item.banner ? $Util.imageFilter(item.banner) : $Util.imageFilter(item.img)
                                        "
                                    />
                                    <div class="article-carousel-fixed">
                                        <div class="article-carousel-fixed-text">
                                            <p class="text-title">{{ item.topic }}</p>
                                            <p class="text-sub-title">{{ item.description }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a-carousel>
                    </template>
                    <img style="width: 100%" src="@images/mall/purchase/default-img.png" v-else />
                </div>
                <!-- 文章列表 -->
                <div class="article-list">
                    <template v-if="articleList.length > 0">
                        <div
                            class="article-item"
                            v-for="(item, index) in articleList"
                            :key="index"
                            @click="selectArticle(item.id)"
                        >
                            <div class="article-item-img">
                                <fadeInImage class="article-item-img-content" :src="$Util.imageFilter(item.img)" />
                            </div>
                            <div class="article-item-content">
                                <div
                                    class="fixed-lable"
                                    :class="Core.Const.HOME.STATUS_MAP[item.activity_state].color_type"
                                    v-if="!loadingArticle && item.activity_state"
                                >
                                    {{ Core.Const.HOME.STATUS_MAP[item.activity_state][$i18n.locale] }}
                                </div>
                                <div class="about">
                                    <span
                                        class="time"
                                        :title="$Util.timeFilter(item.create_time, 6)"
                                        v-if="item.type === 6"
                                        >{{ $Util.timeFilter(item.create_time, 6) }}</span
                                    >
                                    <span
                                        class="time"
                                        :title="`${$Util.timeFilter(item.activity_join_begin_time, 6)} - ${$Util.timeFilter(item.activity_join_end_time, 6)}`"
                                        v-else
                                        >{{ $Util.timeFilter(item.activity_join_begin_time, 6) }} -
                                        {{ $Util.timeFilter(item.activity_join_end_time, 6) }}</span
                                    >
                                </div>
                                <p class="content" :title="item.topic">{{ item.topic }}</p>
                            </div>
                        </div>
                    </template>
                    <a-empty class="empty" v-else />
                </div>
            </div>
        </section>
        <down-loading class="loading" :show="loadingArticle" />
    </div>
</template>

<script>
import axios from 'axios';
import Core from '@/core';
import DownLoading from '../components/DownLoading.vue';
import fadeInImage from '../components/FadeInImage.vue';

export default {
    components: {
        DownLoading,
        fadeInImage,
    },
    data() {
        return {
            Core,
            footerHeight: 0,
            carouselList: [],
            // 默认 15 条
            articleList: [],
            pagination: {
                page_size: 15,
                page: 1,
                total: 0,
                total_page: 0,
            },
            loadingCarousel: false,
            loadingArticle: false,
        };
    },
    watch: {},
    created() {
        window.addEventListener('resize', this.handleWindowResize);
    },
    mounted() {
        this.getCarousel();
        this.getArticle();
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleWindowResize);
    },
    methods: {
        // 获取banner
        getCarousel() {
            this.loadingCarousel = true;
            let params = {
                page: 1, // 页号
                page_size: 999, // 页大小
                flag_banner: 1, // 类型：0否，1是
                region: Core.Const.LANG_MAP['en'].key, // 默认去欧洲
            };
            let fullUrl = `https://app-api.horwincloud.com/client/1/community-post/list`;
            axios({
                method: 'post',
                url: fullUrl,
                data: { ...params },
            })
                .then(res => {
                    res = res.data.data;
                    this.carouselList = res.list;
                })
                .catch(err => {
                    this.carouselList = [];
                    console.log(err);
                })
                .finally(() => {
                    this.loadingCarousel = false;
                });
        },
        // 获取文章
        getArticle() {
            if (this.loadingArticle) return;
            this.loadingArticle = true;
            let params = {
                page: this.pagination.page, // 页号
                page_size: this.pagination.page_size, // 页大小
                type_list: [6], // 类型：5.社区banner；6.社区文章；7.社区活动
                region: Core.Const.LANG_MAP['en'].key, // 默认去欧洲
            };
            let fullUrl = `https://app-api.horwincloud.com/client/1/community-post/list`;
            axios({
                method: 'post',
                url: fullUrl,
                data: { ...params },
            })
                .then(res => {
                    res = res.data.data;
                    this.articleList = this.articleList.concat(res.list);
                    this.pagination.total = res.count;
                    this.pagination.total_page = Math.ceil(this.pagination.total / this.pagination.page_size);
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.loadingArticle = false;
                });
        },
        onChange() {},
        selectArticle(id) {
            this.routerChange('mall/detail', { id });
        },
        /*== 路由跳转 start ==*/
        routerChange(key, q = {}) {
            this.$router.push({
                path: `/${key}`,
                query: q,
            });
        },
        /*== 路由跳转 end ==*/
        handleScroll() {
            this.footerHeight = document.querySelector('#mall-footer').clientHeight;
            const html = document.documentElement;
            Core.Util.handleScrollFn(html, this.getData, this.pagination, this.loadingArticle, this.footerHeight);
        },
        getData(params = {}) {
            this.getArticle();
        },
        // 窗口大小
        handleWindowResize() {
            this.footerHeight = document.querySelector('#MyFooter').clientHeight;
        },
    },
};
</script>

<style scoped lang="less">
@duration: 0.1s;
#index {
    padding: 80px 0;
    margin: 0 auto;
    width: 75%;
    .flex(initial, initial, column);
    #article {
        width: 100%;
        flex: 1;
        .flex(initial, center,column);
        .title {
            color: #333;
            font-size: 26px;
            margin: 0;
            padding: 48px 0 0 0;
        }
        .article-carousel {
            aspect-ratio: 2.48;
            .article-carousel-content {
                position: relative;
                display: flex;
                justify-content: center;
                cursor: pointer;

                .article-carousel-fixed {
                    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 26.29%, rgba(0, 0, 0, 0.8) 88.1%);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    .article-carousel-fixed-text {
                        width: 100%;
                        position: absolute;
                        bottom: 0;
                        padding: 0 120px 64px 120px;
                        .text-title {
                            color: #fff;
                            font-size: 32px;
                            text-align: left;
                            margin-bottom: 16px;
                            font-weight: 700;
                        }
                        .text-sub-title {
                            color: #bfbfbf;
                            text-align: left;
                            font-size: 16px;
                            width: 570px;
                            margin-bottom: 0;
                        }
                    }
                }
                .article-carousel-content-img {
                    transition: @duration;
                    width: 100%;
                    aspect-ratio: 2.48;
                    object-fit: cover;
                }
            }
            .carousel-left,
            .carousel-right {
                width: 48px;
                height: 48px;
            }
        }
        .article-list {
            display: flex;
            flex-wrap: wrap;
            padding-top: 30px;
            .article-item {
                width: calc((100% - 60px) / 3);
                margin-bottom: 30px;
                margin-right: 30px;
                position: relative;
                transition: @duration;
                cursor: pointer;
                &:nth-child(3n) {
                    margin-right: 0;
                }
                &:hover {
                    background: #fff;
                    box-shadow: 0px 8px 24px 0px #dadada;
                    .article-item-img .article-item-img-content {
                        transform: scale(1.2);
                    }
                }
                .fixed-lable {
                    padding: 8px 16px;
                    position: absolute;
                    top: 14.5px;
                    right: 14.5px;
                    background: rgba(146, 146, 146, 0.5);
                    color: #fff;
                    font-size: 14px;
                }
                .orange {
                    background: linear-gradient(100deg, #c6f 0%, #66f 100%);
                    backdrop-filter: blur(5px);
                }
                .grey {
                    background: rgba(146, 146, 146, 0.5);
                    color: #fff;
                }
                &-img {
                    overflow: hidden;
                    width: 100%;
                    aspect-ratio: 1.78;
                    .article-item-img-content {
                        transition: @duration;
                        width: 100%;
                        aspect-ratio: 1.78;
                        object-fit: cover;
                    }
                }
                &-content {
                    height: 132px;
                    padding: 16px;
                    .about {
                        .fsb; //flex上下居中 左右对齐
                        color: #333-sub;
                        margin-bottom: 16px;
                        .time {
                            font-size: 14px;
                            .ellipsis(1);
                        }
                        .comment-and-like {
                            .fac; //flex上下居中
                            margin-left: 30px;
                            .comment-img,
                            .like-img {
                                width: 22px;
                                height: 22px;
                                margin-right: 6px;
                            }
                            .comment-num {
                                display: inline-block;
                                width: 36px;
                                margin-right: 6px;
                                font-size: 14px;
                            }
                            .like-num {
                                font-size: 14px;
                            }
                        }
                    }
                    .content {
                        color: #333;
                        font-size: 18px;
                        .ellipsis(3);
                    }
                }
            }
        }
    }
    .loading {
        padding: 97px 0 127px 0;
    }
    .empty {
        width: 100%;
    }
}
/* For carousel */
.ant-carousel /deep/.slick-slider {
    &:hover {
        box-shadow: 0px 8px 24px 0px #dadada;
        .article-carousel-content-img {
            transform: scale(1.2);
        }
    }
}
.ant-carousel /deep/.slick-slide {
    text-align: center;
    // height: 484px;
    overflow: hidden;

    font-size: 0; // 清除inline-block带来的高度bug
}

.ant-carousel /deep/.custom-slick-arrow {
    width: 48px;
    height: 48px;
    opacity: 0.3;
    transform: translateY(-50%);
}

.ant-carousel /deep/.slick-slide h3 {
    color: #fff;
}
.ant-carousel /deep/.custom-slick-arrow:before {
    display: none;
}
.ant-carousel /deep/.custom-slick-arrow:hover {
    opacity: 1;
}
// PC端
@media (min-width: 750px) and (max-width: 1280px) {
    #index {
        .container {
            width: 100%;
        }
        #article {
            padding: 0 40px;
            .article-carousel {
                width: calc(100vw - 80px);
                .article-carousel-content .article-carousel-fixed .article-carousel-fixed-text {
                    padding: 0 101px 27px 101px;
                    .text-title {
                        margin-bottom: 13px;
                    }
                    .text-sub-title {
                        width: auto;
                    }
                }
            }
            .article-list {
                .article-item {
                    .article-item-content {
                        padding: 13px;
                    }
                }
            }
        }
    }
}
@media (min-width: 1280px) {
    #index {
        .container {
            width: 1200px;
        }
        #article {
            padding: 0;
            .article-carousel {
                width: auto;
                .article-carousel-content .article-carousel-fixed .article-carousel-fixed-text {
                    padding: 0 120px 64px 120px;
                    .text-title {
                        margin-bottom: 16px;
                    }
                    .text-sub-title {
                        width: 570px;
                    }
                }
            }
        }
    }
}
// APP端
@media (max-width: 750px) {
    #index {
        padding-top: 0;
        .container {
            width: 100%;
            padding: 0px;
        }
        #article {
            padding: 0;
            .title {
                color: #333;
                font-size: 13px;
                margin: 0;
                padding: 17px 20px 0 20px;
            }
            .article-carousel {
                aspect-ratio: 1.78;
                width: 100vw;
                .article-carousel-content .article-carousel-fixed .article-carousel-fixed-text {
                    padding: 0 20px 24px 20px;
                    .text-title {
                        font-size: 14px;
                        margin-bottom: 0;
                    }
                    .text-sub-title {
                        font-size: 12px;
                        width: auto;
                    }
                }
                .article-carousel-content {
                    .article-carousel-content-img {
                        aspect-ratio: 1.78;
                    }
                }
            }
            .article-list {
                padding: 20px;
                .article-item {
                    width: 100%;
                    margin-bottom: 12px;
                    margin-right: 0;
                    background-color: #fff;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    .fixed-lable {
                        font-size: 13px;
                    }
                    .article-item-content {
                        height: auto;
                        padding: 9px 12px;
                        .about {
                            margin-bottom: 2.5px;
                            .comment-and-like {
                                .comment-num {
                                    font-size: 12px;
                                }
                                .like-num {
                                    font-size: 12px;
                                }
                            }
                            .time {
                                font-size: 12px;
                            }
                        }
                        .content {
                            font-size: 14px;
                            margin-bottom: 5px;
                        }
                    }
                }
            }
        }
        .loading {
            padding: 30px 0;
        }
    }
}
</style>
