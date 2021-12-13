<template>
<div id="DistributorEdit" class="edit-container">
    <div class="title-container"><div class="title-area">{{form.id ? '编辑经销商' : '新建经销商'}}</div></div>
    <div class="form-block">
        <div class="form-title">
            <div class="title-colorful">基本信息</div>
        </div>
        <div class="form-content">
            <div class="form-item required" v-if="!form.id">
                <div class="key">经销商名:</div>
                <div class="value">
                    <a-input v-model:value="form.name" placeholder="请输入经销商"/>
                </div>
            </div>
            <div class="form-item required" v-if="!form.id">
                <div class="key">密码:</div>
                <div class="value">
                    <a-input-password v-model:value="form.password" placeholder="请输入密码"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">手机号:</div>
                <div class="value">
                    <a-input v-model:value="form.phone" placeholder="请输入经销商手机号"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">邮箱:</div>
                <div class="value">
                    <a-input v-model:value="form.mail" placeholder="请输入经销商邮箱"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">国家:</div>
                <div class="value">
                    <a-select v-model:value="form.country" placeholder="请选择国家">
                        <a-select-option v-for="item of countryList" :key="item.label" :value="item.label">{{item.label}}</a-select-option>
                    </a-select>
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
    name: 'DistributorEdit',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            countryList: Core.Const.COUNTRY_LIST,
            detail: {},
            form: {
                id: '',
                name: '',
                password: '',
                phone: '',
                mail: '',
                country: undefined,
            }
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getDistributorDetail();
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
        getDistributorDetail() {
            this.loading = true;
            Core.Api.Dealers.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getDistributorDetail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
            }).catch(err => {
                console.log('getDistributorDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.id) {
                if (!form.name) {
                    return this.$message.warning('请输入经销商名')
                }
                if (!form.password) {
                    return this.$message.warning('请输入密码')
                }
            }
            if (!form.phone) {
                return this.$message.warning('请输入经销商手机号')
            }
            if (!form.mail) {
                return this.$message.warning('请输入经销商邮箱')
            }
            if (!form.country) {
                return this.$message.warning('请选择经销商国家')
            }
            Core.Api.Dealers.save(form).then(() => {
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
// #DistributorEdit {}
</style>