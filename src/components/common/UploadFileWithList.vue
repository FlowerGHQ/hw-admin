<template>
    <div class="UploadImage">
        <div class="form-item file-upload">
            <div class="key">{{ $t('crm_t.file') }}:</div>
            <div class="value">
                <a-button type="primary" @click="handleModalShow" v-if="can_upload">{{
                    $t('n.upload_attachment')
                }}</a-button>
            </div>
        </div>
        <div class="table-container">
            <a-table
                :columns="uploadColumns"
                :data-source="uploadData"
                :scroll="{ x: true }"
                :row-key="record => record.id"
                :pagination="false"
                size="small"
            >
                <template #headerCell="{ title }">
                    {{ $t(title) }}
                </template>
                <template #bodyCell="{ column, record, text, index }">
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.dataIndex === 'price'"> $ {{ text || '-' }} </template>
                    <template v-if="column.key === 'amount'">
                        <a-input-number
                            v-model:value="record.amount"
                            style="width: 66px"
                            :min="1"
                            :precision="0"
                            placeholder="请输入"
                        />
                        {{ $t('in.item') }}
                    </template>
                    <template v-if="column.key === 'discount'">
                        <a-input-number
                            v-model:value="record.discount"
                            style="width: 66px"
                            :min="1"
                            :max="100"
                            :precision="0"
                            placeholder="请输入"
                        />
                        %
                    </template>
                    <template v-if="column.key === 'total_price'">
                        $ {{ $Util.countFilter((record.price * record.amount * record.discount) / 100, 1) }}
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.dataIndex === 'operation'">
                        <a-button type="link" class="danger" @click="handleFileRemove(record.id, index)"
                            ><i class="icon i_delete" />{{ $t('def.remove') }}
                        </a-button>
                    </template>
                    <template v-if="column.key === 'remark'">
                        <a-input v-model:value="record.remark" :placeholder="$t('def.input')" />
                    </template>
                </template>
            </a-table>
        </div>

        <a-modal
            v-model:visible="modalShow"
            :title="$t('n.upload_attachment')"
            class="attachment-file-upload-modal"
            :after-close="handleModalClose"
        >
            <div class="form-title">
                <div class="form-item required">
                    <div class="key">{{ $t('n.name') }}:</div>
                    <div class="value">
                        <a-input v-model:value="modelForm.name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required file-upload">
                    <div class="key">{{ $t('f.upload') }}:</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            class="file-uploader"
                            :file-list="upload.fileList"
                            :action="upload.action"
                            :headers="upload.headers"
                            :data="upload.data"
                            :before-upload="handleFileCheck"
                            @change="handleFileChange"
                        >
                            <a-button type="primary" ghost class="file-upload-btn" v-if="upload.fileList.length < 1">
                                <i class="icon i_upload" /> {{ $t('f.choose') }}
                            </a-button>
                        </a-upload>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="modalShow = false">{{ $t('def.cancel') }}</a-button>
                <a-button @click="handleModalSubmit" type="primary" :disabled="submitDisabled">{{
                    $t('def.sure')
                }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';

export default {
    name: 'UploadFileWithList',
    components: {},
    props: {
        target_id: { type: Number },
        target_type: { type: Number },
    },
    emits: [''],
    data() {
        return {
            // 上传文件
            modalShow: false,
            submitDisabled: true,
            modelForm: {
                // 本次附件填写存值
                name: '',
                path: '',
                type: '',
                user_name: '',
                create_time: '',
            },
            uploadData: [], // 文件列表
            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'file',
                },
            },
        };
    },
    watch: {
        target_id(n) {
            if (this.target_id > 0) {
                this.getAttachmentList();
            }
            // this.getAttachmentList();
        },
    },
    computed: {
        uploadColumns() {
            let uploadColumns = [
                { title: 'crm_o.file_name', dataIndex: 'name', key: 'item' },
                { title: 'n.uploader', dataIndex: 'user_name', key: 'item' },
                { title: 'n.upload_time', dataIndex: 'create_time', key: 'time' },
                // {title: 'crm_o.file_size', dataIndex: 'file_size', key: 'item' },
                // {title: 'i.remark', dataIndex: 'remark', key: 'remark' },
                { title: 'def.operate', dataIndex: 'operation', key: 'operation' },
            ];
            return uploadColumns;
        },
        can_upload() {
            return true;
        },
    },
    created() {},
    mounted() {
        if (this.target_id > 0) {
            this.getAttachmentList();
        }
    },
    methods: {
        getUploadData() {
            this.$emit('getUploadData', this.uploadData);
        },
        // 获取附加列表数据
        getAttachmentList() {
            this.loading = true;
            Core.Api.Attachment.list({
                target_id: this.target_id,
                target_type: this.target_type,
            })
                .then(res => {
                    this.uploadData = res.list;
                })
                .catch(err => {
                    console.log('handleDelete err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 添加附件-打开弹窗
        handleModalShow() {
            this.modalShow = true;
            this.submitDisabled = true;
        },
        // 关闭弹窗
        handleModalClose() {
            this.modalShow = false;
            Object.assign(this.modelForm, this.$options.data().modelForm);
            this.upload.fileList = [];
        },
        // 上传前检查文件
        handleFileCheck(file) {
            console.log('handleFileCheck file.type', file.type);
            if (file.type.includes('image/')) {
                this.upload.data.type = 'img';
            } else if (file.type.includes('video/')) {
                this.upload.data.type = 'video';
            } else if (file.type.includes('audio/')) {
                this.upload.data.type = 'audio';
            } else {
                this.upload.data.type = 'file';
            }
            return true;
        },
        // 上传文件
        handleFileChange({ file, fileList }) {
            console.log('handleCoverChange status:', file.status, 'file:', file);
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
                this.modelForm.name = file.response.data.name;
                this.modelForm.path = file.response.data.filename;
                this.modelForm.type = this.upload.data.type;
                this.modelForm.user_name = Core.Data.getUser().name;
                this.modelForm.create_time = new Date().getTime() / 1000;

                if (this.modelForm.path) {
                    this.submitDisabled = false;
                }
            }
            this.upload.fileList = fileList;
        },
        // 附件提交
        handleModalSubmit() {
            // 添加到list中
            let length = this.uploadData.length;
            this.uploadData[length] = this.modelForm;
            // 还原原始值
            this.modelForm = Core.Util.deepCopy(this.$options.data().modelForm);
            this.upload.fileList = [];
            this.modalShow = false;
        },
        // 删除附件
        handleFileRemove(id, index) {
            // 编辑-删除后台数据
            if (!id) {
                return;
            }
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Attachment.delete({ id })
                        .then(() => {
                            // 删除列表指定列
                            this.uploadData.splice(index, 1);
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
    },
};
</script>
