<template>
    <div>
        <div class="value">
            <a-upload
                :file-list="upload.detailList"
                name="file"
                accept="image/*"
                :headers="upload.headers"
                :data="upload.data"
                :action="upload.action"
                :before-upload="handleImgCheck"
                :showUploadList="false"
                @change="handleCoverChange"
            >
                <a-button type="primary" v-if="$auth('customer.detail')">{{ $t('crm_st.add_len') }}</a-button>
            </a-upload>
        </div>

        <div class="pic-list">
            <UploadLic
                v-for="$1 in trackRecordForm.image_attachment_list"
                :key="$1.uid"
                :imgObj="$1"
                @delete="deleteItemImg"
                @reupload="reuploadImg"
            />
        </div>
    </div>
</template>

<script>
import Core from '../../../../core';
import UploadLic from './UploadLic.vue';
export default {
    name: 'upload-licenses',
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
            trackRecordForm: {
                image_attachment_list: [],
            },
        };
    },
    components: {
        UploadLic,
    },
    watch: {},
    computed: {},
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
                this.trackRecordForm.image_attachment_list.push(imageAttachment);
                console.log('imageAttachment', imageAttachment);
            }

            this.upload.detailList = fileList;
        },
        // 删除图片
        deleteItemImg(data) {
            console.log('删除图片deleteItemImg', data);
            this.trackRecordForm.image_attachment_list = this.trackRecordForm.image_attachment_list.filter(el => {
                return el.uid != data.uid;
            });
        },
        // 重新上传图片后-更新
        reuploadImg(data) {
            this.trackRecordForm.image_attachment_list = this.trackRecordForm.image_attachment_list.map(el => {
                if (el.uid == data.uid) {
                    console.log('el', el);
                    return data.list;
                } else {
                    return el;
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
.value {
    margin-bottom: 20px;
}

.pic-list {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 20px;
}
</style>
