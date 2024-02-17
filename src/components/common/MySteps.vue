<template>
    <!-- 步骤条 -->
    <div class="steps-container">
        <div class="steps-content">
            <div
                v-for="(item, i) of stepsList"
                :key="i"
                :style="`z-index: ${stepsList.length - i};`"
                :class="{ item: true, done: current > i, doing: current === i, wait: current < i }"
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
        </div>
    </div>
</template>

<script>
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
        return {};
    },
};
</script>

<style lang="less">
.steps-container {
    width: 100%;
    .steps-content {
        display: flex;
        .item {
            flex: 1;
            height: 40px;
            font-size: 14px;
            position: relative;
            .fcc();
            border-top: 1px solid transparent;
            border-bottom: 1px solid transparent;
            &:first-child {
                border-radius: 20px 0 0 20px;
                border-left: 1px solid transparent;
            }
            &:last-child {
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
                color: #363d42;
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
            &:last-child::after {
                display: none;
            }

            &.done {
                border-color: #006ef9;
                background: #ffffff;
                .symbol {
                    background: #e6f1fe;
                    color: #006ef9;
                }
                .text {
                    color: #363d42;
                }
                &::after {
                    border-color: #006ef9;
                    background: #ffffff;
                }
            }
            &.doing {
                border-color: #006ef9;
                background: #006ef9;
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
                    border-color: #006ef9;
                    background: #006ef9;
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
            }
        }
    }
}
</style>
