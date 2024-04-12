<template>
    <!-- 财务结算 -->
    <div id="Dashboard">
        <SearchRangePicker @search="handleTimeChange" />
        <div class="statistic-container">
            <div class="statistic-item">
                <div class="title"><i class="icon i_cart" />{{ $t('n.total_purchase') }}</div>
                <div class="count">
                    <span>{{ stat.purchase || 0 }}</span>
                    <div class="more"><i class="icon i_more" @click="routerChange('purchase')" /></div>
                </div>
            </div>
            <div class="statistic-item">
                <div class="title"><i class="icon i_order" />{{ $t('n.total_maintenance') }}</div>
                <div class="count">
                    <span>{{ stat.repair || 0 }}</span>
                    <div class="more"><i class="icon i_more" @click="routerChange('repair')" /></div>
                </div>
            </div>
        </div>
        <div class="statistic-container seven-three">
            <div class="statistic-content">
                <div class="title-container">{{ $t('n.analysis_order') }}</div>
                <div class="chart-container">
                    <div id="PurchaseOrderChart" class="chart" ref="PurchaseOrderChart"></div>
                </div>
                <!-- <div class="table-container" v-if="org_type"> -->
                <div class="table-container" v-if="false">
                    <a-table
                        :columns="tableColumns"
                        :data-source="purchaseRank"
                        :scroll="{ x: true }"
                        :row-key="record => record.id"
                        :pagination="false"
                    >
                        <template #bodyCell="{ column, text, index }">
                            <template v-if="column.key === 'index'">
                                <div class="number" :class="index < 3 ? 'color' : ''">{{ index + 1 }}</div>
                            </template>
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.key === 'tip_item'">
                                <a-tooltip placement="top" :title="text">
                                    <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                                </a-tooltip>
                            </template>
                            <template v-if="column.key === 'price'"> €{{ $Util.countFilter(text) }} </template>
                        </template>
                    </a-table>
                </div>
            </div>
            <div class="statistic-content">
                <div class="title-container">{{ $t('n.system_file') }}</div>
                <div class="rank-container">
                    <div class="rank-item" v-for="(item, index) of systeFmileData" :key="index">
                        <div class="number" :class="index < 3 ? 'color' : ''">{{ index + 1 }}</div>
                        <div class="name">{{ item.name }}</div>
                        <a-button
                            class="count"
                            style="height: 1em; font-size: 12px"
                            type="link"
                            @click="handleDownloadConfirm(item)"
                            ><i class="icon i_download" />{{ $t('n.download') }}</a-button
                        >
                    </div>
                </div>
            </div>
        </div>
        <div class="statistic-container seven-three">
            <div class="statistic-content">
                <div class="title-container">{{ $t('n.volume_analysis') }}</div>
                <div class="chart-container">
                    <div id="RepairOrderChart" class="chart" ref="RepairOrderChart"></div>
                </div>
            </div>
            <div class="statistic-content">
                <div class="title-container">{{ $t('n.fault_ranking') }}</div>
                <div class="rank-container">
                    <div class="rank-item" v-for="(item, index) of repairRank" :key="index">
                        <div class="number" :class="index < 3 ? 'color' : ''">{{ index + 1 }}</div>
                        <div class="name">{{ item.fault_desc || '-' }}</div>
                        <div class="count">{{ item.count }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import { Chart } from '@antv/g2';
import SearchRangePicker from '@/components/statistic/SearchRangePicker.vue';
import Analytics from './Analytics.vue';
export default {
    name: 'Dashboard',
    components: {
        SearchRangePicker,
        Analytics,
    },
    props: {},
    data() {
        return {
            org_type: '',
            dateList: [],
            // 加载
            loading: false,
            // 下载
            downloadDisabled: false,

            stat: {
                purchase: 0,
                repair: 0,
            },

            purchaseRank: [],
            purchaseChart: {},

            repairRank: [],
            repairChart: {},

            systeFmile: [],
            systeFmileData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('n.sort'), key: 'index' },
                { title: this.$t('n.order_quantity'), dataIndex: 'count', key: 'item' },
                { title: this.$t('n.item_quantity'), dataIndex: 'amount', key: 'item' },
                { title: this.$t('n.total_price'), dataIndex: 'price', key: 'price' },
            ];
            switch (this.org_type) {
                case 1:
                    columns.splice(1, 0, { title: this.$t('n.agent_n'), dataIndex: 'org_name', key: 'org_name' });
                    break;
                case 2:
                    columns.splice(1, 0, { title: this.$t('n.store_n'), dataIndex: 'org_name', key: 'org_name' });
                    break;
            }
            return columns;
        },
    },
    mounted() {
        let q = this.$route.query;
        console.log('q:', q);
        console.log('q.from :', q.from);
        if (q && q.from === 'login') {
            console.log('window:', window.location);
            let href = window.location.href.split('?')[0];
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        }
    },
    beforeUnmount() {
        if (this.$auth('ADMIN')) {
            this.$refs.RepairOrderChart.innerHTML = '';
            this.$refs.PurchaseOrderChart.innerHTML = '';
        }
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'purchase': // 详情
                    routeUrl = this.$router.resolve({
                        path: this.$auth('ADMIN') ? '/distributor' : '/distributor/purchase-order-self',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'repair': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/repair/repair-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        handleTimeChange(data, dateList) {
            this.org_type = data.org_type;
            this.dateList = dateList;
            setTimeout(() => {
                this.getStatData(data);
                this.getPurchaseChart(data);
                this.getPurchaseRank();
                this.getRepairRank();
                this.getRepairChart(data);
                this.getSystemFile();
            }, 1000);
        },

        getStatData(data) {
            this.stat = {
                purchase: Math.round(Math.random() * 100),
                repair: Math.round(Math.random() * 100),
            };
            // Core.Api.DashBoard.orderCount({
            //     begin_time: data.begin_time,
            //     end_time: data.end_time
            // }).then(res =>{
            //     this.stat.purchase = res.purchaseOrderCount
            //     this.stat.repair = res.repairOrderCount
            // })
        },

        getPurchaseRank() {
            let list = new Array(6).fill({});
            list = list.map((o, i) => ({
                org_name: '优盘时代' + (i + 1),
                price: Math.round(Math.random() * 10000),
                count: Math.round(Math.random() * 100),
                amount: Math.round(Math.random() * 1000),
            }));
            this.purchaseRank = list;
        },
        getRepairRank() {
            let _list = Object.values(Core.Const.REPAIR.FAULT_OPTIONS_MAP);
            let list = new Array(_list.length).fill({});
            list = list.map((item, i) => ({ name: _list[i], count: i * 100 }));
            list = list.map((item, i) => ({ name: item.name, count: item.count + Math.round(Math.random() * 100) }));

            this.repairRank = list.reverse();
            // Core.Api.DashBoard.repairRank().then(res => {
            //     console.log('getRepairRank res', res);
            //     this.repairRank = res.list
            // })
        },
        getSystemFile() {
            // 系统文件信息获取
            this.loading = true;
            Core.Api.System.fileList({
                begin_time: '',
                end_time: '',
                page: 1,
                page_size: 7,
            })
                .then(res => {
                    console.log('getSystemFile res:', res);
                    this.systeFmileData = res.list;
                })
                .catch(err => {
                    console.log('getSystemFile err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleDownloadConfirm(item) {
            // 下载问询
            let _this = this;
            this.$confirm({
                title: _this.$t('f.sure_download'),
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.handleDownload(item);
                },
            });
        },
        handleDownload(item) {
            // 下载
            this.downloadDisabled = true;
            let path = item.path;
            let fileUrl = Core.Const.NET.FILE_URL_PREFIX + path + '';
            window.open(fileUrl, '_blank');
            this.downloadDisabled = false;
        },

        getPurchaseChart(data) {
            let list = Core.Util.deepCopy(this.dateList);
            list = list.map(i => ({
                date: i,
                price: Math.round(Math.random() * 10000),
                count: Math.round(Math.random() * 100),
            }));
            setTimeout(() => {
                this.drawPurchaseChart(list);
            }, 100);
            // Core.Api.DashBoard.purchaseOrder({
            //     begin_time: data.begin_time,
            //     end_time: data.end_time,
            // }).then(res=> {
            //     console.log('getPurchaseChart res',res);
            //     const list = res.list.map(item => {
            //         const date = this.$Util.timeFilter(item.time, 3)
            //         item.price = this.$Util.countFilter(item.price)
            //         return { date: date, ...item }
            //     })
            //     this.drawPurchaseChart(list)
            // })
        },
        getRepairChart(data) {
            let list = Core.Util.deepCopy(this.dateList);
            list = list.map(i => ({
                date: i,
                count: Math.round(Math.random() * 100),
            }));
            setTimeout(() => {
                this.drawRepairChart(list);
            }, 100);
            // Core.Api.DashBoard.repairOrder({
            //     begin_time: data.begin_time,
            //     end_time: data.end_time,
            // }).then(res=> {
            //     console.log('getPurchaseChart res',res);
            //     const list = res.list.map(item => {
            //         const date = this.$Util.timeFilter(item.time, 3)
            //         return { date: date, ...item }
            //     })
            //     this.drawRepairChart(list)
            // })
        },

        drawPurchaseChart(data) {
            if (this.purchaseChart.destroy) {
                console.log('drawPurchaseChart destroy:');
                this.purchaseChart.destroy();
            }
            let chart = new Chart({
                container: 'PurchaseOrderChart',
                autoFit: true,
                height: 260,
                width: 600,
            });
            chart.data(data);
            chart.scale({
                date: {
                    tickCount: 10,
                    range: [0.01, 0.98],
                    type: 'cat',
                },
                price: {
                    alias: this.$t('n.amount'),
                    range: [0, 0.97],
                    type: 'linear',
                    formatter: val => {
                        return val + '€';
                    },
                },
                count: {
                    alias: this.$t('n.order_number'),
                    range: [0, 0.97],
                    type: 'linear',
                    formatter: val => {
                        return val + this.$t('n.order_unit');
                    },
                },
            });
            chart.axis('price', {
                // 隐藏y轴线
                grid: null,
            });
            chart.axis('count', {
                // 隐藏y轴线
                grid: null,
            });
            chart.area().position('date*price').shape('smooth').color('l(270) 0:#FFFFFF 1:#53B9EA');
            chart.area().position('date*count').shape('smooth').color('l(270) 0:#FFFFFF 1:#F5A623');

            chart.line().position('date*price').shape('smooth').color('#53B9EA').size(2);
            chart.line().position('date*count').shape('smooth').color('#F5A623').size(2);

            chart.render();
            this.purchaseChart = chart;
        },
        drawRepairChart(data) {
            if (this.repairChart.destroy) {
                console.log('drawRepairChart destroy:');
                this.repairChart.destroy();
            }
            let chart = new Chart({
                container: 'RepairOrderChart',
                autoFit: true,
                height: 260,
                width: 600,
            });
            chart.data(data);
            chart.scale({
                date: {
                    tickCount: 10,
                    range: [0.01, 0.98],
                    type: 'cat',
                },
                count: {
                    alias: this.$t('n.order_number'),
                    range: [0, 0.97],
                    type: 'linear',
                    formatter: val => {
                        return val + this.$t('n.order_unit');
                    },
                },
            });
            chart.axis('count', {
                // 隐藏y轴线
                grid: null,
            });
            chart.area().position('date*count').shape('smooth').color('l(90) 0:#FFFFFF 1:#0078FF');

            chart.line().position('date*count').shape('smooth').color('#59A7FF').size(2);

            chart.render();
            this.repairChart = chart;
        },
    },
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
        background: #ffffff;
        border: 1px solid #eaecf2;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 26px 28px 26px 32px;
        width: calc(~'25% - 16px');
        margin: 0 16px 0 0;
        .title {
            .fac();
            color: #858f97;
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
                color: #fa582e;
                background: #fee6e0;
            }
            .i_order {
                color: #0163de;
                background: #d9e8fa;
            }
        }
        .count {
            margin-top: 15px;
            .fsb();
            span {
                color: #006ef9;
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
                    color: #6e7c94;
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
            .chart {
                position: relative;
                width: 100%;
                padding: 40px 50px;
                box-sizing: border-box;
            }
        }
        .rank-container {
            padding: 24px 0 32px;
            .flex(center);
            .rank-item {
                margin-bottom: 18px;
                width: 100%;
                box-sizing: border-box;
                padding: 0 10%;
                .fac();
                .number {
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    border-radius: 50%;
                    background: #ebf1f4;
                    color: #363d42;
                    margin-right: 30px;
                    &.color {
                        background: @BG_P;
                        color: @TC_InP;
                    }
                }
                .name {
                    color: @TC_LT;
                    width: calc(~'100% - 110px');
                    .ell();
                }
                .count {
                    width: 60px;
                    font-size: 14px;
                    text-align: right;
                    color: #8e9aad;
                }

                &:last-child {
                    margin-bottom: 0px;
                }
            }
        }
        .table-container {
            padding: 0 50px 40px;
            .number {
                width: 20px;
                height: 20px;
                text-align: center;
                border-radius: 50%;
                background: #ebf1f4;
                color: #363d42;
                margin-right: 30px;
                &.color {
                    background: @BG_P;
                    color: @TC_InP;
                }
            }
        }
    }
}
</style>
