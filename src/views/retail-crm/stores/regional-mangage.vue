<template>
    <div>

        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_group.group_man') }}</div>
                <div class="btns-area">
                    <!-- v-if="$auth('crm-order.save')" -->
                    <!-- <a-button type="primary" @click="routerChange('edit')">{{ $t("s.create_area")
                    }}</a-button> -->
                    <CreateArea />
                </div>
            </div>

            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <!-- 搜索门店 -->
                        <a-input :placeholder="$t('s.search_place')" v-model:value="searchName" @pressEnter="searchCity" />
                        <a-button type="primary" @click="searchCity">{{
                            $t("def.search_se")
                        }}</a-button>
                    </a-col>
                </a-row>
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
                                <a-button type="link" @click="routerChange('detail', record)"><span :class="{
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
                        <!-- <template v-if="column.key === 'util'">
                            {{ $Util[column.util](text, $i18n.locale) }}
                        </template> -->
                        <template v-if="column.key === 'operation'">
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

<script >

import Core from "@/core";
import CreateArea from './components/CreateArea.vue';


export default {

    name: "StoreList",
    data() {
        return {
            searchName: '',//v-model
            searchFrom:'',
            // 表格
            tableData: [],
            currPage: 1,
            pageSize: 20,
        }
    },
    components: {
        CreateArea
    },
    watch: {

    },
    computed: {

        tableColumns() {
            let columns = [
                {
                    title: "crm_c.group",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "crm_st.include_city",
                    dataIndex: "city_list",
                    key: "city_list",
                },
                {
                    title: "crm_st.city_count",
                    dataIndex: "city_count",
                    key: "city_count",
                },
                {
                    title: "crm_st.store_count",
                    dataIndex: "store_count",
                    key: "money",
                },
                {
                    title: "crm_region.area_man",
                    dataIndex: "user_id",
                    key: "user_id",
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
        this.getTableData();
        // this.createUserFetch();
    },
    methods: {
        getTableData() {
            Core.Api.RETAIL.regionsList({
                key: this.searchName,
                page: this.currPage,
                page_size: this.pageSize,
            }).then((res) => {
                    console.log("getTableData res:", res);
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
                .catch((err) => {
                    console.log("getTableData err:", err);
                })
        },
        // 搜索区域城市
        searchCity() {
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

    }

}
</script>

<style lang="less" scoped>
.search-item {
    .ant-btn {
        border-radius: 2px;
    }
}

.ant-input {
    border: 1px #FFFFFF solid;
    border-radius: 2px 0px 0px 2px;
}
</style>