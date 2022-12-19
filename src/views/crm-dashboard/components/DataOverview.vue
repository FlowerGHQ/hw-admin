<template>
    <div class="container">
        <div class="title">今日数据概览</div>
        <a-row  :gutter="[24, 0]">
            <a-col :xs="24" :sm="12" :xl="8" :xxl="4">
                <div class="list-container">
                    <div class="top">{{ $t('db.new_customer') }}</div>
                    <div class="center">{{ $t('db.previous_days') }} <span>+100</span></div>
                    <div class="bottom">
                        <div class="num">652</div>
                        <img class="img" src="../../../assets/images/dashboard/customer.png" alt="">
                    </div>
                </div>
            </a-col>
            <a-col :xs="24" :sm="12" :xl="8" :xxl="4">
                <div class="list-container">
                    <div class="top">{{ $t('db.new_follow_up_records') }}</div>
                    <div class="center">{{ $t('db.previous_days') }} <span>+100</span></div>
                    <div class="bottom">
                        <div class="num">652</div>
                        <img class="img" src="../../../assets/images/dashboard/follow_up-records.png" alt="">
                    </div>
                </div>
            </a-col>
            <a-col :xs="24" :sm="12" :xl="8" :xxl="4">
                <div class="list-container">
                    <div class="top">{{ $t('db.new_business') }}</div>
                    <div class="center">{{ $t('db.previous_days') }} <span>+100</span></div>
                    <div class="bottom">
                        <div class="num">652</div>
                        <img class="img" src="../../../assets/images/dashboard/business.png" alt="">
                    </div>
                </div>
            </a-col>
            <a-col :xs="24" :sm="12" :xl="8" :xxl="4">
                <div class="list-container">
                    <div class="top">{{ $t('db.new_orders') }}</div>
                    <div class="center">{{ $t('db.previous_days') }} <span>+100</span></div>
                    <div class="bottom">
                        <div class="num">652</div>
                        <img class="img" src="../../../assets/images/dashboard/order.png" alt="">
                    </div>
                </div>
            </a-col>
            <a-col :xs="24" :sm="12" :xl="8" :xxl="4">
                <div class="list-container">
                    <div class="top">{{ $t('db.new_drive_order') }}</div>
                    <div class="center">{{ $t('db.previous_days') }} <span>+100</span></div>
                    <div class="bottom">
                        <div class="num">652</div>
                        <img class="img" src="../../../assets/images/dashboard/drive-order.png" alt="">
                    </div>
                </div>
            </a-col>
            <a-col :xs="24" :sm="12" :xl="8" :xxl="4">
                <div class="list-container">
                    <div class="top">{{ $t('db.new_payment_receipt') }}</div>
                    <div class="center">{{ $t('db.previous_days') }} <span>+100</span></div>
                    <div class="bottom">
                        <div class="num">652</div>
                        <img class="img" src="../../../assets/images/dashboard/return-order.png" alt="">
                    </div>
                </div>
            </a-col>
        </a-row> 
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
            default: ()=> {}
        },
    },
    data() {
        return {
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                this.salesStatistics()
            }
        },

    },
    computed: {
    },
    created() {
    },
    mounted() {
        this.salesStatistics()
    },
    beforeUnmount() {
    },
    methods: {
        salesStatistics() {
            Core.Api.CRMDashboard.salesStatistics({
                ...this.searchForm
            }).then(res => {
                console.log("dataOverview salesStatistics ~ res", res)
                // this.form.new_customer_count = res.new_customer_count
                // this.form.new_contact_count = res.new_contact_count
                // this.form.new_order_count = res.new_order_count
                // this.form.new_bo_count = res.new_bo_count
                // this.form.win_bo_count = res.win_bo_count
                // this.form.new_test_driver_count = res.new_test_driver_count

            })
        },
    }
};
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    .title {
        font-size: 20px;
        font-weight: 600;
        color: #333333;
        padding-left: 24px;
        margin-top: 4px;
        margin-bottom: 19px;
        .ell();
    }
    .list-container {
        padding: 20px 24px 16px;
        margin-bottom: 24px;
        .top {
            font-size: 18px;
            font-weight: 500;
            color: #333333;
            .ell();
        }
        .center {
            margin-top: 1px;
            font-size: 18px;
            font-weight: 400;
            color: #666666;
            .ell();
            span {
                color: #DC6E38;
            }
        }
        .bottom {
            margin-top: 22px;
            .fsb();
            .img {
                width: 36px;
                height: 36px;
                position: relative;
                top: -4px;
            }
            .num {
                font-size: 40px;
                font-weight: 600;
                color: #DC6E38;
                flex:1;
                height: 40px;
                line-height: 40px;
                .ell();
            }
        }
    }
}
</style>
