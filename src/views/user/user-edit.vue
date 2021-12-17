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
            <div class="form-item required" v-if="!form.id">
                <div class="key">账号:</div>
                <div class="value">
                    <a-input v-model:value="form.username" placeholder="请输入账号"/>
                </div>
            </div>
            <div class="form-item required" v-if="!form.id">
                <div class="key">密码:</div>
                <div class="value">
                    <a-input-password v-model:value="form.password" placeholder="请输入密码"/>
                </div>
            </div>
            <div class="form-item required" v-if="!form.id">
                <div class="key">手机号:</div>
                <div class="value">
                    <a-input v-model:value="form.phone" placeholder="请输入员工手机号"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">邮箱:</div>
                <div class="value">
                    <a-input v-model:value="form.email" placeholder="请输入员工邮箱"/>
                </div>
            </div>
            <!-- <div class="form-item" v-if="loginType < type">
                <div class="key">管理权限:</div>
                <div class="value">
                    <a-radio-group v-model:value="form.flag_admin" >
                        <a-radio :value="0">无</a-radio>
                        <a-radio :value="1">有</a-radio>
                    </a-radio-group>
                </div>
            </div> -->
        </div>
    </div>
    <div class="form-btns">
        <a-button @click="handleSubmit" type="primary">确定</a-button>
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
            USER_TYPE: Core.Const.USER.TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            user_id: '',
            org_id: '',
            org_type: '',
            type: '',

            detail: {},

            form: {
                id: '',
                name: '',
                username: '',
                password: '',
                phone: '',
                email: '',
                // flag_admin: 0,
            }
        };
    },
    watch: {},
    computed: {},
    created() {
        this.type = Number(this.$route.query.type) || 0
        this.user_id = Number(this.$route.query.id) || 0
        this.org_id = Number(this.$route.query.org_id) || 0
        if (this.user_id) {
            this.getUserDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        getUserDetail() {
            this.loading = true;
            Core.Api.User.detail({
                id: this.user_id,
            }).then(res => {
                console.log('getUserDetail res', res)
                this.detail = res.detail
                this.type = res.detail.type
                this.org_id = res.detail.org_id
                this.org_type = res.detail.org_type
                for (const key in this.form) {
                    this.form[key] = res.detail.account[key]
                }
                this.form.flag_admin = res.detail.flag_admin
            }).catch(err => {
                console.log('getUserDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
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
            this.org_type = this.type
            if (this.type == this.USER_TYPE.WORKER) this.org_type = this.USER_TYPE.STORE

            Core.Api.Account.save({
                ...form,
                type: this.type,
                org_id: this.org_id,
                org_type: this.org_type
            }).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        }
    }
};
</script>

<style lang="less" scoped>
// #UserEdit {}
</style>