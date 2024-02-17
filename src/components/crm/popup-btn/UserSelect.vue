<template>
    <a-button class="UserSelectBtn" @click.stop="handleModalShow" :ghost="ghost" :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal
        :title="btnText"
        v-model:visible="modalShow"
        :after-close="handleModalClose"
        width="860px"
        class="UserSelectModal"
    >
        <div class="modal-content">
            <CustomerAdd
                :btnText="$t('crm_c.add')"
                :targetId="targetId"
                :targetType="targetType"
                v-if="addCustomerBtn"
                @select="getTableData"
            />
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :md="12" class="search-item">
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
                    <a-col :xs="24" :sm="24" :md="12" class="search-item">
                        <div class="key">
                            <span>{{ $t('n.phone') }}:</span>
                        </div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.phone"
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
                <CustomerTable
                    :columns="tableColumns"
                    :data-source="tableData"
                    :loading="loading"
                    v-if="modalShow"
                    :disabled-checked="disabledChecked"
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
</template>

<script>
import Core from '@/core';

import CustomerTable from '@/components/table/CustomerTable.vue';
import CustomerAdd from '@/components/crm/popup-btn/CustomerAdd.vue';

export default {
    components: {
        CustomerTable,
        CustomerAdd,
    },
    emits: ['select', 'option'],
    props: {
        btnText: {
            type: String,
            default: '添加联系人',
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
        groupId: {
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
            pageSize: 10,
            total: 0,
            searchForm: {
                phone: '',
                name: '',
            },

            tableData: [],

            selectItems: [],
            selectItemIds: [],
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
    },
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: this.$t('n.name'), dataIndex: 'name', key: 'name' },
                { title: this.$t('n.phone'), dataIndex: 'phone', key: 'phone' },
            ];

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
            if (this.groupId != 0) {
                Core.Api.CRMGroup.getGroupAdmin({
                    group_id: this.groupId,
                })
                    .then(res => {
                        this.tableData = res.list;
                    })
                    .catch(err => {
                        console.log('Purchase.itemList err', err);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                Core.Api.User.list({
                    org_type: Core.Const.LOGIN.ORG_TYPE.ADMIN,
                    name: this.searchForm.name,
                    phone: this.searchForm.phone,
                })
                    .then(res => {
                        this.tableData = res.list;
                    })
                    .catch(err => {
                        console.log('Purchase.itemList err', err);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
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
.UserSelectBtn {
    margin-left: 8px;
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
.UserSelectModal {
    .tip {
        height: 30px;
        line-height: 30px;
        margin-left: 10px;
        font-size: 12px;
    }
}
</style>
