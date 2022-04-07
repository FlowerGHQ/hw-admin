<template>
    <div id="MaterialPurchaseEdit" class="list-container">
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
        <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
            <template #expandIcon ><i class="icon i_expan_l"/> </template>
            <a-collapse-panel key="affirm" header="物料信息" class="gray-collapse-panel">
                <div class="panel-content table-container no-mg">
                    <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                             :row-key="record => record.id" :pagination='false'>
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
                            <template v-if="column.key === 'amount'">
                                {{ text || '-' }}件
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
    name: 'InvoiceDetail',
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
                { title: '物料分类', dataIndex: 'type',key: 'contact'},
                { title: '物料编码', dataIndex: 'contact_phone',key: 'contact' },
                { title: '单位', dataIndex: 'contact_email',key: 'contact' },
                { title: '数量', dataIndex: 'payment_term' },
                { title: '单价', dataIndex: 'payment_term' },
                { title: '总价', dataIndex: 'payment_term' },
                { title: '到货日期', dataIndex: 'address' },
                { title: '备注', dataIndex: 'payment_term' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right'}
            ]
            return columns
        },
        isProd() {
            let d = this.detail
            if (d.source_type == SOURCE_TYPE.PRODUCTION &&
                d.type == TYPE.IN) {
                return true
            }
            return false
        }
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
                case 'source':
                    let path = ''
                    switch (this.detail.source_type) {
                        case SOURCE_TYPE.PRODUCTION:
                            path = '/production/manufacture-order-detail'
                            break;
                        case SOURCE_TYPE.PURCHASE:
                            path = '/purchase/purchase-order-detail'
                            break;
                        case SOURCE_TYPE.AFTER_SALES:
                            path = '/aftersales/aftersales-detail'
                            break;
                        case SOURCE_TYPE.TRANSFER:
                            path = '/warehouse/transfer-order-detail'
                            break;
                        case SOURCE_TYPE.REPAIR:
                            path = '/repair/repair-detail'
                            break;
                    }
                    routeUrl = this.$router.resolve({
                        path,
                        query: { id: this.detail.source_id }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        // 获取出入库单详情
        getMaterialPurchaseDetail() {
            this.loading = true;
            Core.Api.MaterialPurchase.save({
                id: this.id
            }).then(res => {
                console.log('getMaterialPurchaseDetail res', res)
                let d = res.detail || {}
                this.detail = d
                this.warehouse = d.warehouse || {}
                this.getInvoiceList();
            }).catch(err => {
                console.log('getInvoiceDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        pageChange(curr) {    // 页码改变
            this.currPage = curr
            this.getInvoiceList()
        },
        pageSizeChange(current, size) {    // 页码尺寸改变
            this.pageSize = size
            this.getInvoiceList()
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

        // 移除 商品
        handleRemoveRow(record) {
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