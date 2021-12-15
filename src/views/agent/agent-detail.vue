<template>
<div id="AgentDetail">
    <div>
        <a-descriptions>
            <a-descriptions-item label="姓名">{{detail.name}}</a-descriptions-item>
            <a-descriptions-item label="国家">{{detail.country}}</a-descriptions-item>
            <a-descriptions-item label="手机号">{{detail.phone}}</a-descriptions-item>
            <a-descriptions-item label="邮箱">{{detail.email}}</a-descriptions-item>
        </a-descriptions>
    </div>
    <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="UserList" tab="员工管理">
            <UserList :orgId="agent_id" v-if="activeKey === 'UserList'"/>
        </a-tab-pane>
        <a-tab-pane key="PurchaseList" tab="订单列表">
            <PurchaseList :agentId="agent_id"  v-if="activeKey === 'PurchaseList'"/>
        </a-tab-pane>
    </a-tabs>
</div>
</template>

<script>
import UserList from '@/components/UserList.vue';
import PurchaseList from '@/components/PurchaseOrderList.vue';
import Core from '../../core';
export default {
    name: 'AgentDetail',
    components: { UserList , PurchaseList },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            //标签页
            activeKey: 'UserList',

            agent_id: '',
            detail: {}
        };
    },
    watch: {},
    computed: {},
    created() {
        this.agent_id = Number(this.$route.query.id) || Core.Data.getOrgId()
        this.getAgentDetail();
    },
    methods: {
        getAgentDetail(){
            this.loading = true;
            Core.Api.Agent.detail({
                id: this.agent_id,
            }).then(res => {
                console.log('getAgentDetail res', res)
                this.detail = res.detail
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