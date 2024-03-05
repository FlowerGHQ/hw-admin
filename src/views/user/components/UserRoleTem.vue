<template>
    <div class="UserRole gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-button
                    type="primary"
                    ghost
                    @click="handleRoleShow"
                    v-if="$auth('account.save', 'MANAGER')"
                    class="panel-btn"
                >
                    <i class="icon i_add" />{{ $t('u.add_role') }}
                </a-button>
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'text'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button
                                type="link"
                                @click="handleDelete(record)"
                                v-if="$auth('account.save', 'MANAGER')"
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
                    :show-total="total => `共${total}条`"
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
        <a-modal
            v-model:visible="roleShow"
            :title="$t('u.add_role')"
            class="stock-change-modal"
            :after-close="handleRoleClose"
            destroyOnClose
        >
            <div class="form-item required">
                <div class="key">{{ $t('u.role') }}</div>
                <div class="value">
                    <a-select v-model:value="form.role_id" :placeholder="$t('n.choose')">
                        <a-select-option
                            v-for="role in roleList"
                            :key="role.id"
                            :value="role.id"
                            :disabled="role.disabled"
                            >{{ role.name }}</a-select-option
                        >
                    </a-select>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleRoleSubmit" type="primary">{{ $t('def.ok') }}</a-button>
                <a-button @click="roleShow = false">{{ $t('def.cancel') }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../../core';
export default {
    name: 'UserRole',
    components: {},
    props: {
        userId: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        type: {
            type: String,
        },
    },
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格
            tableData: [],
            // 弹框
            roleShow: false,
            roleList: [],
            form: {
                role_id: '',
                user_id: '',
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: this.$t('u.role'), dataIndex: 'name', key: 'text' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            return tableColumns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
        },
        pageSizeChange(current, size) {
            this.pageSize = size;
        },
        getTableData() {
            // 获取 表格 数据
            Core.Api.Authority.listUserRole({
                user_id: this.userId,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.total = res.count;
                    this.tableData = res.list;
                    if (this.detail.user.roleList) {
                        this.detail.user.roleList.forEach(i => {
                            this.tableData.push(i);
                        });
                    }
                    this.getRoleList();
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
                org_id: this.detail.org_id,
                org_type: this.detail.org_type,
            }).then(res => {
                res.list.forEach(role => {
                    this.tableData.forEach(it => {
                        if (role.id == it.role_id || role.id == it.id) {
                            role.disabled = true;
                        }
                    });
                });
                this.roleList = res.list;
            });
        },
        handleRoleShow() {
            this.roleShow = true;
        },
        handleRoleClose() {
            this.roleShow = false;
            Object.assign(this.form, this.$options.data().form);
        },
        handleRoleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            form.user_id = this.detail.id;
            if (!form.role_id) {
                return this.$message.warning(this.$t('u.choose_role'));
            }
            const list = this.roleList.filter(item => item.id === form.role_id);
            list[0].create_time = Date.now() / 1000;
            this.tableData.push(list[0]);
            this.roleList.forEach(role => {
                this.tableData.forEach(it => {
                    if (role.id == it.id) {
                        role.disabled = true;
                    }
                });
            });
            this.roleShow = false;
        },
        handleDelete(item) {
            let _this = this;
            this.$confirm({
                title: _this.$t('u.sure_delete_role'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    _this.$message.success(_this.$t('pop_up.delete_success'));
                    _this.tableData = _this.tableData.filter(i => i.id !== item.id);
                },
            });
        },
        handleEditSubmit() {
            return this.$emit('submit', this.tableData);
        },
    },
};
</script>
<style lang="less"></style>
