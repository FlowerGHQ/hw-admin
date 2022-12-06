<template>
    <!-- 
        slot="title"  可以自定义插槽
        slot= "select" 中心内容
        title: 可在外面定义title
        width:
        height:    ----- 外面可以设置
        options: checkbox的数据
    -->
    <div id="content" :style="{width:width, height:height}">             
        <div class="main">
            <div>
                <!-- 标题 -->
                <slot name="title">
                    <div class="title-line">
                       <div class="title-style">{{title}}</div> 
                    </div>                    
                </slot>
                <!-- 主要内容 -->
                <slot name="select">
                    <div class="select-config" :style="{height: contentHeight+'px'}">
                         <a-checkbox-group v-model:value="CheckGroupValue">                                                        
                                 <a-row v-if="options.length != 0">
                                    <a-col :span="24">
                                        <a-checkbox value="A">A</a-checkbox>
                                    </a-col>
                                    <a-col :span="24">
                                        <a-checkbox value="B">B</a-checkbox>
                                    </a-col>
                                    <a-col :span="24">
                                        <a-checkbox value="C">C</a-checkbox>
                                    </a-col>
                                    <a-col :span="24">
                                        <a-checkbox value="D">D</a-checkbox>
                                    </a-col>
                                    <a-col :span="24">
                                        <a-checkbox value="E">E</a-checkbox>
                                    </a-col>
                                    <a-col :span="24">
                                        <a-checkbox value="E">E</a-checkbox>
                                    </a-col>
                                    <a-col :span="24">
                                        <a-checkbox value="E">E</a-checkbox>
                                    </a-col>
                                </a-row>
                        </a-checkbox-group>
                    </div>
                </slot>
            </div>
        </div>
        <!-- 尾部 -->
        <div class="footer">
            <slot name="foot">
                <div class="foot-style">
                    <a-button type="primary" size="middle">保存</a-button>
                    <a-button type="primary" size="middle">重置</a-button>
                </div>
            </slot>
        </div>
    </div>
</template>
 
<script setup>
import { ref } from "@vue/reactivity"
import { computed, onMounted } from "@vue/runtime-core"

const props = defineProps({
    title:{
        type:String,
        default:'显示这些字段'
    },
    width:{
        type:String,
        default: '200px'
    },
    height:{
        type:String,
        default: '300px'
    },
    options: {
        type: Array,
        default: () => []
    }
})



/* data */
const CheckGroupValue = ref([])

/* computed */
// 计算中间选择内容的高度
const contentHeight = computed(() => {
    return props.height.replace(/px/g,'') - 100
})

/* methods */
onMounted(() => { })
</script>
 
<style lang='less' scoped>
/*
    定位样式可以在外面引用组件自己定位
    例  <ColumnConfiguration v-if="ConfigurationBool" class="Configuration-style"/> 
    .Configuration-style{
        position:absolute;
        top: 40px;
        bottom: 0;  
        right: 20px;   
    }

*/
#content{ 
   background-color:#ffffff;
   border: 1px solid #f0f0f0;
   border-radius: 5px;
   .title-line{        
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #f0f0f0;
        .title-style{
            padding-left: 12px;
            color: #6b778c;
            font-size: 12px;
        }
   }
   .select-config{
        width: 100%;
        height: 200px;        
        overflow-y: auto;
        padding-left: 12px;          
        .ant-checkbox-wrapper{
            height: 40px;
            line-height: 40px;
        }     
   }
   .foot-style{
        display: flex; 
        align-items: center;
        justify-content: end;
        height: 60px;
        border-top: 1px solid #f0f0f0;
   }
}
</style>  