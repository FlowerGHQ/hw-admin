<template>
    <div class="recharge-detail">
        <div class="title-container">
            <div class="left">
                <left-outlined
                    @click="() => router.go(-1)"
                    :style="{
                        fontSize: '14px',
                        color: '#7f8e9f',
                        cursor: 'pointer',
                    }"
                />
                <div class="title-area">{{ /*充值详情 */ $t('distributor-detail.recharge_detail') }}</div>
            </div>

            <div class="button-area" v-if="details.mapStatus == 1 && $auth('DISTRIBUTOR')">
                <!-- 修改凭证 -->
                <a-button @click="handleEdit">{{ /*修改凭证 */ $t('n.amend') }}</a-button>
                <!-- 保存修改 -->
                <!-- <a-button type="primary" v-else @click="handleSaveModify">{{
                        /*保存修改 */ $t('distributor-detail.save_modify')
                    }}</a-button> -->
            </div>
        </div>
        <div class="recharge-info gray-panel">
            <div class="title-content">
                <div class="title">{{ /*充值信息 */ $t('distributor-detail.recharge_info') }}</div>
                <div class="status-tips">
                    <div class="left-tips">
                        <!-- 充值中 -->
                        <div class="recharging" v-if="details.mapStatus === 0">
                            <div class="tips-top">{{ $t('distributor-detail.arrival_progress_tips') }}</div>
                            <div class="tips-bottom">
                                {{ $t('distributor-detail.recharge_result_tips') }}
                            </div>
                        </div>
                        <!-- 到账失败 -->
                        <div class="recharg-fail" v-else-if="details.mapStatus === 1">
                            <div class="tips-area">{{ details?.remark || '' }}</div>
                        </div>
                        <!-- 到账成功 -->
                        <div class="recharg-success" v-else-if="details.mapStatus === 2">
                            <div class="tips-area">{{ $t('distributor-detail.fund_has_been_transferred') }}</div>
                        </div>
                    </div>
                    <div
                        class="right-icon-text"
                        :style="{
                            backgroundColor: statusMap[details.mapStatus].backgroundColor,
                            color: statusMap[details.mapStatus].color,
                        }"
                    >
                        <div class="icon">
                            <my-svg-icon :iconClass="statusMap[details.mapStatus].icon" />
                        </div>
                        <div class="text">
                            {{ statusMap[details.mapStatus].value }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="gird-area">
                <a-row :gutter="[16, 30]">
                    <a-col :span="6">
                        <div class="title">
                            {{ /*本次需要转账金额 */ $t('distributor-detail.current_transfer_amount') }}
                        </div>
                        <div class="content">
                            {{ route.query.currency }}
                            {{ Core.Util.countFilter(details?.content_json?.total_amount || 0) }}
                        </div>
                    </a-col>
                </a-row>
                <a-row :gutter="[16, 30]">
                    <a-col :span="6">
                        <div class="title">
                            {{ /*整车可用余额 */ $t('distributor-detail.vehicle_available_balance') }}
                        </div>
                        <div class="content">
                            {{ route.query.currency }}
                            {{ Core.Util.countFilter(details?.content_json?.vehicle_balance || 0) }}
                        </div>
                    </a-col>
                    <a-col :span="6">
                        <div class="title">
                            {{ /*零部件可用余额 */ $t('distributor-detail.parts_available_balance') }}
                        </div>
                        <div class="content">
                            {{ route.query.currency }}
                            {{ Core.Util.countFilter(details?.content_json?.part_balance || 0) }}
                        </div>
                    </a-col>
                </a-row>
            </div>
            <!-- 账号信息 -->
            <div class="account-info">
                <div class="title-area">
                    <div class="title">Receivables Account</div>
                    <div class="copy-area" @click="handleCopy('paymentInfo')">
                        <MySvgIcon iconClass="recharge-detail-copy" />
                        <div class="copy-tips">Copy Payment Account Information</div>
                    </div>
                </div>
                <div class="gird-area-info" id="paymentInfo">
                    <div class="info-item" v-for="item in labelMap" :key="item.key">
                        <!-- label -->
                        <div class="title">{{ item.label }}</div>
                        <!-- value -->
                        <div class="content">{{ item.value }}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 付款凭证 -->
        <div class="gray-panel payment-voucher">
            <div class="title-content">
                <div class="title">{{ /*充值信息 */ $t('distributor-detail.payment_voucher') }}</div>
            </div>
            <div class="image-pdf-area">
                <!-- :isShowUpload="isShowUpload" -->
                <MyFileUpload returnType="Arr" v-model:value="defaultList" :isShowUpload="isShowUpload" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { LeftOutlined } from '@ant-design/icons-vue';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import Core from '../../core';
import { useI18n } from 'vue-i18n';
import { forEach, uniqueId, cloneDeep } from 'lodash';
import MyFileUpload from './components/MyFileUpload.vue';

const $t = useI18n().t;
const router = useRouter();
const route = useRoute();
const statusMap = computed(() => {
    return {
        0: {
            value: $t('distributor-detail.rechargeing'),
            icon: 'recharge-detail-warning',
            backgroundColor: 'rgba(255,147,21,0.1)',
            color: 'rgba(255,147,21,1)',
        },
        1: {
            value: $t('distributor-detail.arrival_failed'),
            icon: 'recharge-detail-fail',
            backgroundColor: 'rgba(255,61,64,0.1)',
            color: 'rgba(255,61,64,1)',
        },
        2: {
            value: $t('distributor-detail.arrival_success'),
            icon: 'recharge-detail-success',
            backgroundColor: 'rgba(38,171,84,0.1)',
            color: 'rgba(0,204,153,1)',
        },
    };
});

const details = ref({
    status: 0,
    mapStatus: 0,
    // 本次需要转账金额
    amount: 0,
    // 整车可用余额
    balance: 0,
    // 零部件可用余额
    partBalance: 0,
    //Account Holder：
    accountHolder: 'HORWIN EUROPE B.V.',
    // Account Nickname：
    accountNickname: 'EUR Receive Account',
    // IBAN：
    iban: 'IE40 CHAS 9309 0301 1930 61',
    // SWIFT/BIC：
    swift: 'CHASIE2X',
    // Bank Name：
    bankName: 'JPMORGAN CHASE BANK, N.A.',
});

const labelMap = ref([
    { key: 'beneficiary_bank', label: 'BENEFICIARY BANK' },
    { key: 'swift_code', label: 'SWIFT CODE' },
    { key: 'bank_address', label: 'BANK ADDRESS' },
    { key: 'account_number', label: 'ACCOUNT NUMBER' },
    { key: 'company_name', label: 'COMPANY NAME' },
    { key: 'company_address', label: 'COMPANY ADDRESS' },
    { key: 'remark', label: $t(/*其他汇款信息*/ 'payment-management.other_remittance_info') },
]);

const defaultList = ref([]);
const isShowUpload = ref(false);
const isEdit = ref(false);

// 获取订单详情
const getRechargeDetail = () => {
    let params = {
        id: route.query.order,
    };
    Core.Api.RechargeAudit.detail(params).then(res => {
        details.value = res.detail;
        //1.待审核(一审)；2.审核通过；3.审核不通过(一审) 4 等待二审 5 二审不通过
        switch (details.value.status) {
            case 1:
                details.value.mapStatus = 0;
                break;
            case 2:
                details.value.mapStatus = 2;
                break;
            case 3:
                details.value.mapStatus = 1;
                break;
            case 4:
                details.value.mapStatus = 0;
                break;
            case 5:
                details.value.mapStatus = 1;
                break;

            default:
                break;
        }

        let paymenyInfo = res?.detail?.content_json?.payment_information || {};
        defaultList.value = res?.detail?.content_json?.payment_information?.img || [];
        console.log('defaultList.value', defaultList.value);
        // 判断payment_information是否为空
        if (Object.keys(paymenyInfo).length) {
            // 遍历对象
            for (let key in paymenyInfo) {
                forEach(labelMap.value, item => {
                    if (key === item.key) {
                        item.value = paymenyInfo[key];
                    }
                });
            }
        }
        // 将value为空的或者不存在的过滤掉
        labelMap.value = labelMap.value.filter(item => item.value);

        console.log('details', details.value);
    });
};

// 复制
const handleCopy = id => {
    const copyText = document.getElementById(id);
    const range = document.createRange();
    range.selectNode(copyText);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    message.success('Copy Success');
};

const handleEdit = () => {
    router.push({
        path: '/mall/recharge',
        query: {
            id: route.query.id,
            order_id: route.query.order,
        },
    });
};

onMounted(() => {
    getRechargeDetail();
});
</script>

<style lang="less" scoped>
.recharge-detail {
    .title-container {
        align-items: center;
        .left {
            display: flex;
            align-items: center;
        }
        .title-area {
            margin-left: 11.5px;
        }
    }
    .gray-panel {
        background: #fff;
        padding: 20px;
    }
    .recharge-info,
    .payment-voucher {
        .title-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
            .title {
                min-width: 63px;
                height: 24px;
                font-size: 16px;
                font-weight: 500;
                color: #1d2129;
                line-height: 24px;
            }
            .status-tips {
                display: flex;
                align-items: center;
                .left-tips {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    margin-right: 10px;
                    .recharging {
                        .tips-top {
                            font-size: 14px;
                            color: #1d2129;
                            line-height: 22px;
                        }
                        .tips-bottom {
                            font-size: 12px;
                            color: #7f8e9f;
                            line-height: 20px;
                        }
                    }
                    .recharg-fail {
                        .tips-area {
                            font-size: 14px;
                            color: #1d2129;
                            line-height: 22px;
                        }
                    }
                    .recharg-success {
                        .tips-area {
                            font-size: 14px;
                            color: #1d2129;
                            line-height: 22px;
                        }
                    }
                }
                .right-icon-text {
                    display: flex;
                    align-items: center;
                    min-width: 114px;
                    height: 44px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .icon {
                        margin-right: 4px;
                        font-size: 18px;
                    }
                    .text {
                        font-size: 14px;
                        line-height: 22px;
                    }
                }
            }
        }
        .image-pdf-area {
            .image {
                display: flex;
                flex-wrap: wrap;
                img {
                    width: 78px;
                    height: 78px;
                    margin-right: 20px;
                    margin-bottom: 20px;
                }
            }
            .pdf {
                display: flex;
                .pdf-item {
                    width: 78px;
                    height: 78px;
                    margin-right: 20px;
                    background: #f5f7fa;
                }
            }
        }
        .tips {
            margin-left: 20px;
            ul {
                li {
                    font-size: 14px;
                    color: #666666;
                    line-height: 22px;
                    margin-bottom: 10px;
                }
            }
        }
    }
    .gird-area {
        margin-bottom: 47px;
        .ant-row {
            margin-bottom: 30px;
            &:last-child {
                margin-bottom: 0;
            }
            .ant-col {
                display: flex;
                align-items: center;
                .title {
                    margin-right: 16px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #1d2129;
                    line-height: 22px;
                }
                .content {
                    font-size: 16px;
                    font-weight: 500;
                    color: #0061ff;
                    line-height: 24px;
                }
            }
        }
    }
    .account-info {
        .title-area {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .title {
                font-size: 14px;
                font-weight: 500;
                color: #1d2129;
                line-height: 22px;
            }
            .copy-area {
                display: flex;
                align-items: center;
                margin-left: 20px;
                font-size: 14px;
                cursor: pointer;
                .copy-tips {
                    font-size: 12px;
                    color: #7f8e9f;
                    line-height: 20px;
                    margin-left: 4px;
                }
            }
        }
        .gird-area-info {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .info-item {
                width: 30%;
                display: flex;
                margin-bottom: 20px;
                .title {
                    font-size: 14px;
                    color: #7f8e9f;
                    line-height: 22px;
                    // 增加:
                    &::after {
                        content: '：';
                        display: inline-block;
                    }
                }
                .content {
                    font-size: 14px;
                    color: #1d2129;
                    line-height: 22px;
                    margin-left: 16px;
                }
            }
        }
    }
    .recharge-info {
        padding-bottom: 0 !important;
    }
}
</style>
