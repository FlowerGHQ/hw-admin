<template>
    <a-button class="ItemSelectBtn" @click.stop="handleModalShow" :ghost='ghost' :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal :title="btnText" v-model:visible="modalShow" :after-close='handleModalClose' width='860px'>
        <div class="modal-content">
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :md='12' class="search-item">
                        <div class="key"><span>实例号:</span></div>
                        <div class="value">
                            <a-input placeholder="请输入商品编码" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
                </div>
            </div>
            <div class="table-container">
                <ItemTable :columns="tableColumns" :data-source="tableData" :loading='loading' v-if="modalShow" :showStock='!!warehouseId'
                    :check-mode='true' :disabled-checked='disabledChecked' @submit="handleSelectItem" :radio-mode='radioMode'/>
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
                </div>
                <div class="btn-area">
                    <a-button @click="handleModalClose">取消</a-button>
                    <a-button @click="handleConfirm" type="primary">确定</a-button>
                </div>
            </div>
        </template>
    </a-modal>
</template>

<script>
import Core from '@/core';

export default {
    components: {
        ItemTable: () => import('@/components/table/ItemTable.vue'),
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

        warehouseId: {
            type: Number,
            default: 0
        },
        purchaseId: {
            type: Number,
            default: 0
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
                uid: '',
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
                {title: '商品名称', dataIndex: ['item','name'], key: 'item'},
                {title: '商品实例号', dataIndex: 'uid', key: 'item'},
                {title: '商品分类', dataIndex: ['item','category','name'], key: 'item'},
                {title: '商品品号', dataIndex: ['item','model'], key: 'item'},
                {title: '商品编码', dataIndex: ['item','code'], key: 'item'},
                {title: '商品规格', dataIndex: ['item','attr_list'], key: 'spec'},
                {title: '到港时间', dataIndex: 'arrival_time', key: 'time'},
            ]
            return tableColumns
        },
    },
    created() {},
    mounted() {
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
        },
        handleConfirm() {
            console.log('handleConfirm this.selectItems:', this.selectItems)
            this.$emit('select', this.selectItemIds, this.selectItems)
            this.modalShow = false
        },

        getTableData() {
            Core.Api.Entity.list({
                ...this.searchForm,
                warehouse_id: this.warehouseId,
                page: this.currPage,
                page_size: this.pageSize,
            }).then(res => {
                console.log('Entity.list res:', res)
                this.tableData = res.list
                this.total = res.count;
            })
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        handleSearch() {
            this.pageChange(1)
        },
        handleSearchReset() {
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.pageChange(1)
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
    line-height: 1;
    height: 1em;
}
</style>
