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
                        <template v-if="column.key === 'operation'">
                            <a-button type='link' @click="handleModalShow(record)"><i class="icon i_edit" />{{
                                $t('i.edit_name') }}
                            </a-button>
                            <a-button type='link' v-if="record.level != 1" @click="handleModalShow({ parent_id: record.id }, null, record)"><i
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
                            <a-select
                                v-model:value="salesAreaIds"
                                :show-search="true"
                                :placeholder="$t('def.select')"                                                                
                                :filter-option="false"                                
                                mode="multiple" 
                                @search="onSearch"                                
                            >                          
                                <a-select-option v-for="(val, key) in salesList" :key="key" :value="val.id">
                                    {{ val.name}}
                                </a-select-option>
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
            salesList: [],
            salesAreaIds: [],
            statusList: [
                {
                    id:1,
                    name: '车辆',
                    name_en: 'Car',
                }
            ],
            searchForm: {
                parent_id: 1,
                type:20
            },            
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('m.category_name'), dataIndex: 'name' },
                { title: this.$t('n.name_en'), dataIndex: 'name_en' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right', width: 100, },
            ]
            return columns
        },
    },
    mounted() {
        this.getDataByParent(this.searchForm.parent_id);
    },
    methods: {
        // 处理数据
        handleData(data,level = 0) {
            // 设置数据的层级
            data.forEach(item => {
                item.level = level
                if (item.children.length > 0) {
                    this.handleData(item.children,level + 1)
                }else{
                    item.children = null
                }
            })
            return data

        },
        getDataByParent(parent_id = 0) {  // 通过父节点获取子级数据
            this.loading = true;
            Core.Api.ItemCategory.tree({
                page: 0,
                parent_id: parent_id,
                depth: 2,
                type : this.searchForm.type,
            }).then(res => {
                this.tableData = this.handleData(res.list);
                console.log('getDataByParent res', res.list)
            }).catch(err => {
                console.log('getDataByParent err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 通过本节点获取本级数据  不知用处是什么
        getDataById(id = 0) {
            Core.Api.ItemCategory.tree({
                page: 0,
                id: id,
                type : this.searchForm.type,
            }).then(res => {
                console.log('通过本节点获取本级数据', res.list)
            }).catch(err => {
                console.log('通过本节点获取本级数据 err', err)
            })
        },
        // 节点展开与关闭
        handleExpandedChange(expanded, record) {            
            console.log('handleExpandedChange expanded:', expanded, 'record', record)
            if (expanded) {
                this.expandedRowKeys.push(record.id)
            } else {
                let index = this.expandedRowKeys.indexOf(record.id)
                this.expandedRowKeys.splice(index, 1)                
            }
        },
        // 编辑与新增子类
        handleModalShow({ parent_id = 0, id, name, name_en }, node = null, parent = null) {
            this.editForm = {
                id: id,
                name: name,
                name_en: name_en,
                parent_id: parent_id ? parent_id : this.searchForm.parent_id,
                type : this.searchForm.type,
            };
            this.parentNode= parent;
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
                this.getDataByParent(this.searchForm.parent_id)
                this.$message.success(this.$t('pop_up.save_success'))
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
                        _this.getDataByParent(_this.searchForm.parent_id)
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
