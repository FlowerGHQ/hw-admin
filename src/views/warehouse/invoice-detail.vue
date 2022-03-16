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
                    @select="handleAddChange"/>
                <a-button type="link" class="extra-btn" v-if="addMode" @click.stop="handleAddSubmit('item')">确认添加</a-button>
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
                            <a-button type="link" @click="handleRowChange(record)" v-if="!record.editMode"><i class="icon i_edit"/>更改数量</a-button>
                            <a-button type="link" @click="handleRowSubmit(record, 'item')" v-else><i class="icon i_confirm"/>确认更改</a-button>
                            <a-button type="link" @click="handleRemoveRow(record)" class="danger"><i class="icon i_delete"/>移除</a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </a-collapse-panel>
        <!-- 有实例 -->
        <a-collapse-panel key="ItemList" header="商品信息" class="gray-collapse-panel" v-if="detail.target_type === COMMODITY_TYPE.ENTITY">
            <template #extra v-if="detail.type == TYPE.IN">
                <!-- 有实例入库 选择商品并输入数量、实例号 -->
                <ItemSelect btnType='link' btnText="添加商品" v-if="detail.status === STATUS.INIT && !addMode" @select="handleAddChange"/>
                <a-button type="link" class="extra-btn" v-if="addMode" @click.stop="handleAddSubmit('entity')">确认添加</a-button>
            </template>
            <template #extra v-else>
                <!-- 有实例出库 选择实例 -->
            </template>
            <div class="panel-content table-container no-mg">
                <a-table :columns="entityTableColumns" :data-source="addMode ? addData : tableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text, record, index}">
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title='text'>
                                <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'amount'">
                            <template v-if="addMode || record.editMode">
                                <a-input-number v-model:value="record.amount" placeholder="请输入"
                                    :min="1" :max="detail.type === TYPE.IN ? 9999: record.item.stock" :precision="0"/> 件
                            </template>
                            <template v-else>{{ text || '-' }}件</template>
                        </template>
                        <template v-if="column.key === 'entity_uid'">
                            <template v-if="addMode || record.editMode">
                                <a-input v-model:value="record.entity_uid" style="width: 200px;" placeholder="请输入车架号" @blur="handleVehicleBlur(record)">
                                    <template #suffix>
                                        <span v-if="record.entity_uid"><i class="icon suffix i_confirm"/></span>
                                        <span v-else-if="record.entity_no_exist"><i class="icon suffix i_close_c"/></span>
                                    </template>
                                </a-input>
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
                        <template v-if="column.key === 'operation'" >
                            <template v-if="!this.addMode">
                                <a-button type="link" @click="handleRowChange(record)" v-if="!record.editMode"><i class="icon i_edit"/>更改实例号</a-button>
                                <a-button type="link" @click="handleRowSubmit(record, 'entity')" v-else><i class="icon i_confirm"/>确认更改</a-button>
                                <a-button type="link" @click="handleRemoveRow(record)" class="danger"><i class="icon i_delete"/>移除</a-button>
                            </template>
                            <a-button type="link" v-if="this.addMode" @click="handleCopyEntity(index, record)"><i class="icon i_copy"/>复制</a-button>
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
            // 'entity',
            let columns = [
                {title: '商品名称', dataIndex: ['item', 'name'],  key: 'tip_item'},
                // {title: this.type_ch + '数量', dataIndex: 'amount'},
                {title: '商品实例号', dataIndex: 'entity_uid', key: 'entity_uid'},
                {title: '商品品号', dataIndex: ['item', 'model'], key: 'item'},
                {title: '商品编码', dataIndex: ['item', 'code'],  key: 'item'},
                {title: '商品规格', dataIndex: ['item', 'attr_list'], key: 'attr_list'},
                {title: '操作', key: 'operation'},
            ]
            if (this.detail.status !== STATUS.INIT) { // 入库不显示库存数量
                columns.pop()
            }
            /* if (this.detail.type == TYPE.IN) {
                columns.splice(1, 0, {title: this.type_ch + '数量', dataIndex: 'amount'})
            } */
            return columns
        },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getInvoiceDetail();
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
                this.getInvoiceList();
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
                let list = res.list
                if (this.detail.target_type === COMMODITY_TYPE.ENTITY) {
                    list.forEach(item => {
                        item.item = item.entity ? item.entity.item || {} : {}
                        item.entity_id = item.target_id
                        item.entity_uid = item.entity.uid
                    })
                }
                this.tableData = list
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
                    }).catch(err => {
                        console.log("handleComplete err", err);
                    })
                },
            });
        },

        // 移除 商品
        handleRemoveRow(record) {
            Core.Api.InvoiceItem.delete({id: record.id}).then(() => {
                this.$message.success('移除成功')
                this.getInvoiceList()
            })
        },

        // 批量添加 商品
        handleAddChange(ids, items) {
            console.log('handleAddChange items:', items)
            let list = items.map(item => ({
                id: 0,
                item: item,
                amount: 1,
                entity_uid: '',
            }))
            this.addData = list
            this.addMode = true
        },

        handleAddSubmit(type) {
            this.loading = true;
            let data = [...this.tableData, ...this.addData]
            let list = []
            for (const item of data) {
                let target_id = type === 'item' ? item.item.id : item.entity_id
                if (!target_id) {
                    return this.$message.warning(`该${type === 'item' ? '商品' : '商品实例'}不存在`);
                }
                list.push({
                    id: item.id,
                    amount: item.amount,
                    invoice_id: this.id,
                    target_id,
                })
            }
            Core.Api.InvoiceItem.saveList(list).then(() => {
                this.$message.success('保存成功')
                this.getInvoiceDetail()
                this.addMode = false
            }).catch(err => {
                console.log('handleAddSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 编辑单个 无实例商品
        handleRowChange(item) {
            item.editMode = true
        },
        handleRowSubmit(item, type) {
            let target = {
                id: item.id,
                amount: item.amount,
                target_id: type === 'item' ? item.item.id : item.entity_id,
                invoice_id: this.id,
            }
            if (!target.target_id) {
                return this.$message.warning(`该${type === 'item' ? '商品' : '商品实例'}不存在`);
            }
            Core.Api.InvoiceItem.save(target).then(() => {
                this.$message.success('保存成功')
                this.getInvoiceDetail()
            })
        },

        handleVehicleBlur(record) {  // 获取 车架号ID
            // HW1000T-1B00B30001
            console.log('handleVehicleBlur:', record)
            let apiName = this.$auth('ADMIN') ? 'getByUid' : 'detailByUid'
            Core.Api.Entity[apiName]({
                item_id: record.item.id,
                uid: record.entity_uid
            }).then(res => {
                console.log('handleVehicleBlur res:', res)
                if (this.$auth('ADMIN')) {
                    record.entity_id = res.detail.id
                } else {
                    if (res.detail) {
                        this.$message.warning('该实例号未在系统中录入！')
                        record.entity_id = 0
                        record.entity_no_exist = 1
                    } else {
                        record.entity_id = res.detail.id
                        record.entity_no_exist = 0
                    }
                }
                console.log("handleVehicleBlur res", res)
            }).catch(err => {
                console.log('handleVehicleBlur err', err)
            }).finally(() => {
            });
        },

        handleCopyEntity(index, record) {
            this.addData.splice(index, 0, {
                id: 0,
                item: record.item,
                amount: 1,
                entity_uid: '',
            })

        }
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
    .suffix {
        font-size: 14px;
        &.i_confirm { color: @green; }
        &.i_close_c { color: @red; }
    }
}
</style>