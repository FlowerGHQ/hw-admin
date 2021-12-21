<template>
<div id="PurchaseOrderDetail">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">采购订单详情</div>
            <div class="btns-area">
                <a-button type="primary" @click="handlePurchaseStatus('payment')" v-if="detail.status == PURCHASE.STATUS.WAIT_PAY && $auth('ADMIN')" ><i class="icon i_check_c"/>已收款</a-button>
                <a-button type="primary" @click="handlePurchaseStatus('deliver')"  v-if="detail.status == PURCHASE.STATUS.WAIT_DELIVER && $auth('ADMIN')" ><i class="icon i_check_c"/>发货</a-button>
                <a-button type="primary" @click="handlePurchaseStatus('takeDeliver')"  v-if="detail.status == PURCHASE.STATUS.WAIT_TAKE_DELIVER && $auth('AGENT', 'STORE')" ><i class="icon i_edit"/>确认收货</a-button>
                <a-button type="primary" @click="handlePurchaseStatus('review')" v-if="detail.status == PURCHASE.STATUS.DEAL_SUCCESS && detail.flag_review == PURCHASE.FLAG_REVIEW.SUCCESS && $auth('AGENT', 'STORE')"  ><i class="icon i_edit"/>评论</a-button>
                <a-button type="primary" @click="handlePurchaseStatus('cancel')"  v-if="detail.status == PURCHASE.STATUS.WAIT_PAY && $auth('AGENT', 'STORE')" ><i class="icon i_edit"/>关闭</a-button>
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content">
                <MySteps :stepsList='stepsList' :current='currStep'/>
            </div>
        </div>
        <div class="form-container">
            <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                <template #expandIcon ><i class="icon i_expan_l"/> </template>
                <a-collapse-panel key="ItemInfo" header="商品信息" class="gray-collapse-panel">
                    <div class="panel-content">
                        <a-table :columns="purchaseItemColumns" :data-source="purchaseItemList" :scroll="{ x: true }"
                            :row-key="record => record.id" :loading='purchaseLoading' :pagination='false'>
                            <template #bodyCell="{ column, text , record}">
                                <template v-if="column.dataIndex === 'item'">
                                    <div class="table-img">
                                        <a-image :width="30" :height="30" :src="$Util.imageFilter(text ? text.logo : '', 2)"/>
                                        <a-tooltip placement="top" :title='text.name'>
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
                                        <a-table-summary-cell :index="0" :col-span="3">总数量:{{totle_amount}}件</a-table-summary-cell>
                                        <a-table-summary-cell :index="4" :col-span="1">总售价:{{$Util.countFilter(totle_price)}}元</a-table-summary-cell>
                                        <a-table-summary-cell :index="5" :col-span="1">总实付金额:{{$Util.countFilter(totle_charge)}}元</a-table-summary-cell>
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
                                <div class="value">{{$Util.puechasePayMethodFilter(detail.pay_method) || '-'}}</div>
                            </div>
                        </a-col>
                    </a-row>
                </a-collapse-panel>
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
                                    <WaybillShow v-if="waybillInfo && detail.status != PURCHASE.STATUS.CLOSE && detail.status != PURCHASE.STATUS.WAIT_PAY && detail.status != PURCHASE.STATUS.INIT && detail.status != PURCHASE.STATUS.WAIT_DELIVER" @change="getWaybill" :detail='waybill' :list='waybillInfo.list' :can-edit="$auth('ADMIN')" />
                                    <template >暂无物流信息</template>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </a-collapse-panel>
            </a-collapse>
        </div>
    </div>
    <template class="modal-container">
        <a-modal v-model:visible="paymentShow" width="600px" title="支付" @ok="handlePayment">
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">支付方式</div>
                    <div class="value">
                        <a-select v-model:value="form.pay_method" placeholder="请选择支付方式">
                            <a-select-option v-for="pay of payMethodList" :key="pay.value" :value="pay.value">{{pay.name}}</a-select-option>
                        </a-select>
                    </div>
                </div>
            </div>
        </a-modal>
        <a-modal v-model:visible="deliverShow" width="600px" title="发货" @ok="handleDeliver">
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
        <a-modal v-model:visible="reviewShow" width="600px" title="评价" @ok="handleReview">
            <div class="modal-content">
                <div class="form-item">
                    <div class="key">评论</div>
                    <div class="value">
                        <a-input v-model:value="form.review" placeholder="请输入评论"/>
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
import WaybillShow from "@/components/WaybillShow.vue"
import MySteps from "@/components/MySteps.vue"

const purchaseItemColumns = [
    { title: '商品', dataIndex: 'item' },
    { title: '数量', dataIndex: 'amount'},
    { title: '单价', dataIndex: 'unit_price', key: 'money'},
    { title: '售价', dataIndex: 'price', key: 'money'},
    { title: '实际金额（元）', dataIndex: 'charge', key: 'money'},
]

export default {
    name: 'PurchaseOrderDetail',
    components: {
        PurchaseInfo,
        WaybillShow,
        MySteps
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            PURCHASE: Core.Const.PURCHASE,
            // 加载
            loading: false,
            id: '',
            detail: {}, // 采购单详情
            activeKey: ['ItemInfo', 'PurchaseInfo', 'WaybillInfo'],

            waybill: '',
            waybillInfo: '',
            paymentShow: false,
            deliverShow: false,
            reviewShow: false,
            totle_amount: 0,
            totle_price: 0,
            totle_charge: 0,
            payMethodList: Core.Const.PURCHASE.PAY_METHOD_LIST,
            companyUidList: Core.Const.WAYBILL.COMPANY_LIST,
            form: {
                pay_method: undefined,
                company_uid: undefined,
                waybill_uid: '',
                review: '',
            },
            purchaseItemList: [],
            purchaseLoading: false,
            purchaseItemColumns: purchaseItemColumns,

            stepsList: [
                {status: '100', title: '支付'},
                {status: '200', title: '发货'},
                {status: '300', title: '收货'},
                {status: '400', title: '交易完成'},
            ],
        };
    },
    watch: {},
    computed: {
        currStep() {
            for (let i = 0; i < this.stepsList.length; i++) {
                const item = this.stepsList[i];
                if (item.status == this.detail.status) {
                    return i
                }
            }
            return 0
        }
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.handlePurchaseItemSearch();
        this.getPurchaseInfo()
        this.getWaybill()
    },
    methods: {
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
            }
        },
        getPurchaseInfo() {
            Core.Api.Purchase.detail({
                id: this.id
            }).then(res => {
                this.detail = res
                console.log('getRepairDetail err', res)
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
            });
        },
        getWaybill() {
            Core.Api.Waybill.detailByTarget({
                target_id: this.id,
                target_type: Core.Const.WAYBILL.TARGET_TYPE.PURCHASE_ORDER,
                type: Core.Const.WAYBILL.TYPE.OUT,
            }).then(res => {
                this.waybill = res.detail
                this.getWaybillInfo(this.waybill.uid, this.waybill.company_uid)
                // this.getWaybillInfo("JD0060147134468", this.waybill.companyUid)
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
            });
        },
        getWaybillInfo(uid, company_uid) {
            Core.Api.Waybill.queryLogistics({
                uid: uid,
                company_uid: company_uid,
            }).then(res => {
                this.waybillInfo = JSON.parse(res.waybill).result
                console.log('waybillInfo', this.waybillInfo)
                // console.log('waybillInfo', res.waybill)
                // console.log('waybillInfo', JSON.parse(res.waybill))
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
            });
        },
        handlePurchaseItemSearch() {
            Core.Api.Purchase.itemList({
                order_id: this.id
            }).then(res => {
                this.totle_amount = 0
                this.totle_charge = 0
                this.totle_price = 0
                this.purchaseItemList = res.list
                this.purchaseItemList.forEach(it =>{
                    this.totle_amount += it.amount
                    this.totle_charge += it.charge
                    this.totle_price += it.price
                })
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handlePurchaseStatus(val) {
            switch (val){
                case "payment":
                    this.paymentShow = true
                    break;
                case "deliver":
                    this.deliverShow = true
                    break;
                case "takeDeliver":
                    Core.Api.Purchase.takeDeliver({
                        id: this.id
                    }).then(res => {
                        this.$message.success('收货成功')
                        this.getPurchaseInfo()
                    }).catch(err => {
                        console.log('getRepairDetail err', err)
                    }).finally(() => {
                        this.loading = false;
                    });
                    break;
                case "review":
                    this.reviewShow = true
                    break;
                case "cancel":
                    Core.Api.Purchase.cancel({
                        id: this.id
                    }).then(res => {
                        this.$message.success('取消成功')
                        // this.getPurchaseInfo()
                        this.routerChange("list")
                    }).catch(err => {
                        console.log('getRepairDetail err', err)
                    }).finally(() => {
                        this.loading = false;
                    });
                    break;
            }
        },
        handlePayment() {
            Core.Api.Purchase.payment({
                id: this.id,
                ...this.form
            }).then(res => {
                this.getPurchaseInfo()
                this.paymentShow = false
            }).catch(err => {
                console.log('getRepairDetail err', err)
                this.$message.success('支付成功')
            }).finally(() => {
                this.loading = false;

            });
        },
        handleDeliver() {
            Core.Api.Purchase.deliver({
                id: this.id,
                ...this.form
            }).then(res => {
                this.getPurchaseInfo()
                this.deliverShow = false
                this.$message.success('发货成功')
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;

            });
        },
        handleReview() {
            Core.Api.Purchase.review({
                id: this.id,
                ...this.form
            }).then(res => {
                this.getPurchaseInfo()
                this.$message.success('评论成功')
                this.reviewShow = false
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less">
// #PurchaseOrderDetail {}
</style>
