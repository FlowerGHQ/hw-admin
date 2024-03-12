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
                            v-model:value="areaList"
                            :defaultList="defaultAreaList"
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
                            v-model:value="form.account_info"
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
                            v-model:value="form.name"
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
                            v-model:value="form.name_en"
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
                            v-model:value="form.name"
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
                            v-model:value="form.name_en"
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
                            v-model:value="form.name"
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
                            v-model:value="form.name_en"
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
                            v-model:value="form.name_en"
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
                            v-model:value="form.name"
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
                            v-model:value="form.name_en"
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
                            v-model:value="form.name"
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
                            v-model:value="form.name_en"
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
                            v-model:value="form.name"
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
                            v-model:value="form.name_en"
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
                            v-model:value="form.name_en"
                            :placeholder="$t('def.input')"
                            :maxlength="500"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns fixed-btns" ref="fixBox" :style="{ width: fixedWidth }">
            <a-button @click="handleSubmit('draft')">{{ $t(/*预览*/'payment-management.preview') }}</a-button>
            <a-button @click="routerChange('back')">{{ $t(/*取消*/'def.cancel') }}</a-button>
            <a-button type="primary" @click="handleSubmit">{{ $t(/*确定*/'def.sure') }}</a-button>
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
                name: '',
                account_info: undefined, // 账号信息
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
        };
    },
    watch: {},
    computed: {},
    created() {
        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getDetailService();
        }
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
        /* 监听 */
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
                case 'preview': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getDetailService() {
            this.loading = true;
            Core.Api.PayAccount.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getDetailService res', res);
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = this.detail[key];
                }
                for (const key in this.area) {
                    this.area[key] = this.detail[key];
                }
                this.areaList = this.detail.country.split(',');
                this.defaultAreaList = this.detail.country.split(',');
            }).catch(err => {
                console.log('getDetailService err', err);
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            this.loading = true
            let form = Core.Util.deepCopy(this.form);
            if(this.checkFormInput(form)) return
            Core.Api.PayAccount.save(form).then((res) => {
                console.log('handleSubmit res', res);
                this.$message.success(this.$t('pop_up.save_success'));
                this.routerChange('back');
            }).catch(err => {
                console.log('handleSubmit err:', err);
            }).finally(() => {
                this.loading = false
            });
        },
        checkFormInput(form) {
            if (!form.account_info) {
                return this.$message.warning(`${this.$t('def.enter')}(${this.$t(/*账户信息*/'payment-management.acc_info')})`);
            }
            if (!this.area.country) {
                return this.$message.warning(this.$t('def.select') + this.$t('n.area'));
            }
            return 0;
        },
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
                }
                .value.input-number {
                    display: flex;
                    flex: 1;
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
