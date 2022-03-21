<template>
    <div id="ItemEdit" class="edit-container">
        <a-spin :spinning="loading" class='loading-incontent' v-if="loading"></a-spin>
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
                            placeholder="请选择物料分类" type="material"
                        />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">物料包装</div>
                    <div class="value">
                        <a-input v-model:value="form.encapsulation" placeholder="请输入物料包装"/>
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
                    <div class="key">供应商编码</div>
                    <div class="value">
                        <a-input v-model:value="form.supplier_code" placeholder="请输入供应商编码"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">单位</div>
                    <div class="value">
                        <a-input v-model:value="form.unit" placeholder="请输入单位"/>
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
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue'

export default {
    name: 'ItemEdit',
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
                supplier_code: '', // 供应商编码
                unit: ''
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
        // 获取物料详情
        getItemDetail() {
            this.loading = true;
            Core.Api.Material.detail({id: this.form.id})
                .then(res => {
                    console.log('Material.detail res', res)
                    this.form = res
                })
                .finally(() => {
                    this.loading = false
                })
        },

        // 保存、新建 物料
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('form:', form)
            if (typeof this.checkFormInput(form) === 'function') { return }
            console.log('handleSubmit form:', form)
            Core.Api.Material.save(form).then(() => {
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
            if (!form.encapsulation) {
                return this.$message.warning('请输入物料包装')
            }
            if (!form.code) {
                return this.$message.warning('请输入物料编码')
            }
            if (!form.spec) {
                return this.$message.warning('请输入物料规格')
            }
            if (!form.supplier_code) {
                return this.$message.warning('请选择供应商编码')
            }
            if (!form.unit) {
                return this.$message.warning('请输入单位')
            }
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
#ItemEdit {
    .form-block {
        .form-content {
            .form-item {
                .value.input-number {
                    display: flex;
                    .ant-input-number {
                        width: 120px;
                    }
                    > span {
                        font-size: 10px;
                        color: #8090A6;
                        margin-left: 5px;
                        margin-top: 7px;
                    }
                    .ant-select {
                        margin-left: 10px;
                        width: 60px;
                    }
                }
            }
        }
    }
    .form-item.specific-config,
    .form-item.specific-items {
        align-items: flex-start;
        > .key {
            line-height: 32px;
        }
        > .value {
            // width: calc(~'100% - 200px');
            max-width: calc(~'100% - 200px');
            .value-price {
                margin-right: 5px;
                width: 60px;
            }
        }
    }
    .form-item.specific-items {
        margin-top: 30px;
    }
    .spec-item {
        padding-bottom: 10px;
        .name ,.option {
            > p {
                width: 4em;
                font-size: 12px;
                color: #000000;
                padding-left: 16px;
                box-sizing: content-box;
            }
            .ant-btn {
                font-size: 12px;
            }
        }
        .name {
            .fac();
            box-sizing: border-box;
            height: 50px;
            background: #FFFFFF;
            border: 1px solid #E5E8EB;
            border-radius: 1px;
            > .ant-input {
                width: 194px;
                margin-right: 8px;
            }
            > .ant-btn {
                font-size: 12px;
                transition: opacity 0.3s ease;
                visibility: hidden;
                opacity: 0;
            }
            &:hover > .ant-btn {
                visibility: visible;
                opacity: 1;
            }
        }
        .option {
            display: flex;
            margin-bottom: 20px;
            > p {
                padding-left: 64px;
                height: 32px;
                line-height: 32px;
                margin-top: 8px;
            }
            .option-list {
                display: flex;
                flex-wrap: wrap;
                width: calc(~'100% - 64px - 4em');
            }
            .option-item {
                position: relative;
                margin-top: 8px;
                .ant-input {
                    width: 90px;
                    margin-right: 14px;
                    text-align: center;
                    border: 1px solid #E5E8EB;
                    box-shadow: 0 0 0 0;
                }
                .close {
                    position: absolute;
                    color: #C2C2C2;
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    line-height: 18px;
                    font-size: 18px;
                    top: -8px;
                    right: 6px;
                    visibility: hidden;
                    opacity: 0;
                }
                &:hover .close {
                    visibility: visible;
                    opacity: 1;
                }
            }
            .ant-btn {
                margin-top: 8px;
            }
        }
    }
    .spec-add {
        border-radius: 2px;
        background: #FFFFFF;
        font-size: 12px;
    }
    .specific-table {
        th {
            background-color: #fff;
        }
        .ant-input-number,
        .ant-select:not(.ant-input-number + .ant-select) {
            width: 120px;
        }
        .code {
            width: 150px;
        }
        .ant-table-container .ant-table-content  {
            &::-webkit-scrollbar {
                width: 2px;
                height: 6px;
                &-thumb {
                    border-radius: 6px;
                    background-color: rgba(0, 110, 249, 0.2);
                    &:hover {
                        background: rgba(0, 110, 249, 0.5);
                    }
                }
                &-track {
                    /*滚动条内部轨道*/
                    background: #F8FAFC;
                }
            }
        }
    }
    .batch-set {
        width: 100%;
        margin: 20px 0;
        > .ant-btn {
            height: 20px;
            line-height: 20px;
            padding: 0;
            + .ant-btn {
                margin-left: 16px;
            }
        }
    }
}
.specific-option-edit-popover, .batch-set-edit-popover {
    margin: 0 -4px;
    display: flex;
    .flex(flex-start,flex-end);
    .ant-input, .ant-input-number {
        width: 134px;
        margin-bottom: 8px;
    }
    .content-length {
        font-size: 10px;
        line-height: 14px;
        color: #8090A6;
    }
    .btns {
        margin-top: 16px;
        .fcc();
        .ant-btn {
            width: 48px;
            height: 25px;
            font-size: 12px;
            border-radius: 2px;
            padding: 0;
            line-height: 25px;
        }
    }
}
</style>
