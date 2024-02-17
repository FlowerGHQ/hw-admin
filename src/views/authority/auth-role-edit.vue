<template>
    <div id="AuthRoleEdit" class="edit-container" :class="$i18n.locale">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('role.edit') : $t('role.save') }}</div>
        </div>
        <!-- 基本信息 -->
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
                <div class="form-item textarea">
                    <div class="key">{{ $t('role.description') }}:</div>
                    <div class="value">
                        <a-textarea
                            v-model:value="form.remark"
                            :placeholder="$t('def.input')"
                            :auto-size="{ minRows: 2, maxRows: 6 }"
                            :maxlength="99"
                        />
                        <span class="content-length">{{ form.remark.length }}/99</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 权限分配 -->
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('role.assignment') }}</div>
            </div>
            <div class="form-content long-key">
                <template v-for="item of authItems" :key="item.key">
                    <div class="form-item afs" v-if="item.list.length">
                        <div class="key">{{ $t('authority.title.' + item.key) }}:</div>
                        <div class="value">
                            <!-- 全选 -->
                            <a-checkbox
                                class="select-all"
                                v-model:checked="itemCheckAll[item.key]"
                                :indeterminate="indeterminate[item.key]"
                                @change="onCheckAllChange(itemCheckAll[item.key], item, key)"
                            >
                                {{ $t('u.select_all') }}
                            </a-checkbox>
                            <!-- 单选 -->
                            <a-checkbox-group
                                v-model:value="item.select"
                                @change="onChange(item.select, item.key, item.list)"
                            >
                                <a-checkbox v-for="it in item.list" :value="it.value">
                                    {{ $t('authority.' + it.label) }}
                                </a-checkbox>
                            </a-checkbox-group>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <!-- 保存按钮 -->
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary">{{ $t('def.sure') }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost>{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

const AUTH_LIST_TEMP = Core.Const.AUTH_LIST_TEMP;

export default {
    name: 'AuthRoleEdit',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            id: '',
            detail: {},

            authItems: Core.Util.deepCopy(AUTH_LIST_TEMP),

            form: {
                id: '',
                name: '',
                remark: '',
            },
            itemCheckAll: {},
            indeterminate: {},
        };
    },
    watch: {},
    computed: {},
    created() {
        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getAuthRoleDetail();
        }
        this.getAuthOptions();
        console.log('解决', this.authItems);
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        // 获取角色详情
        getAuthRoleDetail() {
            this.loading = true;
            Core.Api.Authority.roleDetail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('获取角色详情', res);

                    this.detail = res.role;
                    for (const key in this.form) {
                        this.form[key] = res.role[key];
                    }
                })
                .catch(err => {
                    console.log('getAuthRoleDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取 某个身份下 可选的权限项
        getAuthOptions() {
            let apiName = this.$auth('ADMIN') ? 'allOptions' : 'authOptions';
            Core.Api.Authority[apiName]({
                org_type: Core.Data.getOrgType(),
            })
                .then(res => {
                    console.log('获取 某个身份下 可选的权限项', res);
                    let list = res.list;
                    list.map(auth => {
                        let key = auth.key.split('.')[0];
                        let item = this.authItems.find(i => key === i.key);
                        if (item) {
                            item.list.push({ value: auth.id, label: auth.key });
                            this.itemCheckAll[key] = false;
                            this.indeterminate[key] = false;
                        }
                    });
                    if (this.form.id) {
                        console.log('this.authItems', this.authItems);
                        this.getRoleSelectedAuth();
                    }
                })
                .catch(err => {
                    console.log('getAuthOptions err:', err);
                });
        },
        // 某个角色 已选的权限
        getRoleSelectedAuth() {
            Core.Api.Authority.authSelected({
                role_id: this.form.id,
            })
                .then(res => {
                    console.log('某个角色 已选的权限', res);
                    res.list.forEach(auth => {
                        let key = auth.key.split('.')[0];
                        let item = this.authItems.find(i => key === i.key);
                        if (item) {
                            item.select.push(auth.id);
                        }
                    });
                    this.authItems.forEach(it => {
                        this.onChange(it.select, it.key, it.list);
                    });
                })
                .catch(err => {
                    console.log('getRoleSelectedAuth err:', err);
                });
        },

        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            console.log('handleSubmit form:', form);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            let list = [];
            for (const item of this.authItems) {
                list.push(...item.select);
            }
            Core.Api.Authority.roleEdit({
                ...form,
                authority_ids: list.join(','),
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        onChange(checkedList, key, plainOptions) {
            this.indeterminate[key] = !!checkedList.length && checkedList.length < plainOptions.length;
            this.itemCheckAll[key] = checkedList.length === plainOptions.length;
        },
        onCheckAllChange(e, item, key) {
            console.log('e', e);
            let select = [];
            let selectDisabled = [];
            item.list.forEach(it => {
                if (it.disabled) {
                    selectDisabled.push(it.value);
                }
                select.push(it.value);
            });
            console.log('list', select);
            item.select = e ? select : selectDisabled;
            this.indeterminate[key] = false;
            this.itemCheckAll[key] = e;
            // Object.assign(this, {
            //     checkedList: e.checked ? item.list: [],
            //     indeterminate: false,
            //     checkAll: e.checked,
            // });
        },
    },
};
</script>

<style lang="less">
#AuthRoleEdit {
    .form-block .form-item .value {
        max-width: 100%;
        width: 100%;
    }
    .ant-checkbox-wrapper + .ant-checkbox-wrapper {
        margin-left: 0px;
    }
    div.ant-checkbox-group {
        display: inline;
    }
    div.ant-checkbox-group .ant-checkbox-wrapper {
        display: inline-flex;
    }

    .ant-checkbox + span {
        padding-right: 8px;
        padding-left: 8px;
        // width: 100px;
    }

    .select-all {
        width: 100%;
        margin-bottom: 10px;
        font-weight: 500;
    }
    &.en,
    &.zh {
        .form-content.long-key {
            padding: 0 5%;
            .form-item {
                .key {
                    width: 15%;
                    min-width: 140px;
                    padding-right: 1em;
                    text-align: right;
                    line-height: 16px;
                }
                .value {
                    width: 85%;
                    max-width: calc(100% - 140px);
                }
            }
        }
    }
}
</style>
