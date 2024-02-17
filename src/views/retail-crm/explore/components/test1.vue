<template>
    <div>
        <draggable v-model="options" :options="dragOptions">
            <div v-for="(option, index) in options" :key="option.id" class="option">
                <span class="drag-handle" @mousedown.stop></span>
                <span class="option-text">{{ option.text }}</span>
            </div>
        </draggable>
    </div>
</template>

<script>
// import draggable from 'vuedraggable';
import { VueDraggableNext } from 'vue-draggable-next';

export default {
    components: {
        draggable: VueDraggableNext,
    },
    data() {
        return {
            options: [
                { id: 1, text: 'Option 1' },
                { id: 2, text: 'Option 2' },
                { id: 3, text: 'Option 3' },
                { id: 4, text: 'Option 4' },
            ],
            dragOptions: {
                handle: '.drag-handle', // 拖拽手柄的选择器
            },
        };
    },
};
</script>

<style>
.option {
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
}

.drag-handle {
    width: 20px;
    height: 20px;
    background-color: #ccc;
    cursor: move;
    margin-right: 10px;
}

.option-text {
    flex: 1;
}
</style>
