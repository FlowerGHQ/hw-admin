<template>
    <div id="PurchaseList">
        <div class="list-container" ref="container">
            <div class="title-container">
                <div class="title-area">{{ $t('p.list') }}</div>
            </div>
            <div class="tabs-container colorful" v-if="!purchaseMode">
                <a-tabs v-model:activeKey="searchForm.status" @change="handleSearch">
                    <a-tab-pane :key="item.key" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">
                                {{ item[$i18n.locale] }}<span :class="item.color">{{ item.value }}</span>
                            </div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('p.number') }}:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.sn"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">{{ $t('n.distributor') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.distributor_id"
                                :placeholder="$t('def.select')"
                                show-search
                                :options="distributorList"
                                option-filter-prop="label"
                                :filter-option="onFilterOption"
                                @change="handleSearch"
                            >
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="$auth('ADMIN', 'DISTRIBUTOR')">
                        <div class="key">{{ $t('n.agent') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.agent_id"
                                @change="handleSearch"
                                :placeholder="$t('def.select')"
                            >
                                <a-select-option v-for="(item, index) of agentList" :key="index" :value="item.id">{{
                                    item.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('n.store') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.store_id"
                                @change="handleSearch"
                                :placeholder="$t('def.select')"
                            >
                                <a-select-option v-for="(item, index) of storeList" :key="index" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('p.order_type') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.type"
                                @change="handleSearch"
                                :placeholder="$t('def.select')"
                            >
                                <a-select-option
                                    v-for="(item, index) of PAYMENT_TYPE_LIST"
                                    :key="index"
                                    :value="item.key"
                                >
                                    {{ item[$i18n.locale] }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('p.payment_method') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.pay_type"
                                @change="handleSearch"
                                :placeholder="$t('def.select')"
                            >
                                <a-select-option v-for="(item, index) of PAY_TIME_LIST" :key="index" :value="item.key">
                                    {{ item[$i18n.locale] }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('p.payment_status') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.payment_status"
                                @change="handleSearch"
                                :placeholder="$t('def.select')"
                            >
                                <a-select-option
                                    v-for="(item, index) of PAYMENT_STATUS_MAP"
                                    :key="index"
                                    :value="item.key"
                                >
                                    {{ item[$i18n.locale] }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 下单时间 -->
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                        <div class="key">{{ $t('n.order_time') }}:</div>
                        <div class="value"><TimeSearch @search="handleOtherSearch" ref="TimeSearch" /></div>
                    </a-col>
                    <!-- 应付尾款时间 -->
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                        <div class="key">{{ $t('p.payable_time') }}:</div>
                        <div class="value"><TimeSearch @search="handleOtherPayableSearch" ref="TimeSearch1" /></div>
                    </a-col>
                    <!-- 运费状态 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('p.freight_status') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.freight_status"
                                @change="handleSearch"
                                :placeholder="$t('def.select')"
                            >
                                <a-select-option
                                    v-for="(item, index) of FREIGHT_STATUS_MAP"
                                    :key="index"
                                    :value="item.key"
                                >
                                    {{ $t(`${item.t}`) }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="operate-container">
                <a-button v-if="$auth('sales.distribution.order.export')" type="primary" @click="handleExportConfirm">
                    <i class="icon i_download" />
                    {{ $t('def.export') }}
                </a-button>
                <a-button
                    v-if="$auth('sales.distribution.order.sales-report-export')"
                    type="primary"
                    @click="handleExportSalesReport"
                >
                    <i class="icon i_download" />{{ $t('def.sales_report_export') }}
                </a-button>
                <a-button
                    v-if="$auth('sales.distribution.order.statistics-report-export')"
                    type="primary"
                    @click="handleExportSalesQuantityStatistics"
                >
                    <i class="icon i_download" />
                    {{ $t('def.quantity_sales_report_export') }}
                </a-button>
                <a-button
                    class="right-f"
                    v-if="searchForm.status === '150' && $auth('ADMIN')"
                    :disabled="!isShowErpDisabled"
                    @click="sendErp"
                >
                    {{ /* 同步至ERP */ $t('p.synchronization_to_erp') }}
                </a-button>
            </div>
            <div class="table-container">
                <a-table
                    :loading="loading"
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-selection="searchForm.status === '150' && $auth('ADMIN') ? rowSelection : null"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'sn'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)" v-if="text !== ''">{{
                                    text
                                }}</a-button>
                                <a-button type="link" disabled v-else>-</a-button>
                            </a-tooltip>
                        </template>
                        <!-- 销售bom -->
                        <template v-if="column.key === 'accessory_list'">
                            <span class="accessory_list" @click="openBomModal(record)">
                                {{
                                    record.item_list
                                        .map((item, index) => {
                                            return $i18n.locale === 'zh' ? item.item?.name : item.item?.name_en;
                                        })
                                        .join(',') || '-'
                                }}
                            </span>
                        </template>
                        <template v-else-if="column.dataIndex === 'parent_sn'">
                            <a-tooltip placement="top" :title="text">
                                <a-button
                                    type="link"
                                    @click="routerChange('parent_detail', record)"
                                    v-if="text !== ''"
                                    >{{ text }}</a-button
                                >
                                <a-button type="link" disabled v-else>-</a-button>
                            </a-tooltip>
                        </template>
                        <!-- 总价 user_type 分销商可看 状态是等待审核 或者 待审核显示true显示 '-'  -->
                        <template v-else-if="column.key === 'total_price'">
                            <div
                                v-if="
                                    user_type &&
                                    (record.status === STATUS.WAIT_AUDIT || record.status === STATUS.REVISE_AUDIT)
                                "
                            >
                                -
                            </div>
                            <div v-else-if="user_type && record.type == FLAG_ORDER_TYPE.Mix_SALES">
                                <!-- 混合订单(分销商有两种显示 平台方可不进这里流程) price_flag 1 表示 拆分订单都审核通过 其他表示都显示 '-' -->
                                <div v-if="record?.price_flag == 1">
                                    <span v-if="text >= 0">{{ $Util.priceUnitFilter(record.currency) }}</span>
                                    <span>
                                        {{ $Util.countFilter(text) }}
                                    </span>
                                </div>
                                <div v-else>-</div>
                            </div>
                            <div v-else>
                                <span v-if="text >= 0">{{ $Util.priceUnitFilter(record.currency) }}</span>
                                <span>
                                    {{ $Util.countFilter(text) }}
                                </span>
                            </div>
                        </template>
                        <!-- 运费 -->
                        <template v-else-if="column.key === 'freight'">
                            <span v-if="text >= 0">{{ $Util.priceUnitFilter(record.currency) }}</span>
                            <span>
                                {{ $Util.countFilter(text) }}
                            </span>
                        </template>
                        <!-- 运费状态 -->
                        <template v-else-if="column.key === 'freight_status'">
                            {{ FREIGHT_STATUS_MAP[text]?.t ? $t(`${FREIGHT_STATUS_MAP[text]?.t}`) : '-' }}
                        </template>
                        <!-- 已支付金额 -->
                        <template v-else-if="column.key === 'amount_paid'">
                            <span v-if="text >= 0">{{ $Util.priceUnitFilter(record.currency) }}</span>
                            <span>
                                {{ $Util.countFilter(text) }}
                            </span>
                        </template>
                        <!-- 订单状态 -->
                        <template v-else-if="column.key === 'order_status'">
                            <div class="status status-bg status-tag" :class="$Util.purchaseStatusFilter(text, 'color')">
                                {{ $Util.purchaseStatusFilter(text, $i18n.locale) }}
                            </div>
                            <div
                                v-if="AUDIT_CANCEL_STATUS_MAP[record.cancel_status]"
                                class="m-l-8 status status-bg status-tag"
                                :class="$Util.purchaseStatusFilter(text, 'color')"
                            >
                                {{ $t('distributor-detail.cancel_order') }}
                                ({{ $t(`${AUDIT_CANCEL_STATUS_MAP[record.cancel_status]?.t}`) }})
                            </div>
                        </template>
                        <template v-else-if="column.dataIndex === 'payment_status'">
                            <div class="status status-bg status-tag" :class="$Util.paymentStatusFilter(text, 'color')">
                                {{ $Util.paymentStatusFilter(text, $i18n.locale) }}
                            </div>
                        </template>
                        <template v-else-if="column.dataIndex === 'type'">
                            {{ $Util.purchaseTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-else-if="column.dataIndex === 'pay_type'">
                            {{ $Util.purchasePayTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-else-if="column.dataIndex === 'flag_review'">
                            {{ $Util.purchaseFlagReviewFilter(text) }}
                        </template>
                        <template v-else-if="column.dataIndex === 'purchase_method'">
                            {{ $Util.purchasePayMethodFilter(text, $i18n.locale) }}
                        </template>
                        <template v-else-if="column.dataIndex === 'item_type'">
                            {{ $Util.itemTypeFilter(text) }}
                        </template>
                        <template v-else-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-else-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title="text">
                                <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-else-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-else-if="column.key === 'sync_failure_reason'">
                            {{ text || '-' }}
                        </template>
                        <template v-else-if="column.key === 'operation'">
                            <a-button
                                v-if="search_type === SEARCH_TYPE.SELF"
                                type="link"
                                @click="handleRecreate(record)"
                            >
                                <i class="icon i_cart" /> {{ $t('p.buy_again') }}
                            </a-button>
                            <a-button
                                v-if="$auth('sales.distribution.order.detail', 'aftermarket.distribution.order.detail')"
                                type="link"
                                @click="routerChange('detail', record)"
                            >
                                <i class="icon i_detail" />{{ $t('def.detail') }}</a-button
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
            <a-modal
                v-model:visible="visible"
                :title="$t('i.sale_bom')"
                :getContainer="getContainer"
                :footer="null"
                :width="540"
                class="sale-bom-modal"
            >
                <div class="bom-item-list" v-for="item in bomModalData" :key="item.id">
                    <div class="shop">
                        {{ $i18n.locale === 'zh' ? item.item.name : item.item.name_en }}
                        <!-- 修改按钮 -->
                        <a-button @click="routerChange('editBom', item)">
                            {{ $t('def.edit') }}
                        </a-button>

                        <!-- <ItemSelect
                            btnType="default"
                            :disabled-checked="item?.accessory_list?.map(el => el.target_id)"
                            @select="
                                (selectItemIds, selectItems, faultName) =>
                                    handleSelectItem(selectItemIds, selectItems, faultName, item)
                            "
                        >
                            {{ $t('def.edit') }}
                        </ItemSelect> -->
                    </div>
                    <div class="bom">
                        <div
                            class="bom-item"
                            v-for="item in item.accessory_list"
                            :key="item.id"
                            v-if="item?.accessory_list && item.accessory_list.length > 0"
                        >
                            <div class="bom-item-name">
                                {{ $i18n.locale === 'zh' ? item.target_name : item.target_name_en }}
                            </div>
                            <div class="bom-item-num">
                                <span class="m-r-30">x{{ item.amount }}</span>

                                <!-- <a-button type="link" @click="handleDelete(item.id)">
                                    <i class="icon i_delete" />{{ $t('def.delete') }}
                                </a-button> -->
                            </div>
                        </div>
                        <a-empty v-else />
                    </div>
                </div>
            </a-modal>
        </div>
    </div>
</template>

<script>
import Core from '@/core';
const LOGIN_TYPE = Core.Const.LOGIN.TYPE;
const SEARCH_TYPE = Core.Const.PURCHASE.SEARCH_TYPE;
const PAYMENT_STATUS_MAP = Core.Const.PURCHASE.PAYMENT_STATUS_MAP;
const PAYMENT_TYPE_LIST = Core.Const.PURCHASE.FLAG_ORDER_TYPE_LIST;
const FLAG_ORDER_TYPE = Core.Const.PURCHASE.FLAG_ORDER_TYPE;
const PAY_TIME_LIST = Core.Const.DISTRIBUTOR.PAY_TIME_LIST;
const STATUS = Core.Const.PURCHASE.STATUS;
const FREIGHT_STATUS_MAP = Core.Const.DISTRIBUTOR.FREIGHT_STATUS_MAP;
const AUDIT_CANCEL_STATUS_MAP = Core.Const.DISTRIBUTOR.AUDIT_CANCEL_STATUS_MAP;

import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import { message } from 'ant-design-vue';
import TimeSearch from '@/components/common/TimeSearch.vue';
import { debounce } from 'lodash';

export default {
    name: 'PurchaseList',
    components: {
        TimeSearch,
        ItemSelect,
    },
    props: {},
    data() {
        return {
            visible: false,
            bomModalData: [],
            singleRecordData: {}, // 单个表格数据
            LOGIN_TYPE,
            SEARCH_TYPE,
            STATUS,
            PAYMENT_STATUS_MAP,
            PAYMENT_TYPE_LIST,
            PAY_TIME_LIST,
            FLAG_ORDER_TYPE,
            FREIGHT_STATUS_MAP,
            AUDIT_CANCEL_STATUS_MAP,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 导出
            exportDisabled: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            purchaseMode: '',
            search_type: 0,
            agentList: [],
            storeList: [],
            distributorList: [],
            searchForm: {
                sn: '',
                status: undefined,
                payment_status: undefined,
                item_type: 0,
                distributor_id: undefined,
                agent_id: undefined,
                store_id: undefined,
                type: undefined,
                pay_type: undefined,
                subject: 0,
                begin_time: '',
                end_time: '',
                freight_status: undefined, // 运费状态
                final_pay_due_begin_time: undefined, // 应付尾款时间开始
                final_pay_due_end_time: undefined, // 应付尾款时间结束
            },
            // 表格
            tableData: [],

            // 勾选项
            selectedRowKeys: [],
            statusListData: [], // tabs数据
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                this.handleSearchReset(false);
                this.getStatusStat();
            },
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('p.number'), dataIndex: 'sn' },
                // 销售BOM
                { title: this.$t('i.sale_bom'), dataIndex: 'accessory_list', key: 'accessory_list' },
                { title: this.$t('p.parent_sn'), dataIndex: 'parent_sn' },
                { title: this.$t('p.order_type'), dataIndex: 'type', key: 'type' },
                { title: this.$t('p.payment_method'), dataIndex: 'pay_type', key: 'pay_type' },
                {
                    title: this.$t('p.estimated_shipping_data'),
                    dataIndex: 'shipping_time_estimated',
                    key: 'time',
                }, // 预计船期
                { title: this.$t('p.order_status'), dataIndex: 'status', key: 'order_status' },
                { title: this.$t('n.order_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('p.payment_status'), dataIndex: 'payment_status' },
                { title: this.$t('p.payment_time'), dataIndex: 'pay_time', key: 'time' },
                { title: this.$t('p.complete_time'), dataIndex: 'close_time', key: 'time' },
                { title: this.$t('p.payable_time'), dataIndex: 'final_pay_due_time', key: 'time' }, // 应付尾款时间
            ];
            if (this.$auth('DISTRIBUTOR')) {
                const index = columns.findIndex(column => column.dataIndex === 'accessory_list');
                if (index !== -1) {
                    columns.splice(index, 1);
                }
            }
            if (
                !this.$auth('sales.distribution.order.purchase-order', 'aftermarket.distribution.order.purchase-order')
            ) {
                columns.splice(4, 0, {
                    title: this.$t('n.institution'),
                    dataIndex: ['create_org', 'name'],
                    key: 'item',
                });
                columns.splice(5, 0, { title: this.$t('p.total_price'), dataIndex: 'total_price', key: 'total_price' });
                columns.splice(6, 0, { title: this.$t('p.freight'), dataIndex: 'freight', key: 'freight' });
                columns.splice(7, 0, {
                    title: this.$t('p.freight_status'),
                    dataIndex: 'freight_status',
                    key: 'freight_status',
                });
                columns.splice(9, 0, { title: this.$t('p.amount_paid'), dataIndex: 'payment', key: 'amount_paid' });
            }
            // 失败原因列表-仅存在与待生产tab
            if (this.searchForm.status === '150' && this.$auth('ADMIN')) {
                columns.push({
                    title: this.$t('p.reason_fail'),
                    key: 'sync_failure_reason',
                    dataIndex: 'sync_failure_reason',
                });
            }
            columns.push({ title: this.$t('def.operate'), key: 'operation', fixed: 'right' });

            return columns;
        },
        statusList() {
            let columns = [
                { zh: '全  部', en: 'All', value: '0', color: 'primary', key: '0' },
                { zh: '已拆单', en: 'Split orders', value: '0', color: 'yellow', key: '50' },
                { zh: '等待审核', en: 'Waiting for review', value: '0', color: 'yellow', key: '60' },
                { zh: '待支付', en: 'Wait to pay', value: '0', color: 'yellow', key: '100' },
                { zh: '待审核', en: 'Wait to audit', value: '0', color: 'yellow', key: '630' },
                { zh: '待生产', en: 'To be produced', value: '0', color: 'blue-2', key: '150' },
                { zh: '生产中', en: 'In production', value: '0', color: 'green-2', key: '160' },
                { zh: '待发货', en: 'Wait for delivery', value: '0', color: 'orange', key: '200' },
                { zh: '已发货', en: 'Shipped', value: '0', color: 'primary', key: '300' },
                { zh: '部分收货', en: 'Received', value: '0', color: 'primary', key: '330' },
                { zh: '全部收货', en: 'All Received', value: '0', color: 'primary', key: '360' },
                { zh: '交易完成', en: 'Transaction completed', value: '0', color: 'green', key: '400' },
                { zh: '交易取消', en: 'Canceled', value: '0', color: 'grey', key: '-100' },
            ];
            if (this.$auth('ADMIN')) {
                columns.splice(3, 0, { zh: '已转单', en: 'Order transferred', value: '0', color: 'blue', key: '250' });
            }

            columns.forEach(el => {
                if (Number(el.key) === 0) {
                    let total = 0;

                    this.statusListData.forEach(item => {
                        total += item.amount;
                    });

                    el.value = total;
                } else {
                    const findItem = this.statusListData.find(findItem => Number(findItem.status) === Number(el.key));
                    if (findItem) {
                        el.value = findItem.amount;
                    }
                }
            });

            return columns;
        },
        // 权限(平台方还是分销商等)
        user_type() {
            let arr = [Core.Const.LOGIN.TYPE.DISTRIBUTOR]; // 分销商
            return arr.includes(Core.Data.getLoginType());
        },
        // 勾选情况-方法（仅-待生产）
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                // preserveSelectedRowKeys: true,
                onChange: (selectedRowKeys, selectedRows) => {
                    // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys;
                },
            };
        },

        // 同步erp-按钮禁用变量
        isShowErpDisabled() {
            return this.selectedRowKeys.length > 0;
        },

        // 语言控制变量
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() { 
        if (this.$auth('ADMIN')) {
            this.search_type = SEARCH_TYPE.ALL
        } else if (this.$auth('DISTRIBUTOR')) {
            this.search_type = SEARCH_TYPE.SELF
        }

        this.getDistributorListAll();
        this.getAgentListAll();
        this.getStoreListAll();
        this.getStatusStat();
        this.timer = window.setInterval(() => {
            setTimeout(() => {
                this.getDistributorListAll();
                this.getAgentListAll();
                this.getStoreListAll();
            }, 0);
        }, 20000);
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
    methods: {
        // 打开销售bom弹窗
        openBomModal(record) {
            this.visible = true;
            this.singleRecordData = record;
            this.bomModalData = this.singleRecordData.item_list;
        },
        getContainer() {
            return this.$refs.container;
        },
        // 点击推送按钮（erp)
        sendErp() {
            let _this = this;
            let title =
                this.lang === 'zh'
                    ? `是否要将选中的${this.selectedRowKeys.length}条订单同步至ERP?`
                    : `Do you want to synchronize the selected ${this.selectedRowKeys.length} orders to ERP?`;
            this.$confirm({
                title: title,
                okText: _this.$t('def.sure'),
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Purchase.erpPush({ id_list: _this.selectedRowKeys })
                        .then(res => {
                            console.log('res  Purchase  11111', res);
                            _this.confirmNum(res?.success_number || 0, res?.fail_number || 0);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                },
            });
        },
        // 弹出同步erp-请求情况
        confirmNum(sNum, fNum) {
            let _this = this;

            let title =
                this.lang === 'zh'
                    ? `${sNum} 条订单同步成功${fNum > 0 ? '， ' + fNum + '条同步失败' : ''}`
                    : `${sNum} orders were synchronized successfully${fNum > 0 ? ', and ' + fNum + 'failed to synchronize' : ''}`;
            this.$confirm({
                title: title,
                okText: _this.$t('def.sure'),
                cancelText: this.$t('def.cancel'),
            });
            this.selectedRowKeys = [];
            // 刷新列表
            this.getTableData();
            // 刷新tab-数值
            this.getStatusStat();
        },

        async routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/distributor/purchase-order-detail',
                        query: {
                            id: item.id,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'parent_detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/distributor/purchase-order-detail',
                        query: {
                            id: item.parent_id,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'edit': // 购物车
                    routeUrl = this.$router.resolve({
                        path: '/mall/shopping-bag',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'editBom': // 销售BOM
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: {
                            id: item.item_id,
                            tab: 3,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            this.pageSize = size;
            this.getTableData();
        },
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        // 下单时间搜索
        handleOtherSearch(params) {
            // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key];
            }
            this.pageChange(1);
        },
        // 应付款时间搜索
        handleOtherPayableSearch(params) {
            console.log('应付款时间搜索', params);
            this.searchForm.final_pay_due_begin_time = params.begin_time;
            this.searchForm.final_pay_due_end_time = params.end_time;
            this.pageChange(1);
        },
        handleSearchReset(flag = true) {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            if (flag) {
                this.$refs.TimeSearch.handleReset();
                this.$refs.TimeSearch1.handleReset();
            }
            this.pageChange(1);
        },
        getTableData(type = false) {
            // 获取 表格 数据
            this.loading = true;
            let obj = {
                ...this.searchForm,
                search_type: this.search_type,
                page: this.currPage,
                page_size: this.pageSize,
            };

            Core.Api.Purchase.list(obj)
                .then(res => {
                    this.total = res.count;
                    this.tableData = res.list;
                    this.loading = false;

                    // 为了让销售bom弹窗刷新修改刷新
                    if (type) {
                        this.singleRecordData = this.tableData.find(el => el.id === this.singleRecordData.id);
                        this.bomModalData = this.singleRecordData.item_list;
                    }
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getStatusStat() {
            // 获取 状态统计 数据

            Core.Api.Purchase.statusList({
                search_type: this.search_type,
            })
                .then(res => {
                    this.statusListData = res.status_list;
                })
                .catch(err => {
                    console.log('getStatusStat err:', err);
                });
        },
        getDistributorListAll(params) {
            let obj = {
                ...params,
            };
            Core.Api.Distributor.listAll(obj).then(res => {
                this.distributorList = res.list.map(el => {
                    return {
                        value: el.id,
                        label: el.name,
                    };
                });
            });
        },
        getAgentListAll() {
            // 获取 零售商 数据
            Core.Api.Agent.listAll({ distributor_id: this.searchForm.distributor_id }).then(res => {
                this.agentList = res.list;
            });
        },
        getStoreListAll() {
            // 通过零售商Id 获取所有门店
            Core.Api.Store.listAll({ agent_id: this.searchForm.agent_id }).then(res => {
                this.storeList = res.list;
            });
        },

        handleRecreate(item) {
            // 再来一单
            this.loading = true;
            Core.Api.Purchase.recreate({
                id: item.id,
            })
                .then(res => {
                    this.routerChange('edit', item);
                })
                .catch(err => {
                    console.log('handleRecreate err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handleExportConfirm() {
            // 确认订单是否导出
            let _this = this;
            this.$confirm({
                title: _this.$t('p.sure_export'),
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.handleRepairExport();
                },
            });
        },
        handleRepairExport() {
            // 订单导出
            this.exportDisabled = true;
            let form = Core.Util.deepCopy(this.searchForm);
            for (const key in form) {
                form[key] = form[key] || '';
            }
            let exportUrl = Core.Api.Export.purchaseExport({
                ...form,
                search_type: this.search_type,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },

        // 以销售报表导出
        handleExportSalesReport() {
            if (!this.searchForm.begin_time && !this.searchForm.end_time) {
                // 没有选择时间
                message.error({
                    content: () => this.$t('def.Please_select_time'),
                    class: 'custom-class',
                    style: {
                        marginTop: '20vh',
                    },
                });
            } else {
                let _this = this;
                this.$confirm({
                    title: _this.$t('p.sure_export'),
                    okText: _this.$t('def.sure'),
                    cancelText: _this.$t('def.cancel'),
                    onOk() {
                        _this.handleRepairExportSalesReport();
                        _this.handleSearchReset();
                    },
                });
            }
        },
        // 以销售报表导出
        handleExportSalesQuantityStatistics() {
            if (!this.searchForm.begin_time && !this.searchForm.end_time) {
                // 没有选择时间
                message.error({
                    content: () => this.$t('def.Please_select_time'),
                    class: 'custom-class',
                    style: {
                        marginTop: '20vh',
                    },
                });
            } else {
                let _this = this;
                this.$confirm({
                    title: _this.$t('p.sure_export'),
                    okText: _this.$t('def.sure'),
                    cancelText: _this.$t('def.cancel'),
                    onOk() {
                        _this.handleRepairExportSalesQuantityStatistics();
                        _this.handleSearchReset();
                    },
                });
            }
        },
        handleRepairExportSalesReport() {
            // 订单导出
            this.exportDisabled = true;
            let form = Core.Util.deepCopy(this.searchForm);
            for (const key in form) {
                form[key] = form[key] || '';
            }
            let exportUrl = Core.Api.Export.exportSalesStatement({
                ...form,
                search_type: this.search_type,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },
        handleRepairExportSalesQuantityStatistics() {
            // 订单导出
            this.exportDisabled = true;
            let form = Core.Util.deepCopy(this.searchForm);
            for (const key in form) {
                form[key] = form[key] || '';
            }
            let exportUrl = Core.Api.Export.exportSalesQuantityStatistics({
                ...form,
                search_type: this.search_type,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },

        // ItemSelect 组件事件
        handleSelectItem(ids, items, faultName, bomModalItem) {
            console.log('handleSelectItem ids, items:', ids, items);
            console.log('bomModalItem:', bomModalItem);

            // 多选操作
            let params = {
                item_id: bomModalItem.item_id,
                target_list: [],
            };

            ids.forEach(el => {
                params.target_list.push({
                    target_id: el,
                    target_type: Core.Const.ITEM_ACCESSORY.TARGET_TYPE_MAP.ITEM,
                });
            });

            console.log('params', params);

            Core.Api.ItemAccessory.save(params)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.getTableData(true);
                })
                .catch(err => {
                    console.log('handleDelete err', err);
                });
        },

        // 删除BOM商品
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.ItemAccessory.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData(true);
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },

        // 分销商的search选项
        onFilterOption(input, option) {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
    },
};
</script>

<style lang="less" scoped>
// #PurchaseList {}

.right-f {
    float: right;
}
:deep(.ant-table-cell) {
    .accessory_list {
        display: inline-block;
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #006ef9;
        cursor: pointer;
    }
}
:deep(.sale-bom-modal) {
    .ant-modal-content {
        border-radius: 4px;
        .ant-modal-header {
            padding: 16px 16px 16px 24px;
            min-height: auto;
            .ant-modal-title {
                height: auto;
                line-height: 1;
            }
        }
        .ant-modal-body {
            padding: 16px 24px;
            min-height: 444px;
            overflow-y: auto;
            // 滚动条样式
            &::-webkit-scrollbar {
                width: 8px; /* 滚动条宽度 */
            }

            /* 滚动条背景 */
            &::-webkit-scrollbar-track {
                background-color: #fff;
            }

            /* 滚动条滑块 */
            &::-webkit-scrollbar-thumb {
                background-color: #e5e6eb;
                border-radius: 20px; /* 滑块圆角 */
            }
            .bom-item-list {
                border-radius: 4px;
                border: 1px solid #eaecf2;
                background: #fff;
                color: #1d2129;
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 16px;
                &:last-child {
                    margin-bottom: 0px;
                }

                .shop {
                    height: 48px;
                    border-radius: 4px 4px 0px 0px;
                    border: 1px solid #eaecf2;
                    background: #f5f7f9;
                    font-weight: 600;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 16px;
                }
                .bom {
                    padding: 18px 16px 16px 16px;
                    .bom-item {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 16px;
                        &:last-child {
                            margin-bottom: 0px;
                        }
                    }
                }
            }
        }
    }
}
</style>
