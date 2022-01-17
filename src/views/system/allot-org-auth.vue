<template>
<div id="AllotOrgAuth">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">组织权限管理</div>
        </div>
        <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
            <template #expandIcon></template>
            <a-collapse-panel v-for="(org,key) of orgType" :key="key" :header="org.name" class="gray-collapse-panel">
                <template #extra>
                    <a-button @click.stop="handleEditShow(key)" type="link" v-if="!org.edit"><i class="icon i_edit"/>设置</a-button>
                    <template v-else>
                        <a-button @click.stop="handleEditSubmit(key)" type="link"><i class="icon i_confirm"/>保存</a-button>
                        <a-button @click.stop="handleEditClose(key)" type="link" class="cancel"><i class="icon i_close_c"/>取消</a-button>
                    </template>
                </template>
                <div class="panel-content" v-if="!org.edit">
                    <SimpleImageEmpty v-if="$Util.isEmptyObj(org.selected)" desc='该类型的组织尚未分配可管理权限'/>
                    <template v-for="item of org.options" :key="item.key">
                        <div class="form-item afs" v-if="item.select.length">
                            <div class="key">{{item.name}}:</div>
                            <div class="value">
                                <span class="authority-item" v-for="i of item.select" :key="i">{{org.selected[i]}}</span>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="panel-content" v-else>
                    <template v-for="item of org.options" :key="item.key">
                        <div class="form-item afs" v-if="item.list.length">
                            <div class="key">{{item.name}}:</div>
                            <div class="value">
                                <a-checkbox-group :options="item.list" v-model:value="item.select"/>
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
import SimpleImageEmpty from '../../components/common/SimpleImageEmpty.vue'

const AUTH_LIST_TEMP = Core.Const.AUTH_LIST_TEMP
const USER_TYPE = Core.Const.USER.TYPE

export default {
    name: 'AllotOrgAuth',
    components: { SimpleImageEmpty },
    props: {},
    data() {
        return {
            activeKey: [],

            authItems: Core.Util.deepCopy(AUTH_LIST_TEMP), // 所有权限

            distributor: {
                name: '代理商权限管理',
                type: USER_TYPE.DISTRIBUTOR,
                edit: false,
                options: [],
                selected: {},
            },
            agent: {
                name: '零售商权限管理',
                type: USER_TYPE.AGENT,
                edit: false,
                options: [],
                selected: {},
            },
            store: {
                name: '门店权限管理',
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
            }
        }
    },
    created() {
        this.getAllAuthItem();
    },
    mounted() {
        this.activeKey = ['distributor', 'agent', 'store']
    },
    methods: {
        getAllAuthItem() { // 获取所权限项
            Core.Api.Authority.allOptions().then(res => {
                console.log('getAllAuthItem res:', res)
                let list = res.list
                list.map(auth => {
                    let key = auth.key.split('.')[0];
                    let item = this.authItems.find(i => key === i.key);
                    if (item) {
                        item.list.push({ value: auth.id, label: auth.name });
                    }
                })
                console.log("getAllAuthItem authItems", this.authItems)
                this.getOrgAuth('distributor');
                this.getOrgAuth('agent');
                this.getOrgAuth('store');
            }).catch(err => {
                console.log('getAllAuthItem err:', err)
            })
        },
        getOrgAuth(user_type) { // 获取 某类型组织 已分配的 权限项
            this[user_type].options = Core.Util.deepCopy(this.authItems)
            Core.Api.Authority.authOptions({
                org_type: this[user_type].type
            }).then(res => {
                console.log('getOrgAuth', user_type, 'res:', res)
                let selected = {}
                res.list.forEach(auth => {
                    selected[auth.id] = auth.name
                    let key = auth.key.split('.')[0];
                    let item = this[user_type].options.find(i => key === i.key);
                    if (item) {
                        item.select.push(auth.id);
                    }
                })
                this[user_type].selected = selected
                console.log('getOrgAuth', user_type, this[user_type])
            }).catch(err => {
                console.log('getOrgAuth', user_type, 'err:', err)
            })
        },

        handleEditShow(type) { // 进入编辑模式
            this[type].edit = true
        },
        handleEditSubmit(type) { // 保存编辑
            let list = []
            for (const item of this[type].options) {
                list.push(...item.select)
            }
            Core.Api.Authority.allotOrgAuth({
                org_type: this[type].type,
                authority_ids: list.join(','),
            }).then(() => {
                this.$message.success('保存成功')
                this.handleEditClose(type)
            })
        },
        handleEditClose(type) { // 取消编辑
            this[type].edit = false
            this.getOrgAuth(type)
        },
    }
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
    .ant-collapse-extra {
        position: relative;
        .ant-btn {
            font-size: 12px;
            height: 20px;
            &.cancel {
                color: #8090A6;
            }
            .icon {
                font-size: 12px;
            }
        }
    }
}
</style>