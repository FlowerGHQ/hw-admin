<template>
    <a-button class="MaterialSelectBtn" @click.stop="handleModalShow" :ghost="ghost" :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal :title="btnText" v-model:visible="modalShow" :after-close="handleModalClose" width="860px">
        <div class="modal-content">
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :md="12" class="search-item">
                        <div class="key"><span>供应商名:</span></div>
                        <div class="value">
                            <a-input
                                placeholder="请输入供应商名称"
                                v-model:value="searchForm.short_name"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" class="search-item">
                        <div class="key"><span>物料编码:</span></div>
                        <div class="value">
                            <a-input
                                placeholder="请输入物料编码"
                                v-model:value="searchForm.code"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" class="search-item">
                        <div class="key"><span>物料名称:</span></div>
                        <div class="value">
                            <a-input
                                placeholder="请输入物料名称"
                                v-model:value="searchForm.name"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
                </div>
            </div>
            <div class="table-container">
                <div class="hint-count">
                    <a-button type="primary">{{ `已选中 ${this.selectItemIds.length} 条` }}</a-button>
                    <!--                    <ItemTable></ItemTable>-->
                    <ItemTable
                        :columns="tableColumns"
                        :data-source="tableData"
                        :loading="loading"
                        v-if="modalShow"
                        :showStock="!!warehouseId"
                        :check-mode="true"
                        :disabled-checked="disabledChecked"
                        @submit="handleSelectItem"
                        :radio-mode="radioMode"
                    />
                </div>
            </div>
        </div>
        <template #footer>
            <div class="modal-footer">
                <div class="paging-area">
                    <a-pagination
                        show-less-items
                        :hide-on-single-page="false"
                        :total="total"
                        :current="currPage"
                        :default-page-size="pageSize"
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
import ItemTable from '@/components/table/ItemTable.vue';
export default {
    components: {
        ItemTable,
    },
    emits: ['select', 'option'],
    props: {
        btnText: {
            type: String,
            default: '添加物料',
        },
        btnType: {
            type: String,
            default: 'primary',
        },
        btnClass: {
            type: String,
        },
        ghost: {
            type: Boolean,
            default: false,
        },

        radioMode: {
            // 是否只能选一个物料
            type: Boolean,
            default: false,
        },
        disabledChecked: {
            type: Array,
            default: () => {
                return [];
            },
        },
        materialId: {
            type: Number,
        },
        warehouseId: {
            type: Number,
            default: 0,
        },
        sourceId: {
            type: Number,
        },
        sourceType: {
            type: Number,
        },
        type: {
            type: Number,
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
                short_name: '',
                name: '',
            },

            tableData: [],
            supplier_list: [],
            selectItems: [],
            selectItemIds: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: '物料名称', dataIndex: 'name', key: 'detail' },
                { title: '供应商', key: 'supplier_list' },
                { title: '物料分类', dataIndex: ['category', 'name'], key: 'item' },
                { title: '物料编码', dataIndex: 'code', key: 'item' },
                { title: '物料规格', dataIndex: 'spec', key: 'material_spec' },
                // {title: '物料包装', dataIndex: ['item','encapsulation'], key: 'item'},
            ];
            if (this.warehouseId !== 0) {
                tableColumns.splice(3, 0, { title: '仓库库存', dataIndex: 'stock', key: 'count' });
            }
            return tableColumns;
        },
    },
    created() {},
    mounted() {
        console.log('mounted this.disabledChecked:', this.disabledChecked);
        this.getTableData();
    },
    methods: {
        handleModalShow() {
            this.pageChange(1);
            this.modalShow = true;
        },
        handleModalClose() {
            this.modalShow = false;
            this.selectItemIds = [];
            this.selectItems = [];
            this.searchForm = [];
        },
        handleConfirm() {
            console.log('handleConfirm this.selectItems:', this.selectItems);
            this.$emit('select', this.selectItemIds, this.selectItems);
            this.modalShow = false;
        },
        getTableData() {
            Core.Api.Material.list({
                ...this.searchForm,
                warehouse_id: this.warehouseId,
                source_id: this.sourceId,
                source_type: this.sourceType,
                page: this.currPage,
                page_size: this.pageSize,
            }).then(res => {
                console.log('Material.list res:', res);
                this.tableData = res.list;
                this.total = res.count;
            });
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        handleSearch() {
            this.pageChange(1);
        },
        handleSearchReset() {
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.pageChange(1);
        },
        handleSelectItem(ids, items) {
            console.log('handleSelectItem ids, items:', ids, items);
            this.selectItems = items;
            this.selectItemIds = ids;
        },
    },
};
</script>

<style lang="less">
.MaterialSelectBtn {
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
</style>
