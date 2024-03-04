import { computed, ref } from 'vue';
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
    itemIndex: undefined,
    childNodeIndex: undefined, // 子节点的index
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

// 初始化
const init = (arr, urlImg) => {
    ctx = exploreCanvas.value.getContext('2d');

    const isImg = document.querySelector('#cavnasImg');
    const pointContain = document.querySelector('.point-contain');
    const Canvas = document.querySelector('#exploreCanvas');

    if (isImg) {
        // 删除上一个Img
        pointContain.removeChild(isImg);
    }

    const img = document.createElement('img');
    img.src = urlImg;
    img.setAttribute('id', 'cavnasImg');
    img.setAttribute('width', '544px');
    img.setAttribute('height', '377px');
    pointContain.insertBefore(img, Canvas);

    // 第一次进来 初始化
    img.onload = () => {
        console.log('图片加载完成');
        setCanvasAttr(img.width, img.height);
        initLine(arr);
    };
    img.onerror = () => {
        console.log('图片加载失败');
    };
};
// 容器内鼠标移动
const mousemoveHandler = e => {
    if (!moveParams.value.isMove) return;

    if (moveParams.value.moveType === 'start_point') {
        pointerList.value[moveParams.value.moveIndex][moveParams.value.moveType][moveParams.value.itemIndex].x =
            e.offsetX;
        pointerList.value[moveParams.value.moveIndex][moveParams.value.moveType][moveParams.value.itemIndex].y =
            e.offsetY;
        console.log('结果 start_point', pointerList.value);
    } else if (moveParams.value.moveType === 'end_point') {
        pointerList.value[moveParams.value.moveIndex][moveParams.value.moveType][moveParams.value.itemIndex].x =
            e.offsetX;
        pointerList.value[moveParams.value.moveIndex][moveParams.value.moveType][moveParams.value.itemIndex].y =
            e.offsetY;
        console.log('结果 end_point', pointerList.value);
    } else if (moveParams.value.moveType === 'child_node') {
        // 子节点
        pointerList.value[moveParams.value.moveIndex]['start_point'][moveParams.value.itemIndex][
            moveParams.value.moveType
        ][moveParams.value.childNodeIndex].x = e.offsetX;
        pointerList.value[moveParams.value.moveIndex]['start_point'][moveParams.value.itemIndex][
            moveParams.value.moveType
        ][moveParams.value.childNodeIndex].y = e.offsetY;
    }

    console.log('mousemoveHandler', pointerList.value);
    window.requestAnimationFrame(() => {
        canvasLine(ctx);
    });
};
// 容器内松开
const mouseUpHandler = () => {
    console.log('松开');
    moveParams.value.isMove = false;
    moveParams.value.moveIndex = undefined;
    moveParams.value.moveType = undefined;
    moveParams.value.itemIndex = undefined;
};
// points 鼠标按下
const pointMousedown = (index, type, itemIndex, childNodeIndex) => {
    console.log('按下', index, type, itemIndex);
    moveParams.value.isMove = true;
    moveParams.value.moveIndex = index;
    moveParams.value.moveType = type;
    moveParams.value.itemIndex = itemIndex;
    moveParams.value.childNodeIndex = childNodeIndex;
    console.log('moveParams', moveParams.value);
};
// 设置canvas的大小
const setCanvasAttr = (width, height) => {
    if (width > 800 || height > 800) {
        // let rate = width / height;
        // console.log("rate", rate);

        // exploreCanvas.value.width = rate >= 1 ? 800 : (width / height) * 800;
        // exploreCanvas.value.height = rate >= 1 ? 800 : (height / width) * 800;
        exploreCanvas.value.width = width;
        exploreCanvas.value.height = height;
    } else {
        exploreCanvas.value.width = width;
        exploreCanvas.value.height = height;
    }
};

// 画线
const canvasLine = ctx => {
    clearCanvas(ctx);

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1890ff';
    console.log('canvasLine', pointerList.value);
    pointerList.value.forEach($1 => {
        let start = $1.start_point;
        let end = $1.end_point;

        start.forEach(($2, i2) => {
            ctx.moveTo($2.x, $2.y);
            ctx.lineTo(end[i2].x, end[i2].y);
            ctx.stroke();

            if ($2?.child_node?.length) {
                // 有子节点的时候也渲染
                $2.child_node.forEach(node => {
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(end[i2].x, end[i2].y);
                    ctx.stroke();
                });
            }
        });
    });
};

// 清除画布
const clearCanvas = ctx => {
    ctx.clearRect(0, 0, exploreCanvas.value.width, exploreCanvas.value.height);
};

// 将侧边栏过滤成组的形势
const sidebarDataGroup = computed(() => {
    // console.log("将侧边栏过滤成组的形势 sidebarData", sidebarData.value); // [ [], [], []]

    const arrIndex = [];
    sidebarData.value.forEach($1 => {
        const i = arrIndex.findIndex($2 => $2 === $1.index);
        if (i === -1) {
            arrIndex.push($1.index);
        }
    });

    const filteredData = arrIndex.reduce((result, el) => {
        const itemArr = sidebarData.value.filter(item => item.index === el);

        result.push(itemArr);

        return result;
    }, []);

    console.log('将侧边栏过滤成组的形势', filteredData); // [ [], [], []]
    return filteredData.length > 0 ? filteredData : [];
});
// 复制silder
const onSilderCopy = (item, index, type) => {
    console.log('item', item, 'index', index);

    console.log('sidebarData', sidebarData.value);

    console.log('pointerList', pointerList.value);

    switch (type) {
        case 'node':
            // 画图数据
            const pointerDatas = pointerList.value.find(el => el.index === item.index);
            pointerDatas.start_point.push({
                x: 0,
                y: 100,
            });
            pointerDatas.end_point.push({
                x: 0,
                y: 0,
                label: sidebarData.value[sidebarData.value.length - 1].label + 1, // 标识 点击侧边栏
            });

            // 侧边栏数据
            sidebarData.value.push({
                label: sidebarData.value[sidebarData.value.length - 1].label + 1, // 标识 点击侧边栏
                target_id: item.target_id,
                index: item.index,
                x: 0,
                y: 100,
                child_node: [],
            });
            break;
        case 'child_node':
            // 需改的是侧边栏里面的
            const lg = item['child_node']?.length || 0;
            // 防止数据里面的child_node为空
            item.child_node = item.child_node?.length ? item.child_node : [];
            if (lg === 0) {
                // 为空的话
                item['child_node'].push({
                    x: item.x + 10,
                    y: item.y + 10,
                });
            } else {
                item['child_node'].push({
                    x: item.child_node[lg - 1]?.x + 10,
                    y: item.child_node[lg - 1]?.y + 10,
                });
            }

            // 数据修改重新画线
            const pointerDatasChild = pointerList.value.find(el => el.index === item.index);
            pointerDatasChild.start_point[index].child_node = item.child_node;
            break;
    }

    canvasLine(ctx);
};
// 删除silder
const onSilderDelete = (item, index, type, childIndex) => {
    console.log('item', item, 'index', index, childIndex);

    console.log('sidebarData', sidebarData.value);
    console.log('pointerList', pointerList.value);

    switch (type) {
        case 'node':
            // 侧边栏删除数据
            let count = 0;
            sidebarData.value.forEach((el, i) => {
                if (el.index === item.index) {
                    count++;
                    if (count === index + 1) {
                        // 因为展示的时候和数据的位置不一样，需要判断相同的 item.index 中在哪个位置
                        sidebarData.value.splice(i, 1);
                    }
                }
            });

            // 画图数据(删除数据)
            const pointerDatas = pointerList.value.find(el => el.index === item.index);
            pointerDatas.start_point.splice(index, 1);
            pointerDatas.end_point.splice(index, 1);

            break;
        case 'child_node':
            // 侧边栏数据 || 画图数据(联动的)
            let count_node = 0;
            sidebarData.value.forEach((el, i) => {
                if (el.index === item.index) {
                    count_node++;
                    if (count_node === index + 1) {
                        // console.log("k", childIndex, el);
                        el.child_node.splice(childIndex, 1);
                    }
                }
            });
            break;
    }
    canvasLine(ctx);
};
// 初始化数据和画线
const initLine = data => {
    console.log('初始化数据和画线', data);
    pointerList.value = data;
    sidebarData.value = [];

    canvasLine(ctx);

    // 侧边栏数据
    sidebarData.value = sidebarDataFilter(pointerList.value);

    console.log('sidebarData', sidebarData.value);
};
// 过滤silder数据
const sidebarDataFilter = arr => {
    const result = [];
    let count = 1; // count和count1需要同步的相同后期要用，当然 start_point end_point 对应的个数也是一一对应的
    let count1 = 1;
    arr.forEach($1 => {
        $1.start_point.forEach($2 => {
            result.push({
                target_id: $1.target_id, // 标识 点击侧边栏
                label: count++, // 标识 点击侧边栏
                index: $1.index,
                x: $2.x,
                y: $2.y,
                child_node: $2.child_node?.length ? $2.child_node : [],
            });
        });

        $1.end_point.forEach($2 => {
            $2.label = count1++; // 用来表格标识显示样式
        });
    });

    return result;
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

// 最后的结构
// [
//     {
//         start_point: [ { x: 0, y: 0, child_node: [] }],
//         end_point: [ { x: 0, y: 0 }]
//     }
// ]
