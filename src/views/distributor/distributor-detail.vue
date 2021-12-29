<template>
    <div id="DistributorDetail" class='list-container'>
        <div class="title-container">
            <div class="title-area">分销商详情 <a-tag v-if="$auth('ADMIN')" :color='detail.status ? "green" : "red"'>{{detail.status ? '启用中' : '已禁用'}}</a-tag></div>
            <div class="btns-area" v-if="$auth('ADMIN')">
                <a-button type="primary" ghost @click="routerChange('edit')"><i class="icon i_edit"/>编辑</a-button>
                <a-button :type="detail.status ? 'default' : 'primary'" :danger="detail.status ? true : false" ghost @click="handleStatusChange()">
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
                    <a-statistic title="总订单数" :value="detail.order_count" />
                </div>
            </div>
        </div>
        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="AgentList" tab="经销商管理" v-if="loginType == USER_TYPE.ADMIN">
                    <AgentList :orgId="distributor_id" :type="USER_TYPE.DISTRIBUTOR" v-if="activeKey === 'AgentList'" @change="getDistributorDetail"/>
                </a-tab-pane>
                <a-tab-pane key="StoreList" tab="门店管理" v-if="loginType == USER_TYPE.ADMIN">
                    <StoreList :orgId="distributor_id" :type="USER_TYPE.DISTRIBUTOR" v-if="activeKey === 'StoreList'" @change="getDistributorDetail"/>
                </a-tab-pane>
                <a-tab-pane key="UserList" tab="员工管理">
                    <UserList :orgId="distributor_id" :orgType="ORG_TYPE.DISTRIBUTOR" :type="USER_TYPE.DISTRIBUTOR" v-if="activeKey === 'UserList'"/>
                </a-tab-pane>
                <a-tab-pane key="WorkerList" tab="维修工管理">
                    <UserList :orgId="distributor_id" :orgType="ORG_TYPE.DISTRIBUTOR" :type="USER_TYPE.WORKER" v-if="activeKey === 'WorkerList'"/>
                </a-tab-pane>
                <a-tab-pane key="PurchaseList" tab="订单列表">
                    <PurchaseList :orgId="distributor_id"  v-if="activeKey === 'PurchaseList'"/>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import StoreList from '@/components/StoreList.vue';
import UserList from '@/components/UserList.vue';
import PurchaseList from '@/components/PurchaseOrderList.vue';
import AgentList from '@/components/AgentList.vue';

const USER_TYPE = Core.Const.USER.TYPE;
export default {
    name: 'DistributorDetail',
    components: {
        UserList,
        StoreList,
        PurchaseList,
        AgentList,
    },
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
            distributor_id: '',
            detail: {}
        };
    },
    watch: {},
    computed: {},
    created() {
        this.distributor_id = Number(this.$route.query.id) || Core.Data.getOrgId()
        this.getDistributorDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/distributor/distributor-edit",
                        query: { id: this.distributor_id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'list':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/distributor/distributor-list",
                        query: { id: this.distributor_id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },

        getDistributorDetail() {
            this.loading = true;
            Core.Api.Distributor.detail({
                id: this.distributor_id,
            }).then(res => {
                console.log('getDistributorDetail res', res)
                this.detail = res.detail
            }).catch(err => {
                console.log('getDistributorDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 删除 经销商
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该分销商吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Distributor.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.routerChange('list');
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        handleStatusChange() {
            let _this = this;
            this.$confirm({
                title: `确定要${_this.detail.status ? '禁用' : '启用'}该分销商吗？`,
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Distributor.updateStatus({id:_this.detail.id}).then(() => {
                        _this.$message.success(`${_this.detail.status ? '禁用' : '启用'}成功`);
                        _this.getDistributorDetail();
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
// #DistributorDetail {}
</style>