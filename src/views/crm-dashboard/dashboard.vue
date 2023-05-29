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
            <FollowUpStatistics :searchForm="searchForm"/>
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
            <DataTrendStatistics :searchForm="searchForm" :isCar="isCar" :isPeople="isPeople" :list="list" :maxCount="maxCount" />
          </a-col>
          <!-- 客户购买意向 -->
          <a-col :span="24">
          </a-col>
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
            <TransformationStatistics :searchForm="searchForm"  />
          </a-col>
          <!-- 客户来源分布 -->
          <a-col :span="24">
            <DistributionStatistics :searchForm="searchForm"  />
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
import Card from "./card.vue";
import SalesStatistics from "./components/SalesStatistics.vue";
import TrackStatistics from "./components/TrackStatistics.vue";
import PerformanceList from "./components/PerformanceList.vue";
import BoStatistics from "./components/BoStatistics.vue";
import PurchaseIntentIntention from "./components/PurchaseIntentIntention.vue";
import TestDriveIntention from "./components/TestDriveIntention.vue";
import SaleRankStatistics from './components/SaleRankStatustics.vue';
import OrderTotalCard from './components/OrderTotalCard.vue'
import ClientTotalCard from './components/ClientTotalCard.vue'
import DataTrendStatistics from './components/DataTrendStatistics.vue'
import TransformationStatistics from './components/TransformationStatistics.vue'
import DistributionStatistics from './components/DistributionStatistics.vue'

import DataOverview from "./components/DataOverview.vue";
import Backlog from "./components/Backlog.vue";
import FollowUpStatistics from "./components/FollowUpStatistics.vue";
import NewBoStatistics from "./components/NewBoStatistics.vue";

import TimeSearch from "@/components/common/TimeSearch.vue";
import Core from "../../core";
import dayjs from "dayjs";

export default {
  name: "Demo",
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
        begin_time: "",
        end_time: "",
        day: 1,
      },
      time: [],
      groupOptions: [],
      day: '',
      isCar:true,
      isPeople:false,
        carCount: 0,
        peopleCount: 0,
        list: [],
        maxCount: 0,
    };
  },
  watch: {},
  computed: {},
  created() { },
  mounted() {
    this.handleGroupTree();
      this.httpPeople();
      this.httpCar();

  },
  methods: {
    handleSearch() {
      // 搜索
      // this.getTableData();
    },
    handleSearchReset() {
      // 重置搜索
      Object.assign(this.searchForm, this.$options.data().searchForm);
      this.day = ''
      this.time = []
      // this.getTableData();
    },
    handleGroupTree() {
      Core.Api.CRMGroupMember.structureByUser().then((res) => {
        this.groupOptions = res.list;
        console.log(res);
      });
    },
    handleChange() {
      let begin_time = dayjs(this.time[0]);
      let end_time = dayjs(this.time[1]);
      // let data = {
      //     org_type: this.org_type,
      //     begin_time: begin_time.startOf('day').unix(),
      //     end_time: end_time.endOf('day').unix(),
      // }
      // let diff = end_time.diff(begin_time, 'days')
      //
      // let dateList = [begin_time.format('YYYY-MM-DD')]
      // for (let i = 1; i <= diff; i++) {
      //     dateList.push(dayjs(begin_time).add(i, 'days').format('YYYY-MM-DD'))
      // }
      // console.log('handleChange data:', data, 'dateList', dateList)
      let searchForm = this.$Util.deepCopy(this.searchForm);
      searchForm.begin_time = begin_time.startOf("day").unix();
      searchForm.end_time = end_time.endOf("day").unix();
      this.searchForm = searchForm;
      // this.$emit('search', data, dateList)
    },

    handleTimeChange() { },

    // 时间转换
    handleTimeTypeChange() {
      switch (this.day) {
        case 1:
          this.searchForm.begin_time = (Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000; break;
        case 2:
          this.searchForm.begin_time = (Date.now() - 15 * 24 * 60 * 60 * 1000) / 1000; break;
        case 3:
          this.searchForm.begin_time = (Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000; break;
      }

      this.searchForm.end_time = Date.now() /1000;
        this.searchForm.day = this.day
    },
    handleCarClick(){
      this.httpCar();
      this.isCar = true
      this.isPeople = false
    },
    handlePeopleClick(){
      this.httpPeople()
      this.isCar = false
      this.isPeople = true
    },
      searchFormOperation(searchForm){
        this.searchForm = searchForm
        if(this.isCar === true){
          this.httpCar();
        }
        if(this.isPeople === true){
          this.httpPeople();
        }
      },
      httpCar(){
          Core.Api.CRMDashboard.carTotalStatistics(this.searchForm).then(res => {
              this.list = res.list
              this.carCount = res.count
              this.maxCount = res.max_count
          })
      },
      httpPeople(){
          Core.Api.CRMDashboard.customerTotalStatistics(this.searchForm).then(res => {
              this.list = res.list
              this.peopleCount = res.count
              this.maxCount = res.max_count
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
