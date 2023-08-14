<template>
  <div id="DemoPage">
    <!-- 时间筛选组件 -->
    <VoteTimeSearch :searchForm="searchForm" @select="searchFormOperation" />
    <a-row :gutter="[8, 0]">
      <a-col :xs="24" :sm="24" :xl="15" :xxl="12">
        <a-row :gutter="[8, 0]">
          <a-col :span="24">
            <!-- 每日访问参与投票人数 按日期 柱状图 -->
            <DailyVotingNumbersChartModel :searchForm="searchForm" />
          </a-col>
        </a-row>
      </a-col>
      <a-col :xs="24" :sm="24" :xl="15" :xxl="12">
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
import VoteTimeSearch from "./components/VoteTimeSearch.vue";
import ChannelRingChartModel from "./components/ChannelRingChartModel.vue"
import ColorDistChartModel from "./components/ColorDistChartModel.vue"
import PartRatioRingChartModel from "./components/PartRatioRingChartModel.vue"
import ChinaMapChartModel from "./components/ChinaMapChartModel.vue"
import votingChannelChartModel from "./components/votingChannelChartModel.vue"
import DailyVotingNumbersChartModel from "./components/DailyVotingNumbersChartModel.vue"
import Core from "../../core";

export default {
  name: "Demo",
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
        begin_time: (Date.now() - 1 * 24 * 60 * 60 * 1000) / 1000,
        end_time: Date.now() / 1000,
      },
    };
  },
  watch: {},
  computed: {},
  created() { },
  mounted() {
    this.httpPeople();
    this.httpCar();
  },
  methods: {
    searchFormOperation(searchForm) {
      this.searchForm = searchForm
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
        console.log("车辆的数据", res);
        this.carCount = res.count
        if (this.isCar) {
          this.list = res.list
        }
      })
    },
    // 客户总数接口
    httpPeople() {
      Core.Api.CRMDashboard.customerTotalStatistics(this.searchForm).then(res => {
        console.log("客户的数据", res);
        this.peopleCount = res.count
        if (this.isPeople) {
          this.list = res.list
        }
      })
    }
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
