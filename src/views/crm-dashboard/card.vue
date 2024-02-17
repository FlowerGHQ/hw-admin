<template>
    <div class="list-container">
        <div class="title">
            <span>标签</span>
            <div>
                <div
                    class="tab-item"
                    :class="{ 'tab-current': currentTab === item.key }"
                    v-for="(item, index) in titleTabs"
                    :key="index"
                    @click="clickTab(item.key)"
                >
                    {{ item.label }}
                </div>
            </div>
        </div>
        <!-- <div class="contain"> -->
        <!-- table -->
        <div class="table-container" v-if="type === 1">
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :pagination="false"
                :row-key="record => record.id"
                :indentSize="0"
            >
                <template #bodyCell="{ column, text, index, record }">
                    <template v-if="column.key === 'index'">
                        <span>{{ index + 1 }}</span>
                    </template>
                    <template v-if="column.key === 'name'">
                        <span>{{ text }}</span>
                    </template>
                    <template v-if="column.key === 'winNum'">
                        <span>{{ text }}</span>
                    </template>
                    <template v-if="column.key === 'myGap'">
                        <span>{{ text }}</span>
                    </template>
                </template>
            </a-table>
        </div>

        <!-- form -->
        <div class="table-container" v-if="type === 2">
            <a-row :gutter="[20, 0]">
                <!--                    <a-col v-for="(item, index) in formList" :key="index" :xs='24' :sm='12' :xl="12" :xxl='12'>-->
                <!--                        <div class="form-item">-->
                <!--                            <span class="form-label"><i class="icon i_add" style="margin-right:16px"/>{{ item.label }}</span>-->
                <!--                            <span class="form-value">{{  this.form.new_customer_count || '-' }}</span>-->
                <!--                        </div>-->
                <!--                    </a-col>-->
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_add" style="margin-right: 16px" />{{
                                $t('crm_dash.new_customer_count')
                            }}</span
                        >
                        <span class="form-value">{{ this.form.new_customer_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_add" style="margin-right: 16px" />{{
                                $t('crm_dash.new_contact_count')
                            }}</span
                        >
                        <span class="form-value">{{ this.form.new_contact_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_add" style="margin-right: 16px" />{{
                                $t('crm_dash.new_order_count')
                            }}</span
                        >
                        <span class="form-value">{{ this.form.new_order_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_add" style="margin-right: 16px" />{{ $t('crm_dash.new_bo_count') }}</span
                        >
                        <span class="form-value">{{ this.form.new_bo_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_add" style="margin-right: 16px" />{{ $t('crm_dash.win_bo_count') }}</span
                        >
                        <span class="form-value">{{ this.form.win_bo_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_add" style="margin-right: 16px" />{{
                                $t('crm_dash.new_test_driver_count')
                            }}</span
                        >
                        <span class="form-value">{{ this.form.new_test_driver_count || '-' }}</span>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div class="table-container" v-if="type === 5">
            <a-row :gutter="[20, 0]">
                <!--                    <a-col v-for="(item, index) in formList" :key="index" :xs='24' :sm='12' :xl="12" :xxl='12'>-->
                <!--                        <div class="form-item">-->
                <!--                            <span class="form-label"><i class="icon i_add" style="margin-right:16px"/>{{ item.label }}</span>-->
                <!--                            <span class="form-value">{{  this.form.new_customer_count || '-' }}</span>-->
                <!--                        </div>-->
                <!--                    </a-col>-->
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_add" style="margin-right: 16px" />{{
                                $t('crm_dash.new_customer_count')
                            }}</span
                        >
                        <span class="form-value">{{ this.form.track_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_add" style="margin-right: 16px" />{{
                                $t('crm_dash.new_contact_count')
                            }}</span
                        >
                        <span class="form-value">{{ this.form.call_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_add" style="margin-right: 16px" />{{
                                $t('crm_dash.new_order_count')
                            }}</span
                        >
                        <span class="form-value">{{ this.form.visit_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_add" style="margin-right: 16px" />{{ $t('crm_dash.new_bo_count') }}</span
                        >
                        <span class="form-value">{{ this.form.pool_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_add" style="margin-right: 16px" />{{ $t('crm_dash.win_bo_count') }}</span
                        >
                        <span class="form-value">{{ this.form.customer_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_add" style="margin-right: 16px" />{{
                                $t('crm_dash.new_test_driver_count')
                            }}</span
                        >
                        <span class="form-value">{{ this.form.bo_count || '-' }}</span>
                    </div>
                </a-col>
            </a-row>
        </div>

        <!-- echarts -->
        <div class="table-container" v-if="type === 3">
            <div :id="chartId" class="chart" :ref="chartId"></div>
        </div>

        <!-- dataInfo -->
        <div class="table-container" v-if="type === 4">
            <div class="data-body">
                <i class="icon i_add" style="margin-right: 16px; font-size: 32px; color: blue" />
                <div class="data-contain">
                    <div class="info-item" v-for="(item, index) in infoTabs" :key="index">
                        <span class="label">{{ item.label }}</span>
                        <span class="value">{{ info[item.key] || '1个' }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- </div> -->
    </div>
</template>

<script>
import Core from '../../core';
import { Chart } from '@antv/g2';

export default {
    name: 'Card',
    components: {},
    props: {
        info: {
            type: Object,
            default: () => {},
        },
        tableData: {
            type: Object,
            default: () => [{ name: '1', winNum: '2', myGap: '3' }],
        },
        type: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            titleTabs: [
                { label: '按钮名称', key: 'key1' },
                { label: '按钮名称', key: 'key2' },
                { label: '按钮名称', key: 'key3' },
            ],
            currentTab: '',
            formList: [
                { label: '标签名称', icon: '', key: 'name' },
                { label: '标签名称', icon: '', key: 'name' },
                { label: '标签名称', icon: '', key: 'name' },
                { label: '标签名称', icon: '', key: 'name' },
                { label: '标签名称', icon: '', key: 'name' },
            ],
            myChart: null,
            chartId: 'echart',
            timer: null,
            infoTabs: [
                { label: '标签名称', key: 'key1' },
                { label: '标签名称', key: 'key2' },
                { label: '标签名称', key: 'key3' },
            ],
            searchForm: {},
            form: {
                new_customer_count: '',
                new_contact_count: '',
                new_order_count: '',
                new_bo_count: '',
                win_bo_count: '',
                new_test_driver_count: '',

                track_count: '',
                call_count: '',
                visit_count: '',
                pool_count: '',
                customer_count: '',
                bo_count: '',
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: '排名', dataIndex: 'index', key: 'index' },
                { title: '人员名字', dataIndex: 'name', key: 'name' },
                { title: '赢单数量', dataIndex: 'winNum', key: 'winNum' },
                { title: '我的差距', dataIndex: 'myGap', key: 'myGap' },
            ];
            return tableColumns;
        },
    },
    created() {},
    mounted() {
        const ths = this;
        window.onresize = () => {
            ths.resetChart();
        };
        this.salesStatistics();
        this.trackStatistics();
    },
    methods: {
        // 点击tab
        clickTab(key) {
            this.currentTab = key;
            console.log('切换tab >>', key);
        },
        // 窗口缩放重制chart
        resetChart() {
            if (this.timer !== null) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.timer = null;
                this.initChart();
            }, 500);
        },
        // 初始化chart
        initChart(data) {
            let el = document.getElementById(this.chartId);
            if (this.myChart && this.myChart.destroy) {
                this.myChart.destroy();
                el.innerHTML = '';
                this.myChart = null;
            }
            this.$nextTick(() => {
                let width = el.offsetWidth;
                let rate = 300 / 200; //  宽/高
                console.log('init chart width >>', width, width / rate);
                let chart = new Chart({
                    container: this.chartId,
                    autoFit: true,
                    height: width / rate,
                    width,
                });
                chart.data(data);
                this.myChart = chart;
                console.log(this.myChart);
            });
        },

        salesStatistics() {
            Core.Api.CRMDashboard.salesStatistics({
                ...this.searchForm,
            }).then(res => {
                this.form.new_customer_count = res.new_customer_count;
                this.form.new_contact_count = res.new_contact_count;
                this.form.new_order_count = res.new_order_count;
                this.form.new_bo_count = res.new_bo_count;
                this.form.win_bo_count = res.win_bo_count;
                this.form.new_test_driver_count = res.new_test_driver_count;
            });
        },
        trackStatistics() {
            Core.Api.CRMDashboard.trackStatistics({
                ...this.searchForm,
            }).then(res => {
                this.form.track_count = res.track_count;
                this.form.call_count = res.call_count;
                this.form.visit_count = res.visit_count;
                this.form.pool_count = res.pool_count;
                this.form.customer_count = res.customer_count;
                this.form.bo_count = res.bo_count;
            });
        },
        boStatistics() {
            Core.Api.CRMDashboard.boStatistics({
                ...this.searchForm,
            }).then(res => {
                res.list;
            });
        },
    },
};
</script>

<style lang="less" scoped>
.title {
    padding: 12px 16px;
    border-bottom: 2px solid #f0f2f5;
    font-size: 16px;
    font-weight: bold;
    .flex(space-between, center, row);
    .tab-item {
        display: inline-block;
        padding: 4px 8px;
        border: 1px solid grey;
        margin-right: 2px;
        font-size: 12px;
        user-select: none;
        cursor: pointer;
        &:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }
        &:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            margin-right: 0;
        }
    }
    .tab-current {
        border: 1px solid #006ef9;
        color: #006ef9;
    }
}
.contain {
    padding: 16px;
}
.form-item {
    // border: 1px solid red;
    border-bottom: 1px solid #f0f2f5;
    padding: 16px 0;
    .flex(space-between, center, row);
    .form-label {
        font-size: 14px;
    }
    .form-value {
        color: #006ef9;
        font-size: 20px;
    }
}
.chart {
    width: 100%;
    height: auto;
}
.data-body {
    .flex(flex-start, center, row);
    .icon {
        text-align: center;
    }
}
.data-contain {
    flex-grow: 1;
    width: auto;
    .flex(space-between, center, row);
    .info-item {
        .flex(space-between, center);
        .label {
            font-size: 12px;
            color: grey;
        }
        .value {
            font-size: 24px;
            font-weight: bold;
            color: black;
        }
    }
}
</style>
