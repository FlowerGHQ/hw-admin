<template>
<div id="PurchaseList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">采购订单</div>
            <!-- <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新增工单</a-button>
            </div> -->
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
                    <div class="key">订单编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入工单编号" v-model:value="searchForm.sn" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN')">
                    <div class="key">所属经销商：</div>
                    <div class="value">
                        <a-select placeholder="请选择所属经销商" v-model:value="searchForm.agent_id" @change="handleSearch" show-search option-filter-prop="children" allow-clear>
                            <a-select-option v-for="(item,index) of agentList" :key="index" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN', 'AGENT')">
                    <div class="key">所属门店：</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.store_id" @change="handleSearch" show-search option-filter-prop="children" allow-clear
                            :placeholder="searchForm.agent_id ? '请选择所属门店' : '请先选择所属经销商'" :disabled="!searchForm.agent_id">
                            <a-select-option v-for="(item,index) of storeList" :key="index" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                    <div class="key">下单时间:</div>
                    <div class="value">
                        <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch" :show-time="defaultTime" :allow-clear='false'>
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
                :row-key="record => record.id" :pagination='false' @change="handleTableChange">
                <template #bodyCell="{ column, text , record}">
                    <template v-if="column.dataIndex === 'sn'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.dataIndex === 'price'">
                        ￥{{$Util.countFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status status-bg status-tag" :class="$Util.puechaseStatusFilter(text,'color')">
                            {{$Util.puechaseStatusFilter(text)}}
                        </div>
                    </template>

                    <template v-if="column.dataIndex === 'flag_review'">
                        {{$Util.puechaseFlagReviewFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'purchase_method'">
                        {{$Util.puechasePayMethodFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'item_type'">
                        {{$Util.itemTypeFilter(text)}}
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
                    <template v-if="column.key === 'operation'">
                        <a-button type='link' @click="handleRecreate(record)"> <i class="icon i_cart"/> 再次购买</a-button>
                        <a-button type='link' @click="routerChange('detail', record)"> <i class="icon i_detail"/> 详情</a-button>
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
    name: 'PurchaseList',
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
                {text: '全  部', value: '0', color: 'primary',  key: '0'},
                {text: '待支付', value: '0', color: 'yellow',  key: '100'},
                {text: '待发货', value: '0', color: 'orange',  key: '200'},
                {text: '已发货', value: '0', color: 'primary',  key: '300'},
                {text: '交易完成', value: '0', color: 'green',  key: '400'},
                {text: '交易关闭', value: '0', color: 'grey',  key: '1000'},
            ],
            agentList: [],
            storeList: [],
            create_time: [],
            searchForm: {
                sn: '',
                status: undefined,
                item_type: 0,
                agent_id: undefined,
                store_id: undefined,
                type: 0,
                subject: 0,
            },
            filteredInfo: null,
            tableData: [],
        };
    },
    watch: {
        'searchForm.agent_id': function(n) {
            this.getStoreList()
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: '订单编号', dataIndex: 'sn', },
                { title: '价格', dataIndex: 'price' },
                { title: '订单状态', dataIndex: 'status' },
                { title: '是否已评论', dataIndex: 'flag_review' },
                { title: '下单时间', dataIndex: 'create_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right'}
            ]
            if (this.$auth('ADMIN', 'AGENT')) {
                columns.splice(2, 0, {title: '所属门店', dataIndex: 'store_name', key: 'item'})
            }
            if (this.$auth('ADMIN')) {
                columns.splice(2, 0, {title: '所属运营商', dataIndex: 'agent_name', key: 'item'})
            }
            return columns
        }
    },
    mounted() {
        this.getTableData();
        this.getStatusStat();
        if (this.$auth('ADMIN')) {
            this.getAgentList()
        } else if (this.$auth('AGENT')) {
            this.searchForm.agent_id = Core.Data.getOrgId()
            this.getStoreList()
        } else if (this.$auth('STORE')) {
            this.searchForm.store_id = Core.Data.getOrgId()
        }
    },
    methods: {
        async routerChange(type, item = {}) {
            console.log('routerChange item:', item)
            let routeUrl = ''
            switch (type) {
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/purchase/purchase-order-detail",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit':  // 购物车
                    routeUrl = this.$router.resolve({
                        path: "/purchase/item-collect",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        handleRecreate(item){ // 再来一单
            this.loading = true;
            console.log("item.id:"+item.id);
            Core.Api.Purchase.recreate({
                id: item.id,
            }).then(res => {
                console.log("handleRecreate res:", res)
                this.$message.success('添加成功');
                this.routerChange('edit', item)
            }).catch(err => {
                console.log('handleRecreate err:', err)
            }).finally(() => {
                this.loading = false;
            });
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
            Object.assign(this.searchForm, this.$options.data().searchForm)
            if (this.$auth('AGENT')) {
                this.searchForm.agent_id = Core.Data.getOrgId()
            } else if (this.$auth('STORE')) {
                this.searchForm.store_id = Core.Data.getOrgId()
            }
            this.create_time = []
            this.pageChange(1);
        },
        handleTableChange(page, filters, sorter) {
            console.log('handleTableChange filters:', filters)
            // this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : 0
            }
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            this.loading = false;

            Core.Api.Purchase.list({
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
        getAgentList() { // 获取 经销商 数据
            this.loading = true;
            Core.Api.Agent.listAll().then(res => {
                console.log("getAgentList res", res)
                this.agentList = res.list;
            }).catch(err => {
                console.log('getAgentList err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getStoreList() { // 获取 门店 数据
            this.loading = true;
            Core.Api.Store.listAll({
                agent_id: this.searchForm.agent_id
            }).then(res => {
                console.log("getStoreList res", res)
                this.storeList = res.list;
            }).catch(err => {
                console.log('getStoreList err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getStatusStat() {  // 获取 状态统计 数据
            this.loading = true;
            Core.Api.Purchase.statusList().then(res => {
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
// #PurchaseList {}
</style>
