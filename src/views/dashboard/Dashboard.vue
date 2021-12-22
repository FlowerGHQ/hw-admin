<template>
<!-- 财务结算 -->
<div id="Dashboard">
    <SearchRangePicker @change='handleTimeChange'/>
    <div class="statistic-container">
        <div class="statistic-item">
            <div class="title"><i class="icon i_cart"/>采购订单总计</div>
            <div class="count">
                <span>{{stat.purchase}}</span>
                <div class="more"><i class="icon i_more" @click="routerChange('purchase')"/></div>
            </div>
        </div>
        <div class="statistic-item">
            <div class="title"><i class="icon i_order"/>维修工单总计</div>
            <div class="count">
                <span>{{stat.repair}}</span>
                <div class="more"><i class="icon i_more" @click="routerChange('repair')"/></div>
            </div>
        </div>
    </div>
    <div class="statistic-container">
        <div class="statistic-content">
            <div class="title-container">订单分析</div>
            <div class="chart-container">
                <div id="PurchaseOrderChart" class="chart"></div>
            </div>
            <div class="table-container" v-if="org_type">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false' @change="handleTableChange">
                    <template #bodyCell="{ column, text , record}">
                        <template v-if="column.key === 'index'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-'}}
                        </template>
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title='text'>
                                <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'money'">
                            ￥{{ $Util.countFilter(text) }}
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </div>
    <div class="statistic-container seven-three">
        <div class="statistic-content">
            <div class="title-container">维修单量分析</div>
            <div class="chart-container">
                <div id="RepairOrderChart" class="chart"></div>
            </div>
        </div>
        <div class="statistic-content">
            <div class="title-container">故障排行</div>
            <div class="rank-container">
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Core from '../../core';
import SearchRangePicker from '@/components/statistic/SearchRangePicker.vue'
export default {
    name: 'Dashboard',
    components: {
        SearchRangePicker
    },
    props: {},
    data() {
        return {
            org_type: '',

            stat: {
                purchase: 2673092,
                repair: 2673092,
            },

            purchaseRank: [],
            purchaseChart: [],

            repairRank: [],
            repairChart: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '排序', key: 'index' },
                { title: '订单数量', key: 'count' },
                { title: '商品总数', key: 'amount' },
                { title: '商品总数', key: 'price' },
            ]
            switch (this.org_type) {
                case 1:
                    columns.splice(1, 0, {title: '经销商名称', key: 'org_name'})
                    break;
                case 2:
                    columns.plice(1, 0, {title: '门店名称', key: 'org_name'})
                    break;
            }
            return columns
        },
    },
    mounted() {},
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'purchase':  // 详情
                    routeUrl = this.$router.resolve({
                        path: this.$auth('ADMIN') ? '/item/purchas-order-list' : '/purchase/purchas-order-list',
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'repair':  // 详情
                    routeUrl = this.$router.resolve({
                        path: '/repair/repair-list',
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
    }
};
</script>

<style lang="less" scoped>
#Dashboard {
    .statistic-container {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 16px;
        &.seven-three {
            .statistic-content:nth-child(1) {
                width: calc(~'70% - 8px');
                margin-right: 16px;
            }
            .statistic-content:nth-child(2) {
                width: calc(~'30% - 8px');
            }
        }
    }
    .statistic-item {
        background: #FFFFFF;
        border: 1px solid #EAECF2;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 26px 28px 26px 32px;
        width: calc(~'25% - 16px');
        margin: 0 16px 0 0;
        .title {
            .fac();
            color: #858F97;
            font-size: 12px;

            i.icon {
                .fcc();
                font-size: 20px;
                border-radius: 4px;
                margin-right: 14px;
                width: 32px;
                height: 32px;
            }
            .i_cart {
                color: #FA582E;
                background: #FEE6E0;
            }
            .i_order {
                color: #0163DE;
                background: #D9E8FA;
            }
        }
        .count {
            margin-top: 15px;
            .fsb();
            span {
                color: #006EF9;
                font-size: 24px;
                line-height: 34px;
            }
            .more {
                cursor: pointer;
                background: rgba(230, 234, 240, 0.4);
                border-radius: 2px;
                width: 32px;
                height: 32px;
                .fcc();
                .i_more {
                    font-size: 10px;
                    color: #6E7C94;
                }
            }
        }
    }
    .statistic-content {
        width: 100%;
        background-color: #fff;
        .title-container {
            padding: 16px;
            font-size: 16px;
            line-height: 24px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
        }
        .chart-container {
            height: 340px;
            width: 100%;
            .chart {
                width: 100%;
            }
        }
        .rank-container {
        }
    }
}
</style>