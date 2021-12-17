<template>
  <div class="UserList gray-panel no-margin">
    <div class="panel-title">
      <div class="title">员工列表</div>
    </div>
    <div class="panel-content">
      <div class="table-container">
        <a-button type="primary" ghost @click="routerChange('edit')" style="margin-bottom: 10px;"><i
            class="icon i_add"/>新增员工
        </a-button>
        <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                 :row-key="record => record.id" :pagination='false'>
          <template #bodyCell="{ column, text , record }">
            <template v-if="column.dataIndex === 'type'">
              {{ $Util.userTypeFilter(text) }}
            </template>
            <template v-if="column.dataIndex === 'flag_admin'">
              {{ text ? '是' : '否' }}
            </template>
            <template v-if="column.key === 'item'">
              {{ text || '-' }}
            </template>
            <template v-if="column.key === 'tip_item'">
              <a-tooltip placement="top" :title='text'>
                <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
              </a-tooltip>
            </template>
            <template v-if="column.key === 'time'">
              {{ $Util.timeFilter(text) }}
            </template>
            <template v-if="column.key === 'operation'">
              <a-button type='link' @click="routerChange('edit', record)"><i class="icon i_edit"/> 编辑</a-button>
              <a-button type='link' @click="handleDelete(record.id)"><i class="icon i_delete"/> 删除</a-button>
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
import Core from '../core';

export default {
  name: 'UserList',
  components: {},
  props: {
    orgId: {
      type: Number,
    },
    orgType: {
      type: Number,
    },
    type: {
      type: Number,
    },
    title: {
      type: Number,
    },
  },
  data() {
    return {
      loginType: Core.Data.getLoginType(),
      // 加载
      loading: false,
      // 分页
      currPage: 1,
      pageSize: 20,
      total: 0,

      tableData: [],
    };
  },
  watch: {},
  computed: {
    tableColumns() {
      let columns = [
        {title: '姓名', dataIndex: ['account', 'name'], key: 'item'},
        {title: '账号', dataIndex: ['account', 'username'], key: 'item'},
        {title: '手机号', dataIndex: ['account', 'phone']},
        {title: '邮箱', dataIndex: ['account', 'email']},
        {title: '类型', dataIndex: 'type'},
        {title: '是否为管理员', dataIndex: 'flag_admin'},
        {title: '最近登录', dataIndex: ['account', 'last_login_time'], key: 'time'},
        {title: '创建时间', dataIndex: 'create_time', key: 'time'},
        {title: '操作', key: 'operation', fixed: 'right'},
      ]
      return columns
    },
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    routerChange(type, item = {}) {
      console.log(item)
      let routeUrl = ''
      switch (type) {
        case 'edit':  // 编辑
          routeUrl = this.$router.resolve({
            path: "/user/user-edit",
            query: {id: item.id, type: this.type, org_id: this.orgId, org_type: this.orgType}
          })
          window.open(routeUrl.href, '_self')
          break;
        case 'detail':  // 详情
          routeUrl = this.$router.resolve({
            path: "/user/user-detail",
            query: {id: item.id}
          })
          window.open(routeUrl.href, '_blank')
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
    getTableData() {  // 获取 表格 数据
      this.loading = true;
      Core.Api.User.list({
        org_id: this.orgId,
        org_type: this.orgType,
        type: this.type,
        page: this.currPage,
        page_size: this.pageSize
      }).then(res => {
        console.log("getTableData res", res)
        this.total = res.count;
        this.tableData = res.list;
      }).catch(err => {
        console.log('getTableData err', err)
      }).finally(() => {
        this.loading = false;
      });
    },

    handleDelete(id) {
      let _this = this;
      this.$confirm({
        title: '确定要删除该员工吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          Core.Api.User.delete({id}).then(() => {
            _this.$message.success('删除成功');
            _this.getTableData();
          }).catch(err => {
            console.log("handleDelete -> err", err);
          })
        },
      });
    },
  }
};
</script>

<style lang="less" scoped>
.UserList {
  .table-container {
    margin-top: -10px;
  }
}
</style>