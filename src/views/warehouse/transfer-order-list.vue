<template>
    <div id="TransferOrderList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">调货单列表</div>
                <div class="btns-area">
                    <a-button type="primary" v-if="!$auth('ADMIN')" @click="handleTransferOrderShow"><i class="icon i_add"/>新建调货单</a-button>
                </div>
            </div>
            <div class="tabs-container colorful" v-if="$auth('ADMIN')">
                <a-tabs v-model:activeKey="searchForm.status" @change='handleSearch'>
                    <a-tab-pane :key="item.key" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">{{ item.text }}<span :class="item.color">{{ item.value }}</span></div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">仓库名称:</div>
                        <div class="value">
                            <a-input placeholder="请输入仓库名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">货单编号:</div>
                        <div class="value">
                            <a-input placeholder="请输入调货单编号" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value">
                            <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch" :show-time="defaultTime" :allow-clear='false'>
                                <template #suffixIcon><i class="icon i_calendar"/></template>
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
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'org-type'">
                            {{ $Util.userTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.stockTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'warehouse-name'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="$Util.transferStatusFilter(text,'color')">
                                <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                                    {{ $Util.transferStatusFilter(text) }}
                                    <template v-if="record.status === STATUS.AUDIT_REFUSE">
                                        <i class="icon i_hint" style="font-size: 12px;padding-left: 6px;"/>
                                    </template>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" v-if="record.status === STATUS.WAIT_AUDIT && $auth('ADMIN')" @click="handleTransferShow(record.id)">
                                <i class="icon i_edit"/>审核
                            </a-button>
                            <!-- <a-button type="link"  v-else-if="record.status === STATUS.AUDIT_PASS" @click="handleInvoice(record.id)"><i
                                class="icon i_edit"/>处理
                            </a-button> -->
                            <template v-if="record.status === STATUS.WAIT_AUDIT && !$auth('ADMIN')">
                                <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/>修改</a-button>
                                <a-button type="link" @click="handleCancel(record.id)" class="danger"><i class="icon i_m_error"/>取消</a-button>
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
        <a-modal v-model:visible="transferOrderShow" title="新建调货单" class="transfer-edit-modal" :after-close="handleTransferOrderClose">
            <div class="form-item required">
                <div class="key">仓库:</div>
                <div class="value">
                    <a-select v-model:value="form.to_warehouse_id" placeholder="请选择仓库">
                        <a-select-option v-for="warehouse of warehouseList" :key="warehouse.id" :value="warehouse.id">
                            {{ warehouse.name }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item textarea required">
                <div class="key">原因:</div>
                <div class="value">
                    <a-textarea v-model:value="form.apply_message" placeholder="请输入申请原因" :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleTransferOrderSubmit" type="primary">确定</a-button>
                <a-button @click="transferOrderShow=false">取消</a-button>
            </template>
        </a-modal>
        <template class="modal-container">
            <a-modal v-model:visible="transferShow" title="审核" class="invoice-edit-modal" :after-close='handleTransferClose'>
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
                    <a-button @click="transferShow = false">取消</a-button>
                    <a-button @click="handleTransferSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';

const TRANSFER_ORDER = Core.Const.TRANSFER_ORDER
export default {
    name: 'TransferOrderList',
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
            create_time: [],
            detail: {
                warehouse: {}
            },
            transferOrderShow: false,
            isExist: '',
            filteredInfo: {status: [0]},
            warehouseList: [],
            statusList: [
                {text: '全  部', value: '0', color: 'primary', key: '0'},
                {text: '待审核', value: '0', color: 'yellow', key: TRANSFER_ORDER.STATUS.AIT_AUDIT},
                {text: '审核通过', value: '0', color: 'green', key: TRANSFER_ORDER.STATUS.AUDIT_PASS},
                {text: '审核失败', value: '0', color: 'red', key: TRANSFER_ORDER.STATUS.AUDIT_REFUSE},
                {text: '处理完成', value: '0', color: 'green', key: TRANSFER_ORDER.STATUS.CLOSE},
                {text: '已取消', value: '0', color: 'blue', key: TRANSFER_ORDER.STATUS.CANCEL},
            ],
            searchForm: {
                name: '',
                uid: '',
                status: undefined,
                type: undefined,
            },
            warehouse_id: '',
            form: {
                to_warehouse_id: undefined,
                warehouse_id: undefined,
                apply_message: '',
            },
            tableData: [],
            transferShow: false,
            STATUS: Core.Const.TRANSFER_ORDER.STATUS,
            editForm: {
                id: '',
                status: 20,
                audit_message: '',
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let {filteredInfo} = this;
            filteredInfo = filteredInfo || {};
            let columns = [
                {title: '调货单编号', dataIndex: 'uid', key: 'detail'},
                {title: '创建单位', dataIndex: 'org_name', key: 'org-ame'},
                {title: '单位类型', dataIndex: 'org_type', key: 'org-type'},
                {title: '所属仓库', dataIndex: ['to_warehouse', 'name'], key: 'warehouse-name',},
                {title: '仓库类型', dataIndex: ['to_warehouse', 'type'], key: 'type',},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '状态', dataIndex: 'status', key: 'status', align: 'center'},
                {title: '操作', key: 'operation', fixed: 'right'},
            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
        this.getWarehouseList();
        this.getStatusList();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item)
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/transfer-order-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/transfer-order-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        handleTransferOrderShow() {
            this.transferOrderShow = true;
        },
        handleTransferOrderClose() {
            this.transferOrderShow = false;
            this.isExist = '';
            this.form = {
                type: '',
                to_warehouse_id: '',
                warehouse_id: '',
            }
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list
            })
        },
        handleTransferOrderSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.to_warehouse_id) {
                return this.$message.warning('请选择仓库')
            }
            if (!form.apply_message) {
                return this.$message.warning('请输入申请原因')
            }
            Core.Api.Transfer.save(form).then(res => {
                this.$message.success('保存成功')
                this.handleTransferOrderClose()
                this.routerChange('edit', res.detail)
            }).catch(err => {
                console.log('handleTransferSubmit err:', err)
            })
        },
        handleTypeSelect(val) {
            this.type = val
        },
        pageChange(curr) {    // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {    // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {    // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            console.log('this.searchForm:', this.searchForm)
            this.create_time = []
            this.pageChange(1);
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.Transfer.list({
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
        handleCancel(id) {
            let _this = this;
            this.$confirm({
                title: '确定要取消该调货单吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Invoice.cancel({id}).then(() => {
                        _this.$message.success('取消成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        handleTransferShow(id) { // 显示弹框
            this.transferShow = true
            this.editForm.id = id
        },
        handleTransferClose() { // 关闭弹框
            this.transferShow = false;
        },
        handleTransferSubmit() { // 审核提交
            this.loading = true;
            Core.Api.Transfer.audit({
                ...this.editForm
            }).then(res => {
                console.log('handleTransferSubmit res', res)
                this.handleTransferClose()
                this.getTableData()
                this.getStatusList()
            }).catch(err => {
                console.log('handleTransferSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getStatusList() {    // 获取 状态 列表
            Object.assign(this.statusList, this.$options.data().statusList)
            Core.Api.Transfer.status({
                ...this.searchForm,
            }).then(res => {
                console.log("getStatusList res:", res)
                let total = 0
                this.statusList.forEach(statusItem => {
                    res.status_list.forEach(item => {
                        if (statusItem.key == item.status) {
                            statusItem.value = item.amount
                            total += item.amount
                        }
                    })
                })
                console.log(total)
                this.statusList[0].value = total
            }).catch(err => {
                console.log('getStatusList err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleTableChange(page, filters, sorter) {
            console.log('handleTableChange filters:', filters)
            this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : ''
            }
            this.searchForm.status = filters.status ? filters.status[0] : 1
            this.pageChange(1);
        },
    }
};
</script>

<style lang="less" scoped>
//
</style>