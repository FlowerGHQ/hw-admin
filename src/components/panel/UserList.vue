<template>
    <div class="UserList gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('e.employee_list') }}</div>
        </div>
        <div class="panel-content">
            <div class="table-container">
                <a-button type="primary" ghost @click="routerChange('edit')" class="panel-btn">
                    <i class="icon i_add" />{{ $t('e.new_employee') }}
                </a-button>
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.userTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'flag_admin'">
                            <template v-if="loginType < type">
                                <a-switch
                                    :checked="!!record.flag_admin"
                                    :checked-children="$t('i.yes')"
                                    :un-checked-children="$t('i.no')"
                                    @click="handleManagerChange(record)"
                                />
                            </template>
                            <template v-else> {{ text ? $t('i.yes') : $t('i.no') }}</template>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
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
                            <a-button type="link" @click="handleUserRole(record)">
                                <i class="icon i_edit" />{{ $t('u.set_role') }}
                            </a-button>
                            <a-button type="link" @click="routerChange('edit', record)">
                                <i class="icon i_edit" />{{ $t('def.edit') }}
                            </a-button>
                            <a-button type="link" @click="handleReset(record)" v-if="$UserAuth(loginUsername)">
                                <i class="icon i_lock" />{{ $t('u.reset') }}
                            </a-button>
                            <a-button type="link" class="danger" @click="handleDelete(record.id)">
                                <i class="icon i_delete" />{{ $t('def.delete') }}
                            </a-button>
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
            <a-modal v-model:visible="userRoleShow" :title="$t('u.set_role')" :after-close="handleRoleClose">
                <UserRole v-if="userRoleShow" :user-id="userId" :detail="userDetail"></UserRole>
                <template #footer>
                    <a-button @click="handleRoleClose">{{ $t('def.cancel') }}</a-button>
                </template>
            </a-modal>
            <!-- 重置密码 -->
            <a-modal v-model:visible="passShow" :title="$t('u.reset')" class="password-edit-modal">
                <div class="form-title">
                    <div class="form-item required">
                        <div class="key">{{ $t('n.new') }}:</div>
                        <div class="value">
                            <a-input-password v-model:value="resetForm.password" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">{{ $t('n.double') }}:</div>
                        <div class="value">
                            <a-input-password v-model:value="resetForm.new_password" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="handleEditSubmit" type="primary">{{ $t('def.sure') }}</a-button>
                    <a-button @click="handleEditClose">{{ $t('def.cancel') }}</a-button>
                </template>
            </a-modal>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import UserRole from '../../views/user/components/UserRole.vue';
const USER_TYPE = Core.Const.USER.TYPE;

export default {
    name: 'UserList',
    components: { UserRole },
    props: {
        orgId: {
            type: Number,
        },
        orgType: {
            type: Number,
        },
        type: {
            type: Number,
        },
        title: {
            type: Number,
        },
    },
    data() {
        return {
            USER_TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格数据
            tableData: [],
            userRoleShow: false,

            userId: '',
            userDetail: '',
            passShow: false, // 重置密码model
            resetForm: {
                id: '',
                password: '',
                new_password: '',
            },
            loginUsername: Core.Data.getUser()?.username, // 只有admin1的账户能重置密码
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('e.name'), dataIndex: ['account', 'name'], key: 'item' },
                { title: this.$t('e.account'), dataIndex: ['account', 'username'], key: 'item' },
                { title: this.$t('n.phone'), dataIndex: ['account', 'phone'] },
                { title: this.$t('n.email'), dataIndex: ['account', 'email'] },
                { title: this.$t('n.type'), dataIndex: 'type' },
                { title: this.$t('e.login_time'), dataIndex: ['account', 'last_login_time'], key: 'time' },
                { title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            if (this.$auth('sys.sys.user.set-admin')) {
                columns.splice(5, 0, { title: this.$t('e.administrator'), dataIndex: 'flag_admin' });
                // 维修工不显示管理员
            }
            return columns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        handleManagerChange(record) {
            this.loading = true;
            Core.Api.User.setAdmin({
                id: record.id,
                flag_admin: record.flag_admin ? 0 : 1,
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
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/system/user-edit',
                        query: {
                            id: item.id,
                            org_id: this.orgId,
                            org_type: this.orgType,
                            type: this.type,
                        },
                    });
                    window.open(routeUrl.href, '_self');
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
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.pageSize = size;
            this.getTableData();
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.User.list({
                org_id: this.orgId,
                org_type: this.orgType,
                type: this.type,
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
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.User.delete({ id })
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
        handleUserRole(item) {
            console.log(item);
            this.userId = item.id;
            this.userDetail = item;
            this.userRoleShow = true;
        },
        handleRoleClose() {
            this.userId = '';
            this.userDetail = '';
            this.userRoleShow = false;
        },
        // 重置密码
        handleReset(record) {
            this.resetForm.id = record.account_id;
            this.passShow = true;
        },
        // 重置密码model 提交
        handleEditSubmit() {
            let resetForm = Core.Util.deepCopy(this.resetForm);

            if (!resetForm.password) {
                return this.$message.warning(this.$t('u.new_password'));
            }
            if (!resetForm.new_password) {
                return this.$message.warning(this.$t('u.again'));
            }
            if (resetForm.new_password !== resetForm.password) {
                return this.$message.warning(this.$t('u.not'));
            }
            resetForm.type = this.type;
            Core.Api.Account.ResetDetailPwd(resetForm)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleEditClose();
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        // 重置密码model 取消
        handleEditClose() {
            this.passShow = false;
            this.resetForm = {
                password: '',
                new_password: '',
            };
        },
    },
};
</script>

<style lang="less" scoped>
.UserList {
    .table-container {
        margin-top: -10px;
    }
}
</style>
