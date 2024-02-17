<template>
    <div class="list-container">
        <div class="title">
            {{ $t('db.transformation_analysis') }}
        </div>
        <div class="funnel">
            <!-- 触达人数 -->
            <div class="layer_1">{{ $t('db.number_of_contacts') }}</div>
            <!-- 有效访问人数 -->
            <div class="layer_2">{{ $t('db.valid_visitors') }}</div>
            <!-- 兴趣人数 -->
            <div class="layer_3">{{ $t('db.interested_persons') }}</div>
            <!-- 下单人数 -->
            <div class="layer_4">{{ $t('db.order_number') }}</div>
            <!-- 支付人数 -->
            <div class="layer_5">{{ $t('db.payer') }}</div>
        </div>
        <div class="right-content">
            <div class="lay_1">
                <div class="flex-direction">
                    <!-- 客户总人数 -->
                    <div class="text">{{ $t('db.total_number_of_customers') }}</div>
                    <div class="num">{{ customer_count }}</div>
                </div>
            </div>
            <div class="lay_2">
                <div class="flex-direction">
                    <!-- 公海客户数 -->
                    <div class="text">{{ $t('db.number_of_high_seas') }}</div>
                    <div class="num">{{ customer_pool_count }}</div>
                </div>
                <div class="flex-direction">
                    <!-- 已领取客户数 -->
                    <div class="text">{{ $t('db.number_of_received') }}</div>
                    <div class="num">{{ customer_customer_count }}</div>
                </div>
                <!--                <div class="flex-direction">
                    &lt;!&ndash; 未分配客户数 &ndash;&gt;
                    <div class="text">{{ $t('db.number_of_unallocated') }}</div>
                    <div class="num">{{ customer_count }}</div>
                </div>-->
            </div>
            <div class="lay_3">
                <div class="flex-direction">
                    <!-- 商机总数 -->
                    <div class="text">{{ $t('db.total_business_opportunities') }}</div>
                    <div class="num">{{ bo_count }}</div>
                </div>
            </div>
            <div class="lay_4">
                <div class="flex-direction">
                    <!-- 试驾单总数 -->
                    <div class="text">{{ $t('db.total_of_test_drive') }}</div>
                    <div class="num">{{ test_drive_count }}</div>
                </div>
                <!--                <div class="flex-direction">
                    &lt;!&ndash; 预约成功人数 &ndash;&gt;
                    <div class="text">{{ $t('db.number_of_successful_appointments') }}</div>
                    <div class="num">{{ customer_count }}</div>
                </div>-->
            </div>
            <div class="lay_5">
                <div class="flex-direction">
                    <!-- 回款单总数 -->
                    <div class="text">{{ $t('db.total_amount_of_payment_receipt') }}</div>
                    <div class="num">{{ order_income_count }}</div>
                </div>
                <div class="flex-direction">
                    <!-- 回款单总金额 -->
                    <div class="text">{{ $t('db.total_amount_of_payment_money') }}</div>
                    <div class="num">¥{{ order_income_sum }}</div>
                </div>
                <div class="flex-direction">
                    <!-- 已回款金额 -->
                    <div class="text">{{ $t('db.amount_received') }}</div>
                    <div class="num">¥{{ order_income_completed_sum }}</div>
                </div>
                <div class="flex-direction">
                    <!-- 待回款金额 -->
                    <div class="text">{{ $t('db.amount_to_be_collected') }}</div>
                    <div class="num">¥{{ order_income_incomplete_sum }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';

export default {
    name: 'Card',
    components: {},
    data() {
        return {
            customer_count: '',
            customer_pool_count: '',
            customer_customer_count: '',
            bo_count: '',
            test_drive_count: '',
            order_income_count: '',
            order_income_sum: '',
            order_income_completed_sum: '',
            order_income_incomplete_sum: '',
        };
    },
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                this.transformationStatistics();
            },
        },
    },
    computed: {},
    created() {},
    mounted() {
        this.transformationStatistics();
    },
    beforeUnmount() {},
    methods: {
        transformationStatistics() {
            this.loading = true;
            Core.Api.CRMDashboard.transformationStatistics({
                ...this.searchForm,
            })
                .then(res => {
                    this.customer_count = res.customer_count;
                    this.customer_pool_count = res.customer_pool_count;
                    this.customer_customer_count = res.customer_customer_count;
                    this.bo_count = res.bo_count;
                    this.test_drive_count = res.test_drive_count;
                    this.order_income_count = res.order_income_count;
                    this.order_income_sum = res.order_income_sum;
                    this.order_income_completed_sum = res.order_income_completed_sum;
                    this.order_income_incomplete_sum = res.order_income_incomplete_sum;
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
.list-container {
    padding: 13px 18px 20px 18px;
    box-sizing: border-box;

    .title {
        width: 100%;
        font-size: 15px;
        font-weight: 600;
        color: #333333;
        margin-bottom: 16px;
    }

    .funnel {
        width: 15.8vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 3;
        position: absolute;

        .layer_1,
        .layer_2,
        .layer_3,
        .layer_4,
        .layer_5 {
            .fcc();
            font-size: 0.6vw;
            font-weight: 500;
            color: #ffffff;
            transition: all 0.5s;
            cursor: pointer;
        }
        .layer_1:hover,
        .layer_2:hover,
        .layer_3:hover,
        .layer_4:hover,
        .layer_5:hover {
            transform: scale(1.1);
        }

        .layer_1 {
            width: 15.8vw;
            height: 58px;
            background: url('../../../assets/images/dashboard/layer1.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .layer_2 {
            width: 13.1vw;
            height: 58px;
            background: url('../../../assets/images/dashboard/layer2.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            margin-left: 1px;
        }

        .layer_3 {
            width: 10.43vw;
            height: 59px;
            background: url('../../../assets/images/dashboard/layer3.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .layer_4 {
            width: 7.7vw;
            height: 59px;
            background: url('../../../assets/images/dashboard/layer4.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            margin-left: 1px;
        }

        .layer_5 {
            width: 4.9vw;
            height: 59px;
            background: url('../../../assets/images/dashboard/layer5.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            margin-left: 2px;
        }
    }

    .right-content {
        width: 100%;
        height: 293px;
        z-index: 2;
        position: relative;
        padding-left: 8vw;
        background-clip: content-box;

        .lay_1,
        .lay_2,
        .lay_3,
        .lay_4,
        .lay_5 {
            .fa();
            width: 100%;
            box-sizing: border-box;
            padding-left: 6vw;

            .flex-direction {
                display: flex;
                flex-direction: column;
            }

            .text {
                font-size: 12px;
                font-weight: 500;
                color: #dd6623;
                margin-left: 3vw;
            }

            .num {
                font-size: 12px;
                font-weight: 500;
                color: #dd6623;
                margin-left: 3vw;
            }
        }

        .lay_1 {
            height: 59px;
            background: linear-gradient(270deg, #fef9e0 0%, #fef9e0 100%);
        }

        .lay_2 {
            height: 59px;
            background: linear-gradient(270deg, #fdf4df 0%, #fdf4df 100%);
        }

        .lay_3 {
            height: 59px;
            background: linear-gradient(270deg, #fcefd9 0%, #fcefd9 100%);
        }

        .lay_4 {
            height: 59px;
            background: linear-gradient(263deg, #fbe9d5 0%, #fbe9d5 100%);
        }

        .lay_5 {
            height: 57px;
            background: linear-gradient(270deg, #fbe5d5 0%, #fbe5d5 100%);
        }
    }
}
</style>
