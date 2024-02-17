<template>
    <!-- 步骤条 -->
    <div class="steps-container">
        <div class="steps-content">
            <div
                v-for="(item, i) of stepsList"
                :key="i"
                @click="nextStep(i, current)"
                :style="`z-index: ${stepsList.length - i};`"
                :class="{
                    item: true,
                    done: current > i,
                    doing: current === i,
                    wait: current < i,
                    will: i === current + 1,
                }"
            >
                <span class="symbol">
                    <template v-if="current > i"><i class="icon i_click" /></template>
                    <template v-else>{{ i + 1 }}</template>
                </span>
                <div class="text">
                    <p class="title">{{ item[$i18n.locale] }}</p>
                    <span class="time" v-if="item.time">{{ $Util.timeFilter(item.time) }}</span>
                </div>
            </div>
            <span
                class="reactivation"
                @click="reactivation"
                v-if="current === STATUS.LOSE && $auth('crm-bo.reactivation')"
                >{{ $t('crm_b.reactivation') }}</span
            >
            <span class="lose" @click="loseTheOrder" v-else>{{ $t('crm_b.lost_order') }}</span>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
export default {
    props: {
        stepsList: {
            type: Array,
            default: [],
        },
        current: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            STATUS: Core.Const.CRM_BO.STATUS,
        };
    },
    methods: {
        nextStep(i, c) {
            if (this.current === this.STATUS.LOSE) return; // 输单无法点击
            if (i < c) return this.$message.warning(this.$t('crm_b.back')); //回退
            if (i === c) return this.$message.warning(this.$t('crm_b.current')); //正在当前步骤
            if (i !== c + 1 && i !== this.stepsList.length - 1)
                return this.$message.warning(this.$t('crm_b.complete_previous')); //跳过下一步
            if (
                i === this.stepsList.length - 1 &&
                this.current !== this.STATUS.LOSE &&
                this.current !== this.STATUS.WIN &&
                this.$auth('crm-bo.update-status')
            )
                this.$emit('winTheOrder'); //赢单
            if (
                i === c + 1 &&
                this.current + 2 < this.stepsList.length &&
                this.current !== this.STATUS.LOSE &&
                this.$auth('crm-bo.update-status')
            ) {
                //下一步
                this.$emit('nextStep');
            }
        },
        loseTheOrder() {
            //输单
            if (this.current !== this.STATUS.LOSE && this.$auth('crm-bo.update-status')) this.$emit('loseTheOrder');
        },
        reactivation() {
            //重新激活
            if (this.current === this.STATUS.LOSE && this.$auth('crm-bo.reactivation')) this.$emit('reactivation');
        },
    },
};
</script>

<style lang="less" scoped>
.steps-container {
    width: 100%;
    .steps-content {
        display: flex;
        .item {
            flex: 1;
            height: 40px;
            font-size: 14px;
            position: relative;
            cursor: pointer;
            .fcc();
            border-top: 1px solid transparent;
            border-bottom: 1px solid transparent;
            margin-right: 10px;
            &:first-child:before {
                display: none;
            }
            &:first-child {
                border-radius: 20px 0 0 20px;
                border-left: 1px solid transparent;
            }
            &:last-of-type::after {
                display: none;
            }
            &:last-of-type {
                border-radius: 0 20px 20px 0;
                border-right: 1px solid transparent;
            }
            .symbol {
                .fcc();
                width: 20px;
                height: 20px;
                border-radius: 50%;
                font-size: 14px;
                margin-right: 16px;
                color: #ffffff;
                .icon.i_click {
                    font-size: 8px;
                    line-height: 20px;
                }
            }
            .text {
                font-size: 12px;
                line-height: 17px;
                color: #ffffff;
                .time {
                    font-size: 10px;
                    font-weight: 400;
                    color: #8090a6;
                    transform: scale(20%);
                    letter-spacing: -1px;
                }
            }
            &::after {
                content: '';
                display: inline-block;
                position: absolute;
                right: 0;
                top: 50%;
                transform: rotate(45deg) skew(-15deg, -15deg) translate(-8px, -29px);
                width: 38px;
                height: 38px;
                border-top: 1px solid transparent;
                border-right: 1px solid transparent;
            }
            &::before {
                content: '';
                display: inline-block;
                position: absolute;
                left: -37px;
                top: 50%;
                background-color: transparent;
                transform: rotate(45deg) skew(-15deg, -15deg) translate(-8px, -29px);
                width: 38px;
                height: 38px;
                border-top: 1px solid transparent;
                border-right: 1px solid transparent;
            }
            &.done {
                border-color: #0063f8;
                background: #0063f8;
                .symbol {
                    background: #3382f9;
                    color: #ffffff;
                }
                .text {
                    color: #ffffff;
                }
                &::after {
                    border-color: #0063f8;
                    background: #0063f8;
                }
                &::before {
                    border-color: #0063f8;
                    background: #ffffff;
                }
            }
            &.doing {
                border-color: #0063f8;
                background: #0063f8;
                .symbol {
                    background: rgba(255, 255, 255, 0.2);
                }
                .text {
                    color: #ffffff;
                    .time {
                        color: #ffffff;
                    }
                }
                &::after {
                    border-color: #0063f8;
                    background: #0063f8;
                }
                &::before {
                    border-color: #006ef9;
                    background: #ffffff;
                }
            }
            &.wait {
                border-color: #eaedf4;
                background: #f7f9fd;
                .symbol {
                    background: #e1e4eb;
                }
                .text {
                    color: #6f7785;
                }
                &::after {
                    border-color: #eaedf4;
                    background: #f7f9fd;
                }
                &::before {
                    border-color: #eaedf4;
                    background: #ffffff;
                }
            }
            &.will {
                border-color: #0063f8;
                background: #ffffff;
                .symbol {
                    background: #0063f8;
                }
                .text {
                    color: #0063f8;
                    .time {
                        color: #ffffff;
                    }
                }
                &::after {
                    border-color: #0063f8;
                    background: #ffffff;
                }
                &::before {
                    border-color: #0063f8;
                    background: #ffffff;
                }
            }
        }
        .lose {
            display: inline-block;
            width: 100px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-radius: 20px;
            background-color: #feeaeb;
            margin-left: 20px;
            color: red;
            cursor: pointer;
        }
        .reactivation {
            display: inline-block;
            width: 100px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-radius: 20px;
            background-color: #1dbf8a;
            margin-left: 20px;
            color: #ffffff;
            cursor: pointer;
        }
    }
}
</style>
