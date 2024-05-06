<template>
    <span class="ReceiverAddressEdit" @click.stop="handleAddressShow()" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </span>
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
            <div class="form-item required">
                <div class="key">{{ $t('n.email') }}:</div>
                <div class="value">
                    <a-input v-model:value="form.email" :placeholder="$t('def.input')" />
                </div>
            </div>
        </div>
        <template #footer>
            <div class="btns">
                <MyButton padding="5px 28px" font="12px" @clickFn="handleAddressClose">
                    {{ $t('def.cancel') }}
                </MyButton>
                <MyButton type="primary" padding="6px 28px" font="12px" @clickFn="handleConfirm">
                    {{ $t('def.sure') }}
                </MyButton>
            </div>
        </template>
    </a-modal>
</template>

<script>
import Core from '@/core';

import CountryCascader from '../common/CountryCascader.vue';
import AddressCascader from '../common/AddressCascader.vue';
import MyButton from '../common/MyButton.vue';

export default {
    components: { AddressCascader, CountryCascader, MyButton },
    emits: ['submit'],
    props: {
        btnText: {
            type: String,
            default: '新增收货地址',
        },
        btnClass: {
            type: String,
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
                email: '',
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
            if (!form.email) {
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
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #8f00ff;
    cursor: pointer;
    .icon {
        font-size: 12px;
    }
}
.btns {
    .flex(flex-end, center, row);
    #my-button {
        &:nth-child(n + 2) {
            margin-left: 8px;
        }
    }
}
</style>
