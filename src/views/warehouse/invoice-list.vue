<template>
    <div id="InvoiceList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">出入库单列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>库存管理</a-button>
                </div>
            </div>
            <!-- <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.status" @change='handleSearch'>
                    <a-tab-pane :key="item.key" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">{{ item.text }}<span :class="item.color">{{ item.value }}</span>
                            </div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>-->
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">所属仓库:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.warehouse_id" placeholder="请选择仓库" @change="handleSearch">
                                <a-select-option v-for="warehouse of warehouseList" :key="warehouse.id" :value="warehouse.id">{{ warehouse.name }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">出入库单编号:</div>
                        <div class="value">
                            <a-input placeholder="请输入出入库单编号" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">出入库类型:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" @change="handleSearch" placeholder="请选择出入库类型">
                                <a-select-option v-for="(val, key) in typeMap" :key='key' :value='key'>{{ val }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value"><TimeSearch @search="handleOtherSearch" ref='TimeSearch'/></div>
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
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="$Util.invoiceStatusFilter(text,'color')">
                                {{ $Util.invoiceStatusFilter(text) }}
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.stockRecordFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'target_type'">
                            {{ $Util.targetTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'warehouse_type'">
                            {{ $Util.warehouseTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail',record)"><i class="icon i_detail"/>详情</a-button>
                            <template v-if="record.status === STATUS.INIT">
                                <!-- <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/>编辑</a-button> -->
                                <a-button type="link" @click="handleCancel(record.id)" class="danger"><i class="icon i_close_c"/>取消</a-button>
                                <AuditHandle v-if="record.status === STATUS.WAIT_AUDIT" btnType="link" :api-list="['Invoice', 'audit']" :id="record.id"> <i class="icon i_audit"/>审核</AuditHandle>
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
    </div>
</template>

<script>
import Core from '../../core';
import TimeSearch from '@/components/common/TimeSearch.vue'
import AuditHandle from '../../components/popup-btn/AuditHandle.vue'

const STATUS = Core.Const.STOCK_RECORD.STATUS
export default {
    name: 'InvoiceList',
    components: {
        TimeSearch,
        AuditHandle
    },
    props: {},
    data() {
        return {
            STATUS,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            typeMap: Core.Const.STOCK_RECORD.TYPE_MAP, //出入库
            warehouseList: [],
           /* statusList: [
                {text: '全  部', value: '0', color: 'primary', key: '0'},
                {text: '待审核', value: '0', color: 'yellow', key: STATUS.AIT_AUDIT},
                {text: '审核通过', value: '0', color: 'blue', key: STATUS.AUDIT_PASS},
                {text: '审核失败', value: '0', color: 'red', key: STATUS.AUDIT_REFUSE},
                {text: '处理完成', value: '0', color: 'green', key: STATUS.CLOSE},
                {text: '已取消', value: '0', color: 'grey', key: STATUS.CANCEL},
            ],*/
            searchForm: {
                warehouse_id: undefined,
                uid: '',
                status: undefined,
                type: undefined,
                begin_time: '',
                end_time: '',
            },
            // 表格
            tableData: [],
            tableColumns: [
                {title: '出入库单编号', dataIndex: 'uid', key: 'detail'},
                {title: '状态', dataIndex: 'status'},
                {title: '类型', dataIndex: 'type'},
                {title: '类目', dataIndex: 'target_type',},
                {title: '所属仓库', dataIndex: ['warehouse', 'name'], key: 'item',},
                {title: '仓库类型', dataIndex: ['warehouse', 'type'], key: 'warehouse_type',},
                {title: '创建人', dataIndex: ['apply_user', "account", "name"], key: 'item'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right'},
            ],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
        this.getWarehouseList();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item)
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/invoice-edit",
                        query: { id: item.id }
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
        handleOtherSearch(params) { // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key]
            }
            this.pageChange(1);
        },
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.$refs.TimeSearch.handleReset()
            this.pageChange(1);
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.Invoice.list({
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
            Core.Api.Invoice.status({
                ...this.searchForm,
            }).then(res => {
                console.log("getStatusList res:", res)
                let total = 0
                this.statusList.forEach(statusItem => {
                    statusItem.value = 0
                })
                this.statusList.forEach(statusItem => {
                    res.status_list.forEach(item => {
                        if (statusItem.key == item.status) {
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
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list
            })
        },

        handleCancel(id) {
            let _this = this;
            this.$confirm({
                title: '确定要取消该出入库单吗？',
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
    }
};
</script>

<style lang="less" scoped>
//#InvoiceList {}
</style>