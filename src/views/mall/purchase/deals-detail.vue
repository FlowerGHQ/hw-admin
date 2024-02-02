<template>
    <div id="index">
        <div class="detail-pc">
            <section id="article">
                <div class="container" id="container-pc">
                    <!-- 文章主图 -->
                    <!-- <div class="container-img">
                        <img :src='detail?.img' alt='' />
                    </div> -->
                    <div class="begin-time">{{ $Util.timeFilter(detail?.create_time, 6) }}</div>
                    <div class="begin-title">{{ detail?.title }}</div>
                    <div class="content-formatter" v-html="detail?.content"></div>
                </div>
            </section>
            <div class="download" v-if="detail?.attachment && detail?.attachment.length > 0">
                <div class="title">
                    Related documents
                </div>
                <div class="file-body">
                    <div class="file-item" v-for="item in detail?.attachment">
                        <div class="icon">
                            <svg-icon icon-class="pdf-svg" class-name="pdf-svg" />
                        </div>
                        <div class="mes-body">
                            <div class="text">
                                <span class="name">{{ item.name }}</span>
                                <span class="time">{{ $Util.timeFilter(detail?.create_time, 6) }}</span>
                            </div>
                            <div class="download-btn" @click="download(item.path)">
                                <svg-icon icon-class="download" class-name="download-svg" />
                                <span class="download-text">{{ $t('common.download') }}</span>
                            </div>
                        </div>
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
import SvgIcon from "@/components/MySvgIcon/index.vue";

export default {
    components: {
        MyButton, SvgIcon
    },
    data() {
        return {
            Core,
            id: '',
            isActivity: false,
            innerWidth: window.innerWidth,
            // formattedContent: html.content||'',
            detail: '',
            // pc-固定操作栏
            screenWidth: 0,
            innerHeight: window.innerHeight,
            // 部分浏览器的底部有部分距离-（手机端存在底部被覆盖情况）
            windowHeightNew: 0,
            windowWidthNew: 0,
        };
    },
    computed: {},
    watch: {},
    mounted() {
        this.id = this.$route.query.id;
        if (this.id) {
            this.getDetailById();
        } else if (this.$route.query?.type === 'preview') {
            this.detail = Core.Data.getReportData();
        }
    },
    methods: {
        getDetailById() {
            Core.Api.Operation.detail({ id: this.id }).then(res => {
                res = res.detail
                this.detail = res;
                this.filterData(this.detail);
            }).catch(err => {
                console.log(err)
            })
        },
        filterData(data) {
            data.attachment = JSON.parse(data.attachment)
        },
        download(path) {
            window.open(Core.Const.NET.FILE_URL_PREFIX + path, '_self')
        }
    },
};
</script>
 
<style scoped lang="less">
#index {
    background: rgb(253, 253, 254);
}

// pc-端
.detail-pc {
    width: 1080px;
    padding: 80px 0;
    margin: 0px auto;

    .container {
        width: 100%;
        padding: 0;

        .container-img {
            position: relative;

            :deep(img) {
                display: block;
                width: 100% !important;
                height: 608px;
                object-fit: cover;
                // object-position: top;
            }

            .operate-box {
                max-width: 80px;
                box-sizing: border-box;

                .hot-click {
                    padding: 8px;
                    cursor: pointer;
                }

                position: fixed;
                display: flex;
                padding: 8px 12px;
                flex-direction: column;
                align-items: center;
                background: #FFF;
                border: 1px solid #DADADA;
                top: calc(48px + var(--header-h-pc));
                z-index: 10;

                .border-bottom-box {
                    background: #E7E7E7;
                    width: 40px;
                    height: 0.5px;
                    margin: 16px 0px;
                }

                .num-box {
                    color: #333;
                    text-align: center;
                    font-size: 16px;
                    font-weight: 400;
                    // letter-spacing: 0.8px;

                }
            }
        }

        .begin-time {

            color: #666;
            margin-top: 24px;
            font-size: 20px;
            font-weight: 400;
            line-height: 150%;
            // letter-spacing: 2px;

        }

        .begin-title {
            color: #333;
            margin-top: 16px;
            font-size: 38px;
            font-style: normal;
            font-weight: 700;
            line-height: 150%;
            // letter-spacing: 0px;

        }

        .content-formatter {
            font-family: Montserrat !important;
            text-align: left !important;

            :deep(img) {
                display: block;
                width: 100% !important;
            }

            :deep(p) {
                font-family: Montserrat !important;
                text-align: left !important;
                font-size: 20px !important;
                color: #333 !important;
                margin-bottom: 1em;
            }

            :deep(div) {
                font-family: Montserrat !important;
                text-align: left !important;
                font-size: 20px !important;
                color: #333 !important;

            }
        }
    }


    #article {
        width: 100%;
        .flex(center, center, column);
    }

    #view {
        .flex(center, center, column);
        width: 100%;
    }

    .download {
        margin-top: 60px;
        padding-top: 40px;
        border-top: 1px solid #EEE;

        .title {
            color: #333;
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            line-height: 150%;
            margin-bottom: 24px;
        }

        .file-body {
            background: #FAFAFA;

            .file-item {
                .flex(initial, center, row);
                padding: 0 24px;
                overflow: hidden;
                position: relative;
                &::before {
                    content: '';
                    display: inline-block;
                    position: absolute;
                    bottom: 0;
                    left: 88px;
                    background: #EEE;
                    width: calc(100% - 88px);
                    height: 1px;
                }
                &:last-child::before {
                    display: none;
                }

                .icon {
                    padding: 32px 0;
                    margin-right: 16px;

                    .pdf-svg {
                        height: 48px;
                        width: 48px;
                    }
                }

                .mes-body {
                    .flex(space-between, center, row);
                    flex: 1;

                    .text {
                        .flex(space-between, initial);
                        flex: 1;
                        padding-right: 10px;

                        .title {
                            color: #333;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: 120%;
                        }

                        .time {
                            margin-top: 8px;
                            color: #999;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;
                        }
                    }

                    .download-btn {
                        .fcc();
                        color: #333;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: 150%;
                        cursor: pointer;

                        .download-svg {
                            height: 20px;
                            width: 20px;
                            margin-right: 4px;
                        }
                    }
                }
            }
        }
    }
}
</style>
