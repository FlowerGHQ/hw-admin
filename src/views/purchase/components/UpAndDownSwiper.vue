<template>
  <div class="banner_container">
    <!-- <a-carousel arrows dots-class="slick-dots slick-thumb" dotPosition="left" :afterChange="handleAafterChange" v-if="type === 0">
            <template #prevArrow>
                <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                    <up-outlined />
                </div>
            </template>
            <template #nextArrow>
                <div class="custom-slick-arrow" style="right: 10px">
                    <down-outlined />
                </div>
            </template>
        </a-carousel> -->

    <div class="img-big">
      <img :src="getImgUrl(imgIndex)" />
    </div>
    <div class="img-active">
      <div class="left-icon">
        <left-outlined @click="imgPreview(0)" />
      </div>
      <div class="img-item" ref="imgArea">
        <img
          class="item"
          :class="{ active: index === imgIndex }"
          v-for="(item, index) in imgsArr"
          :key="index"
          :src="$Util.imageFilter(item,2)"
          @click="previewImg(index)"
          alt="" />
      </div>
      <div class="right-icon">
        <right-outlined @click="imgPreview(1)" />
      </div>
    </div>
  </div>
</template>

<script>
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";

export default {
  props: {
    imgs: {
      type: [Object, Array],
      default: () => {
        return [];
      },
    },
    type: {
      Number,
      default: 0,
    },
    item_id: {
      type: Number,
      default: 0,
    },
  },
  components: {
    LeftOutlined,
    RightOutlined,
  },
  data() {
    return {
      imgIndex: 0,
    };
  },
  watch: {
    imgs: {
      handler(n) {
        console.log("watch imgs or details:", n);
      },
    },
    type: {
      handler(n) {
        console.log("watch type:", n);
      },
    },
    item_id: {
      handler(n) {
        console.log("watch item_id:", n);
      },
      immediate: true,
    },
  },
  computed: {
    imgsArr() {
      let activeObj = {}
      activeObj = this.type === 1 ? this.imgs : this.imgs.find((item) => item.id === this.item_id);
      console.log("activeObj:", activeObj);
      // 如果activeObj.logo或者imgs不存在，返回空数组
      if (!activeObj.logo && !activeObj.imgs) return []
      let arr = []
        arr = activeObj.imgs.split(",")
        // 找到imgs中的logo
        let logo = activeObj.logo
        let index = arr.indexOf(logo)
        // 将logo放到第一位
        if (index > -1) {
          arr.splice(index, 1)
          arr.unshift(logo)
        } else {
          arr.unshift(logo)
        }
      
      return arr
    },
  },
  methods: {
    getImgUrl() {
      console.log(this.imgsArr)
      return this.$Util.imageFilter(this.imgsArr?this.imgsArr[this.imgIndex]:[],2);
    },
    imgPreview(type) {
      if (type === 0) {
        if (this.imgIndex === 0) {
          this.imgIndex = this.imgsArr.length - 1;
        } else {
          this.imgIndex--;
        }
      } else {
        if (this.imgIndex === this.imgsArr.length - 1) {
          this.imgIndex = 0;
        } else {
          this.imgIndex++;
        }
      }
    //   让当前图片居中
      this.$refs.imgArea.scrollLeft = this.imgIndex * 70;
    },
    previewImg(index) {
      this.imgIndex = index;
    },
  },
};
</script>

<style lang="less" scoped>
.banner_container {
  display: flex;
  flex-direction: column;
  padding: 0 100px;
  max-width: 700px;
  .img-big {
    width: 500px;
    height: 500px;
    padding: 0 20px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    // margin-left: 160px;
  }
  .img-active {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    align-items: center;
    .left-icon,
    .right-icon {
      cursor: pointer;
      font-size: 20px;
    }
    .img-item {
      height: 50px;
      margin: 0 10px;
      flex: 1;
      display: flex;
      //   超出滚动
      overflow-x: auto;
      overflow-y: hidden;
      cursor: pointer;
    //   隐藏滚动条
        &::-webkit-scrollbar {
            display: none;
        }
      .item {
        height: 50px;
        width: 50px;
        margin: 0 10px;
        object-fit: cover;
      }
      .active {
        border: 1px solid #E0E0E0;
      }
    }
  }
}
</style>
