<template>
    <div id="NoticeList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">系统文件列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')" v-if="loginType === USER_TYPE.ADMIN"><i class="icon i_add"/>新建文件</a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='8' class="search-item">
                        <div class="key">文件类型:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" @change="handleSearch" placeholder="请选择文件类型" allow-clear >
                                <a-select-option  key="xlsx" :value="typeList.XLSX">xlsx</a-select-option>
                                <a-select-option  key="word" :value="typeList.WORD">word</a-select-option>
                                <a-select-option  key="doc" :value="typeList.DOC">doc</a-select-option>
                                <a-select-option  key="docx" :value="typeList.DOCX">docx</a-select-option>
                                <a-select-option  key="video" :value="typeList.VIDEO">video</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='16' class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value">
                            <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch"
                                            :show-time="defaultTime" :allow-clear='false'>
                                <template #suffixIcon><i class="icon i_calendar"></i></template>
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
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'text'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'" >
                            <a-button type="link" @click="handleDownloadConfirm(record)"><i class="icon i_edit"/> 下载</a-button>
                            <a-button type="link" @click="routerChange('edit',record)" v-if="loginType === USER_TYPE.ADMIN"><i class="icon i_edit"/> 编辑</a-button>
                            <a-button type="link" @click="handleDelete(record.id)" v-if="loginType === USER_TYPE.ADMIN"><i class="icon i_delete"/> 删除</a-button>
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

const USER_TYPE = Core.Const.USER.TYPE;
export default {
    name: 'NoticeList',
    components: {},
    props: {},
    data() {
        return {
            USER_TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 下载
            downloadDisabled: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            typeList: Core.Const.SYSTEM.FILE.TYPE,
            searchForm: {
                id:'',
                type: undefined,
            },
            tableData: [],

        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: '文件名', dataIndex: 'name', key: 'text'},
                {title: '文件类型', dataIndex: 'type', key: 'text'},
                {title: '地址', dataIndex: 'path', key: 'text'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right', width: 100,},
            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/system/system-file-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/system/system-file-detail",
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
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            console.log('this.searchForm:', this.searchForm)
            this.create_time = []
            this.pageChange(1);
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.System.fileList({
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

        handleDelete(id) { // 删
            let _this = this;
            this.$confirm({
                title: '确定要删除该文件吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.System.fileDelete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },

        handleDownloadConfirm(record){ // 下载问询
            let _this = this;
            this.$confirm({
                title: '确认要下载吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    _this.handleDownload(record);
                }
            })
        },
        handleDownload(record) { // 下载
            this.downloadDisabled = true;
            const path = record.path
            let fileUrl = Core.Const.NET.FILE_URL_PREFIX + path + ''
            window.open(fileUrl, '_blank')
            this.downloadDisabled = false;
        },
    }
};
</script>

<style lang="less" scoped>
// #NoticeList {}
</style>