<template>
    <div class="item-bom">
        <div class="list-container item-container">
            <div class="title-container">
                <div class="title-area">{{ $t("item-bom.title") }}</div>
            </div>

            <div class="item-tree">            
                <!-- 左边 -->
                <div class="item-tree-left">
                    
                </div>
                <!-- 右边 -->
                <div class="item-tree-right">
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
.item-bom {
    width: 100%;
    height: 100%;
    .item-container {
        height: 100%;        
    }
    .item-tree {
        width: 100%;
        height: 100%;
        display: flex;
        .item-tree-left {
            min-width: 250px;
            max-width: 300px;
            height: 100%;
            background-color: red;
        }
        .item-tree-right {
            flex: 1;
            height: 100%;
            background-color: blue;
        }
    }
}
</style>