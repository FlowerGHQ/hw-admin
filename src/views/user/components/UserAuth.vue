<template>
    <div id="AllotUserAuth">
        <div class="list-container">
            <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                <template #expandIcon></template>
                <a-collapse-panel v-for="(org, key) of orgType" :key="key" :header="name" class="gray-collapse-panel">
                    <template #extra>
                        <a-button
                            @click.stop="handleEditShow(key)"
                            type="link"
                            v-if="!edit && $auth('authority.save', 'MANAGER')"
                            ><i class="icon i_edit" />{{ $t('def.set') }}</a-button
                        >
                        <template v-else>
                            <a-button
                                @click.stop="handleEditSubmit(key)"
                                type="link"
                                v-if="$auth('authority.save', 'MANAGER')"
                                ><i class="icon i_confirm" />{{ $t('def.save') }}</a-button
                            >
                            <a-button
                                @click.stop="handleEditClose(key)"
                                type="link"
                                class="cancel"
                                v-if="$auth('authority.save', 'MANAGER')"
                                ><i class="icon i_close_c" />{{ $t('def.cancel') }}</a-button
                            >
                        </template>
                    </template>
                    <div class="panel-content" v-if="!edit">
                        <SimpleImageEmpty v-if="$Util.isEmptyObj(selected)" desc="该用户尚未分配可管理权限" />
                        <template v-for="item of options" :key="item.key">
                            <div class="form-item afs" v-if="item.select.length">
                                <div class="key">{{ $t('authority.title.' + item.key) }}:</div>
                                <div class="value">
                                    <span class="authority-item" v-for="i of item.select" :key="i">
                                        <a
                                            @click="handleScopeTypeShow(selected[i].scope_type)"
                                            v-if="selected[i].scope_type > 0"
                                        >
                                            <!--                                            {{selected[i].key}}-->
                                            <!--                                            {{$t('authority.'+ selected[i].key)}}-->
                                            <!--                                            {{$t("authority.\'distributor.save\'")}}-->
                                            {{ $t('authority.' + selected[i].key) }}
                                        </a>
                                        <span v-else>
                                            {{ $t('authority.' + selected[i].key) }}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="panel-content" v-else>
                        <template v-for="item of options" :key="item.key">
                            <div class="form-item afs" v-if="item.list.length">
                                <!--                                <div class="key">{{item.name}}:</div>-->
                                <div class="key">{{ $t('authority.title.' + item.key) }}:</div>
                                <div class="value">
                                    <a-checkbox
                                        v-model:checked="itemCheckAll[item.key]"
                                        :indeterminate="indeterminate[item.key]"
                                        @change="onCheckAllChange(itemCheckAll[item.key], item, key)"
                                    >
                                        {{ $t('u.select_all') }}
                                    </a-checkbox>
                                    <a-checkbox-group
                                        v-model:value="item.select"
                                        @change="onChange(item.select, item.key, item.list)"
                                    >
                                        <a-checkbox v-for="it in item.list" :value="it.value" :disabled="it.disabled">{{
                                            $t('authority.' + it.label)
                                        }}</a-checkbox>
                                    </a-checkbox-group>
                                </div>
                            </div>
                        </template>
                    </div>
                </a-collapse-panel>
            </a-collapse>
        </div>
        <a-modal
            v-model:visible="scopeShow"
            :title="'资源管理'"
            class="stock-change-modal"
            :width="800"
            :after-close="handleScopeTypeClose"
        >
            <UserScope :userId="userId" :userType="detail.type" :resourceType="scopeType" v-if="scopeShow" />
            <template #footer>
                <a-button @click="scopeShow = false">关闭</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../../core';
import SimpleImageEmpty from '../../../components/common/SimpleImageEmpty.vue';
import UserScope from './UserScope.vue';

const AUTH_LIST_TEMP = Core.Const.AUTH_LIST_TEMP;
const USER_TYPE = Core.Const.USER.TYPE;

export default {
    name: 'UserAuth',
    components: { SimpleImageEmpty, UserScope },
    props: {
        userId: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        type: {
            type: String,
        },
    },
    data() {
        return {
            activeKey: [],
            authItems: Core.Util.deepCopy(AUTH_LIST_TEMP), // 所有权限
            name: this.$t('u.view_auth'),
            edit: false,
            scopeShow: false,
            scopeType: 0,
            options: [],
            selected: {},
            disabled: {},
            itemCheckAll: {},
            indeterminate: {},
        };
    },

    watch: {},
    computed: {
        orgType() {
            return {
                distributor: this.distributor,
            };
        },
    },
    created() {
        this.getAllAuthItem();
    },
    mounted() {
        this.activeKey = ['distributor'];
    },
    methods: {
        getAllAuthItem() {
            // 获取所权限项
            let url = 'authOptions';
            switch (this.detail.org_type) {
                case Core.Const.USER.TYPE.ADMIN:
                    url = 'allOptions';
                    break;
            }
            console.log('url', url);
            Core.Api.Authority[url]({
                org_type: this.detail.org_type,
            })
                .then(res => {
                    console.log('getAllAuthItem res:', res);
                    let list = res.list;
                    list.map(auth => {
                        let key = auth.key.split('.')[0];
                        let item = this.authItems.find(i => key === i.key);
                        if (item) {
                            item.list.push({ value: auth.id, label: auth.key, scope_type: auth.scope_type });
                            this.itemCheckAll[key] = false;
                            this.indeterminate[key] = false;
                        }
                    });
                    console.log('checkAll authItems', this.itemCheckAll);
                    console.log('indeterminate authItems', this.indeterminate);
                    console.log('getAllAuthItem authItems', this.authItems);

                    this.getUserRoleAuth();
                })
                .catch(err => {
                    console.log('getAllAuthItem err:', err);
                });
        },
        getUserRoleAuth() {
            // 获取 某类型组织 已分配的 权限项
            this.options = Core.Util.deepCopy(this.authItems);
            Core.Api.Authority.authRoleUser({
                user_id: this.userId,
            })
                .then(res => {
                    let selected = {};
                    res.list.forEach(auth => {
                        let selectedInfo = {
                            key: auth.key,
                            scope_type: 0,
                        };
                        selected[auth.id] = selectedInfo;
                        let key = auth.key.split('.')[0];
                        let item = this.options.find(i => key === i.key);
                        if (item) {
                            item.select.push(auth.id);
                            selected[auth.id].scope_type = auth.scope_type;
                            item.list.forEach(it => {
                                if (it.value == auth.id) {
                                    it.disabled = true;
                                }
                            });
                            console.log('item', item);
                        }
                    });
                    this.selected = selected;
                    this.getUserAuth();
                })
                .catch(err => {});
        },
        getUserAuth() {
            // 获取 某类型组织 已分配的 权限项
            Core.Api.Authority.authUser({
                user_id: this.userId,
                user_type: this.detail.type,
            })
                .then(res => {
                    let selected = this.selected;
                    res.list.forEach(auth => {
                        let selectedInfo = {
                            key: auth.key,
                            scope_type: 0,
                        };
                        selected[auth.id] = selectedInfo;
                        let key = auth.key.split('.')[0];
                        let item = this.options.find(i => key === i.key);
                        if (item) {
                            if (item.select.indexOf(auth.id) == -1) {
                                item.select.push(auth.id);
                            }

                            selected[auth.id].scope_type = auth.scope_type;
                        }
                    });
                    this.selected = selected;
                    this.options.forEach(it => {
                        this.onChange(it.select, it.key, it.list);
                    });
                })
                .catch(err => {});
        },

        handleEditShow() {
            // 进入编辑模式
            this.edit = true;
        },
        handleEditSubmit() {
            // 保存编辑
            let list = [];
            for (const item of this.options) {
                //只保存属于该用户的权限
                let add = item.select.filter(it => !item.list.some(ele => ele.value === it && ele.disabled == true));
                list.push(...add);
            }
            console.log('add', list);
            Core.Api.Authority.allotUser({
                user_id: this.userId,
                user_type: this.detail.type,
                authority_ids: list.join(','),
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'));
                this.handleEditClose();
            });
        },
        handleEditClose() {
            // 取消编辑
            this.edit = false;

            this.getUserRoleAuth();
        },
        handleScopeTypeShow(scope_type) {
            this.scopeType = scope_type;
            this.scopeShow = true;
            // let routeUrl = this.$router.resolve({
            //     path: "/system/user-scope",
            //     query: {
            //         user_id: this.userId,
            //         user_type: this.detail.type,
            //         resource_type: scope_type,
            //     }
            // })
            // window.open(routeUrl.href, '_self')
        },
        handleScopeTypeClose() {
            // 取消编辑
            this.scopeShow = false;
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
#AllotUserAuth {
    .form-item {
        .key {
            width: 120px;
            font-weight: 500;
        }
        .value {
            width: calc(~'100% - 120px');
            .authority-item {
                font-size: 12px;
                line-height: 32px;
                margin-right: 12px;
            }
        }
    }
    .ant-collapse-extra {
        position: relative;
        .ant-btn {
            font-size: 12px;
            height: 20px;
            &.cancel {
                color: #8090a6;
            }
            .icon {
                font-size: 12px;
            }
        }
    }
}
</style>
