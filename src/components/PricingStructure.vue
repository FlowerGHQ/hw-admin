<template>
<div class="PricingStructure gray-panel no-margin">
    <div class="panel-title">
        <div class="title">商品价格管理</div>
    </div>
    <div class="panel-content">
        <div class="table-container">
            <template v-if="!addMode">
                <ItemSelect :disabled-checked='tableData.map(i => i.item_id)' @select="handleAddItemShow" btn-class="panel-btn">
                    <i class="icon i_add"/> 添加商品
                </ItemSelect>
                <a-button class="panel-btn" @click="handleMutiEditChange()" type="primary" ghost>
                    <template v-if='editShow'><i class="icon i_confirm"/>确认设置</template>
                    <template v-else>批量设置供货价</template>
                </a-button>
                <a-button class="panel-btn" @click="getTableData" v-if="editShow"><i class="icon i_close_c"/>取消设置</a-button>
            </template>
            <template v-else>
                <a-button class="panel-btn" @click="handleAddItemConfirm()" type="primary" ghost><i class="icon i_confirm"/>确认添加</a-button>
                <a-button class="panel-btn" @click="handleAddItemClose()"><i class="icon i_close_c"/>取消添加</a-button>
            </template>
            <a-table :columns="tableColumns" :data-source="addMode ? addData : tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false' :loading='loading'>
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'detail'">
                        <div class="table-img">
                            <a-image :width="30" :height="30" :src="$Util.imageFilter(record.logo)" fallback='无'/>
                            <a-tooltip placement="top" :title='text'>
                                <div class="info">
                                    <a-button type="link" @click="routerChange('detail', record)">
                                        <div class="ell" style="max-width: 150px">{{ text || '-' }}</div>
                                    </a-button>
                                </div>
                            </a-tooltip>
                        </div>
                    </template>
                    <template v-if="column.key === 'money'">
                        ￥{{ $Util.countFilter(text) }}
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'spec'">
                        {{ $Util.itemSpecFilter(text) }}
                    </template>
                    <template v-if="column.key === 'supply'">
                        <template v-if="record.edit_show || editShow || addMode">
                            <a-input-number v-model:value="record.edit_price" style="width: 120px;" :min="0.01" :max='record.price/100' :precision="2"
                                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/￥\s?|(,*)/g, '')"/>
                        </template>
                        <template v-else>￥{{ $Util.countFilter(text) }}</template>
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type='link' @click="handleEditChange(record)" v-if="!editShow">
                            <template v-if="record.edit_show"><i class="icon i_confirm"/>确认设置</template>
                            <template v-else><i class="icon i_edit"/>设置价格</template>
                        </a-button>
                        <a-button type='link' class="danger" @click="handleDelete(record.id)"><i class="icon i_delete"/>移出</a-button>
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
import Core from '../core';
const USER_TYPE = Core.Const.USER.TYPE
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';

export default {
    name: 'PricingStructure',
    components: { ItemSelect },
    props: {
        orgId: {
            type: Number,
        },
        orgType: {
            type: Number,
        },
        title: {
            type: Number,
        },
    },
    data() {
        return {
            USER_TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格数据
            tableData: [],
            editShow: false,

            addMode: false,
            addData: []
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '商品名称', dataIndex: 'name', key: 'detail'},
                { title: '商品规格', dataIndex: 'attr_list', key: 'spec' },
                { title: '商品型号', dataIndex: 'model', key: 'item' },
                { title: '商品编码', dataIndex: 'code',  key: 'item' },
                { title: '供货价',  dataIndex: 'purchase_price', key: 'supply', },
                { title: '采购价', dataIndex: 'parent_price', key: 'money', },
                { title: '标准售价', dataIndex: 'price', key: 'money', },
                { title: '操作', key: 'operation', fixed: 'right'},
            ]
            if (this.addMode) {
                columns.pop()
            }
            return columns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'detail':    // 详情
                    routeUrl = this.$router.resolve({
                        path: this.$auth('ADMIN') ? "/item/item-detail" : '/purchase/item-display',
                        query: {id: item.item_id}
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
            this.editShow = false
            this.addMode = false
            Core.Api.ItemPrice.list({
                org_id: this.orgId,
                org_type: this.orgType,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res", res)
                this.total = res.count;
                res.list.forEach(item => {
                    item.edit_price = Core.Util.countFilter(item.purchase_price)
                    item.edit_show = false
                });
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 移出商品
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要移出该商品吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.ItemPrice.delete({id}).then(() => {
                        _this.$message.success('移出成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete -> err", err);
                    })
                },
            });
        },
        // 添加商品
        handleAddItemShow(ids, items) {
            console.log('handleAddItemShow items:', items)
            items.forEach(item => {
                item.edit_price = Core.Util.countFilter(item.price)
                item.parent_price = item.purchase_price || item.original_price
            })
            this.addData = items
            this.addMode = true
            this.editShow = false
        },
        handleAddItemClose() {
            this.addMode = false
        },
        handleAddItemConfirm() {
            let items = this.addData.map(item => ({
                category_id: item.category_id,
                code: item.code,
                id: 0,
                item_id: item.id,
                name: item.name,
                price: item.price,
                purchase_price: Math.round(item.edit_price * 100),

                org_id: this.orgId,
                org_type: this.orgType,
                parent_id: item.item_price_id || 0
            }))
            console.log('handleAddItemConfirm items:', items)
            Core.Api.ItemPrice.batchSave(items).then(() => {
                this.$message.success('添加成功')
                this.getTableData()
            }).catch(err => {
                console.log('handleAddItemShow err:', err)
            })
        },
        // 价格编辑
        handleEditChange(item) { // 单个 价格编辑
            if (!item.edit_show) {
                // 开启编辑模式
                item.edit_show = true
            } else {
                // 关闭编辑模式
                this.loading = true
                Core.Api.ItemPrice.save({
                    id: item.id,
                    item_id: item.item_id,
                    purchase_price: Math.round(item.edit_price * 100),
                }).then(() => {
                    this.$message.success('更改成功')
                }).catch(err => {
                    console.log('handleEditChange err:', err)
                }).finally(() => {
                    this.getTableData()
                })
            }
        },
        handleMutiEditChange() { // 批量 价格编辑
            if (!this.editShow) {
                // 开启编辑模式
                this.editShow = true
            } else {
                // 关闭编辑模式
                this.loading = true
                let items = this.tableData.map(item => ({
                    id: item.id,
                    item_id: item.item_id,
                    purchase_price: Math.round(item.edit_price * 100),
                }))
                Core.Api.ItemPrice.batchSave(items).then(() => {
                    this.$message.success('更改成功')
                }).catch(err => {
                    console.log('handleMutiEditChange err:', err)
                }).finally(() => {
                    this.getTableData()
                })
            }
        }
    }
};
</script>

<style lang="less" scoped>
.PricingStructure {
    .table-container {
        margin-top: -10px;
    }
}
</style>