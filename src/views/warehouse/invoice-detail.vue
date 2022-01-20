<template>
<div id="InvoiceDetail" class="list-container">
    <div class="title-container">
        <div class="title-area">出入库单详情</div>
        <a-button type="primary" ghost @click="handleInvoiceShow()"
            v-if="[STATUS.AIT_AUDIT].includes(detail.status)"><i class="icon i_edit"/>审核</a-button>
    </div>
    <div class="gray-panel info">
        <div class="panel-title">
            <div class="left"><span>出入库单编号</span> {{ detail.uid }}</div>
        </div>
        <div class="panel-content">
            <div class="info-item">
                <div class="key">出入库单类型</div>
                <div class="value">{{ $Util.stockRecordFilter(detail.type || '-') }}</div>
            </div>
            <div class="info-item">
                <div class="key">所属仓库</div>
                <div class="value">{{ detail.warehouse.name || '-' }}</div>
            </div>
            <div class="info-item">
                <div class="key">仓库类型</div>
                <div class="value">{{ $Util.stockTypeFilter(detail.type || '-') }}</div>
            </div>
            <div class="info-item">
                <div class="key">创建时间</div>
                <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
            </div>
        </div>
    </div>
    <a-collapse v-model:activeKey="activeKey" ghost>
        <a-collapse-panel key="affirm" header="商品信息" class="gray-collapse-panel">
            <div class="panel-content table-container no-mg">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text }">
                        <template v-if="column.key === 'item-name'">
                            <a-tooltip placement="top" :title='text'>
                                {{ text ? text.name : '-' }}
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item-code'">
                            {{ text ? text.code : '-' }}
                        </template>
                        <template v-if="column.key === 'item-stock'">
                            {{ text ? text.stock : '-' }}
                        </template>
                        <template v-if="column.key === 'amount'">
                            {{ text ? text.amount : '-' }}件
                        </template>
                    </template>
                </a-table>
            </div>
        </a-collapse-panel>
    </a-collapse>
    <template class="modal-container">
        <a-modal v-model:visible="invoiceShow" title="审核"
            class="warehouse-edit-modal" :after-close='handleInvoiceClose'>
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">审核结果:</div>
                    <a-radio-group v-model:value="editForm.status">
                        <a-radio :value="STATUS.AUDIT_PASS">通过</a-radio>
                        <a-radio :value="STATUS.AUDIT_REFUSE">不通过</a-radio>
                    </a-radio-group>
                </div>
                <div class="form-item textarea required" v-if="editForm.status === STATUS.AUDIT_REFUSE">
                    <div class="key">原因:</div>
                    <div class="value">
                        <a-textarea v-model:value="editForm.audit_message" placeholder="请输入不通过原因" :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="invoiceShow = false">取消</a-button>
                <a-button @click="handleInvoiceSubmit" type="primary">确定</a-button>
            </template>
        </a-modal>
    </template>
</div>
</template>

<script>
import Core from '../../core';
const STOCK_TYPE = Core.Const.STOCK_RECORD.TYPE
export default {
    name: 'InvoiceDetail',
    components: {},
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            STATUS: Core.Const.STOCK_RECORD.STATUS,
            id: '',
            detail: {
                warehouse: {}
            },
            activeKey: ['affirm'],
            tableData: [],
            invoiceShow: false,
            editForm: {
                status: 20,
                audit_message: '',
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: '商品名称', dataIndex: 'item', key: 'item-name'},
                {title: '商品编码', dataIndex: 'item', key: 'item-code'},
                {title: '库存数量', dataIndex: 'item', key: 'item-stock'},
                {title: '数量', dataIndex: 'amount', key: 'item-amount'},
            ]
            if (this.detail.type == STOCK_TYPE.TYPE_IN) { // 入库不显示库存数量
                columns.splice(2, 1)
            }
            return columns
        },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getInvoiceDetail();
        this.getInvoiceList();
    },
    methods: {
        handleInvoiceShow() { // 显示弹框
            this.invoiceShow = true
        },
        handleInvoiceClose() { // 关闭弹框
            this.invoiceShow = false;
        },
        handleInvoiceSubmit() { // 审核提交
            this.loading = true;
            Core.Api.Invoice.audit({
                id: this.id,
                ...this.editForm
            }).then(res => {
                console.log('handleInvoiceSubmit res', res)
                this.routerChange('back')
            }).catch(err => {
                console.log('handleInvoiceSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        getInvoiceDetail() {
            this.loading = true;
            Core.Api.Invoice.detail({
                id: this.id
            }).then(res => {
                console.log('getInvoiceDetail res', res)
                this.detail = res.detail
            }).catch(err => {
                console.log('getInvoiceDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getInvoiceList() {
            this.loading = true;
            Core.Api.Invoice.itemList({
                invoice_id: this.id,
            }).then(res => {
                console.log('getInvoiceList res', res)
                this.tableData = res.list
            }).catch(err => {
                console.log('getInvoiceList err', err)
            }).finally(() => {
                this.loading = false;
            });

        },
    }
};
</script>
<style lang="less">
// #InvoiceDetail {}
</style>