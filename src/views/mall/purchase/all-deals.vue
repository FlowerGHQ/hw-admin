<template>
    <div id="index">
        <section id="article">
            <div class="container">
                <!-- 地方政策列表 -->
                <div class="deals-list">
                    <div
                        class="deals-item hover"
                        v-for="(item, index) in reportList"
                        :key="index"
                        @click="selectDeals(item.id)"
                    >
                        <div class="img-body">
                            <div class="img">
                                <img class="deals-img" :src="$Util.imageFilter(JSON.parse(item.img)[0].path, 5)" />
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
            // 默认 15 条
            reportList: [],
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
        this.getDeals();
        window.addEventListener('scroll', this.handleScroll);
    },
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleWindowResize);
    },
    methods: {
        // 获取地方政策
        getDeals() {
            if (this.loadingArticle) return;
            this.loadingArticle = true;
            let params = {
                page: this.pagination.page, // 页号
                page_size: this.pagination.page_size, // 页大小
                title: '',
                area: '',
                type: 1,
            };
            Core.Api.Operation.list({ ...params })
                .then(res => {
                    this.reportList = this.reportList.concat(res.list);
                    this.reportList = this.reportList.map(item => {
                        item.firstSentence = Core.Util.Common.getFirstSentence(item.content);
                        return item;
                    });
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
        selectDeals(id) {
            this.routerChange('mall/deals-detail', { id });
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
            this.getDeals();
        },
        // 窗口大小
        handleWindowResize() {
            this.footerHeight = document.querySelector('#mall-footer').clientHeight;
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

    .container {
        width: 100%;
    }

    #article {
        width: 100%;
        flex: 1;
        .flex(initial, center, column);

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

        .deals-list {
            .flex(initial, initial, column);
            flex-wrap: wrap;

            .deals-item {
                .flex(initial, initial, row);
                background: #fff;
                cursor: pointer;

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

    .loading {
        padding: 97px 0 127px 0;
    }

    .empty {
        width: 100%;
    }
}

.hover {
    &:hover {
        box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.08);

        .name {
            background: linear-gradient(100deg, #c6f 0%, #66f 100%);
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
        }
    }
}

@media (min-width: 1280px) {
    #index {
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
        }

        .loading {
            padding: 30px 0;
        }
    }
}
</style>
