<template>
    <div id="AuthUserList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('n.user_auth') }}</div>
                <div class="btns-area">
                    <a-button
                        type="primary"
                        @click="routerChange('edit')"
                        class="menu-item-btn"
                        v-if="$auth('role.save')"
                        ><i class="icon i_add" />{{ $t('n.create_user') }}</a-button
                    >
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
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <!--                        <template v-if="column.dataIndex === 'name'">
                            {{ text || '-' }}
                        </template>-->
                        <template v-if="column.key === 'type'">
                            {{ $Util.authUserTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title="text">
                                <div class="ell" style="max-width: 40em">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('edit', record)" v-if="$auth('role.save')"
                                ><i class="icon i_edit" />{{ $t('n.edit') }}</a-button
                            >
                            <a-button type="link" danger @click="handleDelete(record.id)" v-if="$auth('role.delete')"
                                ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                            >
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size="pageSize"
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page="false"
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
    name: 'AuthUserList',
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
                // {title: '权限名称', dataIndex: 'name'},
                { title: this.$t('n.auth_type'), dataIndex: 'resource_type', key: 'type' },
                { title: this.$t('n.auth_obj'), dataIndex: ['resource', 'name'], key: 'tip_item' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right', width: 100 },
            ],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/system/auth-user-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.pageSize = size;
            this.getTableData();
        },
        // handleSearch() {  // 搜索
        //     this.pageChange(1);
        // },
        // handleSearchReset() {  // 重置搜索
        //     Object.assign(this.searchForm, this.$options.data().searchForm)
        //     this.pageChange(1);
        // },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.AuthorityUser.list({
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 删除用户权限
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.AuthorityUser.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang="less" scoped>
//#AuthUserList {}
</style>
