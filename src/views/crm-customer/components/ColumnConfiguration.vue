<template>
    <!-- 
        slot="title"  可以自定义插槽
        slot= "select" 中心内容
        title: 可在外面定义title
        width:
        height:    ----- 外面可以设置
        options: checkbox的数据
    -->
    <div id="content" :style="{ width: width, height: height }">
        <div class="main">
            <div>
                <!-- 标题 -->
                <!-- <slot name="title">
                    <div class="title-line">
                        <div class="title-style">{{ title }}</div>
                    </div>
                </slot> -->
                <!-- 主要内容 -->
                <slot name="select">
                    <div class="select-config" :style="{ height: contentHeight + 'px' }">
                        <a-checkbox-group v-model:value="CheckGroupValue" @change="handleCheckChange">
                            <a-row v-if="options.length != 0">
                                <a-col :span="24" v-for="item in checkBoxOptions">
                                    <a-checkbox v-if="item.key !== 'operation'" :value="item.dataIndex">{{
                                        $t(item.title)
                                    }}</a-checkbox>
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
                    <a-button type="default" size="small" @click="resetCheck">重置</a-button>
                    <a-button class="btn-mr" type="primary" size="small" @click="submitCheck">保存</a-button>
                </div>
            </slot>
        </div>
    </div>
</template>

<script setup>
import { ref } from '@vue/reactivity';
import { computed, onMounted } from '@vue/runtime-core';

const props = defineProps({
    title: {
        type: String,
        default: '显示这些字段',
    },
    width: {
        type: String,
        default: '240px',
    },
    height: {
        type: String,
        default: '300px',
    },
    options: {
        type: Array,
        default: () => [],
    },
    dataOptions: {
        type: Array,
        default: () => [],
    },
});

const emits = defineEmits(['configOptions']);

/* data */
const CheckGroupValue = ref([]);
/* 多选选项数组 */
const checkBoxOptions = ref([]);

const isCheckOptions = ref([]);
/* computed */
// 计算中间选择内容的高度
const contentHeight = computed(() => {
    return props.height.replace(/px/g, '') - 60;
});

// 选项改变的回调
function handleCheckChange() {
    console.log('CheckGroupValue:', CheckGroupValue.value);
}

// 保存配置
function submitCheck() {
    props.options.forEach(e => {
        CheckGroupValue.value.forEach(v => {
            if (v === e.dataIndex) {
                isCheckOptions.value.push(e);
            }
        });
        if (e.key == 'operation') {
            isCheckOptions.value.push(e);
        }
    });
    emits('configOptions', isCheckOptions.value);
}

// 重置配置
function resetCheck() {
    // checkBoxOptions.value.forEach( val =>{
    //     if(val.key !== 'operation'){
    //         CheckGroupValue.value.push(val.dataIndex)
    //     }
    // })
    CheckGroupValue.value = [];
    console.log('CheckGroupValue', CheckGroupValue.value);
}

/* methods */
onMounted(() => {
    console.log('options', props.options);
    checkBoxOptions.value = props.options;
    console.log('props.dataOptions', props.dataOptions);
    if (props.dataOptions.length) {
        props.dataOptions.forEach(item => {
            CheckGroupValue.value.push(item.dataIndex);
        });
    } else {
        props.options.forEach(val => {
            CheckGroupValue.value.push(val.dataIndex);
        });
    }
    console.log('CheckGroupValue.value', CheckGroupValue.value);
});
</script>

<style lang="less" scoped>
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
#content {
    background-color: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 5px;

    .title-line {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #f0f0f0;

        .title-style {
            padding-left: 12px;
            color: #6b778c;
            font-size: 12px;
        }
    }

    .select-config {
        width: 100%;
        height: 200px;
        overflow-y: auto;
        padding-left: 12px;

        .ant-checkbox-wrapper {
            height: 40px;
            line-height: 40px;
            margin: 0;
        }
    }

    .foot-style {
        display: flex;
        align-items: center;
        justify-content: end;
        height: 60px;
        border-top: 1px solid #f0f0f0;
        .btn-mr {
            margin-right: 20px;
        }
    }
}
</style>
