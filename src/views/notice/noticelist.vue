<template>
  <div id="SysmessageList">
    <div class="list-container">
      <div class="title-container">
        <div class="title-area">系统列表</div>
        <div class="btns-area">
          <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新建仓库</a-button>
        </div>
      </div>
      <div class="search-container">
        <a-row class="search-area">
          <a-col :xs='24' :sm='24' :xl="8" :xxl='8' class="search-item">
            <div class="key">仓库名称:</div>
            <div class="value">
              <a-input placeholder="请输入仓库名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
            </div>
          </a-col>
          <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
            <div class="key">创建时间:</div>
            <div class="value">
              <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch"
                              :show-time="defaultTime">
                <template #suffixIcon><i class="icon i_calendar"></i></template>
              </a-range-picker>
            </div>
          </a-col>
        </a-row>
        <div class="btn-area">
          <a-button @click="handleSearch" type="primary">查询</a-button>
          <a-button @click="handleSearchReset">重置</a-button>
        </div>

      </div>
      <div class="table-container">
        <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                 :row-key="record => record.id" :pagination='false'>
          <template #bodyCell="{ column, text , record, index}">
            <template v-if="column.key === 'detail'">
              {{ text }}
            </template>

            <!--            <template v-if="column.key === 'type'">-->
            <!--              {{ this.gettype(text) }}-->
            <!--            </template>-->

            <template v-if="column.key === 'time'">
              {{ $Util.timeFilter(text) }}
            </template>
            <template v-if="column.key === 'operation'">
              <a-button type="link" @click="routerChange('edit',record)">修改</a-button>
              <a-button type="link" @click="handleDelete(record.id)">删除</a-button>
            </template>
          </template>
        </a-table>
      </div>
      <div class="paging-container">
        <a-pagination
            v-model:current="currPage"
            :page-size='pageSize'
            :total="total"
            show-quick-jumper
            show-size-changer
            show-less-items
            :show-total="total => `共${total}条`"
            :hide-on-single-page='false'
            :pageSizeOptions="['10', '20', '30', '40']"
            @change="pageChange"
            @showSizeChange="pageSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "Sysmessage-list"
}
</script>

<style scoped>

</style>