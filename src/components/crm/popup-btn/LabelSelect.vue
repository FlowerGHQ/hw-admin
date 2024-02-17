<template>
    <div>
        <a-button class="LabelSelectBtn" @click.stop="handleModalShow" :ghost="ghost" :type="btnType" :class="btnClass">
            <slot>{{ btnText }}</slot>
        </a-button>
        <a-modal
            :title="btnText"
            v-model:visible="modalShow"
            :after-close="handleModalClose"
            width="560px"
            class="LabelSelectModal"
        >
            <div class="modal-content">
                <div class="search-container">
                    <a-row class="search-area">
                        <a-col :xs="24" :sm="24" :md="24" class="search-item">
                            <div class="key">
                                <span>{{ $t('n.name') }}:</span>
                            </div>
                            <div class="value">
                                <a-input
                                    :placeholder="$t('def.input')"
                                    v-model:value="searchForm.name"
                                    @keydown.enter="handleSearch"
                                />
                            </div>
                        </a-col>
                    </a-row>
                    <div class="btn-area">
                        <a-button
                            @click="handleSearch"
                            :disabled="searchForm.name === '' && selectCustomer"
                            type="primary"
                            >{{ $t('def.search') }}</a-button
                        >
                        <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                    </div>
                </div>
                <LabelAdd :category="category" v-if="addCustomerBtn" @select="getTableData" :btnText="$t('sl.save')" />
                <div class="table-container">
                    <LabelTable
                        :columns="tableColumns"
                        :data-source="tableData"
                        :loading="loading"
                        v-if="modalShow"
                        :disabled-checked="disabledList"
                        @submit="handleSelectItem"
                        :radio-mode="radioMode"
                        :check-mode="checkMode"
                    />
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
                        <div class="tip">
                            {{ $t('in.selected') + ` ${this.selectItemIds.length} ` + $t('in.total') }}
                        </div>
                    </div>
                    <div class="btn-area">
                        <a-button @click="handleModalClose">{{ $t('def.cancel') }}</a-button>
                        <a-button @click="handleConfirm" type="primary" v-if="!selectCustomer">{{
                            $t('def.sure')
                        }}</a-button>
                    </div>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '@/core';

import LabelTable from '@/components/table/LabelTable.vue';
import LabelAdd from '@/components/crm/popup-btn/LabelAdd.vue';

export default {
    components: {
        LabelTable,
        LabelAdd,
    },
    emits: ['select', 'option'],
    props: {
        btnText: {
            type: String,
            default: '添加标签',
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
        targetId: {
            type: Number,
            default: 0,
        },
        targetType: {
            type: Number,
            default: 0,
        },
        addCustomerBtn: {
            type: Boolean,
            default: false,
        },
        selectCustomer: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            default: '',
        },
        checkMode: {
            type: Boolean,
            default: true,
        },
        category: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            Core,
            loading: false,
            modalShow: false,

            currPage: 1,
            pageSize: 20,
            total: 0,
            searchForm: {
                phone: '',
                name: '',
            },

            tableData: [],

            selectItems: [],
            selectItemIds: [],
            disabledList: [],
        };
    },
    watch: {
        name: {
            deep: true,
            immediate: true,
            handler(name) {
                this.searchForm.name = this.name;
            },
        },
        disabledChecked: {
            deep: true,
            immediate: true,
            handler(disabledChecked) {
                this.disabledList = this.disabledChecked;
            },
        },
    },
    computed: {
        tableColumns() {
            let tableColumns = [{ title: this.$t('sl.name'), dataIndex: 'name', key: 'name' }];

            return tableColumns;
        },
    },
    created() {},
    mounted() {
        if (this.name !== '') {
            this.searchForm.name = this.name;
        }
        if (this.targetId !== 0) {
            this.getTableData();
        }
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
            this.$emit('select', this.selectItemIds, this.selectItems, this.faultName);
            this.modalShow = false;
        },

        getTableData() {
            Core.Api.CRMLabel.list({
                name: this.searchForm.name,
                category: this.category,
                page: this.currPage,
                pageSize: this.pageSize,
            })
                .then(res => {
                    this.tableData = res.list;
                    this.total = res.count;
                })
                .catch(err => {
                    console.log('Purchase.itemList err', err);
                })
                .finally(() => {
                    this.loading = false;
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
            this.searchForm.phone = '';
            this.searchForm.name = '';
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
.LabelSelectBtn {
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
.LabelSelectModal {
    .tip {
        height: 30px;
        line-height: 30px;
        margin-left: 10px;
        font-size: 12px;
    }
}
</style>
