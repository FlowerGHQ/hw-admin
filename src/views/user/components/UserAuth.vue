<template>
    <div id="AllotUserAuth">
        <div class="list-container">
            <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                <template #expandIcon></template>
                <a-collapse-panel v-for="(org,key) of orgType" :key="key" :header="name" class="gray-collapse-panel">
                    <template #extra>
                        <a-button @click.stop="handleEditShow(key)" type="link" v-if="!edit && $auth('authority.save', 'MANAGER')"><i class="icon i_edit"/>设置</a-button>
                        <template v-else>
                            <a-button @click.stop="handleEditSubmit(key)" type="link" v-if="$auth('authority.save', 'MANAGER')"><i class="icon i_confirm"/>保存</a-button>
                            <a-button @click.stop="handleEditClose(key)" type="link" class="cancel" v-if="$auth('authority.save', 'MANAGER')"><i class="icon i_close_c"/>取消</a-button>
                        </template>
                    </template>
                    <div class="panel-content" v-if="!edit">
                        <SimpleImageEmpty v-if="$Util.isEmptyObj(selected)" desc='该用户尚未分配可管理权限'/>
                        <template v-for="item of options" :key="item.key">
                            <div class="form-item afs" v-if="item.select.length">
                                <div class="key">{{item.name}}:</div>
                                <div class="value">
                                    <span class="authority-item" v-for="i of item.select" :key="i">
                                        <a @click="handleScopedTypeShow(selected[i].scoped_type)" v-if = "selected[i].scoped_type > 0">
                                            {{selected[i].key}}
                                            {{$t('authority.'+ selected[i].key)}}
                                            {{$t("authority.\'distributor.save\'")}}

                                        </a>
                                        <span v-else>
                                            {{selected[i].key}}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="panel-content" v-else>
                        <template v-for="item of options" :key="item.key">
                            <div class="form-item afs" v-if="item.list.length">
                                <div class="key">{{item.name}}:</div>
                                <div class="value">
                                    <a-checkbox-group v-model:value="item.select" >
                                        <a-checkbox v-for="it in item.list" :value="it.value" :disabled="it.disabled">{{ it.label }}</a-checkbox>
                                    </a-checkbox-group>
                                </div>
                            </div>
                        </template>
                    </div>
                </a-collapse-panel>
            </a-collapse>
        </div>
        <a-modal v-model:visible="scopedShow" :title="resourceMap[scopedType].text + '资源管理'" class="stock-change-modal" :width="800" :after-close="handleScopedTypeClose">
            <UserScoped :userId="userId" :userType="detail.type" :resourceType="scopedType" />
            <template #footer>
                <a-button @click="scopedShow=false">关闭</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../../core';
import SimpleImageEmpty from '../../../components/common/SimpleImageEmpty.vue'
import UserScoped from "./UserScoped.vue";

const AUTH_LIST_TEMP = Core.Const.AUTH_LIST_TEMP
const USER_TYPE = Core.Const.USER.TYPE
const AUTHORITY_SCOPED = Core.Const.AUTHORITY_SCOPED

export default {
    name: 'UserAuth',
    components: { SimpleImageEmpty, UserScoped },
    props: {
        userId: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {}
            }
        },
        type: {
            type: String,
        },
    },
    data() {
        return {
            AUTHORITY_SCOPED,
            activeKey: [],
            authItems: Core.Util.deepCopy(AUTH_LIST_TEMP), // 所有权限
            name: '权限查看',
            edit: false,
            scopedShow: false,
            resourceMap: Core.Const.NOTICE.RESOURCE_TYPE_MAP,
            scopedType: 0,
            options: [],
            selected: {},
            disabled: {},

        };
    },

    watch: {},
    computed: {
        orgType() {
            return {
                distributor: this.distributor,

            }
        }
    },
    created() {
        this.getAllAuthItem();
    },
    mounted() {
        this.activeKey = ['distributor']
    },
    methods: {
        getAllAuthItem() { // 获取所权限项
            let url = "authOptions"
            switch (this.detail.org_type){
                case Core.Const.USER.TYPE.ADMIN:
                    url = "allOptions";
                    break;
            }
            console.log("url", url)
            Core.Api.Authority[url]({
                org_type: this.detail.org_type
            }).then(res => {
                console.log('getAllAuthItem res:', res)
                let list = res.list
                list.map(auth => {
                    let key = auth.key.split('.')[0];
                    let item = this.authItems.find(i => key === i.key);
                    if (item) {
                        item.list.push({ value: auth.id, label: auth.name, scoped_type: auth.scoped_type });
                    }
                })
                console.log("getAllAuthItem authItems", this.authItems)

                this.getUserRoleAuth();

            }).catch(err => {
                console.log('getAllAuthItem err:', err)
            })
        },
        getUserRoleAuth() { // 获取 某类型组织 已分配的 权限项
            this.options = Core.Util.deepCopy(this.authItems)
            Core.Api.Authority.authRoleUser({
                user_id: this.userId,
            }).then(res => {
                let selected = {}
                res.list.forEach(auth => {
                    let selectedInfo ={
                        key: auth.key,
                        scoped_type: 0
                    }
                    selected[auth.id] = selectedInfo;
                    let key = auth.key.split('.')[0];
                    let item = this.options.find(i => key === i.key);
                    if (item) {
                        item.select.push(auth.id);
                        selected[auth.id].scoped_type = auth.scoped_type;
                        item.list.forEach(it => {
                                if (it.value == auth.id) {
                                    it.disabled = true
                                }
                            }
                        )
                        console.log("item", item)
                    }
                })
                this.selected = selected
                this.getUserAuth();
            }).catch(err => {
            })
        },
        getUserAuth() { // 获取 某类型组织 已分配的 权限项
            Core.Api.Authority.authUser({
                user_id: this.userId,
                user_type: this.detail.type
            }).then(res => {
                let selected = this.selected;
                res.list.forEach(auth => {
                    let selectedInfo = {
                        key: auth.key,
                        scoped_type: 0
                    }
                    selected[auth.id] = selectedInfo;
                    let key = auth.key.split('.')[0];
                    let item = this.options.find(i => key === i.key);
                    if (item) {
                        if(item.select.indexOf(auth.id) == -1){
                            item.select.push(auth.id);
                        }

                        selected[auth.id].scoped_type = auth.scoped_type;
                    }
                })
                this.selected = selected
            }).catch(err => {
            })
        },

        handleEditShow() { // 进入编辑模式
            this.edit = true
        },
        handleEditSubmit() { // 保存编辑
            let list = []
            for (const item of this.options) {
                //只保存属于该用户的权限
                let add = item.select.filter(it => !item.list.some(ele=>ele.value===it && ele.disabled == true));
                list.push(...add)

            }
            console.log("add", list)
            Core.Api.Authority.allotUser({
                user_id: this.userId,
                user_type: this.detail.type,
                authority_ids: list.join(','),
            }).then(() => {
                this.$message.success('保存成功')
                this.handleEditClose()
            })
        },
        handleEditClose() { // 取消编辑
            this.edit = false

            this.getUserRoleAuth()
        },
        handleScopedTypeShow(scoped_type) {
            this.scopedType = scoped_type;
            this.scopedShow = true;
            // let routeUrl = this.$router.resolve({
            //     path: "/system/user-scoped",
            //     query: {
            //         user_id: this.userId,
            //         user_type: this.detail.type,
            //         resource_type: scoped_type,
            //     }
            // })
            // window.open(routeUrl.href, '_self')

        },
        handleScopedTypeClose() { // 取消编辑
            this.scopedShow = false
        },

    }
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
                color: #8090A6;
            }
            .icon {
                font-size: 12px;
            }
        }
    }
}
</style>