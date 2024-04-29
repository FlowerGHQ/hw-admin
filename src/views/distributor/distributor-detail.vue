<template>
    <div id="DistributorDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t('d.distributor_detail') }}
                <a-tag v-if="$auth('ADMIN')" :color="detail.status ? 'green' : 'red'">
                    {{ detail.status ? $t('def.enable_ing') : $t('def.disable_ing') }}
                </a-tag>
            </div>
            <div class="btns-area" v-if="$auth('ADMIN')">
                <a-button
                    v-if="$auth('sales.distribution.distributor.edit')"
                    type="primary"
                    ghost
                    @click="routerChange('edit')"
                >
                    <i class="icon i_edit" />{{ $t('def.edit') }}
                </a-button>
                <a-button
                    v-if="$auth('sales.distribution.distributor.forbidden')"
                    :type="detail.status ? 'null' : 'primary'"
                    :danger="detail.status ? true : false"
                    ghost
                    @click="handleStatusChange()"
                >
                    <template v-if="detail.status"><i class="icon i_forbidden" />{{ $t('def.disable') }}</template>
                    <template v-if="!detail.status"><i class="icon i_enable" />{{ $t('def.enable') }}</template>
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
                        <span class="key">{{ $t('d.abbreviation') }}：</span>
                        <span class="value">&nbsp;{{ detail.short_name }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('d.pay_type') }}：</span>
                        <span class="value">{{ $Util.payTypeFilter(detail.pay_type, $i18n.locale) || '-' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('d.company') }}：</span>
                        <span class="value">{{ detail.company_name }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('d.id') }}：</span>
                        <span class="value">{{ detail.tax_no }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('d.port') }}：</span>
                        <span class="value">{{ detail.receive_port }}</span>
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
                        <span class="key">{{ $t('d.sales_area') }}：</span>
                        <a-tooltip :title="salesAreaStr">
                            <span class="value">
                                {{ salesAreaStr }}
                            </span>
                        </a-tooltip>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.time') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                </a-row>
                <div class="desc-stat">
                    <a-statistic :title="$t('d.agent')" :value="detail.agent_count" />
                    <a-divider type="vertical" />
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
                        :orgId="distributor_id"
                        :orgType="ORG_TYPE.DISTRIBUTOR"
                        :type="USER_TYPE.DISTRIBUTOR"
                        v-if="activeKey === 'UserList'"
                    />
                </a-tab-pane>
                <!-- <a-tab-pane key="WorkerList" tab="维修工管理">
                    <UserList :orgId="distributor_id" :orgType="ORG_TYPE.DISTRIBUTOR" :type="USER_TYPE.WORKER" v-if="activeKey === 'WorkerList'"/>
                </a-tab-pane>-->
                <a-tab-pane key="PurchaseList" :tab="$t('d.order')">
                    <PurchaseList
                        :orgId="distributor_id"
                        :orgType="ORG_TYPE.DISTRIBUTOR"
                        v-if="activeKey === 'PurchaseList'"
                    />
                </a-tab-pane>
                <template v-if="$auth('ADMIN')">
                    <a-tab-pane key="AgentList" :tab="$t('d.manage_agent')">
                        <AgentList
                            :distributorId="distributor_id"
                            :type="USER_TYPE.DISTRIBUTOR"
                            v-if="activeKey === 'AgentList'"
                        />
                    </a-tab-pane>
                    <a-tab-pane key="StoreList" :tab="$t('d.manage_store')">
                        <StoreList
                            :distributorId="distributor_id"
                            :type="USER_TYPE.DISTRIBUTOR"
                            v-if="activeKey === 'StoreList'"
                        />
                    </a-tab-pane>
                    <!-- 钱包 -->
                    <a-tab-pane key="WalletList" :tab="$t('distributor-detail.wallet')">
                        <AccountWallet
                            v-if="activeKey === 'WalletList'"
                            :detail="detail"
                            @handleUpdateDetails="getDistributorDetail"
                        />
                    </a-tab-pane>
                </template>
                <a-tab-pane key="ReceiverAddress" :tab="$t('d.address')">
                    <ReceiverAddress
                        :orgId="distributor_id"
                        :orgType="USER_TYPE.DISTRIBUTOR"
                        v-if="activeKey === 'ReceiverAddress'"
                    />
                </a-tab-pane>
                <template v-if="$auth('DISTRIBUTOR')">
                    <!-- 账户钱包 -->
                    <a-tab-pane key="AccountWallet" :tab="$t('distributor-detail.wallet')">
                        <AccountWallet
                            v-if="activeKey === 'AccountWallet'"
                            :detail="detail"
                            @handleUpdateDetails="getDistributorDetail"
                        />
                    </a-tab-pane>
                </template>
                <template v-if="$auth('ADMIN')">
                    <!-- 支付设置 -->
                    <a-tab-pane key="PaymentSetting" :tab="$t('distributor-detail.payment_settings')">
                        <PaymentSetting v-if="activeKey === 'PaymentSetting'" :detail="detail" />
                    </a-tab-pane>
                </template>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import UserList from '@/components/panel/UserList.vue';
import AgentList from '@/components/panel/AgentList.vue';
import StoreList from '@/components/panel/StoreList.vue';
import WalletList from '@/components/panel/WalletList.vue';
import PurchaseList from '@/components/panel/PurchaseList.vue';
import ReceiverAddress from '@/components/panel/ReceiverAddress.vue';
import AccountWallet from './components/AccountWallet.vue';
import PaymentSetting from './components/PaymentSetting.vue';
const USER_TYPE = Core.Const.USER.TYPE;
export default {
    name: 'DistributorDetail',
    components: {
        UserList,
        StoreList,
        PurchaseList,
        AgentList,
        // PricingStructure,
        WalletList,
        ReceiverAddress,
        AccountWallet,
        PaymentSetting,
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
            detail: {},
        };
    },
    watch: {},
    computed: {
        salesAreaStr() {
            let areaStr;
            if (this.detail.sales_area_list && this.detail.sales_area_list.length) {
                // areaStr =  this.detail.sales_area_list.map(i => i.name).join(' , ');
                areaStr =
                    this.$i18n.locale === 'zh'
                        ? this.detail.sales_area_list.map(i => i.name).join(' , ')
                        : this.detail.sales_area_list.map(i => i.name_en).join(' , ');
            } else {
                areaStr = '-';
            }
            return areaStr;
        },
    },
    created() {
        this.distributor_id = Number(this.$route.query.id) || Core.Data.getOrgId();
        this.getDistributorDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/distributor/distributor-edit',
                        query: { id: this.distributor_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'list': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/distributor/distributor-list',
                        query: { id: this.distributor_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getDistributorDetail() {
            console.log('this.distributor_id', this.distributor_id);
            this.loading = true;
            Core.Api.Distributor.detail({
                id: this.distributor_id,
            })
                .then(res => {
                    console.log('getDistributorDetail res', res);
                    this.detail = res.detail;
                })
                .catch(err => {
                    console.log('getDistributorDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleStatusChange() {
            let _this = this;
            this.$confirm({
                title:
                    this.$t('pop_up.sure') +
                    `${_this.detail.status ? this.$t('pop_up.disable') : this.$t('pop_up.enable')}` +
                    this.$t('pop_up.distributor'),
                okText: this.$t('pop_up.yes'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Distributor.updateStatus({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(
                                `${_this.detail.status ? _this.$t('pop_up.success_disable') : _this.$t('pop_up.success_enable')}` +
                                    _this.$t('pop_up.success'),
                            );
                            _this.getDistributorDetail();
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

<style lang="less" scoped></style>
