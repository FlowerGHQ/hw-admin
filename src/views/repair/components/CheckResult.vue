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
                            {{ faultMap[value] }}
                        </div>
                    </div>
                </div>
            </a-collapse-panel>
            <a-collapse-panel key="change" header="零部件更换" class="gray-collapse-panel">
                <div class="panel-content change">
                    <a-table :columns="tableColumns" :data-source="failList" :row-key="record => {return JSON.stringify(record)}" :pagination='false' size="small">
                        <template #bodyCell="{ column, record, text }">
                            <template v-if="column.dataIndex === 'service_type'">
                                {{$Util.repairServiceFilter(detail.service_type || '-') }}

                            </template>
                            <template v-if="column.dataIndex === 'item_fault_id'">{{ faultMap[text] }}</template>

                            <template v-if="column.dataIndex === 'price'">
                                ￥{{ $Util.countFilter(text) }}
                            </template>
                            <template v-if="column.dataIndex === 'amount'">{{ text }}件</template>
                            <template v-if="column.key === 'totle_price' && record">
                                ￥{{ $Util.countFilter(record.price * record.amount) }}
                            </template>

                        </template>
                        <template #summary>
                            <a-table-summary>
                                <a-table-summary-row>
                                    <a-table-summary-cell :index="0" :col-span="6">合计</a-table-summary-cell>
                                    <a-table-summary-cell :index="1" :col-span="6">￥{{ $Util.countFilter(failTotle) }}
                                    </a-table-summary-cell>
                                </a-table-summary-row>
                            </a-table-summary>
                        </template>
                    </a-table>
<!--                    <a-table :columns="tableColumns" :data-source="exchangeList" :row-key="record => {return JSON.stringify(record)}"-->
<!--                             :pagination='false' size="small">-->
<!--                        <template #bodyCell="{ column, record, text }">-->
<!--                            <template v-if="column.dataIndex === 'item_fault_id'">{{ faultMap[text] }}</template>-->

<!--                            <template v-if="column.dataIndex === 'price'">-->
<!--                                ￥{{ $Util.countFilter(text) }}-->
<!--                            </template>-->
<!--                            <template v-if="column.dataIndex === 'amount'">{{ text }}件</template>-->
<!--                            <template v-if="column.key === 'totle_price' && record">-->
<!--                                ￥{{ $Util.countFilter(record.price * record.amount) }}-->
<!--                            </template>-->

<!--                        </template>-->
<!--                        <template #summary>-->
<!--                            <a-table-summary>-->
<!--                                <a-table-summary-row>-->
<!--                                    <a-table-summary-cell :index="0" :col-span="4">合计</a-table-summary-cell>-->
<!--                                    <a-table-summary-cell :index="1" :col-span="2">-->
<!--                                        ￥{{ $Util.countFilter(exchangeTotle) }}-->
<!--                                    </a-table-summary-cell>-->
<!--                                </a-table-summary-row>-->
<!--                            </a-table-summary>-->
<!--                        </template>-->
<!--                    </a-table>-->
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>


<script>
import Core from '../../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';

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
            default: () => {
                return {}
            }
        },
        faultList: {
            type: Array,
            default: () => {
                return []
            }
        },
        failList: {
            type: Array,
            default: () => {
                return []
            }
        },
        exchangeList: {
            type: Array,
            default: () => {
                return []
            }
        },
        failTotle: {
            type: Number,
        },
        exchangeTotle: {
            type: Number,
        }
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            tableColumns: [
                {title: '帐类', dataIndex: 'service_type'},
                {title: '故障原因', dataIndex: 'item_fault_id'},
                {title: '商品名称', dataIndex: 'item_name', key: 'item'},
                {title: '金额', dataIndex: 'price'},
                {title: '数量', dataIndex: 'amount'},
                {title: '工时', dataIndex: 'man_hours'},
                {title: '总价', key: 'totle_price'},
            ],

            activeKey: ['affirm', 'change'],

            faultMap: {},
        };
    },
    watch: {},
    computed: {},
    mounted() {
        console.log('CheckResult detail', this.detail);
        console.log('CheckResult faultList', this.faultList);
        console.log('CheckResult failList', this.failList);
        console.log('CheckResult exchangeList', this.exchangeList);
        this.getFaultData();
    },
    methods: {
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
