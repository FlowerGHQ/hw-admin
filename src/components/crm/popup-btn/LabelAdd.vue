<template>
    <a-button class="LabelAddBtn" @click.stop="handleModalShow" :ghost="ghost" :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal
        :title="btnText"
        v-model:visible="modalShow"
        :after-close="handleModalClose"
        width="500px"
        class="LabelAddModal"
    >
        <div class="form-title">
            <div class="form-item required">
                <div class="key">{{ $t('sl.name') }}：</div>
                <div class="value">
                    <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('sl.name_en') }}：</div>
                <div class="value">
                    <a-input v-model:value="form.name_en" :placeholder="$t('def.input')" />
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('sl.remark') }}：</div>
                <div class="value">
                    <a-input v-model:value="form.remark" :placeholder="$t('def.input')" />
                </div>
            </div>
        </div>
        <template #footer>
            <div class="modal-footer">
                <div class="paging-area"></div>
                <div class="btn-area">
                    <a-button @click="handleModalClose">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleSubmit" type="primary">{{ $t('def.sure') }}</a-button>
                </div>
            </div>
        </template>
    </a-modal>
</template>

<script>
import Core from '@/core';

export default {
    components: {},
    emits: ['select', 'option'],
    props: {
        btnText: {
            type: String,
            default: '添加标签',
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
        category: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            loading: false,
            modalShow: false,

            loginType: Core.Data.getLoginType(),
            form: {
                id: '',
                name: '',
                name_en: '',
                remark: '',
            },
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    methods: {
        handleModalShow() {
            this.modalShow = true;
        },
        routerChange(type, item) {
            switch (type) {
                case 'back': // 详情
                    let routeUrl = this.$router.resolve({
                        path: '/crm-customer/customer-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.name_en) {
                return this.$message.warning(this.$t('def.enter'));
            }
            Core.Api.CRMLabel.save({
                ...form,
                category: this.category,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleModalClose();
                    this.$emit('select');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },

        handleModalClose() {
            this.modalShow = false;
            Object.assign(this.form, this.$options.data().form);
        },
    },
};
</script>

<style lang="less" scoped>
.LabelAddBtn {
    &.ant-btn-link {
        line-height: 1;
        height: 1em;
    }
    .ant-modal-content {
        .ant-modal-body {
            .hint-count {
                margin-bottom: 5px;
            }
        }
    }
}
.LabelAddModal {
    .tip {
        height: 30px;
        line-height: 30px;
        margin-left: 10px;
        font-size: 12px;
    }
}
</style>
