<template>
<div id="ItemList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('i.item_list') }} </div>
            <div class="btns-area">
                <a-upload name="file" class="file-uploader"
                    :file-list="upload.fileList" :action="upload.action"
                    :show-upload-list='false'
                    :headers="upload.headers" :data='upload.data'
                    accept=".xlsx,.xls"
                    @change="handleMatterChange">
                    <a-button type="primary" ghost class="file-upload-btn">
                        <i class="icon i_add"/>{{ $t('i.import') }}
                    </a-button>
                </a-upload>
                <a-button type="primary" @click="handleSalesAreaByIdsShow()"><i class="icon i_edit"/> 批量设置销售区域 </a-button>
                <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>{{ $t('i.new') }}</a-button>
            </div>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">{{ $t('n.name') }}:</div>
                    <div class="value">
                        <a-input :placeholder="$t('def.input')" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">{{ $t('n.type') }}:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.type" :placeholder="$t('def.select')">
                            <a-select-option v-for="(val, key) in itemTypeMap" :key="key" :value="key">{{ val[$i18n.locale]  }}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">{{ $t('i.code') }}:</div>
                    <div class="value">
                        <a-input :placeholder="$t('def.input')" v-model:value="searchForm.code" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">{{ $t('i.categories') }}:</div>
                    <div class="value">
                        <CategoryTreeSelect @change="handleCategorySelect" :category-id='searchForm.category_id' />
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                    <div class="key">{{ $t('d.create_time') }}:</div>
                    <div class="value"><TimeSearch @search="handleOtherSearch" ref='TimeSearch'/></div>
                </a-col>
            </a-row>
            <div class="btn-area">
                <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
            </div>
        </div>
        <div class="table-container">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :pagination='false'
                :row-key="record => record.id" @expand='handleTableExpand' @change="handleTableChange" :row-selection="rowSelection"
                     :expandedRowKeys="expandedRowKeys" :indentSize='0' :expandIconColumnIndex="expandIconColumnIndex">
                <template #bodyCell="{ column, text , record }">
                    <template v-if="column.key === 'detail'">
                        <div class="table-img afs">
                            <a-image class="image" :width="55" :height="55" :src="$Util.imageFilter(record.logo)" fallback='无'/>
                            <a-tooltip placement="top" :title='text' destroy-tooltip-on-hide>
                                <div class="info">
                                    <a-button type="link" @click="routerChange('detail', record)">
                                        <div class="ell" style="max-width: 150px">{{ text || '-' }}</div>
                                    </a-button>
                                    <p class="sub-info" v-if="record.attr_list && record.attr_list.length">{{$Util.itemSpecFilter(record.attr_list)}}</p>
                                </div>
                            </a-tooltip>
                        </div>
                    </template>
                    <template v-if="column.key === 'type'">
                        {{ $Util.itemTypeFilter(text, $i18n.locale) }}
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-'}}
                    </template>
                    <template v-if="column.key === 'money'">
                        ￥{{$Util.countFilter(text)}}
                    </template>
                    <template v-if="column.key === 'flag_entity'">
                        {{$Util.itemFlagEntityFilter(text, $i18n.locale)}}
                    </template>
                    <template v-if="column.key === 'fob_money'">
                        {{column.unit}} {{$Util.countFilter(text)}}
                    </template>
                    <template v-if="column.key === 'man_hour'">
                        {{ $Util.countFilter(text) }}
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status status-bg status-tag" :class="text === 0 ? 'green' : 'red'">
                            {{text === 0 ? $t('i.active') : $t('i.inactive') }}
                        </div>
                    </template>

                    <template v-if="column.key === 'tip_item'">
                        <a-tooltip placement="top" :title='text'>
                            <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <template v-if="!record.default_item_id">
                            <a-button type='link' @click="routerChange('edit', record)"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>
                            <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/> {{ $t('def.detail') }}</a-button>
                        </template>
                        <a-button type='link' @click="handleStatusChange(record)" :class="record.status === 0 ? 'danger' : ''">
                            <template v-if="record.status === -1"><i class="icon i_putaway"/>{{ $t('i.active_a') }}</template>
                            <template v-if="record.status === 0"><i class="icon i_downaway"/> {{ $t('i.inactive_a') }}</template>
                        </a-button>
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
    <a-modal v-model:visible="salesAreaVisible" title="设置销售区域" class="field-select-modal" :width="630" :after-close='handleSalesAreaByIdsClose'>
        <div class="modal-content">
            <div class="form-item required">
                <div class="key">{{ $t('d.sales_area') }}</div>
                <div class="value">
                    <a-select v-model:value="salesAreaIds" mode="tags" :placeholder="$t('def.select')">
                        <a-select-option v-for="(val,key) in salesList" :key="key" :value="val.id">{{ val.name }}</a-select-option>
                    </a-select>
                </div>
            </div>
        </div>
        <template #footer>
            <a-button type="primary" @click="handleSalesAreaByIdsConfirm">确定</a-button>
            <a-button @click="handleSalesAreaByIdsClose">取消</a-button>
        </template>
    </a-modal>
</div>
</template>

<script>
import Core from '../../core';

import TimeSearch from '@/components/common/TimeSearch.vue'
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue';
const ITEM = Core.Const.ITEM
export default {
    name: 'ItemList',
    components: {
        TimeSearch,
        CategoryTreeSelect,
    },
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
            filteredInfo: null,
            searchForm: {
                name: '',
                code: '',
                category_id: undefined,
                begin_time: '',
                end_time: '',
                type: undefined,
            },
            itemTypeMap: ITEM.TYPE_MAP,
            // 表格
            tableData: [],
            expandedRowKeys: [],
            expandIconColumnIndex: 0,
            selectedRowKeys: [],
            salesAreaVisible: false,
            salesList: [],
            salesAreaIds: [],
            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + "/admin/1/item/import",
                fileList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                },
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let tableColumns = [
                { title: this.$t('n.name'), dataIndex: 'name', key: 'detail' },
                { title: this.$t('i.status'), dataIndex: 'status',
                    filters: this.$Util.tableFilterFormat(ITEM.STATUS_LIST, this.$i18n.locale), filterMultiple: false, filteredValue: filteredInfo.status || [0] },
                { title: this.$t('n.type'), dataIndex: ['type'], key: 'type' },
                { title: this.$t('n.flag_entity'), dataIndex: 'flag_entity', key: 'flag_entity' },
                { title: this.$t('i.categories'), dataIndex: ['category','name'], key: 'item' },
                { title: this.$t('i.number'), dataIndex: 'model', key: 'item' },
                { title: this.$t('i.code'), dataIndex: 'code', key: 'item' },
                { title: this.$t('i.cost_price'), dataIndex: 'original_price' ,key: 'money'},
                { title: 'FOB(EUR)', dataIndex: 'fob_eur', key: 'fob_money', unit: '€'},
                { title: 'FOB(USD)', dataIndex: 'fob_usd', key: 'fob_money', unit: '$'},
                { title: this.$t('i.hours'), dataIndex: 'man_hour', key: 'man_hour' },
                { title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time'},
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right', width: 180 }
            ]
            return tableColumns
        },
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => { // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys
                    this.selectedRowItems = selectedRows
                    console.log('rowSelection onChange this.selectedRowKeys', this.selectedRowKeys);
                },
            };
        },
    },
    mounted() {
        this.getTableData();
        this.getSalesAreaList();


    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item)
            let routeUrl = ''
            switch (type) {
                case 'detail':  // 商品详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: { id: item.default_item_id || item.id, set_id: item.set_id }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'edit':  // 商品编辑
                    routeUrl = this.$router.resolve({
                        path: "/item/item-edit",
                        query: { id: item.default_item_id || item.id, set_id: item.set_id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) { // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key]
            }
            this.pageChange(1);
        },
        handleCategorySelect(val) {
            this.searchForm.category_id = val
            this.pageChange(1);
        },
        handleTableChange(page, filters, sorter) { // 表格筛选
            console.log('handleTableChange filters:', filters)
            this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : ''
            }
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.$refs.TimeSearch.handleReset()
            this.pageChange(1);
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            let flag_spread = 0
            if (this.searchForm.name !== '' || this.searchForm.code !== '') {
                flag_spread = 1
            }
            Core.Api.Item.list({
                ...this.searchForm,
                flag_spread,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.expandIconColumnIndex = flag_spread == 1 ? -1 : 0
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
                this.expandedRowKeys = []
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
                    Core.Api.Item.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },

        handleStatusChange(record) {
            let _this = this;
            let name = record.status === -1 ? '上架' : '下架'
            this.$confirm({
                title: `确定要${name}该商品吗？`,
                okText: '确定',
                okType: record.status === -1 ?  '' : 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Item.updateStatus({id: record.id}).then(() => {
                        _this.$message.success(name + '成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleStatusChange err", err);
                    })
                },
            });
        },

        // 表格行展开-查看同规格商品
        handleTableExpand(expanded, record) {
            if (expanded) {
                if (record.device_ports) {
                    this.expandedRowKeys.push(record.id)
                } else {
                    Core.Api.Item.listBySet({set_id: record.set_id}).then(res => {
                        console.log('handleTableExpand res:', res)
                        let list = res.list.filter(i => i.flag_default !== 1)
                        record.children = list
                    }).finally(() => {
                        this.expandedRowKeys.push(record.id)
                    })
                }
            } else {
                let index = this.expandedRowKeys.indexOf(record.id)
                this.expandedRowKeys.splice(index, 1)
            }
        },

        // 上传文件
        handleMatterChange({file, fileList}) {
            console.log("handleMatterChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                } else {
                    return this.$message.success('上传成功');
                }
            }
            this.upload.fileList = fileList
        },
        getSalesAreaList() {
            Core.Api.SalesArea.list().then(res => {
                this.salesList = res.list;
            });
        },
        handleSalesAreaByIdsConfirm() {
            if (this.salesAreaIds.length <= 0){
                return this.$message.error('请选择销售区域');
            }
            Core.Api.SalesAreaItem.batchSave({
                item_id_list: this.selectedRowKeys,
                sales_area_id_list: this.salesAreaIds,
            }).then(res =>{
                this.getTableData();
                this.handleSalesAreaByIdsClose();
            })

        },
        handleSalesAreaByIdsShow() {
            if (this.selectedRowKeys.length <= 0){
                return this.$message.error('请选择商品');
            }
            this.getSalesAreaList();
            this.salesAreaVisible = true;
        },
        handleSalesAreaByIdsClose() {
            this.salesAreaVisible = false;
            this.salesList = [];
            this.salesAreaIds = [];
        },
    }
};
</script>

<style lang="less" scoped>
#ItemList {
    .list-container {
        .title-container {
            .btns-area {
                .file-upload-btn {
                    margin-right: 15px;
                }
            }
        }
    }
}
</style>
