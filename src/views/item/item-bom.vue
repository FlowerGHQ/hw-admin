<template>
    <div class="item-bom">
        <div class="list-container item-container">
            <div class="title-container" ref="titleRefs">
                <div class="title-area">{{ $t("item-bom.title") }}</div>
            </div>

            <div class="item-tree" :style="{ height: 'calc(100% - ' + titleHeight + ')' }">            
                <!-- 左边 -->
                <div class="item-tree-left">
                    
                </div>
                <!-- 右边 -->
                <div class="item-tree-right">
                    <div class="search-content">
                        
                    </div>
                    <component :is="componentName"></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, shallowRef, onMounted } from 'vue';
import fittings from './components/item-bom/Fittings.vue'

const componentName = shallowRef(fittings)
// 标题高度
const titleRefs = ref(null)
const titleHeight = ref(0)
onMounted(() => {
    titleHeight.value = titleRefs.value.offsetHeight + 'px'
    console.log("高度", titleHeight.val);
})
/* methods */
// 组件切换
const compChange = () => {

}

</script>

<style lang="less" scoped>
.item-bom {
    width: 100%;
    height: 100%;
    .item-container {
        height: 100%;        
        .item-tree {     
            width: 100%;
            display: flex;
            padding: 0 20px;
            box-sizing: border-box;
            .item-tree-left {
                min-width: 454px;
                height: 100%;
                background-color: #F8FAFC;
            }
            .item-tree-right {
                width: calc(100% - 454px);
                overflow-y: auto;
                padding: 0 17px;
                .search-content {
                    width: 100%;
                    height: 100px;
                    margin-bottom: 16px;
                    background-color: #F7F8FA;
                }
            }
        }
    }
}
</style>