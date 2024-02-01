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
            <template #removeIcon>
                <img src="../../../assets/images/upload/close.png" class="upload-close" alt="" />
            </template>
        </a-upload>
    </div>
</template>

<script setup>
import { Upload, message } from "ant-design-vue";
import { ref, onMounted, watch, getCurrentInstance } from "vue";
import Core from "@/core";
import { useI18n } from "vue-i18n"
const $t = useI18n().t
const $locale = useI18n().locale

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
    // 提示文本
    tips: {
        type: Object,
        default: () => [],
    }
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
            uploadOptions.value.data.type = "video";
            // 视频 50M
            if (sizeM > props.videoLimit) {
                isLt = false;
                message.warning(proxy.$t("common.please_upload_less_than") + "50M" + proxy.$t("common.file"));
                return false || Upload.LIST_IGNORE;
            }
        } else if (/^image\/+/.test(file.type)) {
            uploadOptions.value.data.type = "img";
            // 照片 10M
            if (sizeM > props.imageLimit) {
                isLt = false;
                message.warning(proxy.$t("common.please_upload_less_than") + "10M" + proxy.$t("common.file"));
                return false || Upload.LIST_IGNORE;
            }
        } else {
            message.warning(proxy.$t("common.file_incorrect"));
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
watch(
    () => $locale.value,
    (newValue) => {
        console.log("语言改变", newValue);        
        removeDomTips()
        addDomTips()
    },
);

onMounted(() => {
    console.log("uploadOptions", uploadOptions.value);

    // 添加提示DOM
    addDomTips()
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
    emits("update:fileList", uploadOptions.value.fileList);
};
// 添加Dom Tip
const addDomTips = () => {
    const parentElement = document.querySelector(".edit");
    const childElement = parentElement ? parentElement.querySelector(".ant-upload-picture-card-wrapper") : undefined;
    const grandchildElement = childElement ? childElement.querySelector(".ant-upload-list") : undefined;

    if (grandchildElement) {
        const divs = document.createElement("div");
        divs.classList.add("add-attachment-tip", "m-l-10");

        let str = ""
        props.tips.forEach(el => {
            str += `<div>${ $t(el) }</div>`
        })
        divs.innerHTML = str;
        grandchildElement.appendChild(divs);
    }
}
// 删除DOM结构
const removeDomTips = () => {
    const removeDomTips = document.querySelector(".add-attachment-tip");
    console.log('removeDomTips', removeDomTips);

    if (removeDomTips) {
        removeDomTips?.remove()
    }
}
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
    :deep(.ant-upload-list-picture-card) {
        display: flex;
        // justify-content: center;
        flex-wrap: wrap;
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

    :deep(.ant-upload-list-item-actions > a:nth-child(1)) {
        pointer-events: initial !important;
        opacity: 1 !important;
    }
}

:deep(.ant-upload-list-item) {
    padding: 0 !important;
}
:deep(.ant-upload-list-item-info) {
    // 关闭遮罩层
    &::before {
        display: none;
    }
}

::v-deep(.ant-upload-list-item-actions) {
    width: 100%;
    height: 100%;
}

// 关闭的按钮
:deep(.upload-close) {
    width: 20px;
    height: 20px;
    margin-top: 4px;
}
// 小眼睛
::v-deep(.anticon-eye) {
    position: absolute;
    width: 100% !important;
    height: 100%;
    left: -5px;
    opacity: 0;
    display: inline-block;
    margin: 0 !important;
}

::v-deep(.ant-upload-list-item-card-actions-btn) {
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    padding: 0px !important;
    z-index: 10;
}

:deep(.add-attachment-tip) {
    color: #666;
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
    .flex(@j: center, @a: initial, @direction: column);
}
</style>
