<template>
    <div id="MaterialPurchaseDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">采购单详情</div>
            <div class="btn-area">
                    <a-button type="primary" @click="handleSubmit()" ><i class="icon i_confirm"/>提交</a-button>
                    <a-button type="danger" ghost @click="handleCancel()"> <i class="icon i_close_c"/>取消</a-button>
            </div>
        </div>
        <div class="gray-panel info">
            <div class="panel-title">
                <div class="left">采购单编号：{{ detail.uid }}</div>
                <div class="right">
                    <div class="status">
                        <i class="icon i_point" :class="$Util.invoiceStatusFilter(detail.status,'color')"/>
                        {{ $Util.invoiceStatusFilter(detail.status) }}
                    </div>
                </div>
            </div>
<!--            <div class="panel-content">
                <div class="info-item">
                    <div class="key">采购总数量</div>
                    <div class="value">
                        <template v-if="detail.apply_user && detail.apply_user.account">{{ detail.apply_user.account.name }}</template>
                        <template v-else>-</template>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">采购总金额</div>
                    <div class="value">
                        <template v-if="detail.apply_user && detail.apply_user.account">{{ detail.apply_user.account.name }}</template>
                        <template v-else>-</template>
                    </div>
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
            </div>-->
        </div>
        <a-collapse v-model:activeKey="activeKey" ghost>
            <a-collapse-panel key="affirm" header="物料信息" class="gray-collapse-panel">
                <template #extra>
                    <MaterialSelect btnType='link' btnText="添加物料" v-if="!addMode" :disabledChecked="disabledChecked"
                                    @select="handleAddChange"/>
                    <a-button type="link" class="extra-btn" v-if="addMode" @click.stop="handleAddSubmit">确认添加</a-button>
                </template>
                <div class="panel-content">
                <div class="panel-content no-mg">
                    <a-table :columns="tableColumns" :data-source="addMode ? addData : tableData" :scroll="{ x: true }"
                             :row-key="record => record.id" :pagination='false'>
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.dataIndex === 'supplier'">
                                <template v-if="addMode">
                                    <a-select v-model:value="record.supplier_id" placeholder="请选择供应商" style="width: 120px;">
                                        <a-select-option v-for="item of record.supplier_list" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                                    </a-select>
                                </template>
                                <template v-else>{{ record.supplier_name }}</template>
                            </template>
                            <template v-if="column.key === 'contact'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.key === 'spec'">
                                <a-tooltip placement="top" :title='text'>
                                    <div class="ell" style="max-width: 120px">
                                        {{text || '-'}}
                                    </div>
                                </a-tooltip>
                            </template>
                            <template v-if="column.key === 'arrival_period'">
                                {{ record.supplier_map[record.supplier_id].arrival_period + '天' }}
                            </template>
                            <template v-if="column.key === 'price'">
                                <template v-if="addMode">
                                    ￥{{  record.supplier_map[record.supplier_id].price }}
                                </template>
                                <template v-else>￥{{ record.$Util.countFilter(text) || '-'}}</template>
                            </template>
                            <template v-if="column.key === 'amount'">
                                <template v-if="addMode || record.editMode">
                                    <a-input-number v-model:value="record.amount" style="width: 66px;" placeholder="请输入"
                                                    :min="1" :precision="0"/> 件
                                </template>
                                <template v-else>{{ text ? text + '件' : '-' }}</template>
                            </template>
                            <template v-if="column.key === 'total_price'">
                                <template v-if="addMode">
                                    ￥{{ $Util.countFilter(record.supplier_map[record.supplier_id].price * 100 * record.amount) }}
                                </template>
                                <template v-else>￥{{ $Util.countFilter(record.price * record.amount) }}</template>
                            </template>
                            <template v-if="column.key === 'operation'" >
                                <template v-if="!this.addMode">
                                <a-button type="link" @click="handleRowChange(record)" v-if="!record.editMode"><i class="icon i_edit"/>更改数量</a-button>
                                <a-button type="link" @click="handleRowSubmit(record)" v-else><i class="icon i_confirm"/>确认更改</a-button>
                                <a-button type="link" @click="handleRemoveRow(record)" class="danger"><i class="icon i_delete"/>移除</a-button>
                                </template>
                            </template>
                        </template>
                    </a-table>
                    <div class="paging-container">
                        <a-pagination
                            v-model:current="currPage"
                            :page-size='pageSize'
                            :total="total"
                            show-quick-jumper
                            show-size-changer
                            show-less-items
                            :show-total="total => `共${total}条`"
                            :hide-on-single-page='false'
                            :pageSizeOptions="['10', '20', '30', '40']"
                            @change="pageChange"
                            @showSizeChange="pageSizeChange"
                        />
                    </div>
                </div>
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
import Core from '../../core';
import ItemSelect from '../../components/popup-btn/ItemSelect.vue'
import EntitySelect from '../../components/popup-btn/EntitySelect.vue'
import MaterialSelect from '../../components/popup-btn/MaterialSelect.vue'
import AuditHandle from '../../components/popup-btn/AuditHandle.vue'

const STOCK_RECORD = Core.Const.STOCK_RECORD

const TYPE = STOCK_RECORD.TYPE
const STATUS = STOCK_RECORD.STATUS
const SOURCE_TYPE = STOCK_RECORD.SOURCE_TYPE
const COMMODITY_TYPE = STOCK_RECORD.COMMODITY_TYPE

export default {
    name: 'MaterialPurchaseDetail',
    components: {
        ItemSelect,
        EntitySelect,
        MaterialSelect,
        AuditHandle
    },
    props: {},
    data() {
        return {
            COMMODITY_TYPE,
            SOURCE_TYPE,
            STATUS,
            TYPE,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,

            id: '',
            detail: {},
            warehouse: {},

            activeKey: ['affirm'],

            tableData: [],
            addMode: false,
            addData: [],

            production: {
                addVisible: false,
                addCount: '',
                maxCount: '',
                addItem: {},
            },
        };
    },
    watch: {},
    computed: {
        disabledChecked() {
            let list = []
            this.tableData.forEach(item => {
                if (item.item && item.item.id) {
                    list.push(item.item.id)
                }
            })
            return list
        },
        tableColumns() {
            let columns = [
                { title: '供应商',dataIndex: 'supplier'},
                { title: '物料名称', dataIndex: ['item','name'],key: 'contact'},
                { title: '物料编码', dataIndex: ['item','code'],key: 'contact' },
                { title: '规格', dataIndex: ['item','spec'],key: 'spec' },
                { title: '数量', dataIndex: 'amount',key: 'amount' },
                { title: '单位', dataIndex: ['item','unit'],key: 'contact' },
                { title: '单价', dataIndex: 'price',key: 'price'},
                { title: '总价', key: 'total_price' },
                { title: '到货日期', dataIndex: 'arrival_period',key: 'arrival_period'},
                { title: '操作', key: 'operation', fixed: 'right'}
            ]
            return columns
        },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getMaterialPurchaseDetail();
    },
    methods: {
        pageChange(curr) {    // 页码改变
            this.currPage = curr
            this.getMaterialItemList()
        },
        pageSizeChange(current, size) {    // 页码尺寸改变
            this.pageSize = size
            this.getMaterialItemList()
        },
        getMaterialItemList() {
            this.loading = true;
            Core.Api.MaterialPurchase.itemList({
                material_purchase_order_id: this.id,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log('getMaterialItemList res', res)
                this.tableData = res.list
                this.total = res.count
                this.getSupplierName();
            }).catch(err => {
                console.log('getMaterialItemList err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getSupplierName() {
            let data = [...this.tableData]
            for (const item of data) {
                let supplier_id
                if (item.supplier_id) {
                    supplier_id = item.supplier_id
                }
                Core.Api.Supplier.detail({
                    id: supplier_id
                }).then(res => {
                    item.supplier_name = res.detail.name
                    console.log('getSupplierName', res.detail.name)
                })
            }
        },
        getMaterialPurchaseDetail() {
            this.loading = true;
            Core.Api.MaterialPurchase.detail({
                id: this.id
            }).then(res => {
                console.log('getMaterialPurchaseDetail res', res)
                this.detail = res.detail
                this.getMaterialItemList();
            }).catch(err => {
                console.log('getMaterialPurchaseDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleRowChange(item) {
            item.editMode = true
        },
        handleRowSubmit() {
            Core.Api.MaterialPurchase.save().then(() => {
                this.$message.success('保存成功')
                this.getInvoiceDetail()
            })
        },

        // 移除 商品
        handleRemoveRow(record) {
            Core.Api.MaterialPurchase.itemDelete({
                id: record.id,
                material_purchase_order_id: this.id
            }).then(() => {
                this.$message.success('移除成功')
                this.getMaterialItemList()
            })
        },
        handleAddChange(ids, items) {
            console.log('handleAddChange items:', items)
            let list = items.map(item => {
                let supplier_list = item.supplier_list.map(i => ({
                    id: i.id,
                    name: i.name,
                    price: Core.Util.countFilter(i.price),
                    arrival_period: i.arrival_period,
                }))
                return {
                    id: item.id,
                    item: item,
                    material: item,
                    amount: 1,
                    entity_uid: '',
                    category: item.category,
                    supplier_list,
                    supplier_id: supplier_list && supplier_list.length ? supplier_list[0].id : undefined
                }
            })
            this.addData = list
            this.addMode = true
            for (let item of list) {
                item.supplier_map = {}
                for(let supplier of item.supplier_list) {
                    item.supplier_map[supplier.id] = {
                        price: supplier.price,
                        arrival_period: supplier.arrival_period,
                    }
                    console.log('getMaterialList', supplier.price )
                }
            }
            console.log('addData', this.addData)},

        async handleAddSubmit() {
            this.loading = true;
            let data = [...this.tableData,...this.addData]
            console.log('data',data)
            let list = []
            for (const item of data) {
                let target_id,supplier_id,price,arrival_period
                if (item.material && item.id) {
                    target_id = item.material.id
                    supplier_id = item.supplier_id
                    console.log('item.supplier_map', item.supplier_map)
                    console.log('supplier_id', supplier_id)
                    if( item.supplier_id && item.supplier_map) {
                        price = Math.round(item.supplier_map[supplier_id].price * 100)
                        arrival_period = item.supplier_map[supplier_id].arrival_period
                    } else {
                        price = Math.round(item.price * 100)
                    }
                } else {
                    return this.$message.warning("该物料不存在");
                }
                list.push({
                    id: item.id,
                    amount: item.amount,
                    target_id,
                    supplier_id,
                    price,
                    arrival_period,
                    material_purchase_order_id: this.id,
                })
            }
            console.log('handleAddSubmit list:', list)
            Core.Api.MaterialPurchase.batchSave(list).then(() => {
                this.$message.success('保存成功')
                this.getMaterialPurchaseDetail()
                this.addMode = false
            }).catch(err => {
                console.log('handleAddSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        //提交
        handleSubmit() {
            let _this = this;
            this.$confirm({
                title: `确定提交该采购单吗？`,
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.MaterialPurchase.save({id: _this.id}).then(() => {
                        _this.$message.success('操作成功');
                        _this.getMaterialPurchaseDetail();
                    }).catch(err => {
                        console.log("handleSubmit err", err);
                    })
                },
            });
        },
        // 取消
        handleCancel() {
            let _this = this;
            this.$confirm({
                title: `确定取消该采购单吗？`,
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.MaterialPurchase.cancel({id: _this.id}).then(() => {
                        _this.$message.success('操作成功');
                        _this.getMaterialPurchaseDetail();
                    }).catch(err => {
                        console.log("handleSubmit err", err);
                    })
                },
            });
        },

    }
};
</script>

<style lang="less">
#MaterialPurchaseDetail {
    .extra-btn {
        height: 14px;
        line-height: 14px;
    }
    .gray-panel.info {
        .right {
            .fcc();
            font-size: 12px;

            .status {
                .fcc();

                .i_point {
                    margin-right: 6px;
                }
            }
        }
    }
    .ant-table-cell {
        input.ant-input.input-number {
            width: 100% - 50px;
        }
    }
    .panel-content {
    }
}
.prod-edit-popover {
    margin: 0 -4px;
    display: flex;
    .flex(flex-start,flex-end);
    .ant-input, .ant-input-number {
        width: 155px;
        margin-bottom: 8px;
    }
    .btns {
        margin-top: 16px;
        .fcc();
        .ant-btn {
            width: 48px;
            height: 25px;
            font-size: 12px;
            border-radius: 2px;
            padding: 0;
            line-height: 25px;
        }
    }
}
</style>