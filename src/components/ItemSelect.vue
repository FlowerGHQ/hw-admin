<template>
    <a-button @click="handleModalShow" :ghost='ghost' :type="btnType">{{btnText}}</a-button>
    <a-modal :title="btnText" v-model:visible="modalShow" :after-close='handleModalClose' width='860px' @ok="handleConfirm">
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
            <ItemTable :columns="tableColumns" :data-source="tableData" :loading='loading' v-if="modalShow" :check-mode='true' :disabled-checked='disabledChecked' @change="handleSelectItem" :radio-mode='radioMode'/>
        </div>
        <div class="paging-container">
            <a-pagination
                show-quick-jumper
                show-less-items
                :show-total="total => `共 ${total} 条记录`"
                :hide-on-single-page='false'
                :total="total"
                :current="currPage"
                :default-page-size='pageSize'
                @change="pageChange"
            />
        </div>
    </a-modal>
</template>

<script>
import Core from '@/core';

export default {
    components: {
        ItemTable: () => import('@/components/table/ItemTable'),
    },
    props: {
        btnText: {
            type: String,
            default: '添加商品'
        },
        btnType: {
            type: String,
            default: 'primary'
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
        }
    },
    data() {
        return {
            loading: false,
            radioValue: 1,
            currPage: 1,
            pageSize: 10,
            total: 0,

            searchForm: {
                code: "",
                name: ""
            },

            modalShow: false,

            tableColumns: [
                { title: '商品名', dataIndex: 'name', scopedSlots: { customRender: 'name' } },
                { title: '商品编码', dataIndex: 'item_code', scopedSlots: { customRender: 'item' }, },
                { title: '标准售价', dataIndex: 'price', scopedSlots: { customRender: 'money' }, },
            ],
            tableData: [],

            selectItems: [],
            selectItemIds: []
        }
    },
    watch: {},
    computed: {},
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
            console.log('handleConfirm this.faultName:', this.selectItems)

            this.$emit('change', this.selectItemIds, this.selectItems, this.faultName)
            this.modalShow = false
        },

        getTableOrderData() {
            Core.Api.Item.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res =>{
                res.list.forEach(item => {
                    try {
                        item.logo = item.logo ? JSON.parse(item.logo) : []
                    } catch (error) {
                        item.logo = item.logo.split(',')
                    }
                })
                this.tableData = res.list
                this.total = res.count;
            })
        },
        getTableData() {
            Core.Api.Item.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res =>{
                console.log('getTableData res:', res)
                res.list.forEach(item => {
                    item.logo = item.logo.split(',')
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
