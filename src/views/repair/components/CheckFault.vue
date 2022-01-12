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
                                    <template v-if="column.dataIndex === 'amount'">
                                        <a-input-number v-model:value="record.amount" :min="1" :precision="0" placeholder="请输入" @change="inputNumberFail(fault)"/>件
                                    </template>

                                    <template v-if="column.dataIndex === 'bad'">
                                        <span v-if="warehouseFailList.size = 1">
                                            {{ warehouseFailList[0].name + "/" + record.warehouse_out_list.stock }}
                                        </span>
                                        <a-select v-if="warehouseFailList.size > 1" v-model:value="record.warehouse_in_id" placeholder="请选择故障仓">
                                            <a-select-option v-for="item of warehouseFailList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                                        </a-select>
                                        <a-tooltip v-if="warehouseFailList.size = 1" placement="top" :title='text'>
                                            <a-button type="link" @click="routerChange('edit',record)">暂无请新增</a-button>
                                        </a-tooltip>
                                    </template>

                                    <template v-if="column.dataIndex === 'new'">
                                        <a-select v-model:value="record.warehouse_out_id" placeholder="请选择换新仓">
                                            <a-select-option v-for="item of record.warehouse_out_list" :key="item.id" :value="item.id">{{item.name}}({{item.kucun}})</a-select-option>
                                        </a-select>
                                    </template>

                                    <template v-if="column.key === 'money'">
                                        ￥{{ $Util.countFilter(text) }}
                                    </template>

                                    <template v-if="column.dataIndex === 'totle_price'">
                                        <span v-if="record.amount !=undefined">
                                            ￥{{ $Util.countFilter(record.price * record.amount) }}
                                        </span>
                                        <span v-else>
                                            ￥0
                                        </span>
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
                               <!-- <a-collapse v-model:activeKey="exchangeActive" ghost class="collapse-item">
                                   <a-collapse-panel v-for="fault of faultSelect" :key="fault" :header="faultMap[fault]">
                                       <template #extra>
                                           <ItemSelect btnType='link' @change="handleAddExchangeItem" :fault-name="fault" :disabled-checked='exchangeData[fault].map(i => i.id)' btn-text="更换商品"/>
                                       </template>
                                       <a-table :columns="tableColumns" :data-source="exchangeData[fault]"
                                           :row-key="record => record.id" :pagination='false' size="small">
                                           <template #bodyCell="{ column , record ,index,text}">
                                               <a-input-number v-model:value="record.amount"
                                                   :min="0" :precision="0" placeholder="请输入"
                                                   :formatter="value => value ? `${value}件` : value"
                                                   :parser="value => value.replace('件', '')"
                                                   v-if="column.dataIndex === 'amount'"
                                                               @change="inputNumberExchange(fault)"
                                               />
                                               <template v-if="column.dataIndex === 'amount'">
                                                   <a-input-number v-model:value="record.amount" :min="0" :precision="0" placeholder="请输入" @change="inputNumberExchange(fault)"/> 件
                                               </template>
                                               <template v-if="column.key === 'money'">
                                                   ￥{{$Util.countFilter(text)}}
                                               </template>
                                               <template v-if="column.dataIndex === 'totle_price'">
                                                   <span v-if="record.amount !=undefined">
                                                       ￥{{$Util.countFilter(record.price * record.amount)}}
                                                   </span>
                                                   <span v-else>
                                                       ￥0
                                                   </span>

                                               </template>
                                               <template v-if="column.dataIndex === 'operation'">
                                                   <a-button type="link" @click="handleExchangeItemDelete(index, fault)"><i class="icon i_delete"/> 移除</a-button>
                                               </template>
                                           </template>
                                           <template #summary>
                                               <a-table-summary>
                                                   <a-table-summary-row>
                                                       <a-table-summary-cell :index="0" :col-span="3">合计</a-table-summary-cell>
                                                       <a-table-summary-cell :index="1" :col-span="2">￥{{$Util.countFilter(exchangeTotle[fault])}}</a-table-summary-cell>
                                                   </a-table-summary-row>
                                               </a-table-summary>
                                           </template>
                                       </a-table>
                                   </a-collapse-panel>
                               </a-collapse>
                               <div class="submit-btn">
                                   <a-button type="primary" @click="handleFaultSubmit()"><i class="icon i_check_b"/>提交</a-button>
                               </div> -->
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
import Core from '../../../core';
import ItemSelect from '@/components/ItemSelect.vue';

export default {
    name: 'RepairDetail',
    components: {
        ItemSelect
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
                {title: '数量', dataIndex: 'amount'},
                {title: '故障仓', dataIndex: 'bad'}, // ++判断
                {title: '换新仓', dataIndex: 'new'},
                {title: '金额', dataIndex: 'price', key: 'money'},
                {title: '金额', dataIndex: 'totle_price'},
                {title: '操作', dataIndex: 'operation'},
            ],
            editData: [
                {

                }
            ],

            faultMap: {}, // 存放所有可能的故障
            faultSelect: [], // 存放 被选中的故障

            failData: {},
            failTotle: {},
            failActive: [],

            exchangeData: {},
            // exchangeActive: '',
            exchangeTotle: {},

            warehouseFailList: [], // 故障仓列表
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
            console.log('item: ', item);
            return
            let routeUrl = ''
            switch (type) {
                case 'edit':    // 仓库新增
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/warehouse-edit",
                        // query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
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
                this.exchangeData[it] = this.exchangeData[it] || []
            })
        },
        handleFaultItemSelect(val) {
            this.failActive.push(val)
        },

        // 添加商品
        handleAddFailItem(ids, items, name) {
            console.log('handleAddFailItem items:', items)
            let data = items.map(item => {
                item["warehouse_in_id"] = undefined
                item["warehouse_out_id"] = undefined
                item["warehouse_out_list"] = this.getWarehouseListByItem(item.id)
                return item
            })
            this.failData[name].push(...data)
            console.log('handleAddFailItem this.failData:', this.failData)
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
                console.log('getWarehouseList res:', res)
                return res.list 
            } catch(err) {
                return []
            }
        },
        // 计算总价
        inputNumberFail(name) {
            this.failTotle[name] = 0
            this.failData[name].forEach(item => {
                if (item.amount > 0) {
                    this.failTotle[name] += item.amount * item.price
                }
            })
            console.log(this.failTotle[name])
        },

        // 移除商品
        handleFailItemDelete(index, name) {
            this.failData[name].splice(index, 1)
            this.inputNumberFail(name)

        },
        handleExchangeItemDelete(index, name) {
            this.exchangeData[name].splice(index, 1)
        },

        // 提交故障
        handleFaultSubmit() {
            let itemList = []
            this.faultSelect.forEach(fault => {
                this.failData[fault].forEach(item => {
                    item.item_fault_id = Number(fault)
                    item.type = 1
                    itemList.push(item)
                })
                this.exchangeData[fault].forEach(item => {
                    item.item_fault_id = Number(fault)
                    item.type = 2
                    itemList.push(item)
                })
            })
            Core.Api.RepairItem.saveList({
                repair_order_id: this.id,
                item_list: itemList
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
