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
                :row-key="record => record.id"  :pagination='false' @change="handleTableChange">
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
                        <a-button type='link' @click="routerChange('edit', record)"> <i class="icon i_edit"/> 编辑</a-button>
                        <a-button type='link' @click="handleDelete(record.id)"> <i class="icon i_delete"/> 删除</a-button>
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
            modalParent: {},
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
        this.getTableData();
    },
    methods: {
        handleDelete(id){
            this.loading = false;
            Core.Api.ItemCategory.delete({id}).then(res => {
                console.log("handleDelete res", res)
                this.$message.success('删除成功')
            }).catch(err => {
                console.log('handleDelete err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {  // 搜索
            this.getTableData();
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.getTableData();
        },
        getTableData(parent_id = 0, target) {  // 获取 表格 数据
            this.loading = true;
            Core.Api.ItemCategory.list({
                page: 0,
                parent_id: parent_id
            }).then(res => {
                if (parent_id === 0) {
                    this.tableData = res.list;
                } else {
                    target.children = res.list
                }
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },


        handleModalShow({parent_id = 0, id, name}, parent = null) {
            this.editForm = {
                id: id,
                name: name,
                parent_id: parent_id,
            }
            this.modalVisible = true
            this.parentNode = parent
        },
        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.editForm)
            if (!form.name) {
                return this.$message.warning('请输入分类名称')
            }
            let apiName = form.id ? 'update' : 'save'
            this.loading = true
            Core.Api.ItemCategory[apiName](form).then(res => {
                this.$message.success('保存成功')
                this.getTableData(form.parent_id, this.parentNode)
            }).catch(err => {
                console.log('handleModalSubmit err:', err)
            }).finally(() => {
                this.loading = false
            })

        }
    }
};
</script>

<style lang="less" scoped>
// #ItemCategory {}
</style>