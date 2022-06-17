<template>
    <div class="DeliveryLogs">
        <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
            <template #expandIcon><i class="icon i_expan_l"/></template>
            <a-collapse-panel key="DeliveryLogs" :header="type == Core.Const.STOCK_RECORD.TYPE.OUT ? $t('n.delivery_logs'): $t('n.receiving_record')" class="gray-collapse-panel">
                <div class="panel-content table-container no-mg">
                    <a-table :columns="invoicColumns" :data-source="invoiceList" :scroll="{ x: true }"
                             :row-key="record => record.id" :pagination='false'>
                        <template #bodyCell="{ column, text , record }">
                            <template v-if="column.key === 'org'">
                                {{ $Util.userTypeFilter(text.org_type, $i18n.locale) }}·{{ text.org_name }}
                            </template>
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.dataIndex === 'status'">
                                {{ $Util.invoiceStatusFilter(text, $i18n.locale) }}
                            </template>
                            <template v-if="column.key === 'uid'">
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                        text || '-'
                                    }}
                                </a-button>
                            </template>
                            <template v-if="column.key === 'time'">
                                {{ $Util.timeFilter(text) }}
                            </template>
                            <template v-if="column.key === 'operation'">
                                <a-button type='link' @click="handleWaybillShow(record.id)">{{ $t('p.logistics') }}</a-button>
                                <template v-if="authOrg(detail.supply_org_id, detail.supply_org_type)">
                                    <a-button type='link' v-if="type === Core.Const.STOCK_RECORD.TYPE.OUT && record.status === Core.Const.STOCK_RECORD.STATUS.CLOSE && record.waybill === null"  @click="handleDeliverShow(record.id)">{{ $t('p.confirm_delivery') }}</a-button>
                                </template>
                                <template v-if="authOrg(detail.org_id, detail.org_type)">
                                    <a-button type='link' v-if="type === Core.Const.STOCK_RECORD.TYPE.OUT && record.status === Core.Const.STOCK_RECORD.STATUS.CLOSE && record.waybill !== null"  @click="handleTakeDeliverShow(record.id)">{{ $t('p.confirm_the_take_delivery') }}</a-button>
                                    <a-button type='link' v-if="type === Core.Const.STOCK_RECORD.TYPE.OUT" @click="handleModalShow(record.id)">{{ $t('p.take_delivery_detail') }}</a-button>
                                </template>

                            </template>
                        </template>
                    </a-table>
                </div>
            </a-collapse-panel>
        </a-collapse>
        <a-modal v-model:visible="modalShow" :title="$t('n.delivery_logs')" width='860px'>
            <div class="modal-content">
                <div class="table-container">
                    <ItemTable :columns="tableColumns" :data-source="tableData" :loading='modalLoading'
                               v-if="modalShow"/>
                </div>
            </div>
            <template #footer>
                <div class="modal-footer">
                    <div class="paging-area">
                        <a-pagination v-if="!purchaseId"
                                      show-less-items
                                      :hide-on-single-page='false'
                                      :total="total"
                                      :current="currPage"
                                      :default-page-size='pageSize'
                                      @change="pageChange"
                        />
                    </div>
                    <div class="btn-area">
                        <a-button type="primary" @click="modalShow = false">{{ $t('def.sure') }}</a-button>
                    </div>
                </div>
            </template>
        </a-modal>
        <a-modal v-model:visible="waybillShow" :title="$t('n.delivery_logs')" width='860px'>
            <div class="modal-content">
                <div class="info-item"
                     v-if="detail.org_type === USER_TYPE.AGENT || detail.org_type === USER_TYPE.STORE">
                    <div class="key">{{ $t('p.delivery_method') }}</div>
                    {{waybillDetail.express_type}}
<!--                    <div class="value">{{ $Util.purchaseWaybillFilter(waybillDetail.express_type, $i18n.locale || '-') }}</div>-->
                </div>
                <div class="info-item" v-if="detail.org_type === USER_TYPE.DISTRIBUTOR">
                    <div class="key">{{ $t('p.delivery_method') }}</div>
                    <div class="value">{{ $Util.purchaseExpressFilter(waybillDetail.express_type, $i18n.locale) }}</div>
                </div>
                <div class="info-item" v-if="detail.org_type === USER_TYPE.DISTRIBUTOR">
                    <div class="key">港口</div>
                    <div class="value">{{ waybillDetail.port || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">费用</div>
                    <div class="value">{{ waybillDetail.post_fee || '-' }}</div>
                </div>
                <div class="info-item" v-if="detail.waybill">
                    <div class="key">{{ $t('p.shipment_number') }}</div>
                    <div class="value">{{ waybillDetail.waybill || '-' }}</div>
                </div>
            </div>
            <template #footer>
                <div class="btn-area">
                    <a-button type="primary" @click="waybillShow = false">{{ $t('def.sure') }}</a-button>
                </div>
            </template>
        </a-modal>
        <a-modal v-model:visible="takeDeliverShow" :title="$t('p.shipping_confirmation')" @ok="handleTakeDeliver">
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">{{ $t('wa.warehouse') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.warehouse_id" :placeholder="$t('def.select')"
                                  :disabled="!!isProd">
                            <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">{{
                                    item.name
                                }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
            </div>
        </a-modal>
        <a-modal v-model:visible="deliverShow" :title="$t('p.shipping_confirmation')" @ok="handleDeliver">
            <div class="modal-content">
                <template v-if="$auth('ADMIN')">
                    <div class="form-item required">
                        <div class="key">{{ $t('p.delivery_method') }}</div>
                        <div class="value">
                            <a-select v-model:value="form.express_type" :placeholder="$t('def.select')">
                                <a-select-option v-for="courier of courierTypeList" :key="courier.value" :value="courier.value">{{courier.name}}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">{{ $t('p.sn_number') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.waybill" :placeholder="$t('def.input')"/>
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">{{ $t('p.shipping_port') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.harbour" :placeholder="$t('def.input')"/>
                        </div>
                    </div>
                </template>
                <template v-if="$auth('DISTRIBUTOR')">
                    <div class="form-item required">
                        <div class="key">{{ $t('p.ship') }}</div>
                        <div class="value">
                            <a-select v-model:value="form.receive_type" :placeholder="$t('def.select')">
                                <a-select-option v-for="receive of receiveTypeList" :key="receive.value" :value="receive.value">{{receive.name}}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">{{ $t('p.sn_number') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.waybill_uid" :placeholder="$t('def.input')"/>
                        </div>
                    </div>
                </template>
                <div class="form-item required">
                    <div class="key">{{$t('p.freight')}}:</div>
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
                <div class="form-item" >
                    <div class="key">{{$t('p.remark')}}:</div>
                    <div class="value">
                        <a-input v-model:value="form.remark" :placeholder="$t('def.input')"/>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../../core';
const USER_TYPE = Core.Const.USER.TYPE;
const WAYBILL = Core.Const.WAYBILL;

import ItemTable from '@/components/table/ItemTable.vue';

export default {
    name: "DeliveryLogs",
    components: {
        ItemTable,
    },
    props: {
        orderId: {type: Number},
        detail: {
            type: Object,
        },
        type: {
            type: Number,
        }
    },
    data() {
        return {
            Core,
            USER_TYPE,
            // 加载
            loading: false,
            activeKey: ["DeliveryLogs"],

            invoiceList: [],
            loginType: Core.Data.getLoginType(),
            loginOrgId: Core.Data.getOrgId(),
            loginOrgType: Core.Data.getOrgType(),
            courierTypeList: WAYBILL.COURIER_LIST,
            receiveTypeList: WAYBILL.RECEIPT_LIST,
            deliverShow: false,
            form: {
                express_type: undefined, // 快递方式
                waybill: '', // 物流单号
                harbour: '', // 发货港口
                receive_type: undefined, // 收货方式
                freight_price: '', // 运费
                pay_method: undefined, // 收款方式
                // pay_clause: undefined, // 支付条款
                remark: '', // 备注
                company_uid: undefined,
                waybill_uid: '', // 快递单号
                warehouse_id: '',
                target_type: '',
                payment: '', // 收款金额
            },
            waybillDetail:{},
            takeDeliverShow: false,
            waybillShow: false,
            modalShow: false,
            modalLoading: false,
            invoiceId: '',
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            tableData: [],
            warehouseList: [],
        };
    },
    computed: {
        invoicColumns() {
            let columns = [
                {title: this.$t('in.sn'), dataIndex: 'uid', key: 'uid'},
                {title: this.$t('n.state'), dataIndex: 'status'},
                {title: this.$t('n.operator'), dataIndex: ['apply_user', "account", "name"], key: 'item'},
                {title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time'},
                {title: this.$t('def.operate'), key: 'operation', fixed: 'right'},
            ]
            return columns
        },
        tableColumns() {
            let columns = [
                {title: this.$t('n.name'), dataIndex: ['item', 'name'], key: 'detail'},
                {title: this.$t('i.categories'), dataIndex: ['item', 'name']},
                {title: this.$t('i.number'), dataIndex: ['item', 'category', 'name'], key: 'item'},
                {title: this.$t('i.code'), dataIndex: ['item', 'code'], key: 'item'},

                {title: this.$t('i.deliver_amount'), dataIndex: 'amount', key: 'count'},
            ]
            return columns
        },
    },
    mounted() {
        this.getInvoiceList();
        this.getWarehouseList();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'detail':    // 详情
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/invoice-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        authOrg(orgId, orgType) {
            console.log('org', this.loginOrgId === orgId && this.loginOrgType === orgType)
            if (this.loginOrgId === orgId && this.loginOrgType === orgType) {
                return true
            } else {
                return false
            }
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list
            })
        },
        getInvoiceList() {  // 获取 发货记录
            this.loading = true;
            Core.Api.Invoice.listByPurchase({
                source_id: this.orderId,
                source_type: Core.Const.STOCK_RECORD.SOURCE_TYPE.PURCHASE,
                type: this.type,
                status: -1,
                // source_type: Core.Const.STOCK_RECORD.SOURCE_TYPE.ITEM_PURCHASE,
            }).then(res => {
                console.log("getInvoiceList res", res)
                this.invoiceList = res.list
                if (this.invoiceList.length) {
                    this.activeKey = ['DeliveryLogs']
                }
            }).catch(err => {
                console.log('getInvoiceList err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        //
        handleModalShow(id) {
            this.modalShow = true;
            this.invoiceId = id
            this.pageChange(1)
        },
        handleDeliverShow(id) {
            this.deliverShow = true;
            this.invoiceId = id
            console.log(this.invoiceId)
            this.pageChange(1)
        },
        handleTakeDeliverShow(id) {
            this.takeDeliverShow = true;
            this.invoiceId = id
            console.log(this.invoiceId)
            this.pageChange(1)
        },

        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        getTableData() {
            this.modalLoading = true;
            Core.Api.InvoiceItem.list({
                invoice_id: this.invoiceId,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log('getTableData res', res)
                this.total = res.count
                this.tableData = res.list
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.modalLoading = false;
            });
        },
        // 确认收货
        handleTakeDeliver() {
            console.log("rowSelection", this.selectedRowItems)
            let form = Core.Util.deepCopy(this.form);
            const param = {
                id: this.orderId,
                invoice_id: this.invoiceId,
                remark: form.remark,
            }
            console.log(this.id)
            let adminRequire = [
                {key: 'warehouse_id', msg: '请选择仓库'},
                // { key: 'target_type', msg: '请选择类型' },
            ];
            for (let index in adminRequire) {
                let key = adminRequire[index].key
                if (!this.form[key]) {
                    return this.$message.warning(adminRequire[index].msg)
                } else {
                    param[key] = form[key];
                }
            }
            Core.Api.Purchase.takeDeliver(param).then(res => {
                this.$message.success('收货成功')
                this.takeDeliverShow = false
                this.getInvoiceList();
                this.$emit('Submit')
            }).catch(err => {
                console.log('handleDeliver err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleWaybillShow(id){
            this.handleWaybillClear()
            this.target_id = id
            this.getInvoiceList()
            this.waybillShow = true;
        },
        handleWaybillClear(){
            this.form = Core.Util.deepCopy(this.$options.data().form)
            this.waybillShow = false;
        },
        // 确认发货
        handleDeliver() {
            console.log("rowSelection",this.selectedRowItems)
            let form = Core.Util.deepCopy(this.form);
            const param = {
                id: this.orderId,
                invoice_id: this.invoiceId,
                remark: form.remark,
            }
            let adminRequire = [];

            if(this.$auth('ADMIN')) {
                adminRequire = [
                    { key: 'express_type', msg: '请选择快递方式' },
                    { key: 'harbour', msg: '请填写发货港口' },
                    { key: 'freight_price', msg: '请填写运费' },
                    { key: 'waybill', msg: '物流单号' },
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
            param['item_list'] = this.selectedRowItems
            Core.Api.Purchase.deliver(param).then(res => {
                this.$message.success('发货成功')
                this.deliverShow = false
                this.getInvoiceList();
                this.$emit('Submit')
                this.handleWaybillClear()
            }).catch(err => {
                console.log('handleDeliver err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getWaybillInfo() {  // 获取 发货记录
            this.loading = true;
            Core.Api.Waybill.detailByTarget({
                target_id: this.target_id,
                target_type: Core.Const.WAYBILL.TARGET_TYPE.PURCHASE_ORDER,
                type: Core.Const.WAYBILL.TYPE.OUT,
                // source_type: Core.Const.STOCK_RECORD.SOURCE_TYPE.ITEM_PURCHASE,
            }).then(res => {
                console.log("getInvoiceList res", res)
                this.waybillDetail = res.detail
            }).catch(err => {
                console.log('getInvoiceList err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

    },
}
</script>

<style lang="less">
.DeliveryLogs {
    .panel-header {
        .fsb();
        margin-bottom: 20px;

        .name {
            font-weight: 500;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.85);
        }

        .ant-btn {
            border-radius: 2px;
        }
    }
}
</style>
