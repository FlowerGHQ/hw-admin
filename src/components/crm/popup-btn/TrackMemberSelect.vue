<template>
    <a-button
        class="TrackMemberSelectBtn"
        @click.stop="handleModalShow"
        :ghost="ghost"
        :type="btnType"
        :class="btnClass"
    >
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal
        :title="btnText"
        v-model:visible="modalShow"
        :after-close="handleModalClose"
        width="860px"
        class="TrackMemberSelectModal"
    >
        <div class="modal-content">
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
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_group.type') }}：</div>
                <div class="value">
                    <a-select v-model:value="type" :placeholder="$t('def.select')">
                        <a-select-option v-for="item of TYPE_MAP" :key="item.value" :value="item.value">{{
                            lang === 'zh' ? item.zh : item.en
                        }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="table-container">
                <TrackMemberTable
                    :columns="tableColumns"
                    :data-source="tableData"
                    :loading="loading"
                    v-if="modalShow"
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
                    <a-button @click="handleConfirm" type="primary">{{ $t('def.sure') }}</a-button>
                </div>
            </div>
        </template>
    </a-modal>
</template>

<script>
import Core from '@/core';

import TrackMemberTable from '@/components/table/TrackMemberTable.vue';

export default {
    components: {
        TrackMemberTable,
    },
    emits: ['select', 'option'],
    props: {
        btnText: {
            type: String,
            default: '添加团队成员',
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
    },
    data() {
        return {
            Core,
            TYPE_MAP: Core.Const.CRM_TRACK_MEMBER.TYPE_EDIT_MAP,
            loading: false,
            modalShow: false,

            currPage: 1,
            pageSize: 10,
            total: 0,
            searchForm: {
                phone: '',
                name: '',
            },
            type: '',
            tableData: [],

            selectItems: [],
            selectItemIds: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: this.$t('n.name'), dataIndex: 'name', key: 'name' },
                { title: this.$t('n.phone'), dataIndex: 'phone', key: 'phone' },
            ];
            return tableColumns;
        },
        lang() {
            return this.$store.state.lang;
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
            if (!this.type) {
                return this.$message.warning(this.$t('crm_c.select'));
            }
            console.log('handleConfirm this.selectItems:', this.selectItems);
            this.$emit('select', this.selectItemIds, this.selectItems, this.type);
            this.modalShow = false;
        },

        getTableData() {
            Core.Api.User.list({
                name: this.searchForm.name,
                org_type: Core.Const.LOGIN.ORG_TYPE.ADMIN,
            })
                .then(res => {
                    this.tableData = res.list;
                    this.$emit('option', this.tableData);
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
.TrackMemberSelectBtn {
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
.TrackMemberSelectModal {
    .form-item {
        max-width: 250px;
    }
    .tip {
        height: 30px;
        line-height: 30px;
        margin-left: 10px;
        font-size: 12px;
    }
}
</style>
