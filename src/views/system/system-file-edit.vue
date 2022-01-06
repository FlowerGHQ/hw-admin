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
                <!-- <div class="key">文件上传</div> -->
                <div class="value">
                    <a-upload name="file" class="image-uploader"
                        list-type="picture-card" accept='.doc,.docx,.xlsx,.video,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        :file-list="upload.coverList" :action="upload.action"
                        :headers="upload.headers" :data='upload.data'
                        :before-upload="handleImgCheck"
                        @change="handleCoverChange">
                        <div class="image-inner" v-if="upload.coverList.length < 1">
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
import VueTinymce from '@jsdawn/vue3-tinymce';

export default {
    name: 'SystemFileEdit',
    components: {
        VueTinymce
    },
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
                coverList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            tinymce_setting: {
                menubar: false,  // 隐藏菜单栏
                branding: false, // 隐藏右下角技术支持

                toolbar: ' fontsizeselect forecolor backcolor | bold italic underline strikethrough | formatselect alignleft aligncenter alignright alignjustify | numlist bullist | indent outdent | superscript subscript | removeformat | fullscreen',
                toolbar_mode: 'sliding',

                fontsize_formats: '12px 14px 16px 18px',
                default_link_target: '_blank',
                link_title: false,
                nonbreaking_force_tab: true,
                // 设置中文语言
                language: 'zh_CN',
                language_url: '/ext/tinymce_zh_CN.js',
                content_style: 'body{font-size: 14px}'
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
            let routeUrl
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
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
                    this.upload.coverList = [{
                        uid: 1,
                        name: this.form.path,
                        url: Core.Const.NET.FILE_URL_PREFIX + this.form.path,
                        short_path: this.form.path,
                        status: 'done',
                    }]
                }
                console.log('this.upload.coverList: ', this.upload.coverList);
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
            if (this.upload.coverList.length) {
                let coverList = this.upload.coverList.map(item => {
                    return item.short_path || item.response.data.filename
                })
                form.path = coverList[0]
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

        // 校验图片
        handleImgCheck(file) {
            // const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
            // if (!isCanUpType) {
            //     this.$message.warning('文件格式不正确');
            // }
            // const isLt10M = (file.size / 1024 / 1024) < 10;
            // if (!isLt10M) {
            //     this.$message.warning('请上传小于10MB的图片');
            // }
            // return isCanUpType && isLt10M;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            // console.log("handleCoverChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                }
            }
            this.upload.coverList = fileList
            console.log('this.upload.coverList: ', this.upload.coverList);
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