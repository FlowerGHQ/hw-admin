<template>
<div id="SystemFileEdit" class="edit-container">
    <div class="title-container">
        <div class="title-area">{{ form.id ? '编辑文件' : '新增文件' }}</div>
    </div>
    <div class="form-block">
        <div class="form-title">
            <div class="title">文件上传</div>
        </div>
        <div class="form-content">
            <div class="form-item img-upload">
                <div class="value">
                    <a-upload name="file" class="image-uploader"
                        list-type="picture-card"
                        :file-list="upload.fileList" :action="upload.action"
                        :headers="upload.headers" :data='upload.data'
                        :before-upload="handleImgCheck"
                        @change="handleFileChange">
                        <div class="image-inner" v-if="upload.fileList.length < 1">
                            <i class="icon i_upload"/>
                        </div>
                    </a-upload>
                </div>
            </div>
        </div>
    </div>
    <div class="form-btns">
        <a-button type="primary" @click="handleSubmit">确定</a-button>
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
                target_type: 2,
            },
            item_category: {},
            configTemp: [],
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
                this.form = res.detail
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
            if (this.upload.fileList.length) {
                let fileList = this.upload.fileList.map(item => {
                    return item.short_path || item.response.data.filename
                })
                form.path = fileList[0]
            }
            if (this.configTemp.length) {
                for (let i = 0; i < this.configTemp.length; i++) {
                    let item = this.configTemp[i]
                    if (item.required && !form.config[i].value) {
                        return this.$message.warning(`请${['select','radio'].includes(item.type) ? '选择' : '输入'}${item.name}`)
                    }
                }
            }
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
                this.form.name = list[0]
                this.form.type = list[1]
            }
        },

        handleCategorySelect(val, node) {
            this.form.category_id = val
            this.item_category = node
            try {
                this.configTemp = JSON.parse(node.config)
            } catch (error) {
                this.configTemp = []
            }

            let _config = Core.Util.deepCopy(this.form.config)
            let config = []
            for (let i = 0; i < this.configTemp.length; i++) {
                const item = this.configTemp[i];
                config.push({
                    name: item.name,
                    key: item.key,
                    value: item.type === 'select' ? undefined : '',
                })
            }
            for (let i = 0; i < config.length; i++) {
                const target = config[i];
                let _target = _config.find(item => item.key === target.key)
                target.value = _target ? _target.value : ''
            }
            console.log('handleCategorySelect config:', config)
            this.form.config = config
        }
        
    }
};
</script>

<style lang="less">
#SystemFileEdit {
    .form-block {
        .form-content {
            .form-item {
                .value.input-number {
                    .ant-input-number {
                        width: 120px;
                    }
                    > span {
                        font-size: 14px;
                        padding-left: 10px;
                        color: #323233;
                    }
                }
            }
        }
    }
}
</style>