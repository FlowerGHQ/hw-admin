<template>
<div id="AftersalesDetail">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">售后单详情</div>
            <div class="btns-area">
                <template v-if="sameOrg(detail.supply_org_id, detail.supply_org_type)">
                    <AuditHandle v-if="detail.status === STATUS.APPLY"
                        btnType='primary' :api-list="['Aftersales', 'audit']" :id="detail.id" @submit="getOrderDetail"
                        :s-pass="STATUS.AUDIT_PASS" :s-refuse="STATUS.AUDIT_REFUSE"><i class="icon i_audit"/>审核
                    </AuditHandle>
                    <template v-if="detail.status === STATUS.AUDIT_PASS">
                        <a-button type="primary" @click="handleApplyRefund()" ghost v-if="detail.refund_status === 0 && detail.refund_money"><i class="icon i_settle"/>确认退款</a-button>
                        <a-button type="primary" @click="handleReceived()" ghost v-if="needItemIn && detail.sales_return_status === 100"><i class="icon i_goods"/>确认收货</a-button>
                        <a-button type="primary" @click="handleDeliverShow()" v-if="needItemOut && detail.deliver_status === 0"><i class="icon i_deliver"/>商品寄出</a-button>
                    </template>
                </template>
                <template v-if="sameOrg(detail.org_id, detail.org_type)">
                    <template v-if="canEdit">
                        <a-button type="primary" @click="handleSubmit()" ghost><i class="icon i_detail_l"/>提交审核</a-button>
                        <a-button type="primary" @click="routerChange('edit')"><i class="icon i_edit"/>编辑</a-button>
                        <a-button type="danger"  @click="handleCancel()"><i class="icon i_close_c"/>取消</a-button>
                    </template>
                    <template v-if="detail.status === STATUS.AUDIT_PASS">
                        <a-button type="primary" @click="handleReceived()" ghost v-if="needItemOut && detail.deliver_status === 100"><i class="icon i_goods"/>确认收货</a-button>
                        <a-button type="primary" @click="handleDeliverShow()" v-if="needItemIn && detail.sales_return_status === 0"><i class="icon i_deliver"/>商品寄回</a-button>
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
                <a-collapse-panel key="AftersalesInfo" header="订单信息" class="gray-collapse-panel">
                    <a-row class="panel-content info-container">
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                            <div class="info-item">
                                <div class="key">售后单编号</div>
                                <div class="value">
                                    {{detail.sn || '-'}}
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="key">采购单编号</div>
                                <div class="value">
                                    <a-button type="link" @click="routerChange('purchase')"
                                        style="font-size: 12px;line-height: 17px;height: 17px;">{{detail.order_sn || '-'}}</a-button>
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="key">创建时间</div>
                                <div class="value">{{$Util.timeFilter(detail.create_time) || '-'}}</div>
                            </div>
                        </a-col>
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                            <div class="info-item">
                                <div class="key">申请退款金额</div>
                                <div class="value">{{$Util.priceUnitFilter(detail.refund_money_currency)}} {{$Util.countFilter(detail.refund_money)}}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">申请组织</div>
                                <div class="value">{{$Util.userTypeFilter(detail.org_type)}} {{detail.org_name}}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">备注</div>
                                <div class="value">{{detail.remark || '-'}}</div>
                            </div>
                        </a-col>
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block" v-if="refund.id">
                            <div class="info-item">
                                <div class="key">退款单创建时间</div>
                                <div class="value">{{$Util.timeFilter(refund.create_time) || '-'}}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">退款状态</div>
                                <div class="value">{{AFTERSALES.REFUND_STATUS_MAP[detail.refund_status] || '-'}}</div>
                            </div>
                        </a-col>
                    </a-row>
                </a-collapse-panel>
                <template v-if="detail.type !== TYPE.ONLY_REFUND">
                    <a-collapse-panel key="ItemInInfo" header="售后商品信息" class="gray-collapse-panel">
                        <div class="panel-content">
                            <a-table :columns="itemColumns" :data-source="itemInList" :scroll="{ x: true }"
                                :row-key="record => record.id" :pagination='false'>
                                <template #bodyCell="{ column, text , record}">
                                    <template v-if="column.dataIndex === 'item'">
                                        <div class="table-img">
                                            <a-image :width="30" :height="30" :src="$Util.imageFilter(text ? text.logo : '', 2)"/>
                                            <a-tooltip placement="top" :title='text'>
                                                <a-button type="link" @click="routerChange('item', text)" style="margin-left: 6px;">
                                                    {{text ? text.name : '-'}}
                                                </a-button>
                                            </a-tooltip>
                                        </div>
                                    </template>
                                    <template v-if="column.dataIndex === 'amount'">
                                        {{record.amount}} 件
                                    </template>
                                    <template v-if="column.key === 'money'">
                                        {{$Util.priceUtilFilter(record.currency)}} {{$Util.countFilter(text)}}
                                    </template>
                                    <template v-if="column.key === 'spec'">
                                        {{$Util.itemSpecFilter(text)}}
                                    </template>
                                </template>
                            </a-table>
                        </div>
                    </a-collapse-panel>
                    <a-collapse-panel key="WaybillInInfo" header="售后商品物流信息" class="gray-collapse-panel" v-if="needItemIn">
                        <a-row class="panel-content info-container">
                            <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                                <div class="info-item">
                                    <div class="key">收货人</div>
                                    <div class="value">{{waybillIn.receiver || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">收货地址</div>
                                    <div class="value">{{waybillIn.receiver_address || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">联系方式</div>
                                    <div class="value">{{waybillIn.receiver_phone || '-'}}</div>
                                </div>
                            </a-col>
                            <a-col :xs='24' :sm='24' :lg='12' :xl='16' :xxl='12' class="info-block">
                                <div class="info-item">
                                    <div class="key">物流状态</div>
                                    <div class="value">{{AFTERSALES.WAYBILL_STATUS_MAP[detail.sales_return_status] || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">物流信息</div>
                                    <div class="value">
                                        <WaybillShow v-if="waybillInInfo" @change="getWaybillDetail" :detail='waybillIn' :list='waybillInInfo.list' :can-edit="sameOrg(detail.org_id, detail.org_type)" />
                                        <template v-else>暂无物流信息</template>
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                    </a-collapse-panel>
                </template>
                <template v-if="needItemOut">
                    <a-collapse-panel key="ItemOutInfo" :header="$Util.aftersalesTypeFilter(detail.type) + '商品信息'" class="gray-collapse-panel">
                        <div class="panel-content">
                            <a-table :columns="itemColumns" :data-source="itemOutList" :scroll="{ x: true }"
                                :row-key="record => record.id" :pagination='false'>
                                <template #bodyCell="{ column, text , record}">
                                    <template v-if="column.dataIndex === 'item'">
                                        <div class="table-img">
                                            <a-image :width="30" :height="30" :src="$Util.imageFilter(text ? text.logo : '', 2)"/>
                                            <a-tooltip placement="top" :title='text'>
                                                <a-button type="link" @click="routerChange('item', text)" style="margin-left: 6px;">
                                                    {{text ? text.name : '-'}}
                                                </a-button>
                                            </a-tooltip>
                                        </div>
                                    </template>
                                    <template v-if="column.dataIndex === 'amount'">
                                        {{record.amount}} 件
                                    </template>
                                    <template v-if="column.key === 'money'">
                                        {{$Util.priceUtilFilter(record.currency)}} {{$Util.countFilter(text)}}
                                    </template>
                                    <template v-if="column.key === 'spec'">
                                        {{$Util.itemSpecFilter(text)}}
                                    </template>
                                </template>
                            </a-table>
                        </div>
                    </a-collapse-panel>
                    <a-collapse-panel key="WaybillOutInfo" :header="$Util.aftersalesTypeFilter(detail.type) + '商品物流信息'" class="gray-collapse-panel" v-if="showWaybill">
                        <a-row class="panel-content info-container">
                            <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                                <div class="info-item">
                                    <div class="key">收货人</div>
                                    <div class="value">{{waybillOut.receiver || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">收货地址</div>
                                    <div class="value">{{waybillOut.receiver_address || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">联系方式</div>
                                    <div class="value">{{waybillOut.receiver_phone || '-'}}</div>
                                </div>
                            </a-col>
                            <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                                <div class="info-item">
                                    <div class="key">物流状态</div>
                                    <div class="value">{{AFTERSALES.WAYBILL_STATUS_MAP[detail.deliver_status] || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">物流信息</div>
                                    <div class="value">
                                        <WaybillShow v-if="waybillOutInfo" @change="getWaybillDetail" :detail='waybillOut' :list='waybillOutInfo.list' :can-edit="sameOrg(detail.supply_org_id, detail.supply_org_type)" />
                                        <template v-else>暂无物流信息</template>
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                    </a-collapse-panel>
                </template>
                <!-- <AttachmentFile :target_id='id' :target_type='AttachTargetType' :detail='detail' @submit="getOrderDetail" ref="AttachmentFile"/> -->
            </a-collapse>
        </div>
    </div>
    <template class="modal-container">
        <a-modal v-model:visible="deliverShow" title="确认发货" @ok="handleDeliver">
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">快递公司</div>
                    <div class="value">
                        <a-select v-model:value="form.company_uid" placeholder="请选择快递公司">
                            <a-select-option v-for="company of companyUidList" :key="company.value" :value="company.value">{{company.name}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required" >
                    <div class="key">快递单号</div>
                    <div class="value">
                        <a-input v-model:value="form.waybill_uid" placeholder="请输入快递单号"/>
                    </div>
                </div>
            </div>
        </a-modal>
    </template>
</div>
</template>

<script>
import Core from '../../core';
import MySteps from "@/components/common/MySteps.vue"
import AuditHandle from '@/components/popup-btn/AuditHandle.vue';
import WaybillShow from "@/components/popup-btn/WaybillShow.vue"
import AttachmentFile from '@/components/popup-btn/AttachmentFile.vue';

const STATUS = Core.Const.AFTERSALES.STATUS;
const TYPE = Core.Const.AFTERSALES.TYPE;

const itemColumns = [
    { title: '商品', dataIndex: 'item' },
    { title: '品号', dataIndex: ['item', "model"] },
    { title: '编号', dataIndex: ['item', "code"] },
    { title: '规格', dataIndex: ['item', 'attr_list'], key: 'spec' },
    { title: '数量', dataIndex: 'amount'},
    { title: '单价', dataIndex: 'unit_price', key: 'money'},
    { title: '售价', dataIndex: 'price', key: 'money'},
    { title: '实际金额（元）', dataIndex: 'charge', key: 'money'},
]

export default {
    name: 'AftersalesDetail',
    components: {
        AttachmentFile,
        WaybillShow,
        MySteps,
        AuditHandle,
    },
    props: {},
    data() {
        return {
            loginOrgId: Core.Data.getOrgId(),
            loginOrgType: Core.Data.getOrgType(),
            AttachTargetType: Core.Const.ATTACHMENT.TARGET_TYPE.PURCHASE_ORDER,
            AFTERSALES: Core.Const.AFTERSALES,
            STATUS,
            TYPE,
            // 加载
            loading: false,
            activeKey: ['AftersalesInfo'],
            // activeKey: ['AftersalesInfo', 'ItemInInfo', 'WaybillInInfo', 'ItemOutInfo', 'WaybillOutInfo'],
            stepsList: [
                {status: '0', title: '提交售后单'},
                {status: '100', title: '上级审核'},
                {status: '200', title: '处理中'},
                {status: '600', title: '售后完成'},
            ],
            // 售后单详情
            id: '',
            detail: {},
            refund: {},
            // 商品信息
            itemColumns: itemColumns,
            itemInList: [],
            itemOutList: [],
            // 物流信息
            waybillIn: {},
            waybillInInfo: {},
            waybillOut: {},
            waybillOutInfo: {},
            // 发货弹框
            deliverShow: false,
            companyUidList: Core.Const.WAYBILL.COMPANY_LIST,
            form: {
                company_uid: undefined,
                waybill_uid: '',
            },
        };
    },
    watch: {},
    computed: {
        currStep() {
            switch (this.detail.status) {
                case STATUS.INIT:
                case STATUS.APPLY:
                case STATUS.AUDIT_PASS:
                case STATUS.FINISH:
                    for (let i = 0; i < this.stepsList.length; i++) {
                        if (this.stepsList[i].status == this.detail.status) {
                            return i
                        }
                    }
                    break;
                case STATUS.AUDIT_FAIL: return 0
                case STATUS.CANCEL:
                    this.stepsList = [
                        {status: '0', title: '售后单创建'},
                        {status: '100', title: '取消'},
                    ]; return 1
                default: return 0

            }
        },
        showWaybill() {
            switch (this.detail.status) {
                case STATUS.APPLY:
                case STATUS.AUDIT_PASS:
                case STATUS.FINISH:
                    return true
            }
            return false
        },
        canEdit() {
            switch (this.detail.status) {
                case STATUS.INIT:
                case STATUS.AUDIT_FAIL:
                    return true
                default: return false
            }
        },
        needItemOut() {
            switch (this.detail.type) {
                case TYPE.EXCHANGE_ITEMS:
                case TYPE.REISSUE:
                    return true
                default: return false
            }
        },
        needItemIn() {
            switch (this.detail.type) {
                case TYPE.REFUND_WITH_ITEMS:
                case TYPE.EXCHANGE_ITEMS:
                    return true
                default: return false
            }
        }
    },
    created() {
        this.id = Number(this.$route.query.id) || 0
    },
    mounted() {
        this.getOrderDetail()
        this.getWaybillDetail()
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
                        path: '/aftersales/aftersales-list',
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit': // 售后单编辑
                    routeUrl = this.$router.resolve({
                        path: '/aftersales/aftersales-edit',
                        query: {
                            id: this.id,
                        }
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
                case 'item': // 商品详情
                    routeUrl = this.$router.resolve({
                        path: this.$auth('ADMIN') ? "/item/item-detail" : '/purchase/item-display',
                        query: {id: item.item_id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'refund': // 退款单 详情
                    routeUrl = this.$router.resolve({
                        path: '/refund/refund-detail',
                        query: {id: this.refund.id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        // 获取 售后单 详情
        getOrderDetail(type) {
            Core.Api.Aftersales.detail({
                id: this.id
            }).then(res => {
                console.log('getOrderDetail res', res)
                this.detail = res.detail
                this.refund = res.detail.order_refund_record ? res.detail.order_refund_record : {}
                this.getOrderItemList();
                /* if (type === 'refund') {
                    this.routerChange('refund')
                } */
            }).catch(err => {
                console.log('getOrderDetail err', err)
            }).finally(() => {
            });
        },
        // 获取 售后单 商品列表
        getOrderItemList() {
            Core.Api.AftersalesItem.list({
                after_sales_order_id: this.id
            }).then(res => {
                console.log('getOrderItemList res:', res)
                let inItem = [], outItem = []
                res.list.forEach(item => {
                    if (item.type == 1) {
                        inItem.push(item)
                    } else {
                        outItem.push(item)
                    }
                })
                this.itemInList = inItem
                this.itemOutList = outItem
            }).catch(err => {
                console.log('getOrderItemList err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取 物流单信息
        getWaybillDetail() {
            Core.Api.Waybill.detailByTarget({
                target_id: this.id,
                target_type: Core.Const.WAYBILL.TARGET_TYPE.AFTER_SALES_ORDER,
                type: Core.Const.WAYBILL.TYPE.OUT,
            }).then(res => {
                console.log('getWaybillDetail res: out', res);
                this.waybillOut = res.detail
                this.getWaybillInfo('Out', this.waybillOut.uid, this.waybillOut.company_uid)
            }).catch(err => {
                console.log('getOrderDetail err: out', err)
            })
            Core.Api.Waybill.detailByTarget({
                target_id: this.id,
                target_type: Core.Const.WAYBILL.TARGET_TYPE.AFTER_SALES_ORDER,
                type: Core.Const.WAYBILL.TYPE.IN,
            }).then(res => {
                console.log('getWaybillDetail res: in', res);
                this.waybillIn = res.detail
                this.getWaybillInfo('In', this.waybillIn.uid, this.waybillIn.company_uid)
            }).catch(err => {
                console.log('getOrderDetail err: in', err)
            })
        },
        // 获取 物流单详情
        getWaybillInfo(type, uid, company_uid) {
            Core.Api.Waybill.queryLogistics({
                uid: uid,
                company_uid: company_uid,
            }).then(res => {
                console.log('getWaybillInfo res:', type, res);
                this['waybill' + type + 'Info'] = JSON.parse(res.waybill).result
            }).catch(err => {
                console.log('getWaybillInfo err:', type, err);
            })
        },
        // 提交审核
        handleSubmit() {
            let _this = this
            this.$confirm({
                title: '确认要提交审核吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Aftersales.submit({
                        id: _this.id
                    }).then(res => {
                        _this.$message.success('提交成功')
                        _this.getOrderDetail()
                    }).catch(err => {
                        console.log('handleCancel err', err)
                    })
                },
            });
        },
        // 生成退款单
        handleApplyRefund() {
            let _this = this
            this.$confirm({
                title: '确认要生成退款单吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Aftersales.applyRefund({
                        id: _this.id
                    }).then(res => {
                        _this.$message.success('操作成功')
                        _this.getOrderDetail('refund')
                    }).catch(err => {
                        console.log('handleCancel err', err)
                    })
                },
            });
        },

        // 弹出弹框
        handleDeliverShow(type) {
            Object.assign(this.form, this.$options.data().form)
            this.deliverShow = true
        },
        // 确认发货
        handleDeliver() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.company_uid) {
                return this.$message.warning('请选择快递公司')
            }
            if (!form.waybill_uid) {
                return this.$message.warning('请输入快递单号')
            }
            Core.Api.Aftersales.deliver({
                id: this.id,
                company_uid: form.company_uid,
                waybill_uid: form.waybill_uid,
            }).then(res => {
                this.$message.success('发货成功')
                this.deliverShow = false
                this.getOrderDetail()
                this.getWaybillDetail();
            }).catch(err => {
                console.log('handleDeliver err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 确认收货
        handleReceived() {
            let _this = this
            this.$confirm({
                title: '确认已收到货物吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Aftersales.receive({
                        id: _this.id
                    }).then(res => {
                        _this.$message.success('收货成功')
                        _this.getOrderDetail()
                    }).catch(err => {
                        console.log('handleReceived err', err)
                    })
                },
            });
        },
        // 取消售后
        handleCancel() {
            let _this = this
            this.$confirm({
                title: '确认要取消本次售后吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Aftersales.cancel({
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
    }
};
</script>

<style lang="less">
// #AftersalesDetail {}
</style>
