<template>
    <div id="CustomerEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? '客户编辑' : '新建客户' }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">客户名称：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入客户名称"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">客户电话：</div>
                    <div class="value">
                        <a-input v-model:value="form.phone" placeholder="请输入客户电话"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">客户邮箱：</div>
                    <div class="value">
                        <a-input v-model:value="form.email" placeholder="请输入客户邮箱"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">客户地址：</div>
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
import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue'

export default {
    name: 'CustomerEdit',
    components: { ChinaAddressCascader },
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
                phone: '',
                email: '',
                province: '',
                city: '',
                county: '',
                address: '',
            },
            defAddr: [],
        };
    },
    watch: {},
    computed: {
    },
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getCustomerDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':    // 详情
                    let routeUrl = this.$router.resolve({
                        path: "/customer/customer-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getCustomerDetail() {
            this.loading = true;
            Core.Api.Customer.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getCustomerDetail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
                this.defAddr = [this.detail.province, this.detail.city, this.detail.county]
            }).catch(err => {
                console.log('getCustomerDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.name) {
                return this.$message.warning('请输入客户名称')
            }
            if (!form.phone) {
                return this.$message.warning('请输入客户电话')
            }
            if (!form.email) {
                return this.$message.warning('请输入客户邮箱')
            }
            if (!form.province || !form.city || !form.county || !form.address) {
                // return this.$message.warning('请完善客户地址')
            }
            Core.Api.Customer.save(form).then(() => {
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

<style lang="less" scoped>
// #DistributorEdit {}
</style>