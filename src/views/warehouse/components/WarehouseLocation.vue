<template id="WarehouseLocation">
    <div class="WarehouseLocation gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                    <div class="search-container">
                        <a-row class="search-area">
                            <a-col :xs='24' :sm='24' :xl="16" :xxl='8' class="search-item">
                                <div class="key">uid：</div>
                                <div class="value">
                                    <a-input placeholder="uid" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                                </div>
                            </a-col>

                            <a-col :xs='24' :sm='24' :xl="16" :xxl='8' class="search-item">
                                <div class="key">code：</div>
                                <div class="value">
                                    <a-select
                                        v-model:value="searchForm.item_id"
                                        show-search
                                        placeholder="code"
                                        :default-active-first-option="false"
                                        :show-arrow="false"
                                        :filter-option="false"
                                        :not-found-content="null"
                                        @search="handleItemSearch"
                                    >
                                        <a-select-option v-for=" item in itemOptions" :key="item.id" :value="item.id">
                                            {{ item.code }} - {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </div>
                            </a-col>
                        </a-row>

                        <div class="btn-area">
                            <a-button @click="handleSearch" type="primary">{{$t('def.search')}}</a-button>
                            <a-button @click="handleSearchReset" >{{$t('def.reset')}}</a-button>
                        </div>
                    </div>
                    <div class="btns-area">
                        <a-upload name="file" class="file-uploader"
                                  :file-list="upload.fileList" :action="upload.action"
                                  :show-upload-list='false'
                                  :headers="upload.headers" :data='upload.data'
                                  accept=".xlsx,.xls"
                                  @change="handleFileUpload">
                            <a-button type="primary" ghost class="panel-btn" style="margin-right: 7px">
                                <i class="icon i_add"/> {{$t('i.import')}}
                            </a-button>
                        </a-upload>

                        <a-button type="primary" ghost @click="handleLocation()" v-if="$auth('warehouse.save')" class="panel-btn">
                            <i class="icon i_add"/>{{ $t('wa.add_location') }}
                        </a-button>
                        <a-button type="primary" ghost @click="handleMaterial()" v-if="$auth('warehouse.save')" class="panel-btn">
                            <i class="icon i_add"/>{{ $t('wa.allocated_material') }}
                        </a-button>
                    </div>


                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="(record) => record.id" :pagination="false" :row-selection="rowSelection">
                    <template #bodyCell="{ column, text, record }">

                        <template v-if="column.key === 'count'">
                            {{ text || 0 }} 件
                        </template>

                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.stockRecordFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'source_type'">
                            {{ $Util.sourceFormFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'uid'">
                            {{ record.uid || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="handleUpdateShow(record)" v-if="$auth('agent.save')"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>
                            <a-button type="link" @click="handleDelete(record.id)" v-if="$auth('agent.save')">{{ $t('def.delete') }}</a-button>
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
                    :show-total="(total) => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
        <a-modal v-model:visible="modalShow" :title="form.id > 0 ? $t('wa.update_location'):$t('wa.add_location')" class="attachment-file-upload-modal" :after-close="handleModalClose">
            <div class="form-title">
                <div class="form-item required">
                    <div class="key">{{$t('wa.uid')}}:</div>
                    <div class="value">
                        <a-input v-model:value="form.uid" :placeholder="$t('def.input')"/>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleModalClose">{{ $t('def.cancel') }}</a-button>
                <a-button @click="handleModalSubmit" type="primary">{{ $t('def.sure') }}</a-button>
            </template>
        </a-modal>
        <a-modal v-model:visible="materialShow" :title="$t('n.upload_attachment')" class="attachment-file-upload-modal" :after-close="handleMaterialClose">
            <div class="form-title">
                <div class="form-item required">
                    <div class="key">{{ $t('wa.item_code') }}:</div>
                    <div class="value">
                        <a-select
                            v-model:value="itemForm.item_id"
                            show-search
                            :placeholder="$t('def.input')"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @search="handleItemSearch"
                        >
                            <a-select-option v-for=" item in itemOptions" :key="item.id" :value="item.id">
                                Code:{{ item.code }}  Name:{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleMaterialClose">{{ $t('def.cancel') }}</a-button>
                <a-button @click="handleMaterialSubmit" type="primary">{{ $t('def.sure') }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from "../../../core";

export default {
    name: "WarehouseLocation",
    components: {

    },
    props: {
        warehouseId: {
            type: Number,
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
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 10,
            total: 0,
            modalShow: false,
            materialShow: false,
            searchForm: {
                uid: '',
                item_id: '',
            },
            form: {
                warehouse_id: '',
                uid: '',
            },
            itemForm: {
                ids: [],
                item_id: '',
            },
            selectedRowKeys: [],
            selectedRowItems: [],
            selectedRowItemsAll: [],

            tableData: [],
            itemOptions: [],
            upload: {
                action: Core.Const.NET.URL_POINT + "/admin/1/warehouse-location/import",
                fileList: [],
                headers: {
                    ContentType: false
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
                {title:  this.$t('wa.uid'), key: "uid"},
                {title: this.$t('wa.code'), dataIndex: "target_code", key: "name"},
                {title: this.$t('wa.name'), dataIndex: "target_name", key: "name"},
                {title: this.$t('i.amount'), dataIndex: "amount", key: "amount"},
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right'},
            ];
            return tableColumns;
        },
        rowSelection() {
            return {
                type: 'checkbox',
                selectedRowKeys: this.selectedRowKeys,
                preserveSelectedRowKeys: true,
                onChange: (selectedRowKeys, selectedRows) => { // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys
                    this.selectedRowItemsAll.push(...selectedRows)
                    let selectedRowItems = []
                    selectedRowKeys.forEach(id => {
                        let element = this.selectedRowItemsAll.find(i => i.id == id)
                        selectedRowItems.push(element)
                    });
                    this.selectedRowItems = selectedRowItems
                    console.log('rowSelection this.selectedRowKeys:', this.selectedRowKeys,'selectedRowItems:', selectedRowItems)
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
            let routeUrl = ''
            switch (type) {
                case 'detail':
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/invoice-detail",
                        query: {id: item.source_id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'material':
                    routeUrl = this.$router.resolve({
                        path: "/production/material-detail",
                        query: {id: item.target_id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: {id: item.target_id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        handleSearch() {
            this.pageChange(1)
        },
        handleSearchReset() {
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.pageChange(1)
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
            Core.Api.WarehouseLocation.list({
                warehouse_id: this.warehouseId,
                uid: this.searchForm.uid,
                item_id: this.searchForm.item_id,
                page: this.currPage,
                page_size: this.pageSize,
            }).then(res => {
                console.log("getTableData res", res);
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log("getTableData err", err);
            }).finally(() => {
                this.loading = false;
            });
        },
        handleLocation(id) {
            this.modalShow = true;
        },
        handleModalClose() {
            this.modalShow = false;
            Object.assign(this.form, this.$options.data().form)
            // this.selectItem = {}
        },
        handleMaterial(id) {
            this.materialShow = true;
        },
        handleMaterialClose() {
            this.materialShow = false;
            Object.assign(this.itemForm, this.$options.data().itemForm)
            // this.selectItem = {}
        },

        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.form)
            form.warehouse_id = this.warehouseId
            Core.Api.WarehouseLocation.save(form).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.handleModalClose()
                this.getTableData();
                // this.$emit('submit')
            }).catch(err => {
                console.log('handleModalSubmit err', err)
            })
        },
        handleItemSearch(code) {
            Core.Api.Item.list({code: code,flag_spread: 1}).then(res => {
                this.itemOptions = res.list
            })
        },
        handleUpdateShow(item) {
            this.form = Core.Util.deepCopy(item)

            this.modalShow = true
        },
        handleMaterialSubmit() {
            this.itemForm.ids = this.selectedRowKeys;
            if (this.itemForm.ids === []) {
                return
            }
            if (!this.itemForm.item_id) {
                return
            }

            Core.Api.WarehouseLocationStock.saveList({
                ids: this.itemForm.ids,
                target_id: this.itemForm.item_id,
                target_type: this.Core.Const.ITEM.TARGET_TYPE_MAP.ITEM
            }).then(res => {
                this.getTableData();
                this.handleMaterialClose();

            })
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除库位吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.WarehouseLocation.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        // 上传文件
        handleFileUpload({file, fileList}) {
            console.log("handleFileUpload status:", file.status, "file:", file)
            if (file.status == 'done') {
                let res = file.response
                if (res && res.code === 0) {
                    return this.$message.success(this.$t('pop_up.uploaded'));
                } else {
                    return this.$message.error('上传失败:' + res.message)
                }
            }
            this.upload.fileList = fileList
        },

    },
};
</script>

<style lang="less" scoped>
.WarehouseLocation {
    .search-container{
        background-color: #ffffff;
    }
    .btns-area {
        .file-upload-btn {
            margin-right: 15px;
        }
    }
}
</style>
