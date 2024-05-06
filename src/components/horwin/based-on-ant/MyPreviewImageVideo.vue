<template>
    <div v-if="isClose" class="my-preview-image-video">
        <MyMask :isClose="true" :isClickMaskClose="true">
            <div v-if="type === 'image'" class="preview-image">
                <slot name="image">
                    <div :style="'transform: scale(' + scaleCount + ');'">
                        <img class="preview-img" :src="previewData" alt="" />
                    </div>
                </slot>
            </div>
            <div v-else-if="type === 'video'" class="preview-video">
                <slot name="video">
                    <div class="modal-body">
                        <video width="1140" height="600" :src="previewData" autoplay controls></video>
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
        display: flex;
        align-items: center;
        justify-content: center;

        .preview-img {
            min-width: 300px;
            max-width: 800px;
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
