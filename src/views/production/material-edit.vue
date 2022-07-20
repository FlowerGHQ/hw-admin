<template>
    <div id="MaterialEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? '编辑物料' : '新增物料' }}</div>
        </div>
        <div class="form-block"> <!-- 基本信息 -->
            <div class="form-title">
                <div class="title">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">物料名称</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入物料名称(最多输入50字符)" :maxlength='50'/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">物料英文名</div>
                    <div class="value">
                        <a-input v-model:value="form.name_en" placeholder="请输入物料英文名(最多输入50字符)" :maxlength='50'/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">物料分类</div>
                    <div class="value">
                        <CategoryTreeSelect @change="handleCategorySelect"
                            :category='item_category' :category-id='form.category_id'
                            placeholder="请选择物料分类" type="material"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">物料编码</div>
                    <div class="value">
                        <a-input v-model:value="form.code" placeholder="请输入物料编码"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">物料规格</div>
                    <div class="value">
                        <a-input v-model:value="form.spec" placeholder="请输入物料规格"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">单位</div>
                    <div class="value">
                        <a-input v-model:value="form.unit" placeholder="请输入单位"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">物料实物图</div>
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
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">装箱数</div>
                    <div class="value">
                        <a-input-number v-model:value="form.pack_count" placeholder="请输入" />件
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">颜色</div>
                    <div class="value">
                        <a-input v-model:value="form.color" placeholder="请输入" />
                    </div>
                </div>
                <div class="form-item ">
                    <div class="key">物料包装</div>
                    <div class="value">
                        <a-input v-model:value="form.encapsulation" placeholder="请输入物料包装"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">包装尺寸</div>
                    <div class="value">
                        <a-input v-model:value="form.encapsulation_size" placeholder="请输入包装尺寸"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">毛重</div>
                    <div class="value">
                        <a-input-number v-model:value="gross_weight" placeholder="请输入" style="width: 80px;" :min="0" :precision="2"/> kg
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">备注</div>
                    <div class="value">
                        <a-input v-model:value="form.remark" placeholder="请输入备注"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button type="primary" @click="handleSubmit" v-if="$auth('material.save')">确定</a-button>
            <a-button type="primary" ghost @click="routerChange('back')">取消</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import CategoryTreeSelect from '../../components/popup-btn/CategoryTreeSelect.vue'

export default {
    name: 'MaterialEdit',
    components: {
        CategoryTreeSelect,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            form: {
                id: '',
                name: '',
                name_en: '',
                code: '',
                category_id: undefined,
                encapsulation: '', // 物料包装
                spec: '', // 规格
                supplier_ids: undefined, // 供应商
                unit: '',
                encapsulation_size: '',
                remark: '',
                image: '',
                color: '',
                pack_count: '',
            },
            gross_weight: '',
            supplierList: [],
            item_category: {},
            configTemp: [],

            upload: { // 上传图片
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
        };
    },
    watch: {},
    computed: {},
    created() {
        this.form.id = Number(this.$route.query.id) || 0
        this.getSupplierList();
        if (this.form.id) {
            this.getMaterialDetail();
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
        // 获取物料详情
        getMaterialDetail() {
            this.loading = true;
            Core.Api.Material.detail({
                id: this.form.id,
            }).then(res => {
                console.log('Material.detail res', res)
                this.form = res
                this.gross_weight = Core.Util.countFilter(res.gross_weight)
                if (this.form.image) {
                    this.upload.coverList = [{
                        uid: 1,
                        name: this.form.name,
                        url: Core.Const.NET.FILE_URL_PREFIX + this.form.image,
                        short_path: this.form.image,
                        status: 'done',
                    }]
                }
            }).finally(() => {
                this.loading = false
            })
        },
        getSupplierList() {
            Core.Api.Supplier.listAll().then(res => {
                this.supplierList = res.list
            })
        },
        // 保存、新建 物料
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            // form.image = this.upload.coverList[0].short_path || this.upload.coverList[0].response.data.filename
            console.log('form:', form)
            if (this.upload.coverList.length) {
                let file_url = this.upload.coverList.map(item => {
                    return item.short_path || item.response.data.filename
                })
                if (file_url.length > 0) {
                    form.image = file_url[0]
                }
            }
            if (typeof this.checkFormInput(form) === 'function') { return }
            console.log('handleSubmit form:', form)
            Core.Api.Material.save({
                ...form,
                gross_weight: Math.round(this.gross_weight * 100)
            }).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        // 保存时检查表单输入
        checkFormInput(form) {
            if (!form.name) {
                return this.$message.warning('请输入物料名称')
            }
            if (!form.name_en) {
                return this.$message.warning('请输入物料英文名')
            }
            if (!form.category_id) {
                return this.$message.warning('请选择物料分类')
            }
            if (!form.code) {
                return this.$message.warning('请输入物料编码')
            }
            if (!form.spec) {
                return this.$message.warning('请输入物料规格')
            }
            if (!form.unit) {
                return this.$message.warning('请输入单位')
            }
            if (!form.pack_count) {
                return this.$message.warning('请输入最小装箱数')
            }
            if (!form.color) {
                return this.$message.warning('请输入颜色')
            }
           /* if (!form.image) {
                return this.$message.warning('请上传图片')
            }*/
          /*  if (!form.encapsulation) {
                return this.$message.warning('请输入物料包装')
            }*/
            return 0
        },

        // 物料分类选择
        handleCategorySelect(val, node) {
            this.form.category_id = val
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
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message)
                }
            }
            this.upload.coverList = fileList
            console.log('coverList', file)
        },
    }
};
</script>

<style lang="less">
</style>
