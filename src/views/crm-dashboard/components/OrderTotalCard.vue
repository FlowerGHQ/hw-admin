<template>
    <div class="list-container">
        <div :class="[isCar ? 'title active' : 'title']">
            {{ $t('db.order_total') }}
        </div>
        <div class="flex-total">
            <div :class="[isCar ? 'total active' : 'total']">
                {{ total }}
            </div>
            <img class="img" src="../../../assets/images/dashboard/total.png" alt="">
        </div>
    </div>
</template>

<script>
import Core from '../../../core';

export default {
    name: 'Card',
    components: {
    },
    props: {
        searchForm: {
            type: Object,
            default: () => { }
        },
        isCar: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            num: 32,
            total: '256,648',
        };
    },
    watch: {},
    computed: {
    },
    created() {
    },
    mounted() {},
    beforeUnmount() {
    },
    methods: {}
};
</script>

<style lang="less" scoped>
.list-container {
    padding: 20px 24px;
    cursor: pointer;
    .title {
        width: 100%;
        font-size: 18px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        &.active {
            color: #DC6E38;
        }
    }

    .flex {
        display: flex;
    }

    .increase {
        font-size: 18px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
    }

    .increase-num {
        font-size: 18px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #DC6E38;
        margin-left: 6px;
    }

    .flex-total {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 50px;

        .total {
            font-size: 40px;
            font-family: Barlow-SemiBold, Barlow;
            font-weight: 600;
            color: #333333;
            &.active {
                color: #DC6E38;
            }
        }

        .img {
            width: 36px;
            height: 36px;
        }
    }
}
</style>
