<template>
    <a-button class="AuditHandleBtn" @click.stop="handleModalShow" :ghost='ghost' :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal :title="$t('n.audit')" v-model:visible="modalShow" :after-close='handleModalClose'>
        <div class="modal-content">
            <div class="form-item required">
                <div class="key">{{ $t('n.result_a') }}:</div>
                <a-radio-group v-model:value="form.status">
                    <a-radio :value="sPass">{{ $t('n.pass') }}</a-radio>
                    <a-radio :value="sRefuse">{{ $t('n.fail') }}</a-radio>
                </a-radio-group>
            </div>
            <div class="form-item textarea required" v-if="form.status === sRefuse">
                <div class="key">{{ $t('n.reason') }}:</div>
                <div class="value">
                    <a-textarea v-model:value="form.audit_message" :placeholder="$t('def.input')"
                                :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
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
        id: {},
        sPass: {},
        sRefuse: {},
        apiList: {},
    },
    data() {
        return {
            loading: false,
            modalShow: false,
            form: {
                status: '',
                audit_message: '',
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
        },
        handleConfirm() {
            Core.Api[this.apiList[0]][this.apiList[1]]({
                id: this.id,
                ...this.form
            }).then(res => {
                console.log('handleAuditSubmit res', res)
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
.AuditHandleBtn {
    &.ant-btn-link {
        line-height: 1;
        height: 1em;
    }
}
</style>

