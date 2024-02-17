<template>
    <div class="fixed-select">
        <FollowUp :isShowButton="false" ref="followRef" @getRecordList="getChildData('2')" />
        <LeadTransfer ref="leadTransRef" />
        <div class="fixed-select-item" v-for="item in listRender" @click="handleClick(item.alt)">
            <a-tooltip placement="left">
                <template #title>
                    <span>{{ item.alt }}</span>
                </template>
                <img :src="item.src" />
            </a-tooltip>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref, toRefs, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import toTop from '../images/to-top.png';
import offTop from '../images/off-top.png';
import write from '../images/write.png';
import follow from '../images/follow.png';
import order from '../images/order.png';
import transfer from '../images/transfer.png';
import next from '../images/next.png';
import nextNone from '../images/next-none.png';
import FollowUp from './FollowUp.vue';
import LeadTransfer from './LeadTransfer.vue';

const router = useRouter();
const getChildData = inject('getChildData');
const leadTransRef = ref(null);
const followRef = ref(null);
const userId = inject('userId');
const $prop = defineProps({
    //第几条任务
    current: {
        required: true,
        type: Number,
    },
    //任务总数
    amount: {
        required: true,
        type: Number,
    },
    // 是否置顶
    isTop: {
        required: true,
        type: Boolean,
    },
    // 是否有省市
    isProvince: {
        required: true,
        type: Boolean,
    },
});
const $emit = defineEmits(['next', 'toTop', 'follow', 'order']);

const list = [
    { src: write, alt: '编辑基本信息' },
    { src: follow, alt: '写跟进' },
    { src: order, alt: '快捷下单' },
    { src: transfer, alt: '线索转移' },
];
const leadShowPop = ref(false);
const listRender = computed(() => {
    let arr = [];
    if (!$prop.isProvince) {
        arr = list.filter(item => item.alt !== '线索转移');
    } else {
        arr = list;
    }
    return arr.map(item => {
        if (item.alt === '置顶' || item.alt === '取消置顶') {
            if ($prop.isTop) {
                return { src: offTop, alt: '取消置顶' };
            } else {
                return { src: toTop, alt: '置顶' };
            }
        } else if (item.alt === '下个任务') {
            if ($prop.current === $prop.amount) {
                return { src: nextNone, alt: '下个任务' };
            } else {
                return { src: next, alt: '下个任务' };
            }
        } else {
            return item;
        }
    });
});
const handleClick = alt => {
    switch (alt) {
        case '取消置顶':
            $prop.isTop = false;
            toTopFn();
            break;
        case '置顶':
            $prop.isTop = true;
            toTopFn();
            break;
        case '编辑基本信息':
            routerChange('edit');
            break;
        case '写跟进':
            followRef.value.clickModelOk();
            break;
        case '快捷下单':
            toOrder();
            break;
        case '线索转移':
            leadTransRef.value.clickModelOk();
            break;
        case '下个任务':
            if ($prop.current === $prop.amount) return;
            nextFn();
            break;

        default:
            break;
    }
};
const nextFn = () => {
    $emit('next', $prop.current + 1);
};
const toTopFn = () => {
    $emit('toTop', $prop.current - 1);
};
const toOrder = () => {
    $emit('order', $prop.current - 1);
};
const routerChange = (type, item = {}) => {
    let routeUrl = '';
    switch (type) {
        case 'edit': // 详情
            routeUrl = router.resolve({
                path: '/user-center/user-edit',
                query: { id: userId.value },
            });
            // window.open(routeUrl.href, "_blank");
            window.open(routeUrl.href, '_self');
            break;
    }
};
</script>

<style lang="less" scoped>
.fixed-select {
    padding: 12px 4px;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(100%);
    background: #fff;
    border-left: 0.5px solid #e5e6eb;
    border-radius: 0px 6px 6px 0px;
    &-item {
        padding: 4px;
        border-radius: 4px;
        margin-bottom: 16px;
        &:last-child {
            margin-bottom: 0;
        }
        cursor: pointer;
        img {
            height: 20px;
            width: 20px;
        }
        &:hover {
            background: #f2f3f5;
        }
    }
}
</style>
