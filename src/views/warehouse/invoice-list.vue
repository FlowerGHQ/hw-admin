<template>
<div id="InvoiceList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">出入库单列表</div>
            <div class="btns-area">
                <a-button type="primary" @click="handleStockShow"><i class="icon i_add"/>库存管理</a-button>
            </div>
        </div>
        <div class="tabs-container colorful">
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
                    <div class="key">出入库单编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入出入库单编号" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">出入库单类型:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.type" @change="handleTypeSelect" placeholder="请选择出入库类型">
                            <a-select-option v-for="(val, key) in typeMap" :key='key' :value='keu'>{{val}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
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
                :row-key="record => record.id" :pagination='false'>
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'detail'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}
                            </a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'stock_type'">
                        {{ $Util.stockRecordFilter(text) }}
                    </template>
                    <template v-if="column.key === 'type'">
                        {{ $Util.stockTypeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'warehouse_name'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status status-bg status-tag" :class="$Util.invoiceStatusFilter(text,'color')">
                            {{ $Util.invoiceStatusFilter(text) }}
                        </div>
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type="link" v-if="record.status === STATUS.AIT_AUDIT"
                                    @click="handleInvoiceShow(record.id)"><i
                            class="icon i_edit"/>审核
                        </a-button>
                        <a-button type="link" v-else-if="record.status === STATUS.AUDIT_PASS"
                                    @click="handleInvoice(record.id)"><i
                            class="icon i_edit"/>处理
                        </a-button>
                        <a-button type="link" v-if="record.status === STATUS.AIT_AUDIT"
                                    @click="routerChange('edit',record)"><i class="icon i_edit"/> 修改
                        </a-button>
                        <a-button type="link" v-if="record.status === STATUS.AIT_AUDIT" @click="handleCancel(record.id)" class="danger">
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
    </div>
    <template class="modal-container">
        <a-modal v-model:visible="stockShow" title="库存管理" class="stock-edit-modal" :after-close="handleStockClose">
            <div class="form-item required">
                <div class="key">仓库：</div>
                <div class="value">
                    <a-select v-model:value="form.warehouse_id" placeholder="请选择仓库">
                        <a-select-option v-for="warehouse of warehouseList" :key="warehouse.id" :value="warehouse.id">
                            {{ warehouse.name }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">类型：</div>
                <div class="value">
                    <a-radio-group v-model:value="form.type">
                        <a-radio v-for="(val, key) in typeMap" :key='key' :value='key'>{{val}}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <template #footer>
                <a-button @click="stockShow=false">取消</a-button>
                <a-button @click="handleStockSubmit" type="primary">确定</a-button>
            </template>
        </a-modal>
        <a-modal v-model:visible="invoiceShow" title="审核" class="invoice-edit-modal" :after-close='handleInvoiceClose'>
            <div class="modal-content">
                <div>
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
            </div>
            <template #footer>
                <a-button @click="invoiceShow = false">取消</a-button>
                <a-button @click="handleInvoiceSubmit" type="primary">确定</a-button>
            </template>
        </a-modal>
    </template>
</div>
</template>

<script>
import Core from '../../core';

const STOCK_RECORD = Core.Const.STOCK_RECORD
export default {
    name: 'InvoiceList',
    components: {},
    props: {},
    data() {
        return {
            STATUS: Core.Const.STOCK_RECORD.STATUS,
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
            typeMap: Core.Const.STOCK_RECORD.TYPE_MAP, //出入库
            statusList: [
                {text: '全  部', value: '0', color: 'primary', key: '0'},
                {text: '待审核', value: '0', color: 'yellow', key: STOCK_RECORD.STATUS.AIT_AUDIT},
                {text: '审核通过', value: '0', color: 'blue', key: STOCK_RECORD.STATUS.AUDIT_PASS},
                {text: '审核失败', value: '0', color: 'red', key: STOCK_RECORD.STATUS.AUDIT_REFUSE},
                {text: '处理完成', value: '0', color: 'green', key: STOCK_RECORD.STATUS.CLOSE},
                {text: '已取消', value: '0', color: 'gray', key: STOCK_RECORD.STATUS.CANCEL},
            ],
            searchForm: {
                name: '',
                uid: '',
                status: undefined,
                type: undefined,
            },

            tableData: [],

            stockShow: false,
            warehouseList: [],
            form: {
                type: '',
                id: '',
                warehouse_id: undefined,
            },

            invoiceShow: false,
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
            let columns = [
                {title: '出入库单编号', dataIndex: 'uid', key: 'detail'},
                {title: '出入库单类型', dataIndex: 'type', key: 'stock_type',},
                {title: '所属仓库', dataIndex: ['warehouse', 'name'], key: 'warehouse_name',},
                {title: '仓库类型', dataIndex: 'type', key: 'type',},
                {title: '申请人', dataIndex: ['apply_user', "account", "name"], key: 'apply_user'},
                {title: '处理人', dataIndex: ['operator_user', "account", "name"], key: 'operator_user'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '处理时间', dataIndex: 'operate_time', key: 'time'},
                {title: '状态', dataIndex: 'status', key: 'status'},
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
                        path: "/warehouse/invoice-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/invoice-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        handleStockShow() {
            this.stockShow = true;
        },
        handleStockClose() {
            this.stockShow = false;
            this.form = {
                type: '',
                id: '',
                warehouse_id: undefined,
            }
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list
            })
        },
        handleStockSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.warehouse_id) {
                return this.$message.warning('请选择仓库')
            }
            if (!form.type) {
                return this.$message.warning('请选择类型')
            }
            Core.Api.Invoice.save(form).then(res => {
                this.$message.success('保存成功')
                this.handleStockClose()
                this.routerChange('edit', res.detail)
            }).catch(err => {
                console.log('handleStockSubmit err:', err)
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
            Core.Api.Invoice.list({
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
                title: '确定要取消该出入库单吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Transfer.cancel({id}).then(() => {
                        _this.$message.success('取消成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        getStatusList() {    // 获取 状态 列表
            Object.assign(this.statusList, this.$options.data().statusList)
            Core.Api.Invoice.status({
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
        handleInvoiceShow(id) { // 显示弹框
            this.invoiceShow = true
            this.editForm.id = id
        },
        handleInvoiceClose() { // 关闭弹框
            this.invoiceShow = false;
        },
        handleInvoiceSubmit() { // 审核提交
            this.loading = true;
            Core.Api.Invoice.audit({
                ...this.editForm
            }).then(res => {
                console.log('handleInvoiceSubmit res', res)
                this.handleInvoiceClose()
                this.getTableData()
                this.getStatusList()
            }).catch(err => {
                console.log('handleInvoiceSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleInvoice(id) { // 处理完成
            let _this = this;
            this.$confirm({
                title: '确定要处理吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Invoice.handle({id}).then(() => {
                        _this.$message.success('处理完成');
                        _this.getTableData();
                        _this.getStatusList()
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
// 
</style>