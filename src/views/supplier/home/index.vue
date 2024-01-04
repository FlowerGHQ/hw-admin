<template>
    <div class="supply-chain">
        <a-layout>
            <Header>header</Header>
            <Content>
                <MyStep v-model:ActiveCurrent="current" />
                <div class="content-main">
                    <!-- 动态组件 -->
                    <component :is="currentComponent"  class="current-components"/>
                </div>
                <div class="supply-chain-footer" v-if="current != 2">
                    <!-- 保存草稿 -->
                    <a-button @click="handleSave">保存草稿</a-button>
                    <a-button
                        type="primary"
                        @click="handleNext"
                        v-if="current == 0"
                        >下 一步</a-button
                    >
                    <!-- 上一步 -->
                    <a-button @click="handleBack" v-if="current == 1"
                        >上一步</a-button
                    >
                    <!-- 提交 -->
                    <a-button
                        type="primary"
                        @click="handleSubmit"
                        v-if="current == 1"
                        >提交申请</a-button
                    >
                </div>
            </Content>
        </a-layout>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import MyStep from "./components/steps.vue";
// 基础信息
import BasicInfo from "./basic-info.vue";
// 材料清单
import MaterialList from "./material-list.vue";
// 提交准入申请
import SubmitAdmissionApplication from "./submit-admission-application.vue";
const currentComponent = computed(() => {
    switch (current.value) {
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
// 步骤条
const current = ref(1);

// 下一步
const handleNext = () => {
    if (current.value == 2) return;
    current.value++;
};
// 上一步
const handleBack = () => {
    if (current.value == 0) return;
    current.value--;
};
// 提交
const handleSubmit = () => {
    handleNext();
};
</script>

<style lang="less" scoped>
.supply-chain {
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;
    :deep(.ant-layout) {
        flex: 1;
        header{
            height: 80px;
            border-bottom: 1px solid  #E5E6EB;
            background: linear-gradient(0deg, #FFF 0%, #FFF 100%), #F6F7F9;
        }
        content{
            flex: 1;
            padding: 20px 40px 20px 40px;
            position: relative;
            overflow: auto;
            .content-main {
                height: calc(100% - 80px - 68px - 15px);
                margin-top: 15px;
                overflow: auto;
                // 滚动条样式
                &::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                &::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background: #C0C4CC;
                }
                &::-webkit-scrollbar-track {
                    border-radius: 10px;
                    background: #F2F3F5;
                }
                .current-components{
                    height: 100%;
                }
            }
            .supply-chain-footer{
                    display: flex;
                    height: 68px;
                    width: calc(100% - 60px);
                    padding: 18px 0px;
                    justify-content: center;
                    align-items: center;
                    flex-shrink: 0;
                    border-top: 1px solid  #F2F3F5;
                    background: #FFF;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    margin-left: 20px;
                    margin-right: 40px;
            }
        }
    }
}
</style>
