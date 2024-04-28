<template>
    <div id="parts-detail">
        <div class="img">
            <img :src="$Util.imageFilter(detail.logo, 5)" alt="product img" />
        </div>
        <div class="variants">
            <p class="nums">{{ itemList?.length || 0 }} {{ $t('purchase.variants') }}</p>
            <div class="variants-body">
                <div class="variants-item" v-for="(item, i) in itemList" :key="item.id">
                    <ProductsCard @handlechange="handlechange" type="small" :record="item" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import ProductsCard from '../../../components/ProductsCard.vue';
import Core from '@/core';
import { ref, onMounted, computed, getCurrentInstance, reactive } from 'vue';
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
const spinning = ref(false);
const itemList = ref([]);
const vehicle_id = ref('9576');
const detail = reactive({});
const itemDetailFetch = Core.Api.Item.detail;
const itemListFetch = Core.Api.Item.list;
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
    getItemDetail();
});
/* methods start */
const handlechange = () => {
    const q = {
        set_id: detail.set_id, //商品组id
        flag_default: 0,
    };
    getCarList(q);
};
/* methods end */
/* fetch start */
const getItemDetail = () => {
    spinning.value = true;
    itemDetailFetch({ id: vehicle_id.value })
        .then(res => {
            Object.assign(detail, res.detail || {});
            const q = {
                set_id: detail.set_id, //商品组id
                flag_default: 0,
            };
            getCarList(q);
        })
        .finally(() => {
            spinning.value = false;
        });
};
const getCarList = q => {
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
        itemList.value = arr;
    });
};
/* fetch end */
</script>

<style lang="less" scoped>
#parts-detail {
    img {
        width: 100%;
        margin-bottom: 16px;
    }
}
</style>
