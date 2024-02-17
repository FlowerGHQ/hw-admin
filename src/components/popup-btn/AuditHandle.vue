<template>
    <a-button class="AuditHandleBtn" @click.stop="handleModalShow" :ghost="ghost" :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal :title="$t('n.audit')" v-model:visible="modalShow" :after-close="handleModalClose">
        <div class="modal-content">
            <div class="form-item required">
                <div class="key">{{ $t('n.result_a') }}:</div>
                <a-radio-group v-model:value="form.status">
                    <a-radio :value="sPass">{{ $t('n.pass') }}</a-radio>
                    <a-radio :value="sRefuse">{{ $t('n.fail') }}</a-radio>
                    <a-radio :value="sBack" v-show="sBack !== undefined">{{ $t('n.back') }}</a-radio>
                </a-radio-group>
            </div>
            <div class="form-item textarea required" v-if="form.status === sRefuse">
                <div class="key">{{ $t('n.reason') }}:</div>
                <div class="value">
                    <a-textarea
                        v-model:value="form.audit_message"
                        :placeholder="$t('def.input')"
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
        id: {},
        currentAuditProcessId: {},
        sPass: {},
        sRefuse: {},
        sBack: {},
        apiList: {},
        item_list: [], // 采购订单 待审核 的审核条件
    },
    data() {
        return {
            loading: false,
            modalShow: false,
            form: {
                status: '',
                audit_message: '',
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
        },
        handleConfirm() {
            let params = {
                id: this.id,
                current_audit_process_id: this.currentAuditProcessId,
                ...this.form,
            };

            // 采购订单 待审核 的审核条件
            if (this.apiList[1] == 'reviseAudit') {
                let AuditList = [];
                // 选中的商品信息表格有数据的话进行
                if (this.item_list.length) {
                    this.item_list.forEach(el => {
                        AuditList.push({
                            item_id: el.id,
                            amount: el.amount,
                            price: this.$Util.countFilter(el.price, 100, 2, true),
                        });
                    });
                }
                params['item_list'] = AuditList;
            }

            Core.Api[this.apiList[0]]
                [this.apiList[1]](Core.Util.searchFilter(params))
                .then(res => {
                    console.log('handleAuditSubmit res', res);
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
.AuditHandleBtn {
    &.ant-btn-link {
        line-height: 1;
        height: 1em;
    }
}
</style>
