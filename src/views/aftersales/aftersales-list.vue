<template>
<div id="AftersalesList" class="list-container">
    <div class="title-container">
        <div class="title-area">售后单列表</div>
        <div class="btns-area">
            <a-button type="primary" @click="routerChange('edit')" v-if="!$auth('ADMIN')"><i class="icon i_add" />申请售后</a-button>
        </div>
    </div>
    <!-- <div class="tabs-container colorful">
        <a-tabs v-model:activeKey="searchForm.status" @change='handleSearch'>
            <a-tab-pane :key="item.key" v-for="item of statusList">
                <template #tab>
                    <div class="tabs-title">
                        {{ item.text }}<span :class="item.color">{{ item.value }}</span>
                    </div>
                </template>
            </a-tab-pane>
        </a-tabs>
    </div> -->
    <div class="search-container">
        <a-row class="search-area">
            <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                <div class="key">售后单编号:</div>
                <div class="value">
                    <a-input placeholder="请输入售后单编号" v-model:value="searchForm.sn" @keydown.enter='handleSearch'/>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                <div class="key">采购单编号:</div>
                <div class="value">
                    <a-input placeholder="请输入采购单编号" v-model:value="searchForm.order_sn" @keydown.enter='handleSearch'/>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                <div class="key">售后类型:</div>
                <div class="value">
                    <a-select placeholder="请选择售后类型" v-model:value="searchForm.type" @change='handleSearch'>
                        <a-select-option v-for="item of typeList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                    </a-select>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                <div class="key">创建时间:</div>
                <div class="value"><TimeSearch @search="handleTimeSearch" ref='TimeSearch'/></div>
            </a-col>
        </a-row>
        <div class="btn-area">
            <a-button @click="handleSearch" type="primary">查询</a-button>
            <a-button @click="handleSearchReset">重置</a-button>
        </div>
    </div>
    <div class="table-container">
        <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
            :row-key="record => record.id" :pagination='false'>
            <template #bodyCell="{ column, text , record}">
                <template v-if="column.dataIndex === 'sn'">
                    <a-tooltip placement="top" :title='text'>
                        <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}</a-button>
                    </a-tooltip>
                </template>
                <template v-if="column.dataIndex === 'order_sn'">
                    <a-tooltip placement="top" :title='text'>
                        <a-button type="link" @click="routerChange('purchase', record)">{{ text || '-' }}</a-button>
                    </a-tooltip>
                </template>
                <template v-if="column.dataIndex === 'type'">
                    {{ $Util.aftersalesTypeFilter(text) }}
                </template>
                <template v-if="column.dataIndex === 'status'">
                    <div class="status status-bg status-tag" :class="$Util.aftersalesStatusFilter(text,'color')">
                        <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                            {{ $Util.aftersalesStatusFilter(text) }}
                        </a-tooltip>
                    </div>
                </template>
                <template v-if="column.key === 'item'">
                    {{ text || '-' }}
                </template>
                <template v-if="column.key === 'money'">
                    €{{ $Util.countFilter(text)  }}
                </template>
                <template v-if="column.key === 'tip_time'">
                    <a-tooltip :title="text" destroyTooltipOnHide>
                        <div class="ell" style="max-width: 200px">{{ text || '-' }}</div>
                    </a-tooltip>
                </template>
                <template v-if="column.key === 'time'">
                    {{ $Util.timeFilter(text) }}
                </template>
                <template v-if="column.key === 'operation'">
                    <a-button type="link" @click="routerChange('edit',record)"
                        v-if="record.status === STATUS.WAIT_AUDIT && authOrg(record.org_id, record.org_type)">
                        <i class="icon i_edit"/>修改
                    </a-button>
                    <a-button type="link" @click="handleAuditShow(record.id)"
                        v-if="record.status === STATUS.WAIT_AUDIT && authOrg(record.supply_org_id, record.supply_org_type)">
                        
                    </a-button>
                    <AuditHandle @submit="getTableData">
                        <i class="icon i_audit"/>审核
                    </AuditHandle>
                    <a-button type="link" @click="handleCancel(record.id)"
                        v-if="record.status === STATUS.WAIT_AUDIT && authOrg(record.org_id, record.org_type)">
                        <i class="icon i_m_error"/>取消
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
    <template class="modal-container">
        <a-modal v-model:visible="auditShow" title="审核" class="refund-edit-modal" :after-close='handleAuditClose'>
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">审核结果:</div>
                    <a-radio-group v-model:value="auditForm.status">
                        <a-radio :value="STATUS.AUDIT_PASS">通过</a-radio>
                        <a-radio :value="STATUS.AUDIT_REFUSE">不通过</a-radio>
                    </a-radio-group>
                </div>
                <div class="form-item textarea required" v-if="auditForm.status === STATUS.AUDIT_REFUSE">
                    <div class="key">原因:</div>
                    <div class="value">
                        <a-textarea v-model:value="auditForm.audit_message" placeholder="请输入不通过原因"
                            :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="auditShow = false">取消</a-button>
                <a-button @click="handleAuditSubmit" type="primary">确定</a-button>
            </template>
        </a-modal>
    </template>
</div>
</template>

<script>

import Core from '../../core';
import TimeSearch from '../../components/common/TimeSearch.vue'

const STATUS = Core.Const.REFUND.STATUS
const SEARCH_TYPE = Core.Const.REFUND.SEARCH_TYPE
export default {
    name: 'AftersalesList',
    components: {
        TimeSearch,
    },
    props: {},
    data() {
        return {
            STATUS,
            loginOrgId: Core.Data.getOrgId(),
            loginOrgType: Core.Data.getOrgType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            query_type: '',
            typeMap: Core.Const.AFTERSALES.TYPE_MAP,
            searchForm: {
                type: undefined,
                status: undefined,
                sn: '',
                begin_time: '',
                end_time: '',
            },
            statusList: [
                {text: '全  部', value: '0', color: 'primary', key: '0'},
                {text: '待审核', value: '0', color: 'yellow', key: STATUS.WAIT_AUDIT},
                {text: '审核通过', value: '0', color: 'blue', key: STATUS.AUDIT_PASS},
                {text: '审核失败', value: '0', color: 'red', key: STATUS.AUDIT_REFUSE},
                {text: '退款完成', value: '0', color: 'green', key: STATUS.SUCCESS},
                {text: '取消退款', value: '0', color: 'grey', key: STATUS.CANCEL},
            ],
            // 表格
            tableData: [],
            tableColumns: [
                {title: '订单号', dataIndex: 'order_sn', key: 'detail'},
                {title: '退款金额', dataIndex: 'money', key: 'money'},
                {title: '退款原因', dataIndex: 'apply_message', key: 'tip_time'},
                {title: '退款类型', dataIndex: 'type'},
                {title: '申请人', dataIndex: ['apply_user','account','name'],key: 'item'},
                {title: '订单状态', dataIndex: 'status',key: 'status', align: 'center'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right', width: 100,},
            ],
            // 审核
            auditShow: false,
            auditForm: {
                id: '',
                status: '',
                audit_message: '',
            },
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let search_type = newRoute.meta ? newRoute.meta.search_type : 0
                this.search_type = search_type
                this.handleSearchReset(false);
                this.getStatusList();
            }
        }
    },
    computed: {},
    mounted() {},
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
        handleTimeSearch(type, begin_time, end_time) { // 时间搜索
            if (begin_time || end_time) {
                this.searchForm.begin_time = begin_time
                this.searchForm.end_time = end_time
            }
            this.pageChange(1);
        },
        handleSearchReset(flag = true) {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            if (flag) {
                this.$refs.TimeSearch.handleReset()
            }
            this.pageChange(1);
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            // return
            Core.Api.Refund.list({
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
        getStatusList() {    // 获取 状态 列表
        },
        // 取消退款申请
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
        // 退款审核
        handleAuditShow(id) { // 显示弹框
            this.auditShow = true
            this.auditForm.id = id
        },
        handleAuditClose() { // 关闭弹框
            this.auditShow = false;
        },
        handleAuditSubmit() { // 审核提交
            this.loading = true;
            Core.Api.Refund.audit({
                ...this.auditForm
            }).then(res => {
                console.log('handleAuditSubmit res', res)
                this.handleAuditClose()
                this.getTableData()
                this.getStatusList()
            }).catch(err => {
                console.log('handleAuditSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    },
};
</script>

<style lang='less' scoped>
</style>