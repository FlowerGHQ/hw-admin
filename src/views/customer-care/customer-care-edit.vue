<template>
<div id="customer-care-edit" class="edit-container">
    <div class="title-container">
        <div class="title-area">{{ true ? $t('customer-care.modify_inquiry_form') : $t('customer-care.create_inquiry_form') }}</div>
    </div>
    <!-- 问询单类型 -->
    <div class="form-block">
        <div class="form-title"><div class="title">{{ $t('fe.feedback_content') }}</div></div>
        <div class="form-content">
            <div class="horizontal-search-row">
                <div class="search-col">
                    <div class="key">
                        <!-- 选择模板 -->
                        {{ $t('mail-management.select_template') }}
                    </div>
                    <div class="value">
                        <div class="bg-template cursor">
                            {{  $t('mail-management.sales_template') }}
                        </div>
                    </div>
                </div>
            </div>
            <!-- <a-radio-group v-model:value="value">
                <a-radio :style="radioStyle" :value="1">Option A</a-radio>
                <a-radio :style="radioStyle" :value="2">Option B</a-radio>
                <a-radio :style="radioStyle" :value="3">Option C</a-radio>
            </a-radio-group> -->
        </div>
    </div>
    <!-- 问题描述 -->
    <div class="form-block">
        <div class="form-title"><div class="title">{{ $t('fe.feedback_content') }}</div></div>
        <div class="form-content">
            <a-radio-group v-model:value="value">
                <a-radio :style="radioStyle" :value="1">Option A</a-radio>
                <a-radio :style="radioStyle" :value="2">Option B</a-radio>
                <a-radio :style="radioStyle" :value="3">Option C</a-radio>
            </a-radio-group>
        </div>
    </div>
    <!-- <div class="form-btns">
        <a-button @click="routerChange('back')">{{ $t('def.cancel') }}</a-button>
        <a-button @click="handleSubmit" type="primary" v-if="$auth('repair-order.save')">{{ $t('def.sure') }}</a-button>
    </div> -->
</div>
</template>

<script setup>
import Core from '../../core';
import dayjs from 'dayjs';
</script>

<style lang="less">
#customer-care-edit {
    height: 100%;
}
</style>
