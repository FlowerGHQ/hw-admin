<template>
    <div id="vehicle-detail">
        <div class="content">
            <a-spin tip="Loading..." :spinning="spinning">
                <!-- 车辆信息 -->
                <div class="vehicle-body">
                    <div class="vehicle-body-swiper">
                        <Swiper ref="swiperRef" :swiperList="swiperList" />
                    </div>
                    <template v-if="vehicle_mes.set_id">
                        <div class="vehicle-body-series">
                            <p class="title">{{ vehicle_mes[$Util.regionalUnitMoney().name_index] }}</p>
                            <p class="code">
                                <span class="code-left">{{ vehicle_mes.code }}</span>
                                <span class="code-right">{{ specList?.length || 0 }} {{ $t('purchase.series') }}</span>
                            </p>
                            <div class="series-cards" :class="specList?.length > 3 ? 'padding-bottom' : ''">
                                <div
                                    class="series-card"
                                    :style="{ flex: specList?.length > 2 ? 'none' : '1' }"
                                    v-for="(item, i) in specList"
                                    :key="item.id"
                                    @click="selectSeries(i)"
                                >
                                    <seriesCard :record="item" :selected="seriesIndex === i" />
                                </div>
                            </div>
                            <div class="variants">
                                <p class="nums">{{ itemList?.length || 0 }} {{ $t('purchase.variants') }}</p>
                                <div class="variants-body">
                                    <div class="variants-item" v-for="(item, i) in itemList" :key="item.id">
                                        <ProductsCard
                                            @handlechange="selectSeries(seriesIndex)"
                                            type="small"
                                            :record="item"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <div class="vehicle-body-series single">
                            <div class="single-top">
                                <p class="title">
                                    {{ vehicle_mes[$Util.regionalUnitMoney().name_index] }}
                                    <span class="favorites" @click="addFavorites(vehicle_mes)">
                                        <svg-icon
                                            icon-class="collected-icon"
                                            class-name="favorites-icon"
                                            v-if="vehicle_mes.in_favorite"
                                        />
                                        <svg-icon icon-class="favorites-icon" class-name="favorites-icon" v-else />
                                        <span class="favorites-text">{{ $t('mall.favorites') }}</span>
                                    </span>
                                </p>
                                <p class="code">{{ vehicle_mes.code }}</p>
                                <p class="model" ref="modelRef" v-if="vehicle_mes?.type === 2" @click.stop>
                                    <span class="model-text">model</span>
                                    <a-popover
                                        v-model:visible="visible"
                                        title=""
                                        trigger="click"
                                        placement="bottom"
                                        :getPopupContainer="() => modelRef"
                                    >
                                        <template #content>
                                            <div class="model-ul">
                                                <p class="model-li" v-for="item in vehicle_mes?.apply_vehicle">
                                                    {{ item[$Util.regionalUnitMoney().name_index] || '-' }}
                                                </p>
                                            </div>
                                        </template>
                                        <span class="model-value" @click="visible = true">
                                            <span>{{
                                                vehicle_mes?.apply_vehicle.length > 0
                                                    ? vehicle_mes?.apply_vehicle[0][
                                                          $Util.regionalUnitMoney().name_index
                                                      ] || '-'
                                                    : '-'
                                            }}</span>
                                            <img class="model-img" src="@images/down-arrow.png" />
                                        </span>
                                    </a-popover>
                                </p>
                            </div>
                            <div class="single-bottom">
                                <div class="price">
                                    <div class="price-content">
                                        <template v-if="vehicle_mes.type === Core.Const.ITEM.TYPE.PRODUCT">
                                            <p class="price-text">40QH : {{ currency }}{{ stepPrice['40qh'] }}</p>
                                            <p class="price-text-t">
                                                Samples : {{ currency }}{{ stepPrice['normal'] }}/20GP : {{ currency
                                                }}{{ stepPrice['20gp'] }}
                                            </p>
                                        </template>
                                        <template v-else>
                                            <p class="price-text">{{ currency }}{{ price }}</p>
                                        </template>
                                    </div>
                                    <div class="count-edit">
                                        <a-input-number
                                            v-model:value="editCount"
                                            :min="stepMinPrice"
                                            :max="99999"
                                            :step="stepMinPrice"
                                            :precision="0"
                                        />
                                    </div>
                                </div>
                                <my-button
                                    type="primary"
                                    padding="20px 32px"
                                    font="16px"
                                    @click.native="addCar(vehicle_mes)"
                                >
                                    <svg-icon icon-class="add-car-icon" class-name="add-car-icon" />
                                    {{ $t('i.cart') }}
                                </my-button>
                            </div>
                        </div>
                    </template>
                </div>
                <!-- tab 栏部分 -->
                <div class="tab">
                    <div class="tab-list">
                        <div
                            class="tab-item tab-animate"
                            :class="tabIndex === i ? 'active' : ''"
                            v-for="(item, i) in tabList"
                            @click="changeTab(i)"
                        >
                            {{ $t(`purchase.${item.nameLang}`) }}
                        </div>
                    </div>
                    <div class="tab-body">
                        <template v-if="tabIndex === 0">
                            <template v-if="detailImageList.length > 0">
                                <img
                                    class="img-detail"
                                    :src="$Util.imageFilter(item, 5)"
                                    alt=""
                                    v-for="item in detailImageList"
                                />
                            </template>
                            <a-empty :description="null" v-else />
                        </template>
                    </div>
                </div>
                <!-- 相同系列产品 -->
                <div class="same-series" v-if="sameSeriesList.length > 0" :key="lang">
                    <div class="title">{{ $t('purchase.recommended_products') }}</div>
                    <div class="same-series-list">
                        <div
                            class="same-series-item"
                            v-for="item in sameSeriesList"
                            :key="item.id"
                            @click="routerChange('/mall/vehicle-list/detail', { id: item.id })"
                        >
                            <VehicleCard :record="item" />
                        </div>
                    </div>
                </div>
            </a-spin>
        </div>
    </div>
</template>

<script setup>
import MyButton from '@/components/common/MyButton.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import seriesCard from './components/series-card.vue';
import ProductsCard from '../../components/ProductsCard.vue';
import VehicleCard from './components/vehicle-card.vue';
import Swiper from '../../components/Swiper.vue';

import Core from '@/core';
import { ref, reactive, onMounted, computed, watch, getCurrentInstance, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const store = useStore();
const vehicle_id = Number(route.query?.id);

/* state start */
const visible = ref(false);
const currency = ref('€');
const paramPrice = ref(false);
const modelRef = ref(null);
const swiperRef = ref(null);
const spinning = ref(false);
const vehicle_mes = reactive({});
const seriesIndex = ref(0);
const tabIndex = ref(0);
const tabList = ref([
    {
        nameLang: 'product_details',
    },
]);
const swiperList = ref([]);
const specList = ref([]);
const itemList = ref([]);
const sameSeriesList = ref([]);
const editCount = ref(1);
const itemDetailFetch = Core.Api.Item.detail;
const listBySetFetch = Core.Api.AttrDef.listBySet;
const itemListFetch = Core.Api.Item.list;
/* state end */

/* computed start */
const lang = computed(() => {
    return store.state.lang;
});
const stepPrice = computed(() => {
    return {
        '40qh': proxy.$Util.countFilter(vehicle_mes[proxy.$Util.Number.getStepPriceIndex('40qh')]),
        '20gp': proxy.$Util.countFilter(vehicle_mes[proxy.$Util.Number.getStepPriceIndex('20gp')]),
        normal: proxy.$Util.countFilter(vehicle_mes[proxy.$Util.Number.getStepPriceIndex()]),
    };
});
const price = computed(() => {
    return proxy.$Util.countFilter(vehicle_mes[proxy.$Util.Number.getPriceIndex()]);
});
const detailImageList = computed(() => {
    return vehicle_mes?.imgs ? vehicle_mes?.imgs.split(',') : [];
});
const stepMinPrice = computed(() => {
    editCount.value = vehicle_mes.type === Core.Const.ITEM.TYPE.COMPONENT ? vehicle_mes?.min_purchase_amount : 1;
    return vehicle_mes.type === Core.Const.ITEM.TYPE.COMPONENT ? vehicle_mes?.min_purchase_amount : 1;
});
/* computed end */

/* watch start */
/* watch end */

onMounted(() => {
    if (Core.Data.getCurrency() === 'EUR') {
        currency.value = '€';
        paramPrice.value = false;
    } else {
        currency.value = '$';
        paramPrice.value = true;
    }
    getData();
});

/* methods start */
// 获取数据
const getData = () => {
    getItemDetail();
};
// 选择系列
const selectSeries = i => {
    seriesIndex.value = i;
    const q = {
        set_id: vehicle_mes.set_id, //商品组id
        attr_def_id: specList.value[i]?.id, //通用规格id
        attr_def_value: specList.value[i]?.value, //通用规格值
    };
    getCarList(q);
};
// 选择tab栏
const changeTab = i => {
    tabIndex.value = i;
};
// 获取展示图列表
const getSwiperList = (list = []) => {
    swiperList.value = list.map(item => {
        return {
            path: item.imgs,
        };
    });
    swiperList.value.unshift({ path: vehicle_mes.logo }); // 第一张为封面图
    // 刚进页面初始化 第一张 swiper 商品图
    swiperRef.value.selectSwiper(swiperList.value[0], 0);
};
// 获取系列列表
const getSpecList = list => {
    specList.value = [];
    list.forEach((item, i) => {
        const valueList = item.value.split(',');
        const valueEnList = item.value_en.split(',');
        const descList = item.desc.split(',');
        const descEnList = item.desc_en.split(',');
        valueList.forEach((value, valueIndex) => {
            const price = item.range_of_fob_price_list.find(price => price.value === value);
            const obj = Object.assign(item, {
                desc: descList[valueIndex],
                desc_en: descEnList[valueIndex],
                value: value,
                value_en: valueEnList[valueIndex],
                ...price,
            });
            specList.value.push(Core.Util.deepCopy(obj));
        });
    });
};
// 路由跳转
const routerChange = (routeUrl, item = {}, type = 1) => {
    if (!routeUrl) return;
    switch (type) {
        case 1:
            router.push({
                path: routeUrl,
                query: item,
            });
            break;
        default:
            break;
    }
};
/* methods end */

/* fetch start */
// 获取 商品详情
const getItemDetail = () => {
    spinning.value = true;
    itemDetailFetch({ id: vehicle_id })
        .then(res => {
            let detail = res.detail || {};
            detail.sales_area_name = detail.sales_area_list ? detail.sales_area_list.map(i => i.name).join(' , ') : '';
            Object.assign(vehicle_mes, detail); //logo封面，imgs详情图
            getSameSeriesList();
            if (detail.set_id) {
                getListBySet();
                const q = {
                    set_id: vehicle_mes.set_id, //商品组id
                    flag_default: 0,
                };
                getCarList(q, 'getSwiperList');
            } else {
                getSwiperList();
            }
        })
        .finally(() => {
            spinning.value = false;
        });
};
// 获取 同规格商品 列表接口
const getListBySet = (params = {}) => {
    listBySetFetch({
        set_id: vehicle_mes.set_id, //商品组id
        flag_category: 1, //是否为分类（0.否，1.是）
        ...params,
    })
        .then(res => {
            getSpecList(res.list);
            const q = {
                set_id: vehicle_mes.set_id, //商品组id
                attr_def_id: specList.value[0]?.id, //通用规格id
                attr_def_value: specList.value[0]?.value, //通用规格值
            };
            getCarList(q);
        })
        .catch(err => {
            console.log('getSpecList err', err);
        });
};
const getCarList = (q, type) => {
    const params = {
        type: 1, //1.整车；2.零部件/物料；3.周边；4.广宣品
        page: 1,
        page_size: 999,
    };
    Object.assign(params, q);
    itemListFetch({ ...params }).then(res => {
        const arr = res?.list.map(item => {
            item.logo = item.imgs;
            return item;
        });
        if (type === 'getSwiperList') {
            getSwiperList(arr);
        } else {
            itemList.value = arr;
        }
    });
};
// 获取同系列整车
const getSameSeriesList = () => {
    const params = {
        type: vehicle_mes.type, //1.整车；2.零部件/物料；3.周边；4.广宣品
        page: 1,
        page_size: 4, // 取5个
        flag_random_order: 1, //是否随机排序
        id: vehicle_id, //商品id
    };
    itemListFetch({ ...params }).then(res => {
        sameSeriesList.value = res?.list;
    });
};
// 添加收藏
const addFavorites = async item => {
    if (item.in_favorite) {
        return proxy.$message.warning(proxy.$t('i.item_favorite'));
    }
    try {
        if (paramPrice.value) {
            await Core.Api.Favorite.add({ item_id: item.id, price: item?.fob_eur });
        } else {
            await Core.Api.Favorite.add({ item_id: item.id, price: item?.fob_usd });
        }
        proxy.$message.success(proxy.$t('pop_up.operate'));
    } catch (err) {
        console.log('handleMoveToFavorite err:', err);
    } finally {
        // 重新获取数据
        getItemDetail();
    }
};
// 添加购物车
const addCar = item => {
    const params = {
        item_id: item.id,
        amount: editCount.value,
        price: item[proxy.$Util.Number.getPriceIndex()],
    };
    Core.Api.ShopCart.save({ ...params }).then(res => {
        proxy.$message.success(proxy.$t('i.add_success'));
        getShopCartList();
    });
};
// 获取购物车商品数量
const getShopCartList = () => {
    Core.Api.ShopCart.list().then(res => {
        proxy.$store.commit('setShopCartNum', res.count);
    });
};
/* fetch end */
</script>

<style lang="scss" scoped src="../../css/layout.css"></style>
<style lang="less" scoped>
#vehicle-detail {
    .content {
        .title {
            color: #000;
            font-size: 24px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            margin-bottom: 40px;
        }

        .vehicle-body {
            .flex(initial, initial, row);

            .vehicle-body-swiper,
            .vehicle-body-series {
                width: calc((100% - 40px) / 2);

                &.single {
                    .flex(space-between, initial, column);
                    padding: 80px 0;
                    margin-left: 80px;

                    .single-top {
                        .title {
                            color: #1d2129;
                            font-size: 32px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: normal;
                            margin-bottom: 16px;

                            .favorites {
                                .flex(initial, center, row);
                                float: right;
                                cursor: pointer;
                                margin-top: 13px;

                                .favorites-icon {
                                    height: 18px;
                                    width: 18px;
                                    margin-right: 8px;
                                }

                                .favorites-text {
                                    color: #000;
                                    text-align: right;
                                    font-size: 12px;
                                    font-style: normal;
                                    font-weight: 500;
                                    line-height: 150%;
                                    /* 18px */
                                }
                            }
                        }

                        .code {
                            color: #999;
                            font-size: 16px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: 150%;
                            margin-top: 0;
                        }
                    }

                    .single-bottom {
                        .price {
                            .flex(space-between, center, row);

                            .price-content {
                                .price-text {
                                    color: #8f00ff;
                                    font-size: 24px;
                                    font-style: normal;
                                    font-weight: 700;
                                    line-height: normal;
                                }

                                .price-text-t {
                                    margin-top: 8px;
                                    color: #8e8e8e;
                                    font-size: 16px;
                                    font-style: normal;
                                    font-weight: 400;
                                    line-height: 150%;
                                    /* 24px */
                                }
                            }

                            .count-edit {
                                /deep/.ant-input-number {
                                    width: 207px;
                                    box-shadow: 0 0 0 0;
                                    border: 0;
                                    position: relative;
                                    text-align: center;
                                    background-color: #f8f8f8;

                                    .ant-input-number-input-wrap {
                                        margin: 0 60px;
                                        background: #fff;

                                        .ant-input-number-input {
                                            color: #1d2129;
                                            text-align: center;
                                            font-size: 20px;
                                            font-style: normal;
                                            font-weight: 500;
                                            line-height: 27px;
                                            /* 135% */
                                            height: 48px;
                                        }
                                    }

                                    .ant-input-number-handler-wrap {
                                        width: 0;
                                        height: 0;
                                        position: static;
                                        opacity: 1;
                                        visibility: hidden;

                                        .ant-input-number-handler {
                                            .fcc();
                                            visibility: visible;
                                            height: 48px;
                                            width: 48px;
                                            background: #fff;
                                            border: none;
                                            position: absolute;
                                            border: 0;
                                            box-sizing: border-box;

                                            &:hover {
                                                height: 48px !important;
                                                opacity: 0.7;
                                            }

                                            .anticon {
                                                display: none;
                                            }

                                            &.ant-input-number-handler-down {
                                                left: 0;

                                                &::before {
                                                    border-radius: 20px;
                                                    display: inline-block;
                                                    content: '';
                                                    width: 15px;
                                                    height: 1px;
                                                    background: #1c1b1f;
                                                    border-radius: 20px 20px 20px 20px;
                                                    opacity: 1;
                                                }
                                            }

                                            &.ant-input-number-handler-up {
                                                right: 0;

                                                &::before,
                                                &::after {
                                                    position: absolute;
                                                    display: inline-block;
                                                    content: '';
                                                    background: #1c1b1f;
                                                    border-radius: 20px;
                                                }

                                                &::before {
                                                    width: 15px;
                                                    height: 1px;
                                                }

                                                &::after {
                                                    height: 15px;
                                                    width: 1px;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        :deep(#my-button) {
                            margin-top: 40px;

                            .my-button-text {
                                .flex(initial, center, row);
                            }
                        }

                        .add-car-icon {
                            font-size: 24px;
                            margin-right: 8px;
                        }
                    }
                }
            }

            .vehicle-body-series {
                margin-left: 40px;

                .title {
                    color: #1d2129;
                    font-size: 24px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    letter-spacing: 0.48px;
                    margin-bottom: 12px;
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
                .model {
                    width: 100%;
                    background: #f5f5f5;
                    display: flex;
                    align-items: center;
                    margin-bottom: 0;
                    padding: 2px;
                    .model-text {
                        padding: 7px 8px;
                        font-size: 12px;
                        line-height: 18px;
                        color: #999;
                    }
                    .model-value {
                        flex: 1;
                        padding: 7px 8px;
                        background: #fff;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .model-img {
                            height: 16px;
                        }
                    }
                    .model-ul {
                        width: 100%;
                        .model-li {
                            width: 100%;
                            &:last-child {
                                margin-bottom: 0;
                            }
                        }
                    }
                }

                .series-cards {
                    .flex(initial, initial, row);
                    overflow-x: auto;
                    margin-top: 24px;

                    &.padding-bottom {
                        padding-bottom: 24px;
                    }

                    .series-card {
                        flex-shrink: 0;
                        min-width: calc((100% - 32px) / 3);
                        width: 207px;

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
                            background: #8f00ff;
                        }
                    }

                    &.active {
                        color: #8f00ff;
                    }
                }
            }

            .tab-body {
                margin-top: 40px;

                .img-detail {
                    width: 100%;

                    &:nth-child(n + 2) {
                        margin-top: 16px;
                    }
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
}

@media (max-width: 1200px) {
    #vehicle-detail .content .same-series .same-series-list {
        .same-series-item {
            width: calc((100% - 40px) / 3);

            &:not(:nth-child(4n + 1)) {
                margin-left: 0px;
            }

            &:not(:nth-child(-n + 4)) {
                margin-top: 0px;
            }

            &:not(:nth-child(3n + 1)) {
                margin-left: 20px;
            }

            &:not(:nth-child(-n + 3)) {
                margin-top: 20px;
            }
        }
    }
}
</style>
