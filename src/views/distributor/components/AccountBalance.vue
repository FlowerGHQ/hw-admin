<template>
    <div class="account-balance">
        <!-- 上方个人信息 -->
        <div class="top-content">
            <div class="user-name">
                用户姓名
            </div>
            <div class="account-balance-content">
                <div class="account-balance-title">账户余额</div>
                <div class="balance-detail">{{ accountBalance }}<span style="font-size: 14px;">元</span></div>
            </div>
        </div>
        <div class="table-container" >
            <div id="chartId" class="chart" ref='chartId'></div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Core from '../../../core';
import { Chart } from '@antv/g2'
// 数据
const accountBalance = ref('124,543')
</script>

<style lang="less" scoped>
.account-balance {
    .top-content {
        display: flex;
        padding: 30px 30px;
        box-sizing: border-box;
        height: 100px;
        width: 100%;
    }
    .user-name {
        font-size: 16px;
    }
    .account-balance-content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-left: 200px;
        .account-balance-title {
            color: #999999;
            font-size: 14px;
        }
        .balance-detail {
            font-size: 20px;
        }
    }
}
</style>