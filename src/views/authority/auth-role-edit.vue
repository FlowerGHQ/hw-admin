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
                <auth-tab ref="authTabRef" class="m-b-20 m-l-140" @tab="onTab"></auth-tab>
                <template v-for="item in authOptions" :key="item.key">
                    <div class="form-item afs">
                        <div class="key">{{ $t('authority.title.' + item.key) }}:</div>
                        <div class="value">
                            <a-checkbox-group v-model:value="item.templateSelect">
                                <a-checkbox :value="item.id">
                                    {{ $t('authority.title.' + item.key) }}
                                </a-checkbox>
                            </a-checkbox-group>
                        </div>
                    </div>
                    <div v-for="(subItem, index) in item.list" :key="index" class="form-item afs">
                        <div class="key">{{ $t('authority.' + item.key + '.' + subItem.key + '.title') }}:</div>
                        <div class="value">
                            <!-- 全选 -->
                            <div class="m-b-10">
                                <a-checkbox
                                    :checked="$Util.Common.arraysAreEqual(subItem.itemSelect, subItem.itemCheckAll)"
                                    @change="e => handleCheckAllChange(e, subItem)"
                                >
                                    {{ $t('u.select_all') }}
                                </a-checkbox>
                            </div>
                            <div class="d-f">
                                <a-checkbox-group v-model:value="subItem.itemSelect">
                                    <a-checkbox :value="subItem.id">
                                        {{ $t('authority.' + item.key + '.' + subItem.key + '.title') }}
                                    </a-checkbox>
                                    <template v-for="(threeItem, index) in subItem.list">
                                        <a-checkbox :value="threeItem.id">
                                            {{
                                                $t(
                                                    'authority.' +
                                                        item.key +
                                                        '.' +
                                                        subItem.key +
                                                        '.' +
                                                        threeItem.key +
                                                        '.title',
                                                )
                                            }}
                                        </a-checkbox>
                                        <a-checkbox
                                            v-for="(fourItem, index) in threeItem.list"
                                            :key="index"
                                            :value="fourItem.id"
                                        >
                                            {{
                                                $t(
                                                    'authority.' +
                                                        item.key +
                                                        '.' +
                                                        subItem.key +
                                                        '.' +
                                                        threeItem.key +
                                                        '.title',
                                                ) +
                                                $t(
                                                    'authority.' +
                                                        item.key +
                                                        '.' +
                                                        subItem.key +
                                                        '.' +
                                                        threeItem.key +
                                                        '.' +
                                                        fourItem.key,
                                                )
                                            }}
                                        </a-checkbox>
                                    </template>
                                </a-checkbox-group>
                            </div>
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
import Core from '@/core';
import authTab from '@/components/authority/auth-tab.vue';
import auth from '@/core/modules/units/auth';
const AUTH_LIST_TEMP = Core.Const.SYSTEM_AUTH.AUTH_LIST_TEMP;

export default {
    name: 'AuthRoleEdit',
    components: {
        authTab,
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            id: '',
            detail: {},

            authItems: Core.Util.deepCopy(AUTH_LIST_TEMP),
            authOptions: [], // 渲染权限的数据
            form: {
                id: '',
                name: '',
                remark: '',
            },
            authClass: null,
        };
    },
    watch: {},
    computed: {},
    created() {
        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getAuthRoleDetailFetch();
        }
        this.getAuthOptionsFetch();
    },
    mounted() {
        this.authClass = new auth(this.authItems);
    },
    methods: {
        /* fetch start */
        // 获取角色详情
        getAuthRoleDetailFetch() {
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
        getAuthOptionsFetch() {
            let apiName = this.$auth('ADMIN') ? 'allOptions' : 'authOptions';
            Core.Api.Authority[apiName]({
                org_type: Core.Data.getOrgType(),
            })
                .then(res => {
                    // console.log('获取 某个身份下 可选的权限项', res);
                    let list = res.list;
                    this.authClass.processAuthList(list);

                    if (this.form.id) {
                        this.getRoleSelectedAuthFetch();
                    } else {
                        this.authOptions = this.authClass.tabFilter();
                    }
                })
                .catch(err => {
                    console.log('getAuthOptions err:', err);
                });
        },
        // 某个角色 已选的权限
        getRoleSelectedAuthFetch() {
            Core.Api.Authority.authSelected({
                role_id: this.form.id,
            })
                .then(res => {
                    console.log('某个角色 已选的权限', res);

                    let list = res.list;

                    // 回显数据
                    this.authClass.echoAuth(list);
                    this.authOptions = this.authClass.tabFilter();
                })
                .catch(err => {
                    console.log('getRoleSelectedAuth err:', err);
                });
        },
        // 保存权限数据
        saveRoledataFetch(params = {}) {
            let obj = {
                ...params,
            };
            Core.Api.Authority.roleEdit(obj)
                .then(res => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        /* fetch end */

        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        handleSubmit() {    
            let form = Core.Util.deepCopy(this.form);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            let list = [];

            for (const item of this.authItems) {                
                list = list.concat(item.templateSelect)
                list.push(...this.authClass.mergeItemSelect(item.list));
            }
            list = [...new Set(list)];            

            console.log("list", list);
            this.saveRoledataFetch({ ...form, authority_ids: list.join(',') });
        },

        // 全选操作
        handleCheckAllChange(e, subItem) {
            let checked = e.target.checked;

            if (checked) {
                subItem.itemSelect = subItem.itemCheckAll;
            } else {
                subItem.itemSelect = [];
            }
            console.log("subItem", subItem);
        },
        // auth-tab组件
        onTab(value) {
            this.authOptions = this.authClass.tabFilter(value);
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

.d-f {
    display: flex;
}

.m-l-140 {
    margin-left: 140px;
}
</style>
