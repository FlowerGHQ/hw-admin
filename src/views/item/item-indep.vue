<template>
<div id="ItemIndepDetail">
    <div class="list-container">
        <a-spin :spinning="loading" class='loading-incontent' v-if="loading"></a-spin>
        <div class="title-container">
            <div class="title-area">商品详情</div>
            <div class="btns-area">
                <a-button type="primary" ghost @click="handleEdit('edit')"><i class="icon i_edit"/>编辑</a-button>
                <a-button danger @click="handleDelete()"><i class="icon i_delete"/>删除</a-button>
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content">
                <div class="content-top">
                    <div class="info-block-top">
                        <img :src="$Util.imageFilter(detail.logo ? detail.logo : '', 2)" />
                    </div>
                    <div class="info-block-top">
                        <p class="name">商品名:{{detail.name}}</p>
                        <p class="price">￥{{$Util.countFilter(detail.price)}}</p>
                    </div>
                </div>
            </div>
        </div>
        <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right" v-if="!editShow">
            <template #expandIcon ><i class="icon i_expan_l"/> </template>
            <a-collapse-panel key="itemInfo" header="详情信息" class="gray-collapse-panel">
                <a-row class="panel-content info-container">
                    <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                        <div class="info-item">
                            <div class="key">商品编码</div>
                            <div class="value">{{detail.code || '-'}}</div>
                        </div>
                        <div class="info-item">
                            <div class="key">商品分类</div>
                            <div class="value">{{detail.category ? detail.category.name : '-'}}</div>
                        </div>
                        <div class="info-item">
                            <div class="key">标准售价</div>
                            <div class="value">￥{{$Util.countFilter(detail.price)}}</div>
                        </div>
                        <div class="info-item">
                            <div class="key">成本价格</div>
                            <div class="value">￥{{$Util.countFilter(detail.original_price)}}</div>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :lg='12' :xl='16' :xxl='18' class="info-block">
                        <template v-for="(item, index) of config" :key="index">
                            <a-col :xs='24' :sm='24' :lg='12' :xl='12' :xxl='8' class="info-item"
                                :class="item.type" v-if="item.value">
                                <div class="key">{{item.name}}</div>
                                <div class="value" v-if="item.type == 'rich_text'" v-html='item.value'></div>
                                <div class="value" v-else>{{item.value || '-'}}</div>
                            </a-col>
                        </template>
                    </a-col>
                </a-row>
            </a-collapse-panel>
        </a-collapse>
        <div class="edit-container" v-else>
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
                        <div class="key">商品型号</div>
                        <div class="value">
                            <a-input v-model:value="form.model" placeholder="请输入商品型号"/>
                        </div>
                    </div>
                    <div class="form-item required" v-if="specific.mode === 1">
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
            <div class="form-block"> <!-- 价格信息 -->
                <div class="form-title">
                    <div class="title">价格信息</div>
                </div>
                <div class="form-content">
                    <div class="form-item required">
                        <div class="key">成本价格</div>
                        <div class="value input-number">
                            <a-input-number v-model:value="form.original_price" :min="0" :precision="2" placeholder="0.00"/>
                            <span>元</span>
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">标准售价</div>
                        <div class="value input-number">
                            <a-input-number v-model:value="form.price" :min="0" :precision="2" placeholder="0.00"/>
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
                <a-button type="primary" ghost @click="handleEditClose">取消</a-button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Core from '../../core';

export default {
    name: 'RepairDetail',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            id: '',
            detail: {}, // 采购单详情
            config: [],

            activeKey: ['itemInfo'],

            form: {
                id: '',
                name: '',
                code: '',
                model: '',
                logo: '',
                imgs: '',
                category_id: undefined,
                price: undefined,
                original_price: undefined,
                config: '',
            },
            upload: { // 上传图片
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
            editFlag: 0,
            editShow: false,
        };
    },
    watch: {},
    computed: {
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.editFlag = Number(this.$route.query.edit_flag) || 0
        this.getItemDetail();
    },
    methods: {
        routerChange(type) {
            switch (type) {
                case 'back':  // 编辑
                    this.$router.go(-1)
                    break;
            }
        },
        // 获取 商品详情
        getItemDetail() {
            this.loading = true;
            Core.Api.Item.detail({
                id: this.id
            }).then(res => {
                console.log("getDetailData res", res)
                this.detail = res;
                try { this.config = JSON.parse(res.config) } catch (err) { this.config = [] }
                if (this.editFlag) {
                    this.handleEditShow();
                }
            }).catch(err => {
                console.log('getDetailData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 删除 商品
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该商品吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Item.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getItemDetail();
                        if (!_this.set_id) {
                            _this.routerChange('back');
                        }
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },

        handleEditShow() {
            this.editShow = true
            this.setFormData()
        },
        handleEditClose() {
            this.editShow = false
            this.editFlag = 0
            Object.assign(this.form, this.$options.data().form)
        },
        setFormData(res) {
            this.loading = true

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
                let logos = this.form.logo.split(',')
                this.upload.coverList = logos.map((item, index) => ({
                    uid: index + 1,
                    name: item,
                    url: Core.Const.NET.FILE_URL_PREFIX + item,
                    short_path: item,
                    status: 'done',
                }))
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
            this.loading = false
        },
        // 保存 商品
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('form:', form)
            if (typeof this.checkFormInput(form, specData, attrDef) === 'function') { return }
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
            form.config = JSON.stringify(form.config)
            form.price = Math.round(form.price * 100)
            form.original_price = Math.round(form.original_price * 100)
            console.log('handleSubmit form:', form)
            Core.Api.Item.save(form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        // 保存时检查表单输入
        checkFormInput(form, specData, attrDef) {
            if (!form.name) {
                return this.$message.warning('请输入商品名称')
            }
            if (!form.model) {
                return this.$message.warning('请输入商品型号')
            }
            if (!form.category_id) {
                return this.$message.warning('请选择商品分类')
            }
            if (!form.code) {
                return this.$message.warning('请输入商品编码')
            }
            if (!form.price) {
                return this.$message.warning('请输入商品标准售价')
            }
            if (!form.original_price) {
                return this.$message.warning('请输入商品成本价格')
            }
            if (this.configTemp.length) {
                for (let i = 0; i < this.configTemp.length; i++) {
                    let item = this.configTemp[i]
                    if (item.required && !form.config[i].value) {
                        return this.$message.warning(`请${['select','radio'].includes(item.type) ? '选择' : '输入'}${item.name}`)
                    }
                }
            }
            return 0
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

        // 商品分类选择
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
    }
};
</script>

<style lang="less" scoped>
#ItemDetail {
    .content-top {
        padding-bottom: 0 20px;
        display: flex;
        .info-block-top{
            padding-right: 20px;
            img {
                width: 120px;
                height: 120px;
                object-fit: cover;
                background: #F3F3F3;
                border-radius: 4px 4px 4px 4px;
            }
            .name {
                height: 28px;
                font-size: 16px;
                color: rgba(0, 0, 0, 0.85);
                line-height: 28px;
            }
            .price {
                height: 20px;
                font-size: 14px;
                font-weight: 500;
                color: #F4752E;
                line-height: 20px;
                padding-top: 20px;
            }
        }
    }
}

</style>
