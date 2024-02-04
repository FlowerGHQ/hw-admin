<template>
    <div id="my-button" :class="[disabled ? 'disabled' : '', type]" :style="{ padding: padding,fontSize: font,margin: margin }" @click="clickFn">
        <span class="my-button-text">
            <slot></slot>
        </span>
        <template v-if="showRightIcon">
            <!-- <svg-icon icon-class="arrow-left-color" class-name="right-icon" v-if="type === 'default'"/> -->
            <svg-icon icon-class="arrow-left" class-name="right-icon"/>
        </template>
    </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon/index.vue";
export default {
    name: 'MyButton',
    components: {
        SvgIcon
    },
    props: {
        // 边距
        padding: {
            type: String,
            default: '12px 24px'
        },
        // 类型
        type: {
            type: String,
            default: 'default'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        font: {
            type: String,
            default: '16px'
        },
        margin: {
            type: String,
            default: ''
        },
        showRightIcon: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {}
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        clickFn() {
            this.$emit('clickFn')
        }
    },
}
</script>
<style lang="less" scoped>
#my-button {
    .fcc();
    cursor: pointer;
    transition: 0.1s;
    font-size: 16px;
    .right-icon {
        height: 20px;
        width: 0px;
        transition: 0.3s;
    }
    &:hover {
        .right-icon {
            margin-left: 8px;
            width: 20px;
        }
    }

}
.default {
    border: 1px solid #C6F;
    background: transparent;
    background: linear-gradient(100deg, #C6F 0%, #66F 100%);
    border-image: linear-gradient(100deg, #C6F 0%, #66F 100%) 1;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    .my-button-text {
        background: linear-gradient(100deg, #C6F 0%, #66F 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
    }
    &:hover {
        background: linear-gradient(100deg, #C6F 0%, #66F 100%);
        .my-button-text {
            -webkit-text-fill-color: #fff;
        }
    }
}
.white {
    border: 1px solid #FFF;
    .my-button-text {
        color: #FFF;
        text-align: center;
    }
    &:hover {
        background: linear-gradient(100deg, #C6F 0%, #66F 100%);
        border: 1px solid linear-gradient(100deg, #C6F 0%, #66F 100%);
    }
}
.primary {
    background: linear-gradient(100deg, #C6F 0%, #66F 100%);
    border: 1px solid linear-gradient(100deg, #C6F 0%, #66F 100%);
    .my-button-text {
        color: #fff;
    }
    &:active {
        background: linear-gradient(100deg, #E0A1FF 0%, #8B8BFF 100%);
        border: 1px solid linear-gradient(100deg, #C6F 0%, #66F 100%);
    }
}
.disabled {
    opacity: 0.4;
    pointer-events: none;
}
// APP端
@media (max-width: 750px) {
    #my-button {
        font-size: 12px;
    }
}
</style>
