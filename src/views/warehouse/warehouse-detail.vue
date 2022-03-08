<template>
    <div id="WarehouseDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">仓库详情</div>
            <div class="btns-area">
            <a-button type="primary" ghost @click="routerChange('edit', record)"
                ><i class="icon i_edit" />编辑</a-button
            >
            <a-button type="primary" ghost @click="handleDelete(warehouse_id)"
              ><i class="icon i_delete" />删除</a-button
            >
        </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
            <div class="desc-title">
                <div class="title-area">
                    <span class="title">{{ detail.name }}</span>
                </div>
            </div>
            <a-row class="desc-detail has-logo">
                <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                    <span class="key">创建时间：</span>
                    <span class="value">{{
                        $Util.timeFilter(detail.create_time)
                }}</span>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                    <span class="key">仓库地址：</span>
                    <span class="value">{{ $Util.addressFilter(detail) }}</span>
                </a-col>
            </a-row>
        </div>
        </div>
        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
              <a-tab-pane key="StockList" tab="库存数量">
                <StockList
                  :warehouseId="warehouse_id"
                  :detail="detail"
                  @submit="getWarehouseDetail"
                />
              </a-tab-pane>
              <a-tab-pane key="StockRecord" tab="出入库记录">
                <StockRecord
                  :warehouseId="warehouse_id"
                  :detail="detail"
                  @submit="getWarehouseDetail"
                  v-if="activeKey === 'StockRecord'"
                />
              </a-tab-pane>
              <a-tab-pane key="StockModify" tab="库存变更明细">
                <stockModify
                  :warehouseId="warehouse_id"
                  :detail="detail"
                  @submit="getWarehouseDetail"
                />
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
</template>

<script>
import Core from "../../core";

import StockList from "./components/StockList.vue";
import StockRecord from "./components/StockRecord.vue";
import StockModify from "./components/StockModify.vue";

export default {
    name: "WarehouseDetail",
    components: { StockList, StockRecord, StockModify },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            //标签页
            detail: {},
            warehouse_id: "",
            activeKey: ["affirm"],
          };
        },
    watch: {},
    computed: {},
    created() {
        this.warehouse_id = Number(this.$route.query.id) || "";
        this.getWarehouseDetail();
    },
    methods: {
        routerChange(type) {
        let routeUrl = "";
        switch (type) {
            case "edit": // 编辑
                routeUrl = this.$router.resolve({
                path: "/warehouse/warehouse-edit",
                query: { id: this.warehouse_id },
            });
                window.open(routeUrl.href, "_self");
                break;
            case "list": // 列表
                routeUrl = this.$router.resolve({
                path: "/warehouse/warehouse-list",
                query: { id: this.warehouse_id },
            });
                window.open(routeUrl.href, "_self");
                break;
        }
      },
      getWarehouseDetail() {
          this.loading = true;
          Core.Api.Warehouse.detail({
          id: this.warehouse_id,
        })
          .then((res) => {
              console.log("getWarehouseDetail res", res);
              this.detail = res.detail;
          })
          .catch((err) => {
              console.log("getWarehouseDetail err", err);
          })
          .finally(() => {
              this.loading = false;
          });
      },
      handleDelete(id) {
          let _this = this;
          this.$confirm({
              title: "确定要删除该仓库吗？",
              okText: "确定",
              okType: "danger",
              cancelText: "取消",
              onOk() {
                  Core.Api.Warehouse.delete({ id })
                  .then(() => {
                      _this.$message.success("删除成功");
                      _this.routerChange("list");
                  })
                  .catch((err) => {
                  console.log("handleDelete err", err);
                  });
              },
          });
      },
    },
  };
</script>

<style lang="less" scoped>
// #WarehouseDetail {}
</style>