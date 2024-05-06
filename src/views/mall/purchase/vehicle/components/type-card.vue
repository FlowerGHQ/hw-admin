<template>
    <div id="type-card" class="hover">
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
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const { proxy } = getCurrentInstance();

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
/* state end */

/* computed start */
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
/* methods end */
/* fetch start */
/* fetch end */
</script>

<style lang="less" scoped>
#type-card {
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

        .title {
            .ellipsis();
            color: #000;
            font-size: 18px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            margin-bottom: 8px;
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
