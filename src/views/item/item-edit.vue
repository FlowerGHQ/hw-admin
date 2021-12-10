<template>
  <div id="ItemEdit" class="edit-container">
    <div class="title-container">
      <div class="title-area">{{ form.id ? '编辑商品' : '新增商品' }}</div>
    </div>

    <div class="form-block">
      <div class="form-title">
        <div class="title">基本信息</div>
      </div>
      <div class="form-content">
        <div class="form-item required">
          <div class="key">商品名称</div>
          <div class="value">
            <a-input v-model:value="form.name" placeholder="最多输入100字符"/>
          </div>
        </div>
        <div class="form-item required">
          <div class="key">商品编码</div>
          <div class="value">
            <a-input v-model:value="form.code" placeholder="请输入商品编码"/>
          </div>
        </div>

        <div class="form-item required">
          <div class="key">商品分类</div>
          <div class="value">
            <a-input v-model:value="form.type" placeholder="最多输入100字符"/>
          </div>
        </div>
        <!--        <div class="form-item required">
                  <div class="key">品牌</div>
                  <a-select v-model:value="form.country" placeholder="请选择品牌">
                    <a-select-option v-for="item of countryList" :key="item.value" :value="item.value">{{ item.text }}
                    </a-select-option>
                  </a-select>
                </div>
                <div class="form-item">
                  <div class="key">生产商</div>
                  <a-select v-model:value="form.country" placeholder="请选择生产厂商">
                    <a-select-option v-for="item of countryList" :key="item.value" :value="item.value">{{ item.text }}
                    </a-select-option>
                  </a-select>
                </div>-->
      </div>
    </div>
    <div class="form-block">
      <div class="form-title">
        <div class="title">价格信息</div>
      </div>
      <div class="form-content">
        <div class="form-item required">
          <div class="key">标准售价</div>
          <div class="value input-number">
            <a-input-number v-model:value="form.price" :min="0" :precision="2"   placeholder="0.00"/>
            <span>元</span>
          </div>
        </div>
        <div class="form-item required">
          <div class="key">批发价格</div>
          <div class="value input-number">
            <a-input-number v-model:value="form.original_price" :min="0" :precision="2"  placeholder="0.00"/>
            <span>元</span>
          </div>
        </div>

      </div>
    </div>



    <div class="form-btns">
      <a-button type="primary" @click="handleSubmit">确定</a-button>
      <a-button @click="routerChange('back')">取消</a-button>
    </div>
  </div>
</template>

<script>
import Core from '../../core';

export default {
  name: 'ItemEdit',
  components: {},
  props: {},
  data() {
    return {
      loginType: Core.Data.getLoginType(),
      // 加载
      loading: false,
      detail: {},
      form: {
        id: '',
        name: '',
        code: '',
        type: '',
        price: undefined,
        original_price: undefined,
      }
    };
  },
  watch: {},
  computed: {},

  mounted() {
    this.form.id = Number(this.$route.query.id) || 0
    if (this.form.id) {
      this.getDistributorDetail();
    }
  },
  methods: {
    routerChange(type, item) {
      let routeUrl
      switch (type) {
        case 'back':
          this.$router.go(-1)
          break;
        case 'detail':  // 详情
          routeUrl = this.$router.resolve({
            path: "/item/item-detail",
            query: { id: item.id }
          })
          window.open(routeUrl.href, '_self')
          break;
      }
    },


    go(type) {
      let url = ''
      switch (type) {
        case "detail" :
          url = '****/*/item-detail';
          break;
        case "list":
          url = '****/*/item-list';
          break;

      }
      window.open(url, "_self")
    },
    /*getDistributorDetail() {
      this.loading = true;
      Core.Api.Distributor.detail({
        id: this.form.id,
      }).then(res => {
        console.log('getDistributorDetail res', res)
        this.detail = res.detail
        for (const key in this.form) {
          this.form[key] = res.detail[key]
        }
      }).catch(err => {
        console.log('getDistributorDetail err', err)
      }).finally(() => {
        this.loading = false;
      });
    },*/
    handleSubmit() {
      let form = Core.Util.deepCopy(this.form)
      if (!form.name) {
        return this.$message.warning('请输入商品名称')
      }
      if (!form.code) {
        return this.$message.warning('请输入商品编码')
      }
      if (!form.type) {
        return this.$message.warning('请输入商品分类')
      }
      if (!form.price) {
        return this.$message.warning('请输入商品标准售价')
      }
      if (!form.original_price) {
        return this.$message.warning('请输入商品批发价格')
      }


      Core.Api.Item.save(form).then((res) => {
        this.$message.success('保存成功')
       // this.routerChange('back')
        go("detail");
      }).catch(err => {
        console.log('handleSubmit err:', err)
      })
    }
  }
};
</script>

<style lang="less">
#ItemEdit {
  .form-block {
    .form-content {
      .form-item {
        .value.input-number {
          .ant-input-number {
            width: 120px;
          }
          span {
            font-size: 14px;
            line-height: 20px;
            padding-left: 10px;
          }
        }
      }
    }
  }
}
</style>