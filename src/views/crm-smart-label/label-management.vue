<template>
    <div id="LabelManagement">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('sl.management') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleModalShow({}, false)" v-if="$auth('crm-dict.save')"
                        ><i class="icon i_add" />{{ $t('sl.save') }}</a-button
                    >
                </div>
            </div>
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.category" @change="handleSearch">
                    <a-tab-pane :key="item.category" v-for="item of typeList">
                        <template #tab>
                            <div class="tabs-title">{{ item[$i18n.locale] }}</div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('n.name') }}:</div>
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
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record, index }">
                        <template v-if="column.key === 'country'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            <div class="status status-bg status-tag" :class="text == 1 ? 'blue' : 'yellow'">
                                {{ text == 1 ? $t('crm_set.preset') : $t('crm_set.unpreset') }}
                            </div>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-dropdown
                                type="link"
                                :trigger="['']"
                                v-model:visible="menuShow[index]"
                                @click="handleMenuShow(index)"
                                v-if="record.type !== 1"
                            >
                                <a class="ant-dropdown-link operation-a" @click.prevent>
                                    {{ $t('sl.synchronize') }}
                                    <DownOutlined />
                                </a>
                                <template #overlay>
                                    <a-menu class="synchronous-menu">
                                        <a-menu-item class="synchronous-menu-item">
                                            <a-checkbox-group v-model:value="editForm.category_list">
                                                <a-checkbox :value="1" v-if="searchForm.category != 1">{{
                                                    $t('sl.client')
                                                }}</a-checkbox>
                                                <a-checkbox :value="2" v-if="searchForm.category != 2">{{
                                                    $t('sl.business')
                                                }}</a-checkbox>
                                                <a-checkbox :value="3" v-if="searchForm.category != 3">{{
                                                    $t('sl.contract_order')
                                                }}</a-checkbox>
                                                <a-checkbox :value="4" v-if="searchForm.category != 4">{{
                                                    $t('sl.receipt')
                                                }}</a-checkbox>
                                            </a-checkbox-group>
                                        </a-menu-item>
                                        <a-menu-item>
                                            <a-button
                                                size="small"
                                                type="primary"
                                                @click="handleSubmitContent(record)"
                                                >{{ $t('def.ok') }}</a-button
                                            >
                                            <a-button size="small" @click="handleMenuShow(index)">{{
                                                $t('def.cancel')
                                            }}</a-button>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                            <a-button
                                type="link"
                                @click="handleModalShow(record, true)"
                                v-if="record.type !== 1 && $auth('crm-label.save')"
                                ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleDelete(record.id)"
                                class="danger"
                                v-if="record.type !== 1 && $auth('crm-label.delete')"
                                ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                            >
                            <!-- <a-button type="link" @click="handlePreset(record.id, record.type)" v-if="$auth('crm-dict.set')"><i :class="record.category === 1 ? 'icon i_close_c' : 'icon i_confirm'"/>{{ record.type === 1 ? $t('crm_set.cancel_pre') : $t('crm_set.set_pre') }}</a-button> -->
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size="pageSize"
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
        <template class="modal-container">
            <a-modal
                v-model:visible="modalShow"
                :title="editForm.id ? $t('sl.edit') : $t('sl.save')"
                @ok="handleModalSubmit()"
                @cancel="handleModalClose()"
            >
                <div class="modal-content">
                    <div class="form-item">
                        <div class="key">{{ $t('sl.classification') }}</div>
                        <div class="value">
                            <a-checkbox-group v-model:value="editForm.category_list" :disabled="falgEdit">
                                <a-checkbox v-for="item in LABEl_CATEGORY_MAP" :value="item.value">
                                    {{ item[$i18n.locale] }}
                                </a-checkbox>
                            </a-checkbox-group>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t('sl.name') }}</div>
                        <div class="value">
                            <a-input v-model:value="editForm.name" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t('sl.name_en') }}</div>
                        <div class="value">
                            <a-input v-model:value="editForm.name_en" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <div class="form-item textarea">
                        <div class="key">{{ $t('sl.remark') }}</div>
                        <div class="value">
                            <a-textarea
                                v-model:value="editForm.remark"
                                :placeholder="$t('sl.remark')"
                                :auto-size="{ minRows: 2, maxRows: 2 }"
                            />
                        </div>
                    </div>
                </div>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import { DownOutlined } from '@ant-design/icons-vue';

import CountryCascader from '@/components/common/CountryCascader.vue';
export default {
    name: 'LabelManagement',
    components: { CountryCascader, DownOutlined },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            LABEl_CATEGORY_MAP: Core.Const.LABEl.CATEGORY_MAP,
            // 搜索
            searchForm: {
                name: '',
                name_en: '',
                category: '1',
            },
            // 表格
            tableData: [],
            modalShow: false,
            falgEdit: false,
            editForm: {
                id: '',
                name: '',
                name_en: '',
                category: '1',
                category_list: [],
                remark: '',
            },
            menuShow: [],
            category_list: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('sl.name'), dataIndex: 'name' },
                { title: this.$t('sl.name_en'), dataIndex: 'name_en' },
                { title: this.$t('sl.count'), dataIndex: 'count' },
                { title: this.$t('def.remark'), dataIndex: 'remark' },
                { title: this.$t('n.type'), dataIndex: 'type' },
                { title: this.$t('crm_c.create_user'), dataIndex: 'create_user_name' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right', width: '260px' },
            ];
            return columns;
        },
        typeList() {
            let columns = [
                { zh: '客户', en: 'Customer', category: '1' },
                { zh: '商机', en: 'Bo', category: '2' },
                { zh: '合同订单', en: 'Order', category: '3' },
                { zh: '回款单', en: 'Income', category: '4' },
            ];
            return columns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            this.pageSize = size;
            this.getTableData();
        },
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) {
            // 大洲/国家 搜索
            for (const key in params) {
                this.searchForm[key] = params[key];
            }
            this.pageChange(1);
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.$refs.CountryCascader.handleReset();
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            // return
            Core.Api.CRMLabel.list({
                category: this.searchForm.category,
                name: this.searchForm.name,
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
                    this.tableData.forEach(it => {
                        this.menuShow.push(false);
                    });
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMLabel.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        handleModalShow(record, falgEdit) {
            this.falgEdit = falgEdit;
            this.editForm = Core.Util.deepCopy(record);
            this.modalShow = true;
        },
        handleModalClose() {
            // this.editForm = Core.Util.deepCopy(this.$options.data().editForm)
            this.modalShow = false;
            Object.assign(this.editForm, this.$options.data().editForm);
        },
        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.editForm);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.name_en) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!this.falgEdit && (!form.category_list || form.category_list.length === 0)) {
                return this.$message.warning(this.$t('def.enter'));
            }
            this.loading = true;
            let apiName = this.falgEdit ? 'save' : 'batchSave';
            Core.Api.CRMLabel[apiName](form)
                .then(res => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.modalShow = false;
                    this.getTableData();
                })
                .catch(err => {
                    this.getTableData();
                    console.log('handleModalSubmit err:', err);
                })
                .finally(() => {
                    this.loading = false;
                    this.editForm.category_list = [];
                    this.editForm.category = '';
                    this.editForm.name = [];
                    this.editForm.name_en = [];
                    this.editForm.remark = '';
                });
        },

        // 是否预置
        handlePreset(id, type) {
            let _this = this;
            this.$confirm({
                title: type === 1 ? _this.$t('sl.sure_cancel_pre') : _this.$t('sl.sure_set_pre'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    type = type === 2 ? 1 : 2;
                    Core.Api.CRMLabel.change({ id, type })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.operate'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },

        // 是否可用
        handleStatus(id, status) {
            let _this = this;
            this.$confirm({
                title: status === 1 ? _this.$t('pop_up.sure_set_disable') : _this.$t('pop_up.sure_set_able'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    status = status === 1 ? 2 : 1;
                    Core.Api.CRMLabel.change({ id, type })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.operate'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        // 操作栏同步按钮
        handleMenuShow(index) {
            this.menuShow[index] = !this.menuShow[index];
            this.editForm.category_list = [];
            this.editForm.name_en = '';
            this.editForm.remark = '';
        },
        // 操作栏同步 提交按钮
        handleSubmitContent(record) {
            this.editForm.name = record.name;
            this.falgEdit = false;
            this.handleModalSubmit();
            this.menuShow = [];
        },
    },
};
</script>

<style lang="less" scoped>
#LabelManagement {
    .operation-a {
        margin-right: 10px;
        color: #006ef9;
    }
    .ant-menu-root.ant-menu-vertical {
        box-shadow: none;
        border: 1px solid #f0f0f0;
        border-radius: 3%;
    }
}
</style>
