<template>
    <div class="PassWord">
        <div class="password-title">
            <div class="title">修改密码</div>
            <div class="form-block">
                <div class="form-title">输入密码</div>
                <div class="form-content">
                    <a-input v-model:value="form.password" placeholder="请输入新密码"/>
                    <a-input v-model:value="form.password" placeholder="请确认新密码"/>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary">确定</a-button>
            <a-button @click="routerChange('back')" type="primary" >取消</a-button>
        </div>
    </div>
    <a-modal v-model:visible="passShow" title="物流详情" class="password-edit-modal">
        <div class="modal-content">

        </div>
        <template #footer>
            <a-button key="back" @click="handleEditSubmit">确定</a-button>
            <a-button key="back" @click="detailShow = false">关闭</a-button>
        </template>
    </a-modal>
</template>

<script>
import Core from "../core";

export default {
    name: "PassWord",
    data() {
        return {
            // 加载
            loading: false,
            detail: {},
            form: {
                id: '',
                password: '',
            },
        };
    },
    methods: {
        handleSubmit(){
            Core.Api.PassWord.save(form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
    }
}


</script>

<style scoped>

</style>