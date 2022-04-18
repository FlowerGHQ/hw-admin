<template>
    <div id="MaterialsList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">物料列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新建物料</a-button>
                    <a-upload name="file" class="file-uploader"
                              :file-list="upload.fileList" :action="upload.action"
                              :show-upload-list='false'
                              :headers="upload.headers" :data='upload.data'
                              accept=".xlsx,.xls"
                              @change="handleMatterChange">
                        <a-button type="primary"  class="file-upload-btn">
                            <i class="icon i_add"/> 批量导入
                        </a-button>
                    </a-upload>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">物料名称:</div>
                        <div class="value">
                           <a-input v-model:value="searchForm.name" placeholder="请输入物料名称" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">物料分类:</div>
                        <div class="value">
                            <CategoryTreeSelect @change="handleCategorySelect" :category='item_category' :category-id='searchForm.category_id' placeholder="请选择物料分类" type="material"/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='8' class="search-item">
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
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/>详情</a-button>
                            <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/>编辑</a-button>
                            <a-button type="link" @click="handleDelete(record.id)" class="danger"><i class="icon i_delete"/>删除</a-button>
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
import CategoryTreeSelect from '../../components/popup-btn/CategoryTreeSelect.vue'
import TimeSearch from '@/components/common/TimeSearch.vue'
export default {
    components: {
        CategoryTreeSelect,
        TimeSearch
    },
    props: {},
    data() {
        return {
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            searchForm: {
                category_id: undefined,
                name: undefined,
            },
            item_category: {},
            tableColumns: [
                { title: '物料名称', dataIndex: 'name', key: 'detail' },
                { title: '物料分类', dataIndex: ['category','name'], key: 'item' },
                { title: '物料编码', dataIndex: 'code', key: 'item' },
                { title: '物料包装', dataIndex: 'encapsulation', key: 'item' },
                { title: '规格', dataIndex: 'spec', key: 'item' },
                { title: '单位', dataIndex: 'unit', key: 'item' },
                // { title: '供应商料号', dataIndex: 'supplier_code', key: 'item' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time'},
                { title: '操作', key: 'operation', fixed: 'right', width: 180 }
            ],
            tableData: [],
            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + "/admin/1/material/import",
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
            switch(type) {
                case 'edit': {
                    let routeUrl = this.$router.resolve({
                        path: "/production/material-edit",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                }; break
                case 'detail': {
                    let routeUrl = this.$router.resolve({
                        path: "/production/material-detail",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                }; break
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
        handleCategorySelect(val) {
            this.searchForm.category_id = val
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.$refs.TimeSearch.handleReset()
            this.pageChange(1);
        },
        getTableData() {
            this.loading = true
            Core.Api.Material.list({
                ...this.searchForm,
                page: this.current,
                pageSize: this.pageSize,
            }).then(res => {
                console.log('ProductionOrderlist res', res)
                this.tableData = res.list
                this.total = res.count
            }).finally(() => {
                this.loading = false
            })
        },

        handleDelete(id) {
            let _this = this
            this.$confirm({
                title: '确定要删除该物料吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Material.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
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
    },
}
</script>

<style lang='less' scoped>
#MaterialsList {
    .list-container {
        .title-container {
            .btns-area {
               .file-uploader {
                   margin-left: 15px;
               }
            }
        }
    }
}
</style>
