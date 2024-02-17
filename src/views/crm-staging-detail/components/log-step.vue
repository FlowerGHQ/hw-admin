<template>
    <div class="steps" v-if="list.length">
        <div class="record-box" v-for="(item, index) in list" :key="index">
            <div class="head-record">
                <div class="step-left">
                    <img
                        v-if="!item.operator_avatar || item.operator_avatar === ''"
                        class="step-img"
                        :src="Static.defaultAvatar"
                        alt=""
                    />
                    <img v-else class="step-img" :src="item.operator_avatar" alt="" />
                    <div class="line" v-if="index !== list.length - 1"></div>
                </div>
                <div class="step-content">
                    <div class="nameAndTime">
                        <div class="name">
                            <span>{{ item.operator_name || '-' }}</span>
                        </div>
                        <div class="time">{{ $Util.timeFilter(item.create_time) }}</div>
                    </div>
                    <div class="content">
                        <template v-for="(logItem, index) in item.content.content" :key="index">
                            <div class="content-head">
                                <div class="content-title">修改用户信息</div>
                            </div>
                            <div class="content-text" :class="{ 'm-b-15': index !== item.content.content.length - 1 }">
                                <span>{{ Core.Const.WORK_OPERATION.LOG_KEY_MAP[logItem.key]?.text || '-' }}</span>
                                <template v-if="Core.Const.WORK_OPERATION.LOG_KEY_MAP[logItem.key]?.text === '性别'">
                                    <span
                                        >【{{
                                            logItem.old_value ? Core.Const.CRM_ORDER.SEX[logItem.old_value]?.zh : '-'
                                        }}】</span
                                    >
                                    <span>变更为</span>
                                    <span
                                        >【{{
                                            logItem.new_value ? Core.Const.CRM_ORDER.SEX[logItem.new_value]?.zh : '-'
                                        }}】</span
                                    >
                                </template>
                                <template
                                    v-else-if="Core.Const.WORK_OPERATION.LOG_KEY_MAP[logItem.key]?.text === '意向度'"
                                >
                                    <span
                                        >【{{
                                            logItem.old_value
                                                ? Core.Const.WORK_OPERATION.INTENTION.TYPE_MAP[logItem.old_value]?.text
                                                : '-'
                                        }}】</span
                                    >
                                    <span>变更为</span>
                                    <span
                                        >【{{
                                            logItem.new_value
                                                ? Core.Const.WORK_OPERATION.INTENTION.TYPE_MAP[logItem.new_value]?.text
                                                : '-'
                                        }}】</span
                                    >
                                </template>
                                <template v-else>
                                    <span>【{{ logItem.old_value || '-' }}】</span>
                                    <span>变更为</span>
                                    <span>【{{ logItem.new_value || '-' }}】</span>
                                </template>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
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
                    }
                }
                .content-text {
                    color: #4e5969;
                    font-size: 14px;
                    font-weight: 400;
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
.m-b-15 {
    margin-bottom: 15px;
}
</style>
