<template>
    <div id="naireList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">问卷详情</div>
                <div class="btns-area">
                    <a-button type="primary">导出问卷</a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">姓名：</div>
                        <div class="value">
                            <a-input
                                placeholder="请输入"
                                v-model:value="searchForm.name"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">体验官：</div>
                        <div class="value">
                            <a-input
                                placeholder="请输入"
                                v-model:value="searchForm.name"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">门店：</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.type"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                            >
                                <a-select-option v-for="item of storeList" :key="item.key" :value="item.value">{{
                                    item.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">门店：</div>
                        <div class="value">
                            <TimeSearch @search="handleOtherSearch" ref="TimeSearch" />
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="info-container">
                <div class="naire-title">标题: 标题</div>
                <div class="naire-remark">备注：副标题用户试驾体验调查副标题用户车辆试驾体验调查</div>
            </div>
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    @change="getTableDataSorter"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'tooltip'">
                            <a-tooltip placement="top" :title="text">
                                <div class="ell" style="max-width: 150px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(record.begin_time) }} ~ {{ $Util.timeFilter(record.end_time) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('edit', record)">查看提交</a-button>
                            <a-button
                                type="link"
                                @click="handleChangeStatus(record.id, 'use')"
                                v-if="record.status === Core.Const.QUE_NAIRE_LIST.STATUS.STOPPED"
                                >启用</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleChangeStatus(record.id, 'no_use')"
                                v-if="record.status === Core.Const.QUE_NAIRE_LIST.STATUS.IN_USE"
                                >停用</a-button
                            >
                            <a-button type="link" @click="handleDelete(record.id)" class="danger">删除</a-button>
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
import Core from '../../../core';
import TimeSearch from '@/components/common/TimeSearch.vue';

export default {
    name: 'naireList',
    components: {
        TimeSearch,
    },
    props: {},
    data() {
        return {
            Core,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            orderByFields: {},
            // 搜索
            searchForm: {
                name: undefined,
                type: '1',
            },
            // 表格
            tableData: [],
            storeList: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            return [
                { title: '姓名', dataIndex: 'name', key: 'item' },
                { title: '提交时间', dataIndex: 'phone', key: 'time' },
                { title: '试驾车型', dataIndex: 'email', key: 'item' },
                { title: '问题（单选）', dataIndex: 'continent', key: 'item' },
                { title: '问题（多选）', dataIndex: 'country', key: 'tooltip' },
                { title: '问题（问答）', dataIndex: 'address', key: 'time' },
                { title: '问卷（评分）', dataIndex: 'address', key: 'item' },
                { title: '门店', dataIndex: 'address', key: 'item' },
                { title: '体验官', dataIndex: 'address', key: 'item' },
            ];
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/eos-customer/eos-customer-edit',
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
            this.$refs.TimeSearch.handleReset();
            this.orderByFields = {};
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Customer.list({
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
        // 删除
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {},
            });
        },
        // 启用停用
        handleChangeStatus(id, type) {},
    },
};
</script>

<style lang="less" scoped>
#naireList {
    .info-container {
        display: flex;
        padding-left: 20px;
    }
    .naire-title {
        color: #1d2129;
        font-size: 14px;
        font-weight: 600;
        margin-right: 40px;
    }
    .naire-remark {
        color: #1d2129;
        font-size: 14px;
        font-weight: 400;
    }
}
</style>
