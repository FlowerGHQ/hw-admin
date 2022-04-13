<template>
    <div id="MaterialPurchaseDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">采购单详情</div>
            <div class="btn-area">
                <template>
                    <a-button type="primary" @click="handleComplete()"><i class="icon i_confirm"/>提交</a-button>
                    <a-button type="danger" ghost @click="handleCancel()"> <i class="icon i_close_c"/>取消</a-button>
                </template>
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
            <div class="panel-content">
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
                <div class="info-item">
                    <div class="key">审核人</div>
                    <div class="value">{{ $Util.sourceTypeFilter(detail.source_type || '-')}}</div>
                </div>
                <div class="info-item" v-if="detail.source_type !== SOURCE_TYPE.ADMIN">
                    <div class="key">审核时间</div>
                    <div class="value">
                        <a-button type="link" @click="routerChange('source')">{{ detail.source_uid || '-'}}</a-button>
                    </div>
                </div>
            </div>
        </div>
        <a-collapse v-model:activeKey="activeKey" ghost>
            <a-collapse-panel key="affirm" header="物料信息" class="gray-collapse-panel">
                <template #extra>
                    <MaterialSelect btnType='link' btnText="添加物料" v-if="!addMode" :disabledChecked="disabledChecked"
                                    @select="handleAddChange"/>
                    <a-button type="link" class="extra-btn" v-if="addMode" @click.stop="handleAddSubmit('material')">确认添加</a-button>
                </template>
                <div class="panel-content">
                <div class="panel-content no-mg">
                    <a-table :columns="tableColumns" :data-source="addData" :scroll="{ x: true }"
                             :row-key="record => record.id" :pagination='false'>
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.key === 'code'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.key === 'amount'">
                                <template v-if="addMode || record.editMode">
                                    <a-input-number v-model:value="record.amount" placeholder="请输入"
                                                    :min="1" :max="99999" :precision="0"/> 件
                                </template>
                                <template v-else>{{ text ? text + '件' : '-' }}</template>
                            </template>
                            <template v-if="column.key === 'operation'" >
                                <a-button type="link" @click="handleRowChange(record)" v-if="!record.editMode"><i class="icon i_edit"/>更改数量</a-button>
                                <a-button type="link" @click="handleRowSubmit(record, 'material')" v-else><i class="icon i_confirm"/>确认更改</a-button>
                                <a-button type="link" @click="handleRemoveRow(record)" class="danger"><i class="icon i_delete"/>移除</a-button>
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

            activeKey: ['ItemList'],

            tableData: [],
            addMode: false,
            addData: [],

            production: {
                addVisible: false,
                addCount: '',
                maxCount: '',
                addItem: {},
            }
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
                { title: '供应商', dataIndex: 'name'},
                { title: '物料名称', dataIndex: 'name',key: 'contact'},
                { title: '物料编码', dataIndex: 'contact_phone',key: 'contact' },
                { title: '单位', dataIndex: 'contact_email',key: 'contact' },
                { title: '数量', dataIndex: 'amount',key: 'amount' },
                { title: '单价', dataIndex: 'payment_term' },
                { title: '总价', dataIndex: 'payment_term' },
                { title: '到货日期', dataIndex: 'address' },
                { title: '备注', dataIndex: 'payment_term' },
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
        routerChange(type) {
            let routeUrl = ''
            switch (type) {
                case 'list':
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/invoice-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit':
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/invoice-edit",
                        query: { id: this.detail.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'warehouse':
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/warehouse-detail",
                        query: { id: this.detail.warehouse_id }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
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
                console.log('getInvoiceList res', res)
                let list = res.list
                if (this.detail.target_type === COMMODITY_TYPE.ENTITY) {
                    list.forEach(item => {
                        item.item = item.entity ? item.entity.item || {} : {}
                        item.entity_id = item.target_id
                        item.entity_uid = item.entity ? item.entity.uid : ''
                    })
                }
                this.total = res.count
                this.tableData = list
            }).catch(err => {
                console.log('getInvoiceList err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getMaterialPurchaseDetail() {
            this.loading = true;
            Core.Api.MaterialPurchase.detail({
                id: this.id
            }).then(res => {
                console.log('getMaterialPurchaseDetail res', res)
                let d = res.detail || {}
                this.detail = d
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
        handleRowSubmit(item, type) {
            let target_id = ''
            switch (type) {
                case 'item': target_id = item.item.id; break;
                case 'entity': target_id = item.entity_id; break;
                case 'material': target_id = item.material.id; break;
            }
            let target = {
                id: item.id,
                amount: item.amount,
                target_id,
                invoice_id: this.id,
            }
            if (!target.target_id) {
                return this.$message.warning(`该${type === 'item' ? '商品' : '商品实例'}不存在`);
            }
            Core.Api.MaterialPurchase.save(target).then(() => {
                this.$message.success('保存成功')
                this.getInvoiceDetail()
            })
        },

        // 移除 商品
        handleRemoveRow(record) {
            Core.Api.MaterialPurchase.itemDelete({id: record.id}).then(() => {
                this.$message.success('移除成功')
                this.getMaterialItemList()
            })
        },
        handleAddChange(ids, items) {
            console.log('handleAddChange items:', items)
            let list = items.map(item => ({
                id: 0,
                item: item,
                material: item,
                amount: 1,
            }))
            this.addData = list
            this.addMode = true
        },

        async handleAddSubmit(type) {
            this.loading = true;
            let data = [...this.tableData, ...this.addData]
            let list = []
            for (const item of data) {
                let target_id,target_uid
                switch (type) {
                    case 'material':
                        console.log('item.material', item.material)
                        console.log('item.material.id:', item.material.id)
                        console.log('item.material && item.material.id:', item.material && item.material.id)
                        if (item.material && item.material.id) {
                            target_id = item.material.id
                        } else {
                            return this.$message.warning("该物料不存在");
                        }
                        break;
                }
                list.push({
                    id: item.id,
                    amount: item.amount,
                    invoice_id: this.id,
                    target_id,
                    target_uid,
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