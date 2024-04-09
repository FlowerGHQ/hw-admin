<template>
    <div id="AgentList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('a.list_of_retailers') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"
                        ><i class="icon i_add" />{{ $t('a.new_retailer') }}</a-button
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
                        <div class="key">{{ $t('a.superior') }}:</div>
                        <div class="value">
                            <a-tree-select
                                v-model:value="searchForm.parent_id"
                                show-search
                                style="width: 100%"
                                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                placeholder="Please Select"
                                allow-clear
                                treeDefaultExpandAll
                                :tree-data="treeData"
                                :placeholder="$t('def.select')"
                            >
                                <template #title="{ value: value, name }">
                                    {{ name }}
                                </template>
                            </a-tree-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('n.area') }}:</div>
                        <div class="value">
                            <CountryCascader @search="handleOtherSearch" ref="CountryCascader" />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                        <div class="key">{{ $t('d.create_time') }}:</div>
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
                        <template v-if="column.dataIndex === 'name'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{ text }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'pay_type'">
                            {{ $Util.payTypeFilter(text, $i18n.locale) || '-' }}
                        </template>
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title="text">
                                <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="text ? 'green' : 'red'">
                                {{ text ? $t('def.enable_ing') : $t('def.disable_ing') }}
                            </div>
                        </template>
                        <template v-if="column.key === 'country'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)">
                                <i class="icon i_detail" /> {{ $t('def.detail') }}</a-button
                            >
                            <a-button type="link" @click="routerChange('edit', record)">
                                <i class="icon i_edit" /> {{ $t('def.edit') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleStatusChange(record)"
                                :class="record.status ? 'danger' : ''"
                            >
                                <template v-if="record.status"
                                    ><i class="icon i_forbidden" />{{ $t('def.disable') }}</template
                                >
                                <template v-if="!record.status"
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

import TimeSearch from '@/components/common/TimeSearch.vue';
import CountryCascader from '@/components/common/CountryCascader.vue';
export default {
    name: 'AgentList',
    components: {
        TimeSearch,
        CountryCascader,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            distributorList: [], // 分销商下拉框数据
            filteredInfo: { status: [1] },
            value: '',
            treeData: [],
            searchForm: {
                parent_id: '',
                name: '',
                status: 1,
                distributor_id: undefined,
                begin_time: '',
                end_time: '',
                continent: '',
                country: '',
            },
            // 表格
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let tableColumns = [
                { title: this.$t('n.name'), dataIndex: 'name' },
                { title: this.$t('n.distributor'), dataIndex: 'parent_name' },
                { title: this.$t('d.short_name'), dataIndex: 'short_name' },
                { title: this.$t('d.pay_type'), dataIndex: 'pay_type', key: 'pay_type' },
                { title: this.$t('n.country'), dataIndex: 'country', key: 'country' },
                { title: this.$t('n.contact'), dataIndex: 'contact', key: 'item' },
                { title: this.$t('n.phone'), dataIndex: 'phone', key: 'item' },
                {
                    title: this.$t('n.state'),
                    dataIndex: 'status',
                    key: 'status',
                    filters: this.$Util.tableFilterFormat(Core.Const.ORG_STATUS_LIST, this.$i18n.locale),
                    filterMultiple: false,
                    filteredValue: filteredInfo.status || [1],
                },
                { title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            // if (this.$auth('ADMIN')) {
            //     tableColumns.splice(2, 0, {title: this.$t('a.superior'), dataIndex: 'distributor_name', key: 'item'})
            // }
            if (this.$i18n.locale === 'en') {
                tableColumns.splice(4, 1, { title: this.$t('n.country'), dataIndex: 'country_en', key: 'country' });
            }
            return tableColumns;
        },
    },
    mounted() {
        this.getTableData();
        if (this.$auth('ADMIN')) {
            this.getDistributorListAll();
        }
        this.getAgentListPath();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/distributor/agent-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/distributor/agent-detail',
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
            this.value = '';
            this.$refs.TimeSearch.handleReset();
            this.$refs.CountryCascader.handleReset();
            this.pageChange(1);
        },
        getDistributorListAll() {
            Core.Api.Distributor.listAll().then(res => {
                this.distributorList = res.list;
            });
        },
        // 表格筛选
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
            Core.Api.Agent.list({
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
        // 删除 零售商
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('a.remove_retailer') + '？',
                okText: _this.$t('def.ok'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Agent.delete({ id })
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
        handleStatusChange(record) {
            let _this = this;
            this.$confirm({
                title:
                    _this.$t('pop_up.sure') +
                    `${record.status ? _this.$t('pop_up.disable') : _this.$t('pop_up.enable')}` +
                    _this.$t('pop_up.agent'),
                okText: this.$t('pop_up.yes'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Agent.updateStatus({ id: record.id })
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
        getAgentListPath() {
            Core.Api.Agent.listPath({})
                .then(res => {
                    this.treeData = res.list;
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
    },
};
</script>

<style lang="less" scoped>
// #AgentList {}
</style>
