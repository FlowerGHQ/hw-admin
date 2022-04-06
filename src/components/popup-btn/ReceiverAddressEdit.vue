<template>
<a-button class="ReceiverAddressEdit" @click.stop="handleAddressShow()" :ghost='ghost' :type="btnType" :class="btnClass">
    <slot>{{ btnText }}</slot>
</a-button>
<a-modal :title="btnText" v-model:visible="modalShow" :after-close='handleAddressClose' class="receiver-address-edit-modal">
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
            <div class="key">收货地址:</div>
            <div class="value">
                <AddressCascader v-model:value="areaMap" :def-area='area'/>
            </div>
        </div>
        <div class="form-item">
            <div class="key"></div>
            <div class="value">
                <a-input v-model:value="form.address" placeholder="请输入详细地址"/>
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

import CountryCascader from '../common/CountryCascader.vue'
import AddressCascader from '../common/ChinaAddressCascader.vue'

export default {
    components: {AddressCascader, CountryCascader},
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
                province: '',
                city: '',
                county: '',
            }
        }
    },
    watch: {},
    computed: {},
    created() {
    },
    mounted() {
    },
    methods: {
        handleAddressShow() {
            if (this.detail) {
                for (const key in this.form) {
                    this.form[key] = this.detail[key]
                }
                for (const key in this.area) {
                    this.area[key] = this.detail[key]
                }
            }
            this.modalShow = true
        },
        handleAddressClose() {
            this.modalShow = false
            this.form = Core.Util.deepCopy(this.$options.data().form)
            this.area = Core.Util.deepCopy(this.$options.data().area)
            this.areaMap = {}
        },
        handleConfirm() {
            let form = Core.Util.deepCopy(this.form)
            let area = Core.Util.deepCopy(this.area)
            if (!form.name) {
                return this.$message.warning('请输入收货人姓名')
            }
            if (!form.phone) {
                return this.$message.warning('请输入收货人联系电话')
            }
            if (!Core.Util.isEmptyObj(this.areaMap)) {
                area = {}
                for (const key in this.areaMap) {
                    area[key] = this.areaMap[key].name
                }
            }
            if (!(Object.values(area).filter(i => i).length)) {
                return this.$message.warning('请选择大致区域')
            }
            if (!form.address) {
                return this.$message.warning('请完善收货地址')
            }
            Core.Api.ReceiveAddress.save({
                ...form,
                org_id: this.orgId,
                org_type: this.orgType,
                ...area
            }).then(res => {
                console.log('handleAuditSubmit res', res)
                this.handleAddressClose()
                this.$emit('submit')
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
