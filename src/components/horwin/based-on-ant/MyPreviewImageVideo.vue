<template>
    <div v-if="isClose" class="my-preview-image-video">
        <MyMask :isClose="true" :isClickMaskClose="true">
            <div v-if="type === 'image'" class="preview-image">
                <slot name="image">
                    <a-carousel arrows :dots="false">
                        <template v-if="previewData.length > 1" #prevArrow>
                            <div class="custom-slick-arrow" style="left: 60px; z-index: 1">
                                <left-circle-outlined />
                            </div>
                        </template>
                        <template v-if="previewData.length > 1" #nextArrow>
                            <div class="custom-slick-arrow" style="right: 60px">
                                <right-circle-outlined />
                            </div>
                        </template>
                        <div v-for="(item, index) in previewData" :key="index">
                            <img class="preview-img" :src="item" alt="" />
                        </div>
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
            <div class="colos-icon" @click="onAddBtn('close')">
                <close-outlined />
            </div>
        </MyMask>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MyMask from '@/components/horwin/based-on-dom/MyMask.vue';
import { LeftCircleOutlined, RightCircleOutlined, CloseOutlined } from '@ant-design/icons-vue';

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

/* Methods start */
const onAddBtn = type => {
    switch (type) {
        case 'close':
            emits('update:isClose', false);
            break;
    }
};
/* Methods end */
onMounted(() => {
    console.log('previewData', props.previewData);
});
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

    .colos-icon {
        position: absolute;
        top: 30px;
        right: 30px;
        color: #fff;
        width: 30px;
        font-size: 30px;
        height: 30px;
        z-index: 6;
        opacity: 0.8;
        cursor: pointer;
    }
}
</style>
