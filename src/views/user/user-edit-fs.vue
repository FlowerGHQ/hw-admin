<template>
    <div id="UserEditFs" ref="userEditFsRef">
        <div class="title-container">
            <div class="title-area">
                <img src="@images/left-arrow.png" class="left-arrow" @click="back" />{{ $t('u.fs_add') }}
            </div>
        </div>
        <div class="list-container">
            <template v-if="step === 1">
                <div class="search-container">
                    <div class="search-box">
                        <div class="key">{{ $t('dis.user_name') }}</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.key"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </div>
                    <div class="btn-area">
                        <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                        <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                    </div>
                </div>
                <div class="table-container">
                    <a-table
                        :columns="tableColumns"
                        :data-source="tableData"
                        :scroll="{ x: true }"
                        :row-key="record => record.id"
                        :pagination="pagination"
                        :row-selection="{
                            selectedRowKeys: selectedRowKeys,
                            onChange: onSelectChange,
                            getCheckboxProps: record => ({ disabled: record.select }),
                        }"
                    >
                        <template #headerCell="{ title }">
                            {{ $t(title) }}
                        </template>
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <!-- 角色 -->
                            <template v-if="column.key === 'role_name'">
                                {{ text || $t('u.no_role') }}
                            </template>
                            <template v-if="column.key === 'authority'">
                                <span class="allocated" v-if="text">{{ $t('u.allocated') }}</span>
                                <span class="unallocated" v-else>{{ $t('u.unallocated') }}</span>
                            </template>
                            <template v-if="column.key === 'user'">
                                <a-avatar class="user-avatar" :size="32" :src="record.avatar">
                                    {{ record.name }}
                                </a-avatar>
                                <span>{{ text || '-' }}</span>
                            </template>
                            <template v-if="column.key === 'department'">
                                {{ record.department_list[0]?.name || '-' }}
                            </template>
                        </template>
                    </a-table>
                </div>
            </template>
            <template v-if="step === 2">
                <div class="table-container">
                    <a-table
                        :columns="tableColumnsAdd"
                        :data-source="tableDataAdd"
                        :scroll="{ x: true }"
                        :row-key="record => record.id"
                        :pagination="paginationAdd"
                    >
                        <template #headerCell="{ title }">
                            {{ $t(title) }}
                        </template>
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.key === 'user'">
                                <a-avatar class="user-avatar" :size="32" :src="record.avatar">
                                    {{ record.name }}
                                </a-avatar>
                                <span>{{ text || '-' }}</span>
                            </template>
                            <!-- 角色 -->
                            <template v-if="column.key === 'role_name'">
                                {{ text || $t('u.no_role') }}
                            </template>
                            <template v-if="column.key === 'authority'">
                                <span class="allocated" v-if="text || record.authority_ids">{{
                                    $t('u.allocated')
                                }}</span>
                                <span class="unallocated" v-else>{{ $t('u.unallocated') }}</span>
                            </template>
                            <template v-if="column.key === 'authority_ids'">
                                <template
                                    v-if="record?.user.role_name || record?.user.flag_authority || record.authority_ids"
                                >
                                    <div class="config" @click="allocat(record)">
                                        <img src="@images/edit.png" class="edit-img" />
                                        <span class="edit">{{ $t('def.edit') }}</span>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="config" @click="allocat(record)">
                                        <img src="@images/allocation.png" class="allocation-img" />
                                        <span class="allocation">{{ $t('u.allocation') }}</span>
                                    </div>
                                </template>
                            </template>
                            <template v-if="column.key === 'operation'">
                                <a-button
                                    type="link"
                                    @click="handleDelete(record.id)"
                                    class="danger"
                                    v-if="$auth('user.delete', 'MANAGER')"
                                    ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                                >
                            </template>
                        </template>
                    </a-table>
                </div>
            </template>
            <template v-if="step === 3">
                <div class="title-container step3">
                    <div class="title-area">{{ $t('u.detail') }}</div>
                </div>
                <div class="gray-panel">
                    <div class="panel-content desc-container">
                        <div class="desc-title">
                            <div class="title-area">
                                <span v-if="detail.department_list.length > 0"
                                    >{{ detail.department_list[0].name }}-</span
                                >
                                <span class="title">{{ detail.name }}</span>
                            </div>
                        </div>
                        <a-row class="desc-detail">
                            <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                                <span class="key">{{ $t('u.account') }}：</span>
                                <span class="value">{{ detail.username }}</span>
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                                <span class="key">{{ $t('e.administrator') }}：</span>
                                <span class="value">&nbsp; {{ detail.flag_admin ? $t('i.yes') : $t('i.no') }}</span>
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                                <span class="key">{{ $t('n.phone') }}：</span>
                                <span class="value">{{ detail.phone }}</span>
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                                <span class="key">{{ $t('n.email') }}：</span>
                                <span class="value">{{ detail.email }}</span>
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                                <span class="key">{{ $t('u.role') }}：</span>
                                <span class="value">{{ detail.role_name }}</span>
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                                <span class="key">{{ $t('n.time') }}：</span>
                                <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                            </a-col>
                        </a-row>
                    </div>
                </div>
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="activeKey">
                        <a-tab-pane key="UserRole" :tab="$t('u.role_assign')" forceRender>
                            <UserRoleTem
                                ref="UserRoleTem"
                                type="item"
                                :org_type="org_type"
                                :detail="detail"
                                @submit="setRoleIds"
                                v-show="activeKey === 'UserRole'"
                            />
                        </a-tab-pane>
                        <a-tab-pane key="UserAuth" :tab="$t('u.authority')" forceRender>
                            <UserDetail
                                ref="UserDetail"
                                :org_type="org_type"
                                :detail="detail"
                                @submit="setAuthorityIds"
                                v-show="activeKey === 'UserAuth'"
                            ></UserDetail>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </template>
            <div class="form-btns">
                <a-button @click="handleClose" type="primary" ghost>{{ $t('def.cancel') }}</a-button>
                <template v-if="step === 1">
                    <a-button
                        @click="handleNext"
                        :disabled="selectedRowKeys.length === 0"
                        type="primary"
                        v-if="$auth('user.save', 'MANAGER')"
                        >{{ $t('af.step') }}</a-button
                    >
                </template>
                <template v-if="step === 2">
                    <a-button @click="handleSubmit" type="primary" v-if="$auth('user.save', 'MANAGER')">{{
                        $t('def.sure')
                    }}</a-button>
                </template>
                <template v-if="step === 3">
                    <a-button @click="handleSave" type="primary" v-if="$auth('user.save', 'MANAGER')">{{
                        $t('def.save')
                    }}</a-button>
                </template>
            </div>
        </div>
        <!-- 取消的modal -->
        <a-modal
            :title="null"
            :closable="false"
            class="cancel-modal"
            v-model:visible="cancelModalShow"
            width="320px"
            :getContainer="() => $refs.userEditFsRef"
            centered
        >
            <div class="title">{{ $t('u.sure_exit_fs') }}</div>
            <div class="content">
                <div class="tips">
                    <span>{{ $t('u.not_been_successfully') }}</span>
                </div>
            </div>
            <template #footer>
                <div class="footer">
                    <a-button
                        @click="
                            () => {
                                cancelModalShow = false;
                            }
                        "
                        >{{ $t('def.cancel') }}</a-button
                    >
                    <a-button type="primary" @click="routerChange('list')">{{ $t('def.sure') }}</a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';
import TimeSearch from '@/components/common/TimeSearch.vue';
import UserRoleTem from './components/UserRoleTem.vue';
import UserDetail from './components/UserDetail.vue';

export default {
    name: 'UserList',
    components: {
        TimeSearch,
        UserRoleTem,
        UserDetail,
    },
    props: {},
    data() {
        return {
            Core,
            org_id: Core.Data.getOrgId(),
            org_type: Core.Data.getOrgType(),
            USER_TYPE: Core.Const.USER.TYPE,
            // 加载
            loading: false,
            // 分页
            pagination: {
                currPage: 1,
                pageSize: 20,
                total: 0,
                showTotal: total => this.$t('n.all_total') + ` ${total} ` + this.$t('in.total'),
            },
            // 搜索
            searchForm: {
                key: '',
            },

            // 表格
            tableData: [],
            tableColumns: [
                { title: 'n.name', dataIndex: 'name', key: 'user' },
                { title: 'u.department', dataIndex: 'department', key: 'department' },
                { title: 'u.employee_no', dataIndex: 'employee_no', key: 'item' },
                { title: 'n.phone', dataIndex: 'phone', key: 'item' },
                { title: 'n.email', dataIndex: 'email', key: 'item' },
                { title: 'u.role', dataIndex: ['user', 'role_name'], key: 'role_name' },
                { title: 'u.authority_abbreviation', dataIndex: ['user', 'flag_authority'], key: 'authority' },
            ],
            // 分页
            paginationAdd: {
                currPage: 1,
                pageSize: 20,
                total: 0,
                showTotal: total => this.$t('n.all_total') + ` ${total} ` + this.$t('in.total'),
            },

            // 表格
            tableDataAdd: [],
            tableColumnsAdd: [
                { title: 'n.name', dataIndex: 'name', key: 'user' },
                { title: 'u.employee_no', dataIndex: 'employee_no', key: 'item' },
                { title: 'n.phone', dataIndex: 'phone', key: 'item' },
                { title: 'n.email', dataIndex: 'email', key: 'item' },
                { title: 'u.role', dataIndex: ['user', 'role_name'], key: 'role_name' },
                { title: 'u.authority_abbreviation', dataIndex: ['user', 'flag_authority'], key: 'authority' },
                { title: 'role.assignment', dataIndex: 'authority_ids', key: 'authority_ids', align: 'center' },
                { title: 'def.operate', key: 'operation', fixed: 'right', width: 100 },
            ],
            selectedRowKeys: [],
            step: 1,
            allocatId: null, // 分配权限时传入 id
            detail: {},
            cancelModalShow: false,
            //标签页
            activeKey: 'UserRole',
        };
    },
    watch: {},
    computed: {
        selectedRowKeysObj() {
            let arr = [];
            this.tableDataAdd.forEach(item => {
                arr.push({
                    id: item.id, //id
                    role_id: item.user.role_id, //角色id
                    authority_ids: item.authority_ids, //权限ids
                });
            });
            return arr;
        },
    },
    mounted() {
        this.getTableData();
        this.getRoleList();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'list': // 列表
                    this.$router.replace({
                        path: '/system/user-list',
                    });
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/system/user-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        pageChange(curr) {
            // 页码改变
            this.pagination.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.pagination.pageSize = size;
            // this.getTableData();
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
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.RETAIL.externalList({
                ...this.searchForm,
                page: 1,
                page_size: 999,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.pagination.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getRoleList() {
            Core.Api.Authority.roleList({
                org_id: this.org_id, //组织id
                org_type: this.org_type, //组织类型
                page: 1,
                page_size: 999,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.optionsRoleId = res.list;
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 删除用户
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    _this.tableDataAdd = _this.tableDataAdd.filter(item => item.id !== id);
                    _this.$message.success(_this.$t('pop_up.delete_success'));
                },
            });
        },
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },
        // 分配权限
        allocat(record) {
            console.log(record);
            this.step = 3;
            this.allocatId = record.id;
            this.detail = record;
        },
        handleClose() {
            if (this.step === 2 || this.step === 3) {
                this.cancelModalShow = true;
            } else if (this.step === 1) {
                this.routerChange('list');
            }
        },
        handleNext() {
            this.step = 2;
            this.tableDataAdd = [];
            this.tableData.forEach(item => {
                this.selectedRowKeys.forEach(selectId => {
                    if (item.id === selectId) {
                        this.tableDataAdd.push(item);
                    }
                });
            });
        },
        handleSubmit() {
            Core.Api.RETAIL.addPerson({
                add_outer_user_list: this.selectedRowKeysObj,
            })
                .then(res => {
                    this.$message.success(this.$t('pop_up.add'));
                    this.routerChange('list');
                })
                .catch(err => {
                    console.log('getTableData err', err);
                });
        },
        handleSave() {
            if (this.$refs?.UserRoleTem) this.$refs.UserRoleTem.handleEditSubmit();
            if (this.$refs?.UserDetail) this.$refs?.UserDetail.save();
        },
        setRoleIds(data) {
            this.activeKey = 'UserRole';
            if (data.length === 0) return (this.detail.user = {});
            const user = {
                role_id: data[0].id,
                role_name: data[0].name,
                roleList: data,
            };
            const index = this.tableDataAdd.findIndex(i => i.id === this.allocatId);
            this.tableDataAdd[index].user = user;
            this.detail.user = user;
            this.step = 2;
        },
        setAuthorityIds(ids) {
            this.activeKey = 'UserRole';
            const index = this.tableDataAdd.findIndex(i => i.id === this.allocatId);
            this.tableDataAdd[index].authority_ids = ids;
            this.detail.authority_ids = ids;
            this.step = 2;
        },
        changeRole(option, record) {
            record.role_name = option?.name || '';
        },
        back() {
            if (this.step === 1) {
                this.routerChange('list');
            } else {
                this.step--;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.title-container {
    background: #f0f2f5;
    margin: 0 8px;
    padding: 16px 0;
    border-radius: 0;
    &.step3 {
        background: #fff;
        margin: 0 20px;
    }
    .left-arrow {
        height: 17px;
        width: 17px;
        margin-right: 4px;
        cursor: pointer;
    }
}
.search-container {
    background: #fff;
    padding: 0;
    margin: 20px;
    border-radius: 4px;
    .search-box {
        display: flex;
        .key {
            padding: 0px 10px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            color: #1d2129;
            font-size: 14px;
            font-weight: 400;
            border: 1px solid #e2e2ea;
            border-radius: 4px 0px 0px 4px;
            border-right: none;
            background-color: #ffffff;
        }
        .value {
            flex: 1;
            overflow: hidden;

            > .ant-input,
            > .ant-select,
            > .ant-select-selector,
            > .ant-picker,
            > .ant-cascader-picker,
            > .ant-select-single,
            > .ant-select-show-arrow {
                width: 100%;
                border-radius: 0px 4px 4px 0px !important;
            }
            .ant-select:not(.ant-select-customize-input) .ant-select-selector {
                border-radius: 0px 4px 4px 0px !important;
            }
        }
    }
}
.table-container {
    margin-bottom: 0;
}
.form-btns {
    border: 1px solid #edf1f4;
    padding: 20px 0;
    text-align: center;
    .ant-btn[disabled],
    .ant-btn[disabled]:hover,
    .ant-btn[disabled]:focus,
    .ant-btn[disabled]:active {
        color: #ffffff !important;
        background: #ccdfff;
        border: none !important;
        text-shadow: none;
        box-shadow: none;
    }
}
:deep(.cancel-modal) {
    .ant-modal-content {
        border-radius: 4px;
        .ant-modal-body {
            padding: 24px;
            padding-bottom: 34px;
            color: #1d2129;
            .title {
                text-align: center;
                font-size: 18px;
                font-weight: 600;
            }
            .content {
                margin-top: 34px;
                text-align: center;
            }
            span {
                white-space: normal;
            }
        }
        .ant-modal-footer {
            padding: 18px 0;
            height: auto;
            text-align: center;
            .ant-btn {
                border-radius: 4px;
                font-size: 14px;
            }
        }
    }
}
</style>
<style lang="less">
#UserEditFs {
    .user-avatar {
        margin-right: 10px;
    }
    .label {
        display: inline-block;
        background: rgba(0, 180, 42, 0.1);
        border-radius: 4px;
        padding: 2px 4px;
        font-size: 12px;
        line-height: 12px;
        color: #00b42a;
        margin-left: 4px;
    }
    .allocated,
    .unallocated {
        padding: 5px 14px;
        border-radius: 4px;
        display: inline-block;
        font-size: 12px;
        font-weight: 400;
    }
    .allocated {
        color: #00b42a;
        background: rgba(0, 180, 42, 0.1);
    }
    .unallocated {
        color: #ff7d00;
        background: rgba(255, 125, 0, 0.1);
    }
    .config {
        .fcc();
        cursor: pointer;
        .allocation-img,
        .edit-img {
            width: 16px;
            height: 16px;
        }
        .allocation,
        .edit {
            color: #0061ff;
            font-size: 14px;
            line-height: 20px;
            margin-left: 10px;
        }
    }
}
</style>
