<template>
    <div id="SystemFileEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('f.edit') : $t('f.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title">{{ $t('n.attachment') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('n.name') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.type') }}:</div>
                    <div class="value">
                        <a-select :placeholder="$t('def.select')" v-model:value="form.target_type">
                            <a-select-option v-for="item of typeMap" :key="item.key" :value="item.key">{{
                                item[$i18n.locale]
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required file-upload">
                    <div class="key">{{ $t('f.file') }}:</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            :file-list="upload.fileList"
                            :action="upload.action"
                            :headers="upload.headers"
                            :data="upload.data"
                            :before-upload="handleImgCheck"
                            @change="handleFileChange"
                        >
                            <a-button class="file-upload-btn" type="primary" ghost v-if="upload.fileList.length < 1">
                                <i class="icon i_upload" /> {{ $t('f.upload') }}
                            </a-button>
                        </a-upload>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button type="primary" @click="handleSubmit" v-if="$auth('ADMIN')">{{
                $t('def.sure')
            }}</a-button>
            <a-button type="primary" ghost @click="routerChange('back')">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

export default {
    name: 'SystemFileEdit',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {}, // 回显详情
            form: {
                id: '',
                name: '',
                path: '',
                type: '',
                target_type: undefined,
            },
            // 文件类型
            typeMap: Core.Const.SYSTEM.FILE.TARGET_TYPE_MAP,
            // 上传文件
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
    watch: {},
    computed: {},
    created() {
        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getSystemFileDetail();
        }
    },
    mounted() {},
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        // 获取商品详情
        getSystemFileDetail() {
            this.loading = true;
            Core.Api.System.fileDetail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getSystemFileDetail res', res);
                    this.detail = res.detail;
                    for (const key in this.form) {
                        this.form[key] = res.detail[key];
                    }
                    if (this.form.path) {
                        this.upload.fileList = [
                            {
                                uid: 1,
                                name: this.form.path,
                                url: Core.Const.NET.FILE_URL_PREFIX + this.form.path,
                                short_path: this.form.path,
                                status: 'done',
                            },
                        ];
                    }
                    console.log('this.upload.fileList: ', this.upload.fileList);
                })
                .catch(err => {
                    console.log('getSystemFileDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 保存、新建 文件
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            console.log('form:', form);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.target_type) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!this.upload.fileList.length) {
                return this.$message.warning(this.$t('def.enter'));
            }
            let fileList = this.upload.fileList.map(item => {
                return item.short_path || item.response.data.filename;
            });
            form.path = fileList[0];
            Core.Api.System.fileSave(form)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        // 校验文件
        handleImgCheck(file) {
            console.log('handleImgCheck file.type', file.type);
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
            console.log('handleFileChange status:', file.status, 'file:', file);
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
            }
            this.upload.fileList = fileList;
            let list = file.name.split('.');
            if (list) {
                this.form.type = list.pop().toLowerCase();
            }
        },
    },
};
</script>

<style lang="less">
// #SystemFileEdit {}
</style>
