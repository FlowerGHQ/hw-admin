<template>
    <div
        :class="{
            'image-uploader-wrap': true,
            'flex-column': props.tipPosition === 'bottom',
            'flex-row': props.tipPosition === 'right',
        }"
        :id="uploadId"
    >
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
                @preview="handlePreview"
                @remove="handleRemove"
                ref="uploadComponent"
            >
                <div class="image-inner" v-if="upload.fileList.length < limitNum">
                    <img src="../../assets/images/upload/add.png" class="upload-add" alt="" />
                </div>
                <template #removeIcon>
                    <img src="../../assets/images/upload/close.png" class="upload-close" alt="" />
                </template>
            </a-upload>
        </div>

        <slot name="tip">
            <div class="tip" v-if="showTip && !upload.fileList.length > 0">
                {{ tip }}
            </div>
        </slot>
        <!-- 自定义图片预览 -->
        <div class="image-preview" :class="{ 'preview-wrap': previewVisible }" @click="previewVisible = false">
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
import { ref, reactive, watch, computed } from 'vue';
import Core from '@/core';
import { message, Upload } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
const $t = useI18n().t;
const upload = ref({
    // 上传图片
    action: Core.Const.NET.FILE_UPLOAD_END_POINT,
    fileList: [],
    fileSting: '',
    headers: {
        ContentType: false,
    },
    data: {
        token: Core.Data.getToken(),
        type: 'img',
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
        type: [String, Array],
        default: () => [],
    },
    // 值类型 默认字符串 , 分割:1string, 2array
    valueType: {
        type: Number,
        default: 1,
    },
    showTip: {
        type: Boolean,
        default: true,
    },
    tip: {
        type: String,
        default: '',
    },
    tipPosition: {
        type: String,
        default: 'right',
    },
    accept: {
        type: String,
        default: 'image/*',
    },
    isCanUpType: {
        type: Array,
        default: () => ['image/jpeg', 'image/jpg', 'image/png'],
    },
    defaultPreview: {
        type: Boolean,
        default: true,
    },
    ratio: {
        type: Object,
        default: () => {
            return {
                width: 453,
                height: 254,
            };
        },
    },
    ratioLimit: {
        type: Boolean,
        default: false,
    },
});
const uploadId = _.uniqueId('upload_');
const uploadComponent = ref(null);
// computed
const limitNum = computed(() => {
    return props.limit;
});
const previewVisible = ref(false);
const previewImage = ref('');
const $emit = defineEmits(['update:value', 'preview']);
// 判断循环的计数
const loopCount = ref(0);
// 校验图片
const handleImgCheck = async (file, fileList) => {
    const isCanUpType = props.isCanUpType.includes(file.type);
    const isLt = file.size / 1024 / 1024 < props.limitSize;
    if (!isCanUpType) {
        message.warning($t('my_upload.file_incorrect'));
        return false || Upload.LIST_IGNORE;
    }
    if (!isLt) {
        message.warning(`${$t('my_upload.picture_smaller')} ${props.limitSize}M!`);
        return false || Upload.LIST_IGNORE;
    }
    if (props.ratioLimit) {
        // 创建一个包含文件路径的URL
        const url = URL.createObjectURL(file);
        const res = await Core.Util.Common.getRatio(url);
        if (res.height !== props.ratio.height || res.width !== props.ratio.width) {
            message.warning(
                `${$t('n.upload')} ${$t('operation.pic_ratio')}:${props.ratio.width}x${props.ratio.height}`,
            );
            return false || Upload.LIST_IGNORE;
        }
    }
    return isCanUpType && isLt;
};
const handleDetailChange = ({ file, fileList }) => {
    if (file.status === 'done') {
        // 上传成功
        if (file.response.code === 0) {
            // 计数
            loopCount.value++;
            if (fileList.length > props.limit) {
                fileList = fileList.slice(0, props.limit);
            }
            if (loopCount.value === fileList.length) {
                console.log('循环结束');
                console.log(fileList, 'fileList');
                let fileArr = [];
                fileList.forEach(item => {
                    if (props.valueType === 1) {
                        fileArr.push(item?.response?.data?.filename);
                    } else if (props.valueType === 2) {
                        item?.response?.data?.filename &&
                            fileArr.push({
                                name: item.name,
                                path: item?.response?.data?.filename,
                                type: item.type,
                            });
                    }
                });
                upload.value.fileSting =
                    fileArr.length > 0 ? (props.valueType === 1 ? fileArr.join(',') : fileArr) : '';
                console.log(upload.value.fileSting, 'upload.value.fileSting');
                $emit('update:value', upload.value.fileSting);
            }
            // 上传成功
            upload.value.fileList = fileList;
        } else {
            // 上传失败
            message.error(file.response.msg);
        }
    } else if (file.status === 'error') {
        // 上传失败
        message.error($t('my_upload.upload_fail'));
    }
};
const handlePreview = file => {
    if (props.defaultPreview) {
        previewImage.value = file?.response?.data?.filename
            ? Core.Const.NET.FILE_URL_PREFIX + file.response.data.filename
            : file?.url
              ? file.url
              : file?.thumbUrl
                ? file.thumbUrl
                : '';
        previewVisible.value = true;
    } else {
        $emit('preview', { file, fileList: upload.value.fileList });
    }
};
const handleRemove = file => {
    upload.value.fileList = upload.value.fileList.filter(item => item.uid !== file.uid);
    let fileArr = [];
    upload.value.fileList.forEach(item => {
        if (props.valueType === 1) {
            item?.response?.data?.filename && fileArr.push(item?.response?.data?.filename);
        } else if (props.valueType === 2) {
            item?.response?.data?.filename &&
                fileArr.push({
                    name: item.name,
                    path: item?.response?.data?.filename,
                    type: item.type,
                });
        }
    });
    upload.value.fileSting = fileArr.length > 0 ? (props.valueType === 1 ? fileArr.join(',') : fileArr) : '';
    //   计数，为了解决删除图片时，上传的图片还没返回的问题
    loopCount.value--;
    $emit('update:value', upload.value.fileSting);
};

watch(
    () => props.value,
    val => {
        if (val) {
            let fileList = [];
            if (val instanceof Array) {
                // 讲val 的长度赋值给计数
                loopCount.value = val.length;
                val.forEach(item => {
                    fileList.push({
                        uid: _.uniqueId('upload_'),
                        name: item.name,
                        status: 'done',
                        url: Core.Const.NET.OSS_POINT + item.path,
                        type: item.type,
                        response: {
                            code: 0,
                            data: {
                                filename: item.path,
                            },
                        },
                    });
                });
            } else {
                // 讲val 的长度赋值给计数
                loopCount.value = val.split(',').length;
                val.split(',').forEach(item => {
                    fileList.push({
                        uid: _.uniqueId('upload_'),
                        name: item,
                        status: 'done',
                        url: Core.Const.NET.OSS_POINT + item,
                        thumbUrl: Core.Const.NET.OSS_POINT + item,
                        type: item,
                        response: {
                            code: 0,
                            data: {
                                filename: item,
                            },
                        },
                    });
                });
            }
            upload.value.fileList = fileList;
        }
    },
    {
        deep: true,
        immediate: true,
    },
);
// 监听循环计数、
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
    .tip {
        margin-bottom: 8px;
    }
}
.flex-row {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

:deep(.ant-upload-list-item-info) {
    &::before {
        display: none;
    }
}
:deep(.ant-upload-list-item) {
    padding: 0 !important;
}
:deep(.upload-close) {
    width: 20px;
    height: 20px;
    margin-top: 4px;
}
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
::v-deep(.ant-upload-list-item-actions) {
    width: 100%;
    height: 100%;
}
::v-deep(.ant-upload.ant-upload-select-picture-card) {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    border: 1px dashed #eaecf1;
    background: #fff;
}
::v-deep(.ant-upload-list-picture-card-container) {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    border: 1px dashed #eaecf1;
    background: #fff;
}
</style>
