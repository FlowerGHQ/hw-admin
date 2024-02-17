<template>
    <div>
        <a-modal
            v-model:visible="modalShow"
            :title="form.id ? $t('i.edit_view') : $t('i.save_view')"
            class="EditExploreModal"
            :after-close="closeModal"
        >
            <div class="modal-content">
                <div class="form-item required">
                    <div class="form-item img-upload">
                        <div class="key">{{ $t('i.diagram') }}</div>
                        <div class="value">
                            <a-upload
                                name="file"
                                class="image-uploader"
                                list-type="picture-card"
                                accept="image/*"
                                :file-list="upload.coverList"
                                :action="upload.action"
                                :headers="upload.headers"
                                :data="upload.data"
                                :before-upload="handleImgCheck"
                                @change="handleCoverChange"
                            >
                                <div class="image-inner" v-if="upload.coverList.length < 1">
                                    <i class="icon i_upload" />
                                </div>
                            </a-upload>
                            <div class="tip">{{ $t('n.size') }}：800*800px</div>
                        </div>
                    </div>
                </div>
                <div class="form-item required afs">
                    <div class="key">{{ $t('n.name') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="closeModal">{{ $t('def.cancel') }}</a-button>
                <a-button @click="handleModalSubmit" type="primary">{{ $t('def.sure') }}</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
import { get } from 'lodash';
import Core from '../../../core';
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
export default {
    props: {
        modalShow: {
            type: Boolean,
            default: false,
        },
        isUploadEdit: {
            type: Boolean,
            default: false,
        },
        uploadForm: {
            type: Object,
            default: {},
        },
    },
    data() {
        return {
            form: {},
            // 上传图片
            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
        };
    },
    watch: {
        modalShow: {
            handler(val) {
                if (!this.isUploadEdit) {
                    this.form = {};
                    this.upload.coverList = [];
                } else {
                    this.form = this.uploadForm;
                    this.upload.coverList[0] = {
                        uid: uuid(),
                        url: Core.Util.imageFilter(this.uploadForm.img),
                        status: 'done',
                        percent: 100,
                    };
                }
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        closeModal() {
            this.$emit('closeModal', false);
        },
        handleModalSubmit() {
            let msg = '';
            if (!this.form.name) {
                msg = this.$t('i.explosion_diagram');
            }
            if (!this.form.img) {
                msg = this.$t('i.upload_picture');
            }
            if (msg) {
                this.$message.warning(msg);
                return;
            }
            this.$emit('addExplore', this.form);
        },

        // 校验图片
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type);
            if (!isCanUpType) {
                this.$message.warning(this.$t('n.file_incorrect'));
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message.warning(this.$t('n.picture_smaller'));
            }

            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
                this.shortPath = get(fileList, '[0].response.data.filename', null);
                if (this.shortPath) {
                    this.form.img = this.shortPath;
                }
            }
            this.upload.coverList = fileList;
        },
    },
};
</script>

<style lang="less">
.EditExploreModal {
    .item-select-btn {
        height: 32px;
        line-height: 32px;
    }
    .item-select-display {
        margin-top: 12px;
        display: flex;
        position: relative;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        box-sizing: border-box;
        padding-left: 72px;
        > img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            position: absolute;
            left: 0;
        }
        .ant-btn {
            font-size: 14px;
            line-height: 16px;
            height: 16px;
            margin-bottom: 12px;
        }
        > span {
            font-size: 12px;
            line-height: 16px;
            color: #8090a6;
        }
    }
}
</style>
