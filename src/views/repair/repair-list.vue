<template>
    <div id="RepairList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('r.repair_list') }}</div>
                <div class="btns-area">
                    <a-button type="primary" v-if="$auth('DISTRIBUTOR')" @click="routerChange('edit')"><i
                            class="icon i_add" />{{ $t('r.repair_create')
                            }}</a-button>
                </div>
            </div>
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.status" @change='handleSearch'>
                    <a-tab-pane :key="item.key" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">{{ item[$i18n.locale] }}<span :class="item.color">
                                    {{ item.value }}</span></div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <!-- 工单编号 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('search.repair_sn') }}:</div>
                        <div class="value">
                            <a-input :placeholder="$t('search.enter_repair_sn')" v-model:value="searchForm.uid"
                                @keydown.enter='handleSearch' />
                        </div>
                    </a-col>
                    <!-- 车架号 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('search.vehicle_no') }}:</div>
                        <div class="value">
                            <a-input :placeholder="$t('search.enter_vehicle_no')" v-model:value="searchForm.vehicle_no"
                                @keydown.enter='handleSearch' />
                        </div>
                    </a-col>
                    <!-- 车型 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('r.car_type') }}:</div>
                        <div class="value">
                            <!-- <a-select v-model:value="searchForm.model" @change='handleSearch'
                                :placeholder="$t('def.select')">
                                <a-select-option v-for="item of modelTypeList" :key="item.key" :value="item.key">{{
                                    item.name }}</a-select-option>
                            </a-select> -->
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.model"
                                @keydown.enter='handleSearch' />
                        </div>
                    </a-col>
                    <!-- 商品名称 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">{{ $t('r.item_name') }}:</div>
                        <div class="value">
                            <a-input :placeholder="$t(/*请输入商品名称*/'search.enter_item_name')"
                                v-model:value="searchForm.item_name" @keydown.enter='handleSearch' />
                        </div>
                    </a-col>
                    <!-- 客户姓名 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">{{ $t('p.person') }}:</div>
                        <div class="value">
                            <a-input :placeholder="$t(/*请输入客户姓名*/'search.enter_customer_name')"
                                v-model:value="searchForm.customer_name" @keydown.enter='handleSearch' />
                        </div>
                    </a-col>
                    <!-- 工单类型 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('r.device_classify') }}:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.category" @change='handleSearch'
                                :placeholder="$t('def.select')">
                                <a-select-option v-for="item of repairTypeList" :key="item.key" :value="item.value">{{
                                    item[$i18n.locale] }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 创建时间 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('def.create_time') }}:</div>
                        <div class="value">
                            <TimeSearch @search="handleTimeSearch" ref='TimeSearch' />
                        </div>
                    </a-col>
                    <!-- 赔付方式 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('r.payment_method') }}:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.compensation_method" @change='handleSearch'
                                :placeholder="$t('def.select')">
                                <a-select-option v-for="item of payMethodList" :key="item.id" :value="item.status">{{
                                    item[$i18n.locale] }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="operate-container">
                <a-button type="primary" @click="handleExportConfirm" v-if="$auth('repair-order.export')"><i
                        class="icon i_download" />{{ $t('def.export') }}</a-button>
                <!-- <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add" />{{ $t('r.repair_create')
                }}</a-button> -->
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false' @change="handleTableChange">
                    <template #bodyCell="{ column, text, record }">
                        <!-- 工单编号 -->
                        <template v-if="column.key === 'detail' && $auth('repair-order.detail')">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}</a-button>
                            </a-tooltip>
                        </template>
                        <!-- 商品名称 -->
                        <template v-if="column.key === 'item_name'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button v-if="text" type="link" @click="routerChange('item_name', record)">{{ text
                                }}</a-button>
                                <span v-else>-</span>
                            </a-tooltip>
                        </template>
                        <!-- 工单状态 -->
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="$Util.repairStatusFilter(text, 'color')">
                                <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                                    {{ $Util.repairStatusFilter(text, 'key')[$i18n.locale] || '未知' }}
                                </a-tooltip>
                            </div>
                        </template>
                        <!-- 工单类型 -->
                        <template v-if="column.dataIndex === 'device_type'">
                            {{ $Util.deviceTypeFilter(text, $i18n.locale) }}
                        </template>
                        <!-- 赔付方式 -->
                        <template v-if="column.dataIndex === 'compensation_method'">
                            {{ $Util.repairPayMethodFilter(text, $i18n.locale) }}
                        </template>
                        <!-- 工单类型 -->
                        <template v-if="column.dataIndex === 'category'">
                            {{ $Util.repairCategoryTypeFilter(text, $i18n.locale) }}
                        </template>
                        <!-- 工单帐类 -->
                        <template v-if="column.dataIndex === 'service_type'">
                            <div class="status status-bg status-box" :class="$Util.repairServiceFilter(text, 'color')">
                                {{ $Util.repairServiceFilter(text, $i18n.locale) }}
                            </div>
                        </template>
                        <!-- 通用展示 -->
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <!-- 时间 -->
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination v-model:current="currPage" :page-size='pageSize' :total="total" show-quick-jumper
                    show-size-changer show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')" :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']" @change="pageChange" @showSizeChange="pageSizeChange" />
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
const STATUS = Core.Const.REPAIR.STATUS
import TimeSearch from '@/components/common/TimeSearch.vue'
export default {
    name: 'RepairList',
    components: {
        TimeSearch
    },
    props: {},
    data() {
        return {
            STATUS,
            // 加载
            loading: false,
            // 导出
            exportDisabled: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            operMode: '',
            filteredInfo: null,
            searchForm: {
                uid: undefined, // 工单编号
                status: -1, // 列表上方状态切换
                vehicle_no: undefined, // 车架号
                customer_name: undefined, // 客户姓名
                item_name: undefined, // 商品名称
                begin_time: undefined, // 开始时间
                end_time: undefined, // 结束时间
                compensation_method: 0, // 赔付方式
                model: undefined, // 车型
                category: 0, // 工单类型
            },
            // 表格
            tableFields: [],
            tableData: [],
            // tab
            statusStatus: [
                { zh: '全  部', en: 'All', value: '0', color: 'primary', key: -1 },
                { zh: '待审核', en: 'Awaiting review', value: '0', color: 'yellow', key: 30 },
                { zh: '通过', en: 'Passed', value: '0', color: 'green', key: 90 },
                { zh: '不通过', en: 'Rejected', value: '0', color: 'red', key: -30 },
                { zh: '已关闭', en: 'Closed', value: '0', color: 'grey', key: -60 },
            ],
            // 赔付方式
            payMethodList: [
                { zh: '全部', en: 'All', status: 0, key: 1 },
                { zh: '赔付配件', en: 'Compensation Accessories', status: 1, key: 2 },
                { zh: '赔付至账户', en: 'Allocated Account', status: 2, key: 3 }
            ],
            // 工单类型
            repairTypeList: [
                { zh: '全部', en: 'All', value: 0, key: 0 },
                { zh: '维修', en: 'Repair', value: 1, key: 1 },
                { zh: '开箱损', en: 'Unpacking Damage', value: 2, key: 2 },
            ],
            // 车型列表
            modelTypeList: [
                { name: '全部', key: 0 },
                { name: 'SK1', key: 1 },
                { name: 'SK3', key: 2 },
                { name: 'EK1', key: 3 },
                { name: 'EK3', key: 4 }
            ]
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let type = newRoute.meta ? newRoute.meta.type : ''
                this.operMode = type
                this.handleSearchReset(false);
            }
        },
    },
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let columns = [
                { title: this.$t('r.repair_sn'), dataIndex: 'uid', key: 'detail' }, // 工单编号
                { title: this.$t('r.car_type'), dataIndex: 'model', key: 'item' }, // 车型
                { title: this.$t('r.repair_status'), dataIndex: 'status' }, // 工单状态
                { title: this.$t('r.category_type'), dataIndex: 'category' }, // 工单类型
                { title: this.$t('r.payment_method'), dataIndex: 'compensation_method', key: 'compensation_method' }, // 赔付方式
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' }, // 创建时间
            ]
            if (this.$auth('ADMIN')) { // 平台方权限可见
                columns.splice(6, 0,
                    // { title: this.$t('r.warranty'), dataIndex: 'service_type' }, // 工单帐类
                    { title: this.$t('p.person'), dataIndex: 'customer_name', key: 'item' }, // 客户姓名
                    { title: this.$t('p.contact'), dataIndex: 'customer_phone', key: 'item' }, // 联系方式
                )
            }
            return columns
        },
        statusList() {
            return this.statusStatus
        }
    },
    mounted() {
        this.getTableData();
        this.getStatusList();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item)
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-edit",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-detail",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'item_name':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData();
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData();
        },
        handleTableChange(page, filters, sorter) { // 表格搜索
            console.log('handleTableChange filters:', filters)
            this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : ''
            }
            this.pageChange(1);
        },
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleTimeSearch(params) { // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key]
            }
            this.pageChange(1);
        },
        handleSearchReset(flag = true) {  // 重置搜索
            if (flag) {
                this.$refs.TimeSearch.handleReset()
            }
            this.filteredInfo = null
            this.searchForm = {
                uid: undefined, // 工单编号
                status: -1, // 列表上方状态切换
                vehicle_no: undefined, // 车架号
                customer_name: undefined, // 客户姓名
                item_name: undefined, // 商品名称
                begin_time: undefined, // 开始时间
                end_time: undefined, // 结束时间
                compensation_method: 0, // 赔付方式
                model: '', // 车型
                category: 0, // 工单类型
            }
            this.pageChange(1);
        },
        getTableData() {  // 获取 表格 数据            
            this.loading = true;
            console.log('this.searchForm:', this.searchForm)
            Core.Api.Repair.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = res.list;
                /* mock 可以删 */
                // this.tableData = [
                //     {
                //         id: 0,
                //         uid: "CN2222023041300003", //工单编号
                //         model: "SK3银蓝", //车型
                //         status: 30, //工单状态
                //         service_type: 1, //工单账类
                //         category: 1, //工单类型
                //         compensation_method: 1, //赔付方式
                //         create_time: 1690254733, //创建时间
                //         item_name_list: [
                //             "SK3银蓝",
                //             "SK3粉色",
                //             "SK3白色",
                //             "SK3黑色"
                //         ],
                //         frame_Uid_list: [
                //             "R45BB2B60P3000007",
                //             "R45BB2B60P4000008",
                //             "R45BB2B61P3000009",
                //             "R45BB2B6XP3000010"
                //         ]
                //     }
                // ]
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
                // this.getStatusList()
            });
        },
        getStatusList() {  // 获取 状态数量
            this.loading = true;
            Core.Api.Repair.statusList().then(res => {
                console.log("getStatusList res:", res)
                this.statusStatus = this.statusStatus.map(item => {
                    const foundItem = res.status_list.find(data => data.status === item.key);
                    if (foundItem) {
                        item.value = foundItem.amount;
                    }
                    return item;
                });
            }).catch(err => {
                console.log('getStatusList err:', err)
                this.$message.warning(this.$t('error_code.system'))
            }).finally(() => {
                this.loading = false;
            });
        },
        handleExportConfirm() { // 确认工单是否导出
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure') + _this.$t('n.export') + '?',
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.handleRepairExport();
                }
            })
        },
        handleRepairExport() { // 工单导出
            this.exportDisabled = true;

            let form = Core.Util.deepCopy(this.searchForm);
            for (const key in form) {
                form[key] = form[key] || ''
            }
            let exportUrl = Core.Api.Export.repairExport({
                ...form,
                language: this.$i18n.locale === 'en' ? 1 : 0
            })
            console.log("handleRepairExport exportUrl", exportUrl)
            window.open(exportUrl, '_blank')
            this.exportDisabled = false;
        },
    }
};
</script>

<style lang="less" scoped>
.bold-text {
    color: #1D2129;
    font-family: PingFang SC;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}
</style>
