<template>
  <div id="WarehouseEdit" class="edit-container">
    <div class="title-container">
      <div class="title-area">{{ form.id ? '编辑仓库' : '新建仓库' }}</div>
    </div>
    <div class="form-block">
      <div class="form-title">
        <div class="title-colorful">基本信息</div>
      </div>
      <div class="form-content">
        <div class="form-item required">
          <div class="key">仓库名称：</div>
          <div class="value">
            <a-input v-model:value="form.name" placeholder="请输入仓库名称"/>
          </div>
        </div>
        <div class="form-item required">
          <div class="key">仓库地址：</div>
          <div class="value">
            <a-cascader v-model:value="form.address" :options="form.addressOptions" placeholder="请选择省/市/区县"
                        :field-names="{ label: 'name', value: 'code' , children: 'children'}"
                        :show-search="{ filter }"/>
          </div>
        </div>
        <div class="form-item ">
          <div class="key"></div>
          <div class="value">
            <a-input v-model:value="form.detail_address" placeholder="请输入详细地址"/>
          </div>
        </div>
      </div>
    </div>
    <div class="form-btns">
      <a-button @click="handleSubmit" type="primary">确定</a-button>
      <a-button @click="routerChange('back')" type="primary" ghost="">取消</a-button>
    </div>
  </div>
</template>

<script>
import Core from '../../core';

export default {
  name: 'WarehouseEdit',
  components: {},
  props: {},
  data() {
    return {
      loginType: Core.Data.getLoginType(),
      // 加载
      loading: false,
      detail: {},
      customer_address: [],
      form: {
        id: '',
        name: '',
        province: '',
        city: '',
        address: [],
        addressOptions: [],
        detail_address: [],

      },
    };
  },
  watch: {},
  computed: {},

  mounted() {
    this.form.id = Number(this.$route.query.id) || 0
    if (this.form.id) {
      this.getWarehouseDetail();
    }
  },
  methods: {
    routerChange(type, item) {
      switch (type) {
        case 'back':
          this.$router.go(-1)
          break;
      }
    },
    getWarehouseDetail() {
      this.loading = true;
      Core.Api.Warehouse.detail({
        id: this.form.id,
      }).then(res => {
        console.log('getWarehouseDetail res', res)
        this.detail = res.detail
        for (const key in this.form) {
          this.form[key] = res.detail[key]
        }
      }).catch(err => {
        console.log('getWarehouseDetail err', err)
      }).finally(() => {
        this.loading = false;
      });
    },
    handleSubmit() {
      let form = Core.Util.deepCopy(this.form)
      // if (!form.id) {
      //   if (!form.name) {
      //     return this.$message.warning('请输入仓库名称')
      //   }
      //   if (!form.province) {
      //     return this.$message.warning('请选择省/市/区（县）')
      //   }
      //
      //   if (!form.address) {
      //     return this.$message.warning('请输入详细地址')
      //   }
      // }
      Core.Api.Warehouse.save(form).then(() => {
        this.$message.success('保存成功')
        this.routerChange('back')
      }).catch(err => {
        console.log('handleSubmit err:', err)
      })
    }
  }
};
</script>

<style lang="less" scoped>
// #Warehouse Edit {}
</style>