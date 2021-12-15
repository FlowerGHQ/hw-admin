<template>
  <div id="StoreDetail">
    <a-descriptions>
      <a-descriptions-item label="门店名称">{{detail.name}}</a-descriptions-item>
    </a-descriptions>
  </div>
  <div id="AgentDetail">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="UserList" tab="账号管理"><UserList :orgId="store_id"  :type="REPAIR_STATUS.WAIT_DETECTION"/><!--账号列表页面组件--></a-tab-pane>
      <a-tab-pane key="PurchaseList" tab="订单列表"><PurchaseList :agentId="store_id"/><!--采购订单页面组件--></a-tab-pane>
      <a-tab-pane key="Ulist" tab="维修工管理"><UserList :orgId="store_id" :type="REPAIR_STATUS.WAIT_REPAIR"/><!--维修工列表页面组件--></a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import UserList from '@/components/UserList.vue';
import PurchaseList from '@/components/PurchaseOrderList.vue';
import Core from '../../core';
import Const from '../../core/const';
export default {
  name: 'StoreDetail',
  components: { UserList , PurchaseList },
  props: {},
  data() {
    return {
      loginType: Core.Data.getLoginType(),
      // 加载
      loading: false,
      //标签页
      activeKey: 'UserList',
      store_id: '',
      detail: {},
      REPAIR_STATUS: Const.REPAIR.STATUS
    };
  },
  watch: {},
  computed: {},
  created() {
    this.store_id = Number(this.$route.query.id) || 0
    this.getStoreDetail();
  },
  methods: {
    getStoreDetail(){
      this.loading = true;
      Core.Api.Store.detail({
        id: this.store_id,
      }).then(res => {
        console.log('getStoreDetail res', res)
        this.detail = res.detail
      }).catch(err => {
        console.log('getStoreDetail err', err)
      }).finally(() => {
        this.loading = false;
      });
    },
  }
};
</script>

<style lang="less" scoped>
// #AgentDetail {}
</style>