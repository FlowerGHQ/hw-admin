<template>
<div class="DeliveryLogs">
    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
        <template #expandIcon><i class="icon i_expan_l"/></template>
        <a-collapse-panel key="DeliveryLogs" :header="$t('n.delivery_logs')" class="gray-collapse-panel">
            <div class="panel-content table-container no-mg">
                <a-table :columns="invoicColumns" :data-source="invoiceList" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'org'">
                            {{ $Util.userTypeFilter(text.org_type, $i18n.locale) }}·{{ text.org_name }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-'}}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <template v-if="authOrg(detail.supply_org_id, detail.supply_org_type)">
                                <a-button type='link' @click="handleModalShow(record.id)">发货明细</a-button>
                            </template>
                            <template v-if="authOrg(detail.org_id, detail.org_type)">
                                <a-button type='link' @click="handleTakeDeliverShow(record.id)">确认收货</a-button>
                                <a-button type='link' @click="handleModalShow(record.id)">收货明细</a-button>
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
                <ItemTable :columns="tableColumns" :data-source="tableData" :loading='modalLoading' v-if="modalShow"/>
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
    <a-modal v-model:visible="deliverShow" :title="$t('p.shipping_confirmation')" @ok="handleDeliver">
        <div class="modal-content">
            <div class="form-item required">
                <div class="key">{{ $t('wa.warehouse') }}：</div>
                <div class="value">
                    <a-select v-model:value="form.warehouse_id" :placeholder="$t('def.select')" :disabled="!!isProd">
                        <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                    </a-select>
                </div>
            </div>
<!--            <div class="form-item required">-->
<!--                <div class="key">{{ $t('in.category') }}：</div>-->
<!--                <div class="value">-->
<!--                    <a-radio-group v-model:value="form.target_type">-->
<!--                        <a-radio v-for="item in targetMap" :key='item.key' :value='item.key'>{{ item[$i18n.locale] }}</a-radio>-->
<!--                    </a-radio-group>-->
<!--                </div>-->
<!--            </div>-->

<!--            <div class="form-item" >-->
<!--                <div class="key">{{$t('p.remark')}}:</div>-->
<!--                <div class="value">-->
<!--                    <a-input v-model:value="form.remark" :placeholder="$t('def.input')"/>-->
<!--                </div>-->
<!--            </div>-->
        </div>
    </a-modal>
</div>
</template>

<script>
import Core from '../../../core';

import ItemTable from '@/components/table/ItemTable.vue';

export default {
    name: "DeliveryLogs",
    components: {
        ItemTable,
    },
    props: {
        orderId: { type: Number },
        detail: {
            type: Object,
        }
    },
    data() {
        return {
            // 加载
            loading: false,
            activeKey: ["DeliveryLogs"],

            invoiceList: [],
            loginType: Core.Data.getLoginType(),
            loginOrgId: Core.Data.getOrgId(),
            loginOrgType: Core.Data.getOrgType(),
            form: {
                warehouse_id: ''
            },


            deliverShow: false,
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
                {title: this.$t('in.sn'), dataIndex: 'uid', key: 'item'},
                {title: this.$t('n.state'), dataIndex: 'status'},
                {title: this.$t('n.operator'), dataIndex: ['apply_user', "account", "name"], key: 'item'},
                {title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time'},
                {title: this.$t('def.operate'), key: 'operation', fixed: 'right'},
            ]
            return columns
        },
        tableColumns() {
            let columns = [
                {title: this.$t('n.name'), dataIndex: ['item','name'], key: 'detail'},
                {title: this.$t('i.categories'), dataIndex: ['item','name']},
                {title: this.$t('i.number'), dataIndex: ['item','category','name'], key: 'item'},
                {title: this.$t('i.code'), dataIndex: ['item','code'], key: 'item'},

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

        authOrg(orgId, orgType) {
            console.log('org',this.loginOrgId === orgId && this.loginOrgType === orgType)
            if (this.loginOrgId === orgId && this.loginOrgType === orgType) {
                return true
            } else{ return false }
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
        handleTakeDeliverShow(id) {
            this.deliverShow = true;
            this.invoiceId = id
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
        handleDeliver() {
            console.log("rowSelection",this.selectedRowItems)
            let form = Core.Util.deepCopy(this.form);
            const param = {
                id: this.id,
                remark: form.remark,
            }
            let adminRequire = [
                { key: 'warehouse_id', msg: '请选择仓库' },
                // { key: 'target_type', msg: '请选择类型' },
            ];
            for(let index in adminRequire) {
                let key = adminRequire[index].key
                if(!this.form[key]) {
                    return this.$message.warning(adminRequire[index].msg)
                } else {
                    param[key] = form[key];
                }
            }
            Core.Api.Purchase.takeDeliver(param).then(res => {
                this.$message.success('收货成功')
                this.deliverShow = false
                this.getWaybillDetail();
                this.getList()
            }).catch(err => {
                console.log('handleDeliver err', err)
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
