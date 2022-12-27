<template>
    <div class="list-container">
        <div class="title">
            {{ $t('db.transformation_analysis') }}
        </div>
        <div class="funnel">
            <div class="layer_1">{{ $t('db.number_of_contacts') }}</div>
            <div class="layer_2">{{ $t('db.valid_visitors') }}</div>
            <div class="layer_3">{{ $t('db.interested_persons') }}</div>
            <div class="layer_4">{{ $t('db.order_number') }}</div>
            <div class="layer_5">{{ $t('db.payer') }}</div>
        </div>
        <div class="right-content">
            <div class="lay_1">
                <div class="flex-direction">
                    <div class="text">客户总人数</div>
                    <div class="num">172873</div>
                </div>
            </div>
            <div class="lay_2">
                <div class="flex-direction">
                    <div class="text">公海客户数</div>
                    <div class="num">9837</div>
                </div>
                <div class="flex-direction">
                    <div class="text">已领取客户数</div>
                    <div class="num">9837</div>
                </div>
                <div class="flex-direction">
                    <div class="text">未分配客户数</div>
                    <div class="num">9837</div>
                </div>
            </div>
            <div class="lay_3">
                <div class="flex-direction">
                    <div class="text">商机总数</div>
                    <div class="num">28736</div>
                </div>
            </div>
            <div class="lay_4">
                <div class="flex-direction">
                    <div class="text">试驾单总数</div>
                    <div class="num">2837</div>
                </div>
                <div class="flex-direction">
                    <div class="text">预约成功人数</div>
                    <div class="num">9837</div>
                </div>
            </div>
            <div class="lay_5">
                <div class="flex-direction">
                    <div class="text">回款单总数</div>
                    <div class="num">9837</div>
                </div>
                <div class="flex-direction">
                    <div class="text">回款单总金额</div>
                    <div class="num">9837</div>
                </div>
                <div class="flex-direction">
                    <div class="text">已回款金额</div>
                    <div class="num">9837</div>
                </div>
                <div class="flex-direction">
                    <div class="text">待回款金额</div>
                    <div class="num">9837</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';


export default {
    name: 'Card',
    components: {
    },
    data() {
        return {

        };
    },
    watch: {
    },
    computed: {
    },
    created() {
    },
    mounted() {
    },
    beforeUnmount() {
    },
    methods: {},
};
</script>

<style lang="less" scoped>
.list-container {
    padding: 20px 24px;
    box-sizing: border-box;

    .title {
        width: 100%;
        font-size: 18px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        margin-bottom: 36px;
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
            font-size: 0.7vw;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
        }

        .layer_1 {
            width: 15.8vw;
            height: 58px;
            background: url("../../../assets/images/dashboard/layer1.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .layer_2 {
            width: 13vw;
            height: 58px;
            background: url("../../../assets/images/dashboard/layer2.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .layer_3 {
            width: 10.4vw;
            height: 59px;
            background: url("../../../assets/images/dashboard/layer3.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .layer_4 {
            width: 7.7vw;
            height: 59px;
            background: url("../../../assets/images/dashboard/layer4.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .layer_5 {
            width: 4.8vw;
            height: 59px;
            background: url("../../../assets/images/dashboard/layer5.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
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
                font-family: PingFang SC-Medium, PingFang SC;
                font-weight: 500;
                color: #DD6623;
                margin-left: 3vw;
            }

            .num {
                font-size: 12px;
                font-family: PingFang SC-Medium, PingFang SC;
                font-weight: 500;
                color: #DD6623;
                margin-left: 3vw;
            }
        }

        .lay_1 {
            height: 59px;
            background: linear-gradient(270deg, #FEF9E0 0%, #FEF9E0 100%);
        }

        .lay_2 {
            height: 59px;
            background: linear-gradient(270deg, #FDF4DF 0%, #FDF4DF 100%);
        }

        .lay_3 {
            height: 59px;
            background: linear-gradient(270deg, #FCEFD9 0%, #FCEFD9 100%);
        }

        .lay_4 {
            height: 59px;
            background: linear-gradient(263deg, #FBE9D5 0%, #FBE9D5 100%);
        }

        .lay_5 {
            height: 57px;
            background: linear-gradient(270deg, #FBE5D5 0%, #FBE5D5 100%);
        }
    }
}
</style>
