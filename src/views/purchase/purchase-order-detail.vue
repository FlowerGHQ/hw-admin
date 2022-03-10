<template>
<div id="PurchaseOrderDetail">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">采购订单详情</div>
            <div class="btns-area">
                <a-button type="primary" @click="handleModalShow('payment')" v-if="detail.payment_status !== PAYMENT_STATUS.PAY_ALL && authOrg(detail.supply_org_id, detail.supply_org_type)"><i class="icon i_received"/>确认收款</a-button>
                <a-button type="primary" @click="handleModalShow('deliver')" v-if="detail.status === STATUS.WAIT_DELIVER && authOrg(detail.supply_org_id, detail.supply_org_type)"><i class="icon i_deliver"/>发货</a-button>
                <a-button type="primary" @click="handleReceived()" v-if="detail.status === STATUS.WAIT_TAKE_DELIVER  && authOrg(detail.org_id, detail.org_type)"><i class="icon i_goods"/>确认收货</a-button>
                <a-button type="primary" @click="handleCancel()" v-if="detail.status === STATUS.WAIT_PAY & authOrg(detail.org_id, detail.org_type)"><i class="icon i_close_c"/>取消</a-button>
                <a-button type="primary" @click="routerChange('refund')" ghost v-if="detail.status === STATUS.DEAL_SUCCESS & authOrg(detail.org_id, detail.org_type)"><i class="icon i_edit"/>申请退款</a-button>
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
                <a-collapse-panel key="ItemInfo" header="商品信息" class="gray-collapse-panel">
                    <div class="panel-content">
                        <a-table :columns="itemColumns" :data-source="itemList" :scroll="{ x: true }"
                            :row-key="record => record.id" :pagination='false'>
                            <template #bodyCell="{ column, text , record}">
                                <template v-if="column.dataIndex === 'item'">
                                    <div class="table-img">
                                        <a-image :width="30" :height="30" :src="$Util.imageFilter(text ? text.logo : '', 2)"/>
                                        <a-tooltip placement="top" :title='text'>
                                            <a-button type="link" @click="routerChange('detail', text)" style="margin-left: 6px;">
                                                {{text ? text.name : '-'}}
                                            </a-button>
                                        </a-tooltip>
                                    </div>
                                </template>
                                <template v-if="column.dataIndex === 'amount'">
                                    {{record.amount}} 件
                                </template>
                                <template v-if="column.key === 'money'">
                                    {{$Util.countFilter(text)}}元
                                </template>
                            </template>
                            <template #summary>
                                <a-table-summary>
                                    <a-table-summary-row>
                                        <a-table-summary-cell :index="0" :col-span="4">合计</a-table-summary-cell>
                                        <a-table-summary-cell :index="1" :col-span="2">总数量:{{total.amount}}件</a-table-summary-cell>
                                        <a-table-summary-cell :index="4" :col-span="1">总售价:{{$Util.countFilter(total.price)}}元</a-table-summary-cell>
                                        <a-table-summary-cell :index="5" :col-span="1">总金额:{{$Util.countFilter(total.charge)}}元</a-table-summary-cell>
                                    </a-table-summary-row>
                                </a-table-summary>
                            </template>
                        </a-table>
                    </div>
                </a-collapse-panel>
                <a-collapse-panel key="PurchaseInfo" header="订单信息" class="gray-collapse-panel">
                    <a-row class="panel-content info-container">
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                            <div class="info-item">
                                <div class="key">订单编号</div>
                                <div class="value">{{detail.sn || '-'}}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">下单人</div>
                                <div class="value">{{detail.user_name|| '-'}}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">下单时间</div>
                                <div class="value">{{$Util.timeFilter(detail.create_time) || '-'}}</div>
                            </div>
                        </a-col>
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                            <div class="info-item">
                                <div class="key">联系方式</div>
                                <div class="value" v-if="detail.receive_info != null">{{detail.receive_info.phone || '-'}}</div>
                                <div class="value" v-else>-</div>
                            </div>
                            <div class="info-item">
                                <div class="key">支付方式</div>
                                <div class="value">{{$Util.purchasePayMethodFilter(detail.pay_method) || '-'}}</div>
                            </div>
                        </a-col>
                    </a-row>
                </a-collapse-panel>
                <AttachmentFile :target_id='id' :target_type='Core.Const.ATTACHMENT.TARGET_TYPE.PURCHASE_ORDER' :detail='detail' @submit="getPurchaseInfo" ref="AttachmentFile"/>
                <a-collapse-panel key="WaybillInfo" header="物流信息" class="gray-collapse-panel">
                    <a-row class="panel-content info-container">
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                            <div class="info-item">
                                <div class="key">收货人</div>
                                <div class="value" v-if="detail.receive_info !=null">{{detail.receive_info.name || '-'}}</div>
                                <div class="value" v-else>-</div>
                            </div>
                            <div class="info-item">
                                <div class="key">收货地址</div>
                                <div class="value" v-if="detail.receive_info !=null">{{detail.receive_info.country + detail.receive_info.province + detail.receive_info.city + detail.receive_info.county + detail.receive_info.address || '-'}}</div>
                                <div class="value" v-else>-</div>
                            </div>
                        </a-col>
                        <a-col :xs='24' :sm='24' :lg='12' :xl='16' :xxl='12' class="info-block">
                            <div class="info-item">
                                <div class="key">联系方式</div>
                                <div class="value" v-if="detail.receive_info !=null">{{detail.receive_info.phone || '-'}}</div>
                                <div class="value" v-else>-</div>
                            </div>
                            <div class="info-item">
                                <div class="key">物流信息</div>
                                <div class="value">
                                    <WaybillShow v-if="waybillInfo && showWaybill" @change="getWaybillDetail" :detail='waybill' :list='waybillInfo.list' :can-edit="$auth('ADMIN')" />
                                    <template v-else>暂无物流信息</template>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </a-collapse-panel>
            </a-collapse>
        </div>
    </div>
    <template class="modal-container">
        <a-modal v-model:visible="paymentShow" title="确认收款" @ok="handlePayment">
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">收款方式</div>
                    <div class="value">
                        <a-select v-model:value="form.pay_method" placeholder="请选择收款方式">
                            <a-select-option v-for="pay of payMethodList" :key="pay.value" :value="pay.value">{{pay.name}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">收款金额</div>
                    <div class="value">
                        <a-input-number v-model:value="form.payment" :min="0" :max="(detail.charge -detail.payment)/100" :precision="2" placeholder="0.00"/>
                        <span>元</span>
                    </div>
                </div>
            </div>
        </a-modal>
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
import PurchaseInfo from "./components/PurchaseInfo.vue"
import WaybillShow from "@/components/popup-btn/WaybillShow.vue"
import MySteps from "@/components/common/MySteps.vue"
import AttachmentFile from '@/components/popup-btn/AttachmentFile.vue';

const PURCHASE = Core.Const.PURCHASE;
const STATUS = Core.Const.PURCHASE.STATUS;
const PAYMENT_STATUS =Core.Const.PURCHASE.PAYMENT_STATUS;
const itemColumns = [
    { title: '商品', dataIndex: 'item' },
    { title: '品号', dataIndex: ['item', "model"] },
    { title: '编号', dataIndex: ['item', "code"] },
    { title: '规格', dataIndex: ['item', 'attr_str'], key: 'attrs' },
    { title: '数量', dataIndex: 'amount'},
    { title: '单价', dataIndex: 'unit_price', key: 'money'},
    { title: '售价', dataIndex: 'price', key: 'money'},
    { title: '实际金额（元）', dataIndex: 'charge', key: 'money'},
]

export default {
    name: 'PurchaseOrderDetail',
    components: {
        AttachmentFile,
        PurchaseInfo,
        WaybillShow,
        MySteps
    },
    props: {},
    data() {
        return {
            Core,
            loginType: Core.Data.getLoginType(),
            loginOrgId: Core.Data.getOrgId(),
            loginOrgType: Core.Data.getOrgType(),
            STATUS,
            PAYMENT_STATUS,
            // 加载
            loading: false,
            id: '',
            detail: {}, // 采购单详情
            activeKey: ['ItemInfo', 'PurchaseInfo', 'WaybillInfo'],

            stepsList: [
                {status: '100', title: '支付'},
                {status: '200', title: '发货'},
                {status: '300', title: '收货'},
                {status: '400', title: '交易完成'},
            ],

            itemList: [],
            itemColumns: itemColumns,
            total: {
                amount: 0,
                price: 0,
                charge: 0,
            },

            waybill: {},
            waybillInfo: {},

            paymentShow: false,
            payMethodList: PURCHASE.PAY_METHOD_LIST,

            deliverShow: false,
            companyUidList: Core.Const.WAYBILL.COMPANY_LIST,

            form: {
                pay_method: undefined,
                company_uid: undefined,
                waybill_uid: '',
                payment: '',
            },
        };
    },
    watch: {},
    computed: {
        currStep() {
            for (let i = 0; i < this.stepsList.length; i++) {
                const item = this.stepsList[i];
                if (this.detail.status == STATUS.CANCEL) {
                    this.stepsList= [
                        {status: '100', title: '取消'},
                    ]
                    return i
                }
                if (item.status == this.detail.status) {
                    return i
                }
            }
            return 0
        },
        showWaybill() {
            switch (this.detail.status) {
                case STATUS.CLOSE:
                case STATUS.WAIT_PAY:
                case STATUS.INIT:
                case STATUS.WAIT_DELIVER:
                    return false
            }
            return true
        }
    },
    mounted() {
        this.getPurchaseItemList();
        this.getPurchaseInfo()
        this.getWaybillDetail()
    },
    created() {
        this.id = Number(this.$route.query.id) || 0
    },
    methods: {
        authOrg(orgId, orgType) {
            console.log(orgId, orgType, this.loginOrgId, this.loginOrgType)
            if (this.loginOrgId === orgId && this.loginOrgType === orgType) {
                return true
            }
            return false
        },
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'detail':        // 详情
                    routeUrl = this.$router.resolve({
                        path: this.$auth('ADMIN') ? "/item/item-detail" : '/purchase/item-display',
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'list':
                    routeUrl = this.$router.resolve({
                        path: '/item/purchase-order-list',
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'orderList':
                    routeUrl = this.$router.resolve({
                        path: '/purchase/purchase-order-self',
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'refund':
                    routeUrl = this.$router.resolve({
                        path: '/refund/refund-create',
                        query: {
                            order_id: this.id,
                            money: this.detail.charge,
                        }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        // 获取 采购单详情
        getPurchaseInfo() {
            Core.Api.Purchase.detail({
                id: this.id
            }).then(res => {
                this.detail = res
                console.log('getPurchaseInfo err', res)
            }).catch(err => {
                console.log('getPurchaseInfo err', err)
            }).finally(() => {
            });
        },
        // 获取 采购单 商品列表
        getPurchaseItemList() {
            Core.Api.Purchase.itemList({
                order_id: this.id
            }).then(res => {
                let total_amount = 0,total_charge = 0,total_price = 0;
                res.list.forEach(it =>{
                    total_amount += it.amount
                    total_charge += it.charge
                    total_price += it.price
                    let element = it.item || {}
                    if (element.attr_list && element.attr_list.length) {
                        let str = element.attr_list.map(i => i.value).join(' ')
                        element.attr_str = str
                    }
                })
                this.itemList = res.list
                this.total.amount = total_amount
                this.total.charge = total_charge
                this.total.price  = total_price
            }).catch(err => {
                console.log('getPurchaseInfo err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取 物流单信息
        getWaybillDetail() {
            Core.Api.Waybill.detailByTarget({
                target_id: this.id,
                target_type: Core.Const.WAYBILL.TARGET_TYPE.PURCHASE_ORDER,
                type: Core.Const.WAYBILL.TYPE.OUT,
            }).then(res => {
                console.log('getWaybillDetail:', res);
                this.waybill = res.detail
                this.getWaybillInfo(this.waybill.uid, this.waybill.company_uid)
                console.log('getWaybillDetail', this.waybill)
            }).catch(err => {
                console.log('getPurchaseInfo err', err)
            }).finally(() => {
            });
        },
        // 获取 物流单详情
        getWaybillInfo(uid, company_uid) {
            Core.Api.Waybill.queryLogistics({
                uid: uid,
                company_uid: company_uid,
            }).then(res => {
                console.log('getWaybillInfo:', res);
                this.waybillInfo = JSON.parse(res.waybill).result
                console.log('getWaybillInfo', this.waybillInfo)
            }).catch(err => {
                console.log('getPurchaseInfo err', err)
            }).finally(() => {
            });
        },

        // 弹出弹框
        handleModalShow(val) {
            Object.assign(this.form, this.$options.data().form)
            switch (val) {
                case "payment":
                    this.paymentShow = true
                    break;
                case "deliver":
                    this.deliverShow = true
                    break;
            }
        },
        // 确认收款
        handlePayment() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.pay_method) {
                return this.$message.warning('请选择收款方式')
            }
            if (!form.payment) {
                return this.$message.warning('请输入收款金额')
            }
            Core.Api.Purchase.payment({
                id: this.id,
                pay_method: form.pay_method,
                payment: form.payment * 100
            }).then(res => {
                this.getPurchaseInfo()
                this.paymentShow = false
            }).catch(err => {
                console.log('getPurchaseInfo err', err)
                this.$message.success('支付成功')
            }).finally(() => {
                this.loading = false;
            });
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
            Core.Api.Purchase.deliver({
                id: this.id,
                company_uid: form.company_uid,
                waybill_uid: form.waybill_uid,
            }).then(res => {
                this.$message.success('发货成功')
                this.deliverShow = false
                this.getPurchaseInfo()
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
                    Core.Api.Purchase.takeDeliver({
                        id: _this.id
                    }).then(res => {
                        _this.$message.success('收货成功')
                        _this.getPurchaseInfo()
                    }).catch(err => {
                        console.log('handleReceived err', err)
                    })
                },
            });
        },
        // 取消采购
        handleCancel() {
            let _this = this
            this.$confirm({
                title: '确认要取消本次采购吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Purchase.cancel({
                        id: _this.id
                    }).then(res => {
                        _this.$message.success('取消成功')
                        _this.routerChange('orderList')
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
// #PurchaseOrderDetail {}
</style>
