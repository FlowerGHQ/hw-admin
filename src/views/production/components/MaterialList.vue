<template>
    <div class="MaterialList gray-panel no-margin">
        <div class="panel-title">
            <div class="title">供应物料列表</div>
            <div class="btn-area">
                <MaterialSelect @select="(ids,items) => handleAddShow(TARGET_TYPE.MATERIAL,ids,items)"
                                btn-class="panel-btn" :disabled-checked='checkedIds.materials' v-if="!addMode">
                    添加物料
                </MaterialSelect>
                <a-button type="primary" class="panel-btn" v-if="addMode" @click.stop="handleAddConfirm()">确认添加
                </a-button>
            </div>
        </div>
        <div class="panel-content">
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="addMode ? addData : tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false' :loading='loading'
                         :row-selection="addMode ? null : rowSelection">
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type='link' class="danger" @click="handleRemove('', [record])"><i
                                class="icon i_delete"/>移出
                            </a-button>
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container" v-if="!addMode">
                <a-pagination
                    v-model:current="currPage"
                    :page-size='pageSize'
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => `共${total}条`"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import MaterialSelect from '@/components/popup-btn/MaterialSelect.vue';

const TARGET_TYPE = Core.Const.BOM.TARGET_TYPE
export default {
    name: 'BomItems',
    components: {
        ItemSelect,
        MaterialSelect,
    },
    props: {
        MaterialId: {
            type: Number,
        },
    },
    data() {
        return {
            TARGET_TYPE,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格数据
            tableData: [],
            details: {
                items: [],
                materials: [],
            },
            addMode: false,
            addData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: '物料名称', dataIndex: 'name', key: 'item'},
                {title: '物料分类', dataIndex: ['category', 'name'], key: 'item'},
                {title: '物料编码', dataIndex: 'code', key: 'item'},
                {title: '单位', dataIndex: 'unit', key: 'item'},
                {title: '规格', dataIndex: 'spec', key: 'item'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right'},
            ]
            return columns
        },
        // 已经添加到物料表中的ids
        checkedIds() {
            let checkedIds = {
                items: this.details.items.map(i => i.target_id),
                materials: this.details.materials.map(i => i.target_id)
            }
            console.log('checkedIds:', checkedIds)
            return checkedIds
        },
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => { // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys
                    this.selectedRowItems = selectedRows
                },
            };
        },
    },
    mounted() {
        this.getTableData();
        this.getAllDetails();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'detail':    // 详情
                    routeUrl = this.$router.resolve({
                        path: item.type ? "/item/item-detail" : '/production/material-detail',
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        pageChange(curr) { // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) { // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        getTableData() { // 获取 表格 数据
            this.loading = true;
            Core.Api.BomItem.list({
                Material_id: this.MaterialId,
            }).then(res => {
                console.log("getTableData res", res)
                let list = res.list
                list.forEach(item => {
                    item.target = item.target_type === TARGET_TYPE.ITEM ? item.item : item.material
                })
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getAllDetails() { // 获取所有已添加材料
            Core.Api.SupplierItem.list({
                Material_id: this.MaterialId,
            }).then(res => {
                console.log("getAllDetails res", res)
                let list = res.list
                let items = [], materials = []
                list.forEach(item => {
                    if (item.target_type === TARGET_TYPE.ITEM) {
                        items.push(item)
                    } else if (item.target_type === TARGET_TYPE.MATERIAL) {
                        materials.push(item)
                    }
                });
                this.details.items = items
                this.details.materials = materials
                console.log('getAllDetails this.details:', this.details)
            }).catch(err => {
                console.log('getAllDetails err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 移出材料
        handleRemove(type, items) {
            let _this = this;
            let name = items[0] ? `[${items[0].target.name}]` : ''
            let title = items.length > 1 ? `${name}等${items.length}件材料` : `材料${name}`
            let ids = items.map(item => item.id).join(',')
            this.$confirm({
                title: '确定要移出' + title + '吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.SupplierItem.delete({
                        Material_id: _this.MaterialId,
                        ids
                    }).then(() => {
                        _this.$message.success('移出成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete -> err", err);
                    })
                },
            });
        },

        // 添加材料
        handleAddShow(type, ids, items) {
            console.log('handleAddShow items:', items)
            let _items = items.map(item => {
                return {
                    target: item,
                    target_type: type,
                    target_id: item.id,
                    comment: '',
                }
            })
            this.addData = _items
            this.addMode = true
            console.log('handleAddShow this.addData:', this.addData)
        },
       handleAddConfirm() {
            console.log('this.addData:', this.addData)
            let items = this.addData.map(item => ({
                Material_id: this.MaterialId,
                id: item.id,
                comment: item.comment,
                target_id: item.target_id,
                target_type: item.target_type,
            }))
            console.log('handleAddConfirm items:', items)
            Core.Api.SupplierItem.save(items).then(() => {
                this.$message.success('添加成功')
                this.getTableData()
            }).catch(err => {
                console.log('handleAddShow err:', err)
            })
        },
    }
}
;
</script>

<style lang="less">
.MaterialList {
    .table-container {
        margin-top: -10px;

        .value-price {
            margin-right: 5px;
            width: 60px;
        }
    }

    .panel-title .btn-area {
        .panel-btn {
            margin-bottom: 0;
        }
    }
}
</style>