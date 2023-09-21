<template>
    <div id="CustomerList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">线索</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')">创建用户</a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('crm_b.name') }}：</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" />
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('crm_b.customer_name') }}：</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" />
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false' :row-selection="rowSelection" @change="getTableDataSorter">
                    <template #headerCell="{title}">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{ record.name }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'status'">
                            {{ groupStatusTableData[text] !== undefined ? lang === 'zh' ? groupStatusTableData[text].zh : groupStatusTableData[text].en : "" }}
                        </template>
                        <template v-if="column.key === 'customer_name'">
                            {{ record.customer_name|| '-' }}
                        </template>
                        <template v-if="column.key === 'own_user_name'">
                            {{ record.own_user? record.own_user.name || '-': '-' }}
                        </template>
                        <template v-if="column.key === 'create_user'">
                            {{ record.create_user? record.create_user.name || '-': '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'estimated_deal_time'">
                            {{ $Util.timeFilter(text, 3) }}
                        </template>

                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="handleBatch('transfer',record)" v-if="$auth('crm-bo.transfer')">{{ $t('crm_c.transfer') }}</a-button>
                            <a-button type="link" @click="routerChange('detail',record)" v-if="$auth('crm-bo.detail')"><i class="icon i_detail"/>{{ $t('def.detail') }}</a-button>
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
export default {
    name: 'ClueList',
    components: {

    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            show: false,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            orderByFields: {},
            // 搜索
            searchForm: {
                name: '',
                phone:'',
                begin_time: '',
                end_time: '',
                type: '',
                own_user_id: undefined
            },
            // 表格
            tableData: [],
            selectedRowKeys: [],
            selectedRowItems: [],
            selectedRowItemsAll: [],
        };
    },
    computed: {
        tableColumns() {
            let columns = [
                {title: 'crm_b.name', dataIndex: 'name', key:'detail', sorter: true},
                {title: 'crm_b.customer_name', dataIndex: 'customer_id', key:'customer_name', sorter: true},
                {title: 'crm_b.own_user_name', dataIndex: 'own_user_id', key:'own_user_name', sorter: true},
                {title: 'crm_b.status', dataIndex: 'status', key:'status', sorter: true},
                {title: 'crm_b.estimated_deal_time', dataIndex: 'estimated_deal_time', key: 'estimated_deal_time', sorter: true},
                {title: 'r.creator_name', dataIndex: 'create_user_id', key: 'create_user', sorter: true},
                {title: 'crm_c.group', dataIndex: 'group_name', key:'group_name'},
                {title: 'crm_c.last_track_time', dataIndex: 'last_track_time', key: 'time', sorter: true},
                {title: 'crm_c.next_track_time', dataIndex: 'next_track_time', key: 'time', sorter: true},
                {title: 'crm_c.remark', dataIndex: 'remark', key: 'remark', sorter: true},
                {title: 'd.create_time', dataIndex: 'create_time', key: 'time', sorter: true},
                {title: 'crm_c.update_time', dataIndex: 'update_time', key: 'time', sorter: true},
                {title: 'def.operate', key: 'operation', fixed: 'right'},
            ]
            return columns
        },
        lang() {
            return this.$store.state.lang
        },
        rowSelection() {
            return {
                type: 'checkbox',
                selectedRowKeys: this.selectedRowKeys,
                preserveSelectedRowKeys: true,
                onChange: (selectedRowKeys, selectedRows) => { // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys
                    this.selectedRowItemsAll.push(...selectedRows)
                    let selectedRowItems = []
                    selectedRowKeys.forEach(id => {
                        let element = this.selectedRowItemsAll.find(i => i.id == id)
                        selectedRowItems.push(element)
                    });
                    this.selectedRowItems = selectedRowItems
                    console.log('rowSelection this.selectedRowKeys:', this.selectedRowKeys,'selectedRowItems:', selectedRowItems)
                },
            };
        },
    },
    mounted() {

    },
    methods: {
        /*methods*/
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'edit':    // 编辑
                    this.$router.push({
                        path: "/user-center/user-edit",
                    })
                    break;
            }
        },
        pageChange(page) {
            // 页码改变
            this.currPage = page;
            Core.Data.setItem('currPage',page)
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            this.pageSize = size;
            Core.Data.setItem('pageSize',size)
            this.getTableData();
        },
        handleSearch() {
            // 搜索
            this.pageChange(Core.Data.getItem('currPage')?Core.Data.getItem('currPage'): 1);
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
        }
    }
};
</script>

<style lang="less" scoped>
</style>
