<template>
    <div>
        <div>
            <div
                v-for="(item, index) in itemList"
                :key="index"
                @contextmenu.prevent="showContextMenu(item, index, $event)"
            >
                {{ item.name }}
            </div>
        </div>
        <!-- 右键弹框 -->
        <div
            v-if="contextMenuVisible"
            class="custom-context-menu"
            :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }"
        >
            <div>
                <div @click="renameItem">重命名</div>
                <div @click="deleteItem">删除</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            itemList: [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }],
            contextMenuVisible: false,
            contextMenuX: 0,
            contextMenuY: 0,
            selectedItemIndex: null,
        };
    },
    methods: {
        showContextMenu(item, index, event) {
            this.contextMenuVisible = true;
            this.contextMenuX = event.clientX;
            this.contextMenuY = event.clientY;
            this.selectedItemIndex = index;
        },
        renameItem() {
            this.hideContextMenu();
        },
        deleteItem() {
            this.hideContextMenu();
        },
        hideContextMenu() {
            this.contextMenuVisible = false;
            this.selectedItemIndex = null;
        },
    },
};
</script>

<style>
.custom-context-menu {
    position: absolute;
    background-color: #bfa;
    border: 1px solid #ccc;
    padding: 5px;
}
</style>
