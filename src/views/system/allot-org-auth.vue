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
                        <a-button
                            v-if="!org.edit && $auth('authority.save')"
                            @click.stop="handleEditShow(key)"
                            type="link"
                        >
                            <i class="icon i_edit" />{{ $t('def.set') }}
                        </a-button>
                        <template v-else-if="$auth('authority.save')">
                            <a-button @click.stop="handleEditSubmit(key)" type="link">
                                <i class="icon i_confirm" />
                                {{ $t('def.save') }}
                            </a-button>
                            <a-button @click.stop="handleEditClose(key)" type="link" class="cancel">
                                <i class="icon i_close_c" />{{ $t('def.cancel') }}
                            </a-button>
                        </template>
                    </template>
                    <!-- 用户底下的 -->
                    <div v-if="!org.edit" class="panel-content">
                        <SimpleImageEmpty v-if="org.selected.length === 0" :desc="$t('n.no_org_auth')" />
                        <template v-else v-for="item of org.options" :key="item.key">
                            <div v-for="(subItem, index) of item.list" :key="index" class="form-item afs">
                                <div class="key">{{ $t('authority.' + item.key + '.' + subItem.key + '.title') }}:</div>
                                <div class="value">
                                    <span
                                        class="authority-item"
                                        v-for="(threeItem, index) of subItem.list"
                                        :key="index"
                                    >
                                        <template v-if="$Util.Common.isMember(threeItem.id, org.selected)">
                                            <span>
                                                {{
                                                    $t(
                                                        'authority.' +
                                                            item.key +
                                                            '.' +
                                                            subItem.key +
                                                            '.' +
                                                            threeItem.key,
                                                    )
                                                }}
                                            </span>
                                            <span v-for="(fourItem, index) in threeItem.list" :key="fourItem.id">
                                                <template v-if="$Util.Common.isMember(fourItem.id, org.selected)">
                                                    {{
                                                        $t(
                                                            'authority.' +
                                                                item.key +
                                                                '.' +
                                                                subItem.key +
                                                                '.' +
                                                                threeItem.key,
                                                        ) +
                                                        $t(
                                                            'authority.' +
                                                                item.key +
                                                                '.' +
                                                                subItem.key +
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
                    </div>
                    <!-- 全部的 -->
                    <div v-else class="panel-content">
                        <template v-for="item of org.options" :key="item.key">
                            <div v-for="(subItem, index) of item.list" :key="index" class="form-item afs d-f-a">
                                <div class="key">{{ $t('authority.' + item.key + '.' + subItem.key + '.title') }}:</div>
                                <div class="value d-f">
                                    <template v-for="(threeItem, index) in subItem.list">
                                        <a-checkbox
                                            :checked="$Util.Common.isMember(threeItem.id, item.select)"
                                            :value="threeItem.id"
                                            @click="e => handleCheckboxChange(e, item.select)"
                                        >
                                            {{ $t('authority.' + item.key + '.' + subItem.key + '.' + threeItem.key) }}
                                        </a-checkbox>
                                        <a-checkbox
                                            v-for="(fourItem, index) in threeItem.list"
                                            :key="index"
                                            :checked="$Util.Common.isMember(fourItem.id, item.select)"
                                            :value="fourItem.id"
                                            @click="e => handleCheckboxChange(e, item.select)"
                                        >
                                            {{
                                                $t('authority.' + item.key + '.' + subItem.key + '.' + threeItem.key) +
                                                $t('authority.' + item.key + '.' + subItem.key + '.' + fourItem.key)
                                            }}
                                        </a-checkbox>
                                    </template>
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
import auth from '../../core/modules/units/auth';

const AUTH_LIST_TEMP = Core.Const.SYSTEM_AUTH.AUTH_LIST_TEMP;
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
                name: 'n.distributor_auth',
                type: USER_TYPE.DISTRIBUTOR, // 分销商
                edit: false,
                options: [],
                selected: [],
            },
            agent: {
                name: 'n.agent_auth',
                type: USER_TYPE.AGENT, // 零售商
                edit: false,
                options: [],
                selected: [],
            },
            store: {
                name: 'n.store_auth',
                type: USER_TYPE.STORE, // 门店
                edit: false,
                options: [],
                selected: [], // 用户底下的权限
            },
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
                    /* 
                        { 
                            id: 1,                             
                            key: "warehouse.list", 
                            name: "查看仓库列表", 
                            path: "", 
                            scope_type: 10,
                        }
                    */
                    console.log('getAllAuthItem res:', res);

                    let list =
                        [
                            {
                                id: 3,
                                key: 'test.oneMange1.bookList.edit',
                                name: '编辑',
                                path: '',
                                scope_type: 10,
                            },
                            {
                                id: 2,
                                key: 'test.oneMange1.bookList',
                                name: 'book列表1',
                                path: '',
                                scope_type: 10,
                            },
                            {
                                id: 1,
                                key: 'test.oneMange1',
                                name: '管理1',
                                path: '',
                                scope_type: 10,
                            },
                            // {
                            //     id: 4,
                            //     key: 'test.oneMange1.bookList1',
                            //     name: 'book列表2',
                            //     path: '',
                            //     scope_type: 10,
                            // },
                            // {
                            //     id: 5,
                            //     key: 'test.oneMange2',
                            //     name: '管理2',
                            //     path: '',
                            //     scope_type: 10,
                            // },
                            // {
                            //     id: 6,
                            //     key: 'test.oneMange2.bookList',
                            //     name: 'book列表2',
                            //     path: '',
                            //     scope_type: 10,
                            // },
                        ] || res.list;

                    this.authClass.handleAuthGrouping(list);
                    console.log('getAllAuthItem authItems', this.authItems);
                    // this.getOrgAuthFetch('distributor');
                    // this.getOrgAuthFetch('agent');
                    this.getOrgAuthFetch('store');
                })
                .catch(err => {
                    console.log('getAllAuthItem err:', err);
                });
        },
        // 获取 某类型组织 已分配的 权限项
        getOrgAuthFetch(user_type) {
            this[user_type].options = Core.Util.deepCopy(this.authItems);

            Core.Api.Authority.authOptions({
                org_type: this[user_type].type,
            })
                .then(res => {
                    let list =
                        [
                            {
                                id: 1,
                                key: 'test.oneMange1',
                                name: '管理1',
                                path: '',
                                scope_type: 10,
                            },
                            {
                                id: 2,
                                key: 'test.oneMange1.bookList',
                                name: 'book列表1',
                                path: '',
                                scope_type: 10,
                            },
                            {
                                id: 5,
                                key: 'test.oneMange2',
                                name: '管理2',
                                path: '',
                                scope_type: 10,
                            },
                            {
                                id: 6,
                                key: 'test.oneMange2.bookList',
                                name: 'book列表2',
                                path: '',
                                scope_type: 10,
                            },
                        ] || res.list;

                    this[user_type].selected = this.handleOrgAuthFilter(list);
                    console.log('getOrgAuth: ', this[user_type]);
                })
                .catch(err => {
                    console.log('getOrgAuth', user_type, 'err:', err);
                });
        },
        /* fetch end */

        // 进入编辑模式
        handleEditShow(type) {
            this[type].edit = true;
        },
        // 保存编辑
        handleEditSubmit(type) {
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
        // 取消编辑
        handleEditClose(type) {
            this[type].edit = false;
            this.getOrgAuthFetch(type);
        },

        // 对获取 某类型组织 已分配的 权限项过滤
        handleOrgAuthFilter(list) {
            let selected = [];
            list.forEach(auth => {
                let splitKey = auth.key.split('.');
                let lg = splitKey.length - 1;

                switch (lg) {
                    case 2:
                        selected.push(auth.id);
                        break;
                    case 3:
                        selected.push(auth.id);
                        break;

                    default:
                        break;
                }
            });
            console.log('selected', selected);
            return selected;
        },

        handleCheckboxChange(e, select) {
            let checked = e.target.checked;
            let value = Number(e.target.value);

            if (checked) {
                select.push(value);
            } else {
                const findIndex = select.findIndex(el => el === value);
                if (findIndex !== -1) {
                    select.splice(findIndex, 1);
                }
            }

            console.log('结果', select);
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

.d-f {
    display: flex;
}
.d-f-a {
    display: flex;
    align-items: center !important;
}
</style>
