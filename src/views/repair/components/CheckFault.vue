<template>
    <div class="CheckFault">
        <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
            <template #expandIcon><i class="icon i_expan_l"/></template>
            <a-collapse-panel key="affirm" header="故障确认" class="gray-collapse-panel">
                <div class="panel-content affirm">
                    <div class="title">
                        <i class="icon i_warning"/>共{{ faultSelect.length }}个故障
                    </div>
                    <a-checkbox-group class="fault_select" v-model:value="faultSelect" @change="handleFaultSelect">
                        <a-checkbox v-for="(value,key) of faultMap" :key='key' :value='key' @change="handleFaultItemSelect(key)">
                            {{ value }}
                        </a-checkbox>
                    </a-checkbox-group>
                </div>
            </a-collapse-panel>
            <a-collapse-panel key="change" header="零部件更换" class="gray-collapse-panel">
                <div class="panel-content">
                    <a-collapse v-model:activeKey="failActive" ghost class="collapse-item" >
                        <a-collapse-panel v-for="fault of faultSelect" :key="fault" :header="faultMap[fault]" class="fault-item">
                            <template #extra>
                                <ItemSelect btnType='link' @select="handleAddFailItem" :fault-name="fault"
                                    :disabled-checked='failData[fault].map(i => i.id)' btn-text="添加商品"/>
                            </template>
                            <a-table :columns="tableColumns" :data-source="failData[fault]"
                                     :row-key="record => record.id" :pagination='false' size="small">
                                <template #bodyCell="{ column , record ,index, text}">

                                    <template v-if="column.dataIndex === 'type'">
                                        <a-select v-model:value="record.type" placeholder="请选择商品类型" @change="itemTypeChange(record)">
                                            <a-select-option v-for="(item,index) of repairItemTypeList" :key="index" :value="item.value">{{item.text}}</a-select-option>
                                        </a-select>
                                    </template>

                                    <template v-if="column.dataIndex === 'repair'">
                                        <template v-if="record.type === repairItemType.TRANSFER">
                                            <a-button @click="handleTransfer()">选择</a-button>
                                        </template>
                                        <template v-else>
                                            -
                                        </template>
                                    </template>

                                    <template v-if="column.dataIndex === 'amount'">
                                        <a-input-number v-model:value="record.amount" :min="1" :precision="0" placeholder="请输入" @change="handleItemAmountChang(fault, index)"/>件
                                    </template>

                                    <template v-if="column.dataIndex === 'bad'">
                                        <template v-if="warehouseFailList.length > 0 && record.type === repairItemType.REPLACE">
                                            <a-select v-model:value="record.recycle_warehouse_id" placeholder="请选择故障仓">
                                                <a-select-option v-for="item of warehouseFailList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                                            </a-select>
                                        </template>
                                        <template v-else-if="warehouseFailList.length === 0 && record.type === repairItemType.REPLACE">
                                            <a-button type='link' @click="routerChange('editWarehouse')">新建仓库</a-button>
                                        </template>
                                        <template v-else>
                                            -
                                        </template>
                                    </template>

                                    <template v-if="column.dataIndex === 'new'">
                                        <template v-if="record.warehouse_out_list.length > 0 && (record.type === repairItemType.ADD || record.type === repairItemType.REPLACE)">
                                            <a-select v-model:value="record.warehouse_id" placeholder="请选择换新仓">
                                                <a-select-option v-for="item of record.warehouse_out_list" :key="item.id" :value="item.id">
                                                    <span>{{ item.name }}(<span :style="item.disabled ? 'color: red;' : ''">{{ item.stock }}</span><span>)</span></span>
                                                </a-select-option>
                                            </a-select>
                                            <!-- 区分帐类 start -->
                                            <template v-if="detail.service_type === serviceType.IN_REPAIR_TIME">
                                                <a-button type='link' v-if="needPurchase(record)" @click="routerChange('edit')">加仓</a-button>
                                            </template>
                                            <template v-else-if="detail.service_type === serviceType.OUT_REPAIR_TIME">
                                                <a-button type='link' v-if="needPurchase(record)" @click="routerChange('edit')">采购</a-button>
                                            </template>
                                            <template v-else>-</template>
                                            <!-- 区分帐类 end -->
                                        </template>
                                        <template v-else-if="record.warehouse_out_list.length === 0 && record.type !== repairItemType.TRANSFER">
                                            <a-button type='link' @click="routerChange('editWarehouse')">新建仓库</a-button>
                                        </template>
                                        <template v-else>
                                            -
                                        </template>
                                    </template>

                                    <template v-if="column.key === 'money'">
                                        ￥{{ $Util.countFilter(text) }}
                                    </template>

                                    <template v-if="column.dataIndex === 'totle_price'">
                                        <span v-if="record.amount !=undefined">
                                            ￥{{ $Util.countFilter(record.price * record.amount) }}
                                        </span>
                                        <span v-else>￥0</span>
                                    </template>

                                    <template v-if="column.dataIndex === 'operation'">
                                        <a-button type="link" @click="handleFailItemDelete(index, fault)"><i
                                            class="icon i_delete"/> 移除
                                        </a-button>
                                    </template>
                                </template>
                                <template #summary>
                                    <a-table-summary>
                                        <a-table-summary-row>
                                            <a-table-summary-cell :index="0" :col-span="4">合计</a-table-summary-cell>
                                            <a-table-summary-cell :index="1" :col-span="3">
                                                ￥{{ $Util.countFilter(failTotle[fault]) }}
                                            </a-table-summary-cell>
                                        </a-table-summary-row>
                                    </a-table-summary>
                                </template>
                            </a-table>
                        </a-collapse-panel>
                    </a-collapse>
                </div>
            </a-collapse-panel>
        </a-collapse>
        <template class="modal-container">
            <a-modal v-model:visible="transferShow" width="600px" title="转单" @ok="handleTransferSubmit">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">门店</div>
                        <div class="value">
                            <a-select v-model:value="transferForm.store_id" placeholder="请选择门店">
                                <a-select-option v-for="(item, index) of storeList" :key="index" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                </div>
            </a-modal>
        </template>
    </div>
</template>


<script>
import Core from '../../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';

export default {
    name: 'RepairDetail',
    components: {
        ItemSelect,
        VNodes: (_, { attrs }) => { return attrs.vnodes; },
    },
    props: {
        id: {
            type: Number
        },
        detail: {
            type: Object
        }
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            activeKey: ['affirm'],

            tableColumns: [
                {title: '商品名称', dataIndex: 'name'},
                {title: '维修类型', dataIndex: 'type'},
                {title: '数量', dataIndex: 'amount'},
                {title: '故障仓', dataIndex: 'bad'},
                {title: '换新仓', dataIndex: 'new'},
                {title: '金额', dataIndex: 'price', key: 'money'},
                // {title: '金额', dataIndex: 'totle_price'},
                {title: '选择维修工', dataIndex: 'repair'},
                {title: '操作', dataIndex: 'operation'},
            ],

            faultMap: {}, // 存放所有可能的故障
            faultSelect: [], // 存放 被选中的故障

            failData: {},
            failTotle: {},
            failActive: [],

            // 转单
            transferShow: false,
            repairForm: {
                results: undefined,
                audit_message: undefined,
                plan_time: undefined,
                // finish_time: undefined,
            },
            transferForm: {
                store_id: undefined,
            },
            staffList: [], // 工单负责人列表
            storeList: [], // 门店列表

            warehouseFailList: [], // 故障仓列表
            repairItemTypeList: Core.Const.REPAIR_ITEM.TYPE_LIST, // 维修商品类型列表
            repairItemType: Core.Const.REPAIR_ITEM.TYPE, // 维修商品类型
            serviceType: Core.Const.REPAIR.SERVICE_TYPE, // 工单帐类
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getFaultData();
        this.getWarehouseList();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'editWarehouse':    // 新建仓库
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/warehouse-edit",
                        // query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit':    // 仓库采购
                    routeUrl = this.$router.resolve({
                        path: "/caigou/caigou-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        // 显示转单弹窗
        handleTransfer() {
            this.transferShow = true
            this.getStoreList()
        },
        // 转单
        handleTransferSubmit() {
            this.transferShow = false
        },
        // 获取门店列表
        getStoreList() {
            Core.Api.Store.listTransfer().then(res => {
                console.log('getStoreList: res: ', res);
                this.storeList = res.list
            });
        },
        // 商品类型改变
        itemTypeChange(record){
            if (record.type == this.repairItemType.TRANSFER) { // 转单的时候不需要考虑仓库
                record.change_to_transfer = true
                this.$emit('getIsTransfer',true)
            }else{
                record.change_to_transfer = false
                this.$emit('getIsTransfer',false)
            }
            console.log('record: ', record);
        },
        // 故障选择
        handleFaultSelect(val) {
            console.log('handleFaultSelect val:', val)
            if (val.length) {
                if (!this.activeKey.includes('change')) {
                    this.activeKey.push('change')
                }
            }
            this.faultSelect.forEach(it => {
                this.failData[it] = this.failData[it] || []
            })
        },
        handleFaultItemSelect(val) {
            this.failActive.push(val)
        },

        // 添加商品
        async handleAddFailItem(ids, items, name) {
            for (let i = 0; i < items.length; i++) {
                const element = items[i];
                element.amount = 1
                element.type = 2
                element.recycle_warehouse_id = this.warehouseFailList.length ? this.warehouseFailList[0].id : undefined
                element.warehouse_out_list = await this.getWarehouseListByItem(element.id)
                element.warehouse_id = this.getFilstWarehouse(element) || undefined
            }
            this.failData[name].push(...items)
        },
        // 获取故障仓列表
        getWarehouseList() {
            Core.Api.Warehouse.listWithStock({
                type: 2,
                target_id: this.detail.id,
                target_type: this.detail.type
            }).then(res => {
                console.log('getWarehouseList res: ', res.list);
                this.warehouseFailList = res.list
            })
        },
        // 获取换新仓列表
        async getWarehouseListByItem(item_id) {
            try {
                let res = await Core.Api.Warehouse.listWithStock({
                    type: 1,
                    target_id: item_id,
                    target_type: 1
                })
                console.log('getWarehouseListByItem res:', res)
                return res.list
            } catch(err) {
                return []
            }
        },
        // 获取第一个满足库存条件的仓库 （都不满足时返回第一个）
        getFilstWarehouse(record) {
            record.warehouse_out_list.forEach(item => {
                item.disabled = item.stock >= record.amount ? false : true
            })
            let item = record.warehouse_out_list.find(i => !i.disabled)
            if (record.warehouse_out_list.length > 0) {
                return item ? item.id : record.warehouse_out_list[0].id
            }else{
                return null
            }
        },
        // 商品数量变更
        handleItemAmountChang(name, index = -1) {
            this.failTotle[name] = 0
            this.failData[name].forEach(item => {
                if (item.amount > 0) {
                    this.failTotle[name] += item.amount * item.price
                }
            })
            console.log(this.failTotle[name])
            if (index !== -1) {
                this.failData[name][index].warehouse_id = this.getFilstWarehouse(this.failData[name][index])
            }
        },

        // 需要采购（判断 所选仓库库存不够）
        needPurchase(record) {
            if (!record.warehouse_id) { return false }
            let warehouse = record.warehouse_out_list.find(i => i.id === record.warehouse_id)
            // return record.amount > warehouse.stock ? true : false
            if (record.amount > warehouse.stock) {
                record.is_stock = false
                return true
            }else{
                record.is_stock = true
                return false
            }
        },

        // 移除商品
        handleFailItemDelete(index, name) {
            this.failData[name].splice(index, 1)
            this.handleItemAmountChang(name)
        },

        // 提交故障
        handleFaultSubmit() {
            console.log('this.faultSelect: ', this.faultSelect);

            let itemList = []
            let itemFlag = false
            let transferFlag = false
            let stockFlag = false
            this.faultSelect.forEach(fault => {
                if(this.failData[fault].length == 0){
                    itemFlag = true
                }
                this.failData[fault].forEach(item => {
                    item.item_fault_id = Number(fault)
                    if(!item){
                        itemFlag = true
                    }
                    if (item.type == 3) { // 选择转单时 校验负责人
                        if (this.transferForm.store_id) {
                            item.store_id = this.transferForm.store_id
                        }else{
                            transferFlag = true
                        }
                    }
                    console.log('item.is_stock: ', item.is_stock);
                    if (!item.is_stock && !item.change_to_transfer) { // 仓库货量不足
                        stockFlag = true
                    }
                    itemList.push(item)
                })
            })
            if (this.faultSelect.length == 0) {
                return this.$message.warning('请选择故障')
            }
            if (itemFlag) {
                return this.$message.warning('请添加商品')
            }
            if (stockFlag) {
                return this.$message.warning('仓库库存不足请加仓或采购')
            }
            if (transferFlag) {
                return this.$message.warning('请选择转单负责人')
            }
            Core.Api.RepairItem.saveList({
                repair_order_id: this.id,
                item_list: itemList,
                store_id: this.transferForm.store_id,
            }).then(() => {
                this.$message.success('操作成功');
                this.$emit('submit')
            })
        },
        getFaultData() {    // 获取 故障 数据
            this.loading = true;
            // return
            Core.Api.Fault.list({
                page: 0
            }).then(res => {
                console.log("getFaultData res:", res)
                let list = res.list;
                let map = {};
                for (const item of list) {
                    map[item.id] = item.name
                }
                console.log('getFaultData faultMap:', map)
                this.faultMap = map;
            }).catch(err => {
                console.log('getFaultData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less">
.CheckFault {
    .panel-content.change {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .collapse-item {
            width: calc(~'50% - 10px');


            .ant-collapse-item {
                margin-top: 10px;



                .ant-collapse-item.gray-collapse-panel{
                    line-height: 50px;
                }
                .ant-collapse-content-box {
                    padding: 0;
                    .ant-table-thead {
                        display: none;

                    }
                }
            }

            .ant-collapse-header {
                background-color: #F5F8FA;
                height: 40px;
                .fac();
                width: 100%;
                position: relative;

                .ant-collapse-extra {
                    position: absolute;
                    right: 12px;
                }
            }
        }

        .submit-btn {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }
    }
}
</style>
