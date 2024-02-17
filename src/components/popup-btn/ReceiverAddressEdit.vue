<template>
    <a-button
        class="ReceiverAddressEdit"
        @click.stop="handleAddressShow()"
        :ghost="ghost"
        :type="btnType"
        :class="btnClass"
    >
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal
        :title="$t('ad.add')"
        v-model:visible="modalShow"
        :after-close="handleAddressClose"
        :maskClosable="false"
        class="receiver-address-edit-modal"
    >
        <div class="modal-content">
            <div class="form-item required">
                <div class="key">{{ $t('n.name') }}:</div>
                <div class="value">
                    <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('n.phone') }}:</div>
                <div class="value">
                    <a-input v-model:value="form.phone" :placeholder="$t('def.input')" />
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
        <template #footer>
            <a-button @click="handleAddressClose">{{ $t('def.cancel') }}</a-button>
            <a-button @click="handleConfirm" type="primary">{{ $t('def.sure') }}</a-button>
        </template>
    </a-modal>
</template>

<script>
import Core from '@/core';

import CountryCascader from '../common/CountryCascader.vue';
import AddressCascader from '../common/AddressCascader.vue';

export default {
    components: { AddressCascader, CountryCascader },
    emits: ['submit'],
    props: {
        btnText: {
            type: String,
            default: '新增收货地址',
        },
        btnType: {
            type: String,
            default: 'primary',
        },
        btnClass: {
            type: String,
        },
        ghost: {
            type: Boolean,
            default: true,
        },
        detail: {
            type: Object,
        },
        orgId: {
            type: Number,
            default: 0,
        },
        orgType: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            loading: false,
            modalShow: false,
            form: {
                id: '',
                name: '',
                phone: '',
                address: '',
            },

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
    created() {},
    mounted() {},
    methods: {
        handleAddressShow() {
            if (this.detail) {
                for (const key in this.form) {
                    this.form[key] = this.detail[key];
                }
                for (const key in this.area) {
                    this.area[key] = this.detail[key];
                }
            }
            this.modalShow = true;
        },
        handleAddressClose() {
            this.modalShow = false;
            this.form = Core.Util.deepCopy(this.$options.data().form);
            this.area = Core.Util.deepCopy(this.$options.data().area);
            this.areaMap = {};
        },
        handleConfirm() {
            let form = Core.Util.deepCopy(this.form);
            let area = Core.Util.deepCopy(this.area);

            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.phone) {
                return this.$message.warning(this.$t('def.enter'));
            }
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
                }
            }
            if (!Object.values(area).filter(i => i).length) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.address) {
                return this.$message.warning(this.$t('def.enter'));
            }
            Core.Api.ReceiveAddress.save({
                ...form,
                org_id: this.orgId,
                org_type: this.orgType,
                ...area,
            })
                .then(res => {
                    console.log('handleAuditSubmit res', res);
                    this.handleAddressClose();
                    this.$emit('submit');
                })
                .catch(err => {
                    console.log('handleAuditSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
.ReceiverAddressEdit {
    font-size: 12px;
    line-height: 20px;
    height: 30px;
    padding: 4px 14px;
    margin-bottom: 10px;

    .icon {
        font-size: 12px;
    }
}
</style>
