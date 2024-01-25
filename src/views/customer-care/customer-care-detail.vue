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
                    <MySvgIcon :icon-class="favorites - icon" />
                    <span>
                        {{ 
                            Core.Const.CUSTOMER_CARE.ORDER_STATUS[customerCareDetail.status] ? 
                            $t(Core.Const.CUSTOMER_CARE.ORDER_STATUS[customerCareDetail.status].t) : '-' 
                        }}
                    </span> 
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
                            <div class="key m-r-16">{{ $t('customer-care.attachment') }}</div>
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
            <div v-if="Number(customerCareDetail.status) !== Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED" class="detail-btn">
                <a-button @click="onBtn('edit')">编辑信息</a-button>
            </div>
        </div>

        <!-- 问询单归类 -->
        <div class="inquiry-classification m-t-16">
            <template v-if="isDistributerAdmin">
                <div class="inquiry-classification-title">问询单归类</div>
    
                <!-- 归类 -->
                <div class="inquiry-classification-item m-t-16">
                    <div class="inquiry-classification-key m-t-4">归类</div>
                    <div class="inquiry-classification-value">
                        <a-radio-group v-model:value="customerCareDetail.sorting_type">
                            <a-radio v-for="(item, index) in Core.Const.CUSTOMER_CARE.SORTING_TYPE_THREE" :value="item.value">
                                {{ $t(item.t) }}
                            </a-radio>
                        </a-radio-group>
                        <br/>
                        <!-- 上面选中索赔出现 -->
                        <template v-if="Number(customerCareDetail.sorting_type) === Core.Const.CUSTOMER_CARE.SORTING_TYPE_THREE_MAP.CLAIMCOMPENSATION">
                            <a-radio-group v-model:value="customerCareDetail.sorting_type2">
                                <a-radio v-for="(item, index) in Core.Const.CUSTOMER_CARE.SORTING_TYPE_TWO" :value="item.value">
                                    {{ $t(item.t) }}
                                </a-radio>
                            </a-radio-group>                        
    
                            <!-- 善意索赔 和 开箱损 -->
                            <div v-if="!$Util.Common.returnTypeBool(customerCareDetail.sorting_type2, [Core.Const.CUSTOMER_CARE.SORTING_TYPE_TWO_MAP.GENERALCLAIM])" class="good-faith-claims p-10 m-t-16">
                                <div class="good-faith-claims-title">
                                    {{ 
                                        Core.Const.CUSTOMER_CARE.SORTING_TYPE_TWO[customerCareDetail.sorting_type2] 
                                        ? 
                                        $t(Core.Const.CUSTOMER_CARE.SORTING_TYPE_TWO[customerCareDetail.sorting_type2].t) : '-'
                                    }}
                                </div>
                                <div class="good-faith-claims-time">
                                    <template v-if="$Util.Common.returnTypeBool(customerCareDetail.sorting_type2, [Core.Const.CUSTOMER_CARE.SORTING_TYPE_TWO_MAP.BONAFIDECLAIM/*善意索赔*/])">
                                        <span class="time-name m-r-8">发货日期</span>
                                        <a-date-picker class="w-224 m-r-16" v-model:value="customerCareDetail.time" />
                                        <a-radio-group v-model:value="customerCareDetail.type">
                                            <a-radio 
                                                v-for="(item, index) in Core.Const.CUSTOMER_CARE.GOOD_FAITH" 
                                                :value="item.value"
                                            >
                                                {{ $t(item.t) }}
                                            </a-radio>
                                        </a-radio-group>
                                    </template>
                                    <template v-else-if="$Util.Common.returnTypeBool(customerCareDetail.sorting_type2, [Core.Const.CUSTOMER_CARE.SORTING_TYPE_TWO_MAP.UNPACKINGDAMAGE/*开箱损*/])">
                                        <span class="time-name m-r-8">订单号</span>
                                        <a-input 
                                            class="w-224"
                                            v-model:value="customerCareDetail.no" 
                                            :placeholder="$t('common.please_enter') + $t('common.vehicle_no')" 
                                        />
                                    </template>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
    
                <!-- 部件 -->
                <div class="inquiry-classification-item m-t-30">
                    <div class="inquiry-classification-key">部件</div>
                    <div class="inquiry-classification-value">
                        <a-button>选择商品</a-button>
                        <a-table class="m-t-8" :columns="partsColumns" :data-source="partsData" :pagination="false" :scroll="{ x: true }">
                            <template #bodyCell="{ column, text, record }">
                                <!-- 数量 -->
                                <template v-if="column.key === 'number'">
                                    <a-input-number v-model:value="record.number" :min="1" :placeholder="$t('common.please_enter')" />
                                </template>
                            </template>
                        </a-table>
                    </div>
                </div>
    
                <!-- 故障分类 -->
                <div v-if="!$Util.Common.returnTypeBool(customerCareDetail.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.CONSULTATION/*咨询*/])" class="inquiry-classification-item m-t-30">
                    <div 
                        class="inquiry-classification-key" 
                        :class="{ 'm-t-4': $Util.Common.returnTypeBool(customerCareDetail.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.BATTERY/*电池*/]) }"
                    >
                        {{ $t("customer-care.fault_classification") }}
                    </div>
                    <div class="inquiry-classification-value">
                        <template v-if="$Util.Common.returnTypeBool(customerCareDetail.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.MALFUNCTION/*故障*/])">
                            <a-table :columns="faultColumns" :data-source="faultData" :pagination="false" :scroll="{ x: true }">
                                <template #bodyCell="{ column, text, record }">
                                    <!-- 故障类型 -->
                                    <template v-if="column.key === 'fault_type'">
                                        <a-radio-group v-model:value="customerCareDetail.type">
                                            <template v-for="(item, index) in Core.Const.CUSTOMER_CARE.FAULT_TYPE" :key="index">
                                                <a-radio v-if="item.value !== -1" :value="item.value">
                                                    {{ $t(item.t) }}
                                                </a-radio>
                                            </template>
                                        </a-radio-group>
                                    </template>
                                </template>
                            </a-table>
                        </template>
                        <template v-else-if="$Util.Common.returnTypeBool(customerCareDetail.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.BATTERY/*电池*/])">
                            <a-radio-group v-model:value="customerCareDetail.n">
                                <template v-for="(item, index) in Core.Const.CUSTOMER_CARE.FAULT_TYPE" :key="index">
                                    <a-radio v-if="item.value !== -1" :value="item.value">
                                        {{ $t(item.t) }}
                                    </a-radio>
                                </template>
                            </a-radio-group>
                        </template>
                    </div>
                </div>
            </template>

            <!-- 沟通过程 -->
            <div class="inquiry-classification-item" :class="{ 'm-t-30': isDistributerAdmin }">
                <div class="inquiry-classification-key">{{ $t("customer-care.communication_process") }}</div>
                <div class="inquiry-classification-value">
                    <div class="communication-process p-10">
                        <!-- 其他回复 -->
                        <div class="communication-process-other-reply">
                            <div class="other-reply-platform-top">
                                <div class="other-reply-platform-avatar m-r-4"></div>
                                <div class="other-reply-platform-name">
                                    <div class="name">平台留言</div>
                                    <div class="time">2024.02.12 13:45</div>
                                </div>
                            </div>
                            <div class="other-reply-platform-bottom">
                                <div class="speech-skill p-10 m-t-10">
                                    <span>收到，正在核实，感谢您的耐心等待</span>
                                </div>
                                <div class="attachment"></div>
                            </div>
                        </div>
                        <!-- 我的回复 -->
                        <div class="communication-process-my-reply m-t-30">
                            <div class="my-reply-platform-top">
                                <div class="my-reply-platform-name m-r-4">
                                    <div class="name">我的回复</div>
                                    <div class="time">2024.02.12 13:45</div>
                                </div>
                                <div class="my-reply-platform-avatar"></div>
                            </div>
                            <div class="my-reply-platform-bottom">
                                <div class="speech-skill p-10 m-t-10">
                                    <span>收到，正在核实，感谢您的耐心等待</span>
                                </div>
                                <div class="attachment"></div>
                            </div>
                        </div>

                        <!-- 输入框 -->
                        <div class="m-t-20">
                            <a-textarea
                                v-model:value="customerCareDetail.description"
                                :placeholder="$t('common.please_enter') + $t('customer-care.leave_message')"
                                allow-clear
                                showCount
                                :auto-size="{ minRows: 3, maxRows: 13 }"
                                :maxlength="2000"
                            />
                        </div>

                        <!-- 添加附件 -->
                        <div class="add-attachment m-t-10">
                            <div class="add-attachment-title">{{ $t('customer-care.add_attachment') }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="submit-btn">
                <div>
                    <a-button>取消</a-button>
                    <a-button type="primary">提交</a-button>
                </div>
                <div class="problem-tips">
                    <span>问题已解决</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, watch } from "vue";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import Core from "@/core";
import { useRouter } from "vue-router";
import Util from "../../core/utils";

const { proxy } = getCurrentInstance();
const router = useRouter()

const customerCareDetail = ref({
    type: 1, // 问询单类型 1故障 2咨询 3电池
    sorting_type: 10, // 归类状态
    sorting_type2: 30, // 索赔状态
    status: 10, // 订单状态
    img: [
        "https://horwin.oss-cn-hangzhou.aliyuncs.com//img/ba37a2f6f160d68d31f1a96b4a17f2b068b6cee17e6c7b96db51ba5016ef1df0.png",
        "https://horwin.oss-cn-hangzhou.aliyuncs.com//img/ba37a2f6f160d68d31f1a96b4a17f2b068b6cee17e6c7b96db51ba5016ef1df0.png",
    ],
});

const partsData = ref([
    {
        id: 1,
        name: 1,
    },
]);
const faultData = ref([
    {
        id: 1,
        vehicle_uid: 123456789,
    },
]);
const isDistributerAdmin = ref(false); // 根据路由判断其是用在分销商(false) 还是平台方(true)

watch(
    () => router.currentRoute.value,
    (newValue, oldValue) => {
        console.log("newValue", newValue);
        if (newValue.matched[0].path === "/customer-care") {
            // 分销商的客户关怀
            isDistributerAdmin.value = false;
        } else if (newValue.matched[0].path === "/inquiry-management") {
            // 平台方
            isDistributerAdmin.value = true;
        }
    },
    {
        deep: true,
        immediate: true,
    }
);

/* computed start */
const partsColumns = computed(() => {
    const result = [
        { title: proxy.$t("common.name"), dataIndex: "name", key: "name" }, // 名称
        { title: proxy.$t("common.product_code"), dataIndex: "name", key: "name" }, // 商品编码
        { title: proxy.$t("common.type"), dataIndex: "name", key: "name" }, // 类型
        { title: proxy.$t("common.quantity"), dataIndex: "number", key: "number" }, // 数量
    ];
    return result;
});
const faultColumns = computed(() => {
    const result = [
        { title: proxy.$t("common.vehicle_no"), dataIndex: "vehicle_uid", key: "vehicle_uid" }, // 车架号
        { title: proxy.$t("customer-care.fault_classification"), dataIndex: "fault_type", key: "fault_type" }, // 故障分类
    ];
    return result;
});
/* computed end */

/* fetch start */
const Fetch = (params = {}) => {
    const obj = {
        ...params,
    };

    Core.Api.list(obj)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {});
};
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
                        background: #f2f3f5;
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

    .inquiry-classification {
        background-color: #fff;
        padding: 20px;
        box-sizing: border-box;

        .inquiry-classification-title {
            color: #1d2129;
            font-size: 18px;
            font-weight: 400;
        }

        .inquiry-classification-item {
            display: flex;
            // align-items: center;
            .inquiry-classification-key {
                color: #1d2129;
                font-size: 14px;
                font-weight: 400;
                width: 100px;
                text-align: right;
                margin-right: 16px;
            }
            .inquiry-classification-value {
                color: #1d2129;
                font-size: 14px;
                font-weight: 400;
                width: 100%;

                .good-faith-claims {
                    background-color: #f7f8fa;
                    .good-faith-claims-title {
                        color: #1d2129;
                        font-size: 14px;
                        font-weight: 500;
                    }

                    .good-faith-claims-time {
                        display: flex;
                        align-items: center;

                        .time-name {
                            color: #1d2129;
                            font-size: 14px;
                            font-weight: 400;
                            white-space: nowrap;
                        }
                    }
                }
            }
        }

        // 沟通过程 || 留言
        .communication-process {
            background-color: #f7f8fa;
            // min-height: 559px;

            .communication-process-other-reply,
            .communication-process-my-reply {
            }

            .communication-process-other-reply {
                       
                .other-reply-platform-top {
                    display: flex;
                    .other-reply-platform-avatar {
                        width: 36px;
                        height: 36px;
                        background-color: #86909c;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .other-reply-platform-name {
                        .name {
                            color: #1d2129;
                            font-size: 14px;
                            font-weight: 400;
                        }
                        .time {
                            color: #86909c;
                            font-size: 12px;
                            font-weight: 400;
                        }
                    }
                }

                .other-reply-platform-bottom {
                    display: inline-block;
                    .speech-skill {       
                        border-radius: 4px;                 
                        background-color: #fff;
                        color: #1D2129;
                        font-size: 14px;
                        font-weight: 400;                        
                    }
                    .attachment {

                    }
                }
            }
            .communication-process-my-reply {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                .my-reply-platform-top {
                    display: flex;
                    .my-reply-platform-avatar {
                        width: 36px;
                        height: 36px;
                        background-color: #86909c;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .my-reply-platform-name {
                        text-align: right;
                        .name {
                            color: #1d2129;
                            font-size: 14px;
                            font-weight: 400;
                        }
                        .time {
                            color: #86909c;
                            font-size: 12px;
                            font-weight: 400;
                        }
                    }
                }

                .my-reply-platform-bottom {
                    display: inline-block;
                    .speech-skill {
                        border-radius: 4px;              
                        background-color: #66A0FF;
                        color: #FFF;
                        font-size: 14px;
                        font-weight: 400;                        
                    }
                    .attachment {

                    }
                }
            }

            .add-attachment {
                .add-attachment-title {
                    color: #1D2129;
                    font-size: 14px;
                    font-weight: 400;
                }   
            }
        }

        // 按钮
        .submit-btn {
            margin-top: 20px;
            padding-top: 18px;
            box-sizing: border-box;
            border-top: 1px solid #F2F3F5;            
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            .problem-tips {
                position: absolute;
                right: 0;
                font-size: 14px;
                font-weight: 400;
                color: #1D2129;
                border-radius: 4px;
                border: 1px solid #E5E6EB;
                background: #FFF;
                padding: 4px 8px;
            }
        }
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

.w-224 {
    width: 224px;
}
</style>
