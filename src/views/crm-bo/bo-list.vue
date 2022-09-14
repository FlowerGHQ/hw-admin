<template>
    <div id="CustomerList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_b.list') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')" ><i class="icon i_add"/>{{ $t('crm_b.save') }}</a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('crm_b.name') }}：</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('crm_b.customer_name') }}：</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.phone" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('crm_b.own_user_name') }}：</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.phone" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('crm_b.status') }}：</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" :placeholder="$t('def.select')" @change="handleSearch">
                                <a-select-option v-for="item of CRM_TYPE_MAP" :key="item.key" :value="item.value">{{ item.zh }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
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
<!--                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                            </a-tooltip>
                        </template>-->
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'phone'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.CRMCustomerTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'level'">
                            {{ $Util.CRMCustomerLevelFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'address'">
                            {{ $Util.addressFilter(record, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail',record)" v-if="$auth('customer.detail')"><i class="icon i_detail"/>{{ $t('def.detail') }}</a-button>
                            <a-button type="link" @click="routerChange('edit',record)" v-if="$auth('customer.save')"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>
                            <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="$auth('customer.delete')"><i class="icon i_delete"/> {{ $t('def.delete') }}</a-button>
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
    name: 'CustomerList',
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

            CRM_TYPE_MAP: Core.Const.CRM_CUSTOMER.TYPE_MAP,
            total: 0,
            orderByFields: {},
            // 搜索
            searchForm: {
                name: '',
                phone:'',
                begin_time: '',
                end_time: '',
                type: '',
            },
            // 表格
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: 'crm_b.name', dataIndex: 'name', key:'detail', sorter: true},
                {title: 'crm_b.customer_name', dataIndex: 'customer_name', key:'customer_name', sorter: true},
                {title: 'crm_b.own_user_name', dataIndex: 'own_user_name', key:'own_user_name', sorter: true},
                {title: 'crm_b.status', dataIndex: 'status', key:'status', sorter: true},
                {title: 'crm_b.estimated_deal_time', dataIndex: 'estimated_deal_time', sorter: true},
                {title: 'r.creator_name', dataIndex: 'creator_name', key: 'time', sorter: true},
                {title: 'd.create_time', dataIndex: 'create_time', key: 'time', sorter: true},
                {title: 'crm_c.update_time', dataIndex: 'update_time', key: 'time', sorter: true},
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
                case 'detail':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/crm-bo/bo-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/crm-bo/bo-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
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
            this.orderByFields = {}
            this.pageChange(1);
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMBo.list({
                ...this.searchForm,
                order_by_fields: this.orderByFields,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = res.list;
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
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMBo.delete({id}).then(() => {
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
// #CustomerList {}
</style>
