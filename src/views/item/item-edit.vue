<template>
<div id="ItemEdit" class="edit-container">
    <div class="title-container">
        <div class="title-area">{{ form.id ? '编辑商品' : '新增商品' }}</div>
    </div>
    <div class="form-block">
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
                    <CategoryTreeSelect @change="(val) => {form.category_id = val}"
                        :category='item_category' :category-id='form.category_id' v-if="form.id !== ''"/>
                </div>
            </div>
            <!-- <div class="form-item required">
                <div class="key">品牌</div>
                <div class="value">
                    <a-select v-model:value="form.country" placeholder="请选择品牌">
                        <a-select-option v-for="item of countryList" :key="item.value" :value="item.value">{{ item.text }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item">
                <div class="key">生产商</div>
                <div class="value">
                    <a-select v-model:value="form.country" placeholder="请选择生产厂商">
                        <a-select-option v-for="item of countryList" :key="item.value" :value="item.value">{{ item.text }}</a-select-option>
                    </a-select>
                </div>
            </div> -->
        </div>
    </div>
    <div class="form-block">
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
    <div class="form-block">
        <div class="form-title">
            <div class="title">图片信息</div>
        </div>
        <div class="form-content">
            <div class="form-item required img-upload">
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
            <div class="form-item required img-upload">
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
    <div class="form-btns">
        <a-button type="primary" @click="handleSubmit">确定</a-button>
        <a-button type="primary" ghost @click="routerChange('back')">取消</a-button>
    </div>
</div>
</template>

<script>
import Core from '../../core';
import CategoryTreeSelect from './components/CategoryTreeSelect.vue'

export default {
    name: 'ItemEdit',
    components: {CategoryTreeSelect},
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
            },
            item_category: {},
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
                for (const key in this.form) {
                    this.form[key] = res[key]
                }
                this.item_category = res.category
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
            this.upload.coverList = fileList
            console.log("handleCoverChange status:", file.status, "file:", file)
        },
        handleDetailChange({ file, fileList }) {
            this.upload.detailList = fileList
            console.log("handleDetailChange status:", file.status, "file:", file)
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