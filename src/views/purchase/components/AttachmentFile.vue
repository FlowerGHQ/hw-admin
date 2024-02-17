<template>
    <div class="AttachmentFile">
        <div class="panel-content table-container no-mg">
            <!-- <div class="panel-header">
            <span class="name"></span>
            <a-button type="primary" @click="handleModalShow">{{$t('n.upload_attachment')}}</a-button>
        </div> -->
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :row-key="record => record.id"
                :pagination="channelPagination"
                @change="handleTableChange"
            >
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'detail'">
                        <div class="table-img">
                            <a-image
                                :width="24"
                                :height="24"
                                :src="$Util.imageFilter(record.path.includes('img') ? record.path : '', 4)"
                                :fallback="$t('def.none')"
                            />
                            <a-tooltip placement="top" :title="text">
                                <p class="ell" style="max-width: 120px; margin-left: 12px">{{ text || '-' }}</p>
                            </a-tooltip>
                        </div>
                    </template>
                    <template v-if="column.key === 'org'">
                        {{ $Util.userTypeFilter(text.org_type, $i18n.locale) }}·{{ text.org_name }}
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="handleDownload(record)"
                            ><i class="icon i_download" />{{ $t('n.download') }}</a-button
                        >
                        <a-button type="link" @click="handleDelete(record.id)" class="danger"
                            ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                        >
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
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
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
                            @remove="handleremove"
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
import Core from '../../../core';

export default {
    name: 'AttachmentFile',
    props: {
        target_id: {
            type: Number,
        },
        target_type: {
            type: Number,
        },
        detail: {},
    },
    data() {
        return {
            // 加载
            loading: false,
            activeKey: ['attachmentFile'],

            tableData: [],

            modalShow: false,
            form: {
                name: '',
                path: '',
                type: '',
            },
            submitDisabled: true,

            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            attachmentEmpty: true,
            channelPagination: {
                current: 1,
                pageSizeOptions: ['20', '40', '60', '80', '100'],
                pageSize: 20,
                showQuickJumper: true, // 是否可以快速跳转至某页
                showSizeChanger: true, // 是否可以改变 pageSize
                total: 0,
                showTotal: total => `${this.$t('n.all_total')} ${total} ${this.$t('in.total')}`,
            }, // 分页数据
        };
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('n.name'), dataIndex: 'name', key: 'detail' },
                { title: this.$t('n.type'), dataIndex: 'type', key: 'item' },
                { title: this.$t('n.uploader'), dataIndex: ['user', 'account', 'name'], key: 'item' },
                { title: this.$t('n.uploading_agency'), dataIndex: 'user', key: 'org' },
                { title: this.$t('n.upload_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            return columns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        getTableData(params = {}) {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Attachment.list({
                target_id: this.target_id,
                target_type: this.target_type,
                page_size: this.channelPagination.pageSize,
                page: this.channelPagination.current,
                ...params,
            })
                .then(res => {
                    // console.log("AttachmentFile res", res)
                    this.channelPagination.total = res.count;
                    this.tableData = res.list;
                    if (res.list.length === 0) {
                        this.attachmentEmpty = true;
                        this.$emit('attachmentEmpty', this.attachmentEmpty);
                    } else {
                        this.attachmentEmpty = false;
                        this.$emit('attachmentEmpty', this.attachmentEmpty);
                    }
                })
                .catch(err => {
                    console.log('AttachmentFile err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 添加附件
        handleModalShow() {
            this.modalShow = true;
            this.submitDisabled = true;
        },
        handleModalClose() {
            this.modalShow = false;
            Object.assign(this.form, this.$options.data().form);
            this.upload.fileList = [];
        },
        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.form);
            console.log('handleLogin form:', form);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            this.loading = true;
            Core.Api.Attachment.save({
                ...form,
                target_type: this.target_type,
                target_id: this.target_id,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.$emit('Submit');
                    this.handleModalClose();
                    this.getTableData({ page: 1 });
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
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
                this.form.path = file.response.data.filename;
                this.form.type = this.form.path.split('.').pop();
                if (this.form.path) {
                    this.submitDisabled = false;
                }
            }
            this.upload.fileList = fileList;
        },
        // 删除附件
        handleremove() {
            console.log(this.upload.fileList);
            this.form.path = '';
            this.form.type = '';
            this.submitDisabled = true;
        },
        // 删除附件
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Attachment.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData({ page: 1 });
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        // 下载附件
        handleDownload(record) {
            console.log('handleDownload record:', record);
            let url = Core.Const.NET.FILE_URL_PREFIX + record.path;
            window.open(url, '_self');
        },
        // 分页事件
        handleTableChange(pagination, filters, sorter) {
            const pager = { ...this.channelPagination };
            pager.current = pagination.current;
            if (pagination.pageSize !== this.channelPagination.pageSize) {
                pager.current = 1;
                pager.pageSize = pagination.pageSize;
            }
            this.channelPagination = pager;
            this.getTableData({
                page_size: this.channelPagination.pageSize,
                page: this.channelPagination.current,
            });
        },
    },
};
</script>

<style lang="less">
.AttachmentFile {
    .panel-header {
        .fsb();
        margin-bottom: 20px;

        .ant-btn {
            border-radius: 2px;
        }
    }
}
</style>
