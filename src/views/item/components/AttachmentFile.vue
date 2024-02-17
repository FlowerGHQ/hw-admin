<template>
    <div class="AttachmentFile">
        <div class="panel-header">
            <a-button type="primary" @click="handleModalShow" v-if="can_upload">{{
                $t('n.upload_attachment')
            }}</a-button>
            <span class="name">{{ $t('n.file_prompt_detail') }}</span>
        </div>
        <a-table
            :columns="tableColumns"
            :data-source="tableData"
            :scroll="{ x: true }"
            :row-key="record => record.id"
            :pagination="false"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.key === 'detail'">
                    <div class="table-img">
                        <!-- 图片、视频、音频、文档 -->
                        <div
                            class="default"
                            :class="record.fileType"
                            v-if="record.fileType !== 'img'"
                            @click="preView($Util.imageFilter(record.path ? record.path : '', 4), record.fileType)"
                        >
                            <img src="@images/item/audio_default.svg" v-if="record.fileType === 'audio'" />
                            <img src="@images/item/video_default.svg" v-else-if="record.fileType === 'video'" />
                            <img src="@images/item/pdf_default.svg" v-else-if="record.fileType === 'pdf'" />
                            <img class="default-img" :src="defult_img" v-else />
                        </div>
                        <a-image
                            class="img"
                            :width="32"
                            :height="32"
                            :src="$Util.imageFilter(record.path.includes('img') ? record.path : '', 4)"
                            :fallback="$t('def.none')"
                            v-else
                        />
                        <a-tooltip placement="top" :title="text">
                            <p class="ell" style="max-width: 200px; margin-left: 12px">{{ text || '-' }}</p>
                        </a-tooltip>
                    </div>
                </template>
                <template v-if="column.key === 'org'">
                    {{ $Util.userTypeFilter(text.org_type, $i18n.locale)
                    }}{{ text.org_name ? `·${text.org_name}` : '' }}
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
                    <a-button type="link" @click="handleDelete(record.id)" v-if="can_delete"
                        ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                    >
                </template>
            </template>
        </a-table>
        <a-modal
            v-model:visible="modalShow"
            :title="$t('n.upload_attachment')"
            class="attachment-file-upload-modal"
            :after-close="handleModalClose"
        >
            <div class="form-title">
                <div class="form-item required file-upload">
                    <div class="key">{{ $t('f.upload') }}:</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            class="file-uploader"
                            :multiple="true"
                            :file-list="upload.fileList"
                            :action="upload.action"
                            :headers="upload.headers"
                            :data="upload.data"
                            :before-upload="handleFileCheck"
                            @change="handleFileChange"
                        >
                            <a-button type="primary" ghost class="file-upload-btn">
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
        <!-- 音频预览 -->
        <a-modal v-model:visible="audioShow" centered :title="null" :footer="null" destroyOnClose>
            <div class="modal-body">
                <audio :src="preViewSrc" autoplay controls></audio>
            </div>
        </a-modal>
        <!-- 视频预览 -->
        <a-modal width="1200px" v-model:visible="videoShow" centered :title="null" :footer="null" destroyOnClose>
            <div class="modal-body">
                <video width="1140" height="600" :src="preViewSrc" autoplay controls></video>
            </div>
        </a-modal>
    </div>
</template>

<script>
import Core from '@/core';
import defult_img from '@images/item/default_file.svg';

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
            defult_img,
            // 加载
            loading: false,
            activeKey: ['attachmentFile'],

            tableData: [],

            modalShow: false,
            form: {
                item_list: [],
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
            FileType: {
                img: [
                    'bmp',
                    'jpg',
                    'jpeg',
                    'png',
                    'tif',
                    'gif',
                    'pcx',
                    'tga',
                    'exif',
                    'fpx',
                    'svg',
                    'psd',
                    'cdr',
                    'pcd',
                    'dxf',
                    'ufo',
                    'eps',
                    'ai',
                    'raw',
                    'wmf',
                    'webp',
                    'avif',
                    'apng',
                ],
                video: ['avi', 'wmv', 'mpeg', 'mp4', 'm4v', 'mov', 'asf', 'flv', 'f4v', 'rmvb', 'rm', '3gp', 'vob'],
                audio: [
                    'mp3',
                    'aac',
                    'wav',
                    'wma',
                    'cda',
                    'flac',
                    'm4a',
                    'mid',
                    'mka',
                    'mp2',
                    'mpa',
                    'mpc',
                    'ape',
                    'ofr',
                    'ogg',
                    'ra',
                    'wv',
                    'tta',
                    'ac3',
                    'dts',
                ],
                pdf: ['pdf'],
            },
            preViewSrc: '',
            audioShow: false,
            videoShow: false,
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
        can_upload() {
            return true;
        },
        can_delete() {
            return true;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Attachment.list({
                target_id: this.target_id,
                target_type: this.target_type,
                page: 0,
            })
                .then(res => {
                    console.log('AttachmentFile res', res);
                    this.tableData = res.list;
                    if (res.list.length === 0) {
                        this.attachmentEmpty = true;
                        this.$emit('attachmentEmpty', this.attachmentEmpty);
                    } else {
                        this.attachmentEmpty = false;
                        this.$emit('attachmentEmpty', this.attachmentEmpty);
                    }
                    this.filterData(this.tableData);
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

            this.loading = true;
            Core.Api.Attachment.saveList({
                ...form,
                target_type: this.target_type,
                target_id: this.target_id,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.$emit('Submit');
                    this.handleModalClose();
                    this.getTableData();
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
                const path = file.response.data.filename;
                const item = {
                    name: file.response.data.name,
                    path: path,
                    type: path.split('.').pop(),
                };
                this.form.item_list.push(item);
                if (this.form.item_list.length > 0) {
                    this.submitDisabled = false;
                }
            }
            this.upload.fileList = fileList;
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
                            _this.getTableData();
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
        filterData(data) {
            data.forEach(item => {
                item.fileType = this.getFileType(item.type);
            });
        },
        getFileType(type) {
            for (let i in this.FileType) {
                if (this.FileType[i].indexOf(type) !== -1) return i;
            }
        },
        // 预览文件
        preView(src, type) {
            this.preViewSrc = src;
            switch (type) {
                case 'pdf':
                    window.open(
                        'http://www.pfile.com.cn/api/profile/onlinePreview?url=' + encodeURIComponent(this.preViewSrc),
                    );
                    break;
                case 'audio':
                    this.audioShow = true;
                    break;
                case 'video':
                    this.videoShow = true;
                    break;

                default:
                    break;
            }
        },
        // 播放音频
        // playAudio() {
        //     var audio = document.getElementById("myAudio");
        //     audio.play();
        //     audio.pause();
        // }
    },
};
</script>

<style lang="less" scoped>
.AttachmentFile {
    .panel-header {
        display: flex;
        .fcc(flex-start, center);
        margin-bottom: 10px;
        .name {
            color: #666;
            font-size: 12px;
        }
        .ant-btn {
            border-radius: 2px;
            margin-right: 6px;
        }
    }
    .i_download,
    .i_delete {
        font-size: 16px;
    }
    /* 表格样式-start */
    .ant-table
        .ant-table-container
        .ant-table-content
        table
        tbody.ant-table-tbody
        tr.ant-table-row
        td.ant-table-cell
        .ant-btn {
        font-size: 14px;
    }
    :deep(
            .ant-table
                .ant-table-container
                .ant-table-content
                table
                tbody.ant-table-tbody
                tr.ant-table-row
                td.ant-table-cell
        ) {
        padding: 10px 16px;
        font-size: 14px;
        color: #1d2129;
    }
    :deep(.ant-table .ant-table-container .ant-table-content table thead.ant-table-thead tr th.ant-table-cell) {
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 500;
        color: #1d2129;
    }
    /* 表格样式-end */
}
</style>
<style lang="less">
.modal-body {
    .fcc();
    padding: 20px 0;
}
.table-img {
    .default {
        border-radius: 4px;
        height: 32px;
        width: 32px;
        background-color: rgba(73, 147, 233, 0.1);
        .fcc();
        cursor: pointer;
        > img {
            height: 16px;
            width: 16px;
        }
    }
    .pdf {
        background: rgba(233, 73, 74, 0.1);
    }
    .audio {
        background: rgba(76, 73, 233, 0.3);
    }
    .video {
        background: rgba(233, 92, 73, 0.1);
        object-fit: cover;
    }
    .img {
        border-radius: 4px;
        cursor: pointer;
    }
    .default-img {
        width: 100%;
    }
    .ell {
        cursor: pointer;
    }
}
</style>
