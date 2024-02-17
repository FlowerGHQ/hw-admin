<template>
    <div id="StoreList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('s.store_list') }}</div>
                <!-- <div class="btns-area">
              <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add" />{{ $t("crm_st.add_st")
              }}</a-button>
        </div> -->
            </div>
            <div class="search-container" style="background-color: #fff">
                <a-row class="search-area" style="width: 100%">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key" style="width: 110px; margin-left: -10px; display: flex; align-items: center">
                            {{ searchForm.search_type == 1 ? $t('crm_st.search_name') : $t('crm_st.search_man') }}：
                            <div class="triangle" @click="triangleClick">
                                <img
                                    src="../../../assets//images/retail/CaretDown.png"
                                    alt=""
                                    style="height: 16px; width: 16px"
                                />
                                <div class="triangle-pop" v-if="ispop">
                                    <div
                                        class="sel"
                                        :class="{ checked: searchForm.search_type == 1 }"
                                        @click.stop="changeSearch(1)"
                                    >
                                        {{ $t('crm_st.search_name') }}
                                    </div>
                                    <div
                                        class="sel"
                                        :class="{ checked: searchForm.search_type == 2 }"
                                        @click.stop="changeSearch(2)"
                                    >
                                        {{ $t('crm_st.search_man') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 搜索门店 -->
                        <div class="value">
                            <a-input
                                :placeholder="
                                    searchForm.search_type == 1 ? $t('s.place_store_name') : $t('s.place_store_man')
                                "
                                v-model:value="searchForm.key"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('crm_st.area') }}：</div>
                        <!-- 所属区域 -->
                        <div class="value">
                            <a-select v-model:value="searchForm.group_id" :placeholder="$t('def.select')" allowClear>
                                <!-- <a-select-option :value="0">
                                    {{ lang === "zh" ? "全部" : "all" }}
                                </a-select-option> -->
                                <a-select-option v-for="item of regionsList" :key="item.id" :value="item.value">{{
                                    item.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('crm_st.city') }}：</div>
                        <!-- 所属城市 -->
                        <div class="value">
                            <!-- <China2Address @search="handleOtherSearch" ref='CountryCascader' /> -->
                            <a-select
                                v-model:value="searchForm.city"
                                :disabled="searchForm.group_id == undefined"
                                :placeholder="$t('def.select')"
                                allowClear
                            >
                                <!-- <a-select-option :value="0">
                                    {{ lang === "zh" ? "全部" : "all" }}
                                </a-select-option> -->
                                <a-select-option v-for="item of cityList" :key="item.id" :value="item.city">{{
                                    item.city
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <template v-if="show">
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                            <div class="key">{{ $t('crm_st.type') }}：</div>
                            <!-- 门店类型 -->
                            <div class="value">
                                <a-select v-model:value="searchForm.type" :placeholder="$t('def.select')" allowClear>
                                    <a-select-option v-for="item of STORE_TYPE" :key="item.key" :value="item.value">{{
                                        lang === 'zh' ? item.zh : item.en
                                    }}</a-select-option>
                                </a-select>
                            </div>
                        </a-col>

                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                            <div class="key">{{ $t('crm_st.status') }}：</div>
                            <!-- 营业状态 -->
                            <div class="value">
                                <a-select v-model:value="searchForm.status" :placeholder="$t('def.select')" allowClear>
                                    <a-select-option v-for="item in STORE_STATUS" :key="item.key" :value="item.value"
                                        >{{ lang === 'zh' ? item.zh : item.en }}
                                    </a-select-option>
                                </a-select>
                            </div>
                        </a-col>

                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                            <div class="key">{{ $t('crm_st.level') }}：</div>
                            <!-- 门店级别 -->
                            <div class="value">
                                <a-select v-model:value="searchForm.level" :placeholder="$t('def.select')" allowClear>
                                    <a-select-option v-for="item in STORE_LEVEL" :key="item.key" :value="item.value"
                                        >{{ lang === 'zh' ? item.zh : item.en }}
                                    </a-select-option>
                                </a-select>
                            </div>
                        </a-col>
                    </template>

                    <a-col :xs="24" :sm="24" :xl="2" :xxl="3" class="search-item search-text" @click="moreSearch">
                        {{ show ? $t('search.stow') : $t('retail.more_screening') }}
                        <i class="icon i_xialajiantouxiao" style="margin-left: 5px" v-if="!show"></i>
                        <i class="icon i_shouqijiantouxiao" style="margin-left: 5px" v-else></i>
                    </a-col>
                </a-row>

                <!--  <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{
                        $t("def.search")
                    }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t("def.reset") }}</a-button>
                </div> -->
            </div>

            <div class="table-container">
                <!--  <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add" />{{ $t("crm_st.add_st")
                    }}</a-button>
        </div>  -->
                <div class="btns">
                    <div class="btn-left">
                        <!-- 添加人员 -->
                        <a-button type="primary" @click="routerChange('edit')">
                            <i class="icon i_add" />
                            {{ $t('crm_st.add_st') }}
                        </a-button>
                    </div>
                    <div class="btn-right">
                        <a-button @click="handleSearchReset">
                            {{ $t('def.reset') }}
                        </a-button>
                        <a-button @click="handleSearch" type="primary">
                            {{ $t('def.search') }}
                        </a-button>
                    </div>
                </div>

                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    @change="getTableDataSorter"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'name'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)"
                                    ><span
                                        :class="{
                                            nameStyle: nameBoolean(record),
                                        }"
                                        class="hid"
                                    >
                                        {{ text || '-' }}
                                    </span></a-button
                                >
                            </a-tooltip>
                        </template>
                        <template v-else-if="column.key === 'group_name'">
                            {{ text && record.city ? text + '-' + record.city : text || '-' }}
                        </template>
                        <template v-else-if="column.key === 'order_uid'">
                            {{ text || '-' }}
                        </template>
                        <template v-else-if="column.key === 'address'">
                            <a-tooltip placement="top" :title="text">
                                <span class="hid">
                                    {{ text || '-' }}
                                </span>
                            </a-tooltip>
                        </template>

                        <template v-else-if="column.key === 'level'">
                            {{ $Util.storeLevel(text, lang) || '-' }}
                        </template>
                        <template v-else-if="column.key === 'status'">
                            {{ $Util.storeSTATUS(text) || '-' }}
                        </template>
                        <template v-else-if="column.key === 'type'">
                            {{ $Util.storeType(text) || '-' }}
                        </template>
                        <template v-else-if="column.key === 'user_list'">
                            <div v-if="text.length">
                                <img v-if="text[0].avatar" class="avatar-style" :src="text[0].avatar" alt="" />
                                <span class="user-name">{{ text[0].user_name }}</span>
                                <span>{{ text[0].employee_no }}</span>
                            </div>
                            <div v-else>-</div>
                        </template>
                        <template v-else-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)">{{ $t('def.see') }}</a-button>

                            <a-button type="link" @click="routerChange('edit', record)">{{ $t('def.edit') }}</a-button>

                            <a-button type="link" danger @click="handleDelete(record.id)">{{
                                $t('def.delete')
                            }}</a-button>
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
    </div>
</template>

<script>
import Core from '@/core';
import China2Address from '@/components/common/China2Address.vue';
export default {
    name: 'StoreList',
    data() {
        return {
            nameColor: [], // 表格名字点击存进去数组,判断点击跳转后原先name颜色的
            show: false,
            // 加载
            // loading: false,
            orderByFields: {},
            // 搜索门店名称及弹窗
            ispop: false,
            searchForm: {
                search_type: 1,
                key: '',
                group_id: undefined,
                type: undefined, // 1:A类 2:B类 3:C类
                level: undefined, // 1:零售体验中心 2:零售体验店 3:交付中心 4:维修服务中心 5:体验展厅 6:活动展会
                status: undefined, // 1:装修 2:试营业 3:开业
                province: '',
                city: undefined,
            },
            // 区域列表
            regionsList: [],
            dateTime: ['date_begin_time', 'date_end_time'],
            createUserOptions: [], // 创建人列表
            STORE_STATUS: Core.Const.RETAIL.STORE_STATUS, // 门店状态
            STORE_LEVEL: Core.Const.RETAIL.STORE_LEVEL, // 门店等级
            STORE_TYPE: Core.Const.RETAIL.STORE_TYPE, // 门店类型
            // 表格
            tableData: [],

            currPage: 1,
            pageSize: 20,
            total: 0,
            defAddr: [],
        };
    },
    components: {
        China2Address,
    },
    watch: {
        searchForm: {
            deep: true,
            handler(oldValue, newValue) {
                if (oldValue === newValue) {
                    this.currPage = 1;
                    this.pageSize = 20;
                }

                if (newValue.group_id == undefined || oldValue.group_id != newValue.group_id) {
                    this.searchForm.city = undefined;
                }
            },
        },
    },
    computed: {
        lang() {
            return this.$store.state.lang;
        },
        tableColumns() {
            let columns = [
                {
                    title: 'crm_c.name',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'crm_c.group',
                    dataIndex: 'group_name',
                    key: 'group_name',
                },
                {
                    title: 'crm_st.type',
                    dataIndex: 'type',
                    key: 'type',
                    util: 'CRMOrderIncomeStatusFilter',
                },
                {
                    title: 'crm_st.level',
                    dataIndex: 'level',
                    key: 'level',
                },
                {
                    title: 'crm_st.manager',
                    dataIndex: 'user_list',
                    key: 'user_list',
                },
                {
                    title: 'crm_st.people',
                    dataIndex: 'user_count',
                    key: 'user_count',
                },
                {
                    title: 'crm_st.status',
                    dataIndex: 'status',
                    key: 'status',
                    util: 'CRMOrderIncomeTypeFilter',
                },
                {
                    title: 'ad.specific_address',
                    dataIndex: 'address',
                    key: 'address',
                },
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ];
            return columns;
        },
        lang() {
            return this.$store.state.lang;
        },

        // 区域城市
        cityList() {
            let list = [];
            list = this.regionsList.filter(el => {
                return this.searchForm.group_id == el.id;
            });
            return list[0]?.city_list || [];
        },
    },
    mounted() {
        this.getTableData();
        this.getRegionsData();
        // this.createUserFetch();
    },
    methods: {
        nameBoolean(v) {
            const arr = this.nameColor.filter(el => {
                return el.id == v.id;
            });
            return arr.length ? true : false;
        },
        /* 接口 */
        // 创建人接口
        createUserFetch(params = {}) {
            Core.Api.CRMOrderIncome.createUser({
                ...params,
            }).then(res => {
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
            let routeUrl = '';
            switch (type) {
                // 创建（编辑）门店
                case 'edit':
                    routeUrl = this.$router.resolve({
                        path: '/stores-vehicle/store-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;

                case 'detail': // 查看
                    if (!this.$Util.isEmptyObj(item)) {
                        this.nameColor.push({ id: item.id });
                    }
                    routeUrl = this.$router.resolve({
                        path: '/stores-vehicle/stores-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                /*  
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
        handleSearch() {
            this.pageChange(1);
        },
        // 外部组件方法
        /*  handleOtherSearch(params) {
             for (const key in params) {
                 this.searchForm[key] = params[key]
             }
         }, */
        handleSearchReset() {
            this.ispop = false;
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            // this.$refs.CountryCascader.handleReset();
            // this.getTableData();
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            // this.loading = true;
            Core.Api.RETAIL.storeList({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    this.total = res.count;
                    this.tableData = res.list;
                    /*    this.total = res.count;
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
                       ); */
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    // this.loading = false;
                });
        },
        // 获取区域
        getRegionsData() {
            Core.Api.RETAIL.regionsList({
                key: '',
            })
                .then(res => {
                    this.regionsList = res.list;
                })
                .catch(err => {
                    console.log('getRegionsData err:', err);
                });
        },
        getTableDataSorter(paginate, sort, filter) {
            this.orderByFields = {};
            switch (filter.order) {
                case 'ascend':
                    this.orderByFields[filter.field] = 0;
            }
            switch (filter.order) {
                case 'descend':
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
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                // okType: "danger",
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.RETAIL.deleteStore({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success')), _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },

        // 城市选择
        handleAddressSelect(address = []) {
            this.defAddr = Core.Util.deepCopy(address);
            this.msgForm.province = address[0] ? address[0] : '';
            this.msgForm.city = address[1] ? address[1] : '';
            this.msgForm.county = address[2] ? address[2] : '';
        },
        // 点击搜索门店-切换pop
        triangleClick() {
            this.ispop = true;
        },
        // 切换搜索名称类型（门店、店铺）
        changeSearch(num) {
            this.ispop = false;
            this.searchForm.search_type = num;
        },
        // 分页
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
    },
};
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

.triangle {
    display: inline-block;
    cursor: pointer;
    position: relative;

    .triangle-pop {
        width: 100px;
        position: absolute;
        left: -80px;
        z-index: 100;
        background-color: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid var(--color-border-2, #e5e6eb);
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
        padding-top: 5px;

        .sel {
            height: 24px;
            line-height: 24px;
            width: 100%;
            text-align: center;
            margin-bottom: 5px;
        }

        .checked {
            background: var(--color-fill-2, #f2f3f5);
        }
    }
}

.btns {
    .fcc(space-between);
    margin-bottom: 20px;
    margin-top: -15px;
    .btn-left {
        .left-btn-style {
            background-color: #94bfff;
            color: #ffffff;
        }
    }
}

.hid {
    display: block;
    width: 20em;
    overflow: hidden;
    /* 显示省略符号来代表被修剪的文本。 */
    text-overflow: ellipsis;
    /* 文本不换行 */
    white-space: nowrap;
    text-align: left;
}

.avatar-style {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
}
.user-name {
    margin-right: 8px;
}
</style>
