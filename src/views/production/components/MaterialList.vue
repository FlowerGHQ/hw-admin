<template>
    <div class="MaterialList gray-panel no-margin">
        <div class="panel-title">
            <div class="title">供应物料列表</div>
            <div class="btn-area" v-if="$auth('supplier.edit')">
                <MaterialSelect
                    @select="(ids, items) => handleAddShow(ids, items)"
                    btn-class="panel-btn"
                    :disabled-checked="checkedIds"
                >
                    添加物料
                </MaterialSelect>
            </div>
        </div>
        <div class="panel-content">
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="addData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    :loading="loading"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail' && $auth('material.detail')">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)"
                                    >{{ text || '-' }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'gross_weight'">
                            {{ $Util.countFilter(text) }}
                        </template>
                        <template v-if="column.key === 'spec'">
                            <a-tooltip placement="top" :title="text">
                                <div class="ell" style="max-width: 100px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'price'">
                            <template v-if="addMode || record.editMode">
                                ￥<a-input-number
                                    v-model:value="record.price"
                                    placeholder="请输入"
                                    :min="0.0"
                                    :precision="2"
                                />
                            </template>
                            <template v-else>￥{{ text }}</template>
                        </template>
                        <template v-if="column.key === 'operation' && $auth('supplier.edit')">
                            <template v-if="!this.addMode">
                                <a-button type="link" @click="handleRowChange(record)" v-if="!record.editMode"
                                    ><i class="icon i_edit" />修改单价</a-button
                                >
                                <a-button type="link" @click="handleRowSubmit(record)" v-else
                                    ><i class="icon i_confirm" />确认更改</a-button
                                >
                                <a-button type="link" @click="handleRemove(record)" class="danger"
                                    ><i class="icon i_delete" />移除</a-button
                                >
                            </template>
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
    </div>
</template>

<script>
import Core from '../../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import MaterialSelect from '@/components/popup-btn/MaterialSelect.vue';

export default {
    name: 'BomItems',
    components: {
        ItemSelect,
        MaterialSelect,
    },
    props: {
        supplierId: {
            type: Number,
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
            // 表格数据
            material_id: '',
            tableData: [],
            addMode: false,
            details: {
                items: [],
                materials: [],
            },
            addData: [],
            material: {},
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '物料名称', dataIndex: ['item', 'name'], key: 'detail' },
                { title: '物料分类', dataIndex: ['item', 'category', 'name'], key: 'item' },
                { title: '物料编码', dataIndex: ['item', 'code'], key: 'item' },
                { title: '单位', dataIndex: ['item', 'unit'], key: 'item' },
                { title: '单价', dataIndex: 'price', key: 'price' },
                { title: '规格', dataIndex: ['item', 'spec'], key: 'spec' },
                { title: '物料包装', dataIndex: ['item', 'encapsulation'], key: 'item' },
                { title: '包装尺寸', dataIndex: ['item', 'encapsulation_size'], key: 'item' },
                { title: '毛重(kg)', dataIndex: ['item', 'gross_weight'], key: 'gross_weight' },
                { title: '创建时间', dataIndex: ['item', 'create_time'], key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right' },
            ];
            return columns;
        },
        // 已经添加到物料表中的ids
        checkedIds() {
            console.log('addData:', this.addData);

            let checkedIds = this.addData.map(i => i.item.id);
            // let checkedIds = []
            console.log('checkedIds:', checkedIds);
            console.log('addData', this.addData);
            return checkedIds;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/production/material-detail',
                        query: { id: item.item.id },
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
            Core.Api.SupplierItem.list({
                page: this.currPage,
                page_size: this.pageSize,
                supplier_id: this.supplierId,
            })
                .then(res => {
                    this.total = res.count;
                    this.addData = res.list.map(item => ({
                        item: item.material,
                        id: item.id,
                        price: Core.Util.countFilter(item.price) || (item.material ? item.material.price : 0) || 0,
                    }));
                    console.log('this.addData:', this.addData);
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleRowChange(item) {
            item.editMode = true;
        },
        handleRowSubmit(item) {
            Core.Api.Material.price({
                material_id: item.item.id,
                price: Math.round(item.price * 100),
                supplier_id: this.supplierId,
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'));
                this.getTableData();
            });
        },

        // 移出材料
        handleRemove(item) {
            let _this = this;
            let name = `[${item.item.name}]`;
            console.log('item', item);
            this.$confirm({
                title: '确定要移出' + name + '吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.SupplierItem.delete({
                        material_id: item.item.id,
                        supplier_id: _this.supplierId,
                    })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.move'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete -> err', err);
                        });
                },
            });
        },

        // 添加材料
        handleAddShow(ids, items) {
            console.log('handleAddShow items:', items);
            this.addData = items;
            console.log('handleAddShow this.addData:', this.addData);
            this.handleAddConfirm(ids);
        },
        handleAddConfirm(ids) {
            console.log('this.addData:', this.addData);
            Core.Api.SupplierItem.batchSave({
                material_ids: ids.join(','),
                supplier_id: this.supplierId,
            })
                .then(() => {
                    this.$message.success('添加成功');
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleAddShow err:', err);
                });
        },
    },
};
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
