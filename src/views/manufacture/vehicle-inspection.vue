<template>
    <div id="incomingInspection">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">整车完检</div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">整车码:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.vehicle_uid"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">车架码:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.vehicle_code"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">生产订单号:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.production_uid"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">物料编码:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.materiel_code"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">物料名称:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.materiel_name"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">质检员:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.inspector"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                        <div class="key">质检时间:</div>
                        <div class="value">
                            <TimeSearch @search="handleOtherSearch" ref="TimeSearch" />
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                </div>
            </div>
            <div class="operate-container flex">
                <a-button :disabled="exportDisabled" type="primary" @click="handleExportExcel">批量导出</a-button>
                <a-button :disabled="exportDisabled" type="primary" @click="handleExportExcel">全部导出</a-button>
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
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'status'">
                            <div
                                class="status status-bg status-tag"
                                :class="$Util.inspectionStatusColorFilter(text, 'color')"
                            >
                                {{ $Util.inspectionStatusColorFilter(text) }}
                            </div>
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
    </div>
</template>

<script>
import Core from '../../core';
import TimeSearch from '@/components/common/TimeSearch.vue';
import VEHICLE_INSPECTION from '@/core/modules/const/vehicle-inspection';
import axios from 'axios';

export default {
    name: 'incomingInspection',
    components: {
        TimeSearch,
    },
    props: {},
    data() {
        return {
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            searchForm: {
                inspector: undefined, // 质检员名称
                materiel_code: undefined, // 物料编码
                materiel_name: undefined, // 物料名称
                production_uid: undefined, // 生产订单号
                vehicle_code: undefined, // 车架号
                vehicle_uid: undefined, // 整车码
                begin_time: '', // 开始时间
                end_time: '', // 结束时间
            },
            // 表格
            tableData: [
                {
                    status: 1,
                },
            ],
            expandedRowKeys: [],
            expandIconColumnIndex: 0,
            selectedRowKeys: [],
            selectedRowItems: [],
            exportDisabled: false,
        };
    },
    computed: {
        tableColumns() {
            return [
                { title: '整车码', dataIndex: 'vehicle_uid', key: 'item' },
                { title: '车架号', dataIndex: 'vehicle_code', key: 'item' },
                { title: '生产订单号', dataIndex: 'production_uid', key: 'item' },
                { title: '物料编码', dataIndex: 'materiel_code', key: 'item' },
                { title: '物料名称', dataIndex: 'materiel_name', key: 'item' },
                { title: '质检员', dataIndex: 'inspector', key: 'item' },
                { title: '质检时间', dataIndex: 'create_time', key: 'time' },
                { title: '质检结果', dataIndex: 'status', key: 'status' },
            ];
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
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item);
            let routeUrl = '';
            switch (type) {
                case 'detail': // 整车详情
                    routeUrl = this.$router.resolve({
                        path: '/entity/entity-detail',
                        query: { id: item.default_item_id || item.id, set_id: item.set_id },
                    });
                    window.open(routeUrl.href, '_blank');
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
            this.pageChange(1);
            this.$refs.TimeSearch.handleReset();
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.ProductionOrder.inspectionList({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
                scene: VEHICLE_INSPECTION.SCENE_TYPE.INSPECTION,
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
                    this.expandedRowKeys = [];
                });
        },
        excelRequest() {
            // 订单导出
            this.exportDisabled = true;
            let form = Core.Util.deepCopy(this.searchForm);
            for (const key in form) {
                form[key] = form[key] || '';
            }
            return axios({
                url:
                    Core.Const.NET.URL_POINT +
                    `/admin/1/mes-quality-inspect/finished-export?token=${Core.Data.getToken()}`,
                method: 'post',
                responseType: 'blob', //必须设置为blod，不然不能保存
                headers: {
                    token: Core.Data.getToken(),
                    'Content-Type': 'application/json', // 设置请求体的内容类型为JSON
                },
                data: {
                    ...form,
                    scene: VEHICLE_INSPECTION.SCENE_TYPE.INSPECTION,
                    id_list: this.selectedRowKeys,
                },
            });
        },
        handleExportExcel() {
            this.excelRequest().then(res => {
                const blob = new Blob([res.data]);
                const fileName = `整车完检.xlsx`;
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
                this.exportDisabled = false;
            });
        },
    },
};
</script>

<style lang="less">
#incomingInspection {
    .ant-btn.ant-btn-link {
        line-height: 22px;
        margin-left: 8px;
    }
}
.operate-container {
    &.flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
