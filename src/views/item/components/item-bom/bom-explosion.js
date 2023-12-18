import { computed, ref } from "vue";
var ctx = null; // canvas 2d实例

const exploreCanvas = ref(null); // canvas ref
const sidebarData = ref([
    // { id: 1, index: 1 },
    // { id: 1, index: 1 },
    // { id: 1, index: 1 },
    // { id: 2, index: 2 },
    // { id: 2, index: 2 },
    // { id: 2, index: 2 },
]); // 点位list
// 移动点 parmas
const moveParams = ref({
    isMove: false, // 是否可以移动了
    moveIndex: undefined, // 移动第几个索引
    moveType: undefined, // 移动是移动哪个类型
    itemStartIndex: undefined,
});
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
]); // 点位列表

const pointerListFilter = (arr) => {
    console.log("pointerListFilter-arr", arr);
    const result = arr.map((el) => {
        const obj = {
            ...el,
            end: !el.end_point ? "" : JSON.parse(el.end_point),
        }

        obj.start = Array.isArray(JSON.parse(el?.start_point || "")) ? JSON.parse(el.start_point) : []
        
        return obj
    });
    return result;
};
// 初始化
const init = (arr, explosionImgItem) => {
    ctx = exploreCanvas.value.getContext("2d");

    const isImg = document.querySelector('#cavnasImg')
    const pointContain = document.querySelector('.point-contain')
    const Canvas = document.querySelector('#exploreCanvas')

    if (isImg) {
        // 删除上一个Img
        pointContain.removeChild(isImg)
    }

    const img = document.createElement('img')
    img.src = explosionImgItem.img
    img.setAttribute('id', 'cavnasImg')
    pointContain.insertBefore(img, Canvas)

    // 第一次进来 初始化
    img.onload = () => {
        console.log("图片加载完成");
        setCanvasAttr(img.width, img.height);
        initLine(arr)
    };
    img.onerror = () => {
        console.log("图片加载失败");
    };
};
// 容器内鼠标移动
const mousemoveHandler = (e) => {
    if (!moveParams.value.isMove) return;

    if (moveParams.value.moveType === "start") {
        pointerList.value[moveParams.value.moveIndex][moveParams.value.moveType][moveParams.value.itemStartIndex].x =
            e.offsetX;
        pointerList.value[moveParams.value.moveIndex][moveParams.value.moveType][moveParams.value.itemStartIndex].y =
            e.offsetY;
        console.log("结果 start", pointerList.value);
    } else if (moveParams.value.moveType === "end") {
        pointerList.value[moveParams.value.moveIndex][moveParams.value.moveType].x = e.offsetX;
        pointerList.value[moveParams.value.moveIndex][moveParams.value.moveType].y = e.offsetY;
        console.log("结果 end", pointerList.value);
    }

    window.requestAnimationFrame(() => {
        canvasLine(ctx);
    });
};
// 容器内松开
const mouseUpHandler = () => {
    console.log("松开");
    moveParams.value.isMove = false;
    moveParams.value.moveIndex = undefined;
    moveParams.value.moveType = undefined;
    moveParams.value.itemStartIndex = undefined;
};
// points 鼠标按下
const pointMousedown = (index, type, itemStartIndex) => {
    console.log("按下", index, type, itemStartIndex);
    moveParams.value.isMove = true;
    moveParams.value.moveIndex = index;
    moveParams.value.moveType = type;
    moveParams.value.itemStartIndex = itemStartIndex;
    console.log("moveParams", moveParams.value);
};
// 设置canvas的大小
const setCanvasAttr = (width, height) => {
    if (width > 800 || height > 800) {
        let rate = width / height;
        console.log("rate", rate);

        exploreCanvas.value.width = rate >= 1 ? 800 : (width / height) * 800;
        exploreCanvas.value.height = rate >= 1 ? 800 : (height / width) * 800;
    } else {
        exploreCanvas.value.width = width;
        exploreCanvas.value.height = height;
    }
};

// 画线
const canvasLine = (ctx) => {
    clearCanvas(ctx);

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#1890ff";
    pointerList.value.forEach(($1) => {
        var start = $1.start;
        var end = $1.end;

        if (start.length > 1) {
            start.forEach(($2) => {
                ctx.moveTo($2.x, $2.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
            });
        } else if (start.length === 1) {
            ctx.moveTo(start[0].x, start[0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    });
};

// 清除画布
const clearCanvas = (ctx) => {    
    ctx.clearRect(0, 0, exploreCanvas.value.width, exploreCanvas.value.height);
};

// 复制silder
const onSilderCopy = (item, index) => {
    console.log("item", item, "index", index);

    const obj = item;

    item.start.forEach((el, i) => {
        // 让新增的一条是上一条的增加数据
        if ((i + 1) === item.start.length) {
            obj.start[i + 1] = {
                x: obj.start[i].x + 20,
                y: obj.start[i].y + 10,
            };
        }
    });
    sidebarData.value.push(obj);

    const data = pointerList.value.find((el) => el.index === item.index);
    data.start = sidebarData.value[sidebarData.value.length - 1].start; // 替换掉start让其为 sidebarData底下 的start

    canvasLine(ctx);
};
// 删除silder
const onSilderDelete = (item, index) => {
    console.log("item", item, "index", index);

    item.start.splice(index, 1); // 删除sidebarData每个对应的start中的数据操作    

    // console.log("onSilderDelete-sidebarData", sidebarData.value);
    
    const silderCategory = sidebarData.value.filter((el) => el.index === item.index); // 找出当前点击的所属类别    
    const pointerListIndex = pointerList.value.findIndex((el) => el.index === item.index);
    
    if (silderCategory.length === 1) {
        console.log("pointerListIndex", pointerListIndex);
        pointerList.value.splice(pointerListIndex, 1)
    }
    
    canvasLine(ctx);
    
    const sidebarIndex =  sidebarData.value.findIndex(el => el.id === item.id)
    sidebarData.value.splice(sidebarIndex, 1) // 删除页面的效果
    
    console.log("onSilderDelete-pointerList", pointerList.value);
};
// 将侧边栏过滤成组的形势
const sidebarDataGroup = computed(() => {
    // console.log("将侧边栏过滤成组的形势 sidebarData", sidebarData.value); // [ [], [], []]

    const arrIndex = []
    sidebarData.value.forEach($1 => {
        const i = arrIndex.findIndex($2 => $2 === $1.index)        
        if (i === -1) {
            arrIndex.push($1.index)
        }
    })
    
    const filteredData = arrIndex.reduce((result, el) => {
        const itemArr = sidebarData.value.filter(item => item.index === el)
        
        result.push(itemArr)

        return result
    }, [])

    console.log("将侧边栏过滤成组的形势", filteredData); // [ [], [], []]
    return filteredData.length > 0 ? filteredData : [];
});

// 初始化数据和画线
const initLine = (arr) => {
    console.log("初始化数据和画线", arr);    
    pointerList.value = arr;
    sidebarData.value = []
       
    pointerList.value = pointerListFilter(pointerList.value);
    canvasLine(ctx);

    let count = 1
    pointerList.value.forEach(($1) => {
        $1.start.forEach(el => {
            sidebarData.value.push({
                id: count++, // 标识
                index: $1.index,
                end: $1.end,
                start: $1.start,
            });
        })
    });

    console.log("sidebarData", sidebarData.value);
};

export {
    pointerList,
    sidebarData,
    exploreCanvas,
    init,
    mousemoveHandler,
    mouseUpHandler,
    pointMousedown,
    onSilderCopy,
    onSilderDelete,
    initLine,
    sidebarDataGroup,
};
