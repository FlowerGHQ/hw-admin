<template>
    <div id="ItemList">
        <div class="content-area_main">
            <div class="select-tree" ref="selectTree">
                <CategoryTree @change="handleCategoryChange" ref="CategoryTree" />
            </div>
            <div class="list-container" ref="bigBox">
                <div id="fixed-box" ref="fixBox" :style="{ width: fixedWidth }">
                    <!-- 顶部障眼法-盒子 -->
                    <div class="top-box">
                        <div class="top-back"></div>
                    </div>
                    <div class="title-container">
                        <div class="title-area">{{ $t('i.item_list') }}</div>
                        <div class="btns-area">
                            <div class="btn-group">
                                <a-upload
                                    name="file"
                                    class="file-uploader"
                                    :file-list="upload.fileList"
                                    :action="upload.action"
                                    :show-upload-list="false"
                                    :headers="upload.headers"
                                    :data="upload.data"
                                    accept=".xlsx,.xls"
                                    @change="handleMatterChange"
                                >
                                    <div class="radio-btn first">{{ $t('i.import_name') }}</div>
                                </a-upload>
                                <div
                                    v-if="$auth('sales.item.item.import')"
                                    class="radio-btn"
                                    @click="handleExportConfirm"
                                >
                                    {{ $t('i.export') }}
                                </div>
                                <div class="radio-btn last" @click="downTemplate">{{ $t('i.down_template') }}</div>
                            </div>
                            <a-button
                                v-if="$auth('sales.item.item.set-sale-area')"
                                class="ml-8"
                                type="primary"
                                @click="handleSalesAreaByIdsShow()"
                            >
                                <i class="icon i_edit" /> {{ $t('ar.set_sales') }}
                            </a-button>
                            <a-button v-if="$auth('sales.item.item.save')" type="primary" @click="routerChange('add')">
                                <i class="icon i_add" />{{ $t('i.new') }}
                            </a-button>
                        </div>
                    </div>
                    <div :style="{ width: fixedWidth }">
                        <SearchAll
                            :options="searchList"
                            @search="getSearchFrom"
                            @freshPageHeight="freshPageHeight"
                            @reset="handleSearchReset"
                        >
                            <template v-slot:time>
                                <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-box">
                                    <div class="item-box">
                                        <div class="key-box">
                                            {{ $t('d.create_time') }}
                                        </div>
                                        <div class="value-box">
                                            <TimeSearch @search="handleOtherSearch" ref="TimeSearch" />
                                        </div>
                                    </div>
                                </a-col>
                            </template>
                        </SearchAll>
                        <!-- 商品分类：
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show">
                <div class="key">{{ $t("i.categories") }}:</div>
                <div class="value">
                  <CategoryTreeSelect
                    @change="handleCategorySelect"
                    :category-id="searchForm.category_id" />
                </div>
              </a-col> -->
                    </div>
                </div>
                <div :style="{ height: fixedHeight }"></div>
                <div class="table-container" ref="tabBox">
                    <a-table
                        :columns="tableColumns"
                        :data-source="tableData"
                        :loading="loading"
                        :scroll="{ x: true }"
                        :pagination="false"
                        :row-key="record => record.id"
                        @change="handleTableChange"
                        @expand="handleTableExpand"
                        :expandedRowKeys="expandedRowKeys"
                        :indentSize="0"
                        :row-selection="rowSelection"
                    >
                        <template #headerCell="{ column }">
                            <template v-if="column.dataIndex === 'code'">
                                <div class="table-block">
                                    {{ $t('i.code') }}/ {{ $t(/*SKU编码*/ 'i.sku_code') }}
                                    <a-tooltip placement="top">
                                        <template #title>
                                            <p>
                                                {{
                                                    $t(/*商品编码: 多规格商品的父规格对应商品编码; */ 'i.item_code_tip')
                                                }}
                                            </p>
                                            <p>
                                                {{
                                                    $t(
                                                        /*SKU编码: 单规格、多规格商品的子规格对应SKU编码; */ 'i.sku_code_tip',
                                                    )
                                                }}
                                            </p>
                                        </template>
                                        <info-circle-outlined />
                                    </a-tooltip>
                                </div>
                            </template>
                        </template>
                        <template #bodyCell="{ column, text, record }">
                            <!-- 名称 -->
                            <template v-if="column.key === 'detail'">
                                <div style="width: 200px" class="table-img">
                                    <a-image
                                        class="image"
                                        :width="55"
                                        :height="55"
                                        :src="$Util.imageFilter(record.logo, record.type == 2 ? 6 : 2)"
                                        :fallback="$t('def.none')"
                                    />
                                    <div class="info">
                                        <div>
                                            <a-tooltip>
                                                <template #title>{{
                                                    $i18n.locale === 'zh' ? record.name : record.name_en || '-'
                                                }}</template>
                                                <a-button type="link" @click="routerChange('detail', record)">
                                                    <div class="ell" style="max-width: 150px">
                                                        {{
                                                            $i18n.locale === 'zh' ? record.name : record.name_en || '-'
                                                        }}
                                                    </div>
                                                </a-button>
                                            </a-tooltip>
                                            <a-tooltip>
                                                <template #title>{{
                                                    /* $i18n.locale === "zh"
                                  ? record.name
                                  : record.name_en || "-" */
                                                    !record.children && record.attr_list && record.attr_list.length
                                                        ? $Util.itemSpecFilter(record.attr_list)
                                                        : `${$t(/*共有*/ 'i.in_all')}${record.children_number}${$t(
                                                              /*款规格商品*/ 'i.spec_of_goods',
                                                          )}`
                                                }}</template>
                                                <div
                                                    v-if="
                                                        !record.children && record.attr_list && record.attr_list.length
                                                    "
                                                    class="sub-info"
                                                >
                                                    {{ $Util.itemSpecFilter(record.attr_list) }}
                                                </div>
                                                <div v-if="record.children_number" class="sub-info sub-info-farther">
                                                    {{ $t(/*共有*/ 'i.in_all') }} {{ record.children_number }}
                                                    {{ $t(/*款规格商品*/ 'i.spec_of_goods') }}
                                                </div>
                                            </a-tooltip>
                                        </div>

                                        <!-- 来源 -->
                                        <div
                                            v-if="SOURCE_TYPE[record.source_type]?.value == 'ERP'"
                                            class="source-erp"
                                            :title="
                                                $t('i.synchronization_time') +
                                                ' ' +
                                                ($Util.timeFilter(record.sync_time) || '-')
                                            "
                                        >
                                            <span>
                                                {{ SOURCE_TYPE[record.source_type].value }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-if="column.key === 'type'">
                                {{ $Util.itemTypeFilter(text, $i18n.locale) }}
                            </template>
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.key === 'category_list'">
                                <span v-for="(category, index) in text">
                                    <span v-if="index !== 0">,</span>
                                    {{ $i18n.locale === 'zh' ? category.category_name : category.category_name_en }}
                                </span>
                            </template>
                            <template v-if="column.key === 'money'"> ￥{{ $Util.countFilter(text) }} </template>
                            <template v-if="column.key === 'flag_entity'">
                                {{ $Util.itemFlagEntityFilter(text, $i18n.locale) }}
                            </template>
                            <template v-if="column.dataIndex === 'fob_eur'">
                                <template v-if="record.type === 1">
                                    <span v-if="text >= 0">{{ column.unit }}</span>
                                    {{
                                        $Util.countFilter(record.min_fob_eur ? record.min_fob_eur : record.fob_40qh_eur)
                                    }}
                                    ~
                                    <span v-if="text >= 0">{{ column.unit }}</span>
                                    {{ $Util.countFilter(record.max_fob_eur ? record.max_fob_eur : record.fob_eur) }}
                                </template>
                                <template v-else>
                                    <span v-if="text >= 0">{{ column.unit }}</span>
                                    <!-- {{ paramPrice ? $Util.countFilter(record.fob_eur) : $Util.countFilter(record.fob_usd) }} -->
                                    {{ $Util.countFilter(record.fob_eur) }}
                                </template>
                            </template>
                            <template v-if="column.dataIndex === 'fob_usd'">
                                <template v-if="record.type === 1">
                                    <span v-if="text >= 0">{{ column.unit }}</span>
                                    {{
                                        $Util.countFilter(record.min_fob_usd ? record.min_fob_usd : record.fob_40qh_usd)
                                    }}
                                    ~
                                    <span v-if="text >= 0">{{ column.unit }}</span>
                                    {{ $Util.countFilter(record.max_fob_usd ? record.max_fob_usd : record.fob_usd) }}
                                </template>
                                <template v-else>
                                    <span v-if="text >= 0">{{ column.unit }}</span>
                                    <!-- {{ paramPrice ? $Util.countFilter(record.fob_eur) : $Util.countFilter(record.fob_usd) }} -->
                                    {{ $Util.countFilter(record.fob_usd) }}
                                </template>
                            </template>
                            <!-- sales_area_list -->
                            <template v-if="column.key === 'sales_area_list'">
                                <a-tooltip placement="topLeft">
                                    <span class="sales_area_list">
                                        <span class="sales_area_item" v-for="(sales, index) in record.sales_area_list">
                                            {{ $i18n.locale === 'zh' ? sales.name : sales.name_en }}
                                        </span>
                                    </span>
                                    <template #title>
                                        <div v-for="(sales, index) in record.sales_area_list">
                                            {{ $i18n.locale === 'zh' ? sales.country : sales.country_en }}
                                        </div>
                                    </template>
                                </a-tooltip>
                            </template>
                            <template v-if="column.dataIndex === 'status'">
                                <div
                                    v-if="!record.children"
                                    class="status status-bg status-tag"
                                    :class="text === 0 ? 'green' : 'red'"
                                >
                                    {{ text === 0 ? $t('i.active') : $t('i.inactive') }}
                                </div>
                                <div v-else></div>
                            </template>

                            <template v-if="column.key === 'tip_item'">
                                <a-tooltip placement="top" :title="text">
                                    <div class="ell" style="max-width: 160px">
                                        {{ text || '-' }}
                                    </div>
                                </a-tooltip>
                            </template>
                            <template v-if="column.key === 'time'">
                                {{ $Util.timeFilter(text) }}
                            </template>
                            <template v-if="column.key === 'operation'">
                                <template v-if="!record.default_item_id">
                                    <a-button
                                        v-if="$auth('sales.item.item.edit')"
                                        type="link"
                                        @click="routerChange('edit', record)"
                                    >
                                        <i class="icon i_edit" />{{ $t('def.edit') }}
                                    </a-button>
                                    <a-button
                                        v-if="$auth('sales.item.item.detail')"
                                        type="link"
                                        @click="routerChange('detail', record)"
                                    >
                                        <i class="icon i_detail" /> {{ $t('def.detail') }}
                                    </a-button>
                                </template>
                                <a-button
                                    v-if="$auth('sales.item.item.up-off-shelf') && !record.children"
                                    type="link"
                                    @click="handleStatusChange(record)"
                                    :class="record.status === 0 ? 'danger' : ''"
                                >
                                    <template v-if="record.status === -1"
                                        ><i class="icon i_putaway" />{{ $t('i.active_a') }}</template
                                    >
                                    <template v-if="record.status === 0"
                                        ><i class="icon i_downaway" /> {{ $t('i.inactive_a') }}</template
                                    >
                                </a-button>
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
                        :pageSizeOptions="['20', '100', '500', '1000']"
                        @change="pageChange"
                        @showSizeChange="pageSizeChange"
                    />
                </div>
            </div>
        </div>

        <a-modal
            v-model:visible="salesAreaVisible"
            :title="$t('ar.set_sale')"
            class="field-select-modal"
            :width="630"
            :after-close="handleSalesAreaByIdsClose"
        >
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">{{ $t('d.sales_area') }}</div>
                    <div class="value">
                        <a-select v-model:value="salesAreaIds" mode="multiple" :placeholder="$t('def.select')">
                            <a-select-option v-for="(val, key) in salesList" :key="key" :value="val.id">{{
                                val.name
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button type="primary" @click="handleSalesAreaByIdsConfirm">{{ $t('def.sure') }}</a-button>
                <a-button @click="handleSalesAreaByIdsClose">{{ $t('def.cancel') }}</a-button>
            </template>
        </a-modal>
        <!-- 导出结果展示 -->
        <a-modal
            v-model:visible="importVisible"
            :title="$t('i.import_data')"
            :width="540"
            centered
            class="import-modal"
        >
            <div class="modal-content">
                <ExportResult :data="importResultData" />
            </div>
            <template #footer>
                <div class="btns">
                    <a-button @click="handleImportClose">{{ $t('def.cancel') }}</a-button>
                    <a-button type="primary" @click="handleImportConfirm">{{ $t('def.sure') }}</a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import TimeSearch from '@/components/common/TimeSearch.vue';
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue';
import CategoryTree from './components/TreeSelect.vue';
import ExportResult from '@/components/common/ExportResult.vue';
import { split } from 'lodash';
const ITEM = Core.Const.ITEM;
export default {
    name: 'ItemList',
    components: {
        TimeSearch,
        CategoryTree,
        CategoryTreeSelect,
        SearchAll,
        InfoCircleOutlined,
        ExportResult,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            filteredInfo: null,
            searchForm: {
                name: '',
                code: '',
                category_id: undefined,
                begin_time: '',
                end_time: '',
                type: undefined,
                status: '0',
                source_type: undefined,
            },
            itemStatusMap: ITEM.STATUS_LIST,
            SOURCE_TYPE: ITEM.SOURCE_TYPE, // 来源类型
            // 表格
            tableData: [],
            expandedRowKeys: [],
            selectedRowKeys: [],
            salesAreaVisible: false,
            salesList: [],
            salesAreaIds: [],
            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + '/admin/1/item/import-fob-price',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                },
            },
            flag_spread: 0, // 0, 2是默认  传其他的是全部
            // isShowAdd: false,//查询时(名称和编码都有)

            fixedHeight: 'auto',
            fixedWidth: 'auto',
            observer: null,

            //
            searchList: [
                { type: 'input', value: '', searchParmas: 'name', key: 'n.name' }, // 名称
                {
                    type: 'select',
                    value: undefined,
                    searchParmas: 'type',
                    key: 'n.type',
                    selectMap: ITEM.TYPE_MAP,
                    placeholder: 'n.choose',
                }, // 类型
                {
                    type: 'select',
                    value: undefined,
                    searchParmas: 'source_type',
                    key: 'i.source_type',
                    selectMap: (() => {
                        // 数据统一处理
                        const result = Core.Util.deepCopy(ITEM.SOURCE_TYPE);
                        for (const i in result) {
                            result[i].zh = result[i].value;
                            result[i].en = result[i].value;
                            result[i].value = result[i].id;
                        }
                        console.log('过滤的结果', result);
                        return result;
                    })(),
                    placeholder: 'n.choose',
                }, // 来源
                { type: 'input', value: '', searchParmas: 'code', key: 'i.code' }, // 商品编码
                {
                    type: 'select',
                    value: undefined,
                    searchParmas: 'status',
                    key: 'i.status',
                    selectMap: ITEM.STATUS_LIST,
                    placeholder: 'n.choose',
                }, // 商品状态
            ],
            paramPrice: false,
            importVisible: false,
            importResultData: {
                errorCodeList: [],
                invalidCodeList: [],
                totalCode: 0,
                successCode: 0,
                errorCode: 0,
                invalidCode: 0,
            },
        };
    },
    watch: {},
    beforeRouteLeave(to, from, next) {
        window.removeEventListener('resize', this.handleResize);
        this.observer.disconnect(); //取消监听
        // 当离开当前路由时执行的操作
        next();
    },
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let tableColumns = [
                { title: this.$t('n.name'), dataIndex: 'name', key: 'detail', width: '660px' },
                { title: this.$t('i.code'), dataIndex: 'code', key: 'item' },
                {
                    title: this.$t('i.status'),
                    dataIndex: 'status',
                    width: '80px',
                },
                { title: this.$t('i.sales_area'), dataIndex: 'sales_area_list', key: 'sales_area_list' },
                { title: this.$t('n.type'), dataIndex: ['type'], key: 'type' },
                {
                    title: this.$t('i.categories'),
                    dataIndex: 'category_list',
                    key: 'category_list',
                },
                // { title: this.$t("i.number"), dataIndex: "model", key: "item" },
                {
                    title: 'FOB(EUR)',
                    dataIndex: 'fob_eur',
                    key: 'fob_money',
                    unit: '€',
                },
                {
                    title: 'FOB(USD)',
                    dataIndex: 'fob_usd',
                    key: 'fob_money',
                    unit: '$',
                },
                // { title: this.$t("i.hours"), dataIndex: "man_hour", key: "man_hour" },
                {
                    title: this.$t('d.create_time'),
                    dataIndex: 'create_time',
                    key: 'time',
                }, // 工时
                {
                    title: this.$t('def.operate'),
                    key: 'operation',
                    fixed: 'right',
                    width: 180,
                },
            ];
            return tableColumns;
        },
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys;
                    this.selectedRowItems = selectedRows;
                },
            };
        },
    },
    async mounted() {
        let width = this.$refs.bigBox && this.$refs.bigBox.offsetWidth;
        let height = this.$refs.fixBox && this.$refs.fixBox.offsetHeight;
        this.fixedWidth = width - 40 + 'px';
        this.fixedHeight = height + 'px';
        await this.getTableData({ flag_spread: 1 });
        await this.getSalesAreaList();
        window.addEventListener('resize', this.handleResize);

        this.$nextTick(() => {
            this.handleResize();
        });

        const dom = this.$refs.bigBox; // this.$refs.bigBox 返回是VueComponent对象
        this.observer = new ResizeObserver(this.handleResize); //  监听宽度变化
        this.observer.observe(dom, { box: 'border-box' });
        if (Core.Data.getCurrency() === 'EUR') {
            this.paramPrice = false;
        } else {
            this.paramPrice = true;
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize);
        this.observer.disconnect(); //取消监听
    },
    methods: {
        // 刷新页面高度
        freshPageHeight() {
            this.$nextTick(() => {
                this.handleResize();
            });
        },
        // 获取search组件对象
        getSearchFrom(data) {
            for (let key in data) {
                this.searchForm[key] = data[key];
            }
            this.handleSearch();
        },

        handleCategoryChange(val) {
            this.searchForm.category_id = val;
            this.pageChange(1);
        },
        /* 监听 */
        handleResize() {
            const width = this.$refs.tabBox && this.$refs.tabBox.offsetWidth;
            const height = this.$refs.fixBox && this.$refs.fixBox.offsetHeight;
            this.fixedWidth = width + 'px';
            this.fixedHeight = height + 'px';
            // 在这里处理宽高变化的逻辑
        },
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 商品详情
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: {
                            id: item.default_item_id || item.id,
                            set_id: item.set_id,
                        },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'edit': // 商品编辑
                    routeUrl = this.$router.resolve({
                        path: '/item/item-edit',
                        query: {
                            id: item.default_item_id || item.id,
                            set_id: item.set_id,
                            edit: true,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'add': // 商品新增
                    routeUrl = this.$router.resolve({
                        path: '/item/item-edit',
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
            this.pageSize = size;
            this.getTableData();
        },
        // 查询
        handleSearch() {
            if (this.searchForm.name !== '' || this.searchForm.code !== '') {
                this.flag_spread = 1;
            }
            // 如果名称和编码都有值的话  +号去掉
            /* if (this.searchForm.name && this.searchForm.code) {
        this.isShowAdd = true;
      } */
            this.pageChange(1);
        },
        handleOtherSearch(params) {
            // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key];
            }
            // this.pageChange(1);
        },
        handleCategorySelect(val) {
            this.searchForm.category_id = val;
            this.pageChange(1);
        },
        handleTableChange(page, filters, sorter) {
            this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : '';
            }
            this.pageChange(1);
        },
        handleSearchReset() {
            // this.isShowAdd = false;
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.$refs.TimeSearch && this.$refs.TimeSearch?.handleReset();
            this.$refs.CategoryTree && this.$refs.CategoryTree?.handleReset();
            this.$refs.CategoryTree && this.$refs.CategoryTree?.handleCollapseAll();
            this.pageChange(1);
        },
        async getTableData(params = {}) {
            // 获取 表格 数据
            this.loading = true;
            await Core.Api.Item.list({
                ...Core.Util.searchFilter(this.searchForm),
                flag_spread: this.flag_spread,
                page: this.currPage,
                page_size: this.pageSize,
                ...params,
            })
                .then(res => {
                    this.total = res.count;
                    this.tableData = res.list;

                    // 如果同时查询名称和编码  加号去掉
                    // if(this.isShowAdd) {
                    // const targetTableData = this.removeChildrenFromData(res.list)
                    // this.tableData = targetTableData;
                    // } else {
                    // this.tableData = res.list;
                    // }
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        removeChildrenFromData(data) {
            return data.map(item => {
                const newItem = { ...item };
                delete newItem.children;
                return newItem;
            });
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Item.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },

        handleStatusChange(record) {
            let _this = this;
            let name = record.status === -1 ? _this.$t('i.active_a') : _this.$t('i.inactive_a');
            this.$confirm({
                title: _this.$t('pop_up.sure') + `${name}` + _this.$t('i.the_goods'),
                okText: _this.$t('def.sure'),
                okType: record.status === -1 ? '' : 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Item.updateStatus({ id: record.id })
                        .then(() => {
                            _this.$message.success(name + _this.$t('pop_up.success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleStatusChange err', err);
                        });
                },
            });
        },

        // 表格行展开-查看同规格商品
        handleTableExpand(expanded, record) {
            if (expanded) {
                if (record.device_ports) {
                    this.expandedRowKeys.push(record.id);
                } else {
                    Core.Api.Item.listBySet({ set_id: record.set_id })
                        .then(res => {
                            let list = res.list.filter(i => i.flag_default !== 1);
                            list.forEach(item => {
                                item.logo = item.imgs;
                            });
                            record.children = list;
                        })
                        .finally(() => {
                            this.expandedRowKeys.push(record.id);
                        });
                }
            } else {
                let index = this.expandedRowKeys.indexOf(record.id);
                this.expandedRowKeys.splice(index, 1);
            }
        },

        // 上传文件
        handleMatterChange({ file, fileList }) {
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(this.$t(file.response.code + ''));
                } else {
                    const resData = file.response.data;
                    this.importResultData.errorCodeList = resData.fail_code_list;
                    this.importResultData.invalidCodeList = resData.invalid_code_list;
                    this.importResultData.totalCode = resData.total_count;
                    this.importResultData.errorCode = resData.fail_count;
                    this.importResultData.successCode = resData.success_count;
                    this.importResultData.invalidCode = resData.invalid_code_count;
                    this.importVisible = true;
                    return this.$message.success(this.$t('i.uploaded'));
                }
            }
            this.upload.fileList = fileList;
        },
        getSalesAreaList() {
            Core.Api.SalesArea.list({ page: 0 }).then(res => {
                this.salesList = res.list;
            });
        },
        handleSalesAreaByIdsConfirm() {
            if (this.salesAreaIds.length <= 0) {
                return this.$message.error(this.$t('n.choose') + this.$t('d.sales_area'));
            }
            Core.Api.SalesAreaItem.batchSave({
                item_id_list: this.selectedRowKeys,
                sales_area_id_list: this.salesAreaIds,
            }).then(res => {
                this.getTableData();
                this.handleSalesAreaByIdsClose();
            });
        },
        handleSalesAreaByIdsShow() {
            if (this.selectedRowKeys.length <= 0) {
                return this.$message.error(this.$t('n.choose') + this.$t('i.item'));
            }
            this.getSalesAreaList();
            this.salesAreaVisible = true;
        },
        handleSalesAreaByIdsClose() {
            this.salesAreaVisible = false;
            this.salesList = [];
            this.salesAreaIds = [];
        },

        handleExportConfirm() {
            // 确认订单是否导出
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure') + _this.$t('n.export') + '?',
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.handleRepairExport();
                },
            });
        },
        downTemplate() {
            const url = Core.Api.Export.downloadImportFobPriceTemplate();
            window.open(url, '_blank');
        },
        handleRepairExport() {
            // 订单导出
            this.exportDisabled = true;
            let form = Core.Util.deepCopy(this.searchForm);

            for (const key in form) {
                form[key] = form[key] || '';
            }
            let exportUrl = Core.Api.Export.exportItemPrice({
                ...form,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            window.open(exportUrl, '_self');
            this.exportDisabled = false;
        },
        handleImportConfirm() {
            this.importVisible = false;
        },
        handleImportClose() {
            this.importVisible = false;
        },
        copyText(id) {
            try {
                Core.Util.Common.copyText(id);
                this.$message.success(this.$t('i.copy_success'));
            } catch {
                this.$message.error(this.$t('i.copy_failed'));
            }
        },

        // // 显示导出对话框
        // showModal() {
        //     this.visible = true;
        // },
        // // 导出确定
        // handleOk(e) {
        //     // console.log(e);
        //     this.visible = false;
        // },
    },
};
</script>
<style lang="less" scoped>
#ItemList {
    .content-area_main {
        display: flex;
        .select-tree {
            min-width: 14%;
            margin-right: 5px;
            border: 1px solid #e8e8e8;
            background-color: #fff;
            padding: 20px;
            height: calc(100vh - 95px);
            overflow-y: scroll;
            position: sticky;
            top: 0;
            border-radius: 6px;
            // 滚动条的样式
            &::-webkit-scrollbar {
                width: 0px;
                height: 6px;
                &-thumb {
                    border-radius: 3px;
                    background-color: @scrollbar-thumb;
                    transition: background-color 0.3s;
                    &:hover {
                        background: @scrollbar-thumb-hover;
                    }
                }

                &-track {
                    /*滚动条内部轨道*/
                    background: @scrollbar-track;
                }
            }
        }
        .list-container {
            flex: 1;
            #fixed-box {
                position: fixed;
                z-index: 30;
                box-sizing: border-box;
                margin-left: 20px;
                background-color: #ffffff;

                .top-box {
                    width: calc(100% + 40px) !important;
                    height: 100px;
                    background-color: #f0f2f5;
                    width: -moz-calc(100% + 40px);
                    width: -webkit-calc(100% + 40px);
                    width: calc(100% + 40px);
                    position: absolute;
                    top: -16px;
                    box-sizing: content-box;
                    left: -20px;
                    z-index: -15;
                    padding-top: 16px;
                    box-sizing: border-box;

                    .top-back {
                        background-color: #ffffff;
                        padding: 0 20px;
                        width: 100%;
                        height: 100%;
                        border-radius: 6px 6px 0 0;
                        box-sizing: border-box;
                    }
                }
            }
            .title-container {
                padding-left: 0px;
                padding-right: 0px;
                .btns-area {
                    .file-upload-btn {
                        margin-right: 15px;
                    }
                    .btn-group {
                        display: inline-flex;
                        .radio-btn {
                            padding: 6px 10px;
                            border: 1px solid #eaecf1;
                            border-right: none;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: 400;
                            text-align: center;
                            color: #1d2129;
                            line-height: 20px;
                            &.first {
                                border-radius: 4px 0 0 4px;
                            }
                            &.last {
                                border-right: 1px solid #eaecf1;
                                border-radius: 0 4px 4px 0;
                            }
                            &:hover {
                                color: #1890ff;
                            }
                        }
                    }
                }
            }

            .search-container {
                margin: 0px;
                padding-left: 20px;
            }
        }
    }
    .download {
        font-size: 14px;
        text-align: center;
        margin-right: 10px;
    }

    .table-container {
        z-index: 20;
        position: relative;
        height: auto;
        .ant-table-wrapper {
            flex: 1;
        }
        :deep(.ant-table .table-img .ant-image) {
            flex-shrink: 0;
            height: 55px;
            width: 55px !important;
            display: inline-block;
        }
        .info {
            display: inline-flex;
            flex-direction: column;

            .sub-info {
                // width: 20em;
                overflow: hidden; /*超出长度的文字隐藏*/
                text-overflow: ellipsis; /*文字隐藏以后添加省略号*/
                white-space: nowrap; /*强制不换行*/
                max-width: 180px;
            }
            .sub-info-farther {
                padding: 2px 8px;
                border-radius: 4px;
                color: #0061ff;
                background-color: #e6f0ff;
            }
            .source-erp {
                width: 36px;
                height: 18px;
                line-height: 18px;
                text-align: center;
                background-color: #ffebea;
                color: #f92e25;
                border-radius: 30px;
                font-size: 12px;
                cursor: pointer;
                margin-top: 5px;
            }
        }

        :deep(.ant-table-row-level-1) {
            background-color: #fafafa;

            .ant-table-selection-column {
                text-align: right;
                position: relative;
                .ant-checkbox-wrapper {
                    position: absolute;
                    top: 50%;
                    left: 85px;
                    z-index: 200;
                    transform: translate(-50%, -50%);
                }
            }
            .ant-table-cell-with-append {
                padding-left: 66px;
            }
            .ant-table-cell-fix-right-first {
                background-color: #fafafa;
            }
        }

        :deep(.ant-table-tbody > tr.ant-table-row:hover > td, .ant-table-tbody > tr > td.ant-table-cell-row-hover) {
            background-color: #f9fbff;
        }

        :deep(.ant-table-row-selected) {
            .ant-table-cell-fix-right-first {
                background-color: #e6f7ff !important;
            }
        }
        :deep(
                .ant-table-tbody > tr.ant-table-row-selected:hover > td,
                .ant-table-tbody > tr > td.ant-table-cell-row-hover
            ) {
            background-color: #e6f7ff !important;
        }
        :deep(.ant-table-cell) {
            .sales_area_list {
                width: 200px;
                display: inline-block;
                overflow: hidden; /*超出长度的文字隐藏*/
                text-overflow: ellipsis; /*文字隐藏以后添加省略号*/
                white-space: nowrap; /*强制不换行*/
                cursor: pointer;
                .sales_area_item {
                    margin-right: 8px;
                }
            }
        }
    }
}
.ml-8 {
    margin-left: 8px;
}
.import-modal {
    .title {
        .fcc(initial);
        font-size: 14px;
        color: #26ab54;
        line-height: 16px;
        img {
            width: 16px;
            height: 16px;
            margin-right: 4px;
        }
        margin-bottom: 6px;
    }
    .dis {
        background: #f8f8f8;
        padding: 4px 7px;
        border-radius: 4px;
        margin-bottom: 17px;
        font-size: 12px;
        color: #666666;
        .success-text {
            color: #26ab54;
        }
        .error-text {
            color: #f53f3f;
        }
    }
    .code {
        background: #ffffff;
        border: 1px solid #e2e2e2;
        border-radius: 4px;
        .border-top {
            border-top: 1px solid #e2e2e2;
        }
        .code-title {
            .fcc(space-between);
            background: #f2f3f5;
            padding: 8px 10px;
            .code-title-l {
                font-size: 14px;
                font-weight: 500;
                color: #1d2129;
                line-height: 16px;
            }
        }
        .code-body {
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            .code-item {
                padding: 3px 7.5px;
                background: #f2f3f5;
                border-radius: 4px;
                width: calc((100% - 16px) / 3);
                margin-right: 8px;
                font-size: 12px;
                color: #1d2129;
                line-height: 14px;
                text-align: center;
                &:nth-child(3n) {
                    margin-right: 0;
                }
                &:nth-child(n + 4) {
                    margin-top: 8px;
                }
            }
        }
        .empty {
            padding: 10px;
            width: 100%;
            .fcc();
        }
    }
    .btns {
        text-align: center;
    }
}
</style>
