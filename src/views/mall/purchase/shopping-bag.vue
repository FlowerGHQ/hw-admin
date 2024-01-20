<template>
    <div id="shopping-bag">
        <div class="content">
            <div class="title">
                {{ $t('purchase.search_results') }}
            </div>
            <a-spin tip="Loading..." :spinning="spinning">
                
            </a-spin>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import { ref, reactive, onMounted, computed, watch, getCurrentInstance, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const store = useStore();
const key = route.query?.key;
store.commit('setMallKey', key);

/* state start */
const spinning = ref(false)
/* state end */

/* computed start */
const lang = computed(() => {
    return store.state.lang
})
/* computed end */

/* watch start */
/* watch end */

onMounted(() => {
    getData()
})

/* methods start */
// 获取数据
const getData = () => {
    getCarList()
}
// 回到顶部
const back2Top = () => {
    setTimeout(() => {
        window.scrollTo(0,0)
    }, 0);
}
/* methods end */

/* fetch start */
const getCarList = () => {
    spinning.value = true
    searchForm.search_for = searchKey
    const params = searchForm
    searchListFetch({ ...params }).then(res => {
        list.value = res?.merge_maps.list
        listNews.value = res?.post_list.list
        back2Top()
        // listNews.value = [
        //     {
        //         img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
        //         topic: 'Technology expands the limits of human potential!',
        //         description: 'Technology ushers us into a brighter, more advanced, and sustainable future. Empowering human potential, it expands and forges entirely new lifestyles.',
        //         banner: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/d8562871bef69bb43a274c669f50bf50c75ab750c0ba88576f430bdd2eff07b9.png',
        //         create_time: 1699250556,
        //     }
        // ]
    }).finally(() => {
        spinning.value = false
    })
}
/* fetch end */
</script>

<style lang='scss' scoped src='../css/layout.css'></style>
<style lang="less" scoped>
#shopping-bag {
}
</style>