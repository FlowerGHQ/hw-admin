<template>
    <div id="FaultEntityList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">故障件列表</div>
                <a-button type="primary" @click="handleFaultItemShow()" v-if="type !== 'pending' && $auth('ADMIN')">
                    <i class="icon i_add"/>新增故障件
                </a-button>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">故障类型:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.item_fault_id" placeholder="请选择产品故障类型" show-search option-filter-prop="children">
                                <a-select-option v-for="faultType of faultTypeList" :key="faultType.id" :value="faultType.id">
                                    {{ faultType.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">所属零售商:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.agent_id" placeholder="请选择零售商" @change="handleSearch" show-search option-filter-prop="children">
                                <a-select-option v-for="item of agentList" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">所属门店:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.store_id" placeholder="请选择门店" @change="handleSearch" show-search option-filter-prop="children">
                                <a-select-option v-for="item of storeList" :key="item.id" :value="item.id">
                                    {{item.name}}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value"><TimeSearch @search="handleTimeSearch" ref='TimeSearch'/></div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
                </div>
            </div>
            <div class="operate-container" v-if="type==='pending'">
                <a-button type="primary" @click="handleEntryShow('batch')">批量入库</a-button>
                <a-button type="primary" @click="handleAuditShow('batch')">批量审核</a-button>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false' :row-selection='type==="pending" ? rowSelection : null'>
                    <template #bodyCell="{ column, record, text}">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title='text' >
                                <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'org_type'">
                            {{ $Util.userTypeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'service_type'">
                            {{ $Util.repairServiceFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="$Util.faultStatusFilter(text,'color')">
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
                            <a-button type="link" @click="handleFaultItemShow(record)"><i class="icon i_edit"/> 修改</a-button>
                            <a-button type="link" @click="handleDelete(record.id)" class="danger"><i class="icon i_delete"/> 删除</a-button>
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
                    :show-total="total => `共${total}条`"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
            <a-modal v-model:visible="modalShow" title="新增故障件" class="fault-entity-modal"
                :after-close="handleFaultItemClose">
                <div class="form-item required">
                    <div class="key">所处仓库:</div>
                    <div class="value">
                        <a-select v-model:value="form.warehouse_id" placeholder="请选择仓库" show-search option-filter-prop="children" :disabled="!!form.id" >
                            <a-select-option v-for="warehouse of warehouseList" :key="warehouse.id" :value="warehouse.id">
                                {{ warehouse.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">维修单号:</div>
                    <div class="value">
                        <a-input v-model:value="form.source_uid" placeholder="请输入工单编号" @blur="handleSearchFrameNum"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">产品故障类型:</div>
                    <div class="value">
                        <a-select v-model:value="form.item_fault_id" placeholder="请选择产品故障类型" show-search option-filter-prop="children">
                            <a-select-option v-for="faultType of faultTypeList" :key="faultType.id" :value="faultType.id">
                                {{ faultType.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">故障件:</div>
                    <div class="value item-display" >
                        <ItemSelect @select="handleSelectItem" :disabled-checked='[form.item_id]'
                            :radio-mode='true' btn-type='primary' btnText="选择商品" btn-class="select-item-btn"/>
                        <div v-if="!$Util.isEmptyObj(selectItem)">
                            <img :src="$Util.imageFilter(selectItem.logo)" alt="" />
                            {{selectItem.name}}
                        </div>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">故障件实例:</div>
                    <div class="value">
                        <a-input v-model:value="form.uid" placeholder="请输入故障件实例号" @blur="handleSearchFaultEntity"/>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="handleFaultItemSubmit" type="primary">确定</a-button>
                    <a-button @click="handleFaultItemClose">取消</a-button>
                </template>
            </a-modal>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import TimeSearch from '@/components/common/TimeSearch.vue'
export default {
    name: 'FaultEntityList',
    components: {
        ItemSelect,
        TimeSearch
    },
    props: {},
    data() {
        return {
            type: '',
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            searchForm: {
                item_fault_id: undefined,
                begin_time: '',
                end_time: '',
            },
            // 表格
            tableData: [],
            tableColumns: [
                {title: '车架编号', dataIndex: 'vehicle_no', key: 'item'},
                {title: '状态', dataIndex: 'status'},
                {title: '维修单号', dataIndex: 'source_uid', key: 'detail'},
                {title: '所处机构', dataIndex: 'org_type'},
                {title: '所处仓库', dataIndex: 'warehouse_name', key: 'item'},
                {title: '商品', dataIndex: ['item','name'], key: 'item'},
                {title: '产品故障类型', dataIndex: 'item_fault_name', key: 'item'},
                {title: '检测人', dataIndex: 'audit_user_name', key: 'item'},
                {title: '工单帐类', dataIndex: 'service_type'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right' },
            ],
            // 弹框
            modalShow: false,
            warehouseList: [], // 所处仓库列表
            faultTypeList: [], // 产品故障类型列表
            form: {
                id: '',
                warehouse_id: undefined,
                item_id: '',
                item_fault_id: undefined,
                source_uid: '',
                source_id: '',
                service_type: undefined,
                vehicle_no: '',
                source_type: 200,
                uid: ''
            },
            selectItem: {},
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let type = newRoute.meta ? newRoute.meta.type : ''
                this.type = type
                this.handleSearchReset(false);
            }
        },
    },
    computed: {},
    mounted() {
        this.getWarehouseList();
        this.getFaultTypeList();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'detail':    // 详情
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-detail",
                        query: {id: item.source_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        pageChange(curr) {    // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {    // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {    // 搜索
            this.pageChange(1);
        },
        handleTimeSearch(type, begin_time, end_time) { // 时间搜索
            if (begin_time || end_time) {
                this.searchForm.begin_time = begin_time
                this.searchForm.end_time = end_time
            }
            this.pageChange(1);
        },
        handleSearchReset(flag = true) {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            if (flag) {
                this.$refs.TimeSearch.handleReset()
            }
            this.pageChange(1);
        },
        // 获取列表数据
        getWarehouseList() { // 获取仓库数据
            Core.Api.Warehouse.listAll({type: 2}).then(res => {
                this.warehouseList = res.list
            })
        },
        getFaultTypeList() { // 获取产品故障类型
            Core.Api.Fault.list().then(res => {
                this.faultTypeList = res.list
            })
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            this.loading = false;
            // return
            Core.Api.FaultEntity.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
            // Core.Api.FaultEntity.list({
            //     ...this.searchForm,
            //     begin_time: this.create_time[0] || '',
            //     end_time: this.create_time[1] || '',
            //     page: this.currPage,
            //     page_size: this.pageSize
            // }).then(res => {
            //     console.log("getTableData res:", res)
            //     this.total = res.count;
            //     this.tableData = res.list;
            // }).catch(err => {
            //     console.log('getTableData err:', err)
            // }).finally(() => {
            //     this.loading = false;
            // });
        },

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该故障件吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.FaultEntity.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },

        // 通过维修单号找车架号
        handleSearchFrameNum() {
            const uid = this.form.source_uid
            console.log('handleSearchFrameNum',uid)
            this.form.source_id = ''
            this.form.service_type = ''
            this.form.vehicle_no = ''
            Core.Api.Repair.detailByUid({uid}).then(res => {
                console.log('handleSearchFrameNum', res)
                if (!res || !res.id || !res.service_type || !res.vehicle_no) {
                    this.$message.warning('获取维修单信息失败')
                } else {
                    this.form.source_id = res.id
                    this.form.service_type = res.service_type
                    this.form.vehicle_no = res.vehicle_no
                }
            }).catch(err => {
                this.$message.warning('该维修单不存在，请输入正确的维修单号')
            })
        },
        // 通过故障件实例号查故障件信息
        handleSearchFaultEntity() {
            const uid = this.form.uid
            Core.Api.Entity.detailByUid({uid}).then(res => {
                if(res.item_id !== this.form.item_id) {
                    this.$message.warning('该故障件实例和故障件种类不符')
                }               
            }).catch(err => {
                this.$message.warning('该故障件实例不存在')
            })
        },

        // 故障件表单
        handleFaultItemShow(record) {  // 新增故障件表单创建
            if (record) {
                console.log('handleFaultItemShow record', record);
                for (const key in this.form) {
                    this.form[key] = record[key]
                }
                this.selectItem = Core.Util.deepCopy(record.item)
            }
            console.log('handleFaultItemShow this.form', this.form);
            console.log('handleFaultItemShow this.selectItem', this.selectItem);
            this.modalShow = true;
        },
        handleFaultItemSubmit() { // 新增故障件提交
            let form = Core.Util.deepCopy(this.form)
            console.log('handleFaultItemSubmit', form);
            console.log('this.form.source_uid' , this.form.source_uid)
            console.log('this.form.vehicle_no' , this.form.vehicle_no)
            // 新建故障件列表写完进行补充 必填项
            if (!form.warehouse_id) {
                return this.$message.warning('请选择所处仓库')
            }
            if (!form.item_id) {
                return this.$message.warning('请选择商品')
            }
            if (!form.item_fault_id) {
                return this.$message.warning('请选择产品故障类型')
            }
            if (!form.source_uid) {
                return this.$message.warning('请输入工单编号')
            }
            if (!form.vehicle_no) {
                return this.$message.warning('请输入车架号')
            }
            Core.Api.FaultEntity.save(form).then(() => {
                this.$message.success('保存成功')
                this.getTableData();
                this.handleFaultItemClose()
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        handleFaultItemClose() { // 新增故障件表单关闭
            this.modalShow = false;
            Object.assign(this.form, this.$options.data().form)
            this.selectItem = {};
        },

        handleSelectItem(ids, items) {
            console.log('handleSelectItem', ids, items);
            this.form.item_id = ids[0]
            this.selectItem = items[0]
        }
    }
};
</script>

<style lang="less">
// #WarehouseList {}
.fault-entity-modal {
    .select-item-btn {
        height: 32px;
    }
    .item-display {
        display: flex;
        img {
            max-width:60px
        }
    }
}
</style>