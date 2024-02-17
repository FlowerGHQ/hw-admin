<template>
    <div id="WarehouseEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('wa.edit') : $t('wa.add') }}</div>
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
                    <div class="key">{{ $t('n.type') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.type">
                            <!--                            <a-radio class="type-item" v-for="(val, key) in warehouseType" :key="key" :value="key">{{ val }}
                            </a-radio>-->
                            <a-radio-group v-model:value="form.type">
                                <a-radio :value="warehouseType.QUALITY">{{ $t('wa.good') }}</a-radio>
                                <a-radio :value="warehouseType.DEFECTIVE">{{ $t('wa.imperfect') }}</a-radio>
                                <a-radio :value="warehouseType.MATERIAL" v-if="$auth('ADMIN')">{{
                                    $t('wa.material_warehouse')
                                }}</a-radio>
                                <a-radio :value="warehouseType.CUSTOMIZE" v-if="$auth('ADMIN')">{{
                                    $t('wa.customize_warehouse')
                                }}</a-radio>
                            </a-radio-group>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.contact') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.phone') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_phone" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('wa.location_uid_regex') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.location_uid_regex" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('wa.address') }}：</div>
                    <div class="value">
                        <!--                        <ChinaAddressCascader @select='handleAddressSelect' :default-address='defAddr' v-if="$auth('ADMIN')"/>-->
                        <AddressCascader v-model:value="areaMap" :def-area="area" :default-address="defAddr" />
                        <!--                        <ReceiverAddressEdit btnType="link" :detail='item' :orgId='orgId' :orgType='orgType' btnClass='edit-btn' @click.stop @submit='getReceiveList'>{{ $t('def.edit') }}</ReceiverAddressEdit>-->
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
            <a-button @click="handleSubmit" type="primary" v-if="$auth('warehouse.save')">{{
                $t('def.sure')
            }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import ChinaAddressCascader from '../../components/common/ChinaAddressCascader.vue';
import AddressCascader from '@/components/common/AddressCascader.vue';

export default {
    name: 'WarehouseEdit',
    components: { ChinaAddressCascader, AddressCascader },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {},
            // warehouseType: Core.Const.WAREHOUSE.TYPE_MAP,
            warehouseType: Core.Const.WAREHOUSE.TYPE,

            form: {
                id: '',
                name: '',
                address: '',
                type: '',
                contact_phone: '',
                contact_name: '',
                location_uid_regex: '[a-zA-Z]{0,6}\\d+-\\d+-\\d+-\\d+-\\d+-[0-9]+(\\.[0-9]{1,3})?$',
                country: '',
                country_en: '',
                province: '',
                province_en: '',
                city: '',
                city_en: '',
                county: '',
                county_en: '',
            },
            defAddr: [],
            areaMap: {},
            area: {
                country: '',
                country_en: '',
                province: '',
                province_en: '',
                city: '',
                city_en: '',
                county: '',
            },
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getWarehouseDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        getWarehouseDetail() {
            this.loading = true;
            Core.Api.Warehouse.detail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getWarehouseDetail res', res);
                    this.detail = res.detail;
                    for (const key in this.form) {
                        this.form[key] = res.detail[key];
                    }
                    // this.area = [ this.form.province, this.form.city, this.form.county]
                    this.area.country = this.form.country;
                    this.area.country_en = this.form.country;
                    this.area.city = this.form.city;
                    this.area.city_en = this.form.city;
                    this.area.province = this.form.province;
                    this.area.province_en = this.form.province;
                    this.area.county = this.form.county;
                    console.log('defAddr err', this.defAddr);
                })
                .catch(err => {
                    console.log('getWarehouseDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            console.log('form', form);
            let area = Core.Util.deepCopy(this.area);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.type) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.contact_name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.contact_phone) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.address) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.location_uid_regex) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!Core.Util.isEmptyObj(this.areaMap)) {
                console.log('areaMap2222', this.areaMap);
                form.country = this.areaMap.country.name;
                form.country_en = this.areaMap.country.name_en;
                form.city = this.areaMap.city.name;
                form.city_en = this.areaMap.city.name_en;
                if (this.areaMap.province) {
                    form.province = this.areaMap.province.name;
                    form.province_en = this.areaMap.province.name_en;
                } else {
                    form.province = '';
                    form.province_en = '';
                }
                if (this.areaMap.county) {
                    form.county = this.areaMap.county.name;
                    form.county_en = this.areaMap.county.county_en;
                } else {
                    form.county = '';
                    form.county_en = '';
                }
            }
            if (!this.$auth('ADMIN') && !Object.values(area).filter(i => i).length) {
                return this.$message.warning(this.$t('def.enter'));
            }
            console.log('area12333333', area);
            Core.Api.Warehouse.save({
                ...form,
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
    },
};
</script>

<style lang="less" scoped>
// #Warehouse Edit {}
</style>
