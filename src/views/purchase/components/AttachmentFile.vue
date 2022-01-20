<template>
    <div class="AttachmentFile">
        <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
            <template #expandIcon><i class="icon i_expan_l"/></template>
            <a-collapse-panel key="attachmentFile" header="上传附件" class="gray-collapse-panel">
                <div class="panel-content">
                    <div v-for="(item,index) of attachmentFileList" :key="index">
                        <a-image :width="120" :height="120" :src="$Util.imageFilter(item.path)" fallback='无' v-if="['jpeg', 'png', 'gif', 'bmp', 'jpg'].includes(item.type.toLocaleLowerCase())"/>
                        <a-image :width="30" :height="30" :src="$Util.imageFilter('')"  fallback='无' v-else/>
                        {{ item.name }}
                        <a-button v-if="$auth('AGENT', 'STORE')" danger @click="handleDelete(item.id)"><i class="icon i_delete"/></a-button>
                    </div>
                    <a-button v-if="$auth('AGENT', 'STORE')" type="primary"  @click="handleRepairShow">上传附件</a-button>
                </div>
            </a-collapse-panel>
        </a-collapse>
        <a-modal v-model:visible="repairImgShow" title="附件凭证" class="img-edit-modal" :after-close="handleEditClose">
            <div class="form-title">
                <div class="form-item required">
                    <div class="key">名称:</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入名称"/>
                    </div>
                </div>
                <div class="form-item required file-upload">
                    <div class="key">上传文件:</div>
                    <div class="value">
                        <a-upload name="file" class="file-uploader"
                            :file-list="upload.fileList" :action="upload.action"
                            :headers="upload.headers" :data='upload.data'
                            :before-upload="handleImgCheck"
                            @change="handleLogoChange">
                            <a-button v-if="upload.fileList.length < 1" v-model:value="form.path">
                                <i class="icon i_upload"/> 点击上传
                            </a-button>
                        </a-upload>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleEditSubmit" type="primary">确定</a-button>
                <a-button @click="repairImgShow=false">取消</a-button>
            </template>
        </a-modal>

    </div>
</template>

<script>
import Core from '../../../core';
import Const from "../../../core/const";


export default {
    name: "AttachmentFile",
    props: {
        target_id: {
            type: Number
        },
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            activeKey: ['attachmentFile'],
            repairImgShow: false,
            form: {
                name: '',
                path: '',
                target_id: '',
                target_type: '',
                type: ''
            },
            attachmentFileList: [],
            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                    // type: 'video',
                    // type: 'file',
                },
            },
        };
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        handleImgCheck(file) {
            console.log('handleImgCheck file.type', file.type)
            if (file.type.includes('image/')) {
                this.upload.data.type = 'img'
            } else if (file.type.includes('video/')) {
                this.upload.data.type = 'video'
            } else if (file.type.includes('audio/')) {
                this.upload.data.type = 'audio'
            } else {
                this.upload.data.type = 'file'
            }
            return true
        },
        // 上传图片
        handleLogoChange({file, fileList}) {
            console.log("handleCoverChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                }
                this.form.path = file.response.data.filename
                let type = this.form.path
                type = type.substr(type.indexOf(".") + 1)
                this.form.type = type
            }
            this.upload.fileList = fileList
        },

        handleRepairShow() {
            this.repairImgShow = true;
        },
        handleEditClose() {
            this.repairImgShow = false;
            this.form = {
                name: '',
                path: '',
            }
        },
        handleEditSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('handleLogin form:', form)
            if (!form.name) {
                return this.$message.warning('请输入名称')
            }
            this.loading = true;
            this.form.target_type = Const.ATTACHMENT.TARGET_TYPE.REPAIR_ORDER
            this.form.target_id = this.target_id
            Core.Api.Attachment.save(this.form).then(() => {
                this.$message.success('保存成功')
                this.$emit('handleAttachmentFile')
                this.handleEditClose();
                this.getTableData();
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该附件吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Attachment.delete({id: id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            console.log('this.target_id: ', this.target_id);

            Core.Api.Attachment.list({
                target_id: this.target_id,
                target_type: Const.ATTACHMENT.TARGET_TYPE.REPAIR_ORDER,
                page: 0
            }).then(res => {
                this.attachmentFileList = res.list
                console.log("getTableData res", res)
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    },
}
</script>

<style scoped>


</style>