<template>
    <div class="quick-order">
        <template v-if="!isConfirm">
            <div class="body">
                <img :src="cycList[modelId].src" class="cyc-img" />
                <div class="title">车型</div>
                <div class="cyc-body">
                    <div
                        class="cyc-item"
                        :class="cycIndex === index ? 'selected' : ''"
                        v-for="(cyc, key, index) in cycList"
                        :key="index"
                        @click="change(cyc.modelId, index)"
                    >
                        <div class="cyc-item-img">
                            <img :src="cyc.src" />
                        </div>
                        <p class="cyc-item-name">{{ cyc.name }}</p>
                    </div>
                </div>
                <div class="title">版本</div>
                <div class="version">
                    <div class="version-title">
                        <p>
                            {{ cycList[modelId].name
                            }}<span v-if="cycList[modelId].version">·{{ cycList[modelId].version }}</span>
                        </p>
                        <p v-if="cycList[modelId].total_price">
                            ￥{{ Core.Util.countFilter(cycList[modelId].total_price)
                            }}<span class="old-price">￥{{ Core.Util.countFilter(cycList[modelId].old_price) }}</span>
                        </p>
                    </div>
                    <div class="version-dis">
                        <img src="../images/MILEAGE.png" alt="" />
                        <span>{{ cycList[modelId].accelerate }}</span>
                    </div>
                    <div class="version-dis">
                        <img src="../images/BATTERY.png" alt="" />
                        <span>{{ cycList[modelId].mileage }}</span>
                    </div>
                    <div class="version-dis">
                        <img src="../images/ACCELERATE.png" alt="" />
                        <span>{{ cycList[modelId].fastCharging }}</span>
                    </div>
                </div>
                <div class="title">颜色</div>
                <span class="color-name">{{ cycList[modelId].color }}（已包含）</span>
                <div class="color">
                    <div class="color-item" :style="{ background: colorList[cycList[modelId].color] }"></div>
                </div>
            </div>
            <div class="footer">
                <div class="price" v-if="cycList[modelId].total_price">
                    <p class="amount">
                        总价：<span class="amount-price"
                            >￥{{ Core.Util.countFilter(cycList[modelId].total_price) }}</span
                        >
                    </p>
                    <p class="config">车型配置、图片信息仅供参考</p>
                </div>
                <a-button type="primary" @click="confirmConfig">确定配置</a-button>
            </div>
        </template>
        <template v-else>
            <div class="body">
                <img :src="cycList[modelId].src" class="cyc-img" />
                <div class="title">版本</div>
                <div class="confirm-version">
                    <div class="confirm-version-title">
                        <p>
                            {{ cycList[modelId].name
                            }}<span v-if="cycList[modelId].version">·{{ cycList[modelId].version }}</span>
                        </p>
                        <p v-if="cycList[modelId].total_price">
                            ￥{{ Core.Util.countFilter(cycList[modelId].total_price) }}
                        </p>
                    </div>
                </div>
                <div class="title">颜色</div>
                <span class="color-name">{{ cycList[modelId].color }}（已包含）</span>
                <div class="color">
                    <div class="color-item" :style="{ background: colorList[cycList[modelId].color] }"></div>
                </div>
                <div class="qrcode">
                    <qrcode-vue value="http://event.horwincloud.com/sale/redirect/?type=order" :size="160" level="H" />
                    <p class="the-name">意向金：￥500</p>
                </div>
            </div>
            <div class="footer">
                <div class="price" v-if="cycList[modelId].total_price">
                    <p class="amount">
                        总价：<span class="amount-price"
                            >￥{{ Core.Util.countFilter(cycList[modelId].total_price) }}</span
                        >
                    </p>
                </div>
                <div>
                    <a-button @click="pushApp">推送给用户</a-button>
                    <a-button type="primary" @click="changeConfig">修改配置</a-button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { inject, getCurrentInstance, reactive, ref, toRefs } from 'vue';
import Core from '@/core';
import QrcodeVue from 'qrcode.vue';
import Static from '../static';

const userId = inject('userId');
const getChildData = inject('getChildData'); // 更新子组件数据方法 传对应 key
const $prop = defineProps({
    customer_id: {
        required: true,
        type: [String, Number],
    },
});
const { proxy } = getCurrentInstance();
const $emit = defineEmits([]);
const qrCodeUrl = ref(null);
const cycIndex = ref(0);
const modelId = ref(1);
const orderId = ref(null);
const isConfirm = ref(false);
const isUpdate = ref(false);
const colorList = {
    号外橙: '#DC6E38',
    号外紫: '#1010A8',
};
const userMes = ref([]);
const cycList = Static.MODEL;
const change = (id, index) => {
    modelId.value = id;
    cycIndex.value = index;
};
const getUserDetail = () => {
    Core.Api.CustomService.detail({ id: userId.value })
        .then(res => {
            Core.Logger.success('getTaskNum', res);
            userMes.value = res;
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};
const confirmConfig = () => {
    if (!userId.value) return;
    if (isUpdate.value) {
        updateOrder();
        return;
    }
    const params = {
        address: userMes.value.address, // 地址
        city: userMes.value.city, // 所属城市
        customer_id: userId.value, // 用户ID
        group_id: userMes.value.group_id, // 所属区域id
        pay_money: cycList[modelId.value].pay_money, // 本次支付金额
        remark: JSON.stringify({ ...cycList[modelId.value] }), // 车辆信息
        total_price: cycList[modelId.value].total_price, // 产品总金额
        type: '1', // 本次支付订单类型
        user_id: Core.Data.getUser('user').id, // 员工用户ID
    };
    Core.Logger.success('params', params);
    Core.Api.CustomService.createOrder({ ...params })
        .then(res => {
            Core.Logger.success('getTaskNum', res);
            orderId.value = res.order.id;
            isConfirm.value = true;
            getChildData('4');
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};
const updateOrder = () => {
    Core.Api.CustomService.orderUpdate({ id: orderId.value, remark: JSON.stringify({ ...cycList[modelId.value] }) })
        .then(res => {
            Core.Logger.success('getTaskNum', res);
            isConfirm.value = true;
            getChildData('4');
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};
const changeConfig = () => {
    isUpdate.value = true;
    isConfirm.value = false;
};
const pushApp = () => {
    Core.Api.CustomService.pushApp({ id: orderId.value })
        .then(res => {
            Core.Logger.success('getTaskNum', res);
            proxy.$message.success('推送成功');
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};

defineExpose({ getUserDetail });
</script>

<style lang="less" scoped>
.quick-order {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    height: 100%;
    .body {
        flex-grow: 1;
        padding: 24px 20px;
        overflow: auto;
        font-size: 14px;
        line-height: 1.5715;
        word-wrap: break-word;
        .title {
            color: #1d2129;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .cyc-img {
            width: 400px;
            height: 200px;
            flex-shrink: 0;
        }
        .cyc-body {
            display: flex;
            margin-bottom: 20px;
            .cyc-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                .cyc-item-img {
                    padding: 9px 6px;
                    border-radius: 4px;
                    margin-bottom: 4px;
                    border: 1px solid #e5e6eb;
                    > img {
                        width: 180px;
                        height: 102px;
                    }
                }
                .cyc-item-name {
                    text-align: center;
                    color: #1d2129;
                    font-size: 16px;
                    font-weight: 600;
                }
                &:first-child {
                    margin-right: 16px;
                }
                &.selected {
                    .cyc-item-img {
                        border-color: #0061ff;
                    }
                }
            }
        }
        .version {
            padding: 16px;
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            border: 1px solid #f2f3f5;
            .version-title {
                display: flex;
                justify-content: space-between;
                color: #1d2129;
                font-size: 16px;
                font-weight: 600;
                position: relative;
                margin-bottom: 12px;
                .old-price {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    transform: translateY(100%);
                    overflow: hidden;
                    color: #86909c;
                    text-overflow: ellipsis;
                    font-size: 12px;
                    text-decoration: line-through;
                }
            }
            .version-dis {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                &:last-child {
                    margin-bottom: 0;
                }
                > img {
                    width: 16px;
                    height: 16px;
                    margin-right: 4px;
                }
                > span {
                    color: #86909c;
                    font-size: 14px;
                }
            }
        }
        .confirm-version {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            .confirm-version-title {
                display: flex;
                justify-content: space-between;
                color: #1d2129;
                font-size: 14px;
            }
        }
        .color-name {
            display: inline-block;
            color: #4e5969;
            font-size: 14px;
            margin-bottom: 6px;
        }
        .color {
            display: flex;
            .color-item {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                overflow: hidden;
            }
        }
        .qrcode {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-top: 1px dashed #e5e6eb;
            padding: 60px;
            margin-top: 28px;
            .qrcode-image {
                width: 160px;
                height: 160px;
            }
            .the-name {
                margin-top: 8px;
                text-align: center;
                font-size: 14px;
                color: #1d2129;
            }
        }
    }
    .footer {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        flex-shrink: 0;
        padding: 20px;
        .price {
            flex: 1;
            .amount {
                color: #1d2129;
                font-size: 16px;
                font-weight: 600;
                .amount-price {
                    color: #0061ff;
                }
            }
            .config {
                color: #86909c;
                font-size: 12px;
            }
        }
    }
}
</style>
