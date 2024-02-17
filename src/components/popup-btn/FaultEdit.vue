<template>
    <a-button class="FaultEdit" @click.stop="handleFaultShow()" :ghost="ghost" :type="btnType" :class="btnClass">
        <!--        <slot><i class="icon i_add"/></slot>-->
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal v-model:visible="faultShow" :title="$t('r.new_fault')" class="fault-modal" :after-close="handleFaultClose">
        <div class="modal-content">
            <div class="form-item required">
                <div class="key">{{ $t('r.new_fault') }}:</div>
                <div class="value">
                    <a-input v-model:value="form.name" :placeholder="$t('pop_up.enter_fault')" />
                </div>
            </div>
        </div>
        <template #footer>
            <a-button @click="faultShow = false">{{ $t('def.cancel') }}</a-button>
            <a-button @click="handleFaultSubmit" type="primary">{{ $t('def.sure') }}</a-button>
        </template>
    </a-modal>
</template>

<script>
import Core from '../../core';

export default {
    name: 'FaultEdit',
    components: {},
    emits: ['saveFault'],
    props: {
        btnText: {
            type: String,
            default: '新增故障',
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
        id: {
            type: Number,
        },
    },
    data() {
        return {
            faultShow: false,
            form: {
                id: '',
                name: '',
            },
        };
    },
    watch: {},
    computed: {},
    mounted() {},
    methods: {
        handleFaultShow(id) {
            // 显示弹框
            this.faultShow = true;
            this.form.id = id;
        },
        handleFaultClose() {
            // 关闭弹框
            this.faultShow = false;
            this.form = {
                id: '',
                name: '',
            };
        },
        handleFaultSubmit() {
            // 提交
            this.loading = true;
            Core.Api.Fault.save({
                ...this.form,
            })
                .then(res => {
                    this.$message.success(this.$t('pop_up.add'));
                    this.handleFaultClose();
                    this.$emit('saveFault');
                })
                .catch(err => {
                    console.log('handleFaultSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style scoped></style>
