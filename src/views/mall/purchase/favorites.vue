<template>
    <div id="favorites">
        <div class="content">
            <div class="title">
                {{ $t('mall.Favorites') }}
            </div>
            <a-spin tip="Loading..." :spinning="spinning">
                <div class="body" v-if="list.length > 0">
                    <div class="list-body">
                        <div class="list-item" v-for="(child, index) in listRender" :key="child.item_id">
                            <ProductsCard canRemoveFavorites :record="child" @handlechange="getCarList" />
                        </div>
                    </div>
                </div>
                <a-empty :description="null" v-else />
            </a-spin>
        </div>
    </div>
</template>

<script setup>
import ProductsCard from '../components/ProductsCard.vue';
import Core from '@/core';
import { ref, reactive, onMounted, computed, watch } from 'vue';

/* state start */
const spinning = ref(false)
const list = ref([])
/* state end */

onMounted(() => {
    getData()
})

/* computed start */
const listRender = computed(() => {
    return list.value.map(item => {
        delete item['item'].id
        return {
            ...item,
            ...item['item'],
        }
    })
})
/* computed end */

/* methods start */
// 获取数据
const getData = () => {
    getCarList()
}
const favoriteListFetch = Core.Api.Favorite.list
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
    favoriteListFetch().then(res => {
        list.value = res?.list
        back2Top()
    }).finally(() => {
        spinning.value = false
    })
}
/* fetch end */
</script>

<style lang="less" scoped>
#favorites {
    .content {
        padding: 80px 0;
        margin: 0 auto;
        width: 75%;
        .title {
            color: #000;
            font-size: 24px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            margin-bottom: 40px;
        }
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
    }
}
</style>