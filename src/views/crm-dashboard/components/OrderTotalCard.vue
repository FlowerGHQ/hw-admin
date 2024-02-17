<template>
    <div class="list-container">
        <div :class="[isCar ? 'title active' : 'title']">
            {{ $t('db.order_total') }}
        </div>
        <div class="flex-total">
            <img class="img" src="../../../assets/images/dashboard/total.png" alt="" />
            <div :class="[isCar ? 'total active' : 'total']">
                {{ count }}
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';

export default {
    name: 'Card',
    components: {},
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
        isCar: {
            type: Boolean,
            default: () => false,
        },
        count: {
            type: Number,
            default: () => 0,
        },
    },
    data() {
        return {
            num: 32,
            total: '256,648',
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    beforeUnmount() {},
    methods: {},
};
</script>

<style lang="less" scoped>
.list-container {
    padding: 20px 24px;
    cursor: pointer;
    .title {
        width: 100%;
        font-size: 15px;
        font-weight: 600;
        color: #333333;
        &.active {
            color: #dc6e38;
        }
    }

    .flex-total {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 50px;

        .img {
            width: 38px;
            height: 38px;
        }
        .total {
            margin-left: 10px;
            font-size: 30px;
            font-family: Barlow-SemiBold, Barlow;
            font-weight: 600;
            color: #333333;
            &.active {
                color: #dc6e38;
            }
        }
    }
}
</style>
