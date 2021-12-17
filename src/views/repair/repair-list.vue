<template>
<div id="RepairList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">维修工单</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新增工单</a-button>
            </div>
        </div>
        <div class="tabs-container colorful">
            <a-tabs v-model:activeKey="searchForm.status" @change='handleSearch'>
                <a-tab-pane :key="item.key" v-for="item of statusList">
                    <template #tab>
                        <div class="tabs-title">{{item.text}}<span :class="item.color">{{item.value}}</span></div>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">工单编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入工单编号" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <!-- <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">零部件编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入零部件编号" v-model:value="searchForm.part_code" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">车架编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入车架编号" v-model:value="searchForm.vehicle_no" @keydown.enter='handleSearch'/>
                    </div>
                </a-col> -->
                <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                    <div class="key">创建时间:</div>
                    <div class="value">
                        <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch" :show-time="defaultTime">
                            <template #suffixIcon><i class="icon i_calendar"></i> </template>
                        </a-range-picker>
                    </div>
                </a-col>
            </a-row>
            <div class="btn-area">
                <a-button @click="handleSearch" type="primary">查询</a-button>
                <a-button @click="handleSearchReset">重置</a-button>
            </div>
        </div>
        <div class="table-container">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                :row-key="record => record.id"  :pagination='false' @change="handleTableChange">
                <template #bodyCell="{ column, text , record }">
                    <template v-if="column.key === 'detail'">
                        <a-tooltip placement="top" :title='text' v-if="record.status == 10">
                            <a-button type="link" @click="routerChange('edit', record)">{{text || '-'}}</a-button>
                        </a-tooltip>
                        <a-tooltip placement="top" :title='text' v-else>
                            <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status status-bg status-tag" :class="$Util.repairStatusFilter(text,'color')">
                            {{$Util.repairStatusFilter(text)}}
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'type'">
                        {{$Util.repairTypeFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'channel'">
                        {{$Util.repairChannelFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'repair_method'">
                        {{$Util.repairMethodFilter(text)}}
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-'}}
                    </template>
                    <template v-if="column.key === 'tip_item'">
                        <a-tooltip placement="top" :title='text'>
                            <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                        </a-tooltip>
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
                :show-total="total => `共${total}条`"
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
export default {
    name: 'RepairList',
    components: {},
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
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            statusList: [
                {text: '全  部', value: '0', color: 'primary', key: '0'},
                {text: '待分配', value: '0', color: 'red',     key: '10'},
                {text: '待确认', value: '0', color: 'orange',  key: '20'},
                {text: '待检测', value: '0', color: 'yellow',  key: '30'},
                {text: '维修中', value: '0', color: 'blue',    key: '50'},
                {text: '已完成', value: '0', color: 'green',   key: '60'},
                {text: '异  常', value: '0', color: 'grey',    key: '6'},
            ],
            create_time: [],
            searchForm: {
                uid: '',
                status: undefined,
                channel: '',
                repair_method: '',
            },
            filteredInfo: null,

            tableFields: [],
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let columns = [
                { title: '工单编号', dataIndex: 'uid', key: 'detail' },
                { title: '工单名称', dataIndex: 'name', key: 'tip_item' },
                { title: '维修方式', dataIndex: 'channel',
                    filters: Core.Const.REPAIR.CHANNEL_LIST, filterMultiple: false, filteredValue: filteredInfo.channel || null },
                { title: '维修类别', dataIndex: 'repair_method',
                    filters: Core.Const.REPAIR.METHOD_LIST, filterMultiple: false, filteredValue: filteredInfo.repair_method || null },
                { title: '接单人',   dataIndex: 'jiesanren', key: 'item' },
                { title: '关联客户', dataIndex: 'guanliankehu', key: 'item' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '实施时间', dataIndex: 'working_time', key: 'time' },
                { title: '订单状态', dataIndex: 'status', fixed: 'right' },
            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
        this.getStatusStat();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item)
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-edit",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-detail",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
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
        handleSearchReset() {  // 重置搜索
            console.log('handleSearchReset:')
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.filteredInfo = null

            this.create_time = []
            this.pageChange(1);
        },
        handleTableChange(page, filters, sorter) {
            console.log('handleTableChange filters:', filters)
            this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : 0
            }
            this.pageChange(1);
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            console.log('this.searchForm:', this.searchForm)
            Core.Api.Repair.list({
                ...this.searchForm,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
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
         getStatusStat() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.Repair.statusList().then(res => {
                console.log("getStatusStat res:", res)
                let total = 0

                this.statusList.forEach(statusItem => {
                    res.status_list.forEach(item => {
                        if ( statusItem.key == item.status) {
                            statusItem.value = item.amount
                            total += item.amount
                        }
                    })
                })
                console.log(total)
                this.statusList[0].value = total
            }).catch(err => {
                console.log('getStatusStat err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less" scoped>
#RepairList {
    .status-tag {
        width: 50px;
        height: 22px;
        line-height: 22px;
        border-radius: 12px;
        font-size: @fz_sm;
        text-align: center;
    }
}
</style>
