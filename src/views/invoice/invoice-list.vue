<template>
    <div id="WarehouseList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">货单列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleAddShow"><i class="icon i_add"/>库存管理</a-button>
                </div>
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
                        <div class="key">仓库名称:</div>
                        <div class="value">
                            <a-input placeholder="请输入仓库名称" v-model:value="searchForm.name"
                                     @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">货单编号:</div>
                        <div class="value">
                            <a-input placeholder="请输入货单编号" v-model:value="searchForm.uid"
                                     @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">货单类型:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" @change="handleTypeSelect" placeholder="请选择出入库类型"
                                      allow-clear>
                                <a-select-option key="1" :value="handleTypeList.TYPE_IN">入库</a-select-option>
                                <a-select-option key="2" :value="handleTypeList.TYPE_OUT">出库</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value">
                            <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch"
                                            :show-time="defaultTime" :allow-clear='false'>
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
                    <template #bodyCell="{ column, text , record}">
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
                                {{$Util.invoiceStatusFilter(text)}}
                            </div>
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/> 修改
                            </a-button>
                            <a-button type="link" @click="handleDelete(record.id)"><i class="icon i_delete"/> 删除
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
        <a-modal v-model:visible="codeAddShow" title="库存管理" class="codeAddShow-edit-modal"
                 :after-close="handleAddClose">
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
                        <a-radio :value="handleTypeList.TYPE_IN">入库</a-radio>
                        <a-radio :value="handleTypeList.TYPE_OUT">出库</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleAddSubmit" type="primary">确定</a-button>
                <a-button @click="codeAddShow=false">取消</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';

const STOCK_RECORD = Core.Const.STOCK_RECORD
export default {
    name: 'WarehouseList',
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
            codeAddShow: false,
            isExist: '',
            filteredInfo: {status: [1]},
            warehouseList: [],
            handleTypeList: Core.Const.STOCK_RECORD.TYPE, //出入库
            statusList: [
                {text: '全  部', value: '0', color: 'primary', key: '0'},
                {text: '待审核', value: '0', color: 'yellow', key: STOCK_RECORD.STATUS.AIT_AUDIT},
                {text: '审核通过', value: '0', color: 'green', key: STOCK_RECORD.STATUS.AUDIT_PASS},
                {text: '审核失败', value: '0', color: 'red', key: STOCK_RECORD.STATUS.AUDIT_REFUSE},
                {text: '处理完成', value: '0', color: 'green', key: STOCK_RECORD.STATUS.CLOSE},
            ],
            searchForm: {
                name: '',
                uid: '',
                status: undefined,
                type: undefined,
            },
            warehouse_id: '',
            form: {
                type: '',
                id: '',
                warehouse_id: undefined,
            },
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let {filteredInfo} = this;
            filteredInfo = filteredInfo || {};
            let columns = [
                {title: '出入库单编号', dataIndex: 'uid', key: 'detail'},
                {title: '出入库类型', dataIndex: 'type', key: 'stock_type',},
                {title: '所属仓库', dataIndex: ['warehouse', 'name'], key: 'warehouse_name',},
                {title: '仓库类型', dataIndex: 'type', key: 'type',},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '状态', dataIndex: 'status', key: 'status',
                    filters: Core.Const.STOCK_RECORD.STATUS_LIST, filterMultiple: false, filteredValue: filteredInfo.status || [1]},
                {title: '操作', key: 'operation', fixed: 'right'},
            ]
            return columns
        }
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
        handleAddShow() {
            this.codeAddShow = true;
            this.form.warehouse_id = this.warehouse_id
        },
        handleAddClose() {
            this.codeAddShow = false;
            this.isExist = '';
            this.form = {
                type: '',
                id: '',
                target_code: '', //商品编码
                number: '',
                warehouse_id: '',
            }
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list
            })
        },
        handleAddSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.warehouse_id) {
                return this.$message.warning('请选择仓库')
            }
            if (!form.type) {
                return this.$message.warning('请选择类型')
            }
            Core.Api.Invoice.save(form).then(res => {
                this.$message.success('保存成功')
                this.handleAddClose();
                this.routerChange('edit', res.detail)
            }).catch(err => {
                console.log('handleAddSubmit err:', err)
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

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该货单吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Invoice.delete({id}).then(() => {
                        _this.$message.success('删除成功');
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
                console.log('getStatusStat err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less" scoped>
// 
</style>