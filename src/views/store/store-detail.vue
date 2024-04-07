<template>
    <div id="StoreDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t('s.detail') }}
                <a-tag v-if="$auth('ADMIN')" :color="detail.status ? 'green' : 'red'">
                    {{ detail.status ? $t('def.enable_ing') : $t('def.disable_ing') }}</a-tag
                >
            </div>
            <div class="btns-area" v-if="$auth('ADMIN')">
                <a-button type="primary" ghost @click="routerChange('edit')"
                    ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                >
                <a-button
                    :type="detail.status ? 'null' : 'primary'"
                    ghost
                    :danger="detail.status ? true : false"
                    @click="handleStatusChange()"
                >
                    <template v-if="detail.status"
                        ><i class="icon i_forbidden" />{{ $t('def.disable') }}</template
                    >
                    <template v-if="!detail.status"
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
                        <span class="key">{{ $t('d.abbreviation') }}：</span>
                        <span class="value">&nbsp;{{ detail.short_name }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('d.pay_type') }}：</span>
                        <span class="value">{{ $Util.payTypeFilter(detail.pay_type, $i18n.locale) || '-' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item" v-if="$auth('ADMIN')">
                        <span class="key">{{ $t('n.distributor') }}：</span>
                        <a-button type="link" @click="routerChange('distributor')">{{
                            detail.distributor_name
                        }}</a-button>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item" v-if="$auth('ADMIN', 'DISTRIBUTOR')">
                        <span class="key">{{ $t('n.agent') }}：</span>
                        <a-button type="link" @click="routerChange('agent')">{{ detail.agent_name }}</a-button>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.contact') }}：</span>
                        <span class="value">{{ detail.contact_name }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.phone') }}：</span>
                        <span class="value">{{ detail.contact_phone }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.time') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                </a-row>
                <div class="desc-stat">
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
                        :orgType="ORG_TYPE.STORE"
                        :orgId="store_id"
                        :type="USER_TYPE.STORE"
                        v-if="activeKey == 'UserList'"
                    />
                </a-tab-pane>
                <a-tab-pane key="PurchaseList" :tab="$t('d.order')">
                    <PurchaseList :orgId="store_id" :orgType="ORG_TYPE.STORE" v-if="activeKey == 'PurchaseList'" />
                </a-tab-pane>
                <a-tab-pane key="ReceiverAddress" :tab="$t('d.address')">
                    <ReceiverAddress
                        :orgId="store_id"
                        :orgType="USER_TYPE.STORE"
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
import PurchaseList from '@/components/panel/PurchaseList.vue';
import ReceiverAddress from '@/components/panel/ReceiverAddress.vue';

const USER_TYPE = Core.Const.USER.TYPE;
export default {
    name: 'StoreDetail',
    components: {
        UserList,
        PurchaseList,
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

            store_id: Core.Data.getOrgId(),
            detail: {},
        };
    },
    watch: {},
    computed: {},
    created() {
        this.store_id = Number(this.$route.query.id) || Core.Data.getOrgId();
        this.getStoreDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/distributor/store-edit',
                        query: { id: this.store_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'list': // 列表
                    routeUrl = this.$router.resolve({
                        path: '/distributor/store-list',
                        query: { id: this.store_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'agent': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/distributor/agent-detail',
                        query: { id: this.detail.agent_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'distributor': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/distributor/distributor-detail',
                        query: { id: this.detail.distributor_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        // 获取门店详情
        getStoreDetail() {
            this.loading = true;
            Core.Api.Store.detail({
                id: this.store_id,
            })
                .then(res => {
                    console.log('getStoreDetail res', res);
                    this.detail = res.detail;
                })
                .catch(err => {
                    console.log('getStoreDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 门店启用禁用
        handleStatusChange() {
            let _this = this;
            this.$confirm({
                title:
                    this.$t('pop_up.sure') +
                    `${_this.detail.status ? this.$t('pop_up.disable') : this.$t('pop_up.enable')}` +
                    this.$t('pop_up.store'),
                okText: this.$t('pop_up.yes'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Store.updateStatus({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(
                                `${_this.status ? _this.$t('pop_up.success_disable') : _this.$t('pop_up.success_enable')}` +
                                    _this.$t('pop_up.success'),
                            );
                            _this.getStoreDetail();
                        })
                        .catch(err => {
                            console.log('handleStatusChange err', err);
                        });
                },
            });
        },

        // 删除门店
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('s.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Store.delete({ id })
                        .then(() => {
                            _this.$message.success($t('pop_up.delete_success'));
                            _this.routerChange('list');
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },

        // 门店转单接受 启用禁用
        handleTransferChange(detail) {
            let _this = this;
            this.$confirm({
                title: `确定要将该门店设置为${detail.flag_receive_transfer ? '不可' : '可'}接受转单吗？`,
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Store.updateTransfer({ id: detail.id })
                        .then(() => {
                            _this.$message.success(`${detail.flag_receive_transfer ? '禁用' : '启用'}成功`);
                            _this.getStoreDetail();
                        })
                        .catch(err => {
                            console.log('handleTransferChange err', err);
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
