<template>
    <div class="vehicle-information">
        <a-row class="row-detail m-t-16">
            <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                <span class="key">{{ $t("retail.license_plate_number") }}：</span>
                <span class="value"> 你好 </span>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                <span class="key">{{ $t("retail.frame_code") }}：</span>
                <span class="value"> 你好 </span>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                <span class="key">{{ $t("retail.motor_coding") }}：</span>
                <span class="value"> 你好 </span>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                <span class="key">{{ $t("retail.last_maintenance") }}：</span>
                <span class="value"> 你好 </span>
            </a-col>        
            <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item m-t-20">
                <span class="key">{{ $t("retail.service_interval") }}：</span>
                <span class="value"> 你好 </span>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item m-t-20">
                <span class="key">{{ $t("retail.next_maintenance") }}：</span>
                <span class="value"> 你好 </span>
            </a-col>
        </a-row>
    </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
.vehicle-information {
}
.row-detail {
    .row-item {
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        .key {
            display: inline-block;
            color: #86909C;   
            width: 100px; 
            text-align: right;
        }
        .value {
            color: #1d2129;
        }
    }
}
.m-t-20 {
    margin-top: 20px;
}
</style>
