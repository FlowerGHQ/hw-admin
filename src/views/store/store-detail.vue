<template>
<div id="StoreDetail" class="list-container">
    <div class="title-container">
        <div class="title-area">门店详情 <a-tag v-if="$auth('ADMIN')" :color='detail.status ? "green" : "red"'>{{detail.status ? '启用中' : '已禁用'}}</a-tag></div>
        <div class="btns-area" v-if="$auth('ADMIN')">
            <a-button type="primary" ghost @click="routerChange('edit')"><i class="icon i_edit"/>编辑</a-button>
            <!-- <a-button type="primary" ghost @click="handleDelete(store_id)"><i class="icon i_delete"/>删除</a-button> -->
            <a-button :type="detail.status ? 'danger' : 'primary'" ghost @click="handleStatusChange()">
                <template v-if="detail.status"><i class="icon i_forbidden"/>禁用</template>
                <template v-else><i class="icon i_enable"/>启用</template>
            </a-button>
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
                    <span class="key">创建时间：</span>
                    <span class="value">{{$Util.timeFilter(detail.create_time)}}</span>
                </a-col>
                <a-col :xs='24' :sm='12' :lg='8' class='detail-item' v-if="$auth('ADMIN')">
                    <span class="key">所属经销商：</span>
                    <a @click="routerChange('agent-detail', detail)">{{detail.agent_name}}</a>
                </a-col>

            </a-row>
            <div class='desc-stat'>
                <a-statistic title="员工数量" :value="detail.user_count"/>
                <a-divider type="vertical" />
                <a-statistic title="维修工数量" :value="detail.repair_worker_count" />
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
                <UserList :orgType="ORG_TYPE.STORE" :orgId="store_id" :type="USER_TYPE.STORE" v-if="activeKey == 'UserList'"/>
            </a-tab-pane>
            <a-tab-pane key="WorkerList" tab="维修工管理">
                <UserList :orgType="ORG_TYPE.STORE" :orgId="store_id"  :type="USER_TYPE.WORKER" v-if="activeKey == 'WorkerList'"/>
            </a-tab-pane>
            <a-tab-pane key="PurchaseList" tab="订单列表">
                <PurchaseList :orgId="store_id" v-if="activeKey == 'PurchaseList'"/>
            </a-tab-pane>
        </a-tabs>
    </div>
</div>
</template>

<script>
import Core from '../../core';

import UserList from '@/components/UserList.vue';
import PurchaseList from '@/components/PurchaseOrderList.vue';

const USER_TYPE = Core.Const.USER.TYPE;
export default {
    name: 'StoreDetail',
    components: { UserList , PurchaseList },
    props: {},
    data() {
        return {
            USER_TYPE,
            ORG_TYPE: Core.Const.LOGIN.TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            //标签页
            activeKey: 'UserList',

            store_id: '',
            detail: {},
        };
    },
    watch: {},
    computed: {},
    created() {
        this.store_id = Number(this.$route.query.id) || 0
        this.getStoreDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/store/store-edit",
                        query: { id: this.store_id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'list':  // 列表
                    routeUrl = this.$router.resolve({
                        path: "/store/store-list",
                        query: { id: this.store_id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'agent-detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/agent/agent-detail",
                        query: { id: this.detail.agent_id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;

            }
        },
        // 删除门店
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该门店吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    console.log(_this.store_id);
                    Core.Api.Store.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.routerChange('list');
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        getStoreDetail(){
            this.loading = true;
            Core.Api.Store.detail({
                id: this.store_id,
            }).then(res => {
                console.log('getStoreDetail res', res)
                this.detail = res.detail
            }).catch(err => {
                console.log('getStoreDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleStatusChange() {
            let _this = this;
            this.$confirm({
                title: `确定要${_this.detail.status ? '禁用' : '启用'}该门店吗？`,
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Store.updateStatus({id:_this.detail.id}).then(() => {
                        _this.$message.success(`${_this.detail.status ? '禁用' : '启用'}成功`);
                        _this.getStoreDetail();
                    }).catch(err => {
                        console.log("handleStatusChange err", err);
                    })
                },
            });
        }
    }
};
</script>

<style lang="less" scoped>
// #AgentDetail {}
</style>