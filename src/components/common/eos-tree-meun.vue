<template>
    <!-- 左侧目录树 -->
    <div class="tree_meun_style">
        <template v-for="(item,index) in gData" :key="item.key">            
            <div class="one_directory" @click="onOneDirectoryEvent(index)">{{ item.title }}</div>
            <Transition name="bounce">            
                <a-tree
                    v-if="index == IsTwoTree"
                    :tree-data="item.children"                
                >         
                </a-tree>
            </Transition>
            
        </template>        
    </div>
</template>

<script setup>
import { defineComponent, ref, watch } from 'vue';
const gData = ref([
    {
        title: '一级目录',
        key: '1',
        children: [
          {
            title: 'parent 1-0',
            key: '0-0-0',
            children: [
              {
                title: 'leaf',
                key: '0-0-0-0',
              },
              {
                title: 'leaf',
                key: '0-0-0-1',
              },
              {
                title: 'leaf',
                key: '0-0-0-2',
              },
            ],
          },
          {
            title: 'parent 1-1',
            key: '0-0-1',
            children: [
              {
                title: 'leaf',
                key: '0-0-1-0',
              },
            ],
          },          
        ],
    },
    {
        title: '一级目录',
        key: '2',
        children: [
          {
            title: 'parent 1-0',
            key: '0-0-0',
            children: [
              {
                title: 'leaf',
                key: '0-0-0-0',
              },
              {
                title: 'leaf',
                key: '0-0-0-1',
              },
              {
                title: 'leaf',
                key: '0-0-0-2',
              },
            ],
          },
          {
            title: 'parent 1-1',
            key: '0-0-1',
            children: [
              {
                title: 'leaf',
                key: '0-0-1-0',
              },
            ],
          },          
        ],
    },
])
const IsTwoTree = ref(null)
/* methods */ 
const onOneDirectoryEvent = ($1) => {
    IsTwoTree.value = $1
}
</script>

<style lang="less" scoped>
.tree_meun_style{
    .one_directory{
        height: 35px;
        line-height: 35px;
        padding-left: 15px;
        background-color: #006ef9;
        color: #fff;
    }
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>