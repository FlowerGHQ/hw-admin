<template>
    <div id="SalesAreaList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('ar.list')}}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')" v-if="$auth('sales-area.save')"><i class="icon i_add"/>{{ $t('ar.save')}}</a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('n.name')}}:</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('n.area') }}:</div>
                        <div class="value">
                            <CountryCascader @search="handleOtherSearch" ref='CountryCascader'/>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search')}}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset')}}</a-button>
                </div>

            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                    :loading="loading"
                    :row-key="record => record.id" 
                    :pagination='false'
                >
                    <template #bodyCell="{ column, text , record}">
                        <template v-if="column.dataIndex === 'name' && $auth('sales-area.detail')">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{ text }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'country'">
                            <a-tooltip placement="topLeft" :title='text'>
                                <span class="hand">{{ text || '-' }}</span>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'name_en'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('edit',record)" v-if="$auth('sales-area.save')"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>
                            <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="$auth('sales-area.delete')"><i class="icon i_delete"/>{{ $t('def.delete') }}</a-button>
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
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
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
import Core from '../../core';

import CountryCascader from '@/components/common/CountryCascader.vue'
export default {
    name: 'SalesAreaList',
    components: {CountryCascader},
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
            searchForm: {
                name: '',
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
            let columns = [
                {title: this.$t('n.name'), dataIndex: 'name'},
                {title: this.$t('n.name_en'), dataIndex: 'name_en',key: 'name_en'},
                // {title: this.$t('n.continent'), dataIndex: 'continent',key: ''}, // 大洲
                {title: this.$t('n.country'),dataIndex: 'country',key: 'country'},
                {title: this.$t('def.operate'), key: 'operation', fixed: 'right'},
            ]
            if (this.$i18n.locale === 'en' ) {
                // columns.splice(2, 1, {title: this.$t('n.continent'), dataIndex: 'continent_en', key: 'country'})
                columns.splice(2, 1, {title: this.$t('n.country'), dataIndex: 'country_en', key: 'country'})
            }
            return columns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'detail':    // 详情
                    this.$router.push({
                        path: "/distributor/sales-area-detail",
                        query: {id: item.id}
                    })
                    break;
                case 'edit':    // 编辑
                    this.$router.push({
                        path: "/distributor/sales-area-edit",
                        query: {id: item.id}
                    })
                    break;
            }
        },
        pageChange(curr) {    // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {    // 页码尺寸改变
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {    // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) { // 大洲/国家 搜索
            for (const key in params) {
                this.searchForm[key] = params[key]
            }
            this.pageChange(1);
        },
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            // this.$refs.CountryCascader.handleReset()
            this.pageChange(1);
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            // return
            Core.Api.SalesArea.list({
                ...this.searchForm,
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

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.SalesArea.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
    }
};
</script>

<style lang="less" scoped>
// #SalesAreaList {}
.hand {
    cursor: pointer;
    display: block;
    width: 60em;
    overflow: hidden;
    /* 显示省略符号来代表被修剪的文本。 */
    text-overflow: ellipsis;
    /* 文本不换行 */
    white-space: nowrap;
    text-align: left;
}
</style>