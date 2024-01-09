<template>
    <!-- 
        activeKey v-model 选中哪个值 示例 v-model:activeKey="activeKey1"
     -->
    <div id="products-card">
        products-card
    </div>
</template>

<script setup>
import { ref ,onMounted} from 'vue';

const props = defineProps({  
    // v-model 绑定值  
    activeKey:{
        type: [Number,String],        
    },
})

const emits = defineEmits(['update:activeKey','handlechange']) 
const onClick = ($1) => {      
    emits("update:activeKey", $1)
    emits("handlechange", $1)
}
onMounted(() => {})
</script>

<style lang="less" scoped>
#products-card {

}
</style>