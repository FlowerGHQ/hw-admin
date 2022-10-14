<template>
    <div id="SalesAreaList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_set.list')}}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleModalShow({})" v-if="$auth('crm-customer-source.save')"><i class="icon i_add"/>{{ $t('crm_set.save')}}</a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('n.name')}}:</div>
                        <div class="value">
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search')}}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset')}}</a-button>
                </div>

            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record}">
                        <template v-if="column.key === 'country'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="handleModalShow(record)" v-if="$auth('crm-customer-source.save')"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>
                            <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="$auth('crm-customer-source.delete')"><i class="icon i_delete"/>{{ $t('def.delete') }}</a-button>
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size='pageSize'
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
        <template class="modal-container">
            <a-modal v-model:visible="modalShow" :title="editForm.id ? $t('crm_set.edit') : $t('crm_set.save')" :after-close="handleModalClose">
                <div class="modal-content">
                    <div class="form-item">
                        <div class="key">{{ $t('n.name') }}</div>
                        <div class="value">
                            <a-input v-model:value="editForm.name" :placeholder="$t('def.input')"/>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t('n.name_en') }}</div>
                        <div class="value">
                            <a-input v-model:value="editForm.name_en" :placeholder="$t('def.input')"/>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t('n.index') }}</div>
                        <div class="value">
                            <a-input v-model:value="editForm.index" :placeholder="$t('def.input')"/>
                        </div>
                    </div>

                </div>
                <template #footer>
                    <a-button @click="handleModalClose()">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleModalSubmit()" type="primary">{{ $t('def.sure') }}</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';

import CountryCascader from '@/components/common/CountryCascader.vue'
export default {
    name: 'SalesAreaList',
    components: {CountryCascader},
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            searchForm: {
                name: '',
                continent: '',
                country: '',
            },
            // 表格
            tableData: [],
            modalShow: false,
            editForm: {
                id: '',
                name: '',
                name_en: '',
                index: '',
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: this.$t('crm_set.name'), dataIndex: 'name'},
                {title: this.$t('crm_set.name_en'), dataIndex: 'name_en'},
                {title: this.$t('crm_set.index'), dataIndex: 'index'},
                {title: this.$t('def.operate'), key: 'operation', fixed: 'right'},
            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        pageChange(curr) {    // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {    // 页码尺寸改变
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {    // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) { // 大洲/国家 搜索
            for (const key in params) {
                this.searchForm[key] = params[key]
            }
            this.pageChange(1);
        },
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.$refs.CountryCascader.handleReset()
            this.pageChange(1);
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            // return
            Core.Api.CRMDict.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
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
                    Core.Api.CRMDict.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        handleModalShow(record) {
            this.editForm =  Core.Util.deepCopy(record)
            this.modalShow = true
        },
        handleModalClose() {
            this.editForm = Core.Util.deepCopy(this.$options.data().editForm)
            this.modalShow = false
        },
        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.editForm)
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.name_en) {
                return this.$message.warning(this.$t('def.enter'))
            }
            this.loading = true
            let apiName = form.id ? 'update' : 'save';
            Core.Api.CRMDict[apiName](form).then(res => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.modalShow = false
            }).catch(err => {
                console.log('handleModalSubmit err:', err)
            }).finally(() => {
                this.loading = false
            })

        },
    }
};
</script>

<style lang="less" scoped>
// #SalesAreaList {}
</style>
