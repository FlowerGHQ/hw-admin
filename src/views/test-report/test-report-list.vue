<template>
    <div id="TestReportList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">测试报告</div>
            </div>
            <div class="search-container" v-if="$auth('ADMIN')">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="8" class="search-item">
                        <div class="key">UID:</div>
                        <div class="value">
                            <a-input
                                v-model:value="searchForm.device_uid"
                                :placeholder="$t('def.input')"
                                @keydown.enter="handleSearch()"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="8" class="search-item">
                        <div class="key">测试类型:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.type"
                                :placeholder="$t('def.select')"
                                @change="handleSearch()"
                                allow-clear
                            >
                                <a-select-option
                                    v-for="item of TYPE_LIST"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.text"
                                    >{{ item.text }}</a-select-option
                                >
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="8" class="search-item">
                        <div class="key">测试结果:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.status"
                                :placeholder="$t('def.select')"
                                @change="handleSearch()"
                                allow-clear
                            >
                                <a-select-option
                                    v-for="item of STATUS_LIST"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.text"
                                    >{{ item.text }}</a-select-option
                                >
                            </a-select>
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
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.valueFilter(text, 'TEST.TYPE_MAP') }}
                        </template>

                        <template v-if="column.dataIndex === 'status'">
                            <div class="status" :class="$Util.valueFilter(text, 'TEST.STATUS_MAP', 'color')">
                                <i class="icon i_point" />{{ $Util.valueFilter(text, 'TEST.STATUS_MAP') }}
                            </div>
                        </template>

                        <template v-if="column.key === 'time_consumed'">
                            {{ $Util.timeConsumedFilter(record.begin_time, record.end_time) }}
                        </template>

                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title="text">
                                <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>

                        <template v-if="column.key === 'operation'">
                            <ReportDetail :type="record.type" :data="record.data.case_list" />
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

import ReportDetail from './components/ReportDetail.vue';

const TYPE_LIST = Object.values(Core.Const.TEST.TYPE_MAP);
const STATUS_LIST = Object.values(Core.Const.TEST.STATUS_MAP);

export default {
    name: 'TestReportList',
    components: {
        ReportDetail,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 10,
            total: 0,
            TYPE_LIST,
            STATUS_LIST,
            // 搜索

            searchForm: {
                device_uid: '',
                type: undefined,
                status: undefined,
                space: '',
                begin_time: '',
                end_time: '',
            },
            // 表格
            tableColumns: [
                { title: '测试类型', dataIndex: 'type' },
                { title: '测试结果', dataIndex: 'status' },
                { title: '设备UID', dataIndex: 'device_uid', key: 'item' },
                { title: '蓝牙Mac', dataIndex: ['data', 'mac'], key: 'item' },
                { title: 'IMEI', dataIndex: ['data', 'imei'], key: 'item' },
                { title: 'ICCID', dataIndex: ['data', 'iccid'], key: 'item' },
                { title: '测试开始时间', dataIndex: 'begin_time', key: 'time' },
                { title: '测试结束时间', dataIndex: 'end_time', key: 'time' },
                { title: '耗时', key: 'time_consumed' },
                { title: '操作', key: 'operation', fixed: 'right', width: '200px' },
            ],
            tableData: [],
        };
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
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.TestReport.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    let list = res.test_report_list;
                    list.forEach(item => {
                        try {
                            item.data = JSON.parse(JSON.parse(item.data).raw_request_json);
                        } catch (error) {
                            item.data = {};
                        }
                    });
                    this.tableData = list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
// #TestReportList {}
</style>
