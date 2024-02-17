<template>
    <div class="vehicle-information">
        <a-row class="row-detail">
            <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                <span class="key key-form-86909C">{{ $t('retail.license_plate_number') }}：</span>
                <span class="value"> 你好 </span>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                <span class="key key-form-86909C">{{ $t('retail.frame_code') }}：</span>
                <span class="value"> 你好 </span>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                <span class="key key-form-86909C">{{ $t('retail.motor_coding') }}：</span>
                <span class="value"> 你好 </span>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                <span class="key key-form-86909C">{{ $t('retail.last_maintenance') }}：</span>
                <span class="value"> 你好 </span>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                <span class="key key-form-86909C">{{ $t('retail.service_interval') }}：</span>
                <span class="value"> 你好 </span>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="6" :xxl="6" class="row-item">
                <span class="key key-form-86909C">{{ $t('retail.next_maintenance') }}：</span>
                <span class="value"> 你好 </span>
            </a-col>
        </a-row>
    </div>
</template>

<script setup></script>

<style lang="less" scoped>
.m-t-20 {
    margin-top: 20px;
}
</style>
