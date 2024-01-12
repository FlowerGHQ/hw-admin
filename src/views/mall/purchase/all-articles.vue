<template>
    <div id="index">
        <section id="article">
            <div class="container">
                <!-- 文章列表 -->
                <div class="article-list">
                    <template v-if="articleList.length > 0">
                        <div class="article-item" v-for="(item, index) in articleList" :key="index" @click="selectArticle(item.id)">
                            <div class="article-item-img">
                                <fadeInImage class="article-item-img-content" :src="$Util.imageFilter(item.img)" />
                            </div>
                            <div class="article-item-content">
                                <div class="fixed-lable" :class="Core.Const.HOME.STATUS_MAP[item.activity_state].color_type" v-if="!loadingArticle && item.activity_state">
                                    {{ Core.Const.HOME.STATUS_MAP[item.activity_state][$i18n.locale] }}
                                </div>
                                <div class="about">
                                    <span class="time" :title="$Util.timeFilter(item.create_time, 6)" v-if="item.type === 6">{{ $Util.timeFilter(item.create_time, 6) }}</span>
                                    <span class="time" :title="`${$Util.timeFilter(item.activity_join_begin_time, 6)} - ${$Util.timeFilter(item.activity_join_end_time, 6)}`" v-else>{{ $Util.timeFilter(item.activity_join_begin_time, 6) }} - {{ $Util.timeFilter(item.activity_join_end_time, 6) }}</span>
                                </div>
                                <p class="content" :title="item.topic">{{ item.topic }}</p>
                            </div>
                        </div>
                    </template>
                    <a-empty class="empty" v-else />
                </div>
            </div>
        </section>
        <down-loading class="loading" :show="loadingArticle"/>
    </div>
</template>

<script>
import axios from 'axios';
import Core from '@/core';
import DownLoading from '../components/DownLoading.vue';
import fadeInImage from '../components/FadeInImage.vue';

export default {
    components: {
        DownLoading, fadeInImage
    },
    data() {
        return {
            Core,
            footerHeight: 0,
            // 默认 15 条
            articleList: [],
            pagination: {
                page_size: 15,
                page: 1,
                total: 0,
                total_page: 0
            },
            loadingArticle: false,
        };
    },
    watch: {},
    created() {
        window.addEventListener('resize', this.handleWindowResize)
    },
    mounted() {
        this.getArticle()
        window.addEventListener('scroll', this.handleScroll)
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll)
        window.removeEventListener('resize', this.handleWindowResize);
    },
    methods: {
        getArticle() {
            if (this.loadingArticle) return
            this.loadingArticle = true
            let params = {
                "page": this.pagination.page,// 页号
                "page_size": this.pagination.page_size,// 页大小
                "type_list": [6, 7], // 类型：5.社区banner；6.社区文章；7.社区活动
                "region": Core.Const.LANG_MAP['en'].key,// 默认去欧洲
            }
            let fullUrl = `https://app-api.horwincloud.com/client/1/community-post/list`;
            axios({
                method: 'post',
                url: fullUrl,
                data: { ...params },
            }).then(res => {
                res = res.data.data
                this.articleList = this.articleList.concat(res.list)
                this.pagination.total = res.count
                this.pagination.total_page = Math.ceil(this.pagination.total / this.pagination.page_size)
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.loadingArticle = false
            })
        },
        selectArticle(id) {
            this.routerChange('mall/detail', { id })
        },
        /*== 路由跳转 start ==*/
        routerChange(key, q = {}) {
            this.$router.push({
                path: `/${key}`,
                query: q
            });
        },
        /*== 路由跳转 end ==*/
        handleScroll() {
            this.footerHeight = document.querySelector('#mall-footer').clientHeight
            const html = document.documentElement
            Core.Util.handleScrollFn(html, this.getData, this.pagination, this.loadingArticle, this.footerHeight)
        },
        getData(params = {}) {
            this.getArticle()
        },
        // 窗口大小
        handleWindowResize() {
            this.footerHeight = document.querySelector('#MyFooter').clientHeight
        },
    },
};
</script>

<style scoped lang="less">
    @duration: 0.1s;
    #index {
        background-color: #F5F5F5;
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
                font-family: Montserrat;
                font-size: 26px;
                margin: 0;
                padding: 48px 0 0 0;
            }
            .article-list {
                display: flex;
                flex-wrap: wrap;
                padding-top: 80px;
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
                        background: #FFF;
                        box-shadow: 0px 8px 24px 0px #DADADA;
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
                        color: #FFF;
                        font-size: 14px;
                        font-family: Montserrat;
                    }
                    .orange {
                        background: linear-gradient(100deg, #C6F 0%, #66F 100%);
                        backdrop-filter: blur(5px);
                    }
                    .grey {
                        background: rgba(146, 146, 146, 0.5);
                        color: #FFF;
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
                            .fsb;//flex上下居中 左右对齐
                            color: #333-sub;
                            margin-bottom: 16px;
                            .time {
                                font-family: Montserrat;
                                font-size: 14px;
                                .ellipsis(1);
                            }
                            .comment-and-like {
                                .fac;//flex上下居中
                                margin-left: 30px;
                                .comment-img, .like-img {
                                    width: 22px;
                                    height: 22px;
                                    margin-right: 6px;
                                }
                                .comment-num {
                                    display: inline-block;
                                    width: 36px;
                                    margin-right: 6px;
                                    font-family: Montserrat;
                                    font-size: 14px;
                                }
                                .like-num {
                                    font-family: Montserrat;
                                    font-size: 14px;
                                }
                            }
                        }
                        .content {
                            color: #333;
                            font-size: 18px;
                            font-family: Montserrat;
                            .ellipsis(3);
                        }
                    }
                }
            }
        }
        .loading {
            padding: 97px 0 127px 0;;
        }
        .empty {
            width: 100%;
        }
    }
    // PC端
    @media (min-width: 750px) and (max-width: 1280px) {
        #index {
            .container {
                width: 100%;
            }
            #article {
                padding: 0 40px;
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
                    font-family: Montserrat;
                    font-size: 13px;
                    margin: 0;
                    padding: 17px 20px 0 20px;
                }
                .article-list {
                    padding: 20px;
                    .article-item {
                        width: 100%;
                        margin-bottom: 12px;
                        margin-right: 0;
                        background-color: #FFF;
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
