<template>
    <div id="FaultEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? '编辑故障' : '新建故障' }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">故障名称:</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入故障名称"/>
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
    name: 'FaultEdit',
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
            }
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getFaultDetail();
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
        getFaultDetail() {
            this.loading = true;
            Core.Api.Fault.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getFaultDetail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
            }).catch(err => {
                console.log('getFaultDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleTypeSelect(val) {
            this.type = val
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.name) {
                return this.$message.warning('请输入故障名称')
            }
            Core.Api.Fault.save(form).then(() => {
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
// #FaultEdit {}
</style>