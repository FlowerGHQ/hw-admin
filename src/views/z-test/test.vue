<template>
    <div class="test">
        <div :class="{ sidebar:  sidebarData.length > 0 }">
            <div 
                v-for="(item, i) in sidebarData" 
                :key="i" 
                class="sidebar-item"
                :class="{  'silder-bottom-border': (i + 1) !== sidebarData.length }"
            >
                <div class="silder-index">{{ item.index }}</div>
                <div class="silder-operate">
                    <div class="silder-copy" @click="onSilderCopy(item, i)">复制</div>
                    <div class="silder-delete" @click="onSilderDelete(item, i)">删除</div>                
                </div>
            </div>
        </div>
        <div class="point-contain" @mouseup="mouseUpHandler" @mousemove="mousemoveHandler">
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
            <template v-for="(item, itemIndex) in pointerList" :key="itemIndex">            
                <div    
                    v-if="item?.end"
                    class="pointer-end"
                    :style="{'left': `${item?.end?.x}px`, 'top': `${item?.end?.y }px`}"
                    @mousedown="pointMousedown(itemIndex, 'end')"
                    @mousemove.stop=""
                >
                    {{item.index || 0}}
                </div>
            </template>
        </div>

        <button @click="btn">添加点位</button>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue';
import Core from '../../core';

var ctx = null // canvas 2d实例
const { proxy } = getCurrentInstance();



const exploreCanvas = ref(null) // canvas ref
const exploreImg = ref(null) // 照片 ref 之所以不直接画在canvas中是为了后面移动要清除整个画布

const pointerList = ref([
    // {
    //     end_point:"{\"x\":423,\"y\":310}",  // 结束点只有一个
    //     start_point:"[{\"x\":416,\"y\":153}, {\"x\":316,\"y\":253}]", // 开始点有多个
    //     create_time:1702363893,
    //     id:1335,
    //     index:1,        
    //     material:null,
    //     set_id:805,
    //     target_id:7637,
    //     target_type:1,
    //     update_time:1702363893,
    //     weight:0,
    // },
    // {
    //     end_point:"{\"x\":74,\"y\":67}",
    //     start_point: "[{\"x\":137,\"y\":223},{\"x\":237,\"y\":323}]",
    //     create_time:1702363893,
    //     id:1335,
    //     index:1,        
    //     material:null,
    //     set_id:805,
    //     target_id:7637,
    //     target_type:1,
    //     update_time:1702363893,
    //     weight:0,
    // }
]) // 点位列表

// 移动点操作
const moveParams = ref({
    isMove: false, // 是否可以移动了
    moveIndex: undefined, // 移动第几个索引
    moveType: undefined, // 移动是移动哪个类型
    itemStartIndex: undefined,
})

// 侧边栏数据
const sidebarData = ref([])

onMounted(() => {
    // pointerList.value = pointerListFilter(pointerList.value)
    // console.log("结果", pointerList.value);

    init()
})

/* methods */
const pointerListFilter = (arr) => {
    const result = arr.map(el => {
        return {
            ...el,
            start: JSON.parse(el.start_point) instanceof Array ? JSON.parse(el.start_point) : [],
            end: JSON.parse(el.end_point),
        }
    })
    return result
}
// 初始化
const init = () => {
    ctx = exploreCanvas.value.getContext("2d")
    
    // 等图片加载完
    exploreImg.value.onload = () => {
        setCanvasAttr(exploreImg.value.width, exploreImg.value.height)        
    }
    
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
// 容器内松开
const mouseUpHandler = () => {
    console.log("松开");
    moveParams.value.isMove = false 
    moveParams.value.moveIndex = undefined
    moveParams.value.moveType = undefined
    moveParams.value.itemStartIndex = undefined
}
// points 鼠标按下
const pointMousedown = (index, type, itemStartIndex) => {
    console.log("按下", index, type, itemStartIndex);
    moveParams.value.isMove = true
    moveParams.value.moveIndex = index
    moveParams.value.moveType = type
    moveParams.value.itemStartIndex = itemStartIndex
    console.log("moveParams", moveParams.value);
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

        if (start.length > 1) {
            start.forEach($2 => {                
                ctx.moveTo($2.x, $2.y)
                ctx.lineTo(end.x, end.y)
                ctx.stroke();
            })
        } else if (start.length === 1) {
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


// 复制silder
const onSilderCopy = (item, index) => {
    console.log("item", item, "index", index);

    const obj = item

    item.start.forEach((el,i) => {
        obj.start[i + 1] = {
            x: obj.start[i].x + 20,
            y: obj.start[i].y,
        }
    })
    sidebarData.value.push(obj)
    

    const data = pointerList.value.find(el => el.index === item.index)
    data.start = sidebarData.value[sidebarData.value.length - 1].start  // 替换掉start让其为 sidebarData底下 的start

    canvasLine(ctx)
}
// 删除silder
const onSilderDelete = (item, index) => {
    console.log("item", item, "index", index);

    item.start.splice(index, 1) // 删除sidebarData每个对应的start中的数据操作
    const silderCategory = sidebarData.value.filter(el => el.index === item.index) // 找出当前点击的所属类别
    
    const data = pointerList.value.find(el => el.index === item.index)
    if (silderCategory.length === 1) {
        data.start = sidebarData.value[sidebarData.value.length - 1].start
        data.end = undefined
    } else {
        data.start = sidebarData.value[sidebarData.value.length - 1].start
    }

    sidebarData.value.splice(index, 1) // 最后删除页面上的效果
    canvasLine(ctx)

    console.log("最后的结果", pointerList.value);
}

const btn = () => {
    pointerList.value = []
    pointerList.value.push(
        {
            end_point:"{\"x\":0,\"y\":100}",  // 结束点只有一个
            start_point:"[{\"x\":0,\"y\":0}]", // 开始点有多个    
            // end: undefined,
            // start: undefined,
            id: 1335,
            index: 1,
        },
    )
    pointerList.value = pointerListFilter(pointerList.value)
    console.log("添加点位", pointerList.value);
    canvasLine(ctx)

    pointerList.value.forEach($1 => {
        sidebarData.value.push({
            index: $1.index,
            end: $1.end,
            start: $1.start
        })
    })

    console.log("sidebarData", sidebarData.value);
}

</script>

<style lang="less" scoped>
.test {
    margin: 90px;
    .sidebar {
        width: 200px;
        margin-bottom: 100px;
        border: 1px solid #EEEEEE;
        border-radius: 4px;
        padding: 0 10px;
        box-sizing: border-box;
        .sidebar-item {
            background-color: #fff;
            padding: 10px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            &.silder-bottom-border {
                border-bottom: 1px solid #E2E2E2;                
            }
            .silder-index {
                width: 20px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                background-color: #F2F3F5;
                border-radius: 50%;

                color: #666;
                font-family: PingFang SC;
                font-size: 12px;
                font-weight: 500;
            }
            .silder-operate {
                display: flex;
                .silder-copy {
                    margin-right: 5px;
                }
                .silder-delete {
    
                }
            }
        }
    }
    
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
