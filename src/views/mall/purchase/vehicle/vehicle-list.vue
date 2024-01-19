<template>
    <div v-if="!$route.meta.hideParentTemplate">
        <div id="vehicle-list">
            <div class="content">
                <div class="title">
                    {{ $t('purchase.all_vehicle_models') }}
                </div>
                <a-spin tip="Loading..." :spinning="spinning">
                    <div class="list">
                        <div class="item" v-for="item in list" :key="item.id" @click="routerChange('/mall/vehicle-list/detail', { id: item.id })">
                            <VehicleCard :record="item" />
                        </div>
                    </div>
                </a-spin>
            </div>
        </div>
    </div>
    <div v-else>
        <router-view></router-view>
    </div>
</template>

<script setup>
import VehicleCard from './components/vehicle-card.vue';

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
const list = ref([])
const searchListFetch = Core.Api.DISTRIBUTOR_HOME.searchList
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
// 路由跳转
const routerChange = (routeUrl, item = {}, type = 1) => {
    if (!routeUrl) return;
    switch (type) {
        case 1:
            router.push({
                path: routeUrl,
                query: item
            })
            break;
        default:
            break;
    }
}
/* methods end */

/* fetch start */
const getCarList = () => {
    spinning.value = true
    searchListFetch().then(res => {
        list.value = res?.merge_maps.list
        list.value = [
            {
                id: 1,
                img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                name: 'EK1',
                name_en: 'EK1',
                code: 'HW1000T-1C 01N2',
                price1: 14900,
                price2: 14910,
                price3: 15900,
            },
            {
                id: 2,
                img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                name: 'EK1',
                name_en: 'EK1',
                code: 'HW1000T-1C 01N2',
                price1: 14900,
                price2: 14910,
                price3: 15900,
            },
            {
                id: 3,
                img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                name: 'EK1',
                name_en: 'EK1',
                code: 'HW1000T-1C 01N2',
                price1: 14900,
                price2: 14910,
                price3: 15900,
            },
            {
                id: 1,
                img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                name: 'EK1',
                name_en: 'EK1',
                code: 'HW1000T-1C 01N2',
                price1: 14900,
                price2: 14910,
                price3: 15900,
            },
            {
                id: 1,
                img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                name: 'EK1',
                name_en: 'EK1',
                code: 'HW1000T-1C 01N2',
                price1: 14900,
                price2: 14910,
                price3: 15900,
            },
            {
                id: 1,
                img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                name: 'EK1',
                name_en: 'EK1',
                code: 'HW1000T-1C 01N2',
                price1: 14900,
                price2: 14910,
                price3: 15900,
            },
            {
                id: 1,
                img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                name: 'EK1',
                name_en: 'EK1',
                code: 'HW1000T-1C 01N2',
                price1: 14900,
                price2: 14910,
                price3: 15900,
            },
            {
                id: 1,
                img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                name: 'EK1',
                name_en: 'EK1',
                code: 'HW1000T-1C 01N2',
                price1: 14900,
                price2: 14910,
                price3: 15900,
            },
            {
                id: 1,
                img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                name: 'EK1',
                name_en: 'EK1',
                code: 'HW1000T-1C 01N2',
                price1: 14900,
                price2: 14910,
                price3: 15900,
            },
        ]
    }).finally(() => {
        spinning.value = false
    })
}
/* fetch end */
</script>

<style lang='scss' scoped src='../../css/layout.css'></style>
<style lang="less" scoped>
#vehicle-list {
    .content {
        .list {
            .flex(initial, initial, row);
            flex-wrap: wrap;
            .item {
                width: calc((100% - 120px) / 4);
                margin-right: 40px;
                &:nth-child(4n) {
                    margin-right: 0;
                }
                &:nth-child(n + 5) {
                    margin-top: 40px;
                }
            }
        }
    }
}
</style>