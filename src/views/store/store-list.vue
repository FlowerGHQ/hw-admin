<template>
    <div id="StoreList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">门店列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新建门店</a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">门店名称:</div>
                        <div class="value">
                            <a-input placeholder="请输入门店名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">所属分销商:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.distributor_id" placeholder="请选择所属分销商" @change="handleSearch">
                                <a-select-option v-for="distributor of distributorList" :key="distributor.id" :value="distributor.id">{{ distributor.name }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN', 'DISTRIBUTOR')">
                        <div class="key">所属零售商:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.agent_id" placeholder="请选择所属零售商" @change='handleSearch'>
                                <a-select-option v-for="agent of agentList" :key="agent.id" :value="agent.id">{{ agent.name }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value">
                            <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch" :show-time="defaultTime" :allow-clear='false'>
                                <template #suffixIcon><i class="icon i_calendar"/></template>
                            </a-range-picker>
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
                        <template v-if="column.key === 'detail'">
                            <div class="table-img">
                                <a-image :width="30" :height="30" :src="$Util.imageFilter(record.logo)" fallback='无'/>
                                <a-tooltip placement="top" :title='text'>
                                    <a-button type="link" @click="routerChange('detail', record)" style="margin-left: 6px;">
                                        {{ text || '-' }}
                                    </a-button>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'flag_receive_transfer'">
                            <div class="status status-bg status-tag" :class="text ? 'green' : 'red'">
                                {{ text ? '接受转单' : '不接受转单' }}
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="text ? 'green' : 'red'">
                                {{ text ? '启用中' : '已禁用' }}
                            </div>
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/> 详情</a-button>
                            <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/> 修改</a-button>
                            <a-button type='link' @click="handleStatusChange(record)" :class="record.status ? 'danger' : ''">
                                    <template v-if="record.status"><i class="icon i_forbidden"/>禁用</template>
                                    <template v-else><i class="icon i_enable"/>启用</template>
                            </a-button>
                            <a-button type='link' v-if="$auth('ADMIN')" @click="handleTransferChange(record)" :class="record.flag_receive_transfer ? 'danger' : ''">
                                    <template v-if="record.flag_receive_transfer"><i class="icon i_forbidden"/>禁用（转单）</template>
                                    <template v-else><i class="icon i_enable"/>启用（转单）</template>
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
const LOGIN_TYPE = Core.Const.LOGIN.TYPE
export default {
    name: 'StoreList',
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
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            distributorList: [], // 分销商下拉框数据
            agentList: [],
            filteredInfo: {status: [1]},
            searchForm: {
                name: '',
                status: 1,
                contact_name:'',
                contact_phone:'',
                distributor_id: undefined,
                agent_id: undefined,
                flag_receive_transfer: undefined,
            },

            tableData: [],
        };
    },
    watch: {
        'searchForm.distributor_id': function () {
            this.getAgentListAll();
            this.searchForm.agent_id = undefined
        },
    },
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let tableColumns = [
                {title: '门店名称', dataIndex: 'name', key: 'detail'},
                {title: '联系人姓名', dataIndex: 'contact_name', key:'item'},
                {title: '联系人电话', dataIndex: 'contact_phone',key:'item'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '状态', dataIndex: 'status', key: 'status',
                    filters: Core.Const.ORG_STATUS_LIST, filterMultiple: false, filteredValue: filteredInfo.status || [1] },
                {title: '操作', key: 'operation', fixed: 'right'},
            ]
            if (this.$auth('ADMIN')) {
                tableColumns.splice(1, 0, {title: '所属分销商', dataIndex: 'distributor_name', key: 'item'})
                tableColumns.splice(5, 0, {title: '是否接受转单', dataIndex: 'flag_receive_transfer', key: 'flag_receive_transfer'})
            }
            if (this.$auth('ADMIN', 'DISTRIBUTOR')) {
                tableColumns.splice(2, 0, {title: '所属零售商', dataIndex: 'agent_name', key: 'item'})
            }
            return tableColumns
        },
    },
    mounted() { 
        this.getTableData();
        if (this.$auth('ADMIN')) {
            this.getDistributorListAll();
        }
        if (this.$auth('DISTRIBUTOR')) {
            this.searchForm.distributor_id = Core.Data.getOrgId()
            this.getAgentListAll();
        }
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'edit':        // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/store/store-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':        // 详情
                    routeUrl = this.$router.resolve({
                        path: "/store/store-detail",
                        query: {id: item.id}
                    })
                    console.log('routerUrl',routeUrl);
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        pageChange(curr) {        // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {        // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {        // 搜索
            this.pageChange(1);
        },
        getAgentListAll() {
            if (this.searchForm.distributor_id) {
                Core.Api.Agent.listAll({distributor_id: this.searchForm.distributor_id}).then(res => {
                    console.log('res.list: ', res.list);
                    this.agentList = res.list
                });
            } else {
                this.agentList = []
            }

        },
        getDistributorListAll() {
            Core.Api.Distributor.listAll().then(res => {
                console.log('res.list: ', res.list);
                this.distributorList = res.list
            });
        },
        handleSearchReset() {        // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.create_time = []
            this.pageChange(1);
        },
        handleTableChange(page, filters, sorter) {
            console.log('handleTableChange filters:', filters)
            this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : ''
            }
            this.searchForm.status = filters.status ? filters.status[0] : 1
            this.pageChange(1);
        },
        getTableData() {        // 获取 表格 数据
            this.loading = true;
            Core.Api.Store.list({
                ...this.searchForm,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
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

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该门店吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Store.delete({id}).then(() => {
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
                        title: `确定要${record.status ? '禁用' : '启用'}该门店吗？`,
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk() {
                                Core.Api.Store.updateStatus({id:record.id}).then(() => {
                                        _this.$message.success(`${record.status ? '禁用' : '启用'}成功`);
                                        _this.getTableData();
                                }).catch(err => {
                                        console.log("handleStatusChange err", err);
                                })
                        },
                });
        },
        handleTransferChange(record) {
                let _this = this;
                this.$confirm({
                        title: `确定要${record.flag_receive_transfer ? '禁用(转单)' : '启用(转单)'}该门店吗？`,
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk() {
                                Core.Api.Store.updateTransfer({id:record.id}).then(() => {
                                        _this.$message.success(`${record.flag_receive_transfer ? '禁用' : '启用'}成功`);
                                        _this.getTableData();
                                }).catch(err => {
                                        console.log("handleTransferChange err", err);
                                })
                        },
                });
        }
    }
};
</script>

<style lang="less" scoped>
// #WarehouseList {}
</style>