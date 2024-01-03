<template>
    <div
        :class="{
            'image-uploader-wrap': true,
            'flex-column': props.tipPosition === 'bottom',
            'flex-row': props.tipPosition === 'right',
        }">
        <div class="upload-wrap">
            <a-upload
                name="file"
                class="item-image-uploader"
                list-type="picture-card"
                :accept="accept"
                v-model:file-list="upload.fileList"
                :action="upload.action"
                :headers="upload.headers"
                :data="upload.data"
                :multiple="true"
                :beforeUpload="handleImgCheck"
                @change="handleDetailChange"
                @preview="handlePreview">
                <div
                    class="image-inner"
                    v-if="upload.fileList.length < limitNum">
                    <img
                        src="../../assets/images/upload/add.png"
                        class="upload-add"
                        alt="" />
                </div>
            </a-upload>
        </div>

        <div class="tip" v-if="showTip">{{ tip }}</div>
        <!-- 自定义图片预览 -->
        <div
            class="image-preview"
            :class="{ 'preview-wrap': previewVisible }"
            @click="previewVisible = false">
            <img :src="previewImage" alt="" />
        </div>
    </div>
</template>
<!-- **
	  <MyUpload 
        :tip="$t('my_upload.uploadOne')"
        v-model:value="fileList"
        showTip
        :limit="9"
        :limitSize="2"
		tipPosition="bottom"
      />
* -->
<script setup>
import { ref, reactive, watch, computed } from "vue";
import Core from "@/core";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
const $t = useI18n().t;
const upload = ref({
    // 上传图片
    action: Core.Const.NET.FILE_UPLOAD_END_POINT,
    fileList: [],
    headers: {
        ContentType: false,
    },
    data: {
        token: Core.Data.getToken(),
        type: "img",
    },
});
const props = defineProps({
    limit: {
        type: Number,
        default: 9,
    },
    limitSize: {
        type: Number,
        default: 2,
    },
    value: {
        type: Array,
        default: () => [],
    },
    showTip: {
        type: Boolean,
        default: true,
    },
    tip: {
        type: String,
        default: "",
    },
    tipPosition: {
        type: String,
        default: "right",
    },
    accept: {
        type: String,
        default: "image/*",
    },
    isCanUpType: {
        type: Array,
        default: () => ["image/jpeg", "image/jpg", "image/png"],
    },
});

// computed
const limitNum = computed(() => {
    return props.limit;
});

const previewVisible = ref(false);
const previewImage = ref("");
const $emit = defineEmits(["update:value"]);
// 校验图片
const handleImgCheck = (file, fileList) => {
    return new Promise((resolve, reject) => {
        const isCanUpType = props.isCanUpType.includes(file.type);
        const isLt = file.size / 1024 / 1024 < props.limitSize;
        if (!isCanUpType) {
            message.warning($t("my_upload.file_incorrect"));
            fileList.pop();
            return false;
        }
        if (!isLt) {
            message.warning(
                `${$t("my_upload.picture_smaller")} ${props.limitSize}M!`
            );
            fileList.pop();
            return false;
        }
        resolve(isCanUpType && isLt);
    });
};
const handleDetailChange = ({ file, fileList }) => {
    console.log(file, fileList);
    if (file.status === "done") {
        // 上传成功
        if (file.response.code === 0) {
            // 上传成功
            upload.value.fileList = fileList;
            $emit("update:value", upload.value.fileList);
        } else {
            // 上传失败
            message.error(file.response.msg);
        }
    } else if (file.status === "error") {
        // 上传失败
        message.error($t("my_upload.upload_fail"));
    }
};
const handlePreview = (file) => {
    console.log(file);
    previewImage.value = file?.response?.data?.filename
        ? Core.Const.NET.FILE_URL_PREFIX + file.response.data.filename
        : file?.url
        ? file.url
        : "";
    previewVisible.value = true;
};
</script>

<style lang="less" scoped>
.image-uploader-wrap {
    display: flex;
    .upload-wrap {
        margin-bottom: 8px;
        margin-right: 8px;
        .ant-upload-picture-card-wrapper {
            .ant-upload-list {
                .ant-upload-select-picture-card {
                    .ant-upload {
                        .image-inner {
                            border: 2px solid #0061ff;
                            width: 16px;
                            height: 16px;
                            padding: 3px;
                            display: flex;
                            justify-content: center;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
            }
        }
    }
    .tip {
        font-size: 12px;
        font-weight: 400;
        color: #969799;
        line-height: 17px;
    }
}
.image-preview {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 998;
    background: rgba(0, 0, 0, 0.5);
    display: none;
}
.preview-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        min-width: 800px;
        max-width: 1400px;
    }
}
.flex-column {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}
.flex-row {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
</style>
