<template>
    <div class="BomItems gray-panel no-margin">
        <div class="panel-title">
            <div class="title">BOM表明细</div>
            <div class="btn-area" v-if="!addMode && !editShow">
                <ItemSelect
                    @select="(ids, items) => handleAddShow(TARGET_TYPE.ITEM, ids, items)"
                    btn-class="panel-btn"
                    :disabled-checked="checkedIds.items"
                >
                    添加商品
                </ItemSelect>
                <MaterialSelect
                    @select="(ids, items) => handleAddShow(TARGET_TYPE.MATERIAL, ids, items)"
                    btn-class="panel-btn"
                    :disabled-checked="checkedIds.materials"
                >
                    添加物料
                </MaterialSelect>
            </div>
        </div>
        <div class="panel-content">
            <div class="table-container">
                <template v-if="!addMode">
                    <a-button
                        class="panel-btn"
                        @click="handleMutiEditChange()"
                        type="primary"
                        :ghost="editShow ? false : true"
                    >
                        <template v-if="editShow">确认设置</template>
                        <template v-else>批量编辑</template>
                    </a-button>
                    <a-button class="panel-btn" @click="getTableData" v-if="editShow">取消设置</a-button>
                    <a-button
                        class="panel-btn"
                        @click="handleRemove('muti', selectedRowItems)"
                        type="danger"
                        ghost
                        :disabled="!selectedRowKeys.length"
                        v-if="!editShow"
                    >
                        批量删除
                    </a-button>
                </template>
                <template v-if="addMode">
                    <a-button class="panel-btn" @click="handleAddConfirm()" type="primary">确认添加</a-button>
                    <a-button class="panel-btn" @click="handleAddClose()">取消添加</a-button>
                </template>
                <a-table
                    :columns="tableColumns"
                    :data-source="addMode ? addData : tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    :loading="loading"
                    :row-selection="editShow || addMode ? null : rowSelection"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <div class="table-img">
                                <a-image
                                    :width="30"
                                    :height="30"
                                    :src="$Util.imageFilter(record.target.logo)"
                                    fallback="无"
                                />
                                <a-tooltip placement="top" :title="text">
                                    <div class="info">
                                        <a-button type="link" @click="routerChange('detail', record.target)">
                                            <div class="ell" style="max-width: 150px">{{ text || '-' }}</div>
                                        </a-button>
                                    </div>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'amount'">
                            <template v-if="record.edit_show || editShow || addMode">
                                <a-input-number
                                    v-model:value="record.amount"
                                    style="width: 120px"
                                    :min="1"
                                    :precision="0"
                                    placeholder="请输入需求数量"
                                />
                                {{ record.unit || '件' }}
                            </template>
                            <template v-else> {{ text }} {{ record.unit || '件' }} </template>
                        </template>
                        <template v-if="column.dataIndex === 'comment'">
                            <template v-if="record.edit_show || editShow || addMode">
                                <a-textarea
                                    v-model:value="record.comment"
                                    style="width: 240px"
                                    placeholder="请输入材料备注"
                                    :auto-size="{ minRows: 1, maxRows: 2 }"
                                    :maxlength="99"
                                />
                            </template>
                            <template v-else>
                                <a-tooltip placement="topLeft" :title="text" destroyTooltipOnHide>
                                    <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                                </a-tooltip>
                            </template>
                        </template>
                        <template v-if="column.dataIndex === 'target_type'">
                            {{ $Util.bomTargetTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'spec'">
                            <template v-if="record.target_type === TARGET_TYPE.ITEM">
                                {{ $Util.itemSpecFilter(record.target.attr_list) }}
                            </template>
                            <template v-else>
                                {{ text || '-' }}
                            </template>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record.target)"
                                ><i class="icon i_detail" /> 详情</a-button
                            >
                            <a-button type="link" @click="handleEditChange(record)">
                                <template v-if="record.edit_show"><i class="icon i_confirm" />确认</template>
                                <template v-else><i class="icon i_edit" />编辑</template>
                            </a-button>
                            <a-button type="link" class="danger" @click="handleRemove('', [record])"
                                ><i class="icon i_delete" />移出</a-button
                            >
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container" v-if="!addMode">
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

const TARGET_TYPE = Core.Const.BOM.TARGET_TYPE;
export default {
    name: 'BomItems',
    components: {
        ItemSelect,
        MaterialSelect,
    },
    props: {
        bomId: {
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
            // 编辑模式
            editShow: false,
            addMode: false,
            addData: [],

            selectedRowKeys: [],
            selectedRowItems: [],

            upload: {
                action: Core.Const.NET.URL_POINT + '/admin/1/bom-item/import',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                },
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '材料名称', dataIndex: ['target', 'name'], key: 'detail' },
                { title: '材料类型', dataIndex: 'target_type' },
                { title: '需求数量', dataIndex: 'amount', key: 'count' },
                { title: '材料分类', dataIndex: ['target', 'category', 'name'], key: 'item' },
                { title: '材料编码', dataIndex: ['target', 'code'], key: 'item' },
                { title: '材料规格', dataIndex: ['target', 'spec'], key: 'spec' },
                { title: '备注', dataIndex: 'comment' },
                { title: '操作', key: 'operation', fixed: 'right' },
            ];
            if (this.addMode || this.editShow) {
                columns.pop();
            }
            return columns;
        },
        // 已经添加到BOM表中的ids
        checkedIds() {
            let checkedIds = {
                items: this.details.items.map(i => i.target_id),
                materials: this.details.materials.map(i => i.target_id),
            };
            console.log('checkedIds:', checkedIds);
            return checkedIds;
        },
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys;
                    this.selectedRowItems = selectedRows;
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
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: item.type ? '/item/item-detail' : '/production/material-detail',
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
            this.editShow = false;
            this.addMode = false;
            Core.Api.BomItem.list({
                bom_id: this.bomId,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    let list = res.list;
                    list.forEach(item => {
                        item.target = item.target_type === TARGET_TYPE.ITEM ? item.item : item.material;
                    });
                    this.total = res.count;
                    this.tableData = res.list;
                    console.log('tableData', this.tableData);
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getAllDetails() {
            // 获取所有已添加材料
            Core.Api.BomItem.listAll({
                bom_id: this.bomId,
            })
                .then(res => {
                    console.log('getAllDetails res', res);
                    let list = res.list;
                    let items = [],
                        materials = [];
                    list.forEach(item => {
                        if (item.target_type === TARGET_TYPE.ITEM) {
                            items.push(item);
                        } else if (item.target_type === TARGET_TYPE.MATERIAL) {
                            materials.push(item);
                        }
                    });
                    this.details.items = items;
                    this.details.materials = materials;
                    console.log('getAllDetails this.details:', this.details);
                })
                .catch(err => {
                    console.log('getAllDetails err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 移出材料
        handleRemove(type, items) {
            let _this = this;
            let name = items[0] ? `[${items[0].target.name}]` : '';
            let title = items.length > 1 ? `${name}等${items.length}件材料` : `材料${name}`;
            let ids = items.map(item => item.id).join(',');
            this.$confirm({
                title: '确定要移出' + title + '吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.BomItem.batchDelete({
                        bom_id: _this.bomId,
                        ids,
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
        handleAddShow(type, ids, items) {
            console.log('handleAddShow items:', items);
            let _items = items.map(item => {
                return {
                    target: item,
                    target_type: type,
                    target_id: item.id,
                    amount: 1,
                    comment: '',
                };
            });
            this.addData = _items;
            console.log('handleAddShow this.addData:', this.addData);
            this.addMode = true;
            this.editShow = false;
        },
        handleAddClose() {
            this.addMode = false;
        },
        handleAddConfirm() {
            console.log('this.addData:', this.addData);
            let items = this.addData.map(item => ({
                bom_id: this.bomId,
                id: item.id,
                amount: item.amount,
                comment: item.comment,
                target_id: item.target_id,
                target_type: item.target_type,
            }));
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (!item.amount) {
                    return this.$message.warning(
                        `请输入${Core.Util.bomTargetTypeFilter(item.target_type)}[${item.target.name}]的需求数量`,
                    );
                }
            }
            console.log('handleAddConfirm items:', items);
            Core.Api.BomItem.batchSave(items)
                .then(() => {
                    this.$message.success('添加成功');
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleAddShow err:', err);
                });
        },
        // 编辑
        handleEditChange(item) {
            // 单个 编辑
            if (!item.edit_show) {
                // 开启编辑模式
                item.edit_show = true;
            } else {
                // 关闭编辑模式
                if (!item.amount) {
                    return this.$message.warning(`请输入${Core.Util.bomTargetTypeFilter(item.target_type)}的需求数量`);
                }
                this.loading = true;
                Core.Api.BomItem.save({
                    bom_id: this.bomId,
                    id: item.id,
                    amount: item.amount,
                    comment: item.comment,
                    target_id: item.target_id,
                    target_type: item.target_type,
                })
                    .then(() => {
                        this.$message.success('更改成功');
                    })
                    .catch(err => {
                        console.log('handleEditChange err:', err);
                    })
                    .finally(() => {
                        this.getTableData();
                    });
            }
        },
        handleMutiEditChange() {
            // 批量 编辑
            if (!this.editShow) {
                // 开启编辑模式
                this.editShow = true;
            } else {
                // 关闭编辑模式
                let items = this.tableData.map(item => ({
                    bom_id: this.bomId,
                    id: item.id,
                    amount: item.amount,
                    comment: item.comment,
                    target_id: item.target_id,
                    target_type: item.target_type,
                }));
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (!item.amount) {
                        return this.$message.warning(
                            `请输入${Core.Util.bomTargetTypeFilter(item.target_type)}[${item.target.name}]的需求数量`,
                        );
                    }
                }
                this.loading = true;
                Core.Api.BomItem.batchSave(items)
                    .then(() => {
                        this.$message.success('更改成功');
                    })
                    .catch(err => {
                        console.log('handleMutiEditChange err:', err);
                    })
                    .finally(() => {
                        this.loading = false;
                        this.getTableData();
                    });
            }
        },
        // 上传文件
        handleFileUpload({ file, fileList }) {
            console.log('handleFileUpload status:', file.status, 'file:', file);
            if (file.status == 'done') {
                let res = file.response;
                if (res && res.code === 0) {
                    return this.$message.success('上传成功');
                } else {
                    return this.$message.error('上传失败:' + res.message);
                }
            }
            this.upload.fileList = fileList;
        },
    },
};
</script>

<style lang="less">
.BomItems {
    .table-container {
        margin-top: -10px;
        .value-price {
            margin-right: 5px;
            width: 60px;
        }
    }
    .panel-btn {
        margin-left: 10px;
    }
}
</style>
