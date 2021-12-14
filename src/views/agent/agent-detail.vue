<template>
    <div>
        <a-descriptions>
            <a-descriptions-item label="姓名">{{form.name}}</a-descriptions-item>
            <a-descriptions-item label="国家">{{form.country}}</a-descriptions-item>
            <a-descriptions-item label="手机号">{{form.phone}}</a-descriptions-item>
            <a-descriptions-item label="邮箱">{{form.email}}</a-descriptions-item>
        </a-descriptions>
    </div>
    <div id="AgentDetail">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="员工管理" @click="ToUser"><UserList :query="form"/><!--员工列表页面组件--></a-tab-pane>
            <a-tab-pane key="2" tab="订单列表">Content of Tab Pane 2</a-tab-pane>
            <a-tab-pane key="3" tab="。。。。">Content of Tab Pane 3</a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import UserList from '@/views/agent/components/UserList.vue';
import { defineComponent, ref } from 'vue';
import Core from '../../core';
export default {
    name: 'AgentDetail',
    components: { UserList },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            //标签页
            activeKey: ref('1'),
            // 页面跳转存id && 传 => 用户列表页面
            form: {
                id: '',
                name: '',
                password: '',
                phone: '',
                email: '',
                country: undefined,
            },
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
        //点击查看日志按钮，传递item对象
        ToUser() {
            //传参对象内容
            this.queryLog.jobId = item.jobId; 
        },
        getUserDetail(){
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
            }).catch(err => {
                console.log('getAgentDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

    }
};
</script>

<style lang="less" scoped>
// #AgentDetail {}
</style>