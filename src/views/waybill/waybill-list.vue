<template>
    <div id="WayBillList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">物流列表</div>
                <!-- <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新建物流</a-button>
                </div> -->
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
                        <div class="key">货物清单类型:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" @change="handleSearch" placeholder="请选择货物清单类型">
                              <a-select-option v-for="(val, index) of waybillOptions" :key="index" :value="val.value">{{val.text}}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                        <div class="key">创建时间:</div>
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
                    <template #bodyCell="{ column, record, text}">
                        <template v-if="column.dataIndex === 'org_type'">
                          {{ $Util.userTypeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'company_uid'">
                          {{ $Util.waybillCompanyFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'target_type'">
                          {{ $Util.waybillTargetFilter(text) }}
                        </template>
                        <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'target_uid'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange(record.target_type, record)">{{ text }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'operation'">
                            <template v-if="!record.default_item_id">
                                <!-- <a-button type='link' @click="routerChange('edit', record)"><i class="icon i_edit"/> 编辑</a-button> -->
                                <a-button type='link' @click="handleModalShow(record)"><i class="icon i_detail"/> 详情</a-button>
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
        <a-modal v-model:visible="modalShow" title="物流详情" class="waybill-show-modal">
            <div class="modal-content">
                <a-steps progress-dot direction="vertical">
                    <a-step v-for="(item,index) of waybillInfo.list" :key="index" :title="item.time" :description="item.status"/>
                </a-steps>
                <SimpleImageEmpty v-if="!waybillInfo.length" desc='暂无物流详情信息'/>
            </div>

            <template #footer>
                <a-button key="back" @click="modalShow = false">关闭</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';
import SimpleImageEmpty from '../../components/common/SimpleImageEmpty.vue'
const TARGET_TYPE = Core.Const.WAYBILL.TARGET_TYPE
export default {
    name: 'WaybillList',
    components: {SimpleImageEmpty},
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
            waybillOptions: Core.Const.WAYBILL.TARGET_TYPE_LIST,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            searchForm: {
                uid:'',
                type: undefined,
            },

            tableData: [],

            modalShow: false,
            waybillInfo: []
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: '机构类型', dataIndex: 'org_type'},
                {title: '货物清单类型', dataIndex: 'target_type'},
                {title: '物流公司名称', dataIndex: 'company_uid'},
                {title: '物流编号', dataIndex: 'uid'},
                {title: '货物清单UID', dataIndex: 'target_uid'},
                {title: '寄件人', dataIndex: 'sender'},
                {title: '寄件人电话', dataIndex: 'sender_phone'},
                {title: '收件人', dataIndex: 'receiver'},
                {title: '收件人电话', dataIndex: 'receiver_phone'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
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
            let routeUrl = ''
            switch (type) {
                case TARGET_TYPE.PURCHASE_ORDER:  // 采购单详情
                    routeUrl = this.$router.resolve({
                        path: "/purchase/purchase-order-detail",
                        query: {id: item.target_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case TARGET_TYPE.REPAIR_ORDER_TRANSFER:  // 维修单转单详情
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-detail",
                        query: {id: item.target_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case TARGET_TYPE.TRANSFER_ORDER:  // 维修单调货单详情
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/transfer-order-detail",
                        query: {id: item.target_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                // case TARGET_TYPE.AFTER_SALES_ORDER:  // 售后单详情
                //     routeUrl = this.$router.resolve({
                //         path: "/purchase/",
                //         query: {id: item.target_id}
                //     })
                //     break;
            }
            window.open(routeUrl.href, '_blank')
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
            this.loading = true;
            Core.Api.Waybill.list({
                ...this.searchForm,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });     
        },

        //模态弹窗
        handleModalShow(record) {
            this.getWaybillInfo(record)
            this.modalShow = true
        },
        // 获取 物流单详情
        getWaybillInfo({uid, company_uid}) {
            Core.Api.Waybill.queryLogistics({
                uid: uid,
                company_uid: company_uid,
            }).then(res => {
                console.log('getWaybillInfo:', res);
                this.waybillInfo = JSON.parse(res.waybill).result
                console.log('getWaybillInfo', this.waybillInfo)
            }).catch(err => {
                console.log('getPurchaseInfo err', err)
            }).finally(() => {
            });
        },

        //删除物流单
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该物流订单吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Waybill.delete({id}).then(() => {
                        _this.$message.success('删除成功');
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
// #DistributorList {}
</style>