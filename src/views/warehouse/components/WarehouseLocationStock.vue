<template id="WarehouseLocation">
    <div class="WarehouseLocation gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <div class="search-container">
                    <a-row class="search-area">
                        <a-col :xs="24" :sm="24" :xl="16" :xxl="8" class="search-item">
                            <div class="key">{{ $t('wa.uid') }}：</div>
                            <div class="value">
                                <a-input
                                    placeholder="uid"
                                    v-model:value="searchForm.uid"
                                    @keydown.enter="handleSearch"
                                />
                            </div>
                        </a-col>
                        <a-col :xs="24" :sm="24" :xl="16" :xxl="8" class="search-item">
                            <div class="key">{{ $t('i.code') }}：</div>
                            <div class="value">
                                <a-radio-group
                                    v-model:value="searchForm.target_type"
                                    @change="searchForm.target_id = undefined"
                                >
                                    <a-radio v-for="item of TARGET_TYPE_MAP" :key="item.key" :value="item.key">{{
                                        item[$i18n.locale]
                                    }}</a-radio>
                                </a-radio-group>
                            </div>
                        </a-col>
                        <a-col :xs="24" :sm="24" :xl="16" :xxl="8" class="search-item">
                            <div class="key">{{ $t('i.code') }}：</div>
                            <div class="value">
                                <a-select
                                    :disabled="searchForm.target_type === undefined"
                                    v-model:value="searchForm.target_id"
                                    show-search
                                    placeholder="code"
                                    :default-active-first-option="false"
                                    :show-arrow="false"
                                    :filter-option="false"
                                    :not-found-content="null"
                                    @search="handleItemSearch"
                                >
                                    <a-select-option v-for="item in itemOptions" :key="item.id" :value="item.id">
                                        {{ item.code }} - {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </div>
                        </a-col>
                    </a-row>

                    <div class="btn-area">
                        <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                        <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                    </div>
                </div>
                <div class="btns-area">

                </div>

                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    :row-selection="rowSelection"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'count'"> {{ text || 0 }} {{ $t('i.pcs2') }} </template>
                        <template v-if="column.key === 'target_code'">
                            <!--                            <a-button type="link" @click="routerChange('detail', record)">-->
                            <span v-if="record.target_type === ITEM_TYPE.PRODUCT">
                                {{ record.item ? record.item.code || '-' : '-' }}
                            </span>
                            <span v-if="record.target_type === ITEM_TYPE.COMPONENT">
                                {{ record.material ? record.material.code || '-' : '-' }}
                            </span>                            
                        </template>
                        <template v-if="column.key === 'target_name'">                            
                            <span v-if="record.target_type === ITEM_TYPE.PRODUCT">
                                {{ record.item ? record.item.name || '-' : '-' }}
                            </span>
                            <span v-if="record.target_type === ITEM_TYPE.COMPONENT">
                                {{ record.material ? record.material.name || '-' : '-' }}
                            </span>                            
                        </template>
                        <template v-if="column.key === 'uid'">
                            {{ record.warehouse_location.uid || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="handleUpdateShow(record)"
                                ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                            >
                            <a-button type="link" @click="handleDelete(record.id)">{{
                                $t('def.delete')
                            }}</a-button>
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
        <!--        <a-modal v-model:visible="modalShow" :title="form.id > 0 ? $t('wa.update_location'):$t('wa.add_location')" class="attachment-file-upload-modal" :after-close="handleModalClose">-->
        <!--            <div class="form-title">-->
        <!--                <div class="form-item required">-->
        <!--                    <div class="key">{{$t('wa.uid')}}:</div>-->
        <!--                    <div class="value">-->
        <!--                        <a-input v-model:value="form.uid" :placeholder="$t('def.input')"/>-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </div>-->
        <!--            <template #footer>-->
        <!--                <a-button @click="handleModalClose">{{ $t('def.cancel') }}</a-button>-->
        <!--                <a-button @click="handleModalSubmit" type="primary">{{ $t('def.sure') }}</a-button>-->
        <!--            </template>-->
        <!--        </a-modal>-->
        <!--        <a-modal v-model:visible="materialShow" :title="$t('wa.allocated_material')" class="attachment-file-upload-modal" :after-close="handleMaterialClose">-->
        <!--            <div class="form-title">-->
        <!--                <div class="form-item required">-->
        <!--                    <div class="key">{{ $t('wa.item_code') }}:</div>-->
        <!--                    <div class="value">-->
        <!--                        <a-select-->
        <!--                            v-model:value="itemForm.item_id"-->
        <!--                            show-search-->
        <!--                            :placeholder="$t('def.input')"-->
        <!--                            :default-active-first-option="false"-->
        <!--                            :show-arrow="false"-->
        <!--                            :filter-option="false"-->
        <!--                            :not-found-content="null"-->
        <!--                            @search="handleItemSearch"-->
        <!--                        >-->
        <!--                            <a-select-option v-for=" item in itemOptions" :key="item.id" :value="item.id">-->
        <!--                                Code:{{ item.code }}  Name:{{ item.name }}-->
        <!--                            </a-select-option>-->
        <!--                        </a-select>-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </div>-->
        <!--            <template #footer>-->
        <!--                <a-button @click="handleMaterialClose">{{ $t('def.cancel') }}</a-button>-->
        <!--                <a-button @click="handleMaterialSubmit" type="primary">{{ $t('def.sure') }}</a-button>-->
        <!--            </template>-->
        <!--        </a-modal>-->
        <!--        <a-modal v-model:visible="adjustModalShow" :title="$t('wa.adjust')" class="attachment-file-upload-modal" width="800px" :after-close="handleAdjustMaterialClose">-->
        <!--            <div class="form-title">-->
        <!--                <div class="form-item required">-->
        <!--                    <div class="key">{{$t('wa.out_uid')}}:</div>-->
        <!--                    <div class="value">-->
        <!--                        <a-select-->
        <!--                            v-model:value="adjustForm.warehouse_location_id"-->
        <!--                            show-search-->
        <!--                            placeholder="uid"-->
        <!--                            :default-active-first-option="false"-->
        <!--                            :show-arrow="false"-->
        <!--                            :filter-option="false"-->
        <!--                            :not-found-content="null"-->
        <!--                            @search="handleUidSearch"-->
        <!--                            @change="warehouseLocationChange"-->
        <!--                        >-->
        <!--                            <a-select-option v-for=" item in warehouseLocationOptions" :key="item.id" :value="item.id">-->
        <!--                                {{ item.uid }}-->
        <!--                            </a-select-option>-->
        <!--                        </a-select>-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--                <div class="form-item required">-->

        <!--                    <div class="key">{{$t('wa.out_item')}}:</div>-->
        <!--                    <div class="value">-->
        <!--                        {{$i18n.locale == 'zh' ? adjustName: adjustNameEn}}-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--                <div class="form-item required">-->
        <!--                    <div class="key">{{$t('wa.in_uid')}}:</div>-->
        <!--                    <div class="value">-->
        <!--                        <a-select-->
        <!--                            v-model:value="adjustForm.in_warehouse_location_id"-->
        <!--                            show-search-->
        <!--                            placeholder="uid"-->
        <!--                            :default-active-first-option="false"-->
        <!--                            :show-arrow="false"-->
        <!--                            :filter-option="false"-->
        <!--                            :not-found-content="null"-->
        <!--                            @search="handleUidSearch"-->
        <!--                            @change="warehouseLocationInChange"-->
        <!--                        >-->
        <!--                            <a-select-option v-for=" item in warehouseLocationOptions" :key="item.id" :value="item.id">-->
        <!--                                {{ item.uid }}-->
        <!--                            </a-select-option>-->
        <!--                        </a-select>-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--                <div class="form-item required">-->

        <!--                    <div class="key">{{$t('wa.out_item')}}:</div>-->
        <!--                    <div class="value">-->
        <!--                        {{$i18n.locale == 'zh' ? adjustInName: adjustInNameEn}}-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </div>-->
        <!--            <template #footer>-->
        <!--                <a-button @click="handleAdjustMaterialClose">{{ $t('def.cancel') }}</a-button>-->
        <!--                <a-button @click="handleAdjustSubmit" type="primary">{{ $t('def.sure') }}</a-button>-->
        <!--            </template>-->
        <!--        </a-modal>-->
    </div>
</template>

<script>
import Core from '../../../core';
const ITEM_TYPE = Core.Const.ITEM.TYPE;
const TARGET_TYPE = Core.Const.STOCK.TARGET_TYPE;
const TARGET_TYPE_MAP = Core.Const.STOCK.TARGET_TYPE_MAP;
export default {
    name: 'WarehouseLocationStock',
    components: {},
    props: {
        warehouseId: {
            type: [Number, String],
        },
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        return {
            Core,
            TARGET_TYPE,
            TARGET_TYPE_MAP,
            ITEM_TYPE,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 10,
            total: 0,
            modalShow: false,
            materialShow: false,
            adjustModalShow: false,
            warehouseLocationOptions: [],
            searchForm: {
                uid: '',
                target_id: '',
                target_type: undefined,
            },
            form: {
                warehouse_id: '',
                uid: '',
            },
            itemForm: {
                ids: [],
                item_id: '',
            },
            adjustForm: {
                warehouse_location_id: '',
                in_warehouse_location_id: '',
            },
            adjustName: '',
            adjustNameEn: '',
            adjustInName: '',
            adjustInNameEn: '',

            selectedRowKeys: [],
            selectedRowItems: [],
            selectedRowItemsAll: [],

            tableData: [],
            itemOptions: [],
            upload: {
                action: Core.Const.NET.URL_POINT + '/admin/1/warehouse-location/import',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                    warehouse_id: '',
                },
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: this.$t('wa.uid'), key: 'uid' },
                { title: this.$t('wa.code'), dataIndex: 'target_code', key: 'target_code' },
                { title: this.$t('wa.name'), dataIndex: 'target_name', key: 'target_name' },
                { title: this.$t('i.amount'), dataIndex: 'amount', key: 'amount' },
                // { title: this.$t('def.operate'), key: 'operation', fixed: 'right'},
            ];
            return tableColumns;
        },
        rowSelection() {
            return {
                type: 'checkbox',
                selectedRowKeys: this.selectedRowKeys,
                preserveSelectedRowKeys: true,
                onChange: (selectedRowKeys, selectedRows) => {
                    // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys;
                    this.selectedRowItemsAll.push(...selectedRows);
                    let selectedRowItems = [];
                    selectedRowKeys.forEach(id => {
                        let element = this.selectedRowItemsAll.find(i => i.id == id);
                        selectedRowItems.push(element);
                    });
                    this.selectedRowItems = selectedRowItems;
                    console.log(
                        'rowSelection this.selectedRowKeys:',
                        this.selectedRowKeys,
                        'selectedRowItems:',
                        selectedRowItems,
                    );
                    // this.$emit('submit', this.selectedRowKeys, this.selectedRowItems)
                },
            };
        },
    },
    mounted() {
        this.getTableData();
        this.upload.data.warehouse_id = this.warehouseId;
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail':
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-detail',
                        query: { id: item.source_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'material':
                    routeUrl = this.$router.resolve({
                        path: '/production/material-detail',
                        query: { id: item.target_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: { id: item.target_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        handleSearch() {
            this.pageChange(1);
        },
        handleSearchReset() {
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.pageChange(1);
        },
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
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.WarehouseLocationStock.list({
                warehouse_id: this.warehouseId,
                warehouse_location_uid: this.searchForm.uid,
                target_id: this.searchForm.target_id,
                target_type: this.searchForm.target_type,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleLocation(id) {
            this.modalShow = true;
        },
        handleModalClose() {
            this.modalShow = false;
            Object.assign(this.form, this.$options.data().form);
            // this.selectItem = {}
        },
        handleMaterial(id) {
            this.materialShow = true;
        },
        handleAdjustMaterial(id) {
            this.adjustModalShow = true;
        },
        handleAdjustMaterialClose() {
            this.adjustModalShow = false;
            Object.assign(this.adjustForm, this.$options.data().adjustForm);
            this.adjustNameEn = '';
            this.adjustName = '';
            // this.selectItem = {}
        },
        handleMaterialClose() {
            this.materialShow = false;
            Object.assign(this.itemForm, this.$options.data().itemForm);
            // this.selectItem = {}
        },

        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.form);
            form.warehouse_id = this.warehouseId;
            Core.Api.WarehouseLocation.save(form)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleModalClose();
                    this.getTableData();
                    // this.$emit('submit')
                })
                .catch(err => {
                    console.log('handleModalSubmit err', err);
                });
        },
        handleItemSearch(code) {
            if (this.searchForm.target_type === this.TARGET_TYPE.ITEM) {
                Core.Api.Item.list({ code: code, flag_spread: 1 }).then(res => {
                    this.itemOptions = res.list;
                });
            }
            if (this.searchForm.target_type === this.TARGET_TYPE.MATERIAL) {
                Core.Api.Material.list({ code: code, flag_spread: 1 }).then(res => {
                    this.itemOptions = res.list;
                });
            }
        },
        handleUidSearch(uid) {
            Core.Api.WarehouseLocation.list({ uid: uid, warehouse_id: this.detail.warehouse_id }).then(res => {
                this.warehouseLocationOptions = res.list;
            });
        },

        handleUpdateShow(item) {
            this.form = Core.Util.deepCopy(item);

            this.modalShow = true;
        },
        handleMaterialSubmit() {
            this.itemForm.ids = this.selectedRowKeys;
            if (this.itemForm.ids === []) {
                return;
            }
            if (!this.itemForm.item_id) {
                return;
            }

            Core.Api.WarehouseLocationStock.saveList({
                ids: this.itemForm.ids,
                target_id: this.itemForm.item_id,
                target_type: this.Core.Const.ITEM.TARGET_TYPE_MAP.ITEM,
            }).then(res => {
                this.getTableData();
                this.handleMaterialClose();
            });
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除库位吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.WarehouseLocation.delete({ id })
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
        // 上传文件
        handleFileUpload({ file, fileList }) {
            console.log('handleFileUpload status:', file.status, 'file:', file);
            if (file.status == 'done') {
                let res = file.response;
                if (res && res.code === 0) {
                    return this.$message.success(this.$t('pop_up.uploaded'));
                } else {
                    return this.$message.error('上传失败:' + res.message);
                }
            }
            this.upload.fileList = fileList;
        },
        handleAdjustSubmit() {
            if (!this.adjustForm.warehouse_location_id) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!this.adjustForm.in_warehouse_location_id) {
                return this.$message.warning(this.$t('def.enter'));
            }

            Core.Api.WarehouseLocationStock.adjust({
                warehouse_location_id: this.adjustForm.warehouse_location_id,
                in_warehouse_location_id: this.adjustForm.in_warehouse_location_id,
            }).then(res => {
                this.getTableData();
                this.handleMaterialClose();
                this.warehouseLocationChange();
                this.warehouseLocationInChange();
                this.$message.success(this.$t('pop_up.save_success'));
            });
        },
        warehouseLocationChange() {
            Core.Api.WarehouseLocationStock.detailByWarehouseLocation({
                warehouse_location_id: this.adjustForm.warehouse_location_id,
            }).then(res => {
                console.log(res);
                let name = '';
                let name_en = '';
                let count = '';
                res.list.forEach(it => {
                    if (it.material != undefined) {
                        name += it.material.name + ':' + it.amount + ',';
                        name_en += it.material.name_en + ':' + it.amount + ',';
                    }
                    if (it.item != undefined) {
                        name += it.item.name + ':' + it.amount + ',';
                        name_en += it.item.name_en + ':' + it.amount + ',';
                    }
                });
                this.adjustName = name;
                this.adjustNameEn = name_en;
            });
        },
        warehouseLocationInChange() {
            Core.Api.WarehouseLocationStock.detailByWarehouseLocation({
                warehouse_location_id: this.adjustForm.in_warehouse_location_id,
            }).then(res => {
                console.log(res);
                let name = '';
                let name_en = '';
                let count = '';
                res.list.forEach(it => {
                    if (it.material != undefined) {
                        name += it.material.name + ':' + it.amount + ',';
                        name_en += it.material.name_en + ':' + it.amount + ',';
                    }
                    if (it.item != undefined) {
                        name += it.item.name + ':' + it.amount + ',';
                        name_en += it.item.name_en + ':' + it.amount + ',';
                    }
                });
                this.adjustInName = name;
                this.adjustInNameEn = name_en;
            });
        },
    },
};
</script>

<style lang="less" scoped>
.WarehouseLocation {
    .search-container {
        background-color: #ffffff;
    }
    .btns-area {
        .file-upload-btn {
            margin-right: 15px;
        }
    }
}
</style>
