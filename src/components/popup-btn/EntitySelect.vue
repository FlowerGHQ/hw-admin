<template>
    <a-button class="EntitySelectBtn" @click.stop="handleModalShow" :ghost="ghost" :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal :title="btnText" v-model:visible="modalShow" :after-close="handleModalClose" width="860px">
        <div class="modal-content">
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :md="12" class="search-item">
                        <div class="key">
                            <span>{{ $t('v.number') }}:</span>
                        </div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
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
        <template #footer>
            <div class="modal-footer">
                <div class="paging-area">
                    <a-pagination
                        v-if="!purchaseId"
                        show-less-items
                        :hide-on-single-page="false"
                        :total="total"
                        :current="currPage"
                        :default-page-size="pageSize"
                        @change="pageChange"
                    />
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

export default {
    components: {
        ItemTable: () => import('@/components/table/ItemTable.vue'),
    },
    emits: ['select', 'option'],
    props: {
        btnText: {
            type: String,
            default: '添加商品',
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
            // 是否只能选一个商品
            type: Boolean,
            default: false,
        },
        disabledChecked: {
            type: Array,
            default: () => {
                return [];
            },
        },

        warehouseId: {
            type: Number,
            default: 0,
        },
        purchaseId: {
            type: Number,
            default: 0,
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
                uid: '',
            },

            tableData: [],

            selectItems: [],
            selectItemIds: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: this.$t('n.name'), dataIndex: ['item', 'name'], key: 'item' },
                { title: this.$t('v.number'), dataIndex: 'uid', key: 'item' },
                // {title: this.$t('i.categories'), dataIndex: ['item','category','name'], key: 'item'},
                { title: this.$t('i.categories'), dataIndex: 'category_list', key: 'category_list' },
                { title: this.$t('i.number'), dataIndex: ['item', 'model'], key: 'item' },
                { title: this.$t('i.code'), dataIndex: ['item', 'code'], key: 'item' },
                { title: this.$t('i.spec'), dataIndex: ['item', 'attr_list'], key: 'spec' },
                { title: this.$t('r.arrival_time'), dataIndex: 'arrival_time', key: 'time' },
            ];
            return tableColumns;
        },
    },
    created() {},
    mounted() {
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
        },
        handleConfirm() {
            console.log('handleConfirm this.selectItems:', this.selectItems);
            this.$emit('select', this.selectItemIds, this.selectItems);
            this.modalShow = false;
        },

        getTableData() {
            Core.Api.Entity.list({
                ...this.searchForm,
                warehouse_id: this.warehouseId,
                page: this.currPage,
                page_size: this.pageSize,
            }).then(res => {
                console.log('Entity.list res:', res);
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

<style lang="less" scoped>
.EntitySelectBtn {
    &.ant-btn-link {
        line-height: 1;
        height: 1em;
    }
}
</style>
