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
                    <div class="key">客户地址:</div>
<!--                    <CountryCascader v-model:value="areaList" :def-area='defArea' @search="getCountry"/>-->
                    <div class="value">
                        <CountryCascader v-model:value="areaList" :def-area='defArea' @search="getCountry"/>
                    </div>
                </div>
                <div class="form-item" v-if="countryShow == true">
                    <div class="key"></div>
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
            <a-button @click="handleSubmit" type="primary" v-if="$auth('customer.save')">确定</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">取消</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue'
import CountryCascader from '@/components/common/CountryCascader.vue'

export default {
    name: 'CustomerEdit',
    components: { ChinaAddressCascader, CountryCascader},
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
            areaList: [],
            defArea: [],
            area: {
                continent: '',
                country: '',
                country_en: '',
                country_code: '',
            },
            countryShow: false,
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
                let d = res.detail
                this.detail = d
                for (const key in this.form) {
                    this.form[key] = d[key]
                }
                for (const key in this.area) {
                    this.area[key] = d[key]
                }
                this.defAddr = [d.province, d.city, d.county]
                this.defArea = [d.continent || '', d.country || '']
            }).catch(err => {
                console.log('getCustomerDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            let area = Core.Util.deepCopy(this.area)
            if (this.areaList.length) {
                area = {
                    continent: this.areaList[0].name,
                    country: this.areaList[1].name,
                    country_en: this.areaList[1].name_en,
                    country_code: this.areaList[1].code,
                }
            }
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
            Core.Api.Customer.save({
                ...form,
                ...area
            }).then(() => {
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
        getCountry(data) {
            console.log('getCountry data',data)
            if (data.country == '中国' || data.country == 'China') {
                this.countryShow = true
            } else {
                this.countryShow = false
            }
            console.log('data.country',data.country)
            console.log('countryShow',this.countryShow)

        },
    }
};
</script>

<style lang="less">
.CustomerEdit {

    .icon {
        font-size: 12px;
    }
}
</style>