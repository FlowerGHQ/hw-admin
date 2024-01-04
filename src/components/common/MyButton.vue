<template>
    <div id="my-button" :class="{'disabled':disabled,[type]:true&&!disabled}" :style="{ padding: padding,fontSize: font,margin: margin }" @click="clickFn">
        <span class="my-button-text">
            <slot></slot>
        </span>
    </div>
</template>

<script>
export default {
    name: 'MyButton',
    components: {},
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
        }
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
            this.$emit('click')
        }
    },
}
</script>
<style lang="less" scoped>
#my-button {
    .fcc();
    cursor: pointer;
    transition: 0.1s;
    font-family: Montserrat;
    font-size: 16px;

}
.disabled {
    background: rgba(146, 146, 146, 0.10);
    color: rgba(146, 146, 146, 0.50);
}
.default {
    border: 1px solid #C6F;
    .my-button-text {
        background: linear-gradient(100deg, #C6F 0%, #66F 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
    }
    &:hover {
        background: linear-gradient(100deg, #C6F 0%, #66F 100%);
        border: 1px solid linear-gradient(100deg, #C6F 0%, #66F 100%);
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
    &:hover {
        background: linear-gradient(100deg, #E0A1FF 0%, #8B8BFF 100%);
        border: 1px solid linear-gradient(100deg, #C6F 0%, #66F 100%);
    }
}
// APP端
@media (max-width: 750px) {
    #my-button {
        font-size: 12px;
    }
}
</style>
