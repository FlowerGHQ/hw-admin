<template>
    <div class="steps" v-if="list.length">
        <div class="record-box" v-for="(item, index) in list" :key="index">
            <div class="head-record">
                <div class="step-left">
                    <img class="step-img" :src="item.avatar || Static.defaultAvatar" />
                    <div class="line" v-if="index !== list.length - 1"></div>
                </div>
                <div class="step-content">
                    <div class="nameAndTime">
                        <div class="name">
                            {{ item.store_user_name || '-' }}（{{ $Util.peoStoreStatus(item.user_type) || '-' }}）
                            <!-- <span v-if="item.user_type"><span v-if="item.user_type">(</span>123<span v-if="item.user_type">)</span></span> -->
                        </div>
                        <div class="time">{{ $Util.timeFilter(item.create_time) }}</div>
                    </div>
                    <div class="content">
                        <div class="content-head">
                            <div class="content-title">
                                <span v-if="type === 1" class="content-title-label">跟进方式：</span>
                                {{ $Util.tabTypeStatus(item.method) }}
                            </div>
                            <my-tag
                                v-if="type === 1 && item.type"
                                border
                                :color="$Util.tabStatus(item.type, 'color')"
                                :bgColor="$Util.tabStatus(item.type, 'background')"
                                :borderColor="$Util.tabStatus(item.type, 'borderC')"
                                class="message-label"
                                >{{ $Util.tabStatus(item.type) }}</my-tag
                            >
                        </div>
                        <div class="content-text" v-if="item.content">{{ item.content }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import myTag from '../components/my-tag.vue';
import { reactive, ref } from 'vue';
import Core from '@/core';
import Static from '../static';
const $prop = defineProps({
    list: {
        type: Array,
        default: [],
    },
    type: {
        type: Number,
        default: 1,
    },
});
</script>

<style scoped lang="less">
.steps {
    padding: 20px 0;
    .head-record {
        position: relative;
        display: flex;
        color: #86909c;
        .step-left {
            position: relative;
            .step-img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
            }
            .line {
                position: absolute;
                top: 32px;
                height: calc(100% - 32px);
                left: 50%;
                border-left: #e5e6eb solid 1px;
            }
        }
        .step-content {
            flex: 1;
            padding-left: 8px;
            padding-bottom: 20px;
            .nameAndTime {
                display: flex;
                align-items: center;
                .name {
                    color: #1d2129;
                    font-size: 14px;
                    margin-right: 8px;
                }
                .time {
                    padding-top: 2px;
                    color: #86909c;
                    font-size: 12px;
                }
            }

            .head-wrap {
                display: flex;
                align-items: center;
                .create-time {
                    color: #86909c;
                    font-size: 14px;
                    margin-right: 12px;
                }
                .distribution-user {
                    color: #86909c;
                    font-size: 14px;
                }
            }
            .status {
                color: #00b42a;
                font-size: 13px;
                line-height: normal;
                padding: 6px 0;
            }
            .content {
                width: 100%;
                border-radius: 4px;
                background: #f7f8fa;
                margin-top: 8px;
                padding: 12px;
                box-sizing: border-box;
                .content-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    .content-title {
                        color: #1d2129;
                        font-size: 14px;
                        font-weight: 600;
                        .content-title-label {
                            color: #86909c;
                            font-weight: 400;
                        }
                    }
                }
                .content-text {
                    color: #4e5969;
                    font-size: 13px;
                    margin-bottom: 15px;
                }
            }
            .form-content {
                width: 100%;
                border-radius: 13px;
                background: #f7f8fa;
                margin-top: 8px;
                padding: 12px;
                box-sizing: border-box;
                .form-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .form-item:last-child {
                    margin-bottom: 0;
                }
                .form-key {
                    color: #86909c;
                    font-size: 15px;
                    font-weight: 400;
                    margin-right: 8px;
                }
                .form-value {
                    color: #1d2129;
                    font-size: 15px;
                    font-weight: 400;
                }
            }
            .cc-list {
                display: flex;
                flex-wrap: wrap;
                .cc-item {
                    display: flex;
                    padding: 4px 10px 4px 4px;
                    align-items: center;
                    border-radius: 40px;
                    background: #f2f3f5;
                    margin-right: 8px;
                    .cc-name {
                        color: #1d2129;
                        font-size: 13px;
                        line-height: normal;
                    }
                }
            }
        }
    }
}
</style>
