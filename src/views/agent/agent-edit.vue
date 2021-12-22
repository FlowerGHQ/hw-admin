<template>
<div id="AgentEdit" class="edit-container">
    <div class="title-container"><div class="title-area">{{form.id ? '编辑经销商' : '新建经销商'}}</div></div>
    <div class="form-block">
        <div class="form-title"><div class="title">基本信息</div></div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">经销商名:</div>
                <div class="value">
                    <a-input v-model:value="form.name" placeholder="请输入经销商"/>
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
                    <a-input v-model:value="form.email" placeholder="请输入经销商邮箱"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">国家:</div>
                <div class="value">
                    <!-- <a-select v-model:value="form.country" placeholder="请选择国家">
                        <a-select-option v-for="item of countryList" :key="item.name" :value="item.name">{{item.name}}</a-select-option>
                    </a-select> -->
                    <a-cascader 
                        placeholder="请选择大洲/国家" 
                        v-model:value="country_cascader" 
                        :options="countryOptions"
                        @change="handleSearch" 
                        :field-names="{ label: 'value', value: 'value' , children: 'children'}"
                        />

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
    name: 'AgentEdit',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            continentList: Core.Const.CONTINENT_LIST, // 大洲
            countryList: Core.Const.COUNTRY_LIST, // 国家
            countryOptions: Core.Const.CONTINENT_COUNTRY_LIST, // 大洲>国家

            country_cascader: [],
            detail: {},
            form: {
                id: '',
                name: '',
                phone: '',
                email: '',
                country: undefined,
                continent: undefined,
            }
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getAgentDetail();
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
        getAgentDetail() {
            this.loading = true;
            console.log("id",this.form.id)
            Core.Api.Agent.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getAgentDetail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
                // 回显大洲国家
                this.country_cascader[0] = this.detail.continent || ''
                this.country_cascader[1] = this.detail.country || ''
            }).catch(err => {
                console.log('getAgentDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            this.form.continent = this.country_cascader[0] || ''
            this.form.country = this.country_cascader[1] || ''
            let form = Core.Util.deepCopy(this.form)
            if (!form.name) {
                return this.$message.warning('请输入经销商名')
            }
            if (!form.phone) {
                return this.$message.warning('请输入经销商手机号')
            }
            if (!form.email) {
                return this.$message.warning('请输入经销商邮箱')
            }
            if (!form.country) {
                return this.$message.warning('请选择经销商国家')
            }
            Core.Api.Agent.save(form).then(() => {
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
// #AgentEdit {}
</style>