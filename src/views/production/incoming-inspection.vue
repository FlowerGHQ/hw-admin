<template>
    <div id="incomingInspection">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">来料检验</div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">物料名称:</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">物料编码:</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">收货单号:</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">采购订单号:</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">供应商名称:</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">质检员:</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                        <div class="key">质检时间:</div>
                        <div class="value">
                            <TimeSearch @search="handleOtherSearch" ref='TimeSearch'/>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                </div>
            </div>
            <div class="operate-container flex">
                <a-button type="primary">批量导出</a-button>
                <a-button type="primary">全部导出</a-button>
            </div>
            <div class="table-container">
                <a-table :check-mode='true' :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false' :row-selection="rowSelection"
                    :expandedRowKeys="expandedRowKeys" :indentSize='0'
                    :expandIconColumnIndex="expandIconColumnIndex">
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
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
import dayjs from "dayjs";
import TimeSearch from '@/components/common/TimeSearch.vue'


export default {
    name: 'incomingInspection',
    components: {
        TimeSearch
    },
    props: {},
    data() {
        return {
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            searchForm: {
                name: '',
                uid: '',
                category_id: undefined,
                begin_time: '',
                end_time: '',
                distributor_id: undefined,
                agent_id: undefined,
                store_id: undefined,
            },
            // 表格
            tableData: [],
            expandedRowKeys: [],
            expandIconColumnIndex: 0,
            selectedRowKeys: [],
            selectedRowItems: [],
        };
    },
    computed: {
        tableColumns() {
            let columns = [
                {title: '物料编码', dataIndex: 'name', key: 'detail'},
                {title: '物料名称', dataIndex: 'name', key: 'code'},
                {title: '收货单号', dataIndex: 'name', key: 'vehicle_uid'},
                {title: '采购订单号', dataIndex: 'name', key: 'item'},
                {title: '供应商名称', dataIndex: 'name', key: 'motor_uid'},
                {title: '收货仓库', dataIndex: 'name', key: 'vcu_uid'},
                {title: '收货数量', dataIndex: 'name', key: 'battery_uid'},
                {title: '质检员', dataIndex: 'name', key: 'attr'},
                {title: '质检时间', dataIndex: 'create_time', key: 'time'},
            ]
            return columns
        },
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => { // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys
                    this.selectedRowItems = selectedRows
                    console.log('rowSelection onChange this.selectedRowKeys', this.selectedRowKeys);
                },
            };
        },
        lang() {
            return this.$store.state.lang
        }
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item)
            let routeUrl = ''
            switch (type) {
                case 'detail':  // 整车详情
                    routeUrl = this.$router.resolve({
                        path: "/entity/entity-detail",
                        query: {id: item.default_item_id || item.id, set_id: item.set_id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) { // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key]
            }
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.pageChange(1);
            this.$refs.TimeSearch.handleReset()
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.Entity.list({
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
                this.expandedRowKeys = []
            });
        },
    }
};
</script>

<style lang="less">
#incomingInspection {
    .ant-btn.ant-btn-link {
        line-height: 22px;
        margin-left: 8px;
    }
}
.operate-container {
    &.flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
