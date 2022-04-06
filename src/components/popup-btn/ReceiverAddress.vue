<template>
    <a-button class="ReceiverAddress" @click.stop="handleAddressShow()" :ghost='ghost' :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal :title="btnText" v-model:visible="addressShow" :after-close='handleAddressClose' class="transfer-modal">
        <div class="modal-content">
            <div class="form-item required">
                <div class="key">姓名:</div>
                <div class="value">
                    <a-input v-model:value="form.name" placeholder="请输入收货人姓名"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">手机号:</div>
                <div class="value">
                    <a-input v-model:value="form.phone" placeholder="请输入收货人联系电话"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">国家:</div>
                <div class="value">
                    <AreaCascader v-model:value="areaList" :def-area='defArea'/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">收货地址:</div>
                <div class="value">
                    <AddressCascader @select='handleAddressSelect' :default-address='defAddr'/>
                </div>
            </div>
            <div class="form-item">
                <div class="key"></div>
                <div class="value">
                    <a-input v-model:value="form.address" placeholder="请输入详细收货地址"/>
                </div>
            </div>
        </div>
        <template #footer>
            <a-button @click="handleAddressClose">取消</a-button>
            <a-button @click="handleConfirm" type="primary">确定</a-button>
        </template>
    </a-modal>
</template>

<script>
import Core from '@/core';

import AreaCascader from '../../components/common/AreaCascader.vue'
import AddressCascader from '../../components/common/AddressCascader.vue'

export default {
    components: {AddressCascader, AreaCascader},
    emits: ['submit'],
    props: {
        btnText: {
            type: String,
            default: '新增收货地址'
        },
        btnType: {
            type: String,
            default: 'primary'
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
            default: 0
        },
        orgType: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            loading: false,
            addressShow: false,
            form: {
                id: '',
                name: '',
                phone: '',
                city: '',
                county: '',
                province: '',
                address: '',
            },
            areaList: [],
            defArea: [],
            defAddr: [],
            area: {
                continent: '',
                country: '',
                country_en: '',
                country_code: '',
            }
        }
    },
    watch: {},
    computed: {},
    created() {
    },
    mounted() {
        if (this.detail) {
            this.form.id = this.detail.id,
            this.form.name = this.detail.name,
            this.form.phone = this.detail.phone,
            this.form.address = this.detail.address,
            this.form.province = this.detail.province,
            this.form.city = this.detail.city,
            this.form.county = this.detail.county,
            this.defAddr = [this.detail.province, this.detail.city, this.detail.county]
        }
    },
    methods: {
        handleAddressSelect(address = []) {
            this.form.province = address[0]
            this.form.city = address[1]
            this.form.county = address[2]
        },
        handleAddressShow() {
            if (this.detail) {
                console.log('handleAddressShow detail', this.detail)
            }
            this.addressShow = true
        },
        handleAddressClose() {
            this.addressShow = false
            Object.assign(this.form, this.$options.data().form)
            Object.assign(this.area, this.$options.data().area)
            this.areaList = []
            this.defArea = []
            this.defAddr = []

        },
        handleConfirm() {
            let form = Core.Util.deepCopy(this.form)
            let area = Core.Util.deepCopy(this.area)
            if (this.areaList.length) {
                console.log('this.areaList:', this.areaList)
                area = {
                    continent: this.areaList[0].name,
                    country: this.areaList[1].name,
                    country_en: this.areaList[1].name_en,
                    country_code: this.areaList[1].code,
                }
            }
            Core.Api.ReceiveAddress.save({
                ...form,
                orgId: this.orgId,
                orgType: this.orgType,
                ...area
            }).then(res => {
                console.log('handleAuditSubmit res', res)
                this.handleAddressClose()
                this.$parent.getTableData()
            }).catch(err => {
                console.log('handleAuditSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    },
}
</script>

<style lang='less' scoped>
.ReceiverAddress {
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
