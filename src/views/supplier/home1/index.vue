<template>
    <div class="home">
        <div class="setp-bar">
            <template v-for="(item, index) in setpObject" :key="index">            
                <div
                    class="setp-base-style setp-text"
                    :style="{ 
                        backgroundImage: 'url('+ item.bg +')',
                        color: item.text_color,
                    }"
                >
                    <SvgIcon class="icon-style" :icon-class="item.icon"/>
                    <span>{{ $t(item.t) }}</span>
                </div>
            </template>
        </div>
        <div class="body-container">
            <!-- 放你们的组件(两个组件) -->
            <!-- <xxxx v-if=""></xxxx>
            <xxxx v-else-if=""></xxxx> -->

            
            <!-- 动态组件 -->
            <component
                ref="childrenRef"
                :is="setpCountComponent"
                :isSubmit="isSubmit"
                :detail="detailObj"
                class="current-components"
                @handleComeOne="handleBackOne" />
                
            <!-- 保存草稿 -->
            <a-button @click="handleSave">
                {{
                    $t("supply-chain.save_draft")
                }}
            </a-button>
            <a-button @click="handleNext">下一步</a-button>
            <a-button @click="btn2">上一步</a-button>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import { computed, ref } from 'vue';
import SvgIcon from "@/components/MySvgIcon/index.vue";
import MyStep from "./components/steps.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
// 基础信息
import BasicInfo from "./basic-info.vue";
// 材料清单
import MaterialList from "./material-list.vue";
// 提交准入申请
import SubmitAdmissionApplication from "./submit-admission-application.vue";
// ref
const childrenRef = ref(null);


const $i18n = useI18n();
const $store = useStore();
const $t = $i18n.t;
// 步骤条
const setpObject = computed(() => {
    let result = {
        1: {
            setp: 1,
            t: 'supply-chain.basic_info',
            bg: Core.Util.Image.getImageFile('supply-chain', 'setp-base-bg'),
            icon: "setp-icon-white",
            text_color: "#FFF",
        },
        2: {
            setp: 2,
            t: 'supply-chain.material_list',
            bg: Core.Util.Image.getImageFile('supply-chain', 'setp-material-default-bg'),
            icon: "setp-icon-black",
            text_color: "#666",
        },
    }
 
    switch(setpCount.value) {
        case 1: 
            result[1].bg = Core.Util.Image.getImageFile('supply-chain', 'setp-base-bg')
            result[1].icon = "setp-icon-white"
            result[1].text_color = "#FFF"
            result[2].bg = Core.Util.Image.getImageFile('supply-chain', 'setp-material-default-bg')
            break;
        case 2: 
            result[1].bg = Core.Util.Image.getImageFile('supply-chain', 'setp-base-bg')
            result[2].bg = Core.Util.Image.getImageFile('supply-chain', 'setp-material-bg')
            result[2].icon = "setp-icon-white"
            result[2].text_color = "#FFF"
            break;
    }

    return result
})
const setpCount = ref(0) // 步骤条

const setpCountComponent = computed(() => {
    switch (setpCount.value) {
        case 0:
            return BasicInfo;
        case 1:
            return MaterialList;
        case 2:
            return SubmitAdmissionApplication;
        default:
            return BasicInfo;
    }
});
/* fetch start*/
/* fetch end*/

/* methods start*/
const btn = () => {
    
    if(setpCount.value===0){
        if(childrenRef.value.beforeSaveVisible()){
            setpCount.value++; 
            console.log("$store",$store)
            // $store的模块SUPPLY_CHAIN的dispatch方法
            $store.dispatch("SUPPLY_CHAIN/setStep",setpCount.value)

        }
        return;
    }
    setpCount.value++
    // 防止数字超出限制
    if (setpCount.value > 2) {
        setpCount.value = 2
    } 
    if (setpCount.value < 1) {
        setpCount.value = 1
    } 
}
const btn2 = () => {
    setpCount.value--
    // 防止数字超出限制
    if (setpCount.value > 2) {
        setpCount.value = 2
    } 
    if (setpCount.value < 1) {
        setpCount.value = 0
    } 
}
// 下一步
const handleNext = () => {
    if(setpCount.value===0){
        if(childrenRef.value.beforeSaveVisible()){
            setpCount.value++; 
            console.log("$store",$store)
            // $store的模块SUPPLY_CHAIN的dispatch方法
            $store.dispatch("SUPPLY_CHAIN/setStep",setpCount.value)

        }
        return;
    }
    if (setpCount.value == 2) return;
    setpCount.value++;
}
// 保存草稿
const handleSave = () => {
    console.log('childrenRef.value111',childrenRef.value)
    // 保存草稿
    childrenRef.value.saveDraft();
};
/* methods end*/
</script>

<style lang="less" scoped>
.home {
    min-height: 100vh;
    background-color: #F6F7F9;
    padding: 20px 40px;
    box-sizing: border-box;
    .setp-bar {
        display: flex;
        height: 52px;            
        line-height: 52px;
        .setp-base-style {
            width: 50%;
            background-size: 100% 100%;
        }

        .setp-text {
            text-align: center;
            font-size: 16px;
            font-weight: 500;
        }

        .icon-style {
            width: 16px;
            height: 16px;
            margin-right: 4px;
        }
    }
    .body-container {
        height: 500px;
        background-color: #FFF;
    }
}
</style>