<template>
<div id="RepairInvoice" class='list-container'>
    <div class="content">
        <div class="title-content">
            <div class="title">结算清单 Invoice</div>
            <p>维修帐类</p>
            <span>{{ $Util.repairServiceFilter(detail.service_type) }}</span>
            <p>结算编号</p>
            <span>{{detail.uid || '-'}}</span>
            <p>交易日期</p>
            <span>{{$Util.timeFormat(detail.create_time, 'YYYY/MM/DD') || '-'}}</span>
        </div>
        <div class="info-content">
            <div class="info-block">
                <div class="title">托修方</div>
                <p>车主姓名：{{detail.customer_name}}</p>
                <p>车架号：{{detail.item_code}}</p>
                <p>送修日期：{{$Util.timeFormat(detail.create_time)}}</p>
                <div class="title">联系电话</div>
                <p>{{detail.customer_phone}}</p>
            </div>
            <div class="info-block">
                <div class="title">维修门店</div>
                <p>{{detail.repair_name}}</p>
                <div class="title">联系电话</div>
                <p>{{detail.repair_phone}}</p>
            </div>
            <div class="info-block">
                <div class="title">维修方</div>
                <p>维修人：{{detail.repair_user_name}}</p>
                <p>维修方式：{{$Util.repairChannelFilter(detail.channel)}}</p>
                <div class="title">联系电话</div>
                <p>{{detail.repair_user_phone}}</p>
            </div>
        </div>
        <div class="item-content">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                :row-key="record => record.id"  :pagination='false'>
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'item'">
                        {{ text || '-'}}
                    </template>
                    <template v-if="column.dataIndex === 'price'">
                        {{ $Util.countFilter(text) }}€
                    </template>
                    <template v-if="column.dataIndex === 'sum_price'">
                        {{ $Util.countFilter(record.price * record.amount) }}€
                    </template>
                </template>
                <template #summary>
                    <a-table-summary>
                        <a-table-summary-row>
                            <a-table-summary-cell :index="0" :col-span="2"></a-table-summary-cell>
                            <a-table-summary-cell :index="1" :col-span="2">
                                <div class="sum-price">
                                    <p>总金额</p> <span>€{{$Util.countFilter(sum_price)}}</span>
                                </div>
                            </a-table-summary-cell>
                        </a-table-summary-row>
                    </a-table-summary>
                </template>
            </a-table>
        </div>
    </div>
    <div class="btn-area">
        <a-button type="primary" @click="routerChange('export')">保存并下载</a-button>
        <a-button type="primary" @click="routerChange('back')" ghost>返回详情</a-button>
    </div>
</div>
</template>
<script>
import Core from '../../core';
export default {
    name: 'RepairInvoice',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            id: '',
            detail: {},

            tableData: [],
            tableColumns: [
                { width: '40%', title: '维修材料', dataIndex: ['item', 'name'], key: 'item' },
                { width: '20%', title: '数量', dataIndex: 'amount', key: 'item' },
                { width: '20%', title: '单价', dataIndex: 'price' },
                { width: '20%', title: '金额（元）', dataIndex: 'sum_price' },
            ]
        }
    },
    watch: {},
    computed: {
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
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getTableData() {  // 获取 表格 数据
            console.log(this.id);
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
                    height: 40px;
                }
            }
            .sum-price {
                margin-left: 16px;
                width: 70%;
                height: 2px;
                opacity: 0.9;
                border-top: 2px solid #000022;
                .fsb();
                p, span {
                    padding-top: 25px;
                    font-size: 12px;
                    font-weight: 500;
                    color: #000022;
                    line-height: 17px;
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
