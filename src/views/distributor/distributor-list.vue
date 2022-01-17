<template>
    <div id="DistributorList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">分销商列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新建分销商</a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">分销商名称:</div>
                        <div class="value">
                            <a-input placeholder="请输入分销商名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">地区:</div>
                        <div class="value">
                            <a-cascader
                                placeholder="请选择大洲/国家"
                                v-model:value="country_cascader"
                                :options="countryOptions"
                                @change="handleSearch"
                                :field-names="{ label: 'value', value: 'value' , children: 'children'}"
                            />
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false' @change="handleTableChange">
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.distributorTypeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'name'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{ text }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="text ? 'green' : 'red'">
                                {{ text ? '启用中' : '已禁用' }}
                            </div>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/> 详情
                            </a-button>
                            <a-button type='link' @click="routerChange('edit', record)"><i class="icon i_edit"/> 编辑
                            </a-button>
                            <a-button type='link' @click="handleStatusChange(record)" :class="record.status ? 'danger' : ''">
                                <template v-if="record.status"><i class="icon i_forbidden"/>禁用</template>
                                <template v-else><i class="icon i_enable"/>启用</template>
                            </a-button>
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
                    :show-total="total => `共${total}条`"
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

export default {
    name: 'DistributorList',
    components: {},
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
            // 搜索
            statusList: Core.Const.ORG_STATUS_LIST,
            countryOptions: Core.Const.CONTINENT_COUNTRY_LIST, // 大洲>国家
            country_cascader: [], // 搜索框 大洲>国家
            filteredInfo: {status: [1]},
            searchForm: {
                name: '',
                status: 1,
                type: '',
            },

            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let columns = [
                {title: '分销商', dataIndex: 'name'},
                {title: '类型', dataIndex: 'type',
                    filters: Core.Const.DISTRIBUTOR.TYPE_LIST, filterMultiple: false, filteredValue: filteredInfo.type || null },
                {title: '国家', dataIndex: 'country'},
                {title: '联系人', dataIndex: 'contact'},
                {title: '手机号', dataIndex: 'phone'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '状态', dataIndex: 'status', key: 'status',
                    filters: Core.Const.ORG_STATUS_LIST, filterMultiple: false, filteredValue: filteredInfo.status || [1] },
                {title: '操作', key: 'operation', fixed: 'right'},
            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/distributor/distributor-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/distributor/distributor-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            console.log('this.searchForm:', this.searchForm)
            this.country_cascader = []
            this.create_time = []
            this.pageChange(1);
        },
        // 表格筛选
        handleTableChange(page, filters, sorter) {
            console.log('handleTableChange filters:', filters)
            this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : ''
            }
            this.searchForm.status = filters.status ? filters.status[0] : 1
            this.pageChange(1);
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.Distributor.list({
                ...this.searchForm,
                continent: this.country_cascader[0] || '',
                country: this.country_cascader[1] || '',
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 删除 零售商
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除分零售商吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Distributor.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        handleStatusChange(record) {
            let _this = this;
            this.$confirm({
                title: `确定要${record.status ? '禁用' : '启用'}该分销商吗？`,
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Distributor.updateStatus({id: record.id}).then(() => {
                        _this.$message.success(`${record.status ? '禁用' : '启用'}成功`);
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleStatusChange err", err);
                    })
                },
            });
        }
    }
};
</script>

<style lang="less" scoped>
// #DistributorList {}
</style>