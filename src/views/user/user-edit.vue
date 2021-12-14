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
                    <a-input v-model:value="form.name" placeholder="请输入员工"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">账号:</div>
                <div class="value">
                    <a-input v-model:value="form.username" placeholder="请输入账号"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">密码:</div>
                <div class="value">
                    <a-input v-model:value="form.password" placeholder="请输入密码"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">类型:</div>
                <div class="value">
                    <!-- <a-input v-model:value="form.password" placeholder="请选择类型"/> -->
                    <a-select v-model:value="form.password" placeholder="请选择类型">
                        <a-select-option value="10">管理员</a-select-option>
                        <a-select-option value="20">代理商</a-select-option>
                        <a-select-option value="30">门店</a-select-option>
                        <a-select-option value="40">终端用户</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item required">
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
        </div>
    </div>
    <div class="form-btns">
        <a-button @click="handleSubmit" type="primary">确定</a-button>
        <a-button @click="routerChange('back')" type="primary" ghost="">取消</a-button>
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
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {},
            form: {
                id: '',
                name: '',
                username: '',
                password: '',
                type: '',
                phone: '',
                email: '',
            }
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
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
            console.log("id",this.form.id)
            Core.Api.User.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getUserDetail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail.account[key]
                }
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
            if (!form.type) {
                return this.$message.warning('请输入员工类型')
            }
            if (!form.phone) {
                return this.$message.warning('请输入员工手机号')
            }
            if (!form.email) {
                return this.$message.warning('请输入员工邮箱')
            }
            Core.Api.Account.save(form).then(() => {
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