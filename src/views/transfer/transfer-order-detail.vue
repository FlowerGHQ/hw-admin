<template>
    <div id="TransferOrderDetail" class="edit-container">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">调货单详情</div>
                <a-button type="primary" ghost @click="handleTransferShow()"
                          v-if="[STATUS.WAIT_AUDIT].includes(detail.status)"><i class="icon i_edit"/>审核
                </a-button>
            </div>
            <div class="gray-panel info">
                <div class="panel-title">
                    <div class="left">
                        <span>出入库单编号</span> {{ detail.uid }}
                    </div>
                </div>
                <div class="panel-content">
                    <div class="info-item">
                        <div class="key">所属仓库</div>
                        <div class="value">{{ detail.to_warehouse.name || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">仓库类型</div>
                        <div class="value">{{ $Util.stockTypeFilter(detail.to_warehouse.type || '-') }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">创建时间</div>
                        <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                    </div>
                </div>
            </div>
            <a-collapse v-model:activeKey="activeKey" ghost>
                <a-collapse-panel key="affirm" header="商品信息" class="gray-collapse-panel">

                    <div class="panel-content">
                        <div class="table-container">
                            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                                     :row-key="record => record.id" :pagination='false'>
                                <template #bodyCell="{ column, text , index, record}">
                                    <template v-if="column.key === 'item-name'">
                                        <a-tooltip placement="top" :title='text'>
                                            {{ text ? text.name : '-' }}
                                        </a-tooltip>
                                    </template>
                                    <template v-if="column.key === 'item-code'">
                                        {{ text ? text.code : '-' }}
                                    </template>
                                    <template v-if="column.key === 'amount'">
                                        {{ text ? text.amount : '-' }}件
                                    </template>
                                </template>
                            </a-table>
                        </div>
                    </div>
                </a-collapse-panel>
            </a-collapse>
            <template class="modal-container">
                <a-modal v-model:visible="transferShow" title="审核"
                         class="warehouse-edit-modal" :after-close='handleInvoiceClose'>
                    <div class="modal-content">
                        <div>
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
                    </div>
                    <template #footer>
                        <a-button @click="transferShow = false">取消</a-button>
                        <a-button @click="handleTransferSubmit" type="primary">确定</a-button>
                    </template>
                </a-modal>
            </template>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

export default {
    name: 'TransferOrderDetail',
    components: {},
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            id: '',
            STATUS: Core.Const.TRANSFER_ORDER.STATUS,
            detail: {
                to_warehouse: {}
            },
            activeKey: ['affirm'],
            tableData: [],
            tableColumns: [
                {title: '商品名称', dataIndex: 'item', key: 'item-name'},
                {title: '商品编码', dataIndex: 'item', key: 'item-code'},
                {title: '数量', dataIndex: 'amount', key: 'item-amount'},
            ],
            transferShow: false,
            editForm: {
                status: 20,
                audit_message: '',
            },
            total: {},
        };
    },
    watch: {},
    computed: {
        // totalCount() {    //合计 勿删
        //     let totalCount = 0
        //     this.tableData.forEach(item => {
        //         totalCount += item.amount
        //     })
        //     return totalCount
        // },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getTransferDetail();
        this.getTransferList();
    },
    methods: {
        handleTransferShow(id) { // 显示弹框
            this.transferShow = true
            this.editForm.id = id
        },
        handleTransferClose() { // 关闭弹框
            this.transferShow = false;
        },
        handleTransferSubmit() { // 审核提交
            this.loading = true;
            Core.Api.Transfer.audit({
                ...this.editForm
            }).then(res => {
                console.log('handleTransferSubmit res', res)
                this.handleTransferClose()
                this.getTableData()
            }).catch(err => {
                console.log('handleTransferSubmit err', err)
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
        getTransferDetail() {
            this.loading = true;
            Core.Api.Transfer.detail({
                id: this.id
            }).then(res => {
                console.log('getTransferDetail res', res)
                this.detail = res.detail
            }).catch(err => {
                console.log('getTransferDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getTransferList() {
            this.loading = true;
            Core.Api.Transfer.itemList({
                transfer_order_id: this.id,
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
#TransferOrderDetail {
    .gray-panel.info {
        .panel-title {
            .left {
                font-size: 12px;
                color: #465670;

                span {
                    color: #A5ACB8;
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

    .collapse-item {
        width: calc(~'50% - 10px');

        .ant-collapse-item.gray-collapse-panel {
            line-height: 50px;

            .ant-collapse-header {
                background-color: #F5F8FA;
                height: 40px;
                .fac();
                width: 100%;
                position: relative;

                .ant-collapse-extra {
                    position: absolute;
                    right: 12px;
                }
            }
        }
    }


}
</style>