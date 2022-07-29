<template>
  <div class="banner_container">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item,index in imgs" :key="index">
          <img :src="item" @click="changeIndex(index)" />
        </div>
      </div>
      <!-- <div class="swiper-pagination"></div> -->
      
    </div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
    <img :src="getImgUrl(imgIndex)" class="img-big" >
  </div>
</template>
 
<script>
  import Swiper, { Pagination, Autoplay,Navigation } from 'swiper'
  // import 'swiper/css';
  // import 'swiper/less/pagination';
  // import 'swiper/less/navigation';

  import 'swiper/swiper.less';
  import 'swiper/swiper-bundle.min.css';
  // import 'swiper/components/navigation/navigation.css';
 
 
  Swiper.use([Pagination, Autoplay,Navigation])
 
  export default {
    data(){
      return {
         imgs:['https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F210F2130512J47-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661495042&t=b77c1037ad5171fd86341525a2b14e7e','https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F052420110515%2F200524110515-2-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661495151&t=1660dab7f77bcb019bb65f50621ece75','https://img1.baidu.com/it/u=2003496092,3295249130&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313','https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F210F2130512J47-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661495042&t=b77c1037ad5171fd86341525a2b14e7e','https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F052420110515%2F200524110515-2-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661495151&t=1660dab7f77bcb019bb65f50621ece75','https://img1.baidu.com/it/u=2003496092,3295249130&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313'],
         imgIndex: 0,
      }
    },
    methods:{
      //初始化swiper
      initSwiper(){
        var mySwiper = new Swiper('.swiper-container',{
            direction: 'vertical', // 垂直切换选项
            // loop: true,
            initialSlide: 0,
            grabCursor : true,
            slidesPerView: 3,
            centeredSlides: true,
            centeredSlidesBounds: true,
            spaceBetween : -140,
            // //分页箭头
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
            // autoplay: {
            //   delay: 3000 //自动播放
            // },
        })
      },
      getImgUrl(i) {
        return this.imgs[i]
      },
      changeIndex(index) {
        this.imgIndex = index
      }
    },
    async mounted() {
      this.initSwiper();
    }
  }
 
 
</script>
 
<style lang="less" scoped>
  .banner_container{
    position: relative;
    overflow: hidden;
    position: relative;
    top: 60px;
    display: flex;
    padding: 20px 100px 20px 0;
    min-height: 372px;
    width: 100%;
    .swiper-slide{
      // height: 100px !important;
      img{
        width:100%;
        // transform: scale(0.9);
        transition: 0.3s;
      }
    }
    //swiper 指示点的颜色
    .swiper-container{
        margin: 0;
        --swiper-pagination-color:#00937A;
        width: 60px;
        height: 300px;
        padding-bottom: 20px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
     }
  }
  .swiper-slide{
    width:100px;/*设为固定值*/
    width:auto;/*根据内容调整宽度*/
  }
  .swiper-pagination-horizontal{
    bottom: 50px;
    left: 0;
    width: 100%;
    }
    // .swiper-wrapper {
    //   top: 30px;
    // }
  //左右上下页的样式
  :deep(.swiper-button-prev), :deep(.swiper-button-next){
    transform: translateX(-50%) rotate(90deg);
    // position: absolute;
    // transform: rotate(90deg);
    // width:40px;
    // height:40px;
    // background-color: hsla(0,0%,100%,.3);
    // border-radius: 50%;
    // transition: all .2s ease-in-out;
    // &:hover{
    //   background-color: hsla(0,0%,100%,.5);
    //   transition: all .2s ease-in-out;
    // }
  }
  :deep(.swiper-button-prev) {
    top: 10px;
    left: 3.3%;
    transform: translateX(-50%) rotate(90deg);
  }
  :deep(.swiper-button-next) {
    top: 98%;
    right: 96.7%;
    transform: translateX(50%) rotate(90deg);
  }
  //修改上下页左右箭头的样式
  :deep(.swiper-button-prev:after) , :deep(.swiper-button-next:after)  {
  //   opacity: 1;
  //   object-fit: contain;
    color: #6E7C94;
    font-size: 20px;
  //   transition: all .2s ease-in-out;
  //   z-index: 5;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  }
  .img-big {
    width: 500px;
    margin-left: 100px;
  }
</style>