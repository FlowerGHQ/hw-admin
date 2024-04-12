<template>
    <div id="WarehouseTransferList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">调货单列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleModalShow"><i class="icon i_add" />新建调货单 </a-button>
                </div>
            </div>
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.status" @change="handleSearch">
                    <a-tab-pane :key="item.key" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">
                                {{ item.text }}<span :class="item.color">{{ item.value }}</span>
                            </div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">发货仓库:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.from_warehouse_id"
                                placeholder="请选择发货仓库"
                                @change="handleSearch"
                            >
                                <a-select-option
                                    v-for="warehouse of fromWarehouseList"
                                    :key="warehouse.id"
                                    :value="warehouse.id"
                                    >{{ warehouse.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">收货仓库:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.to_warehouse_id"
                                placeholder="请选择收货仓库"
                                @change="handleSearch"
                            >
                                <a-select-option
                                    v-for="warehouse of toWarehouseList"
                                    :key="warehouse.id"
                                    :value="warehouse.id"
                                    >{{ warehouse.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">调货单编号:</div>
                        <div class="value">
                            <a-input
                                placeholder="请输入调货单编号"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <!--                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">调货类型:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" @change="handleSearch" placeholder="请选择出入库类型">
                                <a-select-option v-for="(val, key) in typeMap" :key='key' :value='key'>{{val }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>-->
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value">
                            <TimeSearch @search="handleOtherSearch" ref="TimeSearch" />
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
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
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)"
                                    >{{ text || '-' }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div
                                class="status status-bg status-tag"
                                :class="$Util.warehouseTransferStatusFilter(text, 'color')"
                            >
                                <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                                    {{ $Util.warehouseTransferStatusFilter(text) }}
                                    <template v-if="[STATUS.APPLICANT_AUDIT_REFUSE].includes(record.status)">
                                        <i class="icon i_hint" style="font-size: 12px; padding-left: 6px" />
                                    </template>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.stockRecordFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'target_type'">
                            {{ $Util.transferTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'warehouse_type'">
                            {{ $Util.warehouseTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)"
                                ><i class="icon i_detail" />详情
                            </a-button>
                            <template v-if="record.status === STATUS.INIT">                                
                                <a-button
                                    type="link"
                                    @click="handleCancel(record.id)"
                                    class="danger"
                                    ><i class="icon i_close_c" />取消
                                </a-button>
                            </template>
                            <AuditMaterialPurchase
                                v-if="record.status === STATUS.WAIT_AUDIT"
                                btnType="link"
                                :status="STATUS.APPLICANT_AUDIT"
                                :api-list="['WarehouseTransfer', 'audit']"
                                :invoiceId="record.id"
                                @submit="getTableData"
                                ><i class="icon i_audit" />仓库审核</AuditMaterialPurchase
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
        <!--        新建调货单-->
        <template class="modal-container">
            <a-modal v-model:visible="modalShow" title="调货" :after-close="handleModalClose">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">调货类目：</div>
                        <div class="value">
                            <a-radio-group v-model:value="editForm.target_type">
                                <a-radio :value="10">商品</a-radio>
                                <a-radio :value="30">物料</a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">发货仓库:</div>
                        <div class="value">
                            <a-select
                                v-model:value="editForm.from_warehouse_id"
                                placeholder="请选择发货仓库"
                                show-search
                                option-filter-prop="children"
                            >
                                <a-select-option v-for="item of fromWarehouseList" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">收货仓库:</div>
                        <div class="value">
                            <a-select
                                v-model:value="editForm.to_warehouse_id"
                                placeholder="请选择收货仓库"
                                show-search
                                option-filter-prop="children"
                            >
                                <a-select-option v-for="item of toWarehouseList" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="modalShow = false">取消</a-button>
                    <a-button @click="handleModalSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import TimeSearch from '@/components/common/TimeSearch.vue';
import AuditMaterialPurchase from '../../components/popup-btn/AuditMaterialPurchase.vue';

const STATUS = Core.Const.WAREHOUSE_TRANSFER.STATUS;
const TYPE = Core.Const.WAREHOUSE_TRANSFER.TYPE;
export default {
    name: 'WarehouseTransferList',
    components: {
        TimeSearch,
        AuditMaterialPurchase,
    },
    props: {},
    data() {
        return {
            STATUS,
            TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            targetMap: Core.Const.WAREHOUSE_TRANSFER.COMMODITY_TYPE_MAP, //类目
            fromWarehouseList: [],
            toWarehouseList: [],
            // statusList: Core.Const.WAREHOUSE_TRANSFER.STATUS_MAP,
            statusList: {
                0: { key: 0, color: 'yellow', text: '全部', value: '0' },
                ...Core.Const.WAREHOUSE_TRANSFER.STATUS_MAP,
            },
            searchForm: {
                from_warehouse_id: undefined,
                to_warehouse_id: undefined,
                uid: '',
                status: 0,
                type: undefined,
                begin_time: '',
                end_time: '',
            },
            exportDisabled: false,
            // 表格
            tableData: [],
            tableColumns: [
                { title: '调货单编号', dataIndex: 'uid', key: 'detail' },
                { title: '状态', dataIndex: 'status' },
                { title: '调货类目', dataIndex: 'target_type' },
                { title: '发货仓库', dataIndex: ['from_warehouse', 'name'], key: 'item' },
                { title: '收货仓库', dataIndex: ['to_warehouse', 'name'], key: 'item' },
                { title: '申请人', dataIndex: ['apply_user', 'account', 'name'], key: 'item' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right' },
            ],
            modalShow: false,
            editForm: {
                from_warehouse_id: undefined,
                to_warehouse_id: undefined,
                target_type: '',
            },
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
        this.getToWarehouseList();
        this.getFromWarehouseList();
        this.getStatusList();
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
            console.log('routerChange item:', item);
            let routeUrl = '';
            switch (type) {
                /*case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/warehouse-transfer-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;*/
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/warehouse-transfer-detail',
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
            Core.Api.WarehouseTransfer.list({
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
        getStatusList() {
            // 获取 状态 列表
            Core.Api.WarehouseTransfer.statusList({
                ...this.searchForm,
            })
                .then(res => {
                    console.log('getStatusList res:', res);
                    let total = 0;
                    let list = res.status_list;
                    let statusList = this.statusList;
                    Object.keys(statusList).forEach(key => {
                        list.forEach(item => {
                            if (key == item.status) {
                                statusList[key].value = item.amount;
                                total += item.amount;
                            }
                        });
                    });
                    this.statusList[0].value = total;
                })
                .catch(err => {
                    console.log('getStatusList err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getToWarehouseList() {
            Core.Api.Warehouse.listAll({
                is_authority_warehouse: Core.Const.WAREHOUSE.IS_AUTHORITY_WAREHOUSE.YES,
            }).then(res => {
                this.toWarehouseList = res.list;
            });
        },
        getFromWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.fromWarehouseList = res.list;
            });
        },

        handleCancel(id) {
            let _this = this;
            this.$confirm({
                title: '确定要取消该出入库单吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.WarehouseTransfer.cancel({ id })
                        .then(() => {
                            _this.$message.success(_this.$('pop_up.canceled'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        handleModalShow() {
            // 显示弹框
            this.modalShow = true;
        },
        handleModalClose() {
            // 关闭弹框
            this.modalShow = false;
            Object.assign(this.editForm, this.$options.data().editForm);
        },
        handleModalSubmit() {
            // 提交
            this.loading = true;
            let form = Core.Util.deepCopy(this.editForm);
            if (!form.target_type) {
                return this.$message.warning('请选择调货类目');
            }
            if (!form.from_warehouse_id) {
                return this.$message.warning('请选择发货仓');
            }
            if (!form.to_warehouse_id) {
                return this.$message.warning('请选择收货仓');
            }
            if (form.to_warehouse_id === form.from_warehouse_id) {
                return this.$message.warning('发货仓和收货仓不能相同');
            }
            Core.Api.WarehouseTransfer.save(form)
                .then(() => {
                    this.$message.success(this.$t('pop_up.operate'));
                    this.handleModalClose();
                    this.getTableData();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
#WarehouseTransferList {
    .list-container {
        .title-container {
            .btns-area {
                .file-upload-btn {
                    margin-left: 15px;
                }
            }
        }
    }
}
</style>
