<template>
    <div class="static-preview-list">
        <template v-for="(item, index) in attachment_list" :key="index">                       
            <template v-if="imageRegx.test(item.type)">
                <img
                    :class="{ 'm-l-16': index > 0 }"
                    class="attachment-img"
                    :src="item.path"
                    alt=""
                    @click="
                        onViewImage({
                            ...item,
                            file,
                        })
                    "
                />
            </template>
            <template v-else-if="videoRegx.test(item.type)">
                <!-- 视频 -->
                <div
                    class="video-container"
                    :class="{ 'm-l-16': index > 0 }"
                    @click="
                        onViewImage({
                            type: 'video/*',
                            path: item.path,
                        })
                    "
                >
                    <MySvgIcon class="video-icon" icon-class="video-icon" />
                    <div class="time">{{ item.duration || '-' }}{{ item.duration ? 's' : '' }}</div>
                    <div class="bottom-mask">{{ item.name }}</div>
                </div>
            </template>
            <template v-else-if="pdfRegx.test(item.type)">
                <!-- pdf -->
                <div
                    class="pdf-container"
                    :class="{ 'm-l-16': index > 0 }"
                    @click="
                        onViewImage({
                            type: 'application/pdf',
                            path: item.path,
                        })
                    "
                >
                    <MySvgIcon class="pdf-file-icon" icon-class="pdf" />
                    <div class="bottom-mask">{{ item.name }}</div>
                </div>
            </template>
            <template v-else>
                <!-- 文件 -->
                <div
                    class="file-container"
                    :class="{ 'm-l-16': index > 0 }"
                    @click="
                        onViewImage({
                            type: 'application/*',
                            path: item.path,
                        })
                    "
                >
                    <MySvgIcon class="pdf-file-icon" icon-class="Excel" />
                    <div class="bottom-mask">{{ item.name }}</div>
                </div>
            </template>
        </template>
    </div>
</template>

<script setup>
import MySvgIcon from '@/components/MySvgIcon/index.vue';

const props = defineProps({
    // 循环list
    attachment_list: {
        type: Object,
        default: () => [],
    },
    // 特殊的传进来的
    file: {
        type: String,
    },
});

const imageRegx = /image\/(png|jpg|jpeg|heic)/  // 照片的正则
const videoRegx = /^video\/+/  // 视频的正则
const pdfRegx = /application\/(pdf)/  // pdf的正则
const fileRegx = /^application\/+/  // 文件的正则

const emits = defineEmits(['view']);

const onViewImage = item => {
    console.log('onViewImage', item);
    emits('view', item);
};
</script>

<style lang="less" scoped>
.static-preview-list {
    display: flex;
    .attachment-img {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        object-fit: cover;
    }

    // 视频样式
    .video-container {
        width: 80px;
        height: 80px;
        background-color: #e9edf4;
        border-radius: 4px;
        position: relative;

        .video-icon {
            width: 32px;
            height: 23px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 16px;
        }

        .time {
            color: v#4E5969;
            font-size: 10px;
            font-weight: 400;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 38px;
        }

        .bottom-mask {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 22px;
            line-height: 22px;
            border-radius: 0px 0px 4px 4px;
            background: rgba(29, 33, 41, 0.6);
            color: #fff;
            font-size: 10px;
            font-weight: 400;
            text-align: center;
        }
    }

    // pdf格式 Excel格式
    .pdf-container,
    .file-container {
        width: 80px;
        height: 80px;
        background-color: #e9edf4;
        border-radius: 4px;
        position: relative;

        .pdf-file-icon {
            width: 42px;
            height: 42px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 8px;
        }

        .bottom-mask {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 22px;
            line-height: 22px;
            border-radius: 0px 0px 4px 4px;
            background: rgba(29, 33, 41, 0.6);
            color: #fff;
            font-size: 10px;
            font-weight: 400;
            text-align: center;
        }
    }
}
</style>
