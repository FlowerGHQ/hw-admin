<template>
<div class="AttachmentFile">
    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
        <template #expandIcon><i class="icon i_expan_l"/></template>
        <a-collapse-panel key="attachmentFile" header="上传附件" class="gray-collapse-panel">
            <div class="panel-content table-container no-mg">
                <div class="panel-header">
                    <span class="name">附件列表</span>
                    <a-button type="primary" @click="handleModalShow" v-if="can_upload">上传附件</a-button>
                </div>
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'detail'">
                            <div class="table-img">
                                <a-image :width="24" :height="24" :src="$Util.imageFilter(record.path.includes('img') ? record.path : '', 4)" fallback='无'/>
                                <a-tooltip placement="top" :title='text'>
                                    <p class="ell" style="max-width:120px;margin-left:12px;">{{text || '-'}}</p>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-'}}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type='link' @click="handleDownload(record)"><i class="icon i_download"/>下载</a-button>
                            <a-button type='link' @click="handleDelete(record.id)" class="danger" v-if="can_delete"><i class="icon i_delete"/>删除</a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </a-collapse-panel>
    </a-collapse>
    <a-modal v-model:visible="modalShow" title="上传附件" class="attachment-file-upload-modal" :after-close="handleModalClose">
        <div class="form-title">
            <div class="form-item required">
                <div class="key">附件名称:</div>
                <div class="value">
                    <a-input v-model:value="form.name" placeholder="请输入附件名称"/>
                </div>
            </div>
            <div class="form-item required file-upload">
                <div class="key">上传文件:</div>
                <div class="value">
                    <a-upload name="file" class="file-uploader"
                        :file-list="upload.fileList" :action="upload.action"
                        :headers="upload.headers" :data='upload.data'
                        :before-upload="handleFileCheck"
                        @change="handleFileChange">
                        <a-button type="primary" ghost class="file-upload-btn" v-if="upload.fileList.length < 1">
                            <i class="icon i_upload"/> 选择文件
                        </a-button>
                    </a-upload>
                </div>
            </div>
        </div>
        <template #footer>
            <a-button @click="modalShow = false">取消</a-button>
            <a-button @click="handleModalSubmit" type="primary">确定</a-button>
        </template>
    </a-modal>
</div>
</template>

<script>
import Core from '../../core';

export default {
    name: "AttachmentFile",
    props: {
        target_id: {
            type: Number
        },
        target_type: {
            type: Number
        },
        detail: {},
    },
    data() {
        return {
            // 加载
            loading: false,
            activeKey: ['attachmentFile'],

            tableData: [],
            tableColumns: [
                { title: '附件名称', dataIndex: 'name', key: 'detail' },
                { title: '文件类型', dataIndex: 'type', key: 'item' },
                { title: '上传人', dataIndex: ['user', 'account', 'name'], key: 'item' },
                { title: '上传时间', dataIndex: 'create_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right'},
            ],

            modalShow: false,
            form: {
                name: '',
                path: '',
                type: ''
            },

            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
        };
    },
    computed: {
        can_upload() {
            return true
        },
        can_delete() {
            return true
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.Attachment.list({
                target_id: this.target_id,
                target_type: this.target_type,
                page: 0
            }).then(res => {
                console.log("getTableData res", res)
                this.tableData = res.list
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 添加附件
        handleModalShow() {
            this.modalShow = true;
        },
        handleModalClose() {
            this.modalShow = false;
            Object.assign(this.form, this.$options.data().form)
            this.upload.fileList = []
        },
        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('handleLogin form:', form)
            if (!form.name) {
                return this.$message.warning('请输入附件名称')
            }
            this.loading = true;
            Core.Api.Attachment.save({
                ...form,
                target_type: this.target_type,
                target_id: this.target_id,
            }).then(() => {
                this.$message.success('保存成功')
                this.$emit('Submit')
                this.handleModalClose();
                this.getTableData();
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        // 上传前检查文件
        handleFileCheck(file) {
            console.log('handleFileCheck file.type', file.type)
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
        // 上传文件
        handleFileChange({file, fileList}) {
            console.log("handleCoverChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                }
                this.form.path = file.response.data.filename
                this.form.type = this.form.path.split('.').pop()
            }
            this.upload.fileList = fileList
        },

        // 删除附件
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该附件吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Attachment.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        // 下载附件
        handleDownload(record) {
            console.log('handleDownload record:', record)
            let url = Core.Const.NET.FILE_URL_PREFIX + record.path
            window.open(url, '_self')
        },
    },
}
</script>

<style lang="less">
.AttachmentFile {
    .panel-header {
        .fsb();
        margin-bottom: 20px;
        .name {
            font-weight: 500;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.85);
        }
        .ant-btn {
            border-radius: 2px;
        }
    }
}
</style>