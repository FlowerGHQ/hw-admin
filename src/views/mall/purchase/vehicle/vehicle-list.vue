<template>
    <div v-if="!$route.meta.hideParentTemplate">
        <div id="vehicle-list">
            <div class="content">
                <div class="title">
                    <span v-if="vehicle_type === 1">
                        {{ $t('purchase.all_vehicle_models') }}
                    </span>
                    <span v-else-if="vehicle_type === 2">
                        {{ $t('purchase.all_accessories') }}
                    </span>
                    <span v-else-if="vehicle_type === 3">
                        {{ $t('purchase.all_peripheral_products') }}
                    </span>
                    <span v-else-if="vehicle_type === 4">
                        {{ $t('purchase.all_promotional_products') }}
                    </span>
                </div>
                <div class="list">
                    <div class="item" v-for="item in list" :key="item.id"
                        @click="routerChange(`${route.path}/detail`, { id: item.id })">
                        <VehicleCard :record="item" />
                    </div>
                </div>
                <div class="loading">
                    <down-loading class="loading" :show="spinning" />
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <router-view></router-view>
    </div>
</template>

<script setup>
import VehicleCard from './components/vehicle-card.vue';
import DownLoading from '../../components/DownLoading.vue';

import Core from '@/core';
import { ref, reactive, onMounted, computed, watch, getCurrentInstance, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const store = useStore();

/* state start */
const vehicle_type = ref(Number(route.meta?.item_type) || 1);
const spinning = ref(false)
const pagination = reactive({
    page_size: 20,
    page: 1,
    total: 0,
    total_page: 0,
})
const list = ref([])
const itemListFetch = Core.Api.Item.list
/* state end */

onBeforeRouteLeave((to) => {
    vehicle_type.value = Number(to.meta?.item_type) || 1
    getCarList({}, true);
});
/* computed start */
const lang = computed(() => {
    return store.state.lang
})
/* computed end */

/* watch start */
/* watch end */

onMounted(() => {
    getData()
    window.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})

/* methods start */
// 获取数据
const getData = () => {
    getCarList()
}
const handleScroll = () => {
    // 因为存在子组件路由所以判断只在父路由时执行
    if (route.path !== '/mall/vehicle-list') return;
    const footerHeight = document.querySelector('#mall-footer').clientHeight
    const html = document.documentElement
    Core.Util.handleScrollFn(html, getCarList, pagination, spinning.value, footerHeight)
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
const resetFn = () => {
    list.value = []
    Object.assign(pagination, {
        page_size: 20,
        page: 1,
        total: 0,
        total_page: 0,
    })
}
/* methods end */

/* fetch start */
const getCarList = (q, reset = false) => {
    if (reset) resetFn();
    spinning.value = true
    const params = {
        "type": vehicle_type.value, //1.整车；2.零部件/物料；3.周边；4.广宣品
        "page": pagination.page,
        "page_size": pagination.page_size,
    }
    Object.assign(params, q)
    const vehicle_type_old = Core.Util.deepCopy(vehicle_type.value)
    itemListFetch({ ...params }).then(res => {
        if (vehicle_type_old !== vehicle_type.value) return; // 已切换类型不再赋值数据
        list.value = list.value.concat(res?.list)
        pagination.total = res.count
        pagination.total_page = Math.ceil(pagination.total / pagination.page_size)
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

        .loading {
            margin-top: 20px;
        }
    }
}


@media (max-width: 1200px) {
    #vehicle-list .content .list {
        .item {
            width: calc((100% - 40px) / 3);
            margin-right: 20px;

            &:nth-child(4n) {
                margin-right: 0;
            }

            &:nth-child(n + 5) {
                margin-top: 20px;
            }

            &:nth-child(3n) {
                margin-right: 0;
            }

            &:nth-child(n + 4) {
                margin-top: 20px;
            }
        }
    }
}
</style>