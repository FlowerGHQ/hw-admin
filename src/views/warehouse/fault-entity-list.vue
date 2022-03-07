<template>
    <div id="FaultEntityList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">故障件列表</div>
                <a-button type="primary" @click="handleFaultOrderShow()"><i
                            class="icon i_add"/>新增故障件
                </a-button>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                        <div class="key">故障类型:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.item_fault_id" placeholder="请选择产品故障类型" show-search option-filter-prop="children">
                                <a-select-option v-for="faultType of faultTypeList" :key="faultType.id" :value="faultType.id">
                                    {{ faultType.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value">
                            <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch" :show-time="defaultTime" :allow-clear='false'>
                                <template #suffixIcon><i class="icon i_calendar"/></template>
                            </a-range-picker>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
                </div>

            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, record, text}">
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
                        <template v-if="column.dataIndex === 'create_time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="handleFaultOrderShow(record)"><i class="icon i_edit"/> 修改</a-button>
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
                    :after-close="handleFaultOrderClose">
                <div class="form-item required">
                    <div class="key">所处仓库:</div>
                    <div class="value">
                        <a-select v-model:value="form.warehouse_id" placeholder="请选择仓库" show-search option-filter-prop="children" :disabled="!!form.item_id" >
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
                        <a-input v-model:value="form.uid" placeholder="请输入故障件实例号 选填" @blur="handleSearchFaultEntity"/>                    
                    </div>
                </div>  
                <template #footer>
                    <a-button @click="handleFaultOrderSubmit" type="primary">确定</a-button>
                    <a-button @click="handleFaultOrderClose">取消</a-button>
                </template>
            </a-modal>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';

export default {
    name: 'FaultEntityList',
    components: {
        ItemSelect,
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
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            searchForm: {
                item_fault_id: undefined
            },
            // 表格
            tableData: [],
            tableColumns: [
                {title: '维修单号', dataIndex: 'source_uid'},
                {title: '机构类型', dataIndex: 'org_type'},
                {title: '所处仓库', dataIndex: 'warehouse_name'},
                {title: '车架编号', dataIndex: 'vehicle_no'},
                {title: '商品', dataIndex: ['item','name'],},  
                {title: '产品故障类型', dataIndex: 'item_fault_name'},
                {title: '检测人', dataIndex: 'audit_user_name'},
                {title: '工单帐类', dataIndex: 'service_type'},
                {title: '状态', dataIndex: 'status'},
                {title: '创建时间', dataIndex: 'create_time'},
                {title: '操作', key: 'operation', fixed: 'right' },
            ],
            // 弹框
            modalShow: false,
            warehouseList: [], // 所处仓库列表
            faultTypeList: [], // 产品故障类型列表
            form: {
                id: undefined,
                warehouse_id: undefined,
                item_id: undefined,
                item_fault_id: undefined,
                source_uid: undefined,
                source_id: undefined,
                service_type: undefined,
                vehicle_no: undefined,              
                source_type: 200,
                uid: undefined
            },
            selectItem: {},
        };
    },
    watch: {},
    computed: {},
    mounted() {
        console.log('mounted this.form', this.form);

        this.getTableData();

        this.getWarehouseList();
        this.getFaultTypeList();
    },
    methods: {
        // routerChange(type, item = {}) {
        //     console.log(item)
        //     let routeUrl = ''
        //     switch (type) {
        //         case 'detail':    // 详情
        //             routeUrl = this.$router.resolve({
        //                 path: "/warehouse/fault-entity-detail",
        //                 query: {id: item.id}
        //             })
        //             window.open(routeUrl.href, '_self')
        //             break;
        //     }
        // },
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
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            console.log('this.searchForm:', this.searchForm)
            this.create_time = []
            this.pageChange(1);
        },
        // 获取列表数据
        getWarehouseList() { // 获取仓库数据  
            const type = 2  // 残次仓类型       
            Core.Api.Warehouse.listAll({type}).then(res => {
                console.log("this.warehouseList", res)
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
                begin_time:this.create_time[0] || '',
                end_time: this.create_time[1] || '',
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
        handleFaultOrderShow(record) {  // 新增故障件表单创建
            if (record) {
                console.log('handleFaultOrderShow record', record);
                for (const key in this.form) {
                    this.form[key] = record[key]
                }
                this.selectItem = Core.Util.deepCopy(record.item)
            }
            console.log('handleFaultOrderShow this.form', this.form);
            console.log('handleFaultOrderShow this.selectItem', this.selectItem);
            this.modalShow = true;
        },
        handleFaultOrderSubmit() { // 新增故障件提交 
            let form = Core.Util.deepCopy(this.form)
            console.log('handleFaultOrderSubmit', form);
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
                // return this.$message.warning('请输入车架号')
                return this.$message.warning('请输入正确的工单编号')
            }
            Core.Api.FaultEntity.save(form).then(() => {
                this.$message.success('保存成功')
                this.getTableData();
                this.handleFaultOrderClose()
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        handleFaultOrderClose() { // 新增故障件表单关闭
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