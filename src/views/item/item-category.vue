<template>
<div id="ItemCategory">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">商品分类</div>
            <div class="btns-area">
                <a-button type="primary" @click="handleModalShow({})"><i class="icon i_add"/>新增分类</a-button>
            </div>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">分类名称:</div>
                    <div class="value">
                        <a-input placeholder="请输入分类名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
            </a-row>
            <div class="btn-area">
                <a-button @click="handleSearch" type="primary">查询</a-button>
                <a-button @click="handleSearchReset">重置</a-button>
            </div>
        </div>
        <div class="table-container">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                :row-key="record => record.id"  :pagination='false' v-model:expandedRowKeys='expandedRowKeys'
                @expand='handleExpandedChange'>
                <template #bodyCell="{ column, text , record }">
                    <template v-if="column.dataIndex === 'sn'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{text}}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-'}}
                    </template>
                    <template v-if="column.key === 'tip_item'">
                        <a-tooltip placement="top" :title='text'>
                            <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type='link' @click="handleModalShow(record, record)"> <i class="icon i_edit"/> 编辑</a-button>
                        <a-button type='link' @click="handleModalShow({parent_id: record.id}, null,record)"> <i class="icon i_add"/> 新增子分类</a-button>
                        <a-button type='link' @click="handleDelete(record)"> <i class="icon i_delete"/> 删除</a-button>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
    <template class="modal-container">
        <a-modal v-model:visible="modalVisible" :title="editForm.id ? '编辑分类' : '新增分类'" @ok="handleModalSubmit">
            <div class="modal-content">
                <div class="form-item">
                    <div class="key">分类名称</div>
                    <div class="value">
                        <a-input v-model:value="editForm.name" placeholder="请输入分类名称"/>
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
    name: 'ItemCategory',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 搜索
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            searchForm: {
                name: '',
            },
            tableData: [],

            modalVisible: false,
            expandedRowKeys: [],
            editNode: null,
            parentNode: null,
            editForm: {
                id: '',
                parent_id: '',
                name: '',
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '分类名称', dataIndex: 'name' },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, },
            ]
            return columns
        },
    },
    mounted() {
        this.getDataByParent();
    },
    methods: {
        handleSearch() {  // 搜索
            this.expandedRowKeys = []
            this.getDataById();
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.expandedRowKeys = []
            this.getDataById();
        },
        getDataByParent(parent_id = 0, parentNode, node) {  // 通过父节点获取子级数据
            console.log('getDataByParent parent_id:', parent_id, 'parentNode', parentNode)
            this.loading = true;
            Core.Api.ItemCategory.tree({
                page: 0,
                parent_id: parent_id,
            }).then(res => {
                res.list.forEach(item => {
                    item.has_children ? item.children = [] : item.children = null
                });
                console.log('getDataByParent res.list:', res.list)
                if (parent_id === 0) {
                    this.tableData = res.list;
                } else if (parentNode) {
                    parentNode.children = res.list
                }
                if (!res.list.length) {
                    this.handleSearch();
                }
            }).catch(err => {
                console.log('getDataByParent err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getDataById(id = 0, node) {  // 通过本节点获取本级数据
            console.log('getDataById id:', id, 'node', node)
            this.loading = true;
            Core.Api.ItemCategory.tree({
                page: 0,
                id: id,
            }).then(res => {
                res.list.forEach(item => {
                    item.has_children ? item.children = [] : item.children = null
                });
                if (id === 0) {
                    this.tableData = res.list;
                } else if (node) {
                    node = res.list
                }
                console.log('getDataById res.list:', res.list)
            }).catch(err => {
                console.log('getDataById err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleExpandedChange(expanded, record) {
            console.log('handleExpandedChange expanded:', expanded, 'record', record)
            if (expanded) {
                this.getDataByParent(record.id, record)
                this.expandedRowKeys.push(record.id)
            } else {
                let index = this.expandedRowKeys.indexOf(record.id)
                this.expandedRowKeys.splice(index, 1)
                record.children = []
            }
        },

        handleModalShow({parent_id = 0, id, name}, node = null, parent = null) {
            this.editForm = {
                id: id,
                name: name,
                parent_id: parent_id,
            }
            console.log('this.editForm:', this.editForm)
            this.parentNode = parent
            this.editNode = node
            this.modalVisible = true
        },
        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.editForm)
            if (!form.name) {
                return this.$message.warning('请输入分类名称')
            }
            this.loading = true
            let apiName = form.id ? 'update' : 'save';
            Core.Api.ItemCategory[apiName](form).then(res => {
                this.$message.success('保存成功')
                if (form.id) {
                    this.getDataById(form.id, this.editNode)
                } else {
                    this.getDataByParent(form.parent_id, this.parentNode)
                }
                if (form.parent_id !== 0) {
                    let index = this.expandedRowKeys.indexOf(form.parent_id)
                    this.expandedRowKeys.splice(index, 1)
                } else {
                    this.expandedRowKeys = []
                }
                this.modalVisible = false
            }).catch(err => {
                console.log('handleModalSubmit err:', err)
            }).finally(() => {
                this.loading = false
            })

        },

        handleDelete(record){
            this.loading = false;
            let _this = this
            this.$confirm({
                title: `确定要删分类[${record.name}]吗？`,
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.ItemCategory.delete({
                        id: record.id,
                    }).then(res => {
                        console.log("handleDelete res", res)
                        _this.$message.success('删除成功')
                        if (record.parent_id !== 0) {
                            let index = _this.expandedRowKeys.indexOf(record.parent_id)
                            _this.expandedRowKeys.splice(index, 1)
                        }
                        _this.getDataByParent(record.parent_id)
                    }).catch(err => {
                        console.log('handleDelete err', err)
                    }).finally(() => {
                        _this.loading = false;
                    });
                },
            });
        },
    }
};
</script>

<style lang="less" scoped>
// #ItemCategory {}
</style>