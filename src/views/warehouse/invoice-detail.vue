<template>
<!--
    有实例入库 选择商品并输入数量、实例号
    有实例出库 选择实例
-->
<div id="InvoiceDetail" class="list-container">
    <div class="title-container">
        <div class="title-area">{{type_ch}}单详情</div>
        <div class="btn-area">
            <template v-if="detail.status === STATUS.INIT">
                <a-button type="primary" @click="handleComplete()"><i class="icon i_confirm"/>{{type_ch}}完成</a-button>
                <!-- <a-button type="primary" ghost @click="routerChange('edit')"><i class="icon i_edit"/>编辑</a-button> -->
                <a-button type="danger" ghost @click="handleCancel()"> <i class="icon i_close_c"/>取消</a-button>
            </template>
        </div>
    </div>
    <div class="gray-panel info">
        <div class="panel-title">
            <div class="left"><span>{{type_ch}}单编号</span> {{ detail.uid }}</div>
            <div class="right">
                <div class="status">
                    <i class="icon i_point" :class="$Util.invoiceStatusFilter(detail.status,'color')"/>
                    {{ $Util.invoiceStatusFilter(detail.status) }}
                </div>
            </div>
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
            <div class="info-item" v-if="detail.source_type !== SOURCE_TYPE.ADMIN">
                <div class="key">来源单号</div>
                <div class="value">{{ detail.source_uid || '-'}}</div>
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
        <!-- 无实例 -->
        <a-collapse-panel key="ItemList" header="商品信息" class="gray-collapse-panel" v-if="detail.target_type === COMMODITY_TYPE.ITEM">
            <template #extra>
                <ItemSelect btnType='link' btnText="添加商品" v-if="detail.status === STATUS.INIT && !addMode"
                    :warehouseId="detail.type == TYPE.OUT ? detail.warehouse_id : 0" :disabledChecked="disabledChecked"
                    @select="handleAddItemChange"/>
                <a-button type="link" class="extra-btn" v-if="addMode" @click.stop="handleAddItemSubmit">确认添加</a-button>
            </template>
            <div class="panel-content table-container no-mg">
                <a-table :columns="itemTableColumns" :data-source="addMode ? addData : tableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title='text'>
                                <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                            </a-tooltip>
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
        <!-- 有实例 -->
        <a-collapse-panel key="ItemList" header="商品信息" class="gray-collapse-panel" v-if="detail.target_type === COMMODITY_TYPE.ENTITY && false">
            <template #extra v-if="detail.type == TYPE.IN">
                <!-- 有实例入库 选择商品并输入数量、实例号 -->
                <ItemSelect btnType='link' btnText="添加商品" v-if="detail.status === STATUS.INIT && !addMode" @select="handleAddItemChange"/>
                <a-button type="link" class="extra-btn" v-if="addMode" @click.stop="handleAddItemSubmit">确认添加</a-button>
            </template>
            <template #extra v-else>
                <!-- 有实例出库 选择实例 -->
            </template>
            <div class="panel-content table-container no-mg" v-if="detail.type == TYPE.IN">
                <a-table :columns="entityTableColumns" :data-source="addMode ? addData : tableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title='text'>
                                <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'entity-uid'">
                            <template v-if="addMode || record.editMode">
                                <a-input v-model:value="record.uid" class="input-number" placeholder="请输入车架号" @blur="handleVehicleBlur(record)"/>
                                <span v-if="isExist == 1"><i class="icon i_confirm"/></span>
                                <span v-else-if="isExist == 2"><i class="icon i_close_c"/></span>
                            </template>
                            <template v-else>{{ text }}</template>
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
            <div class="panel-content table-container no-mg" v-else>
                <a-table :columns="entityTableColumns" :data-source="addMode ? addData : tableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title='text'>
                                <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'entity-uid'">
                            <template v-if="addMode || record.editMode">
                                <a-input v-model:value="record.uid" class="input-number" placeholder="请输入车架号" @blur="handleVehicleBlur(record)"/>
                                <span v-if="isExist == 1"><i class="icon i_confirm"/></span>
                                <span v-else-if="isExist == 2"><i class="icon i_close_c"/></span>
                            </template>
                            <template v-else>{{ text }}</template>
                        </template>
                        <template v-if="column.key === 'attr_list'">
                            {{ $Util.itemSpecFilter(text) }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'count'">
                            {{ text ? text + '件' : '-' }}
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
const SOURCE_TYPE = STOCK_RECORD.SOURCE_TYPE
const COMMODITY_TYPE = STOCK_RECORD.COMMODITY_TYPE

export default {
    name: 'InvoiceDetail',
    components: {},
    props: {},
    data() {
        return {
            COMMODITY_TYPE,
            SOURCE_TYPE,
            STATUS,
            TYPE,
            // 加载
            loading: false,

            id: '',
            detail: {},
            warehouse: {},

            activeKey: ['ItemList'],

            tableData: [],
            addMode: false,
            addData: [],
            isExist: '',
        };
    },
    watch: {},
    computed: {
        type_ch() {
            return this.detail.type == TYPE.IN ? '入库' : '出库'
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
        itemTableColumns() {
            // 无实例商品的 出入库
            let columns = [
                {title: '商品名称', dataIndex: ['item', 'name'],  key: 'tip_item'},
                {title: this.type_ch + '数量', dataIndex: 'amount' , key: 'amount'},
                {title: '商品品号', dataIndex: ['item', 'model'], key: 'item'},
                {title: '商品编码', dataIndex: ['item', 'code'],  key: 'item'},
                {title: '商品规格', dataIndex: ['item', 'attr_list'], key: 'attr_list'},
                {title: '操作', key: 'operation'},
            ]
            if (this.detail.status !== STATUS.INIT || this.addMode) {
                columns.pop()
            }
            if (this.detail.type == TYPE.OUT) {
                columns.splice(2, 0, {title: '库存数量', dataIndex: ['item', 'stock'], key: 'count'})
            }
            return columns
        },
        entityTableColumns() {
            let columns = [
                {title: '商品名称', dataIndex: ['entity', 'item', 'name'],  key: 'tip_item'},
                {title: this.type_ch + '数量', dataIndex: 'amount'},
                {title: '车架号', dataIndex: 'target_type'},
                {title: '商品品号', dataIndex: ['entity', 'item', 'model'], key: 'item'},
                {title: '商品编码', dataIndex: ['entity', 'item', 'code'],  key: 'item'},
                {title: '商品规格', dataIndex: ['entity', 'item', 'attr_list'], key: 'attr_list'},
                {title: '操作', key: 'operation'},
            ]
            if (this.detail.status !== STATUS.INIT || this.addMode) { // 入库不显示库存数量
                columns.pop()
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
        routerChange(type) {
            let routeUrl = ''
            switch (type) {
                case 'list':
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/invoice-list",
                    })
                    break;
                case 'edit':
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/invoice-edit",
                        query: { id: this.detail.id }
                    })
                    break;
            }
            window.open(routeUrl.href, '_self')
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
                        _this.routerChange('list');
                    }).catch(err => {
                        console.log("handleCancel err", err);
                    })
                },
            });
        },

        // 处理完成 出入库单
        handleComplete() {
            if (!this.tableData.length) {
                return this.$message.warning(`请先选择需要${this.type_ch}的商品`)
            }
            let _this = this;
            this.$confirm({
                title: `确定该${_this.type_ch}单商品已${_this.type_ch}吗？`,
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Invoice.handle({id: _this.detail.id}).then(() => {
                        _this.$message.success('操作成功');
                        _this.getInvoiceDetail();
                        _this.getInvoiceList()
                    }).catch(err => {
                        console.log("handleComplete err", err);
                    })
                },
            });
        },

        // 移除 商品
        handleRemoveItem(record) {
            Core.Api.InvoiceItem.delete({id: record.id}).then(() => {
                this.$message.success('移除成功')
                this.getInvoiceList()
            })
        },

        // 批量 添加 无实例 商品
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
        handleAddItemSubmit() {
            this.loading = true;
            let data = [...this.tableData, ...this.addData]
            let list = data.map(item => ({
                id: item.id,
                amount: item.amount,
                target_id: item.item.id,
                invoice_id: this.id,
                target_type: item.target_type,
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

        handleVehicleBlur(record) {  // 获取 车架号
            Core.Api.Entity.detailByUid({
                uid: record.uid
            }).then(res => {
                this.isExist = res.detail == null ? 2 : 1
                record.entity_id = res.detail.id
                console.log("handleVehicleBlur res", res)
            }).catch(err => {
                console.log('handleVehicleBlur err', err)
            }).finally(() => {
            });
        },
    }
};
</script>

<style lang="less">
#InvoiceDetail {
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
}
</style>