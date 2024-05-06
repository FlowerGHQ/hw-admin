<template>
    <div id="EntityList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">
                   {{ $t('v.device_list') }}
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('v.number') }}:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.pcba_code"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('i.type') }}:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.type"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>

                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                        <div class="key">{{ $t('d.create_time') }}:</div>
                        <div class="value">
                            <TimeSearch @search="handleOtherSearch" ref="TimeSearch" />
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="operate-container">
                <a-button type="primary" @click="handleSetShow()"> <i class="icon" />转换为实例 </a-button>
            </div>
            <div class="table-container">
                <a-table
                    :check-mode="true"
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    :row-selection="rowSelection"
                    :expandedRowKeys="expandedRowKeys"
                    :indentSize="0"
                    :expandIconColumnIndex="expandIconColumnIndex"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            {{ $Util.deviceStatusFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
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
                v-model:visible="entityShow"
                title="转换为实例"
                class="vehicle-edit-modal"
                :after-close="handleEntityClose"
            >
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('i.code') }}:</div>
                        <a-radio-group v-model:value="editForm.type" @change="handleTypeChange">
                            <a-radio class="type-item" v-for="item of TYPE_MAP" :key="item.key" :value="item.key">{{
                                item[$i18n.locale]
                            }}</a-radio>
                        </a-radio-group>
                    </div>
                    <div class="form-item required" v-if="editForm.type === Core.Const.DEVICE.TYPE.VEHICLE">
                        <div class="key">{{ $t('i.code') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="editForm.item_id"
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
                    </div>
                    <div class="form-item required" v-if="editForm.type === Core.Const.DEVICE.TYPE.PARTS">
                        <div class="key">{{ $t('i.code') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="editForm.item_id"
                                show-search
                                placeholder="code"
                                :default-active-first-option="false"
                                :show-arrow="false"
                                :filter-option="false"
                                :not-found-content="null"
                                @search="handleMaterialSearch"
                            >
                                <a-select-option v-for="item in materialOptions" :key="item.id" :value="item.id">
                                    {{ item.code }} - {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">仓库:</div>
                        <div class="value">
                            <a-select
                                v-model:value="editForm.warehouse_id"
                                placeholder="请选择仓库"
                                show-search
                                option-filter-prop="children"
                            >
                                <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="vehicleShow = false">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleEntitySubmit" type="primary">{{ $t('def.ok') }}</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import dayjs from 'dayjs';
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue';
import TimeSearch from '@/components/common/TimeSearch.vue';

const TYPE_MAP = Core.Const.DEVICE.TYPE_MAP;

export default {
    name: 'EntityList',
    components: {
        CategoryTreeSelect,
        TimeSearch,
    },
    props: {},
    data() {
        return {
            Core,
            TYPE_MAP,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            itemOptions: [],
            materialOptions: [],
            // 搜索
            searchForm: {
                pcba_code: '',
                type: '',
                begin_time: '',
                end_time: '',
            },
            // 表格
            tableData: [],
            expandedRowKeys: [],
            expandIconColumnIndex: 0,

            // 弹框
            entityShow: false,
            warehouseList: [],
            editForm: {
                id: '',
                uid: '',
                item_code: '',
            },
            selectedRowKeys: [],
            selectedRowItems: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: 'p.code', dataIndex: 'pcba_code', key: 'item' },
                { title: 'i.type', dataIndex: 'type', key: 'item' },
                { title: 'p.status', dataIndex: 'status' },
                { title: 'd.create_time', dataIndex: 'create_time', key: 'time' },
            ];
            return columns;
        },
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys;
                    this.selectedRowItems = selectedRows;
                    console.log('rowSelection onChange this.selectedRowKeys', this.selectedRowKeys);
                },
            };
        },
    },
    mounted() {
        this.getTableData();
        this.getWarehouseList();
    },
    methods: {
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
            this.pageChange(1);
            this.$refs.TimeSearch.handleReset();
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Device.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    // let list = res.list.map(entity => {
                    //     entity.attr_desc = entity.item.attr_list ? entity.item.attr_list.map(i => i.value).join(',') : ''
                    //     return entity
                    // })
                    console.log('res.list', res.list);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                    this.expandedRowKeys = [];
                });
        },

        handleEntityClose() {
            // 关闭弹框
            this.entityShow = false;
            this.editForm = {
                id: '',
                item_id: '',
                warehouse_id: '',
            };
        },
        handleSetShow() {
            this.entityShow = true;
        },
        handleEntitySubmit() {
            let form = Core.Util.deepCopy(this.editForm);
            form.id_list = this.selectedRowKeys;
            Core.Api.Device.deviceToEntity(form)
                .then(res => {
                    console.log('handleEntitySubmit res', res);
                    this.$message.success(this.$t('i.settings') + this.$t('pop_up.success'));
                    this.handleEntityClose();
                    this.getTableData();
                    this.selectedRowKeys = [];
                    this.selectedRowItems = [];
                })
                .catch(err => {
                    console.log('handleEntitySubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list;
            });
        },
        handleItemSearch(code) {
            Core.Api.Item.list({ code: code, flag_spread: 1 }).then(res => {
                this.itemOptions = res.list;
            });
        },
        handleMaterialSearch(code) {
            Core.Api.Material.list({ code: code }).then(res => {
                this.materialOptions = res.list;
            });
        },
        handleTypeChange() {
            this.editForm.item_id = '';
        },
    },
};
</script>

<style lang="less">
#EntityList {
    .ant-btn.ant-btn-link {
        line-height: 22px;
        margin-left: 8px;
    }
}

.form-item {
    .fac();

    .ant-input {
        width: calc(~'100% - 24px');
    }

    i.icon {
        display: inline-block;
        width: 24px;
        text-align: right;
    }

    .i_confirm {
        color: @green;
        font-size: 18px;
    }

    .i_close_c {
        color: @red;
        font-size: 18px;
    }
}
</style>
<style lang="less" scoped>
#EntityList {
    .list-container {
        .title-container {
            .btns-area {
                .file-upload-btn {
                    margin-left: 10px;
                }
            }
        }
    }
}
</style>
