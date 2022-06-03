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
                            <a-button type='link' @click="handleModalShow(record.id)">发货明细</a-button>
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
    },
    data() {
        return {
            // 加载
            loading: false,
            activeKey: ["DeliveryLogs"],

            invoiceList: [],

            modalShow: false,
            modalLoading: false,
            invoiceId: '',
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            tableData: [],
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
    },
    methods: {
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

        // 添加附件
        handleModalShow(id) {
            this.modalShow = true;
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
        }
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
