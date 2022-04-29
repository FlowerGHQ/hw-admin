<template>
<div id="PurchaseOrderDetail">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">采购订单详情</div>
            <div class="btns-area">
                <template v-if="detail.status >= STATUS.WAIT_TAKE_DELIVER && $auth('ADMIN')">
                    <!-- 暂时只有平台方 且订单已经发货 可以导出订单 -->
                    <a-button @click="handleExportIn"><i class="icon i_download"/>导出订单</a-button>
                </template>
                <template v-if="authOrg(detail.supply_org_id, detail.supply_org_type)">
                    <a-button type="primary" v-if="detail.payment_status !== PAYMENT_STATUS.PAY_ALL" @click="handleModalShow('payment')"><i class="icon i_received"/>确认收款</a-button>
                    <a-button type="primary" v-if="detail.status === STATUS.WAIT_DELIVER" @click="handleModalShow('deliver')" :disabled="exportDisabled"><i class="icon i_deliver"/>发货</a-button>
                </template>
                <template v-if="authOrg(detail.org_id, detail.org_type)">
                    <a-button type="primary" v-if="detail.status === STATUS.WAIT_TAKE_DELIVER" @click="handleReceived()"><i class="icon i_goods"/>确认收货</a-button>
                    <a-button type="primary" v-if="detail.status === STATUS.WAIT_PAY"     @click="handleCancel()"><i class="icon i_close_c"/>取消</a-button>
                    <a-button type="primary" v-if="detail.status === STATUS.DEAL_SUCCESS" @click="routerChange('aftersales')" ghost><i class="icon i_edit"/>申请售后</a-button>
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
                <!-- 商品信息 -->
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
                                    {{$Util.priceUnitFilter(detail.currency)}} {{$Util.countFilter(text)}}
                                </template>
                                <template v-if="column.key === 'spec'">
                                    {{$Util.itemSpecFilter(text)}}
                                </template>
                            </template>
                            <template #summary>
                                <a-table-summary>
                                    <a-table-summary-row>
                                        <a-table-summary-cell :index="0" :col-span="4">合计</a-table-summary-cell>
                                        <a-table-summary-cell :index="1" :col-span="1">总数量:{{total.amount}}件</a-table-summary-cell>
                                        <a-table-summary-cell :index="1" :col-span="1">运费:{{$Util.priceUnitFilter(detail.currency)}}{{$Util.countFilter(total.freight) || '0'}}</a-table-summary-cell>
                                        <a-table-summary-cell :index="4" :col-span="1">总售价:{{$Util.priceUnitFilter(detail.currency)}} {{$Util.countFilter(total.price + (total.freight || 0))}}</a-table-summary-cell>
                                        <!-- <a-table-summary-cell :index="5" :col-span="1">总金额:{{$Util.priceUnitFilter(detail.currency)}} {{$Util.countFilter(total.charge)}}</a-table-summary-cell> -->
                                    </a-table-summary-row>
                                </a-table-summary>
                            </template>
                        </a-table>
                    </div>
                </a-collapse-panel>

                <!-- 订单信息 -->
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
                            <template v-if="detail.supply_org_type === USER_TYPE.ADMIN">
                                <div class="info-item">
                                    <div class="key">支付条款</div>
                                    <div class="value">{{DISTRIBUTOR.PAY_TIME_MAP[detail.pay_clause] || '-'}}</div>
                                </div>
                            </template>
                            <div class="info-item">
                                <div class="key">备注信息</div>
                                <div class="value">{{detail.remark || '-'}}</div>
                            </div>
                            <!-- <div class="info-item">
                                <div class="key">支付方式</div>
                                <div class="value">{{$Util.purchasePayMethodFilter(detail.pay_method) || '-'}}</div>
                            </div> -->
                        </a-col>
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block" v-if="detail.supply_org_type === USER_TYPE.ADMIN">
                            <div class="info-item">
                                <div class="key">是否同意分批发货</div>
                                <div class="value">{{ FLAG_PART_SHIPMENT_MAP[detail.flag_part_shipment] || '-' }}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">是否同意转运</div>
                                <div class="value">{{ FLAG_TRANSFER_MAP[detail.flag_transfer] || '-' }}</div>
                            </div>
                        </a-col>
                    </a-row>
                </a-collapse-panel>

                <AttachmentFile :target_id='id' :target_type='Core.Const.ATTACHMENT.TARGET_TYPE.PURCHASE_ORDER' :detail='detail' @submit="getPurchaseInfo" ref="AttachmentFile"/>
                
                <!-- 物流信息 -->
                <a-collapse-panel key="WaybillInfo" header="收货信息" class="gray-collapse-panel">
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
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='12' class="info-block">
                            <div class="info-item">
                                <div class="key">联系方式</div>
                                <div class="value" v-if="detail.receive_info !=null">{{detail.receive_info.phone || '-'}}</div>
                                <div class="value" v-else>-</div>
                            </div>
                            <div class="info-item" v-if="detail.supply_org_type === USER_TYPE.ADMIN">
                                <div class="key">发货港口</div>
                                <div class="value" >{{detail.harbour || '-'}}</div>
                            </div>
                            <div class="info-item" v-if="detail.supply_org_type === USER_TYPE.DISTRIBUTOR">
                                <div class="key">收货方式</div>
                                <div class="value" >{{WAYBILL.RECEIPT_MAP[detail.receive_type] || '-'}}</div>
                            </div>
                            <!-- <div class="info-item">
                                <div class="key">物流信息</div>
                                <div class="value">
                                    <WaybillShow v-if="waybillInfo && showWaybill" @change="getWaybillDetail" :detail='waybill' :list='waybillInfo.list' :can-edit="$auth('ADMIN')" />
                                    <template v-else>暂无物流信息</template>
                                </div>
                            </div> -->
                        </a-col>
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block" v-if="detail.supply_org_type === USER_TYPE.ADMIN">
                            <div class="info-item">
                                <div class="key">快递方式</div>
                                <div class="value" >{{WAYBILL.COURIER_MAP[detail.express_type] || '-'}}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">单号</div>
                                <div class="value" >{{detail.waybill || '-'}}</div>
                            </div>
                        </a-col>
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block" >
                            <div class="info-item" v-if="detail.supply_org_type === USER_TYPE.DISTRIBUTOR">
                                <div class="key">快递单号</div>
                                <div class="value" >{{detail.waybill_uid || '-'}}</div>
                            </div>
                        </a-col>
                    </a-row>
                </a-collapse-panel>
            </a-collapse>
        </div>
    </div>
    <template class="modal-container">
        <!-- 确认收款 -->
        <a-modal v-model:visible="paymentShow" title="确认收款" @ok="handlePayment">
            <div class="modal-content">
                <!-- 国外暂无支付宝微信银行卡支付方式，先隐藏 -->
                <!-- <div class="form-item required">
                    <div class="key">收款方式</div>
                    <div class="value">
                        <a-select v-model:value="form.pay_method" placeholder="请选择收款方式">
                            <a-select-option v-for="pay of payMethodList" :key="pay.value" :value="pay.value">{{pay.name}}</a-select-option>
                        </a-select>
                    </div>
                </div> -->
                <div class="form-item required">
                    <div class="key">收款金额</div>
                    <div class="value">
                        <a-input-number 
                            v-model:value="form.payment" 
                            :min="0" 
                            :max="((detail.freight_price||0)+detail.charge-detail.payment)/100" 
                            :precision="2" 
                            :prefix="`${$Util.priceUnitFilter(detail.currency)}`"
                            placeholder="0.00"
                        />
                        <!-- <span>{{$Util.priceUnitFilter(detail.currency)}}</span> -->
                    </div>
                </div>
            </div>
        </a-modal>
        <!-- 确认发货 -->
        <a-modal v-model:visible="deliverShow" title="确认发货" @ok="handleDeliver">
            <div class="modal-content">
                <div class="form-item required" v-if="$auth('ADMIN')">
                    <div class="key">快递方式</div>
                    <div class="value">
                        <a-select v-model:value="form.express_type" placeholder="请选择快递方式">
                            <a-select-option v-for="courier of courierTypeList" :key="courier.value" :value="courier.value">{{courier.name}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item" v-if="$auth('ADMIN')">
                    <div class="key">单号:</div>
                    <div class="value">
                        <a-input v-model:value="form.waybill" placeholder="请输入单号"/>
                    </div>
                </div>
                <div class="form-item required" v-if="$auth('ADMIN')">
                    <div class="key">发货港口:</div>
                    <div class="value">
                        <a-input v-model:value="form.harbour" placeholder="请输入发货港口"/>
                    </div>
                </div>
                <div class="form-item required" v-if="$auth('DISTRIBUTOR')">
                    <div class="key">收货方式</div>
                    <div class="value">
                        <a-select v-model:value="form.receive_type" placeholder="请选择收货方式">
                            <a-select-option v-for="receive of receiveTypeList" :key="receive.value" :value="receive.value">{{receive.name}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item" v-if="$auth('DISTRIBUTOR')">
                    <div class="key">快递单号:</div>
                    <div class="value">
                        <a-input v-model:value="form.waybill_uid" placeholder="请输入快递单号"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{$Util.priceUnitFilter(detail.currency)}} 运费:</div>
                    <div class="value">
                        <a-input-number 
                            v-model:value="form.freight_price"
                            placeholder="0.00"
                            style="width: 120px"
                            :min="0.00" 
                            :precision="2"
                            :prefix="`${$Util.priceUnitFilter(detail.currency)}`" />
                    </div>
                </div>
                <div class="form-item required" v-if="$auth('ADMIN')">
                    <div class="key">支付条款:</div>
                    <div class="value">
                        <a-select v-model:value="form.pay_clause" placeholder="请选择支付条款">
                            <a-select-option v-for="(item,index) of paymentTimeList" :key="index" :value="item.value">{{ item.text }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item" >
                    <div class="key">备注信息:</div>
                    <div class="value">
                        <a-input v-model:value="form.remark" placeholder="请输入备注信息"/>
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
import AttachmentFile from '@/components/panel/AttachmentFile.vue';

const PURCHASE = Core.Const.PURCHASE;
const DISTRIBUTOR = Core.Const.DISTRIBUTOR;
const WAYBILL = Core.Const.WAYBILL;

const STATUS = Core.Const.PURCHASE.STATUS;
const PAYMENT_STATUS = Core.Const.PURCHASE.PAYMENT_STATUS;
const FLAG_PART_SHIPMENT_MAP = Core.Const.PURCHASE.FLAG_PART_SHIPMENT_MAP;
const FLAG_TRANSFER_MAP = Core.Const.PURCHASE.FLAG_TRANSFER_MAP;
const USER_TYPE = Core.Const.USER.TYPE;
const itemColumns = [
    { title: '商品', dataIndex: 'item' },
    { title: '品号', dataIndex: ['item', "model"] },
    { title: '编号', dataIndex: ['item', "code"] },
    { title: '规格', dataIndex: ['item', 'attr_list'], key: 'spec' },
    { title: '数量', dataIndex: 'amount'},
    { title: '单价', dataIndex: 'unit_price', key: 'money'},
    { title: '售价', dataIndex: 'price', key: 'money'},
    // { title: '实际金额', dataIndex: 'charge', key: 'money'},
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
            FLAG_PART_SHIPMENT_MAP,
            FLAG_TRANSFER_MAP,
            PURCHASE ,
            DISTRIBUTOR,
            WAYBILL,
            USER_TYPE,

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
                freight: 0, // 运费
            },

            waybill: {},
            waybillInfo: {},

            paymentShow: false,
            payMethodList: PURCHASE.PAY_METHOD_LIST,
            paymentTimeList: DISTRIBUTOR.PAY_TIME_LIST,

            deliverShow: false,
            companyUidList: WAYBILL.COMPANY_LIST,
            courierTypeList: WAYBILL.COURIER_LIST,
            receiveTypeList: WAYBILL.RECEIPT_LIST,

            form: {
                express_type: undefined, // 快递方式
                waybill: '', // 物流单号
                harbour: '', // 发货港口
                receive_type: undefined, // 收货方式
                freight_price: '', // 运费
                pay_method: undefined, // 收款方式
                pay_clause: undefined, // 支付条款
                remark: '', // 备注
                company_uid: undefined,
                waybill_uid: '', // 快递单号
                payment: '', // 收款金额
            },

            exportDisabled: false, // 导出按钮禁用
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
        // this.getWaybillDetail()
    },
    created() {
        this.id = Number(this.$route.query.id) || 0
    },
    methods: {
        authOrg(orgId, orgType) {
            console.log("authOrg", orgId, orgType, this.loginOrgId, this.loginOrgType)
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
                case 'aftersales':
                    routeUrl = this.$router.resolve({
                        path: '/aftersales/aftersales-edit',
                        query: {
                            order_id: this.id,
                            order_sn: this.detail.sn,
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
                this.detail = res.detail;
                this.total.freight = res.detail.freight_price || 0;
                console.log('getPurchaseInfo res', res)
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
            // if (!form.pay_method) {
            //     return this.$message.warning('请选择收款方式')
            // }
            if (!form.payment) {
                return this.$message.warning('请输入收款金额')
            }
            Core.Api.Purchase.payment({
                id: this.id,
                pay_method: form.pay_method,
                payment: form.payment * 100
            }).then(res => {
                this.$message.success('支付成功')
                this.getPurchaseInfo()
                this.paymentShow = false
            }).catch(err => {
                console.log('getPurchaseInfo err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 确认发货
        handleDeliver() {
            let form = Core.Util.deepCopy(this.form);
            const param = {
                id: this.id,
                remark: form.remark,
            }
            let adminRequire = [];
            if(this.$auth('ADMIN')) {
                adminRequire = [
                    { key: 'express_type', msg: '请选择快递方式' },
                    { key: 'harbour', msg: '请填写发货港口' },
                    { key: 'freight_price', msg: '请填写运费' },
                    { key: 'pay_clause', msg: '请选择支付条款' },
                ]
                param['waybill'] = form['waybill'];
            } else if (this.$auth('DISTRIBUTOR')) {
                adminRequire = [
                    { key: 'receive_type', msg: '请选择收货方式' },
                    { key: 'freight_price', msg: '请填写运费' },
                ]
                param['waybill_uid'] = form['waybill_uid'];
            }
            for(let index in adminRequire) {
                let key = adminRequire[index].key
                if(!this.form[key]) {
                    return this.$message.warning(adminRequire[index].msg)
                } else {
                    param[key] = form[key];
                }
            }
            param['freight_price'] = Math.round(param['freight_price'] * 100)
            Core.Api.Purchase.deliver(param).then(res => {
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
        confirmExport() {
            let _this = this;
            this.$confirm({
                title: '确认要导出吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    _this.handleExportIn();
                }
            })
        },
        // 导出订单 
        handleExportIn() {
            const params = {
                id: this.id, // 订单id
                currency: this.detail.currency, // 货币类型
            };

            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.purchaseTemplateExport(params);
            console.log("handlePurchaseExport _exportUrl", exportUrl)
            window.open(exportUrl, '_blank')
            this.exportDisabled = false;
        }
    }
};
</script>

<style lang="less">
// #PurchaseOrderDetail {}
</style>
