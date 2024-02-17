<template>
    <div id="StoreList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('s.store_list') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')" v-if="$auth('store.save')"
                        ><i class="icon i_add" />{{ $t('s.new_store') }}</a-button
                    >
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('d.name_short_name') }}:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.name"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">{{ $t('n.distributor') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.distributor_id"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                            >
                                <a-select-option
                                    v-for="distributor of distributorList"
                                    :key="distributor.id"
                                    :value="distributor.id"
                                    >{{ distributor.name }}</a-select-option
                                >
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="$auth('ADMIN', 'DISTRIBUTOR')">
                        <div class="key">{{ $t('n.agent') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.agent_id"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                            >
                                <a-select-option v-for="agent of agentList" :key="agent.id" :value="agent.id">{{
                                    agent.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="14" class="search-item">
                        <div class="key">{{ $t('def.create_time') }}:</div>
                        <div class="value"><TimeSearch @search="handleOtherSearch" ref="TimeSearch" /></div>
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
                    @change="handleTableChange"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail' && $auth('store.detail')">
                            <div class="table-img">
                                <a-image :width="30" :height="30" :src="$Util.imageFilter(record.logo)" fallback="无" />
                                <a-tooltip placement="top" :title="text">
                                    <a-button
                                        type="link"
                                        @click="routerChange('detail', record)"
                                        style="margin-left: 6px"
                                    >
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
                        <template v-if="column.key === 'pay_type'">
                            {{ $Util.payTypeFilter(text, $i18n.locale) || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="text ? 'green' : 'red'">
                                {{ text ? $t('def.enable_ing') : $t('def.disable_ing') }}
                            </div>
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)" v-if="$auth('store.detail')"
                                ><i class="icon i_detail" /> {{ $t('def.detail') }}</a-button
                            >
                            <a-button type="link" @click="routerChange('edit', record)" v-if="$auth('store.save')"
                                ><i class="icon i_edit" /> {{ $t('def.edit') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleStatusChange(record)"
                                :class="record.status ? 'danger' : ''"
                            >
                                <template v-if="record.status && $auth('store.delete')"
                                    ><i class="icon i_forbidden" /> {{ $t('def.disable') }}</template
                                >
                                <template v-if="!record.status && $auth('store.enable')"
                                    ><i class="icon i_enable" />{{ $t('def.enable') }}</template
                                >
                            </a-button>
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
    </div>
</template>

<script>
import Core from '../../core';
const LOGIN_TYPE = Core.Const.LOGIN.TYPE;

import TimeSearch from '../../components/common/TimeSearch.vue';
export default {
    name: 'StoreList',
    components: { TimeSearch },
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
            distributorList: [], // 分销商下拉框数据
            agentList: [],
            filteredInfo: { status: [1] },
            searchForm: {
                name: '',
                status: 1,
                contact_name: '',
                contact_phone: '',
                distributor_id: undefined,
                agent_id: undefined,
                flag_receive_transfer: undefined,
                begin_time: '',
                end_time: '',
            },
            // 表格
            tableData: [],
        };
    },
    watch: {
        'searchForm.distributor_id': function () {
            this.getAgentListAll();
            this.searchForm.agent_id = undefined;
        },
    },
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let tableColumns = [
                { title: this.$t('n.name'), dataIndex: 'name', key: 'detail' },
                { title: this.$t('d.short_name'), dataIndex: 'short_name' },
                { title: this.$t('d.pay_type'), dataIndex: 'pay_type', key: 'pay_type' },
                { title: this.$t('n.contact'), dataIndex: 'contact_name', key: 'item' },
                { title: this.$t('n.phone'), dataIndex: 'contact_phone', key: 'item' },
                {
                    title: this.$t('n.state'),
                    dataIndex: 'status',
                    key: 'status',
                    filters: this.$Util.tableFilterFormat(Core.Const.ORG_STATUS_LIST, this.$i18n.locale),
                    filterMultiple: false,
                    filteredValue: filteredInfo.status || [1],
                },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            if (this.$auth('ADMIN')) {
                tableColumns.splice(2, 0, {
                    title: this.$t('n.distributor'),
                    dataIndex: 'distributor_name',
                    key: 'item',
                });
            }
            if (this.$auth('ADMIN', 'DISTRIBUTOR')) {
                tableColumns.splice(3, 0, { title: this.$t('n.agent'), dataIndex: 'agent_name', key: 'item' });
            }
            return tableColumns;
        },
    },
    mounted() {
        this.getTableData();
        if (this.$auth('ADMIN')) {
            this.getDistributorListAll();
        }
        if (this.$auth('DISTRIBUTOR')) {
            this.searchForm.distributor_id = Core.Data.getOrgId();
            this.getAgentListAll();
        }
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/distributor/store-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/distributor/store-detail',
                        query: { id: item.id },
                    });
                    console.log('routerUrl', routeUrl);
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
            this.pageChange(1);
        },
        handleTableChange(page, filters, sorter) {
            console.log('handleTableChange filters:', filters);
            this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : '';
            }
            this.searchForm.status = filters.status ? filters.status[0] : 1;
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Store.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        getAgentListAll() {
            if (this.searchForm.distributor_id) {
                Core.Api.Agent.listAll({ distributor_id: this.searchForm.distributor_id }).then(res => {
                    this.agentList = res.list;
                });
            } else {
                this.agentList = [];
            }
        },
        getDistributorListAll() {
            Core.Api.Distributor.listAll().then(res => {
                this.distributorList = res.list;
            });
        },

        // 删除
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('s.sure_delete'),
                okText: _this.$t('def.ok'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Store.delete({ id })
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
        // 门店 启用禁用
        handleStatusChange(record) {
            let _this = this;
            this.$confirm({
                title:
                    _this.$t('pop_up.sure') +
                    `${record.status ? _this.$t('pop_up.disable') : _this.$t('pop_up.enable')}` +
                    _this.$t('pop_up.store'),
                okText: this.$t('pop_up.yes'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Store.updateStatus({ id: record.id })
                        .then(() => {
                            _this.$message.success(
                                `${record.status ? _this.$t('pop_up.success_disable') : _this.$t('pop_up.success_enable')}` +
                                    _this.$t('pop_up.success'),
                            );
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleStatusChange err', err);
                        });
                },
            });
        },
        // 门店转单接受 启用禁用
        handleTransferChange(record) {
            let _this = this;
            this.$confirm({
                title: `${record.flag_receive_transfer ? _this.$t('s.store_settings_no') : _this.$t('s.store_settings_yes')}`,
                okText: _this.$t('def.ok'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Store.updateTransfer({ id: record.id })
                        .then(() => {
                            _this.$message.success(
                                `${record.flag_receive_transfer ? _this.$t('def.disable') : _this.$t('def.enable')}` +
                                    _this.$t('pop_up.success'),
                            );
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleTransferChange err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang="less" scoped>
// #WarehouseList {}
</style>
