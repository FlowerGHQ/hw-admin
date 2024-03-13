<template>
    <div class="recharge-detail">
        <div class="title-container">
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
        <div class="recharge-info gray-panel">
            <div class="title-content">
                <div class="title">{{ /*充值信息 */ $t('distributor-detail.recharge_info') }}</div>
                <div class="status-tips">
                    <div class="left-tips">
                        <!-- 充值中 -->
                        <div class="recharging" v-if="details.status === 0">
                            <div class="tips-top">预计到账需要3-5天，请耐心等待</div>
                            <div class="tips-bottom">
                                充值结果将通过邮箱发送给您，请注意查收邮箱。也可进入充值进度页面查看进度。
                            </div>
                        </div>
                        <!-- 到账失败 -->
                        <div class="recharg-fail" v-else-if="details.status === 1">
                            <div class="tips-area">账户存在异常，请仔细查看充值帐户是否正常</div>
                        </div>
                        <!-- 到账成功 -->
                        <div class="recharg-success" v-else>
                            <div class="tips-area">资金已打入对应帐户</div>
                        </div>
                    </div>
                    <div
                        class="right-icon-text"
                        :style="{
                            backgroundColor: statusMap[details.status].backgroundColor,
                            color: statusMap[details.status].color,
                        }"
                    >
                        <div class="icon">
                            <my-svg-icon :iconClass="statusMap[details.status].icon" />
                        </div>
                        <div class="text">
                            {{ statusMap[details.status].value }}
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
                        <div class="content">€{{ details.amount }}</div>
                    </a-col>
                </a-row>
                <a-row :gutter="[16, 30]">
                    <a-col :span="6">
                        <div class="title">
                            {{ /*整车可用余额 */ $t('distributor-detail.vehicle_available_balance') }}
                        </div>
                        <div class="content">€{{ details.balance }}</div>
                    </a-col>
                    <a-col :span="6">
                        <div class="title">
                            {{ /*零部件可用余额 */ $t('distributor-detail.parts_available_balance') }}
                        </div>
                        <div class="content">€{{ details.partBalance }}</div>
                    </a-col>
                </a-row>
            </div>
            <!-- 账号信息 -->
            <div class="account-info">
                <div class="title-area">
                    <div class="title">Receivables Account</div>
                    <div class="copy-area">
                        <MySvgIcon iconClass="recharge-detail-copy" />
                        <div class="copy-tips">Copy Payment Account Information</div>
                    </div>
                </div>
                <div class="gird-area">
                    <a-row>
                        <a-col :span="8">
                            <div class="title">Account Holder：</div>
                            <div class="content">{{ details.accountHolder }}</div>
                        </a-col>
                        <a-col :span="8">
                            <div class="title">Account Nickname：</div>
                            <div class="content">{{ details.accountNickname }}</div>
                        </a-col>
                        <a-col :span="8">
                            <div class="title">IBAN：：</div>
                            <div class="content">{{ details.iban }}</div>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="8">
                            <div class="title">SWIFT/BIC：</div>
                            <div class="content">{{ details.swift }}</div>
                        </a-col>
                        <a-col :span="8">
                            <div class="title">Bank Name：</div>
                            <div class="content">{{ details.bankName }}</div>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </div>
        <!-- 付款凭证 -->
        <div class="gray-panel payment-voucher">
            <div class="title-content">
                <div class="title">{{ /*充值信息 */ $t('distributor-detail.payment_voucher') }}</div>
                <div class="button-area">
                    <!-- 修改凭证 -->
                    <a-button>{{ /*修改凭证 */ $t('distributor-detail.modify_voucher') }}</a-button>
                    <!-- 保存修改 -->
                    <a-button type="primary">{{ /*保存修改 */ $t('distributor-detail.save_modify') }}</a-button>
                </div>
            </div>
            <div class="tips">
                <ul>
                    <li>You can upload images in PNG, JPG, JPEG format, up to 9 images per file.</li>
                    <li>For documents, only PDF format is supported, with a maximum of 3 files.</li>
                </ul>
            </div>
            <div class="image-pdf-area">
                <div class="image">
                    <img src="" alt="" v-for="item in 9" />
                </div>
                <div class="pdf">
                    <div class="pdf-item" v-for="item in 2"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { LeftOutlined } from '@ant-design/icons-vue';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const statusMap = {
    0: {
        value: '充值中',
        icon: 'recharge-detail-warning',
        backgroundColor: 'rgba(255,147,21,0.1)',
        color: 'rgba(255,147,21,1)',
    },
    1: {
        value: '到账失败',
        icon: 'recharge-detail-fail',
        backgroundColor: 'rgba(255,61,64,0.1)',
        color: 'rgba(255,61,64,1)',
    },
    2: {
        value: '到账成功',
        icon: 'recharge-detail-success',
        backgroundColor: 'rgba(38,171,84,0.1)',
        color: 'rgba(0,204,153,1)',
    },
};

const details = ref({
    status: 0,
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
</script>

<style lang="less" scoped>
.recharge-detail {
    .title-container {
        justify-content: start !important;
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
                width: 63px;
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
            margin-top: 28px;
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
        .gird-area {
            margin-bottom: 0;
            .ant-row {
                .ant-col {
                    .content {
                        font-size: 14px;
                        color: #1d2129 !important;
                        line-height: 22px;
                    }
                }
            }
        }
    }
}
</style>
