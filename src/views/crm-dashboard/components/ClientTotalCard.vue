<template>
    <div class="list-container">
        <div :class="[isPeople ? 'title active' : 'title']">
            {{ $t('db.custom_total') }}
        </div>
        <div class="flex-total">
            <div :class="[isPeople ? 'total active' : 'total']">
                {{ count }}
            </div>
            <img class="img" src="../../../assets/images/dashboard/people.png" alt="">
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
        isPeople: {
            type: Boolean,
            default: () => false
        },
        count: {
            type: Number,
            default: () => 0
        }
    },
    data() {
        return {
            num: 32,
            total: '256,648',
        };
    },
    watch: {
    },
    computed: {
    },
    created() {
    },
    mounted() { },
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
        font-size: 15px;
        font-weight: 600;
        color: #333333;
        &.active {
            color: #346EF2;
        }
    }

    .flex-total {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 50px;

        .total {
            font-size: 30px;
            font-family: Barlow-SemiBold, Barlow;
            font-weight: 600;
            color: #333333;
            &.active {
                color: #346EF2;
            }
        }

        .img {
            width: 27px;
            height: 27px;
        }
    }
}
</style>
