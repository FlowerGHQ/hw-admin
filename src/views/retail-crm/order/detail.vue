<template>
    <div class="order-detail">
        <div class="d-top">
            <div class="title">
                {{ $t('retail.order_detail') }}
            </div>
            <div class="container">
                <div class="d-img">
                    <img
                        class="img"
                        src="https://img0.baidu.com/it/u=2220978215,658189084&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=768"
                        alt=""
                    />
                </div>
                <div class="d-content">
                    <a-row class="all-msg">
                        <div class="order-msg">
                            <span>赵先生</span>
                            <span class="use">
                                <img class="img" src="../../../assets//images/retail/male.png" alt="" />
                                <span>25</span>
                            </span>
                            <span class="test-drive">小程序</span>
                        </div>
                    </a-row>
                    <a-row class="row-detail">
                        <!-- 手机 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.phone') }} ：</span>
                            <span class="value">
                                <span>1234567</span>
                                <span style="color: #0061ff"> 查看 </span>
                                <span> 【北京联通】 </span>
                            </span>
                        </a-col>
                        <!-- 邮箱 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.email') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                        <!-- 用户体验官 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.user_experience_officer') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                        <!-- 省份 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.province') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                        <!-- 城市 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.city') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                        <!-- 订单地址 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.order_address') }}：</span>
                            <span class="value">
                                你好
                                <span style="color: #0061ff">
                                    {{ $t('retail.push_to_customers') }}
                                </span>
                            </span>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </div>
        <div class="d-bottom">
            <!-- 订单进度 -->
            <div class="order-schedule">
                <div class="title">
                    {{ $t('retail.order_progress') }}
                </div>
                <div class="steps">
                    <a-steps :current="stepCurrent" size="small">
                        <a-step v-for="item in stepItems" :key="item.id">
                            <template #title>
                                <div class="step-title">
                                    {{ $t(item.title) }}
                                </div>
                            </template>
                            <template #description>
                                <div class="setp-subtitle">{{ item.money }}</div>
                                <div class="setp-description">{{ item.description }}</div>
                            </template>
                        </a-step>
                    </a-steps>
                </div>
            </div>
            <!-- 商品信息 -->
            <div class="commodity-msg">
                <div class="title">
                    {{ $t('retail.product_Information') }}
                </div>
                <div class="sub-title m-b-16">
                    <div>
                        <span class="key">{{ $t('retail.vehicle_model') }} ：</span>
                        <span class="value">SENMENTI 0 · 创世版</span>
                    </div>
                    <div class="m-L-40">
                        <span class="key">{{ $t('retail.order_amount') }} ：</span>
                        <span class="value">￥126800</span>
                    </div>
                </div>
                <div class="commodity-content">
                    <div class="content-left">
                        <img
                            class="img"
                            src="https://img2.baidu.com/it/u=3765245611,3014132835&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
                            alt=""
                        />
                    </div>
                    <div class="content-right">
                        <a-table
                            :columns="commodityTableColumns"
                            :data-source="commodityTableData"
                            :scroll="{ x: true }"
                            :row-key="record => record.id"
                            :pagination="false"
                        >
                            <template #headerCell="{ title }">
                                {{ $t(title) }}
                            </template>
                        </a-table>
                    </div>
                </div>
            </div>
            <!-- 支付信息 -->
            <div class="payment-msg">
                <div class="title">
                    {{ $t('retail.payment_information') }}
                </div>
                <div class="sub-title m-b-16">
                    <div>
                        <!-- 当前的订单进度 -->
                        <span class="key">{{ $t('retail.order_progress') }}：</span>
                        <span class="value">已付意向金</span>
                    </div>
                    <div class="m-L-40">
                        <span class="key">{{ $t('retail.amount_paid') }}：</span>
                        <span class="value">￥500</span>
                    </div>
                </div>
                <a-table
                    :columns="paymentTableColumns"
                    :data-source="paymentTableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                </a-table>
            </div>
            <!-- 退订/退款记录 -->
            <div class="refund-msg">
                <div class="title">
                    {{ $t('retail.unsubscribe_refund_record') }}
                </div>
                <a-table
                    :columns="refundTableColumns"
                    :data-source="refundTableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="viewReson('view')">
                                {{ $t('retail.view_reason') }}
                            </a-button>
                            <a-button type="link" @click="viewReson">
                                {{ $t('retail.unsubscribe_review') }}
                            </a-button>
                        </template>
                    </template>
                </a-table>
            </div>
            <!-- 修改记录 -->
            <div class="modify-msg">
                <div class="title">
                    {{ $t('retail.modify_record') }}
                </div>
                <a-table
                    :columns="modifyTableColumns"
                    :data-source="modifyTableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                </a-table>
            </div>
        </div>
    </div>

    <!-- 退订审核       -->
    <a-modal v-model:visible="refundVisible" title="退订审核" @cancel="refundHandleCancel" @ok="refundHandleOk">
        <template #footer>
            <a-button @click="refundHandleCancel"> 取消 </a-button>
            <a-button type="primary" @click="refundHandleOk" :disabled="isFooterDisabled"> 同意退订 </a-button>
        </template>
        <a-textarea v-model:value="value2" placeholder="填写原因" :rows="4" allow-clear />
    </a-modal>
</template>

<script setup>
import Core from '@/core';
import { computed, onMounted, reactive, ref } from 'vue';
// 进度条
const stepCurrent = ref(2);
const stepItems = computed(() => {
    return [
        {
            id: 1,
            title: 'retail.intention_deposit_paid',
            money: '￥500 ',
        },
        {
            id: 2,
            title: 'retail.paid_small_order',
            money: '￥500 ',
            description: 'Left 00:00:08',
        },
        {
            id: 3,
            title: 'retail.paid_large_order',
            money: '￥500 ',
        },
        {
            id: 4,
            title: 'retail.final_payment_paid',
            money: '￥500 ',
        },
        {
            id: 5,
            title: 'retail.to_be_delivered',
        },
        {
            id: 6,
            title: 'retail.delivered',
        },
        {
            id: 7,
            title: 'retail.to_be_invoiced',
        },
        {
            id: 8,
            title: 'retail.completed',
        },
    ];
});

// - 商品信息columns
const commodityTableData = ref([]); // 商品信息table
const commodityTableColumns = computed(() => {
    return [
        {
            title: 'retail.configuration_item',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.detail',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.price',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.preferential_policy',
            dataIndex: 'id',
            key: 'id',
        },
    ];
});

// - 支付信息columns
const paymentTableData = ref([]); // 支付信息table
const paymentTableColumns = computed(() => {
    return [
        {
            title: 'retail.order_status',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.payment_status',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.price',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.preferential_policy',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.amount_actually_paid',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.payment_method',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.order_number',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.time_of_payment',
            dataIndex: 'id',
            key: 'id',
        },
    ];
});

// - 退订/退款记录columns
const refundTableData = ref([]); // 退订/退款记录 table
const refundTableColumns = computed(() => {
    return [
        {
            title: 'retail.unsubscribe_phase',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.initiator',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.request_cancellation_time',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.refundable_amount',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.refundable_amount',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.approval_time',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.refund_time',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.operate',
            key: 'operation',
        },
    ];
});
const refundVisible = ref(false); //  操作
const isFooterDisabled = ref(false);
// - 修改记录columns
const modifyTableData = ref([]); // 修改记录 table
const modifyTableColumns = computed(() => {
    return [
        {
            title: 'retail.record_information',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.initiator',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.modified_model',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.modified_version',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.modify_color',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.total_price',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.vehicle_status',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'retail.modification_time',
            dataIndex: 'id',
            key: 'id',
        },
    ];
});

onMounted(() => {
    updateFetch();
});
/* Fetch start*/
const updateFetch = (params = {}) => {
    getCommodityFetch();
    paymentFetch();
    refundFetch();
    modifyFetch();
};
// 商品信息接口
const getCommodityFetch = (params = {}) => {
    Core.Api.CRMOrderIncome.list({
        search_type: 10,
        page_size: 6,
        ...params,
    })
        .then(res => {
            commodityTableData.value = res.list;
        })
        .catch(err => {
            console.log('getTableData err:', err);
        });
};
// 支付信息接口
const paymentFetch = (params = {}) => {
    Core.Api.CRMOrderIncome.list({
        search_type: 10,
        page_size: 6,
        ...params,
    })
        .then(res => {
            paymentTableData.value = res.list;
        })
        .catch(err => {
            console.log('getTableData err:', err);
        });
};
// 退订/退款记录接口
const refundFetch = (params = {}) => {
    Core.Api.CRMOrderIncome.list({
        search_type: 10,
        page_size: 6,
        ...params,
    })
        .then(res => {
            refundTableData.value = res.list;
        })
        .catch(err => {
            console.log('getTableData err:', err);
        });
};
// 修改记录接口
const modifyFetch = (params = {}) => {
    Core.Api.CRMOrderIncome.list({
        search_type: 10,
        page_size: 6,
        ...params,
    })
        .then(res => {
            modifyTableData.value = res.list;
        })
        .catch(err => {
            console.log('getTableData err:', err);
        });
};
/* Fetch end*/

/* methods start*/
// 查看原因
const viewReson = v => {
    refundVisible.value = true;
    if (v == 'view') {
        isFooterDisabled.value = true;
    } else {
        isFooterDisabled.value = false;
    }
};

// 退订审核 model ok
const refundHandleOk = () => {};
// cancel
const refundHandleCancel = () => {
    refundVisible.value = false;
};
</script>

<style lang="less" scoped>
.order-detail {
    width: 100%;
    font-family: PingFang SC;
    .title {
        color: var(--color-text-5, #1d2129);
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        margin-bottom: 16px;
    }
    .sub-title {
        display: flex;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        .key {
            color: #86909c;
        }
        .value {
            color: #1d2129;
        }
    }

    .d-top {
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 6px;
        border: 1px solid #e7e9f0;
        background: #fff;
        .container {
            width: 100%;
            display: flex;
            .d-img {
                margin-right: 20px;
                width: 100px;
                height: 100px;
                .img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }
            .d-content {
                width: calc(100% - 100px);
                .all-msg {
                    .fcc(space-between);
                    .order-msg {
                        display: flex;
                        align-items: center;
                        color: #1d2129;
                        font-size: 16px;
                        font-weight: 600;
                        font-family: PingFang SC;
                        .use {
                            display: flex;
                            align-items: center;
                            color: #0061ff;
                            font-size: 14px;
                            font-weight: 400;
                            margin-left: 16px;
                            .img {
                                width: 16px;
                                height: 16px;
                                margin-right: 6px;
                            }
                        }
                        .test-drive {
                            color: #1d2129;
                            font-size: 14px;
                            font-weight: 400;
                            margin-left: 16px;
                        }
                    }
                }
            }
        }
    }
    .d-bottom {
        margin-top: 20px;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 6px;
        border: 1px solid #e7e9f0;
        background: #fff;
        // 订单进度
        .order-schedule {
            .steps {
                .step-title {
                    color: #1d2129;
                    font-family: PingFang SC;
                    font-size: 16px;
                    font-weight: 600;
                }
                .setp-subtitle {
                    color: #4e5969;
                    font-family: PingFang SC;
                    font-size: 14px;
                    font-weight: 600;
                    margin-top: 6px;
                }
                .setp-description {
                    color: #86909c;
                    font-family: PingFang SC;
                    font-size: 12px;
                    font-weight: 400;
                    margin-top: 6px;
                }
            }
        }
        .commodity-msg {
            margin-top: 20px;
            .commodity-content {
                margin-top: 20px;
                display: flex;
                .content-left {
                    .img {
                        width: 420px;
                        height: 280px;
                        border-radius: 4px;
                        object-fit: cover;
                    }
                }
                .content-right {
                    width: 100%;
                    margin-left: 40px;
                }
            }
        }
        .payment-msg {
            margin-top: 20px;
        }
        .refund-msg {
            margin-top: 20px;
        }
        .modify-msg {
            margin-top: 20px;
        }
    }
}

.m-t-16 {
    margin-top: 16px;
}
.m-b-16 {
    margin-bottom: 16px;
}
.m-L-40 {
    margin-left: 40px;
}
</style>
