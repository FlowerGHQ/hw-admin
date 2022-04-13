<template>
    <div id="StockList" class="list-container">
        <div class="title-container">
            <div class="title-area">库存总览</div>
            <div class="btns-area">
                <a-upload name="file" class="file-uploader"
                          :file-list="upload.fileList" :action="upload.action"
                          :show-upload-list='false'
                          :headers="upload.headers" :data='upload.data'
                          accept=".xlsx,.xls"
                          @change="handleMatterChange">
                    <a-button type="primary" class="file-upload-btn">
                        <i class="icon i_add" />批量入库
                    </a-button>
                </a-upload>
                <a-upload name="file" class="file-uploader"
                          :file-list="upload.fileList" :action="upload.action"
                          :show-upload-list='false'
                          :headers="upload.headers" :data='upload.data'
                          accept=".xlsx,.xls"
                          @change="handleMatterChange">
                    <a-button type="primary" class="file-upload-btn">
                        <i class="icon i_add" />批量领料
                    </a-button>
                </a-upload>
            </div>
        </div>

        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">所属仓库:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.warehouse_id" placeholder="请选择仓库" @change="handleSearch">
                            <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">{{
                                    item.name
                                }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">库存类型:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.target_type" placeholder="请选择库存类型" @change="handleSearch">
                            <a-select-option v-for="(val, key) of targetTypeMap" :key="key" :value="Number(key)">{{
                                    val
                                }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
            </a-row>
            <div class="btn-area">
                <a-button @click="handleSearch" type="primary">查询</a-button>
                <a-button @click="handleSearchReset">重置</a-button>
            </div>
        </div>
        <div class="operate-container">
            <a-button type="primary" @click="handleExportConfirm" :disabled="!selectedRowKeys.length">批量采购</a-button>
        </div>
        <div class="table-container">
            <a-table :check-mode='true' :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                     :row-key="record => record.id" :pagination='false' :row-selection="rowSelection"
                     :expandedRowKeys="expandedRowKeys" :indentSize='0'
                     :expandIconColumnIndex="expandIconColumnIndex">
                <template #bodyCell="{ column, text , record }">
                    <template v-if="column.key === 'detail'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.dataIndex === 'target_type'">
                        {{ targetTypeMap[text] || '未知' }}
                    </template>
                    <template v-if="column.key === 'count'">
                        {{ text || 0 }}
                    </template>
                    <template v-if="column.key === 'warehouse'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('warehouse', record)">{{ text || '-' }}
                            </a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="record.target_type === 1 && record.item">
                        <template v-if="column.type === 'name'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('item', record.item)">
                                    {{ record.item.name || '-' }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.type === 'target'">
                            {{ record.item[column.key] }}
                        </template>
                        <template v-if="column.type === 'category'">
                            {{ record.item.category ? record.item.category.name || '-' : '-' }}
                        </template>
                        <template v-if="column.type === 'spec'">
                            {{ $Util.itemSpecFilter(record.item.attr_list) }}
                        </template>
                    </template>
                    <template v-if="record.target_type === 2 && record.material">
                        <template v-if="column.type === 'name'">
                            {{ record.material.name || '-' }}
                        </template>
                        <template v-if="column.type === 'target'">
                            {{ record.material[column.key] || '-' }}
                        </template>
                        <template v-if="column.type === 'category'">
                            {{ record.material.category ? record.material.category.name || '-' : '-' }}
                        </template>
                        <template v-if="column.type === 'spec'">
                            {{ record.material.spec || '-' }}
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
import Core from '../../core'

export default {
    components: {},
    props: {},
    data() {
        return {
            loading: false,

            currPage: 1,
            pageSize: 20,
            total: 0,

            warehouseList: [],
            targetTypeMap: {
                1: '商品',
                2: '物料',
            },
            searchForm: {
                target_type: undefined,
                warehouse_id: undefined,
            },
            tableData: [],
            expandedRowKeys: [],
            expandIconColumnIndex: 0,
            selectedRowKeys: [],
            selectedRowItems: [],
            exportDisabled: false,
            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + "/admin/1/item/import",
                fileList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                },
            },
        }
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: '类型', dataIndex: 'target_type'},
                {title: '名称', type: 'name'},
                {title: '编号', type: 'target', key: 'code'},
                {title: '所属仓库', dataIndex: ['warehouse', 'name'], key: 'warehouse'},
                {title: '库存数量', dataIndex: 'stock', key: 'count'},
                {title: '需求数量', dataIndex: 'request_count', key: 'count'},
                {title: '生产中数量', dataIndex: 'production_count', key: 'count'},
                {title: '分类', type: 'category'},
                {title: '规格', type: 'spec'},
            ]
            return columns
        },
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => { // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys
                    this.selectedRowItems = selectedRows
                    console.log('rowSelection onChange this.selectedRowKeys', this.selectedRowKeys);
                },
            };
        },
    },
    mounted() {
        this.getTableData()
        this.getWarehouseList()
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'warehouse':
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/warehouse-detail",
                        query: {id: item.warehouse_id}
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
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.pageChange(1);
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list
            })
        },
        getTableData() {
            Core.Api.Stock.list({
                ...this.searchForm,
                page: this.currPage,
                pageSize: this.pageSize,
            }).then(res => {
                console.log('getTableData res', res)
                this.tableData = res.list
                this.total = res.count
            }).catch(err => {
                console.log('getTableData err', err)
            })
        },
        // 上传文件
        handleMatterChange({file, fileList}) {
            console.log("handleMatterChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                } else {
                    return this.$message.success('上传成功');
                }
            }
            this.upload.fileList = fileList
        },

        handleExportConfirm() { // 确认订单是否导出
            let _this = this;
            this.$confirm({
                title: '确认要生成采购订单吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    _this.handleRepairExport();
                }
            })
        },
        handleRepairExport() { // 订单导出
            this.exportDisabled = true;
            // let selectedRowKeys = this.selectedRowKeys
            let selectedRowItems = this.selectedRowItems
            for (const key in selectedRowItems) {
                selectedRowItems[key] = selectedRowItems[key] || ''
            }
            let exportUrl = Core.Api.MaterialPurchase.export({
                selectedRowItems,
            })
            console.log("handleRepairExport _exportUrl", exportUrl)
            window.open(exportUrl, '_blank')
            this.exportDisabled = false;
        },
    },
}
</script>

<style lang='less'>
#StockList {
    .ant-btn.ant-btn-primary {
        margin-left: 15px;
    }
}
</style>
