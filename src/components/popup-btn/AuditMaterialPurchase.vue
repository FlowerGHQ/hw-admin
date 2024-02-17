<template>
    <a-button
        class="AuditMaterialPurchaseBtn"
        @click.stop="handleModalShow"
        :ghost="ghost"
        :type="btnType"
        :class="btnClass"
    >
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal :title="btnText" v-model:visible="modalShow" :after-close="handleModalClose">
        <div class="modal-content" v-if="status === STATUS.WAIT_AUDIT">
            <!--            <div class="form-item required">
                <div class="form-item required">
                    <div class="key">审核来源:</div>
                    <a-radio-group v-model:value="form.audit_type">
                        <a-radio :value="TYPE.STOREKEEPER">仓库管理员</a-radio>
                        <a-radio :value="TYPE.FINANCE">财务</a-radio>
                    </a-radio-group>
                </div>
            </div>-->
            <div class="form-item required">
                <div class="key">{{ $t('n.result') }}:</div>
                <a-radio-group v-model:value="form.status">
                    <a-radio :value="STATUS.AUDIT_PASS">{{ $t('n.pass') }}</a-radio>
                    <a-radio :value="STATUS.AUDIT_REFUSE">{{ $t('n.fail') }}</a-radio>
                </a-radio-group>
            </div>
            <div class="form-item textarea required" v-if="form.status === STATUS.AUDIT_REFUSE">
                <div class="key">{{ $t('n.reason') }}:</div>
                <div class="value">
                    <a-textarea
                        v-model:value="form.audit_message"
                        :placeholder="$t('r.fail_result')"
                        :auto-size="{ minRows: 2, maxRows: 6 }"
                        :maxlength="99"
                    />
                </div>
            </div>
        </div>
        <div class="modal-content" v-if="status === STATUS.FINANCE_PASS">
            <div class="form-item required">
                <div class="key">{{ $t('n.result') }}:</div>
                <a-radio-group v-model:value="form.status">
                    <a-radio :value="STATUS.FINANCE_PASS">{{ $t('n.pass') }}</a-radio>
                    <a-radio :value="STATUS.AUDIT_REFUSE">{{ $t('n.fail') }}</a-radio>
                </a-radio-group>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('in.finance_audit') }}:</div>
                <div class="value">
                    <a-date-picker
                        v-model:value="form.finance_audit_time"
                        valueFormat="YYYY-MM-DD HH:mm:ss"
                        :show-time="defaultTime"
                        :placeholder="$t('audit.choose_time')"
                    >
                        <template #suffixIcon><i class="icon i_calendar" /></template>
                    </a-date-picker>
                </div>
            </div>
            <div class="form-item textarea required" v-if="form.status === STATUS.AUDIT_REFUSE">
                <div class="key">{{ $t('n.reason') }}:</div>
                <div class="value">
                    <a-textarea
                        v-model:value="form.audit_message"
                        :placeholder="$t('r.fail_result')"
                        :auto-size="{ minRows: 2, maxRows: 6 }"
                        :maxlength="99"
                    />
                </div>
            </div>
        </div>
        <template #footer>
            <a-button @click="handleModalClose">{{ $t('def.cancel') }}</a-button>
            <a-button @click="handleConfirm" type="primary">{{ $t('def.sure') }}</a-button>
        </template>
    </a-modal>
</template>

<script>
import Core from '@/core';
import dayjs from 'dayjs';
const STOCK_RECORD = Core.Const.STOCK_RECORD;
const STATUS = STOCK_RECORD.STATUS;

const TYPE = STOCK_RECORD.AUDIT_TYPE;
export default {
    components: {},
    emits: ['submit'],
    props: {
        btnText: {
            type: String,
            default: '审核',
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
            default: false,
        },
        invoiceId: {
            type: Number,
        },
        status: {
            type: Number,
        },
        apiList: {},
    },
    data() {
        return {
            loading: false,
            modalShow: false,
            STOCK_RECORD,
            TYPE,
            STATUS,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            form: {
                status: '',
                audit_message: '',
                // audit_type: '',
                finance_audit_time: '',
            },
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        handleModalShow() {
            console.log('handleModalShow:');
            this.modalShow = true;
        },
        handleModalClose() {
            this.modalShow = false;
            this.form = {
                status: '',
                audit_message: '',
                // audit_type: '',
                finance_audit_time: '',
            };
        },
        handleConfirm() {
            let form = Core.Util.deepCopy(this.form);
            if (!form.status) {
                return this.$message.warning(this.$t('audit.choose_status'));
            }
            if (!form.finance_audit_time && this.status === STATUS.AUDIT_PASS) {
                return this.$message.warning(this.$t('audit.choose_finance_time'));
            }
            Core.Api[this.apiList[0]]
                [this.apiList[1]]({
                    status: this.form.status,
                    audit_message: this.form.audit_message,
                    // audit_type: this.form.audit_type,
                    finance_audit_time: dayjs(this.form.finance_audit_time).unix(),
                    id: this.invoiceId,
                })
                .then(res => {
                    console.log('handleAuditSubmit res', res);
                    this.$message.success(this.$t('pop_up.audited'));
                    this.handleModalClose();
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
.AuditMaterialPurchaseBtn {
    &.ant-btn-link {
        line-height: 1;
        height: 1em;
    }
}
</style>
