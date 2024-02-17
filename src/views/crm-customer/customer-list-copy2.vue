<template>
    <div id="CustomerList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('c.list') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')" v-if="$auth('crm-customer.save')"
                        ><i class="icon i_add" />{{
                            operMode === 'private' ? $t('c.save') : $t('crm_c.new_pool_c')
                        }}</a-button
                    >
                </div>
            </div>
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
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show">
                        <div class="key">{{ $t('crm_c.type') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.type"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                            >
                                <a-select-option v-for="item of CRM_TYPE_MAP" :key="item.key" :value="item.value">{{
                                    lang === 'zh' ? item.zh : item.en
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show">
                        <div class="key">{{ $t('crm_o.create_user') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.create_user_id"
                                show-search
                                :placeholder="$t('def.input')"
                                :default-active-first-option="false"
                                :show-arrow="false"
                                :filter-option="false"
                                :not-found-content="null"
                                @search="handleCreateUserSearch"
                            >
                                <a-select-option
                                    v-for="item in createUserOptions"
                                    :key="item.create_user_id"
                                    :value="item.create_user_id"
                                >
                                    {{ item.create_user_name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>

                    <!-- 意向度（仅中文情况下显示） -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show && lang === 'zh'">
                        <div class="key">意向度：</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.intention" :placeholder="$t('def.select')" allowClear>
                                <a-select-option
                                    style="display: flex; align-items: center"
                                    v-for="item of CHINA_INTENT"
                                    :key="item.key"
                                    :value="item.value"
                                >
                                    <div class="intention-box">
                                        <img
                                            class="intent_img"
                                            v-if="item.value == 40"
                                            src="../../assets/images/intent/Vector.png"
                                        />
                                        <span class="intent-text">
                                            {{ item.zh }}
                                        </span>
                                    </div>
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>

                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show">
                        <div class="key">{{ $t('crm_c.level') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.level"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                            >
                                <a-select-option v-for="item of CRM_LEVEL_MAP" :key="item.key" :value="item.value">{{
                                    lang === 'zh' ? item.zh : item.en
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 创建时间 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="8" class="search-item" v-if="show">
                        <div class="key">{{ $t('d.create_time') }}：</div>
                        <div class="value">
                            <TimeSearch @search="handleOtherSearch" ref="TimeSearch" />
                        </div>
                    </a-col>
                    <!-- 更新时间 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="8" class="search-item" v-if="show">
                        <div class="key">{{ $t('d.update_time') }}：</div>
                        <div class="value">
                            <TimeSearch @search="handleOtherSearch" :keys="dateTime" ref="updateTimeSearch" />
                        </div>
                    </a-col>
                    <!-- 高级搜索按钮           -->
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
            <div class="operate-container" v-if="operMode === 'high_seas'">
                <a-button type="primary" @click="handleBatchObtain" v-if="$auth('crm-customer.obtain')">{{
                    $t('crm_c.obtain')
                }}</a-button>

                <a-button type="primary" @click="handleBatchGroup('group')" v-if="$auth('crm-customer.save')">{{
                    $t('crm_c.group')
                }}</a-button>

                <a-button type="danger" @click="handleBatchDelete" v-if="$auth('crm-customer.delete')">{{
                    $t('crm_c.delete')
                }}</a-button>
            </div>
            <div class="operate-container" v-if="operMode === 'private'">
                <a-button type="primary" @click="handleBatchReturnPool" v-if="$auth('crm-customer.return-pool')">{{
                    $t('crm_c.return_pool')
                }}</a-button>
                <!--                <a-button type="primary" @click="handleBatch('transfer')" v-if="$auth('crm-customer.transfer')">{{ $t('crm_c.transfer') }}</a-button>-->
                <a-button type="danger" @click="handleBatchDelete" v-if="$auth('crm-customer.delete')">{{
                    $t('crm_c.delete')
                }}</a-button>
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
                        <!-- 意向度表头仅中文显示 -->
                        {{ $t(title) == '意向度' && lang == 'en' ? '' : $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                    text || '-'
                                }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'group_name'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'phone'">
                            <div v-if="text !== ''" class="phone-hover">
                                {{ record.phone_country_code }} {{ text || '-' }}
                                <a-button
                                    type="link"
                                    v-if="!record.flag_eyes"
                                    class="switch"
                                    @click="handleChecking(record)"
                                    ><i class="icon i_eyes"
                                /></a-button>
                            </div>
                            <template v-else>
                                {{ text || '-' }}
                            </template>
                        </template>
                        <template v-if="column.key === 'email'">
                            <div v-if="text !== ''" class="phone-hover">
                                {{ text || '-' }}
                                <a-button
                                    type="link"
                                    v-if="!record.flag_eyes"
                                    class="switch"
                                    @click="handleChecking(record)"
                                    ><i class="icon i_eyes"
                                /></a-button>
                            </div>
                            <template v-else>
                                {{ text || '-' }}
                            </template>
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.CRMCustomerTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'level'">
                            {{ $Util.CRMCustomerLevelFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'address'">
                            {{ $Util.addressFilterZh(record, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'creator_name'">
                            {{ record.create_user ? record.create_user.name || '-' : '-' }}
                        </template>
                        <template v-if="column.key === 'own_user_name'">
                            {{ record.own_user ? record.own_user.name || '-' : '-' }}
                        </template>

                        <template v-if="column.key === 'source_type'">
                            <span v-if="Landing_Page[text]">
                                {{ Landing_Page[text][$i18n.locale] }}{{ '-'
                                }}{{ $i18n.locale == 'en' ? record.country_en : record.country
                                }}{{ Landing_Page[text]['key'] }}
                            </span>
                            <span>
                                {{ $Util.CRMCustomerSourceTypeFilter(text, $i18n.locale) }}
                            </span>
                        </template>
                        <template v-if="column.dataIndex === 'label_list'">
                            <a-tag v-for="item in record.label_list" color="blue" class="customer-tag">{{
                                lang === 'zh' ? item.label : item.label_en
                            }}</a-tag>
                        </template>
                        <!-- 中文存在：意向度 -->
                        <template v-if="column.name === 'intention' && lang === 'zh'">
                            <div class="intention-box">
                                <img class="intent_img" v-if="text == 40" src="../../assets/images/intent/Vector.png" />
                                <span class="intent-text">
                                    {{ $Util.CRMTrackChinaIntentFilter(text, lang, CHINA_INTENT) || '-' }}
                                </span>
                            </div>
                        </template>

                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button
                                type="link"
                                @click="handleBatch('distribute', record)"
                                v-if="$auth('crm-customer.distribute') && operMode === 'high_seas'"
                                >{{ $t('crm_c.distribute') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleBatch('transfer', record)"
                                v-if="$auth('crm-customer.transfer') && operMode === 'private'"
                                >{{ $t('crm_c.transfer') }}</a-button
                            >

                            <a-button
                                type="link"
                                @click="routerChange('detail', record)"
                                v-if="$auth('crm-customer.detail')"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                            >
                            <!--                            <a-button type="link" @click="routerChange('edit',record)" v-if="$auth('crm-customer.save')"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>-->
                            <!--                            <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="$auth('crm-customer.delete')"><i class="icon i_delete"/> {{ $t('def.delete') }}</a-button>-->
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
                <div class="key">{{ $t('crm_b.customer_name') }}：</div>
                <div class="value">
                    {{ detail.name }}
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_group.name') }}：</div>
                <div class="value">
                    <a-tree-select
                        class="CategoryTreeSelect"
                        v-model:value="group_id"
                        :placeholder="$t('def.select')"
                        :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                        :tree-data="groupOptions"
                        @change="getUserData('')"
                        tree-default-expand-all
                    />
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_b.own_user_name') }}：</div>
                <div class="value">
                    <a-select
                        v-model:value="batchForm.own_user_id"
                        show-search
                        :placeholder="$t('def.select') + $t('crm_b.own_user_name')"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                        @search="getUserData"
                        :disabled="!group_id"
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

        <a-modal
            v-model:visible="batchGroupShow"
            :title="$t('crm_c.distribute_customer')"
            :after-close="handleBatchClose"
        >
            <div class="form-item required">
                <div class="key">{{ $t('crm_group.name') }}：</div>
                <div class="value">
                    <a-tree-select
                        class="CategoryTreeSelect"
                        v-model:value="batchForm.group_id"
                        :placeholder="$t('def.select')"
                        :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                        :tree-data="groupOptions"
                        @change="getUserData('')"
                        tree-default-expand-all
                    />
                </div>
            </div>
            <template #footer>
                <a-button @click="handleBatchGroupSubmit" type="primary">{{ $t('def.ok') }}</a-button>
                <a-button @click="handleBatchGroupClose">{{ $t('def.cancel') }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';
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

            CRM_TYPE_MAP: Core.Const.CRM_CUSTOMER.TYPE_MAP,
            CRM_LEVEL_MAP: Core.Const.CRM_CUSTOMER.LEVEL_MAP,
            CRM_STATUS: Core.Const.CRM_CUSTOMER.STATUS,
            SEARCH_TYPE: Core.Const.CRM_CUSTOMER.SEARCH_TYPE,
            CHINA_INTENT: Core.Const.CRM_TRACK_RECORD.CHINA_INTENT, //意向度
            Landing_Page: Core.Const.CRM_CUSTOMER.Landing_Page, // 落地页
            total: 0,
            orderByFields: {},
            // 搜索
            searchForm: {
                name: undefined,
                phone: undefined,
                level: undefined,
                begin_time: undefined,
                end_time: undefined,
                type: undefined,
                status: undefined,
                search_type: undefined,
                intention: undefined, //意向度（仅中文显示）
            },
            batchForm: {
                group_id: undefined,
                own_user_id: undefined,
            },
            batchShow: false,
            batchGroupShow: false,
            userData: [],
            // 表格
            tableData: [],
            operMode: '',
            selectedRowKeys: [],
            selectedRowItems: [],
            selectedRowItemsAll: [],
            createUserOptions: [], // 创建人列表
            group_id: undefined,
            groupOptions: [],
            detail: {},
            dateTime: ['update_begin_time', 'update_end_time'], // 更新时间筛选
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let type = newRoute.meta ? newRoute.meta.type : '';
                this.operMode = type;
                this.handleSearchReset(false);
                // this.getUserData()
                // this.getTableData();
            },
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: 'n.name', dataIndex: 'name', key: 'detail', sorter: true },
                { title: 'n.phone', dataIndex: 'phone', key: 'phone', sorter: true },
                { title: 'n.email', dataIndex: 'email', key: 'email', sorter: true },
                { title: 'sl.label', dataIndex: 'label_list', key: 'label_list' },
                {
                    title: '意向度',
                    dataIndex: 'intention',
                    key: 'intention',
                    name: 'intention',
                },
                // {title: 'n.continent', dataIndex: 'continent', key:'item'},
                { title: 'crm_c.level', dataIndex: 'level', key: 'level', sorter: true },
                { title: 'crm_c.type', dataIndex: 'type', key: 'type', sorter: true },
                { title: 'r.creator_name', dataIndex: 'create_user_id', key: 'creator_name', sorter: true },
                { title: 'crm_c.group', dataIndex: 'group_name', key: 'group_name' },
                { title: 'crm_c.order_success_count', dataIndex: 'order_count', key: 'order_count' },
                { title: 'r.use_car_city', dataIndex: 'address', sorter: true },
                { title: 'd.create_time', dataIndex: 'create_time', key: 'time', sorter: true },
                { title: 'crm_c.remark', dataIndex: 'remark', key: 'remark', sorter: true },
                { title: 'crm_c.source_type', dataIndex: 'source_type', key: 'source_type', sorter: true },
                { title: 'd.update_time', dataIndex: 'update_time', key: 'time', sorter: true },
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ];
            if (this.operMode === 'private' || this.operMode === 'region') {
                columns.splice(5, 0, {
                    title: 'crm_b.own_user_name',
                    dataIndex: 'own_user_id',
                    key: 'own_user_name',
                    sorter: true,
                });
            }
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
    },
    methods: {
        moreSearch() {
            this.show = !this.show;
            this.handleGroupTree();
        },
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-customer/customer-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-customer/customer-edit',
                        query: { id: item.id, status: this.searchForm.status },
                    });
                    window.open(routeUrl.href, '_blank');
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
            if (this.operMode === 'private') {
                this.searchForm.status = this.CRM_STATUS.CUSTOMER;
            } else {
                this.searchForm.status = this.CRM_STATUS.POOL;
            }
            this.$refs.TimeSearch?.handleReset();
            this.$refs.updateTimeSearch?.handleReset();
            this.orderByFields = {};
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            if (this.operMode === 'high_seas') {
                this.searchForm.status = this.CRM_STATUS.POOL;
                this.searchForm.search_type = this.SEARCH_TYPE.POOL;
            } else if (this.operMode === 'private') {
                this.searchForm.status = this.CRM_STATUS.CUSTOMER;
                this.searchForm.search_type = this.SEARCH_TYPE.PRIVATE;
            } else if (this.operMode === 'region') {
                this.searchForm.status = this.CRM_STATUS.CUSTOMER;
                this.searchForm.search_type = this.SEARCH_TYPE.REGION;
            }
            Core.Api.CRMCustomer.list({
                ...this.searchForm,
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
                    Core.Api.CRMCustomer.delete({ id })
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
            this.batchForm.own_user_id = undefined;
            this.loading = true;
            Core.Api.User.listGroup({
                group_id: this.group_id,
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
                    Core.Api.CRMCustomer.batchDelete({ id_list: _this.selectedRowKeys })
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
                    Core.Api.CRMCustomer.batchReturnPool({ id_list: _this.selectedRowKeys })
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
        handleBatchGroup(type) {
            if (this.selectedRowKeys.length === 0) {
                return this.$message.warning(this.$t('crm_c.select'));
            }
            this.handleGroupTree();
            this.group_id = undefined;
            this.batchForm.group_id = undefined;
            this.batchType = type;
            this.batchForm.group_id = undefined;
            this.batchGroupShow = true;
        },
        handleBatchGroupClose() {
            this.group_id = undefined;
            this.batchGroupShow = false;
            this.batchType = '';
        },
        // 区域选择-弹窗-请求确定
        handleBatchGroupSubmit() {
            if (this.selectedRowKeys.length === 0 || !this.batchForm.group_id) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (this.selectedRowKeys.length === 0 || !this.batchForm.group_id) {
                return this.$message.warning(this.$t('def.enter'));
            }
            this.batchGroupShow = true;

            switch (this.batchType) {
                case 'group':
                    Core.Api.CRMCustomer.batchGroup({
                        id_list: this.selectedRowKeys,
                        group_id: this.batchForm.group_id,
                    })
                        .then(() => {
                            this.$message.success(this.$t('crm_c.distribute_success'));
                            this.getTableData();
                            this.handleBatchGroupClose();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        })
                        .finally(() => {
                            this.batchForm.group_id = undefined;
                            this.selectedRowKeys = [];
                        });
                    break;
            }
        },

        handleBatch(type, item) {
            this.detail = item;

            this.handleGroupTree();
            this.batchType = type;
            this.batchShow = true;
        },
        handleBatchClose() {
            this.group_id = undefined;
            this.batchForm.own_user_id = undefined;
            this.groupOptions = [];
            this.detail = {};
            this.batchShow = false;
            this.batchType = '';
        },
        handleBatchSubmit() {
            if (this.detail.id === 0) {
                return this.$message.warning(this.$t('crm_c.select'));
            }
            if (!this.batchForm.own_user_id) {
                return this.$message.warning(this.$t('crm_c.select'));
            }
            switch (this.batchType) {
                case 'distribute':
                    Core.Api.CRMCustomer.distribute({
                        id: this.detail.id,
                        group_id: this.group_id,
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
                    Core.Api.CRMCustomer.transfer({
                        id: this.detail.id,
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
        handleGroupTree() {
            Core.Api.CRMGroupMember.structureByUser({}).then(res => {
                this.groupOptions = res.list;
                console.log(res);
            });
        },
        handleChecking(item) {
            Core.Api.CRMCustomer.checking({
                id: item.id,
            }).then(res => {
                item.phone = res.detail.phone;
                item.email = res.detail.email;
                item.flag_eyes = true;
                console.log(res);
            });
        },
    },
};
</script>

<style lang="less" scoped>
#CustomerList {
    .i_eyes {
        font-size: 12px;
    }

    .phone-hover {
        .switch {
            opacity: 0;
        }

        &:hover {
            .switch {
                opacity: 1;
            }
        }
    }
}

.search-text {
    margin-left: 30px;
    color: #006ef9;
    cursor: pointer;
}

.intention-box {
    display: flex;
    align-items: center;

    .intent_img {
        height: 13px;
        width: 11px;
        margin-right: 6px;
    }

    .intent-text {
        line-height: 13px;
    }
}
</style>
