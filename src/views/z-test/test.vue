<template>
    <div>
        <div style="display: flex;">
            <template v-for="(item, index) in arr" :key="item.id">
                <div class="drag-box" :id="index" draggable="true" @dragstart="dragStart"
                    @dragend="(event) => dragend(event, item)">
                    {{ item.name }}
                </div>
            </template>
        </div>
        <div class="time">
            <div class="item-m">
                <div v-for="(item, index) in 3" :key="index" :id="'drop-con'+index" class="drop-box" @dragover="dragOver" @drop="drop">
                    <div class="top"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';


const arr = ref([
    { id: 1, name: "门店1" },
    { id: 2, name: "门店2" },
    { id: 3, name: "门店3" },
    { id: 4, name: "门店4" },
])

/*
    在拖动目标上触发事件 (源元素):
        ondragstart - 用户开始拖动元素时触发
        ondrag - 元素正在拖动时触发
        ondragend - 用户完成元素拖动后触发

    释放目标时触发的事件:
        ondragenter - 当被鼠标拖动的对象进入其容器范围内时触发此事件
        ondragover - 当某被拖动的对象在另一对象容器范围内拖动时触发此事件
        ondragleave - 当被鼠标拖动的对象离开其容器范围内时触发此事件
        ondrop - 在一个拖动过程中，释放鼠标键时触发此事件

    
*/
const dragStart = (event) => {
    console.log('dragStart', event);
    // 设置拖拽数据
    event.dataTransfer.setData("text/plain", event.target.id);
};
const dragOver = (event) => {
    event.preventDefault(); // 阻止默认行为，使元素可放置

};
const drop = (event) => {
    event.preventDefault(); // 阻止默认行为，使元素可放置
    const data = event.dataTransfer.getData("text/plain"); // 获取拖拽数据
    console.log(data);
    const draggedElement = document.getElementById(data);
    event.target.appendChild(draggedElement); // 将拖拽元素放置到目标元素中

    var targetContainerId = event.target.id; //目标容器元素id
    // 获取拖放后的容器信息
    // var targetContainer = document.getElementById(targetContainerId);
    console.log("拖放后的容器ID：", targetContainerId, event);
}

const dragend = (event, item) => {
    console.log("完成拖动", item, event);
}
</script>

<style>
.drag-box {
    width: 100px;
    height: 100px;
    background-color: red;
    margin-bottom: 10px;
    margin-left: 10px;
}

.drop-box {
    width: 500px;
    height: 600px;
    background-color: yellow;
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
}

.top {
    width: 100%;
    height: 200px;
    background-color: blue;
}

.item-m {
    width: 100%;
    display: flex;
}
</style>
