<template>
<div id="ItemEdit" class="edit-container">
    <div class="title-container">
        <div class="title-area">{{ form.id ? '编辑商品' : '新增商品' }}</div>
    </div>
    <div class="form-block"> <!-- 基本信息 -->
        <div class="form-title">
            <div class="title">基本信息</div>
        </div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">商品名称</div>
                <div class="value">
                    <a-input v-model:value="form.name" placeholder="请输入商品名称(最多输入50字符)" :maxlength='50'/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">商品编码</div>
                <div class="value">
                    <a-input v-model:value="form.code" placeholder="请输入商品编码"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">商品分类</div>
                <div class="value">
                    <CategoryTreeSelect @change="handleCategorySelect"
                        :category='item_category' :category-id='form.category_id' v-if="form.id !== ''"/>
                </div>
            </div>
        </div>
    </div>
    <div class="form-block"> <!-- 图片信息 -->
        <div class="form-title">
            <div class="title">图片信息</div>
        </div>
        <div class="form-content">
            <div class="form-item img-upload">
                <div class="key">商品封面</div>
                <div class="value">
                    <a-upload name="file" class="image-uploader"
                        list-type="picture-card" accept='image/*'
                        :file-list="upload.coverList" :action="upload.action"
                        :headers="upload.headers" :data='upload.data'
                        :before-upload="handleImgCheck"
                        @change="handleCoverChange">
                        <div class="image-inner" v-if="upload.coverList.length < 1">
                            <i class="icon i_upload"/>
                        </div>
                    </a-upload>
                    <div class="tip">建议尺寸：800*800像素</div>
                </div>
            </div>
            <div class="form-item img-upload">
                <div class="key">商品详情图</div>
                <div class="value">
                    <a-upload name="file" class="image-uploader"
                        list-type="picture-card" accept='image/*'
                        :file-list="upload.detailList" :action="upload.action"
                        :headers="upload.headers" :data='upload.data'
                        :before-upload="handleImgCheck"
                        @change="handleDetailChange">
                        <div class="image-inner" v-if="upload.detailList.length < 10">
                            <i class="icon i_upload"/>
                        </div>
                    </a-upload>
                    <div class="tip">建议尺寸：800*800像素</div>
                </div>
            </div>
        </div>
    </div>
    <div class="form-block"> <!-- 规格信息 -->
        <div class="form-title">
            <div class="title">规格信息</div>
        </div>
        <div class="form-content">
            <div class="form-item">
                <div class="key">规格模式</div>
                <div class="value">
                    <a-radio-group v-model:value="specific.mode">
                        <a-radio :value="1">单规格</a-radio>
                        <a-radio :value="2">多规格</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <template v-if="specific.mode === 2">
            <div class="form-item">
                <div class="key">规格定义</div>
                <div class="value">
                    <div class="spec-item" v-for="(item,index) of specific.list" :key="index">
                        <div class="name">
                            <span>规格名</span>
                            <a-input v-model:value="item.name" placeholder="请输入规格名"/>
                            <a-button type="link" @click="handleRemoveSpec(index)">删除</a-button>
                        </div>
                        <div class="option">
                            <span>规格值</span>
                            <div class="option-item" v-for="(option, i) of item" :key="i">
                                <a-input v-model:value="item.option[i]" placeholder="规格值"/>
                                <i class="icon i_close" @click="handleRemoveSpecOption(index, i)"/>
                            </div>
                            <a-button type="link" @click="handleAddSpecOption(index)"><i class="icon i_add"></i> 删除</a-button>
                        </div>
                    </div>

                    <a-button type="primary" ghost @click="handleAddSpec">添加规格信息</a-button>
                </div>
            </div>
            </template>
        </div>
    </div>
    <div class="form-block" v-if="specific.mode === 1"> <!-- 单规格时的 价格信息 -->
        <div class="form-title">
            <div class="title">价格信息</div>
        </div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">标准售价</div>
                <div class="value input-number">
                    <a-input-number v-model:value="form.price" :min="0" :precision="2" placeholder="0.00"/>
                    <span>元</span>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">批发价格</div>
                <div class="value input-number">
                    <a-input-number v-model:value="form.original_price" :min="0" :precision="2" placeholder="0.00"/>
                    <span>元</span>
                </div>
            </div>
        </div>
    </div>
    <div class="form-block" v-if="form.category_id && configTemp.length"> <!-- 分类配置 -->
        <div class="form-title">
            <div class="title">分类配置</div>
        </div>
        <div class="form-content">
            <div v-for="(item, index) of configTemp" :key="index" :class="{'form-item':true, required: item.required, textarea: item.type === 'textarea', rich_text: item.type === 'rich_text'}">
                <div class="key">{{item.name}}</div>
                <div class="value">
                    <template v-if="item.type == 'input'">
                        <a-input :placeholder="`请输入${item.name}`" v-model:value="form.config[index].value"/>
                    </template>
                    <template v-if="item.type == 'textarea'">
                        <a-textarea :placeholder="`请输入${item.name}`" v-model:value="form.config[index].value" :auto-size="{ minRows: 4, maxRows: 6 }" :maxlength='500'/>
                        <span class="content-length">{{form.config[index].value.length}}/500</span>
                    </template>
                    <template v-if="item.type == 'select'">
                        <a-select :placeholder="`请选择${item.name}`" v-model:value="form.config[index].value" show-search option-filter-prop="children">
                            <a-select-option v-for="(val,i) of item.select" :key="i" :value="val" >{{val}}</a-select-option>
                        </a-select>
                    </template>
                    <template v-if="item.type == 'radio'">
                        <a-radio-group v-model:value="form.config[index].value">
                            <a-radio v-for="(val,i) of item.select" :key="i" :value="val" >{{val}}</a-radio>
                        </a-radio-group>
                    </template>
                    <template v-if="item.type == 'rich_text'">
                        <VueTinymce v-model="form.config[index].value" :setting="tinymce_setting"/>
                    </template>
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
import CategoryTreeSelect from './components/CategoryTreeSelect.vue'
import VueTinymce from '@jsdawn/vue3-tinymce';

export default {
    name: 'ItemEdit',
    components: {
        CategoryTreeSelect,
        VueTinymce
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {},
            form: {
                id: '',
                name: '',
                logo: '',
                imgs: '',
                code: '',
                category_id: undefined,
                price: undefined,
                original_price: undefined,
                config: '',
            },
            item_category: {},
            configTemp: [],

            specific: { // 规格
                mode: 1,
                list: [],
            },

            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [],
                detailList: [],
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
                // toolbar: 'undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
                toolbar_mode: 'sliding',

                // quickbars_selection_toolbar:
                // 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
                // plugins: 'link image media table lists fullscreen quickbars',

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
            this.getItemDetail();
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
        getItemDetail() {
            this.loading = true;
            Core.Api.Item.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getItemDetail res', res)
                this.detail = res
                let config = []
                let _config = []

                this.item_category = res.category
                try { this.configTemp = JSON.parse(res.category.config) } catch (err) { this.configTemp = [] }
                try { _config = JSON.parse(res.config) } catch (err) { _config = [] }

                for (let i = 0; i < this.configTemp.length; i++) {
                    const item = this.configTemp[i];
                    config.push({
                        name: item.name,
                        key: item.key,
                        value: item.type === 'select' ? undefined : '',
                        type: item.type
                    })
                }
                for (let i = 0; i < config.length; i++) {
                    const target = config[i];
                    let _target = _config.find(item => item.key === target.key)
                    target.value = _target ? _target.value : ''
                }

                for (const key in this.form) {
                    this.form[key] = res[key]
                }
                this.form.config = config
                this.form.price = Core.Util.countFilter(res.price)
                this.form.original_price = Core.Util.countFilter(res.original_price)
                if (this.form.logo) {
                    this.upload.coverList = [{
                        uid: 1,
                        name: this.form.logo,
                        url: Core.Const.NET.FILE_URL_PREFIX + this.form.logo,
                        short_path: this.form.logo,
                        status: 'done',
                    }]
                }
                if (this.form.imgs) {
                    let imgs = this.form.imgs.split(',')
                    this.upload.detailList = imgs.map((item, index) => ({
                        uid: index + 1,
                        name: item,
                        url: Core.Const.NET.FILE_URL_PREFIX + item,
                        short_path: item,
                        status: 'done',
                    }))
                }
            }).catch(err => {
                console.log('getItemDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 保存、新建 商品
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('form:', form)
            if (this.upload.coverList.length) {
                let coverList = this.upload.coverList.map(item => {
                    return item.short_path || item.response.data.filename
                })
                form.logo = coverList[0]
            }
            if (this.upload.detailList.length) {
                let detailList = this.upload.detailList.map(item => {
                    return item.short_path || item.response.data.filename
                })
                form.imgs = detailList.join(',')
            }
            if (!form.name) {
                return this.$message.warning('请输入商品名称')
            }
            if (!form.code) {
                return this.$message.warning('请输入商品编码')
            }
            if (!form.category_id) {
                return this.$message.warning('请选择商品分类')
            }
            if (!form.price) {
                return this.$message.warning('请输入商品标准售价')
            }
            if (!form.original_price) {
                return this.$message.warning('请输入商品批发价格')
            }
            if (this.configTemp.length) {
                for (let i = 0; i < this.configTemp.length; i++) {
                    let item = this.configTemp[i]
                    if (item.required && !form.config[i].value) {
                        return this.$message.warning(`请${['select','radio'].includes(item.type) ? '选择' : '输入'}${item.name}`)
                    }
                }
            }
            form.config = JSON.stringify(form.config)
            form.price = Math.round(form.price * 100)
            form.original_price = Math.round(form.original_price * 100)
            Core.Api.Item.save(form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },

        // 校验图片
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
            if (!isCanUpType) {
                this.$message.warning('文件格式不正确');
            }
            const isLt10M = (file.size / 1024 / 1024) < 10;
            if (!isLt10M) {
                this.$message.warning('请上传小于10MB的图片');
            }
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            console.log("handleCoverChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                }
            }
            this.upload.coverList = fileList
        },
        handleDetailChange({ file, fileList }) {
            console.log("handleDetailChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                }
            }
            this.upload.detailList = fileList
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
        },

        handleAddSpec() {
            this.specific.list.push({name: '', option: []})
        },
        handleRemoveSpec(index) {
            this.specific.list.splice(index, 1)
        },
        handleAddSpecOption(index) {
            this.specific.list[index].option.push('')
        },
        handleRemoveSpecOption(index, i) {
            this.specific.list[index].option.splice(i, 1)
        },
    }
};
</script>

<style lang="less">
#ItemEdit {
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