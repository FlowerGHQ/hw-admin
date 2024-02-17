<template>
    <div id="CustomerEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('c.edit') : $t('c.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('n.name') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.phone') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.phone" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.email') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.email" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('ad.addresses') }}:</div>
                    <div class="value">
                        <AddressCascader v-model:value="areaMap" :def-area="area" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key"></div>
                    <div class="value">
                        <a-input v-model:value="form.address" :placeholder="$t('def.input')" />
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('customer.save')">{{ $t('def.sure') }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue';
import CountryCascader from '@/components/common/CountryCascader.vue';
import AddressCascader from '@/components/common/AddressCascader.vue';

export default {
    name: 'CustomerEdit',
    components: { ChinaAddressCascader, CountryCascader, AddressCascader },
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
                address: '',
            },
            defAddr: [],
            areaList: [],
            defArea: [],
            area: {
                country: '',
                country_en: '',
                province: '',
                province_en: '',
                city: '',
                city_en: '',
                county: '',
                county_en: '',
            },
            areaMap: {},
            countryShow: false,
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getCustomerDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back': // 详情
                    let routeUrl = this.$router.resolve({
                        path: '/eos-customer/customer-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getCustomerDetail() {
            this.loading = true;
            Core.Api.Customer.detail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getCustomerDetail res', res);
                    let d = res.detail;
                    this.detail = d;
                    for (const key in this.form) {
                        this.form[key] = d[key];
                    }
                    for (const key in this.area) {
                        this.area[key] = d[key];
                    }
                    this.defAddr = [d.province, d.city, d.county];
                    this.defArea = [d.continent || '', d.country || ''];
                })
                .catch(err => {
                    console.log('getCustomerDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            let area = Core.Util.deepCopy(this.area);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.phone) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.email) {
                return this.$message.warning(this.$t('def.enter'));
            }
            /* if (!form.province || !form.city || !form.county || !form.address) {
                // return this.$message.warning('请完善客户地址')
            }*/
            console.log('area', this.area);
            if (!Core.Util.isEmptyObj(this.areaMap)) {
                console.log('areaMap2222', this.areaMap);
                area.country = this.areaMap.country.name;
                area.country_en = this.areaMap.country.name_en;
                area.city = this.areaMap.city.name;
                area.city_en = this.areaMap.city.name_en;
                if (this.areaMap.province) {
                    area.province = this.areaMap.province.name;
                    area.province_en = this.areaMap.province.name_en;
                }
                if (this.areaMap.county) {
                    area.county = this.areaMap.county.name;
                    area.county_en = this.areaMap.county.name_en;
                }
                console.log('area1234556', area);
            }
            if (!Object.values(area).filter(i => i).length) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.address) {
                return this.$message.warning(this.$t('def.enter'));
            }
            Core.Api.Customer.save({
                ...form,
                ...area,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },

        handleAddressSelect(address = []) {
            this.form.province = address[0];
            this.form.city = address[1];
            this.form.county = address[2];
        },
        getCountry(data) {
            console.log('getCountry data', data);
            if (data.country == '中国' || data.country == 'China') {
                this.countryShow = true;
            } else {
                this.countryShow = false;
            }
            console.log('data.country', data.country);
            console.log('countryShow', this.countryShow);
        },
    },
};
</script>

<style lang="less">
.CustomerEdit {
    .icon {
        font-size: 12px;
    }
}
</style>
