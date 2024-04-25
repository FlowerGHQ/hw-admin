<template>
    <div id="CustomerList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_d.list') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"
                        ><i class="icon i_add" />{{ $t('crm_d.save') }}</a-button
                    >
                </div>
            </div>
            <a-calendar v-model:value="calendar" @change="getCalendarDate" style="margin: 0 20px">
                <template #dateCellRender="{ current }">
                    <ul class="events">
                        <li v-for="item in getListData(current)" :key="item.content">
                            <a-badge :status="item.type" :text="item.content" />
                        </li>
                    </ul>
                </template>
            </a-calendar>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('n.name') }}：</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.name"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('n.phone') }}：</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.phone"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <!-- 状态 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show">
                        <div class="key">{{ $t('crm_d.status') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.status"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                            >
                                <a-select-option :value="0">
                                    {{ lang === 'zh' ? '全部' : 'all' }}
                                </a-select-option>
                                <a-select-option v-for="item of CRM_STATUS" :key="item.key" :value="item.value">{{
                                    lang === 'zh' ? item.zh : item.en
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 试驾车型 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show">
                        <div class="key">{{ $t('crm_d.crm_dict_id') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.crm_dict_id"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                            >
                                <a-select-option :value="0">
                                    {{ lang === 'zh' ? '全部' : 'all' }}
                                </a-select-option>
                                <a-select-option v-for="item of sourceList" :key="item.id" :value="item.id">{{
                                    lang === 'zh' ? item.name : item.name_en
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 订单来源 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show">
                        <div class="key">{{ $t('dis.order_source') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.channel"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                            >
                                <a-select-option :value="0">
                                    {{ lang === 'zh' ? '全部' : 'all' }}
                                </a-select-option>
                                <a-select-option v-for="item of SOURCE_TYPE" :key="item.key" :value="item.value">{{
                                    lang === 'zh' ? item.zh : item.en
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 邮箱 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show">
                        <div class="key">{{ $t('n.email') }}：</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.email"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="14" class="search-item" v-if="show">
                        <div class="key">{{ $t('crm_d.test_drive_time') }}：</div>
                        <div class="value">
                            <a-range-picker
                                v-model:value="createTime"
                                valueFormat="YYYY-MM-DD HH:mm:ss"
                                @change="handleTimeSearch"
                                :show-time="defaultTime"
                                :allow-clear="false"
                            >
                                <template #suffixIcon><i class="icon i_calendar" /></template>
                            </a-range-picker>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="2" :xxl="3" class="search-item search-text" @click="moreSearch">
                        {{ show ? $t('search.stow') : $t('search.advanced_search') }}
                        <i class="icon i_xialajiantouxiao" style="margin-left: 5px" v-if="!show"></i>
                        <i class="icon i_shouqijiantouxiao" style="margin-left: 5px" v-else></i>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
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
                        <!-- 订单来源	 -->
                        <template v-if="column.key === 'channel'">
                            {{ $Util.orderTestSourceType(text, $i18n.locale) || '-' }}
                        </template>
                        <!-- 创建时间	 -->
                        <template v-if="column.key === 'create_time'">
                            {{ $Util.timeFilter(text, 3) }}
                        </template>
                        <!-- 预约车型	 -->
                        <template v-if="column.key === 'subscribe_vehicle'">
                            {{ text || '-' }}
                        </template>
                        <!-- 预约门店-->
                        <template v-if="column.key === 'store_id'">
                            {{ text || '-' }}
                        </template>
                        <!-- 用户名称 -->
                        <template v-if="column.key === 'user_name'">
                            {{ record.customer ? record.customer.name || '-' : '-' }}
                        </template>
                        <!-- 用户手机号	 -->
                        <template v-if="column.key === 'phone'">
                            {{ text || '-' }}
                        </template>
                        <!-- 状态 -->
                        <template v-if="column.key === 'status'">
                            {{ $Util.CRMTestDriveStatusMapFilter(text, $i18n.locale) }}
                        </template>
                        <!-- 门店邮箱是否发送 -->
                        <template v-if="column.key === 'flag_mail_sent_store'">
                            <!-- 1 已发送 2 未发 -->
                            <span v-if="text == 0">-</span>
                            <span v-else-if="text == 1">{{ $t('dis.been_sent') }}</span>
                            <span v-else-if="text == 2">{{ $t('dis.not_sent') }}</span>
                            <span v-else>-</span>
                        </template>
                        <!-- 用户邮箱是否发送 -->
                        <template v-if="column.key === 'flag_mail_sent_user'">
                            <!-- 1 已发送 2 未发 -->
                            <span v-if="text == 0">-</span>
                            <span v-else-if="text == 1">{{ $t('dis.been_sent') }}</span>
                            <span v-else-if="text == 2">{{ $t('dis.not_sent') }}</span>
                            <span v-else>-</span>
                        </template>
                        <!-- 创建人 -->
                        <template v-if="column.key === 'create_user_name'">
                            {{ text || '-' }}
                        </template>
                        <!-- 操作-->
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                            >
                            <a-button type="link" @click="routerChange('edit', record)"
                                ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                            >
                            <a-button type="link" @click="handleDelete(record.id)" class="danger"
                                ><i class="icon i_delete" /> {{ $t('def.delete') }}</a-button
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

        <a-modal v-model:visible="batchShow" :title="$t('crm_c.distribute_customer')" :after-close="handleBatchClose">
            <div class="form-item required">
                <div class="key">{{ $t('crm_b.own_user_name') }}：</div>
                <div class="value">
                    <a-select
                        v-model:value="batchForm.own_user_id"
                        show-search
                        :placeholder="$t('def.input')"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                        @search="getUserData"
                    >
                        <a-select-option v-for="item in userData" :key="item.id" :value="item.id">
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
import Core from '@/core';
import TimeSearch from '../../components/common/TimeSearch.vue';

export default {
    name: 'CustomerList',
    components: {
        TimeSearch,
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            show: false,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            SOURCE_TYPE: Core.Const.CRM_TEST_DRIVE.SOURCE_TYPE, //订单来源
            CRM_STATUS: Core.Const.CRM_TEST_DRIVE.STATUS_MAP,
            total: 0,
            orderByFields: {},
            // 搜索
            searchForm: {
                name: '',
                phone: '',
                level: '',
                begin_time: '',
                end_time: '',
                type: '',
                status: 0,
                crm_dict_id: 0,
                channel: 0, // 订单来源
                email: '', // 邮箱
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
            calendar: '',
            createTime: [],
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            calendarTime: '',
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                // id
                { title: 'dis.test_drive_ticket_id', dataIndex: 'uid', key: 'uid' },
                // 订单来源
                { title: 'dis.order_source', dataIndex: 'channel', key: 'channel' },
                // 创建时间
                { title: 'n.time', dataIndex: 'create_time', key: 'create_time' },
                // 预约车型
                { title: 'dis.subscribe_vehicle', dataIndex: 'item_name', key: 'subscribe_vehicle' },
                // 预约门店
                { title: 'dis.subscribe_store', dataIndex: ['store', 'name'], key: 'store_id' },
                // 门店区域
                { title: 'dis.store_area', dataIndex: 'group_name', key: 'group_name' },
                // 用户名称
                {
                    title: 'dis.user_name',
                    dataIndex: ['customer', 'name'],
                    key: 'user_name',
                    sorter: true,
                },
                // 用户邮箱
                { title: 'dis.user_email', dataIndex: ['customer', 'email'], key: 'email' },
                // 用户手机号
                { title: 'dis.user_phone', dataIndex: ['customer', 'phone'], key: 'phone' },
                // 门店邮箱是否发送
                { title: 'dis.store_is_send_mail', dataIndex: 'flag_mail_sent_store', key: 'flag_mail_sent_store' },
                // 用户邮箱是否发送
                { title: 'dis.user_is_send_mail', dataIndex: 'flag_mail_sent_user', key: 'flag_mail_sent_user' },
                // 状态
                {
                    title: 'dis.status',
                    dataIndex: 'status',
                    key: 'status',
                    sorter: true,
                },
                // 创建人
                {
                    title: 'dis.creator_name',
                    dataIndex: 'create_user_name',
                    key: 'create_user_name',
                },
                // 操作
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
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.getUserData();
        this.getTableData();
        this.getSourceList();
        this.calendarTime = new Date();
        this.getTableTimeData();
        dayjs.locale('zh-cn');
    },
    methods: {
        /* methods */
        moreSearch() {
            this.show = !this.show;
        },
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/crm-customer/customer-detail',
                        query: { id: item.customer_id, store_id: item?.store?.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-test-drive-order/test-drive-edit',
                        query: { id: item.id },
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
            this.getTableTimeData();
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
            // this.$refs.TimeSearch.handleReset()
            this.orderByFields = {};
            this.createTime = [];
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            let searchForm = this.$Util.deepCopy(this.searchForm);
            searchForm.begin_time = searchForm.begin_time ? dayjs(searchForm.begin_time).unix() : 0; // 日期转时间戳
            searchForm.end_time = searchForm.end_time ? dayjs(searchForm.end_time).unix() : 0; // 日期转时间戳
            this.loading = true;
            Core.Api.CRMTestDriveOrder.list({
                ...searchForm,
                order_by_fields: this.orderByFields,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getTableTimeData() {
            // 获取 表格 数据
            let searchForm = this.$Util.deepCopy(this.searchForm);

            searchForm.begin_time = Math.round(this.calendarTime.getTime() / 1000 - 60 * 24 * 3600);
            searchForm.end_time = Math.round(this.calendarTime.getTime() / 1000 + 60 * 24 * 3600);

            this.loading = true;
            Core.Api.CRMTestDriveOrder.list({
                ...Core.Util.searchFilter(searchForm),
                page: 0,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.tableTimeData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
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
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMTestDriveOrder.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        getUserData(query) {
            this.loading = true;
            Core.Api.User.list({
                name: query,
                org_type: Core.Const.LOGIN.ORG_TYPE.ADMIN,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.userData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // handleBatchDelete() {
        //   if (this.selectedRowKeys.length === 0) {
        //     return this.$message.warning(this.$t("crm_c.select"));
        //   }
        //   let _this = this;
        //   console.log(_this.selectedRowKeys);
        //   this.$confirm({
        //     title: this.$t("pop_up.sure_delete"),
        //     okText: this.$t("def.sure"),
        //     okType: "danger",
        //     cancelText: this.$t("def.cancel"),
        //     onOk() {
        //       Core.Api.CRMCustomer.batchDelete({ id_list: _this.selectedRowKeys })
        //         .then(() => {
        //           _this.$message.success(_this.$t("pop_up.delete_success"));
        //           _this.getTableData();
        //         })
        //         .catch((err) => {
        //           console.log("handleDelete err", err);
        //         });
        //     },
        //   });
        // },
        handleBatchObtain() {
            if (this.selectedRowKeys.length === 0) {
                return this.$message.warning(this.$t('crm_c.select'));
            }
            let _this = this;
            this.$confirm({
                title: this.$t('crm_c.sure_obtain'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.batchObtain({ id_list: _this.selectedRowKeys })
                        .then(() => {
                            _this.$message.success(_this.$t('crm_c.obtain_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        handleBatchReturnPool() {
            if (this.selectedRowKeys.length === 0) {
                return this.$message.warning(this.$t('crm_c.select'));
            }
            let _this = this;
            this.$confirm({
                title: this.$t('crm_c.sure_return_pool'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.batchReturnPool({
                        id_list: _this.selectedRowKeys,
                    })
                        .then(() => {
                            _this.$message.success(_this.$t('crm_c.return_pool_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },

        handleBatch(type) {
            if (this.selectedRowKeys.length === 0) {
                return this.$message.warning(this.$t('crm_c.select'));
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
                return this.$message.warning(this.$t('crm_c.select'));
            }
            if (!this.batchForm.own_user_id) {
                return this.$message.warning(this.$t('crm_c.select'));
            }
            switch (this.batchType) {
                case 'distribute':
                    Core.Api.CRMCustomer.batchDistribute({
                        id_list: this.selectedRowKeys,
                        own_user_id: this.batchForm.own_user_id,
                    })
                        .then(() => {
                            this.$message.success(this.$t('crm_c.distribute_success'));
                            this.getTableData();
                            this.handleBatchClose();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                    break;
                case 'transfer':
                    Core.Api.CRMCustomer.batchTransfer({
                        id_list: this.selectedRowKeys,
                        own_user_id: this.batchForm.own_user_id,
                    })
                        .then(() => {
                            this.$message.success(this.$t('crm_c.transfer_success'));
                            this.getTableData();
                            this.handleBatchClose();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                    break;
            }
        },
        handleCreateUserSearch(name) {
            // 创建人条件搜索 下拉框
            Core.Api.CRMOrder.createUser({
                create_user_name: name,
            }).then(res => {
                this.createUserOptions = res.list;
            });
        },
        // 试驾车型接口
        getSourceList() {
            Core.Api.CRMDict.list({
                type: Core.Const.CRM_DICT.TYPE.TYPE_TEST_MODEL,
                status: Core.Const.CRM_DICT.STATUS.STATUS_NORM,
            }).then(res => {
                // console.log("测试", res.list);
                this.sourceList = res.list;
            });
        },
        getListData(value) {
            let listData = [];
            this.tableTimeData.forEach(res => {
                let date = new Date(res.drive_time * 1000);
                if (value.month() === date.getMonth() && value.date() === date.getDate()) {
                    let content =
                        (res.customer !== null ? res.customer.name : '-') +
                        ' ' +
                        this.$Util.timeFilter(res.drive_time, 5);

                    console.log('content', content);

                    listData.push({ type: 'blue', content: content });
                }
            });
            return listData || [];
        },
        getCalendarDate(e) {
            this.calendarTime = new Date(e);
            let begin_time = Math.round(new Date(new Date(e).setHours(0, 0, 0, 0)).getTime() / 1000);
            let end_time = Math.round(new Date(new Date(e).setHours(23, 59, 59, 999)).getTime() / 1000);
            // this.createTime[0] = Math.round(new Date(e).getTime())
            // this.createTime[1] = Math.round(new Date(e).getTime())
            let createTime = [];
            createTime[0] = begin_time ? dayjs.unix(begin_time).format('YYYY-MM-DD HH:mm:ss') : undefined;
            createTime[1] = end_time ? dayjs.unix(end_time).format('YYYY-MM-DD HH:mm:ss') : undefined;
            this.createTime = createTime;
            this.handleTimeSearch();
            this.getTableData();

            this.getTableTimeData();
        },
        handleTimeSearch() {
            this.searchForm.begin_time = this.createTime[0];
            this.searchForm.end_time = this.createTime[1];
        },
    },
};
</script>

<style lang="less" scoped>
.search-text {
    margin-left: 30px;
    color: #006ef9;
    cursor: pointer;
}
</style>
