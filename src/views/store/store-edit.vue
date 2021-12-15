<template>
  <div id="StoreEdit" class="edit-container">
    <div class="title-container">
      <div class="title-area">{{ form.id ? '门店编辑' : '新建门店' }}</div>
    </div>
    <div class="form-block">
      <div class="form-title">
        <div class="title-colorful">基本信息</div>
      </div>
      <div class="form-content" >
        <div class="form-item required" v-if="loginType == LOGIN_TYPE.ADMIN" >
          <div class="key">经销商：</div>
          <div class="value">
            <a-select v-model:value="form.agent_id" placeholder="请选择经销商">
              <a-select-option v-for="agent of agentList" :key="agent.id" :value="agent.id">{{agent.name}}</a-select-option>
            </a-select>

          </div>
        </div>
        <div class="form-item required">
          <div class="key">门店名称：</div>
          <div class="value">
            <a-input v-model:value="form.name" placeholder="请输入门店名称"/>
          </div>
        </div>
        <div class="form-item required">
          <div class="key">Logo：</div>
          <div class="value">
            <a-upload name="file" class="image-uploader"
                      list-type="picture-card" accept='image/*'
                      :file-list="upload.imgList" :action="upload.action"
                      :headers="upload.headers" :data='upload.data'
                      :before-upload="handleImgCheck"
                      @change="handleLogoChange">
              <div class="image-inner" v-if="upload.imgList.length < 1">
                <i class="icon i_upload"/>
              </div>
            </a-upload>
            <div class="tip">建议尺寸：800*800像素</div>
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
  name: 'StoreEdit',
  components: {},
  props: {},
  data() {
    return {
      loginType: Core.Data.getLoginType(),
      LOGIN_TYPE: Core.Const.LOGIN.TYPE,
      // 加载
      loading: false,
      detail: {},
      customer_address: [],
      form: {
        id: '',
        agent_id: '',
        name: '',
        logo: '',
        type:0,
      },
      upload: {
        action: Core.Const.NET.FILE_UPLOAD_END_POINT,
        imgList: [],
        headers: {
          ContentType: false
        },
        data: {
          token: Core.Data.getToken(),
          type: 'img',
        },
      },
      agentList: []
    };
  },
  watch: {},
  computed: {},

  mounted() {
    this.form.id = Number(this.$route.query.id) || 0
    if (this.form.id) {
      this.getStoreDetail();
    }
    let loginType = Core.Data.getLoginType()
    if (loginType === Core.Const.LOGIN.TYPE.ADMIN) {
      this.getAgentList();
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
    getStoreDetail() {
      this.loading = true;
      Core.Api.Store.detail({
        id: this.form.id,
      }).then(res => {
        console.log('getStoreDetail res', res)
        this.detail = res.detail
        for (const key in this.form) {
          this.form[key] = res.detail[key]
        }
      }).catch(err => {
        console.log('getStoreDetail err', err)
      }).finally(() => {
        this.loading = false;
      });
    },
    handleSubmit() {
      let form = Core.Util.deepCopy(this.form)
      if (!form.id) {
        if (!form.name) {
          return this.$message.warning('请输入门店名称')
        }
        //   if (!form.logo) {
        //     return this.$message.warning('请添加logo图片')
        //   }
        // }
        Core.Api.Store.save(form).then(() => {
          this.$message.success('保存成功')
          this.routerChange('back')
        }).catch(err => {
          console.log('handleSubmit err:', err)
        })
      }
    },
    handleImgCheck(file) {
      const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
      if (!isCanUpType) {
        this.$message.warning('文件格式不正确');
      }
      const isLt10M = (file.size / 1024 / 1024) < 10;
      if (!isLt10M) {
        this.$message.warning('请上传小于10MB的图片');
      }
      return isCanUpType && isLt10M;
    },
    // 上传图片
    handleLogoChange({file, fileList}) {
      this.upload.imgList = fileList
      console.log("handleCoverChange status:", file.status, "file:", file)

    },
    getAgentList() {
      Core.Api.Agent.listName().then(res => {
        console.log(res)
        this.agentList = res.list
      }).catch(err => {
        console.log('handleSubmit err:', err)
      })

    }
  }
}
</script>

<style lang="less" scoped>
// #DistributorEdit {}
</style>