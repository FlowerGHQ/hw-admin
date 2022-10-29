<template>
    <div id="CustomerList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_d.list') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')" v-if="$auth('crm-customer.save')"><i class="icon i_add"/>{{ $t('crm_d.save') }}</a-button>
                </div>
            </div>
<!--            <div class="search-container">-->
                <a-calendar v-model:value="calendar" @change="getCalendarDate" >
<!--                    <template #headerRender="{ value: current, type, onChange, onTypeChange }">-->
<!--                        -->
<!--                    </template>-->
                    <template #dateCellRender="{ current }">
                        <ul class="events">
                            <li v-for="item in getListData(current)" :key="item.content" >
                                <a-badge :status="item.type" :text="item.content" />
                            </li>
                        </ul>
                    </template>
<!--                    <template #monthCellRender="{ current }">-->
<!--                        <div v-if="getMonthData(current)" class="notes-month">-->
<!--                            <section>{{ getMonthData(current) }}</section>-->
<!--                            <span>Backlog number</span>-->
<!--                        </div>-->
<!--                    </template>-->
                </a-calendar>
<!--            </div>-->
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('n.name') }}：</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('n.phone') }}：</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.phone" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('crm_d.status') }}：</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.status" :placeholder="$t('def.select')" @change="handleSearch">
                                <a-select-option v-for="item of CRM_STATUS" :key="item.key" :value="item.value">{{ item.zh }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('crm_d.crm_dict_id') }}：</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.crm_dict_id" :placeholder="$t('def.select')" @change="handleSearch">
                                <a-select-option v-for="item of sourceList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                        <div class="key">{{ $t('crm_d.data') }}：</div>
                        <div class="value">
                            <a-range-picker v-model:value="createTime" valueFormat='YYYY-MM-DD HH:mm:ss' @change="handleTimeSearch" :show-time="defaultTime" :allow-clear='false'>
                                <template #suffixIcon><i class="icon i_calendar"/></template>
                            </a-range-picker>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="operate-container" >
<!--                <a-button type="primary" @click="handleBatch('distribute')" v-if="$auth('crm-customer.distribute')">{{ $t('crm_c.distribute') }}</a-button>-->
                <a-button type="danger" @click="handleBatchDelete" v-if="$auth('crm-customer.delete')">{{ $t('crm_c.delete') }}</a-button>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false' :row-selection="rowSelection" @change="getTableDataSorter">
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
                        <template v-if="column.key === 'status'">
                            {{ $Util.CRMTestDriveStatusMapFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'channel'">
                            {{ $Util.CRMTestDriveChannelMapFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'creator_name'">
                            {{ record.create_user_name || '-' }}
                        </template>
                        <template v-if="column.key === 'customer'">
                            {{ record.customer ? record.customer.name || '-' : '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail',record)" v-if="$auth('crm-customer.detail')"><i class="icon i_detail"/>{{ $t('def.detail') }}</a-button>
                            <a-button type="link" @click="routerChange('edit',record)" v-if="$auth('crm-customer.save')"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>
                            <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="$auth('crm-customer.delete')"><i class="icon i_delete"/> {{ $t('def.delete') }}</a-button>
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <div class="tip">
                    {{ $t('in.selected') + ` ${this.selectedRowItems.length} ` + $t('in.total')}}
                </div>
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
        <a-modal v-model:visible="batchShow" :title="$t('crm_c.distribute_customer')" :after-close='handleBatchClose'>
            <div class="form-item required">
                <div class="key">{{ $t('crm_b.own_user_name') }}：</div>
                <div class="value">
                    <a-select
                        v-model:value="batchForm.own_user_id"
                        show-search
                        :placeholder="$t('def.input')+$t('n.warehouse')"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                        @search="getUserData"
                    >
                        <a-select-option v-for=" item in userData" :key="item.id" :value="item.id">
                            {{ item.account ? item.account.name : '-' }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleBatchSubmit" type="primary">{{ $t('def.ok') }}</a-button>
                <a-button @click="handleBatchClose">{{ $t('def.cancel') }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // dayjs.locale('zh-cn');
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

            CRM_STATUS: Core.Const.CRM_TEST_DRIVE.STATUS_MAP,
            total: 0,
            orderByFields: {},
            // 搜索
            searchForm: {
                name: '',
                phone:'',
                level:'',
                begin_time: '',
                end_time: '',
                type: '',
                status: '',
            },
            batchForm: {
                own_user_id: '',
            },
            batchShow: false,
            userData: [],
            // 表格
            tableData: [],
            tableTimeData: [],
            operMode: '',
            selectedRowKeys: [],
            selectedRowItems: [],
            selectedRowItemsAll: [],
            createUserOptions: [], // 创建人列表
            sourceList: [],
            calendar:"",
            createTime: [],
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            calendarTime: "",
        };
    },
    watch: {

    },
    computed: {
        tableColumns() {
            let columns = [
                {title: 'n.name', dataIndex: 'customer_id', key:'customer', sorter: true},
                {title: 'n.phone', dataIndex: ['customer', 'phone'], key:'phone'},
                {title: 'crm_d.data', dataIndex: 'test_drive_time', key:'time'},
                {title: 'crm_d.crm_dict_id', dataIndex: ['crm_dict', 'name'], key:'item'},
                {title: 'crm_d.channel', dataIndex: 'channel', key:'channel', sorter: true},
                {title: 'crm_d.status', dataIndex: 'status', key:'status', sorter: true},
                {title: 'r.creator_name', dataIndex: 'create_user_id', key:'creator_name',sorter: true},
                {title: 'crm_c.group', dataIndex: 'group_name', key:'group_name'},
                {title: 'def.operate', key: 'operation', fixed: 'right'},
            ]
            return columns
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
                    // this.$emit('submit', this.selectedRowKeys, this.selectedRowItems)
                },
            };
        },
    },
    mounted() {
        this.getUserData()
        this.getTableData();
        this.getSourceList()
        this.calendarTime = new Date()
        this.getTableTimeData()
        dayjs.locale('zh-cn')
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'detail':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/crm-customer/customer-detail",
                        query: {id: item.customer_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                // case 'detail':    // 编辑
                //     routeUrl = this.$router.resolve({
                //         path: "/crm-test-drive-order/test-drive-detail",
                //         query: {id: item.id}
                //     })
                //     window.open(routeUrl.href, '_self')
                //     break;
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/crm-test-drive-order/test-drive-edit",
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
            this.getTableTimeData()
        },
        handleOtherSearch(params) { // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key]
            }
            this.pageChange(1);
        },
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            // this.$refs.TimeSearch.handleReset()
            this.orderByFields = {}
            this.createTime = []
            this.pageChange(1);
        },
        getTableData() {    // 获取 表格 数据
            let searchForm = this.$Util.deepCopy(this.searchForm)
            searchForm.begin_time = searchForm.begin_time ? dayjs(searchForm.begin_time).unix() : 0 // 日期转时间戳
            searchForm.end_time = searchForm.end_time ? dayjs(searchForm.end_time).unix() : 0 // 日期转时间戳
            this.loading = true;
            Core.Api.CRMTestDriveOrder.list({
                ...searchForm,
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
        getTableTimeData() {    // 获取 表格 数据
            let searchForm = this.$Util.deepCopy(this.searchForm)

            searchForm.begin_time = Math.round(this.calendarTime.getTime()/1000 - 60 * 24 * 3600)
            searchForm.end_time = Math.round(this.calendarTime.getTime()/1000 + 60 * 24 * 3600)

            this.loading = true;
            Core.Api.CRMTestDriveOrder.list({
                ...searchForm,
                page: 0,
            }).then(res => {
                console.log("getTableData res:", res)
                this.tableTimeData = res.list;
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
                    Core.Api.CRMCustomer.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'))
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        getUserData(query){
            this.loading = true;
            Core.Api.User.list({
                name: query,
                org_type: Core.Const.LOGIN.ORG_TYPE.ADMIN,
            }).then(res => {
                console.log("getTableData res:", res)
                this.userData = res.list;
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleBatchDelete() {
            if (this.selectedRowKeys.length === 0) {
                return this.$message.warning(this.$t('crm_c.select'))
            }
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.batchDelete({id_list: _this.selectedRowKeys}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        handleBatchObtain() {
            if (this.selectedRowKeys.length === 0) {
                return this.$message.warning(this.$t('crm_c.select'))
            }
            let _this = this;
            this.$confirm({
                title: this.$t('crm_c.sure_obtain'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.batchObtain({id_list: _this.selectedRowKeys}).then(() => {
                        _this.$message.success(_this.$t('crm_c.obtain_success'));
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        handleBatchReturnPool() {
            if (this.selectedRowKeys.length === 0) {
                return this.$message.warning(this.$t('crm_c.select'))
            }
            let _this = this;
            this.$confirm({
                title: this.$t('crm_c.sure_return_pool'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.batchReturnPool({id_list: _this.selectedRowKeys}).then(() => {
                        _this.$message.success(_this.$t('crm_c.return_pool_success'));
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },


        handleBatch(type) {
            if (this.selectedRowKeys.length === 0) {
                return this.$message.warning(this.$t('crm_c.select'))
            }
            this.batchType = type;
            this.batchShow = true;
        },
        handleBatchClose() {

            this.batchShow = false;
            this.batchType = '';
        },
        handleBatchSubmit() {
            if (this.selectedRowKeys.length === 0) {
                return this.$message.warning(this.$t('crm_c.select'))
            }
            if (!this.batchForm.own_user_id) {
                return this.$message.warning(this.$t('crm_c.select'))
            }
            switch (this.batchType){
                case "distribute":
                    Core.Api.CRMCustomer.batchDistribute({
                        id_list: this.selectedRowKeys,
                        own_user_id: this.batchForm.own_user_id,
                    }).then(() => {
                        this.$message.success(this.$t('crm_c.distribute_success'));
                        this.getTableData();
                        this.handleBatchClose();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                    break;
                case "transfer":
                    Core.Api.CRMCustomer.batchTransfer({
                        id_list: this.selectedRowKeys,
                        own_user_id: this.batchForm.own_user_id,
                    }).then(() => {
                        this.$message.success(this.$t('crm_c.transfer_success'));
                        this.getTableData();
                        this.handleBatchClose();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                    break;
            }

        },
        handleCreateUserSearch(name) { // 创建人条件搜索 下拉框
            Core.Api.CRMOrder.createUser({
                create_user_name: name,
            }).then(res => {
                this.createUserOptions = res.list
            })
        },
        getSourceList(){
            Core.Api.CRMDict.list({
                type: Core.Const.CRM_DICT.TYPE.TYPE_TEST_MODEL,
                status: Core.Const.CRM_DICT.STATUS.STATUS_NORM
            }).then(res => {
                this.sourceList = res.list
            })
        },
        getListData(value) {
            // console.log("value", value.month())
            // console.log("value", value.date())
            let listData = [];
            this.tableTimeData.forEach(res =>{
                let date = new Date(res.test_drive_time*1000)
                // console.log("date", date)
                // console.log("content", date.getMonth())
                // console.log("content", date.getDate())
                if (value.month() === date.getMonth() && value.date() === date.getDate()){

                    let content = (res.customer !== null ? res.customer.name : "-" ) + ' ' +  (res.crm_dict !== null ? res.crm_dict.name : "-") + ' '+ this.$Util.timeFilter(res.test_drive_time,5)
                    // console.log("content", content)
                    listData.push({ type: 'blue', content: content })
                }
            })
            return listData || [];
        },
        getCalendarDate(e){
            this.calendarTime = new Date(e);
            let begin_time = Math.round(new Date(new Date(e).setHours(0, 0, 0, 0)).getTime()/1000)
            let end_time = Math.round(new Date(new Date(e).setHours(23,59,59,999)).getTime()/1000)
            // this.createTime[0] = Math.round(new Date(e).getTime())
            // this.createTime[1] = Math.round(new Date(e).getTime())
            let createTime =[]
            createTime[0] = begin_time ? dayjs.unix(begin_time).format('YYYY-MM-DD HH:mm:ss') : undefined
            createTime[1] = end_time ? dayjs.unix(end_time).format('YYYY-MM-DD HH:mm:ss') : undefined
            this.createTime = createTime
            this.handleTimeSearch()
            this.getTableData()

            this.getTableTimeData()

        },
        handleTimeSearch() {
            this.searchForm.begin_time = this.createTime[0]
            this.searchForm.end_time = this.createTime[1]
        },


    }
};
</script>

<style lang="less" scoped>
</style>
