<template>
    <div id="WarehouseTransferDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">调货单详情</div>
            <div class="btn-area">
                <template v-if="detail.status === STATUS.INIT">
                    <a-button type="danger" ghost @click="handleCancel()"> <i class="icon i_close_c" />撤销</a-button>
                    <a-button type="primary" @click="handleSubmit()"><i class="icon i_confirm" />提交</a-button>
                </template>
                <AuditHandle
                    v-if="detail.status === STATUS.APPLICANT_AUDIT || detail.status === STATUS.SENDER_AUDIT"
                    btnType="primary"
                    :s-pass="STATUS.AUDIT_PASS"
                    :s-refuse="STATUS.APPLICANT_AUDIT_REFUSE"
                    :api-list="['WarehouseTransfer', 'audit']"
                    :id="id"
                    @submit="getWarehouseTransferDetail"
                    ><i class="icon i_audit" />仓库审核</AuditHandle
                >
                <a-button v-if="detail.status === STATUS.AUDIT_PASS" type="primary" @click="handleReceive"
                    ><i class="icon i_s_warehouse" />发货</a-button
                >
                <a-button v-if="detail.status === STATUS.DELIVERED" type="primary" @click="handleReceive"
                    ><i class="icon i_s_warehouse" />收货</a-button
                >
                <a-button v-if="detail.status === STATUS.RECEIVED" type="primary" @click="handleReceive"
                    ><i class="icon i_s_warehouse" />入库</a-button
                >                
            </div>
        </div>
        <div class="gray-panel info">
            <div class="panel-title">
                <div class="left"><span>调货单编号：</span>{{ detail.uid }}</div>
                <div class="right">
                    <div class="status">
                        <i class="icon i_point" :class="$Util.warehouseTransferStatusFilter(detail.status, 'color')" />
                        {{ $Util.warehouseTransferStatusFilter(detail.status) }}
                    </div>
                </div>
            </div>
            <div class="panel-content">
                <div class="info-item">
                    <div class="key">申请人</div>
                    <div class="value">
                        <template v-if="detail.apply_user && detail.apply_user.account">{{
                            detail.apply_user.account.name
                        }}</template>
                        <template v-else>-</template>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">申请时间</div>
                    <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">发货仓库</div>
                    <div class="value">{{ detail.from_warehouse.name || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">收货仓库</div>
                    <div class="value">{{ detail.to_warehouse.name || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">调货类目</div>
                    <div class="value">{{ $Util.transferTypeFilter(detail.target_type) || '-' }}</div>
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
            <!-- 无实例 -->
            <a-collapse-panel
                key="ItemList"
                header="商品信息"
                class="gray-collapse-panel"
                collapsible="disabled"
                v-if="detail.target_type === COMMODITY_TYPE.ITEM"
            >
                <template #extra>
                    <template v-if="detail.status === STATUS.INIT && !addMode">
                        <ItemSelect
                            btnType="link"
                            btnText="添加商品"
                            :disabledChecked="disabledChecked"
                            @select="handleAddItemChange"
                        />
                    </template>
                    <a-button type="link" class="extra-btn" v-if="addMode" @click.stop="handleAddSubmit('item')"
                        >确认添加</a-button
                    >
                </template>
                <div class="panel-content">
                    <div class="table-container">
                        <a-table
                            :columns="itemTableColumns"
                            :data-source="addMode ? addData : tableData"
                            :scroll="{ x: true }"
                            :row-key="record => record.id"
                            :pagination="false"
                        >
                            <template #bodyCell="{ column, text, record }">
                                <!-- <template v-if="column.key === 'tip_item'">
                                <a-tooltip placement="top" :title='text'>
                                    <div class="ell" style="max-width: 160px">
                                        <a-button type="link" @click="routerChange('item', record )">{{ text || '-' }}</a-button>
                                    </div>
                                </a-tooltip>
                            </template> -->
                                <!-- <template v-if="column.key === 'attr_list'">
                               <a-tooltip placement="top" :title='$Util.itemSpecFilter(text)'>
                                   <div class="ell" style="max-width: 120px">
                                       {{ $Util.itemSpecFilter(text) }}
                                   </div>
                               </a-tooltip>
                           </template> -->

                                <template v-if="column.key === 'target_type'">
                                    {{ $Util.targetTypeFilter(record.target_type, $i18n.locale) }}
                                </template>
                                <template v-if="record.target_type === COMMODITY_TYPE.MATERIALS">
                                    <template v-if="column.key === 'name'">
                                        <div class="ell" style="max-width: 160px">
                                            <a-button type="link" @click="routerChange('material', record)">{{
                                                $i18n.locale == 'zh'
                                                    ? record.material.name || '-'
                                                    : record.material.name_en || '-'
                                            }}</a-button>
                                        </div>
                                    </template>
                                    <template v-if="column.key === 'code'">
                                        {{ record.material.code || '-' }}
                                    </template>
                                    <template v-if="column.key === 'spec'">
                                        {{ record.material.spec || '-' }}
                                    </template>
                                    <!-- <template v-if="column.key === 'count'">
                                    {{ record.material.stock ? record.material.stock + $t('in.item') : '-' }}
                                </template> -->
                                    <template v-if="column.key === 'amount'">
                                        <template v-if="addMode || record.editMode">
                                            <a-input-number
                                                v-model:value="record.amount"
                                                :placeholder="$t('def.input')"
                                                :min="1"
                                                :max="
                                                    detail.type === TYPE.IN
                                                        ? 99999
                                                        : record.material != undefined
                                                          ? record.material.stock
                                                          : 0
                                                "
                                                :precision="0"
                                            />
                                            {{ $t('in.item') }}
                                        </template>
                                        <template v-else>{{ text ? text + $t('in.item') : '-' }}</template>
                                    </template>
                                </template>
                                <template v-if="record.target_type === COMMODITY_TYPE.ITEM">
                                    <template v-if="column.key === 'name'">
                                        <div class="ell" style="max-width: 160px">
                                            <a-button type="link" @click="routerChange('item', record)">{{
                                                $i18n.locale == 'zh'
                                                    ? record.item.name || '-'
                                                    : record.item.name_en || '-'
                                            }}</a-button>
                                        </div>
                                    </template>
                                    <template v-if="column.key === 'code'">
                                        {{ record.item.code || '-' }}
                                    </template>
                                    <template v-if="column.key === 'spec'">
                                        <a-tooltip placement="top" :title="$Util.itemSpecFilter(text, $i18n.locale)">
                                            <div class="ell" style="max-width: 120px">
                                                {{ $Util.itemSpecFilter(text, $i18n.locale) }}
                                            </div>
                                        </a-tooltip>
                                    </template>
                                    <template v-if="column.key === 'count'">
                                        {{ record.item.stock ? record.item.stock + $t('in.item') : '-' }}
                                    </template>
                                    <template v-if="column.key === 'amount'">
                                        <template v-if="addMode || record.editMode">
                                            <a-input-number
                                                v-model:value="record.amount"
                                                :placeholder="$t('def.input')"
                                                :min="1"
                                                :max="
                                                    detail.type === TYPE.IN
                                                        ? 99999
                                                        : record.item != undefined
                                                          ? record.item.stock
                                                          : 0
                                                "
                                                :precision="0"
                                            />
                                            {{ $t('in.item') }}
                                        </template>
                                        <template v-else>{{ text ? text + $t('in.item') : '-' }}</template>
                                    </template>
                                </template>

                                <!-- <template v-if="column.key === 'flag_entity'">
                                {{ $Util.itemFlagEntityFilter(text, $i18n.locale) }}
                            </template> -->

                                <!-- <template v-if="column.key === 'count'">
                                {{ text ? text + $t('in.item') : '-' }}
                            </template> -->
                                <!-- <template v-if="column.key === 'child_size'">
                                <a-button type="link" @click="handleRowUidInfoShow(record)" v-if="record.flag_entity === Core.Const.ITEM.FLAG_ENTITY.YES && (detail.status === STATUS.CLOSE || detail.status === STATUS.DELIVERY || detail.status === STATUS.AUDIT_REFUSE || detail.status === STATUS.CANCEL)"> {{ text  }} / {{record.amount}} </a-button>
                                <a-button type="link" @click="handleRowUidShow(record)" v-if="record.flag_entity === Core.Const.ITEM.FLAG_ENTITY.YES && detail.status !== STATUS.CLOSE && detail.status !== STATUS.DELIVERY && detail.status !== STATUS.AUDIT_REFUSE && detail.status !== STATUS.CANCEL">{{ text  }} / {{record.amount}} </a-button>
                            </template> -->
                                <!-- <template v-if="column.key === 'confirm_amount'">
                               {{ text ? text +$t('in.item') : '-' }}
                            </template> -->

                                <template v-if="column.key === 'operation'">
                                    <a-button
                                        type="link"
                                        @click="handleRowUidShow(record)"
                                        v-if="record.flag_entity === Core.Const.ITEM.FLAG_ENTITY.YES"
                                        ><i class="icon i_edit" />{{ $t('in.enter_instance_number') }}</a-button
                                    >
                                </template>
                                <template v-if="column.key === 'operation'">
                                    <a-button type="link" @click="handleRowChange(record)" v-if="!record.editMode"
                                        ><i class="icon i_edit" />{{ $t('in.change') }}</a-button
                                    >
                                    <a-button type="link" @click="handleRowSubmit(record, record.target_type)" v-else
                                        ><i class="icon i_confirm" />{{ $t('in.changes') }}</a-button
                                    >
                                    <a-button type="link" @click="handleRemoveRow(record)" class="danger"
                                        ><i class="icon i_delete" />{{ $t('def.remove') }}</a-button
                                    >
                                </template>
                            </template>
                        </a-table>
                    </div>
                    <div class="paging-container">
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
        <template class="modal-container" v-if="detail.status === STATUS.SUBMIT">
            <a-modal
                v-model:visible="purchaseShow"
                title="审核"
                class="purchase-audit-modal"
                :after-close="handlePurchaseClose"
            >
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">审核结果:</div>
                        <div class="value">
                            <a-radio-group v-model:value="auditForm.status">
                                <a-radio :value="STATUS.PASS">通过</a-radio>
                                <a-radio :value="STATUS.REFUSE">不通过</a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                    <div class="form-item textarea required" v-if="auditForm.status === STATUS.REFUSE">
                        <div class="key">原因:</div>
                        <div class="value">
                            <a-textarea
                                v-model:value="auditForm.audit_message"
                                placeholder="请输入不通过原因"
                                :auto-size="{ minRows: 2, maxRows: 6 }"
                                :maxlength="99"
                            />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="purchaseShow = false">取消</a-button>
                    <a-button @click="handlePurchaseSubmit()" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
        <!-- 入库 -->
        <template class="modal-container" v-if="detail.status === STATUS.PASS">
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
import ItemSelect from '../../components/popup-btn/ItemSelect.vue';
import dayjs from 'dayjs';

const WAREHOUSE_TRANSFER = Core.Const.WAREHOUSE_TRANSFER;
const STATUS = WAREHOUSE_TRANSFER.STATUS;

const COMMODITY_TYPE = Core.Const.WAREHOUSE_TRANSFER.COMMODITY_TYPE;
const STOCK_RECORD = Core.Const.STOCK_RECORD;
const TYPE = STOCK_RECORD.TYPE;
export default {
    name: 'WarehouseTransferDetail',
    components: {
        MaterialSelect,
        AuditHandle,
        ItemSelect,
    },
    props: {},
    data() {
        return {
            STATUS,
            WAREHOUSE_TRANSFER,
            COMMODITY_TYPE,
            TYPE,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            id: '',
            detail: {
                to_warehouse: {},
                from_warehouse: {},
            },
            activeKey: ['ItemList'],
            tableData: [],
            addMode: false,
            addData: [],
            purchaseShow: false,
            warehouseList: [],
            auditForm: {
                status: '',
                audit_message: '',
            },
            editForm: {
                id: '',
                warehouse_id: undefined,
            },
            exportDisabled: false,
        };
    },
    watch: {},
    computed: {
        type_ch() {
            return this.detail.type == TYPE.IN ? this.$t('in.inbound') : this.$t('in.outbound');
        },
        disabledChecked() {
            let list = [];
            this.tableData.forEach(item => {
                if (item.material && item.material.id) {
                    list.push(item.material.id);
                } else if (item.item && item.item.id) {
                    list.push(item.item.id);
                }
            });
            return list;
        },
        itemTableColumns() {
            // 无实例商品的 出入库
            let columns = [
                { title: this.$t('n.name'), dataIndex: 'name', key: 'name' },

                // {title: this.$t('i.number'), dataIndex: ['item', 'model'], key: 'item'},
                { title: this.$t('i.code'), dataIndex: 'code', key: 'code' },
                { title: this.$t('i.type'), dataIndex: 'target_type', key: 'target_type' },
                { title: this.$t('i.spec'), dataIndex: 'spec', key: 'spec' },
                // {title: this.$t('in.has_number'), dataIndex: "flag_entity", key: 'flag_entity'},
                // {title: this.$t('in.instance_number_amount'), dataIndex: "child_size", key: 'child_size'},
                // {title: this.$t('in.realistic') + this.type_ch + this.$t('i.amount'), dataIndex: 'confirm_amount' , key: 'confirm_amount'},
                { title: this.type_ch + this.$t('i.amount'), dataIndex: 'amount', key: 'amount' },
                { title: this.$t('def.operate'), key: 'operation' },
            ];
            if (this.detail.status !== STATUS.INIT || this.addMode) {
                columns.pop();
            }
            if (this.detail.type == TYPE.OUT) {
                columns.splice(2, 0, { title: this.$t('wa.quantity'), dataIndex: 'stock', key: 'stock' });
            }
            return columns;
        },
        materialTableColumns() {
            // 物料调货
            let columns = [
                { title: '供应商', dataIndex: 'supplier' },
                { title: '物料名称', dataIndex: ['material', 'name'], key: 'tip_item' },
                { title: '物料分类', dataIndex: ['category', 'name'], key: 'item' },
                { title: '物料编码', dataIndex: ['material', 'code'], key: 'item' },
                { title: '物料规格', dataIndex: ['material', 'spec'], key: 'spec' },
                { title: '单位', dataIndex: ['material', 'unit'], key: 'item' },
                { title: '单价', dataIndex: 'price', key: 'price' },
                { title: '调货数量', dataIndex: 'amount', key: 'amount' },
                { title: '总价', key: 'total_price' },
                { title: '操作', key: 'operation' },
            ];
            if (this.detail.status !== STATUS.INIT || this.addMode) {
                columns.pop();
            }
            if (this.detail.status === STATUS.CLOSE) {
                columns.splice(9, 0, { title: '已入库数量', dataIndex: 'stock_in_amount', key: 'stock_in_amount' });
            }
            return columns;
        },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0;
        this.getWarehouseTransferDetail();
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
                        query: { id: item.material.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: { id: item.item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.geTransferItemList();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            this.pageSize = size;
            this.geTransferItemList();
        },
        geTransferItemList() {
            this.loading = true;
            Core.Api.WarehouseTransfer.itemList({
                warehouse_transfer_order_id: this.id,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('geTransferItemList res', res);
                    this.tableData = res.list;
                    this.total = res.count;
                    if (this.detail.target_type === 30) {
                        this.getSupplierName();
                    }
                    this.tableData.map(item => ({
                        item: item,
                        material: item.material,
                        unit_price: item.unit_price,
                    }));
                    console.log(' this.tableData', this.tableData);
                })
                .catch(err => {
                    console.log('geTransferItemList err', err);
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
                    console.log('getSupplierName', res.detail.name);
                });
            }
        },
        getWarehouseTransferDetail() {
            this.loading = true;
            Core.Api.WarehouseTransfer.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getWarehouseTransferDetail res', res);
                    this.detail = res.detail;
                    this.geTransferItemList();
                })
                .catch(err => {
                    console.log('getWarehouseTransferDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleRowChange(item) {
            console.log('handleRowChange', item);
            item.editMode = true;
        },
        handleRowSubmit(item, type) {
            let target_id = '';
            let supplier_id = '';
            let price = '';
            switch (type) {
                case 'item':
                    target_id = item.item.id;
                    break;
                case 'material': {
                    target_id = item.material.id;
                    supplier_id = item.supplier_id;
                    price = item.price;
                    break;
                }
            }
            let target = {
                id: item.id,
                amount: item.amount,
                target_id,
                supplier_id,
                warehouse_transfer_order_id: this.id,
                price,
            };
            if (!target.target_id) {
                return this.$message.warning(`该${type === 'item' ? '商品' : '商品实例'}不存在`);
            }
            Core.Api.WarehouseTransfer.itemSave(target).then(() => {
                this.$message.success(this.$t('pop_up.save_success'));
                this.getWarehouseTransferDetail();
            });
        },

        // 移除 商品
        handleRemoveRow(record) {
            console.log('record', record);
            Core.Api.WarehouseTransfer.itemDelete({
                id: record.id,
                warehouse_transfer_order_id: this.id,
            }).then(() => {
                this.$message.success(this.$t('pop_up.remove_a'));
                this.geTransferItemList();
            });
        },
        handleAddItemChange(ids, items) {
            console.log('handleAddChange items:', items);
            let list = items.map(item => ({
                id: 0,
                item: item,
                amount: 1,
            }));
            this.addData = list;
            this.addMode = true;
        },
        handleAddChange(ids, items) {
            console.log('handleAddChange items:', items);
            let list = items.map(item => {
                let supplier_list = item.supplier_list.map(i => ({
                    id: i.id,
                    name: i.name,
                    price: Core.Util.countFilter(i.price),
                }));
                return {
                    id: item.id,
                    item: item,
                    material: item,
                    amount: 1,
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
                    item.supplier_map[supplier.id] = supplier.price;
                    console.log('getMaterialList', supplier.price);
                }
            }
            console.log('addData', this.addData);
        },

        async handleAddSubmit(type) {
            this.loading = true;
            let data = [...this.tableData, ...this.addData];
            console.log('data', data);
            let list = [];
            for (const item of data) {
                let target_id, target_uid, supplier_id, price;
                switch (type) {
                    case 'item':
                        if (item.item && item.item.id) {
                            target_id = item.item.id;
                        } else {
                            return this.$message.warning('该商品不存在');
                        }
                        break;
                    case 'material':
                        console.log('item.material', item.material);
                        console.log('item.material', item.material);
                        console.log('item.material.id:', item.material.id);
                        console.log('item.supplier_id:', item.supplier_id);
                        console.log('item.price:', item.price);
                        console.log('item.material && item.material.id:', item.material && item.material.id);
                        if (item.material && item.material.id) {
                            target_id = item.material.id;
                            supplier_id = item.supplier_id;
                            console.log('item.supplier_map', item.supplier_map);
                            console.log('supplier_id', supplier_id);
                            // console.log('item.material.supplier_map', item.supplier_map[supplier_id])
                            if (item.supplier_id && item.supplier_map) {
                                price = item.supplier_map[supplier_id];
                            } else {
                                price = item.price;
                            }
                        } else {
                            return this.$message.warning('该物料不存在');
                        }
                        break;
                }
                list.push({
                    id: item.id,
                    amount: item.amount,
                    warehouse_transfer_order_id: this.id,
                    target_id,
                    target_uid,
                    supplier_id,
                    price,
                });
            }
            console.log('handleAddSubmit list:', list);
            Core.Api.WarehouseTransfer.saveList(list)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    console.log('this.arrival_time', this.arrival_time);
                    this.getWarehouseTransferDetail();
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
                return this.$message.warning(`请先选择需要调货的商品`);
            }
            let _this = this;
            this.$confirm({
                title: `确定提交该调货单吗？`,
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.WarehouseTransfer.submit({ id: _this.id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.operate'));
                            _this.getWarehouseTransferDetail();
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
                title: `确定撤销该调货单吗？`,
                okText: '确定',
                cancelText: '撤销',
                onOk() {
                    Core.Api.WarehouseTransfer.cancel({ id: _this.id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.operate'));
                            _this.getWarehouseTransferDetail();
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
            Object.assign(this.auditForm, this.$options.data().auditForm);
        },
        handlePurchaseSubmit() {
            console.log('id', this.id);
            Core.Api.WarehouseTransfer.audit({
                id: this.id,
                status: this.auditForm.status,
                audit_message: this.auditForm.audit_message,
            })
                .then(res => {
                    console.log('handlePurchaseSubmit res', res);
                    this.handlePurchaseClose();
                    this.getWarehouseTransferDetail();
                })
                .catch(err => {
                    console.log('handlePurchaseSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
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
        handleStock() {
            this.editForm.id = this.id;
            let editForm = Core.Util.deepCopy(this.editForm);
            Core.Api.WarehouseTransfer.stock({
                ...editForm,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.inbound_finish'));
                    this.handlePurchaseClose();
                    this.getWarehouseTransferDetail();
                })
                .catch(err => {
                    console.log('handleStock err', err);
                });
        },
        handleReceive() {
            // 处理是否发货
            let _this = this;
            let name = {};
            let api = [];
            switch (this.detail.status) {
                case STATUS.AUDIT_PASS:
                    name = '发货';
                    api = ['WarehouseTransfer', 'deliver'];
                    break;
                case STATUS.DELIVERED:
                    name = '收货';
                    api = ['WarehouseTransfer', 'receive'];
                    break;
                case STATUS.RECEIVED:
                    name = '入库';
                    api = ['WarehouseTransfer', 'stock'];
                    break;
            }
            this.$confirm({
                title: '确定' + name + '吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api[api[0]]
                        [api[1]]({
                            id: _this.id,
                        })
                        .then(() => {
                            _this.$message.success(name + '完成');
                            _this.routerChange('back');
                            _this.getStatusList();
                            _this.deliverShow = false;
                        })
                        .catch(err => {
                            console.log('handleInvoice err', err);
                        });
                },
            });
        },
        /*handlePurchaseExport() { // 订单导出
            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.materialPurchaseExport({
                material_purchase_order_id: this.id,
            })
            console.log('material_purchase_order_id',this.id)
            console.log("handlePurchaseExport _exportUrl", exportUrl)
            window.open(exportUrl, '_blank')
            this.exportDisabled = false;
        },*/
    },
};
</script>

<style lang="less">
#WarehouseTransferDetail {
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
