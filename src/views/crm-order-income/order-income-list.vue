<template>
    <div id="OrderList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_oi.list') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')" v-if="$auth('crm-order-income.save')"><i class="icon i_add"/>{{ $t('crm_oi.save') }}</a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('crm_oi.uid') }}：</div> <!-- 回款单编号 -->
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('crm_oi.status') }}：</div> <!-- 回款单状态 -->
                        <div class="value">
                            <a-select v-model:value="searchForm.status" :placeholder="$t('def.select')" @change="handleSearch">
                                <a-select-option v-for="item of CRM_STATUS_MAP" :key="item.key" :value="item.value">{{ item.zh }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('crm_oi.type') }}：</div> <!-- 回款类型 -->
                        <div class="value">
                            <a-select v-model:value="searchForm.type" :placeholder="$t('def.select')" @change="handleSearch">
                                <a-select-option v-for="item of CRM_TYPE_MAP" :key="item.key" :value="item.value">{{ item.zh }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('crm_oi.payment_type') }}：</div> <!-- 支付方式 -->
                        <div class="value">
                            <a-select v-model:value="searchForm.payment_type" :placeholder="$t('def.select')" @change="handleSearch">
                                <a-select-option v-for="item of CRM_PAYMENT_TYPE_MAP" :key="item.key" :value="item.value">{{ item.zh }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                        <div class="key">{{ $t('crm_oi.date') }}：</div> <!-- 回款日期 -->
                        <div class="value"><TimeSearch @search="handleOtherSearch" :keys="dateTime" ref='DateTimeSearch'/></div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                        <div class="key">{{ $t('crm_oi.money') }}：</div> <!-- 回款金额 -->
                        <div class="value">
                            <a-input-group compact>
                                <a-input
                                    v-model:value="searchForm.money_interval_low"
                                    style="width: 100px; text-align: center"
                                    :placeholder="$t('def.input')"
                                />
                                <a-input
                                    v-model:value="value13"
                                    style="width: 30px; border-left: 0; pointer-events: none; background-color: #fff"
                                    placeholder="-"
                                    disabled
                                />
                                <a-input
                                    v-model:value="searchForm.money_interval_high"
                                    style="width: 100px; text-align: center; border-left: 0"
                                    :placeholder="$t('def.input')"
                                />
                            </a-input-group>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('crm_oi.create_user') }}：</div> <!-- 创建人 -->
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.create_user_id"
                                show-search
                                :placeholder="$t('def.input')"
                                :default-active-first-option="false"
                                :show-arrow="false"
                                :filter-option="false"
                                :not-found-content="null"
                                @search="handleCreateUserSearch"
                            >
                                <a-select-option v-for=" item in createUserOptions" :key="item.create_user_id" :value="item.create_user_id">
                                    {{ item.create_user_name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                        <div class="key">{{ $t('d.create_time') }}：</div>
                        <div class="value"><TimeSearch @search="handleOtherSearch" ref='TimeSearch'/></div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false' @change="getTableDataSorter">
                    <template #headerCell="{title}">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)" v-if="$auth('crm-order-income.detail')">{{text || '-'}}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'uid'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)" v-if="text !== ''">{{text }}</a-button>
                                <a-button type="link" disabled v-else>-</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'order_uid'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail-order', record)" v-if="text !== ''">{{text }}</a-button>
                                <a-button type="link" disabled v-else>-</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'money'">
                            {{$Util.countFilter(text ) + '元' || '-' }}
                        </template>
                        <template v-if="column.key === 'refunded'">
                            {{ text / 100 + '元' || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'util'">
                            {{ $Util[column.util](text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)" v-if="$auth('crm-order-income.detail')"><i class="icon i_detail"/>{{ $t('def.detail') }}</a-button>
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size='pageSize'
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import TimeSearch from '../../components/common/TimeSearch.vue'
export default {
    name: 'OrderList',
    components: {
        TimeSearch
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,

            total: 0,
            orderByFields: {},
            // 搜索
            searchForm: {
                uid: '',
                status: undefined,
                phone:'',
                type: undefined,
                payment_type: undefined,
                create_user_id: undefined,
                money_interval_low: '',
                money_interval_high: '',
                date_begin_time: '',
                date_end_time: '',
                begin_time: '',
                end_time: '',
            },
            dateTime: ['date_begin_time', 'date_end_time'],
            createUserOptions: [], // 创建人列表
            CRM_STATUS_MAP: Core.Const.CRM_ORDER_INCOME.STATUS_MAP, // 回款单状态
            CRM_TYPE_MAP: Core.Const.CRM_ORDER_INCOME.TYPE_MAP, // 回款类型
            CRM_PAYMENT_TYPE_MAP: Core.Const.CRM_ORDER_INCOME.PAYMENT_TYPE_MAP, // 支付方式
            // 表格
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: 'crm_oi.uid', dataIndex:  "uid", key:'uid', sorter: true},
                {title: 'crm_oi.order_uid', dataIndex:  ["order","uid"], key:'order_uid', sorter: true},
                {title: 'crm_oi.status', dataIndex: 'status', key: 'util', util: 'CRMOrderIncomeStatusFilter', sorter: true},
                {title: 'crm_oi.money', dataIndex: 'money', key: 'money', sorter: true},
                {title: 'crm_o.refunded_amount', dataIndex: 'refunded', key:'refunded'},
                {title: 'crm_oi.date', dataIndex: 'date', key: 'time', sorter: true},
                {title: 'crm_oi.type', dataIndex: 'type', key:'util', util: 'CRMOrderIncomeTypeFilter', sorter: true},
                {title: 'crm_oi.payment_type', dataIndex: 'payment_type', key:'util', util: 'CRMOrderIncomePaymentTypeFilter', sorter: true},
                {title: 'd.update_time', dataIndex: 'update_time', key: 'time', sorter: true},
                {title: 'crm_oi.create_user', dataIndex: "create_user_name", key: 'item', sorter: true},
                {title: 'd.create_time', dataIndex: 'create_time', key: 'time', sorter: true},
                {title: 'def.operate', key: 'operation', fixed: 'right'},
            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/crm-order-income/order-income-detail",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/crm-order-income/order-income-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail-order': {
                    routeUrl = this.$router.resolve({
                        path: "/crm-order/order-detail",
                        query: { id: item.order.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                }
            }
        },

        pageChange(curr) {    // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {    // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {    // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) { // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key]
            }
            this.pageChange(1);
        },
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.$refs.TimeSearch.handleReset()
            this.$refs.DateTimeSearch.handleReset()
            this.orderByFields = {}
            this.pageChange(1);
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMOrderIncome.list({
                ...this.searchForm,
                order_by_fields: this.orderByFields,
                page: this.currPage,
                page_size: this.pageSize,
                search_type: 10,
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = res.list;
                console.log("🚀 ~ file: order-list.vue ~ line 229 ~ getTableData ~ this.tableData", this.tableData)
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getTableDataSorter( paginate, sort, filter){
            this.orderByFields = {}
            switch (filter.order){
                case "ascend":
                    this.orderByFields[filter.field] =  0
            }
            switch (filter.order){
                case "descend":
                    this.orderByFields[filter.field] =  1
            }
            this.getTableData()
        },
        handleCreateUserSearch(name) { // 创建人条件搜索 下拉框
            Core.Api.CRMOrderIncome.createUser({
                create_user_name: name,
            }).then(res => {
                this.createUserOptions = res.list
            })
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Order.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success')),
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
    }
};
</script>

<style lang="less" scoped>
// #OrderList {}
</style>
