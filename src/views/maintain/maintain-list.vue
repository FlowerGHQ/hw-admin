<template>
<div id="MaintainList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">维修工单</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新增商品</a-button>
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
                        <a-input placeholder="请输入工单编号" v-model:value="searchForm.sn" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">零部件编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入零部件编号" v-model:value="searchForm.part_code" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">车架编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入车架编号" v-model:value="searchForm.car_code" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
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
            <MyFieldSelect table-key='MaintainList' :necessary-key='["sn", "status"]' :table-columns="tableColumnsTemp" @change='(columns) => tableColumns = columns'/>
            <a-table :columns="$Util.tableFieldsFilter(tableColumns, loginType)" :data-source="tableData" :scroll="{ x: true }"
                :row-key="record => record.id" :loading='loading' :pagination='false' @change="handleTableChange">
                <template #bodyCell="{ column, text }">
                    <template v-if="column.dataIndex === 'sn'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{text}}</a-button>
                        </a-tooltip>
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
        <!-- <div class="paging-container"></div> -->
    </div>
</div>
</template>

<script>
import Core from '../../core';
import MyFieldSelect from '@/components/MyFieldSelect.vue'

const tableColumns = [
    { title: '工单编号', dataIndex: 'sn', },
    { title: '产品类型', dataIndex: 'item_type', filters: [{ text: '车辆', value: 1}, { text: '电池', value: 2}]},
    { title: '维修方式', dataIndex: 'type',},
    { title: '维修类别', dataIndex: 'subject', },
    { title: '接单人',   dataIndex: 'jiesanren', key: 'item', },
    { title: '关联客户', dataIndex: 'guanliankehu', key: 'item', },
    { title: '创建时间', dataIndex: 'create_time', key: 'time', },
    { title: '实施时间', dataIndex: 'working_time', key: 'time', },
    { title: '订单状态', dataIndex: 'status', fixed: 'right', },
];
export default {
    name: 'MaintainList',
    components: {
        MyFieldSelect,
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
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            statusList: [
                {text: '全  部', value: '99', color: 'primary', key: '1'},
                {text: '待分配', value: '29', color: 'red',     key: '2'},
                {text: '待确认', value: '30', color: 'orange',  key: '3'},
                {text: '待检测', value: '30', color: 'yellow',  key: '4'},
                {text: '维修中', value: '30', color: 'blue',    key: '5'},
                {text: '已完成', value: '30', color: 'green',   key: '6'},
                {text: '异  常', value: '30', color: 'grey',    key: '7'},
            ],
            create_time: [],
            searchForm: {
                sn: '',
                status: undefined,
                item_type: undefined,
            },
            tableColumnsTemp: tableColumns,
            tableColumns: [],
            tableData: [],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        // this.getTableData();
        this.tableData = [{sn : 123456}];
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/maintain/maintain-edit",
                        query: { id: item.id }
                    })
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/maintain/maintain-detail",
                        query: { id: item.id }
                    })
                    break;
            }
            window.open(routeUrl.href, '_blank')
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(size) {  // 页码尺寸改变
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.$data.searchForm, this.$options.data().searchForm)
            this.create_time = []
            this.pageChange(1);
        },
        handleTableChange() {

        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.Item.list({
                ...this.searchForm,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData -> res", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData -> err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less" scoped>
#MaintainList {
}
</style>