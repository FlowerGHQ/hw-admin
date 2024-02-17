<template>
    <div id="CustomerList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_b.list') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')" v-if="$auth('crm-bo.save')"
                        ><i class="icon i_add" />{{ $t('crm_b.save') }}</a-button
                    >
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('crm_b.name') }}：</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.name"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('crm_b.customer_name') }}：</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.phone"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <!-- 负责人 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show">
                        <div class="key">{{ $t('crm_b.own_user_name') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.own_user_id"
                                show-search
                                :placeholder="$t('def.input')"
                                :default-active-first-option="false"
                                :show-arrow="false"
                                :filter-option="false"
                                :not-found-content="null"
                                allowClear
                                @search="handleOwnUserSearch"
                            >
                                <a-select-option
                                    v-for="item in ownUserOptions"
                                    :key="item.user_id"
                                    :value="item.user_id"
                                >
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show">
                        <div class="key">{{ $t('crm_b.status') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.status"
                                :placeholder="$t('def.select')"
                                allowClear
                                @change="handleSearch"
                            >
                                <a-select-option
                                    v-for="(item, index) of groupStatusTableData"
                                    :key="index"
                                    :value="index"
                                    >{{ lang === 'zh' ? item.zh : item.en }}</a-select-option
                                >
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="14" class="search-item" v-if="show">
                        <div class="key">{{ $t('d.create_time') }}：</div>
                        <div class="value"><TimeSearch @search="handleOtherSearch" ref="TimeSearch" /></div>
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
            <div class="operate-container">
                <!--                <a-button type="primary" @click="handleBatch('transfer')" v-if="$auth('crm-bo.transfer')">{{ $t('crm_c.transfer') }}</a-button>-->
                <a-button type="danger" @click="handleBatchDelete" v-if="$auth('crm-bo.delete')">{{
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
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)"
                                    ><span :class="{ nameStyle: nameBoolean(record) }"
                                        >{{ text || '-' }}
                                    </span></a-button
                                >
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'status'">
                            {{
                                groupStatusTableData[text] !== undefined
                                    ? lang === 'zh'
                                        ? groupStatusTableData[text].zh
                                        : groupStatusTableData[text].en
                                    : ''
                            }}
                        </template>
                        <template v-if="column.key === 'customer_name'">
                            {{ record.customer_name || '-' }}
                        </template>
                        <template v-if="column.key === 'own_user_name'">
                            {{ record.own_user ? record.own_user.name || '-' : '-' }}
                        </template>
                        <template v-if="column.key === 'create_user'">
                            {{ record.create_user ? record.create_user.name || '-' : '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'estimated_deal_time'">
                            {{ $Util.timeFilter(text, 3) }}
                        </template>

                        <template v-if="column.key === 'operation'">
                            <a-button
                                type="link"
                                @click="handleBatch('transfer', record)"
                                v-if="$auth('crm-bo.transfer')"
                                >{{ $t('crm_c.transfer') }}</a-button
                            >
                            <a-button type="link" @click="routerChange('detail', record)" v-if="$auth('crm-bo.detail')"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                            >
                            <!--                            <a-button type="link" @click="routerChange('edit',record)" v-if="$auth('crm-bo.save')"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>-->
                            <!--                            <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="$auth('crm-bo.delete')"><i class="icon i_delete"/> {{ $t('def.delete') }}</a-button>-->
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
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
                    {{ detail.customer_name }}
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_b.name') }}：</div>
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
                        :placeholder="$t('def.input')"
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
    </div>
</template>

<script>
import Core from '../../core';
import TimeSearch from '../../components/common/TimeSearch.vue';
import { take, uniqBy } from 'lodash';
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
            total: 0,
            orderByFields: {},
            // 搜索
            searchForm: {
                name: '',
                phone: '',
                begin_time: '',
                end_time: '',
                type: '',
                own_user_id: undefined,
            },
            batchForm: {
                own_user_id: '',
            },
            // 表格
            tableData: [],
            groupStatusTableData: [],
            userData: [],
            batchShow: false,
            selectedRowKeys: [],
            selectedRowItems: [],
            selectedRowItemsAll: [],
            detail: [],
            groupOptions: [],
            group_id: undefined,
            ownUserOptions: [], // 负责人
            nameColor: [], // 表格名字点击存进去数组,判断点击跳转后原先name颜色的
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let type = newRoute.meta ? newRoute.meta.type : '';
                this.operMode = type;
                // 这两句刷新页面的时候，页数在之前的页数
                this.currPage = Core.Data.getItem('currPage') ? Core.Data.getItem('currPage') : 1;
                this.pageSize = Core.Data.getItem('pageSize') ? Core.Data.getItem('pageSize') : 20;
                this.getTableData();
                // this.handleSearchReset(false);
                // this.getUserData();
            },
        },
        searchForm: {
            deep: true,
            handler(oldValue, newValue) {
                if (oldValue === newValue) {
                    this.currPage = 1;
                    this.pageSize = 20;
                }
            },
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: 'crm_b.name', dataIndex: 'name', key: 'detail', sorter: true },
                { title: 'crm_b.customer_name', dataIndex: 'customer_id', key: 'customer_name', sorter: true },
                { title: 'crm_b.own_user_name', dataIndex: 'own_user_id', key: 'own_user_name', sorter: true },
                { title: 'crm_b.status', dataIndex: 'status', key: 'status', sorter: true },
                {
                    title: 'crm_b.estimated_deal_time',
                    dataIndex: 'estimated_deal_time',
                    key: 'estimated_deal_time',
                    sorter: true,
                },
                { title: 'r.creator_name', dataIndex: 'create_user_id', key: 'create_user', sorter: true },
                { title: 'crm_c.group', dataIndex: 'group_name', key: 'group_name' },
                { title: 'crm_c.last_track_time', dataIndex: 'last_track_time', key: 'time', sorter: true },
                { title: 'crm_c.next_track_time', dataIndex: 'next_track_time', key: 'time', sorter: true },
                { title: 'crm_c.remark', dataIndex: 'remark', key: 'remark', sorter: true },
                { title: 'd.create_time', dataIndex: 'create_time', key: 'time', sorter: true },
                { title: 'crm_c.update_time', dataIndex: 'update_time', key: 'time', sorter: true },
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ];
            return columns;
        },
        lang() {
            return this.$store.state.lang;
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
    },
    mounted() {
        this.getGroupStatusDetail();
        this.getTableData();
        this.ownUserFetch();
    },
    methods: {
        /* 接口 */
        // 负责人接口
        ownUserFetch(params = {}) {
            Core.Api.CRMTrackMember.joinUserList({
                type: Core.Const.CRM_TRACK_MEMBER.TYPE.OWN,
                target_type: Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.BO,
                ...params,
            }).then(res => {
                console.log('测试', res);
                if (this.$Util.isEmptyObj(params)) {
                    this.ownUserOptions = take(res.list, 50);
                } else {
                    this.ownUserOptions = res.list;
                }
            });
        },
        /*methods*/
        // 负责人事件
        handleOwnUserSearch(name) {
            this.ownUserFetch({
                name: name,
            });
        },
        moreSearch() {
            this.show = !this.show;
        },
        nameBoolean(v) {
            const arr = this.nameColor.filter(el => {
                return el.id == v.id;
            });
            return arr.length ? true : false;
        },
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 编辑
                    if (!this.$Util.isEmptyObj(item)) {
                        this.nameColor.push({ id: item.id });
                    }
                    routeUrl = this.$router.resolve({
                        path: '/crm-bo/bo-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-bo/bo-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        pageChange(page) {
            // 页码改变
            this.currPage = page;
            Core.Data.setItem('currPage', page);
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            this.pageSize = size;
            Core.Data.setItem('pageSize', size);
            this.getTableData();
        },
        handleSearch() {
            // 搜索
            this.pageChange(Core.Data.getItem('currPage') ? Core.Data.getItem('currPage') : 1);
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
            this.$refs.TimeSearch.handleReset();
            this.orderByFields = {};
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMBo.list({
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
                    Core.Api.CRMBo.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success')), _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        getGroupStatusDetail() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMBoStatusGroup.detail({
                id: 1,
            })
                .then(res => {
                    this.groupStatusTableData = JSON.parse(res.detail.status_list);
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleBatch(type, item) {
            this.detail = item;
            this.batchType = type;
            this.batchShow = true;
            this.handleGroupTree();
        },
        handleBatchClose() {
            this.batchForm.own_user_id = undefined;
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
                case 'transfer':
                    Core.Api.CRMBo.transfer({
                        id_list: this.detail.id,
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
                    Core.Api.CRMBo.batchDelete({ id_list: _this.selectedRowKeys })
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
        handleGroupTree() {
            Core.Api.CRMGroupMember.structureByUserGroup({
                group_id: this.detail.group_id,
            }).then(res => {
                this.groupOptions = res.list;
                console.log(res);
            });
        },
    },
};
</script>

<style lang="less" scoped>
// #CustomerList {}
.search-text {
    margin-left: 30px;
    color: #006ef9;
    cursor: pointer;
}
.nameStyle {
    color: #9000f0;
}
</style>
