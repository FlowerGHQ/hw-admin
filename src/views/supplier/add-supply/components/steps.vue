<template>
    <div class="setps">
        <div class="step-item" v-for="item in stepsaOption" :key="item.id">
            <div class="step-item-icon-line">
                <div class="step-item-icon">
                    <img :src="current >= item.id ? item.activeImg : item.img" alt="" />
                    <div
                        :class="{
                            'step-item-title': true,
                            'step-item-title-active': current >= item.id,
                        }"
                    >
                        {{ $t(item.title) }}
                    </div>
                </div>
                <div class="step-item-line">
                    <img
                        v-if="item.id !== 2"
                        :src="
                            current >= item.id + 1
                                ? getAassetsFile('../../../../assets/images/supply-chain/line-active.png')
                                : getAassetsFile('../../../../assets/images/supply-chain/line.png')
                        "
                        alt=""
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
const $i18n = useI18n();
const $t = $i18n.t;
const $lang = $i18n.locale;
const $emit = defineEmits(['update:value']);
const $props = defineProps({
    ActiveCurrent: {
        type: Number,
        default: 0,
    },
});
const current = computed({
    get: () => {
        console.log($props.ActiveCurrent);
        return $props.ActiveCurrent;
    },
    set: val => $emit('update:value', val),
});
const getAassetsFile = url => {
    return new URL(url, import.meta.url).href;
};
const stepsaOption = reactive([
    {
        id: 0,
        title: 'supply-chain.basic_info',
        img: getAassetsFile('../../../../assets/images/supply-chain/step1-active.png'),
        activeImg: getAassetsFile('../../../../assets/images/supply-chain/step1-active.png'),
    },
    {
        id: 1,
        title: 'supply-chain.material_list',
        content: 'Second-content',
        img: getAassetsFile('../../../../assets/images/supply-chain/step2.png'),
        activeImg: getAassetsFile('../../../../assets/images/supply-chain/step2-active.png'),
    },
    {
        id: 2,
        title: 'supply-chain.submit',
        img: getAassetsFile('../../../../assets/images/supply-chain/step3.png'),
        activeImg: getAassetsFile('../../../../assets/images/supply-chain/step3-active.png'),
    },
]);
</script>

<style lang="less" scoped>
.setps {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
    .step-item {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: center;
        &:last-child {
            .step-item-icon-line {
                margin-left: -10px;
            }
        }
        .step-item-icon-line {
            display: flex;
            align-items: center;
            margin-right: -6px;
            .step-item-icon {
                display: flex;
                flex-direction: column;
                align-items: center;
                .step-item-title {
                    color: #666;
                    font-family: Alibaba PuHuiTi 2;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px; /* 157.143% */
                    margin-top: 4px;
                }
                .step-item-title-active {
                    color: #0061ff !important;
                }
            }
            .step-item-line {
                margin-top: -20px;
            }
        }
    }
}
</style>
