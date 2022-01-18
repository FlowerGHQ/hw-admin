<template>
    <a-button @click.stop="handleModalShow" :ghost='ghost' :type="btnType" :class="btnClass">
        <slot>{{btnText}}</slot>
    </a-button>
    <a-modal :title="btnText" v-model:visible="modalShow" :after-close='handleModalClose' width='860px' @ok="handleConfirm">
        <div class="modal-content">
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :md='12' class="search-item">
                        <div class="key"><span>商品编码:</span></div>
                        <div class="value">
                            <a-input placeholder="请输入商品编码" v-model:value="searchForm.code" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :md='12' class="search-item">
                        <div class="key"><span>商品名称:</span></div>
                        <div class="value">
                            <a-input placeholder="请输入商品名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
                </div>
            </div>
            <div class="table-container">
                <ItemTable :columns="tableColumns" :data-source="tableData" :loading='loading' v-if="modalShow" :check-mode='true' :disabled-checked='disabledChecked' @submit="handleSelectItem" :radio-mode='radioMode'/>
            </div>
        </div>
        <template #footer>
            <div class="modal-footer">
                <div class="paging-area">
                    <a-pagination
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
    emits: ['select'],
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
        faultName: {
            type: String,
            default: ''
        },
        disabledChecked: {
            type: Array,
            default: () => { return [] }
        },
        warehouseId: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            loading: false,
            radioValue: 1,
            currPage: 1,
            pageSize: 10,
            total: 0,
            warehouse_id: '',

            searchForm: {
                code: "",
                name: ""
            },

            modalShow: false,

            tableData: [],

            selectItems: [],
            selectItemIds: []
        }
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: '商品名称', dataIndex: 'name',  key: 'detail' },
                { title: '商品规格', dataIndex: 'attr_list', key: 'spec' },
                { title: '标准售价', dataIndex: 'price', key: 'money', },
                { title: '商品编码', dataIndex: 'code',  key: 'item' },
                { title: '商品型号', dataIndex: 'model', key: 'item' },
            ]
            if (this.warehouseId !== 0) {
                tableColumns.splice(2, 0, {title: '仓库库存', dataIndex: 'stock', key: 'item'})
            }
            return tableColumns
        },
    },
    created() {},
    mounted() {
        console.log('this.disabledChecked:', this.disabledChecked)
    },
    methods: {
        // handleSelectItem(ids, items ) {
        //     this.selectItems = items
        // },

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
            this.$emit('select', this.selectItemIds, this.selectItems, this.faultName)
            this.modalShow = false
        },

        getTableData() {
            Core.Api.Item.list({
                ...this.searchForm,
                warehouse_id: this.warehouseId,
                page: this.currPage,
                page_size: this.pageSize,
                flag_spread: 1,
            }).then(res =>{
                console.log('getTableData res:', res)
                res.list.forEach(item => {
                    item.children = null
                })
                this.tableData = res.list
                this.total = res.count;
            })
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.handleSelectRadio()
        },
        handleSearch() {
            this.pageChange(1)
        },
        handleSearchReset() {
            this.searchForm.code = ''
            this.searchForm.name = ''
            this.pageChange(1)
        },
        handleSelectItem(ids, items) {
            console.log('handleSelectItem ids, items:', ids, items)
            this.selectItems = items
            this.selectItemIds = ids
        },
        handleSelectRadio(){
            // if (this.radioValue == "1"){
            //     this.getTableOrderData()
            // } else {
            //     this.getTableData()
            // }
            this.getTableData()
        },
        // 添加要寄回的商品
        handleAddItem(ids, items) {
            console.log('handleAddItem items:', items)
            this.tableData.push(...items)
        },
    },
}
</script>

<style lang='scss' scoped>
</style>
