<template>
<div id="NoticeEdit" class="edit-container">
    <div class="title-container">
        <div class="title-area">{{ form.id ? '编辑消息' : '新建消息' }}</div>
    </div>
    <div class="form-block">
        <div class="form-title"><div class="title-colorful">基本信息</div></div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">消息标题：</div>
                <div class="value">
                    <a-input v-model:value="form.title" placeholder="请输入消息标题"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">消息类型：</div>
                <div class="value">
                    <a-select v-model:value="form.type" placeholder="请选择消息类型">
                        <a-select-option v-for="(val, key) in typeMap" :key="key" :value="Number(key)">{{val}}</a-select-option>
                    </a-select>
                </div>
            </div>
        </div>
    </div>
    <div class="form-block">
        <div class="form-title"><div class="title-colorful">消息内容</div></div>
        <div class="form-content">
            <div class="form-item required afs rich_text">
                <div class="value">
                    <VueTinymce v-model="form.content" :setting="tinymce_setting" />
                </div>
            </div>
        </div>
    </div>
    <div class="form-btns">
        <a-button @click="handleSubmit" type="primary">确定</a-button>
        <a-button @click="routerChange('back')" type="primary" ghost="">取消</a-button>
    </div>
</div>
</template>

<script>
import Core from '../../core';
import VueTinymce from '@jsdawn/vue3-tinymce';


export default {
    name: 'NoticeEdit',
    components: { VueTinymce },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            detail: {},
            typeMap: Core.Const.NOTICE.MASTER_TYPE_MAP,
            form: {
                id: '',
                title: '',
                content: '',
                category: NOTICE.CATEGORY.MASTER,
                type: undefined,
            },
            tinymce_setting: {
                menubar: true,  // 隐藏菜单栏
                branding: false, // 隐藏右下角技术支持

                toolbar: 'fontsizeselect forecolor backcolor | bold italic underline strikethrough | formatselect code lineheight alignleft aligncenter alignright alignjustify | numlist bullist | indent outdent | superscript subscript | removeformat | fullscreen',
                // toolbar: 'undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
                toolbar_mode: 'sliding',

                // quickbars_selection_toolbar:
                // 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
                plugins: 'link image media table lists fullscreen quickbars',

                fontsize_formats: '12px 14px 16px 18px',
                default_link_target: '_blank',
                link_title: false,
                nonbreaking_force_tab: true,
                // 设置中文语言
                language: 'zh_CN',
                language_url: '/ext/tinymce_zh_CN.js',
                content_style: 'body{font-size: 14px}',
            },
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getNoticeDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        getNoticeDetail() {
            this.loading = true;
            Core.Api.Notice.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getNoticeDetail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
            }).catch(err => {
                console.log('getNoticeDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.title) {
                return this.$message.warning('请输入消息标题')
            }
            if (!form.type) {
                return this.$message.warning('请选择消息类型')
            }
            if (!form.content) {
                return this.$message.warning('请输入消息内容')
            }
            Core.Api.Notice.save(form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        }
    }
};
</script>

<style lang="less" scoped>
// #NoticeEdit {}
</style>