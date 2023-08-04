<template>
    <div id="ItemCategory">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('i.categories') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleModalShow({})"><i class="icon i_add" />{{ $t('i.add_category')
                    }}</a-button>
                </div>
            </div>
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.parent_id" @change='handleTabSearch'>
                    <a-tab-pane :key="item.id" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">{{ $i18n.locale === 'zh' ? item.name : item.name_en }}</div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :loading="loading"
                    :row-key="record => record.id" :pagination='false' v-model:expandedRowKeys='expandedRowKeys'
                    @expand='handleExpandedChange'>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title='text'>
                                <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="handleSalesAreaByIdsShow(record.id)"><i class="icon i_edit" /> {{
                                $t('ar.set_sales') }} </a-button>
                            <a-button type='link' @click="routerChange('explored', record)"><i class="icon i_edit" />{{
                                $t('i.edit_bom') }}
                            </a-button>
                            <a-button type='link' @click="handleModalShow(record, record)"><i class="icon i_edit" />{{
                                $t('i.edit_name') }}
                            </a-button>
                            <!-- <a-button type='link' @click="routerChange('config', record)"><i class="icon i_hint"/> {{ $t('i.product_configuration') }}
                            </a-button> -->
                            <a-button type='link' v-if="!record.flag" @click="handleModalShow({ parent_id: record.id }, null, record)"><i
                                    class="icon i_add" /> {{ $t('i.subcategory') }}
                            </a-button>
                            <a-button type='link' class="danger" @click="handleDelete(record)"><i class="icon i_delete" />
                                {{ $t('def.delete') }}</a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
        <template class="modal-container">
            <a-modal v-model:visible="modalVisible" :title="editForm.id ? $t('i.edit_a') : $t('i.add_category')"
                @ok="handleModalSubmit">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('m.category_name') }}</div>
                        <div class="value">
                            <a-input v-model:value="editForm.name" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">{{ $t('n.name_en') }}</div>
                        <div class="value">
                            <a-input v-model:value="editForm.name_en" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </div>
            </a-modal>
            <a-modal v-model:visible="salesAreaVisible" :title="$t('ar.set_sale')" class="field-select-modal" :width="630"
                :after-close='handleSalesAreaByIdsClose'>
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('d.sales_area') }}</div>
                        <div class="value">
                            <a-select v-model:value="salesAreaIds" mode="multiple" :placeholder="$t('def.select')">
                                <a-select-option v-for="(val, key) in salesList" :key="key" :value="val.id">{{ val.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button type="primary" @click="handleSalesAreaByIdsConfirm">{{ $t('def.sure') }}</a-button>
                    <a-button @click="handleSalesAreaByIdsClose">{{ $t('def.cancel') }}</a-button>
                </template>
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

            tableData: [],

            expandedRowKeys: [],

            editNode: null,
            parentNode: null,
            modalVisible: false,
            editForm: {
                id: '',
                parent_id: '',
                name: '',
                name_en: '',
                index: '',
                index_key: '',
            },
            salesAreaVisible: false,
            salesList: [],
            salesAreaIds: [],
            statusList: [],
            searchForm: {
                parent_id: 1
            },
            currentTableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('m.category_name'), dataIndex: 'name' },
                { title: this.$t('n.name_en'), dataIndex: 'name_en' },
                { title: this.$t('i.commodity_quantity'), dataIndex: 'item_quantity', key: 'item' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right', width: 100, },
            ]
            return columns
        },
    },
    mounted() {
        this.getDataByParent(this.searchForm.parent_id);
        this.getStatusList();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'config':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-category-config",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'explored':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-category-explored",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        handleSearch() {  // 搜索
            this.expandedRowKeys = []
            this.getDataByParent(this.searchForm.parent_id);
        },
        handleTabSearch() {
            this.expandedRowKeys = []
            console.log('this.searchForm.parent_id', this.searchForm.parent_id);
            this.getDataByParent(this.searchForm.parent_id)
        },
        // 获取tab标签切换列表
        getStatusList() {
            Core.Api.Item.ItemCategory().then(res => {
                console.log('getStatusList res', res);
                this.statusList = res.list.list
            }).catch(err => {
                console.log('getStatusList err', err);
            })
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
                if (parentNode) {
                    console.log('parentNode', parentNode);
                    parentNode.children = res.list
                    parentNode.children.forEach(item => {
                        item.flag = true
                        console.log('item', item.flag);
                    })
                } else {
                    this.tableData = res.list;
                    this.calculateItemQuantity(this.tableData);
                    this.currentTableData = res.list
                    this.calculateItemQuantity(this.currentTableData);
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
                    this.calculateItemQuantity(this.tableData);
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
        // 节点展开与关闭
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

        // 编辑与新增子类
        handleModalShow({ parent_id = 0, id, name, name_en, index, index_key }, node = null, parent = null) {
            this.editForm = {
                id: id,
                name: name,
                name_en: name_en,
                parent_id: parent_id ? parent_id : this.searchForm.parent_id,
                index: index,
                index_key: index_key,
            };

            let foundObj = null;
            if (parent?.parent_id) {
                foundObj = this.statusList.find(obj => obj.id === parent.parent_id);
            } else {
                foundObj = this.statusList.find(obj => obj.id === this.searchForm.parent_id);
            }

            if (foundObj) {
                this.editForm.type = foundObj.type;
            }
            console.log('parent', parent);
            console.log('this.editForm:', this.editForm);
            this.parentNode = parent;
            this.editNode = node;
            this.modalVisible = true;
        },
        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.editForm)
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.name_en) {
                return this.$message.warning(this.$t('def.enter'))
            }
            form.key = form.index_key
            this.loading = true
            let apiName = form.id ? 'update' : 'save';
            Core.Api.ItemCategory[apiName](form).then(res => {
                this.$message.success(this.$t('pop_up.save_success'))
                if (form.parent_id == 0) {
                    this.getDataById()
                } else if (form.id) {
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

        // 删除分类
        handleDelete(record) {
            this.loading = false;
            let _this = this
            this.$confirm({
                title: _this.$t('pop_up.sure') + _this.$t('pop_up.delete') + ` [${record.name}] ？`,
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.ItemCategory.delete({
                        id: record.id,
                    }).then(res => {
                        console.log("handleDelete res", res)
                        _this.$message.success(_this.$t('pop_up.delete_success'))
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
        handleSalesAreaByIdsShow(id) {
            this.categoryId = id
            this.getSalesAreaList();
            this.salesAreaVisible = true;
        },
        handleSalesAreaByIdsClose() {
            this.salesAreaVisible = false;
            this.salesList = [];
            this.salesAreaIds = [];
            this.categoryId = '';
        },
        handleSalesAreaByIdsConfirm() {
            if (this.salesAreaIds.length <= 0) {
                return this.$message.error(this.$t('n.choose') + this.$t('d.sales_area'));
            }
            Core.Api.Item.saveSalesAreaByCategory({
                category_id: this.categoryId,
                sales_area_id_list: this.salesAreaIds,
            }).then(res => {
                this.handleSalesAreaByIdsClose();
            })

        },
        getSalesAreaList() {
            Core.Api.SalesArea.list({ page: 0 }).then(res => {
                this.salesList = res.list;
            });
        },
        // 根据子分类数量计算二级分类数量
        calculateItemQuantity(data) {
            data.forEach((item) => {
                if (item.children && item.children.length > 0) {
                    let childrenItemQuantitySum = 0;
                    item.children.forEach((child) => {
                        childrenItemQuantitySum += child.item_quantity;
                    });
                    item.item_quantity += childrenItemQuantitySum;
                }
            });
        },
    }
};
</script>

<style lang="less" scoped>
// #ItemCategory {}
</style>
