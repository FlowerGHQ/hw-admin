<template>
    <div id="WarehouseEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? '编辑仓库' : '新建仓库' }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">仓库名称：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入仓库名称"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">仓库类型：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.type">
                            <a-radio :value="typeList.TYPE_QUALITY">正品仓</a-radio>
                            <a-radio :value="typeList.TYPE_DEFECTIVE">残次仓</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">仓库地址：</div>
                    <div class="value">
                        <AddressCascader @change='handleAddressSelect' :default-address='[form.province, form.city, form.county]'/>
                    </div>
                </div>
                <div class="form-item ">
                    <div class="key"></div>
                    <div class="value">
                        <a-input v-model:value="form.address" placeholder="请输入详细地址"/>
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

export default {
    name: 'InvoiceEdit',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {},
            typeList: Core.Const.STOCK_RECORD.PRODUCT_TYPE,

            form: {
                id: '',
                name: '',
                province: '',
                city: '',
                county: '',
                address: '',
                type: '',
            },
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getWarehouseDetail();
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
        getWarehouseDetail() {
            this.loading = true;
            Core.Api.Invoice.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getInvoiceDetail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
            }).catch(err => {
                console.log('getInvoiceDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.name) {
                return this.$message.warning('请输入仓库名称')
            }
            if (!form.address) {
                return this.$message.warning('请输入仓库地址')
            }
            Core.Api.Invoice.save(form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },

        handleAddressSelect(address = []) {
            this.form.province = address[0]
            this.form.city = address[1]
            this.form.county = address[2]
        },
    }
};
</script>

<style scoped>

</style>