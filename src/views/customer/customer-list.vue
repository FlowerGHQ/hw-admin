<template>
    <div id="CustomerList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">客户列表</div>
                <div class="btns-area" v-if="$auth('customer.save')">
                    <a-button type="primary" @click="routerChange('edit')" v-if="$auth('STORE','AGENT', 'ADMIN')"><i class="icon i_add"/>新建客户</a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">客户名称：</div>
                        <div class="value">
                            <a-input placeholder="请输入客户名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">客户名称：</div>
                        <div class="value">
                            <a-input placeholder="请输入客户名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">客户电话：</div>
                        <div class="value">
                            <a-input placeholder="请输入客户电话" v-model:value="searchForm.phone" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">大洲：</div>
                        <div class="value">
                            <a-input placeholder="请输入大洲" v-model:value="searchForm.continent" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">国家：</div>
                        <div class="value">
                            <a-input placeholder="请输入国家" v-model:value="searchForm.country" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                        <div class="key">创建时间：</div>
                        <div class="value"><TimeSearch @search="handleOtherSearch" ref='TimeSearch'/></div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record }">
<!--                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                            </a-tooltip>
                        </template>-->
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'address'">
                            {{ $Util.addressFilter(record) }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('edit',record)" v-if="$auth('customer.save')"><i class="icon i_edit"/>编辑</a-button>
                            <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="$auth('customer.delete')"><i class="icon i_delete"/> 删除</a-button>
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
            total: 0,
            // 搜索
            searchForm: {
                name: '',
                phone:'',
                begin_time: '',
                end_time: '',
                continent: '',
                country: '',
            },
            // 表格
            tableColumns: [
                {title: '名称', dataIndex: 'name', key:'detail'},
                {title: '电话', dataIndex: 'phone', key:'item'},
                {title: '邮箱', dataIndex: 'email', key:'item'},
                {title: '大洲', dataIndex: 'continent', key:'item'},
                {title: '国家', dataIndex: 'country', key:'item'},
                {title: '详细地址', dataIndex: 'address'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right'},
            ],
            tableData: [],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/customer/customer-edit",
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
            this.pageChange(1);
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.Customer.list({
                ...this.searchForm,
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

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该客户吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Customer.delete({id}).then(() => {
                        _this.$message.success('删除成功');
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