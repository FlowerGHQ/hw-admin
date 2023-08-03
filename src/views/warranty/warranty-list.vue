<template>
    <div id="WarrantyList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t(/*三包管理*/'wt.warranty_management') }}</div>
            </div>
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.status" @change='handleTabSearch()'>
                    <a-tab-pane :key="item.value" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">{{ $i18n.locale === 'zh' ? item.name : item.name_en }}</div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <!-- 商品分类 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="searchForm.status === 1">
                        <div class="key">{{ $t('i.categories') }}:</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.categories"
                                @keydown.enter='handleSearch' />
                        </div>
                    </a-col>
                    <!-- 选择类型 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="searchForm.status === 3">
                        <div class="key">{{ $t('wt.select_type') }}:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" @change='handleSearch'
                                :placeholder="$t('def.select')">
                                <a-select-option v-for="item of selectTypeList" :key="item.key" :value="item.value">{{
                                    item[$i18n.locale] }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 商品名称 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item"
                        v-if="searchForm.status !== 1 && searchForm.type !== 1">
                        <div class="key">{{ $t('r.item_name') }}:</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.categories"
                                @keydown.enter='handleSearch' />
                        </div>
                    </a-col>
                    <!-- 商品分类 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="searchForm.status !== 1">
                        <div class="key">{{ $t('i.categories') }}:</div>
                        <div class="value">
                            <CategoryTreeSelect @change="handleCategorySelect" :category-id='searchForm.category_id' />
                        </div>
                    </a-col>
                    <!-- 商品编码 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item"
                        v-if="searchForm.status !== 1 && searchForm.type !== 1">
                        <div class="key">{{ $t('i.code') }}:</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.item_code"
                                @keydown.enter='handleSearch' />
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="table-container" v-if="searchForm.status === 1">
                <a-table :columns="categoryTableColumns" :data-source="categoryTableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'warranty_period'">
                            <template v-if="record.type !== 2">
                                <a-input-number style="width: 60px; margin-right: 4px;" :min="0" :precision="0"
                                    v-model:value="record.month" :placeholder="$t(/*请输入*/'def.input')" />
                                {{ $t(/*个月*/'wt.month') }}
                            </template>
                            <template v-if="record.type !== 1">
                                ,{{ $t(/*或*/'wt.or') }}
                                <a-input-number style="width: 60px; margin-right: 4px;" :min="0" :precision="0"
                                    v-model:value="record.km" :placeholder="$t(/*请输入*/'def.input')" />
                                {{ $t(/*公里*/'r.km') }}
                            </template>
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="table-container" v-if="searchForm.status === 2">
                <a-table :columns="itemTableColumns" :data-source="itemTableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <a-button type="link" @click="routerChange('detail', record)">
                                {{ record.item ? record.item.name || '-' : '-' }}
                            </a-button>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag"
                                :class="$Util.warrantyStatusFilter(record.status, 'color')">
                                {{ $Util.warrantyStatusFilter(record.status, $i18n.locale) }}
                            </div>
                        </template>
                        <template v-if="column.key === 'warranty_period'">
                            <template v-if="record.target_type === 1">
                                <div class="flex-wrap">
                                    <span>{{ record.month }}</span>{{ $t(/*个月*/'wt.month') }}{{ $t(/*或*/'wt.or') }}<span>{{
                                        record.km
                                    }}</span>{{ $t(/*公里*/'r.km') }}<i class="icon i_edit" @click="handleEditWarrantyPeriod"
                                        style="cursor: pointer; margin-left: 4px;" />
                                    <div class="tag">
                                        {{ $t(/*按商品分类*/'wt.classification_commodity') }}
                                    </div>
                                </div>
                            </template>
                            <template v-if="record.target_type === 2">
                                <div class="flex-wrap">
                                    <span>{{ record.month }}</span>{{ $t(/*个月*/'wt.month') }}{{ $t(/*或*/'wt.or') }}<span>{{
                                        record.km
                                    }}</span>{{ $t(/*公里*/'r.km') }}<i class="icon i_edit" @click="handleEditWarrantyPeriod"
                                        style="cursor: pointer; margin-left: 4px;" />
                                    <div class="tag">
                                        {{ $t(/*自定义*/'crm_set.unpreset') }}
                                    </div>
                                </div>
                            </template>
                            <template v-if="record.target_type === 0">
                                <a-input-number style="width: 60px; margin-right: 4px;" :min="0" :precision="0"
                                    v-model:value="record.month" :placeholder="$t(/*请输入*/'def.input')" />
                                {{ $t(/*个月*/'wt.month') }}
                                ,{{ $t(/*或*/'wt.or') }}
                                <a-input-number style="width: 60px; margin-right: 4px;" :min="0" :precision="0"
                                    v-model:value="record.km" :placeholder="$t(/*请输入*/'def.input')" />
                                {{ $t(/*公里*/'r.km') }}
                            </template>
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="table-container" v-if="searchForm.status === 3">
                <a-table :columns="trackTableColumns" :data-source="trackTableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
        <template class="modal-container">
            <a-modal v-model:visible="modalVisible" :title="$t(/*设置期限*/'wt.set_deadline')" @ok="handleModalSubmit">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t(/*三包期限*/'wt.warranty_period') }}:</div>
                        <div class="value">
                            <a-input-number style="width: 80px; margin-right: 4px;" :min="0" :precision="0"
                                v-model:value="editForm.month" :placeholder="$t(/*请输入*/'def.input')" />
                            {{ $t(/*个月*/'wt.month') }}{{ $t(/*或*/'wt.or') }}
                            <a-input-number style="width: 80px; margin-right: 4px;" :min="0" :precision="0"
                                v-model:value="editForm.km" :placeholder="$t(/*请输入*/'def.input')" />
                            {{ $t(/*公里*/'r.km') }}
                        </div>
                    </div>
                </div>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue';
const ITEM = Core.Const.ITEM

export default {
    name: 'ItemCategory',
    components: {
        CategoryTreeSelect
    },
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
                month: undefined,
                km: undefined,
            },
            salesAreaVisible: false,
            salesList: [],
            salesAreaIds: [],
            statusList: [
                { name: '商品分类', name_en: 'Commodity Classification', key: 1, value: 1 },
                { name: '商品列表', name_en: 'Commodity List', key: 2, value: 2 },
                { name: '变更记录', name_en: 'Change Log', key: 3, value: 3 },
            ],
            searchForm: {
                status: 1,
                categories: undefined,
                category_id: undefined,
                item_code: undefined,
                type: 1,
            },
            selectTypeList: [
                {
                    key: 1,
                    zh: '按商品分类',
                    en: 'Classification by commodity',
                    value: 1
                },
                {
                    key: 2,
                    zh: '按商品列表',
                    en: 'By product list',
                    value: 2
                },
            ],
            categoryTableData: [],
            trackTableData: [],
            itemTableData: [],
        };
    },
    watch: {},
    computed: {
        categoryTableColumns() {
            let columns = [
                { title: this.$t('i.categories'), dataIndex: 'categories', key: 'item' },
                { title: this.$t('wt.warranty_period'), dataIndex: 'warranty_period', key: 'warranty_period' },
            ]
            return columns
        },
        itemTableColumns() {
            let columns = [
                { title: this.$t('r.item_name'), dataIndex: 'item_name', key: 'detail' },
                { title: this.$t('i.categories'), dataIndex: 'categories', key: 'item' },
                { title: this.$t('i.code'), dataIndex: 'code', key: 'item' },
                { title: this.$t('i.commercial_specification'), dataIndex: 'commercial_specification', key: 'item' },
                { title: this.$t('i.status'), dataIndex: 'status' },
                { title: this.$t('wt.warranty_period'), dataIndex: 'warranty_period', key: 'warranty_period' },
            ]
            return columns
        },
        trackTableColumns() {
            let columns = [
                { title: this.$t('wt.product_type'), dataIndex: 'product_type', key: 'item' },
                { title: this.$t('wt.before_change'), dataIndex: 'before_change', key: 'item' },
                { title: this.$t('wt.after_change'), dataIndex: 'after_change', key: 'item' },
                { title: this.$t('wt.change_time'), dataIndex: 'change_time', key: 'time' },
            ]
            if (this.searchForm.type === 2) {
                columns.splice(1, 0,
                    { title: this.$t('i.categories'), dataIndex: 'categories', key: 'item' },
                    { title: this.$t('i.code'), dataIndex: 'code', key: 'item' }
                )
            }
            return columns
        }
    },
    mounted() {
        this.getDataByParent();
        this.getCategoryTableData();
        this.getItemTableData();
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
                case 'detail':  // 整车详情
                    routeUrl = this.$router.resolve({
                        path: "/entity/entity-detail",
                        query: { id: item.default_item_id || item.id, set_id: item.set_id }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        handleEditWarrantyPeriod() {
            this.modalVisible = true
        },
        handleSearch() {  // 搜索
            console.log(111);
            this.expandedRowKeys = []
            this.getDataById();
        },
        handleTabSearch() {
            this.expandedRowKeys = []
            this.getDataByParent(this.searchForm.status)
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
                    this.calculateItemQuantity(this.tableData);
                } else if (parentNode) {
                    console.log('parentNode', parentNode);
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
                parent_id: parent_id,
                index: index,
                index_key: index_key,
            }
            console.log('this.editForm:', this.editForm)
            this.parentNode = parent
            this.editNode = node
            this.modalVisible = true
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
        getCategoryTableData() {
            let res = [
                {
                    categories: '车辆',
                    type: 3,
                    month: 0,
                    km: 0,
                    children: [
                        {
                            categories: 'SK3',
                            type: 3,
                            month: 0,
                            km: 0,
                        },
                        {
                            categories: 'SK1',
                            type: 3,
                            month: 0,
                            km: 0,
                        },
                        {
                            categories: 'EK3',
                            type: 3,
                            month: 0,
                            km: 0,
                        },
                    ]
                },
                {
                    categories: '零配件',
                    type: 3,
                    month: 0,
                    km: 0,
                    children: [
                        {
                            categories: '电机组',
                            type: 3,
                            month: 0,
                            km: 0,
                        },
                        {
                            categories: '方向组',
                            type: 1,
                            month: 0,
                            km: 0,
                        },
                        {
                            categories: '制动组',
                            type: 1,
                            month: 0,
                            km: 0,
                        },
                    ]
                },
            ]
            this.categoryTableData = res
        },
        getItemTableData() {
            let res = [
                {
                    item_name: 'SK1',
                    categories: 'SK1/电机组',
                    code: 'TLA3-B8-0000',
                    commercial_specification: '颜色：银蓝 ，时速：45',
                    status: 0,
                    target_type: 0,
                    month: 0,
                    km: 0,
                },
                {
                    item_name: 'SK3',
                    categories: '电机组',
                    code: 'TLA3-B8-0000',
                    commercial_specification: '颜色：银蓝 ，时速：45',
                    status: 1,
                    target_type: 1,
                    month: 12,
                    km: 1000,
                },
                {
                    item_name: 'EK3',
                    categories: '电池组',
                    code: 'TLA3-B8-0000',
                    commercial_specification: '颜色：银蓝 ，时速：45',
                    status: 1,
                    target_type: 2,
                    month: 12,
                    km: 1000,
                },
            ]
            this.itemTableData = res
        },
    }
};
</script>

<style lang="less" scoped>
// #WarrantyList {}
.flex-wrap {
    display: flex;
    align-items: center;

    .tag {
        max-width: 100px;
        padding: 0 10px;
        height: 24px;
        line-height: 22px;
        text-align: center;
        font-size: 12px;
        color: #00cc33;
        background-color: #d9f7e1;
        border-radius: 12px;
        margin-left: 4px;
    }
}

.modal-container {
    .modal-content {
        .form-item {
            .value {
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>
