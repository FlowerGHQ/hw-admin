<template>
    <div>
        <a-modal v-model:visible="modalShow" :title="form.id ? '编辑爆炸图' : '新增爆炸图'" class="EditExploreModal"
            :after-close='closeModal'>
            <div class="modal-content">
                <div class="form-item required">
                    <div class="form-item img-upload">
                        <div class="key">爆炸图</div>
                        <div class="value">
                            <a-upload name="file" class="image-uploader"
                                list-type="picture-card" accept='image/*'
                                :file-list="upload.coverList" :action="upload.action"
                                :headers="upload.headers" :data='upload.data'
                                :before-upload="handleImgCheck"
                                @change="handleCoverChange">
                                <div class="image-inner" v-if="upload.coverList.length < 1">
                                    <i class="icon i_upload"/>
                                </div>
                            </a-upload>
                            <div class="tip">建议尺寸：800*800像素</div>
                        </div>
                    </div>
                </div>
                <div class="form-item required afs">
                    <div class="key">爆炸图名称:</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入BOM名称"/>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="closeModal">取消</a-button>
                <a-button @click="handleModalSubmit" type="primary">确定</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
import { get } from 'lodash';
import Core from '../../../core';
export default {
    props: {
        modalShow: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            form: {},
            // 上传图片
            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [
                ],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
        }
    },
    methods: {
        closeModal () {
            this.$emit("closeModal", false);
        },
        handleModalSubmit() {
            // this.$emit("addExplore", this.form);
            let msg = "";
            if(!this.form.name) {
                msg = "请填写爆炸图名称";
            }
            if(!this.form.img) {
                msg = "请上传一张图片";
            }
            if(msg) {
                this.$message.warning(msg);
                return;
            }
            this.$emit("addExplore", this.form);
        },

        // 校验图片
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
            if (!isCanUpType) {
                this.$message.warning('文件格式不正确');
            }
            const isLt10M = (file.size / 1024 / 1024) < 10;
            if (!isLt10M) {
                this.$message.warning('请上传小于10MB的图片');
            }

            // this.loadImage(TEST_IMAGE);
            // return false;
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                }
                this.shortPath = get(fileList,'[0].response.data.filename', null);
                if(this.shortPath) {
                    this.form.img = this.shortPath;
                    // this.loadImage(this.detailImageUrl);
                }
            }
            this.upload.coverList = fileList;
        },
    }
}
</script>

<style lang='less' >
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
            color: #8090A6;
        }

    }
}
</style>