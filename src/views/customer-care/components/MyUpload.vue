<template>
    <div class="my-upload">
        <a-upload
            :name="uploadOptions.name"
            v-model:file-list="uploadOptions.fileList"
            :list-type="uploadOptions.listType"
            :show-upload-list="uploadOptions.showUploadList"
            :action="uploadOptions.action"
            :headers="uploadOptions.headers"
            :data="uploadOptions.data"
            :multiple="uploadOptions.multiple"
            :max-count="uploadOptions.maxCount"
            :before-upload="uploadOptions.beforeUpload"
            @change="handleDetailChange"
            @preview="handlePreview"
            @remove="handleRemove"
        >
            <div class="image-inner" v-if="uploadOptions.fileList.length < uploadOptions.maxCount">
                <img src="../../../assets/images/upload/add.png" class="upload-add" alt="" />
            </div>
            <!-- <template #removeIcon>
                <img src="../../../assets/images/upload/close.png" class="upload-close" alt="" />
            </template> -->
        </a-upload>
    </div>
</template>

<script setup>
import { Upload, message } from "ant-design-vue";
import { ref, onMounted, watch, getCurrentInstance } from "vue";
import Core from "@/core";

const { proxy } = getCurrentInstance();

const props = defineProps({
    options: {
        type: Object,
        default: () => {},
    },
    // 监听数据
    fileList: {
        type: Object,
        default: () => {},
    },
    // 视频限制大小
    videoLimit: {
        type: [Number, String],
        default: 50,
    },
    // 照片限制大小
    imageLimit: {
        type: [Number, String],
        default: 10,
    },
});

const emits = defineEmits(["update:fileList", "change", "preview", "remove"]);

const uploadOptions = ref({
    name: "file",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76" || Core.Const.NET.FILE_UPLOAD_END_POINT,
    action: Core.Const.NET.FILE_UPLOAD_END_POINT,
    fileList: [],
    headers: {
        ContentType: false,
    },
    data: {
        token: Core.Data.getToken(),
        type: "img",
    },
    listType: "picture-card",
    accept: "image/jpeg, image/jpg, image/png, video/*",
    maxCount: 9,
    multiple: true,
    showUploadList: true,
    // 检查
    beforeUpload: function (file, fileList) {
        let isLt = true;
        const sizeM = file.size / 1024 / 1024;

        console.log("sizeM", sizeM);

        if (/^video\/+/.test(file.type)) {
            // 视频 50M
            if (sizeM > props.videoLimit) {
                isLt = false;
                message.warning(proxy.$t("common.please_upload_less_than") + "50M" + proxy.$t("common.file"));
                return false || Upload.LIST_IGNORE;
            }
        }
        if (/^image\/+/.test(file.type)) {
            // 照片 10M
            if (sizeM > props.imageLimit) {
                isLt = false;
                message.warning(proxy.$t("common.please_upload_less_than") + "10M" + proxy.$t("common.file"));
                return false || Upload.LIST_IGNORE;
            }
        } else {
            message.warning($t("common.file_incorrect"));
            return false || Upload.LIST_IGNORE;
        }

        return isLt;
    },
    ...props.options,
});

watch(
    () => props.fileList,
    (newValue) => {
        if (newValue) {
            console.log("watch", newValue);
            uploadOptions.value.fileList = newValue;
        }
    },
    {
        deep: true,
        immediate: true,
    }
);

onMounted(() => {
    console.log("uploadOptions", uploadOptions.value);
});

/* Methods start */
const handleDetailChange = (data) => {
    emits("change", data);
};

const handlePreview = (file) => {
    emits("preview", { file, fileList: uploadOptions.value.fileList });
};

const handleRemove = (file) => {
    uploadOptions.value.fileList = uploadOptions.value.fileList.filter((item) => item.uid !== file.uid);

    emits("remove", { file, fileList: uploadOptions.value.fileList });
    $emit("update:fileList", uploadOptions.value.fileList)
};
/* Methods end */
</script>

<style lang="less" scoped>
.my-upload {
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
    :deep(.ant-upload.ant-upload-select-picture-card) {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        border: 1px dashed #eaecf1;
        background: #fff;
        margin: 0;
    }

    :deep(.ant-upload-list-picture-card-container) {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        border: 1px dashed #eaecf1;
        background: #fff;
    }
}
</style>
