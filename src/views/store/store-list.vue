<template>
  <div id="StoreList">
    <div class="list-container">
      <div class="title-container">
        <div class="title-area">门店列表</div>
        <div class="btns-area">
          <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新建门店</a-button>
        </div>
      </div>
      <div class="search-container">
        <a-row class="search-area">
          <a-col :xs='24' :sm='24' :xl="6" :xxl='6' class="search-item">
            <div class="key">门店名称：</div>
            <div class="value">
              <a-input placeholder="请输入门店名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
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
const provinceData = ['China'];
import Core from '../../core';

export default {
  name: 'StoreList',
  components: {},
  props: {},
  data() {
    return {
      loginType: Core.Data.getLoginType(),
      // 加载
      loading: false,
      // 分页
      currPage: 1,
      pageSize: 20,
      total: 0,
      // 搜索
      defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
      create_time: [],
      searchForm: {
        name: '',
        phone:'',
      },
      tableData: [],

    };
  },
  watch: {},
  computed: {
    tableColumns() {
      let columns = [
        {title: '名称', dataIndex: 'name', key:'detail'},
        {title: 'logo', dataIndex: 'logo'},
        {title: '创建时间', dataIndex: 'create_time', key: 'time'},
        // { title: '操作', dataIndex: 'handle', fixed: 'right' },
        {title: '操作', key: 'operation', fixed: 'right', width: 100,},

      ]
      return columns
    },
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    handleDelete(id) {
      Core.Api.Store.delete({
        id
      }).then(res => {
        console.log("delete -> res", res)
        this.pageChange(1);
      }).catch(err => {
        console.log('delete -> err', err)
      }).finally(() => {
        this.loading = false;
      });
    },
    routerChange(type, item = {}) {
      console.log('item', item)
      let routeUrl = ''
      switch (type) {
        case 'edit':  // 编辑
          routeUrl = this.$router.resolve({
            path: "/store/store-edit",
            query: {id: item.id}
          })
          window.open(routeUrl.href, '_self')
          break;
      }
    },
    pageChange(curr) {  // 页码改变
      this.currPage = curr
      this.getTableData()
    },
    pageSizeChange(current, size) {  // 页码尺寸改变
      console.log('pageSizeChange size:', size)
      this.pageSize = size
      this.getTableData()
    },
    handleSearch() {  // 搜索
      this.pageChange(1);
    },
    handleSearchReset() {  // 重置搜索
      Object.assign(this.searchForm, this.$options.data().searchForm)
      console.log('this.searchForm:', this.searchForm)
      this.create_time = []
      this.pageChange(1);
    },
    handleTableChange(page, filters, sorter) {
      console.log('handleTableChange filters:', filters)
      for (const key in filters) {
        this.searchForm[key] = filters[key] ? filters[key][0] : 0
      }
    },
    getTableData() {  // 获取 表格 数据
      this.loading = true;
      this.loading = false;
      // return
      Core.Api.Store.list({
        ...this.searchForm,
        begin_time: this.create_time[0] || '',
        end_time: this.create_time[1] || '',
        page: this.currPage,
        page_size: this.pageSize
      }).then(res => {
        console.log("getTableData -> res", res)
        this.total = res.count;
        this.tableData = res.list;
      }).catch(err => {
        console.log('getTableData -> err', err)
      }).finally(() => {
        this.loading = false;
      });
    },
  }
};
</script>

<style lang="less" scoped>
// #WarehouseList {}
</style>