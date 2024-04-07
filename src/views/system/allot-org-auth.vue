<template>
    <div id="AllotOrgAuth" :class="$i18n.locale">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('n.org_auth') }}</div>
            </div>
            <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                <template #expandIcon></template>
                <a-collapse-panel
                    v-for="(org, key) of orgType"
                    :key="key"
                    :header="$t(org.name)"
                    class="gray-collapse-panel"
                >
                    <template #extra>
                        <a-button v-if="!org.edit" @click.stop="handleEditShow(key)" type="link">
                            <i class="icon i_edit" />{{ $t('def.set') }}
                        </a-button>
                        <template v-else>
                            <a-button @click.stop="handleEditSubmit(key)" type="link">
                                <i class="icon i_confirm" />
                                {{ $t('def.save') }}
                            </a-button>
                            <a-button @click.stop="handleEditClose(key)" type="link" class="cancel">
                                <i class="icon i_close_c" />
                                {{ $t('def.cancel') }}
                            </a-button>
                        </template>
                    </template>
                    <!-- 用户底下的 -->
                    <div v-if="!org.edit" class="panel-content">
                        <SimpleImageEmpty v-if="org.isEmpty" :desc="$t('n.no_org_auth')" />
                        <template v-else v-for="item of org.options" :key="item.key">
                            <div class="form-item afs">
                                <div class="key">{{ $t('authority.title.' + item.key) }}:</div>
                                <div class="value">
                                    <span>{{ $t('authority.title.' + item.key) }}</span>
                                </div>
                            </div>
                            <template v-for="(subItem, index) of item.list" :key="index">
                                <div v-if="subItem.itemSelect.length" class="form-item afs">
                                    <div class="key">
                                        {{ $t('authority.' + item.key + '.' + subItem.key + '.title') }}:
                                    </div>
                                    <div class="value d-f">
                                        <span
                                            class="authority-item"
                                            v-for="(threeItem, index) of subItem.list"
                                            :key="index"
                                        >
                                            <template v-if="$Util.Common.isMember(threeItem.id, item.select)">
                                                <span class="m-r-8">
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
                                                </span>
                                                <span
                                                    v-for="(fourItem, index) in threeItem.list"
                                                    :key="fourItem.id"
                                                    class="m-r-8"
                                                >
                                                    <template v-if="$Util.Common.isMember(fourItem.id, item.select)">
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
                                                    </template>
                                                </span>
                                            </template>
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                    <!-- 全部的 -->
                    <div v-else class="panel-content">
                        <auth-tab ref="authTabRef" class="m-b-20" @tab="onTab"></auth-tab>
                        <template v-for="item of org.authOptios" :key="item.key">
                            <div class="form-item afs">
                                <div class="key">{{ $t('authority.title.' + item.key) }}:</div>
                                <div class="value">
                                    <a-checkbox-group v-model:value="item.select">
                                        <a-checkbox :value="item.id">
                                            {{ $t('authority.title.' + item.key) }}
                                        </a-checkbox>
                                    </a-checkbox-group>
                                </div>
                            </div>
                            <div v-for="(subItem, index) of item.list" :key="index" class="form-item afs d-f-a">
                                <div class="key">{{ $t('authority.' + item.key + '.' + subItem.key + '.title') }}:</div>
                                <div class="value d-f">
                                    <a-checkbox-group v-model:value="subItem.itemSelect">
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
                        </template>
                    </div>
                </a-collapse-panel>
            </a-collapse>
        </div>
    </div>
</template>

<script>
import Core from '@/core';
import SimpleImageEmpty from '../../components/common/SimpleImageEmpty.vue';
import auth from '@/core/modules/units/auth';
import authTab from '@/components/authority/auth-tab.vue';

const AUTH_LIST_TEMP = Core.Const.SYSTEM_AUTH.AUTH_LIST_TEMP;
const USER_TYPE = Core.Const.USER.TYPE;

export default {
    name: 'AllotOrgAuth',
    components: { SimpleImageEmpty, authTab },
    props: {},
    data() {
        let _this = this;
        return {
            activeKey: [],

            authItems: Core.Util.deepCopy(AUTH_LIST_TEMP), // 所有权限

            distributor: {
                name: 'n.distributor_auth',
                type: USER_TYPE.DISTRIBUTOR, // 分销商
                edit: false,
                options: [],
                authOptios: [],
                isEmpty: true, // 是否回显数据为空
            },
            agent: {
                name: 'n.agent_auth',
                type: USER_TYPE.AGENT, // 零售商
                edit: false,
                options: [],
                authOptios: [],
                isEmpty: true,
            },
            store: {
                name: 'n.store_auth',
                type: USER_TYPE.STORE, // 门店
                edit: false,
                options: [],
                authOptios: [],
                isEmpty: true,
            },
            user_type: null,
            authClass: null,
        };
    },
    watch: {},
    computed: {
        orgType() {
            return {
                distributor: this.distributor,
                agent: this.agent,
                store: this.store,
            };
        },
    },
    created() {
        this.getAllAuthItemFetch();
    },
    mounted() {
        this.activeKey = ['distributor', 'agent', 'store'];
        this.authClass = new auth(this.authItems);
    },
    methods: {
        /* fetch start */
        getAllAuthItemFetch() {
            // 获取所权限项
            Core.Api.Authority.allOptions()
                .then(res => {
                    console.log('getAllAuthItem res:', res);

                    let list = res.list;

                    this.authClass.processAuthList(list);
                    this.getOrgAuthFetch('distributor');
                    this.getOrgAuthFetch('agent');
                    this.getOrgAuthFetch('store');
                })
                .catch(err => {
                    console.log('getAllAuthItem err:', err);
                });
        },
        // 获取 某类型组织 已分配的 权限项
        getOrgAuthFetch(user_type) {
            Core.Api.Authority.authOptions({
                org_type: this[user_type].type,
            })
                .then(res => {
                    let list = res.list;

                    // 回显数据
                    if (list.length === 0) {
                        this[user_type].isEmpty = true;
                        return;
                    }
                    this.authClass.echoAuth(list);
                    this[user_type].options = Core.Util.deepCopy(this.authItems);
                    this[user_type].isEmpty = false;
                    console.log('this[user_type]', this[user_type]);
                })
                .catch(err => {
                    console.log('getOrgAuth', user_type, 'err:', err);
                });
        },
        saveAllotOrgAuthFetch(params = {}) {
            let obj = {
                ...params,
            };
            Core.Api.Authority.allotOrgAuth(obj)
                .then(res => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleEditClose(type);
                })
                .catch(err => {
                    console.log('saveAllotOrgAuthFetch err', err);
                });
        },
        /* fetch end */

        // 进入编辑模式
        handleEditShow(type) {
            this.user_type = type;
            this[type].edit = true;
            this[type].authOptios = this.authClass.tabFilter();
        },
        // 取消编辑
        handleEditClose(type) {
            this[type].edit = false;
            this.getOrgAuthFetch(type);
        },
        // 保存编辑
        handleEditSubmit(type) {
            let list = [];

            for (const item of this[type].options) {
                list = list.concat(item.select)
                list.push(...this.authClass.mergeItemSelect(item.list));
            }
            list = [...new Set(list)]     

            this.saveAllotOrgAuthFetch({
                org_type: this[type].type,
                authority_ids: list.join(','),
            });
        },
        // auth-tab组件
        onTab(value) {
            this[this.user_type].authOptios = this.authClass.tabFilter(value);
        },
    },
};
</script>

<style lang="less">
#AllotOrgAuth {
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
    &.en {
        .form-item {
            .key {
                width: 186px;
                font-weight: 500;
            }
            .value {
                width: calc(100% - 200px);
                .authority-item {
                    font-size: 12px;
                    line-height: 32px;
                    // margin-right: 12px;
                }
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

    .ant-checkbox-group {
        flex-wrap: wrap;
        .ant-checkbox-wrapper + .ant-checkbox-wrapper {
            margin-left: 0;
        }
        .ant-checkbox-wrapper {
            margin-right: 8px;
            margin-bottom: 4px;
        }
    }
}

.d-f {
    display: flex;
}
.d-f-a {
    display: flex;
    align-items: center !important;
}
</style>
