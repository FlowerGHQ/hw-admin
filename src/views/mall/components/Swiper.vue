<template>
    <div id="Swiper">
        <div class="preview">
            <div class="preview-img">
                <Magnifier :activePicUrl="$Util.imageFilter(previewImg, 2)" />
            </div>
            <!-- <img class="preview-img" :src="previewImg" alt=""> -->
        </div>
        <div class="swiper-content" v-if="swiperList.length > 1">
            <div class="swiper-body">
                <swiper :modules="modules" :slidesPerView="mySwiperOption.slidesPerView"
                    :navigation="mySwiperOption.navigation">
                    <swiper-slide v-for="(item, i) in swiperList" :key="i" @click="selectSwiper(item, i)">
                        <div class="swiper-img">
                            <img class="img" :class="swiperIndex === i ? 'active' : ''"
                                :src="$Util.imageFilter(item.path, 2)" alt="">
                        </div>
                    </swiper-slide>
                </swiper>
                <div class="swiper-button-prev" v-if="swiperList.length > mySwiperOption.slidesPerView">
                    <svg-icon icon-class="vehicle-left" class-name="swiper-button-pre" />
                </div>
                <div class="swiper-button-next" v-if="swiperList.length > mySwiperOption.slidesPerView">
                    <svg-icon icon-class="vehicle-right" class-name="swiper-button-next" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import SvgIcon from "@/components/MySvgIcon/index.vue";
import Magnifier from "./Magnifier.vue";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import 'swiper/css';
import { Navigation } from "swiper";
import { ref, onMounted, reactive } from 'vue';
const props = defineProps({
    mySwiperOption: {
        type: Object,
        default: () => {
            return {
                slidesPerView: 5,
                slidesPerGroup: 1,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            }
        },
    },
    swiperList: {
        type: Array,
        default: () => [],
    },
})

const modules = [Navigation]
const previewImg = ref(props.swiperList[0]?.path || '')
const swiperIndex = ref(0)

// 选择图片
const selectSwiper = (item, i) => {
    swiperIndex.value = i
    previewImg.value = item?.path
}
// 输出组件的方法，让外部组件可以调用
defineExpose({
    selectSwiper,
})
</script>
<style lang="less" scoped>
#Swiper {
    background: #FFF;

    .preview {
        .preview-img {
            width: 100%;
            aspect-ratio: 1;
            object-fit: cover;
            user-select: none;
        }
    }

    .swiper-content {
        padding: 24px 72px;
        border-top: 1px solid #EEE;
        position: relative;

        .swiper-img {
            padding: 0px 5%;

            .img {
                border: 1px solid transparent;
                // height: 92px;
                width: 100%;
                aspect-ratio: 1;
                object-fit: cover;
                user-select: none;
                cursor: pointer;

                &.active {
                    border: 1px solid #C6F;
                }
            }
        }

        .swiper-button-pre,
        .swiper-button-next {
            font-size: 32px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
            cursor: pointer;
        }

        .swiper-button-pre {
            left: 8px;
        }

        .swiper-button-next {
            right: 8px;
        }
    }
}
</style>