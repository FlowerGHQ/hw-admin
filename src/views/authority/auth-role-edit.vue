<template>
    <div id="AuthRoleEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? '编辑角色' : '新建角色' }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">角色名称</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入角色名称"/>
                    </div>
                </div>
                <div class="form-item textarea">
                    <div class="key">角色描述:</div>
                    <div class="value">
                        <a-textarea v-model:value="form.remark" placeholder="请输入角色描述"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                        <span class="content-length">{{ form.remark.length }}/99</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">权限分配</div>
            </div>
            <div class="form-content long-key">
                <template v-for="item of authItems" :key="item.key">
                    <div class="form-item afs" v-if="item.list.length">
                        <div class="key">{{ item.name }}:</div>
                        <div class="value">
                            <a-checkbox-group :options="item.list" v-model:value="item.select"/>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('role.save')">确定</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost>取消</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

const AUTH_LIST_TEMP = Core.Const.AUTH_LIST_TEMP

export default {
    name: 'AuthRoleEdit',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            id: '',
            detail: {},

            authItems: Core.Util.deepCopy(AUTH_LIST_TEMP),

            form: {
                id: '',
                name: '',
                remark: '',
            }
        };
    },
    watch: {},
    computed: {},
    created() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getAuthRoleDetail();
        }
        this.getAuthOptions()
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        getAuthRoleDetail() { // 获取角色详情
            this.loading = true;
            Core.Api.Authority.roleDetail({
                id: this.form.id,
            }).then(res => {
                console.log('getAuthRoleDetail res', res)
                this.detail = res.role
                for (const key in this.form) {
                    this.form[key] = res.role[key]
                }
            }).catch(err => {
                console.log('getAuthRoleDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getAuthOptions() { // 获取 某个身份下 可选的权限项
            let apiName = this.$auth('ADMIN') ? 'allOptions' : 'authOptions'
            Core.Api.Authority[apiName]({
                org_type: Core.Data.getOrgType(),
            }).then(res => {
                console.log('getAuthOptions res:', res)
                let list = res.list
                list.map(auth => {
                    let key = auth.key.split('.')[0];
                    let item = this.authItems.find(i => key === i.key);
                    if (item) {
                        item.list.push({value: auth.id, label: auth.name});
                    }
                })
                if (this.form.id) {
                    this.getRoleSelectedAuth();
                }
            }).catch(err => {
                console.log('getAuthOptions err:', err)
            })
        },
        getRoleSelectedAuth() { // 某个角色 已选的权限
            Core.Api.Authority.authSelected({
                role_id: this.form.id,
            }).then(res => {
                console.log('getRoleSelectedAuth res:', res)
                res.list.forEach(auth => {
                    let key = auth.key.split('.')[0];
                    let item = this.authItems.find(i => key === i.key);
                    if (item) {
                        item.select.push(auth.id);
                    }
                })
            }).catch(err => {
                console.log('getRoleSelectedAuth err:', err)
            })
        },

        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('handleSubmit form:', form)
            if (!form.name) {
                return this.$message.warning('请输入角色名称')
            }
            let list = []
            for (const item of this.authItems) {
                list.push(...item.select)
            }
            Core.Api.Authority.roleEdit({
                ...form,
                authority_ids: list.join(','),
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

<style lang="less">
#AuthRoleEdit {
    .ant-checkbox + span {
        padding-right: 8px;
        padding-left: 8px;
        width: 100px;
    }
}
</style>