<template>
    <div id="AccountEdit" class="edit-container" ref="bigBox">
        <a-spin :spinning="loading" class="loading-incontent" v-if="loading"></a-spin>
        <div class="title-container">
            <div class="title-area">
                {{ form.id ? $t(/*编辑收款账号*/'payment-management.edit_account') : $t(/*新增收款账号*/'payment-management.new_account') }}
            </div>
        </div>
        <div class="form-block">
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">
                        {{ $t(/*地区*/'payment-management.region') }}
                    </div>
                    <div class="value">
                        <MyCountryCascader
                            ref="countryCascaderRef"
                            v-model:value="areaList"
                            :defaultAreaList="defaultAreaList"
                            @handleGetItem="handleGetItem"
                        />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">
                        {{ $t(/*账户信息*/'payment-management.acc_info') }}
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="form.name"
                            :placeholder="$t('def.input')"
                            :maxlength="150"
                        />
                    </div>
                </div>
            </div>
            <div class="form-head">
                {{ $t(/*美元付款路径*/'payment-management.dollar_pay_path') }}
            </div>
            <div class="form-content">
                <div class="form-item">
                    <div class="key">
                        BENEFICIARY BANK
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="usdForm.beneficiary_bank"
                            :placeholder="$t('def.input')"
                            :maxlength="150"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        SWIFT CODE
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="usdForm.swift_code"
                            :placeholder="$t('def.input')"
                            :maxlength="150"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        BANK ADDRESS
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="usdForm.bank_address"
                            :placeholder="$t('def.input')"
                            :maxlength="150"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        ACCOUNT NUMBER
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="usdForm.account_number"
                            :placeholder="$t('def.input')"
                            :maxlength="150"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        COMPANY NAME
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="usdForm.company_name"
                            :placeholder="$t('def.input')"
                            :maxlength="150"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        COMAPANY ADDRESS
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="usdForm.company_address"
                            :placeholder="$t('def.input')"
                            :maxlength="150"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        {{ $t(/*其他汇款信息*/'payment-management.other_remittance_info') }}
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="usdForm.remark"
                            :placeholder="$t('def.input')"
                            :maxlength="500"
                        />
                    </div>
                </div>
            </div>
            <div class="form-head">
                {{ $t(/*欧元付款路径*/'payment-management.euro_pay_path') }}
            </div>
            <div class="form-content">
                <div class="form-item">
                    <div class="key">
                        BENEFICIARY BANK
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="eurForm.beneficiary_bank"
                            :placeholder="$t('def.input')"
                            :maxlength="150"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        SWIFT CODE
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="eurForm.swift_code"
                            :placeholder="$t('def.input')"
                            :maxlength="150"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        BANK ADDRESS
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="eurForm.bank_address"
                            :placeholder="$t('def.input')"
                            :maxlength="150"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        ACCOUNT NUMBER
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="eurForm.account_number"
                            :placeholder="$t('def.input')"
                            :maxlength="150"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        COMPANY NAME
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="eurForm.company_name"
                            :placeholder="$t('def.input')"
                            :maxlength="150"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        COMAPANY ADDRESS
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="eurForm.company_address"
                            :placeholder="$t('def.input')"
                            :maxlength="150"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        {{ $t(/*其他汇款信息*/'payment-management.other_remittance_info') }}
                    </div>
                    <div class="value">
                        <a-input
                            v-model:value="eurForm.remark"
                            :placeholder="$t('def.input')"
                            :maxlength="500"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns fixed-btns" ref="fixBox" :style="{ width: fixedWidth }">
            <a-button @click="preview">{{ $t(/*预览*/'payment-management.preview') }}</a-button>
            <a-button @click="routerChange('back')">{{ $t(/*取消*/'def.cancel') }}</a-button>
            <a-button type="primary" @click="submit">{{ $t(/*确定*/'def.sure') }}</a-button>
            <div class="bottom-box"></div>
        </div>
        <div :style="{ height: fixedHeight }"></div>
    </div>
</template>

<script>
import Core from '../../core';
import MyCountryCascader from '@/components/MyCountryCascader/index.vue';
export default {
    name: 'AccountEdit',
    components: {
        MyCountryCascader
    },
    props: {},
    data() {
        return {
            Core,
            loading: false,
            detail: {},
            form: {
                id: '',
                name: undefined, // 账号信息
                country_list: [], // 国家列表
                bank_list: [], // 付款路径
            },
            usdForm: {
                id: 0,
                currency: 'USD', // 货币类型
                beneficiary_bank: "", // 收款行
                swift_code: "", // 银行代码
                bank_address: "", // 银行地址
                account_number: "", // 账号
                company_name: "", // 公司名称
                company_address: "", // 公司地址
                remark: "" // 其他付款方式
            },
            eurForm: {
                id: 0,
                currency: 'EUR', // 货币类型
                beneficiary_bank: "", // 收款行
                swift_code: "", // 银行代码
                bank_address: "", // 银行地址
                account_number: "", // 账号
                company_name: "", // 公司名称
                company_address: "", // 公司地址
                remark: "" // 其他付款方式
            },
            areaList: [],
            defaultAreaList: [],
            fixedWidth: 'auto',
            fixedHeight: 'auto',
            area: {
                continent: '',
                continent_en: '',
                country: '',
                country_en: '',
                country_code: '',
            },
            disableList: [],
            countryCascaderRef: null,
        };
    },
    watch: {},
    computed: {},
    created() {
        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getDetailService();
        }
        this.getCountryListService();
    },
    mounted() {
        window.addEventListener('resize', this.handleResize);
        this.$nextTick(() => {
            this.handleResize();
        });
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize);
    },
    beforeRouteLeave(to, from, next) {
        window.removeEventListener('resize', this.handleResize);
        next();
    },
    methods: {
        // fetch
        getDetailService() {
            this.loading = true;
            Core.Api.PayAccount.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getDetailService res', res);
                let detail = res.detail
                this.form = detail
                if(detail.bank_list.find(item => item.currency === 'USD')) {
                    this.usdForm = detail.bank_list.find(item => item.currency === 'USD')
                }
                if(detail.bank_list.find(item => item.currency === 'EUR')) {
                    this.eurForm = detail.bank_list.find(item => item.currency === 'EUR')
                }
                this.areaList = this.reverseConvertAreaData(detail.country_list);
                this.defaultAreaList = this.reverseConvertAreaData(detail.country_list);
            }).catch(err => {
                console.log('getDetailService err', err);
            }).finally(() => {
                this.loading = false;
            });
        },
        // fetch
        handleSubmitService(params) {
            this.loading = true
            Core.Api.PayAccount.save({
                ...params
            }).then((res) => {
                console.log('handleSubmitService res', res);
                this.$message.success(this.$t('pop_up.save_success'));
                this.routerChange('back');
            }).catch(err => {
                console.log('handleSubmitService err:', err);
            }).finally(() => {
                this.loading = false
            });
        },
        getCountryListService() {
            Core.Api.PayAccount.countryList({
                status: 0   
            }).then(res => {
                console.log('getCountryListService res', res);
                if(res.list.length) {
                    this.disableList = this.reverseConvertAreaData(res.list)
                }
                this.$refs.countryCascaderRef.checkDisableList(this.disableList)
            }).catch(err => {
                console.log('getCountryListService err', err);
            })
        },
        // resize
        handleResize() {
            const width = this.$refs.bigBox && this.$refs.bigBox.offsetWidth;
            const height = this.$refs.fixBox && this.$refs.fixBox.offsetHeight;
            this.fixedWidth = width + 'px';
            this.fixedHeight = height + 'px';
        },
        routerChange(type, item) {
            let routeUrl;
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        checkFormInput(form) {
            if (!form.name) {
                return this.$message.warning(`${this.$t('def.enter')}(${this.$t(/*账户信息*/'payment-management.acc_info')})`);
            }
            if (!this.area.country) {
                return this.$message.warning(this.$t('def.select') + this.$t('n.area'));
            }
            return 0;
        },
        handleFormData() {
            this.form.bank_list.push(this.usdForm)
            this.form.bank_list.push(this.eurForm)
            let form = Core.Util.deepCopy(this.form);
            if(this.checkFormInput(form)) return
            console.log('form', this.form);
        },
        submit() {
            this.handleFormData();
            this.handleSubmitService(this.form)
        },
        preview() {
            this.handleFormData();
            let routeUrl = '';
            routeUrl = this.$router.resolve({
                path: '/payment-info-management/pending-payment',
                query: { form: this.form },
            });
            window.open(routeUrl.href, '_blank');
        },
        handleGetItem(item) {
            this.area = {
                continent: item.map(obj => obj.parentName).join(','),
                continent_en: item.map(obj => obj.parentEnName).join(','),
                country: item.map(obj => obj.name).join(','),
                country_en: item.map(obj => obj.name_en).join(','),
                country_code: item.map(obj => obj.code).join(','),
            };
            let _area = Core.Util.deepCopy(this.area)
            this.form.country_list = this.convertAreaData(_area)
        },
        convertAreaData(area) {
            const countryList = [];
            const countryNames = area.country.split(',');
            const countryCodes = area.country_code.split(',');
            const countryNamesEn = area.country_en.split(',');
            for (let i = 0; i < countryNames.length; i++) {
                const country = {
                    name: countryNames[i].trim(),
                    name_en: countryNamesEn[i].trim(),
                    code: countryCodes[i].trim()
                };
                countryList.push(country);
            }
            return countryList;
        },
        reverseConvertAreaData(countryList) {
            const area = countryList.map(country => country.name);
            return area;
        }
    },
};
</script>

<style lang="less" scoped>
#AccountEdit {
    width: 100%;
    .form-head {
        font-size: 16px;
        color: #1D2129;
        font-weight: 500;
        margin-top: 4px;
        margin-bottom: 10px;
    }
    .form-block {
        display: block;
        padding: 20px;
        box-sizing: border-box;
        .form-content {
            .form-item {
                .key {
                    min-width: 140px;
                    text-align: right;
                    margin-right: 8px;
                    font-size: 14px;
                }
                .value input {
                    display: flex;
                    flex: 1;
                    font-size: 14px;
                }
            }
        }
    }
    .form-content {
        width: 100%;
    }
}

.fixed-btns {
    position: fixed;
    bottom: 16px;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    padding: 20px 0px;
    display: flex;
    justify-content: center;
    z-index: 52;

    .ant-btn {
        width: auto;
        height: 32px;
        border-radius: 4px;
    }
    .bottom-box {
        background-color: #f0f2f5;
        width: 100%;
        height: 16px;
        position: absolute;
        bottom: -16px;
    }
}
</style>
