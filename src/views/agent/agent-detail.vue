<template>
    <div id="AgentDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t('a.detail') }}
                <a-tag v-if="$auth('ADMIN')" :color="detail.status ? 'green' : 'red'">
                    {{ detail.status ? $t('def.enable_ing') : $t('def.disable_ing') }}</a-tag
                >
            </div>
            <div class="btns-area" v-if="$auth('ADMIN')">
                <a-button type="primary" ghost @click="routerChange('edit')" v-if="$auth('agent.save')"
                    ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                >
                <!-- <a-button type="primary" ghost @click="handleDelete(agent_id)"><i class="icon i_delete"/>删除</a-button> -->
                <a-button
                    :type="detail.status ? 'default' : 'primary'"
                    :danger="detail.status ? true : false"
                    ghost
                    @click="handleStatusChange()"
                >
                    <template v-if="detail.status && $auth('agent.delete')"
                        ><i class="icon i_forbidden" />{{ $t('def.disable') }}</template
                    >
                    <template v-if="!detail.status && $auth('agent.enable')"
                        ><i class="icon i_enable" />{{ $t('def.enable') }}</template
                    >
                </a-button>
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <img :src="$Util.imageFilter(detail.logo, 3)" />
                        <span class="title">{{ detail.name }}</span>
                    </div>
                </div>
                <a-row class="desc-detail has-logo">
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('d.abbreviation') }}:</span>
                        <span class="value">&nbsp{{ detail.short_name }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('d.pay_type') }}：</span>
                        <span class="value">{{ $Util.payTypeFilter(detail.pay_type, $i18n.locale) || '-' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.contact') }}：</span>
                        <span class="value">{{ detail.contact }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.phone') }}：</span>
                        <span class="value">{{ detail.phone }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.email') }}：</span>
                        <span class="value">{{ detail.email }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.country') }}：</span>
                        <span class="value" v-if="this.$i18n.locale === 'zh'">{{ detail.country }}</span>
                        <span class="value" v-else>{{ detail.country_en }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.time') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                </a-row>
                <div class="desc-stat">
                    <a-statistic :title="$t('d.store')" :value="detail.store_count" />
                    <a-divider type="vertical" />
                    <a-statistic :title="$t('d.user')" :value="detail.user_count" />
                    <a-divider type="vertical" />
                    <a-statistic :title="$t('d.revenue')" :value="0" :precision="2" prefix="€" />
                    <a-divider type="vertical" />
                    <a-statistic :title="$t('d.orders')" :value="detail.order_count" />
                </div>
            </div>
        </div>
        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="UserList" :tab="$t('d.manage_employees')">
                    <UserList
                        :orgId="agent_id"
                        :orgType="ORG_TYPE.AGENT"
                        :type="USER_TYPE.AGENT"
                        v-if="activeKey === 'UserList'"
                    />
                </a-tab-pane>
                <!-- <a-tab-pane key="WorkerList" tab="维修工管理">
                <UserList :orgId="agent_id" :orgType="ORG_TYPE.AGENT" :type="USER_TYPE.WORKER" v-if="activeKey === 'WorkerList'"/>
            </a-tab-pane>-->
                <a-tab-pane key="PurchaseList" :tab="$t('d.order')">
                    <PurchaseList :orgId="agent_id" :orgType="ORG_TYPE.AGENT" v-if="activeKey === 'PurchaseList'" />
                </a-tab-pane>
                <template v-if="$auth('ADMIN', 'DISTRIBUTOR')">
                    <a-tab-pane key="StoreList" :tab="$t('d.manage_store')">
                        <StoreList
                            :agentId="agent_id"
                            :type="USER_TYPE.AGENT"
                            v-if="activeKey === 'StoreList'"
                            @change="getAgentDetail"
                        />
                    </a-tab-pane>
                </template>
                <template v-if="$auth('DISTRIBUTOR')">
                    <a-tab-pane key="PricingStructure" :tab="$t('d.item')">
                        <PricingStructure
                            :orgId="agent_id"
                            :orgType="USER_TYPE.AGENT"
                            v-if="activeKey === 'PricingStructure'"
                            :can-edit="$auth('DISTRIBUTOR')"
                        />
                    </a-tab-pane>
                </template>
                <a-tab-pane key="ReceiverAddress" :tab="$t('d.address')">
                    <ReceiverAddress
                        :orgId="agent_id"
                        :orgType="USER_TYPE.AGENT"
                        v-if="activeKey === 'ReceiverAddress'"
                    />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

import UserList from '@/components/panel/UserList.vue';
import StoreList from '@/components/panel/StoreList.vue';
import PurchaseList from '@/components/panel/PurchaseList.vue';
import PricingStructure from '@/components/panel/PricingStructure.vue';
import ReceiverAddress from '@/components/panel/ReceiverAddress.vue';

const USER_TYPE = Core.Const.USER.TYPE;
export default {
    name: 'AgentDetail',
    components: {
        UserList,
        StoreList,
        PurchaseList,
        PricingStructure,
        ReceiverAddress,
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
            agent_id: '',
            detail: {},
        };
    },
    watch: {},
    computed: {},
    created() {
        this.agent_id = Number(this.$route.query.id) || Core.Data.getOrgId();
        this.getAgentDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/distributor/agent-edit',
                        query: { id: this.agent_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'list': // liebiao
                    routeUrl = this.$router.resolve({
                        path: '/distributor/agent-list',
                        query: { id: this.agent_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getAgentDetail() {
            this.loading = true;
            Core.Api.Agent.detail({
                id: this.agent_id,
            })
                .then(res => {
                    console.log('getAgentDetail res', res);
                    this.detail = res.detail;
                })
                .catch(err => {
                    console.log('getAgentDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleStatusChange() {
            let _this = this;
            this.$confirm({
                title:
                    _this.$t('pop_up.sure') +
                    `${_this.detail.status ? _this.$t('pop_up.disable') : _this.$t('pop_up.enable')}` +
                    _this.$t('pop_up.agent'),
                okText: this.$t('pop_up.yes'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Agent.updateStatus({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(
                                `${_this.detail.status ? _this.$t('pop_up.success_disable') : _this.$t('pop_up.success_enable')}` +
                                    _this.$t('pop_up.success'),
                            );
                            _this.getAgentDetail();
                        })
                        .catch(err => {
                            console.log('handleStatusChange err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang="less" scoped>
// #AgentDetail {}
</style>
