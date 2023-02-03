<template>
    <div id="WarehouseEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('inv.edit') : $t('inv.add') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('inv.inventory_name') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.type') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.type">
                            <a-radio :value="inventoryType.MATERIAL">{{ $t('inv.material') }}</a-radio>
                            <a-radio :value="inventoryType.FINISHED">{{ $t('inv.finished') }}</a-radio>
                            <a-radio :value="inventoryType.ADVERTISING">{{ $t('inv.advertising') }}</a-radio>
                            <a-radio :value="inventoryType.PERIPHERAL">{{ $t('inv.peripheral') }}</a-radio>
                            <a-radio :value="inventoryType.EXPENSE">{{ $t('inv.expense') }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.spec_no') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.spec" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.inventory_code') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.uid" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.admin') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.admin_name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.production_consumption') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.flag_production_use">
                            <a-radio :value="is_production_consumption.YES">{{ $t('inv.yes') }}</a-radio>
                            <a-radio :value="is_production_consumption.NO">{{ $t('inv.no') }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.outsourcing') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.flag_outsourcing">
                            <a-radio :value="is_outsourcing.YES">{{ $t('inv.yes') }}</a-radio>
                            <a-radio :value="is_outsourcing.NO">{{ $t('inv.no') }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.tax_rate') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.tax" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.cost') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.cost" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.abc_type') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.abc_type" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.batch') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.flag_batch">
                            <a-radio :value="is_batch.YES">{{ $t('inv.yes') }}</a-radio>
                            <a-radio :value="is_batch.NO">{{ $t('inv.no') }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.start_date') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.start_date" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.create_user') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.user" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.unit_group') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.uom_group" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.primary_unit') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.uom_primary" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.feature_matching') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.flag_extra_feature">
                            <a-radio :value="feature.YES">{{ $t('inv.yes') }}</a-radio>
                            <a-radio :value="feature.NO">{{ $t('inv.no') }}</a-radio>
                        </a-radio-group>
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
import ChinaAddressCascader from '../../components/common/ChinaAddressCascader.vue'
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
            inventoryType: Core.Const.INVENTORY.TYPE,
            is_production_consumption: Core.Const.INVENTORY.IS_PRODUCTION_CONSUMPTION,
            is_outsourcing: Core.Const.INVENTORY.IS_OUTSOURCING,
            is_batch: Core.Const.INVENTORY.IS_BATCH,
            feature: Core.Const.INVENTORY.FEATURE,
            form: {
                id: '',
                name: '',
                type: '',
                flag_production_use: undefined,
                flag_outsourcing: undefined,
                tax: undefined,
                cost: undefined,
                abc_type: undefined,
                flag_batch: undefined,
                start_date: undefined,
                flag_extra_feature:undefined
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
            }
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
            Core.Api.Warehouse.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getWarehouseDetail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
                // this.area = [ this.form.province, this.form.city, this.form.county]
                this.area.country = this.form.country
                this.area.country_en = this.form.country
                this.area.city = this.form.city
                this.area.city_en = this.form.city
                this.area.province = this.form.province
                this.area.province_en = this.form.province
                this.area.county = this.form.county
                console.log('defAddr err', this.defAddr)
            }).catch(err => {
                console.log('getWarehouseDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('form', form)
            let area = Core.Util.deepCopy(this.area)
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.type) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.contact_name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.contact_phone) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.address) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.location_uid_regex) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!Core.Util.isEmptyObj(this.areaMap)) {
                console.log('areaMap2222', this.areaMap)
                form.country = this.areaMap.country.name
                form.country_en = this.areaMap.country.name_en
                form.city = this.areaMap.city.name
                form.city_en = this.areaMap.city.name_en
                if (this.areaMap.province) {
                    form.province = this.areaMap.province.name
                    form.province_en = this.areaMap.province.name_en
                } else {
                    form.province = ""
                    form.province_en = ""

                }
                if (this.areaMap.county) {
                    form.county = this.areaMap.county.name
                    form.county_en = this.areaMap.county.county_en
                } else {
                    form.county = ""
                    form.county_en = ""
                }
            }
            if (!this.$auth('ADMIN') && !(Object.values(area).filter(i => i).length)) {
                return this.$message.warning(this.$t('def.enter'))
            }
            console.log('area12333333', area)
            Core.Api.Warehouse.save({
                ...form,
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
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
// #Warehouse Edit {}
</style>
