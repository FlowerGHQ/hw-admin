<template>
    <div id="SupplierEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? '编辑供应商' : '新建供应商' }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">供应商名称：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入供应商名称"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">供应商简称：</div>
                    <div class="value">
                        <a-input v-model:value="form.short_name" placeholder="请输入供应商简称"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">供应商类型：</div>
                    <div class="value">
                        <a-select v-model:value="form.type" placeholder="请选择供应商类型">
                            <a-select-option  v-for="(val,key) in SUPPLIER_TYPE" :key="key" :value="key">{{ val }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">供应商代码：</div>
                    <div class="value">
                        <a-input v-model:value="form.uid" placeholder="请输入供应商代码"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">物料分类:</div>
                    <div class="value">
                        <CategoryTreeSelect @change="handleCategorySelect" :category='item_category' :category-id='form.category_id' placeholder="请选择物料分类" type="material"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">联系人：</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_name" placeholder="请输入联系人名称"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">联系人电话：</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_phone" placeholder="请输入联系人电话"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">联系人邮箱：</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_email" placeholder="请输入联系人邮箱"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">信用代码：</div>
                    <div class="value">
                        <a-input v-model:value="form.credit_code" placeholder="请输入供应商信用代码"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">开户行账号：</div>
                    <div class="value">
                        <a-input v-model:value="form.bank_card_no" placeholder="请输入开户行账号"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">开户银行：</div>
                    <div class="value">
                        <a-input v-model:value="form.deposit_bank" placeholder="请输入开户银行"/>
                    </div>
                </div>
<!--                <div class="form-item required">
                    <div class="key">开户行支行：</div>
                    <div class="value">
                        <a-input v-model:value="form.account_bank" placeholder="请输入开户行支行"/>
                    </div>
                </div>-->
                <div class="form-item required">
                    <div class="key">付款期限：</div>
                    <div class="value">
                        <a-select v-model:value="form.payment_term" placeholder="请选择付款期限">
                            <a-select-option  v-for="(val,key) in PAYMENT_TYPE" :key="key" :value="key">{{ val }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">到货周期：</div>
                    <div class="value form-item-value">
                        <a-input-number v-model:value="form.arrival_period" :min="0" :precision="0"/>
                        <sapn>天</sapn>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">供应商地址：</div>
                    <div class="value">
                        <ChinaAddressCascader @select='handleAddressSelect' :default-address='defAddr'/>
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
import CategoryTreeSelect from '../../components/popup-btn/CategoryTreeSelect.vue'
import ChinaAddressCascader from '../../components/common/ChinaAddressCascader.vue'

const SUPPLIER_TYPE = Core.Const.SUPPLIER.SUPPLIER_TYPE_MAP
export default {
    name: 'SupplierEdit',
    components: { AddressCascader, CategoryTreeSelect },
    components: { ChinaAddressCascader },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            SUPPLIER_TYPE,
            detail: {},
            PAYMENT_TYPE: Core.Const.SUPPLIER.PAYMENT_TYPE_MAP,
            form: {
                id: '',
                type: undefined,
                uid: '',
                name: '',
                short_name: '',
                category_id: '',
                province: '',
                city: '',
                county: '',
                address: '',
                contact_name: '',
                contact_phone: '',
                contact_email: '',
                payment_term: undefined,
                credit_code: '',
                account_bank: '',
                deposit_bank: '',
                bank_card_no: '',
                // buyer_id: '',
                arrival_period: '',
            },
            defAddr: []
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getSupplierDetail();
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
        getSupplierDetail() {
            this.loading = true;
            Core.Api.Supplier.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getSupplierDetail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
                this.defAddr = [this.detail.province, this.detail.city, this.detail.county]
            }).catch(err => {
                console.log('getSupplierDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleAddressSelect(address = []) {
            this.form.province = address[0]
            this.form.city = address[1]
            this.form.county = address[2]
        },
        handleCategorySelect(val, node) {
            this.form.category_id = val
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.name) {
                return this.$message.warning('请输入供应商名称')
            }
            if (!form.short_name) {
                return this.$message.warning('请输入供应商简称')
            }
            if (!form.type) {
                return this.$message.warning('请选择供应商类型')
            }
            if (!form.uid) {
                return this.$message.warning('请输入供应商代码')
            }
            if (!form.category_id) {
                return this.$message.warning('请选择物料分类')
            }
            if (!form.contact_name) {
                return this.$message.warning('请输入联系人名称')
            }
            if (!form.contact_phone) {
                return this.$message.warning('请输入联系人电话')
            }
            if (!form.credit_code) {
                return this.$message.warning('请输入供应商信用代码')
            }
            if (!form.bank_card_no) {
                return this.$message.warning('请输入开户行账号')
            }
            if (!form.deposit_bank) {
                return this.$message.warning('请输入开户银行')
            }
          /*  if (!form.account_bank) {
                return this.$message.warning('请输入开户行支行')
            }*/
            if (!form.payment_term) {
                return this.$message.warning('请选择付款期限')
            }
            if (!form.arrival_period) {
                return this.$message.warning('请输入到货周期')
            }
            if (!form.address) {
                return this.$message.warning('请输入供应商地址')
            }
            Core.Api.Supplier.save(form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
    }
};
</script>

<style lang="less" scoped>
</style>