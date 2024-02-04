<template>
    <div id="vehicle-card" class="hover">
        <div class="img-body">
            <div class="img">
                <img class="news-img" :src="$Util.imageFilter(record.logo, 5)">
            </div>
        </div>
        <div class="text">
            <div>
                <p class="title" :title="record[$Util.regionalUnitMoney().name_index]">{{ record[$Util.regionalUnitMoney().name_index] }}</p>
                <p class="code" :title="$t('i.code')">{{ record.code ? record.code : '-' }}</p>
                <p class="code" v-if="record.set_id">{{ record.children_number }} {{ $t('purchase.variants') }}</p>
            </div>
            <div class="btn">
                <p class="price">{{ currency }}{{ minPrice }} ~ {{ currency }}{{ maxPrice }}</p>
                <my-button showRightIcon padding="12px 32px" font="14px" @click.native="routerChange()">
                    {{ $t('purchase.order_now') }}
                </my-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import MyButton from '@/components/common/MyButton.vue';
import Core from '@/core';
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();

const router = useRouter();

const store = useStore();

const props = defineProps({
    record: {
        type: [Object, String],
    },
})
/* state start */
const currency = ref('€')
const paramPrice = ref(false)
/* state end */

/* computed start */
const lang = computed(() => {
    return store.state.lang
})

const minPrice = computed(() => {
    if(!paramPrice.value) {
        return Core.Util.Number.numFormat(proxy.$Util.countFilter(props.record.min_fob_eur))//最小离岸价格（欧元）
    }else {
        return Core.Util.Number.numFormat(proxy.$Util.countFilter(props.record.min_fob_usd))//最小离岸价格（美元）
    }
})
const maxPrice = computed(() => {
    if(!paramPrice.value) {
        return Core.Util.Number.numFormat(proxy.$Util.countFilter(props.record.max_fob_eur))//最大离岸价格（欧元）
    }else {
        return Core.Util.Number.numFormat(proxy.$Util.countFilter(props.record.max_fob_usd))//最大离岸价格（美元）
    }
})
/* computed end */
onMounted(() => {
    if (Core.Data.getCurrency() === 'EUR'){
        currency.value =  "€"
        paramPrice.value = false
    } else {
        currency.value =  "$"
        paramPrice.value = true
    }
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
/* fetch end */
</script>

<style lang="less" scoped>
#vehicle-card {
    .flex(space-between, center, column);
    width: 100%;
    height: 100%;
    background: #FFF;
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

        .price {
            color: #8F00FF;
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
            background: linear-gradient(100deg, #C6F 0%, #66F 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .img {
            transition: 0.2s;
            transform: scale(1.1);
        }
    }
}</style>