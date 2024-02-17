<template>
    <div class="list-container">
        <div class="title">{{ $t('db.follow_up_statistics') }}</div>
        <div class="container">
            <div class="item">
                <img class="img" src="../../../assets/images/dashboard/high-seas-customers.png" alt="" />
                <div class="text">{{ $t('db.highsea_customer_follow') }}</div>
                <div class="num">{{ form.pool_count }}</div>
            </div>
            <div class="item">
                <img class="img" src="../../../assets/images/dashboard/customer.png" alt="" />
                <div class="text">{{ $t('db.individual_customer_follow') }}</div>
                <div class="num">{{ form.customer_count }}</div>
            </div>
            <div class="item mt-28">
                <img class="img" src="../../../assets/images/dashboard/drive-order.png" alt="" />
                <div class="text">{{ $t('db.drive_order_follow') }}</div>
                <div class="num">652</div>
            </div>
            <div class="item mt-28">
                <img class="img" src="../../../assets/images/dashboard/business.png" alt="" />
                <div class="text">{{ $t('db.business_opportunities_follow') }}</div>
                <div class="num">{{ form.bo_count }}</div>
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
    },
    data() {
        return {
            form: {
                pool_count: '',
                customer_count: '',
                bo_count: '',
            },
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.salesStatistics();
    },
    beforeUnmount() {},
    methods: {
        salesStatistics() {
            Core.Api.CRMDashboard.trackStatistics({
                ...this.searchForm,
            }).then(res => {
                this.form.pool_count = res.pool_count;
                this.form.customer_count = res.customer_count;
                this.form.bo_count = res.bo_count;
            });
        },
    },
};
</script>

<style lang="less" scoped>
.list-container {
    padding: 19px 24px;
    .title {
        font-size: 20px;
        font-weight: 600;
        color: #333333;
    }
    .container {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-top: 19px;
        .item {
            width: 50%;
            display: flex;
            align-items: center;
            .img {
                width: 18px;
                height: 18px;
                margin-right: 10px;
            }
            &.mt-28 {
                margin-top: 28px;
            }
            .text {
                width: 140px;
                font-size: 16px;
                font-weight: 500;
                color: #333333;
                .ell();
            }
            &:nth-of-type(2n) {
                justify-content: flex-end;
            }
            .num {
                flex: 1;
                font-size: 24px;
                font-weight: 600;
                color: #333333;
                .ell();
            }
        }
    }
}
</style>
