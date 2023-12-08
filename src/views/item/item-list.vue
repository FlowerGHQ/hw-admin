<template>
  <div id="ItemList">
    <div class="content-area_main"> 
      <div class="select-tree" ref="selectTree">
            <CategoryTree
              @change="handleCategoryChange"
              ref="CategoryTree" 
            />
      </div>
      <div class="list-container" ref="bigBox">
          <div id="fixed-box" ref="fixBox">
          <!-- 顶部障眼法-盒子 -->
          <div class="top-box" >
            <div class="top-back" > </div>
          </div>
          <div class="title-container" >
            <div class="title-area">{{ $t("i.item_list") }}</div>
            <div class="btns-area">
              <a-button class="download" type="primary" @click="handleExportConfirm"
                ><i class="icon i_download" />{{ $t("i.export") }}</a-button
              >
              <a-upload
                name="file"
                class="file-uploader"
                :file-list="upload.fileList"
                :action="upload.action"
                :show-upload-list="false"
                :headers="upload.headers"
                :data="upload.data"
                accept=".xlsx,.xls"
                @change="handleMatterChange">
                <a-button type="primary" ghost class="file-upload-btn">
                  <i class="icon i_add" />{{ $t("i.import") }}
                </a-button>
              </a-upload>
              <a-button type="primary" @click="handleSalesAreaByIdsShow()"
                ><i class="icon i_edit" /> {{ $t("ar.set_sales") }}
              </a-button>
              <a-button type="primary" @click="routerChange('add')"
                ><i class="icon i_add" />{{ $t("i.new") }}</a-button>
            </div>
          </div>
          <div class="search-container"  :style="{width: fixedWidth}">
            <a-row class="search-area">
              <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                <div class="key">{{ $t("n.name") }}:</div>
                <div class="value">
                  <a-input
                    :placeholder="$t('def.input')"
                    v-model:value="searchForm.name"
                    @keydown.enter="handleSearch" />
                </div>
              </a-col>
              <!-- 类型 -->
              <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                <div class="key">{{ $t("n.type") }}:</div>
                <div class="value">
                  <a-select
                    v-model:value="searchForm.type"
                    :placeholder="$t('def.select')">
                    <a-select-option
                      v-for="(val, key) in itemTypeMap"
                      :key="key"
                      :value="key"
                      >{{ val[$i18n.locale] }}</a-select-option
                    >
                  </a-select>
                </div>
              </a-col>
              <!-- 来源 -->
              <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                <div class="key">{{ $t("i.source_type") }}:</div>
                <div class="value">
                  <a-select
                    v-model:value="searchForm.source_type"
                    :placeholder="$t('def.select')">
                    <a-select-option
                      v-for="(val, index) in SOURCE_TYPE"
                      :key="index"
                      :value="val.id"
                      >{{ val.value }}</a-select-option
                    >
                  </a-select>
                </div>
              </a-col>
              <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show">
                <div class="key">{{ $t("i.code") }}:</div>
                <div class="value">
                  <a-input
                    :placeholder="$t('def.input')"
                    v-model:value="searchForm.code"
                    @keydown.enter="handleSearch" />
                </div>
              </a-col>
              <!-- <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show">
                <div class="key">{{ $t("i.categories") }}:</div>
                <div class="value">
                  <CategoryTreeSelect
                    @change="handleCategorySelect"
                    :category-id="searchForm.category_id" />
                </div>
              </a-col> -->
              <!-- 商品状态 -->
              <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="show">
                <div class="key">{{ $t("i.status") }}:</div>
                <div class="value">
                  <a-select
                    v-model:value="searchForm.status"
                    :placeholder="$t('def.select')">
                    <a-select-option
                      v-for="(item, index) in itemStatusMap"
                      :key="index"
                      :value="item.value"
                      >{{ item[$i18n.locale] }}</a-select-option
                    >
                  </a-select>
                </div>
              </a-col>
              <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item" v-if="show">
                <div class="key">{{ $t("d.create_time") }}:</div>
                <div class="value">
                  <TimeSearch @search="handleOtherSearch" ref="TimeSearch" />
                </div>
              </a-col>
            </a-row>
            <div class="btn-area">
              <a-button @click="handleSearch" type="primary">{{
                $t("def.search")
              }}</a-button>
              <a-button @click="handleSearchReset">{{ $t("def.reset") }}</a-button>
              
              <a-button type="link" @click="moreSearch">
              {{ show ? $t("def.stow") : $t("def.unfold") }}
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
              
              </a-button>
            </div>
          </div>
          </div>
          <div :style="{height: fixedHeight}"></div>
          <div class="table-container" ref="tabBox" >

            <a-table
              :columns="tableColumns"
              :data-source="tableData"
              :loading="loading"
              :scroll="{ x: true }"
              :pagination="false"
              :row-key="(record) => record.id"
              @change="handleTableChange"
              @expand="handleTableExpand"
              :expandedRowKeys="expandedRowKeys"
              :indentSize="0"
              :row-selection="rowSelection"
              >
              <template #bodyCell="{ column, text, record }">
                <!-- 名称 -->
                <template v-if="column.key === 'detail'">
                  <div class="table-img afs">
                    <a-image
                      class="image"
                      :width="55"
                      :height="55"
                      :src="$Util.imageFilter(record.logo)"
                      :fallback="$t('def.none')" />
                    <div class="info">
                      <a-tooltip>
                        <template #title>{{
                          $i18n.locale === "zh"
                            ? record.name
                            : record.name_en || "-"
                        }}</template>
                        <a-button
                          type="link"
                          @click="routerChange('detail', record)">
                          <div class="ell" style="max-width: 150px">
                            {{
                              $i18n.locale === "zh"
                                ? record.name
                                : record.name_en || "-"
                            }}
                          </div>
                        </a-button>
                        <div
                          v-if="record.attr_list && record.attr_list.length"
                          class="sub-info">
                          {{ $Util.itemSpecFilter(record.attr_list) }}
                        </div>
                      </a-tooltip>
                      <!-- 来源 -->
                      <div
                        v-if="SOURCE_TYPE[record.source_type]?.value == 'ERP'"
                        class="source-erp"
                        :title="
                          $t('i.synchronization_time') +
                          ' ' +
                          ($Util.timeFilter(record.sync_time) || '-')
                        ">
                        <span>
                          {{ SOURCE_TYPE[record.source_type].value }}
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-if="column.key === 'type'">
                  {{ $Util.itemTypeFilter(text, $i18n.locale) }}
                </template>
                <template v-if="column.key === 'item'">
                  {{ text || "-" }}
                </template>
                <template v-if="column.key === 'category_list'">
                  <span v-for="(category, index) in text">
                    <span v-if="index !== 0">,</span>
                    {{
                      $i18n.locale === "zh"
                        ? category.category_name
                        : category.category_name_en
                    }}
                  </span>
                </template>
                <template v-if="column.key === 'money'">
                  ￥{{ $Util.countFilter(text) }}
                </template>
                <template v-if="column.key === 'flag_entity'">
                  {{ $Util.itemFlagEntityFilter(text, $i18n.locale) }}
                </template>
                <template v-if="column.key === 'fob_money'">
                  <span v-if="text >= 0">{{ column.unit }}</span>
                  {{ $Util.countFilter(text) }}
                </template>
                <!-- <template v-if="column.key === 'man_hour'">
                  {{ $Util.countFilter(text) }}
                </template> -->
                <template v-if="column.dataIndex === 'status'">
                  <div
                    class="status status-bg status-tag"
                    :class="text === 0 ? 'green' : 'red'">
                    {{ text === 0 ? $t("i.active") : $t("i.inactive") }}
                  </div>
                </template>

                <template v-if="column.key === 'tip_item'">
                  <a-tooltip placement="top" :title="text">
                    <div class="ell" style="max-width: 160px">
                      {{ text || "-" }}
                    </div>
                  </a-tooltip>
                </template>
                <template v-if="column.key === 'time'">
                  {{ $Util.timeFilter(text) }}
                </template>
                <template v-if="column.key === 'operation'">
                  <template v-if="!record.default_item_id">
                    <a-button type="link" @click="routerChange('edit', record)"
                      ><i class="icon i_edit" />{{ $t("def.edit") }}</a-button
                    >
                    <a-button type="link" @click="routerChange('detail', record)"
                      ><i class="icon i_detail" /> {{ $t("def.detail") }}</a-button
                    >
                  </template>
                  <a-button
                    type="link"
                    @click="handleStatusChange(record)"
                    :class="record.status === 0 ? 'danger' : ''">
                    <template v-if="record.status === -1"
                      ><i class="icon i_putaway" />{{ $t("i.active_a") }}</template
                    >
                    <template v-if="record.status === 0"
                      ><i class="icon i_downaway" />
                      {{ $t("i.inactive_a") }}</template
                    >
                  </a-button>
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
              :pageSizeOptions="['20', '100', '500', '1000']"
              @change="pageChange"
              @showSizeChange="pageSizeChange" />
          </div>
      </div>
    </div>


    <a-modal
      v-model:visible="salesAreaVisible"
      :title="$t('ar.set_sale')"
      class="field-select-modal"
      :width="630"
      :after-close="handleSalesAreaByIdsClose">
      <div class="modal-content">
        <div class="form-item required">
          <div class="key">{{ $t("d.sales_area") }}</div>
          <div class="value">
            <a-select
              v-model:value="salesAreaIds"
              mode="multiple"
              :placeholder="$t('def.select')">
              <a-select-option
                v-for="(val, key) in salesList"
                :key="key"
                :value="val.id"
                >{{ val.name }}</a-select-option
              >
            </a-select>
          </div>
        </div>
      </div>
      <template #footer>
        <a-button type="primary" @click="handleSalesAreaByIdsConfirm">{{
          $t("def.sure")
        }}</a-button>
        <a-button @click="handleSalesAreaByIdsClose">{{
          $t("def.cancel")
        }}</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import Core from "../../core";

import TimeSearch from "@/components/common/TimeSearch.vue";
import CategoryTreeSelect from "@/components/popup-btn/CategoryTreeSelect.vue";
import CategoryTree from './components/TreeSelect.vue'
const ITEM = Core.Const.ITEM;
import loadsh from "lodash";
export default {
  name: "ItemList",
  components: {
    TimeSearch,
    CategoryTree,
    CategoryTreeSelect,
  },
  props: {},
  data() {
    return {
      // 加载
      loading: false,
      // 分页
      currPage: 1,
      pageSize: 20,
      total: 0,
      // 搜索
      filteredInfo: null,
      searchForm: {
        name: "",
        code: "",
        category_id: undefined,
        begin_time: "",
        end_time: "",
        type: undefined,
        status: '0',
        source_type: undefined,
      },
      itemTypeMap: ITEM.TYPE_MAP,
      itemStatusMap: ITEM.STATUS_LIST,
      SOURCE_TYPE: ITEM.SOURCE_TYPE, // 来源类型
      // 表格
      tableData: [],
      expandedRowKeys: [],
      selectedRowKeys: [],
      salesAreaVisible: false,
      salesList: [],
      salesAreaIds: [],
      // 上传
      upload: {
        action: Core.Const.NET.URL_POINT + "/admin/1/item/import",
        fileList: [],
        headers: {
          ContentType: false,
        },
        data: {
          token: Core.Data.getToken(),
          type: "xlsx",
        },
      },
      flag_spread: 0, // 0, 2是默认  传其他的是全部
      // isShowAdd: false,//查询时(名称和编码都有)

      fixedHeight: 'auto',
      fixedWidth: 'auto',

      // 搜索列表 展开收起控制
      show: false,
 
    };
  },
  watch: {},
  computed: {
    tableColumns() {
      let { filteredInfo } = this;
      filteredInfo = filteredInfo || {};
      let tableColumns = [
        { title: this.$t("n.name"), dataIndex: "name", key: "detail" },
        { title: this.$t("i.code"), dataIndex: "code", key: "item" },
        {
          title: this.$t("i.status"),
          dataIndex: "status",
          // filters: this.$Util.tableFilterFormat(
          //   ITEM.STATUS_LIST,
          //   this.$i18n.locale
          // ),
          // filterMultiple: false,
          // filteredValue: filteredInfo.status || [0],
        },
        { title: this.$t("n.type"), dataIndex: ["type"], key: "type" },
        {
          title: this.$t("n.flag_entity"),
          dataIndex: "flag_entity",
          key: "flag_entity",
        },
        {
          title: this.$t("i.categories"),
          dataIndex: "category_list",
          key: "category_list",
        },
        { title: this.$t("i.number"), dataIndex: "model", key: "item" },
        {
          title: "FOB(EUR)",
          dataIndex: "fob_eur",
          key: "fob_money",
          unit: "€",
        },
        {
          title: "FOB(USD)",
          dataIndex: "fob_usd",
          key: "fob_money",
          unit: "$",
        },
        // { title: this.$t("i.hours"), dataIndex: "man_hour", key: "man_hour" },
        {
          title: this.$t("d.create_time"),
          dataIndex: "create_time",
          key: "time",
        }, // 工时
        {
          title: this.$t("def.operate"),
          key: "operation",
          fixed: "right",
          width: 180,
        },
      ];
      return tableColumns;
    },
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          // 表格 选择 改变
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRowItems = selectedRows;
          console.log(
            "rowSelection onChange this.selectedRowKeys",
            this.selectedRowKeys
          );
        },
      };
    },
  },
  async mounted() {
    let width = this.$refs.bigBox && this.$refs.bigBox.offsetWidth;
    let height = this.$refs.fixBox && this.$refs.fixBox.offsetHeight;
    this.fixedWidth = width  - 40 + 'px';
    this.fixedHeight = height + 'px';
    await this.getTableData({ flag_spread: 1 });
    await this.getSalesAreaList();
    window.addEventListener('resize', this.handleResize)
        // 让左侧选择tree始终在可视区范围内
    let scrollArea = document.querySelector('.layout-main>main')
    scrollArea.addEventListener('scroll', this.selectTreeAutoTop)

    this.$nextTick(()=>{
      this.handleResize()
    })

  },
  beforeDestroy() {
      window.removeEventListener('resize', this.handleResize)
      let scrollArea = document.querySelector('.layout-main>main')
      scrollArea.removeEventListener('scroll', this.selectTreeAutoTop)
  },
  methods: {
    selectTreeAutoTop(){
      let scrollArea = document.querySelector('.layout-main>main')
      let scrollTop = scrollArea.scrollTop
      console.log(this.$refs.selectTree)
      // selectTree的marginTop 为scrollArea的scrollTop
      if(this.$refs.selectTree){
        loadsh.debounce(()=>{
          this.$refs.selectTree.style.marginTop = scrollTop + 'px'
        }, 100)()
      }
    },
    handleCategoryChange(val) {
      console.log("handleCategoryChange val:", val);
      this.searchForm.category_id = val;
      this.pageChange(1);
    },
    moreSearch() {
      this.show = !this.show;
      this.$nextTick(()=>{
        this.handleResize()
      })
    },
    handleResize() {
        const width = this.$refs.tabBox && this.$refs.tabBox.offsetWidth;
        const height = this.$refs.fixBox && this.$refs.fixBox.offsetHeight;
        this.fixedWidth = width + 'px';
        this.fixedHeight = height + 'px'; 
        // 在这里处理宽高变化的逻辑
    },
    routerChange(type, item = {}) {
      console.log("routerChange item:", item);
      let routeUrl = "";
      switch (type) {
        case "detail": // 商品详情
          routeUrl = this.$router.resolve({
            path: "/item/item-detail",
            query: {
              id: item.default_item_id || item.id,
              set_id: item.set_id,
            },
          });
          window.open(routeUrl.href, "_blank");
          break;
        case "edit": // 商品编辑
          routeUrl = this.$router.resolve({
            path: "/item/item-edit",
            query: {
              id: item.default_item_id || item.id,
              set_id: item.set_id,
              edit: true,
            },
          });
          window.open(routeUrl.href, "_self");
          break;
        case "add": // 商品新增
          routeUrl = this.$router.resolve({
            path: "/item/item-edit",
          });
          window.open(routeUrl.href, "_self");
          break;
      }
    },
    pageChange(curr) {
      // 页码改变
      this.currPage = curr;
      this.getTableData();
    },
    pageSizeChange(current, size) {
      // 页码尺寸改变
      console.log("pageSizeChange size:", size);
      this.pageSize = size;
      this.getTableData();
    },
    // 查询
    handleSearch() {
      if (this.searchForm.name !== "" || this.searchForm.code !== "") {
        this.flag_spread = 1;
      }
      // 如果名称和编码都有值的话  +号去掉
      /* if (this.searchForm.name && this.searchForm.code) {
        this.isShowAdd = true;
      } */
      this.pageChange(1);
    },
    handleOtherSearch(params) {
      // 时间等组件化的搜索
      for (const key in params) {
        this.searchForm[key] = params[key];
      }
      this.pageChange(1);
    },
    handleCategorySelect(val) {
      this.searchForm.category_id = val;
      this.pageChange(1);
    },
    handleTableChange(page, filters, sorter) {
      // 表格筛选
      console.log("handleTableChange filters:", filters);
      this.filteredInfo = filters;
      for (const key in filters) {
        this.searchForm[key] = filters[key] ? filters[key][0] : "";
      }
      this.pageChange(1);
    },
    handleSearchReset() {
      // this.isShowAdd = false;
      // 重置搜索
      Object.assign(this.searchForm, this.$options.data().searchForm);
      this.$refs.TimeSearch && this.$refs.TimeSearch?.handleReset();
      this.pageChange(1);
    },
    async getTableData(params = {}) {
      // 获取 表格 数据
      this.loading = true;
      await Core.Api.Item.list({
        ...Core.Util.searchFilter(this.searchForm),
        flag_spread: this.flag_spread,
        page: this.currPage,
        page_size: this.pageSize,
        ...params,
      })
        .then((res) => {
          this.total = res.count;
          // this.tableData = res.list; 

          // 如果同时查询名称和编码  加号去掉
          // if(this.isShowAdd) {
            const targetTableData = this.removeChildrenFromData(res.list)
            this.tableData = targetTableData; 
          // } else {
            // this.tableData = res.list; 
          // }

          
        })
        .catch((err) => {
          console.log("getTableData err:", err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    removeChildrenFromData(data) {
      return data.map(item => {
        const newItem = { ...item };
        delete newItem.children;
        return newItem;
      });
    },
    handleDelete(id) {
      let _this = this;
      this.$confirm({
        title: _this.$t("pop_up.sure_delete"),
        okText: _this.$t("def.sure"),
        okType: "danger",
        cancelText: this.$t("def.cancel"),
        onOk() {
          Core.Api.Item.delete({ id })
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

    handleStatusChange(record) {
      let _this = this;
      let name =
        record.status === -1
          ? _this.$t("i.active_a")
          : _this.$t("i.inactive_a");
      this.$confirm({
        title: _this.$t("pop_up.sure") + `${name}` + _this.$t("i.the_goods"),
        okText: _this.$t("def.sure"),
        okType: record.status === -1 ? "" : "danger",
        cancelText: _this.$t("def.cancel"),
        onOk() {
          Core.Api.Item.updateStatus({ id: record.id })
            .then(() => {
              _this.$message.success(name + _this.$t("pop_up.success"));
              _this.getTableData();
            })
            .catch((err) => {
              console.log("handleStatusChange err", err);
            });
        },
      });
    },

    // 表格行展开-查看同规格商品
    handleTableExpand(expanded, record) {
      if (expanded) {
        if (record.device_ports) {
          this.expandedRowKeys.push(record.id);
        } else {
          Core.Api.Item.listBySet({ set_id: record.set_id })
            .then((res) => {
              console.log("handleTableExpand res:", res);
              let list = res.list.filter((i) => i.flag_default !== 1);
              record.children = list;
            })
            .finally(() => {
              this.expandedRowKeys.push(record.id);
            });
        }
      } else {
        let index = this.expandedRowKeys.indexOf(record.id);
        this.expandedRowKeys.splice(index, 1);
      }
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
    getSalesAreaList() {
      Core.Api.SalesArea.list({ page: 0 }).then((res) => {
        this.salesList = res.list;
      });
    },
    handleSalesAreaByIdsConfirm() {
      if (this.salesAreaIds.length <= 0) {
        return this.$message.error(
          this.$t("n.choose") + this.$t("d.sales_area")
        );
      }
      Core.Api.SalesAreaItem.batchSave({
        item_id_list: this.selectedRowKeys,
        sales_area_id_list: this.salesAreaIds,
      }).then((res) => {
        this.getTableData();
        this.handleSalesAreaByIdsClose();
      });
    },
    handleSalesAreaByIdsShow() {
      if (this.selectedRowKeys.length <= 0) {
        return this.$message.error(this.$t("n.choose") + this.$t("i.item"));
      }
      this.getSalesAreaList();
      this.salesAreaVisible = true;
    },
    handleSalesAreaByIdsClose() {
      this.salesAreaVisible = false;
      this.salesList = [];
      this.salesAreaIds = [];
    },

    handleExportConfirm() {
      // 确认订单是否导出
      let _this = this;
      this.$confirm({
        title: _this.$t("pop_up.sure") + _this.$t("n.export") + "?",
        okText: _this.$t("def.sure"),
        cancelText: _this.$t("def.cancel"),
        onOk() {
          _this.handleRepairExport();
        },
      });
    },
    handleRepairExport() {
      // 订单导出
      this.exportDisabled = true;
      let form = Core.Util.deepCopy(this.searchForm);

      for (const key in form) {
        form[key] = form[key] || "";
      }
      // console.log('form',form)
      let exportUrl = Core.Api.Export.exportItemPrice({
        ...form,
        language: this.$i18n.locale === "en" ? 1 : 0,
      });
      console.log("handleRepairExport exportUrl", exportUrl);
      window.open(exportUrl, "_self");
      this.exportDisabled = false;
    },

    // // 显示导出对话框
    // showModal() {
    //     this.visible = true;
    // },
    // // 导出确定
    // handleOk(e) {
    //     // console.log(e);
    //     this.visible = false;
    // },
  },
};
</script>

<style lang="less" scoped>
#ItemList {
  .content-area_main{
    display: flex;
    .select-tree{
      min-width: 10%;
      margin-right: 5px;
      border: 1px solid #e8e8e8;
      background-color: #fff;
      padding: 10px;
      height: calc(100vh - 100px);
      overflow-y: scroll;
      // 滚动条的样式
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        &-thumb {
                border-radius: 3px;
                background-color: @scrollbar-thumb;
                transition: background-color 0.3s;

                &:hover {
                    background: @scrollbar-thumb-hover;
                }
            }

            &-track {
                /*滚动条内部轨道*/
                background: @scrollbar-track;
            }
      }
    }
    .list-container {
      flex: 1;
      #fixed-box {
        position: fixed;
        z-index: 30;
        box-sizing: border-box;
        margin-left: 20px;
        background-color: #ffffff;
        
        .top-box {
          width: calc(100% + 40px) !important;
          height:100px;
          background-color: #F0F2F5; 
          width:-moz-calc(100% + 40px); 
          width:-webkit-calc(100% + 40px); 
          width: calc(100% + 40px);
          position: absolute;
          top: -16px;
          box-sizing: content-box;
          left: -20px;
          z-index: -15;
          padding-top: 16px;
          .top-back {
            background-color: #FFFFFF;
            padding: 0 20px;width: 100%;
            height: 100%;
            border-radius: 6px 6px 0 0;
          }
        }

      }
    .title-container {
      padding-left: 0px;
      .btns-area {
        .file-upload-btn {
          margin-right: 15px;
        }
      }
    }

    .search-container {
      margin: 0px;
      padding-left: 20px;

    }

  }
  }
  .download {
    font-size: 14px;
    text-align: center;
    margin-right: 10px;
  }

  .table-container {
    z-index: 20;
    position: relative;
    height: auto;
    .ant-table-wrapper{
      flex: 1;
    }
    .info {
      display: inline-flex;
      flex-direction: column;

      .sub-info {
        width: 20em;
        overflow: hidden; /*超出长度的文字隐藏*/
        text-overflow: ellipsis; /*文字隐藏以后添加省略号*/
        white-space: nowrap; /*强制不换行*/
      }
      .source-erp {
        width: 36px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        background-color: #ffebea;
        color: #f92e25;
        border-radius: 30px;
        font-size: 12px;
        cursor: pointer;
        margin-top: 5px;
      }
    }
  }
}
</style>
