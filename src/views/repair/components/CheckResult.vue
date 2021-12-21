<template>
<div class="CheckResult">
<a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
    <template #expandIcon ><i class="icon i_expan_l"/> </template>
    <a-collapse-panel key="affirm" header="故障确认" class="gray-collapse-panel">
        <div class="panel-content affirm">
            <div class="title">
                <i class="icon i_warning"/>共{{faultList.length}}个故障
            </div>
            <div class="fault_select">
                <a-checkbox v-for="(value,key) in faultMap" :key='key' :value='key' :checked="faultList.includes(Number(key))" :disabled="true">
                    {{value}}
                </a-checkbox>
            </div>
        </div>
    </a-collapse-panel>
    <a-collapse-panel key="change" header="零部件更换" class="gray-collapse-panel">
        <div class="panel-content change">
            <a-table :columns="tableColumns" :data-source="failList" :row-key="record => record.id" :pagination='false' size="small">
                <template #bodyCell="{ column,record, text }">
                    <template v-if="column.key === 'money'">
                        {{$Util.countFilter(text)}}元
                    </template>
                    <template v-if="column.dataIndex === 'item_fault_type'">{{faultMap[text]}}</template>
                    <template v-if="column.dataIndex === 'amount'">{{text}}件</template>
                    <template v-if="column.dataIndex === 'totle_price'"> {{$Util.countFilter(record.price * record.amount)}}元</template>
                </template>
            </a-table>
            <a-table :columns="tableColumns" :data-source="exchangeList" :row-key="record => record.id"  :pagination='false' size="small">
                <template #bodyCell="{ column,record, text }">
                    <template v-if="column.key === 'money'">
                        {{$Util.countFilter(text)}}元
                    </template>
                    <template v-if="column.dataIndex === 'item_fault_type'">{{faultMap[text]}}</template>
                    <template v-if="column.dataIndex === 'amount'">{{text}}件</template>
                    <template v-if="column.dataIndex === 'totle_price'"> {{$Util.countFilter(record.price * record.amount)}}元</template>

                </template>
            </a-table>
        </div>
    </a-collapse-panel>
</a-collapse>
</div>
</template>

<script>
import Core from '../../../core';
import ItemSelect from '@/components/ItemSelect.vue';

export default {
    name: 'CheckResult',
    components: {
        ItemSelect
    },
    props: {
        id: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {return {}}
        },
        faultList: {
            type: Array,
            default: () => {return []}
        },
        failList: {
            type: Array,
            default: () => {return []}
        },
        exchangeList: {
            type: Array,
            default: () => {return []}
        },
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // detail: {}, // 工单详情
            tableColumns: [
                { title: '故障原因', dataIndex: 'item_fault_type' },
                { title: '商品名称', dataIndex: 'item_name' },
                { title: '金额', dataIndex: 'price', key:'money' },
                { title: '数量', dataIndex: 'amount'  },
                { title: '总价', dataIndex: 'totle_price'  },
            ],

            activeKey: ['affirm', 'change'],
            faultMap: Core.Const.REPAIR.FAULT_OPTIONS_MAP,
            // faultList: [],
            //
            // failList: [],
            // exchangeList: [],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        // this.id = Number(this.$route.query.id) || 0
        // this.getRepairDetail();
        // this.getRepairItemList();
        // this.getRepairFaultList()
    },
    methods: {
        // getRepairDetail() {
        //     this.loading = true;
        //     Core.Api.Repair.detail({
        //         id: this.id,
        //     }).then(res => {
        //         console.log('getRepairDetail res', res)
        //         this.detail = res
        //     }).catch(err => {
        //         console.log('getRepairDetail err', err)
        //     }).finally(() => {
        //         this.loading = false;
        //     });
        // },

        // getRepairFaultList(){
        //     Core.Api.RepairItem.faultList({
        //         repair_order_id: this.id
        //     }).then(res => {
        //         console.log('getRepairFaultList res.fault_list', res.fault_list)
        //         this.faultList = res.fault_list.map(i => i.item_fault_type)
        //         console.log('getRepairFaultList this.faultList', this.faultList)
        //     })
        // },
        //
        // getRepairItemList() {
        //     Core.Api.RepairItem.list({
        //         repair_order_id: this.id
        //     }).then(res => {
        //         let failList = []
        //         let exchangeList = []
        //         res.list.forEach(it => {
        //             it.item_name = it.item.name
        //             if (it.type == Core.Const.REPAIR_ITEM.TYPE.ADD) {
        //                 failList.push(it)
        //             }
        //             if (it.type == Core.Const.REPAIR_ITEM.TYPE.REPLACE) {
        //                 exchangeList.push(it)
        //             }
        //         })
        //         console.log('this.failList:', this.failList)
        //         console.log('this.exchangeList:', this.exchangeList)
        //         this.failList = failList
        //         this.exchangeList = exchangeList
        //     })
        // },
    }
};
</script>

<style lang="less">
.CheckResult {
    .panel-content.change {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .ant-table-wrapper {
            width: calc(~'50% - 10px');
        }
    }
}
</style>
