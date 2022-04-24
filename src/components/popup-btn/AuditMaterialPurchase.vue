<template>
    <a-button class="AuditMaterialPurchaseBtn" @click.stop="handleModalShow" :ghost='ghost' :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal :title="btnText" v-model:visible="modalShow" :after-close='handleModalClose'>
        <div class="modal-content">
            <div class="form-item required">
                <div class="form-item required">
                    <div class="key">审核来源:</div>
                    <a-radio-group v-model:value="form.type">
                        <a-radio :value="TYPE.STOREKEEPER">仓库管理员</a-radio>
                        <a-radio :value="TYPE.FINANCE">财务</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">审核结果:</div>
                <a-radio-group v-model:value="form.status">
                    <a-radio :value="AUDIT.AUDIT_PASS">通过</a-radio>
                    <a-radio :value="AUDIT.AUDIT_REFUSE">不通过</a-radio>
                </a-radio-group>
            </div>
            <div class="form-item textarea required" v-if="form.status === AUDIT.AUDIT_REFUSE">
                <div class="key">原因:</div>
                <div class="value">
                    <a-textarea v-model:value="form.audit_message" placeholder="请输入不通过原因"
                                :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                </div>
            </div>
            <div class="form-item textarea required" v-if="form.type === TYPE.FINANCE">
                <div class="key">审核时间:</div>
                <div class="value">
                    <a-date-picker v-model:value="form.audit_time" valueFormat='YYYY-MM-DD HH:mm:ss' :show-time="defaultTime" placeholder="请选择审核时间">
                        <template #suffixIcon><i class="icon i_calendar"/></template>
                    </a-date-picker>
                </div>
            </div>
        </div>
        <template #footer>
            <a-button @click="handleModalClose">取消</a-button>
            <a-button @click="handleConfirm" type="primary">确定</a-button>
        </template>
    </a-modal>
</template>

<script>
import Core from '@/core';
import dayjs from "dayjs";
const STOCK_RECORD = Core.Const.STOCK_RECORD
const AUDIT = STOCK_RECORD.STATUS
const TYPE = STOCK_RECORD.AUDIT_TYPE
export default {
    components: {
    },
    emits: ['submit'],
    props: {
        btnText: {
            type: String,
            default: '审核'
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
            default: false,
        },
        invoiceId: {
            type: Number,
        },
        sPass: {},
        sRefuse: {},
        apiList: {},
    },
    data() {
        return {
            loading: false,
            modalShow: false,
            STOCK_RECORD,
            TYPE,
            AUDIT,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            form: {
                status: '',
                audit_message: '',
                type: '',
                audit_time: '',
            },
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        handleModalShow() {
            console.log('handleModalShow:')
            this.modalShow = true
        },
        handleModalClose() {
            this.modalShow = false
            this.form = {
                status: '',
                audit_message: '',
                type: '',
                audit_time: '',
            }
        },
        handleConfirm() {
            Core.Api[this.apiList[0]][this.apiList[1]]({
                status: this.form.status,
                audit_message: this.form.audit_message,
                type: this.form.type,
                audit_time: dayjs(this.form.audit_time).unix(),
                id: this.invoiceId
            }).then(res => {
                console.log('handleAuditSubmit res', res)
                this.$message.success('审核成功')
                this.handleModalClose()
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
.AuditMaterialPurchaseBtn {
    &.ant-btn-link {
        line-height: 1;
        height: 1em;
    }
}
</style>
