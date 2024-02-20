<template>
    <div class="CheckResult">
        <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
            <template #expandIcon><i class="icon i_expan_l" /></template>
            <a-collapse-panel key="affirm" :header="$t('r.problem')" class="gray-collapse-panel" v-if="!$auth('ADMIN')">
                <div class="panel-content affirm">
                    <div class="title">
                        <i class="icon i_warning" />{{ $t('n.all_total') }}&nbsp;{{ faultList.length }}&nbsp;{{
                            $t('r.faults')
                        }}
                    </div>
                    <div class="fault_select">
                        <div class="item" v-for="(value, index) of faultList" :key="index">
                            {{ faultMap[value] || '-' }}
                        </div>
                    </div>
                </div>
            </a-collapse-panel>
            <a-collapse-panel key="change" :header="$t('r.replacement_items')" class="gray-collapse-panel">
                <div class="panel-content change">
                    <a-table
                        :columns="tableColumns"
                        :data-source="tableData"
                        :scroll="{ x: true }"
                        :row-key="
                            record => {
                                return JSON.stringify(record);
                            }
                        "
                        :pagination="false"
                        size="small"
                    >
                        <template #headerCell="{ title }">
                            {{ $t(title) }}
                        </template>
                        <template #bodyCell="{ column, record, text }">
                            <template v-if="column.dataIndex === 'name'">
                                {{ $i18n.locale === 'zh' ? record.item?.name : record.item?.name_en }}
                            </template>
                            <template v-if="column.key === 'service_type'">
                                {{ $Util.repairServiceFilter(detail.service_type, $i18n.locale) }}
                            </template>
                            <template v-if="column.dataIndex === 'price'"> € {{ $Util.countFilter(text) }} </template>
                            <template v-if="column.dataIndex === 'amount'"> {{ text }} {{ $t('in.item') }} </template>
                            <template v-if="column.key === 'total_price'">
                                € {{ $Util.countFilter(record.price * record.amount) }}
                            </template>
                            <template v-if="column.dataIndex === 'type'">
                                {{ repairTypeMap[text][$i18n.locale] }}
                            </template>
                            <template v-if="column.dataIndex === 'man_hour'">
                                {{ $Util.countFilter(text) }}
                            </template>
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                        </template>
                        <template #summary v-if="detail.service_type === SERVICE_TYPE.OUT_REPAIR_TIME">
                            <a-table-summary>
                                <a-table-summary-row>
                                    <a-table-summary-cell :index="0" :col-span="4">{{
                                        $t('p.total')
                                    }}</a-table-summary-cell>
                                    <a-table-summary-cell :index="1" :col-span="3"
                                        >{{ total.amount }}{{ $t('in.item') }}</a-table-summary-cell
                                    >
                                    <!--                                <a-table-summary-cell :index="2" :col-span="3">€ {{ $Util.countFilter(total.price) }}</a-table-summary-cell>-->
                                    <a-table-summary-cell :index="3" :col-span="1"
                                        >{{ $Util.countFilter(total.man_hour)
                                        }}{{ $t('i.hours') }}</a-table-summary-cell
                                    >
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
const SERVICE_TYPE = Core.Const.REPAIR.SERVICE_TYPE;
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
                return {};
            },
        },
    },
    emit: ['hasTransfer'],
    data() {
        return {
            SERVICE_TYPE,
            // 加载
            loading: false,
            activeKey: ['affirm', 'change'],
            faultMap: {},
            repairTypeMap: Core.Const.REPAIR_ITEM.TYPE_MAP, // 维修商品类型
            repairType: Core.Const.REPAIR_ITEM.TYPE,
            faultList: [],
            tableData: [],
        };
    },
    watch: {},
    computed: {
        total() {
            let price = 0,
                man_hour = 0,
                amount = 0;
            for (const item of this.tableData) {
                price += item.amount * item.price;
                amount += item.amount;
                man_hour += item.man_hour;
            }
            return { price, man_hour, amount };
        },
        tableColumns() {
            let tableColumns = [
                { title: 'r.warranty', key: 'service_type' },
                { title: 'r.fault_cause', dataIndex: 'item_fault_name' },
                { title: 'r.item_name', dataIndex: 'name', key: 'item' },
                { title: 'i.code', dataIndex: ['item', 'code'], key: 'item' },
                { title: 'i.amount', dataIndex: 'amount' },
                { title: 'i.unit_price', dataIndex: 'price' },
                { title: 'i.total_price', key: 'total_price' },
                { title: 'n.type', dataIndex: 'type' },
                // {title: '回收仓', dataIndex: 'recycle_warehouse_name', key: 'item'},
                { title: 'r.warehouse', dataIndex: 'warehouse_name', key: 'item' },
            ];
            if (this.detail.service_type === SERVICE_TYPE.IN_REPAIR_TIME) {
                tableColumns.splice(8, 0, { title: 'r.defective', dataIndex: 'recycle_warehouse_name', key: 'item' });
                // tableColumns.splice(5, 2)
            } else {
                tableColumns.push({ title: 'i.hours', dataIndex: 'man_hour' });
            }
            if (!this.$auth('ADMIN')) {
                tableColumns.splice(5, 2);
            }
            return tableColumns;
        },
    },
    mounted() {
        console.log('mounted this.faultMap:', this.faultMap);
        this.getFaultData();
        this.getRepairFaultList();
    },
    methods: {
        // 获取 所有故障类型
        getFaultData() {
            this.loading = true;
            Core.Api.Fault.list({
                org_id: this.detail.org_id,
                org_type: this.detail.org_type,
            })
                .then(res => {
                    console.log('getFaultData res:', res);
                    let list = res.list;
                    let map = {};
                    for (const item of list) {
                        map[item.id] = item.name;
                    }
                    console.log('getFaultData faultMap:', map);
                    this.faultMap = map;
                })
                .catch(err => {
                    console.log('getFaultData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        getRepairFaultList() {
            Core.Api.RepairItem.faultList({
                repair_order_id: this.id,
            }).then(res => {
                console.log('getRepairFaultList res', res);
                this.faultList = res.fault_list.map(i => i.item_fault_id);
                console.log('getRepairFaultList this.faultList', this.faultList);
                this.getRepairItemList();
            });
        },
        getRepairItemList() {
            Core.Api.RepairItem.list({
                repair_order_id: this.id,
            }).then(res => {
                console.log('getRepairItemList res', res);
                this.tableData = res.list;

                for (const item of res.list) {
                    if (item.type === Core.Const.REPAIR_ITEM.TYPE.TRANSFER) {
                        this.$emit('hasTransfer');
                    }
                }
            });
        },
    },
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
                color: #202b3b;
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
