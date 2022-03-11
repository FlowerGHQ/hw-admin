<template>
<div id="AftersalesList" class="list-container">
    <div class="title-container">
        <div class="title-area">售后单列表</div>
        <div class="btns-area">
            <a-button type="primary" @click="routerChange('edit')" v-if="!$auth('ADMIN')"><i class="icon i_add" />申请售后</a-button>
        </div>
    </div>
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
                </template>å
                <template v-if="column.key === 'tip_time'">
                    <a-tooltip :title="text" destroyTooltipOnHide>
                        <div class="ell" style="max-width: 200px">{{ text || '-' }}</div>
                    </a-tooltip>
                </template>
                <template v-if="column.key === 'time'">
                    {{ $Util.timeFilter(text) }}
                </template>
                <template v-if="column.key === 'operation'">
                    <AuditHandle v-if="record.status === STATUS.APPLY && sameOrg(record.supply_org_id, record.supply_org_type)"
                        btnType='link' :api-list="['Aftersales', 'audit']" :id="record.id" @submit="getTableData"
                        :s-pass="STATUS.AUDIT_PASS" :s-refuse="STATUS.AUDIT_REFUSE"><i class="icon i_audit"/>审核
                    </AuditHandle>
                    <template v-if="canEdit(record) && sameOrg(record.org_id, record.org_type)">
                        <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/>修改</a-button>
                        <a-button type="link" @click="handleCancel(record.id)"><i class="icon i_m_error"/>取消</a-button>
                    </template>
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
</template>

<script>

import Core from '../../core';
import TimeSearch from '../../components/common/TimeSearch.vue'
import AuditHandle from '../../components/popup-btn/AuditHandle.vue'

const STATUS = Core.Const.AFTERSALES.STATUS
const QUERY_TYPE = Core.Const.AFTERSALES.QUERY_TYPE

export default {
    name: 'AftersalesList',
    components: {
        TimeSearch,
        AuditHandle,
    },
    props: {},
    data() {
        return {
            STATUS,
            orgId: Core.Data.getOrgId(),
            orgType: Core.Data.getOrgType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            typeMap: Core.Const.AFTERSALES.TYPE_MAP,
            query_type: '',
            searchForm: {
                type: undefined,
                status: undefined,
                sn: '',
                order_sn: '',
                begin_time: '',
                end_time: '',
            },
            statusList: [],
            // 表格
            tableData: [],
            tableColumns: [
                {title: '售后单号', dataIndex: 'sn', key: 'detail'},
                {title: '售后单状态', dataIndex: 'status',key: 'status', align: 'center'},
                {title: '售后类型', dataIndex: 'type'},
                {title: '退款金额', dataIndex: 'money', key: 'money'},
                {title: '申请组织', dataIndex: 'org_name' ,key: 'org'},
                {title: '采购单号', dataIndex: 'order_sn'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right', width: 100,},
            ],
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let query_type = newRoute.meta ? newRoute.meta.query_type : 0
                this.query_type = query_type
                this.handleSearchReset(false);
                this.getStatusList();
            }
        }
    },
    computed: {},
    mounted() {},
    methods: {
        sameOrg(orgId, orgType) {
            if (this.orgId === orgId && this.orgType === orgType) {
                return true
            }
            return false
        },
        canEdit(record) {
            switch (record.status) {
                case STATUS.INIT:
                case STATUS.APPLY:
                case STATUS.AUDIT_FAIL:
                    return true
                default: return false
            }
        },
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 售后单 编辑
                    routeUrl = this.$router.resolve({
                        path: "/aftersales/aftersales-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 售后单 详情
                    routeUrl = this.$router.resolve({
                        path: "/aftersales/aftersales-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'purchase': //采购单 详情
                    routeUrl = this.$router.resolve({
                        path: "/purchase/purchase-order-detail",
                        query: {id: item.order_id}
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
        getTableData() { // 获取 表格 数据
            this.loading = true;
            // return
            Core.Api.Aftersales.list({
                ...this.searchForm,
                query_type: this.query_type,
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
        getStatusList() { // 获取 状态 列表
        },
        // 取消退款申请
        handleCancel(id) {
            let _this = this;
            this.$confirm({
                title: '确定要取消该售后单吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Aftersales.cancel({id}).then(() => {
                        _this.$message.success('取消成功');
                        _this.getStatusList();
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleCancel err", err);
                    })
                },
            });
        },
    },
};
</script>

<style lang='less' scoped>
</style>