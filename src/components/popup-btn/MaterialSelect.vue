<template>
    <a-button class="MaterialSelectBtn" @click.stop="handleModalShow" :ghost='ghost' :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal :title="btnText" v-model:visible="modalShow" :after-close='handleModalClose' width='860px'>
        <div class="modal-content">
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :md='12' class="search-item">
                        <div class="key"><span>物料编码:</span></div>
                        <div class="value">
                            <a-input placeholder="请输入物料编码" v-model:value="searchForm.code" @keydown.enter='handleSearch'/>
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
    emits: ['select', 'option'],
    props: {
        btnText: {
            type: String,
            default: '添加物料'
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

        radioMode: { // 是否只能选一个物料
            type: Boolean,
            default: false,
        },
        disabledChecked: {
            type: Array,
            default: () => {
                return []
            }
        },
        materialId: {
            type: Number,
        },
        warehouseId: {
            type: Number,
            default: 0
        },
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
                {title: '物料名称', dataIndex: 'name', key: 'detail'},
                {title: '物料分类', dataIndex: ['category','name'], key: 'item'},
                {title: '物料编码', dataIndex: 'code', key: 'item'},
                {title: '物料规格', dataIndex: 'spec', key: 'item'},
                {title: '物料包装', dataIndex: 'encapsulation', key: 'item'},
                // {title: '供应商编码', dataIndex: 'supplier_code', key: 'item'},
            ]
            if (this.warehouseId !== 0) {
                tableColumns.splice(3, 0, {title: '仓库库存', dataIndex: 'stock', key: 'count'})
            }
            return tableColumns
        },
    },
    created() {},
    mounted() {
        console.log('mounted this.disabledChecked:', this.disabledChecked)
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
            Core.Api.Material.list({
                ...this.searchForm,
                warehouse_id: this.warehouseId,
                page: this.currPage,
                page_size: this.pageSize,
            }).then(res => {
                console.log('Material.list res:', res)
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
.MaterialSelectBtn {
    line-height: 1;
    height: 1em;
}
</style>
