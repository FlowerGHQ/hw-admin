<template>
    <div id="UserList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('u.list') }}</div>
                <div class="btns-area">
                    <a-button @click="routerChange('edit')">
                        <!-- <i class="icon i_add" /> -->
                        {{ $t('u.manually_add') }}
                    </a-button>
                    <a-button v-if="$auth('ADMIN')" @click="routerChange('edit-fs')">
                        <img src="@images/mall/login/fs-login.png" class="fs-icon" />
                        {{ $t('u.fs_add') }}
                    </a-button>
                </div>
            </div>
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
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="8" class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">{{ $t('crm_c.group') }}：</div>
                        <!--区域 -->
                        <div class="value">
                            <a-tree-select
                                class="CategoryTreeSelect"
                                v-model:value="searchForm.group_id"
                                :placeholder="$t('def.select')"
                                :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                                :tree-data="groupOptions"
                                tree-default-expand-all
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
                        <template v-if="column.dataIndex === 'flag_admin'">
                            <template v-if="orgType === Core.Const.LOGIN.ORG_TYPE.ADMIN">
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
                        <template v-if="column.key === 'role_names'">
                            <span v-for="(item, index) in text">
                                <span>{{ item || '' }}</span>
                                <span v-if="text[index + 1]">,</span>
                            </span>
                            <span v-if="!text?.length">-</span>
                        </template>
                        <template v-if="column.key === 'user'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)" style="margin-left: 6px">
                                    {{ text || '-' }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title="text">
                                <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'authority'">
                            <span class="allocated" v-if="text">{{ $t('u.allocated') }}</span>
                            <span class="unallocated" v-else>{{ $t('u.unallocated') }}</span>
                        </template>

                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)">
                                <i class="icon i_detail" />{{ $t('def.detail') }}
                            </a-button>
                            <a-button type="link" @click="routerChange('edit', record)">
                                <i class="icon i_edit" />{{ $t('def.edit') }}
                            </a-button>
                            <a-button type="link" @click="handleEditShow(record)">
                                <i class="icon i_lock" />{{ $t('u.reset') }}
                            </a-button>
                            <a-button type="link" @click="handleDelete(record.id)" class="danger">
                                <i class="icon i_delete" />
                                {{ $t('def.delete') }}
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
        </div>
        <a-modal
            v-model:visible="passShow"
            :title="$t('u.reset')"
            class="password-edit-modal"
            :after-close="handleEditClose"
        >
            <div class="form-title">
                <div class="form-item required">
                    <div class="key">{{ $t('n.new') }}:</div>
                    <div class="value">
                        <a-input-password v-model:value="form.password" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.double') }}:</div>
                    <div class="value">
                        <a-input-password v-model:value="form.new_password" :placeholder="$t('def.input')" />
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleEditSubmit" type="primary">{{ $t('def.sure') }}</a-button>
                <a-button @click="passShow = false">{{ $t('def.cancel') }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';

import TimeSearch from '@/components/common/TimeSearch.vue';

export default {
    name: 'UserList',
    components: {
        TimeSearch,
    },
    props: {},
    data() {
        return {
            Core,
            orgType: Core.Data.getOrgType(),
            USER_TYPE: Core.Const.USER.TYPE,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            searchForm: {
                name: '',
                group_id: undefined,
                type: undefined,
                org_id: Core.Data.getOrgId(),
                org_type: Core.Data.getOrgType(),
                begin_time: '',
                end_time: '',
            },

            // 表格
            tableData: [],

            // 弹框
            passShow: false,
            form: {
                id: '',
                password: '',
                new_password: '',
            },
            groupOptions: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let result = [
                { title: 'n.name', dataIndex: ['account', 'name'], key: 'user' },
                { title: 'u.account', dataIndex: ['account', 'username'], key: 'item' },
                { title: 'n.phone', dataIndex: ['account', 'phone'], key: 'item' },
                { title: 'n.email', dataIndex: ['account', 'email'], key: 'item' },
                { title: 'u.employee_no', dataIndex: 'employee_no', key: 'item' },
                { title: 'u.role', dataIndex: 'role_names', key: 'role_names' },
                { title: 'u.authority_abbreviation', dataIndex: 'flag_authority', key: 'authority' },
                
                { title: 'u.login', dataIndex: ['account', 'last_login_time'], key: 'time' },
                { title: 'd.create_time', dataIndex: 'create_time', key: 'time' },
                { title: 'def.operate', key: 'operation', fixed: 'right', width: 100 },
            ]

            if (this.$auth('sys.sys.user.set-admin')) {
                result.splice(7, 0, { title: 'e.administrator', dataIndex: 'flag_admin', align: 'center' },)
            }

            return result
        }
    },
    mounted() {
        this.getTableData();
        if (this.$auth('ADMIN')) {
            this.handleGroupTree();
        }
    },
    methods: {
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
                case 'edit-fs': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/system/user-edit-fs',
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
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.User.list({
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
        // 删除用户
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
        // 编辑密码
        handleEditShow(item) {
            this.passShow = true;
            if (item) {
                this.form.id = item.account_id;
            }
        },
        handleEditClose() {
            this.passShow = false;
            this.form = {
                id: '',
                password: '',
                new_password: '',
            };
        },
        handleEditSubmit() {
            let form = Core.Util.deepCopy(this.form);
            console.log('handleLogin form:', form);
            if (!form.password) {
                return this.$message.warning(this.$t('u.new_password'));
            }
            if (!form.new_password) {
                return this.$message.warning(this.$t('u.again'));
            }
            if (form.new_password !== form.password) {
                return this.$message.warning(this.$t('u.not'));
            }

            this.loading = true;
            Core.Api.Account.resetPwd(form)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleEditClose();
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        handleGroupTree() {
            Core.Api.CRMGroupMember.structureByUser().then(res => {
                this.groupOptions = res.list;
                console.log(res);
            });
        },
        handleManagerChange(record) {
            this.loading = true;
            Core.Api.User.setPlatformAdmin({
                id: record.id,
                user_type: Core.Data.getLoginType(),
                flag_admin: record.flag_admin ? 0 : 1, // 0 取消 1 设置
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
// #UserList {}
.btns-area {
    .fcc();
}
.fs-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
}
</style>
<style lang="less">
#UserList {
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
}
</style>
