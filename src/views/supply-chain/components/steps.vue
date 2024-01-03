<template>
    <div class="setps">
        <div class="step-item" 
            v-for="item in stepsaOption" 
            :key="item.id"
        >
            <div class="step-item-icon-line">
                <div class="step-item-icon">
                    <img
                        :src="current >= item.id ? item.activeImg : item.img"
                        alt="" />
                </div>
                <div class="step-item-line">
                    <img
                        v-if="item.id !== 2"
                        :src="
                            current >= item.id+1
                                ? getAassetsFile(
                                      '../../../assets/images/supply-chain/line-active.png'
                                  )
                                : getAassetsFile(
                                      '../../../assets/images/supply-chain/line.png'
                                  )
                        "
                        alt="" />
                </div>
            </div>
            <div class="step-item-title">
                {{ item.title }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive,computed  } from "vue";
import { useI18n } from "vue-i18n";
const $t = useI18n().t;
const $emit = defineEmits(["update:value"]);
const $props = defineProps({
    ActiveCurrent: {
        type: Number,
        default: 0,
    },
});

const current = computed({
    get: () => $props.ActiveCurrent,
    set: (val) => $emit("update:value", val),
});

const getAassetsFile = (url) => {
    return new URL(url, import.meta.url).href;
};
const stepsaOption = reactive([
    {
        id: 0,
        title: $t("supply-chain.basic_info"),
        img: getAassetsFile(
            "../../../assets/images/supply-chain/step1-active.png"
        ),
        activeImg: getAassetsFile(
            "../../../assets/images/supply-chain/step1-active.png"
        ),
    },
    {
        id: 1,
        title: $t("supply-chain.material_list"),
        content: "Second-content",
        img: getAassetsFile("../../../assets/images/supply-chain/step2.png"),
        activeImg: getAassetsFile(
            "../../../assets/images/supply-chain/step2-active.png"
        ),
    },
    {
        id: 2,
        title: $t("supply-chain.submit"),
        img: getAassetsFile("../../../assets/images/supply-chain/step3.png"),
        activeImg: getAassetsFile(
            "../../../assets/images/supply-chain/step3-active.png"
        ),
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
        .step-item-icon-line {
            display: flex;
            align-items: center;
        }
    }
}
</style>
