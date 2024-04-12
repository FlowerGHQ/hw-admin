<template>
    <div id="UserEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('u.edit') : $t('u.manually_add') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('n.name') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                    </div>
                </div>

                <template v-if="!form.id">
                    <div class="form-item required">
                        <div class="key">{{ $t('u.account') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.username" :placeholder="$t('def.input')" autocomplete="off" />
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">{{ $t('u.password') }}:</div>
                        <div class="value">
                            <a-input-password
                                v-model:value="form.password"
                                :placeholder="$t('def.input')"
                                autocomplete="off"
                            />
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t('n.phone') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.phone" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </template>
                <div class="form-item">
                    <div class="key">{{ $t('n.email') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.email" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item" v-if="$auth('MANAGER') && loginType === org_type && !form.id">
                    <div class="key">用户角色:</div>
                    <div class="value">
                        <a-select v-model:value="form.role_ids" placeholder="请选择用户角色" mode="multiple">
                            <a-select-option v-for="(item, index) of roleList" :key="index" :value="item.id">{{
                                item.name
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('MANAGER')">{{
                $t('def.sure')
            }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost>{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

export default {
    name: 'UserEdit',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getOrgType(), // 当前登录的用户的 组织类型
            ORG_TYPE: Core.Const.LOGIN.ORG_TYPE,

            // 加载
            loading: false,

            user_id: '',
            detail: {},

            roleList: [],

            org_type: '', // 想要编辑的 用户的组织类型
            form: {
                id: '',
                user_id: '',

                org_id: '', // 组织ID
                org_type: '', // 组织类型 平台、代理、经销、门店
                type: '', // 账号类型 维修工、普通用户（和org_type保持一致）
                // role_id: undefined,

                name: '',
                username: '',
                password: '',
                phone: '',
                email: '',
                role_ids: [],
            },
            groupOptions: [],
        };
    },
    watch: {},
    computed: {},
    created() {
        let q = this.$route.query;
        this.org_type = Number(q.org_type) || Core.Data.getOrgType();

        this.form.org_id = Number(q.org_id) || Core.Data.getOrgId();
        this.form.org_type = Number(q.org_type) || Core.Data.getOrgType();
        this.form.type = Number(q.type) || Number(q.org_type) || Core.Data.getLoginType();

        this.user_id = Number(q.id) || 0;
        if (this.user_id) {
            this.getUserDetail();
        }

        if (this.$auth('MANAGER') && this.loginType == this.org_type) {
            this.getRoleList();
        }
        // this.handleGroupTree();
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        getUserDetail() {
            this.loading = true;
            Core.Api.User.detail({
                id: this.user_id,
            })
                .then(res => {
                    console.log('getUserDetail res', res);
                    let d = res.detail;
                    this.detail = d;
                    this.form = {
                        id: d.account_id,
                        user_id: d.id,

                        role_ids: d.role_ids || [],
                        org_id: d.org_id,
                        org_type: d.org_type,
                        type: d.type,

                        name: d.account.name,
                        username: d.account.username,
                        phone: d.account.phone,
                        email: d.account.email,
                    };
                })
                .catch(err => {
                    console.log('getUserDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            let apiName = form.id ? 'update' : 'save';
            if (!form.id) {
                if (!form.name) {
                    return this.$message.warning(this.$t('def.enter'));
                }
                if (!form.username) {
                    return this.$message.warning(this.$t('def.enter'));
                }
                if (!form.password) {
                    return this.$message.warning(this.$t('def.enter'));
                }
            }
            Core.Api.Account[apiName](form)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },

        getRoleList() {
            Core.Api.Authority.roleList().then(res => {
                console.log('getRoleList res:', res);
                this.roleList = res.list;
            });
        },
        handleGroupTree() {
            Core.Api.CRMGroupMember.structureByUser().then(res => {
                this.groupOptions = res.list;
                console.log(res);
            });
        },
    },
};
</script>

<style lang="less" scoped>
// #UserEdit {}
</style>
