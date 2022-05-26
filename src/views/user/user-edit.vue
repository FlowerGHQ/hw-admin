<template>
<div id="UserEdit" class="edit-container">
    <div class="title-container"><div class="title-area">{{form.id ? '编辑员工' : '新建员工'}}</div></div>
    <div class="form-block">
        <div class="form-title">
            <div class="title-colorful">基本信息</div>
        </div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">员工名:</div>
                <div class="value">
                    <a-input v-model:value="form.name" placeholder="请输入员工名"/>
                </div>
            </div>
            <template v-if="!form.id">
            <div class="form-item required" >
                <div class="key">账号:</div>
                <div class="value">
                    <a-input v-model:value="form.username" placeholder="请输入账号" autocomplete="off"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">密码:</div>
                <div class="value">
                    <a-input-password v-model:value="form.password" placeholder="请输入密码" autocomplete="off"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">手机号:</div>
                <div class="value">
                    <a-input v-model:value="form.phone" placeholder="请输入员工手机号"/>
                </div>
            </div>
            </template>
            <div class="form-item required">
                <div class="key">邮箱:</div>
                <div class="value">
                    <a-input v-model:value="form.email" placeholder="请输入员工邮箱"/>
                </div>
            </div>
<!--            <div class="form-item" v-if="$auth('MANAGER') && loginType == org_type">-->
<!--                <div class="key">员工角色:</div>-->
<!--                <div class="value">-->
<!--                    <a-select v-model:value="form.role_id" placeholder="请选择员工角色">-->
<!--                        <a-select-option v-for="(item,index) of roleList" :key="index" :value="item.id">{{item.name}}</a-select-option>-->
<!--                    </a-select>-->
<!--                </div>-->
<!--            </div>-->
        </div>
    </div>
    <div class="form-btns">
        <a-button @click="handleSubmit" type="primary" v-if="$auth('user.save','MANAGER')">确定</a-button>
        <a-button @click="routerChange('back')" type="primary" ghost>取消</a-button>
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

            org_type: '', // 想要编辑的 员工的组织类型
            form: {
                id: '',
                user_id: '',

                org_id: '', // 组织ID
                org_type: '', // 组织类型 平台、代理、经销、门店
                type: '', // 账号类型 维修工、普通员工（和org_type保持一致）
                // role_id: undefined,

                name: '',
                username: '',
                password: '',
                phone: '',
                email: '',
            }
        };
    },
    watch: {},
    computed: {},
    created() {
        let q = this.$route.query
        this.org_type = Number(q.org_type) || Core.Data.getOrgType()

        this.form.org_id = Number(q.org_id) || Core.Data.getOrgId()
        this.form.org_type = Number(q.org_type) || Core.Data.getOrgType()
        this.form.type = Number(q.type) || Number(q.org_type) || Core.Data.getLoginType()

        this.user_id = Number(q.id) || 0
        if (this.user_id) {
            this.getUserDetail();
        }

        if (this.$auth('MANAGER') && this.loginType == this.org_type) {
            this.getRoleList();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    let routeUrl = this.$router.resolve({
                        path: "/system/user-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getUserDetail() {
            this.loading = true;
            Core.Api.User.detail({
                id: this.user_id,
            }).then(res => {
                console.log('getUserDetail res', res)
                let d = res.detail
                this.detail = d
                this.form = {
                    id: d.account_id,
                    user_id: d.id,

                    // role_id: d.role_id || undefined,
                    org_id: d.org_id,
                    org_type: d.org_type,
                    type: d.type,

                    name: d.account.name,
                    username: d.account.username,
                    phone: d.account.phone,
                    email: d.account.email,
                }
            }).catch(err => {
                console.log('getUserDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            let apiName = form.id ? "update" : "save"
            if (!form.id) {
                if (!form.name) {
                    return this.$message.warning('请输入员工名')
                }
                if (!form.username) {
                    return this.$message.warning('请输入账号')
                }
                if (!form.password) {
                    return this.$message.warning('请输入密码')
                }
            }
            if (!form.phone) {
                return this.$message.warning('请输入员工手机号')
            }
            if (!form.email) {
                return this.$message.warning('请输入员工邮箱')
            }
            Core.Api.Account[apiName](form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },

        getRoleList() {
            Core.Api.Authority.roleList().then(res => {
                console.log('getRoleList res:', res)
                this.roleList = res.list
            })
        }
    }
};
</script>

<style lang="less" scoped>
// #UserEdit {}
</style>
