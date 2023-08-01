<template>
    <div id="StoreList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">门店管理</div>
                <div class="btns-area">
                    <!-- v-if="$auth('crm-order.save')" -->
                    <a-button type="primary" @click="routerChange('edit')" ><i class="icon i_add" />{{ $t("crm_st.add_st") }}</a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t("crm_st.search_name") }}：</div>
                        <!-- 搜索门店 -->
                        <div class="value">
                            <a-input :placeholder="$t('crm_st.search_placeholder')" v-model:value="searchForm.name"
                                @keydown.enter="handleSearch" />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t("crm_st.area") }}：</div>
                        <!-- 所属区域 -->
                        <div class="value">
                            <a-select v-model:value="searchForm.status" :placeholder="$t('def.select')"
                                @change="handleSearch">
                                <a-select-option :value="0">
                                    {{ lang === "zh" ? "全部" : "all" }}
                                </a-select-option>
                                <a-select-option v-for="item of CRM_STATUS_MAP" :key="item.key" :value="item.value">{{
                                    lang === "zh" ? item.zh : item.en
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t("crm_st.city") }}：</div>
                        <!-- 所属城市 -->
                        <div class="value">
                            <a-select v-model:value="searchForm.status" :placeholder="$t('def.select')"
                                @change="handleSearch">
                                <a-select-option :value="0">
                                    {{ lang === "zh" ? "全部" : "all" }}
                                </a-select-option>
                                <a-select-option v-for="item of CRM_STATUS_MAP" :key="item.key" :value="item.value">{{
                                    lang === "zh" ? item.zh : item.en
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <template v-if="show">
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                            <div class="key">{{ $t("crm_st.type") }}：</div>
                            <!-- 门店类型 -->
                            <div class="value">
                                <a-select v-model:value="searchForm.payment_type" :placeholder="$t('def.select')"
                                    @change="handleSearch">
                                    <a-select-option :value="0">
                                        {{ lang === "zh" ? "全部" : "all" }}
                                    </a-select-option>
                                    <a-select-option v-for="item of CRM_PAYMENT_TYPE_MAP" :key="item.key"
                                        :value="item.value">{{
                                            lang === "zh" ? item.zh : item.en
                                        }}</a-select-option>
                                </a-select>
                            </div>
                        </a-col>

                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                            <div class="key">{{ $t("crm_st.status") }}：</div>
                            <!-- 营业状态 -->
                            <div class="value">
                                <a-select v-model:value="searchForm.payment_type" show-search :placeholder="$t('def.input')"
                                    :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                                    :not-found-content="null" allowClear @search="handleCreateUserSearch">
                                    <a-select-option v-for="item in CRM_PAYMENT_TYPE_MAP" :key="item.key"
                                        :value="item.value">{{
                                            lang === "zh" ? item.zh : item.en
                                        }}
                                    </a-select-option>
                                </a-select>
                            </div>
                        </a-col>

                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                            <div class="key">{{ $t("crm_st.level") }}：</div>
                            <!-- 门店级别 -->
                            <div class="value">
                                <a-select v-model:value="searchForm.payment_type" show-search :placeholder="$t('def.input')"
                                    :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                                    :not-found-content="null" allowClear @search="handleCreateUserSearch">
                                    <a-select-option v-for="item in CRM_PAYMENT_TYPE_MAP" :key="item.key"
                                        :value="item.value">{{
                                            lang === "zh" ? item.zh : item.en
                                        }}
                                    </a-select-option>
                                </a-select>
                            </div>
                        </a-col>

                    </template>

                    <a-col :xs="24" :sm="24" :xl="2" :xxl="3" class="search-item search-text" @click="moreSearch">
                        {{
                            show
                            ? $t("search.stow")
                            : $t("search.advanced_search")
                        }}
                        <i class="icon i_xialajiantouxiao" style="margin-left: 5px" v-if="!show"></i>
                        <i class="icon i_shouqijiantouxiao" style="margin-left: 5px" v-else></i>
                    </a-col>
                </a-row>

                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{
                        $t("def.search")
                    }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t("def.reset") }}</a-button>
                </div>
            </div>

            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                    :row-key="(record) => record.id" :pagination="false" @change="getTableDataSorter">
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                       
                        <template v-if="column.key === 'uid'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)" ><span :class="{
                                        nameStyle: nameBoolean(record),
                                    }">
                                        {{ text || "-" }}
                                    </span></a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'order_uid'">
                            {{ text || "-" }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || "-" }}
                        </template>
                        <template v-if="column.key === 'money'">
                            {{ record.mType
                            }}{{ $Util.countFilter(text) || "-" }}
                        </template>
                        <template v-if="column.key === 'refunded'">
                            {{ record.mType }}{{ text / 100 || "-" }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'util'">
                            {{ $Util[column.util](text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)">{{
                                $t("def.see")
                            }}</a-button>

                            <a-button type="link" @click="routerChange('edit', record)">{{
                                $t("def.edit")
                            }}</a-button>

                            <a-button type="link" danger @click="routerChange('delete', record)">{{
                                $t("def.delete")
                            }}</a-button>
                        </template>
                    </template>
                </a-table>
            </div>

            <div class="paging-container">
                <a-pagination v-model:current="currPage" :page-size="pageSize" :total="total" show-quick-jumper
                    show-size-changer show-less-items :show-total="(total) => $t('n.all_total') + ` ${total} ` + $t('in.total')
                        " :hide-on-single-page="false" :pageSizeOptions="['10', '20', '30', '40']" @change="pageChange"
                    @showSizeChange="pageSizeChange" />
            </div>

        </div>
    </div>
</template>

<script>

import Core from "@/core";
export default {
    name: "StoreList",
    data() {
        return {
            nameColor: [], // 表格名字点击存进去数组,判断点击跳转后原先name颜色的
            show: false,
            // 加载
            loading: false,
            orderByFields: {},
            searchForm: {

                name: "",
                status: 0,
                phone: "",
                type: 0,
                payment_type: 0,
                create_user_id: undefined,
                money_interval_low: "",
                money_interval_high: "",
                date_begin_time: "",
                date_end_time: "",
                begin_time: "",
                end_time: ""
            },
            dateTime: ["date_begin_time", "date_end_time"],
            createUserOptions: [], // 创建人列表
            CRM_STATUS_MAP: Core.Const.CRM_ORDER_INCOME.STATUS_MAP, // 回款单状态
            CRM_TYPE_MAP: Core.Const.CRM_ORDER_INCOME.TYPE_MAP, // 回款类型
            CRM_PAYMENT_TYPE_MAP: Core.Const.CRM_ORDER_INCOME.PAYMENT_TYPE_MAP, // 支付方式
            // 表格
            tableData: [],

            currPage: 1,
            pageSize: 20,
        }
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler() {
                // 这两句刷新页面的时候，页数在之前的页数
                this.currPage = Core.Data.getItem("currPage")
                    ? Core.Data.getItem("currPage")
                    : 1;
                this.pageSize = Core.Data.getItem("pageSize")
                    ? Core.Data.getItem("pageSize")
                    : 20;
                this.getTableData();
                // this.handleSearchReset(false);
                // this.getUserData();
            },
        },
        searchForm: {
            deep: true,
            handler(oldValue, newValue) {
                if (oldValue === newValue) {
                    this.currPage = 1;
                    this.pageSize = 20;
                }
            },
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                {
                    title: "crm_c.name",
                    dataIndex: "uid",
                    key: "uid",
                    sorter: true,
                },
                {
                    title: "crm_c.group",
                    dataIndex: ["order", "uid"],
                    key: "order_uid",
                    sorter: true,
                },
                {
                    title: "crm_st.type",
                    dataIndex: "status",
                    key: "util",
                    util: "CRMOrderIncomeStatusFilter",
                    sorter: true,
                },
                {
                    title: "crm_st.level",
                    dataIndex: "money",
                    key: "money",
                    sorter: true,
                },
                {
                    title: "crm_st.manager",
                    dataIndex: "refunded",
                    key: "refunded",
                },
                {
                    title: "crm_st.people",
                    dataIndex: "date",
                    key: "time",
                    sorter: true,
                },
                {
                    title: "crm_st.status",
                    dataIndex: "type",
                    key: "util",
                    util: "CRMOrderIncomeTypeFilter",
                    sorter: true,
                },
                {
                    title: "ad.specific_address",
                    dataIndex: "update_time",
                    key: "time",
                    sorter: true,
                },
                { title: "def.operate", key: "operation", fixed: "right" },
            ];
            return columns;
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        // this.getTableData();
        // this.createUserFetch();
    },
    methods: {
        nameBoolean(v) {
            const arr = this.nameColor.filter((el) => {
                return el.id == v.id;
            });
            return arr.length ? true : false;
        },
        /* 接口 */
        // 创建人接口
        createUserFetch(params = {}) {
            Core.Api.CRMOrderIncome.createUser({
                ...params,
            }).then((res) => {
                // console.log('测试', res);
                if (this.$Util.isEmptyObj(params)) {
                    this.createUserOptions = take(res.list, 50);
                } else {
                    this.createUserOptions = res.list;
                }
            });
        },
        moreSearch() {
            this.show = !this.show;
        },
        routerChange(type, item = {}) {
            let routeUrl = "";
            switch (type) {
                // 创建门店
                case "edit": 
                    
                    routeUrl = this.$router.resolve({
                        path: "/stores-vehicle/store-edit",
                        query: { id: item.id }
                    });
                    window.open(routeUrl.href, "_blank");
                    break;
               /*  case "detail": // 查看
                    if (!this.$Util.isEmptyObj(item)) {
                        this.nameColor.push({ id: item.id });
                    }
                    routeUrl = this.$router.resolve({
                        path: "/crm-order-income/order-income-detail",
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, "_blank");
                    break;
                case "edit": // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/crm-order-income/order-income-edit",
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, "_blank");
                    break;
                case "detail-order": 
                    {
                        routeUrl = this.$router.resolve({
                            path: "/crm-order/order-detail",
                            query: { id: item.order.id },
                        });
                        window.open(routeUrl.href, "_blank");
                        break;
                    } */
            }
        },
        handleSearch() { },
        handleOtherSearch(params) { },
        handleSearchReset() { },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMOrderIncome.list({
                ...this.searchForm,
                order_by_fields: this.orderByFields,
                page: this.currPage,
                page_size: this.pageSize,
                search_type: 10,
            })
                .then((res) => {
                    console.log("getTableData res:", res);
                    this.total = res.count;
                    this.tableData = res.list;
                    this.tableData.map((item, index) => {
                        switch (item.currency) {
                            case "usd":
                                item.mType = "$";
                                break;
                            case "eur":
                                item.mType = "€";
                                break;
                        }
                    });
                    console.log(
                        "🚀 ~ file: order-list.vue ~ line 229 ~ getTableData ~ this.tableData",
                        this.tableData
                    );
                })
                .catch((err) => {
                    console.log("getTableData err:", err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getTableDataSorter(paginate, sort, filter) {
            this.orderByFields = {};
            switch (filter.order) {
                case "ascend":
                    this.orderByFields[filter.field] = 0;
            }
            switch (filter.order) {
                case "descend":
                    this.orderByFields[filter.field] = 1;
            }
            this.getTableData();
        },
        handleCreateUserSearch(name) {
            // 创建人条件搜索 下拉框
            this.createUserFetch({
                create_user_name: name,
            });
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: this.$t("pop_up.sure_delete"),
                okText: this.$t("def.sure"),
                okType: "danger",
                cancelText: this.$t("def.cancel"),
                onOk() {
                    Core.Api.Order.delete({ id })
                        .then(() => {
                            _this.$message.success(
                                _this.$t("pop_up.delete_success")
                            ),
                                _this.getTableData();
                        })
                        .catch((err) => {
                            console.log("handleDelete err", err);
                        });
                },
            });
        },
    },

}

</script>
<style lang="less" scoped>
.search-text {
    margin-left: 30px;
    color: #006ef9;
    cursor: pointer;
}

.nameStyle {
    color: #9000f0;
}
</style>