<template>
    <div id="VoteDashboard">
        <!-- 时间筛选组件 -->
        <VoteTimeSearch :activity_id="searchForm.activity_id" :searchForm="searchForm" @select="searchFormOperation" />
        <a-row :gutter="[8, 0]">
            <a-col :xs="24" :sm="24" :xl="12" :xxl="12">
                <a-row :gutter="[8, 0]">
                    <a-col :span="24">
                        <!-- 每日访问参与投票人数 按日期 柱状图 -->
                        <DailyVotingNumbersChartModel :searchForm="searchForm" />
                    </a-col>
                </a-row>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="12" :xxl="12">
                <a-row :gutter="[8, 0]">
                    <a-col :span="24">
                        <!-- 来源 环图 -->
                        <ChannelRingChartModel :searchForm="searchForm" />
                    </a-col>
                </a-row>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="12" :xxl="12">
                <a-row :gutter="[8, 0]">
                    <a-col :span="24">
                        <!-- 已支付用户参与比例 环图 -->
                        <PartRatioRingChartModel :searchForm="searchForm" />
                    </a-col>
                </a-row>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="12" :xxl="12">
                <a-row :gutter="[8, 0]">
                    <a-col :span="24">
                        <!-- 投票颜色分布 环图 -->
                        <ColorDistChartModel :searchForm="searchForm" />
                    </a-col>
                </a-row>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="12" :xxl="12">
                <a-row :gutter="[8, 0]">
                    <a-col :span="24">
                        <!-- 投票地区分布 -->
                        <ChinaMapChartModel :searchForm="searchForm" />
                    </a-col>
                </a-row>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="12" :xxl="12">
                <a-row :gutter="[8, 0]">
                    <a-col :span="24">
                        <!-- 每日访问参与投票人数 按渠道 柱状图 -->
                        <votingChannelChartModel :searchForm="searchForm" />
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import VoteTimeSearch from './components/VoteTimeSearch.vue';
import ChannelRingChartModel from './components/ChannelRingChartModel.vue';
import ColorDistChartModel from './components/ColorDistChartModel.vue';
import PartRatioRingChartModel from './components/PartRatioRingChartModel.vue';
import ChinaMapChartModel from './components/ChinaMapChartModel.vue';
import votingChannelChartModel from './components/votingChannelChartModel.vue';
import DailyVotingNumbersChartModel from './components/DailyVotingNumbersChartModel.vue';
import Core from '../../core';
import dayjs from 'dayjs';

export default {
    name: 'VoteDashboard',
    components: {
        VoteTimeSearch,
        ChannelRingChartModel,
        PartRatioRingChartModel,
        ColorDistChartModel,
        ChinaMapChartModel,
        votingChannelChartModel,
        DailyVotingNumbersChartModel,
    },
    props: {},
    data() {
        return {
            searchForm: {
                begin_time: undefined,
                end_time: undefined,
                activity_id: 0,
            },
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.getActivityId();
        this.getDefaultTime();
    },
    methods: {
        // 获取时间选择组件改变时间
        searchFormOperation(searchForm) {
            this.searchForm = searchForm;
        },
        // 获取当天默认时间
        getDefaultTime() {
            const currentTime = dayjs(); // 当前时间
            const todayStart = dayjs().startOf('day'); // 今天0点
            this.defaultTime = [todayStart, currentTime];
            this.searchForm.begin_time = this.defaultTime[0].unix(); // 获取开始时间的时间戳
            this.searchForm.end_time = this.defaultTime[1].unix(); // 获取结束时间的时间戳
        },
        // get活动Id
        async getActivityId() {
            try {
                const res = await Core.Api.VoteData.getActivityId({
                    type_code: 'SENMENTI0_COLOR_VOTE',
                });
                console.log('getActivityId res', res);
                this.searchForm.activity_id = res;
            } catch (error) {
                console.error('Error in getActivityId:', error);
            }
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
