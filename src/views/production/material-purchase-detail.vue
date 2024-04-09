<template>
    <div id="MaterialPurchaseDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">采购单详情</div>
            <div class="btn-area">
                <a-button type="danger" ghost @click="handleCancel()" v-if="detail.status === STATUS.INIT">
                    <i class="icon i_close_c" />撤销</a-button
                >
                <a-button type="primary" @click="handleSubmit()" v-if="detail.status === STATUS.INIT"
                    ><i class="icon i_confirm" />提交</a-button
                >
                <AuditHandle
                    v-if="detail.status === STATUS.SUBMIT"
                    btnType="primary"
                    :api-list="['MaterialPurchase', 'audit']"
                    :id="id"
                    @submit="getMaterialPurchaseDetail"
                    :s-pass="STATUS.PASS"
                    :s-refuse="STATUS.REFUSE"
                    no-refuse
                    ><i class="icon i_audit" />审核
                </AuditHandle>
                <a-button
                    v-if="detail.status === STATUS.PASS || detail.status === STATUS.PART"
                    type="primary"
                    @click="handlePurchaseShow"
                    ><i class="icon i_s_warehouse" />全部入库</a-button
                >
                <a-button type="primary" @click="handleExport"><i class="icon i_download" />导出</a-button>
            </div>
        </div>
        <div class="gray-panel info">
            <div class="panel-title">
                <div class="left"><span>采购单编号：</span>{{ detail.sn }}</div>
                <div class="right">
                    <div class="status">
                        <i class="icon i_point" :class="$Util.materialPurchaseStatusFilter(detail.status, 'color')" />
                        {{ $Util.materialPurchaseStatusFilter(detail.status) }}
                    </div>
                </div>
            </div>
            <div class="panel-content">
                <div class="info-item">
                    <div class="key">订单总金额</div>
                    <div class="value">￥{{ $Util.countFilter(detail.total_price) || 0 }}</div>
                </div>
                <div class="info-item">
                    <div class="key">总数量</div>
                    <div class="value">{{ detail.total || 0 }}件</div>
                </div>
                <div class="info-item">
                    <div class="key">已入库数量</div>
                    <div class="value">{{ count || 0 }}件</div>
                </div>
                <div class="info-item">
                    <div class="key">创建人</div>
                    <div class="value">
                        <template v-if="detail.apply_user && detail.apply_user.account">{{
                            detail.apply_user.account.name
                        }}</template>
                        <template v-else>-</template>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">创建时间</div>
                    <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">审核人</div>
                    <div class="value">
                        <template v-if="detail.audit_user && detail.audit_user.account">{{
                            detail.audit_user.account.name
                        }}</template>
                        <template v-else>-</template>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">审核时间</div>
                    <div class="value">{{ $Util.timeFilter(detail.audit_time) || '-' }}</div>
                </div>
            </div>
        </div>
        <a-collapse v-model:activeKey="activeKey" ghost>
            <a-collapse-panel key="affirm" header="物料信息" class="gray-collapse-panel" collapsible="disabled">
                <template #extra>
                    <MaterialSelect
                        btnType="link"
                        btnText="添加物料"
                        v-if="detail.status === STATUS.INIT && !addMode"
                        :disabledChecked="disabledChecked"
                        @select="handleAddChange"
                    />
                    <a-button type="link" class="extra-btn" v-if="addMode" @click.stop="handleAddSubmit"
                        >确认添加</a-button
                    >
                </template>
                <div class="panel-content">
                    <a-table
                        :columns="tableColumns"
                        :data-source="addMode ? addData : tableData"
                        :scroll="{ x: true }"
                        :row-key="record => record.id"
                        :pagination="false"
                    >
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.dataIndex === 'supplier'">
                                <template v-if="addMode">
                                    <a-select
                                        v-model:value="record.supplier_id"
                                        placeholder="请选择供应商"
                                        style="width: 120px"
                                    >
                                        <a-select-option
                                            v-for="item of record.supplier_list"
                                            :key="item.id"
                                            :value="item.id"
                                            >{{ item.name }}</a-select-option
                                        >
                                    </a-select>
                                </template>
                                <template v-else>
                                    <a-tooltip placement="top" :title="text">
                                        <a-button type="link" @click="routerChange('supplier', record)">{{
                                            record.supplier_name
                                        }}</a-button>
                                    </a-tooltip>
                                </template>
                            </template>
                            <template v-if="column.key === 'item'">
                                <template v-if="addMode">
                                    {{ text || '-' }}
                                </template>
                                <template v-else>{{ text }}</template>
                            </template>
                            <template v-if="column.key === 'spec'">
                                <a-tooltip placement="top" :title="text">
                                    <div class="ell" style="max-width: 120px">
                                        {{ text || '-' }}
                                    </div>
                                </a-tooltip>
                            </template>
                            <template v-if="column.key === 'material'">
                                <a-tooltip placement="top" :title="text">
                                    <div class="ell" style="max-width: 120px">
                                        <a-button type="link" @click="routerChange('material', record)">{{
                                            text || '-'
                                        }}</a-button>
                                    </div>
                                </a-tooltip>
                            </template>
                            <template v-if="column.key === 'payment_term'">
                                <template v-if="addMode">
                                    {{
                                        $Util.supplierPaymentTypeFilter(
                                            record.supplier_map[record.supplier_id].payment_term,
                                        )
                                    }}
                                </template>
                                <template v-else>{{ $Util.supplierPaymentTypeFilter(text) }}</template>
                            </template>
                            <template v-if="column.key === 'price'">
                                ￥{{ record.supplier_map[record.supplier_id].price }}
                            </template>
                            <template v-if="column.key === 'unit_price'">
                                ￥{{ $Util.countFilter(text) || '0' }}
                            </template>
                            <template v-if="column.key === 'amount'">
                                <template v-if="addMode || record.editMode">
                                    <a-input-number
                                        v-model:value="record.amount"
                                        style="width: 66px"
                                        placeholder="请输入"
                                        :min="1"
                                        :precision="0"
                                    />
                                    件
                                </template>
                                <template v-else>{{ text ? text + '件' : '-' }}</template>
                            </template>
                            <template v-if="column.key === 'arrival_time'">
                                <template v-if="addMode">
                                    <a-date-picker
                                        v-model:value="record.arrival_time"
                                        valueFormat="YYYY-MM-DD HH:mm:ss"
                                        :show-time="defaultTime"
                                        placeholder="请选择到货日期"
                                    >
                                        <template #suffixIcon><i class="icon i_calendar" /></template>
                                    </a-date-picker>
                                </template>
                                <template v-else>{{ $Util.timeFilter(text) || '-' }}</template>
                            </template>
                            <template v-if="column.key === 'total_price'">
                                <template v-if="addMode">
                                    ￥{{
                                        $Util.countFilter(
                                            record.supplier_map[record.supplier_id].price * 100 * record.amount,
                                        )
                                    }}
                                </template>
                                <template v-else>￥{{ $Util.countFilter(record.unit_price * record.amount) }}</template>
                            </template>
                            <template v-if="column.key === 'stock_in_amount'"> {{ text || '0' }} 件 </template>
                            <template v-if="column.key === 'operation'">
                                <template v-if="!this.addMode && detail.status === STATUS.INIT">
                                    <a-button type="link" @click="handleRowChange(record)" v-if="!record.editMode"
                                        ><i class="icon i_edit" />更改数量</a-button
                                    >
                                    <a-button type="link" @click="handleRowSubmit(record)" v-else
                                        ><i class="icon i_confirm" />确认更改</a-button
                                    >
                                    <a-button type="link" @click="handleRemoveRow(record)" class="danger"
                                        ><i class="icon i_delete" />移除</a-button
                                    >
                                </template>
                            </template>
                        </template>
                    </a-table>
                    <div class="paging-container" v-if="!addMode">
                        <a-pagination
                            v-model:current="currPage"
                            :page-size="pageSize"
                            :total="total"
                            show-quick-jumper
                            show-size-changer
                            show-less-items
                            :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                            :hide-on-single-page="false"
                            :pageSizeOptions="['10', '20', '30', '40']"
                            @change="pageChange"
                            @showSizeChange="pageSizeChange"
                        />
                    </div>
                </div>
            </a-collapse-panel>
        </a-collapse>
        <!-- 入库 -->
        <template class="modal-container" v-if="detail.status === STATUS.PASS || detail.status === STATUS.PART">
            <a-modal v-model:visible="purchaseShow" title="入库" :after-close="handlePurchaseClose">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">仓库:</div>
                        <div class="value">
                            <a-select
                                v-model:value="editForm.warehouse_id"
                                placeholder="请选择仓库"
                                show-search
                                option-filter-prop="children"
                            >
                                <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="purchaseShow = false">取消</a-button>
                    <a-button @click="handleStock" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import MaterialSelect from '../../components/popup-btn/MaterialSelect.vue';
import AuditHandle from '../../components/popup-btn/AuditHandle.vue';
import dayjs from 'dayjs';

const MATERIAL_PURCHASE = Core.Const.MATERIAL_PURCHASE;
const STATUS = MATERIAL_PURCHASE.STATUS;
const STOCK_RECORD = Core.Const.STOCK_RECORD;
export default {
    name: 'MaterialPurchaseDetail',
    components: {
        MaterialSelect,
        AuditHandle,
    },
    props: {},
    data() {
        return {
            STATUS,
            STOCK_RECORD,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            id: '',
            detail: {},
            activeKey: ['affirm'],
            tableData: [],
            addMode: false,
            addData: [],
            purchaseShow: false,
            warehouseList: [],
            auditForm: {
                status: '',
                audit_message: '',
            },
            count: '',
            editForm: {
                id: '',
                warehouse_id: undefined,
            },
            exportDisabled: false,
        };
    },
    watch: {},
    computed: {
        disabledChecked() {
            let list = [];
            this.tableData.forEach(item => {
                if (item.material && item.material.id) {
                    list.push(item.material.id);
                }
            });
            return list;
        },
        tableColumns() {
            let columns = [
                { title: '供应商', dataIndex: 'supplier' },
                { title: '物料名称', dataIndex: ['material', 'name'], key: 'material' },
                { title: '物料分类', dataIndex: ['material', 'category', 'name'], key: 'item' },
                { title: '物料编码', dataIndex: ['material', 'code'], key: 'item' },
                { title: '物料规格', dataIndex: ['material', 'spec'], key: 'spec' },
                { title: '单位', dataIndex: ['material', 'unit'], key: 'item' },
                // { title: '单价', dataIndex: 'price',key: 'price'},
                { title: '数量', dataIndex: 'amount', key: 'amount' },
                { title: '总价', key: 'total_price' },
                { title: '到货日期', dataIndex: 'arrival_time', key: 'arrival_time' },
                { title: '付款方式', dataIndex: 'payment_term', key: 'payment_term' },
                { title: '操作', key: 'operation', fixed: 'right' },
            ];
            if (this.detail.status !== STATUS.INIT || this.addMode) {
                columns.pop();
            }
            if (this.addMode) {
                columns.splice(6, 0, { title: '单价', dataIndex: 'price', key: 'price' });
            }
            if (!this.addMode) {
                columns.splice(6, 0, { title: '单价', dataIndex: 'unit_price', key: 'unit_price' });
            }
            if (
                this.detail.status === STATUS.N_WAREHOUSE ||
                this.detail.status === STATUS.PART ||
                this.detail.status === STATUS.WAREHOUSE_AUDIT ||
                this.detail.status === STATUS.PASS
            ) {
                columns.splice(9, 0, { title: '已入库数量', dataIndex: 'stock_in_amount', key: 'stock_in_amount' });
            }
            console.log('columns', columns);
            return columns;
        },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0;
        this.getMaterialPurchaseDetail();
        this.getWarehouseList();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'supplier':
                    routeUrl = this.$router.resolve({
                        path: '/production/supplier-detail',
                        query: { id: item.supplier_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'material':
                    routeUrl = this.$router.resolve({
                        path: '/production/material-detail',
                        query: { id: item.material_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'invoice':
                    let source = {
                        sourceUid: this.detail.sn,
                        form: {
                            type: STOCK_RECORD.TYPE.IN,
                            target_type: STOCK_RECORD.COMMODITY_TYPE.MATERIALS,
                            source_id: this.id,
                            source_type: STOCK_RECORD.SOURCE_TYPE.PURCHASE,
                            warehouse_id: this.detail.warehouse_id,
                        },
                    };
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-edit',
                        query: {
                            source: JSON.stringify(source),
                        },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getMaterialItemList();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            this.pageSize = size;
            this.getMaterialItemList();
        },
        getMaterialItemList() {
            this.loading = true;
            Core.Api.MaterialPurchase.itemList({
                material_purchase_order_id: this.id,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getMaterialItemList res', res);
                    this.tableData = res.list;
                    this.total = res.count;
                    let list = [];
                    this.tableData.forEach(i => list.push(i.stock_in_amount));
                    let sum = 0;
                    list.forEach(item => (sum += item));
                    this.count = sum;
                    console.log('list1111', list);
                    this.getSupplierName();
                    this.tableData.map(item => ({
                        item: item,
                        material: item.material,
                        unit_price: item.unit_price,
                    }));
                    console.log(' this.tableData', this.tableData);
                })
                .catch(err => {
                    console.log('getMaterialItemList err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getSupplierName() {
            let data = [...this.tableData];
            for (const item of data) {
                let supplier_id;
                if (item.supplier_id) {
                    supplier_id = item.supplier_id;
                }
                Core.Api.Supplier.detail({
                    id: supplier_id,
                }).then(res => {
                    item.supplier_name = res.detail.name;
                    item.payment_term = res.detail.payment_term;
                    console.log('getSupplierName', res.detail.name);
                });
            }
        },
        getMaterialPurchaseDetail() {
            this.loading = true;
            Core.Api.MaterialPurchase.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getMaterialPurchaseDetail res', res);
                    this.detail = res.detail;
                    this.getMaterialItemList();
                })
                .catch(err => {
                    console.log('getMaterialPurchaseDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleRowChange(item) {
            item.editMode = true;
        },
        handleRowSubmit(item) {
            console.log('item', item);
            let target = {
                id: item.id,
                material_id: item.material_id,
                material_purchase_order_id: item.material_purchase_order_id,
                supplier_id: item.supplier_id,
                price: item.price,
                amount: item.amount,
                arrival_time: item.arrival_time,
            };
            Core.Api.MaterialPurchase.itemSave(target).then(() => {
                this.$message.success(this.$t('pop_up.save_success'));
                this.getMaterialPurchaseDetail();
            });
        },

        // 移除 商品
        handleRemoveRow(record) {
            console.log('record', record);
            Core.Api.MaterialPurchase.itemDelete({
                id: record.id,
                material_purchase_order_id: this.id,
            }).then(() => {
                this.$message.success('移除成功');
                this.getMaterialItemList();
            });
        },
        handleAddChange(ids, items) {
            console.log('handleAddChange items:', items);
            let list = items.map(item => {
                let supplier_list = item.supplier_list.map(i => ({
                    id: i.id,
                    name: i.name,
                    price: Core.Util.countFilter(i.price),
                    payment_term: i.payment_term,
                }));
                return {
                    id: item.id,
                    item: item,
                    material: item,
                    amount: 1,
                    entity_uid: '',
                    category: item.category,
                    supplier_list,
                    supplier_id: supplier_list && supplier_list.length ? supplier_list[0].id : undefined,
                };
            });
            this.addData = list;
            this.addMode = true;
            for (let item of list) {
                item.supplier_map = {};
                for (let supplier of item.supplier_list) {
                    item.supplier_map[supplier.id] = {
                        price: supplier.price,
                        payment_term: supplier.payment_term,
                    };
                    console.log('getMaterialList', supplier.price);
                }
            }
            console.log('addData', this.addData);
        },

        async handleAddSubmit() {
            this.loading = true;
            let data = [...this.tableData, ...this.addData];
            console.log('data', data);
            let list = [];
            for (const item of data) {
                let material_id, supplier_id, price, payment_term, arrival_time;
                if (item.material && item.id) {
                    material_id = item.material.id;
                    supplier_id = item.supplier_id;
                    arrival_time = item.arrival_time;
                    console.log('item.supplier_map', item.supplier_map);
                    console.log('supplier_id', supplier_id);
                    console.log('arrival_time', arrival_time);
                    if (item.supplier_id && item.supplier_map) {
                        price = item.supplier_map[supplier_id].price;
                        payment_term = item.supplier_map[supplier_id].payment_term;
                    } else {
                        price = item.price;
                    }
                } else {
                    return this.$message.warning('该物料不存在');
                }
                arrival_time = item.arrival_time;
                if (typeof arrival_time === 'string') {
                    arrival_time = dayjs(item.arrival_time).unix();
                }
                list.push({
                    amount: item.amount,
                    material_id,
                    supplier_id,
                    price,
                    payment_term,
                    arrival_time: arrival_time,
                    material_purchase_order_id: this.id,
                });
            }
            console.log('handleAddSubmit list:', list);
            Core.Api.MaterialPurchase.batchSave(list)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    console.log('this.arrival_time', this.arrival_time);
                    this.getMaterialPurchaseDetail();
                    this.addMode = false;
                })
                .catch(err => {
                    console.log('handleAddSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        //提交
        handleSubmit() {
            if (!this.tableData.length) {
                return this.$message.warning(`请先选择需要采购的商品`);
            }
            let _this = this;
            this.$confirm({
                title: `确定提交该采购单吗？`,
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.MaterialPurchase.submit({ id: _this.id })
                        .then(() => {
                            _this.$message.success('操作成功');
                            _this.getMaterialPurchaseDetail();
                        })
                        .catch(err => {
                            console.log('handleSubmit err', err);
                        });
                },
            });
        },
        // 取消
        handleCancel() {
            let _this = this;
            this.$confirm({
                title: `确定撤销该采购单吗？`,
                okText: '确定',
                cancelText: '撤销',
                onOk() {
                    Core.Api.MaterialPurchase.cancel({ id: _this.id })
                        .then(() => {
                            _this.$message.success('操作成功');
                            _this.getMaterialPurchaseDetail();
                        })
                        .catch(err => {
                            console.log('handleSubmit err', err);
                        });
                },
            });
        },
        handlePurchaseShow() {
            this.purchaseShow = true;
        },
        handlePurchaseClose() {
            this.purchaseShow = false;
            Object.assign(this.editForm, this.$options.data().editForm);
        },
        handleStock() {
            this.editForm.id = this.id;
            let editForm = Core.Util.deepCopy(this.editForm);
            Core.Api.MaterialPurchase.stock({
                ...editForm,
            })
                .then(() => {
                    this.$message.success('入库完成');
                    this.handlePurchaseClose();
                    this.getMaterialPurchaseDetail();
                })
                .catch(err => {
                    console.log('handleStock err', err);
                });
        },
        handleExport() {
            // 确认库单是否导出
            let _this = this;
            this.$confirm({
                title: '确认要导出吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    _this.handlePurchaseExport();
                },
            });
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list;
                console.log('getWarehouseList', this.warehouseList);
            });
        },

        handlePurchaseExport() {
            // 订单导出
            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.materialPurchaseExport({
                material_purchase_order_id: this.id,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            console.log('material_purchase_order_id', this.id);
            console.log('handlePurchaseExport _exportUrl', exportUrl);
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },
    },
};
</script>

<style lang="less">
#MaterialPurchaseDetail {
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
}
</style>
