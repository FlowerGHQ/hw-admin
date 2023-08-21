<template>
  <div id="file-list" class="list-container">
    <div class="left">
      <div class="title-container">
        <div class="title-area">{{ $t("f.file") }}</div>
      </div>

      <div class="file-box">
        <div class="search-item">
          <!-- 搜索门店 -->
          <a-input :placeholder="$t('s.search_place')" v-model:value="searchName" @pressEnter="searchCity" />
          <a-button type="primary" @click="searchCity" >{{ $t("def.search_se") }} </a-button>
        </div>

        <div class="directory">
          <div class="title"> {{ $t("retail.directory") }} </div>
          <a-button type="primary" ghost>{{ $t("retail.add_directory") }}</a-button>
        </div>

        <div class="file-explore-box">
          <div class="explore-list"  v-for="(fileItem, index) in 6" :key="index + '#'"  >
            <div class="file-left">
                <img src="../../../assets//images/retail/manual.png" class="file-img" alt="" />
                <div class="name-box">
2.0车辆产品手册...
                </div>
            </div>
            <div class="file-right">
                <img src="../../../assets//images/retail/manual.png" class="file-right-img" alt="" />
                <div class="text-box">

                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="flex: 1">
      <div class="title-container">
        <div class="title-area">{{ $t("n.content") }}</div>
        <div class="btns-area">
          <a-button type="primary" ghost>{{ $t("retail.add_content") }}</a-button>
        </div>
      </div>
      <!-- 文件内容 -->
      <div class="file-content"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StoreList",
  data() {
    return {};
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
#file-list {
  display: flex;
}

.left {
  width: 512px;
  border-right: 2px solid #f0f0f0;
}
.file-box {
  padding: 0px 26px 20px 22px;
  flex: 1;
  min-height: 700px;
}

.search-item {
  display: flex;
  border: 1px solid var(--color-border-2, #e5e6eb);
  border-radius: 2px;

  .ant-btn {
    border-radius: 2px;
  }
}

.ant-input {
  border: 1px #ffffff solid;
  border-radius: 2px 0px 0px 2px;
}

.directory {
  align-items: center;
  padding: 30px 0px 20px;
  .fj();

  .title {
    color: var(--color-text-1, #1d2129);
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
}

.file-explore-box {
  width: 468px;
  height: 600px;
  overflow-y: auto;

  .explore-list {
    height: 50px;
    width: 100%;
    background-color: var(--color-fill-1, #f7f8fa);
    margin-bottom: 10px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    .file-left {
        background: pink ;
    }
    .name-box {
        background: green;
        width: 161px;
        padding-left: 8px;
        box-sizing: border-box;
    }

    .file-right {
        background: pink ;
    }
    .file-img {
      width: 24px;
      height: 24px;
      background: yellow;
    }
  }
}

/* 定义滚动条的宽度和颜色 */
::-webkit-scrollbar {
  width: 5px; /* 宽度 */
  height: 10px;
}

/* 定义滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #ccc; /* 滑块颜色 */
  border-radius: 5px; /* 滑块圆角 */
}

/* 定义滚动条的轨道 */
::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* 轨道颜色 */
}
</style>