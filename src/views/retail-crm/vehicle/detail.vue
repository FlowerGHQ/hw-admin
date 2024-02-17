<template>
    <div class="vehicle-detail">
        <div class="d-top">
            <div class="title">
                {{ $t('retail.vehicle_detail') }}
            </div>
            <div class="container">
                <div class="d-img">
                    <img
                        class="img"
                        src="https://img2.baidu.com/it/u=1143142527,1258116580&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750"
                        alt=""
                    />
                </div>
                <div class="d-content">
                    <a-row class="all-msg">
                        <div class="vehicle-msg">
                            <span>SENMENTI 0 · 创世版</span>
                            <!-- 使用中 -->
                            <span class="use">{{ $t('retail.use') }}</span>
                            <!-- 试驾车 -->
                            <span class="test-drive">{{ $t('retail.test_drive') }}</span>
                        </div>
                        <div class="vehicle-id">
                            <span class="key">ID：</span>
                            <span class="value"> 12345678 </span>
                        </div>
                    </a-row>
                    <a-row class="row-detail">
                        <!-- 系列 -->
                        <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.series') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                        <!-- 型号 -->
                        <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.model') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                        <!-- 颜色 -->
                        <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.color') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                        <!-- 入库时间 -->
                        <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.warehousing_time') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                        <!-- 车辆用途 -->
                        <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.vehicle_usage') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                        <!-- 使用状态 -->
                        <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.use_status') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                        <!-- 所属大区 -->
                        <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.subregion') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                        <!-- 所属城市 -->
                        <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.home_city') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                        <!-- 所属门店 -->
                        <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.affiliated_store') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                        <!-- 名称 -->
                        <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                            <span class="key key-form-86909C">{{ $t('retail.name') }}：</span>
                            <span class="value"> 你好 </span>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </div>
        <div class="d-bottom">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="vehicle_information" :tab="$t('retail.vehicle_information')">
                    <vehicleInformationCom />
                </a-tab-pane>
                <a-tab-pane key="test_drive_records" :tab="$t('retail.test_drive_records')">
                    <driveRecordsCom />
                </a-tab-pane>
                <!-- <a-tab-pane key="maintenance_records" :tab="$t('retail.maintenance_records')">   
                    <maintenanceRecordsCom/>
                </a-tab-pane> -->
            </a-tabs>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import vehicleInformationCom from './components/vehicle-information.vue';
// import maintenanceRecordsCom from './components/maintenance-records.vue'
import driveRecordsCom from './components/drive-records.vue';

const activeKey = ref('test_drive_records');
</script>

<style lang="less" scoped>
.vehicle-detail {
    width: 100%;
    font-family: PingFang SC;
    .d-top {
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 6px;
        border: 1px solid #e7e9f0;
        background: #fff;
        .title {
            color: var(--color-text-5, #1d2129);
            font-size: 18px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            margin-bottom: 16px;
        }
        .container {
            display: flex;
            .d-img {
                .img {
                    margin-right: 20px;
                    width: 240px;
                    height: 160px;
                    object-fit: cover;
                }
            }
            .d-content {
                .all-msg {
                    .fcc(space-between);
                    .vehicle-msg {
                        color: #1d2129;
                        font-size: 16px;
                        font-weight: 600;
                        letter-spacing: 0.167px;
                        .use {
                            display: inline-block;
                            padding: 1px 6px;
                            border-radius: 2px;
                            background: rgba(255, 125, 0, 0.1);
                            font-weight: 600;
                            font-size: 12px;
                            color: #ff7d00;
                            margin-left: 12px;
                        }
                        .test-drive {
                            margin-left: 8px;
                            display: inline-block;
                            padding: 1px 6px;
                            border-radius: 2px;
                            background: rgba(255, 125, 0, 0.1);
                            font-weight: 600;
                            font-size: 12px;
                            color: #44cb7c;
                        }
                    }
                    .vehicle-id {
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: normal;
                        .key {
                            color: #86909c;
                        }
                        .value {
                            color: #1d2129;
                        }
                    }
                }
            }
        }
    }
    .d-bottom {
        min-height: 260px;
        margin-top: 20px;
        padding: 0 20px;
        box-sizing: border-box;
        border-radius: 6px;
        border: 1px solid #e7e9f0;
        background: #fff;
    }
}

.m-t-16 {
    margin-top: 16px;
}
</style>
