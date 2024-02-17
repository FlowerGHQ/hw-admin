<template>
    <div id="TransferOrderDetail" class="edit-container">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">调货单详情</div>
                <a-button
                    type="primary"
                    ghost
                    @click="handleTransferAuditShow"
                    v-if="[STATUS.WAIT_AUDIT].includes(detail.status) && $auth('ADMIN')"
                >
                    <i class="icon i_audit" />审核
                </a-button>
            </div>
            <div class="gray-panel info">
                <div class="panel-title">
                    <div class="left"><span>调货单编号</span> {{ detail.uid }}</div>
                </div>
                <div class="panel-content">
                    <div class="info-item">
                        <div class="key">所属仓库</div>
                        <div class="value">{{ detail.to_warehouse.name || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">仓库类型</div>
                        <div class="value">{{ $Util.warehouseTypeFilter(detail.to_warehouse.type || '-') }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">创建时间</div>
                        <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                    </div>
                </div>
            </div>
            <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                <template #expandIcon><i class="icon i_expan_l" /> </template>
                <a-collapse-panel key="affirm" header="商品信息" class="gray-collapse-panel">
                    <div class="panel-content table-container no-mg">
                        <a-table
                            :columns="tableColumns"
                            :data-source="tableData"
                            :scroll="{ x: true }"
                            :row-key="record => record.id"
                            :pagination="false"
                        >
                            <template #bodyCell="{ column, text }">
                                <!--                            <template v-if="column.key === 'name'">
                                <a-tooltip placement="top" :title='text'>
                                    {{ text || '-' }}
                                </a-tooltip>
                            </template>-->
                                <template v-if="column.key === 'code'">
                                    {{ text || '-' }}
                                </template>
                                <!--                            <template v-if="column.key === 'model'">
                                {{ text || '-' }}
                            </template>-->
                                <template v-if="column.key === 'amount'"> {{ text || '-' }}件 </template>
                            </template>
                        </a-table>
                    </div>
                </a-collapse-panel>
            </a-collapse>
        </div>
        <template class="modal-container">
            <a-modal
                v-model:visible="transferAuditShow"
                title="审核"
                class="transfer-audit-modal"
                :after-close="handleTransferAuditClose"
            >
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
                            <a-textarea
                                v-model:value="editForm.audit_message"
                                placeholder="请输入不通过原因"
                                :auto-size="{ minRows: 2, maxRows: 6 }"
                                :maxlength="99"
                            />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="transferAuditShow = false">取消</a-button>
                    <a-button @click="handleTransferAuditSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
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
                to_warehouse: {},
            },
            activeKey: ['affirm'],
            tableData: [],
            tableColumns: [
                { title: '商品名称', dataIndex: ['item', 'name'], key: 'name' },
                { title: '商品品号', dataIndex: ['item', 'model'], key: 'model' },
                { title: '商品编码', dataIndex: ['item', 'code'] },
                { title: '商品规格', dataIndex: ['item', 'attr_str'] },
                { title: '数量', dataIndex: 'amount', key: 'amount' },
            ],
            transferAuditShow: false,
            editForm: {
                id: '',
                status: 20,
                audit_message: '',
            },
            total: {},
        };
    },
    watch: {},
    computed: {
        /* totalCount() {    //合计 勿删
            let totalCount = 0
            this.tableData.forEach(item => {
                totalCount += item.amount
            })
            return totalCount
        }, */
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0;
        this.getTransferDetail();
        this.getTransferList();
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        getTransferDetail() {
            this.loading = true;
            Core.Api.Transfer.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getTransferDetail res', res);
                    this.detail = res.detail;
                })
                .catch(err => {
                    console.log('getTransferDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getTransferList() {
            this.loading = true;
            Core.Api.Transfer.itemList({
                transfer_order_id: this.id,
            })
                .then(res => {
                    console.log('getTransferList res', res);
                    res.list.forEach(item => {
                        let element = item.item || {};
                        if (element.attr_list && element.attr_list.length) {
                            let str = element.attr_list.map(i => i.value).join(' ');
                            element.attr_str = str;
                        }
                    });
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTransferList err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 调货单审核
        handleTransferAuditShow() {
            // 显示弹框
            this.transferAuditShow = true;
            this.editForm.id = this.id;
        },
        handleTransferAuditClose() {
            // 关闭弹框
            this.transferAuditShow = false;
        },
        handleTransferAuditSubmit() {
            // 审核提交
            this.loading = true;
            Core.Api.Transfer.audit({
                ...this.editForm,
            })
                .then(res => {
                    console.log('handleTransferAuditSubmit res', res);
                    this.$message.success(this.$t('pop_up.audited'));
                    this.handleTransferAuditClose();
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleTransferAuditSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>
<style lang="less">
// #TransferOrderDetail {}
</style>
