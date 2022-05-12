<template>
    <div class="WalletList gray-panel no-margin">
        <div class="panel-title">
            <div class="title">账户列表</div>
        </div>
        <div class="panel-content">
            <div class="table-container">
                <a-button type="primary" ghost @click="handleModalShow('addWalletShow')" v-if="$auth('account.save')" class="panel-btn"><i
                    class="icon i_add"/>新建账户
                </a-button>
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.walletTypeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'balance'">
                            {{ walletMap[record.type] +  (text / 100) }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="handleModalShow('operate',record.id)" v-if="$auth('account.operate')"><i class="icon i_settle"/>账户操作
                            </a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
        <template class="modal-container">
            <a-modal v-model:visible="addWalletShow" title="新建账户" class="repair-audit-modal"
                     :after-close='handleWalletClose'>
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">类型:</div>
                        <div class="value">
                            <a-select v-model:value="editForm.type" placeholder="请选择类型">
                                <a-select-option v-for="(val, key) of typeMap" :key="key" :value="key">{{ val }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="addWalletShow = false">取消</a-button>
                    <a-button @click="handleWalletSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
            <a-modal v-model:visible="operateShow" title="充值扣款" class="repair-audit-modal"
                     :after-close='handleOperateClose'>
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">类型:</div>
                        <a-radio-group v-model:value="operateForm.type">
                            <a-radio class="type-item" v-for="(val, key) in operateTypeMAP" :key="key"
                                     :value="key">{{ val }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                    <div class="form-item required">
                        <div class="key">金额:</div>
                        <div class="value form-item-value">
                            <a-input-number v-model:value="operateForm.money" :min="0" :precision="2" placeholder="0.00"/>
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">来源:</div>
                        <div class="value form-item-value">
                            <a-select v-model:value="operateForm.source_type" placeholder="请选择来源" @change="operateForm.subject = undefined">
                                <a-select-option v-for="(val, key) of object" :key="key" :value="key">{{ val.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item required" v-if="operateForm.source_type">
                        <div class="key">具体原因:</div>
                        <div class="value form-item-value">
                            <a-select v-model:value="operateForm.subject" placeholder="请选择具体原因">
                                <a-select-option v-for="(val, key) of object[operateForm.source_type].subject"
                                    :key="key" :value="key">{{ val }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item required" v-if="operateForm.source_type == 20">
                        <div class="key">采购单号：</div>
                        <div class="value">
                            <a-input class="purchase-order-detail" v-model:value="operateForm.source_id"
                                     placeholder="请输入相关的采购单号"
                                     @blur="handleSelectBlur('purchase')"/>
                            <span v-if="isExist == 1"><i class="icon i_confirm"/></span>
                            <span v-else-if="isExist == 2"><i class="icon i_close_c"/></span>
                        </div>
                    </div>
                    <div class="form-item required" v-if="operateForm.source_type == 40">
                        <div class="key">调货单号：</div>
                        <div class="value">
                            <a-input v-model:value="operateForm.source_id" placeholder="请输入调货单号"
                                     @blur="handleSelectBlur('transfer')"/>
                            <span v-if="isExist == 1"><i class="icon i_confirm"/></span>
                            <span v-else-if="isExist == 2"><i class="icon i_close_c"/></span>
                        </div>
                    </div>
                    <div class="form-item required" v-if="operateForm.source_type == 50">
                        <div class="key">维修单号：</div>
                        <div class="value">
                            <a-input v-model:value="operateForm.source_id" placeholder="请输入维修单号"
                                     @blur="handleSelectBlur('repair')"/>
                            <span v-if="isExist == 1"><i class="icon i_confirm"/></span>
                            <span v-else-if="isExist == 2"><i class="icon i_close_c"/></span>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="operateShow = false">取消</a-button>
                    <a-button @click="handleOperateSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
const TYPE = Core.Const.WALLET.TYPE
export default {
    name: 'WalletList',
    components: {},
    props: {
        orgId: {
            type: Number,
        },
        orgType: {
            type: Number,
        },
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            TYPE,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            id: '',
            pageSize: 20,
            total: 0,
            tableData: [],
            distributor_id: '',
            addWalletShow: false,
            typeMap: Core.Const.WALLET.TYPE_MAP,
            editForm: {
                type: undefined,
            },
            operateShow: false,
            operateTypeMAP: Core.Const.WALLET.OPERATE_TYPE_MAP,
         /*   subjectMap: Core.Const.WALLET.SUBJECT_MAP,
            sourceMap: Core.Const.STOCK_RECORD.SOURCE_TYPE_MAP,*/
            operateForm: {
                type: '',
                money: '',
                wallet_id: '',
                remark: '',
                subject: undefined,
                source_id: '',
                source_type: undefined,
            },
            isExist: '',
            isRight: '',
            walletMap: {
                1: '¥',
                2: '€',
                3: '$',
                4: '£'
            },
            object: {
                '10': {
                    name: '管理员创建', subject: {
                        '101': '调整余额',
                        '200': '其他',
                    }
                },
                '20': {
                    name: '采购', subject: {
                        '201': '采购单支付',
                        '202': '采购单补偿',
                        '300': '其他',
                    }
                },
                '50': {
                    name: '维修', subject: {
                        '501': '维修单扣款',
                        '502': '维修单补偿',
                        '600': '其他',
                    }
                },
                '30': {
                    name: '售后', subject: {
                        '0': '其他',
                    }
                },
                '40': {
                    name: '调货', subject: {
                        '0': '其他',
                    }
                },
            }
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                {title: '账户类型', dataIndex: 'type'},
                {title: '余额', dataIndex: 'balance'},
                // {title: '状态', dataIndex: 'status', key: 'status'},
                {title: '操作', key: 'operation', fixed: 'right'},
            ]
            return tableColumns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.Wallet.list({
                org_id: this.orgId,
                org_type: this.orgType,
                page: this.currPage,
                page_size: this.pageSize,
                status: 1,
            }).then(res => {
                console.log("getTableData res", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleModalShow(val, id) { // 显示弹框
            console.log('handleModalShow:')
            switch (val) {
                case "addWalletShow":
                    this.addWalletShow = true
                    break;
                case "operate":
                    this.operateShow = true
                    this.operateForm.wallet_id = id
                    break;
            }
        },
        handleWalletClose() {
            this.addWalletShow = false;
            this.editForm = {
                type: undefined,
            }
        },
        handleWalletSubmit() {
            this.loading = true;
            Core.Api.Wallet.get({
                ...this.editForm,
                org_id: this.orgId,
                org_type: this.orgType,
            }).then(res => {
                console.log('handleWalletSubmit res', res)
                this.handleWalletClose()
                this.getTableData()
            }).catch(err => {
                console.log('handleWalletSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleOperateClose() {
            this.operateShow = false;
            this.operateForm = {
                type: '',
                money: '',
                wallet_id: '',
                remark: '',
                subject: undefined,
                source_id: '',
                source_type: undefined,
            }
        },
        handleOperateSubmit() {
            let form = Core.Util.deepCopy(this.operateForm)
            if (!form.type) {
                return this.$message.warning('请选择类型')
            }
            if (!form.money) {
                return this.$message.warning('请输入金额')
            }
            if (!form.source_type) {
                return this.$message.warning('请选择来源')
            }
            if (!form.subject) {
                return this.$message.warning('请选择具体原因')
            }
            if (!form.source_id && form.source_type == 20) {
                return this.$message.warning('请输入相关的采购单号')
            }
            if (this.isExist === false) {
                return this.$message.warning('请输入正确的采购单号')
            }
            if (!form.source_id && form.source_type == 40) {
                return this.$message.warning('请输入相关的调货单号')
            }
            if (this.isRight === false) {
                return this.$message.warning('请输入正确的调货单号')
            }
            Core.Api.Wallet.update({
                ...form,
                money: form.money * 100,
            }).then(res => {
                this.$message.success('保存成功')
                this.handleOperateClose()
                this.getTableData()
            }).catch(err => {
                console.log('handleOperateSubmit err:', err)
            })
        },
        handleSelectBlur(type) {
            switch (type) {
                case'repair':
                    this.handleRepairBlur();
                    break;
                case'transfer':
                    this.handleTransferBlur();
                    break;
                case'purchase':
                    this.handlePurchaseBlur();
                    break;
            }
        },
        handlePurchaseBlur() {  // 获取 采购订单号
            if (!this.form.source_id) {
                return this.isExist = ''
            }
            Core.Api.Purchase.detailBySn({
                sn: this.form.source_id,
            }).then(res => {
                this.isExist = res.detail == null ? 2 : 1
                this.source_id = res.detail.id
                this.defaultTime = res.detail.arrival_time
            }).catch(err => {
                console.log('onblur err', err)
            }).finally(() => {
            });
        },
        handleTransferBlur() {
            if (!this.form.source_id) {
                return this.isExist = ''
            }
            Core.Api.Transfer.detailByUid({
                uid: this.form.source_id,
            }).then(res => {
                this.isExist = res.detail == null ? 2 : 1
                this.source_id = res.detail.id
                console.log("onblur res", res)
            }).catch(err => {
                console.log('onblur err', err)
            }).finally(() => {
            });
        },
        handleRepairBlur() {
            if (!this.form.source_id) {
                return this.isExist = ''
            }
            Core.Api.Repair.detailByUid({
                uid: this.form.source_id,
            }).then(res => {
                this.isExist = res.detail == null ? 2 : 1
                this.source_id = res.detail.id
            }).catch(err => {
                console.log('handleBlur err', err)
            })
        },
    }
};
</script>

<style lang="less">
.value {
    .fac();

    .ant-input {
        width: calc(~'100% - 24px');
    }

    i.icon {
        display: inline-block;
        width: 24px;
        text-align: right;
    }

    .i_confirm {
        color: @green;
        font-size: 18px;
    }

    .i_close_c {
        color: @red;
        font-size: 18px;
    }
}
</style>