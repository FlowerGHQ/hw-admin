<template>
    <div id="parts-detail">
        <div class="img">
            <img :src="$Util.imageFilter(detail.logo, 5)" alt="product img" />
        </div>
        <div class="variants">
            <p class="nums">{{ itemList?.length || 0 }} {{ $t('purchase.variants') }}</p>
            <div class="variants-body">
                <div class="variants-item" v-for="(item, i) in itemList" :key="item.id">
                    <ProductsCard @handlechange="getData" type="small" :record="item" />
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
    id: {
        type: [String, Number],
    },
});
/* state start */
const currency = ref('€');
const paramPrice = ref(false);
const spinning = ref(false);
const itemList = ref([]);
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
});
/* methods start */
const getData = () => {
    const q = {
        bom_category_id: props.id,
    };
    getCarList(q);
    getDetail(q);
};
/* methods end */
/* fetch start */
const getCarList = q => {
    const params = {};
    Object.assign(params, q);
    Core.Api.Distributor.bomListParts({ ...params }).then(res => {
        itemList.value = res?.list;
    });
};
const getDetail = q => {
    const params = { target_id: q.bom_category_id, target_type: 3 };
    Core.Api.Distributor.itemComponentSetList({ ...params }).then(res => {
        detail.logo = res.list?.list[0]?.img;
    });
};
/* fetch end */
defineExpose({
    getData,
});
</script>

<style lang="less" scoped>
#parts-detail {
    img {
        width: 100%;
        margin-bottom: 16px;
    }
}
</style>
