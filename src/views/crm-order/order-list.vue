<template>
  <div id="OrderList">
    <div class="list-container">
      <div class="title-container">
        <div class="title-area">{{ $t("retail.order_list") }}</div>

        <!-- 隐藏导入-导出功能-原本的合同列表 -->
        <div class="btns-area"  v-if="false">
          <a-upload
            name="file"
            class="file-uploader"
            :file-list="upload.fileList"
            :action="upload.action"
            :show-upload-list="false"
            :headers="upload.headers"
            :data="upload.data"
            accept=".xlsx,.xls"
            @change="handleMatterChange"
          >
            <a-button type="primary" ghost class="file-upload-btn">
              <i class="icon i_add" />{{ $t("i.import") }}
            </a-button>
          </a-upload>
          <a-button
            class="m-l-10"
            type="primary"
            @click="routerChange('edit')"
            v-if="$auth('crm-order.save')"
            ><i class="icon i_add" />{{ $t("crm_o.save") }}</a-button
          >
        </div>
      </div>
      <div class="tab-box">
        <a-tabs v-model:activeKey="activeKey" @change="tabChange">
          <a-tab-pane v-for="item in Order_Status_Map" :key="item.value" :tab="lang=='zh'?item.zh:item.en"></a-tab-pane>
        </a-tabs>
      </div>
      <div class="search">
        <a-row class="row-detail">
          <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
            <div class="key">{{ $t("dis.order_source") }}：</div>
            <!-- 订单来源 -->
            <div class="value">
              <!-- <a-input
                :placeholder="$t('def.input')"
                v-model:value="searchForm.name"
                @keydown.enter="handleSearch"
              /> -->
              <a-select
                v-model:value="searchForm.source_type"
                :placeholder="$t('def.select')"
                @change="handleSearch"
              >
                <a-select-option :value="0">
                  {{ lang === "zh" ? "全部" : "all" }}
                </a-select-option>
                <a-select-option
                  v-for="item of SOURCE_TYPE"
                  :key="item.key"
                  :value="item.value"
                  >{{ lang === "zh" ? item.zh : item.en }}</a-select-option
                >
              </a-select>
            </div>
          </a-col>

          <a-col
            :xs="24"
            :sm="24"
            :xl="8"
            :xxl="6"
            class="row-item"
          >
            <div class="key">{{ $t("in.order_number") }}：</div>
            <!-- 订单号 -->
            <div class="value">
              <a-input
                :placeholder="$t('def.input')"
                v-model:value="searchForm.uid"
                @keydown.enter="handleSearch"
              />
            </div>
          </a-col>
          <a-col  :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
            <div class="key">{{ $t("crm_o.customer_name") }}：</div>
            <!-- 客户名称 -->
            <div class="value">
              <a-input
                :placeholder="$t('def.email_phone_name')"
                v-model:value="searchForm.customer_name"
                @keydown.enter="handleSearch"
              />
            </div>
          </a-col>
          <a-col
            :xs="24"
            :sm="24"
            :xl="8"
            :xxl="6"
            class="row-item"
          >
            <div class="key">{{ $t("crm_o.own_user_name") }}：</div>
            <!-- 负责人 -->
            <div class="value">
              <a-select
                v-model:value="searchForm.own_user_id"
                show-search
                :placeholder="$t('def.input')"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                allowClear
                @search="handleOwnUserSearch"
              >
                <a-select-option
                  v-for="item in ownUserOptions"
                  :key="item.user_id"
                  :value="item.user_id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col
            :xs="24"
            :sm="24"
            :xl="8"
            :xxl="6"
            class="row-item"
          >
            <div class="key">{{ $t("crm_o.pay_progress") }}：</div>
            <!-- 支付进度 -->
            <div class="value">
              <a-select
                v-model:value="searchForm.paid_money_progress"
                :placeholder="$t('def.select')"
                @change="handleSearch"
              >
                <a-select-option :value="0">
                  {{ lang === "zh" ? "全部" : "all" }}
                </a-select-option>
                <a-select-option
                  v-for="item of CRM_PAID_MONEY_PROGRESS_MAP"
                  :key="item.key"
                  :value="item.value"
                  >{{ lang === "zh" ? item.zh : item.en }}</a-select-option
                >
              </a-select>
            </div>
          </a-col>
          <!-- <a-col
            :xs="24"
            :sm="24"
            :xl="8"
            :xxl="6"
            class="row-item"
          >
            <div class="key">{{ $t("p.order_status") }}：</div> -->
            <!-- 订单状态 -->
          <!--   <div class="value">
              <a-select
                v-model:value="searchForm.status"
                :placeholder="$t('def.select')"
                @change="handleSearch"
              >
                <a-select-option :value="0">
                  {{ lang === "zh" ? "全部" : "all" }}
                </a-select-option>
                <a-select-option
                  v-for="item of CRM_STATUS_MAP"
                  :key="item.key"
                  :value="item.value"
                  >{{ lang === "zh" ? item.zh : item.en }}</a-select-option
                >
              </a-select>
            </div>
          </a-col> -->
          <a-col
            :xs="24"
            :sm="24"
            :xl="8"
            :xxl="6"
            class="row-item"
          >
            <div class="key">{{ $t("p.payment_method") }}：</div>
            <!-- 支付方式 -->
            <div class="value">
              <a-select
                v-model:value="searchForm.payment_type"
                :placeholder="$t('def.select')"
                @change="handleSearch"
              >
                <a-select-option :value="0">
                  {{ lang === "zh" ? "全部" : "all" }}
                </a-select-option>
                <a-select-option
                  v-for="item of PAYMENT_TYPE"
                  :key="item.key"
                  :value="item.value"
                  >{{ lang === "zh" ? item.zh : item.en }}</a-select-option
                >
              </a-select>
            </div>
          </a-col>
    
          <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
              <div class="key">{{$t('crm_o.country_city')}}：</div>
              <div class="value">
                  <!-- 参考 customer -> customer-edit -->
                  <addressCascader 
                      ref="addressRef"
                      v-model:value="areaMap" 
                      :def-area='showArea'
                      @select="addressSelect"
                      />  
              </div>
          </a-col>
          <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
            <div class="key">{{ $t("crm_group.name") }}：</div>
            <!-- 区域 -->
            <div class="value">
              <a-select
                v-model:value="searchForm.group_id"
                :placeholder="$t('def.select')"
                allowClear
              >
                <!-- <a-select-option :value="0">
                                    {{ lang === "zh" ? "全部" : "all" }}
                                </a-select-option> -->
                <a-select-option
                  v-for="item of regionsList"
                  :key="item.id"
                  :value="item.value"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </div>
          </a-col>
    
          <!-- 下单时间 -->
          <a-col
            :xs="24"
            :sm="24"
            :xl="8"
            :xxl="6"
            class="row-item"
          >
            <div class="key">{{ $t("crm_o.order_time") }}：</div>
            <div class="value">
              <TimeSearch @search="handleOtherSearchOrder" ref="TimeSearchOrder" />
            </div>
          </a-col>
          <!-- 付款时间 -->
          <a-col
            :xs="24"
            :sm="24"
            :xl="8"
            :xxl="6"
            class="row-item"
          >
            <div class="key">{{ $t("crm_o.pay_time") }}：</div>
            <div class="value">
              <TimeSearch @search="handleOtherSearchPayment" ref="TimeSearchPayment" />
            </div>
          </a-col>
          <!-- 退款时间 -->
          <a-col
            :xs="24"
            :sm="24"
            :xl="8"
            :xxl="6"
            class="row-item"
          >
            <div class="key">{{ $t("crm_o.refund_time") }}：</div>
            <div class="value">
              <TimeSearch @search="handleOtherSearchRefunded" ref="TimeSearchRefunded" />
            </div>
          </a-col>
       <!--    <a-col
            :xs="24"
            :sm="24"
            :xl="8"
            :xxl="6"
            class="row-item"
          >
            <div class="key">{{ $t("crm_o.collection_schedule") }}：</div> -->
            <!-- 回款进度 -->
    <!--         <div class="value">
              <a-select
                v-model:value="searchForm.paid_money_progress"
                :placeholder="$t('def.select')"
                @change="handleSearch"
              >
                <a-select-option :value="0">
                  {{ lang === "zh" ? "全部" : "all" }}
                </a-select-option>
                <a-select-option
                  v-for="item of CRM_PAID_MONEY_PROGRESS_MAP"
                  :key="item.key"
                  :value="item.value"
                  >{{ lang === "zh" ? item.zh : item.en }}</a-select-option
                >
              </a-select>
            </div>
          </a-col> -->
          <!-- <a-col
            :xs="24"
            :sm="24"
            :xl="8"
            :xxl="6"
            class="row-item"
          >
            <div class="key">{{ $t("crm_o.customer_status") }}：</div> -->
            <!-- 客户状态 -->
         <!--    <div class="value">
              <a-select
                v-model:value="searchForm.search_type"
                :placeholder="$t('def.select')"
                @change="handleSearch"
              >
                <a-select-option
                  v-for="item of CRM_CUSTOMER_MAP"
                  :key="item.key"
                  :value="item.value"
                  >{{ lang === "zh" ? item.zh : item.en }}</a-select-option
                >
              </a-select>
            </div>
          </a-col> -->
        <!--   <a-col
            :xs="24"
            :sm="24"
            :xl="8"
            :xxl="6"
            class="row-item"
          >
            <div class="key">{{ $t("crm_o.create_user") }}：</div> -->
            <!-- 创建人 -->
          <!--   <div class="value">
              <a-select
                v-model:value="searchForm.create_user_id"
                show-search
                :placeholder="$t('def.input')"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                allowClear
                @search="handleCreateUserSearch"
              >
                <a-select-option
                  v-for="item in createUserOptions"
                  :key="item.create_user_id"
                  :value="item.create_user_id"
                >
                  {{ item.create_user_name }}
                </a-select-option>
              </a-select>
            </div>
          </a-col> -->
          <!-- <a-col
            :xs="24"
            :sm="24"
            :xl="16"
            :xxl="8"
            class="row-item"
          >
            <div class="key">{{ $t("d.create_time") }}：</div>
            <div class="value">
              <TimeSearch @search="handleOtherSearch" ref="TimeSearch" />
            </div>
          </a-col> -->
         <!--  <a-col
            :xs="24"
            :sm="24"
            :xl="2"
            :xxl="3"
            class="row-item search-text"
            @click="moreSearch"
          >
            {{ show ? $t("search.stow") : $t("search.advanced_search") }}
            <i
              class="icon i_xialajiantouxiao"
              style="margin-left: 5px"
              v-if="!show"
            ></i>
            <i
              class="icon i_shouqijiantouxiao"
              style="margin-left: 5px"
              v-else
            ></i>
          </a-col> -->
        </a-row>
        
        <div class="btns m-b-20" >
                <div class="btn-left" ></div>
                <div class="btn-right">                  
                    <a-button @click="handleSearch(1)" type="primary" >
                        {{ $t("def.search") }}
                    </a-button>
                    <a-button @click="handleSearchReset" >
                        {{ $t("def.reset") }}
                    </a-button>
                </div>
            </div>
      </div>
      <!-- 注释多选删除功能 -->
      <!-- <div class="operate-container"> -->
        <!--                <a-button type="primary" @click="handleBatch('transfer')" v-if="$auth('crm-order.save')">{{ $t('crm_c.transfer') }}</a-button>-->
        <!--    <a-button
              type="danger"
              @click="handleBatchDelete"
              v-if="$auth('crm-order.delete')"
              >{{ $t("crm_c.delete") }}</a-button
            > -->
      <!-- </div> -->
      <!-- 
          :row-selection="rowSelection"
          :row-key="(record) => record.id"
       -->

      <div class="table-container">
        <a-table
          :columns="tableColumns"
          :data-source="tableData"
          :scroll="{ x: true }"
          :pagination="false"
          @change="getTableDataSorter"
        >
          <template #headerCell="{ title }">
            {{ $t(title) }}
          </template>
          <template #bodyCell="{ column, text, record }">
           <!--  <template v-if="column.key === 'detail'">
              <a-tooltip placement="top" :title="text">
                <a-button
                  type="link"
                  @click="routerChange('detail', record)"
                  v-if="$auth('crm-order.detail')"
                  ><span :class="{nameStyle: nameBoolean(record)}">{{text || "-"}}</span></a-button>
              </a-tooltip>
            </template> -->
            <template v-if="column.key === 'source_type'" >
              {{ $Util.orderSourceType(text,lang) }}
            </template>
            <template v-else-if="column.key === 'status'">
              <span class="before-icon" :style="{ background:$Util.orderManageStatus(text)?.color }" v-if="text"></span>{{ $Util.orderManageStatus(text)[lang] || '-'}}
            </template>
            <!-- <template v-else-if="column.key === 'item'">
              {{ text || "-" }}
            </template> -->           
            <template v-else-if="column.key === 'customer_name'">
              {{ record.customer_name || "-" }}
            </template>
            <template v-else-if="column.key === 'phone'">
              {{ text || "-" }}
            </template>
            <template v-else-if="column.key === 'item_name'">
              <div style="height: 48px;display: inline-block;">
                <a-image :width="70" :src="getSrcImg(text)" />
                {{ text || '-' }}
              </div>
            </template>
            <template v-else-if="column.key === 'payment_type'">
              {{ $Util.orderPaymentType(text,lang) || '-' }}
            </template>
            <template v-else-if="column.key === 'time'">
              {{ $Util.timeFilter(text) }}
            </template>
            <template v-else-if="column.key === 'money'">
              {{ record.mType }}{{ $Util.countFilter(text) || "-" }}
            </template>
            <template v-else-if="column.key === 'country'">
              {{ `${record.to_country}${record.to_province}${record.to_city}` || '-' }}
            </template>
            <template v-else-if="column.key === 'own_user_name'">
              {{ record.own_user_name || "-" }}
            </template>
            <template v-else-if="column.key === 'create_user_name'">
              {{ record.create_user_name || "-" }}
            </template>
            <template v-else-if="column.key === 'util'">
              {{ $Util[column.util](text, $i18n.locale) }}
            </template>
            <template v-else-if="column.key === 'remark'">
              {{ text || "-" }}
            </template>
            <template v-else-if="column.key === 'operation'">
              <a-button type="link" @click="handleBatch('transfer', record)">{{
                $t("crm_c.transfer")
              }}</a-button>
              <a-button
                type="link"
                @click="routerChange('detail', record)"
                v-if="$auth('crm-order.detail')"
                ><i class="icon i_detail" />{{ $t("def.detail") }}</a-button
              >
            </template>
            <template v-else>
              {{ text || '-' }}
            </template>
          </template>
        </a-table>
      </div>
      <div class="paging-container">
        <a-pagination
          v-model:current="currPage"
          :page-size="pageSize"
          :total="total"
          show-quick-jumper
          show-size-changer
          show-less-items
          :show-total="
            (total) => $t('n.all_total') + ` ${total} ` + $t('in.total')
          "
          :hide-on-single-page="false"
          :pageSizeOptions="['10', '20', '30', '40']"
          @change="pageChange"
          @showSizeChange="pageSizeChange"
        />
      </div>
    </div>
    <a-modal
      v-model:visible="batchShow"
      :title="$t('crm_c.distribute_customer')"
      :after-close="handleBatchClose"
    >
      <div class="form-item required">
        <div class="key">{{ $t("crm_b.customer_name") }}：</div>
        <div class="value">
          {{ detail.customer_name }}
        </div>
      </div>
      <div class="form-item required">
        <div class="key">{{ $t("crm_o.name") }}：</div>
        <div class="value">
          {{ detail.name }}
        </div>
      </div>
      <div class="form-item required">
        <div class="key">{{ $t("crm_group.name") }}：</div>
        <div class="value">
          <a-tree-select
            class="CategoryTreeSelect"
            v-model:value="group_id"
            :placeholder="$t('def.select')"
            :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
            :tree-data="groupOptions"
            @change="getUserData('')"
            tree-default-expand-all
          />
        </div>
      </div>
      <div class="form-item required">
        <div class="key">{{ $t("crm_b.own_user_name") }}：</div>
        <div class="value">
          <a-select
            v-model:value="batchForm.own_user_id"
            show-search
            :placeholder="$t('def.input')"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @search="getUserData"
            :disabled="!group_id"
          >
            <a-select-option
              v-for="item in userData"
              :key="item.id"
              :value="item.id"
            >
              {{ item.account ? item.account.name : "-" }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <template #footer>
        <a-button @click="handleBatchSubmit" type="primary">{{
          $t("def.ok")
        }}</a-button>
        <a-button @click="handleBatchClose">{{ $t("def.cancel") }}</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import Core from "../../core";
import TimeSearch from "../../components/common/TimeSearch.vue";
import addressCascader from '@/components/common/AddressCascader.vue'
import { take } from 'lodash'
const modules = import.meta.globEager("../../assets/images/car/*")

export default {
  name: "OrderList",
  components: {
    TimeSearch,
    addressCascader
  },
  props: {},
  data() {
    return {
      activeKey: Core.Const.CRM_ORDER.Order_Status_Map['0'].value,
      loginType: Core.Data.getLoginType(),
      show: false,
      // 加载
      loading: false,
      // 分页
      currPage: 1,
      pageSize: 20,

      CRM_TYPE_MAP: Core.Const.CRM_ORDER.TYPE_MAP,
      CRM_STATUS_MAP: Core.Const.CRM_ORDER.STATUS_MAP,
      CRM_PAID_MONEY_PROGRESS_MAP: Core.Const.CRM_ORDER.PAID_MONEY_PROGRESS_MAP,  //支付进度
      PAYMENT_TYPE: Core.Const.CRM_ORDER.PAYMENT_TYPE,         //支付方式
      // CRM_CUSTOMER_MAP: Core.Const.CRM_ORDER.CUSTOMER_MAP,  //客户状态
      Order_Status_Map: Core.Const.CRM_ORDER.Order_Status_Map,  // 订单切换筛选
      SOURCE_TYPE: Core.Const.CRM_ORDER.SOURCE_TYPE,  // 订单来源
      total: 0,
      orderByFields: {},
      // 搜索
      searchForm: {
        // name: "",
        source_type: 0,         // 订单来源
        uid: '',                // 订单号
        customer_name: "",      // 客户名称
        own_user_id: undefined, // 负责人
        // create_user_name: "", 
        paid_money_progress: 0, // 支付進度
        // status: 0,              // 訂單狀態
        begin_time: "",
        end_time: "",
        type: "",
        // create_user_id:undefined,
        // search_type: 10,
        payment_type: undefined,//支付方式
        group_id: undefined,  //区域id
        // 国家城市
        to_country: '',
        to_province: '',
        to_city: '',
        // 下单时间
        order_begin_time: '', // （下单开始时间）
        order_end_time: '',   // （下单结束时间）
        // 支付时间
        payment_begin_time: '', // （支付开始时间）
        payment_end_time: '',   // （支付结束时间）
        // 退款时间
        refunded_begin_time: '', // （退款开始时间）
        refunded_end_time: '',   // （退款结束时间）
      },
      ownUserOptions: [],     //負責人
      createUserOptions: [], // 创建人列表
      // 表格
      tableData: [],
      batchForm: {
        own_user_id: "",
      },
      userData: [],
      batchShow: false,
      selectedRowKeys: [],
      selectedRowItems: [],
      selectedRowItemsAll: [],
      groupOptions: [],
      group_id: undefined,
      upload: {
        action: Core.Const.NET.URL_POINT + "/admin/1/crm-order/import-shop",
        fileList: [],
        headers: {
          ContentType: false,
        },
        data: {
          token: Core.Data.getToken(),
          type: "xlsx",
        },
      },
      nameColor: [],// 表格名字点击存进去数组,判断点击跳转后原先name颜色的
      // 区域列表
      regionsList: [],
      
      areaMap: {}, // 国家城市地址选择
      showArea:{
          /*   country: '', // 国家
            province: '', // 省份           
            city: '',   // 城市
            county: '', 
              */
            country: '',
            country_en: '',
            province: '',
            province_en: '',
            city: '',
            city_en: '',
            county: '',
      }, // 地址选择
    };
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler() {
        // 这两句刷新页面的时候，页数在之前的页数
        this.currPage = Core.Data.getItem('currPage')?Core.Data.getItem('currPage'): 1
        this.pageSize = Core.Data.getItem('pageSize')?Core.Data.getItem('pageSize'): 20
        this.getTableData();
        // this.handleSearchReset(false);
        // this.getUserData();
      },
    },
    searchForm:{
      deep:true,
      handler(oldValue,newValue) {
        if(oldValue === newValue){
            this.currPage = 1
            this.pageSize = 20
        }
      },
    }
  },
  computed: {
    tableColumns() {
      let columns = [
        // { title: "crm_o.name", dataIndex: "name", key: "detail", sorter: true },
        { title: "dis.order_source", dataIndex: "source_type", key: "source_type" },
        {
          title: "in.order_number",
          dataIndex: "uid",
          key: "uid",
          sorter: true,
        },
        { title: "p.order_status", dataIndex: "status", key: "status" },
        {
          title: "crm_o.customer_name",
          dataIndex: "customer_id",
          key: "customer_name",
        },
        { title: "n.email", dataIndex: "customer_email", key: "customer_email" },
        { title: "n.phone", dataIndex: "customer_phone", key: "customer_phone" },
        {
          title: "crm_o.own_user_name",
          dataIndex: "own_user_id",
          key: "own_user_name",
        },
        { title: "crm_o.pay_car_type", dataIndex: "item_name", key: "item_name" },
        { title: "crm_o.pay_progress", dataIndex: "paid_money_progress", key: "paid_money_progress" },
        
        /* {
          title: "crm_o.status",
          dataIndex: "status",
          key: "util",
          util: "CRMOrderStatusFilter",
          sorter: true,
        },
        {
          title: "crm_o.paid_money_progress",
          dataIndex: "paid_money_progress",
          key: "item",
        }, */
        { title: "crm_o.money", dataIndex: "money", key: "money" },
        // { title: "crm_o.income_money", dataIndex: "paid_money", key: "money" },//已回款
        { title: "crm_o.paied_money", dataIndex: "paid_money", key: "money" },  //已付金额
        { title: "crm_o.refunded_amount", dataIndex: "refunded", key: "money" },// 已退款
        { title: "crm_o.pending_payment", dataIndex: "pending_money", key: "money" }, //待付款
        { title: "crm_c.group", dataIndex: "group_name", key: "group_name" },
        // {title: 'd.update_time', dataIndex: 'update_time', key: 'time', sorter: true},
       
        {title: 'crm_o.country_city', dataIndex: 'to_country', key: 'country'},
        {title: 'crm_o.address', dataIndex: 'to_address', key: 'address'},
       /*  {
          title: "crm_o.create_user",
          dataIndex: "create_user_id",
          key: "create_user_name",
          sorter: true,
        }, */
        
        {title: 'n.store', dataIndex: 'store_name', key: 'store_name'},
        {title: 'crm_oi.payment_type', dataIndex: 'payment_type', key: 'payment_type'},
        /* {
          title: "crm_o.signing_date",
          dataIndex: "date",
          key: "time",
        },
        {
            title: "d.create_time",
            dataIndex: "create_time",
            key: "time",
            sorter: true,
        }, */
        {
            title: "crm_o.order_time",
            dataIndex: "order_time",
            key: "time",
            sorter: true,
        }, 
        {
            title: "crm_o.pay_time",
            dataIndex: "payment_time",
            key: "time",
            sorter: true,
        }, 
        {
            title: "crm_o.refund_time",
            dataIndex: "refunded_time",
            key: "time",
            sorter: true,
        }, 
        {
          title: "crm_c.remark",
          dataIndex: "remark",
          key: "remark",
        },
        { title: "def.operate", key: "operation", fixed: "right" },
      ];
      return columns;
    },
    // 注释多选删除功能
    /*  rowSelection() {
      return {
        type: "checkbox",
        selectedRowKeys: this.selectedRowKeys,
        preserveSelectedRowKeys: true,
        onChange: (selectedRowKeys, selectedRows) => {
          // 表格 选择 改变
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRowItemsAll.push(...selectedRows);
          let selectedRowItems = [];
          selectedRowKeys.forEach((id) => {
            let element = this.selectedRowItemsAll.find((i) => i.id == id);
            selectedRowItems.push(element);
          });
          this.selectedRowItems = selectedRowItems;
          console.log(
            "rowSelection this.selectedRowKeys:",
            this.selectedRowKeys,
            "selectedRowItems:",
            selectedRowItems
          );
          // this.$emit('submit', this.selectedRowKeys, this.selectedRowItems)
        },
      };
    }, */
    lang() {
      return this.$store.state.lang;
    },
  },
  mounted() {
    this.getTableData();
    this.ownUserFetch()
    // this.createUserFetch()
    this.getRegionsData()
  },
  methods: {

    // 选择地址
    addressSelect(data){
      this.searchForm.to_country = this.lang === 'zh' ? data?.country?.name : data?.country?.name_en;
      this.searchForm.to_province = this.lang === 'zh' ? data?.province?.name : data?.province?.name_en;
      this.searchForm.to_city =  this.lang === 'zh' ? data?.city?.name : data?.city?.name_en;

      if(this.lang === 'zh' && data?.country?.code!=='CHN'){
        this.searchForm.to_country = data?.country?.name_en;
        this.searchForm.to_province = data?.province?.name_en;
        this.searchForm.to_city = data?.city?.name_en;
      }
      // this.pageChange(1);
    },
    
    // 获取照片
    getSrcImg(name, type = 'png') {
      const path = `../../assets/images/car/${name}.${type}`;
      console.log('modules[path]?.default',path,modules[path]?.default);
      return modules[path]?.default;
    },
    // 获取区域
    getRegionsData() {
      Core.Api.RETAIL.regionsList({
        key: "",
      })
        .then((res) => {
          console.log("getRegionsData res:", res);
          this.regionsList = res.list;
        })
        .catch((err) => {
          console.log("getRegionsData err:", err);
        });
    },
    nameBoolean(v){
      const arr = this.nameColor.filter((el) => {
        return el.id == v.id
      })
      return arr.length?true:false
    },
    /* 接口 */
    // 负责人接口
    ownUserFetch(params = {}){
        Core.Api.CRMTrackMember.joinUserList({
          type: Core.Const.CRM_TRACK_MEMBER.TYPE.OWN,
          target_type: Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.ORDER,
            ...params         
        }).then((res) => {
            if(this.$Util.isEmptyObj(params)){
                this.ownUserOptions = take(res.list, 50);
            }else{
                this.ownUserOptions = res.list;          
            }          
        });
    },
    // 创建人接口
  /*   createUserFetch(params = {}){       
        Core.Api.CRMOrder.createUser({
            ...params         
        }).then((res) => {
            if(this.$Util.isEmptyObj(params)){
                this.createUserOptions = take(res.list, 50);
            }else{
                this.createUserOptions = res.list;          
            }          
        });
    }, */
    moreSearch() {
      this.show = !this.show;
    },
    routerChange(type, item = {}) {
      let routeUrl = "";
      switch (type) {
        case "detail": // 详情
          if(!this.$Util.isEmptyObj(item)){
            this.nameColor.push({ id: item.id})
          }
          routeUrl = this.$router.resolve({
            path: "/crm-order/order-detail",
            query: { id: item.id },
          });
          window.open(routeUrl.href, "_blank");
          break;
        case "edit": // 编辑
          routeUrl = this.$router.resolve({
            path: "/crm-order/order-edit",
            query: { id: item.id },
          });
          window.open(routeUrl.href, "_blank");
          break;
      }
    },
    pageChange(page) {          
      // 页码改变
      this.currPage = page;
      Core.Data.setItem('currPage',page)
      this.getTableData();
    },
    pageSizeChange(current, size) {
      // 页码尺寸改变
      this.pageSize = size;
      Core.Data.setItem('pageSize',size)
      this.getTableData();
    },
    handleSearch() {
      // 搜索
      this.pageChange(Core.Data.getItem('currPage')?Core.Data.getItem('currPage'): 1);
    },
    
 /*    handleOtherSearch(params) {
      // 时间等组件化的搜索
      for (const key in params) {
        this.searchForm[key] = params[key];
      }
      this.pageChange(1);
    }, */

    // 下单时间
    handleOtherSearchOrder(params) {
      // 时间等组件化的搜索
      this.searchForm.order_begin_time = params?.begin_time;
      this.searchForm.order_end_time = params?.end_time;
      // this.pageChange(1); 
    },

    // 付款时间
    handleOtherSearchPayment(params) {
      this.searchForm.payment_begin_time = params?.begin_time;
      this.searchForm.payment_end_time = params?.end_time;
      // this.pageChange(1); 
    },

    // 退款时间
    handleOtherSearchRefunded(params) {
      // 时间等组件化的搜索
      this.searchForm.refunded_begin_time = params?.begin_time;
      this.searchForm.refunded_end_time = params?.end_time;
      // this.pageChange(1); 
    },

    handleSearchReset() {
      // 重置搜索
      Object.assign(this.searchForm, this.$options.data().searchForm);
      this.$refs.TimeSearchOrder.handleReset();
      this.$refs.TimeSearchPayment.handleReset();
      this.$refs.TimeSearchRefunded.handleReset();
      this.orderByFields = {};
      this.areaMap = {};
      this.$refs.addressRef.handleReset();
      console.log('this.areaMap',this.areaMap);
      this.pageChange(1);
    },
    getTableData() {
      // 获取 表格 数据
      // this.loading = true;
      console.log('1021020120',{
        ...this.searchForm,
        order_by_fields: this.orderByFields,
        page: this.currPage,
        page_size: this.pageSize,
      });
      Core.Api.CRMOrder.list({
        ...this.searchForm,
        order_by_fields: this.orderByFields,
        page: this.currPage,
        page_size: this.pageSize,
        status : this.activeKey

      })
        .then((res) => {
          console.log("getTableData res:", res);
          this.total = res.count;
          this.tableData = res.list;
          this.tableData.map((item, index) => {
            switch (item.currency) {
              case "usd":
                item.mType = "$";
                break;
              case "eur":
                item.mType = "€";
                break;
              case "cny":
                item.mType = "￥";
                break;
            }
          });
          console.log(
            "🚀 ~ file: order-list.vue ~ line 229 ~ getTableData ~ this.tableData",
            this.tableData
          );
        })
        .catch((err) => {
          console.log("getTableData err:", err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getTableDataSorter(paginate, sort, filter) {
      this.orderByFields = {};
      switch (filter.order) {
        case "ascend":
          this.orderByFields[filter.field] = 0;
      }
      switch (filter.order) {
        case "descend":
          this.orderByFields[filter.field] = 1;
      }
      this.getTableData();
    },
    handleOwnUserSearch(name) {
      // 负责人条件搜索 下拉框
      this.ownUserFetch({        
        name: name,
      })
    },
    /* handleCreateUserSearch(name) {
      // 创建人条件搜索 下拉框
      this.createUserFetch({
        create_user_name: name,
      })
    }, */
    handleDelete(id) {
      let _this = this;
      this.$confirm({
        title: this.$t("pop_up.sure_delete"),
        okText: this.$t("def.sure"),
        okType: "danger",
        cancelText: this.$t("def.cancel"),
        onOk() {
          Core.Api.Order.delete({ id })
            .then(() => {
              _this.$message.success(_this.$t("pop_up.delete_success")),
                _this.getTableData();
            })
            .catch((err) => {
              console.log("handleDelete err", err);
            });
        },
      });
    },
    handleBatch(type, item) {
      this.detail = item;
      this.batchType = type;
      this.batchShow = true;
      this.handleGroupTree();
    },
    handleBatchClose() {
      this.batchForm.own_user_id = undefined;
      this.detail = {};
      this.batchShow = false;
      this.batchType = "";
    },
    handleBatchSubmit() {
      if (this.selectedRowKeys.length === 0) {
        return this.$message.warning(this.$t("crm_c.select"));
      }
      if (!this.batchForm.own_user_id) {
        return this.$message.warning(this.$t("crm_c.select"));
      }
      switch (this.batchType) {
        case "transfer":
          Core.Api.CRMOrder.batchTransfer({
            id_list: this.selectedRowKeys,
            own_user_id: this.batchForm.own_user_id,
          })
            .then(() => {
              this.$message.success(this.$t("crm_c.transfer_success"));
              this.getTableData();
              this.handleBatchClose();
            })
            .catch((err) => {
              console.log("handleDelete err", err);
            });
          break;
      }
    },
    handleBatchDelete() {
      if (this.selectedRowKeys.length === 0) {
        return this.$message.warning(this.$t("crm_c.select"));
      }
      let _this = this;
      this.$confirm({
        title: this.$t("pop_up.sure_delete"),
        okText: this.$t("def.sure"),
        okType: "danger",
        cancelText: this.$t("def.cancel"),
        onOk() {
          Core.Api.CRMOrder.batchDelete({ id_list: _this.selectedRowKeys })
            .then(() => {
              _this.$message.success(_this.$t("pop_up.delete_success"));
              _this.getTableData();
            })
            .catch((err) => {
              console.log("handleDelete err", err);
            });
        },
      });
    },
    getUserData(query) {
      this.batchForm.own_user_id = undefined;
      this.loading = true;
      Core.Api.User.list({
        group_id: this.group_id,
        name: query,
        org_type: Core.Const.LOGIN.ORG_TYPE.ADMIN,
      })
        .then((res) => {
          console.log("getTableData res:", res);
          this.userData = res.list;
        })
        .catch((err) => {
          console.log("getTableData err:", err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleGroupTree() {
      Core.Api.CRMGroupMember.structureByUserGroup({
        group_id: this.detail.group_id,
      }).then((res) => {
        this.groupOptions = res.list;
        console.log(res);
      });
    },
    // 上传文件
    handleMatterChange({ file, fileList }) {
      console.log("handleMatterChange status:", file.status, "file:", file);
      if (file.status == "done") {
        if (file.response && file.response.code > 0) {
          return this.$message.error(this.$t(file.response.code + ""));
        } else {
          return this.$message.success(this.$t("i.uploaded"));
        }
      }
      this.upload.fileList = fileList;
    },

    // 切换选项
    tabChange() {
      this.handleSearchReset()
    }
  },
};
</script>

<style lang="less" scoped>
#OrderList {
  .tab-box {
    padding-left: 20px;
    margin-bottom: -16px;
  }
}
.search-text {
  margin-left: 30px;
  color: #006ef9;
  cursor: pointer;
}
.nameStyle{
  color: #9000f0;
}

.m-l-10 {
    margin-left: 10px;
}


.btns {
    .fcc(space-between);
    .btn-left {
        .left-btn-style {
            background-color: #94bfff;
            color: #ffffff;
        }
    }
    .btn-right {
        
    }
}


.m-b-20 {
    margin-bottom: 20px;
    margin-top: 20px;
}

.before-icon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}
</style>
