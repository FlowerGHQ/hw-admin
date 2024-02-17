<template>
    <div class="order-detail">
        <div class="d-top">
            <div class="title">
                {{ $t('retail.order_detail') }}
            </div>
            <div class="container">
                <div class="d-img">
                    <img class="img" v-if="detail.avatar" :src="detail.avatar" alt="" />
                    <img class="img" v-else src="../../assets/images/good-items/head_sculpture.png" alt="" />
                </div>
                <div class="d-content">
                    <a-row class="all-msg">
                        <div class="order-msg">
                            <span>{{ detail?.user_name }}</span>
                            <!-- 
                  <span class="use">
                    <img class="img" :src="getTestActiveSrc('man')" alt="" />
                    <span>25</span>
                    </span>
                  <span class="test-drive">小程序</span>
               -->
                        </div>
                    </a-row>
                    <a-row class="row-detail">
                        <!-- 手机 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t(/* 手机号 */ 'retail.phone') }} ：</span>
                            <span class="value">
                                <span>{{ detail?.user_phone || '-' }}</span>
                                <span
                                    class="see-phone"
                                    v-if="detail?.user_phone?.length && isShowPhone"
                                    @click="seePhoneNumber"
                                >
                                    查看
                                </span>
                                <span v-if="detail?.user_phone?.length"> 【{{ detail?.user_phone_info }}】 </span>
                            </span>
                        </a-col>
                        <!-- 省份 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t(/* 省份 */ 'retail.province') }}：</span>
                            <span class="value"> {{ detail?.to_province || '-' }} </span>
                        </a-col>
                        <!-- 城市 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t(/* 城市 */ 'retail.city') }}：</span>
                            <span class="value"> {{ detail?.to_city || '-' }} </span>
                        </a-col>
                        <!-- 订单地址 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t(/* 订单地址 */ 'retail.order_address') }}：</span>
                            <span class="value">
                                {{ detail?.to_address || '-' }}
                                <!-- 
                    <span style="color: #0061ff">
                    {{ $t("retail.push_to_customers") }}
                    </span> 
                -->
                            </span>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </div>
        <div class="d-bottom">
            <!-- 订单进度 -->
            <div class="order-schedule" v-if="false">
                <div class="title">
                    {{ $t('retail.order_progress') }}
                    <div class="order-number-box">
                        {{ $t('p.order_number') }}:
                        <span id="order-number" ref="myorderNumber">{{ detail?.sn }}</span>
                        <a-button type="link" v-if="detail?.sn" @click="copyOrderNumber('innerText')">{{
                            $t('in.copy')
                        }}</a-button>
                    </div>
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
                                <div class="setp-description">{{ item.description }}</div>
                                <div class="setp-subtitle" v-if="item.logistics">
                                    {{ item.logistics }}
                                    <transport :wayillobj="wayillDetail" />
                                </div>
                            </template>
                        </a-step>
                    </a-steps>
                </div>
            </div>

            <!-- 订单摘要 -->
            <div class="payment-msg">
                <div class="title">
                    {{ $t('item_order.order_summary') }}
                </div>
                <div class="sub-title m-b-16">
                    <div>
                        <!-- 当前的订单进度 -->
                        <span class="key">{{ $t(/* 订单来源 */ 'dis.order_source') }}：</span>
                        <span class="value">{{ $Util.goodSourceChannelFilter(detail?.channel) || '-' }}</span>
                    </div>
                    <div class="m-L-40">
                        <span class="key">{{ $t(/* 总价 */ 'retail.total_price') }}：</span>
                        <span class="value"
                            >￥{{ $Util.countFilter(detail?.price) || '-' }}{{ $t('item_order.yuan') }}</span
                        >
                    </div>
                    <div class="m-L-40">
                        <span class="key">{{ $t(/* 运费 */ 'p.freight') }}：</span>
                        <span class="value"
                            >￥{{ $Util.countFilter(detail?.waybill_price) || '-' }}{{ $t('item_order.yuan') }}</span
                        >
                    </div>
                    <div class="m-L-40">
                        <span class="key">{{ $t(/* 实付款 */ 'item_order.actual_payment') }}：</span>
                        <span class="value"
                            >￥{{ $Util.countFilter(detail?.charge) || '-' }}{{ $t('item_order.yuan') }}</span
                        >
                    </div>
                </div>
            </div>
            <!-- 商品信息 -->
            <div class="payment-msg">
                <div class="title">
                    {{ $t('retail.product_Information') }}
                </div>
                <div class="sub-title m-b-16">
                    <div>
                        <span class="key">{{ $t('af.courier_number') }}：</span>
                        <span class="value">{{ detail?.waybill_uid === 0 ? '' : detail?.waybill_uid }}</span>
                        <a-button type="link" v-if="detail?.waybill_uid" @click="copyOrderNumber('waybill_uid')">{{
                            $t('in.copy')
                        }}</a-button>
                        <fillTark :detail="detail" @changeType="refresh" />
                    </div>
                </div>
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
                    <template #bodyCell="{ column, text }">
                        <template v-if="column.key === 'product_pic'">
                            <!-- <img class="table-img" :src="text" alt=""> -->
                            <a-image :width="44" :height="44" :src="text" :fallback="$t('def.none')" />
                        </template>
                    </template>
                </a-table>
            </div>

            <!-- 退订/退款记录
      <div class="refund-msg">
        <div class="title">
          {{ $t("retail.unsubscribe_refund_record") }}
        </div>
        <a-table :columns="refundTableColumns" :data-source="refundTableData" :scroll="{ x: true }" :row-key="(record) => record.id" :pagination="false" >
          <template #headerCell="{ title }">
            {{ $t(title) }}
          </template>
          <template #bodyCell="{ column }">
            <template v-if="column.key === 'operation'">
              <a-button type="link" @click="viewReson('view')">
                {{ $t("retail.view_reason") }}
              </a-button>
              <a-button type="link" @click="viewReson">
                {{ $t("retail.unsubscribe_review") }}
              </a-button>
            </template>
          </template>
        </a-table>
      </div> -->

            <!-- 修改记录 -->
            <div class="modify-msg">
                <div class="title">
                    {{ $t('retail.modify_record') }}
                </div>
                <!-- 记录盒子 -->
                <div class="record-box" v-for="(item, index) in logisticsList" :key="item.id">
                    <div class="head-record">
                        <span class="icon-record"></span>
                        <span class="time">{{ item.create_time }}</span>
                        <span class="peo-record">{{ $t('item_order.editor') }}：{{ item.user_name }}</span>
                    </div>
                    <div class="body-record" :class="{ 'border-left': index + 1 < logisticsList?.length }">
                        <div class="con-record">
                            <div class="text">
                                {{ $t(/* 修改 */ 'n.amend') }}
                                {{ $Util.goodItemOrderUpdateRecordFilter(item.type, lang) }}
                            </div>
                            <div class="text-con">
                                {{ $Util.goodItemOrderUpdateRecordFilter(item.type, lang) }}【{{ item.old_data }}】{{
                                    $t('item_order.change_to')
                                }}【{{ item.new_data }}】
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="logisticsList?.length === 0">
                    {{ $t('item_order.no_record') }}
                </div>
            </div>
        </div>
    </div>

    <!-- 退订审核 
  <a-modal v-model:visible="refundVisible" title="退订审核" @cancel="refundHandleCancel" @ok="refundHandleOk" >
    <template #footer>
      <a-button @click="refundHandleCancel"> 取消 </a-button>
      <a-button type="primary" @click="refundHandleOk" :disabled="isFooterDisabled" >
        同意退订
      </a-button>
    </template>
    <a-textarea v-model:value="value2" placeholder="填写原因" :rows="4" allow-clear />
  </a-modal>-->
</template>

<script setup>
import Core from '@/core';
import fillTark from './components/fill-track.vue';
import transport from './components/transport.vue';
import { computed, onMounted, reactive, ref, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const testActiveModules = import.meta.globEager('../../assets/images/good-items/*.png');
// const womanImg =  import.meta.globEager("../../assets/images/test-drive/*.png");

/* 使用图片的方法 */
const getTestActiveSrc = name => {
    const path = `../../assets/images/good-items/${name}.png`;
    return testActiveModules[path].default;
};

const myorderNumber = ref(null);
// 进度条
const stepCurrent = ref(2);
const { proxy } = getCurrentInstance();
const lang = computed(() => {
    return proxy.$store.state.lang;
});
const router = useRouter();
const route = useRoute();
const id = ref('');
// - 商品信息columns
const commodityTableData = ref([{}]); // 商品信息table

const detail = ref({
    avatar: '',
    user_name: '',
    user_phone: '', //用户手机号
    channel: '', //来源
    to_address: '',
    to_city: '',
    to_province: '',
    sn: '', //订单编号
    charge: 0, //实付款
    price: 0, //总价
    waybill_price: 0, //运费
    waybill_uid: '', //快递单号
    to_name: '', //收件人
    user_phone_info: '', //手机号信息
});
const logisticsList = ref([]);
const isShowPhone = ref(true);
const wayillDetail = ref();
const stepItems = computed(() => {
    return [
        {
            id: 1,
            title: 'retail.intention_deposit_paid',
            money: '￥500 ',
            description: '2023-04-24 10:19:27',
        },
        {
            id: 2,
            title: 'retail.paid_small_order',
            money: '￥500 ',
            description: '2023-04-24 10:19:27',
        },
        {
            id: 3,
            title: 'retail.paid_large_order',
            description: '2023-04-24 10:19:27',
        },
        {
            id: 4,
            title: 'retail.final_payment_paid',
            description: '2023-04-24 10:19:27',
        },
        {
            id: 5,
            title: 'retail.to_be_delivered',
            description: '2023-04-24 10:19:27',
            logistics: '您的包裹已抵达【常州市】',
        },
        {
            id: 6,
            title: 'retail.delivered',
            description: '2023-04-24 10:19:27',
        },
        {
            id: 7,
            title: 'retail.to_be_invoiced',
            description: '2023-04-24 10:19:27',
        },
        {
            id: 8,
            title: 'retail.completed',
            description: '2023-04-24 10:19:27',
        },
    ];
});
const commodityTableColumns = computed(() => {
    return [
        {
            /* 图片 */ title: 'item_order.commodity_image',
            dataIndex: 'product_pic',
            key: 'product_pic',
        },
        {
            /* 名称 */ title: 'r.item_name',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            /* 数量 */ title: 'r.quantity',
            dataIndex: 'amount',
            key: 'amount',
        },
        /* {
      title: "i.commercial_specification",
      dataIndex: "commercial_specification",
      key: "commercial_specification",
    },
    {
      title: "retail.configuration_item",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "retail.detail",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "retail.price",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "retail.preferential_policy",
      dataIndex: "id",
      key: "id",
    }, */
    ];
});

onMounted(() => {
    console.log('route.query.id', route.query?.id);
    if (route.query.id) {
        id.value = Number(route.query.id);
        updateFetch();
    }
});

const refresh = () => {
    if (route.query.id) {
        id.value = Number(route.query.id);
        updateFetch();
    }
};
// 查看手机号
const seePhoneNumber = () => {
    Core.Api.GoodItemsOrder.seePhone({
        id: id.value,
    })
        .then(res => {
            detail.value.user_phone = res?.user_phone;
            if (res?.user_phone.length) isShowPhone.value = false;
        })
        .catch(err => {
            console.log('getTableData err:', err);
        });
};
/* Fetch start*/
const updateFetch = (params = {}) => {
    getDetailFetch();
};
// 详情接口
const getDetailFetch = (params = {}) => {
    Core.Api.GoodItemsOrder.orderDetail({
        id: id.value,
    })
        .then(res => {
            commodityTableData.value = res?.item_list;
            for (let item of Object.keys(res)) {
                detail.value[item] = res[item];
            }
            getLogisticsRecords();
            // getWayillDetail();
            console.log('detail', detail.value);
        })
        .catch(err => {
            console.log('getTableData err:', err);
        });
};

// 复制订单号
const copyOrderNumber = type => {
    let value = '';
    if (type === 'innerText') {
        value = myorderNumber.value.innerText;
    } else if (type === 'waybill_uid') {
        value = detail.value?.waybill_uid;
    }
    return navigator.clipboard.writeText(value).then(() => {});
};
/* Fetch end*/
const getLogisticsRecords = () => {
    Core.Api.GoodItemsOrder.logisticsRecords({
        page_size: 20,
        page: 1,
        waybill_id: detail.value?.waybill_id,
    })
        .then(res => {
            logisticsList.value = res.list;
        })
        .catch(err => {
            console.log('getTableData err:', err);
        });
};

const getWayillDetail = () => {
    Core.Api.GoodItemsOrder.wayillDetail({
        id: detail.value?.waybill_id,
    })
        .then(res => {
            wayillDetail.value = res;
            console.log('getWayillDetail', res);
        })
        .catch(err => {
            console.log('getTableData err:', err);
        });
};
</script>

<style lang="less" scoped>
.order-detail {
    width: 100%;
    .title {
        color: #1d2129;
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        margin-bottom: 16px;

        .order-number-box {
            color: #86909c;
            text-align: right;
            font-size: 14px;
            font-weight: 400;
            display: inline-block;
            margin-left: 16px;

            #order-number {
                color: #1d2129;
                margin: 0px 10px;
            }
        }
    }
    .sub-title {
        display: flex;
        font-size: 14px;
        font-weight: 400;
        .key {
            color: #86909c;
        }
        .value {
            color: #1d2129;
            margin-right: 16px;
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
                    font-size: 16px;
                    font-weight: 600;
                }
                .setp-subtitle {
                    color: #4e5969;
                    font-size: 14px;
                    font-weight: 600;
                    margin-top: 6px;
                }
                .setp-description {
                    color: #86909c;
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
            // margin-top: 20px;
        }
        .refund-msg {
            margin-top: 20px;
        }
        .modify-msg {
            margin-top: 20px;

            .record-box {
                // min-height: 200px;
                width: 100%;
                .head-record {
                    display: flex;
                    align-items: center;
                    color: #86909c;
                    .icon-record {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        flex-shrink: 0;
                        border: solid 2px #e5e6eb;
                        border-radius: 50%;
                    }
                    .time {
                        margin-left: 16px;
                    }
                    .peo-record {
                        margin-left: 16px;
                    }
                }

                .body-record {
                    width: 100%;
                    min-height: 76px;
                    padding: 4px 20px 10px;
                    margin: 6px 0px 6px 8px;
                    .con-record {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        min-height: 76px;
                        background: #f7f8fa;
                        box-sizing: border-box;
                        font-size: 14px;
                        padding: 14px 12px 12px;

                        .text {
                            color: #1d2129;
                            font-weight: 800;
                        }

                        .text-con {
                            color: #4e5969;
                            font-weight: 400;
                        }
                    }
                }
                .border-left {
                    border-left: #f2f3f5 solid 1px;
                }
            }
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

.see-phone {
    color: #0061ff;
    cursor: pointer;
    margin-right: 10px;
}

:deep(.ant-image) {
    line-height: 44px;
    cursor: pointer;
}
</style>
