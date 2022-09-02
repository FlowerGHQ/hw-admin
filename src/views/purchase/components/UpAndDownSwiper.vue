<template>
    <div class="banner_container">
        <!-- <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,index) in imgs" :key="index">
                    <img :src="$Util.imageFilter(item.logo)" @click="changeIndex(imgs,index)"/>
                </div>
            </div> -->
            <!-- <div class="swiper-pagination"></div> -->

        <!-- </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div> -->
        <!-- <img :src="getImgUrl(imgIndex)" class="img-big"> -->


        <a-carousel arrows dots-class="slick-dots slick-thumb" dotPosition="left" :afterChange="handleAafterChange" v-if="type === 0">
            <template #customPaging="props">
                <a >
                    <img :src="getImgUrl(props.i)" @click="changeIndex(imgs,props.i)"/>
                </a>
            </template>
            <div v-for="(item,index) in imgs" :key="index">
                <!-- <img :src="$Util.imageFilter(item.logo)"/> -->
            </div>
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
        </a-carousel>
        <div class="img-big">
            <img :src="getImgUrl(imgIndex)" />
        </div>
    </div>
</template>

<script>
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue';

export default {
    props: {
        imgs: Array,
        type: {
            Number,
            default: 0
        },
        imgIndex: Number
    },
    components: {
        UpOutlined,
        DownOutlined
    },
    data() {
        return {
            // imgs: [],
            // imgIndex: 0,
        }
    },
    watch: {
        "imgs": {
            deep: true,
            immediate: true,
            handler(n) {
                console.log('watch detail.item_code n:', n)
               // this.imgs = n
            }
        },
        "type": {
            deep: true,
            immediate: true,
            handler(n) {
                console.log('watch detail.item_code n:', n)
                // this.imgs = n
            }
        },

    },
    methods: {
        getImgUrl(i) {
            console.log("this.imgs",this.imgs)
            if (this.imgs != undefined && this.imgs != null&& this.imgs != ""){
                let img = ''
                if (this.type === 0){

                    img = this.imgs[i].imgs.split(",")

                } else {
                    if (this.imgs.imgs!== undefined){
                        img = this.imgs.imgs.split(",")
                    }

                }

                // console.log(this.imgs[i])
                // let img = this.imgs[i].imgs.split(",")
                if (img.length === 0){
                    return
                }
                return this.$Util.imageFilter(img[0])
            }

        },
        changeIndex(imgs,i) {
            // this.imgIndex = i
            this.$emit('handleChangeIndex',{id:imgs[i].id,i})
        },
        handleAafterChange(i) {
            this.$emit('handleChangeIndex',{id:this.imgs[i].id,i})
        }
    },
}


</script>

<style lang="less" scoped>
.banner_container {
    position: relative;
    overflow: hidden;
    position: relative;
    top: 60px;
    display: flex;
    padding: 20px 100px 20px 0;
    min-height: 372px;
    width: 100%;
}

/* For demo */
.ant-carousel {
    width: 90%;
}
.ant-carousel :deep(.slick-slider) {
  width: 100%;
  height: 100%;
  position: relative;
}
.ant-carousel :deep(.slick-dots-left) {
  left: 40px;
}
.ant-carousel :deep(.slick-dots) {
  position: relative;
  height: auto;
}
.ant-carousel :deep(.slick-slide img) {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel :deep(.slick-arrow) {
  display: none !important;
}
.ant-carousel :deep(.slick-thumb) {
  bottom: 0px;
}
.ant-carousel :deep(.slick-thumb li) {
  width: 60px;
  height: 45px;
  opacity: .5;
}
.ant-carousel :deep(.slick-thumb li img) {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
  display: block;
}
.ant-carousel :deep img {
    object-fit: scale-down;
}
.ant-carousel :deep .slick-thumb li.slick-active img {
    object-fit: scale-down;
  filter: grayscale(0%);
}

.ant-carousel :deep(.slick-active) {
    opacity: 1 !important;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
  z-index: 1;
  position: absolute;
  left: 60px !important;
  display: inline-block !important;
}
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  color: #6E7C94;
  background: #ffffff;
}
.ant-carousel :deep(.slick-prev) {
  top: 20px;
}
.ant-carousel :deep(.slick-next) {
  top: 480px;
}

.img-big {
    width: 500px;
    height: 500px;
    .fcc();
    img {
        width: 500px;
    }
    // margin-left: 160px;
}
</style>
