<template>
    <div>
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_group.group_man') }}</div>
                <div class="btns-area">
                    <CreateArea @refreshc="refreshc" />
                </div>
            </div>

            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <!-- 搜索门店 -->
                        <!-- a-input :placeholder="$t('s.search_place')" v-model:value="searchName" @pressEnter="searchCity" />
                        <a-button type="primary" @click="searchCity">{{
                            $t("def.search_se")
                        }}</a-button> -->
                        <div class="key">{{ $t('crm_group.search_city') }}：</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('s.search_place')"
                                v-model:value="searchName"
                                @pressEnter="searchCity"
                            />
                            <!--    <a-button type="primary" @click="searchCity">{{
                            $t("def.search_se")
                        }}</a-button>
                        }}</a-button> -->
                        </div>
                    </a-col>
                </a-row>

                <div class="btn-area">
                    <a-button @click="searchCity" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>

            <div class="table-container">
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
                        <!--  <template v-if="column.key === 'uid'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)"><span :class="{
                                    nameStyle: nameBoolean(record),
                                }">
                                        {{ text || "-" }}
                                    </span></a-button>
                            </a-tooltip>
                        </template> -->
                        <template v-if="column.key === 'order_uid'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'city_list'">
                            <!-- {{ text || "-" }} -->

                            <text v-for="(item, index) in text" :key="index">{{
                                item.city + (index + 1 < text.length ? '、' : '')
                            }}</text>
                        </template>
                        <!-- 经理名称 -->
                        <template v-if="column.key === 'user_list'">
                            <div v-if="text.length">
                                <img class="avatar-style" :src="record?.user_list?.avatar" alt="" />
                                <span class="user-name">{{ record?.user_list?.user_name }}</span>
                                <span>{{ record.user_list.employee_no }}</span>
                            </div>
                            <div v-else>-</div>
                        </template>

                        <!-- <template v-if="column.key === 'util'">
                            {{ $Util[column.util](text, $i18n.locale) }}
                        </template> -->
                        <template v-if="column.key === 'operation'">
                            <!-- <a-button type="link" @click="routerChange('edit', record)">{{
                                $t("def.edit")
                            }}</a-button> -->

                            <CreateArea :id="record.id" @refreshc="refreshc" />
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
import CreateArea from './components/CreateArea.vue';

export default {
    name: 'StoreList',
    data() {
        return {
            searchName: '', //v-model
            searchFrom: '',
            // 表格
            tableData: [],
            currPage: 1,
            pageSize: 20,
        };
    },
    components: {
        CreateArea,
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {
                    title: 'crm_c.group',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'crm_st.include_city',
                    dataIndex: 'city_list',
                    key: 'city_list',
                },
                {
                    title: 'crm_st.city_count',
                    dataIndex: 'city_count',
                    key: 'city_count',
                },
                {
                    title: 'crm_st.store_count',
                    dataIndex: 'store_count',
                    key: 'store_count',
                },
                {
                    title: 'crm_region.area_man',
                    dataIndex: 'user_list',
                    key: 'user_list',
                },
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ];
            return columns;
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.getTableData();
        // this.createUserFetch();
    },
    methods: {
        // 刷新列表-子组件控制
        refreshc(data) {
            this.searchName = '';
            this.pageChange(1);
        },
        getTableData() {
            Core.Api.RETAIL.regionsList({
                key: this.searchName,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
                    /*   this.total = res.count;
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
                });
        },
        // 搜索区域城市
        searchCity() {
            this.pageChange(1);
            /*  console.log('搜索区域城市', this.searchName);
             Core.Api.CRMStores.regionsList({
                 key:this.searchName,
                 page: this.currPage,
                 page_size: this.pageSize,
             })
                 .then((res) => {
                     console.log("getTableData res:", res);
                 
                 })
                 .catch((err) => {
                     console.log("getTableData err:", err);
                 }) */
        },

        // 分页
        pageChange(curr) {
            // 页码改变
            console.log('pageChange-------', curr);
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size--------:', current, size);
            this.pageSize = size;
            this.getTableData();
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                // okType: "danger",
                cancelText: this.$t('def.cancel'),
                onOk() {
                    console.log('确定删除');
                    Core.Api.RETAIL.deleteRegion({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success')), _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },

        handleSearchReset() {
            this.searchName = '';
            // this.ispop = false;
            // 重置搜索
            // Object.assign(this.searchForm, this.$options.data().searchForm)
            // this.$refs.CountryCascader.handleReset();
            // this.getTableData();
            this.pageChange(1);
        },
    },
};
</script>

<style lang="less" scoped>
.search-item {
    .ant-btn {
        border-radius: 2px;
    }
}

.ant-input {
    border: 1px #ffffff solid;
    border-radius: 2px 0px 0px 2px;
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
