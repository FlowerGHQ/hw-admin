<template>
    <!-- 
		左侧目录树 样式可在仓库管理-仓库详情查看
		gData 渲染数据  结构 看下	
	 -->
    <div class="tree_meun_style">
        <template v-for="(item, index) in gData" :key="item.key">
            <div
                class="one_directory"
                :class="{ oneDirectoryActive: index == IsTwoTree }"
                @click="onOneDirectoryEvent(index)"
            >
                {{ item.title }}
            </div>
            <Transition>
                <div v-if="IsTwoTree == index">
                    <a-tree :tree-data="item.children">
                        <template #switcherIcon="{ switcherCls }">
                            <div class="customIcon">
                                <down-outlined :class="switcherCls" />
                            </div>
                        </template>
                    </a-tree>
                </div>
            </Transition>
        </template>
    </div>
</template>

<script setup>
import { DownOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref, watch } from 'vue';

const props = defineProps({
    // 渲染数据
    gData: {
        type: Object,
        default: () => {},
    },
});
// 默认结构
// const gData = ref([
//     {
//         title: '一级目录',
//         key: '1',
//         children: [
//           {
//             title: 'parent 1-0',
//             key: '0-0-0',
//             children: [
//               {
//                 title: 'leaf',
//                 key: '0-0-0-0',
//               },
//             ],
//           },
//         ],
//     },
// ])
const IsTwoTree = ref(null);

/* methods */
const onOneDirectoryEvent = $1 => {
    if (IsTwoTree.value !== $1) {
        IsTwoTree.value = $1;
    } else {
        IsTwoTree.value = null;
    }
};
</script>

<style lang="less" scoped>
.tree_meun_style {
    .one_directory {
        height: 35px;
        line-height: 35px;
        padding-left: 15px;
    }
    .oneDirectoryActive {
        background-color: #006ef9;
        color: #fff;
    }
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.customIcon {
    .ant-tree-switcher-icon {
        background-color: #f2f7fe;
        width: 14px;
        height: 14px;
        font-size: 12px;
        color: #87bbfc;
    }
}
</style>
