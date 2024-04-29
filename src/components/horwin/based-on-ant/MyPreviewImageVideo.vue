<template>
    <div v-if="isClose" class="my-preview-image-video">
        <MyMask :isClose="true" :isClickMaskClose="true">
            <div v-if="type === 'image'" class="preview-image">
                <slot name="image">
                    <a-carousel arrows :dots="false" :style="'transform: scale(' + scaleCount + ');'">
                        <!-- <template v-if="previewData.length > 1" #prevArrow>
                            <div class="custom-slick-arrow" style="left: 60px; z-index: 1">
                                <left-circle-outlined />
                            </div>
                        </template>
                        <template v-if="previewData.length > 1" #nextArrow>
                            <div class="custom-slick-arrow" style="right: 60px">
                                <right-circle-outlined />
                            </div>
                        </template> -->
                        <template v-for="(item, index) in previewData" :key="index">
                            <div>
                                <img class="preview-img" :src="previewData[0]" alt="" />
                            </div>
                        </template>
                    </a-carousel>
                </slot>
            </div>
            <div v-else-if="type === 'video'" class="preview-video">
                <slot name="video">
                    <div class="modal-body">
                        <video width="1140" height="600" :src="previewData[0]" autoplay controls></video>
                    </div>
                </slot>
            </div>
            <div class="Icons">
                <div class="icon-flex">
                    <template v-if="type === 'image'">
                        <zoom-out-outlined class="m-r-30" @click="onZoom('zoom-out')" />
                        <zoom-in-outlined class="m-r-30" @click="onZoom('zoom-in')" />
                    </template>
                    <close-outlined @click="onAddBtn('close')" />
                </div>
            </div>
        </MyMask>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MyMask from '@/components/horwin/based-on-dom/MyMask.vue';
import {
    LeftCircleOutlined,
    RightCircleOutlined,
    CloseOutlined,
    ZoomOutOutlined,
    ZoomInOutlined,
} from '@ant-design/icons-vue';

const props = defineProps({
    // 查看的类型 是照片查看还是Video查看
    type: {
        type: String,
        default: 'image',
    },
    // 预览的数据
    previewData: {
        type: [Object, String],
    },
    // 组件是显影还是
    isClose: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(['update:isClose']);

const scaleCount = ref(1);
/* Methods start */
const onAddBtn = type => {
    switch (type) {
        case 'close':
            scaleCount.value = 1;
            emits('update:isClose', false);
            break;
    }
};
const onZoom = type => {
    switch (type) {
        case 'zoom-out':
            if (scaleCount.value <= 0.5) {
                scaleCount.value = 0.5;
            } else {
                scaleCount.value -= 0.3;
            }
            console.log('放小', scaleCount.value);
            break;
        case 'zoom-in':
            if (scaleCount.value >= 2.5) {
                scaleCount.value = 2.5;
            } else {
                scaleCount.value += 0.3;
            }
            console.log('放大', scaleCount.value);
            break;
    }
};
/* Methods end */
onMounted(() => {});
</script>

<style lang="less" scoped>
.my-preview-image-video {
    // Image
    .preview-image {
        height: 100%;

        .preview-img {
            min-width: 300px;
            max-width: 800px;
        }

        :deep(.ant-carousel) {
            height: 100%;
        }
        :deep(.slick-slider) {
            height: 100%;
        }

        :deep(.slick-list) {
            height: 100%;
        }
        :deep(.slick-track) {
            height: 100%;
        }

        :deep(.slick-slide) {
            background-color: initial;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
            width: 60px;
            height: 60px;
            font-size: 60px;
            color: #fff;
            opacity: 0.5;
            z-index: 1;
        }
        .ant-carousel :deep(.custom-slick-arrow:before) {
            display: none;
        }
        .ant-carousel :deep(.custom-slick-arrow:hover) {
            opacity: 1;
        }
    }

    // video
    .preview-video {
        .fcc();
        height: 100%;
    }

    .Icons {
        position: absolute;
        top: 30px;
        right: 30px;
        color: #fff;
        font-size: 30px;
        z-index: 6;
        opacity: 0.8;
        cursor: pointer;

        .icon-flex {
            display: flex;
        }
    }
}
</style>
