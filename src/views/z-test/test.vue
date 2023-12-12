<template>
    <div class="test">
        <canvas ref="exploreCanvas"></canvas>
        <div 
            v-for="(item, index) in pointerList" :key="index"
            class="pointer-start" 
            :style="{'left': `${item?.start?.x}px`, 'top': `${item?.start?.y }px`}"
        >
        </div>
        <div 
            v-for="(item, index) in pointerList" :key="index"
            class="pointer-end"
            :style="{'left': `${item?.end?.x}px`, 'top': `${item?.end?.y }px`}"
        >
        
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue';
import imgs  from '../../assets/images/vehicle.png'
let ctx = null // canvas 2d实例
const { proxy } = getCurrentInstance();



const exploreCanvas = ref(null)

const pointerList = ref([
    {
        end_point:"{\"x\":423,\"y\":310}",
        start_point:"{\"x\":416,\"y\":153}",
        create_time:1702363893,
        id:1335,
        index:1,        
        material:null,
        set_id:805,
        target_id:7637,
        target_type:1,
        update_time:1702363893,
        weight:0,
    },
    {
        end_point:"{\"x\":74,\"y\":67}",
        start_point: "{\"x\":137,\"y\":223}",
        create_time:1702363893,
        id:1335,
        index:1,        
        material:null,
        set_id:805,
        target_id:7637,
        target_type:1,
        update_time:1702363893,
        weight:0,
    }
]) // 点位列表

onMounted(() => {
    pointerList.value = pointerList.value.map(el => {
        return {
            ...el,
            start: JSON.parse(el.start_point),
            end: JSON.parse(el.end_point),
        }
    })
    console.log("结果", pointerList.value);

    loadImage()
})

/* methods */
// 加载照片
const loadImage = () => {
    ctx = exploreCanvas.value.getContext("2d")

    let img = new Image()

    img.src = imgs

    console.dir(img);

    img.onload = function() {
        setCanvasAttr(img.width, img.height)
        ctx.drawImage(img, 0, 0)
    }
}
// 设置canvas的大小
const setCanvasAttr = (width, height) => {
    if(width > 800 || height > 800) {
        let rate = width / height
        console.log("rate", rate);

        exploreCanvas.value.width = rate >= 1 ? 800 : width / height * 800;
        exploreCanvas.value.height = rate >= 1 ? 800 : height / width * 800;
    } else {
        exploreCanvas.value.width = width;
        exploreCanvas.value.height = height;
    }

}

// 初始化画线
const canvasLine = (ctx) => {

}

// 清除画布
// const canvasClear =
</script>

<style lang="less" scoped>
.test {
    margin: 90px;
    position: relative;
    .pointer-start, .pointer-end  {
        position: absolute;
        z-index: 10;
        border-radius: 50px;
        user-select: none;
        opacity: 0.6;
        transition: opacity 0.15s ease;
        transform: translate(-50%, -50%);
        cursor: pointer;
        &:hover {
            z-index: 20;
            opacity: 1;
        }
    }
    .pointer-start {
        width: 8px;
        height: 8px;
        background-color: blue;
    }
    .pointer-end {
        width: 20px;
        height: 20px;
        background-color: red;
    }
}
</style>
