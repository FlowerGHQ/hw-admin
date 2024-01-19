<template>
    <div id="vehicle-card" :class="selected ? 'active' : ''">
        <div class="text">
            <p class="name">{{ record.name ? record.name : '-' }}</p>
            <div class="dis">
                <p class="dis-text">{{ record.code ? record.code : '-' }}</p>
                <p class="dis-text">{{ record.code ? record.code : '-' }}</p>
                <p class="dis-text">{{ record.code ? record.code : '-' }}</p>
                <p class="dis-text">{{ record.code ? record.code : '-' }}</p>
            </div>
            <p class="price">{{ currency }}{{ minPrice }} ~ {{ currency }}{{ maxPrice }}</p>
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
    selected: {
        type: Boolean,
        default: false
    },
    record: {
        type: [Object, String],
        default: () => {
            return {}
        }
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
    const arr = [props.record.price1, props.record.price2, props.record.price3]
    return Core.Util.Number.numFormat(Math.min(...arr))
})
const maxPrice = computed(() => {
    const arr = [props.record.price1, props.record.price2, props.record.price3]
    return Core.Util.Number.numFormat(Math.max(...arr))
})
/* computed end */
onMounted(() => {
    if (Core.Data.getCurrency() === 'EUR') {
        currency.value = "€"
        paramPrice.value = false
    } else {
        currency.value = "$"
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
    padding: 20px;
    width: 207px;
    border: 2px solid transparent;
    cursor: pointer;

    &:nth-child(3n) {
        margin-right: 0;
    }

    &:nth-child(n + 4) {
        margin-top: 40px;
    }

    .text {
        .flex(space-between, initial, column);
        flex: 1;
        width: 100%;

        .name {
            .ellipsis();
            color: #000;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }

        .dis {
            margin-top: 8px;
            .dis-text {
                color: #333;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 120%; /* 14.4px */
                position: relative;
                &::before {
                    content: '';
                    display: inline-block;
                    width: 2px;
                    height: 2px;
                    background: #333;
                    border-radius: 50%;
                    position: absolute;
                    left: -8px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                &:nth-child(n + 2) {
                    margin-top: 10px;
                }
            }
        }

        .price {
            color: #8F00FF;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            margin-top: 16px;
        }

    }
}

.active {
    border: 2px solid #9167FF !important;;
    .name {
        background: linear-gradient(100deg, #C6F 0%, #66F 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
}
</style>