<template>
    <div class="DeliveryLogs">
        <div class="panel-content table-container no-mg">
            <a-table
                :columns="invoicColumns"
                :data-source="invoiceList"
                :scroll="{ x: true }"
                :row-key="record => record.id"
                :pagination="channelPagination"
                @change="handleTableChange"
            >
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'org'">
                        {{ $Util.userTypeFilter(text.org_type, $i18n.locale) }}·{{ text.org_name }}
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        {{ $Util.invoiceStatusFilter(text, $i18n.locale) }}
                    </template>
                    <template v-if="column.key === 'uid'">
                        <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }} </a-button>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'receive_type'">
                        {{ $Util.purchaseWaybillFilter(detail.receive_type, $i18n.locale || '-') }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <!-- 物流信息 -->
                        <a-button type="link" @click="handleWaybillShow(record.id)">{{ $t('p.logistics') }} </a-button>
                        <template
                            v-if="
                                $auth('ADMIN') &&
                                type == Core.Const.STOCK_RECORD.TYPE.OUT &&
                                detail.type == Core.Const.PURCHASE.TYPE.PRE_SALES
                            "
                        >
                            <a-button type="link" @click="handleExportIn(record.id)"
                                ><i class="icon i_download" />{{ $t('p.export_purchase') }}
                            </a-button>
                            <a-button type="link" @click="handleUpdatePI(record)">{{ $t('p.update_PI') }} </a-button>
                        </template>
                        <template v-if="authOrg(detail.supply_org_id, detail.supply_org_type)">
                            <a-button
                                type="link"
                                v-if="
                                    type === Core.Const.STOCK_RECORD.TYPE.OUT &&
                                    record.status === Core.Const.STOCK_RECORD.STATUS.CLOSE
                                "
                                @click="handleDeliverShow(record)"
                                >{{ $t('p.confirm_delivery') }}
                            </a-button>
                            <!-- <a-button type='link'
                                @click="handleDeliverShow(record)">{{ $t('p.confirm_delivery') }}
                            </a-button> -->
                        </template>
                        <template v-if="authOrg(detail.org_id, detail.org_type)">
                            <!-- 确认收货 -->
                            <a-button
                                type="link"
                                v-if="
                                    type === Core.Const.STOCK_RECORD.TYPE.OUT &&
                                    record.status === Core.Const.STOCK_RECORD.STATUS.DELIVERY
                                "
                                @click="handleTakeDeliverShow(record.id)"
                            >
                                {{ $t('p.confirm_the_take_delivery') }}
                            </a-button>
                            <!-- 收货明细 -->
                            <a-button
                                type="link"
                                v-if="type === Core.Const.STOCK_RECORD.TYPE.OUT && displayIn"
                                @click="handleModalShow(record.id)"
                                >{{ $t('p.take_delivery_detail') }}
                            </a-button>
                        </template>
                    </template>
                </template>
            </a-table>
        </div>
        <!-- 收货明细弹框 -->
        <a-modal v-model:visible="modalShow" :title="$t('p.take_delivery_detail')" width="860px">
            <div class="modal-content">
                <div class="table-container">
                    <ItemTable
                        :columns="tableColumns"
                        :data-source="tableData"
                        :loading="modalLoading"
                        v-if="modalShow"
                    />
                </div>
            </div>
            <template #footer>
                <div class="modal-footer">
                    <div class="paging-area">
                        <a-pagination
                            v-if="!purchaseId"
                            show-less-items
                            :hide-on-single-page="false"
                            :total="total"
                            :current="currPage"
                            :default-page-size="pageSize"
                            @change="pageChange"
                        />
                    </div>
                    <div class="btn-area">
                        <a-button type="primary" @click="modalShow = false">{{ $t('def.sure') }}</a-button>
                    </div>
                </div>
            </template>
        </a-modal>
        <!-- 物流信息弹框 -->
        <a-modal v-model:visible="waybillShow" :title="$t('n.delivery_logs')" width="860px">
            <div class="modal-content">
                <!-- <div class="info-item" v-if="detail.org_type === USER_TYPE.AGENT || detail.org_type === USER_TYPE.STORE">
                    <div class="key">{{ $t('p.delivery_method') }}</div>
                    {{ logisticsInfoDetail.express_type }}
                </div> -->
                <!-- 发货方式 -->
                <div class="info-item" v-if="detail.org_type === USER_TYPE.DISTRIBUTOR">
                    <div class="key">{{ $t('p.delivery_method') }}</div>
                    <div class="value">
                        {{ $Util.purchaseDeliveryMethodFilter(logisticsInfoDetail?.express_type, $i18n.locale) || '-' }}
                    </div>
                </div>
                <!-- 发货港口 -->
                <div class="info-item" v-if="detail.org_type === USER_TYPE.DISTRIBUTOR">
                    <div class="key">{{ $t('p.shipping_port') }}</div>
                    <div class="value">
                        {{ ($i18n.locale === 'zh' ? logisticsInfoDetail?.port : logisticsInfoDetail?.port_en) || '-' }}
                    </div>
                </div>
                <!-- 发货仓库 -->
                <div class="info-item" v-if="detail.org_type === USER_TYPE.DISTRIBUTOR">
                    <div class="key">{{ $t('p.delivery_warehouse') }}</div>
                    <div class="value">{{ logisticsHouse || '-' }}</div>
                </div>
                <!-- 发货时间 -->
                <div class="info-item" v-if="detail.org_type === USER_TYPE.DISTRIBUTOR">
                    <div class="key">{{ $t('p.delivery_time') }}</div>
                    <div class="value">{{ $Util.timeFilter(logisticsInfoDetail?.delivery_time) || '-' }}</div>
                </div>
                <!-- 提单号 -->
                <div class="info-item" v-if="detail.org_type === USER_TYPE.DISTRIBUTOR">
                    <div class="key">{{ $t('p.lading_bill_no') }}</div>
                    <div class="value">{{ logisticsInfoDetail?.lading_bill_no || '-' }}</div>
                </div>
                <!-- 备注信息 -->
                <div class="info-item" v-if="detail.org_type === USER_TYPE.DISTRIBUTOR">
                    <div class="key">{{ $t('p.remark') }}</div>
                    <div class="value">{{ logisticsInfoDetail?.remark || '-' }}</div>
                </div>
                <!-- 费用 -->
                <div class="info-item">
                    <div class="key">{{ $t('d.cost') }}</div>
                    <div class="value">
                        {{ detail.currency === 'EUR' ? '€' : '$' }} {{ logisticsInfoDetail?.post_fee / 100.0 || '-' }}
                    </div>
                </div>
                <!-- 发货单号 -->
                <div class="info-item" v-if="detail.waybill">
                    <div class="key">{{ $t('p.shipment_number') }}</div>
                    <div class="value">{{ logisticsInfoDetail.waybill || '-' }}</div>
                </div>
            </div>
            <template #footer>
                <div class="btn-area">
                    <a-button type="primary" @click="waybillShow = false">{{ $t('def.sure') }}</a-button>
                </div>
            </template>
        </a-modal>
        <!-- 确认收货弹框 -->
        <a-modal v-model:visible="takeDeliverShow" :title="$t('p.confirm_the_goods')" @ok="handleTakeDeliver">
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">{{ $t('wa.warehouse') }}：</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.warehouse_id"
                            :placeholder="$t('def.select')"
                            :disabled="!!isProd"
                        >
                            <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
            </div>
        </a-modal>
        <!-- 确认发货弹框 -->
        <a-modal v-model:visible="deliverShow" :title="$t('p.shipping_confirmation')" @ok="handleDeliver">
            <div class="modal-content">
                <!-- 平台方 -->
                <template v-if="$auth('ADMIN')">
                    <!-- 发货方式 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('p.delivery_method') }}</div>
                        <div class="value">
                            <a-select v-model:value="express_type" :placeholder="$t('def.select')">
                                <a-select-option v-for="item of courierTypeList" :key="item.value" :value="item.value"
                                    >{{ item[$i18n.locale] }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <!-- 发货港口 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('p.shipping_port') }}:</div>
                        <div class="value">
                            <a-select v-model:value="port" :placeholder="$t('def.select')" @change="handleSelectPort">
                                <a-select-option
                                    v-for="portItem of portTypeList"
                                    :key="portItem.value"
                                    :value="portItem[$i18n.locale]"
                                    >{{ portItem[$i18n.locale] }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <!-- 发货仓库 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('p.delivery_warehouse') }}:</div>
                        <div class="value">
                            <!-- <a-select v-model:value="warehouse_id" :placeholder="$t('def.select')">
                                <a-select-option v-for="item of warehouseOptions" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select> -->
                            {{ warehouseName || '-' }}
                        </div>
                    </div>
                    <!-- 发货地址 -->
                    <!-- <div class="form-item required">
                        <div class="key">{{ $t('p.delivery_address') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.delivery_address" :placeholder="$t('def.input')" />
                        </div>
                    </div> -->
                    <!-- 发货时间 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('wb.delivery_time') }}:</div>
                        <div class="value">
                            <a-date-picker
                                v-model:value="form.delivery_time"
                                valueFormat="YYYY-MM-DD"
                                :show-time="defaultTime"
                                :placeholder="$t('wb.choose_delivery_time')"
                                format="YYYY/MM/DD"
                            >
                                <template #suffixIcon><i class="icon i_calendar" /></template>
                            </a-date-picker>
                        </div>
                    </div>
                </template>
                <!-- 分销商 -->
                <template v-if="$auth('DISTRIBUTOR')">
                    <div class="form-item required">
                        <div class="key">{{ $t('p.ship') }}</div>
                        <div class="value">
                            <a-select v-model:value="form.receive_type" :placeholder="$t('def.select')">
                                <a-select-option
                                    v-for="receive of receiveTypeList"
                                    :key="receive.value"
                                    :value="receive.value"
                                    >{{ receive.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">{{ $t('p.sn_number') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.waybill_uid" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </template>
                <!-- 运费 -->
                <!-- 这里的权限判断暂时去掉 -->
                <!-- <div class="form-item required" v-if="detail.type === PURCHASE.TYPE.PRE_SALES"> -->
                <div class="form-item required">
                    <div class="key">{{ $t('p.freight') }}:</div>
                    <div class="value">
                        <a-input-number
                            v-model:value="form.freight"
                            placeholder="0.00"
                            style="width: 120px"
                            :min="0.0"
                            :precision="2"
                            :prefix="`${$Util.priceUnitFilter(detail.currency)}`"
                        />
                    </div>
                </div>
                <!-- 提单号 -->
                <div class="form-item required">
                    <div class="key">{{ $t('wb.lading_bill_no') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.lading_bill_no" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <!-- 备注 -->
                <div class="form-item">
                    <div class="key">{{ $t('p.remark') }}:</div>
                    <div class="value">
                        <a-textarea
                            :rows="4"
                            v-model:value="form.remark"
                            :placeholder="$t('def.input')"
                            :maxlength="500"
                            showCount
                        />
                    </div>
                </div>
            </div>
        </a-modal>
        <!-- 修改PI -->
        <a-modal v-model:visible="PIShow" :title="$t('p.update_PI')" @ok="UpdatePI">
            <div class="modal-content">
                <template v-if="$auth('ADMIN')">
                    <div class="form-item required">
                        <div class="key">{{ $t('p.shipping_port') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.port" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">{{ $t('p.delivery_address') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.delivery_address" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </template>
                <div class="form-item">
                    <div class="key">{{ $t('d.cost') }}</div>
                    <div class="value">
                        <a-input-number
                            v-model:value="form.freight"
                            placeholder="0.00"
                            style="width: 120px"
                            :min="0.0"
                            :precision="2"
                            :prefix="`${$Util.priceUnitFilter(detail.currency)}`"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('p.remark') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.remark" :placeholder="$t('def.input')" />
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../../core';

const USER_TYPE = Core.Const.USER.TYPE;
const WAYBILL = Core.Const.WAYBILL;
const PURCHASE = Core.Const.PURCHASE;

import ItemTable from '@/components/table/ItemTable.vue';
import dayjs from 'dayjs';
import $Util from '../../../core/utils';

export default {
    name: 'DeliveryLogs',
    components: {
        ItemTable,
    },
    props: {
        orderId: { type: Number },
        detail: {
            type: Object,
        },
        type: {
            type: Number,
        },
        displayIn: {
            type: Boolean,
        },
    },
    data() {
        return {
            Core,
            USER_TYPE,
            PURCHASE,
            // 加载
            loading: false,
            activeKey: [],
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            invoiceList: [],
            loginType: Core.Data.getLoginType(),
            loginOrgId: Core.Data.getOrgId(),
            loginOrgType: Core.Data.getOrgType(),
            courierTypeList: WAYBILL.COURIER_LIST,
            portTypeList: WAYBILL.PORT_LIST,
            receiveTypeList: WAYBILL.RECEIPT_LIST,
            deliverShow: false,
            form: {
                waybill: '', // 物流单号
                delivery_address: '', //发货地址
                receive_type: undefined, // 收货方式
                freight: undefined, // 运费
                pay_method: undefined, // 收款方式
                // pay_clause: undefined, // 支付条款
                remark: '', // 备注
                company_uid: undefined,
                waybill_uid: '', // 快递单号
                target_type: '',
                payment: '', // 收款金额
                entry_bill_no: '',
                lading_bill_no: '',
                delivery_time: '', //发货时间
            },
            express_type: 3, // 发货方式
            warehouse_id: undefined,
            port: undefined, // 发货港口
            waybillDetail: {},
            logisticsInfoDetail: {},
            logisticsHouse: undefined, // 物流明细发货仓库
            takeDeliverShow: false,
            waybillShow: false,
            modalShow: false,
            modalLoading: false,
            invoiceId: '',
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            tableData: [],
            warehouseList: [],
            PIShow: false,
            uid: '',

            channelPagination: {
                current: 1,
                pageSizeOptions: ['20', '40', '60', '80', '100'],
                pageSize: 20,
                showQuickJumper: true, // 是否可以快速跳转至某页
                showSizeChanger: true, // 是否可以改变 pageSize
                total: 0,
                showTotal: total => `${this.$t('n.all_total')} ${total} ${this.$t('in.total')}`,
            }, // 分页数据
            warehouseOptions: [], // 发货仓库列表
            port: undefined, // 港口中文
            port_en: undefined, // 港口英文
            warehouseName: undefined, // 发货仓库
        };
    },
    computed: {
        invoicColumns() {
            let columns = [
                { title: this.$t('in.sn'), dataIndex: 'uid', key: 'uid' },
                { title: this.$t('n.state'), dataIndex: 'status' },
            ];
            if (this.type == Core.Const.STOCK_RECORD.TYPE.OUT) {
                columns.push(
                    { title: this.$t('p.delivery_method'), dataIndex: 'receive_type', key: 'receive_type' },
                    { title: this.$t('p.shipping_port'), dataIndex: 'port' },
                    { title: this.$t('n.operator'), dataIndex: ['apply_user', 'account', 'name'], key: 'item' },
                    { title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time' },
                    { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
                );
            } else {
                columns.push(
                    { title: this.$t('p.delivery_method'), dataIndex: 'receive_type', key: 'receive_type' },
                    { title: this.$t('p.shipping_port'), dataIndex: 'port' },
                    { title: this.$t('n.operator'), dataIndex: ['apply_user', 'account', 'name'], key: 'item' },
                    { title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time' },
                    { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
                );
            }
            return columns;
        },
        tableColumns() {
            let columns = [
                { title: this.$t('n.name'), dataIndex: 'item_name', key: 'name' },
                { title: this.$t('i.code'), dataIndex: 'item_code', key: 'item' },
                { title: this.$t('i.deliver_amount'), dataIndex: 'amount', key: 'count' },
            ];
            return columns;
        },
    },
    mounted() {
        this.getInvoiceList();
        this.getWarehouseList();
        this.handleWarehouseSearch();
        console.log('detail', this.detail.currency);
    },
    methods: {
        /*== FETCH start==*/
        // 仓库列表Fetch
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list;
            });
        },
        /*== FETCH end==*/
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        authOrg(orgId, orgType) {
            // console.log('org', this.loginOrgId === orgId && this.loginOrgType === orgType)
            if (this.loginOrgId === orgId && this.loginOrgType === orgType) {
                return true;
            } else {
                return false;
            }
        },
        getInvoiceList(params = {}) {
            // 获取 发货记录
            this.loading = true;
            // console.log("getInvoiceList type", this.type)
            Core.Api.Invoice.listByPurchase({
                source_id: this.orderId,
                source_type: Core.Const.STOCK_RECORD.SOURCE_TYPE.PURCHASE,
                type: this.type,
                status: -1,
                page_size: this.channelPagination.pageSize,
                page: this.channelPagination.current,
                ...params,
            })
                .then(res => {
                    // console.log("getInvoiceList res", this.type, res)
                    this.channelPagination.total = res.count;
                    this.invoiceList = res.list;
                    if (this.invoiceList.length) {
                        this.activeKey = ['DeliveryLogs'];
                    }
                })
                .catch(err => {
                    console.log('getInvoiceList err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取仓库列表
        handleWarehouseSearch() {
            Core.Api.Warehouse.list({
                page_size: 100,
            }).then(res => {
                this.warehouseOptions = res.list;
            });
        },
        handleModalShow(id) {
            this.modalShow = true;
            this.invoiceId = id;
            this.pageChange(1);
        },
        handleDeliverShow(item) {
            this.deliverShow = true;
            this.form = Core.Util.deepCopy(item);
            this.form.freight = Core.Util.countFilter(this.form.freight);
            this.invoiceId = item.id;
            Core.Api.Invoice.detail({
                id: item.id,
            }).then(res => {
                console.log('detail res', res);
                this.warehouseName = res.detail?.warehouse?.name;
            });
        },
        handleTakeDeliverShow(id) {
            this.takeDeliverShow = true;
            this.invoiceId = id;
        },

        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        getTableData(params = {}) {
            this.modalLoading = true;
            Core.Api.InvoiceItem.list({
                invoice_id: this.invoiceId,
                page: this.currPage,
                page_size: this.pageSize,
                ...params,
            })
                .then(res => {
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    // console.log('getTableData err', err)
                })
                .finally(() => {
                    this.modalLoading = false;
                });
        },
        // 确认收货
        handleTakeDeliver() {
            console.log('rowSelection', this.selectedRowItems);
            let form = Core.Util.deepCopy(this.form);
            const param = {
                id: this.orderId,
                invoice_id: this.invoiceId,
                remark: form.remark,
            };
            console.log(this.id);
            let adminRequire = [
                { key: 'warehouse_id', msg: this.$t('e.select_warehouse') },
                // { key: 'target_type', msg: '请选择类型' },
            ];
            for (let index in adminRequire) {
                let key = adminRequire[index].key;
                if (!this.form[key]) {
                    return this.$message.warning(adminRequire[index].msg);
                } else {
                    param[key] = form[key];
                }
            }
            Core.Api.Purchase.takeDeliver(param)
                .then(res => {
                    this.$message.success(this.$t('p.received'));
                    this.takeDeliverShow = false;
                    this.getInvoiceList({ page: 1 });
                    this.$emit('Submit');
                })
                .catch(err => {
                    console.log('handleDeliver err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleWaybillShow(id) {
            this.handleWaybillClear();
            this.target_id = id;
            this.getInvoiceList({ page: 1 });
            this.getWaybillInfo();
            this.waybillShow = true;
            Core.Api.Invoice.detail({
                id: id,
            }).then(res => {
                console.log('detail res', res);
                this.logisticsInfoDetail = res.detail?.waybill;
                this.logisticsHouse = res.detail?.warehouse.name;
                // console.log('this.logisticsInfoDetail', this.logisticsInfoDetail);
            });
        },
        handleWaybillClear() {
            this.form = Core.Util.deepCopy(this.$options.data().form);
            this.waybillShow = false;
        },
        handleSelectPort(value) {
            console.log('handleSelectPort value', value);
            // 根据选中的值查找对应的对象
            const selectedPort = this.portTypeList.find(item => item[this.$i18n.locale] === value);
            // 如果找到了对象，将其 zh 和 en 值分别存储在 port 和 port_en 变量中
            if (selectedPort) {
                this.port = selectedPort.zh;
                this.port_en = selectedPort.en;
            }
        },
        // 确认发货
        handleDeliver() {
            console.log('rowSelection', this.selectedRowItems);
            let form = Core.Util.deepCopy(this.form);
            form.delivery_time = form.delivery_time ? dayjs(form.delivery_time).unix() : 0;
            const param = {
                id: this.orderId,
                invoice_id: this.invoiceId,
                remark: form.remark,
                port: this.port,
                port_en: this.port_en,
                express_type: this.express_type,
                // warehouse_id: this.warehouse_id
            };
            let adminRequire = [];

            if (this.$auth('ADMIN')) {
                adminRequire = [
                    // { key: 'delivery_address', msg: this.$t('p.fill_address') },
                    { key: 'delivery_time', msg: this.$t('wb.delivery_time') },
                    // { key: 'express_type', msg: this.$t('def.enter') },
                    { key: 'lading_bill_no', msg: this.$t('wb.lading_bill_no') },
                    { key: 'freight', msg: this.$t('p.enter_freight') },
                ];
                param['waybill'] = form['waybill'];
            } else if (this.$auth('DISTRIBUTOR')) {
                adminRequire = [
                    { key: 'receive_type', msg: this.$t('p.choose_receive') },
                    { key: 'freight', msg: this.$t('p.enter_freight') },
                ];
                param['waybill_uid'] = form['waybill_uid'];
            }
            for (let index in adminRequire) {
                let key = adminRequire[index].key;
                if (!this.form[key]) {
                    return this.$message.warning(adminRequire[index].msg);
                } else {
                    param[key] = form[key];
                }
            }
            if (!this.port) {
                return this.$message.warning(this.$t('p.enter_harbor'));
            }
            if (!this.express_type) {
                return this.$message.warning(this.$t('def.enter'));
            }
            // if (!this.warehouse_id) {
            //     return this.$message.warning(this.$t('def.enter'))
            // }
            param['freight'] = Math.round(param['freight'] * 100);
            param['item_list'] = this.selectedRowItems;
            console.log('param', param);
            Core.Api.Purchase.deliver(Core.Util.searchFilter(param))
                .then(res => {
                    this.$message.success(this.$t('p.shipped'));
                    this.deliverShow = false;
                    this.getInvoiceList({ page: 1 });
                    this.$emit('Submit');
                    this.handleWaybillClear();
                })
                .catch(err => {
                    console.log('handleDeliver err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 修改PI
        UpdatePI() {
            console.log('rowSelection', this.selectedRowItems);
            let form = Core.Util.deepCopy(this.form);
            const param = {
                id: form.id,
                remark: form.remark,
            };
            let adminRequire = [];

            if (this.$auth('ADMIN')) {
                adminRequire = [
                    { key: 'delivery_address', msg: this.$t('p.fill_address') },
                    { key: 'port', msg: this.$t('p.enter_harbor') },
                    { key: 'freight', msg: this.$t('p.enter_freight') },
                ];
            }
            for (let index in adminRequire) {
                let key = adminRequire[index].key;
                if (!this.form[key]) {
                    return this.$message.warning(adminRequire[index].msg);
                } else {
                    param[key] = form[key];
                }
            }
            param['freight'] = Math.round(param['freight'] * 100);
            Core.Api.Invoice.updatePI(param)
                .then(res => {
                    this.$message.success(this.$t('p.modify_success'));
                    this.PIShow = false;
                    this.getInvoiceList({ page: 1 });
                    this.$emit('Submit');
                    this.handleWaybillClear();
                })
                .catch(err => {
                    console.log('handleDeliver err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getWaybillInfo() {
            // 获取 发货记录
            this.loading = true;
            Core.Api.Waybill.detailByTarget({
                target_id: this.target_id,
                target_type: Core.Const.WAYBILL.TARGET_TYPE.PURCHASE_ORDER,
                type: Core.Const.WAYBILL.TYPE.OUT,
                // source_type: Core.Const.STOCK_RECORD.SOURCE_TYPE.ITEM_PURCHASE,
            })
                .then(res => {
                    console.log('getInvoiceList res', res);
                    this.waybillDetail = res.detail;
                })
                .catch(err => {
                    console.log('getInvoiceList err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 导出订单
        handleExportIn(id) {
            const params = {
                id: id, // 订单id
                currency: '',
                id_type: 1,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            };

            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.purchaseTemplateExport(params);
            console.log('handlePurchaseExport _exportUrl', exportUrl);
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },
        handleUpdatePI(item) {
            this.form = Core.Util.deepCopy(item);
            this.form.freight = Core.Util.countFilter(this.form.freight);
            this.PIShow = true;
        },
        handleWaybillSearch() {
            if (this.form.waybill == null) {
                return;
            }
            Core.Api.Waybill.detailByUidNoException({ uid: this.form.waybill }).then(res => {
                if (res.detail == null) {
                    return;
                }
                this.form = res.detail;
                this.form.waybill = res.detail.uid;
                this.form.delivery_address = res.detail.sender_address;
                this.form.freight = res.detail.post_fee / 100.0;
                this.form.delivery_time = $Util.timeFilter(res.detail.delivery_time);
                this.$message.success('查询到该物流单号已存在，已根据原有物流信息填充表格');
            });
        },

        // 分页事件
        handleTableChange(pagination, filters, sorter) {
            const pager = { ...this.channelPagination };
            pager.current = pagination.current;
            if (pagination.pageSize !== this.channelPagination.pageSize) {
                pager.current = 1;
                pager.pageSize = pagination.pageSize;
            }
            this.channelPagination = pager;
            this.getInvoiceList({
                page_size: this.channelPagination.pageSize,
                page: this.channelPagination.current,
            });
        },
    },
};
</script>

<style lang="less">
.DeliveryLogs {
    .panel-header {
        .fsb();
        margin-bottom: 20px;

        .name {
            font-weight: 500;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.85);
        }

        .ant-btn {
            border-radius: 2px;
        }
    }
}
</style>
