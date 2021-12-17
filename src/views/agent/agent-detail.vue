<template>
<div id="AgentDetail" class='list-container'>
    <div class="title-container">
        <div class="title-area">经销商详情</div>
        <div class="btns-area">
            <a-button type="primary" ghost @click="routerChange('edit')"><i class="icon i_edit"/>编辑</a-button>
            <a-button type="primary" ghost @click="handleDelete(agent_id)"><i class="icon i_delete"/>删除</a-button>
        </div>
    </div>
    <div class="gray-panel">
        <div class="panel-content desc-container">
            <div class="desc-title">
                <div class="title-area">
                    <img :src="$Util.imageFilter(detail.logo, 3)" />
                    <span class="title">{{detail.name}}</span>
                </div>
            </div>
            <a-row class="desc-detail has-logo">
                <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                    <span class="key">手机号：</span>
                    <span class="value">{{detail.phone}}</span>
                </a-col>
                <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                    <span class="key">邮箱：</span>
                    <span class="value">{{detail.email}}</span>
                </a-col>
                <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                    <span class="key">国家：</span>
                    <span class="value">{{detail.country}}</span>
                </a-col>
                <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                    <span class="key">创建时间：</span>
                    <span class="value">{{$Util.timeFilter(detail.create_time)}}</span>
                </a-col>
            </a-row>
            <div class='desc-stat'>
                <a-statistic title="门店数" :value="detail.store_count" />
                <a-divider type="vertical" />
                <a-statistic title="员工数" :value="detail.user_count"/>
                <a-divider type="vertical" />
                <a-statistic title="累计营收" :value="0" :precision="2" prefix='￥'/>
                <a-divider type="vertical" />
                <a-statistic title="总订单数" :value="0" />
            </div>
        </div>
    </div>
    <div class="tabs-container">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="UserList" tab="员工管理">
                <UserList :orgId="agent_id" :type="USER_TYPE.AGENT" v-if="activeKey === 'UserList'"/>
            </a-tab-pane>
            <a-tab-pane key="StoreList" tab="门店管理" v-if="loginType == USER_TYPE.ADMIN">
                <StoreList :orgId="agent_id" :type="USER_TYPE.AGENT" v-if="activeKey === 'StoreList'"/>
            </a-tab-pane>
            <a-tab-pane key="PurchaseList" tab="订单列表">
                <PurchaseList :orgId="agent_id"  v-if="activeKey === 'PurchaseList'"/>
            </a-tab-pane>
        </a-tabs>
    </div>
</div>
</template>

<script>
import Core from '../../core';

import UserList from '@/components/UserList.vue';
import PurchaseList from '@/components/PurchaseOrderList.vue';
import StoreList from './components/StoreList.vue';

const USER_TYPE = Core.Const.USER.TYPE;
export default {
    name: 'AgentDetail',
    components: {
        UserList,
        StoreList,
        PurchaseList,
    },
    props: {},
    data() {
        return {
            USER_TYPE,
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
        routerChange(type) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/agent/agent-edit",
                        query: { id: this.agent_id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'list':  // liebiao
                    routeUrl = this.$router.resolve({
                        path: "/agent/agent-list",
                        query: { id: this.agent_id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        // 删除 经销商
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该经销商吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    // console.log(this.agent_id);
                    Core.Api.Agent.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.routerChange('list');
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
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
