<template>
    <div id="clue-list">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">线索</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('add')"><i class="icon i_add"/>创建用户</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-tabs v-model:activeKey="activeKey">                      
                    <a-tab-pane
                        v-for="(item, index) in tabPhoneData"
                        :key="item.key"
                        :tab="item.title"
                    >
                    </a-tab-pane>
                </a-tabs>
                <allTable :activeKey="activeKey"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from "@/core";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import allTable from './components/clue-table.vue'
const activeKey = ref(1)


const { proxy } = getCurrentInstance()
const router = useRouter()

const tabPhoneData = computed(() => {
    let result = [
        { key: 1, title: `全部(${ 10 })`, },
        { key: 2, title: `信息缺失(${ 10 })`, },
        { key: 3, title: `未分配(${ 10 })`, },
        { key: 4, title: `未跟进(${ 10 })`, },
        { key: 5, title: `已跟进(${ 10 })`, },
        { key: 6, title: `休眠(${ 10 })`, },
    ]
    return result
})

/* Fetch start */

/* Fetch end */

/* methods start */
const routerChange = (type) => {
    switch(type){
        // 创建用户
        case 'add':
            router.push({
                path: "/user-center/user-edit",
            })
        break;
    }
}
/* methods end */
</script>

<style lang="less" scoped>
</style>
