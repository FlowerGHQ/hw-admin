<template>
    <div id="InvoiceDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">{{type_ch}}单详情</div>
            <div class="btn-area">
                <a-button type="primary" ghost v-if="detail.status === STATUS.CLOSE"
                          @click="handleComplete()" ><i class="icon i_confirm"/>
                    {{detail.type === TYPE.IN ? '入库' : '出库'}}完成
                </a-button>
                <template v-if="detail.status === STATUS.INIT">
                    <a-button type="primary" @click="handleInvoiceSubmit()"><i class="icon i_submit"/>提交</a-button>
                    <a-button type="primary" ghost danger @click="handleCancel()"> <i class="icon i_close_c"/>取消</a-button>
                </template>
            </div>
        </div>
        <div class="gray-panel info">
            <div class="panel-title">
                <div class="left"><span>{{type_ch}}单编号</span> {{ detail.uid }}</div>
            </div>
            <div class="panel-content">
                <div class="info-item">
                    <div class="key">所属仓库</div>
                    <div class="value">{{ warehouse.name || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">仓库类型</div>
                    <div class="value">{{ $Util.warehouseTypeFilter(warehouse.type || '-') }}</div>
                </div>
                <div class="info-item">
                    <div class="key">类目</div>
                    <div class="value">{{ $Util.targetTypeFilter(detail.target_type || '-')}}</div>
                </div>
                <div class="info-item">
                    <div class="key">来源</div>
                    <div class="value">{{ $Util.sourceTypeFilter(detail.source_type || '-')}}</div>
                </div>
                <div class="info-item">
                    <div class="key">来源单号</div>
                    <div class="value">{{ detail.source_id || '无'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">创建人</div>
                    <div class="value">
                        <template v-if="detail.apply_user && detail.apply_user.account">{{ detail.apply_user.account.name }}</template>
                        <template v-else>-</template>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">创建时间</div>
                    <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                </div>
            </div>
        </div>
        <a-collapse v-model:activeKey="activeKey" ghost>
            <a-collapse-panel key="ItemList" header="商品信息" class="gray-collapse-panel">
                <template #extra>
                    <ItemSelect btnType='link' btnText="添加商品" v-if="detail.status === STATUS.INIT && !addMode"
                                :warehouseId="detail.type == TYPE.OUT ? detail.warehouse_id : 0" :disabledChecked="disabledChecked"
                                @select="handleAddItemChange"/>
                    <a-button type="link" v-if="addMode" @click.stop="handleAddItemSubmit">确认添加</a-button>
                </template>

                <div class="panel-content table-container no-mg">
                    <a-table :columns="tableColumns" :data-source="addMode ? addData : tableData" :scroll="{ x: true }"
                             :row-key="record => record.id" :pagination='false'>
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.key === 'tip_item'">
                                <a-tooltip placement="top" :title='text'>
                                    <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                                </a-tooltip>
                            </template>
                            <template v-if="column.dataIndex === 'entity'">
                                <template v-if="addMode || record.editMode">
                                    <a-input v-model:value="record.uid" class="input-number" placeholder="请输入车架号" @blur="handleVehicleBlur"/>
                                    <span v-if="isExist == 1"><i class="icon i_confirm"/></span>
                                    <span v-else-if="isExist == 2"><i class="icon i_close_c"/></span>
                                </template>
                                <template v-else>{{ text || '-' }}件</template>
                            </template>
                            <template v-if="column.key === 'attr_list'">
                                {{ $Util.itemSpecFilter(text) }}
                            </template>
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.key === 'count'">
                                {{ text || '-' }}件
                            </template>
                            <template v-if="column.key === 'amount'">
                                <template v-if="addMode || record.editMode">
                                    <a-input-number v-model:value="record.amount" placeholder="请输入"
                                                    :min="1" :max="detail.type === TYPE.IN ? 99999: record.item.stock" :precision="0"/> 件
                                </template>
                                <template v-else>{{ text || '-' }}件</template>
                            </template>
                            <template v-if="column.key === 'operation'" >
                                <a-button type="link" @click="handleItemSubmit(record)" v-if="record.editMode"><i class="icon i_confirm"/>确认更改</a-button>
                                <a-button type="link" @click="handleItemChange(record)" v-else><i class="icon i_edit"/>更改数量</a-button>
                                <a-button type="link" @click="handleRemoveItem(record)" class="danger"><i class="icon i_delete"/>移除</a-button>
                            </template>
                        </template>
                    </a-table>
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
import Core from '../../core';
const STOCK_RECORD = Core.Const.STOCK_RECORD
const TYPE = STOCK_RECORD.TYPE
const STATUS = STOCK_RECORD.STATUS
const COMMODITY_TYPE = STOCK_RECORD.COMMODITY_TYPE
export default {
    name: 'InvoiceDetail',
    components: {},
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            STATUS,
            TYPE,
            id: '',
            detail: {},
            warehouse: {},
            activeKey: ['ItemList'],
            tableData: [],
            addMode: false,
            addData: [],
            map: [],
            isExist: '',
            uid: '',
        };
    },
    watch: {},
    computed: {
        type_ch() {
            return this.detail.type == TYPE.IN ? '入库' : '出库'
        },
        tableColumns() {
            let columns = [
                {title: '商品名称', dataIndex: ['item', 'name'],  key: 'tip_item'},
                // {title: '车架号', dataIndex: 'target_type'},
                {title: '商品品号', dataIndex: ['item', 'model'], key: 'item'},
                {title: '商品编码', dataIndex: ['item', 'code'],  key: 'item'},
                {title: '商品规格', dataIndex: ['item', 'attr_list'], key: 'attr_list'},
                // {title: '库存数量', dataIndex: ['item', 'stock'],     key: 'count'},
                {title: this.type_ch + '数量', dataIndex: 'amount' , key: 'amount'},
                {title: '操作', key: 'operation'},
            ]
           /* if (this.detail.type == TYPE.IN) { // 入库不显示库存数量
                columns.splice(4, 1)
            }*/
            if (this.detail.status !== STATUS.INIT || this.addMode) { // 入库不显示库存数量
                columns.pop()
            }
            if (this.detail.type == TYPE.OUT) { // 入库不显示库存数量
                columns.splice(4, 0, {title: '库存数量', dataIndex: ['item', 'stock'], key: 'count'})
            }
            if (this.detail.target_type == COMMODITY_TYPE.ENTITY) {
                columns.splice(1, 0, {title: '车架号', dataIndex: 'entity'})
            }
            return columns
        },
        disabledChecked() {
            let list = []
            this.tableData.forEach(item => {
                if (item.item && item.item.id) {
                    list.push(item.item.id)
                }
            })
            return list
        },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getInvoiceDetail();
        this.getInvoiceList();
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        // 获取出入库单详情
        getInvoiceDetail() {
            this.loading = true;
            Core.Api.Invoice.detail({
                id: this.id
            }).then(res => {
                console.log('getInvoiceDetail res', res)
                this.detail = res.detail
                this.warehouse = res.detail.warehouse || {}
            }).catch(err => {
                console.log('getInvoiceDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取出入库单商品列表
        getInvoiceList() {
            this.loading = true;
            Core.Api.InvoiceItem.list({
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

        // 取消 出入库单
        handleCancel() {
            let _this = this;
            this.$confirm({
                title: `确定要取消该${_this.type_ch}单吗？`,
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Invoice.cancel({id: _this.detail.id}).then(() => {
                        _this.$message.success('取消成功');
                        _this.getInvoiceDetail();
                        _this.getInvoiceList();
                    }).catch(err => {
                        console.log("handleCancel err", err);
                    })
                },
            });
        },

        // 处理完成 出入库单
        handleComplete() {
            let _this = this;
            this.$confirm({
                title: `确定该${_this.type_ch}单商品已${_this.type_ch}吗？`,
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Invoice.handle({id: _this.detail.id}).then(() => {
                        _this.$message.success('操作成功');
                        _this.getInvoiceDetail();
                        _this.getInvoiceList();
                        _this.routerChange();
                    }).catch(err => {
                        console.log("handleComplete err", err);
                    })
                },
            });
        },

        // 处理 添加商品
        handleAddItemChange(ids, items) {
            console.log('handleAddItemChange items:', items)
            let list = items.map(item => ({
                id: 0,
                item: item,
                amount: 1,
                stock: 0,
                uid: undefined,
            }))
            this.addData = list
            this.addMode = true
        },
        handleVehicleBlur() {  // 获取 车架号
            /* if (!this.uid) {
                 return this.isExist = ''
             }*/
            Core.Api.Entity.detailByUid({
                uid: this.uid
            }).then(res => {
                this.isExist = res.detail == null ? 2 : 1
                console.log("handleVehicleBlur res", res)
            }).catch(err => {
                console.log('handleVehicleBlur err', err)
            }).finally(() => {
            });
        },
        handleAddItemSubmit() {
            this.loading = true;
            let data = [...this.tableData, ...this.addData]
            let list = data.map(item => ({
                id: item.id,
                amount: item.amount,
                target_id: item.item.id,
                invoice_id: this.id,
                target_type: item.target_type,
                uid: item.uid,
            }))
            Core.Api.InvoiceItem.saveList(list).then(() => {
                this.$message.success('保存成功')
                this.getInvoiceDetail()
                this.getInvoiceList()
                this.addMode = false
                this.addData = []
            }).catch(err => {
                console.log('handleAddItemSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 编辑单个商品的数量
        handleItemChange(item) {
            item.editMode = true
        },
        handleItemSubmit(item) {
            Core.Api.InvoiceItem.save({
                id: item.id,
                amount: item.amount,
                target_id: item.item.id,
                invoice_id: this.id,
                uid: item.uid
            }).then(() => {
                this.$message.success('保存成功')
                this.getInvoiceDetail()
                this.getInvoiceList()
            })
        },
        handleInvoiceSubmit() {
            this.loading = false;
            let list = []
            for (let item of this.tableData) {
                list.push({
                    "id": item.id,
                    "invoice_id": this.id,
                    "target_id": item.item.id,
                    "amount": item.amount,
                    "uid": item.uid,
                })
            }
            Core.Api.Invoice.saveList(list).then(res => {
                this.$message.success('保存成功')
                this.getInvoiceDetail()
                this.routerChange('back')
            }).catch(err => {
                console.log('handleInvoiceSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 移除 商品
        handleRemoveItem(record) {
            Core.Api.InvoiceItem.delete({id: record.id}).then(() => {
                this.$message.success('移除成功')
                this.getInvoiceList()
            })
        },
    }
};
</script>

<style lang="less">
 #InvoiceDetail {
     .ant-table-cell {
         input.ant-input.input-number {
             width: 100% - 50px;
         }
     }
 }
</style>