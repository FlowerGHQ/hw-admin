<template>
    <div id="upload" :class="isMobile ? 'mt' : ''">
        <div class="upload-body" v-if="isWrite">
            <a-upload
                :style="{ width: isMobile ? '100%' : '' }"
                multiple
                ref="uploader"
                name="file"
                list-type="picture"
                :max-count="1"
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
                <div class="upload" v-if="!isMobile">
                    <svg-icon icon-class="payment_upload" class="svg-icon" :style="{ fontSize: '16px' }" />
                </div>
                <span class="mt-upload" v-else>
                    <svg-icon icon-class="payment_upload" class="svg-icon" :style="{ fontSize: '16px' }" />
                    <p class="text1">Click to Upload</p>
                    <p class="text2">Images can be uploaded to PNG, JPG, JPEG, up to {{ maxImageNum }}</p>
                </span>
            </a-upload>
            <div class="image-rule" v-if="!isMobile">
                <p>{{ $t('mall.upload_img') }} {{ maxImageNum }}</p>
                <p>{{ $t('mall.upload_file') }} {{ maxFileNum }}</p>
            </div>
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
                        v-if="isWrite"
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
                        <span class="file-content-text" :title="item.name">{{ item.name }}</span>
                        <svg-icon
                            v-if="isWrite"
                            icon-class="payment_close"
                            class="file-close"
                            :style="{ fontSize: '16px', color: '#fff' }"
                            @click.stop="deleteFile(index, item.uid)"
                        />
                    </div>
                </div>
            </div>
        </div>
        <Preview ref="Preview" :list="previewList" :index="previewIndex" :isSave="false"></Preview>
    </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon/index.vue';
import Preview from '@/components/common/Preview.vue';
import Core from '@/core';
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
        isWrite: {
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
        this.fileList = this.defaultList;
        if (this.type === 'image') {
            this.acceptList = ['image/jpg', 'image/jpeg', 'image/png'];
        } else if (this.type === 'file') {
            this.acceptList = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf'];
        }
    },
    methods: {
        handleChange(info) {
            // 没进入上传操作和已删除的文件不记录在内
            if (!info.file.status || info.file.status === 'removed') return;
            const flog = this.fileList.findIndex(item => item.uid === info.file.uid);
            if (flog === -1) {
                this.fileList.push(info.file);
                this.$emit('handleUpload', this.getAjaxFileList(this.fileList));
            } else {
                this.fileList[flog] = info.file;
            }
            if (info.file.status === 'done') {
                this.fileList.map(item => {
                    if (item.uid === info.file.uid) {
                        item.file = info.file.response.data.filename;
                        item.status = 'done';
                    }
                });
            }
        },
        // 上传前做文件类型限制
        beforeUpload(file, fileList) {
            let isTypeRight = true;
            let imageNum = 0,
                fileNum = 0;
            const imageArr = ['image/jpg', 'image/jpeg', 'image/png'];
            const fileArr = ['application/pdf'];
            this.fileList.forEach(item => {
                const index = imageArr.indexOf(item.type);
                const indexFile = fileArr.indexOf(item.type);
                if (index !== -1) {
                    imageNum += 1;
                }
                if (indexFile !== -1) {
                    fileNum += 1;
                }
            });
            fileList.forEach(item => {
                const index = imageArr.indexOf(item.type);
                const indexFile = fileArr.indexOf(item.type);
                if (index !== -1) {
                    imageNum += 1;
                }
                if (indexFile !== -1) {
                    fileNum += 1;
                }
            });
            if (imageNum > this.maxImageNum) {
                this.$message.error(`Upload up to ${this.maxImageNum} image!`);
                return false;
            }
            if (fileNum > this.maxFileNum) {
                this.$message.error(`Upload up to ${this.maxFileNum} file!`);
                return false;
            }
            const index = this.acceptList.indexOf(file.type);
            if (index === -1) isTypeRight = false;
            if (!isTypeRight) {
                let acceptName = '';
                this.acceptList.forEach(item => {
                    acceptName += item.split('/')[1] + ' ';
                });
                this.$message.error(`You can only upload ${acceptName} file!`);
            }
            this.upload.data.type = file.type.split('/')[0] === 'application' ? 'file' : 'img';
            return isTypeRight;
        },
        deleteImage(index, uid) {
            // 删除列表中的 file
            const fileIndex = this.fileList.findIndex(item => item.uid === uid);
            this.fileList.splice(fileIndex, 1);
            this.$emit('handleUpload', this.getAjaxFileList(this.fileList));
        },
        deleteFile(index, uid) {
            // 删除列表中的 file
            const fileIndex = this.fileList.findIndex(item => item.uid === uid);
            this.fileList.splice(fileIndex, 1);
            this.$emit('handleUpload', this.getAjaxFileList(this.fileList));
        },
        previewImage(index, can = true) {
            if (!can) return;
            this.previewIndex = index;
            this.$refs.Preview.open(index);
        },
        previewFile(index, can = true) {
            if (!can) return;
            this.previewFileSrc = this.fileData[index].file;
            window.open(this.VITE_OSS_POINT + this.previewFileSrc, '_blank');
        },
        // 处理得到需要传给后端的file列表格式
        getAjaxFileList(fileList) {
            return fileList.map(item => {
                return {
                    uid: item.uid || uuid(),
                    name: item?.name ? item?.name : '',
                    type: item?.type ? item?.type : '',
                    file: item?.file ? item?.file : '',
                    status: item?.status || 'done',
                    percent: item?.percent || 0,
                };
            });
        },
        updateFile(file) {
            this.fileList = file;
        },
    },
};
</script>

<style lang="less" scoped>
.upload-body {
    display: flex;
    margin-bottom: 40px;
    .upload {
        width: 130px;
        height: 130px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f9f9f9;
    }
    .mt-upload {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #f9f9f9;
        padding: 16px 0;
        .text1 {
            text-align: center;
            color: #333;
            font-family: Montserrat;
            font-size: 12px;
            font-weight: 500;
            margin-top: 8px;
        }
        .text2 {
            text-align: center;
            color: #666;
            font-family: Montserrat;
            font-size: 10px;
            margin-top: 5px;
        }
    }
    .image-rule {
        margin-left: 10px;
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
        width: 130px;
        height: 130px;
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
    height: 130px;
    width: 130px;
    background-color: #f9f9f9;
    &-content {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
        cursor: pointer;
    }
    &-img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        vertical-align: middle;
        margin-right: 4px;
    }
    &-loading {
        width: 130px;
        height: 130px;
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
        .ell();
        margin-top: 20px;
        width: 100%;
        font-size: 17px;
        line-height: 25px;
        color: #333;
    }
    .file-close {
        position: absolute;
        top: 4px;
        right: 4px;
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
