<template>
    <div id="InvoiceDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">{{ type_ch }}{{ $t('in.detail') }}</div>
            <div class="btn-area">
                <template v-if="detail.status === STATUS.INIT">
                    <a-button type="primary" @click="handleSubmit()"
                        ><i class="icon i_confirm" />{{ $t('def.submit') }}</a-button
                    >
                    <a-button type="danger" ghost @click="handleCancel()">
                        <i class="icon i_close_c" />{{ $t('def.cancel') }}</a-button
                    >
                </template>
                <template
                    v-if="
                        (detail.status === STATUS.CLOSE || detail.status === STATUS.DELIVERY) &&
                        detail.type === TYPE.IN &&
                        detail.target_type === 30 &&
                        $auth('ADMIN')
                    "
                >
                    <a-button type="primary" @click="handleExportIn"><i class="icon i_download" />导出</a-button>
                </template>
                <AuditMaterialPurchase
                    v-if="detail.status === STATUS.WAIT_AUDIT"
                    btnType="primary"
                    :ghost="false"
                    :api-list="['Invoice', 'audit']"
                    :invoiceId="id"
                    :status="STATUS.WAIT_AUDIT"
                    @submit="getInvoiceDetail"
                    ><i class="icon i_audit" />仓库审核</AuditMaterialPurchase
                >
                <a-button
                    type="primary"
                    @click="handleComplete()"
                    v-if="detail.status === STATUS.AUDIT_PASS && detail.type === TYPE.IN"
                    ><i class="icon i_confirm" />{{ type_ch }}完成</a-button
                >
                <template v-if="detail.type === TYPE.OUT">
                    <AuditMaterialPurchase
                        v-if="detail.status === STATUS.AUDIT_PASS"
                        btnType="primary"
                        :ghost="false"
                        :api-list="['Invoice', 'audit']"
                        :invoiceId="id"
                        :status="STATUS.AUDIT_PASS"
                        @submit="getInvoiceDetail"
                        ><i class="icon i_audit" />财务审核</AuditMaterialPurchase
                    >
                    <a-button type="primary" @click="handleComplete()" v-if="detail.status === STATUS.FINANCE_PASS"
                        ><i class="icon i_confirm" />{{ type_ch }}完成</a-button
                    >
                    <a-button
                        type="primary"
                        @click="handleExportOut"
                        v-if="detail.status === STATUS.CLOSE && detail.target_type === 30 && $auth('ADMIN')"
                        ><i class="icon i_download" />导出</a-button
                    >
                </template>
            </div>
        </div>
        <div class="gray-panel info">
            <div class="panel-title">
                <div class="left">
                    <span>{{ type_ch }}{{ $t('in.number') }}:</span> {{ detail.uid }}
                </div>
                <div class="right">
                    <div class="status">
                        <i class="icon i_point" :class="$Util.invoiceStatusFilter(detail.status, 'color')" />
                        {{ $Util.invoiceStatusFilter(detail.status, $i18n.locale) }}
                    </div>
                </div>
            </div>
            <div class="panel-content">
                <div class="info-item">
                    <div class="key">{{ $t('in.related') }}</div>
                    <div class="value">
                        <a-button type="link" @click="routerChange('warehouse')">{{ warehouse.name || '-' }}</a-button>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('n.type') }}</div>
                    <div class="value">{{ $Util.warehouseTypeFilter(warehouse.type, $i18n.locale) || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('in.category') }}</div>
                    <div class="value">{{ $Util.targetTypeFilter(detail.target_type, $i18n.locale) || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('n.source') }}</div>
                    <!--                admin端设置了不翻译来源-->
                    <div class="value" v-if="$auth('ADMIN')">
                        {{ $Util.sourceTypeAdminFilter(detail.source_type) || '-' }}
                    </div>
                    <div class="value" v-if="!$auth('ADMIN')">
                        {{ $Util.sourceTypeFilter(detail.source_type, $i18n.locale) || '-' }}
                    </div>
                </div>
                <div class="info-item" v-if="detail.source_type !== SOURCE_TYPE.ADMIN">
                    <div class="key">{{ $t('n.source_number') }}</div>
                    <div class="value">
                        <a-button type="link" v-if="detail.source_uid" @click="routerChange('source')">{{
                            detail.source_uid
                        }}</a-button>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('n.operator') }}</div>
                    <div class="value">
                        <template v-if="detail.apply_user && detail.apply_user.account">{{
                            detail.apply_user.account.name
                        }}</template>
                        <template v-else>-</template>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('d.create_time') }}</div>
                    <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('in.reviewer') }}</div>
                    <div class="value">
                        <template v-if="detail.audit_user && detail.apply_user.account">{{
                            detail.audit_user.account.name
                        }}</template>
                        <template v-else>-</template>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('in.time') }}</div>
                    <div class="value">{{ $Util.timeFilter(detail.audit_time) || '-' }}</div>
                </div>
                <div class="info-item" v-if="detail.type === TYPE.OUT">
                    <div class="key">财务审核时间</div>
                    <div class="value">{{ $Util.timeFilter(detail.finance_audit_time) || '-' }}</div>
                </div>
            </div>
        </div>
        <a-collapse v-model:activeKey="activeKey" ghost>
            <!-- 无实例 -->
            <a-collapse-panel
                key="ItemList"
                :header="$t('i.product_information')"
                class="gray-collapse-panel"
                collapsible="disabled"
                v-if="detail.target_type === COMMODITY_TYPE.ITEM"
            >
                <template #extra>
                    <template v-if="detail.status === STATUS.INIT && !addMode">
                        <ItemSelect
                            btnType="link"
                            :btnText="$t('i.add')"
                            v-if="detail.source_type !== SOURCE_TYPE.PRODUCTION"
                            :purchaseId="detail.type == TYPE.IN ? detail.source_id : 0"
                            :sourceType="detail.type == TYPE.IN ? detail.source_type : 0"
                            :warehouseId="detail.type == TYPE.OUT ? detail.warehouse_id : 0"
                            :disabledChecked="disabledChecked"
                            @select="handleAddItemChange"
                        />
                        <a-popover
                            v-model:visible="production.addVisible"
                            trigger="click"
                            placement="left"
                            v-else-if="production.maxCount"
                            @visibleChange="
                                visible => {
                                    !visible && handleProdAddCancel();
                                }
                            "
                            title="请输入添加数量"
                        >
                            <template #content>
                                <div class="prod-edit-popover">
                                    <a-input-number
                                        v-model:value="production.addCount"
                                        placeholder="添加数量"
                                        @keydown.enter="handleProdAddChange(index)"
                                        :autofocus="true"
                                        :max="production.maxCount"
                                        :min="1"
                                        :precision="0"
                                    />
                                    <div class="btns">
                                        <a-button type="primary" @click="handleProdAddCancel()" ghost>{{
                                            $t('def.cancel')
                                        }}</a-button>
                                        <a-button type="primary" @click="handleProdAddChange()">{{
                                            $t('def.sure')
                                        }}</a-button>
                                    </div>
                                </div>
                            </template>
                            <a-button type="link" class="extra-btn" @click.stop>添加商品</a-button>
                        </a-popover>
                    </template>
                    <a-button type="link" class="extra-btn" v-if="addMode" @click.stop="handleAddSubmit('item')">{{
                        $t('in.add')
                    }}</a-button>
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
                                <template v-if="column.key === 'tip_item'">
                                    <a-tooltip placement="top" :title="text">
                                        <div class="ell" style="max-width: 160px">
                                            <a-button type="link" @click="routerChange('item', record)">{{
                                                text || '-'
                                            }}</a-button>
                                        </div>
                                    </a-tooltip>
                                </template>
                                <template v-if="column.key === 'attr_list'">
                                    <a-tooltip placement="top" :title="$Util.itemSpecFilter(text)">
                                        <div class="ell" style="max-width: 120px">
                                            {{ $Util.itemSpecFilter(text) }}
                                        </div>
                                    </a-tooltip>
                                </template>
                                <template v-if="column.key === 'item'">
                                    {{ text || '-' }}
                                </template>
                                <template v-if="column.key === 'count'">
                                    {{ text ? text + $t('in.item') : '-' }}
                                </template>
                                <template v-if="column.key === 'amount'">
                                    <template v-if="addMode || record.editMode">
                                        <a-input-number
                                            v-model:value="record.amount"
                                            :placeholder="$t('def.input')"
                                            :min="1"
                                            :max="detail.type === TYPE.IN ? 99999 : record.item.stock"
                                            :precision="0"
                                        />
                                        {{ $t('in.item') }}
                                    </template>
                                    <template v-else>{{ text ? text + $t('in.item') : '-' }}</template>
                                </template>
                                <template v-if="column.key === 'operation'">
                                    <a-button type="link" @click="handleRowChange(record)" v-if="!record.editMode"
                                        ><i class="icon i_edit" />{{ $t('in.change') }}</a-button
                                    >
                                    <a-button type="link" @click="handleRowSubmit(record, 'item')" v-else
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
            <!-- 有实例 -->
            <a-collapse-panel
                key="ItemList"
                :header="$t('i.product_information')"
                class="gray-collapse-panel"
                collapsible="disabled"
                v-if="detail.target_type === COMMODITY_TYPE.ENTITY"
            >
                <template #extra v-if="detail.type == TYPE.IN">
                    <!-- 有实例入库 选择商品并输入数量、实例号 -->
                    <template v-if="detail.status === STATUS.INIT && !addMode">
                        <ItemSelect
                            btnType="link"
                            :btnText="$t('i.add')"
                            v-if="detail.source_type !== SOURCE_TYPE.PRODUCTION"
                            @select="handleAddItemChange"
                        />

                        <a-popover
                            v-model:visible="production.addVisible"
                            trigger="click"
                            placement="left"
                            v-else-if="production.maxCount"
                            @visibleChange="
                                visible => {
                                    !visible && handleProdAddCancel();
                                }
                            "
                            title="请输入添加数量"
                        >
                            <template #content>
                                <div class="prod-edit-popover">
                                    <a-input-number
                                        v-model:value="production.addCount"
                                        placeholder="添加数量"
                                        @keydown.enter="handleProdAddChange(index)"
                                        :autofocus="true"
                                        :max="production.maxCount"
                                        :min="1"
                                        :precision="0"
                                    />
                                    <div class="btns">
                                        <a-button type="primary" @click="handleProdAddCancel()" ghost>取消</a-button>
                                        <a-button type="primary" @click="handleProdAddChange()">确定</a-button>
                                    </div>
                                </div>
                            </template>
                            <a-button type="link" class="extra-btn" @click.stop>添加商品</a-button>
                        </a-popover>
                    </template>
                    <a-button type="link" class="extra-btn" v-if="addMode" @click.stop="handleAddSubmit('entity')">{{
                        $t('in.add')
                    }}</a-button>
                </template>
                <template #extra v-else-if="detail.type == TYPE.OUT">
                    <!-- 有实例出库 选择实例 -->
                    <EntitySelect
                        btnType="link"
                        :btnText="$t('v.add')"
                        v-if="detail.status === STATUS.INIT && !addMode"
                        :sourceId="detail.type == TYPE.IN ? detail.source_id : 0"
                        :sourceType="detail.type == TYPE.IN ? detail.source_type : 0"
                        :warehouseId="detail.warehouse_id"
                        :disabledChecked="disabledChecked"
                        @select="handleAddEntityChange"
                    />
                </template>
                <div class="panel-content">
                    <div class="table-container">
                        <a-table
                            :columns="entityTableColumns"
                            :data-source="addMode ? addData : tableData"
                            :scroll="{ x: true }"
                            :row-key="record => record.id"
                            :pagination="false"
                        >
                            <template #bodyCell="{ column, text, record, index }">
                                <template v-if="column.key === 'tip_item'">
                                    <a-tooltip placement="top" :title="text">
                                        <div class="ell" style="max-width: 160px">
                                            <a-button type="link" @click="routerChange('item', record)">{{
                                                text || '-'
                                            }}</a-button>
                                        </div>
                                    </a-tooltip>
                                </template>
                                <template v-if="column.dataIndex === 'amount'">
                                    <template v-if="addMode || record.editMode">
                                        <a-input-number
                                            v-model:value="record.amount"
                                            placeholder="请输入"
                                            :min="1"
                                            :max="detail.type === TYPE.IN ? 9999 : record.item.stock"
                                            :precision="0"
                                        />
                                        {{ $t('i.pcs2') }}
                                    </template>
                                    <template v-else>{{ text ? text + '件' : '-' }}</template>
                                </template>
                                <template v-if="column.key === 'entity_uid'">
                                    <template v-if="addMode || record.editMode">
                                        <a-input
                                            v-model:value="record.entity_uid"
                                            style="width: 200px"
                                            :placeholder="$t('def.input')"
                                            @blur="handleVehicleBlur(record)"
                                        >
                                            <template #suffix v-if="!$auth('ADMIN')">
                                                <span v-if="record.entity_id"><i class="icon suffix i_confirm" /></span>
                                                <span v-else-if="record.entity_no_exist"
                                                    ><i class="icon suffix i_close_c"
                                                /></span>
                                            </template>
                                        </a-input>
                                    </template>
                                    <template v-else>{{ text }}</template>
                                </template>
                                <template v-if="column.key === 'attr_list'">
                                    <a-tooltip placement="top" :title="$Util.itemSpecFilter(text)">
                                        <div class="ell" style="max-width: 120px">
                                            {{ $Util.itemSpecFilter(text) }}
                                        </div>
                                    </a-tooltip>
                                </template>
                                <template v-if="column.key === 'item'">
                                    {{ text || '-' }}
                                </template>
                                <template v-if="column.key === 'count'">
                                    {{ text ? text + '件' : '-' }}
                                </template>
                                <template v-if="column.key === 'operation'">
                                    <template v-if="!this.addMode">
                                        <a-button type="link" @click="handleRemoveRow(record)" class="danger"
                                            ><i class="icon i_delete" />{{ $t('def.remove') }}</a-button
                                        >
                                    </template>
                                    <a-button type="link" v-if="this.addMode" @click="handleCopyEntity(index, record)"
                                        ><i class="icon i_copy" />{{ $t('in.copy') }}</a-button
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
            <!-- 物料 -->
            <a-collapse-panel
                key="ItemList"
                header="物料信息"
                class="gray-collapse-panel"
                collapsible="disabled"
                v-if="detail.target_type === COMMODITY_TYPE.MATERIALS"
            >
                <template #extra v-if="$auth('invoice.save')">
                    <MaterialSelect
                        btnType="link"
                        btnText="添加物料"
                        v-if="detail.status === STATUS.INIT && !addMode"
                        :sourceId="detail.type == TYPE.IN ? detail.source_id : 0"
                        :sourceType="detail.type == TYPE.IN ? detail.source_type : 0"
                        :warehouseId="detail.type == TYPE.OUT ? detail.warehouse_id : 0"
                        :disabledChecked="disabledChecked"
                        @select="handleAddChange"
                    />
                    <a-button type="link" class="extra-btn" v-if="addMode" @click.stop="handleAddSubmit('material')">{{
                        $t('in.add')
                    }}</a-button>
                </template>
                <div class="panel-content">
                    <div class="table-container no-mg">
                        <a-table
                            :columns="materialTableColumns"
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
                                <template v-if="column.key === 'tip_item'">
                                    <a-tooltip placement="top" :title="text">
                                        <div class="ell" style="max-width: 120px">
                                            <a-button type="link" @click="routerChange('material', record)">{{
                                                text || '-'
                                            }}</a-button>
                                        </div>
                                    </a-tooltip>
                                </template>
                                <template v-if="column.key === 'item'">
                                    {{ text || '-' }}
                                </template>
                                <template v-if="column.key === 'spec'">
                                    <a-tooltip placement="top" :title="text">
                                        <div class="ell" style="max-width: 120px">
                                            {{ text || '-' }}
                                        </div>
                                    </a-tooltip>
                                </template>
                                <template v-if="column.key === 'price'">
                                    <template v-if="addMode">
                                        ￥ {{ $Util.countFilter(record.supplier_map[record.supplier_id]) || '0' }}
                                    </template>
                                    <template v-else>￥{{ $Util.countFilter(text) || '0' }}</template>
                                </template>
                                <template v-if="column.key === 'total_price'">
                                    <template v-if="addMode">
                                        ￥{{
                                            $Util.countFilter(record.supplier_map[record.supplier_id] * record.amount)
                                        }}
                                    </template>
                                    <template v-else>￥{{ $Util.countFilter(record.price * record.amount) }}</template>
                                </template>
                                <template v-if="column.key === 'count'">
                                    {{ text ? text + '件' : '-' }}
                                </template>
                                <template v-if="column.key === 'amount'">
                                    <template v-if="addMode || record.editMode">
                                        <a-input-number
                                            v-model:value="record.amount"
                                            placeholder="请输入"
                                            :min="1"
                                            :max="detail.type === TYPE.IN ? 99999 : record.material.stock"
                                            :precision="0"
                                        />
                                        件
                                    </template>
                                    <template v-else>{{ text ? text + '件' : '-' }}</template>
                                </template>

                                <template v-if="column.key === 'operation'">
                                    <a-button type="link" @click="handleRowChange(record)" v-if="!record.editMode"
                                        ><i class="icon i_edit" />更改数量</a-button
                                    >
                                    <a-button type="link" @click="handleRowSubmit(record, 'material')" v-else
                                        ><i class="icon i_confirm" />确认更改</a-button
                                    >
                                    <a-button type="link" @click="handleRemoveRow(record)" class="danger"
                                        ><i class="icon i_delete" />{{ $t('def.remove') }}</a-button
                                    >
                                </template>
                            </template>
                        </a-table>
                    </div>
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
    </div>
</template>

<script>
import Core from '../../core';
import ItemSelect from '../../components/popup-btn/ItemSelect.vue';
import EntitySelect from '../../components/popup-btn/EntitySelect.vue';
import MaterialSelect from '../../components/popup-btn/MaterialSelect.vue';
import AuditMaterialPurchase from '../../components/popup-btn/AuditHandle.vue';
import data from '../../core/data';

const STOCK_RECORD = Core.Const.STOCK_RECORD;

const TYPE = STOCK_RECORD.TYPE;
const STATUS = STOCK_RECORD.STATUS;
const SOURCE_TYPE = STOCK_RECORD.SOURCE_TYPE;
const COMMODITY_TYPE = STOCK_RECORD.COMMODITY_TYPE;

export default {
    name: 'InvoiceDetail',
    components: {
        ItemSelect,
        EntitySelect,
        MaterialSelect,
        AuditMaterialPurchase,
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
            supplierName: [],
            tableData: [],
            addMode: false,
            addData: [],
            supplier_id: undefined,
            production: {
                addVisible: false,
                addCount: '',
                maxCount: '',
                addItem: {},
            },
            exportDisabled: false,
            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + '/admin/1/item/import',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                },
            },
        };
    },
    watch: {},
    computed: {
        type_ch() {
            return this.detail.type == TYPE.IN ? this.$t('in.inbound') : this.$t('in.outbound');
        },
        disabledChecked() {
            let list = [];
            console.log('disabledChecked.list', list);
            this.tableData.forEach(item => {
                if (item.item && item.item.id) {
                    list.push(item.item.id);
                } else if (item.material && item.material.id) {
                    list.push(item.material.id);
                }
            });
            return list;
        },
        itemTableColumns() {
            // 无实例商品的 出入库
            let columns = [
                { title: this.$t('n.name'), dataIndex: ['item', 'name'], key: 'tip_item' },
                { title: this.type_ch + this.$t('i.amount'), dataIndex: 'amount', key: 'amount' },
                { title: this.$t('i.number'), dataIndex: ['item', 'model'], key: 'item' },
                { title: this.$t('i.code'), dataIndex: ['item', 'code'], key: 'item' },
                { title: this.$t('i.spec'), dataIndex: ['item', 'attr_list'], key: 'attr_list' },
                { title: this.$t('def.operate'), key: 'operation' },
            ];
            if (this.detail.status !== STATUS.INIT || this.addMode) {
                columns.pop();
            }
            if (this.detail.type == TYPE.OUT) {
                columns.splice(2, 0, { title: '库存数量', dataIndex: ['item', 'stock'], key: 'count' });
            }
            return columns;
        },
        entityTableColumns() {
            let columns = [
                { title: this.$t('n.name'), dataIndex: ['item', 'name'], key: 'tip_item' },
                // {title: this.type_ch + '数量', dataIndex: 'amount'},
                { title: this.$t('i.instance'), dataIndex: 'entity_uid', key: 'entity_uid' },
                { title: this.$t('i.number'), dataIndex: ['item', 'model'], key: 'item' },
                { title: this.$t('i.code'), dataIndex: ['item', 'code'], key: 'item' },
                { title: this.$t('i.spec'), dataIndex: ['item', 'attr_list'], key: 'attr_list' },
                { title: this.$t('def.operate'), key: 'operation' },
            ];
            if (this.detail.status !== STATUS.INIT || this.isProd) {
                // 入库不显示库存数量
                columns.pop();
            }
            return columns;
        },
        materialTableColumns() {
            //物料 出入库
            let columns = [
                { title: '供应商', dataIndex: 'supplier' },
                { title: '物料名称', dataIndex: ['material', 'name'], key: 'tip_item' },
                { title: '物料分类', dataIndex: ['material', 'category', 'name'], key: 'item' },
                { title: '物料编码', dataIndex: ['material', 'code'], key: 'item' },
                { title: '物料规格', dataIndex: ['material', 'spec'], key: 'spec' },
                { title: '单位', dataIndex: ['material', 'unit'], key: 'item' },
                { title: '单价', dataIndex: 'price', key: 'price' },
                { title: this.type_ch + '数量', dataIndex: 'amount', key: 'amount' },
                { title: '总价', key: 'total_price' },
                { title: '操作', key: 'operation' },
            ];
            if (this.detail.status !== STATUS.INIT || this.addMode) {
                columns.pop();
            }
            if (this.detail.type == TYPE.OUT) {
                columns.splice(2, 0, { title: '库存数量', dataIndex: ['material', 'stock'], key: 'count' });
            }
            return columns;
        },
        isProd() {
            let d = this.detail;
            if (d.source_type == SOURCE_TYPE.PRODUCTION && d.type == TYPE.IN) {
                return true;
            }
            return false;
        },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0;
        this.getInvoiceDetail();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'list':
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'edit':
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-edit',
                        query: { id: this.detail.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'warehouse':
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/warehouse-detail',
                        query: { id: this.detail.warehouse_id },
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
                        query: { id: item.target_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'source':
                    let path = '';
                    switch (this.detail.source_type) {
                        case SOURCE_TYPE.PRODUCTION:
                            path = '/production/manufacture-order-detail';
                            break;
                        case SOURCE_TYPE.PURCHASE:
                            path = '/distributor/purchase-order-detail';
                            break;
                        case SOURCE_TYPE.AFTER_SALES:
                            path = '/aftersales/aftersales-detail';
                            break;
                        case SOURCE_TYPE.TRANSFER:
                            path = '/warehouse/transfer-order-detail';
                            break;
                        case SOURCE_TYPE.REPAIR:
                            path = '/repair/repair-detail';
                            break;
                        case SOURCE_TYPE.MATERIAL_PURCHASE:
                            path = '/production/material-purchase-detail';
                            break;
                    }
                    routeUrl = this.$router.resolve({
                        path,
                        query: { id: this.detail.source_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        // 获取出入库单详情
        getInvoiceDetail() {
            this.loading = true;
            Core.Api.Invoice.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getInvoiceDetail res', res);
                    let d = res.detail || {};
                    this.detail = d;
                    this.warehouse = d.warehouse || {};
                    this.getInvoiceList();
                })
                .catch(err => {
                    console.log('getInvoiceDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取出入库单商品列表
        getInvoiceList() {
            this.loading = true;
            Core.Api.InvoiceItem.list({
                invoice_id: this.id,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getInvoiceList res', res);
                    let list = res.list;
                    if (this.detail.target_type === COMMODITY_TYPE.ENTITY) {
                        list.forEach(item => {
                            item.item = item.entity ? item.entity.item || {} : {};
                            item.entity_id = item.target_id;
                            item.entity_uid = item.entity ? item.entity.uid : '';
                        });
                    }
                    this.total = res.count;
                    this.tableData = list;
                    console.log('this.tableData', this.tableData);
                    if (this.isProd) {
                        this.getProductionItem();
                    }
                    if (this.detail.target_type === 30) {
                        this.getSupplierName();
                    }
                })
                .catch(err => {
                    console.log('getInvoiceList err', err);
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
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getInvoiceList();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            this.pageSize = size;
            this.getInvoiceList();
        },

        // 获取生产单对应商品
        getProductionItem() {
            Core.Api.ProductionOrder.detail({
                id: this.detail.source_id,
            }).then(res => {
                console.log('getProductionItem res:', res);
                let d = res.detail || {};
                this.production.addItem = d.item;
                let maxCount = d.amount - d.in_warehouse_count;
                if (this.detail.target_type == COMMODITY_TYPE.ENTITY) {
                    maxCount = maxCount - this.total;
                }
                this.production.addCount = maxCount;
                this.production.maxCount = maxCount;
                console.log('this.production:', this.production);
            });
        },

        // 取消 出入库单
        handleCancel() {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_cancel'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Invoice.cancel({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.canceled'));
                            _this.routerChange('list');
                        })
                        .catch(err => {
                            console.log('handleCancel err', err);
                        });
                },
            });
        },
        // 提交出入库单
        handleSubmit() {
            if (!this.tableData.length) {
                return this.$message.warning(this.$t('def.enter'));
            }
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_audit'),
                okText: _this.$t('def.sure'),
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Invoice.submit({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.operate'));
                            _this.getInvoiceDetail();
                        })
                        .catch(err => {
                            console.log('handleComplete err', err);
                        });
                },
            });
        },

        // 处理完成 出入库单
        handleComplete() {
            if (!this.tableData.length) {
                return this.$message.warning(this.$t('def.enter'));
            }
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_audit'),
                okText: _this.$t('def.sure'),
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Invoice.handle({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.operate'));
                            _this.getInvoiceDetail();
                        })
                        .catch(err => {
                            console.log('handleComplete err', err);
                        });
                },
            });
        },

        // {{ $t('def.remove') }} 商品
        handleRemoveRow(record) {
            Core.Api.InvoiceItem.delete({ id: record.id }).then(() => {
                this.$message.success(this.$t('pop_up.remove_a'));
                this.getInvoiceList();
            });
        },
        // 批量添加 商品
        handleAddChange(ids, items) {
            console.log('handleAddChange items:', items);
            let list = items.map(item => {
                let supplier_list = item.supplier_list.map(i => ({
                    id: i.id,
                    name: i.name,
                    price: i.price,
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
            console.log('list', list);
            this.addData = list;
            this.addMode = true;
            for (let item of list) {
                item.supplier_map = {};
                for (let supplier of item.supplier_list) {
                    item.supplier_map[supplier.id] = supplier.price;
                    console.log('getMaterialList', supplier.price);
                }
            }
        },
        handleAddItemChange(ids, items) {
            console.log('handleAddChange items:', items);
            let list = items.map(item => ({
                id: 0,
                item: item,
                amount: 1,
                entity_uid: '',
            }));
            this.addData = list;
            this.addMode = true;
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
                            return this.$message.warning(this.$t('in.warn_a'));
                        }
                        break;
                    case 'entity':
                        if (!item.entity_uid) {
                            return this.$message.warning(this.$t('def.enter'));
                        } else {
                            target_id = item.entity_id;
                            target_uid = item.entity_uid;
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
                    invoice_id: this.id,
                    target_id,
                    target_uid,
                    supplier_id,
                    price,
                });
            }
            console.log('handleAddSubmit list:', list);
            Core.Api.InvoiceItem.saveList(list)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.getInvoiceDetail();
                    this.addMode = false;
                })
                .catch(err => {
                    console.log('handleAddSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 编辑单个 无实例商品
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
                case 'entity':
                    target_id = item.entity_id;
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
                invoice_id: this.id,
                price,
            };
            if (!target.target_id) {
                return this.$message.warning(`${type === 'item' ? this.$t('i.item') : '商品实例'}` + this.$t('in.no'));
            }
            Core.Api.InvoiceItem.save(target).then(() => {
                this.$message.success(this.$t('pop_up.save_success'));
                this.getInvoiceDetail();
            });
        },

        handleVehicleBlur(record) {
            // 获取 车架号ID
            // HW1000T-1B00B30001
            console.log('handleVehicleBlur:', record);
            if (!record.entity_uid) {
                return;
            }
            Core.Api.Entity.detailByUid({
                item_id: record.item.id,
                uid: record.entity_uid,
            })
                .then(res => {
                    console.log('handleVehicleBlur res:', res);
                    if (Core.Util.isEmptyObj(res.detail)) {
                        if (!this.$auth('ADMIN')) {
                            this.$message.warning(this.$t('in.warn'));
                        }
                        record.entity_id = 0;
                        record.entity_no_exist = 1;
                    } else {
                        record.entity_id = res.detail.id;
                        record.entity_no_exist = 0;
                    }
                })
                .catch(err => {
                    console.log('handleVehicleBlur err', err);
                })
                .finally(() => {});
        },

        handleCopyEntity(index, record) {
            this.addData.splice(index, 0, {
                id: 0,
                item: record.item,
                amount: 1,
                entity_uid: '',
            });
        },

        handleAddEntityChange(ids, items) {
            console.log('handleAddEntityChange items:', items);
            let list = items.map(item => {
                console.log('item:', item);
                return {
                    id: 0,
                    amount: 1,
                    invoice_id: this.id,
                    target_id: item.id,
                    target_uid: item.uid,
                };
            });
            Core.Api.InvoiceItem.saveList(list)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.getInvoiceDetail();
                    this.addMode = false;
                })
                .catch(err => {
                    console.log('handleAddSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handleProdAddChange() {
            let list;
            if (this.detail.target_type == COMMODITY_TYPE.ENTITY) {
                list = new Array(this.production.addCount).fill({});
                list = list.map(item => ({
                    id: 0,
                    item: this.production.addItem,
                    amount: 1,
                    entity_uid: '',
                }));
            } else if (this.detail.target_type == COMMODITY_TYPE.ITEM) {
                list = [
                    {
                        id: 0,
                        item: this.production.addItem,
                        amount: this.production.addCount,
                    },
                ];
            }
            this.production.addVisible = false;
            this.addData = list;
            this.addMode = true;
        },
        handleProdAddCancel() {
            this.production.addVisible = false;
            // this.getProductionItem()
        },
        handleExportOut() {
            // 确认入库单是否导出
            let _this = this;
            this.$confirm({
                title: '确认要导出吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    _this.handleInvoiceExportOut();
                },
            });
        },
        handleInvoiceExportOut() {
            // 订单导出
            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.invoiceOutExport({
                invoice_id: this.id,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            console.log('handleRepairExport _exportUrl', exportUrl);
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },
        handleExportIn() {
            // 确认库单是否导出
            let _this = this;
            this.$confirm({
                title: '确认要导出吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    _this.handleInvoiceExportIn();
                },
            });
        },
        handleInvoiceExportIn() {
            // 订单导出
            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.invoiceInExport({
                invoice_id: this.id,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            console.log('handleRepairExport _exportUrl', exportUrl);
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },
    },
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
    .ant-input,
    .ant-input-number {
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
