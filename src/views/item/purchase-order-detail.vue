<template>
    <div id="RepairDetail">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">采购订单详情</div>
                <div class="btns-area">
                    <a-button type="primary" @click="" ><i class="icon i_check_c"/>付款</a-button>
                    <a-button type="primary" @click=""  ><i class="icon i_check_c"/>发货</a-button>
                    <a-button type="primary" @click=""  ><i class="icon i_edit"/>确认收货</a-button>
                    <a-button type="primary" @click=""  ><i class="icon i_edit"/>评论</a-button>
                    <a-button type="primary" @click=""  ><i class="icon i_edit"/>关闭</a-button>

                </div>
            </div>
            <div class="steps-container">
                <a-steps>
                    <a-step v-for="(item, index) of stepsList" :key="index" :status="item.status" :title="item.title">
                        <template #icon>
                            <span v-if="item.status == 'finish'" class="circle icon i_click"/>
                            <span v-else class="circle">{{index + 1}}</span>
                        </template>
                    </a-step>
                </a-steps>
            </div>
            <div class="form-container">
                <div class="info">
                    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                    <template #expandIcon ><i class="icon i_expan_l"/> </template>
                        <a-collapse-panel key="ItemInfo" header="商品信息" class="gray-collapse-panel">
                            <div class="panel-content">
                                <a-table class=" "
                                         :columns="purchaseItemColumns" :data-source="purchaseItemList" :scroll="{ x: true }"
                                         :row-key="record => record.id" :loading='purchaseLoading' :pagination='false'
                                >
                                    <template #bodyCell="{ column, text , record ,index}">
                                        <template v-if="column.dataIndex === 'item_name'">
                                            <img :src="$Util.imageFilter(record.item.logo, 2)" :width="50"  />

                                            {{record.item.name}}
                                            数量:{{record.amount}}
                                        </template>
                                        <template v-if="column.dataIndex === 'unit_price'">
                                            {{$Util.countFilter(text)}}元
                                        </template>
                                        <template v-if="column.dataIndex === 'price'">
                                            {{$Util.countFilter(text)}}元
                                        </template>
                                        <template v-if="column.dataIndex === 'charge'">
                                            {{$Util.countFilter(text)}}元
                                        </template>
                                    </template>
                                    <template #summary>
                                        <a-table-summary>
                                            <a-table-summary-row>
                                                <a-table-summary-cell :index="0" :col-span="2">总数量:{{totle_amount}}件</a-table-summary-cell>
                                                <a-table-summary-cell :index="3" :col-span="1">总售价:{{$Util.countFilter(totle_price)}}元</a-table-summary-cell>
                                                <a-table-summary-cell :index="4" :col-span="1">总实付金额:{{$Util.countFilter(totle_charge)}}元</a-table-summary-cell>
                                            </a-table-summary-row>
                                        </a-table-summary>
                                    </template>

                                </a-table>
                            </div>
                        </a-collapse-panel>
<!--                        <PurchaseInfo :id="id" :detail="detail" :waybill="waybill" :waybillInfo="waybillInfo"/>-->
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
                                        <div class="key">配送地址</div>
                                        <div class="value" v-if="detail.receive_info !=null">{{detail.receive_info.country + detail.receive_info.province + detail.receive_info.city + detail.receive_info.county + detail.receive_info.address || '-'}}</div>
                                        <div class="value" v-else>-</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="key">接受人</div>
                                        <div class="value" v-if="detail.receive_info !=null">{{detail.receive_info.name || '-'}}</div>
                                        <div class="value" v-else>-</div>
                                    </div>

                                </a-col>
                                <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                                    <div class="info-item">
                                        <div class="key">联系方式</div>
                                        <div class="value" v-if="detail.receive_info !=null">{{detail.receive_info.phone || '-'}}</div>
                                        <div class="value" v-else>-</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="key">物流信息</div>
                                        <div class="value">{{waybill.uid}}</div>
                                        <div class="value">{{waybill.companyUid}}</div>
                                        <WaybillShow v-if="waybillInfo" :detail='waybill' :list='waybillInfo.list' :can-edit='true'/>
                                        <template v-else>暂无物流信息</template>
<!--                                        <div class="value">{{waybillInfo}}</div>-->
                                    </div>
                                </a-col>
                            </a-row>
                        </a-collapse-panel>
                    </a-collapse>
                </div>
            </div>
        </div>
        <template class="modal-container">
            <a-modal v-model:visible="modalFailShow" width="600px" title="商品" @ok="">
                <div class="modal-content">
                    <div class="form-item">
                        <div class="key">维修结果</div>
                        <div class="value">
<!--                            <a-select v-model:value="repairForm.results" placeholder="请选择维修结果">-->
<!--                                <a-select-option v-for="results of resultsList" :key="results.value" :value="results.value">{{results.name}}</a-select-option>-->
<!--                            </a-select>-->
                        </div>
                    </div>
<!--                    <div class="form-item" v-if="repairForm.results == Core.Const.REPAIR.RESULTS.FAIL">-->
<!--                        <div class="key">失败原因</div>-->
<!--                        <div class="value">-->
<!--                            <a-input v-model:value="repairForm.fail_remark" placeholder="请输入失败原因"/>-->
<!--                        </div>-->
<!--                    </div>-->
                </div>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import axios from 'axios';
// import PurchaseList from "./purchase-order-list";
import PurchaseInfo from "./components/PurchaseInfo.vue"
import WaybillShow from "@/components/WaybillShow.vue"


const REPAIR = Core.Const.REPAIR
const purchaseItemColumns = [
    { title: '商品', dataIndex: 'item_name' },
    { title: '单价', dataIndex: 'unit_price'  },
    { title: '售价', dataIndex: 'price'    },
    { title: '实际金额（元）', dataIndex: 'charge'    },
]

export default {
    name: 'RepairDetail',
    components: {
        // PurchaseList,
        PurchaseInfo,
        WaybillShow,
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            id: '',
            detail: {}, // 采购单详情
            activeKey:0,
            active: null,
            waybill: '',
            waybillInfo: '',
            modalFailShow: false,
            totle_amount: 0,
            totle_price: 0,
            totle_charge: 0,
            purchaseItemList: [],
            purchaseLoading: false,
            purchaseItemColumns: purchaseItemColumns,
            Core: Core,
            stepsList: [
                {status: 'finish', title: '已分配工单'},
                {status: 'process', title: '确认中...'},
                {status: 'wait', title: '待检测维修'},
                {status: 'wait', title: '工单完成'},
            ],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.handlePurchaseItemSearch();
        this.getPurchaseInfo()
        this.getWaybill()
    },
    methods: {
        repairDetection() {
            this.$refs.CheckFault.repairDetection();
        },
        getPurchaseInfo() {
            Core.Api.Purchase.detail({
                id: this.id
            }).then(res => {
                this.detail = res
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
            });
        },
        getWaybill() {
            Core.Api.Waybill.detailByTarget({
                targetId: this.id,
                targetType: Core.Const.WAYBILL.TARGET_TYPE.PURCHASE_ORDER,
                type: Core.Const.WAYBILL.TYPE.OUT,
            }).then(res => {
                this.waybill = res
                this.getWaybillInfo(this.waybill.uid, this.waybill.companyUid)
                // this.getWaybillInfo("JD0060147134468", this.waybill.companyUid)
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
            });
        },
        getWaybillInfo(uid, companyUid) {
            Core.Api.Waybill.queryLogistics({
                uid: uid,
                company_uid: companyUid,
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
                id: this.id
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
    }
};
</script>

<style lang="less" scoped>
#RepairDetail {
    .ant-collapse-content-box {
        padding: 0px;
    }
    .gray-panel.info {

        .left {
            font-size: 12px;
            color: #465670;
            span {
                color: #A5ACB8;
            }
        }
        .right {
            .fcc();
            font-size: 12px;
            .staff {
                color: rgba(0, 0, 0, 0.85);
                margin-right: 12px;
                font-weight: 500;
            }
            .status {
                .fcc();
                .i_point {
                    margin-right: 6px;
                }
            }
        }
        .panel-content {
            .fsb(flex-start);
            padding-bottom: 15px;
        }
        .info-item {
            flex: 1;
            font-size: 12px;
            .key {
                color: #8090A6;
            }
            .value {
                margin-top: 10px;
                color: #363D42;
            }
        }
    }
    .steps-container {
        margin: 20px;
    }
}
</style>
