<template>
    <div id="vehicle-card" class="hover">
        <div class="img-body">
            <div class="img">
                <img class="news-img" :src="$Util.imageFilter(record.logo, 5)" />
            </div>
        </div>
        <div class="text">
            <div>
                <p class="title" :title="record[$Util.regionalUnitMoney().name_index]">
                    {{ record[$Util.regionalUnitMoney().name_index] }}
                </p>
                <p class="code" :title="$t('i.code')">{{ record.code ? record.code : '-' }}</p>
                <p class="code" v-if="record.set_id">{{ record.children_number }} {{ $t('purchase.variants') }}</p>
                <p class="model" ref="modelRef" v-if="record?.type === 2" @click.stop>
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
                                <p class="model-li" v-for="item in record?.apply_vehicle">{{ item }}</p>
                            </div>
                        </template>
                        <span class="model-value" @click="visible = true">
                            <span>{{
                                record?.apply_vehicle && record?.apply_vehicle.length > 0
                                    ? record?.apply_vehicle[0]
                                    : '-'
                            }}</span>
                            <img class="model-img" src="@images/down-arrow.png" />
                        </span>
                    </a-popover>
                </p>
            </div>
            <div class="btn">
                <!-- 整车 -->
                <template v-if="record?.type === 1">
                    <p class="price">{{ currency }}{{ minPrice }} ~ {{ currency }}{{ maxPrice }}</p>
                </template>
                <!-- 整车以外 -->
                <template v-else>
                    <p class="price">
                        {{ currency }}{{ $Util.countFilter(!paramPrice ? record?.fob_eur : record?.fob_usd) }}
                    </p>
                </template>
                <div @click.stop>
                    <my-button
                        showRightIcon
                        padding="12px 32px"
                        font="14px"
                        @clickFn="routerChange(`${route.path}/detail`, { id: record.id })"
                    >
                        {{ $t('purchase.order_now') }}
                    </my-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import MyButton from '@/components/common/MyButton.vue';
import Core from '@/core';
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const { proxy } = getCurrentInstance();

const route = useRoute();
const router = useRouter();

const store = useStore();

const props = defineProps({
    record: {
        type: [Object, String],
    },
});
/* state start */
const currency = ref('€');
const paramPrice = ref(false);
const modelRef = ref(null);
const visible = ref(false);
/* state end */

/* computed start */
const lang = computed(() => {
    return store.state.lang;
});

const minPrice = computed(() => {
    if (!paramPrice.value) {
        return Core.Util.Number.numFormat(proxy.$Util.countFilter(props.record.min_fob_eur)); //最小离岸价格（欧元）
    } else {
        return Core.Util.Number.numFormat(proxy.$Util.countFilter(props.record.min_fob_usd)); //最小离岸价格（美元）
    }
});
const maxPrice = computed(() => {
    if (!paramPrice.value) {
        return Core.Util.Number.numFormat(proxy.$Util.countFilter(props.record.max_fob_eur)); //最大离岸价格（欧元）
    } else {
        return Core.Util.Number.numFormat(proxy.$Util.countFilter(props.record.max_fob_usd)); //最大离岸价格（美元）
    }
});
/* computed end */
onMounted(() => {
    if (Core.Data.getCurrency() === 'EUR') {
        currency.value = '€';
        paramPrice.value = false;
    } else {
        currency.value = '$';
        paramPrice.value = true;
    }
});
/* methods start */
// 获取数据
const getData = () => {
    getCarList();
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
/* fetch end */
</script>

<style lang="less" scoped>
#vehicle-card {
    .flex(space-between, center, column);
    width: 100%;
    height: 100%;
    background: #fff;
    cursor: pointer;

    &:nth-child(3n) {
        margin-right: 0;
    }

    &:nth-child(n + 4) {
        margin-top: 40px;
    }

    .img-body {
        width: 100%;
        overflow: hidden;

        .img {
            width: 100%;
            aspect-ratio: 1;
            overflow: hidden;

            .news-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    .text {
        .flex(space-between, initial, column);
        flex: 1;
        padding: 24px;
        width: 100%;
        min-height: 224px;

        .title {
            .ellipsis();
            color: #000;
            font-size: 18px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            margin-bottom: 8px;
        }

        .code {
            color: #666;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 150%;
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

        .price {
            color: #8f00ff;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            margin-bottom: 16px;
        }

        .btn {
            margin-top: 23px;
        }
    }
}

.hover {
    &:hover {
        box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.08);

        .name {
            background: linear-gradient(100deg, #c6f 0%, #66f 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .img {
            transition: 0.2s;
            transform: scale(1.1);
        }
    }
}
</style>
