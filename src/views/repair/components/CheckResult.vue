<template>
<div class="CheckResult">
    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
        <template #expandIcon><i class="icon i_expan_l"/></template>
        <a-collapse-panel key="affirm" header="故障确认" class="gray-collapse-panel">
            <div class="panel-content affirm">
                <div class="title">
                    <i class="icon i_warning"/>共{{ faultList.length }}个故障
                </div>
                <div class="fault_select">
                    <div class="item" v-for="(value,index) of faultList" :key="index">
                        {{ faultMap[value] || '-' }}
                    </div>
                </div>
            </div>
        </a-collapse-panel>
        <a-collapse-panel key="change" header="零部件更换" class="gray-collapse-panel">
            <div class="panel-content change">
                <a-table :columns="tableColumns" :data-source="tableData" :row-key="record => {return JSON.stringify(record)}" :pagination='false' size="small">
                    <template #bodyCell="{ column, record, text }">
                        <template v-if="column.dataIndex === 'item_fault_id'">
                            {{ faultMap[text] || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'price'">
                            ￥{{ $Util.countFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'amount'">
                            {{ text }}件
                        </template>
                        <template v-if="column.key === 'total_price'">
                            ￥{{ $Util.countFilter(record.price * record.amount) }}
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            {{repairTypeMap[text]}}
                        </template>
                        <template v-if="column.dataIndex === 'man_hour'">
                            {{ text }}小时
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                    </template>
                    <template #summary>
                        <a-table-summary>
                            <a-table-summary-row>
                                <a-table-summary-cell :index="0" :col-span="3">合计</a-table-summary-cell>
                                <a-table-summary-cell :index="1" :col-span="1">{{ total.amount }}件</a-table-summary-cell>
                                <a-table-summary-cell :index="2" :col-span="4">￥{{ $Util.countFilter(total.price) }}</a-table-summary-cell>
                                <a-table-summary-cell :index="3" :col-span="1">{{ $Util.countFilter(total.man_hour) }}小时</a-table-summary-cell>
                            </a-table-summary-row>
                        </a-table-summary>
                    </template>
                </a-table>
            </div>
        </a-collapse-panel>
    </a-collapse>
</div>
</template>

<script>
import Core from '../../../core';

export default {
    name: 'CheckResult',
    components: {},
    props: {
        id: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {}
            }
        },
    },
    data() {
        return {
            // 加载
            loading: false,

            activeKey: ['affirm', 'change'],

            faultMap: {},
            repairTypeMap: Core.Const.REPAIR_ITEM.TYPE_MAP, // 维修商品类型

            faultList: [],

            tableData: [],
            tableColumns: [
                {title: '故障原因', dataIndex: 'item_fault_id'},
                {title: '商品名称', dataIndex: ['item','name'], key: 'item'},
                {title: '单价', dataIndex: 'price'},
                {title: '数量', dataIndex: 'amount'},
                {title: '总价', key: 'total_price'},
                {title: '维修类型', dataIndex: 'type'},
                {title: '故障仓库', dataIndex: 'recycle_warehouse_name', key: 'item'},
                {title: '换新仓库', dataIndex: 'warehouse_name', key: 'item'},
                // {title: '接收门店', dataIndex: 'store_id'},
                {title: '工时', dataIndex: 'man_hour'},
            ],
        };
    },
    watch: {},
    computed: {
        total() {
            let price = 0,man_hour = 0,amount = 0
            for (const item of this.tableData) {
                price += item.amount * item.price
                amount += item.amount
                man_hour += item.man_hour
            }
            return {price, man_hour, amount}
        },
    },
    mounted() {
        console.log('mounted this.faultMap:', this.faultMap)
        this.getFaultData();
        this.getRepairFaultList();
    },
    methods: {
        // 获取 所有故障类型
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

        getRepairFaultList() {
            Core.Api.RepairItem.faultList({
                repair_order_id: this.id
            }).then(res => {
                console.log('getRepairFaultList res', res)
                this.faultList = res.fault_list.map(i => i.item_fault_id)
                console.log('getRepairFaultList this.faultList', this.faultList)
                this.getRepairItemList();
            })
        },
        getRepairItemList() {
            Core.Api.RepairItem.list({
                repair_order_id: this.id
            }).then(res => {
                console.log('getRepairItemList res', res)
                this.tableData = res.list
            })
        },
    }
};
</script>

<style lang="less">
.CheckResult {
    .panel-content.affirm {
        .fault_select {
            display: flex;

            .item {
                margin-right: 20px;
                font-size: 12px;
                color: #202B3B;
            }
        }
    }

    .panel-content.change {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .ant-table-wrapper {
            width: 100%;
        }
    }
}

</style>
