<template>
<div class="custom-tabs">
    <div class="eos-tabs-style">    
        <slot name="tab">
            <template v-for="item in tabsList" :key="item.key">
                <div class="tabs-item" :class="{tabsItemActive: item.key == activeKey}" @click="onClick(item.key)">{{ item.value }}</div>        
            </template>            
        </slot>       
    </div>
    <div class="custom-slot-default">
        <slot></slot>    
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({    
    activeKey:{
        type: Number,
        default: 1
    },
    // 渲染tabs数据
    tabsList:{
        type: Array || Object,
        default: () => []
    }
})

const emits = defineEmits(['update:activeKey']) 
const onClick = ($1) => {      
    emits("update:activeKey", $1)
}
</script>

<style lang="less" scoped>
.eos-tabs-style{
    display: inline-flex;
    background-color:#f5f5f5;
    padding: 5px 5px;
    cursor: pointer;
    .tabs-item{        
        padding: 0 8px;   
        color: #6a6a6a;     
    }
    .tabsItemActive{
        background-color: #ffffff;
        color: #2f88f9;
    }
}
.custom-slot-default{
    margin-top: 10px;
}
</style>