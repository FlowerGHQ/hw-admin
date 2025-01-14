<template>
    <div id="AllotUserAuth">
        <div class="list-container">
            <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                <template #expandIcon></template>
                <a-collapse-panel v-for="(org, key) of orgType" :key="key" :header="name" class="gray-collapse-panel">
                    <template #extra v-if="showExtra">
                        <a-button v-if="!edit" @click.stop="handleEditShow(key)" type="link">
                            <i class="icon i_edit" />
                            {{ $t('def.set') }}
                        </a-button>
                        <template v-else>
                            <a-button @click.stop="handleEditSubmit(key)" type="link">
                                <i class="icon i_confirm" />{{ $t('def.save') }}
                            </a-button>
                            <a-button @click.stop="handleEditClose(key)" type="link" class="cancel">
                                <i class="icon i_close_c" />
                                {{ $t('def.cancel') }}
                            </a-button>
                        </template>
                    </template>

                    <div class="panel-content" v-if="!edit && showExtra">
                        <SimpleImageEmpty v-if="false" desc="该用户尚未分配可管理权限" />
                        <template v-else v-for="item of options" :key="item.key">
                            <template v-for="(subItem, index) of item.list" :key="index">
                                <div v-if="subItem.itemSelect?.length" class="form-item afs">
                                    <div class="key">{{ $t('authority.' + subItem.key) }}:</div>
                                    <div class="value">
                                        <span
                                            class="authority-item"
                                            v-for="(threeItem, index) of subItem.list"
                                            :key="index"
                                        >
                                            <template v-if="$Util.Common.isMember(threeItem.id, item.select)">
                                                <span
                                                    class="m-r-8"
                                                    :class="{ 'color-1890ff': threeItem.scope_type > 0 }"
                                                    @click="handleScopeTypeShow(threeItem.scope_type)"
                                                >
                                                    {{ $t('authority.' + threeItem.key) }}
                                                </span>

                                                <span
                                                    v-for="(fourItem, index) in threeItem.list"
                                                    :key="fourItem.id"                                                    
                                                >
                                                    <template v-if="$Util.Common.isMember(fourItem.id, item.select)">
                                                        <span
                                                            class="m-r-8"
                                                            :class="{ 'color-1890ff': fourItem.scope_type > 0 }"
                                                            @click="handleScopeTypeShow(fourItem.scope_type)"
                                                        >
                                                            {{ $t('authority.' + fourItem.key) }}
                                                        </span>
                                                    </template>
                                                </span>
                                            </template>
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                    <div v-else class="panel-content">
                        <auth-tab v-if="!$auth('DISTRIBUTOR')" ref="authTabRef" class="m-b-20" @tab="onTab"></auth-tab>
                        <template v-for="item of options" :key="item.key">
                            <template v-if="$auth('DISTRIBUTOR') || activeTab === item.tab">
                                <div v-for="(subItem, index) of item.list" :key="index" class="form-item afs">
                                    <div class="key">{{ $t('authority.' + subItem.key) }}:</div>
                                    <div class="value">
                                        <!-- 全选 -->
                                        <div class="m-b-10">
                                            <a-checkbox
                                                :checked="
                                                    $Util.Common.arraysAreEqual(
                                                        subItem.itemSelect,
                                                        subItem.itemCheckAll,
                                                    )
                                                "
                                                :disabled="subItem.disabled"
                                                @change="e => handleCheckAllChange(e, subItem)"
                                            >
                                                {{ $t('u.select_all') }}
                                            </a-checkbox>
                                        </div>
                                        <div>
                                            <a-checkbox-group v-model:value="subItem.itemSelect">
                                                <!-- 二级模块渲染 -->
                                                <a-checkbox :value="subItem.id" :disabled="subItem.disabled">
                                                    {{ $t('authority.' + subItem.key) }}
                                                </a-checkbox>
                                                <template v-for="(threeItem, index) in subItem.list">
                                                    <a-checkbox :value="threeItem.id" :disabled="threeItem.disabled">
                                                        {{ $t('authority.' + threeItem.key) }}
                                                    </a-checkbox>
                                                    <a-checkbox
                                                        v-for="(fourItem, index) in threeItem.list"
                                                        :key="index"
                                                        :value="fourItem.id"
                                                        :disabled="fourItem.disabled"
                                                    >
                                                        {{ $t('authority.' + fourItem.key) }}
                                                    </a-checkbox>
                                                </template>
                                            </a-checkbox-group>
                                        </div>
                                    </div>
                                </div>
                            </template>
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
import Core from '@/core';
import SimpleImageEmpty from '@/components/common/SimpleImageEmpty.vue';
import UserScope from './UserScope.vue';
import auth from '@/core/modules/units/auth';
import authTab from '@/components/authority/auth-tab.vue';

const AUTH_LIST_TEMP = Core.Const.SYSTEM_AUTH.AUTH_LIST_TEMP;

export default {
    name: 'UserAuth',
    components: { SimpleImageEmpty, UserScope, authTab },
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
        showExtra: {
            type: Boolean,
            default: true,
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
            options: [], // 用户下
            disabledIds: [], // 禁用的ids
            ids_arr: [],
            authClass: null, // 权限类
            activeTab: null, // tab value
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
        this.getAllAuthItemFetch();
    },
    mounted() {
        this.activeKey = ['distributor'];
        this.authClass = new auth(this.authItems);
        this.activeTab = this.$refs.authTabRef?.activeTab || this.authItems[0].tab;
    },
    methods: {
        /* fetch start */
        getAllAuthItemFetch() {
            // 获取所权限项
            let url = 'authOptions';
            switch (this.detail.org_type) {
                case Core.Const.USER.TYPE.ADMIN:
                    url = 'allOptions';
                    break;
            }

            Core.Api.Authority[url]({
                org_type: this.detail.org_type,
            })
                .then(res => {
                    console.log('getAllAuthItem res:', res);
                    let list = res.list;
                    this.authClass.processAuthList(list);

                    this.ids_arr = [];
                    if (!this.showExtra) {
                        if (this.detail.authority_ids) {
                            const ids = this.detail.authority_ids.split(',');
                            this.ids_arr = list.filter(item => {
                                return ids.includes(String(item.id));
                            });
                        }
                    }
                    console.log('this.ids_arr', this.ids_arr);

                    this.getUserRoleAuthFetch();
                })
                .catch(err => {
                    console.log('getAllAuthItem err:', err);
                });
        },
        // 获取该用户对应角色下的全部权限 [] 让其不能更改disabled
        getUserRoleAuthFetch() {
            this.options = Core.Util.deepCopy(this.authItems);
            return new Promise((resolve, reject) => {
                Core.Api.Authority.authRoleUser({
                    user_id: this.userId,
                })
                    .then(async res => {
                        let list = res.list;
                        console.log('getUserRoleAuthFetch', list);
                        this.disabledIds = list.map(el => el.id);
                        this.authClass.addDisableItem(this.disabledIds);
                        // 先清空select在重新赋值
                        this.authClass.clearAuthItemsSelect();
                        // 回显数据
                        this.authClass.echoAuth(list);
                        this.options = Core.Util.deepCopy(this.authItems);
                        await this.getUserAuthFetch();
                        resolve();
                    })
                    .catch(err => {
                        console.log('err', err);
                        reject();
                    });
            });
        },
        // 某个用户对应角色 已选的权限
        getUserAuthFetch() {
            return new Promise((resolve, reject) => {
                Core.Api.Authority.authUser({
                    user_id: this.userId,
                    user_type: this.detail.type,
                })
                    .then(res => {
                        let list = res.list;
                        console.log('getUserAuthFetch', list);

                        if (!this.showExtra) {
                            list = [...res.list, ...this.ids_arr];
                        }

                        // 回显数据
                        this.authClass.echoAuth(list);
                        this.options = Core.Util.deepCopy(this.authItems);
                        resolve();
                    })
                    .catch(err => {
                        console.log('err', err);
                        reject();
                    });
            });
        },
        /* fetch end */

        async handleEditShow() {
            this.activeTab = this.$refs.authTabRef?.activeTab || this.authItems[0].tab;
            await this.getUserRoleAuthFetch();
            // 进入编辑模式
            this.edit = true;
        },
        handleEditSubmit() {
            let list = [];
            // 只保存属于该用户的权限
            for (const item of this.options) {
                list = list.concat(item.templateSelect);
                list.push(...this.authClass.mergeItemSelect(item.list));
            }

            // 过滤掉禁用的数据
            list = list.filter(el => !this.disabledIds.includes(el));

            list = [...new Set(list)];
            console.log('list', list);
            if (!this.showExtra) {
                return this.$emit('submit', list.join(','));
            }
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

            this.getUserRoleAuthFetch();
        },
        handleScopeTypeShow(scope_type) {
            if (scope_type <= 0) {
                return;
            }
            console.log('scope_type', scope_type);
            this.scopeType = scope_type;
            this.scopeShow = true;
        },
        handleScopeTypeClose() {
            // 取消编辑
            this.scopeShow = false;
        },
        // 全选操作
        handleCheckAllChange(e, subItem) {
            let checked = e.target.checked;

            if (checked) {
                subItem.itemSelect = subItem.itemCheckAll;
            } else {
                subItem.itemSelect = [];
            }
        },
        // auth-tab组件
        onTab(value) {
            this.activeTab = value;
        },
    },
};
</script>

<style lang="less" scoped>
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
                // margin-right: 12px;
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

.ant-checkbox-wrapper {
    margin-left: 0px;
}

.color-1890ff {
    color: #1890ff;
    cursor: pointer;
}
</style>
