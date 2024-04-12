<template>
    <div id="LabelList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('sl.list') }}</div>
                <!-- <div class="btns-area">-->
                <!--     <a-button type="primary" @click="handleModalShow()"><i class="icon i_add"/>{{ $t('sl.save') }}</a-button>-->
                <!--     &lt;!&ndash; <a-button type="primary" @click="routerChange('edit')" ><i class="icon i_add"/>{{ $t('sl.save') }}</a-button> &ndash;&gt;-->
                <!-- </div>-->
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('sl.classification') }}：</div>
                        <!-- 标签分类 -->
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.category"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                            >
                                <a-select-option :value="0">
                                    {{ lang === 'zh' ? '全部' : 'all' }}
                                </a-select-option>
                                <a-select-option
                                    v-for="item of LABEl_CATEGORY_MAP"
                                    :key="item.key"
                                    :value="item.value"
                                    >{{ lang === 'zh' ? item.zh : item.en }}</a-select-option
                                >
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('sl.name') }}：</div>
                        <!-- 标签名称 -->
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.name"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <!--                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">-->
                    <!--                        <div class="key">{{ $t('r.creator_name') }}：</div> &lt;!&ndash; 创建人 &ndash;&gt;-->
                    <!--                        <div class="value">-->
                    <!--                            <a-select v-model:value="searchForm.user_name" :placeholder="$t('def.select')" @change="handleSearch">-->
                    <!--                                <a-select-option v-for="item of LABEl_CATEGORY_MAP" :key="item.key" :value="item.value">{{ item.zh }}</a-select-option>-->
                    <!--                            </a-select>-->
                    <!--                        </div>-->
                    <!--                    </a-col>-->
                    <!--                    <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">-->
                    <!--                        <div class="key">{{ $t('r.create_time') }}：</div>-->
                    <!--                        <div class="value"><TimeSearch @search="handleOtherSearch" ref='TimeSearch'/></div>-->
                    <!--                    </a-col>-->
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <!-- <div class="operate-container">-->
            <!--     <a-button type="danger" @click="handleBatchDelete">{{ $t('def.delete') }}</a-button>-->
            <!-- </div>-->
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    :row-selection="rowSelection"
                    @change="getTableDataSorter"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'category'">
                            {{ $Util.CRMLabelCategoryMapFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange(record.target_type, record)"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                            >
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container with-operate">
                <div class="tip">
                    {{ $t('in.selected') + ` ${selectedRowItems.length} ` + $t('in.total') }}
                </div>
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
import Core from '../../core';
import TimeSearch from '../../components/common/TimeSearch.vue';
export default {
    name: 'LabelList',
    components: {
        TimeSearch,
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            LABEl_CATEGORY_MAP: Core.Const.LABEl.CATEGORY_MAP,
            orderByFields: {},
            // 搜索
            searchForm: {
                name: '',
                user_name: '',
                begin_time: '',
                end_time: '',
                target_type: '',
                category: 0,
            },
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格
            tableData: [],
            selectedRowKeys: [],
            selectedRowItems: [],
            selectedRowItemsAll: [],
            modalVisible: false,
            editForm: {
                // id: '',
                // parent_id: '',
                // name: '',
                // name_en: '',
                // index: '',
                // index_key: '',
            },
        };
    },
    computed: {
        lang() {
            return this.$store.state.lang;
        },
        tableColumns() {
            let columns = [
                {
                    title: 'crm_o.customer_name',
                    dataIndex: 'customer_name',
                    key: 'item',
                },
                // {title: 'sl.principal', dataIndex: 'own_user_name', key:'item'},
                {
                    title: 'sl.classification',
                    dataIndex: 'target_type',
                    key: 'category',
                },
                { title: 'sl.name', dataIndex: 'labels', key: 'labels' },
                // {title: 'd.create_time', dataIndex: 'create_time', key: 'time'},
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ];
            return columns;
        },
        rowSelection() {
            return {
                type: 'checkbox',
                selectedRowKeys: this.selectedRowKeys,
                preserveSelectedRowKeys: true,
                onChange: (selectedRowKeys, selectedRows) => {
                    // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys;
                    this.selectedRowItemsAll.push(...selectedRows);
                    let selectedRowItems = [];
                    selectedRowKeys.forEach(id => {
                        let element = this.selectedRowItemsAll.find(i => i.id == id);
                        selectedRowItems.push(element);
                    });
                    this.selectedRowItems = selectedRowItems;
                    console.log(
                        'rowSelection this.selectedRowKeys:',
                        this.selectedRowKeys,
                        'selectedRowItems:',
                        selectedRowItems,
                    );
                    // this.$emit('submit', this.selectedRowKeys, this.selectedRowItems)
                },
            };
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case Core.Const.CRM_LABEL.CATEGORY.CUSTOMER:
                    routeUrl = this.$router.resolve({
                        path: '/crm-customer/customer-detail',
                        query: { id: item.target_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case Core.Const.CRM_LABEL.CATEGORY.BO:
                    routeUrl = this.$router.resolve({
                        path: '/crm-bo/bo-detail',
                        query: { id: item.target_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case Core.Const.CRM_LABEL.CATEGORY.ORDER:
                    routeUrl = this.$router.resolve({
                        path: '/crm-order/order-detail',
                        query: { id: item.target_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case Core.Const.CRM_LABEL.CATEGORY.ORDER_INCOME:
                    routeUrl = this.$router.resolve({
                        path: '/crm-order-income/order-income-detail',
                        query: { id: item.target_id },
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
            console.log('pageSizeChange size:', size);
            this.pageSize = size;
            this.getTableData();
        },
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) {
            // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key];
            }
            this.pageChange(1);
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.$refs.TimeSearch.handleReset();
            this.orderByFields = {};
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMLabelBind.labelList({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
                    console.log('🚀 ~ file: order-list.vue ~ line 229 ~ getTableData ~ this.tableData', this.tableData);
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // handleDelete(id) {
        //     let _this = this;
        //     this.$confirm({
        //         title: this.$t('pop_up.sure_delete'),
        //         okText: this.$t('def.sure'),
        //         okType: 'danger',
        //         cancelText: this.$t('def.cancel'),
        //         onOk() {
        //             Core.Api.Order.delete({id}).then(() => {
        //                 _this.$message.success(_this.$t('pop_up.delete_success')),
        //                 _this.getTableData();
        //             }).catch(err => {
        //                 console.log("handleDelete err", err);
        //             })
        //         },
        //     });
        // },
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
        handleBatchDelete() {
            if (this.selectedRowKeys.length === 0) {
                return this.$message.warning(this.$t('crm_c.select'));
            }
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    // Core.Api.CRMCustomer.delete({id_list: _this.selectedRowKeys}).then(() => {
                    //     _this.$message.success(_this.$t('pop_up.delete_success'));
                    //         _this.getTableData();
                    // }).catch(err => {
                    //     console.log("handleDelete err", err);
                    // })
                },
            });
        },

        // 编辑与新增标签
        handleModalShow() {
            this.modalVisible = true;
        },
        handleModalSubmit() {
            // let form = Core.Util.deepCopy(this.editForm)
            // if (!form.name) {
            //     return this.$message.warning(this.$t('def.enter'))
            // }
            // if (!form.name_en) {
            //     return this.$message.warning(this.$t('def.enter'))
            // }
            // form.key = form.index_key
            // this.loading = true
            // let apiName = form.id ? 'update' : 'save';
            // Core.Api.ItemCategory[apiName](form).then(res => {
            //     this.$message.success(this.$t('pop_up.save_success'))
            //     if (form.parent_id == 0) {
            //         this.getDataById()
            //     } else if (form.id) {
            //         this.getDataById(form.id, this.editNode)
            //     } else {
            //         this.getDataByParent(form.parent_id, this.parentNode)
            //     }
            //     if (form.parent_id !== 0) {
            //         let index = this.expandedRowKeys.indexOf(form.parent_id)
            //         this.expandedRowKeys.splice(index, 1)
            //     } else {
            //         this.expandedRowKeys = []
            //     }
            //     this.modalVisible = false
            // }).catch(err => {
            //     console.log('handleModalSubmit err:', err)
            // }).finally(() => {
            //     this.loading = false
            // })
        },
    },
};
</script>

<style lang="less" scoped>
// #LabelList{}
</style>
