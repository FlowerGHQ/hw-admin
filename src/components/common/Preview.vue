<template>
    <div id="Preview">
        <a-modal
            title=""
            :footer="null"
            :visible="visible"
            :closable="false"
            :width="innerWidth > 1080 ? 'auto' : '100%'"
            wrapClassName="preview-modal"
            :maskStyle="{ backgroundColor: innerWidth > 750 ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 1)' }"
            centered
            @cancel="cancel"
        >
            <div class="modal-body">
                <div class="preview-carousel" v-if="type === 1">
                    <div class="close" v-if="innerWidth <= 750" @click="cancel">
                        <svg-icon
                            icon-class="close"
                            class="file-close"
                            :style="{ fontSize: '16px', color: '#666666' }"
                        />
                    </div>
                    <a-carousel
                        ref="carousel"
                        :dots="false"
                        :arrows="innerWidth > 750"
                        v-if="innerWidth > 750"
                        :after-change="onChange"
                    >
                        <template #prevArrow>
                            <div class="custom-slick-arrow left">
                                <img class="carousel-left" src="@images/mall/order/arrow-left-s-line.png" />
                            </div>
                        </template>
                        <template #nextArrow>
                            <div class="custom-slick-arrow right">
                                <img class="carousel-right" src="@images/mall/order/arrow-right-s-line.png" />
                            </div>
                        </template>
                        <div v-for="(item, index) in list" :key="index">
                            <div class="preview-carousel-img-body">
                                <img
                                    class="preview-carousel-img"
                                    :src="Core.Util.Image.ifImageUrl(item.url, Core.Const.NET.OSS_POINT)"
                                />
                            </div>
                        </div>
                    </a-carousel>
                    <img
                        class="preview-carousel-img"
                        :src="Core.Util.Image.ifImageUrl(list[nowIndex]?.url, Core.Const.NET.OSS_POINT)"
                        v-else
                    />
                    <div class="download" @click="cancel">
                        <div @click.stop="downloadPic">
                            <my-button
                                :padding="innerWidth > 1080 ? '12px 16px 12px 24px' : '6px 8px 6px 12px'"
                                type="white"
                            >
                                <img class="download-img" src="@images/mall/order/download.png" />Download
                            </my-button>
                        </div>
                    </div>
                </div>
                <!-- <video
                    :width="innerWidth > 1080 ? '1080px' : '100%'"
                    height="auto"
                    class="preview-carousel-video"
                    style="object-fit: cover"
                    muted="true"
                    loop
                    autoplay
                    controls
                    v-else-if="type === 2"
                >
                    <source :src="videoSrc" type="video/mp4"/>您的浏览器不支持 video 标签。
                </video> -->
                <iframe
                    :width="innerWidth > 1080 ? '1080px' : '100%'"
                    :height="'600px'"
                    class="preview-carousel-video"
                    style="border: none"
                    :src="videoSrc"
                    allowfullscreen
                    v-else-if="type === 2"
                >
                </iframe>
            </div>
        </a-modal>
    </div>
</template>

<script>
import Core from '@/core';
import SvgIcon from '@/components/SvgIcon/index.vue';
import MyButton from '@/components/common/MyButton.vue';
export default {
    name: 'Preview',
    components: {
        MyButton,
        SvgIcon,
    },
    props: {
        // 预览列表 例：list: [{url: ''}]
        list: Array,
        // 预览索引
        index: {
            type: Number,
            default: 0,
        },
        // 预览类型 1：图片, 2：视频
        type: {
            type: Number,
            default: 1,
        },
        // 是否调保存接口
        isSave: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            Core,
            innerWidth: window.innerWidth,
            visible: false,
            videoSrc: '',
            nowIndex: 0,
        };
    },
    watch: {},
    computed: {},
    mounted() {},
    methods: {
        open(src = '') {
            window.addEventListener('resize', this.handleWindowResize);
            this.visible = true;
            this.$nextTick(() => {
                if (this.type === 1) {
                    if (this.innerWidth > 750) {
                        this.goToPre();
                    } else {
                        this.nowIndex = this.index;
                    }
                } else if (this.type === 2) {
                    this.videoSrc = src;
                }
            });
        },
        cancel() {
            window.removeEventListener('resize', this.handleWindowResize);
            this.visible = false;
        },
        goToPre() {
            this.$nextTick(() => {
                this.$refs.carousel.goTo(this.index, true);
                this.nowIndex = this.index;
            });
        },
        onChange(index) {
            this.nowIndex = index;
        },
        downloadPic() {
            const src = Core.Const.NET.OSS_POINT + this.list[this.nowIndex].url;
            Core.Util.Image.downloadImage(src);
            if (this.isSave) {
                this.savePreview(this.list[this.nowIndex].id);
            }
        },
        // 记录下载次数
        savePreview(id) {
            let params = {
                id: id, // 页号
                action_type: 2, // 行为类型：1.浏览；2.下载
            };
            Core.Api.Home.mediaSave({ ...params })
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 窗口大小
        handleWindowResize() {
            this.innerWidth = window.innerWidth;
            if (this.innerWidth > 750) {
                this.$nextTick(() => {
                    this.$refs.carousel.goTo(this.nowIndex, true);
                });
            }
        },
    },
};
</script>
<style lang="less" scoped>
.modal-body {
    .fcc();
    padding-bottom: 100px;
    .preview-carousel {
        position: relative;
        .custom-slick-arrow.left {
            left: -156px;
            z-index: 1;
        }
        .custom-slick-arrow.right {
            right: -156px;
        }
        .preview-carousel-img-body {
            .fcc();
        }
        .preview-carousel-img {
            height: 60vh;
            max-width: 100%;
            object-fit: contain;
        }
        .preview-carousel-video {
            width: 1080px;
        }
        .carousel-left,
        .carousel-right {
            width: 48px;
            height: 48px;
        }
        .download {
            .fcc();
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%) translateY(100%);
            .download-img {
                width: 20px;
                height: 20px;
                margin-right: 8px;
            }
        }
    }
    .ant-carousel /deep/.slick-slide {
        text-align: center;
        overflow: hidden;
    }
    .ant-carousel /deep/.custom-slick-arrow {
        width: 48px;
        height: 48px;
        transform: translateY(-50%);
    }
    .ant-carousel /deep/.slick-slide h3 {
        color: #fff;
    }
    .ant-carousel /deep/.custom-slick-arrow:before {
        display: none;
    }
    // PC端
    @media (min-width: 750px) and (max-width: 1400px) {
        .preview-carousel {
            width: calc(100vw - 200px);
            .custom-slick-arrow.left {
                left: -80px;
            }
            .custom-slick-arrow.right {
                right: -80px;
            }
        }
    }
    @media (min-width: 1400px) {
        .preview-carousel {
            width: 1080px;
        }
    }
    // APP端
    @media (max-width: 750px) {
        .preview-carousel {
            width: 100vw;
            padding-bottom: 100px;
            .close {
                position: fixed;
                right: 32px;
                top: 29px;
                height: 26px;
                width: 26px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #fff;
            }
            .download {
                position: fixed;
                bottom: 100px;
                left: 50%;
                height: 100px;
                width: 100%;
                background-color: #000;
                padding-bottom: 20px;
                transform: translateX(-50%) translateY(100%);
            }
        }
    }
}
</style>
<!-- 弹窗样式 -->
<style lang="less">
.preview-modal {
    .ant-modal-content .ant-modal-body {
        padding: 0 204px;
        max-height: none;
        overflow: hidden;
    }
    .ant-modal-content {
        background-color: transparent;
        box-shadow: none;
    }
    @media (max-width: 767px) {
        .ant-modal {
            max-width: 100vw;
        }
    }
    // PC端
    @media (min-width: 750px) and (max-width: 1400px) {
        .ant-modal-content .ant-modal-body {
            padding: 0 128px;
        }
    }
}
</style>
