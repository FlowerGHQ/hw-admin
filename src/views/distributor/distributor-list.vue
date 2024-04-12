<template>
    <div id="DistributorList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('d.distributor_list') }}</div>
                <div class="btns-area">
                    <a-button
                        v-if="$auth('sales.distribution.distributor.save')"
                        type="primary"
                        @click="routerChange('edit')"
                    >
                        <i class="icon i_add" />{{ $t('d.new_distributor') }}
                    </a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('d.name_short_name') }}:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('n.enter')"
                                v-model:value="searchForm.name"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('n.area') }}:</div>
                        <div class="value">
                            <CountryCascader @search="handleOtherSearch" ref="CountryCascader" />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('d.pay_type') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.pay_type"
                                @change="handleSearch"
                                :placeholder="$t('def.select')"
                            >
                                <a-select-option v-for="(item, index) of payTypeList" :key="index" :value="key">{{
                                    item[$i18n.locale]
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
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
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.distributorTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'name'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{ text }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="text ? 'green' : 'red'">
                                {{ text ? $t('def.enable_ing') : $t('def.disable_ing') }}
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'sales_area_list'">
                            <div v-if="text && text.length" class="ell" style="max-width: 300px">
                                <a-tooltip
                                    :title="text.map(i => i?.name).join(' , ')"
                                    destroyTooltipOnHide
                                    placement="topLeft"
                                >
                                    <a-tag v-for="item of text" :key="item.id">{{ item?.name }}</a-tag>
                                </a-tooltip>
                            </div>
                            <div v-else>-</div>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'pay_type'">
                            {{ $Util.payTypeFilter(text, $i18n.locale) || '-' }}
                        </template>
                        <template v-if="column.key === 'country'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button
                                v-if="$auth('sales.distribution.distributor.detail')"
                                type="link"
                                @click="routerChange('detail', record)"
                            >
                                <i class="icon i_detail" /> {{ $t('def.detail') }}
                            </a-button>
                            <a-button
                                v-if="$auth('sales.distribution.distributor.edit')"
                                type="link"
                                @click="routerChange('edit', record)"
                                ><i class="icon i_edit" />{{ $t('def.edit') }}
                            </a-button>
                            <a-button
                                v-if="$auth('sales.distribution.distributor.forbidden')"
                                type="link"
                                @click="handleStatusChange(record)"
                                :class="record.status ? 'danger' : ''"
                            >
                                <template v-if="record.status">
                                    <i class="icon i_forbidden" />{{ $t('def.disable') }}
                                </template>
                                <template v-if="!record.status">
                                    <i class="icon i_enable" />{{ $t('def.enable') }}
                                </template>
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

import CountryCascader from '@/components/common/CountryCascader.vue';
import TimeSearch from '@/components/common/TimeSearch.vue';
import Const from '../../core/const';
export default {
    name: 'DistributorList',
    components: {
        CountryCascader,
        TimeSearch,
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
            statusList: Core.Const.ORG_STATUS_LIST,
            payTypeList: Const.DISTRIBUTOR.PAY_TIME_LIST,
            filteredInfo: { status: [1] },
            searchForm: {
                name: '',
                status: 1,
                type: '',
                continent: '',
                country: '',
                pay_type: '',
            },
            // 表格
            tableData: [],
            lang: '',
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let columns = [
                { title: this.$t('d.distributor_name'), dataIndex: 'name' },
                { title: this.$t('d.short_name'), dataIndex: 'short_name' },
                { title: this.$t('d.pay_type'), dataIndex: 'pay_type', key: 'pay_type' },
                {
                    title: this.$t('n.type'),
                    dataIndex: 'type',
                    filters: this.$Util.tableFilterFormat(Core.Const.DISTRIBUTOR.TYPE_LIST, this.$i18n.locale),
                    filterMultiple: false,
                    filteredValue: filteredInfo.type || null,
                },
                { title: this.$t('n.country'), dataIndex: 'country', key: 'country' },
                { title: this.$t('d.port'), dataIndex: 'receive_port' },
                { title: this.$t('n.contact'), dataIndex: 'contact' },
                { title: this.$t('n.phone'), dataIndex: 'phone' },
                { title: this.$t('d.sales_area'), dataIndex: 'sales_area_list' },
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
            if (this.$i18n.locale === 'en') {
                columns.splice(4, 1, { title: this.$t('n.country'), dataIndex: 'country_en', key: 'country' });
            }
            return columns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/distributor/distributor-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/distributor/distributor-detail',
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
            this.$refs.CountryCascader.handleReset();
            this.$refs.TimeSearch?.handleReset();
            this.pageChange(1);
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
            Core.Api.Distributor.list({
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
                title: _this.$t('a.remove_sub_retailer') + '？',
                okText: _this.$t('def.ok'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Distributor.delete({ id })
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
                    _this.$t('pop_up.distributor'),
                okText: this.$t('pop_up.yes'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Distributor.updateStatus({ id: record.id })
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
    },
};
</script>

<style lang="less" scoped>
// #DistributorList {}
</style>
