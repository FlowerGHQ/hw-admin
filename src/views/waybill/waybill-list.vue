<template>
    <div id="WayBillList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">物流列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新建物流</a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">物流编号:</div>
                        <div class="value">
                            <a-input placeholder="请输入物流编号" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">物流单类型:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" @change="handleSearch" placeholder="请选择物流单类型">
                              <a-select-option v-for="(val, index) of wayBillOptions" :key="index" :value="val.value">{{val.text}}</a-select-option>
                            </a-select>
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
                    <template #bodyCell="{ column, record}">
                        <template v-if="column.dataIndex === 'org_type'">
                          机构类型
                        </template>
                        <template v-if="column.dataIndex === 'target_type'">
                          货物清单类型
                        </template>
                        <template v-if="column.dataIndex === 'company'">
                          物流公司名称
                        </template>
                        <template v-if="column.dataIndex === 'uid'">
                          物流编号
                        </template>
                        <template v-if="column.dataIndex === 'post_fee'">
                          费用
                        </template>
                        <template v-if="column.dataIndex === 'goods_over_view'">
                          包装显示的商品名称
                        </template>
                        <template v-if="column.key === 'operation'">
                            <template v-if="!record.default_item_id">
                            <a-button type='link' @click="routerChange('edit', record)"><i class="icon i_edit"/> 编辑</a-button>
                            <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/> 详情</a-button>
                        </template>
                        <a-button type='link' @click="handleDelete(record.id)" class="danger"><i class="icon i_delete"/> 删除</a-button> 
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
    name: 'WayBillList',
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
            wayBillOptions: Core.Const.WAYBILL.TYPE_LIST,
            searchForm: {
                uid:'',
                type: undefined,
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                // {title: '机构id', dataIndex: 'org_id'},
                {title: '机构类型', dataIndex: 'org_type'},
                // {title: '货物清单id', dataIndex: 'target_id'},
                {title: '货物清单类型', dataIndex: 'target_type'},
                {title: '物流公司名称', dataIndex: 'company'},
                {title: '物流编号', dataIndex: 'uid'},
                {title: '费用', dataIndex: 'post_fee'},
                {title: '包装显示的商品名称', dataIndex: 'goods_over_view'},
                {title: '操作', key: 'operation', fixed: 'right'},
            ]
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
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/waybill/waybill-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/waybill/waybill-detail",
                        query: {id: item.id}
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
            Object.assign(this.searchForm, this.$options.data().searchForm)
            console.log('this.searchForm:', this.searchForm)      
            this.pageChange(1);
        },
        // 表格筛选
        handleTableChange() {   
        },
        // 获取 表格 数据 
        getTableData() {            
        },
        //处理状态改变
        handleStatusChange() {   
        }
    }
};
</script>

<style lang="less" scoped>
// #DistributorList {}
</style>