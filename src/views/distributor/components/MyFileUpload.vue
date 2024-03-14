<template>
    <div id="upload">
        <div class="upload-body">
            <div class="image-rule">
                <ul>
                    <li>You can upload images in PNG, JPG, JPEG format, up to {{ maxImageNum }} images per file.</li>
                    <li>For documents, only PDF format is supported, with a maximum of {{ maxFileNum }} files.</li>
                </ul>
            </div>
            <a-upload
                v-show="isShowUpload"
                multiple
                ref="uploader"
                name="file"
                list-type="picture"
                :accept="acceptList.toString()"
                :defaultFileList="defaultList"
                :file-List="fileList"
                :show-upload-list="false"
                :action="upload.action"
                :headers="upload.headers"
                :data="upload.data"
                :before-upload="beforeUpload"
                @change="handleChange"
            >
                <div class="upload">
                    <svg-icon icon-class="payment_upload" class="svg-icon" :style="{ fontSize: '16px' }" />
                </div>
            </a-upload>
        </div>
        <!-- 预览样式 -->
        <div class="image-list">
            <div v-for="(item, index) in imageData" :key="`image${index}`" class="image-item">
                <template v-if="item.status === 'uploading'">
                    <div class="image-loading">
                        <p>{{ $t('mall.uploading') }}</p>
                        <a-progress :percent="item.percent" :show-info="false" :strokeWidth="6" />
                    </div>
                </template>
                <div v-show="item.status !== 'uploading'" class="image-content">
                    <img
                        v-if="item.file"
                        :src="VITE_OSS_POINT + item.file"
                        class="image-img"
                        @click="previewImage(index, item.file)"
                    />
                    <svg-icon
                        icon-class="payment_close"
                        class="image-close"
                        :style="{ fontSize: '16px', color: '#fff' }"
                        @click="deleteImage(index, item.uid)"
                    />
                </div>
            </div>
        </div>
        <div class="file-list">
            <div v-for="(item, index) in fileData" :key="`file${index}`" class="file-item">
                <div class="file">
                    <template v-if="item.status === 'uploading'">
                        <div class="file-loading">
                            <p>{{ $t('mall.uploading') }}</p>
                            <a-progress :percent="item.percent" :show-info="false" :strokeWidth="6" />
                        </div>
                    </template>
                    <div
                        v-show="item.status !== 'uploading'"
                        class="file-content"
                        @click="previewFile(index, item.file)"
                    >
                        <img src="@/assets/images/mall/order/pdf.png" class="file-img" />
                        <span class="file-content-text">{{ item.name }}</span>
                        <svg-icon
                            icon-class="payment_close"
                            class="file-close"
                            :style="{ fontSize: '16px', color: '#fff' }"
                            @click.stop="deleteFile(index, item.uid)"
                        />
                    </div>
                </div>
            </div>
        </div>
        <!-- <Preview ref="Preview" :list="previewList" :index="previewIndex" :isSave="false"></Preview> -->
    </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon/index.vue';
import Preview from '@/components/common/Preview.vue';
import Core from '@/core';
import { Upload } from 'ant-design-vue';
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
export default {
    components: {
        SvgIcon,
        Preview,
    },
    props: {
        type: {
            type: String,
            default: 'file',
        },
        defaultList: {
            type: Array,
            default() {
                return [];
            },
        },
        maxImageNum: {
            type: Number,
            default: 9,
        },
        maxFileNum: {
            type: Number,
            default: 3,
        },
        isShowUpload: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        previewList() {
            let target = this.VITE_OSS_POINT;
            const arr = ['image/jpg', 'image/jpeg', 'image/png'];
            let index, list;
            list = this.fileList.filter(item => {
                index = arr.indexOf(item?.type);
                return index !== -1;
            });
            return list.map(item => {
                index = arr.indexOf(item?.type);
                return {
                    url: item?.file ? item?.file.replace(target, '') : '',
                };
            });
        },
        imageData() {
            const arr = ['image/jpg', 'image/jpeg', 'image/png'];
            let index;
            return this.fileList.filter(item => {
                index = arr.indexOf(item?.type);
                return index !== -1;
            });
        },
        fileData() {
            const arr = ['image/jpg', 'image/jpeg', 'image/png'];
            let index;
            return this.fileList.filter(item => {
                index = arr.indexOf(item?.type);
                return index === -1;
            });
        },
    },
    data() {
        return {
            visible: false,
            visiblePdf: false,
            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'file',
                },
            },
            fileList: [],
            VITE_OSS_POINT: Core.Const.NET.OSS_POINT,
            acceptList: [],
            previewImageSrc: '',
            previewFileSrc: '',
            previewIndex: 0,
            isMobile: false,
        };
    },
    created() {
        if (this.type === 'image') {
            this.acceptList = ['image/jpg', 'image/jpeg', 'image/png'];
        } else if (this.type === 'file') {
            this.acceptList = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf'];
        }
        console.log(this.acceptList, 'acceptList');
    },
    methods: {
        handleChange({ file, fileList }) {
            // 上传成功后，将返回的文件地址保存到fileList中
            if (file.status === 'done' && file.response.code === 0) {
                let index = this.fileList.findIndex(item => item.uid === file.uid);
                if (index !== -1) {
                    this.fileList[index] = file;
                } else {
                    this.fileList.push(file);
                }
            }
            this.fileList.map(item => {
                item.file = item.response?.data?.filename;
            });
            this.$emit('handleUpload', this.fileList);
        },
        // 上传前做文件类型限制
        beforeUpload(file, fileList) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
            const isPDF = file.type === 'application/pdf';
            let ImageNum = 0;
            let FileNum = 0;
            // 如果既不是图片也不是pdf格式
            if (!isJPG && !isPDF) {
                let acceptName = '';
                this.acceptList.forEach(item => {
                    acceptName += item.split('/')[1] + ' ';
                });
                this.$message.error(`You can only upload ${acceptName} file!`);
                return Upload.LIST_IGNORE;
            }
            this.fileList = fileList;
            return true;
        },

        deleteImage(index, uid) {
            this.fileList = this.fileList.filter(item => item.uid !== uid);
            this.$emit('handleUpload', this.fileList);
        },
        deleteFile(index, uid) {
            this.fileList = this.fileList.filter(item => item.uid !== uid);
            this.$emit('handleUpload', this.fileList);
        },
    },
};
</script>

<style lang="less" scoped>
.upload-body {
    margin-bottom: 10px;
    .upload {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f9f9f9;
    }
    .image-rule {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        > p {
            margin-bottom: 4px;
            position: relative;
            padding-left: 6px;
            color: #666;
            font-family: Montserrat;
            font-size: 14px;
            &::before {
                content: '';
                display: inline-block;
                position: absolute;
                top: 8px;
                left: 0;
                width: 3px;
                height: 3px;
                border-radius: 1.5px;
                background-color: #666;
            }
        }
    }
}

.image-content {
    height: 100%;
    width: 100%;
}
.image-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    vertical-align: middle;
    cursor: pointer;
}
.image-loading {
    padding: 20px 10px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f1f1f1;
    font-size: 12px;
    cursor: pointer;
    > p {
        margin: 0;
    }
}
.image-close {
    position: absolute;
    top: 4px;
    right: 4px;
    cursor: pointer;
}
.image-list {
    display: flex;
    flex-wrap: wrap;
    .image-item {
        position: relative;
        display: inline-block;
        width: 64px;
        height: 64px;
        margin-right: 10px;
        margin-bottom: 10px;
    }
}
.file-list {
    display: flex;
    flex-wrap: wrap;
    .file-item {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}
.file {
    position: relative;
    display: inline-block;
    height: 55px;
    background-color: #f9f9f9;
    &-content {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
    }
    &-img {
        width: 35px;
        height: 35px;
        object-fit: cover;
        vertical-align: middle;
        margin-right: 4px;
    }
    &-loading {
        width: 64px;
        height: 64px;
        padding: 20px 10px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #f1f1f1;
        font-size: 12px;
        cursor: pointer;
        > p {
            margin: 0;
        }
    }
    .file-content-text {
        display: inline-block;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
    }
    .file-close {
        cursor: pointer;
    }
}
.preview-file {
    padding-top: 20px;
    min-height: 500px;
}
.preview {
    padding-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.preview-img {
    height: auto;
    min-width: 300px;
}

.mt {
    :deep(.ant-upload) {
        width: 100%;
    }
    .image-item {
        width: calc((100% - 20px) / 3);
        height: auto;
        &:nth-child(3n) {
            margin-right: 0;
        }
        .image-content .image-img {
            aspect-ratio: 1;
            height: auto;
        }
        .image-loading {
            width: 100%;
            aspect-ratio: 1;
        }
    }
}
</style>
