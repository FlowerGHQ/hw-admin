<template>
    <div id="DemoPage">
        <!-- 数据概览 -->
        <DataOverview :searchForm="searchForm" @select="searchFormOperation" />
        <a-row :gutter="[8, 0]" v-if="!$auth('ADMIN')">
            <a-col :xs="24" :sm="24" :xl="12" :xxl="14">
                <a-row :gutter="[8, 0]">
                    <!-- 待办事项 -->
                    <a-col :span="24">
                        <Backlog />
                    </a-col>
                    <!-- 商机分析 -->
                    <a-col :span="24">
                        <NewBoStatistics :searchForm="searchForm" />
                    </a-col>
                </a-row>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="12" :xxl="10">
                <a-row :gutter="[8, 0]">
                    <!-- 跟进统计 -->
                    <a-col :span="24">
                        <!-- <PerformanceList :searchForm="searchForm" /> -->
                        <!-- 跟进统计 -->
                        <FollowUpStatistics :searchForm="searchForm" />
                    </a-col>
                    <!-- 销售业绩排名(TOP10) -->
                    <a-col :span="24">
                        <SaleRankStatistics :searchForm="searchForm" />
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
        <a-row :gutter="[8, 0]" v-if="$auth('ADMIN')">
            <!-- 数据趋势 -->
            <a-col :xs="24" :sm="24" :xl="15" :xxl="15">
                <a-row :gutter="[8, 0]">
                    <!-- 数据趋势 -->
                    <a-col :span="24">
                        <DataTrendStatistics :searchForm="searchForm" :isPeople="isPeople" :list="list" />
                    </a-col>
                    <!-- 客户购买意向 -->
                    <a-col :span="24"> </a-col>
                </a-row>
            </a-col>
            <!-- 车辆预订总数 -->
            <a-col :xs="24" :sm="24" :xl="9" :xxl="9">
                <a-row :gutter="[8, 0]">
                    <!-- 车辆预订总数 -->
                    <a-col :span="24">
                        <OrderTotalCard @click="handleCarClick" :isCar="isCar" :count="carCount" />
                    </a-col>
                    <!-- 客户总数 -->
                    <a-col :span="24">
                        <ClientTotalCard @click="handlePeopleClick" :isPeople="isPeople" :count="peopleCount" />
                    </a-col>
                </a-row>
            </a-col>
            <!-- 转化分析 -->
            <a-col :xs="24" :sm="24" :xl="12" :xxl="13">
                <a-row :gutter="[8, 0]">
                    <!-- 转化分析 -->
                    <a-col :span="24">
                        <TransformationStatistics :searchForm="searchForm" />
                    </a-col>
                    <!-- 客户来源分布 -->
                    <a-col :span="24">
                        <DistributionStatistics :searchForm="searchForm" />
                    </a-col>
                </a-row>
            </a-col>
            <!-- 商机分析 -->
            <a-col :xs="24" :sm="24" :xl="12" :xxl="11">
                <a-row :gutter="[8, 0]">
                    <!-- 商机分析 -->
                    <a-col :span="24">
                        <NewBoStatistics :searchForm="searchForm" />
                    </a-col>
                    <!-- 销售业绩排名(TOP10) -->
                    <a-col :span="24">
                        <SaleRankStatistics :searchForm="searchForm" />
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import Card from './card.vue';
import SalesStatistics from './components/SalesStatistics.vue';
import TrackStatistics from './components/TrackStatistics.vue';
import PerformanceList from './components/PerformanceList.vue';
import BoStatistics from './components/BoStatistics.vue';
import PurchaseIntentIntention from './components/PurchaseIntentIntention.vue';
import TestDriveIntention from './components/TestDriveIntention.vue';
import SaleRankStatistics from './components/SaleRankStatustics.vue';
import OrderTotalCard from './components/OrderTotalCard.vue';
import ClientTotalCard from './components/ClientTotalCard.vue';
import DataTrendStatistics from './components/DataTrendStatistics.vue';
import TransformationStatistics from './components/TransformationStatistics.vue';
import DistributionStatistics from './components/DistributionStatistics.vue';

import DataOverview from './components/DataOverview.vue';
import Backlog from './components/Backlog.vue';
import FollowUpStatistics from './components/FollowUpStatistics.vue';
import NewBoStatistics from './components/NewBoStatistics.vue';

import TimeSearch from '@/components/common/TimeSearch.vue';
import Core from '../../core';

export default {
    name: 'Demo',
    components: {
        Card,
        TimeSearch,
        SalesStatistics,
        TrackStatistics,
        PerformanceList,
        BoStatistics,
        PurchaseIntentIntention,
        TestDriveIntention,
        SaleRankStatistics,
        DataTrendStatistics,
        DistributionStatistics,

        DataOverview,
        Backlog,
        FollowUpStatistics,
        NewBoStatistics,
        OrderTotalCard,
        ClientTotalCard,
        TransformationStatistics,
    },
    props: {},
    data() {
        return {
            searchForm: {
                group_id: undefined,
                begin_time: (Date.now() - 1 * 24 * 60 * 60 * 1000) / 1000,
                end_time: Date.now() / 1000,
                day: 1,
            },
            isCar: true, // 车辆预定默认显示
            isPeople: false,
            carCount: 0, // 车辆预定总数
            peopleCount: 0, // 客户总数
            list: [], // 数据趋势list数据
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.httpPeople();
        this.httpCar();
    },
    methods: {
        // 车辆预订总数模块点击事件
        handleCarClick() {
            this.httpCar();
            this.isCar = true;
            this.isPeople = false;
        },
        // 客户总数模块点击事件
        handlePeopleClick() {
            this.httpPeople();
            this.isCar = false;
            this.isPeople = true;
        },
        searchFormOperation(searchForm) {
            this.searchForm = searchForm;
            if (this.isCar === true) {
                this.httpCar();
            }
            if (this.isPeople === true) {
                this.httpPeople();
            }
        },
        // 车辆预订总数接口
        httpCar() {
            Core.Api.CRMDashboard.carTotalStatistics(this.searchForm).then(res => {
                console.log('车辆的数据', res);
                this.carCount = res.count;
                if (this.isCar) {
                    this.list = res.list;
                }
            });
        },
        // 客户总数接口
        httpPeople() {
            Core.Api.CRMDashboard.customerTotalStatistics(this.searchForm).then(res => {
                console.log('客户的数据', res);
                this.peopleCount = res.count;
                if (this.isPeople) {
                    this.list = res.list;
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
.list-container {
    margin-bottom: 24px;
}

:deep(.ant-col-24) {
    padding-right: 12px;
}
</style>
