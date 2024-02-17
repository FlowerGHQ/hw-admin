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
                    :header="$t('n.' + org.name)"
                    class="gray-collapse-panel"
                >
                    <template #extra>
                        <a-button
                            @click.stop="handleEditShow(key)"
                            type="link"
                            v-if="!org.edit && $auth('authority.save')"
                            ><i class="icon i_edit" />{{ $t('def.set') }}</a-button
                        >
                        <template v-else>
                            <a-button @click.stop="handleEditSubmit(key)" type="link" v-if="$auth('authority.save')"
                                ><i class="icon i_confirm" />{{ $t('def.save') }}</a-button
                            >
                            <a-button
                                @click.stop="handleEditClose(key)"
                                type="link"
                                class="cancel"
                                v-if="$auth('authority.save')"
                                ><i class="icon i_close_c" />{{ $t('def.cancel') }}</a-button
                            >
                        </template>
                    </template>
                    <div class="panel-content" v-if="!org.edit">
                        <SimpleImageEmpty v-if="$Util.isEmptyObj(org.selected)" :desc="$t('n.no_org_auth')" />
                        <template v-for="item of org.options" :key="item.key">
                            <div class="form-item afs" v-if="item.select.length">
                                <div class="key">{{ $t('authority.title.' + item.key) }}:</div>
                                <div class="value">
                                    <span class="authority-item" v-for="i of item.select" :key="i">{{
                                        $t('authority.' + org.selected[i])
                                    }}</span>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="panel-content" v-else>
                        <template v-for="item of org.options" :key="item.key">
                            <div class="form-item afs" v-if="item.list.length">
                                <div class="key">{{ $t('authority.title.' + item.key) }}:</div>
                                <div class="value">
                                    <a-checkbox-group v-model:value="item.select">
                                        <a-checkbox v-for="it in item.list" :value="it.value">{{
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
    </div>
</template>

<script>
import Core from '../../core';
import SimpleImageEmpty from '../../components/common/SimpleImageEmpty.vue';

const AUTH_LIST_TEMP = Core.Const.AUTH_LIST_TEMP;
const USER_TYPE = Core.Const.USER.TYPE;

export default {
    name: 'AllotOrgAuth',
    components: { SimpleImageEmpty },
    props: {},
    data() {
        let _this = this;
        return {
            activeKey: [],

            authItems: Core.Util.deepCopy(AUTH_LIST_TEMP), // 所有权限

            distributor: {
                name: 'distributor_auth',
                type: USER_TYPE.DISTRIBUTOR,
                edit: false,
                options: [],
                selected: {},
            },
            agent: {
                name: 'agent_auth',
                type: USER_TYPE.AGENT,
                edit: false,
                options: [],
                selected: {},
            },
            store: {
                name: 'store_auth',
                type: USER_TYPE.STORE,
                edit: false,
                options: [],
                selected: {},
            },
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
        this.getAllAuthItem();
    },
    mounted() {
        this.activeKey = ['distributor', 'agent', 'store'];
    },
    methods: {
        getAllAuthItem() {
            // 获取所权限项
            Core.Api.Authority.allOptions()
                .then(res => {
                    console.log('getAllAuthItem res:', res);
                    let list = res.list;
                    list.forEach(auth => {
                        let key = auth.key.split('.')[0];
                        let item = this.authItems.find(i => key === i.key);
                        if (item) {
                            item.list.push({ value: auth.id, label: auth.key });
                        }
                    });
                    console.log('getAllAuthItem authItems', this.authItems);
                    this.getOrgAuth('distributor');
                    this.getOrgAuth('agent');
                    this.getOrgAuth('store');
                })
                .catch(err => {
                    console.log('getAllAuthItem err:', err);
                });
        },
        getOrgAuth(user_type) {
            // 获取 某类型组织 已分配的 权限项
            this[user_type].options = Core.Util.deepCopy(this.authItems);
            Core.Api.Authority.authOptions({
                org_type: this[user_type].type,
            })
                .then(res => {
                    console.log('getOrgAuth', user_type, 'res:', res);
                    let selected = {};
                    res.list.forEach(auth => {
                        selected[auth.id] = auth.key;
                        let key = auth.key.split('.')[0];
                        let item = this[user_type].options.find(i => key === i.key);
                        if (item) {
                            item.select.push(auth.id);
                        }
                    });
                    this[user_type].selected = selected;
                    console.log('getOrgAuth', user_type, this[user_type]);
                })
                .catch(err => {
                    console.log('getOrgAuth', user_type, 'err:', err);
                });
        },

        handleEditShow(type) {
            // 进入编辑模式
            this[type].edit = true;
        },
        handleEditSubmit(type) {
            // 保存编辑
            let list = [];
            for (const item of this[type].options) {
                list.push(...item.select);
            }
            Core.Api.Authority.allotOrgAuth({
                org_type: this[type].type,
                authority_ids: list.join(','),
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'));
                this.handleEditClose(type);
            });
        },
        handleEditClose(type) {
            // 取消编辑
            this[type].edit = false;
            this.getOrgAuth(type);
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
                margin-right: 12px;
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
                    margin-right: 12px;
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
</style>
