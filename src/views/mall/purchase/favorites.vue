<template>
    <div id="favorites">
        <div class="content">
            <div class="title">
                {{ $t('mall.Favorites') }}
            </div>
            <div class="body" v-if="list.length > 0">
                <div class="list-body">
                    <div class="list-item" v-for="(child, index) in listRender" :key="child.item_id">
                        <ProductsCard canRemoveFavorites :record="child" @handlechange="getCarList({}, true)" />
                    </div>
                </div>
            </div>
            <a-empty :description="null" v-else />
            <div class="loading">
                <down-loading class="loading" :show="spinning" />
            </div>
        </div>
    </div>
</template>

<script setup>
import ProductsCard from '../components/ProductsCard.vue';
import DownLoading from '../components/DownLoading.vue';
import Core from '@/core';
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue';

/* state start */
const spinning = ref(false);
const pagination = reactive({
    page_size: 20,
    page: 1,
    total: 0,
    total_page: 0,
});
const list = ref([]);
const favoriteListFetch = Core.Api.Favorite.list;
/* state end */

onMounted(() => {
    getData();
    window.addEventListener('scroll', handleScroll);
});
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});

/* computed start */
const listRender = computed(() => {
    return list.value.map(item => {
        delete item['item'].id;
        return {
            ...item,
            ...item['item'],
        };
    });
});
/* computed end */

/* methods start */
// 获取数据
const getData = () => {
    getCarList();
};
const handleScroll = () => {
    // 因为存在子组件路由所以判断只在父路由时执行
    const footerHeight = document.querySelector('#mall-footer').clientHeight;
    const html = document.documentElement;
    Core.Util.handleScrollFn(html, getCarList, pagination, spinning.value, footerHeight);
};
const resetFn = () => {
    list.value = [];
    Object.assign(pagination, {
        page_size: 20,
        page: 1,
        total: 0,
        total_page: 0,
    });
};
/* methods end */

/* fetch start */
const getCarList = (q, reset = false) => {
    if (reset) resetFn();
    spinning.value = true;
    const params = {
        page: pagination.page,
        page_size: pagination.page_size,
    };
    Object.assign(params, q);
    favoriteListFetch({ ...params })
        .then(res => {
            list.value = list.value.concat(res?.list);
            pagination.total = res.count;
            pagination.total_page = Math.ceil(pagination.total / pagination.page_size);
        })
        .finally(() => {
            spinning.value = false;
        });
};
/* fetch end */
</script>

<style lang="scss" scoped src="../css/layout.css"></style>
<style lang="less" scoped>
#favorites {
    .content {
        .body {
            .list-body {
                margin-bottom: 40px;

                .list-body-title {
                    color: #000;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    margin-bottom: 16px;
                }

                .list-item {
                    margin-bottom: 24px;
                }
            }
        }

        .loading {
            margin-top: 20px;
        }
    }
}
</style>
