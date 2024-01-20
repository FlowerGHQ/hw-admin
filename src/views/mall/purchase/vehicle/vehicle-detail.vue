<template>
    <div id="vehicle-detail">
        <div class="content">
            <a-spin tip="Loading..." :spinning="spinning">
                <div class="vehicle-body">
                    <div class="vehicle-body-swiper">
                        <Swiper :swiperList="swiperList" />
                    </div>
                    <div class="vehicle-body-series">
                        <p class="title">{{ vehicle_mes.name }}</p>
                        <p class="code">
                            <span class="code-left">HW1000T-1C 01N2</span>
                            <span class="code-right">{{ vehicle_mes.series?.length || 0 }} series</span>
                        </p>
                        <div class="series-cards">
                            <div class="series-card" v-for="(item, i) in vehicle_mes.series" :key="item.id"
                                @click="selectSeries(i)">
                                <seriesCard :record="item" :selected="seriesIndex === i" />
                            </div>
                        </div>
                        <div class="variants">
                            <p class="nums">{{ vehicle_mes.variants?.length || 0 }} Variants</p>
                            <div class="variants-body">
                                <div class="variants-item" v-for="(item, i) in vehicle_mes.variants" :key="item.id">
                                    <ProductsCard type="small" :record="item" :selected="seriesIndex === i" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab">
                    <div class="tab-list">
                        <div class="tab-item tab-animate" :class="tabIndex === i ? 'active' : ''" v-for="(item, i) in tabList" @click="changeTab(i)">{{ $t(`purchase.${item.nameLang}`) }}</div>
                    </div>
                    <div class="tab-body">
                        <template v-if="tabIndex === 0">
                            <img class="img"
                                src="http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg"
                                alt="">
                        </template>
                    </div>
                </div>
                <div class="same-series">
                    <div class="title">{{ $t('purchase.same_series_of_products') }}</div>
                    <div class="same-series-list">
                        <div class="same-series-item" v-for="item in vehicle_mes.same_series" :key="item.id"
                            @click="routerChange('/mall/vehicle-list/detail', { id: item.id })">
                            <VehicleCard :record="item" />
                        </div>
                    </div>
                </div>
            </a-spin>
        </div>
    </div>
</template>

<script setup>
import seriesCard from './components/series-card.vue';
import ProductsCard from '../../components/ProductsCard.vue';
import VehicleCard from './components/vehicle-card.vue';
import Swiper from '../../components/Swiper.vue';

import Core from '@/core';
import { ref, reactive, onMounted, computed, watch, getCurrentInstance, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const store = useStore();
const vehicle_id = route.query?.id;

/* state start */
const spinning = ref(false)
const vehicle_mes = reactive({})
const seriesIndex = ref(0)
const tabIndex = ref(0)
const tabList = ref([{
    nameLang: 'product_details'
}])
const swiperList = ref([{
    img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
},{
    img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
},{
    img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
},{
    img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
},{
    img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
},{
    img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
}])
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
// 选择系列
const selectSeries = (i) => {
    seriesIndex.value = i
}
// 选择tab栏
const changeTab = (i) => {
    tabIndex.value = i
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
    searchListFetch({ id: vehicle_id }).then(res => {
        // vehicle_mes = res;
        Object.assign(vehicle_mes, {
            id: 1,
            img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
            name: 'EK1',
            name_en: 'EK1',
            code: 'HW1000T-1C 01N2',
            price1: 14900,
            price2: 14910,
            price3: 15900,
            series: [
                {
                    id: 1,
                    name: 'Standard',
                    code: 'HW1000T-1C 01N2',
                    price1: 14900,
                    price2: 14910,
                    price3: 15900,
                },
                {
                    id: 2,
                    name: 'Standard',
                    code: 'HW1000T-1C 01N2',
                    price1: 14900,
                    price2: 14910,
                    price3: 15900,
                },
                {
                    id: 3,
                    name: 'Standard',
                    code: 'HW1000T-1C 01N2',
                    price1: 14900,
                    price2: 14910,
                    price3: 15900,
                },
                {
                    id: 4,
                    name: 'Standard',
                    code: 'HW1000T-1C 01N2',
                    price1: 14900,
                    price2: 14910,
                    price3: 15900,
                }
            ],
            variants: [
                {
                    logo: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                    name: 'White',
                    name_en: 'White',
                    code: 'HW1000T-1C 01N2',
                    in_favorite: false,
                    fob_eur: 16992,
                },
                {
                    logo: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                    name: 'White',
                    name_en: 'White',
                    code: 'HW1000T-1C 01N2',
                    in_favorite: false,
                    fob_eur: 16992,
                },
                {
                    logo: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                    name: 'White',
                    name_en: 'White',
                    code: 'HW1000T-1C 01N2',
                    in_favorite: false,
                    fob_eur: 16992,
                },
                {
                    logo: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                    name: 'White',
                    name_en: 'White',
                    code: 'HW1000T-1C 01N2',
                    in_favorite: false,
                    fob_eur: 16992,
                }
            ],
            same_series: [
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
                    id: 4,
                    img: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/jpeg/528d43f9d7e4ba5216ee72ab66106c9eabba9163f1d8ecd6e7497278137a7074.jpeg',
                    name: 'EK1',
                    name_en: 'EK1',
                    code: 'HW1000T-1C 01N2',
                    price1: 14900,
                    price2: 14910,
                    price3: 15900,
                },
            ]
        })
    }).finally(() => {
        spinning.value = false
    })
}
/* fetch end */
</script>

<style lang='scss' scoped src='../../css/layout.css'></style>
<style lang="less" scoped>
#vehicle-detail {
    .content {
        .title {
            color: #000;
            font-size: 24px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            margin-bottom: 40px
        }

        .vehicle-body {
            .flex(initial, initial, row);

            .vehicle-body-swiper,
            .vehicle-body-series {
                width: calc((100% - 40px) / 2);
            }

            .vehicle-body-series {
                margin-left: 40px;

                .title {
                    color: #1D2129;
                    font-size: 24px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    letter-spacing: 0.48px;
                }

                .code {
                    .flex(space-between, center, row);
                    margin-top: 12px;

                    .code-left {
                        color: #000;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 150%;
                        /* 24px */
                    }

                    .code-right {
                        color: #666;
                        text-align: right;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 150%;
                        /* 24px */
                    }
                }

                .series-cards {
                    .flex(initial, center, row);
                    overflow-x: auto;
                    margin-top: 24px;
                    padding-bottom: 24px;

                    .series-card {
                        flex-shrink: 0;

                        &:nth-child(n + 2) {
                            margin-left: 16px;
                        }
                    }
                }

                .variants {
                    .nums {
                        color: #666;
                        text-align: right;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 150%;
                        /* 24px */
                        margin: 24px 0 12px 0;
                    }

                    .variants-body {
                        max-height: calc((130px + 16px) * 3 + (130px) / 2);
                        overflow-y: auto;

                        /* 滚动条 */
                        &::-webkit-scrollbar {
                            height: 0px;
                            width: 0px;
                        }

                        .variants-item {
                            &:nth-child(n + 2) {
                                margin-top: 16px;
                            }
                        }
                    }
                }
            }
        }

        .tab {
            margin-top: 80px;

            .tab-list {
                .flex(initial, center, row);
                .tab-item {
                    color: #000;
                    font-size: 24px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    cursor: pointer;
                    &:nth-child(n + 2) {
                        margin-left: 64px;
                    }

                    &.tab-animate {
                        &::before {
                            background: #8F00FF;
                        }
                    }
                    &.active {
                        color: #8F00FF;
                    }
                }
            }

            .tab-body {
                margin-top: 40px;
                .img {
                    width: 100%;
                }
            }
        }

        .same-series {
            margin-top: 80px;

            .same-series-list {
                .flex(initial, initial, row);
                flex-wrap: wrap;

                .same-series-item {
                    width: calc((100% - 120px) / 4);

                    &:not(:nth-child(4n + 1)) {
                        margin-left: 40px;
                    }

                    &:not(:nth-child(-n + 4)) {
                        margin-top: 40px;
                    }
                }
            }
        }
    }
}</style>