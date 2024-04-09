<template>
    <div id="RefundDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('af.details') }}</div>
            <div class="btns-area">
                <template v-if="sameOrg(detail.supply_org_id, detail.supply_org_type)">
                    <AuditHandle
                        v-if="detail.status === STATUS.WAIT_AUDIT"
                        btnType="primary"
                        :api-list="['Refund', 'audit']"
                        :id="detail.id"
                        @submit="getOrderDetail"
                        :s-pass="STATUS.AUDIT_PASS"
                        :s-refuse="STATUS.AUDIT_REFUSE"
                        no-refuse
                        ><i class="icon i_audit" />{{ $t('n.audit') }}
                    </AuditHandle>
                    <a-button
                        type="primary"
                        @click="handleRefundConfirm(detail.id)"
                        v-if="detail.status === STATUS.AUDIT_PASS"
                    >
                        <i class="icon i_confirm" />{{ $t('af.refund') }}
                    </a-button>
                </template>
                <template v-if="sameOrg(detail.org_id, detail.org_type)">
                    <template v-if="canEdit">
                        <a-button type="danger" @click="handleCancel()"
                            ><i class="icon i_close_c" />{{ $t('def.cancel') }}</a-button
                        >
                    </template>
                </template>
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content">
                <MySteps :stepsList="stepsList" :current="currStep"></MySteps>
            </div>
        </div>
        <div class="form-container">
            <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                <template #expandIcon><i class="icon i_expan_l" /> </template>
                <a-collapse-panel key="RefundInfo" :header="$t('n.information')" class="gray-collapse-panel">
                    <a-row class="panel-content info-container">
                        <a-col :xs="24" :sm="24" :lg="12" :xl="8" :xxl="6" class="info-block">
                            <div class="info-item">
                                <div class="key">{{ $t('d.create_time') }}</div>
                                <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('af.time') }}</div>
                                <div class="value">{{ $Util.timeFilter(detail.operate_time) || '-' }}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('af.apply_price') }}</div>
                                <div class="value">
                                    {{ $Util.priceUnitFilter(detail.currency) }} {{ $Util.countFilter(detail.money) }}
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('af.receiving') }}</div>
                                <div class="value">
                                    {{ $Util.userTypeFilter(detail.org_type, $i18n.locale) }} {{ detail.org_name }}
                                </div>
                            </div>
                        </a-col>
                        <a-col :xs="24" :sm="24" :lg="12" :xl="8" :xxl="6" class="info-block">
                            <div class="info-item">
                                <div class="key">{{ $t('af.sn') }}</div>
                                <div class="value">
                                    <a-button
                                        type="link"
                                        @click="routerChange('purchase')"
                                        style="font-size: 12px; line-height: 17px; height: 17px"
                                        >{{ detail.order_sn || '-' }}</a-button
                                    >
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('af.number') }}</div>
                                <div class="value">
                                    <a-button
                                        type="link"
                                        @click="routerChange('aftersales')"
                                        style="font-size: 12px; line-height: 17px; height: 17px"
                                        >{{ detail.source_uid || '-' }}</a-button
                                    >
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('af.applicant') }}</div>
                                <div class="value">
                                    {{ detail.apply_user_name || '-' }}
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('af.auditor') }}</div>
                                <div class="value">
                                    {{ detail.audit_user_name || '-' }}
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </a-collapse-panel>
            </a-collapse>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import MySteps from '@/components/common/MySteps.vue';
import AuditHandle from '@/components/popup-btn/AuditHandle.vue';
import AttachmentFile from '@/components/panel/AttachmentFile.vue';

const STATUS = Core.Const.REFUND.STATUS;
const TYPE = Core.Const.REFUND.TYPE;

export default {
    name: 'RefundDetail',
    components: {
        MySteps,
        AuditHandle,
        AttachmentFile,
    },
    props: {},
    data() {
        return {
            loginOrgId: Core.Data.getOrgId(),
            loginOrgType: Core.Data.getOrgType(),
            STATUS,
            TYPE,
            // 加载
            loading: false,
            activeKey: ['RefundInfo'],
            stepsList: [
                { status: '0', zh: '创建退款单', en: 'Create refund order' },
                { status: '10', zh: '上级审核', en: 'Superior review' },
                { status: '20', zh: '确认退款', en: 'Confirm refund' },
                { status: '40', zh: '退款完成', en: 'Refund completed' },
            ],
            id: '',
            detail: {},
        };
    },
    watch: {},
    computed: {
        currStep() {
            switch (this.detail.status) {
                case STATUS.WAIT_AUDIT:
                case STATUS.AUDIT_PASS:
                case STATUS.SUCCESS:
                    for (let i = 0; i < this.stepsList.length; i++) {
                        if (this.stepsList[i].status == this.detail.status) {
                            return i;
                        }
                    }
                    break;
                case STATUS.AUDIT_REFUSE:
                    return 0;
                case STATUS.CANCEL:
                    this.stepsList = [
                        { status: '0', title: this.$t('af.create_refund') },
                        { status: '-20', title: this.$t('def.cancel') },
                    ];
                    return 1;
                default:
                    return 0;
            }
        },
        canEdit() {
            switch (this.detail.status) {
                case STATUS.WAIT_AUDIT:
                    return true;
                default:
                    return false;
            }
        },
    },
    created() {
        this.id = Number(this.$route.query.id) || 0;
    },
    mounted() {
        this.getOrderDetail();
    },
    methods: {
        sameOrg(orgId, orgType) {
            if (this.loginOrgId === orgId && this.loginOrgType === orgType) {
                return true;
            }
            return false;
        },
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'list':
                    routeUrl = this.$router.resolve({
                        path: '/aftersales/refund-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'purchase': // 采购单详情
                    routeUrl = this.$router.resolve({
                        path: '/distributor/purchase-order-detail',
                        query: { id: this.detail.order_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'aftersales': // 退款单 详情
                    routeUrl = this.$router.resolve({
                        path: '/aftersales/aftersales-detail',
                        query: { id: this.detail.source_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        // 获取 退款单 详情
        getOrderDetail(type) {
            Core.Api.Refund.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getOrderDetail res', res);
                    this.detail = res.detail;
                })
                .catch(err => {
                    console.log('getOrderDetail err', err);
                })
                .finally(() => {});
        },
        // 取消退款
        handleCancel() {
            let _this = this;
            this.$confirm({
                title: _this.$('af.cancel_refund') + '？',
                okText: _this.$('def.ok'),
                cancelText: _this.$('def.cancel'),
                onOk() {
                    Core.Api.Refund.cancel({
                        id: _this.id,
                    })
                        .then(res => {
                            _this.$message.success(_this.$('pop_up.canceled'));
                            _this.routerChange('list');
                        })
                        .catch(err => {
                            console.log('handleCancel err', err);
                        });
                },
            });
        },
        // 确认退款
        handleRefundConfirm(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_audit'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Refund.handle({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.operate'));
                            _this.getOrderDetail();
                        })
                        .catch(err => {
                            console.log('handleRefundConfirm err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang="less">
// #RefundDetail {}
</style>
