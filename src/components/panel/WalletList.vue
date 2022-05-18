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
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title=$Util.walletTypeFilter(text)>
                                <a-button type="link" @click="routerChange('detail', record)"> {{ $Util.walletTypeFilter(text) }}</a-button>
                            </a-tooltip>
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
                            <a-button type="link" @click="routerChange('detail',record)"><i class="icon i_detail"/>详情
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
                        <div class="key">来源：</div>
                        <div class="value">
                            <a-select v-model:value="operateForm.source_type" placeholder="请选择来源" @change="handleSelectChange">
                                <a-select-option v-for="(val, key) of sourceTypeMap" :key='key' :value='key'>{{ val }}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item required" v-if="needUid">
                        <div class="key">{{sourceTypeMap[operateForm.source_type]}}号：</div>
                        <div class="value">
                            <a-input v-model:value="sourceUid" :placeholder="`请输入相关的${sourceTypeMap[operateForm.source_type]}号`" @blur="handleSelectBlur()">
                                <template #suffix>
                                    <span v-if="isExist == 1"><i class="icon suffix i_confirm"/></span>
                                    <span v-else-if="isExist == 2"><i class="icon suffix i_close_c"/></span>
                                </template>
                            </a-input>
                        </div>
                    </div>
                    <div class="form-item textarea">
                        <div class="key">原因:</div>
                        <div class="value form-item-value">
                            <a-textarea v-model:value="operateForm.remark" placeholder="请输入原因"
                                        :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
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
const SUBJECT = Core.Const.WALLET.SUBJECT
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
            sourceTypeMap: Core.Const.WALLET.SUBJECT_MAP,
            operateForm: {
                type: '',
                money: '',
                wallet_id: '',
                remark: '',
                // subject: undefined,
                source_id: '',
                source_type: undefined,
            },
            sourceUid: '',
            isExist: '',
            walletMap: {
                1: '¥',
                2: '€',
                3: '$',
                4: '£'
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                {title: '账户类型', dataIndex: 'type', key: 'detail'},
                {title: '余额', dataIndex: 'balance'},
                // {title: '状态', dataIndex: 'status', key: 'status'},
                {title: '操作', key: 'operation', fixed: 'right'},
            ]
            return tableColumns
        },
        needUid() {
            let val = Number(this.operateForm.source_type)
            switch (val) {
                case SUBJECT.PURCHASE_ORDER:
                case SUBJECT.REPAIR_ORDER_DEDUCTIONS:
                    return true
                default: return false
            }
        }
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'detail':    // 详情
                    routeUrl = this.$router.resolve({
                        path: "/wallet/wallet-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
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
            Object.assign(this.operateForm, this.$options.data().operateForm)
            this.sourceUid = ''
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
            if (this.needUid && !this.sourceUid) {
                return this.$message.warning(`请输入相关的${this.sourceTypeMap[form.source_type]}单号`)
            }
            if (this.needUid && !form.source_id) {
                return this.$message.warning(`请输入正确的${this.sourceTypeMap[form.source_type]}单号`)
            }
            if (this.isExist == 2) {
                return this.$message.warning(`请输入正确的${this.sourceTypeMap[form.source_type]}单号`)
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
        handleSelectBlur() {
            if (!this.sourceUid) {
                return this.isExist = ''
            }
            let api = [];
            let key = 'uid'
            let parme = {}
            switch (Number(this.operateForm.source_type)) {
                case SUBJECT.PURCHASE_ORDER:
                    api = ['Purchase', 'detailBySn']; key = 'sn';
                    break;
                case SUBJECT.REPAIR_ORDER_DEDUCTIONS:
                    api = ['Repair', 'detailByUid']; key = 'uid';
                    break;
            }
            parme[key] = this.sourceUid
            Core.Api[api[0]][api[1]](parme).then(res => {
                console.log("handleSelectBlur res", res)
                this.isExist = res.detail == null ? 2 : 1
                this.operateForm.source_id = res.detail.id
            }).catch(err => {
                console.log('handleSelectBlur err', err)
            }).finally(() => {
            });
        },
        handleSelectChange(val) {
            console.log('handleSelectChange',val)
            this.sourceUid = ''
            this.isExist = ''
        }
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