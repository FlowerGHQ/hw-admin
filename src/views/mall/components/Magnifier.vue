<template>
    <div id="Magnifier">
        <!-- 图片展示区域 -->
        <div
            id="wapper"
            class="gallery-pic-wrap"
            @mouseover="handleZoomMouseover"
            @mouseout="handleZoomMouseout"
            @mousemove="handleZoomMousemove"
        >
            <img :src="activePicUrl" @load="onload" />
            <!-- 放大镜 -->
            <div
                id="zoom"
                class="zoom-box"
                :style="{ width: `${magnifierSize}px`, height: `${magnifierSize}px` }"
            ></div>
        </div>
        <!-- 放大后的图片展示区域 -->
        <div id="big" class="big-pic-box" :style="{ width: `${wapperWidth}px`, height: `${wapperHeight}px` }">
            <img
                id="big-pic"
                :src="activePicUrl"
                :style="{
                    width: `${(wapperWidth / magnifierSize) * wapperWidth}px`,
                    height: `${(wapperHeight / magnifierSize) * wapperHeight}px`,
                }"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted } from 'vue';
const props = defineProps({
    activePicUrl: {
        type: String,
        default: '',
    },
    // 放大镜大小
    magnifierSize: {
        type: Number,
        default: 160,
    },
    // 放大镜大小
    magnifierSize: {
        type: Number,
        default: 160,
    },
});
// 图片高度
const wapperHeight = ref(0);
// 图片宽度
const wapperWidth = ref(0);
// 放大比例：
const rate = ref(0);
onMounted(() => {
    // 监听页面窗口
    window.addEventListener('resize', handleWindowResize);
});
onUnmounted(() => {
    // 监听页面窗口
    window.removeEventListener('resize', handleWindowResize);
});
/* methods start */
// 图片加载后重载数据
const onload = () => {
    handleWindowResize();
};
// 监听窗口变化
const handleWindowResize = e => {
    const wapper = document.getElementById('wapper');
    wapperHeight.value = wapper.clientHeight;
    wapperWidth.value = wapper.clientWidth;
    console.log(wapperHeight.value);
    // 放大比例 = 图片整体宽度 / 放大镜宽度
    rate.value = wapperWidth.value / props.magnifierSize;
};
/** 放大镜：移入商品图片区域 */
const handleZoomMouseover = () => {
    const zoom = document.getElementById('zoom');
    const big = document.getElementById('big');
    if (zoom) {
        zoom.style.display = 'block';
    }
    if (big) {
        big.style.display = 'block';
    }
};
/** 放大镜：移出商品图片区域 */
const handleZoomMouseout = () => {
    const zoom = document.getElementById('zoom');
    const big = document.getElementById('big');
    if (zoom) {
        zoom.style.display = 'none';
    }
    if (big) {
        big.style.display = 'none';
    }
};

/** 在商品图片区域上移动 */
const handleZoomMousemove = e => {
    const zoom = document.getElementById('zoom');
    const bigPic = document.getElementById('big-pic');
    const wapper = document.getElementById('wapper');
    const wapperOffset = getViewportOffset(wapper);
    // 获得鼠标如何移动的方式：根据鼠标方向移动:移动的像素是多少
    // e.clientX  e.clientY : 鼠标相对于页面左上角的位置
    // wapperOffset.left  wapperOffset.top ：图片展示框距离页面左上角的位置
    // e.clientX - wapperOffset.left：鼠标相对于图片展示框的位置
    // 80 = 放大镜框的宽度 / 2； 宽高一致
    // zoomX、zoomY：放大镜框相对于图片展示框的位置
    let zoomX = e.clientX - wapperOffset.left - 80;
    let zoomY = e.clientY - wapperOffset.top - 80;

    // zoom边界的处理：即放大镜框最大可移动区域
    //左边界
    if (zoomX < 0) {
        zoomX = 0;
    }
    // 右边界：290 = wapperHeight - magnifierSize，即图片展示框宽度 - 放大镜宽度
    if (zoomX >= wapperHeight.value - props.magnifierSize) {
        zoomX = wapperHeight.value - props.magnifierSize;
    }
    // 上边界
    if (zoomY < 0) {
        zoomY = 0;
    }
    // 下边界
    if (zoomY >= wapperWidth.value - props.magnifierSize) {
        zoomY = wapperWidth.value - props.magnifierSize;
    }
    // 放大镜移动
    if (zoom) {
        zoom.style.left = zoomX + 'px';
        zoom.style.top = zoomY + 'px';
    }
    // 放大后的图片跟随移动
    if (bigPic) {
        bigPic.style.marginLeft = -zoomX * rate.value + 'px';
        bigPic.style.marginTop = -zoomY * rate.value + 'px';
    }
};
// 浏览器视口尺寸
const getViewportOffset = dom => {
    const rect = dom.getBoundingClientRect();
    return {
        left: rect.left,
        top: rect.top,
    };
};
/* methods end */
</script>
<style lang="less" scoped>
#Magnifier {
    height: 100%;
    width: 100%;
    position: relative;

    // 图片展示区域
    .gallery-pic-wrap {
        position: relative;
        width: 100%;
        height: 100%;

        > img {
            height: 100%;
            width: 100%;
            object-fit: cover;
        }

        .zoom-box {
            background-color: #ffffff;
            border: 1px solid #cccccc;
            box-sizing: border-box;
            opacity: 0.5;
            position: absolute;
            left: 0;
            top: 0;
            display: none;
            cursor: all-scroll;
        }
    }

    // 放大的图片展示区域
    .big-pic-box {
        position: absolute;
        box-sizing: border-box;
        border: 2px solid #cccccc;
        top: 0px;
        right: -40px;
        transform: translateX(100%);
        z-index: 999;
        display: none;
        overflow: hidden;

        #big-pic {
            object-fit: cover;
        }
    }
}
</style>
