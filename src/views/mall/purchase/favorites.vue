<template>
    <div id="favorites">
        <div class="content">
            <div class="title">
                {{ $t('purchase.my_favorites') }}
            </div>
            <div>
                <ProductsCard />
            </div>
        </div>
        <DownLoading class="loading" :show="loading"/>
    </div>
</template>

<script setup>
import DownLoading from '../components/DownLoading.vue';
import ProductsCard from '../components/ProductsCard.vue';
import Core from '@/core';
import { ref, reactive, onMounted } from 'vue';

const footerHeight = ref(0)
const loading = ref(false)
const pagination = reactive({
    page_size: 32,
    page: 1,
    total: 0,
    total_page: 0
})

onMounted(() => {
    initScrollData()
})
// 获取数据
const getData = () => {
    console.log('getData')
}
// 触发下拉滚动
const initScrollData = () => {
    footerHeight.value = document.querySelector('#mall-footer').clientHeight
    const html = document.documentElement
    Core.Util.handleScrollFn(html, getData, pagination, loading.value, footerHeight.value)
}
</script>

<style lang="less" scoped>
#favorites {
    .content {
        padding: 80px 0;
        margin: 0 auto;
        width: 75%;
        .title {
            color: #000;
            font-family: Montserrat;
            font-size: 24px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
    }
}
</style>