<template>
    <div id="WayBillList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('wb.waybill_list') }}</div>
                <div class="btns-area">
                    <!--                    <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新建物流</a-button>-->
                    <a-button type="primary" ghost @click="handleCompanyShow()" class="panel-btn">
                        <i class="icon i_list" />物流公司列表
                    </a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('wb.waybill_sn') }}:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('wb.enter_waybill_sn')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('wb.target_type') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.type"
                                @change="handleSearch"
                                :placeholder="$t('wb.enter_target_type')"
                            >
                                <a-select-option
                                    v-for="(val, index) of waybillOptions"
                                    :key="index"
                                    :value="val.value"
                                    >{{ val.text }}</a-select-option
                                >
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                        <div class="key">{{ $t('def.create_time') }}:</div>
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
                    <template #bodyCell="{ column, record, text }">
                        <template v-if="column.dataIndex === 'org_type'">
                            {{ $Util.userTypeFilter(text, $i18n.locale) + ': ' + record.org_name }}
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.waybillTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'company_uid'">
                            {{ $Util.waybillCompanyFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'target_type'">
                            {{ $Util.waybillTargetFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'entry_bill_no'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'lading_bill_no'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'delivery_time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <!--                        <template v-if="column.key === 'time'">-->
                        <!--                        {{ $Util.timeFilter(text) }}-->
                        <!--                        </template>-->
                        <template v-if="column.dataIndex === 'target'">
                            <a-tooltip placement="top" :title="text">
                                <a-button
                                    type="link"
                                    v-for="t in record.target"
                                    @click="routerChange(record.target_type, t)"
                                    >{{ t.uid }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'operation'">
                            <template v-if="!record.default_item_id">
                                <!-- <a-button type='link' @click="routerChange('edit', record)"><i class="icon i_edit"/> 编辑</a-button> -->
                                <a-button type="link" @click="handleModalShow(record)"
                                    ><i class="icon i_detail" /> {{ $t('def.detail') }}</a-button
                                >
                            </template>
                            <a-button type="link" @click="handleDelete(record.id)" class="danger"
                                ><i class="icon i_delete" /> {{ $t('def.delete') }}</a-button
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
        <a-modal v-model:visible="modalShow" :title="$t('wb.waybill_detail')" class="waybill-show-modal">
            <div class="modal-content">
                <a-steps progress-dot direction="vertical">
                    <a-step
                        v-for="(item, index) of waybillInfo.list"
                        :key="index"
                        :title="item.time"
                        :description="item.status"
                    />
                </a-steps>
                <SimpleImageEmpty v-if="!waybillInfo.length" :desc="$t('wb.no_detail')" />
            </div>

            <template #footer>
                <a-button key="back" @click="modalShow = false">{{ $t('pop_up.close') }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';
import SimpleImageEmpty from '@/components/common/SimpleImageEmpty.vue';
import TimeSearch from '@/components/common/TimeSearch.vue';
const TARGET_TYPE = Core.Const.WAYBILL.TARGET_TYPE;
export default {
    name: 'WaybillList',
    components: {
        SimpleImageEmpty,
        TimeSearch,
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
            waybillOptions: Core.Const.WAYBILL.TARGET_TYPE_LIST,
            searchForm: {
                uid: '',
                type: undefined,
                begin_time: '',
                end_time: '',
            },

            tableData: [],
            tableColumns: [
                { title: this.$t('wb.org_type'), dataIndex: 'org_type' },
                { title: this.$t('wb.send_receive'), dataIndex: 'type' },
                { title: this.$t('wb.target_type'), dataIndex: 'target_type' },
                { title: this.$t('wb.company_name'), dataIndex: 'company_uid' },
                { title: this.$t('wb.waybill_sn'), dataIndex: 'uid' },
                { title: this.$t('wb.target_uid'), dataIndex: 'target' },
                { title: this.$t('wb.entry_bill_no'), dataIndex: 'entry_bill_no' }, // 报关单号
                { title: this.$t('wb.lading_bill_no'), dataIndex: 'lading_bill_no' }, // 提单号
                // {title: '寄件人', dataIndex: 'sender'},
                // {title: '寄件人电话', dataIndex: 'sender_phone'},
                { title: this.$t('wb.receiver'), dataIndex: 'receiver' },
                { title: this.$t('wb.receiver_phone'), dataIndex: 'receiver_phone' },
                { title: this.$t('wb.delivery_time'), dataIndex: 'delivery_time' },
                // {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ],

            modalShow: false,
            companyShow: false,
            waybillInfo: [],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
        this.timer = window.setInterval(() => {
            setTimeout(() => {
                this.getTableData();
            }, 0);
        }, 5 * 1000);
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('item', item);
            let routeUrl = '';
            switch (type) {
                case TARGET_TYPE.PURCHASE_ORDER: // 采购单详情
                    // routeUrl = this.$router.resolve({
                    //     path: "/purchase/purchase-order-detail",
                    //     query: {id: item.target_id}
                    // })
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case TARGET_TYPE.REPAIR_ORDER_TRANSFER: // 维修单转单详情
                    routeUrl = this.$router.resolve({
                        path: '/repair/repair-detail',
                        query: { id: item.target_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case TARGET_TYPE.TRANSFER_ORDER: // 维修单调货单详情
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/transfer-order-detail',
                        query: { id: item.target_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                // case TARGET_TYPE.AFTER_SALES_ORDER:  // 售后单详情
                //     routeUrl = this.$router.resolve({
                //         path: "/purchase/",
                //         query: {id: item.target_id}
                //     })
                //     break;
            }
            window.open(routeUrl.href, '_blank');
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
        // 获取 表格 数据
        getTableData() {
            this.loading = true;
            Core.Api.Waybill.list({
                ...this.searchForm,
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

        //模态弹窗
        handleModalShow(record) {
            this.getWaybillInfo(record);
            this.modalShow = true;
        },
        handleCompanyShow(record) {
            this.companyShow = true;
        },
        // 获取 物流单详情
        getWaybillInfo({ uid, company_uid }) {
            Core.Api.Waybill.queryLogistics({
                uid: uid,
                company_uid: company_uid,
            })
                .then(res => {
                    console.log('getWaybillInfo:', res);
                    this.waybillInfo = JSON.parse(res.waybill).result;
                    console.log('getWaybillInfo', this.waybillInfo);
                })
                .catch(err => {
                    console.log('getPurchaseInfo err', err);
                })
                .finally(() => {});
        },

        //删除物流单
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该物流订单吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Waybill.delete({ id })
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
    },
};
</script>

<style lang="less" scoped>
// #DistributorList {}
</style>
