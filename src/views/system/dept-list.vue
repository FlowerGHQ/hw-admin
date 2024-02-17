<template>
    <div id="Dept">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('dept.list') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleModalShow({})" v-if="$auth('material-category.save')"
                        ><i class="icon i_add" />{{ $t('dept.new_top') }}</a-button
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
                    v-model:expandedRowKeys="expandedRowKeys"
                    @expand="handleExpandedChange"
                >
                    <template #bodyCell="{ column, text, record }">
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
                            <a-button
                                type="link"
                                @click="handleModalShow(record, record)"
                                v-if="$auth('material-category.save')"
                                ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleModalShow({ parent_id: record.id }, null, record)"
                                v-if="$auth('material-category.save')"
                                ><i class="icon i_add" />{{ $t('dept.sub') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleDelete(record)"
                                class="danger"
                                v-if="$auth('material-category.delete')"
                                ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                            >
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
        <template class="modal-container">
            <a-modal
                v-model:visible="modalVisible"
                :title="editForm.id ? $t('dept.edit') : $t('dept.new')"
                @ok="handleModalSubmit"
            >
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('m.category_name') }}</div>
                        <div class="value">
                            <a-input
                                v-model:value="editForm.name"
                                :placeholder="$t('def.input') + $t('m.category_name')"
                            />
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">{{ $t('e.administrator') }}</div>
                        <div class="value">
                            <!--                        <a-input v-model:value="editForm.admin_user_id" :placeholder="$t('def.input')+$t('e.administrator')"/>-->

                            <a-select
                                v-model:value="editForm.admin_user_id"
                                show-search
                                :placeholder="$t('def.select') + $t('e.administrator')"
                                :default-active-first-option="false"
                                :show-arrow="false"
                                :filter-option="false"
                                :not-found-content="null"
                                @search="getUserData"
                            >
                                <a-select-option v-for="item in userData" :key="item.id" :value="item.id">
                                    {{ item.account ? item.account.name : '-' }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c.phone') }}</div>
                        <div class="value">
                            <a-input
                                v-model:value="editForm.phone"
                                :placeholder="$t('def.input') + $t('crm_c.phone')"
                            />
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c.remark') }}</div>
                        <div class="value">
                            <a-input
                                v-model:value="editForm.remark"
                                :placeholder="$t('def.input') + $t('crm_c.remark')"
                            />
                        </div>
                    </div>
                </div>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import UserSelect from '@/components/crm/popup-btn/UserSelect.vue';

export default {
    name: 'Dept',
    components: { UserSelect },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            tableData: [],
            expandedRowKeys: [],
            adminUserList: [],
            editNode: null,
            parentNode: null,
            modalVisible: false,
            editForm: {
                id: '',
                parent_id: '',
                name: '',
                admin_user_id: '',
                admin_user_name: '',
                phone: '',
                remark: '',
            },
            userData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('dept.name'), dataIndex: 'name' },
                { title: this.$t('e.administrator'), dataIndex: 'admin_user_name' },
                { title: this.$t('dept.user_count'), dataIndex: 'user_count' },
                { title: this.$t('dept.customer_count'), dataIndex: 'customer_count' },
                { title: this.$t('crm_c.phone'), dataIndex: 'phone' },
                { title: this.$t('crm_c.remark'), dataIndex: 'remark' },
                { title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right', width: 100 },
            ];
            return columns;
        },
    },
    mounted() {
        this.getDataByParent();
        this.getUserData();
    },
    methods: {
        handleSearch() {
            // 搜索
            this.expandedRowKeys = [];
            this.getDataById();
        },
        getDataByParent(parent_id = 0, parentNode, node) {
            // 通过父节点获取子级数据
            console.log('getDataByParent parent_id:', parent_id, 'parentNode', parentNode);
            this.loading = true;
            Core.Api.Dept.list({
                page: 0,
                parent_id: parent_id,
            })
                .then(res => {
                    res.list.forEach(item => {
                        item.has_children ? (item.children = []) : (item.children = null);
                    });
                    console.log('getDataByParent res.list:', res.list);
                    if (parent_id === 0) {
                        this.tableData = res.list;
                    } else if (parentNode) {
                        parentNode.children = res.list;
                    }
                    if (!res.list.length) {
                        this.handleSearch();
                    }
                })
                .catch(err => {
                    console.log('getDataByParent err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getDataById(id = 0, node) {
            // 通过本节点获取本级数据
            console.log('getDataById id:', id, 'node', node);
            this.loading = true;
            Core.Api.Dept.list({
                page: 0,
                id: id,
            })
                .then(res => {
                    res.list.forEach(item => {
                        item.has_children ? (item.children = []) : (item.children = null);
                    });
                    if (id === 0) {
                        this.tableData = res.list;
                    } else if (node) {
                        node = res.list;
                    }
                    console.log('getDataById res.list:', res.list);
                })
                .catch(err => {
                    console.log('getDataById err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 节点展开与关不
        handleExpandedChange(expanded, record) {
            console.log('handleExpandedChange expanded:', expanded, 'record', record);
            if (expanded) {
                this.getDataByParent(record.id, record);
                this.expandedRowKeys.push(record.id);
            } else {
                let index = this.expandedRowKeys.indexOf(record.id);
                this.expandedRowKeys.splice(index, 1);
                record.children = [];
            }
        },

        // 编辑与新增子类
        handleModalShow(
            { parent_id = 0, id, name, phone, admin_user_id, admin_user_name, remark },
            node = null,
            parent = null,
        ) {
            this.editForm = {
                id: id,
                name: name,
                parent_id: parent_id,
                phone: phone,
                admin_user_id: admin_user_id,
                admin_user_name: admin_user_name,
                remark: remark,
            };
            console.log('this.editForm:', this.editForm);
            this.parentNode = parent;
            this.editNode = node;
            this.getUserData(admin_user_name || '');
            this.modalVisible = true;
        },
        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.editForm);
            if (!form.name) {
                return this.$message.warning(this.$t('def.input') + this.$t('dept.name'));
            }
            this.loading = true;
            // let apiName = form.id ? 'update' : 'save';
            Core.Api.Dept.save(form)
                .then(res => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    if (form.parent_id == 0) {
                        this.getDataById();
                    } else if (form.id) {
                        this.getDataById(form.id, this.editNode);
                    } else {
                        this.getDataByParent(form.parent_id, this.parentNode);
                    }
                    if (form.parent_id !== 0) {
                        let index = this.expandedRowKeys.indexOf(form.parent_id);
                        this.expandedRowKeys.splice(index, 1);
                    } else {
                        this.expandedRowKeys = [];
                    }
                    this.modalVisible = false;
                })
                .catch(err => {
                    console.log('handleModalSubmit err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 删除分类
        handleDelete(record) {
            this.loading = false;
            let _this = this;
            this.$confirm({
                title: _this.$t('m.sure_delete_category_a') + `[${record.name}]` + _this.$t('m.sure_delete_category_b'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Dept.delete({
                        id: record.id,
                    })
                        .then(res => {
                            console.log('handleDelete res', res);
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            if (record.parent_id !== 0) {
                                let index = _this.expandedRowKeys.indexOf(record.parent_id);
                                _this.expandedRowKeys.splice(index, 1);
                            }
                            _this.getDataByParent(record.parent_id);
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        })
                        .finally(() => {
                            _this.loading = false;
                        });
                },
            });
        },

        handleAdminUserList(adminUserList) {
            if (adminUserList !== null) {
                this.adminUserList = adminUserList;
            } else {
                this.adminUserList = [];
            }
        },
        getUserData(query) {
            this.loading = true;
            Core.Api.User.list({
                // name: query,
                org_type: Core.Const.LOGIN.ORG_TYPE.ADMIN,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.userData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
// #MaterialCategory {}
</style>
