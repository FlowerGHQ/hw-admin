<template>
    <div id="StockList" class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('wa.overview') }}</div>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">{{ $t('wa.related') }}:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.warehouse_id" :placeholder="$t('wa.choose_warehouse')" @change="handleSearch">
                            <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">{{
                                    item.name
                                }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">{{ $t('wa.product_type') }}:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.target_type" :placeholder="$t('wa.choose_product_type')" @change="handleSearch">
                            <a-select-option v-for="(val, key) of targetTypeMap" :key="key" :value="Number(key)">{{
                                    val[$i18n.locale]
                                }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">{{ $t('wa.product_type') }}:</div>
                    <div class="value">
                        <a-select
                            v-model:value="searchForm.target_id"
                            show-search
                            placeholder="请输入仓库"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @search="handleItemSearch"
                            @change="handleItemChange"
                        >
                            <a-select-option v-for=" item in itemOptions" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
            </a-row>
            <div class="btn-area">
                <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
            </div>
        </div>
        <div class="table-container">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                     :row-key="record => record.id" :pagination='false'>
                <template #bodyCell="{ column, text , record }">
                    <template v-if="column.key === 'detail'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.dataIndex === 'target_type'">
                        {{ targetTypeMap[text][$i18n.locale] || $t('wa.unknown') }}
                    </template>
                    <template v-if="column.key === 'count'">
                        {{ text || 0 }}
                    </template>
                    <template v-if="column.key === 'warehouse'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('warehouse', record)">{{ text || '-' }}
                            </a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="record.target_type === 1 && record.item">
                        <template v-if="column.type === 'name'">
                            <a-tooltip placement="top" :title='record.item.name'>
                                <a-button type="link" @click="routerChange('item', record.item)">
                                    {{ record.item.name || '-' }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.type === 'target'">
                            {{ record.item[column.key] }}
                        </template>
                        <template v-if="column.type === 'category'">
                            {{ record.item.category ? record.item.category.name || '-' : '-' }}
                        </template>
                        <template v-if="column.type === 'spec'">
                            {{ $Util.itemSpecFilter(record.item.attr_list) }}
                        </template>
                    </template>
                    <template v-if="record.target_type === 2 && record.material">
                        <template v-if="column.type === 'name'">
                            <a-tooltip placement="top" :title='record.material.name'>
                                <a-button type="link" @click="routerChange('material', record)">
                                    {{ record.material.name || '-' }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.type === 'target'">
                            {{ record.material[column.key] || '-' }}
                        </template>
                        <template v-if="column.type === 'category'">
                            {{ record.material.category ? record.material.category.name || '-' : '-' }}
                        </template>
                        <template v-if="column.type === 'spec'">
                            <a-tooltip placement="top" :title='record.material.spec'>
                                <div class="ell" style="max-width: 100px">
                                    {{ record.material.spec || '-' }}
                                </div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.type === 'warehouse_location_list'">
                            <p v-for="warehouse_location in record.warehouse_location_list">
                                {{warehouse_location.warehouseLocationUid}},
                            </p>
                        </template>
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type='link' v-if="record.target_type === 1" @click="routerChange('item', record.item)"><i class="icon i_detail"/>{{$t('def.detail')}}</a-button>
                        <a-button type='link' v-else @click="routerChange('material', record.material)"><i class="icon i_detail"/>{{$t('def.detail')}}</a-button>
                    </template>
                </template>
            </a-table>
        </div>
        <div class="paging-container">
            <a-pagination
                v-model:current="currPage"
                :page-size='pageSize'
                :total="total"
                show-quick-jumper
                show-size-changer
                show-less-items
                :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                :hide-on-single-page='false'
                :pageSizeOptions="['10', '20', '30', '40']"
                @change="pageChange"
                @showSizeChange="pageSizeChange"
            />
        </div>
    </div>

</template>

<script>
import Core from '../../core'

export default {
    components: {},
    props: {},
    data() {
        return {
            loading: false,
            itemOptions: [],
            currPage: 1,
            pageSize: 20,
            total: 0,

            warehouseList: [],
            targetTypeMap: {
              1: {zh: '商品', en: 'Commodity', value: '0', color: 'primary',  key: '0'},
              2: {zh: '物料', en: 'Material', value: '0', color: 'primary',  key: '0'},
                // 1: '商品',
                // 2: '物料',
            },
            searchForm: {
                target_id: '',
                target_type: undefined,
                warehouse_id: undefined,
            },
            tableData: [],
        }
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: this.$t('n.type'), dataIndex: 'target_type'},
                {title: this.$t('n.name'), type: 'name'},
                {title: this.$t('wa.codes'), type: 'target', key: 'code'},
                {title: this.$t('wa.related'), dataIndex: ['warehouse', 'name'], key: 'warehouse'},
                {title: this.$t('wa.quantity'), dataIndex: 'stock', key: 'count'},
                {title: this.$t('wa.uid'), type: 'warehouse_location_list'},

                {title: this.$t('wa.spec'), type: 'spec'},
                {title: this.$t('def.operate'), key: 'operation', fixed: 'right'},
            ]
            return columns
        },
    },
    mounted() {
        this.getTableData()
        this.getWarehouseList()
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'warehouse':
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/warehouse-detail",
                        query: {id: item.warehouse_id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'material':
                    routeUrl = this.$router.resolve({
                        path: "/production/material-detail",
                        query: {id: item.material.id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
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
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.pageChange(1);
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list
            })
        },
        getTableData() {
            Core.Api.Stock.list({
                ...this.searchForm,
                page: this.currPage,
                pageSize: this.pageSize,
            }).then(res => {
                console.log('getTableData res', res)
                this.tableData = res.list
                this.total = res.count
            }).catch(err => {
                console.log('getTableData err', err)
            })
        },
        handleItemSearch(code) {
            Core.Api.Item.list({code: code,flag_spread: 1}).then(res => {
                this.itemOptions = res.list
            })
        },
        handleItemChange(){
            this.searchForm.target_type = undefined
        }

    },
}
</script>

<style lang='less'>
#StockList {
    .ant-btn.ant-btn-primary {
        margin-left: 15px;
    }
}
</style>
