<template>
    <a-modal v-model:visible="isShow" 
        :title="$t('crm_st.add_peo')" 
        :okText="$t('def.save')"
        @ok="handleOk"
        @cancel="handleCancel" >
        <div class="box-model">
            <a-input v-model:value="userName" placeholder="Basic usage">
                <template #prefix>
                    <search-outlined :style="{ fontSize: '16px' }" />
                </template>              
            </a-input>
            <!-- 选好的人员 -->
            <div class="tag-box">
                <template v-for="(item,index) in selectList" :key="index">
                    <a-tag color="processing">
                        <img class="tag-box-img" src="https://img1.baidu.com/it/u=1502675700,2100106106&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750" alt="">
                        <span>李鹏程</span>                
                        <span class="cha" @click="onClose(item,index)">×</span>
                    </a-tag>
                </template>
            </div>
            <!-- 飞书的人员 -->
            <div class="per-box">
                <div class="person" v-for="(item,index) in fsListComput" :key="index">
                    <div class="left">
                        <img class="img" :src="item.avatar">
                    </div>
                    <div class="middle">
                        <span>{{ item.name }}</span>
                        <span>杭州研发中心 | 杭州研发中心 | 杭州研发中心</span>
                    </div>

                    <div class="right">
                        <span v-if="item.isTick" class="tick-img">
                            <img class="img" src="~@/assets/images/retail/tick.png" alt="">
                        </span>
                        <span v-else class="add cursor" @click="onAdd(item)">添加</span>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script setup>

import Core from '@/core';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons-vue';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
})

const emits = defineEmits(['update:isShow'])

const userName = ref("") // 搜索用户名称
const selectList = ref([]) // 选中的人员数组
const fsList = ref(
    [
        {
            id:1, 
            name:"十安1", 
            avatar:"https://img1.baidu.com/it/u=1502675700,2100106106&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750",
            isTick: false,
        },
        {
            id:2, 
            name:"十安2", 
            avatar:"https://img1.baidu.com/it/u=1502675700,2100106106&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750",
            isTick: false,
        },
        {
            id:3, 
            name:"十安3", 
            avatar:"https://img1.baidu.com/it/u=1502675700,2100106106&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750",
            isTick: false,
        },
    ]
) // 飞书的人员计算属性
const fsListComput = computed(() => {
    let result = []
    result = fsList.value.map($1 => {
        const bool = selectList.value.find(el => {
            return el.id == $1.id
        })
        if(bool){
            $1.isTick = true           
        }else{
            $1.isTick = false            
        }
        return {
            ...$1
        }
    })
    console.log("fsListComput", result);
    return result
})

onMounted(() => {

})
/* fetch start*/

/* fetch end*/

// methods
// tag close 删除
const onClose = (item,index) => {
    selectList.value.splice(index,1)
}

// 添加
const onAdd = (item) => {
    selectList.value.push(item)
}
// 确定
const handleOk = () => {
}
// 取消
const handleCancel = () => {
    emits('update:isShow', false)    
}
</script>

<style lang="less" scoped>
.tag-box {
    margin-top: 20px;
    .ant-tag-processing {
        color: var(--color-text-1, #1D2129);
        border-radius: 24px;
        border: none;
        height: 28px;
        background-color: var(--color-fill-2, #F2F3F5);
        padding-left: 2px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 28px;
        vertical-align: top;
        display: inline-flex;
        align-items: center;
        margin-bottom: 12px;

        .cha:hover {
            background-color: #FFFFFF;
            color: #006EF9;
            border-radius: 50%;
        }

    }

    .tab-uncheck .ant-tag-processing {
        border: #EDF2F5 0.5px solid;
        border-radius: 4px;
        height: 28px;
        background: #EDF2F5;
        color: #1E2023;


        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 28px;
        vertical-align: top;
        margin-top: 0px;

    }

    .cha {
        background-color: var(--color-fill-2, #F2F3F5);
        height: 16px;
        width: 16px;
        font-size: 16px;
        display: inline-block;
        line-height: 16px;
        text-align: center;
        font-weight: 800;
        border-radius: 50%;
        margin-left: 4px;
        color: rgba(201, 205, 212, 1);
        cursor: pointer;
    }

    .tag-name {
        display: inline-block;
        background-color: red;
        color: #FFFFFF;
        border-radius: 50%;
        height: 24px;
        width: 24px;
        margin-right: 5px;
        padding: 0px 2px;
        font-size: 10px;
    }

    .tag-box-img{
        width: 24px;
        height: 24px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 4px;
    }
}

.per-box {
    width: 100%;
    .person {
        display: flex;
        height: 56px;
        padding: 8px 0px;
        box-sizing: border-box;
        margin-top: 12px;

        .left {           
            .img{
                width: 40px;
                height: 40px;
                object-fit: cover;
                border-radius: 50%;
            }
        }

        .middle {
            display: flex;
            flex: 1;
            flex-direction: column;
            box-sizing: border-box;
            justify-content: space-between;
            padding: 0px 12px;

            & span:nth-child(1) {
                color: var(--color-text-1, #1D2129);
                font-family: PingFang SC;
                font-size: 14px;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
            }

            & span:nth-child(2) {
                color: var(--color-text-3, #86909C);
                font-family: PingFang SC;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
        }

        .right {
            line-height: 40px;

            .add {                
                height: 30px;
                width: 36px;
                line-height: 30px;
                text-align: center;
                display: inline-block;
                background-color: var(--color-fill-2, #F2F3F5);
                font-size: 14px;
                border-radius: 2px;
                color: var(--brand-6, #0061FF);
            }   
            .img{
                display: inline-block;
                width: 24px;
                height: 24px; 
            }     
        }
    }
}

.box-model {
    max-height: 360px;
    overflow: auto;
    padding: 0px 10px;
}

.box-model::-webkit-scrollbar {
    width: 4px;
}

.box-model::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
}
</style>