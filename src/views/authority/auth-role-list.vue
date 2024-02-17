<template>
    <div id="AuthRoleList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('role.list') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange()" class="menu-item-btn"
                        ><i class="icon i_add" />{{ $t('role.save') }}</a-button
                    >
                </div>
            </div>
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'name'">
                            {{ text || '-' }}
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
                            <a-button type="link" @click="routerChange(record)"
                                ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                            >
                            <a-button type="link" danger @click="handleDelete(record.id)"
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
                { title: 'n.name', dataIndex: 'name' },
                { title: 'role.description', dataIndex: 'remark', key: 'tip_item' },
                { title: 'd.create_time', dataIndex: 'create_time', key: 'time' },
                { title: 'def.operate', key: 'operation', fixed: 'right', width: 100 },
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
                path: '/system/auth-role-edit',
                query: { id: item.id },
            });
            window.open(routeUrl.href, '_self');
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
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.pageChange(1);
        },

        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Authority.roleList({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('AuthRole.list res', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('AuthRole.list err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 新建角色
        handleRoleShow(item) {
            if (item) {
                console.log('handleRoleShow item:', item);
                this.form.id = item.id;
                this.form.name = item.name;
                this.form.remark = item.remark;
            }
            this.roleShow = true;
        },
        handleRoleClose() {
            this.roleShow = false;
            this.form = {
                id: '',
                name: '',
                remark: '',
            };
        },
        handleRoleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            console.log('handleRoleSubmit form:', form);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }

            this.loading = true;
            Core.Api.Authority.roleEdit(this.form)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleRoleClose();
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleRoleSubmit err:', err);
                });
        },

        // 删除角色
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Authority.roleDelete({ id })
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
//#AuthRoleList {}
</style>
