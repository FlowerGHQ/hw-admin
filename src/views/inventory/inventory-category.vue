<template>
    <div id="MaterialCategory">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('inv.category') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleModalShow({})"
                        ><i class="icon i_add" />{{ $t('m.new_category') }}</a-button
                    >
                </div>
            </div>
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="type" @change="handleSearch">
                    <a-tab-pane :key="item.key" v-for="item of TYPE_MAP">
                        <template #tab>
                            <div class="tabs-title">{{ item[$i18n.locale] }}</div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
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
                            <a-button type="link" @click="handleModalShow(record, record)"
                                ><i class="icon i_edit" />{{ $t('m.edit_name') }}</a-button
                            >
                            <a-button type="link" @click="handleModalShow({ parent_id: record.id }, null, record)"
                                ><i class="icon i_add" />{{ $t('m.new_sub_category') }}</a-button
                            >
                            <a-button type="link" @click="handleDelete(record)" class="danger"
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
                :title="editForm.id ? $t('m.edit_category') : $t('m.new_category')"
                @ok="handleModalSubmit"
            >
                <div class="modal-content">
                    <div class="form-item">
                        <div class="key">{{ $t('m.category_name') }}</div>
                        <div class="value">
                            <a-input
                                v-model:value="editForm.name"
                                :placeholder="$t('def.input') + $t('m.category_name')"
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

export default {
    name: 'MaterialCategory',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            tableData: [],
            TYPE_MAP: Core.Const.INVENTORY.TYPE_MAP,
            expandedRowKeys: [],
            type: Core.Const.INVENTORY.TYPE.FINISHED,
            editNode: null,
            parentNode: null,
            modalVisible: false,
            statusList: [],
            editForm: {
                id: '',
                parent_id: '',
                name: '',
                type: Core.Const.INVENTORY.TYPE.FINISHED,
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('m.category_name'), dataIndex: 'name' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right', width: 100 },
            ];
            return columns;
        },
    },
    mounted() {
        this.getDataByParent();
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
            Core.Api.MaterialCategory.tree({
                page: 0,
                parent_id: parent_id,
                type: this.type,
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
            Core.Api.MaterialCategory.tree({
                page: 0,
                id: id,
                type: this.type,
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
        handleModalShow({ parent_id = 0, id, name }, node = null, parent = null) {
            this.editForm = {
                id: id,
                name: name,
                parent_id: parent_id,
                type: this.type,
            };
            console.log('this.editForm:', this.editForm);
            this.parentNode = parent;
            this.editNode = node;
            this.modalVisible = true;
        },
        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.editForm);
            if (!form.name) {
                return this.$message.warning(this.$t('def.input') + this.$t('m.category_name'));
            }
            this.loading = true;
            let apiName = form.id ? 'update' : 'save';
            Core.Api.MaterialCategory[apiName](form)
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
                    Core.Api.MaterialCategory.delete({
                        id: record.id,
                    })
                        .then(res => {
                            console.log('handleDelete res', res);
                            _this.$message.success(this.$t('pop_up.delete_success'));
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
    },
};
</script>

<style lang="less" scoped>
// #MaterialCategory {}
</style>
