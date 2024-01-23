<template>
    <div id="search">
        <div class="content">
            <div class="title">
                {{ $t('purchase.search_results') }}
            </div>
            <a-spin tip="Loading..." :spinning="spinning">
                <div class="body">
                    <!-- 整车 -->
                    <div class="list-body" v-if="vehicleList.length !== 0">
                        <p class="list-body-title">
                            {{ $t('mall.vehicle_models') }}({{ vehicleList.length }})
                        </p>
                        <div class="list-item" v-for="(item, index) in vehicleList" :key="item.id">
                            <ProductsCard :record="item" @handlechange="getCarList" />
                        </div>
                    </div>
                    <!-- 零配件 -->
                    <div class="list-body" v-if="sparepartsList.length !== 0">
                        <p class="list-body-title">
                            {{ $t('mall.accessories') }}({{ sparepartsList.length }})
                        </p>
                        <div class="list-item" v-for="(item, index) in sparepartsList" :key="item.id">
                            <ProductsCard :record="item" @handlechange="getCarList" />
                        </div>
                    </div>
                    <!-- 周边件 -->
                    <div class="list-body" v-if="peripheralList.length !== 0">
                        <p class="list-body-title">
                            {{ $t('mall.peripheral_products') }}({{ peripheralList.length }})
                        </p>
                        <div class="list-item" v-for="(item, index) in peripheralList" :key="item.id">
                            <ProductsCard :record="item" @handlechange="getCarList" />
                        </div>
                    </div>
                    <!-- 广宣品 -->
                    <div class="list-body" v-if="promotionalList.length !== 0">
                        <p class="list-body-title">
                            {{ $t('mall.promotional_products') }}({{ promotionalList.length }})
                        </p>
                        <div class="list-item" v-for="(item, index) in promotionalList" :key="item.id">
                            <ProductsCard :record="item" @handlechange="getCarList" />
                        </div>
                    </div>
                    <!-- 新闻 -->
                    <div class="list-body" v-if="listNews.length !== 0">
                        <p class="list-body-title">
                            {{ $t('mall.news') }}({{ listNews.length }})
                        </p>
                        <div class="list-item new-list-item" v-for="(item, index) in listNews" :key="item.id">
                            <div class="img">
                                <img :src="item.img" alt="">
                            </div>
                            <div class="mes">
                                <div class="mes-left">
                                    <div class="text">
                                        <p class="title">{{ item.topic ? item.topic : '-' }}</p>
                                        <p class="code" :title="item.description">{{ item.description ? item.description : '-' }}</p>
                                    </div>
                                    <p class="time">
                                        <span v-if="lang === 'zh'">{{ $Util.timeFilter(item.create_time, 3) }}</span>
                                        <span v-else>{{ $Util.timeFilter(item.create_time, 6) }}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <a-empty :description="null" v-if="list.length === 0 && listNews.length === 0" />
            </a-spin>
        </div>
        <!-- <DownLoading class="loading" :show="loading"/> -->
    </div>
</template>

<script setup>
import DownLoading from '../components/DownLoading.vue';
import ProductsCard from '../components/ProductsCard.vue';
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
const searchForm = reactive({
    "flag_spread": 0,
    "page": 1,
    "is_authority": 1,
    "page_size": 9999,
    "has_price": true,
    "search_for": ""
})
// const loading = ref(false)
const spinning = ref(false)
const list = ref([])
const listNews = ref([])
let fetchList = []
/* state end */

/* computed start */
const lang = computed(() => {
    return store.state.lang
})
const searchKey = computed(() => {
    return store.state.mallSearchKey
})
const vehicleList = computed(() => {
    return list.value.filter(item => item.type === 1)
})
const sparepartsList = computed(() => {
    return list.value.filter(item => item.type === 2)
})
const peripheralList = computed(() => {
    return list.value.filter(item => item.type === 3)
})
const promotionalList = computed(() => {
    return list.value.filter(item => item.type === 4)
})
/* computed end */

/* watch start */
watch(searchKey, (newVal, oldVal) => {
        console.log(newVal, oldVal)
        getData()
    }, { deep: true }
);
/* watch end */

onMounted(() => {
    getData()
})
onBeforeUnmount(() => {
    store.commit('clearMallKey')
})

/* methods start */
// 获取数据
const getData = () => {
    getCarList()
}
const searchListFetch = Core.Api.DISTRIBUTOR_HOME.searchList
// 回到顶部
const back2Top = () => {
    setTimeout(() => {
        window.scrollTo(0,0)
    }, 0);
}
/* methods end */

/* fetch start */
const getCarList = () => {
    searchForm.search_for = searchKey
    const params = searchForm
    // 如果有正在执行的搜索 则先添加搜索队列
    if (spinning.value) return fetchList.unshift({
        fn: searchListFetch,
        params: { ...params }
    });
    spinning.value = true
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
        if (fetchList.length > 0) {
            executeFetchList()
        }
    })
}
// 执行搜索接口队列
const executeFetchList = () => {
    function fn(fetch, params) {
        return fetch(params)
    }
    // 执行最新的一个接口
    fn(fetchList[0].fn, fetchList[0].params).then((result) => {
        const res = result
        list.value = res?.merge_maps.list
        listNews.value = res?.post_list.list
        // 清空 fetchList 队列
        fetchList = []
        back2Top()
    }).catch((error) => {
        console.log(error)
    })
}
/* fetch end */
</script>

<style lang='scss' scoped src='../css/layout.css'></style>
<style lang="less" scoped>
#search {
    .content {
        title {
            margin-bottom: 24px;
        }
        .body {
            .list-body {
                margin-bottom: 24px;
                .list-body-title {
                    color: #000;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    padding: 16px 0;
                    position: sticky;
                    top: -1px;
                    background: #F8F8F8;
                    z-index: 9;
                }
                .list-item {
                    margin-bottom: 24px;
                }
                .new-list-item {
                    .flex(initial, initial, row);
                    background: #FFF;
                    .img {
                        width: 453px;
                        height: 254px;
                        border: 1px solid #D9D9D9;
                        > img {
                            height: 100%;
                            width: 100%;
                            object-fit: cover;
                        }
                    }
                    
                    .mes {
                        .flex(space-between, initial, row);
                        flex: 1;
                        padding: 40px;
                        .mes-left {
                            .flex(space-between, initial);
                            .title {
                                .ellipsis(1);
                                color: #000;
                                font-size: 16px;
                                font-style: normal;
                                font-weight: 500;
                                line-height: normal;
                                margin-bottom: 16px;
                            }
                            .code {
                                .ellipsis(2);
                                color: #333;
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 400;
                                line-height: normal;
                            }
                            .time {
                                .flex(initial, center, row);
                                color: #999;
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 400;
                                line-height: normal;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>