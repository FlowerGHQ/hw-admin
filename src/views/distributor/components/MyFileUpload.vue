<template>
    <div class="image-uploader-wrap" :id="uploadId">
        <!-- tips -->
        <div class="tips">
            <ul>
                <li>You can upload images in PNG, JPG, JPEG format, up to {{ imageLimit }} images per file.</li>
                <li>For documents, only PDF format is supported, with a maximum of {{ fileLimit }} files.</li>
            </ul>
        </div>
        <div
            :class="{
                'upload-area-content': true,
                'upload-flex-d': fileList.length > 0,
                'upload-flex-s': fileList.length === 0,
            }"
        >
            <div class="image-list">
                <div class="image-item" v-for="item in imageList">
                    <template v-if="item.status === 'uploading'">
                        <div class="image-loading">
                            <p>{{ $t('mall.uploading') }}</p>
                            <a-progress :percent="item.percent" :show-info="false" :strokeWidth="6" />
                        </div>
                    </template>
                    <div v-show="item.status !== 'uploading'" class="image-content">
                        <img
                            v-if="item?.response?.data?.filename"
                            :src="item?.response?.data?.filename ? VITE_OSS_POINT + item?.response?.data?.filename : ''"
                            class="image-img"
                        />
                        <svg-icon
                            icon-class="payment_close"
                            v-show="isShowUpload"
                            class="image-close"
                            @click.stop="handleDelete(item)"
                        />
                    </div>
                </div>
            </div>
            <div class="file-upload">
                <div class="file-list">
                    <div class="file-item" v-for="item in fileList" @click.stop="preViewFile(item)">
                        <div class="file">
                            <template v-if="item.status === 'uploading'">
                                <div class="file-loading">
                                    <p>{{ $t('mall.uploading') }}</p>
                                    <a-progress :percent="item.percent" :show-info="false" :strokeWidth="6" />
                                </div>
                            </template>
                            <div v-show="item.status !== 'uploading'" class="file-content">
                                <img src="@/assets/images/mall/order/pdf.png" class="file-img" />
                                <span class="file-content-text" :title="item.name">{{ item.name }}</span>
                                <svg-icon
                                    @click.stop="handleDelete(item)"
                                    v-show="isShowUpload"
                                    icon-class="payment_close"
                                    class="file-close"
                                    :style="{ fontSize: '16px', color: '#fff' }"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="upload-wrap">
                    <a-upload
                        name="file"
                        class="item-image-uploader"
                        list-type="picture"
                        :accept="accept"
                        :show-upload-list="false"
                        v-model:file-list="upload.fileList"
                        :action="upload.action"
                        :headers="upload.headers"
                        :data="upload.data"
                        :multiple="true"
                        :beforeUpload="handleFileCheck"
                        @change="handleDetailChange"
                        @preview="handlePreview"
                        @remove="handleRemove"
                        ref="uploadComponent"
                    >
                        <div class="icon-text" v-if="upload.fileList.length < imageLimit + fileLimit && isShowUpload">
                            <plus-outlined />
                            <div class="text">
                                {{ $t('distributor-detail.upload') }}
                            </div>
                        </div>
                    </a-upload>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue';
import Core from '@/core';
import { message, Upload } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';
import Preview from '@/components/common/Preview.vue';
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
        type: 'file',
    },
});
const VITE_OSS_POINT = Core.Const.NET.OSS_POINT;

const props = defineProps({
    value: {
        // 字符串类型或者数组类型
        type: [String, Array],
        default: '',
    },
    imageLimit: {
        type: Number,
        default: 9,
    },
    fileLimit: {
        type: Number,
        default: 3,
    },
    returnType: {
        type: String,
        default: 'Str', // Str, Arr
    },
    // isShowUpload
    isShowUpload: {
        type: Boolean,
        default: true,
    },
});

const uploadId = _.uniqueId('upload_');
const uploadComponent = ref(null);
const $emit = defineEmits(['update:value']);
const acceptList = ref(['image/jpg', 'image/jpeg', 'image/png', 'application/pdf']);
const previewIndex = ref(0);

const imageList = computed(() => {
    if (upload.value.fileList.length === 0 && upload.value.fileList) {
        return [];
    } else {
        return upload.value.fileList.filter(item => item.type.includes('image'));
    }
});
const fileList = computed(() => {
    if (upload.value.fileList.length === 0 && upload.value.fileList) {
        return [];
    } else {
        return upload.value.fileList.filter(item => item.type.includes('pdf'));
    }
});

// 校验的图片和pdf队列
const imageArr = ref([]);
const fileArr = ref([]);

// 什么时候提示上传数量限制
const imageWaring = ref(false);
const fileWaring = ref(false);
// 上传文件类型的限制
const typeWaring = ref(false);

// 校验文件: 1.文件类型是否正确 2.文件限制数量：图片9张，文件3个
const handleFileCheck = async (file, fileList) => {
    const index = acceptList.value.indexOf(file.type); // -1表示不在接受的文件类型中
    if (index === -1) {
        typeWaring.value = true;

        return Upload.LIST_IGNORE;
    }
    // 放入对应的队列
    if (file.type.includes('image')) {
        // 图片
        if (imageArr.value.length >= props.imageLimit) {
            imageWaring.value = true;
            return Upload.LIST_IGNORE;
        }
        imageArr.value.push(file);
    } else if (file.type.includes('pdf')) {
        // 文件
        if (fileArr.value.length >= props.fileLimit) {
            fileWaring.value = true;
            return Upload.LIST_IGNORE;
        }
        fileArr.value.push(file);
    }
    console.log('图片队列', imageArr.value);
    console.log('文件队列', fileArr.value);
};
const handleDetailChange = ({ file, fileList }) => {
    // 查看upload.fileList里面是否有相同的uid的file
    let index = upload.value.fileList.findIndex(item => item.uid === file.uid);
    if (index !== -1) {
        upload.value.fileList[index] = file;
    } else {
        upload.value.fileList.push(file);
    }
    // 当所有的file都上传完成的时候，触发返回数据
    let isAllDone = upload.value.fileList.every(item => item.status === 'done');
    if (isAllDone) {
        handleReturn();
    }
};
const handleDelete = item => {
    if (item.type.includes('image')) {
        // 图片
        imageArr.value = imageArr.value.filter(i => i.uid !== item.uid);
    } else if (item.type.includes('pdf')) {
        // 文件
        fileArr.value = fileArr.value.filter(i => i.uid !== item.uid);
    }
    upload.value.fileList = upload.value.fileList.filter(i => i.uid !== item.uid);
    imageArr.value = imageArr.value.filter(i => i.uid !== item.uid);
    fileArr.value = fileArr.value.filter(i => i.uid !== item.uid);
    handleReturn();
};

const preViewFile = item => {
    let targetUrl = VITE_OSS_POINT + item.response.data.filename;
    let url = 'http://view.officeapps.live.com/op/view.aspx?src=' + targetUrl;
    window.open(url, '_blank');
};

// 处理返回数据
const handleReturn = () => {
    console.log('upload.fileList', upload.value.fileList);
    // 如果是字符串类型，返回字符串
    if (props.returnType === 'Str') {
        let arr = upload.value.fileList.map(item => item.response.data.filename);
        upload.value.fileSting = arr.join(',');
        $emit('update:value', upload.value.fileSting);
    } else if (props.returnType === 'Arr') {
        // 如果是数组类型，返回数组
        let arr = upload.value.fileList.map(item => item.response.data.filename);
        $emit('update:value', arr);
    } else {
        // 如果是对象类型，返回对象
        $emit('update:value', upload.value.fileList);
    }
};

watch(
    () => imageWaring.value,
    (newVal, oldVal) => {
        if (newVal) {
            // 图片数量超过限制
            message.error(`You can only upload ${props.imageLimit} images!`);
            imageWaring.value = false;
        }
    },
);
watch(
    () => fileWaring.value,
    (newVal, oldVal) => {
        if (newVal) {
            // 文件数量超过限制
            message.error(`You can only upload ${props.fileLimit} files!`);
            fileWaring.value = false;
        }
    },
);

watch(
    () => typeWaring.value,
    (newVal, oldVal) => {
        if (newVal) {
            // 文件类型不正确
            let acceptName = ''; // 错误提示信息
            acceptList.value.forEach(item => {
                // 拼接提示信息
                acceptName += item.split('/')[1] + ' ';
            });
            message.error(`You can only upload ${acceptName} file!`);
            typeWaring.value = false;
        }
    },
);
// 回显value值
watch(
    () => props.value,
    (newVal, oldVal) => {
        if (newVal) {
            // 初始化队列
            imageArr.value = [];
            fileArr.value = [];
            // 提示关闭
            imageWaring.value = false;
            fileWaring.value = false;
            typeWaring.value = false;
            // 处理回显的数据

            let arr = [];
            if (props.returnType === 'Str') {
                arr = newVal.split(',');
            } else if (props.returnType === 'Arr') {
                arr = newVal;
            } else {
                arr = newVal;
            }
            upload.value.fileList = arr.map(item => {
                return {
                    uid: _.uniqueId('file_'),
                    name: item.split('.')[0].split('/')[1] || item,
                    status: 'done',
                    type:
                        item.split('.').pop() === 'pdf'
                            ? 'application/pdf'
                            : item.split('.').pop() === 'jpg' ||
                                item.split('.').pop() === 'jpeg' ||
                                item.split('.').pop() === 'png'
                              ? 'image/' + item.split('.').pop()
                              : '',
                    response: {
                        data: {
                            filename: item,
                            name: item.split('.')[0].split('/')[1] || item,
                        },
                    },
                };
            });

            // 添加到对应的队列
            upload.value.fileList.forEach(item => {
                if (item.type.includes('image')) {
                    imageArr.value.push(item);
                } else if (item.type.includes('pdf')) {
                    fileArr.value.push(item);
                }
            });

            console.log('图片队列', imageArr.value);
            console.log('文件队列', fileArr.value);
            console.log('upload.fileList', upload.value.fileList);
        }
    },
    {
        immediate: true,
        deep: true,
    },
);
</script>

<style lang="less" scoped>
.image-uploader-wrap {
    .tips {
        margin-left: 20px;
        font-size: 14px;
        color: #666666;
        line-height: 22px;
        li {
            margin-bottom: 10px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    .upload-area-content {
        .image-list {
            display: flex;
            flex-wrap: wrap;
            margin-top: 20px;
            .image-item {
                width: 78px;
                height: 78px;
                background: #f7f8fa;
                border: 1px dashed #eaecf1;
                border-radius: 4px;
                margin-right: 10px;
                margin-bottom: 10px;
                position: relative;
                .image-content {
                    width: 100%;
                    height: 100%;
                    .image-img {
                        width: 100%;
                        height: 100%;
                        cursor: pointer;
                    }
                    .image-close {
                        position: absolute;
                        top: 4px;
                        right: 4px;
                        cursor: pointer;
                    }
                }
            }
        }
        .file-upload {
            margin-top: 20px;
            display: flex;
            .file-list {
                display: flex;
                flex-wrap: wrap;
                .file-item {
                    width: 78px;
                    height: 78px;
                    background: #f7f8fa;
                    border: 1px dashed #eaecf1;
                    border-radius: 4px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    position: relative;
                    .file {
                        width: 100%;
                        height: 100%;
                        .file-content {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            .file-img {
                                width: 40px;
                                height: 40px;
                            }
                            .file-content-text {
                                width: 100%;
                                text-align: center;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                font-size: 12px;
                                padding: 0 6px;
                            }
                            .file-close {
                                position: absolute;
                                top: 4px;
                                right: 4px;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
            .upload-wrap {
                width: 78px;
                height: 78px;
                .icon-text {
                    width: 78px;
                    height: 78px;
                    background: #f7f8fa;
                    border: 1px dashed #eaecf1;
                    border-radius: 4px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
    .upload-flex-d {
        display: flex;
        flex-direction: column;
    }
    .upload-flex-s {
        display: flex;
    }
}
</style>
