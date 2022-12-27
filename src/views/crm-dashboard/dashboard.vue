<template>
  <div id="DemoPage">
    <DataOverview :searchForm="searchForm"  />
    <div class="SearchRangePicker list-container range">
      <div class="title">统计范围：</div>
      <a-radio-group v-model:value="day" class="time-type" @change="handleTimeTypeChange">
        <a-radio-button :class="[day === 1 ? 'type-item active' : 'type-item']" :value="1">近7日</a-radio-button>
        <a-radio-button :class="[day === 2 ? 'type-item active' : 'type-item']" :value="2">近15日</a-radio-button>
        <a-radio-button :class="[day === 3 ? 'type-item active' : 'type-item']" :value="3">近30日</a-radio-button>
      </a-radio-group>
      <a-range-picker v-model:value="time" @change="handleChange()" :allowClear="false"
        :placeholder="[$t('crm_def.start_time'), $t('crm_def.end_time')]" ref="TimeSearch" />
      <a-tree-select class="CategoryTreeSelect" v-model:value="searchForm.group_id"
        :placeholder="$t('def.select') + $t('crm_c.group')" :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
        :tree-data="groupOptions" tree-default-expand-all />
      <div class="time-pick">
        <a-button type="primary" class="btn search" @click="handleTimeChange">查询</a-button>
        <a-button class="btn reset" @click="handleSearchReset">重置</a-button>
      </div>
    </div>
    <div></div>
    <a-row :gutter="[8, 0]" v-if="$auth('ADMIN')">
      <a-col :xs="24" :sm="24" :xl="12" :xxl="14">
        <a-row :gutter="[8, 0]">
          <!-- 待办事项 -->
          <a-col :span="24">
            <Backlog />
          </a-col>
          <!-- 商机分析 -->
          <a-col :span="24">
            <NewBoStatistics />
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
    <a-row :gutter="[8, 0]" v-if="!$auth('ADMIN')">
      <a-col :xs="24" :sm="24" :xl="12" :xxl="9">
        <a-row :gutter="[8, 0]">
          <!-- 车辆预订总数 -->
          <a-col :span="24">
            <OrderTotalCard />
          </a-col>
          <!-- 客户总数 -->
          <a-col :span="24">
            <ClientTotalCard />
          </a-col>
        </a-row>
      </a-col>
      <a-col :xs="24" :sm="24" :xl="12" :xxl="15">
        <a-row :gutter="[8, 0]">
          <!-- 数据趋势 -->
          <a-col :span="24">
            <DataTrendStatistics />
          </a-col>
          <!-- 客户购买意向 -->
          <a-col :span="24">
          </a-col>
        </a-row>
      </a-col>
      <a-col :xs="24" :sm="24" :xl="12" :xxl="13">
        <a-row :gutter="[8, 0]">
          <!-- 转化分析 -->
          <a-col :span="24">
            <TransformationStatistics />
          </a-col>
          <!-- 客户来源分布 -->
          <a-col :span="24">
            <DistributionStatistics />
          </a-col>
        </a-row>
      </a-col>
      <a-col :xs="24" :sm="24" :xl="12" :xxl="11">
        <a-row :gutter="[8, 0]">
          <!-- 商机分析 -->
          <a-col :span="24">
            <NewBoStatistics />
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
    };
  },
  watch: {},
  computed: {},
  created() { },
  mounted() {
    this.handleGroupTree();
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
    }
  },
};
</script>

<style lang="less" scoped>
.list-container {
  margin-bottom: 16px;
}

.SearchRangePicker {
  margin-bottom: 20px;
  width: 100%;
  display: flex;

  .org-type {
    margin-right: 20px;

    .type-item {
      width: 88px;
      text-align: center;
      border-color: #eaecf2;
      box-shadow: 0 0 0 0;

      &::after,
      &::before {
        background-color: #eaecf2;
      }

      &:hover {
        color: @TC_P;
      }

      &.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
        color: @TC_P;
        background: @BG_N;
        border-color: @BC_P;
        box-shadow: 0;

        &::after,
        &::before {
          background-color: @BC_P;
        }
      }
    }
  }

  .time-type {
    margin-left: 24px;
    .fac();

    .type-item {
      height: 40px;
      padding: 10px 24px;
      margin-left: 0 !important;
      margin-right: 24px;
      font-size: 14px;
      font-weight: 500;
      color: #444444;
      .fcc();

      // border-radius: 4px;
      +.type-item {
        margin-left: 24px;
      }

      color: @TC_link;
      cursor: pointer;

      &:hover,
      &.active {
        color: @TC_P;
      }
    }
  }

  .CategoryTreeSelect {
    width: 200px;
    margin-right: 24px;
  }
}

.range {
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .title {
    font-size: 18px;
    font-weight: 500;
    color: #333333;
  }

  .time-pick {
    .btn {
      height: 40px;
      padding-left: 25px;
      padding-right: 25px;
      border-radius: 4px 4px 4px 4px;
      font-size: 14px;
    }

    .search {
      background: #4977EE;
      border-color: #4977EE;
    }

    .reset {
      margin-left: 24px;
    }
  }

  :deep(.ant-select-selector) {
    height: 40px;
  }

  :deep(.ant-select-selection-placeholder) {
    line-height: 38px;
    font-weight: 500;
    font-size: 14px;
  }

  :deep(.ant-select-selection-item) {
    height: 38px;
    line-height: 38px;
    font-weight: 500;
    font-size: 14px;
    color: #444444;
  }

  :deep(.ant-picker-range) {
    margin-right: 24px;
    height: 40px;
  }

  :deep(.ant-picker-input input) {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
