<template>
    <a-button class="CustomerSelectBtn" @click.stop="handleModalShow" :ghost="ghost" :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal
        :title="btnText"
        v-model:visible="modalShow"
        :after-close="handleModalClose"
        width="860px"
        class="CustomerSelectModal"
    >
        <div class="modal-content">
            <CustomerAdd
                :btnText="$t('crm_c.add')"
                :targetId="targetId"
                :targetType="targetType"
                :groupId="groupId"
                v-if="addCustomerBtn"
                @select="getTableData"
            />
            <div class="search-container">
                <a-row class="search-area">
                    <!-- 名称 -->
                    <a-col :xs="24" :sm="24" :md="12" class="search-item" v-if="!selectCustomer">
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
                    <!-- 手机号 -->
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
                    <!-- 邮箱 -->
                    <a-col :xs="24" :sm="24" :md="12" class="search-item">
                        <div class="key">
                            <span>{{ $t('n.email') }}:</span>
                        </div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.email"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button
                        @click="handleSearch"
                        :disabled="searchForm.phone === '' && searchForm.email === '' && selectCustomer"
                        type="primary"
                        >{{ $t('def.search') }}</a-button
                    >
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="table-container">
                <CustomerTable
                    :columns="tableColumns"
                    :data-source="tableData"
                    :loading="loading"
                    v-if="modalShow"
                    :select-btn="selectBtn"
                    :disabled-checked="disabledChecked"
                    @submit="handleSelectItem"
                    @select="selectItem"
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
        phone: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            default: '',
        },
        checkMode: {
            type: Boolean,
            default: true,
        },
        selectBtn: {
            type: Boolean,
            default: false,
        },
        groupId: {
            type: Number,
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
                email: '',
                name: '',
            },

            tableData: [],

            selectItems: [],
            selectItemIds: [],
        };
    },
    watch: {
        phone: {
            deep: true,
            immediate: true,
            handler(phone) {
                this.searchForm.phone = this.phone;
            },
        },
        email: {
            deep: true,
            immediate: true,
            handler(email) {
                this.searchForm.email = this.email;
            },
        },
    },
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: this.$t('n.name'), dataIndex: 'name', key: 'name' },
                { title: this.$t('n.phone'), dataIndex: 'phone', key: 'phone' },
                { title: this.$t('n.email'), dataIndex: 'email', key: 'email' },
                { title: this.$t('crm_c.type'), dataIndex: 'type', key: 'type' },
            ];
            if (this.selectCustomer) {
                tableColumns.push(
                    { title: this.$t('crm_c.own_user_name'), dataIndex: ['own_user', 'name'], key: 'name' },
                    { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
                );
            }

            return tableColumns;
        },
    },
    created() {},
    mounted() {
        // console.log('SSS', this.targetId)
        if (this.phone !== '') {
            this.searchForm.phone = this.phone;
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
            if (this.selectCustomer && this.searchForm.phone === '' && this.searchForm.email === '') {
                return;
            }
            let obj = {
                name: this.searchForm.name,
                phone: this.searchForm.phone,
                email: this.searchForm.email,
                target_id: this.targetId,
                target_type: this.targetType,
            };
            Core.Api.CRMCustomer.list({
                page: this.currPage,
                pageSize: this.pageSize,
                ...Core.Util.searchFilter(obj),
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
            this.searchForm.email = '';
            this.searchForm.name = '';
            this.tableData = [];
        },
        handleSelectItem(ids, items) {
            console.log('handleSelectItem ids, items:', ids, items);
            this.selectItems = items;
            this.selectItemIds = ids;
        },
        selectItem(id) {
            console.log('select2 item:', id);
            this.$emit('select', id);
            this.modalShow = false;
        },
    },
};
</script>

<style lang="less" scoped>
.CustomerSelectBtn {
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
.CustomerSelectModal {
    .tip {
        height: 30px;
        line-height: 30px;
        margin-left: 10px;
        font-size: 12px;
    }
}
</style>
