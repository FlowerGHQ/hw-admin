<template>
<div id="AuthRoleList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">角色管理</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange()" class="menu-item-btn"><i class="icon i_add"/>新建角色</a-button>
            </div>
        </div>
        <!-- <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='8' class="search-item">
                    <div class="key">角色名称:</div>
                    <div class="value">
                        <a-input placeholder="请输入角色名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
            </a-row>
            <div class="btn-area">
                <a-button @click="handleSearch" type="primary">查询</a-button>
                <a-button @click="handleSearchReset">重置</a-button>
            </div>
        </div> -->
        <div class="table-container">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                :row-key="record => record.id" :pagination='false'>
                <template #bodyCell="{ column, text , record }">
                    <template v-if="column.dataIndex === 'name'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'tip_item'">
                        <a-tooltip placement="top" :title='text'>
                            <div class="ell" style="max-width: 40em">{{text || '-'}}</div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type='link' @click="routerChange(record)"><i class="icon i_edit"/>编辑</a-button>
                        <a-button type='link' danger @click="handleDelete(record.id)"><i class="icon i_delete"/>删除</a-button>
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

export default {
    name: 'AuthRoleList',
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
            searchForm: {
                name: '',
            },

            // 表格数据
            tableData: [],
            tableColumns: [
                {title: '角色名称', dataIndex: 'name'},
                {title: '角色描述', dataIndex: 'remark', key: 'tip_item' },
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right', width: 100,},
            ],
            // 弹框
            roleShow: false,
            form: {
                id: '',
                name: '',
                remark: '',
            },
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(item = {}) {
            let routeUrl = this.$router.resolve({
                path: "/authority/auth-role-edit",
                query: {id: item.id}
            })
            window.open(routeUrl.href, '_self')
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
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.pageChange(1);
        },

        getTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.Authority.roleList({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("AuthRole.list res", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('AuthRole.list err', err)
            }).finally(() => {
                this.loading = false;
            });
        },


        // 新建角色
        handleRoleShow(item) {
            if (item) {
                console.log('handleRoleShow item:', item)
                this.form.id = item.id
                this.form.name = item.name
                this.form.remark = item.remark
            }
            this.roleShow = true;
        },
        handleRoleClose() {
            this.roleShow = false;
            this.form = {
                id: '',
                name: '',
                remark: '',
            }
        },
        handleRoleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('handleRoleSubmit form:', form)
            if (!form.name) {
                return this.$message.warning('请输入角色名称')
            }

            this.loading = true;
            Core.Api.Authority.roleEdit(this.form).then(() => {
                this.$message.success('保存成功')
                this.handleRoleClose();
                this.getTableData();
            }).catch(err => {
                console.log('handleRoleSubmit err:', err)
            })
        },

        // 删除角色
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该角色吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Authority.roleDelete({id}).then(() => {
                        _this.$message.success('删除成功');
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
//#AuthRoleList {}
</style>
