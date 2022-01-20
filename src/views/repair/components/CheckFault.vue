<template>
<div class="CheckFault">
    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
        <template #expandIcon><i class="icon i_expan_l"/></template>
        <a-collapse-panel key="affirm" header="故障确认" class="gray-collapse-panel">
            <div class="panel-content affirm">
                <div class="title"> <i class="icon i_warning"/>共{{ faultSelect.length }}个故障 </div>
                <a-checkbox-group class="fault_select" v-model:value="faultSelect" @change="handleFaultSelect">
                    <a-checkbox v-for="(value,key) of faultMap" :key='key' :value='key'>{{ value }}</a-checkbox>
                </a-checkbox-group>
            </div>
        </a-collapse-panel>
        <a-collapse-panel key="change" header="零部件更换" class="gray-collapse-panel">
            <div class="panel-content change">
                <div class="fault-item" v-for="fault of faultSelect" :key="fault">
                    <div class="fault-title">
                        <span class="fault-name">故障：{{faultMap[fault]}}</span>
                        <ItemSelect @select="handleAddFailItem" :fault-name="fault" :disabled-checked='failData[fault].map(i => i.id)'
                            btn-type='primary' btn-text="添加商品" btn-class="fault-btn"/>
                    </div>
                    <a-table :columns="tableColumns" :data-source="failData[fault]" :row-key="record => record.id" :pagination='false' size="small">
                        <template #bodyCell="{ column , record ,index, text}">

                            <template v-if="column.key === 'money'">
                                ￥{{ $Util.countFilter(text) }}
                            </template>

                            <template v-if="column.key === 'amount'">
                                <a-input-number v-model:value="record.amount" style="width: 66px;"
                                    :min="1" :precision="0" placeholder="请输入" @change="handleItemAmountChange(fault, index)"/>
                            </template>

                            <template v-if="column.key === 'total_price'">
                                ￥{{ $Util.countFilter(record.price * record.amount) }}
                            </template>

                            <template v-if="column.key === 'type'">
                                <a-select v-model:value="record.type" placeholder="维修类型" @change="handleRepairTypeChange(record)" style="width: 100px;">
                                    <a-select-option v-for="(item,index) of repairTypeList" :key="index" :value="item.value">{{item.text}}</a-select-option>
                                </a-select>
                            </template>

                            <template v-if="column.dataIndex === 'bad'">
                                <template v-if="record.type === REPAIR_TYPE.REPLACE">
                                    <template v-if="warehouseFailList.length">
                                        <a-select v-model:value="record.recycle_warehouse_id" placeholder="请选择故障仓" style="width: 120px;">
                                            <a-select-option v-for="item of warehouseFailList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                                        </a-select>
                                    </template>
                                    <a-button v-else type='link' @click="routerChange('warehouse')"><i class="icon i_add"/>新建仓库</a-button>
                                </template>
                                <template v-else>-</template>
                            </template>

                            <template v-if="column.dataIndex === 'new'">
                                <template v-if="record.type !== REPAIR_TYPE.TRANSFER">
                                    <template v-if="record.warehouse_out_list.length">
                                        <a-select v-model:value="record.warehouse_id" placeholder="请选择换新仓" style="width: 120px;margin-right: 10px;">
                                            <a-select-option v-for="item of record.warehouse_out_list" :key="item.id" :value="item.id">
                                                <span>{{ item.name }}(<span :style="item.disabled ? 'color: red;' : ''">{{ item.stock }}</span>)</span>
                                            </a-select-option>
                                        </a-select>
                                        <template v-if="needPurchase(record)">
                                            <a-button type='link' v-if="detail.service_type === SERVICE_TYPE.IN_REPAIR_TIME" @click="routerChange('edit')"><i class="icon i_s_warehouse"/>调货</a-button>
                                            <a-button type='link' v-if="detail.service_type === SERVICE_TYPE.OUT_REPAIR_TIME" @click="routerChange('purchase')"><i class="icon i_goods"/>采购</a-button>
                                        </template>
                                    </template>
                                    <a-button v-else type='link' @click="routerChange('warehouse')">新建仓库</a-button>
                                </template>
                                <template v-else>-</template>
                            </template>

                            <template v-if="column.dataIndex === 'repair'">
                                <template v-if="record.type === REPAIR_TYPE.TRANSFER">
                                    <a-select v-model:value="transferStoreId" placeholder="接收门店" style="width: 120px;">
                                        <a-select-option v-for="item of storeList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                                    </a-select>
                                </template>
                                <template v-else>-</template>
                            </template>

                            <template v-if="column.dataIndex === 'operation'">
                                <a-button type="link" class="danger" @click="handleFailItemDelete(index, fault)"><i class="icon i_delete"/>移除</a-button>
                            </template>
                        </template>
                    </a-table>
                </div>
                <SimpleImageEmpty desc='请先选择故障类型' v-if='!faultSelect.length'/>
            </div>
        </a-collapse-panel>
    </a-collapse>
</div>
</template>


<script>
import Core from '../../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import SimpleImageEmpty from '@/components/common/SimpleImageEmpty.vue';
const REPAIR_TYPE = Core.Const.REPAIR_ITEM.TYPE
export default {
    name: 'RepairDetail',
    components: {
        ItemSelect,
        SimpleImageEmpty,
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
            REPAIR_TYPE, // 维修商品类型
            SERVICE_TYPE: Core.Const.REPAIR.SERVICE_TYPE, // 工单帐类
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            activeKey: ['affirm'],

            tableColumns: [
                {title: '商品名称', dataIndex: 'name'},
                {title: '单价', dataIndex: 'price', key: 'money'},
                {title: '数量(件)', key: 'amount'},
                {title: '总价', key: 'total_price'},
                {title: '维修类型', key: 'type'},
                {title: '故障仓库', dataIndex: 'bad'},
                {title: '换新仓库', dataIndex: 'new'},
                {title: '接收门店', dataIndex: 'repair'},
                {title: '操作', dataIndex: 'operation'},
            ],

            faultMap: {}, // 存放所有可能的故障
            faultSelect: [], // 存放 被选中的故障
            failData: {}, // 存放 零部件更换 商品信息

            repairTypeList: Core.Const.REPAIR_ITEM.TYPE_LIST, // 维修商品类型列表
            warehouseFailList: [], // 故障仓列表
            storeList: [], // 门店列表

            transferStoreId: undefined,
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getFaultData();
        this.getWarehouseList();
        this.getStoreList();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'warehouse': // 新建仓库
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/warehouse-edit",
                    })
                    break;
                case 'purchase': // 采购
                    routeUrl = this.$router.resolve({
                        path: "/purchase/item-list",
                    })
                    break;
                case 'transfer': // 调货
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/transfer-order-list",
                    })
                    break;
            }
            window.open(routeUrl.href, '_blank')
        },

        // 获取门店列表
        getStoreList() {
            Core.Api.Store.listTransfer().then(res => {
                this.storeList = res.list
                this.transferStoreId = res.list[0] ? res.list[0].id : undefined
            });
        },
        // 获取 故障 数据
        getFaultData() {
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
        handleItemAmountChange(name, index = -1) {
            if (index !== -1) {
                this.failData[name][index].warehouse_id = this.getFilstWarehouse(this.failData[name][index])
            }
        },
        // 商品维修类型改变
        handleRepairTypeChange(record) {
            switch (record.type) {
                case REPAIR_TYPE.TRANSFER: // 转单
                    record.change_to_transfer = true
                    break;
                case REPAIR_TYPE.ADD: // 新增
                case REPAIR_TYPE.REPLACE: // 更换
                    record.change_to_transfer = false
                    break;
            }
            this.$emit('getIsTransfer', record.change_to_transfer)
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
            this.handleItemAmountChange(name)
        },

        // 提交故障
        handleFaultSubmit() {
            console.log('this.faultSelect: ', this.faultSelect);
            let itemList = []
            if (!this.faultSelect.length) {
                return this.$message.warning('请选择故障')
            }
            for (const fault of this.faultSelect) {
                if (this.failData[fault].length == 0) {
                    return this.$message.warning('请添加商品')
                }
                for (const item of this.failData[fault]) {
                    if (!item) {
                        return this.$message.warning('请添加商品')
                    }
                    item.item_fault_id = Number(fault)

                    if (item.type == 3) { // 选择转单时 校验负责人
                        if (this.transferStoreId) {
                            item.store_id = this.transferStoreId
                        } else {
                            return this.$message.warning('请选择转单门店')
                        }
                    }
                    console.log('item.is_stock: ', item.is_stock);
                    if (!item.is_stock && !item.change_to_transfer) { // 仓库货量不足
                        this.$message.warning('仓库库存不足,请及时调仓或采购')
                    }
                    itemList.push(item)
<<<<<<< HEAD
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
                return this.$message.warning('请选择转单门店')
=======
                }
>>>>>>> abfe7da9cc77ec3c8f6be4dfb9ae66ca25c88c97
            }
            console.log('handleFaultSubmit itemList:', itemList)
            Core.Api.RepairItem.saveList({
                repair_order_id: this.id,
                item_list: itemList,
                store_id: this.transferForm.store_id,
            }).then(() => {
                this.$message.success('操作成功');
                this.$emit('submit')
            })
        },
    }
};
</script>

<style lang="less">
.CheckFault {
    .panel-content.change {
        .fault-item {
            margin-bottom: 30px;
            .fault-title {
                .fsb();
                margin-bottom: 13px;
                .fault-name {
                    font-weight: 500;
                    font-size: 12px;
                    line-height: 22px;
                    color: rgba(0, 0, 0, 0.85);
                }
                .fault-btn {
                    border-radius: 2px;
                    height: 32px;
                }
            }
        }
    }
}
</style>
