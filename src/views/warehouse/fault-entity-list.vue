<template>
    <div id="FaultEntityList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ title }}</div>
                <a-button type="primary" @click="handleFaultItemShow()" v-if="type !== 'pending' && !$auth('ADMIN')">
                    <i class="icon i_add" />新增故障件
                </a-button>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">故障类型:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.item_fault_id"
                                placeholder="请选择产品故障类型"
                                show-search
                                option-filter-prop="children"
                            >
                                <a-select-option
                                    v-for="faultType of faultTypeList"
                                    :key="faultType.id"
                                    :value="faultType.id"
                                >
                                    {{ faultType.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">所属分销商:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.distributor_id"
                                placeholder="请选择分销商"
                                @change="handleSearch"
                                show-search
                                option-filter-prop="children"
                            >
                                <a-select-option v-for="item of distributorList" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">所属零售商:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.agent_id"
                                placeholder="请选择零售商"
                                @change="handleSearch"
                                show-search
                                option-filter-prop="children"
                            >
                                <a-select-option v-for="item of agentList" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">所属门店:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.store_id"
                                placeholder="请选择门店"
                                @change="handleSearch"
                                show-search
                                option-filter-prop="children"
                            >
                                <a-select-option v-for="item of storeList" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value"><TimeSearch @search="handleOtherSearch" ref="TimeSearch" /></div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
                </div>
            </div>
            <div class="operate-container" v-if="type === 'pending'">
                <a-button type="primary" @click="handleEntryShow('batch')" :disabled="!selectedRowItems.length"
                    >批量入库</a-button
                >
                <a-button type="primary" @click="handleAuditShow('batch')" :disabled="!selectedRowItems.length"
                    >批量审核</a-button
                >
            </div>
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    :row-selection="type === 'pending' ? rowSelection : null"
                >
                    <template #bodyCell="{ column, record, text }">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                    text || '-'
                                }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'org_type'">
                            {{ $Util.userTypeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'service_type'">
                            {{ $Util.repairServiceFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="$Util.faultStatusFilter(text, 'color')">
                                {{ $Util.faultStatusFilter(text) }}
                            </div>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button
                                type="link"
                                @click="handleFaultItemShow(record)"
                                v-if="
                                    type !== 'pending' &&
                                    !$auth('ADMIN') &&
                                    [STATUS.WAIT_AUDIT, STATUS.INIT].indexOf(record.status) != -1
                                "
                                ><i class="icon i_edit" />编辑</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleEntryShow('', record)"
                                v-if="
                                    type == 'pending' &&
                                    record.org_type !== LOGIN_TYPE.ADMIN &&
                                    record.status === STATUS.AUDIT_SUCCESS
                                "
                                ><i class="icon i_s_warehouse" />入库</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleAuditShow('', record)"
                                v-if="type == 'pending' && record.status === STATUS.WAIT_AUDIT"
                                ><i class="icon i_audit" />审核</a-button
                            >
                            <a-button type="link" @click="handleDelete(record.id)" class="danger"
                                ><i class="icon i_delete" />删除</a-button
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
        <template class="modal-container">
            <a-modal
                v-model:visible="modalShow"
                title="新增故障件"
                class="fault-entity-modal"
                :after-close="handleFaultItemClose"
            >
                <div class="form-item required">
                    <div class="key">所属仓库:</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.warehouse_id"
                            placeholder="请选择仓库"
                            show-search
                            option-filter-prop="children"
                            :disabled="!!form.id"
                        >
                            <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">故障件编号:</div>
                    <div class="value">
                        <a-input v-model:value="form.uid" placeholder="请输入故障件编号" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">维修单号:</div>
                    <div class="value">
                        <a-input
                            v-model:value="form.source_uid"
                            placeholder="请输入维修单编号"
                            @blur="handleSearchFrameNum"
                        />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">故障原因:</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.item_fault_id"
                            placeholder="请选择产品故障原因"
                            show-search
                            option-filter-prop="children"
                        >
                            <a-select-option
                                v-for="faultType of faultTypeList"
                                :key="faultType.id"
                                :value="faultType.id"
                            >
                                {{ faultType.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">故障件:</div>
                    <div class="value item-display">
                        <ItemSelect
                            @select="handleSelectItem"
                            :disabled-checked="[form.item_id]"
                            :radio-mode="true"
                            btn-type="primary"
                            :btnText="$t('i.select_item')"
                            btn-class="select-item-btn"
                        />
                        <div v-if="!$Util.isEmptyObj(selectItem)">
                            <img :src="$Util.imageFilter(selectItem.logo)" alt="" style="max-width: 60px" />
                            {{ selectItem.name }}
                        </div>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">故障件实例:</div>
                    <div class="value">
                        <a-input
                            v-model:value="form.entity_uid"
                            placeholder="请输入故障件实例号"
                            @blur="handleSearchEntity"
                        />
                    </div>
                </div>
                <template #footer>
                    <a-button @click="handleFaultItemSubmit" type="primary">确定</a-button>
                    <a-button @click="handleFaultItemClose">取消</a-button>
                </template>
            </a-modal>
            <a-modal v-model:visible="auditShow" title="审核" class="audit-modal" :after-close="handleAuditClose">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">审核结果:</div>
                        <a-radio-group v-model:value="auditForm.audit_result">
                            <a-radio :value="AUDIT_TYPE.SUCCESS">通过</a-radio>
                            <a-radio :value="AUDIT_TYPE.FAIL">不通过</a-radio>
                        </a-radio-group>
                    </div>
                    <div class="form-item textarea required" v-if="auditForm.audit_result === AUDIT_TYPE.FAIL">
                        <div class="key">原因:</div>
                        <div class="value">
                            <a-textarea
                                v-model:value="auditForm.audit_message"
                                placeholder="请输入不通过原因"
                                :auto-size="{ minRows: 2, maxRows: 6 }"
                                :maxlength="99"
                            />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="handleAuditClose">取消</a-button>
                    <a-button @click="handleAuditSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
            <a-modal v-model:visible="entryShow" title="入库" class="entry-modal" :after-close="handleEntryClose">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">所属仓库:</div>
                        <div class="value">
                            <a-select
                                v-model:value="entryForm.warehouse_id"
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
                    <a-button @click="handleEntryClose">取消</a-button>
                    <a-button @click="handleEntrySubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import TimeSearch from '@/components/common/TimeSearch.vue';
const FAULT_ENTITY = Core.Const.FAULT_ENTITY;
const LOGIN_TYPE = Core.Const.LOGIN.TYPE;
const STATUS = Core.Const.FAULT_ENTITY.STATUS;

export default {
    name: 'FaultEntityList',
    components: {
        ItemSelect,
        TimeSearch,
    },
    props: {},
    data() {
        return {
            type: '',
            loginType: Core.Data.getLoginType(),
            AUDIT_TYPE: FAULT_ENTITY.AUDIT_TYPE,
            LOGIN_TYPE,
            STATUS,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            storeList: [], // 门店列表
            distributorList: [], //分销商列表
            agentList: [], // 零售商列表
            warehouseList: [], // 所处仓库列表
            faultTypeList: [], // 产品故障类型列表
            searchForm: {
                store_id: undefined,
                agent_id: undefined,
                distributor_id: undefined,
                item_fault_id: undefined,
                begin_time: '',
                end_time: '',
                need_handle: 0,
            },
            // 表格
            tableData: [],
            selectedRowKeys: [],
            selectedRowItems: [],
            tableColumns: [
                { title: '故障件编号', dataIndex: 'uid' },
                { title: '车架号', dataIndex: 'vehicle_no', key: 'item' },
                { title: '状态', dataIndex: 'status' },
                { title: '维修单号', dataIndex: 'source_uid', key: 'detail' },
                { title: '工单帐类', dataIndex: 'service_type' },
                { title: '所属单位', dataIndex: 'source_org_name' },
                { title: '所属仓库', dataIndex: 'warehouse_name', key: 'item' },
                { title: '商品', dataIndex: ['item', 'name'], key: 'item' },
                { title: '故障原因', dataIndex: 'item_fault_name', key: 'item' },
                { title: '故障件实例', dataIndex: 'entity_uid', key: 'item' },
                { title: '审核人', dataIndex: 'audit_user_name', key: 'item' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right' },
            ],
            // 弹框
            modalShow: false,
            form: {
                id: '',
                warehouse_id: undefined,
                item_id: '',
                item_fault_id: undefined,
                source_uid: '',
                source_id: '',
                source_type: 200,
                uid: '',
                entity_uid: '',
                vehicle_no: '',
                entity_id: '',
            },
            selectItem: {},
            // 审核
            auditShow: false,
            auditForm: {
                ids: '',
                audit_result: undefined,
                audit_message: '',
            },
            // 入库
            entryShow: false,
            entryForm: {
                ids: '',
                warehouse_id: undefined,
            },
            entityDetail: {},
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let type = newRoute.meta ? newRoute.meta.type : '';
                this.type = type;
                this.handleSearchReset(false);
            },
        },
    },
    computed: {
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys;
                    this.selectedRowItems = selectedRows;

                    console.log('rowSelection onChange this.selectedRowKeys', this.selectedRowKeys);
                },
                /* getCheckboxProps: record => ({
                    disabled: record.org_type === LOGIN_TYPE.ADMIN
                }), */
            };
        },
        title() {
            return this.type !== 'pending' ? '故障件列表' : '待处理故障件列表';
        },
    },
    mounted() {
        this.getWarehouseList();
        this.getFaultTypeList();
        this.getStoreList();
        this.getAgentList();
        this.getDistributorList();
    },
    methods: {
        // 维修单详情入口
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/repair/repair-detail',
                        query: { id: item.source_id },
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
        handleSearchReset(flag = true) {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            if (flag) {
                this.$refs.TimeSearch.handleReset();
            }
            this.pageChange(1);
        },
        // 获取列表数据
        getAgentList() {
            // 获取零售商列表
            Core.Api.Agent.list().then(res => {
                console.log('this.agentList', res.list);
                this.agentList = res.list;
            });
        },
        getStoreList() {
            // 获取门店列表
            Core.Api.Store.list().then(res => {
                console.log('this.storeList', res.list);
                this.storeList = res.list;
            });
        },
        getDistributorList() {
            // 获取分销商列表
            Core.Api.Distributor.list().then(res => {
                console.log('this.distributorList', res.list);
                this.distributorList = res.list;
            });
        },
        getWarehouseList() {
            // 获取仓库数据
            const type = 2; // 残次仓类型
            Core.Api.Warehouse.listAll({ type }).then(res => {
                this.warehouseList = res.list;
            });
        },
        getFaultTypeList() {
            // 获取产品故障类型\
            Core.Api.Fault.list().then(res => {
                console.log('this.faultTypeList', res.list);
                this.faultTypeList = res.list;
            });
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            if (this.type === 'pending') {
                this.searchForm.need_handle = 1;
            } else {
                this.searchForm.need_handle = 0;
            }
            Core.Api.FaultEntity.list({
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
                    Core.Api.FaultEntity.delete({ id })
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

        // 通过维修单号找车架号
        handleSearchFrameNum() {
            const uid = this.form.source_uid;
            if (uid === '') {
                return;
            }
            console.log('handleSearchFrameNum', uid);
            this.form.source_id = '';
            this.form.item_id = '';
            Core.Api.Repair.detailByUid({ uid })
                .then(res => {
                    console.log('handleSearchFrameNum', res);
                    if (!res.detail) {
                        this.$message.warning('该维修单不存在，请输入正确的维修单号');
                    } else {
                        this.form.source_id = res.detail.id;
                        this.form.vehicle_no = res.detail.vehicle_no;
                    }
                })
                .catch(err => {
                    this.$message.warning('获取维修单信息失败');
                });
        },
        // 通过故障件实例号查故障件信息
        handleSearchEntity() {
            let uid = this.form.entity_uid;
            if (uid === '') {
                return;
            }
            Core.Api.Entity.detailByUid({ uid: uid })
                .then(res => {
                    if (res.detail.item_id !== this.form.item_id) {
                        return this.$message.warning('该故障件实例和故障件种类不符');
                    } else {
                        this.form.entity_id = res.detail.id;
                    }
                })
                .catch(err => {
                    this.$message.warning('该故障件实例不存在');
                });
        },
        // 故障件表单
        handleFaultItemShow(record) {
            // 新增故障件表单创建
            if (record) {
                console.log('handleFaultItemShow record', record);
                for (const key in this.form) {
                    this.form[key] = record[key];
                }
                this.selectItem = Core.Util.deepCopy(record.item);
            }
            console.log('handleFaultItemShow this.form', this.form);
            console.log('handleFaultItemShow this.selectItem', this.selectItem);
            this.modalShow = true;
        },
        handleFaultItemSubmit() {
            // 新增故障件提交
            let form = Core.Util.deepCopy(this.form);
            console.log('handleFaultItemSubmit', form);
            console.log('this.form.source_uid', this.form.source_uid);
            if (!form.warehouse_id) {
                return this.$message.warning('请选择所处仓库');
            }
            if (!form.item_id) {
                return this.$message.warning('请选择商品');
            }
            if (!form.item_fault_id) {
                return this.$message.warning('请选择故障原因');
            }
            if (!form.source_uid) {
                return this.$message.warning('请输入工单编号');
            }
            if (form.source_uid && form.source_id === '') {
                return this.$message.warning('请输入正确的维修单号');
            }
            if (form.entity_uid && form.entity_id === '') {
                return this.$message.warning('该故障件实例和故障件种类不符');
            }
            console.log('form', form);
            Core.Api.FaultEntity.save(form)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.getTableData();
                    this.handleFaultItemClose();
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        handleFaultItemClose() {
            // 新增故障件表单关闭
            this.modalShow = false;
            Object.assign(this.form, this.$options.data().form);
            this.selectItem = {};
        },

        handleSelectItem(ids, items) {
            console.log('handleSelectItem', ids, items);
            this.form.item_id = ids[0];
            this.selectItem = items[0];
            this.form.entity_uid = '';
        },

        // 审核
        handleAuditShow(type, record) {
            // 显示弹框
            if (type === 'batch') {
                this.auditForm.ids = this.selectedRowKeys.join(',');
            } else {
                this.auditForm.ids = record.id;
            }
            this.auditShow = true;
            console.log('handleAuditShow', this.auditForm.ids);
        },
        handleAuditClose() {
            // 关闭弹框
            this.auditShow = false;
            this.selectedRowKeys = [];
            this.selectedRowItems = [];
            this.auditForm = {
                ids: '',
                audit_result: undefined,
                audit_message: '',
            };
        },
        handleAuditSubmit() {
            // 审核提交
            if (this.selectedRowItems.length) {
                for (const item of this.selectedRowItems) {
                    if (item.status !== this.AUDIT_TYPE.WAIT) {
                        return this.$message.warning('请勿审核已审核的故障件');
                    }
                }
            }
            if (!this.auditForm.audit_result) {
                return this.$message.warning('请选择审核结果');
            }
            Core.Api.FaultEntity.batchAudit(this.auditForm)
                .then(() => {
                    this.$message.success(this.$t('pop_up.audit_finish'));
                    this.getTableData();
                    this.handleAuditClose();
                })
                .catch(err => {
                    console.log('handleAuditSubmit err', err);
                });
        },

        // 入库
        handleEntryShow(type, record) {
            if (type === 'batch') {
                this.entryForm.ids = this.selectedRowKeys.join(',');
            } else {
                this.entryForm.ids = record.id;
            }
            this.getWarehouseList();
            this.entryShow = true;
        },

        handleEntryClose() {
            this.entryShow = false;
            this.selectedRowKeys = [];
            this.selectedRowItems = [];
            this.entryForm = {
                ids: '',
                warehouse_id: undefined,
            };
        },
        handleEntrySubmit() {
            if (this.selectedRowItems.length) {
                for (const item of this.selectedRowItems) {
                    if (item.org_type === LOGIN_TYPE.ADMIN) {
                        return this.$message.warning('请不要入库已入库的故障件');
                    }
                }
            }
            if (!this.entryForm.warehouse_id) {
                this.$message.warning('请选择所处仓库');
            } else {
                Core.Api.FaultEntity.batchRecycle(this.entryForm)
                    .then(() => {
                        this.$message.success(this.$t('pop_up.inbound_finish'));
                        this.getTableData();
                        this.handleEntryClose();
                    })
                    .catch(err => {
                        console.log('handleEntrySubmit err', err);
                    });
            }
        },
    },
};
</script>

<style lang="less">
// #WarehouseList {}
.fault-entity-modal {
    .value {
        font-size: 12px;
        color: #8090a6;
        .fac();
        display: flex;

        .amount {
            margin-left: 5px;
        }

        .select-item-btn {
            height: 32px;
            margin-right: 10px;
        }

        .item-display {
            display: flex;

            img {
                max-width: 60px;
            }
        }
    }
}
</style>
