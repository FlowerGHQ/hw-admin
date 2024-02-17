<template>
    <div id="WarehouseList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('inv.file_list') }}</div>
                <div class="btns-area">
                    <a-button
                        type="primary"
                        @click="
                            modalShow = true;
                            upload.data.inventory_type = '';
                        "
                        v-if="$auth('inventory.import')"
                        ><i class="icon i_add" />{{ $t('inv.importInv') }}</a-button
                    >
                    <a-button type="primary" @click="routerChange('edit')" v-if="$auth('inventory.save')"
                        ><i class="icon i_add" />{{ $t('inv.add') }}</a-button
                    >
                </div>
            </div>
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.type" @change="handleSearch">
                    <a-tab-pane :key="item.key" v-for="item of typeList">
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
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('inv.inventory_coding') }}:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('inv.category') }}:</div>
                        <div class="value">
                            <CategoryTreeSelect
                                @change="handleCategorySelect"
                                :category="item_category"
                                :category-id="searchForm.category_id"
                                :placeholder="$t('n.choose') + $t('m.material_category')"
                                type="material"
                                :inventory-type="searchForm.type"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                        <div class="key">{{ $t('d.create_time') }}:</div>
                        <div class="value"><TimeSearch @search="handleOtherSearch" ref="TimeSearch" /></div>
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
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <!--                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                            </a-tooltip>-->
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.inventoryTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'category'">
                            {{ record.category.category_name }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'cost'">
                            {{ $Util.countFilter(text) }}
                        </template>
                        <template v-if="column.key === 'tax'">
                            {{ text + '%' }}
                        </template>

                        <template v-if="column.key === 'flag_production_use'">
                            {{ record.flag_production_use ? '是' : '否' }}
                        </template>
                        <template v-if="column.key === 'flag_outsourcing'">
                            {{ record.flag_outsourcing ? '是' : '否' }}
                        </template>
                        <template v-if="column.key === 'flag_batch'">
                            {{ record.flag_batch ? '是' : '否' }}
                        </template>
                        <template v-if="column.key === 'flag_extra_feature'">
                            {{ record.flag_extra_feature ? '是' : '否' }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <!-- <a-button type="link" @click="routerChange('detail',record)" v-if="$auth('warehouse.detail')"><i class="icon i_detail"/>{{ $t('def.detail') }}</a-button> -->
                            <a-button type="link" @click="routerChange('edit', record)" v-if="$auth('inventory.save')"
                                ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleDelete(record.id)"
                                class="danger"
                                v-if="$auth('inventory.delete')"
                                ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                            >
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
        <a-modal v-model:visible="modalShow" :title="$t('n.upload_attachment')" class="attachment-file-upload-modal">
            <div class="form-title">
                <div class="form-item required">
                    <div class="key">{{ $t('n.type') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="upload.data.inventory_type">
                            <a-radio :value="item.key" v-for="item in typeList">{{
                                lang === 'zh' ? item.zh : item.en
                            }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required file-upload">
                    <div class="key">{{ $t('f.upload') }}:</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            class="monetary-upload"
                            :file-list="upload.fileList"
                            :action="upload.action"
                            :show-upload-list="false"
                            :headers="upload.headers"
                            :data="upload.data"
                            accept=".xlsx,.xls"
                            @change="handlePurchaseChange"
                        >
                            <a-button type="primary" ghost class="file-upload-btn">
                                <i class="icon i_add" /> {{ $t('i.bulk_import') }}
                            </a-button>
                        </a-upload>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="modalShow = false">{{ $t('def.cancel') }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';
import TimeSearch from '@/components/common/TimeSearch.vue';
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue';

export default {
    name: 'WarehouseList',
    components: {
        TimeSearch,
        CategoryTreeSelect,
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            searchForm: {
                name: '',
                begin_time: '',
                end_time: '',
                type: Core.Const.INVENTORY.TYPE.FINISHED,
                flag_production_use: -1,
                flag_outsourcing: -1,
                flag_batch: -1,
                flag_extra_feature: -1,
                category_id: undefined,
                uid: undefined,
            },
            item_category: {},
            tableData: [],
            typeList: Core.Const.INVENTORY.TYPE_MAP,
            modalShow: false,
            upload: {
                action: Core.Const.NET.URL_POINT + '/admin/1/inventory/import',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                    inventory_type: '',
                },
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('inv.type'), dataIndex: 'type', key: 'type' },
                { title: this.$t('inv.inventory_coding'), dataIndex: 'uid', key: 'text' },
                { title: this.$t('inv.inventory_name'), dataIndex: 'name', key: 'text' },
                { title: this.$t('inv.category'), dataIndex: 'category', key: 'category' },
                { title: this.$t('inv.spec_no'), dataIndex: 'spec', key: 'text' },
                { title: this.$t('inv.inventory_code'), dataIndex: 'model', key: 'text' },
                { title: this.$t('inv.admin'), dataIndex: 'admin_name', key: 'text' },
                {
                    title: this.$t('inv.production_consumption'),
                    dataIndex: 'flag_production_use',
                    key: 'flag_production_use',
                },
                { title: this.$t('inv.outsourcing'), dataIndex: 'flag_outsourcing', key: 'flag_outsourcing' },
                { title: this.$t('inv.tax_rate'), dataIndex: 'tax', key: 'tax' },
                { title: this.$t('inv.cost'), dataIndex: 'cost', key: 'cost' },
                { title: this.$t('inv.abc_type'), dataIndex: 'abc_type', key: 'text' },
                { title: this.$t('inv.batch'), dataIndex: 'flag_batch', key: 'flag_batch' },
                { title: this.$t('inv.start_date'), dataIndex: 'start_date', key: 'time' },
                { title: this.$t('inv.create_user'), dataIndex: 'user', key: 'text' },
                { title: this.$t('inv.unit_group'), dataIndex: 'uom_group', key: 'text' },
                { title: this.$t('inv.primary_unit'), dataIndex: 'uom_primary', key: 'text' },
                { title: this.$t('inv.feature_matching'), dataIndex: 'flag_extra_feature', key: 'flag_extra_feature' },
                { title: this.$t('inv.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('inv.update_time'), dataIndex: 'update_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            return columns;
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/inventory/inventory-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/inventory/inventory-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.pageSize = size;
            this.getTableData();
        },
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) {
            // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key];
            }
            this.pageChange(1);
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.$refs.TimeSearch.handleReset();
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            this.loading = false;
            // return
            Core.Api.Inventory.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
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
                    Core.Api.Inventory.delete({ id })
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
        handlePurchaseChange({ file, fileList }) {
            let _this = this;
            console.log('handleMatterChange status:', file.status, 'file:', file);
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    _this.getTableData();
                    return this.$message.error(file.response.message);
                } else {
                    _this.getTableData();
                    return this.$message.success(this.$t('i.uploaded'));
                }
            }
            this.upload.fileList = fileList;
        },
        // 物料分类选择
        handleCategorySelect(val, node) {
            this.searchForm.category_id = val;
        },
    },
};
</script>

<style lang="less" scoped>
// #WarehouseList {}
</style>
