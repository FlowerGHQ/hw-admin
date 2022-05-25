<template>
    <div id="WarehouseEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('wa.edit') :  $t('wa.add') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('n.name') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')"/>
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
                                <a-radio :value="warehouseType.MATERIAL" v-if="$auth('ADMIN')">物料仓</a-radio>
                                <a-radio :value="warehouseType.CUSTOMIZE" v-if="$auth('ADMIN')">广宣品仓</a-radio>
                            </a-radio-group>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.contact') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_name" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.phone') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_phone" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('wa.address') }}：</div>
                    <div class="value">
                        <ChinaAddressCascader @select='handleAddressSelect' :default-address='defAddr' v-if="$auth('ADMIN')"/>
                        <AddressCascader v-model:value="areaMap" :def-area='area' v-else/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key"></div>
                    <div class="value">
                        <a-input v-model:value="form.address" :placeholder="$t('def.input')"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('warehouse.save')">{{ $t('def.sure') }}</a-button>
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
            warehouseType: Core.Const.WAREHOUSE.TYPE,

            form: {
                id: '',
                name: '',
                province: '',
                city: '',
                county: '',
                address: '',
                type: '',
                contact_phone: '',
                contact_name: '',
            },
            defAddr: [],
            areaMap: {},
            area: {
                country: '',
                province: '',
                city: '',
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
                this.defAddr = [this.detail.province, this.detail.city, this.detail.county]
            }).catch(err => {
                console.log('getWarehouseDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('form',form)
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
            if (!this.$auth('ADMIN') && !Core.Util.isEmptyObj(this.areaMap)) {
                area = {}
                for (const key in this.areaMap) {
                    area[key] = this.areaMap[key].name
                }
            }
            if (!this.$auth('ADMIN') && !(Object.values(area).filter(i => i).length)) {
                return this.$message.warning(this.$t('def.enter'))
            }
            Core.Api.Warehouse.save({
                ...form,
                ...area
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