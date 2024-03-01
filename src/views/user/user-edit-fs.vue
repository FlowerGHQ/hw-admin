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
                            <template v-if="column.key === 'user'">
                                <a-avatar class="user-avatar" :size="32" :src="record.avatar">
                                    {{ record.name }}
                                </a-avatar>
                                <span>{{ text || '-' }}</span>
                                <template v-if="record.select"><span class="label">已配置</span></template>
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
                            <template v-if="column.key === 'role_id'">
                                <a-select
                                    v-model:value="record.role_id"
                                    :options="optionsRoleId"
                                    style="width: 170px"
                                    :fieldNames="{ label: 'name', value: 'id' }"
                                    :placeholder="`${$t('n.choose')}${$t('authority.title.role')}`"
                                    allowClear
                                    @change="(value, option) => changeRole(option, record)"
                                ></a-select>
                            </template>
                            <template v-if="column.key === 'authority_ids'">
                                <template v-if="text">
                                    <span class="allocated" @click="allocat(record)">已分配</span>
                                </template>
                                <template v-else>
                                    <span class="unallocated" @click="allocat(record)">请分配权限</span>
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
                <UserDetail
                    ref="UserDetail"
                    :org_type="org_type"
                    :detail="detail"
                    @submit="setAuthorityIds"
                ></UserDetail>
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
import UserDetail from './components/UserDetail.vue';

export default {
    name: 'UserList',
    components: {
        TimeSearch,
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
                { title: 'authority.title.role', dataIndex: 'role_id', key: 'role_id' },
                { title: 'role.assignment', dataIndex: 'authority_ids', key: 'authority_ids', align: 'center' },
                { title: 'def.operate', key: 'operation', fixed: 'right', width: 100 },
            ],
            selectedRowKeys: [],
            step: 1,
            allocatId: null, // 分配权限时传入 id
            detail: {},
            cancelModalShow: false,
        };
    },
    watch: {},
    computed: {
        selectedRowKeysObj() {
            let arr = [];
            this.tableData.forEach(item => {
                this.selectedRowKeys.forEach(selectId => {
                    if (item.id === selectId) {
                        arr.push({
                            id: item.id, //id
                            role_id: item.role_id, //角色id
                            authority_ids: item.authority_ids, //权限ids
                        });
                    }
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
            this.$refs.UserDetail.save();
        },
        setAuthorityIds(ids) {
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
    .allocated {
        color: #00b42a;
        cursor: pointer;
    }
    .unallocated {
        color: #0061ff;
        cursor: pointer;
    }
}
</style>
