<template>
<div class="CheckFault">
    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
        <template #expandIcon><i class="icon i_expan_l"/></template>
        <a-collapse-panel key="affirm" :header="$t('r.problem')" class="gray-collapse-panel">
            <div class="panel-content affirm">
                <div class="title"><i class="icon i_warning"/>{{ $t('n.all_total') }}&nbsp;{{ faultSelect.length }}&nbsp;{{ $t('r.faults') }}</div>
                <a-checkbox-group class="fault_select" :value="faultSelect">
                    <a-checkbox v-for="(value,key) of faultMap" :key='key' :value='key' @change="handleFaultSelect">{{ value }}</a-checkbox>
                </a-checkbox-group>
                <div class="title-fault">
                    <FaultEdit :id="id" ref="FaultEdit" @saveFault="getFaultData" btn-type="primary" >{{ $t('r.new_fault') }}</FaultEdit>
                </div>
            </div>
        </a-collapse-panel>
        <a-collapse-panel key="change" :header="$t('r.replacement_items')" class="gray-collapse-panel">
            <div class="panel-content change">
                <div class="fault-item" v-for="fault of faultSelect" :key="fault">
                    <div class="fault-title">
                        <span class="fault-name">{{ $t('r.fault') }}：{{ faultMap[fault] }}</span>
                        <ItemSelect @select="handleAddFailItem" :fault-name="fault"
                            :disabled-checked='failData[fault].map(i => i.id)'
                            btn-type='primary' :btn-text="$t('i.add')" btn-class="fault-btn" v-if="$auth('repair-order.save')"/>
                    </div>
                    <a-table :columns="tableColumns" :data-source="failData[fault]" :scroll="{ x: true }"
                        :row-key="record => record.id" :pagination='false' size="small">
                        <template #headerCell="{title}">
                            {{ $t(title) }}
                        </template>
                        <template #bodyCell="{ column , record ,index, text}">
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.key === 'name'">
                                {{ $i18n.locale === 'zh' ? record.name : record.name_en }}
                            </template>
                            <template v-if="column.dataIndex === 'price'">
                                € {{ record.price || 0 }} 
                                <!-- <a-input-number v-model:value="record.price" style="width: 82px;"
                                    :min="0" :precision="2" placeholder="请输入"/> -->
                            </template>

                            <template v-if="column.key === 'amount'">
                                <a-input-number v-model:value="record.amount" style="width: 66px;"
                                    :min="1" :precision="0" placeholder="请输入" @change="handleItemAmountChange(fault, index)"/> {{ $t('in.item') }}
                            </template>

                            <template v-if="column.key === 'total_price'">
                                € {{ $Util.countFilter(record.price * record.amount, 1) }}
                            </template>

                            <template v-if="column.key === 'type'">
                                <a-select v-model:value="record.type" placeholder="维修类型" @change="handleRepairTypeChange(record)" style="width: 100px;">
                                    <a-select-option v-for="item of repairTypeMap" :key="item.key" :value="item.key">{{ item[$i18n.locale] }}
                                    </a-select-option>
                                </a-select>
                            </template>

                            <template v-if="column.dataIndex === 'bad'">
                                <template v-if="record.type === REPAIR_TYPE.REPLACE && detail.service_type === SERVICE_TYPE.IN_REPAIR_TIME">
                                    <template v-if="warehouseFailList.length">
                                        <a-select v-model:value="record.recycle_warehouse_id" :placeholder="$t('def.select')" style="width: 120px;">
                                            <a-select-option v-for="item of warehouseFailList" :key="item.id" :value="item.id">{{ item.name }}
                                            </a-select-option>
                                        </a-select>
                                    </template>
                                    <a-button v-else type='link' @click="routerChange('warehouse')"><i class="icon i_add"/>{{ $t('wa.add') }}</a-button>
                                </template>
                                <template v-else>-</template>
                            </template>

                            <template v-if="column.dataIndex === 'new'">
                                <template v-if="record.type !== REPAIR_TYPE.TRANSFER">
                                    <template v-if="record.warehouse_out_list.length">
                                        <a-select v-model:value="record.warehouse_id" :placeholder="$t('def.select')" style="width: 120px;margin-right: 10px;">
                                            <a-select-option v-for="item of record.warehouse_out_list" :key="item.id" :value="item.id">
                                                <span>{{ item.name }}(<span :style="item.disabled ? 'color: red;' : ''">{{item.stock }}</span>)</span>
                                            </a-select-option>
                                        </a-select>
                                        <template v-if="needPurchase(record)">
<!--                                            <a-button type='link' v-if="detail.service_type === SERVICE_TYPE.IN_REPAIR_TIME"
                                                @click="routerChange('transfer')"><i class="icon i_s_warehouse"/>调货</a-button>-->
                                            <a-button type='link' v-if="detail.service_type === SERVICE_TYPE.OUT_REPAIR_TIME"
                                                @click="routerChange('purchase')"><i class="icon i_goods"/>{{ $t('r.purchase') }}</a-button>
                                        </template>
                                    </template>
                                    <a-button v-else type='link' @click="routerChange('warehouse')">{{ $t('wa.add') }}</a-button>
                                </template>
                                <template v-else>-</template>
                            </template>

                            <template v-if="column.dataIndex === 'repair'">
                                <template v-if="record.type === REPAIR_TYPE.TRANSFER">
                                    <a-select v-model:value="transferStoreId" placeholder="接收门店" style="width: 120px;">
                                        <a-select-option v-for="item of storeList" :key="item.id" :value="item.id">
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </template>
                                <template v-else>-</template>
                            </template>

                            <template v-if="column.dataIndex === 'operation'">
                                <a-button type="link" class="danger" @click="handleFailItemDelete(index, fault)"><i class="icon i_delete"/>{{ $t('def.remove') }}</a-button>
                            </template>
                        </template>
                    </a-table>
                </div>
                <SimpleImageEmpty :desc="$t('r.type')" v-if='!faultSelect.length'/>
            </div>
        </a-collapse-panel>
    </a-collapse>
    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
        <template #expandIcon ><i class="icon i_expan_l"/> </template>
        <a-collapse-panel key="Remark" :header="$t('r.remark')" class="gray-collapse-panel">
            <div class="panel-content">
                <div class="form-item required textarea">
                    <div class="value">
                        <a-textarea v-model:value="remark" :placeholder="$t('r.fault_description')"
                                    :auto-size="{ minRows: 4, maxRows: 6 }" :maxlength='500'/>
                        <span class="content-length">{{ detail.remark.length }}/500</span>
                    </div>
                </div>
            </div>
        </a-collapse-panel>
    </a-collapse>
</div>
</template>

<script>
import Core from '../../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import SimpleImageEmpty from '@/components/common/SimpleImageEmpty.vue';
import FaultEdit from '@/components/popup-btn/FaultEdit.vue';

const REPAIR_TYPE = Core.Const.REPAIR_ITEM.TYPE
const SERVICE_TYPE = Core.Const.REPAIR.SERVICE_TYPE
export default {
    name: 'RepairDetail',
    components: {
        ItemSelect,
        FaultEdit,
        SimpleImageEmpty,
        VNodes: (_, { attrs }) => { return attrs.vnodes; },
    },
    props: {
        id: {
            type: Number,
        },
        detail: {
            type: Object
        },
        orgId: {
            type: Number,
        },
        orgType: {
            type: Number,
        },
    },
    data() {
        return {
            SERVICE_TYPE,
            REPAIR_TYPE, // 维修商品类型
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            activeKey: ['affirm', 'Remark'],
            faultMap: {}, // 存放所有可能的故障
            faultSelect: [], // 存放 被选中的故障
            failData: {}, // 存放 零部件更换 商品信息

            repairTypeMap: Core.Const.REPAIR_ITEM.TYPE_MAP, // 维修商品类型
            warehouseFailList: [], // 故障仓列表
            storeList: [], // 门店列表
            transferStoreId: undefined,
            remark: "",
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: 'n.name', dataIndex: 'name', key: 'name'},
                {title: 'i.code', dataIndex: 'code', key: 'item'},
                {title: 'i.amount', key: 'amount'},
                {title: 'i.unit_price', dataIndex: 'price'},
                {title: 'i.total_price', key: 'total_price'},
                {title: 'n.type', key: 'type'},
                {title: 'r.warehouse', dataIndex: 'new'},
                {title: 'def.operate', dataIndex: 'operation'},
            ]
            if (this.detail.service_type == SERVICE_TYPE.IN_REPAIR_TIME) {
                columns.splice(6, 0, {title: 'r.defective', dataIndex: 'bad'})
                columns.splice(3, 2)
            }
            return columns
        },
    },
    mounted() {
        this.getFaultData();
        this.getWarehouseList();
        this.getStoreList();
        this.remark = Core.Util.deepCopy(this.detail.remark)
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
                        path: "/mall/vehicle-list",
                    })
                    break;
                case 'transfer': // 调货
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/transfer-order-list",
                    })
                    break;
                case 'fault': // 故障
                    routeUrl = this.$router.resolve({
                        path: "/repair/item-fault-list",
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
                org_id: this.orgId,
                org_type: this.orgType,
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
        handleFaultSelect({target}) {
            let faultSelect = []
            if (target.checked) {
                faultSelect.push(target.value)
            }
            this.faultSelect = faultSelect

            console.log('handleFaultSelect faultSelect:', faultSelect)
            if (faultSelect.length) {
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
                element.price = Core.Util.countFilter(this.$auth('DISTRIBUTOR') ? element.fob_eur : element.price_eur)
                element.type = 2
                element.recycle_warehouse_id = this.warehouseFailList.length ? this.warehouseFailList[0].id : undefined
                element.warehouse_out_list = await this.getWarehouseListByItem(element.id)
                element.warehouse_id = this.getFilstWarehouse(element) || undefined
            }
            console.log('handleAddFailItem items:', items)
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
            } catch (err) {
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
            } else {
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
            if (!record.warehouse_id) {
                return false
            }
            let warehouse = record.warehouse_out_list.find(i => i.id === record.warehouse_id)
            // return record.amount > warehouse.stock ? true : false
            if (record.amount > warehouse.stock) {
                record.is_stock = false
                return true
            } else {
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
                return this.$message.warning(this.$t('def.enter'))
            }
            for (const fault of this.faultSelect) {
                if (this.failData[fault].length == 0) {
                    return this.$message.warning(this.$t('def.enter'))
                }
                for (const item of this.failData[fault]) {
                    if (!item) {
                        return this.$message.warning(this.$t('def.enter'))
                    }
                    item.item_fault_id = Number(fault)

                    if (item.type == REPAIR_TYPE.TRANSFER) {
                        // 转单
                        if (!this.transferStoreId) {
                            return this.$message.warning('请选择转单门店')
                        } else {
                            item.store_id = this.transferStoreId
                            item.warehouse_id = ''
                            item.recycle_warehouse_id = ''
                        }
                    } else if (item.type == REPAIR_TYPE.ADD) {
                        item.recycle_warehouse_id = ''
                    }
                    console.log('item.is_stock: ', item.is_stock);
                    if (!item.is_stock && !item.change_to_transfer) { // 仓库货量不足
                        this.$message.warning(this.$t('r.warn'))
                    }
                    item.price = Math.round(item.price * 100)
                    item.charge = item.price
                    itemList.push(item)
                }
            }
            console.log('handleFaultSubmit itemList:', itemList)
            Core.Api.RepairItem.saveList({
                repair_order_id: this.id,
                item_list: itemList,
                store_id: this.transferStoreId,
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.$emit('submit')
                Core.Api.Repair.remark({
                    id: this.id,
                    remark: this.remark
                }).then(() => {
                    this.$emit('submit')
                })
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
