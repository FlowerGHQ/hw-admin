<template>
    <div class="general-view">
        <div class="general-view-item">
            <div class="title">订单（{{ userMes.order_count || 0 }}）</div>
            <div class="content">
                <div class="content-item">
                    <p class="content-item-num">
                        {{ userMes.pre_order_statistics ? userMes.pre_order_statistics.wait_pay_count : 0 }}
                    </p>
                    <p class="content-item-name">待支付</p>
                </div>
                <div class="content-item">
                    <p class="content-item-num">
                        {{ userMes.pre_order_statistics ? userMes.pre_order_statistics.cancel_count : 0 }}
                    </p>
                    <p class="content-item-name">已取消</p>
                </div>
                <div class="content-item">
                    <p class="content-item-num">
                        {{ userMes.pre_order_statistics ? userMes.pre_order_statistics.pay_count : 0 }}
                    </p>
                    <p class="content-item-name">已支付</p>
                </div>
                <div class="content-item">
                    <p class="content-item-num">
                        {{ userMes.pre_order_statistics ? userMes.pre_order_statistics.refund_count : 0 }}
                    </p>
                    <p class="content-item-name">已退订/退款</p>
                </div>
            </div>
        </div>
        <!-- <div class="general-view-item">
            <div class="title">工单（2）</div>
            <div class="content">
                <div class="content-item">
                    <p class="content-item-num">2</p>
                    <p class="content-item-name">待处理</p>
                </div>
                <div class="content-item">
                    <p class="content-item-num">2</p>
                    <p class="content-item-name">处理中</p>
                </div>
                <div class="content-item">
                    <p class="content-item-num">2</p>
                    <p class="content-item-name">已处理</p>
                </div>
            </div>
        </div> -->
        <div class="general-view-item">
            <div class="title">试驾（{{ testTotal || 0 }}）</div>
            <div class="content">
                <div class="drive-mes">
                    <p class="drive-mes-name">{{ dirveData.test_drive_vehicle_name }}</p>
                    <p class="drive-mes-time">{{ Core.Util.timeFilter(dirveData.create_time, 2) }}</p>
                </div>
                <div class="drive-label">
                    <my-tag
                        :border="true"
                        :borderColor="Static.STATUS_MAP[dirveData.status]?.borderColor"
                        :color="Static.STATUS_MAP[dirveData.status]?.color"
                        bgColor="#FFF"
                        >{{ Static.STATUS_MAP[dirveData.status]?.key }}</my-tag
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import Static from '../static';
import myTag from '../components/my-tag.vue';
import { reactive, ref, watch, inject } from 'vue';

const userId = inject('userId');

const getData = () => {
    getUserDetail();
    getDriveListFetch();
};
const userMes = reactive({});
const dirveData = reactive({});
const testTotal = ref(0);
const getUserDetail = () => {
    if (!userId.value) return;
    Core.Api.CustomService.detail({ id: userId.value })
        .then(res => {
            Object.assign(userMes, res);
            userMes.order_count =
                Number(res.pre_order_statistics.wait_pay_count) +
                Number(res.pre_order_statistics.cancel_count) +
                Number(res.pre_order_statistics.pay_count) +
                Number(res.pre_order_statistics.refund_count);
            Core.Logger.success('getUserDetail', userMes);
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};
// 获取试驾单列表
const getDriveListFetch = () => {
    if (!userId.value) return;
    let obj = {
        customer_id: userId.value, // 客户id
    };
    Core.Api.CustomService.getTestDriveList(obj)
        .then(res => {
            Core.Logger.success('参数', obj, '获取试驾单列表', res);
            testTotal.value = res.count;
            if (res.list.length > 0) {
                Object.assign(dirveData, res.list[0]);
            }
        })
        .catch(err => {
            Core.Logger.error('参数', obj, '获取试驾单列表', err);
        });
};
defineExpose({ getData });
</script>

<style lang="less" scoped>
.general-view {
    display: flex;
    flex-wrap: wrap;
    &-item {
        width: calc((100% - 16px) / 2);
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #e5e6eb;
        margin-right: 16px;
        margin-bottom: 16px;
        &:nth-child(2n) {
            margin-right: 0;
        }
        .title {
            color: #1d2129;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
        }
        .content {
            display: flex;
            justify-content: space-between;
            &-item {
                flex: 1;
                &-num {
                    color: #1d2129;
                    text-align: center;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                &-name {
                    color: #4e5969;
                    text-align: center;
                    font-size: 14px;
                }
            }
            .drive-mes {
                .drive-mes-name {
                    color: #1d2129;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                .drive-mes-time {
                    color: #86909c;
                    font-size: 12px;
                }
            }
            .drive-label {
                font-weight: 600;
            }
        }
    }
}
</style>
