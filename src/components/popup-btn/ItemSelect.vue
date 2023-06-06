<template>
    <a-button class="ItemSelectBtn" @click.stop="handleModalShow" :ghost='ghost' :type="btnType" :class="btnClass" :disabled="disabled!== ''">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal :title="btnText" v-model:visible="modalShow" :after-close='handleModalClose' width='860px'
        class="ItemSelectModal">
        <div class="modal-content">
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :md='12' class="search-item" v-if="!purchaseId">
                        <div class="key"><span>{{ $t('n.name') }}:</span></div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :md='12' class="search-item" v-if="!purchaseId">
                        <div class="key"><span>{{ $t('i.categories') }}:</span></div>
                        <div class="value">
                            <CategoryTreeSelect @change="handleCategorySelect" :category_id='searchForm.category_id' />
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :md='12' class="search-item">
                        <div class="key"><span>{{ $t('i.code') }}:</span></div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.code" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="table-container">
                <ItemTable 
                    v-if="modalShow" 
                    :columns="tableColumns" 
                    :data-source="tableData" 
                    :loading='loading'  
                    :showStock='!!warehouseId'
                    :check-mode='true' 
                    :disabled-checked='disabledChecked'
                    :radio-mode='radioMode'
                    @submit="handleSelectItem" 
                />
            </div>
        </div>
        <template #footer>
            <div class="modal-footer">
                <div class="paging-area">
                    <a-pagination v-if="!purchaseId"
                        show-less-items
                        :hide-on-single-page='false'
                        :total="total"
                        :current="currPage"
                        :default-page-size='pageSize'
                        @change="pageChange"
                    />
                    <div class="tip">
                        {{ $t('in.selected') + ` ${this.selectItemIds.length} ` + $t('in.total')}}
                    </div>
                </div>
                <div class="btn-area">
                    <a-button @click="handleModalClose">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleConfirm" type="primary">{{ $t('def.sure') }}</a-button>
                </div>
            </div>
        </template>
    </a-modal>
</template>

<script>
import Core from '@/core';

import ItemTable from '@/components/table/ItemTable.vue'
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue'

export default {
    components: {
        ItemTable,
        CategoryTreeSelect,
    },
    emits: ['select', 'option'],
    props: {
        btnText: {
            type: String,
            default: '添加商品'
        },
        btnType: {
            type: String,
            default: 'primary'
        },
        btnClass: {
            type: String,
        },
        ghost: {
            type: Boolean,
            default: false,
        },

        radioMode: { // 是否只能选一个商品
            type: Boolean,
            default: false,
        },
        disabledChecked: {
            type: Array,
            default: () => {
                return []
            }
        },

        faultName: {
            type: String,
            default: 'false'
        },
        warehouseId: {
            type: Number,
            default: 0
        },
        purchaseId: {
            type: Number,
            default: 0
        },
        disabled:{
            type:String,
            default:''
        }
    },
    data() {
        return {
            loading: false,
            modalShow: false,

            currPage: 1,
            pageSize: 10,
            total: 0,
            searchForm: {
                code: '',
                name: '',
                category_id: '',
            },

            tableData: [],

            selectItems: [],
            selectItemIds: [],
        }
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                {title: this.$t('n.name'), dataIndex: 'name', key: 'detail'},
                {title: this.$t('i.categories'), dataIndex: 'category_list', key: 'category_list' },
                {title: this.$t('i.number'), dataIndex: 'model', key: 'item'},
                {title: this.$t('i.code'), dataIndex: 'code', key: 'item'},
                {title: this.$t('i.spec'), dataIndex: 'attr_list', key: 'spec'},
            ]
            if (this.warehouseId !== 0) {
                tableColumns.splice(3, 0, {title: this.$t('wa.quantity'), dataIndex: 'stock', key: 'count'})
            }
            if (this.purchaseId !== 0) {
                tableColumns.splice(3, 0, {title: this.$t('in.order_quantity'), dataIndex: 'count', key: 'count'})
            }
            return tableColumns
        },
    },
    created() {
    },
    mounted() {
        console.log('this.disabledChecked:', this.disabledChecked)
        this.getTableData()
    },
    methods: {
        handleModalShow() {
            this.pageChange(1)
            this.modalShow = true
        },
        handleModalClose() {
            this.modalShow = false
            this.selectItemIds = []
            this.selectItems = []
            this.searchForm = {
                code: '',
                name: '',
                category_id: '',
            }
        },
        handleConfirm() {
            console.log('handleConfirm this.selectItems:', this.selectItems)
            this.$emit('select', this.selectItemIds, this.selectItems, this.faultName)
            this.modalShow = false
        },

        getTableData() {
            if (this.purchaseId) {
                Core.Api.Purchase.itemList({
                    order_id: this.purchaseId,
                    item_code: this.searchForm.code
                }).then(res => {
                    console.log('Purchase.itemList:', res)
                    this.tableData = res.list.map(item => {
                        return {
                            ...item.item,
                            count: item.amount
                        }
                    })
                    this.$emit('option', this.tableData)
                }).catch(err => {
                    console.log('Purchase.itemList err', err)
                }).finally(() => {
                    this.loading = false;
                });
            } else {
                Core.Api.Item.list({
                    ...this.searchForm,
                    warehouse_id: this.warehouseId,
                    page: this.currPage,
                    page_size: this.pageSize,
                    flag_spread: 1,
                }).then(res => {
                    console.log('Item.list res:', res)
                    this.tableData = res.list
                    this.total = res.count;
                })
            }
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        handleSearch() {
            this.pageChange(1)
        },
        handleSearchReset() {
            this.searchForm.code = ''
            this.searchForm.name = ''
            this.searchForm.category_id = ''
            this.pageChange(1)
        },
        handleCategorySelect(val) {
            this.searchForm.category_id = val
            this.pageChange(1);
        },
        handleSelectItem(ids, items) {
            console.log('handleSelectItem ids, items:', ids, items)
            this.selectItems = items
            this.selectItemIds = ids
        },
    },
}
</script>

<style lang='less' scoped>
.ItemSelectBtn {
    &.ant-btn-link {
        line-height: 1;
        height: 1em;
    }
    .ant-modal-content {
        .ant-modal-body {
            .hint-count {
                margin-bottom: 5px;
            }
        }
    }
}
.ItemSelectModal {
    .tip {
        height: 30px;
        line-height: 30px;
        margin-left: 10px;
        font-size: 12px;
    }
}
</style>
