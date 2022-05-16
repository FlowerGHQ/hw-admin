<template>
<div id="SystemFileEdit" class="edit-container">
    <div class="title-container">
        <div class="title-area">{{ form.id ? '编辑附件' : '新增附件' }}</div>
    </div>
    <div class="form-block">
        <div class="form-title"><div class="title">附件信息</div></div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">附件名称</div>
                <div class="value">
                    <a-input v-model:value="form.name" placeholder="请输入附件名称"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">附件类型</div>
                <div class="value">
                    <a-select placeholder="请选择附件类型" v-model:value="form.target_type">
                        <a-select-option v-for="(val,key) of typeMap" :key="key" :value="key">{{ val }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item required file-upload">
                <div class="key">文件上传</div>
                <div class="value">
                    <a-upload name="file"
                        :file-list="upload.fileList" :action="upload.action"
                        :headers="upload.headers" :data='upload.data'
                        :before-upload="handleImgCheck"
                        @change="handleFileChange">
                        <a-button class="file-upload-btn" type="primary" ghost v-if="upload.fileList.length < 1">
                            <i class="icon i_upload"/> 上传文件
                        </a-button>
                    </a-upload>
                </div>
            </div>
        </div>
    </div>
    <div class="form-btns">
        <a-button type="primary" @click="handleSubmit" v-if="$auth('ADMIN' && 'file.save')">确定</a-button>
        <a-button type="primary" ghost @click="routerChange('back')">取消</a-button>
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
                    ContentType: false
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
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getSystemFileDetail();
        }
    },
    mounted() {},
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        // 获取商品详情
        getSystemFileDetail() {
            this.loading = true;
            Core.Api.System.fileDetail({
                id: this.form.id,
            }).then(res => {
                console.log('getSystemFileDetail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
                if (this.form.path) {
                    this.upload.fileList = [{
                        uid: 1,
                        name: this.form.path,
                        url: Core.Const.NET.FILE_URL_PREFIX + this.form.path,
                        short_path: this.form.path,
                        status: 'done',
                    }]
                }
                console.log('this.upload.fileList: ', this.upload.fileList);
            }).catch(err => {
                console.log('getSystemFileDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 保存、新建 文件
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('form:', form)
            if (!form.name) {
                return this.$massage.warning('请输入附件名称')
            }
            if (!form.target_type) {
                return this.$massage.warning('请选择附件类型')
            }
            if (!this.upload.fileList.length) {
                return this.$massage.warning('请上传文件')
            }
            let fileList = this.upload.fileList.map(item => {
                return item.short_path || item.response.data.filename
            })
            form.path = fileList[0]
            Core.Api.System.fileSave(form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        // 校验文件
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
        // 上传文件
        handleFileChange({ file, fileList }) {
            console.log("handleFileChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                }
            }
            this.upload.fileList = fileList
            let list = file.name.split('.')
            if (list) {
                this.form.type = list.pop().toLowerCase()
            }
        },
    }
};
</script>

<style lang="less">
// #SystemFileEdit {}
</style>