<template>
    <div class="customer-care-detail">
        <!-- 基本信息 -->
        <div class="base-msg">
            <div class="d-f-a-b">
                <div class="base-msg-left d-f-a">
                    <div class="sn no-white-space">问询单号 CN222203435667</div>
                    <div class="no-white-space m-r-8 color-4E5969">客户:</div>
                    <div>张明细/美国</div>
                </div>
                <div class="base-msg-right p-13 primary">
                    <MySvgIcon :icon-class="favorites-icon"/>
                    <span>处理中</span>
                </div>
            </div>
            <!-- 详细信息 -->
            <div class="detail-msg">
                <div class="msg-title">详细信息</div>
                <div class="msg-content m-t-20">
                    <!-- 问询类型 -->
                    <div class="type-style">
                        <div class="col d-f-a">
                            <div class="key m-r-16">问询类型</div>
                            <div class="value p-4 primary">故障类</div>
                        </div>
                        <div class="col">
                            <div class="key m-r-16">创建时间</div>
                            <div class="value">2024.12.12 12:00</div>
                        </div>
                        <div class="col">
                            <div class="key m-r-16">故障时间</div>
                            <!-- {{ $Util.timeFilter(text, 3) }} -->
                            <div class="value">2024.12.12 12:00</div>
                        </div>
                        <div class="col">
                            <div class="key m-r-16">车型</div>
                            <div class="value">SK3-limitded-皓月白</div>
                        </div>
                    </div>
                    <!-- 车架号与公里数 -->
                    <div class="vehicle-no-style m-t-20">
                        <div class="col">
                            <div class="key m-r-16">车架号、公里数</div>
                            <div class="value">
                                <div class="vehicle-item">R45CR6B3M1000033(9km)</div>
                            </div>
                        </div>
                    </div>
                    <!-- 问题描述 -->
                    <div class="problem-description-style m-t-20">
                        <div class="col">
                            <div class="key m-r-16">问题描述</div>
                            <div class="value">问题描述问题描述问题描述问题描述</div>
                        </div>
                    </div>
                    <!-- 附件 -->
                    <div class="attachment-style m-t-20">
                        <div class="col">
                            <div class="key m-r-16">附件</div>
                            <div class="value">
                                <template v-for="(item, index) in customerCareDetail.img" :key="index">
                                    <img :class="{ 'm-l-16': index > 0 }" class="attachment-img" :src="item" alt="" />
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 按钮 -->
            <div class="detail-btn">
                <a-button>编辑信息</a-button>
            </div>
        </div>

        <div class="bed-sheet"></div>

    </div>
</template>

<script setup>
import { ref } from "vue";
import MySvgIcon from "@/components/MySvgIcon/index.vue";

const customerCareDetail = ref({
    img: [
        "https://horwin.oss-cn-hangzhou.aliyuncs.com//img/ba37a2f6f160d68d31f1a96b4a17f2b068b6cee17e6c7b96db51ba5016ef1df0.png",
        "https://horwin.oss-cn-hangzhou.aliyuncs.com//img/ba37a2f6f160d68d31f1a96b4a17f2b068b6cee17e6c7b96db51ba5016ef1df0.png",
    ],
});

/* fetch start */
/* fetch end */

/* methods start */
/* methods end */
</script>

<style lang="less" scoped>
.customer-care-detail {
    
    .base-msg {
        background-color: #fff;
        padding: 20px;
        box-sizing: border-box;
        .base-msg-left {
        }
        .base-msg-right {
            font-size: 20px;            
            font-weight: 400;            
        }
        .sn {
            color: #1d2129;
            font-size: 18px;
            font-weight: 500;
            margin-right: 20px;
        }

        .primary {
            box-sizing: border-box;
            border-radius: 4px;
            background: rgba(0, 97, 255, 0.1);
            color: #0061ff !important;
        }

        .detail-msg {
            .msg-title {
                color: #1d2129;
                font-size: 18px;
                font-weight: 400;
            }

            .msg-content {
                padding-right: 40px;
                box-sizing: border-box;

                .type-style,
                .vehicle-no-style,
                .problem-description-style,
                .attachment-style {
                    display: flex;
                    justify-content: space-between;

                    .col {
                        display: flex;

                        .key {
                            color: #1d2129;
                            font-size: 14px;
                            font-weight: 400;
                            width: 100px;
                            text-align: right;
                        }
                        .value {
                            color: #1d2129;
                            font-size: 14px;
                            font-weight: 400;

                            .attachment-img {
                                width: 80px;
                                height: 80px;
                                border-radius: 4px;
                                border: 1px solid black;
                            }
                        }
                    }
                }
                .vehicle-no-style {
                    .vehicle-item {
                        border-radius: 4px;
                        background: #F2F3F5;
                        padding: 0 4px;
                        box-sizing: border-box;
                    }
                }
                .problem-description-style {
                }
                .attachment-style {
                }
            }
        }

        .detail-btn {
            width: 100%;
            text-align: center;
        }

        .color-4E5969 {
            color: #4e5969;
            font-size: 16px;
            font-weight: 400;
        }
    }

    .bed-sheet {
        background-color: #fff;
        padding: 20px;
        box-sizing: border-box;
    }
}

.d-f-a {
    display: flex;
    align-items: center;
}
.d-f-a-b {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.no-white-space {
    white-space: nowrap;
}
</style>
