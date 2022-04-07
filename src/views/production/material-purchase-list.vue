<template>
    <div id="MaterialPurchaseList" class="list-container">
        <div class="title-container">
            <div class="title-area">采购订单列表</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新建采购单</a-button>
                <a-upload name="file" class="file-uploader"
                          :file-list="upload.fileList" :action="upload.action"
                          :show-upload-list='false'
                          :headers="upload.headers" :data='upload.data'
                          accept=".xlsx,.xls"
                          @change="handleFileUpload">
                    <a-button type="primary" class="file-upload-btn" style="margin-left: 12px;">
                        批量导入明细
                    </a-button>
                </a-upload>
            </div>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">供应商名称:</div>
                    <div class="value">
                        <a-input placeholder="请输入供应商名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
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
                     :row-key="record => record.id" :pagination='false' :loading="loading">
                <template #bodyCell="{ column, text , record }">
                    <template v-if="column.key === 'detail'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'contact'">
                        {{ text || '-'}}
                    </template>
                    <template v-if="column.dataIndex === 'payment_term'">
                        {{ $Util.supplierPaymentTypeFilter(text) }}
                    </template>
                    <template v-if="column.dataIndex === 'address'">
                        {{ $Util.addressFilter(record) }}
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/> 详情</a-button>
                        <a-button type='link' @click="routerChange('edit', record)"><i class="icon i_edit"/>编辑</a-button>
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
</template>

<script>
import Core from '../../core'
import TimeSearch from '@/components/common/TimeSearch.vue'
import EditBomModel from './components/EditBomModel.vue'

export default {
    name: 'MaterialPurchaseList',
    components: {
        TimeSearch,
        EditBomModel,
    },
    props: {},
    data() {
        return {
            currPage: 1,
            pageSize: 20,
            total: 0,
            loading: false,
            searchForm: {
                name: '',
                begin_time: '',
                end_time: '',
            },

            tableData: [],
            tableColumns: [
                { title: '订单号', dataIndex: 'sn', key: 'detail' },
                { title: '供应商', dataIndex: 'name'},
                { title: '物料名称', dataIndex: 'contact_name',key: 'contact'},
                { title: '物料编码', dataIndex: 'contact_phone',key: 'contact' },
                { title: '单位', dataIndex: 'contact_email',key: 'contact' },
                { title: '数量', dataIndex: 'payment_term' },
                { title: '单价', dataIndex: 'payment_term' },
                { title: '总价', dataIndex: 'payment_term' },
                { title: '到货日期', dataIndex: 'address' },
                { title: '备注', dataIndex: 'payment_term' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right'}
            ],
            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + "/admin/1/bom-item/import",
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
    computed: {},
    mounted() {
        this.getTableData()
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch(type) {
                case 'detail':
                    routeUrl = this.$router.resolve({
                        path: "/production/material-purchase-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit':
                    routeUrl = this.$router.resolve({
                        path: "/production/material-purchase-edit",
                        query: {id: item.id}
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
        handleOtherSearch(params) { // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key]
            }
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.$refs.TimeSearch.handleReset()
            this.pageChange(1);
        },
        getTableData() {
            Core.Api.MaterialPurchase.list({
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

        // 删除供应商
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该供应商吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Supplier.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },

        // 上传文件
        handleFileUpload({file, fileList}) {
            console.log("handleFileUpload status:", file.status, "file:", file)
            if (file.status == 'done') {
                let res = file.response
                if (res && res.code === 0) {
                    return this.$message.success('上传成功');
                } else {
                    return this.$message.error('上传失败:' + res.message)
                }
            }
            this.upload.fileList = fileList
        },
    },
}
</script>

<style lang='less'>
</style>
