<template>
    <div id="CustomerList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">用户列表</div>
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
                        <span class="title-style">{{ $t(title) }}</span>
                    </template>
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'name'">
                            <span class="blue-text">{{ text || '-' }}</span>
                        </template>
                        <template v-if="column.key === 'phone'">
                            <span class="blue-text">{{ text ? Core.Util.phoneEncryption(String(text)) : '-' }}</span>
                        </template>
                        <template v-if="column.key === 'intention'">
                            <span class="blue-text">{{ text || '-' }}</span>
                        </template>
                        <template v-if="column.key === 'label'">
                            <span class="blue-text">{{ text || '-' }}</span>
                        </template>
                        <template v-if="column.key === 'officer'">
                            <img v-if="record.avatar" class="avatar-style" :src="record.avatar" alt="">
                            <span class="user-name">{{ text }}</span>
                            <span>{{ record.employee_no }}</span>
                        </template>
                        <template v-if="column.key === 'order_status'">
                            <span class="blue-text">{{ text || '-' }}</span>
                        </template>

                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail',record)">{{ $t('def.see') }}</a-button>
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
            Core,
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
                { title: 'crm_b.name', dataIndex: 'name', key:'name' },
                { title: 'crm_b.customer_name', dataIndex: 'phone', key:'phone' },
                { title: 'crm_b.own_user_name', dataIndex: 'intention', key:'intention' },
                { title: 'crm_b.status', dataIndex: 'label', key:'label' },
                { title: 'crm_b.estimated_deal_time', dataIndex: 'group_name', key: 'group_name' },
                { title: 'r.creator_name', dataIndex: 'city', key: 'city' },
                { title: 'r.creator_name', dataIndex: 'store', key: 'store' },
                { title: 'crm_c.group', dataIndex: 'officer', key:'officer' },
                { title: 'crm_c.last_track_time', dataIndex: 'order_status', key: 'order_status' },
                { title: 'crm_c.next_track_time', dataIndex: 'pay_type', key: 'pay_type' },
                { title: 'crm_c.remark', dataIndex: 'source_type_mapping', key: 'source_type_mapping' },
                { title: 'def.operate', key: 'operation', fixed: 'right' },
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
        this.getTableData()
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
            this.tableData = [
                {
                    id: '1',
                    name: '赵先生',
                    phone: '',
                    intention: '西湖区湖底公园1号',
                    label: '胡彦斌',
                    group_name: '华北大区',
                    city: '北京门店',
                    store: '上海浦东新区一号门店',
                    avatar: '',
                    officer: '李鹏程',
                    order_status: '未下单',
                    pay_type: '全款支付',
                    source_type_mapping: '小程序',
                },
                {
                    id: '2',
                    name: '胡彦斌',
                    phone: 13423425542,
                    intention: '西湖区湖底公园1号',
                    label: '胡彦斌',
                    group_name: '华北大区',
                    city: '北京门店',
                    store: '上海浦东新区一号门店',
                    avatar: '',
                    officer: '李鹏程',
                    order_status: '未下单',
                    pay_type: '全款支付',
                    source_type_mapping: '小程序',
                },
            ];
            // this.loading = true;
            // Core.Api.CRMBo.list({
            //     ...this.searchForm,
            //     order_by_fields: this.orderByFields,
            //     page: this.currPage,
            //     page_size: this.pageSize
            // }).then(res => {
            //     console.log("getTableData res:", res)
            //     this.total = res.count;
            //     this.tableData = res.list;
            // }).catch(err => {
            //     console.log('getTableData err:', err)
            // }).finally(() => {
            //     this.loading = false;
            // });
        }
    }
};
</script>

<style lang="less" scoped>
.blue-text {
    font-size: 14px;
    color: #0061FF;
}
.title-style{
    color: #1D2129;
    font-family: PingFang SC;
    font-size: 14px;    
    font-weight: 500;
}
.avatar-style{
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
}
.user-name{
    margin-right: 8px;
}
</style>
