<template>
<div id="RefundDetail" class="list-container">
    <div class="title-container">
        <div class="title-area">退款单详情</div>
        <div class="btns-area">
            <template v-if="sameOrg(detail.supply_org_id, detail.supply_org_type)">
                <AuditHandle v-if="detail.status === STATUS.WAIT_AUDIT"
                    btnType='primary' :api-list="['Refund', 'audit']" :id="detail.id" @submit="getOrderDetail"
                    :s-pass="STATUS.AUDIT_PASS" :s-refuse="STATUS.AUDIT_REFUSE" no-refuse><i class="icon i_audit"/>审核
                </AuditHandle>
                <a-button type="primary" @click="handleRefundConfirm(detail.id)" v-if="detail.status === STATUS.AUDIT_PASS">
                    <i class="icon i_confirm"/>确认退款
                </a-button>
            </template>
            <template v-if="sameOrg(detail.org_id, detail.org_type)">
                <template v-if="canEdit">
                    <a-button type="danger" @click="handleCancel()"><i class="icon i_close_c"/>取消</a-button>
                </template>
            </template>
        </div>
    </div>
    <div class="gray-panel">
        <div class="panel-content">
            <MySteps :stepsList='stepsList' :current='currStep'></MySteps>
        </div>
    </div>
    <div class="form-container">
        <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
            <template #expandIcon ><i class="icon i_expan_l"/> </template>
            <a-collapse-panel key="RefundInfo" header="退款单信息" class="gray-collapse-panel">
                <a-row class="panel-content info-container">
                    <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                        <div class="info-item">
                            <div class="key">创建时间</div>
                            <div class="value">{{$Util.timeFilter(detail.create_time) || '-'}}</div>
                        </div>
                        <div class="info-item">
                            <div class="key">处理时间</div>
                            <div class="value">{{$Util.timeFilter(detail.operate_time) || '-'}}</div>
                        </div>
                        <div class="info-item">
                            <div class="key">申请退款金额</div>
                            <div class="value">{{$Util.priceUnitFilter(detail.currency)}} {{$Util.countFilter(detail.money)}}</div>
                        </div>
                        <div class="info-item">
                            <div class="key">收款组织</div>
                            <div class="value">{{$Util.userTypeFilter(detail.org_type)}} {{detail.org_name}}</div>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                        <div class="info-item">
                            <div class="key">采购单编号</div>
                            <div class="value">
                                <a-button type="link" @click="routerChange('purchase')"
                                    style="font-size: 12px;line-height: 17px;height: 17px;">{{detail.order_sn || '-'}}</a-button>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="key">售后单编号</div>
                            <div class="value">
                                <a-button type="link" @click="routerChange('aftersales')"
                                    style="font-size: 12px;line-height: 17px;height: 17px;">{{detail.source_uid || '-'}}</a-button>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="key">申请人</div>
                            <div class="value">
                                {{detail.apply_user_name || '-'}}
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="key">审核人</div>
                            <div class="value">
                                {{detail.audit_user_name || '-'}}
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
import MySteps from "@/components/common/MySteps.vue"
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
                {status: '0', title: '创建退款单'},
                {status: '10', title: '上级审核'},
                {status: '20', title: '确认退款'},
                {status: '40', title: '退款完成'},
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
                            return i
                        }
                    }
                    break;
                case STATUS.AUDIT_REFUSE: return 0
                case STATUS.CANCEL:
                    this.stepsList = [
                        {status: '0', title: '创建退款单'},
                        {status: '-20', title: '取消'},
                    ]; return 1
                default: return 0
            }
        },
        canEdit() {
            switch (this.detail.status) {
                case STATUS.WAIT_AUDIT:
                    return true
                default: return false
            }
        },
    },
    created() {
        this.id = Number(this.$route.query.id) || 0
    },
    mounted() {
        this.getOrderDetail()
    },
    methods: {
        sameOrg(orgId, orgType) {
            if (this.loginOrgId === orgId && this.loginOrgType === orgType) {
                return true
            }
            return false
        },
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'list':
                    routeUrl = this.$router.resolve({
                        path: '/aftersales/refund-list',
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'purchase': // 采购单详情
                    routeUrl = this.$router.resolve({
                        path: '/purchase/purchase-order-detail',
                        query: {id: this.detail.order_id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'aftersales': // 退款单 详情
                    routeUrl = this.$router.resolve({
                        path: '/aftersales/aftersales-detail',
                        query: {id: this.detail.source_uid}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        // 获取 退款单 详情
        getOrderDetail(type) {
            Core.Api.Refund.detail({
                id: this.id
            }).then(res => {
                console.log('getOrderDetail res', res)
                this.detail = res.detail
            }).catch(err => {
                console.log('getOrderDetail err', err)
            }).finally(() => {
            });
        },
        // 取消退款
        handleCancel() {
            let _this = this
            this.$confirm({
                title: '确认要取消本次退款吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Refund.cancel({
                        id: _this.id
                    }).then(res => {
                        _this.$message.success('取消成功')
                        _this.routerChange('list')
                    }).catch(err => {
                        console.log('handleCancel err', err)
                    })
                },
            });
        },
        // 确认退款
        handleRefundConfirm(id) {
            let _this = this;
            this.$confirm({
                title: '确定要该退款单已退款吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Refund.handle({id}).then(() => {
                        _this.$message.success('操作成功');
                        _this.getOrderDetail();
                    }).catch(err => {
                        console.log("handleRefundConfirm err", err);
                    })
                },
            });
        }
    }
};
</script>

<style lang="less">
// #RefundDetail {}
</style>
