<template>
    <div id="down-loading" v-if="show">
        <img src="@images/mall/purchase/loading.png" class="loading-img" /><span class="loading-text">{{ text }}</span>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    text: {
        type: String,
        default: 'Loading',
    },
});
</script>
<style lang="less" scoped>
#down-loading {
    .fcc();
    .loading-text {
        color: #333;
        font-family: Play;
        font-size: 26px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%; /* 39px */
        letter-spacing: 1.04px;
    }
    .loading-img {
        width: 32px;
        height: 32px;
        margin-right: 10px;
        animation: circle 1s linear infinite;
        transition-delay: 0s;
        @keyframes circle {
            0% {
                transform: rotate(0);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    }
}
// APP端
@media (max-width: 750px) {
    #down-loading {
        .loading-text {
            font-size: 13px;
        }
        .loading-img {
            width: 16px;
            height: 16px;
            margin-right: 5px;
        }
    }
}
</style>
