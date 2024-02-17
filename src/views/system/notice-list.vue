<template>
    <div id="NoticeList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('no.list') }}</div>
                <div class="btns-area">
                    <a-button
                        type="primary"
                        @click="routerChange('edit')"
                        v-if="$auth('ADMIN') && $auth('message.save')"
                        ><i class="icon i_add" />{{ $t('no.save') }}</a-button
                    >
                </div>
            </div>
            <div class="search-container" v-if="$auth('ADMIN')">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="8" class="search-item">
                        <div class="key">{{ $t('n.type') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.category"
                                @change="handleSearch"
                                :placeholder="$t('def.select')"
                            >
                                <a-select-option v-for="item of categoryMap" :key="item.key" :value="item.key">{{
                                    item[$i18n.locale]
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <!--                    <a-col :xs='24' :sm='24' :xl="8" :xxl='8' class="search-item">
                        <div class="key">消息类型:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" @change="handleSearch" placeholder="请选择消息类型">
                                <a-select-option v-for="(val, key) in typeMap" :key="key" :value="key">{{val.text}}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>-->
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
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail' && $auth('message.detail')">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                    text || '-'
                                }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'has_read'">
                            <div class="status status-bg status-tag smell" :class="text ? 'blue' : 'red'">
                                {{ text ? $t('no.read') : $t('no.unread') }}
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.noticeTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)" v-if="$auth('message.detail')"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                            >
                            <template v-if="$auth('ADMIN')">
                                <a-button type="link" @click="routerChange('edit', record)" v-if="$auth('message.save')"
                                    ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                                >
                                <a-button
                                    type="link"
                                    @click="handleDelete(record.id)"
                                    class="danger"
                                    v-if="$auth('message.delete')"
                                    ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                                >
                            </template>
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

const NOTICE = Core.Const.NOTICE;

export default {
    name: 'NoticeList',
    components: {},
    props: {},
    data() {
        return {
            CATEGORY: NOTICE.CATEGORY,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索

            categoryMap: NOTICE.CATEGORY_MAP,
            typeMap: NOTICE.MASTER_TYPE_MAP,
            searchForm: {
                type: undefined,
                category: NOTICE.CATEGORY.MASTER,
            },
            // 表格
            tableData: [],
        };
    },
    watch: {
        'searchForm.category': function (n) {
            if (n == NOTICE.CATEGORY.MASTER) {
                this.typeMap = NOTICE.MASTER_TYPE_MAP;
            } else if (n == NOTICE.CATEGORY.ORG) {
                this.typeMap = NOTICE.ORG_TYPE_MAP;
            }
            this.searchForm.type = undefined;
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: 'no.headers', dataIndex: 'title', key: 'detail' },
                { title: 'n.type', dataIndex: 'type' },
                { title: 'n.state', dataIndex: 'has_read' },
                { title: 'd.create_time', dataIndex: 'create_time', key: 'time' },
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ];
            if (!this.$auth('ADMIN')) {
                columns.splice(1, 1);
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
                        path: '/system/notice-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/system/notice-detail',
                        query: { id: item.id },
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
            this.pageSize = size;
            this.getTableData();
        },
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Notice.list({
                ...this.searchForm,
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

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Notice.delete({ id })
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
    },
};
</script>

<style lang="less" scoped>
// #NoticeList {}
</style>
