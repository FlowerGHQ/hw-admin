<template>
    <div id="SupplierList" class="list-container">
        <div class="title-container">
            <div class="title-area">供应商列表</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')" v-if="$auth('supplier.save')"><i class="icon i_add"/>新建供应商</a-button>
<!--                <a-upload name="file" class="file-uploader"
                          :file-list="upload.fileList" :action="upload.action"
                          :show-upload-list='false'
                          :headers="upload.headers" :data='upload.data'
                          accept=".xlsx,.xls"
                          @change="handleFileUpload">
                    <a-button type="primary" class="file-upload-btn" style="margin-left: 12px;">
                        批量导入明细
                    </a-button>
                </a-upload>-->
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
                     :row-key="record => record.id" :pagination='false'>
                <template #bodyCell="{ column, text , record }">
                    <template v-if="column.key === 'detail' && $auth('supplier.list')">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'contact'">
                        {{ text || '-'}}
                    </template>
                    <template v-if="column.dataIndex === 'type'">
                        {{ $Util.supplierTypeFilter(text) }}
                    </template>
                    <template v-if="column.dataIndex === 'flag_purchase'">
                        <div class="status status-bg status-tag" :class="$Util.flagPurchaseFilter(text,'color')">
                            {{ $Util.flagPurchaseFilter(text) }}
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'flag_settlement'">
                        <div class="status status-bg status-tag" :class="$Util.flagSettlementFilter(text,'color')">
                            {{ $Util.flagSettlementFilter(text) }}
                        </div>
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
                        <a-button type='link' @click="routerChange('detail', record)" v-if="$auth('supplier.list')"><i class="icon i_detail"/> 详情</a-button>
                        <a-button type='link' @click="routerChange('edit', record)" v-if="$auth('supplier.save')"><i class="icon i_edit"/>编辑</a-button>
                        <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="$auth('supplier.delete')"><i class="icon i_delete"/> 删除</a-button>
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
            searchForm: {
                name: '',
                begin_time: '',
                end_time: '',
            },

            tableData: [],
            tableColumns: [
                { title: '供应商名称', dataIndex: 'name', key: 'detail' },
                { title: '简称', dataIndex: 'short_name', key: 'contact' },
                { title: '供应商类型', dataIndex: 'type'},
                { title: '物料分类', dataIndex: ['category','name'],key: 'contact'},
                { title: '联系人', dataIndex: 'contact_name',key: 'contact'},
                { title: '联系人电话', dataIndex: 'contact_phone',key: 'contact' },
                { title: '联系人邮箱', dataIndex: 'contact_email',key: 'contact' },
                { title: '采购状态', dataIndex: 'flag_purchase'},
                { title: '结算状态', dataIndex: 'flag_settlement'},
                /* { title: '供应商信用代码', dataIndex: 'credit_code',key: 'contact' },
                { title: '开户行账号', dataIndex: 'bank_card_no',key: 'contact' },
                { title: '开户银行', dataIndex: 'deposit_bank',key: 'contact' },
                { title: '开户行支行', dataIndex: 'account_bank',key: 'contact' },*/
                { title: '付款期限及方式', dataIndex: 'payment_term' },
                { title: '供应商地址', dataIndex: 'address' },
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
                        path: "/production/supplier-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit':
                    routeUrl = this.$router.resolve({
                        path: "/production/supplier-edit",
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
            Core.Api.Supplier.list({
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
