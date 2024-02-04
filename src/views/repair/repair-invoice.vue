<template>
<div id="RepairInvoice" class='list-container'>
    <div class="content">
        <div class="title-content">
            <div class="title">{{ $t('r.settlement_list') }}</div>
            <p>{{ $t('r.warranty') }}</p>
            <span>{{ $Util.repairServiceFilter(detail.service_type,  $i18n.locale) }}</span>
            <p>{{ $t('r.serial_number') }}</p>
            <span>{{detail.uid || '-'}}</span>
            <p>{{ $t('r.date') }}</p>
            <span>{{$Util.timeFormat(detail.create_time, 'YYYY/MM/DD') || '-'}}</span>
        </div>
        <div class="info-content">
            <div class="info-block">
                <div class="title">{{ $t('r.client') }}</div>
                <p>{{ $t('n.customer_name') }}：{{detail.customer_name}}</p>
                <p>{{ $t('search.vehicle_no') }}：{{detail.vehicle_no}}</p>
                <p>{{ $t('r.repair_date') }}：{{$Util.timeFormat(detail.create_time)}}</p>
                <div class="title">{{ $t('n.phone') }}</div>
                <p>{{detail.customer_phone}}</p>
            </div>
            <div class="info-block">
                <div class="title">{{ $t('r.shop') }}</div>
                <p>{{detail.repair_name}}</p>
                <div class="title">{{ $t('n.phone') }}</div>
                <p>{{detail.repair_phone}}</p>
            </div>
            <div class="info-block">
                <div class="title">{{ $t('r.man') }}</div>
                <p>{{ $t('e.name') }}：{{detail.repair_user_name}}</p>
                <p>{{ $t('r.repair_way') }}：{{$Util.repairChannelFilter(detail.channel, $i18n.locale)}}</p>
                <div class="title">{{ $t('n.phone') }}</div>
                <p>{{detail.repair_user_phone}}</p>
            </div>
        </div>
        <div class="item-content">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                :row-key="record => record.id"  :pagination='false'>
                <template #headerCell="{title}">
                    {{ $t(title) }}
                </template>
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'item'">
                        {{ text || '-'}}
                    </template>
                    <template v-if="column.dataIndex === 'item_fault_id'">
                        {{ faultMap[text] }}
                    </template>
                    <template v-if="column.dataIndex === 'amount'">
                        {{ text }} {{ $t('in.item') }}
                    </template>
                    <template v-if="column.dataIndex === 'price'">
                        € {{ $Util.countFilter(text) }}
                    </template>
                    <template v-if="column.dataIndex === 'sum_price'">
                        € {{ $Util.countFilter(record.price * record.amount) }}
                    </template>
                    <template v-if="column.dataIndex === 'man_hour'">
                        {{ $Util.countFilter(text) }}{{ $t('i.hours') }}
                    </template>
                </template>
                <template #summary>
                    <a-table-summary>
                        <a-table-summary-row>
                            <a-table-summary-cell :index="0" :col-span="2"></a-table-summary-cell>
                            <a-table-summary-cell :index="1" :col-span="3">
                                <div class="sum-price" v-if="detail.service_type === SERVICE_TYPE.OUT_REPAIR_TIME">
                                    <div class="row"><p>{{ $t('r.parts_cost') }}</p> <span>€{{$Util.countFilter(sum_price)}}</span></div>
                                    <div class="row"><p>{{ $t('r.hour') }}</p> <span>€{{$Util.countFilter(settle.man_hour_money)}}</span></div>
                                    <div class="row"><p>{{ $t('i.total_price') }}</p> <span>€{{$Util.countFilter(sum_price + settle.man_hour_money)}}</span></div>
                                </div>
                                <div class="sum-price" v-else>
                                    <div class="row"><p>{{ $t('i.total_price') }}</p> <span>€{{$Util.countFilter(sum_price)}}</span></div>
                                    <div class="row"><p>{{ $t('r.amount_paid') }}</p><span>€0</span></div>
                                </div>
                            </a-table-summary-cell>
                        </a-table-summary-row>
                    </a-table-summary>
                </template>
            </a-table>
        </div>
    </div>
    <div class="btn-area">
        <a-button type="primary" @click="routerChange('export')">{{ $t('r.download') }}</a-button>
        <a-button type="primary" @click="routerChange('back')" ghost>{{ $t('r.details') }}</a-button>
    </div>
</div>
</template>
<script>
import Core from '../../core';
const SERVICE_TYPE = Core.Const.REPAIR.SERVICE_TYPE
export default {
    name: 'RepairInvoice',
    components: {},
    props: {},
    data() {
        return {
            SERVICE_TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            id: '',
            detail: {},
            settle: {},

            tableData: [],
            faultMap: {}
        }
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                {title: 'r.fault_name', dataIndex: 'item_fault_id'},
                {title: 'r.material', dataIndex: ['item', 'name'], key: 'item'},
                {title: 'i.amount', dataIndex: 'amount'},
                {title: 'i.unit_price', dataIndex: 'price'},
                {title: 'i.total_price', dataIndex: 'sum_price'},
                {title: 'i.hours', dataIndex: 'man_hour'}
            ]
            if (this.detail.service_type === SERVICE_TYPE.IN_REPAIR_TIME) {
                tableColumns.pop()
            }
            return tableColumns
        },
        sum_price() {
            let sum = 0
            this.tableData.forEach(item => {
                sum += item.amount * item.price
            })
            return sum
        }
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getRepairDetail();
        this.getSettleDetail();
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl
            switch (type) {
                case 'export':  // 导出页面
                    routeUrl = this.$router.resolve({
                        path: "/repair/invoice-download",
                        query: { id: this.id },
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'back':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-detail",
                        query: { id: this.id },
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        // 获取工单详情
        getRepairDetail() {
            this.loading = true;
            Core.Api.Repair.detail({
                id: this.id,
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.detail = res
                this.getFaultData()
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取结算单详情
        getSettleDetail() {
            Core.Api.Repair.settleDetail({
                source_type: 10,
                source_id: this.id,
            }).then(res => {
                console.log('getSettleDetail res:', res)
                this.settle = res.detail
            })
        },

        getFaultData() {
            this.loading = true;
            Core.Api.Fault.list({
                org_id: this.detail.org_id,
                org_type: this.detail.org_type,
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
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.RepairItem.list({
                repair_order_id: this.id
            }).then(res => {
                console.log("getTableData res", res)
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },


        // 打印
        handleExport() {
        }
    }
};
</script>

<style lang="less">
#RepairInvoice {
    padding: 20px 184px 0 126px;
    box-sizing: border-box;
    .content {
        border-radius: 1px;
        border: 1px solid #E6EAEE;
        padding: 30px 32px 100px;
        box-sizing: border-box;
        .title-content {
            background: #F8FAFC;
            padding: 35px 0 32px 50px;
            box-sizing: border-box;
            font-size: 12px;
            line-height: 17px;
            .title {
                font-size: 18px;
                line-height: 25px;
                color: #000022;
            }
            p {
                padding-top: 18px;
                margin-bottom: 4px;
                font-weight: 600;
                color: #000022;
            }
            span {
                color: #465670;
            }
        }
        .info-content {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            padding-bottom: 30px;
            .info-block {
                flex: 1;
                padding-left: 50px;
                display: flex;
                flex-direction: column;
                .title {
                    line-height: 17px;
                    font-size: 12px;
                    font-weight: 500;
                    color: #000022;
                    margin-bottom: 14px;
                    margin-top: 30px;
                }
                p {
                    font-size: 12px;
                    line-height: 17px;
                    color: #8090A6;
                    + p {
                        margin-top: 8px;
                    }
                }
            }
        }
        .item-content {
            display: flex;
            justify-content: flex-end;
            flex-wrap: wrap;
            .ant-table-wrapper {
                width: 100%;
            }
            .ant-table {
                th.ant-table-cell {
                    background-color: #F8FAFC !important;
                }
            }
            .ant-table-summary {
                .ant-table-cell {
                    padding: 0;
                    border-bottom: 1px solid transparent;
                    height: 120px;
                    position: relative;
                }
            }
            .sum-price {
                position: absolute;
                top: 12px;
                margin-left: 16px;
                width: 78%;
                opacity: 0.9;
                border-top: 2px solid #000022;
                padding-top: 4px;
                .row {
                    .fsb();
                    width: 100%;
                    height: 20px;
                    line-height: 20px;
                    p, span {
                        font-size: 12px;
                        color: #000022;
                        font-weight: 400;
                    }
                    &:last-child {
                        p, span {
                            font-weight: 500;
                        }
                    }
                }
            }
        }
    }
    .btn-area {
        margin-top: 30px;
        margin-bottom: 30px;
        .ant-btn {
            border-radius: 2px;
        }
    }
}
</style>
