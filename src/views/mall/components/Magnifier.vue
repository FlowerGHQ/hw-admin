<template>
    <div id="Magnifier">
        <!-- 图片展示区域 -->
        <div id="wapper" class="gallery-pic-wrap" @mouseover="handleZoomMouseover" @mouseout="handleZoomMouseout"
            @mousemove="handleZoomMousemove">
            <img :src="activePicUrl" :style="activeStyle" />
            <!-- 放大镜 -->
            <div id="zoom" class="zoom-box"></div>
        </div>
        <!-- 放大后的图片展示区域 -->
        <div id="big" class="big-pic-box">
            <img id="big-pic" :src="activePicUrl"
                style="width: calc((450 / 160) * 450px); height: calc((450 / 160) * 450px)" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
const props = defineProps({
    activePicUrl: {
        type: String,
        default: '',
    },
})
/* methods start */
/** 放大镜：移入商品图片区域 */
const handleZoomMouseover = () => {
    const zoom = document.getElementById('zoom')
    const big = document.getElementById('big')
    if (zoom) {
        zoom.style.display = 'block'
    }
    if (big) {
        big.style.display = 'block'
    }
}
/** 放大镜：移出商品图片区域 */
const handleZoomMouseout = () => {
    const zoom = document.getElementById('zoom')
    const big = document.getElementById('big')
    if (zoom) {
        zoom.style.display = 'none'
    }
    if (big) {
        big.style.display = 'none'
    }
}

// 放大比例：
const rate = 450 / 160
/** 在商品图片区域上移动 */
const handleZoomMousemove = e => {
    const zoom = document.getElementById('zoom')
    const bigPic = document.getElementById('big-pic')
    const wapper = document.getElementById('wapper')
    const wapperOffset = getViewportOffset(wapper)
    // 获得鼠标如何移动的方式：根据鼠标方向移动:移动的像素是多少
    // e.clientX  e.clientY : 鼠标相对于页面左上角的位置
    // wapperOffset.left  wapperOffset.top ：图片展示框距离页面左上角的位置
    // e.clientX - wapperOffset.left：鼠标相对于图片展示框的位置
    // 80 = 放大镜框的宽度 / 2； 宽高一致
    // zoomX、zoomY：放大镜框相对于图片展示框的位置
    let zoomX = e.clientX - wapperOffset.left - 355
    let zoomY = e.clientY - wapperOffset.top - 355

    // zoom边界的处理：即放大镜框最大可移动区域
    //左边界
    if (zoomX < 0) {
        zoomX = 0
    }
    // 右边界：290 = 450 - 160，即图片展示框宽度 - 放大镜宽度
    if (zoomX >= 290) {
        zoomX = 290
    }
    // 上边界
    if (zoomY < 0) {
        zoomY = 0
    }
    // 下边界
    if (zoomY >= 290) {
        zoomY = 290
    }
    // 放大镜移动
    if (zoom) {
        zoom.style.left = zoomX + 'px'
        zoom.style.top = zoomY + 'px'
        console.log(zoomX, zoom.style.left)
    }
    // 放大后的图片跟随移动
    if (bigPic) {
        bigPic.style.marginLeft = -zoomX * rate + 'px'
        bigPic.style.marginTop = -zoomY * rate + 'px'
    }
}
// 浏览器视口尺寸
const getViewportOffset = (dom) => {
    return {
        left: dom.offsetLeft,
        top: dom.offsetTop
    }
}
/* methods end */
</script>
<style lang="less" scoped>
#Magnifier {
    height: 100%;
    width: 100%;

    // 图片展示区域
    .gallery-pic-wrap {
        position: relative;
        width: 100%;
        height: 100%;

        >img {
            height: 100%;
            width: 100%;
            // object-fit: cover;
        }

        .zoom-box {
            width: 160px;
            height: 160px;
            background-color: #ffffff;
            border: 1px solid #cccccc;
            box-sizing: border-box;
            opacity: 0.5;
            position: absolute;
            left: 0;
            top: 0;
            display: none;
        }
    }

    // 放大的图片展示区域
    .big-pic-box {
        height: 710px;
        width: 710px;
        position: absolute;
        box-sizing: border-box;
        border: 2px solid #cccccc;
        top: 0px;
        left: 730px;
        z-index: 999;
        display: none;
        overflow: hidden;

        .big-pic {
            width: 900px;
            height: 900px;
            object-fit: cover;
        }
    }

}
</style>