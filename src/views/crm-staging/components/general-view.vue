<template>
    <div class="general-view">
        <div class="general-view-item">
            <div class="title">订单（1）</div>
            <div class="content">
                <div class="content-item">
                    <p class="content-item-num">2</p>
                    <p class="content-item-name">待支付</p>
                </div>
                <div class="content-item">
                    <p class="content-item-num">2</p>
                    <p class="content-item-name">已取消</p>
                </div>
                <div class="content-item">
                    <p class="content-item-num">2</p>
                    <p class="content-item-name">已支付</p>
                </div>
                <div class="content-item">
                    <p class="content-item-num">2</p>
                    <p class="content-item-name">已退订/退款</p>
                </div>
            </div>
        </div>
        <div class="general-view-item">
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
        </div>
        <div class="general-view-item">
            <div class="title">试驾（2）</div>
            <div class="content">
                <div class="drive-mes">
                    <p class="drive-mes-name">SENMENTI 0 · 创世版</p>
                    <p class="drive-mes-time">2023-12-12 12:13</p>
                </div>
                <div class="drive-label">
                    <my-tag :border="true" borderColor="#CCDFFF" color="#0061FF" bgColor="#FFF">已试驾</my-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import myTag from "../components/my-tag.vue";
import { reactive, ref, toRefs } from 'vue';



</script>

<style lang="less" scoped>
.general-view {
    display: flex;
    flex-wrap: wrap;
    &-item {
        width: calc((100% - 16px) / 2);
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #E5E6EB;
        margin-right: 16px;
        margin-bottom: 16px;
        &:nth-child(2n) {
            margin-right: 0;
        }
        .title {
            color: #1D2129;
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
                    color: #1D2129;
                    text-align: center;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                &-name {
                    color: #4E5969;
                    text-align: center;
                    font-size: 14px;
                }
            }
            .drive-mes {
                .drive-mes-name {
                    color: #1D2129;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                .drive-mes-time {
                    color: #86909C;
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
