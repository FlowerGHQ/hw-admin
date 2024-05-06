<template>
    <div
        id="my-button"
        :class="[disabled ? 'disabled' : '', type]"
        :style="{ padding: padding, fontSize: font, margin: margin }"
        @click="clickFn"
    >
        <span class="my-button-text">
            <slot></slot>
        </span>
        <template v-if="showRightIcon">
            <!-- <svg-icon icon-class="arrow-left-color" class-name="right-icon" v-if="type === 'default'"/> -->
            <svg-icon icon-class="arrow-left" class-name="right-icon" />
        </template>
    </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon/index.vue';
export default {
    name: 'MyButton',
    components: {
        SvgIcon,
    },
    props: {
        // 边距
        padding: {
            type: String,
            default: '12px 24px',
        },
        // 类型
        type: {
            type: String,
            default: 'default',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        font: {
            type: String,
            default: '16px',
        },
        margin: {
            type: String,
            default: '',
        },
        showRightIcon: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {};
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        clickFn() {
            this.$emit('clickFn');
        },
    },
};
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
    .my-button-text {
        white-space: nowrap;
    }
    &:hover {
        .right-icon {
            margin-left: 8px;
            width: 20px;
        }
    }
}
.default {
    border: 1px solid #c6f;
    background: transparent;
    background: linear-gradient(100deg, #c6f 0%, #66f 100%);
    border-image: linear-gradient(100deg, #c6f 0%, #66f 100%) 1;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    .my-button-text {
        background: linear-gradient(100deg, #c6f 0%, #66f 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
    }
    &:hover {
        background: linear-gradient(100deg, #c6f 0%, #66f 100%);
        .my-button-text {
            -webkit-text-fill-color: #fff;
        }
    }
}
.line {
    border: 1px solid #999999;
    .my-button-text {
        color: #666666;
    }
    &:hover {
        background: linear-gradient(100deg, #c6f 0%, #66f 100%);
        border-image: linear-gradient(100deg, #c6f 0%, #66f 100%) 1;
        background-clip: text;
        -webkit-background-clip: text;
        .my-button-text {
            -webkit-text-fill-color: transparent;
            text-align: center;
        }
    }
}
.white {
    border: 1px solid #fff;
    .my-button-text {
        color: #fff;
        text-align: center;
    }
    &:hover {
        background: linear-gradient(100deg, #c6f 0%, #66f 100%);
        border: 1px solid linear-gradient(100deg, #c6f 0%, #66f 100%);
    }
}
.primary {
    background: linear-gradient(100deg, #c6f 0%, #66f 100%);
    border: 1px solid linear-gradient(100deg, #c6f 0%, #66f 100%);
    .my-button-text {
        color: #fff;
    }
    &:active {
        background: linear-gradient(100deg, #e0a1ff 0%, #8b8bff 100%);
        border: 1px solid linear-gradient(100deg, #c6f 0%, #66f 100%);
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
