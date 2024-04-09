<template>
    <div id="CRMRegionEmployeesList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_region_e.list') }}</div>
            </div>
            <a-row>
                <a-col class="group-container" :xs="9" :sm="6" :xl="4" :xxl="3">
                    <div class="category-container">
                        <div class="category-content">
                            <a-tree
                                v-if="groupOptions.length"
                                v-model:value="checkedKeys"
                                :default-expand-all="true"
                                :tree-data="groupOptions"
                                @select="onSelect"
                            />
                        </div>
                    </div>
                </a-col>
                <a-col :xs="15" :sm="18" :xl="20" :xxl="21">
                    <div class="search-container">
                        <a-row class="search-area">
                            <a-col :xs="24" :sm="24" :xl="8" :xxl="8" class="search-item">
                                <div class="key">{{ $t('n.name') }}:</div>
                                <div class="value">
                                    <a-input
                                        :placeholder="$t('def.input')"
                                        v-model:value="searchForm.name"
                                        @keydown.enter="handleSearch"
                                    />
                                </div>
                            </a-col>
                            <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                                <div class="key">{{ $t('d.create_time') }}:</div>
                                <div class="value"><TimeSearch @search="handleOtherSearch" ref="TimeSearch" /></div>
                            </a-col>
                        </a-row>
                        <div class="btn-area">
                            <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                            <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                        </div>
                    </div>
                    <div class="operate-container">
                        <a-button type="primary" ghost @click="handleEditShow()" class="panel-btn"
                            ><i class="icon i_add" />{{ $t('u.save') }}</a-button
                        >
                    </div>
                    <div class="table-container">
                        <a-table
                            :columns="tableColumns"
                            :data-source="tableData"
                            :scroll="{ x: true }"
                            :row-key="record => record.id"
                            :pagination="false"
                            v-model:expandedRowKeys="expandedRowKeys"
                        >
                            <template #bodyCell="{ column, text, record }">
                                <template v-if="column.dataIndex === 'flag_admin'">
                                    {{ text ? $t('i.yes') : $t('i.no') }}
                                </template>
                                <template v-if="column.key === 'item'">
                                    {{ text || '-' }}
                                </template>
                                <template v-if="column.key === 'user'">
                                    {{ text || '-' }}
                                </template>
                                <template v-if="column.key === 'flag_admin_group'">
                                    <template v-if="admin_user_id === loginUser.id">
                                        <a-switch
                                            :checked="!!record.flag_admin_group"
                                            :checked-children="$t('i.yes')"
                                            :un-checked-children="$t('i.no')"
                                            @click="handleSetAdmin(record)"
                                        />
                                    </template>
                                    <template v-else>
                                        {{ text === 1 ? '是' : '否' || '-' }}
                                    </template>
                                </template>

                                <template v-if="column.key === 'crm_group_member_list'">
                                    <span v-for="it in text"> {{ it.group_name }}, </span>
                                </template>

                                <template v-if="column.key === 'tip_item'">
                                    <a-tooltip placement="top" :title="text">
                                        <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                                    </a-tooltip>
                                </template>
                                <template v-if="column.key === 'time'">
                                    {{ $Util.timeFilter(text) }}
                                </template>
                                <template v-if="column.key === 'operation'">
                                    <a-button
                                        type="link"
                                        @click="handleDelete(record.crm_group_member_id)"
                                        class="danger"
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
                </a-col>
            </a-row>
        </div>
        <template class="modal-container">
            <a-modal v-model:visible="modalVisible" :title="$t('u.save')" width="860px">
                <div class="modal-content">
                    <div class="search-container">
                        <a-row class="search-area">
                            <a-col :xs="24" :sm="24" :md="12" class="search-item">
                                <div class="key">{{ $t('n.name') }}:</div>
                                <div class="value">
                                    <div class="value">
                                        <a-input
                                            :placeholder="$t('def.input')"
                                            v-model:value="userSearchForm.name"
                                            @keydown.enter="handleSearch"
                                        />
                                    </div>
                                </div>
                            </a-col>
                            <a-col :xs="24" :sm="24" :md="12" class="search-item">
                                <div class="key">
                                    <span>{{ $t('n.phone') }}:</span>
                                </div>
                                <div class="value">
                                    <a-input
                                        :placeholder="$t('def.input')"
                                        v-model:value="userSearchForm.phone"
                                        @keydown.enter="handleSearch"
                                    />
                                </div>
                            </a-col>
                        </a-row>
                        <div class="btn-area">
                            <a-button @click="userHandleSearch" type="primary">{{ $t('def.search') }}</a-button>
                            <a-button @click="userHandleSearchReset">{{ $t('def.reset') }}</a-button>
                        </div>
                    </div>
                    <div class="operate-container">
                        <div class="form-item required">
                            <div class="key">{{ $t('crm_c.group') }}：</div>
                            <!--区域 -->
                            <div class="value">
                                <a-tree-select
                                    class="CategoryTreeSelect"
                                    v-model:value="editForm.group_id"
                                    :placeholder="$t('def.select')"
                                    :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                                    :tree-data="groupOptions"
                                    tree-default-expand-all
                                />
                            </div>
                        </div>
                    </div>
                    <div class="table-container">
                        <UserTable
                            :columns="userTableColumns"
                            :checkMode="true"
                            :dataSource="userTableData"
                            :default-checked="editForm.user_list"
                            @submit="handleSelectItem"
                        />
                    </div>
                    <div class="paging-container">
                        <a-pagination
                            v-model:current="userCurrPage"
                            :page-size="userPageSize"
                            :total="userTotal"
                            show-quick-jumper
                            show-size-changer
                            show-less-items
                            :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                            :hide-on-single-page="false"
                            :pageSizeOptions="['10', '20', '30', '40']"
                            @change="userPageChange"
                            @showSizeChange="userPageSizeChange"
                        />
                    </div>
                </div>
                <template #footer>
                    <a-button type="primary" @click="batchAddMember">确定</a-button>
                    <a-button @click="modalVisible = false">取消</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import UserTable from '@/components/table/UserTable.vue';
import TimeSearch from '@/components/common/TimeSearch.vue';
export default {
    name: 'CrmRegion',
    components: { UserTable, TimeSearch },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            loginUser: Core.Data.getUser(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 分页
            userCurrPage: 1,
            userPageSize: 20,
            userTotal: 0,

            tableData: [],
            userTableData: [],
            expandedRowKeys: [],
            adminUserList: [],
            editNode: null,
            parentNode: null,
            modalVisible: false,
            // 搜索
            searchForm: {
                name: '',
                group_id: '',
                type: undefined,
                org_id: Core.Data.getOrgId(),
                org_type: Core.Data.getOrgType(),
                begin_time: '',
                end_time: '',
            },
            userSearchForm: {
                name: '',
                phone: '',
            },
            editForm: {
                group_id: '',
                user_list: [],
            },
            userData: [],
            expandedKeys: ['0-0-0', '0-0-1'],
            autoExpandParent: true,
            checkedKeys: [],
            groupOptions: [],
            admin_user_id: undefined,
        };
    },
    watch: {
        checkedKeys(val) {
            console.log('onCheck', val);
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('n.name'), dataIndex: ['account', 'name'], key: 'user' },
                { title: this.$t('u.account'), dataIndex: ['account', 'username'], key: 'item' },
                { title: this.$t('n.phone'), dataIndex: ['account', 'phone'], key: 'item' },
                { title: this.$t('n.email'), dataIndex: ['account', 'email'], key: 'item' },
                { title: this.$t('crm_group.name'), dataIndex: 'crm_group_member_list', key: 'crm_group_member_list' },
            ];
            if (this.searchForm.group_id) {
                columns.push({
                    title: this.$t('crm_group.administrator'),
                    dataIndex: 'flag_admin_group',
                    key: 'flag_admin_group',
                    align: 'center',
                });
                columns.push({ title: this.$t('def.operate'), key: 'operation', fixed: 'right', width: 100 });
            }

            return columns;
        },
        userTableColumns() {
            let columns = [
                { title: this.$t('e.name'), dataIndex: ['account', 'name'], key: 'item' },
                { title: this.$t('e.account'), dataIndex: ['account', 'username'], key: 'item' },
                { title: this.$t('n.phone'), dataIndex: ['account', 'phone'] },
                // {title: this.$t('crm_group.name'),  dataIndex: 'crm_group_member_list', key:'crm_group_member_list'},
                // {title: this.$t('crm_group.administrator'), dataIndex: 'flag_admin_group', key: 'flag_admin_group', align: 'center'},
            ];
            return columns;
        },
    },
    mounted() {
        this.handleGroupTree();
        this.getTableData();
    },
    methods: {
        handleGroupTree() {
            Core.Api.CRMGroupMember.structureByUser().then(res => {
                this.groupOptions = res.list;
                console.log(res);
            });
        },
        // onExpand(expandedKeys) {
        //     console.log('onExpand', expandedKeys);
        //     // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        //     // or, you can remove all expanded children keys.
        //     this.expandedKeys = expandedKeys;
        //     this.autoExpandParent = false;
        // },
        onCheck(checkedKeys) {
            console.log('onCheck', checkedKeys);
            this.checkedKeys = checkedKeys;
        },
        onSelect(selectedKeys, info) {
            console.log('onSelect', info);
            this.admin_user_id = info.node.admin_user_id;
            this.selectedKeys = selectedKeys;
            this.searchForm.group_id = selectedKeys[0];
            this.handleSearch();
        },
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/system/user-edit',
                        query: {
                            id: item.id,
                            org_id: Core.Data.getOrgId(),
                            org_type: this.orgType,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/system/user-detail',
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
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) {
            // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key];
            }
            this.pageChange(1);
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.$refs.TimeSearch.handleReset();
            this.selectedKeys = [];
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.User.listGroup({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 删除团队
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMGroupMember.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete -> err', err);
                        });
                },
            });
        },

        // 编辑密码
        handleEditShow() {
            this.getUserTableData();
            this.modalVisible = true;
        },
        getUserTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.User.list({
                ...this.searchForm,
                page: this.userCurrPage,
                page_size: this.userPageSize,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.userTotal = res.count;
                    this.userTableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        userPageChange(curr) {
            // 页码改变
            this.userCurrPage = curr;
            this.getUserTableData();
        },
        userPageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.userPageSize = size;
            this.getUserTableData();
        },
        userHandleSearch() {
            // 搜索
            this.userPageChange(1);
        },
        userHandleSearchReset() {
            // 重置搜索
            Object.assign(this.userSearchForm, this.$options.data().userSearchForm);
            this.selectedKeys = [];
            this.userPageChange(1);
        },

        handleSelectItem(ids, items) {
            console.log('handleSelectItem ids, items:', ids, items);
            // this.selectItems = items
            this.editForm.user_list = ids;
        },
        batchAddMember() {
            if (!this.editForm.user_list) {
                return this.$message.warning(this.$t('def.input') + this.$t('dept.name'));
            }
            if (!this.editForm.group_id) {
                return this.$message.warning(this.$t('def.input') + this.$t('dept.name'));
            }
            Core.Api.CRMGroup.batchAddMember({
                target_id_list: this.editForm.user_list,
                group_id: this.editForm.group_id,
            })
                .then(res => {})
                .catch(err => {})
                .finally(() => {
                    this.loading = false;
                    Object.assign(this.editForm, this.$options.data().editForm);
                    this.modalVisible = false;
                    this.getTableData();
                });
        },
        handleSetAdmin(record) {
            this.loading = true;
            Core.Api.CRMGroupMember.setAdmin({
                id: record.id,
                flag_admin: record.flag_admin_group ? 0 : 1,
            })
                .then(() => {
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleManagerChange err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
#CRMRegionEmployeesList {
    .group-container {
        box-sizing: border-box;
        padding-left: 20px;
    }
}
</style>
