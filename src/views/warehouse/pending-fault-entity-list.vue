<template>
<div id="PendingFaultEntityList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">待处理故障件列表</div>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                    <div class="key">零售商名称:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.agent_id" placeholder="请选择零售商" @change="handleSearch" show-search option-filter-prop="children">
                            <a-select-option v-for="item of agentList" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                    <div class="key">门店名称:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.store_id" placeholder="请选择门店" @change="handleSearch" show-search option-filter-prop="children">
                            <a-select-option v-for="item of storeList" :key="item.id" :value="item.id">
                                {{item.name}}
                            </a-select-option>
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
        <div class="operate-container">
            <a-button type="primary" @click="handleEntryShow('batch')">批量入库</a-button>
            <a-button type="primary" @click="handleAuditShow('batch')">批量审核</a-button>
        </div>
        <div class="table-container">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false'
                :row-selection='rowSelection'>
                <template #bodyCell="{ column, record, text}">
                    <template v-if="column.dataIndex === 'org_type'">
                        {{ $Util.userTypeFilter(text) }}
                    </template>
                    <template v-if="column.dataIndex === 'service_type'">
                        {{ $Util.repairServiceFilter(text) }}
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status status-bg status-tag" :class="$Util.faultStatusFilter(text,'color')">
                            {{ $Util.faultStatusFilter(text) }}
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'create_time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="handleEntryShow('', record)" v-if="record.org_type !== LOGIN_TYPE.ADMIN"><i class="icon i_s_warehouse"/> 入库</a-button>
                        <a-button type="link" @click="handleAuditShow('', record)" v-if="record.status === AUDIT_TYPE.WAIT"><i class="icon i_m_success"/> 审核</a-button>
                        <a-button type="link" @click="handleDelete(record.id)" class="danger"><i class="icon i_delete"/> 删除</a-button>
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
        <a-modal v-model:visible="auditShow" title="审核" class="audit-modal" :after-close='handleAuditClose'>
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">审核结果:</div>
                    <a-radio-group v-model:value="auditForm.audit_result">
                        <a-radio :value="AUDIT_TYPE.SUCCESS">通过</a-radio>
                        <a-radio :value="AUDIT_TYPE.FAIL">不通过</a-radio>
                    </a-radio-group>
                </div>
                <div class="form-item textarea required" v-if="auditForm.audit_result === AUDIT_TYPE.FAIL">
                    <div class="key">原因:</div>
                        <div class="value">
                            <a-textarea v-model:value="auditForm.audit_message" placeholder="请输入不通过原因" :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                        </div>
                    </div>
                </div>
            <template #footer>
                <a-button @click="handleAuditClose">取消</a-button>
                <a-button @click="handleAuditSubmit" type="primary">确定</a-button>
            </template>
        </a-modal>
        <a-modal v-model:visible="entryShow" title="入库" class="audit-modal" :after-close='handleEntryClose'>
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">所处仓库:</div>
                    <div class="value">
                        <a-select v-model:value="entryForm.warehouse_id" placeholder="请选择仓库" show-search option-filter-prop="children" >
                            <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleEntryClose">取消</a-button>
                <a-button @click="handleEntrySubmit" type="primary">确定</a-button>
            </template>
        </a-modal>       
    </template>
</div>
</template>

<script>
import Core from '../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import TimeSearch from '@/components/common/TimeSearch.vue'
const FAULT_ENTITY = Core.Const.FAULT_ENTITY
const LOGIN_TYPE = Core.Const.LOGIN.TYPE

export default {
    name: 'PendingFaultEntityList',
    components: {
        ItemSelect,
        TimeSearch
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            AUDIT_TYPE: FAULT_ENTITY.AUDIT_TYPE,
            LOGIN_TYPE,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            warehouseList: [], // 仓库列表
            storeList: [], // 分销商列表
            agentList: [], // 零售商列表
            searchForm: {
                store_id: undefined,
                agent_id: undefined,
                distributor_id: undefined,
                begin_time: '',
                end_time: '',
            },
            // 表格
            tableData: [],
            selectedRowKeys: [],
            selectedRowItems: [],
            tableColumns: [
                {title: '维修单号', dataIndex: 'source_uid'},
                {title: '机构类型', dataIndex: 'org_type'},
                {title: '所处仓库', dataIndex: 'warehouse_name'},
                {title: '车架编号', dataIndex: 'vehicle_no'},
                {title: '商品', dataIndex: ['item','name'],},  
                {title: '产品故障类型', dataIndex: 'item_fault_name'},
                {title: '检测人', dataIndex: 'audit_user_name'},
                {title: '工单帐类', dataIndex: 'service_type'},
                {title: '状态', dataIndex: 'status'},
                {title: '创建时间', dataIndex: 'create_time'},
                {title: '操作', key: 'operation', fixed: 'right' },
            ],
            // 弹框
            // 审核
            auditShow: false,
            auditForm: {
                ids: '',
                audit_result: undefined,
                audit_message: '',
            },
            // 入库
            entryShow: false,
            entryForm: {
                ids: '',
                warehouse_id: undefined
            }
        };
    },
    watch: {},
    computed: {
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => { // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys
                    this.selectedRowItems = selectedRows
                    console.log('rowSelection onChange this.selectedRowKeys', this.selectedRowKeys);
                },
                /* getCheckboxProps: record => ({
                    disabled: record.org_type === LOGIN_TYPE.ADMIN
                }), */
            };
        },
    },
    mounted() {
        this.getStoreList();
        this.getAgentList();
        this.getTableData();
    },
    methods: {
        pageChange(curr) { // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) { // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() { // 搜索
            this.pageChange(1);
        },
        handleTimeSearch(type, begin_time, end_time) { // 时间搜索
            if (begin_time || end_time) {
                this.searchForm.begin_time = begin_time
                this.searchForm.end_time = end_time
            }
            this.pageChange(1);
        },
        handleSearchReset() { // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            console.log('this.searchForm:', this.searchForm)
            this.$refs.TimeSearch.handleReset()
            this.pageChange(1);
        },
        // 获取列表数据
        getAgentList() { // 获取零售商列表
            Core.Api.Agent.list().then(res => {
                console.log('this.agentList', res.list);  
                this.agentList = res.list
            })
        },
        getStoreList() { // 获取门店列表
            Core.Api.Store.list().then(res => {
                console.log('this.storeList', res.list);  
                this.storeList = res.list
            })
        },
        getTableData() { // 获取 表格 数据
            this.loading = true;
            Core.Api.FaultEntity.list({
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
        getWarehouseList() { // 获取仓库数据  
            const type = 2  // 残次仓类型       
            Core.Api.Warehouse.listAll({type}).then(res => {
                this.warehouseList = res.list
            })
        },

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该故障件吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.FaultEntity.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },

        // 审核
        handleAuditShow(type, record) { // 显示弹框
            if (type === 'batch') {
                this.auditForm.ids = this.selectedRowKeys.join(',')
            } else {
                this.auditForm.ids = record.id
            }
            this.auditShow = true
            console.log('handleAuditShow', this.auditForm.ids)
        },
        handleAuditClose() { // 关闭弹框
            this.auditShow = false
            this.selectedRowKeys = []
            this.selectedRowItems = []
            this.auditForm = {
                ids: '',
                audit_result: undefined,
                audit_message: '',
            }
        },
        handleAuditSubmit() { // 审核提交
            if (this.selectedRowItems.length) {
                for (const item of this.selectedRowItems) {
                    if (item.status !== this.AUDIT_TYPE.WAIT) {
                        return this.$message.warning('请勿审核已审核的故障件')
                    } 
                }
            }
            if (!this.auditForm.audit_result) {
                return this.$message.warning('请选择审核结果')
            }
            Core.Api.FaultEntity.batchAudit(this.auditForm).then(() => {
                this.$message.success('完成审核');
                this.getTableData();
                this.handleAuditClose()
            }).catch(err => {
                console.log("handleAuditSubmit err", err);
            })
        },
        // 入库
        handleEntryShow(type, record) {
            if (type === 'batch') {
                this.entryForm.ids = this.selectedRowKeys.join(',')
            } else {
                this.entryForm.ids = record.id
            }
            this.getWarehouseList()
            this.entryShow = true
        },
        handleEntryClose() {
            this.entryShow = false
            this.selectedRowKeys = []
            this.selectedRowItems = []
            this.entryForm = {
                ids: '',
                warehouse_id: undefined
            }
        },
        handleEntrySubmit() {
            if (this.selectedRowItems.length) {
                for (const item of this.selectedRowItems) {
                    if (item.org_type === LOGIN_TYPE.ADMIN) {
                        return this.$message.warning('请不要入库已入库的故障件')
                    }
                }
            }
            if(!this.entryForm.warehouse_id) {
                this.$message.warning('请选择所处仓库')
            } else {
                Core.Api.FaultEntity.batchRecycle(this.entryForm).then(() => {
                    this.$message.success('完成入库');
                    this.getTableData();
                    this.handleEntryClose()
                }).catch(err => {
                    console.log("handleEntrySubmit err", err);
                })
            }
        },
    }
};
</script>

<style lang="less">
// #WarehouseList {}
.fault-entity-modal {
    .select-item-btn {
        height: 32px;
    }
    .item-display {
        display: flex;
        img {
            max-width:60px
        }
    }
}
</style>