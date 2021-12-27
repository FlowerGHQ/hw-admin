<template>
    <div id="RefundList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">退款列表</div>
<!--                <div class="btns-area">-->
<!--                    <a-button type="primary" @click="routerChange('create')"><i class="icon i_add"/>新建退款</a-button>-->
<!--                </div>-->
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='8' class="search-item">
                        <div class="key">退款类型:</div>
                        <div class="value">
                            <a-select    v-model:value="searchForm.type" @change="handleTypeSelect" placeholder="请选择退款类型" allow-clear >
                                <a-select-option  key="10" :value="typeList.APPLY_BY_CUSTOMER">用户申请退款</a-select-option>
                                <a-select-option  key="20" :value="typeList.INITIATIVE_REFUND">后台主动退款</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                        <div class="key">退款时间:</div>
                        <div class="value">
                            <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch" :show-time="defaultTime" :allow-clear='false'>
                                <template #suffixIcon><i class="icon i_calendar"></i></template>
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
                         :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record, index}">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}
                                </a-button>
                            </a-tooltip>
                        </template>

                        <template v-if="column.dataIndex === 'order_status'" >
                            {{ $Util.puechaseStatusFilter(text) }}
                        </template>

                        <template v-if="column.dataIndex === 'apply_user_type'" >
                            {{ $Util.userTypeFilter(text) }}
                        </template>

                        <template v-if="column.dataIndex === 'type'" >
                            {{ $Util.refundTypeFilter(text) }}
                        </template>

                        <template v-if="column.dataIndex === 'status'" >
                            {{ $Util.refundStatusFilter(text) }}
                        </template>

                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('create',record)"><i class="icon i_edit"/> 编辑</a-button>
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
const provinceData = ['China'];
import Core from '../../core';


export default {
    name: 'RefundList',
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
            typeList: Core.Const.REFUND.TYPE,
            order_id:'',
            searchForm: {
                id:'',
                order_sn: '',
                order_status: '',
                status: '',
                apply_user_type: '',
                type: undefined,
                money: '',
                create_time: '',
            },
            tableData: [],

        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: '订单号', dataIndex: 'order_sn', key: 'detail'},
                {title: '订单状态', dataIndex: 'order_status'},
                {title: '退款状态', dataIndex: 'status'},
                {title: '申请人', dataIndex: 'apply_user_type'},
                {title: '退款类型', dataIndex: 'type'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right', width: 100,},

            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        // handleDelete(id) {
        //     let _this = this;
        //     this.$confirm({
        //         title: '确定要删除该退款记录吗？',
        //         okText: '确定',
        //         okType: 'danger',
        //         cancelText: '取消',
        //         onOk() {
        //             Core.Api.Refund.delete({id}).then(() => {
        //                 _this.$message.success('删除成功');
        //                 _this.getTableData();
        //             }).catch(err => {
        //                 console.log("handleDelete err", err);
        //             })
        //         },
        //     });
        // },
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'create':  // 新建
                    routeUrl = this.$router.resolve({
                        path: "/refund/refund-create",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/purchase/purchase-order-detail",
                        query: {id: item.order_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        handleTypeSelect(val) {
            this.type = val
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
            this.create_time = []
            this.pageChange(1);
        },
        handleTableChange(page, filters, sorter) {
            console.log('handleTableChange filters:', filters)
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : 0
            }
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            this.loading = false;
            // return
            Core.Api.Refund.list({
                ...this.searchForm,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
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
    }
};
</script>

<style scoped>

</style>