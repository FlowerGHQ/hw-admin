<template>
    <div class="supply-chain">
        <a-layout>
            <Header>header</Header>
            <Content>
                <MyStep v-model:ActiveCurrent="current" />
                <div class="content-main">
                    <!-- 动态组件 -->
                    <component :is="currentComponent" />
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
            background: #fff;
            height: 60px;
            line-height: 60px;
            padding: 0 20px;
            box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
        }
    }
}
</style>
