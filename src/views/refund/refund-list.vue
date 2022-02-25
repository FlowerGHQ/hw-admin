<template>
    <div id="RefundList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">退款列表</div>
            </div>
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.status" @change='handleSearch'>
                    <a-tab-pane :key="item.key" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">{{ item.text }}<span :class="item.color">{{ item.value }}</span>
                            </div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">订单编号:</div>
                        <div class="value">
                            <a-input placeholder="请输入退款订单编号" v-model:value="searchForm.sn"
                                     @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='8' class="search-item">
                        <div class="key">退款类型:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" @change="handleSearch" placeholder="请选择退款类型">
                                <a-select-option v-for="(val, index) of typeList" :key="index" :value="val.value">{{val.text}}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                        <div class="key">退款时间:</div>
                        <div class="value">
                            <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch"
                                            :show-time="defaultTime" :allow-clear='false'>
                                <template #suffixIcon><i class="icon i_calendar"></i></template>
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
                         :row-key="record => record.id" :pagination='false'  @change="handleTableChange">
                    <template #bodyCell="{ column, text , record}">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'user'">
                            {{ text }}
                        </template>
                        <template v-if="column.key === 'money'">
                            €{{ text/100 }}
                        </template>
                        <template v-if="column.key === 'tip_time'">
                            <a-tooltip :title="text" destroyTooltipOnHide>
                                <div class="ell" style="max-width: 200px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.refundTypeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="$Util.refundStatusFilter(text,'color')">
                                <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                                {{ $Util.refundStatusFilter(text) }}
                                    <template v-if="record.status === STATUS.AUDIT_REFUSE">
                                        <i class="icon i_hint" style="font-size: 12px;padding-left: 6px;"/>
                                    </template>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('create',record)" v-if="record.status === STATUS.WAIT_AUDIT && authOrg(record.org_id, record.org_type)"><i class="icon i_edit"/>修改
                            </a-button>
                            <a-button type="link" @click="handleRefundShow(record.id)" v-if="record.status === STATUS.WAIT_AUDIT && authOrg(record.supply_org_id, record.supply_org_type)"><i class="icon i_m_success"/>审核
                            </a-button>
                            <a-button type="link" @click="handleCancel(record.id)" v-if="record.status === STATUS.WAIT_AUDIT && authOrg(record.org_id, record.org_type)"><i class="icon i_m_error"/>取消
                            </a-button>
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
        <template class="modal-container">
            <a-modal v-model:visible="refundShow" title="审核" class="refund-edit-modal"
                     :after-close='handleRefundClose'>
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">审核结果:</div>
                        <a-radio-group v-model:value="editForm.status">
                            <a-radio :value="STATUS.AUDIT_PASS">通过</a-radio>
                            <a-radio :value="STATUS.AUDIT_REFUSE">不通过</a-radio>
                        </a-radio-group>
                    </div>
                    <div class="form-item textarea required" v-if="editForm.status === STATUS.AUDIT_REFUSE">
                        <div class="key">原因:</div>
                        <div class="value">
                            <a-textarea v-model:value="editForm.audit_message" placeholder="请输入不通过原因"
                                        :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="refundShow = false">取消</a-button>
                    <a-button @click="handleRefundSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>
<script>

import Core from '../../core';
const REFUND_STATUS = Core.Const.REFUND.STATUS
export default {
    name: 'RefundList',
    components: {},
    props: {},
    data() {
        return {
            loginOrgId: Core.Data.getOrgId(),
            loginOrgType: Core.Data.getOrgType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            detail: {},
            total: 0,
            // 搜索
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            typeList: Core.Const.REFUND.TYPE,
            order_id: '',
            searchForm: {
                id: '',
                uid: '',
                type: undefined,
                status: undefined,
                sn: '',
            },
            tableData: [],
            statusList: [
                {text: '全  部', value: '0', color: 'primary', key: '0'},
                {text: '待审核', value: '0', color: 'yellow', key: REFUND_STATUS.WAIT_AUDIT},
                {text: '审核通过', value: '0', color: 'blue', key: REFUND_STATUS.AUDIT_PASS},
                {text: '审核失败', value: '0', color: 'red', key: REFUND_STATUS.AUDIT_REFUSE},
                {text: '退款完成', value: '0', color: 'green', key: REFUND_STATUS.SUCCESS},
                {text: '取消退款', value: '0', color: 'grey', key: REFUND_STATUS.CANCEL},
            ],
            STATUS: Core.Const.REFUND.STATUS,
            refundShow: false,
            editForm: {
                id: '',
                status: '',
                audit_message: '',
            },
            SEARCH_TYPE: Core.Const.REFUND.SEARCH_TYPE,
            search_type: 0,
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let search_type = newRoute.meta ? newRoute.meta.search_type : 0
                this.search_type = search_type
                console.log("search_type", search_type, this.search_type)
                this.handleSearchReset();
                this.getStatusList();
            }
        }
    },
    computed: {
        tableColumns() {
            let columns = [
                {title: '订单号', dataIndex: 'order_sn', key: 'detail'},
                {title: '退款金额', dataIndex: 'money', key: 'money'},
                {title: '退款原因', dataIndex: 'apply_message', key: 'tip_time'},
                {title: '退款类型', dataIndex: 'type'},
                {title: '申请人', dataIndex: ['apply_user','account','name'],key: 'user'},
                {title: '订单状态', dataIndex: 'status',key: 'status', align: 'center'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right', width: 100,},

            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
        this.getStatusList();
    },
    methods: {
        authOrg(orgId, orgType) {
            if (this.loginOrgId === orgId && this.loginOrgType === orgType) {
                return true
            }
            return false
        },
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'create':  // 新建
                    routeUrl = this.$router.resolve({
                        path: "/refund/refund-create",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/purchase/purchase-order-detail",
                        query: {id: item.order_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        handleTypeSelect(val) {
            this.type = val
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
            this.create_time = []
            this.pageChange(1);
        },
        handleTableChange(page, filters, sorter) {
            console.log('handleTableChange filters:', filters)
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : ''
            }
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            this.loading = false;
            let orgId = 0
            let orgType = 0
            let supplyOrgId = 0
            let supplyOrgType = 0
            if (this.search_type === this.SEARCH_TYPE.SELF) {
                orgId = this.loginOrgId
                orgType = this.loginOrgType
            } else {
                supplyOrgId = this.loginOrgId
                supplyOrgType = this.loginOrgType
            }
            // return
            Core.Api.Refund.list({
                ...this.searchForm,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
                org_id: orgId,
                org_type: orgType,
                supply_org_id: supplyOrgId,
                supply_org_type: supplyOrgType,
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
        handleCancel(id) {
            let _this = this;
            this.$confirm({
                title: '确定要取消该退款单吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Refund.cancel({id}).then(() => {
                        _this.$message.success('取消成功');
                        _this.getStatusList();
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        getStatusList() {    // 获取 状态 列表
            this.loading = true;
            this.loading = false;
            let orgId = 0
            let orgType = 0
            let supplyOrgId = 0
            let supplyOrgType = 0
            if (this.search_type === this.SEARCH_TYPE.SELF) {
                orgId = this.loginOrgId
                orgType = this.loginOrgType
            } else {
                supplyOrgId = this.loginOrgId
                supplyOrgType = this.loginOrgType
            }
            Core.Api.Refund.status({
                org_id: orgId,
                org_type: orgType,
                supply_org_id: supplyOrgId,
                supply_org_type: supplyOrgType
            }).then(res => {
                console.log("getStatusList res:", res)
                let total = 0

                this.statusList.forEach(statusItem => {
                    statusItem.value = 0
                })
                this.statusList.forEach(statusItem => {
                    res.status_list.forEach(item => {
                        if ( statusItem.key == item.status) {
                            statusItem.value = item.amount
                            total += item.amount
                        }
                    })
                })
                this.statusList[0].value = total
            }).catch(err => {
                console.log('getStatusList err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getRefundDetail() {
            Core.Api.Refund.detail({
                id: this.id,
            }).then(res => {
                this.detail = res.detail
                console.log('getRefundDetail err', res)
            }).catch(err => {
                console.log('getRefundDetail err', err)
            }).finally(() => {
            });
        },
        handleRefundShow(id) { // 显示弹框
            this.refundShow = true
            this.editForm.id = id
        },
        handleRefundClose() { // 关闭弹框
            this.refundShow = false;
        },
        handleRefundSubmit() { // 审核提交
            this.loading = true;
            Core.Api.Refund.audit({
                ...this.editForm
            }).then(res => {
                console.log('handleRefundSubmit res', res)
                this.handleRefundClose()
                this.getTableData()
                this.getStatusList()
            }).catch(err => {
                console.log('handleRefundSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    },
};
</script>

<style scoped>

</style>