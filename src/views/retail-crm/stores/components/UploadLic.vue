<template>
    <div class="upload-box">
        <div class="img-pic">
            <a-image height="140px" :src="imgUrl" />
        </div>
        <div class="name-box">
            <a-input v-model:value="imgObj.name"></a-input>
        </div>
        <div class="but-bottom">
            <div class="but-delete but-all" @click="deletePic">删除证照</div>
            <a-upload
                :max-count="1"
                :file-list="fileUpList"
                name="file"
                accept="image/*"
                :headers="upload.headers"
                :showUploadList="false"
                :data="upload.data"
                :action="upload.action"
                :before-upload="handleImgCheck"
                @change="handleCoverChange"
            >
                <div class="but-upload but-all">重新上传</div>
            </a-upload>
        </div>
    </div>
</template>

<script>
import Core from '../../../../core';
export default {
    name: 'UploadLic',
    data() {
        return {
            // 上传图片
            upload: {
                // 上传图片
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [],
                detailList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            image_attachment_list: [],
        };
    },
    props: {
        imgObj: {
            type: Object,
            default: [],
        },
    },
    watch: {},
    computed: {
        imgUrl() {
            return this.$Util.imageFilter(this.imgObj?.path);
        },
    },
    mounted() {},
    methods: {
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type);
            if (!isCanUpType) {
                this.$message.warning(this.$t('n.file_incorrect'));
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message.warning(this.$t('n.picture_smaller'));
            }

            // this.loadImage(TEST_IMAGE);
            // return false;
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            // 上传成功后在添加
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
                let imageAttachment = {
                    uid: file.uid,
                    name: file.name,
                    path: file.response.data.filename,
                    type: file.response.data.filename.split('.').pop(),
                };

                this.image_attachment_list = imageAttachment;
            }

            this.upload.detailList = fileList;
            this.$emit('reupload', { list: this.image_attachment_list, uid: this.imgObj.uid });
        },
        // 删除证照
        deletePic() {
            let data = {
                uid: this.imgObj.uid,
            };
            this.$emit('delete', data);
        },
    },
};
</script>

<style lang="less" scoped>
.upload-box {
    width: 232px;
    height: 248px;
    margin-right: 20px;
    border-radius: 4px;
    border: 1px solid var(--color-bg-1, #fff);
    background: var(--color-license, linear-gradient(180deg, #f3f5f8 0%, #fff 100%));
    box-shadow: 8px 8px 20px 0px rgba(55, 99, 170, 0.1);
    box-sizing: border-box;
    padding: 16px;

    .img-pic {
        cursor: pointer;
        display: flex;
        justify-content: center;
    }

    .name-box {
        height: 20px;
        width: 100%;
        margin: 12px 0px;

        .ant-input {
            height: 100%;
            border: none;
        }
    }

    .but-bottom {
        .fcc(space-between);

        .but-all {
            height: 32px;
            width: 95px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 400;
            line-height: 32px;
            text-align: center;
            font-family: PingFang SC;
            box-sizing: border-box;
        }

        .but-delete {
            border: 1px solid var(--color-danger-6, #f53f3f);
            color: var(--color-danger-6, #f53f3f);
            cursor: pointer;
        }

        .but-upload {
            border: 1px solid var(--brand-6, #0061ff);
            color: var(--brand-6, #0061ff);
        }
    }
}
</style>
