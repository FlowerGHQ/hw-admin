<template>
    <div class="test">
        <div class="point-contain" @mouseup="mouseupHandler" @mousemove="mousemoveHandler">
            <img ref="exploreImg" src="../../assets//images/vehicle.png" alt="">
            <canvas class="explore-canvas" ref="exploreCanvas"></canvas>

            <template v-for="(item, itemIndex) in pointerList">            
                <div      
                    v-for="(itemStart, itemStartIndex) in item.start" :key="index"     
                    class="pointer-start" 
                    :style="{'left': `${itemStart?.x}px`, 'top': `${itemStart?.y }px`}"
                    @mousedown="pointMousedown(itemIndex, 'start', itemStartIndex)"
                    @mousemove.stop=""
                >
                </div>
            </template>
            <div 
                v-for="(item, index) in pointerList" :key="index"
                class="pointer-end"
                :style="{'left': `${item?.end?.x}px`, 'top': `${item?.end?.y }px`}"
                @mousedown="pointMousedown(index, 'end')"
                @mousemove.stop=""
            >
                {{item.index || 0}}
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue';

var ctx = null // canvas 2d实例
const { proxy } = getCurrentInstance();



const exploreCanvas = ref(null) // canvas ref
const exploreImg = ref(null) // 照片 ref 之所以不直接画在canvas中是为了后面移动要清除整个画布

const pointerList = ref([
    {
        end_point:"{\"x\":423,\"y\":310}",  // 结束点只有一个
        start_point:"[{\"x\":416,\"y\":153}, {\"x\":316,\"y\":253}]", // 开始点有多个
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
        start_point: "[{\"x\":137,\"y\":223},{\"x\":237,\"y\":323}]",
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

// 移动点操作
const moveParams = ref({
    isMove: false, // 是否可以移动了
    moveIndex: undefined, // 移动第几个索引
    moveType: undefined, // 移动是移动哪个类型
    itemStartIndex: undefined,
})

onMounted(() => {
    pointerList.value = pointerList.value.map(el => {
        return {
            ...el,
            start: JSON.parse(el.start_point) instanceof Array ? JSON.parse(el.start_point) : [],
            end: JSON.parse(el.end_point),
        }
    })
    // console.log("结果", pointerList.value);

    init()
})

/* methods */
const test = () => {
    console.log("创建时间");
}
// 容器内鼠标移动
const mousemoveHandler = (e) => {
    if(!moveParams.value.isMove)  return;

    if (moveParams.value.moveType === 'start') {

        pointerList.value[moveParams.value.moveIndex][moveParams.value.moveType][moveParams.value.itemStartIndex].x = e.offsetX;
        pointerList.value[moveParams.value.moveIndex][moveParams.value.moveType][moveParams.value.itemStartIndex].y = e.offsetY;
        console.log("结果 start", pointerList.value);
    } else if (moveParams.value.moveType === 'end') {

        pointerList.value[moveParams.value.moveIndex][moveParams.value.moveType].x = e.offsetX;
        pointerList.value[moveParams.value.moveIndex][moveParams.value.moveType].y = e.offsetY;
        console.log("结果 end", pointerList.value);
    }
    
    window.requestAnimationFrame(() => {
        canvasLine(ctx)
    })
}
// 容器内鼠标移动
const mouseupHandler = () => {
    console.log("松开");
    moveParams.value.isMove = false    
    moveParams.value.moveIndex = undefined    
    moveParams.value.moveType = undefined    
    moveParams.value.itemStartIndex = undefined
}
// points 鼠标按下
const pointMousedown = (index, type, itemStartIndex) => {
    moveParams.value.isMove = true
    moveParams.value.moveIndex = index
    moveParams.value.moveType = type
    moveParams.value.itemStartIndex = itemStartIndex || undefined
}
// 初始化
const init = () => {
    ctx = exploreCanvas.value.getContext("2d")
    
    // 等图片加载完
    exploreImg.value.onload = () => {
        setCanvasAttr(exploreImg.value.width, exploreImg.value.height)
        canvasLine(ctx)
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

// 画线
const canvasLine = (ctx) => {
    clearCanvas(ctx)

    ctx.beginPath();
    ctx.lineWidth = 1
    ctx.strokeStyle = '#1890ff';
    pointerList.value.forEach($1 => {
        var start = $1.start
        var end = $1.end

        if (start.length > 0) {
            start.forEach($2 => {                
                ctx.moveTo($2.x, $2.y)
                ctx.lineTo(end.x, end.y)
                ctx.stroke();
            })
        } else {
            ctx.moveTo(start[0].x, start[0].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke();
        }
    })

}

// 清除画布
const clearCanvas = (ctx) => {
    ctx.clearRect(0, 0, exploreCanvas.value.width, exploreCanvas.value.height)
}

const btn = () => {
    clearCanvas(ctx)
}
</script>

<style lang="less" scoped>
.test {
    margin: 90px;
    
    .point-contain {
        
        display: inline-block;
        position: relative;
        // max-width: 800px;
        // max-height: 800px;
        // min-height: 100px;

        .explore-canvas {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
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
            background-color: @BG_LP;
        }
        .pointer-end {
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            background-color: @BG_LP;
            color: #fff;
        }
    }
}
</style>
