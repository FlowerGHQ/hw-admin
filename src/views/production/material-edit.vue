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
                <div class="form-item">
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
            <a-button type="primary" @click="handleSubmit">确定</a-button>
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
                code: '',
                category_id: undefined,
                encapsulation: '', // 物料包装
                spec: '', // 规格
                supplier_ids: undefined, // 供应商
                unit: '',
                encapsulation_size: '',
                remark: '',
            },
            gross_weight: '',
            supplierList: [],
            item_category: {},
            configTemp: [],
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
            console.log('form:', form)
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
          /*  if (!form.encapsulation) {
                return this.$message.warning('请输入物料包装')
            }*/
            return 0
        },

        // 物料分类选择
        handleCategorySelect(val, node) {
            this.form.category_id = val
        },
    }
};
</script>

<style lang="less">
</style>
