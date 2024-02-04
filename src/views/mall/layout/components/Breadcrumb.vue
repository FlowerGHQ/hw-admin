<template>
    <div id="Breadcrumb" v-show="list.length > 1">
        <router-link :to="item.path" :class="index === list.length - 1 ? 'not-allow' : ''" class="breadcrumb-item" v-for="(item, index) in list" :key="item.path">
            <svg-icon icon-class="cart-arrow-right" class="cart-arrow-right"  v-if="index !== 0"/>
            <span :class="index === list.length - 1 ? 'black' : 'text'">{{ lang === 'zh' ? item.meta.title : item.meta.title_en }}</span>
        </router-link>
    </div>
</template>

<script setup>
import SvgIcon from "@/components/MySvgIcon/index.vue";
import { ref, onMounted, computed } from 'vue';
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({
    list: {
        type: Array,
        default: []
    }
})
/* computed start */
const lang = computed(() => {
    return store.state.lang
})
/* computed end */

</script>
<style lang="less" scoped>
#Breadcrumb {
    .fcc(@j:initial);
    margin: 0 auto;
    position: absolute;
    top: 32px;
    left: 12.5%;
    .breadcrumb-item {
        .text, .black {
            color: #999;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 150%; /* 24px */
        }
        .black {
            color: #000000;
        }
        .cart-arrow-right {
            font-size: 16px;
            margin: 0 4px;
        }
    }
}
.not-allow {
    pointer-events: none;
}
</style>
